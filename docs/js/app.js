import {
  MAINTAINER_EMAIL,
  GITHUB_NEW_ISSUE_BASE_URL,
  VALIDATION_RULES,
} from "./config.js";
import { mountGate } from "./gate.js";
import { validateDataset } from "./validation.js";

let loadedDictionary = {};

function parseFile(file) {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".csv") || name.endsWith(".txt")) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: false,
        complete: (res) => {
          const data = res.data.filter(
            (row) => !(row.length === 0 || (row.length === 1 && row[0] === ""))
          );
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
  document.getElementById("file-name").textContent = file.name;
  const { headers, rows } = await parseFile(file);
  const result = validateDataset(headers, rows, VALIDATION_RULES, loadedDictionary);
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

  const base = file.name.replace(/\.[^.]+$/, "");

  document.getElementById("btn-csv").onclick = () => {
    downloadBlob(csvBlob(result.headers, result.cleanedRows), `cleaned_${base}.csv`);
  };
  document.getElementById("btn-json").onclick = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `report_${base}.json`);
  };
  document.getElementById("btn-zip").onclick = async () => {
    const zip = new JSZip();
    const csv = csvBlob(result.headers, result.cleanedRows);
    zip.file(`cleaned_${base}.csv`, csv);
    zip.file(`report_${base}.json`, JSON.stringify(report, null, 2));
    const zblob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zblob, `submission_${base}.zip`);
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
