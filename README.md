# TexAna Taceauxs & More — website redesign concept

An **unsolicited redesign concept** for **TexAna Taceauxs & More**, a Tex-Mex /
Cajun-fusion food truck serving Gonzales, Prairieville, and Ascension Parish, LA.
This is a portfolio pitch piece — not the business's official website.

## Why a site?

Today TexAna lives entirely on Facebook / Instagram / TikTok with **no website**.
That works for regulars but hurts discovery, and it makes the truck's single most
important question — *"where is it today?"* — hard to answer for anyone not already
following. There's also no clean front door for **catering / private-event booking**,
which is where a food truck makes its real money.

This concept fixes exactly that:

- **"Where's the truck this week?"** — an honest, styled schedule of the truck's
  regular stops (RPCC, Hwy 621 home base, markets, subdivision pop-ups) with a
  clear "always confirm on socials" disclaimer, so findability stops being a DM.
- **Catering & private-event inquiry form** — the money feature, as a real styled
  form (graduations, weddings, block parties), plus click-to-text ordering.
- **Follow-the-flavor CTAs** — prominent, real links to their Facebook, Instagram
  and TikTok, since that's where the live location actually gets posted.
- A proper **menu** of their signature items, the **Tacos-for-2** order-ahead
  special, real customer raves, story, hours, and home-base location.

No fake ordering / checkout — orders are placed by text, as the business actually does.

## Built from real data

- **Menu items & descriptions** are from the business's own "Tacos for 2" flyer and
  verified customer reviews (bang-bang shrimp, chicken-bacon-ranch, birria).
- **Phone** (225) 228-1192, **home base** 39275 LA-621 Prairieville, **hours**, and
  **service area** are from their public listings.
- **Schedule** is a representative sample of their real recurring stops (from their
  own posted monthly calendars) — clearly marked as a sample to confirm on socials.
- The truck does **not** publish a fixed price list (orders are taken by text), so
  per-item prices read "market" rather than inventing numbers. See the
  `MENU-INCOMPLETE` note in `index.html`.

## Images

Their food/truck photography is Facebook/Instagram-only (token-blocked, can't be
downloaded). The site ships with tasteful on-brand SVG placeholders and is **wired
to auto-swap in real photos** the moment they're dropped into `assets/photos/`
(see `assets/photos/DROP-PHOTOS-HERE.md`).

## Tech

Fully static, self-contained, no build step: `index.html` + `styles.css` +
`script.js`. One Google Fonts `<link>`; everything else is local. Responsive,
mobile-first, accessible, with tasteful motion that respects
`prefers-reduced-motion`.

## View it

Open **`index.html`** by double-clicking it, or serve the folder statically. Works
as-is on GitHub Pages if the repo is later made public.

---

*Redesign concept — independent pitch. All business details belong to TexAna
Taceauxs & More.*
