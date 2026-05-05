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
