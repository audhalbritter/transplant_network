/**
 * @typedef {{ code: string, message: string, row?: number, column?: string }} Issue
 */

function normCase(value, mode) {
  if (mode === "lower") return String(value).toLowerCase();
  return String(value);
}

function isEmptyCell(v) {
  return v === undefined || v === null || String(v).trim() === "";
}

function padRows(rows, width) {
  return rows.map((r) => {
    const copy = Array.isArray(r) ? [...r] : [];
    while (copy.length < width) copy.push("");
    return copy.slice(0, width);
  });
}

/**
 * @param {string[]} headers
 * @param {string[][]} rows  data rows only
 * @param {object} rules from config
 * @param {object} dictionary loaded JSON
 */
export function validateDataset(headers, rows, rules, dictionary) {
  /** @type {Issue[]} */
  const blocking = [];
  /** @type {Issue[]} */
  const warnings = [];
  const cleaning = [];

  const headerTrimmed = headers.map((h) => String(h).trim());
  const seen = new Map();
  headerTrimmed.forEach((h) => {
    const n = (seen.get(h) || 0) + 1;
    seen.set(h, n);
    if (n === 2) {
      blocking.push({
        code: "DUP_HEADER",
        message: `Duplicate column name "${h}".`,
        column: h,
      });
    }
  });

  for (const col of rules.requiredColumns) {
    if (!headerTrimmed.includes(col)) {
      blocking.push({
        code: "MISSING_COLUMN",
        message: `Missing required column "${col}".`,
        column: col,
      });
    }
  }

  const width = headerTrimmed.length;
  let cleaned = padRows(rows, width);

  const nRows = cleaned.length;
  if (nRows < rules.rowCountMin) {
    blocking.push({
      code: "ROW_COUNT",
      message: `Too few data rows (${nRows}; minimum ${rules.rowCountMin}).`,
    });
  }
  if (nRows > rules.rowCountMax) {
    blocking.push({
      code: "ROW_COUNT",
      message: `Too many data rows (${nRows}; maximum ${rules.rowCountMax}).`,
    });
  }

  const colIndex = Object.fromEntries(headerTrimmed.map((h, i) => [h, i]));

  // Trim trailing empty rows
  let lastNonEmpty = cleaned.length - 1;
  while (lastNonEmpty >= 0) {
    const r = cleaned[lastNonEmpty];
    if (r.every((c) => isEmptyCell(c))) lastNonEmpty--;
    else break;
  }
  if (lastNonEmpty < cleaned.length - 1) {
    const removed = cleaned.length - 1 - lastNonEmpty;
    cleaned = cleaned.slice(0, lastNonEmpty + 1);
    warnings.push({
      code: "TRIM_EMPTY_ROWS",
      message: `Removed ${removed} trailing empty row(s).`,
    });
  }

  // Whitespace trim (strings)
  cleaned = cleaned.map((row, ri) => {
    return row.map((cell, ci) => {
      const h = headerTrimmed[ci];
      const t = rules.columnTypes[h];
      if (t !== "string" || isEmptyCell(cell)) return cell;
      const s = String(cell);
      const t2 = s.trim();
      if (t2 !== s) {
        cleaning.push({
          code: "TRIM_WS",
          message: `Trimmed whitespace`,
          row: ri + 1,
          column: h,
        });
        return t2;
      }
      return cell;
    });
  });

  const opt = new Set(rules.optionalColumns || []);

  for (let ri = 0; ri < cleaned.length; ri++) {
    const row = cleaned[ri];
    const rnum = ri + 1;

    for (const col of rules.requiredColumns) {
      const j = colIndex[col];
      if (j === undefined) continue;
      const v = row[j];
      if (isEmptyCell(v) && !opt.has(col)) {
        blocking.push({
          code: "EMPTY_REQUIRED",
          message: `Empty required cell`,
          row: rnum,
          column: col,
        });
      }
    }

    for (const [col, type] of Object.entries(rules.columnTypes || {})) {
      const j = colIndex[col];
      if (j === undefined) continue;
      const raw = row[j];
      if (isEmptyCell(raw) && opt.has(col)) continue;
      if (isEmptyCell(raw)) continue;

      if (type === "string") {
        /* ok */
      } else if (type === "number") {
        const n = Number(String(raw).replace(",", "."));
        if (!Number.isFinite(n)) {
          blocking.push({
            code: "TYPE_NUMBER",
            message: `Not a valid number: "${raw}"`,
            row: rnum,
            column: col,
          });
        } else {
          const rr = rules.columnRanges?.[col];
          if (rr) {
            if (n < rr.min || n > rr.max) {
              blocking.push({
                code: "RANGE",
                message: `Out of range [${rr.min}, ${rr.max}]: ${n}`,
                row: rnum,
                column: col,
              });
            }
          }
        }
      } else if (type === "integer") {
        const n = Number(String(raw).replace(",", "."));
        if (!Number.isFinite(n) || !Number.isInteger(n)) {
          blocking.push({
            code: "TYPE_INT",
            message: `Not an integer: "${raw}"`,
            row: rnum,
            column: col,
          });
        }
      } else if (type === "date") {
        const d = Date.parse(String(raw));
        if (Number.isNaN(d)) {
          blocking.push({
            code: "TYPE_DATE",
            message: `Not a parseable date: "${raw}"`,
            row: rnum,
            column: col,
          });
        }
      } else if (type === "boolean") {
        const s = String(raw).trim().toLowerCase();
        if (!["true", "false", "0", "1", "yes", "no"].includes(s)) {
          blocking.push({
            code: "TYPE_BOOL",
            message: `Not a boolean: "${raw}"`,
            row: rnum,
            column: col,
          });
        }
      }
    }

    for (const [col, dictKey] of Object.entries(rules.dictionaryColumns || {})) {
      const allowed = dictionary?.[dictKey];
      if (!Array.isArray(allowed) || allowed.length === 0) continue;
      const j = colIndex[col];
      if (j === undefined || isEmptyCell(row[j])) continue;
      const raw = row[j];
      const set = new Set(
        allowed.map((x) => normCase(String(x).trim(), rules.dictionaryCase))
      );
      const val =
        typeof raw === "string"
          ? normCase(raw.trim(), rules.dictionaryCase)
          : normCase(raw, rules.dictionaryCase);
      if (!set.has(val)) {
        blocking.push({
          code: "DICT",
          message: `"${raw}" is not allowed for "${col}" (${dictKey}).`,
          row: rnum,
          column: col,
        });
      }
    }
  }

  const pk = rules.primaryKeyColumns || [];
  if (pk.length && pk.every((c) => colIndex[c] !== undefined)) {
    const seenKey = new Map();
    cleaned.forEach((row, ri) => {
      const key = pk.map((c) => String(row[colIndex[c]] ?? "").trim()).join("\t");
      if (key.split("\t").every((x) => x === "")) return;
      if (seenKey.has(key)) {
        blocking.push({
          code: "DUP_KEY",
          message: `Duplicate key (${pk.join(", ")}): ${key.replace(/\t/g, " | ")}`,
          row: ri + 1,
        });
      } else seenKey.set(key, ri + 1);
    });
  }

  const pol = rules.duplicateRowPolicy || "ignore";
  if (pol !== "ignore") {
    const seenRow = new Map();
    cleaned.forEach((row, ri) => {
      const sig = row.map((c) => String(c ?? "").trim()).join("\t");
      if (seenRow.has(sig)) {
        const issue = {
          code: "DUP_ROW",
          message: `Duplicate data row (same as row ${seenRow.get(sig)})`,
          row: ri + 1,
        };
        if (pol === "error") blocking.push(issue);
        else warnings.push(issue);
      } else seenRow.set(sig, ri + 1);
    });
  }

  const ws = cleaning.filter((c) => c.code === "TRIM_WS");
  if (ws.length) {
    warnings.push({
      code: "TRIM_WS_SUM",
      message: `Whitespace trimmed in ${ws.length} cell(s).`,
    });
  }

  return { blocking, warnings, cleaning, cleanedRows: cleaned, headers: headerTrimmed };
}
