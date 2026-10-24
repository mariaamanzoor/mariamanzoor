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
