# Ethigov website

Static multi-page site (HTML, Tailwind via CDN, vanilla JS).

Pages: `index.html`, `research-output.html`, `team.html`, `calls.html`, `news.html`, `resources.html`, `join.html`.

## Edit content
- `data.js`: contact email, team, calls for papers, news and events, resources. Add `joinFormUrl` or `newsletterUrl` to show an online form button.
- `research-output.html`: published works list.
- `site.js`: page behaviour. `styles.css`: custom styles.

## Run locally
`npx serve -l 3000 .` then open http://localhost:3000

