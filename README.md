# Maria Manzoor — Portfolio

Static portfolio site (HTML/CSS/JS, no build step). Profile card + tabbed layout, dark/gold theme with light mode, Ctrl/⌘+K command palette, project filters and detail dialogs.

## Run locally / in Codespaces
    npm start        # serves on http://localhost:3000
    # or: python3 -m http.server 3000

## Publish (GitHub Pages)
    git add -A
    git commit -m "New portfolio design"
    git push origin main
Then in GitHub: Settings > Pages > Source: GitHub Actions. The workflow in `.github/workflows/deploy.yml` deploys on every push.

## Edit content
Everything lives in `index.html`. Styles: `css/style.css`. Behaviour: `js/main.js`. Photo and CV: `assets/`.

## Certificates
Images live in `assets/certificates/`. To add one: copy the image there, then duplicate a `<li class="cert">` block in the Certificates section of `index.html` (set `data-c`, `data-full`, the image path, title, issuer and date).

## Contact form
The form sends through FormSubmit (formsubmit.co) to mariamanzoordc@gmail.com, with no server needed.
First-time setup: after the site is live, send one test message from the form. FormSubmit emails you an activation link; click it once. After that every message arrives in your inbox. If the quick send fails, the form automatically retries with a normal form post to FormSubmit.
