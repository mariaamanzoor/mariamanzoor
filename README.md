# Maria Manzoor — Portfolio Website

A fast, responsive, accessible portfolio built with plain **HTML, CSS and JavaScript** (no build step, no dependencies).

## Folder structure

```
maria-portfolio/
├── index.html                  # All page content
├── css/style.css               # Styling, dark/light theme, responsive layout
├── js/main.js                  # Theme toggle, mobile menu, animations, contact form
├── assets/
│   ├── favicon.svg
│   ├── profile.jpg             # Hero photo (swap for any image with the same name)
│   └── Maria-Manzoor-CV.pdf    # CV download (replace to update)
├── .devcontainer/devcontainer.json   # GitHub Codespaces setup
├── .github/workflows/deploy.yml      # Auto-deploy to GitHub Pages
├── package.json
└── README.md
```

## 1. Open in GitHub Codespaces

1. Create a new repository on GitHub (e.g. `portfolio`) and upload all of these files (drag and drop works), or push them with git.
2. Click **Code → Codespaces → Create codespace on main**.
3. The site starts automatically on port **3000** (or run `npm start`). Open the forwarded port to preview.

## 2. Your CV and photo

Both are already included in `assets/`. To update them, replace `Maria-Manzoor-CV.pdf` or `profile.jpg` keeping the same file names.

## 3. Publish

**Option A — GitHub Pages (free, included):**
Repo → **Settings → Pages → Source: GitHub Actions**. Push to `main` and the workflow publishes your site at `https://<your-username>.github.io/<repo-name>/`.

**Option B — Readdy / Netlify / Vercel / Cloudflare Pages:**
Import the GitHub repo. There's no build command; set the publish directory to the repo root (`/`).

## Customise

- **Text and links:** edit `index.html`.
- **Colours:** change the variables at the top of `css/style.css` (`--primary`, `--accent`, ...).
- **Contact form:** it opens the visitor's email app (no backend needed). To receive messages directly, swap it for a Formspree/Web3Forms endpoint.
- **Links:** company, store, LinkedIn and IEEE links are in `index.html`; search for `href=` to change any.

Built from the CV of Maria Manzoor.
