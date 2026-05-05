# transplant_network

Minimal **GitHub Pages** site under [`docs/`](docs/) with a **password-gated data portal** (client-side validation only).

## Enable GitHub Pages

Repository **Settings → Pages → Build and deployment → Deploy from a branch** → choose your default branch and folder **`/docs`**, then **Save**.

The empty file **`docs/.nojekyll`** turns off Jekyll so GitHub publishes your static HTML/JS/CSS directly. Without it, Pages runs Jekyll + a theme and can fail while building files like `assets/css/style.scss`.

## Site layout (`docs/`)

- `docs/index.html` — public landing
- `docs/portal.html` — gated uploads and validation
- `docs/js/config.js` — gate hash, maintainer email, optional GitHub new-issue URL, `VALIDATION_RULES`
- `docs/js/*.js` — gate, validation, app wiring
- `docs/data/dictionary.json` — allowed values (optional until populated)
- `docs/fixtures/sample_valid.csv` — example file for local testing
- `docs/.nojekyll` — disable Jekyll for static publishing

The same snippets are archived in [`PHASE1_SCAFFOLD.md`](PHASE1_SCAFFOLD.md). After unlocking the portal (default passphrase **`changeme`**), try uploading `docs/fixtures/sample_valid.csv`.

## Passphrase gate

Default development hash in `config.js` corresponds to password **`changeme`**. Replace **`GATE_PASSWORD_SHA256_HEX`** before real use:

```bash
printf 'your-shared-secret' | shasum -a 256
```

## Maintainer handoff

After a successful validation, the portal offers **download cleaned CSV**, **`report.json`**, optional **ZIP**, **email instructions** (`MAINTAINER_EMAIL`), and an optional **“Open GitHub issue”** link built from `GITHUB_NEW_ISSUE_BASE_URL` (draft body only—user still **attaches** files in GitHub’s UI).

See [implementation_plan.md](implementation_plan.md) §5–5.1.

## Dictionaries

Edit `docs/data/dictionary.json`. If a list is **empty** or missing, vocabulary checks for that key are **skipped** until you populate it.

## Next steps

- Tune `VALIDATION_RULES` in `docs/js/config.js`.
- Populate `dictionary.json` and tighten blocking vs warning behaviour in `validation.js`.
