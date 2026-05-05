# transplant_network

Minimal **GitHub Pages** site under [`docs/`](docs/) with a **password-gated data portal** (client-side validation only).

## Enable GitHub Pages

Repository **Settings → Pages → Build and deployment → Deploy from a branch** → choose your default branch and folder **`/docs`**, then **Save**.

The empty file **`docs/.nojekyll`** turns off Jekyll so GitHub publishes your static HTML/JS/CSS directly. Without it, Pages runs Jekyll + a theme and can fail while building files like `assets/css/style.scss`.

## Site layout (`docs/`)

- `docs/index.html` — Home
- `docs/images/` — static images for the site (e.g. hero photo). The home hero uses **`DJI_0126-web.jpg`** (~640 px wide) for faster loads; **`DJI_0126.jpg`** is the full-resolution original (~3000 px) if you need it offline.

### Home page image sizing

- **Small inline photo** (like the current home layout): export about **600–900 px** wide; JPEG **~100–300 KB** is plenty. The CSS shows it at **~280 px** wide, so **640 px** source is enough for sharp “retina”.
- **Half-width hero**: about **1200–1600 px** wide if it should look very sharp at ~600 px on screen.
- **Full-bleed banner**: about **1600–2000 px**; you almost never need **3000 px+** for web.

Use JPEG quality roughly **75–85%**. The site uses **`DJI_0126-web.jpg`** (~640 px, small file) on the home page; **`DJI_0126.jpg`** is the original. To rebuild the web copy after changing the original:

`sips --resampleWidth 640 docs/images/DJI_0126.jpg --out docs/images/DJI_0126-web.jpg`

Then keep **`src="./images/DJI_0126-web.jpg"`** in `docs/index.html` (update `width` / `height` to match output).
- `docs/about.html`, `docs/publications.html`, `docs/contact.html` — public pages
- `docs/data-submission.html` — passphrase-gated upload and validation
- `docs/portal.html` — redirects to `data-submission.html` (old bookmarks)
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
