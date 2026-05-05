# Phase 1 scaffold (copy into `docs/`)

Create the paths below under the repository root. Then enable GitHub Pages from **`/docs`**.

> **Note:** If you use Cursor Agent mode, ask it to “apply `PHASE1_SCAFFOLD.md` into the `docs/` tree” instead of copying by hand.

CDN scripts (in `portal.html`): **Papa Parse** (CSV), **SheetJS** (`xlsx`), **JSZip**.

---

## `docs/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Transplant network</title>
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body>
  <div class="wrap">
    <header class="site-header">
      <h1>Transplant network</h1>
      <p>Project landing — replace with consortium text, publications, and contacts.</p>
    </header>
    <main>
      <section class="card">
        <h2>About</h2>
        <p>
          Static site on GitHub Pages. The <strong>data portal</strong> is a separate page
          for validated member submissions (see repository README).
        </p>
        <p><a class="btn btn-ghost" href="./portal.html">Open data portal</a></p>
      </section>
    </main>
    <footer class="site-footer">
      <p>Edit <code>docs/index.html</code> for public content.</p>
    </footer>
  </div>
</body>
</html>
```

---

## `docs/portal.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Data portal — Transplant network</title>
  <link rel="stylesheet" href="./css/style.css" />
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
</head>
<body>
  <div class="wrap">
    <header class="site-header">
      <p><a href="./index.html">&larr; Back to project page</a></p>
      <h1>Member data portal</h1>
      <p>Upload CSV or Excel. Validation runs in your browser; nothing is sent to a server.</p>
    </header>

    <section class="card" id="gate-card">
      <h2>Members</h2>
      <p style="color: var(--muted); font-size: 0.92rem">Shared passphrase (session only).</p>
      <form id="gate-form" class="gate-form">
        <label for="pw">Passphrase</label><br />
        <input id="pw" type="password" autocomplete="current-password" required />
        <button type="submit" class="btn">Unlock</button>
        <p id="gate-error" style="color: var(--danger); min-height: 1.25rem"></p>
      </form>
    </section>

    <div id="portal-body" class="hidden">
      <section class="card">
        <h2>1. Upload</h2>
        <div id="dropzone" class="dropzone">
          <input type="file" id="file-input" accept=".csv,.txt,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
          <p>Drag a file here or <strong>click to choose</strong>.</p>
          <p style="font-size: 0.8rem">CSV (UTF-8) or Excel (.xlsx).</p>
        </div>
        <p id="file-name" style="color: var(--muted); margin-top: 0.75rem"></p>
      </section>

      <section class="card">
        <h2>2. Results</h2>
        <p id="status-line"></p>
        <div id="blocking-wrap" class="hidden">
          <h3 style="font-size: 0.95rem; color: var(--danger)">Blocking</h3>
          <ul id="blocking-list" class="message-list"></ul>
        </div>
        <div id="warn-wrap" class="hidden" style="margin-top: 1rem">
          <h3 style="font-size: 0.95rem; color: var(--warn)">Warnings</h3>
          <ul id="warn-list" class="message-list"></ul>
        </div>
      </section>

      <section class="card hidden" id="handoff-card">
        <h2>3. Send to maintainers</h2>
        <p style="color: var(--muted); font-size: 0.9rem">
          Download the cleaned file and report, then email them (or open a draft GitHub issue).
        </p>
        <p>
          <button type="button" class="btn" id="btn-csv">Download cleaned CSV</button>
          <button type="button" class="btn btn-secondary" id="btn-json">Download report (JSON)</button>
          <button type="button" class="btn btn-secondary" id="btn-zip">Download ZIP (both)</button>
        </p>
        <p>
          <button type="button" class="btn btn-ghost" id="btn-mailto">Open email draft</button>
          <button type="button" class="btn btn-ghost" id="btn-copy-instr">Copy email instructions</button>
          <a class="btn btn-ghost hidden" id="btn-issue" href="#" target="_blank" rel="noopener">Open GitHub issue draft</a>
        </p>
        <pre id="instr-preview" class="instructions hidden" style="margin-top: 1rem"></pre>
      </section>
    </div>

    <footer class="site-footer">
      <p>Edit rules in <code>docs/js/config.js</code>; dictionaries in <code>docs/data/dictionary.json</code>.</p>
    </footer>
  </div>

  <script type="module" src="./js/app.js"></script>
</body>
</html>
```

---

## `docs/css/style.css`

Same styles as drafted in-repo; if missing, create from the following.

```css
:root {
  --bg: #0f172a;
  --surface: #1e293b;
  --muted: #94a3b8;
  --text: #f1f5f9;
  --accent: #14b8a6;
  --danger: #f87171;
  --warn: #fbbf24;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}
a { color: var(--accent); }
.wrap { max-width: 52rem; margin: 0 auto; padding: 2rem 1.25rem; }
.site-header {
  border-bottom: 1px solid #334155;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}
.site-header h1 { margin: 0 0 0.35rem; font-size: 1.65rem; font-weight: 650; }
.site-header p { margin: 0; color: var(--muted); font-size: 0.95rem; }
.card {
  background: var(--surface);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
  border: 1px solid #334155;
}
.card h2 { margin: 0 0 0.75rem; font-size: 1.1rem; font-weight: 600; }
.dropzone {
  border: 2px dashed #475569;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: var(--muted);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.dropzone:hover, .dropzone.dragover {
  border-color: var(--accent);
  background: rgba(20, 184, 166, 0.06);
}
.dropzone input[type="file"] { display: none; }
.btn {
  display: inline-block;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  background: var(--accent);
  color: #042f2e;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-secondary { background: #334155; color: var(--text); margin-left: 0.5rem; }
.btn-ghost { background: transparent; color: var(--accent); border: 1px solid #475569; }
.message-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 16rem;
  overflow: auto;
  font-size: 0.88rem;
}
.message-list li {
  padding: 0.35rem 0;
  border-bottom: 1px solid #334155;
}
.message-list li.blocking { color: var(--danger); }
.message-list li.warning { color: var(--warn); }
.gate-form input[type="password"] {
  width: 100%;
  max-width: 20rem;
  padding: 0.5rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #475569;
  background: var(--bg);
  color: var(--text);
  margin: 0.5rem 0 1rem;
}
.instructions {
  font-size: 0.88rem;
  color: var(--muted);
  white-space: pre-wrap;
}
.hidden { display: none !important; }
.site-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #334155;
  font-size: 0.85rem;
  color: var(--muted);
}
```

---

## `docs/js/config.js`

(Hash below = SHA-256 of `changeme`.)

```javascript
export const GATE_PASSWORD_SHA256_HEX =
  "057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86";

export const MAINTAINER_EMAIL = "maintainers@example.org";

/** Empty string hides the GitHub draft-issue button */
export const GITHUB_NEW_ISSUE_BASE_URL =
  ""; // e.g. "https://github.com/myorg/transplant_network/issues/new"

export const VALIDATION_RULES = {
  requiredColumns: ["site_id", "plot_id", "species", "cover"],
  optionalColumns: [],
  rowCountMin: 1,
  rowCountMax: 500_000,
  columnTypes: {
    site_id: "string",
    plot_id: "string",
    species: "string",
    cover: "number",
  },
  columnRanges: {
    cover: { min: 0, max: 100 },
  },
  primaryKeyColumns: ["site_id", "plot_id", "species"],
  duplicateRowPolicy: "warning",
  dictionaryColumns: {
    site_id: "sites",
  },
  dictionaryCase: "exact",
};
```

---

## `docs/js/crypto-utils.js`

```javascript
export async function sha256HexUtf8(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
```

---

## `docs/js/gate.js`

```javascript
import { GATE_PASSWORD_SHA256_HEX } from "./config.js";
import { sha256HexUtf8 } from "./crypto-utils.js";

const SESSION_KEY = "transplant_portal_ok";

export function isGateUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function unlockGate() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export async function verifyPassword(candidate) {
  const hex = await sha256HexUtf8(candidate);
  return hex.toLowerCase() === GATE_PASSWORD_SHA256_HEX.toLowerCase();
}

export function mountGate({ formEl, errorEl, onSuccess }) {
  if (isGateUnlocked()) {
    formEl.closest(".card")?.classList.add("hidden");
    onSuccess();
    return;
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    const input = formEl.querySelector('input[type="password"]');
    const ok = await verifyPassword(input.value);
    if (!ok) {
      errorEl.textContent = "Incorrect passphrase.";
      return;
    }
    unlockGate();
    formEl.closest(".card")?.classList.add("hidden");
    onSuccess();
  });
}
```

---

## `docs/js/validation.js`

```javascript
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
  headerTrimmed.forEach((h, i) => {
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

  const nRows = rows.length;
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

  let cleaned = rows.map((r) => [...r]);

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
          const r = rules.columnRanges?.[col];
          if (r) {
            if (n < r.min || n > r.max) {
              blocking.push({
                code: "RANGE",
                message: `Out of range [${r.min}, ${r.max}]: ${n}`,
                row: rnum,
                column: col,
              });
            }
          }
        }
      } else if (type === "integer") {
        const n = Number(String(raw).replace(",", "."));
        if (!Number.isInteger(n)) {
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

    // Dictionary
    for (const [col, dictKey] of Object.entries(rules.dictionaryColumns || {})) {
      const allowed = dictionary?.[dictKey];
      if (!Array.isArray(allowed) || allowed.length === 0) continue;
      const j = colIndex[col];
      if (j === undefined || isEmptyCell(row[j])) continue;
      const raw = row[j];
      const set = new Set(
        allowed.map((x) =>
          normCase(String(x).trim(), rules.dictionaryCase)
        )
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

  // Primary key uniqueness
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

  // Full duplicate rows
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

  // Collapse many TRIM_WS into one summary warning
  const ws = cleaning.filter((c) => c.code === "TRIM_WS");
  if (ws.length) {
    warnings.push({
      code: "TRIM_WS_SUM",
      message: `Whitespace trimmed in ${ws.length} cell(s).`,
    });
  }

  return { blocking, warnings, cleaning, cleanedRows: cleaned, headers: headerTrimmed };
}
```

---

## `docs/js/app.js`

```javascript
import {
  MAINTAINER_EMAIL,
  GITHUB_NEW_ISSUE_BASE_URL,
  VALIDATION_RULES,
} from "./config.js";
import { mountGate } from "./gate.js";
import { validateDataset } from "./validation.js";

let lastResult = null;
let lastFileName = "";
let loadedDictionary = {};

function parseFile(file) {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".csv") || name.endsWith(".txt")) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: false,
        complete: (res) => {
          const data = res.data.filter((row) => row.length > 1 || row[0] !== "");
          if (!data.length) return reject(new Error("Empty CSV"));
          const headers = data[0].map((c) => String(c));
          const rows = data.slice(1).map((r) => r.map((c) => c));
          resolve({ headers, rows });
        },
        error: reject,
      });
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: "array" });
          const sh = wb.SheetNames[0];
          const ws = wb.Sheets[sh];
          const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          if (!aoa.length) return reject(new Error("Empty sheet"));
          const headers = aoa[0].map((c) => String(c));
          const rows = aoa.slice(1).map((r) => r.map((c) => c));
          resolve({ headers, rows });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Read failed"));
      reader.readAsArrayBuffer(file);
    } else reject(new Error("Use .csv or .xlsx"));
  });
}

function buildReport(fileName, result) {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    originalFileName: fileName,
    rulesSnapshot: VALIDATION_RULES,
    blocking: result.blocking,
    warnings: result.warnings,
    cleaning: result.cleaning,
  };
}

function csvBlob(headers, rows) {
  const line = (r) =>
    r
      .map((c) => {
        const s = String(c ?? "");
        if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
      })
      .join(",");
  const body = [line(headers), ...rows.map(line)].join("\r\n");
  return new Blob([body], { type: "text/csv;charset=utf-8" });
}

function downloadBlob(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function emailInstructions(report) {
  return [
    `To: ${MAINTAINER_EMAIL}`,
    `Subject: Transplant network data submission — ${report.originalFileName}`,
    "",
    "Please attach:",
    "  1) The downloaded cleaned CSV",
    "  2) The validation report JSON",
    "",
    "Summary:",
    `  Blocking issues: ${report.blocking.length}`,
    `  Warnings: ${report.warnings.length}`,
    "",
    `Generated: ${report.generatedAt}`,
  ].join("\n");
}

function issueUrl(report) {
  const base = GITHUB_NEW_ISSUE_BASE_URL.replace(/\/$/, "");
  if (!base) return "";
  const title = encodeURIComponent(
    `Data submission: ${report.originalFileName}`
  );
  const bodyText = [
    "### Submission",
    `- File: \`${report.originalFileName}\``,
    `- Generated (UTC): ${report.generatedAt}`,
    `- Blocking: ${report.blocking.length} | Warnings: ${report.warnings.length}`,
    "",
    "### Maintainer checklist",
    "- [ ] Attach cleaned CSV",
    "- [ ] Attach report JSON",
    "- [ ] Review against consortium SOP",
    "",
    "_Full details are in the downloaded `report.json`._",
  ].join("\n");
  const body = encodeURIComponent(bodyText.slice(0, 6000));
  return `${base}?title=${title}&body=${body}`;
}

function showLists(blocking, warnings) {
  const bw = document.getElementById("blocking-wrap");
  const bl = document.getElementById("blocking-list");
  const ww = document.getElementById("warn-wrap");
  const wl = document.getElementById("warn-list");
  bl.innerHTML = "";
  wl.innerHTML = "";
  if (blocking.length) {
    bw.classList.remove("hidden");
    blocking.forEach((x) => {
      const li = document.createElement("li");
      li.className = "blocking";
      li.textContent = [x.row ? `Row ${x.row}` : "", x.column || "", x.message]
        .filter(Boolean)
        .join(" — ");
      bl.appendChild(li);
    });
  } else bw.classList.add("hidden");

  if (warnings.length) {
    ww.classList.remove("hidden");
    warnings.forEach((x) => {
      const li = document.createElement("li");
      li.className = "warning";
      li.textContent = [x.row ? `Row ${x.row}` : "", x.column || "", x.message]
        .filter(Boolean)
        .join(" — ");
      wl.appendChild(li);
    });
  } else ww.classList.add("hidden");
}

async function loadDictionary() {
  try {
    const r = await fetch("./data/dictionary.json", { cache: "no-store" });
    if (!r.ok) return {};
    return await r.json();
  } catch {
    return {};
  }
}

async function runFile(file) {
  lastFileName = file.name;
  document.getElementById("file-name").textContent = file.name;
  const { headers, rows } = await parseFile(file);
  const result = validateDataset(headers, rows, VALIDATION_RULES, loadedDictionary);
  lastResult = result;
  const report = buildReport(file.name, result);

  const status = document.getElementById("status-line");
  const handoff = document.getElementById("handoff-card");
  if (result.blocking.length) {
    status.innerHTML = `<span class="badge badge-fail">Blocking</span> Fix issues and upload again.`;
    handoff.classList.add("hidden");
  } else {
    status.innerHTML = `<span class="badge badge-ok">OK</span> Ready for handoff.`;
    handoff.classList.remove("hidden");
  }
  showLists(result.blocking, [...result.warnings]);

  document.getElementById("btn-csv").onclick = () => {
    downloadBlob(
      csvBlob(result.headers, result.cleanedRows),
      `cleaned_${file.name.replace(/\.[^.]+$/, "")}.csv`
    );
  };
  document.getElementById("btn-json").onclick = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    downloadBlob(
      blob,
      `report_${file.name.replace(/\.[^.]+$/, "")}.json`
    );
  };
  document.getElementById("btn-zip").onclick = async () => {
    const zip = new JSZip();
    zip.file(
      `cleaned_${file.name.replace(/\.[^.]+$/, "")}.csv`,
      csvBlob(result.headers, result.cleanedRows)
    );
    zip.file(
      `report_${file.name.replace(/\.[^.]+$/, "")}.json`,
      JSON.stringify(report, null, 2)
    );
    const zblob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zblob, `submission_${file.name.replace(/\.[^.]+$/, "")}.zip`);
  };

  const instr = emailInstructions(report);
  document.getElementById("btn-mailto").onclick = () => {
    const q = encodeURIComponent(instr.slice(0, 1800));
    window.location.href = `mailto:${MAINTAINER_EMAIL}?subject=${encodeURIComponent(
      `Data submission: ${file.name}`
    )}&body=${q}`;
  };
  document.getElementById("btn-copy-instr").onclick = async () => {
    await navigator.clipboard.writeText(instr);
    const pre = document.getElementById("instr-preview");
    pre.textContent = instr;
    pre.classList.remove("hidden");
  };

  const ib = document.getElementById("btn-issue");
  const iu = issueUrl(report);
  if (iu) {
    ib.href = iu;
    ib.classList.remove("hidden");
  } else {
    ib.classList.add("hidden");
  }
}

function wireDropzone() {
  const dz = document.getElementById("dropzone");
  const input = document.getElementById("file-input");

  dz.addEventListener("click", () => input.click());
  ["dragenter", "dragover"].forEach((ev) =>
    dz.addEventListener(ev, (e) => {
      e.preventDefault();
      dz.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dz.addEventListener(ev, (e) => {
      e.preventDefault();
      dz.classList.remove("dragover");
    })
  );
  dz.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files[0];
    if (f) runFile(f).catch((err) => alert(err.message || String(err)));
  });
  input.addEventListener("change", () => {
    const f = input.files?.[0];
    if (f) runFile(f).catch((err) => alert(err.message || String(err)));
  });
}

mountGate({
  formEl: document.getElementById("gate-form"),
  errorEl: document.getElementById("gate-error"),
  onSuccess: async () => {
    document.getElementById("portal-body").classList.remove("hidden");
    loadedDictionary = await loadDictionary();
    wireDropzone();
  },
});
```

---

## `docs/data/dictionary.json`

```json
{
  "_comment": "Put allowed vocabularies here. Empty arrays skip checks.",
  "sites": []
}
```

---

## Sanity check locally

Serve `docs/` with any static server (e.g. `npx serve docs`) — ES modules must be HTTP, not `file:`.
