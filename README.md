# Zoryana Auto Registration — Static Website

Static multi-page website (no build step) for **Zoryana Auto Registration**.

## Pages
- `index.html` — Home
- `services.html` — Services overview
- `dealers.html` — Dealer-focused services
- `fleet.html` — Fleet & commercial
- `about.html` — About
- `contact.html` — Contact form + business info

## Contact form webhook config
The contact form posts JSON to a webhook.

You can configure either:
1. `data-webhook-url` on the `<form>` in `contact.html`, or
2. `window.__ZORYANA_CONFIG__.webhookUrl` in `assets/config.js`

Example file:

```js
// assets/config.js
window.__ZORYANA_CONFIG__ = {
  webhookUrl: "https://hooks.zapier.com/hooks/catch/..."
};
```

If you use `assets/config.js`, include this before `assets/site.js` on `contact.html`.

## Run locally
```bash
cd zory-site
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Deploy to GitHub Pages (no build)
1. Push this folder to a GitHub repo.
2. In GitHub: **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main` (or `master`), folder: `/ (root)`.
5. Save.

A `.nojekyll` file is included so Pages serves raw static files directly.

## Compliance disclaimer
A standardized DMV disclaimer is shown on all pages:
- DMV fees/requirements/processing times are set by the California DMV
- service fees are separate
- submissions are subject to DMV approval

DMV listing:
https://www.dmv.ca.gov/portal/business-partner/zoryana-auto-registration-inc/