# IRTH — the website

Dates, coffee, scent, prayer pieces and apothecary from Madinah Al Munawwarah.
This is the dark version of the site (Irth 01), exported as a static build that
runs anywhere a folder of files can be served.

Build `20261004-181221`. The build id is in `<meta name="irth-build">` and in
`window.IRTH_BUILD`, so you can always tell which copy a browser is showing.

---

## Putting it on GitHub Pages

1. Commit the `docs/` folder to the default branch of your repository.
2. **Settings → Pages → Build and deployment**
   - Source: *Deploy from a branch*
   - Branch: your default branch, folder: **`/docs`**
3. Save. The site is live at `https://<user>.github.io/<repo>/` within a minute
   or two.

Nothing else is needed — no build step, no Node, no package install. Every path
in the site is relative, so it works just as happily in a project subfolder
(`/<repo>/`) as at a domain root.

To preview it locally before you push:

```bash
cd docs
python3 -m http.server 8000
# then open http://localhost:8000
```

Open `index.html` straight off disk and it mostly works too, but use the server
if you want it to behave exactly as it will once deployed.

### A custom domain

Add a file called `CNAME` inside `docs/`, containing nothing but the domain:

```
irth.com
```

Then point the domain's DNS at GitHub Pages and turn on *Enforce HTTPS* in the
Pages settings.

---

## What is in `docs/`

```
docs/
  index.html              the whole site: markup, styles, and the template
  app.<hash>.js           the site logic — state, cart, filters, forms
  runtime.<hash>.js       the small renderer that binds the two together
  assets/                 29 photographs, the logo, the paper grain
  favicon.ico             the IRTH mark, cropped off the wordmark
  favicon.png
  apple-touch-icon.png
  404.html                a copy of index.html (see below)
  .nojekyll               stops GitHub running the files through Jekyll
```

`app.*.js` and `runtime.*.js` carry a content hash in the filename, so when you
redeploy, a browser can never serve a stale copy of the logic against fresh
markup. The names change on every meaningful edit; `index.html` always points at
the current pair.

**`.nojekyll` matters.** Without it GitHub runs the folder through Jekyll, which
skips files and folders beginning with an underscore. Keep the file, even though
it is empty.

**`404.html`** is a copy of the site. The whole thing is one page driven by
internal state, so there are no other real URLs — but if someone follows a stale
or mistyped link, this lands them on IRTH rather than on GitHub's error page.

---

## How the site is put together

One page, twelve screens, all of it client-side.

`index.html` holds every screen inside a `<template>`, each one wrapped in a
condition (`isHome`, `isStore`, `isProduct`, …). `runtime.js` renders the
template against a plain state object; `app.js` is that state and the functions
that change it. Clicking "Store" does not fetch anything — it sets `page` to
`'store'` and the page re-renders.

That means:

- **No routing.** There is one URL. The back button does not move between
  screens. If you later want shareable links per product, that is a router on
  top of the existing `page`/`pid` state, not a rewrite.
- **No server.** The catalogue (16 pieces, six houses), the bag, the wishlist,
  promo codes, delivery pricing and the order confirmation all live in the
  browser for the length of a visit. Reload and you start fresh.
- **No tracking, no cookies, no third-party scripts.**

### What is wired and working

Everything that looks clickable is clickable. The flows that carry state:

| | |
|---|---|
| Store | house rail, three tabs, availability / house / price filters, text filter, four sorts, load more, counts that follow the result |
| Product | three sizes that each reprice the piece, quantity, add to bag, buy it now, wishlist, a column of photographs with the buying side held, accordions |
| Bag | per-line quantity, remove, subtotal, lines for pieces, gift boxes and gift cards alike |
| Gift box | three boxes with real capacities, fill and empty, a running total, into the bag as one line |
| Gift card | four amounts plus any amount you type, three delivery options (printed and posted adds EGP 60), a live preview, into the bag |
| Checkout | renders the real bag, promo codes `MADINAH10` / `IRTH10`, delivery free over EGP 1,500, three delivery methods, place order |
| Order | a snapshot of what was actually ordered |
| Account | orders, addresses with removal, saved details |
| Also | search, quick view, wishlist, contact form with validation, the legal panel, the footer sign-up, and a 404 screen |

93 automated checks cover these — the shopper journey, every filter and sort,
the gift builder's capacity rules, the checkout arithmetic, nav and dropdown
behaviour — plus a WCAG AA contrast audit across all twelve screens.

### Colour and type

| | |
|---|---|
| Ground | `#262524` charcoal, `#2F2D2B` raised, `#1F1E1D` deepest |
| Ink | `#F0E6DA` cream, `#A59E84` stone, `#9A9185` dim |
| Gold | `#C29B3C`, light `#D8B45C`, deep `#A8842C` |
| Burgundy | `#5E2621`, `#7A322B` |
| Rules | `#44403A`, `#5A5248` |

Display *Marcellus*, serif *Bodoni Moda* and *Cormorant Garamond*, body *Jost*,
Arabic *Amiri* — all from Google Fonts, loaded in `index.html`.

> **One external request.** The fonts are the only thing the site fetches from
> anywhere else. If you would rather it be entirely self-contained — for an
> offline demo, or to drop the third-party request — download the six families,
> put them in `docs/assets/fonts/`, and swap the `<link>` in `index.html` for
> your own `@font-face` rules. Nothing else changes.

---

## Editing it

The build is generated, not hand-written, so edits made directly in `docs/` are
overwritten the next time it is exported. Two honest options:

**Small, final tweaks** — a word, a price, a colour — can be made in
`index.html` and `app.*.js` and committed. Keep a note of them.

**Anything structural** should be changed in the design source (the Irth 01
artboard) and re-exported, which regenerates this whole folder.

---

## Browsers

Current Chrome, Edge, Safari and Firefox. The layout is built at 1440 and holds
down to phone width. It uses `aspect-ratio`, `position: sticky` and CSS nesting
of a mild kind — nothing that needs a polyfill in a browser from the last three
years.
