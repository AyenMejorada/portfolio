# Ayen Mejorada Portfolio

A static portfolio site styled as a macOS desktop. No build step: open `index.html` in a browser, or run `npx serve` in this folder.

## Structure

```
index.html        Home (hero desktop, "what i do" cards, contact)
creatives.html    Organization timeline, Spotify songs, 20-design gallery
hosting.html      Hosting timeline, logo marquee, 12-photo gallery
css/              One stylesheet per page (design tokens are in :root at the top)
js/               One script per page (smooth scroll, cursor, clock, viewers)
assets/<page>/    All images, named by what they show
DESIGN.md         The design system
```

## Swapping images

Replace the file in `assets/<page>/` and keep the same file name. Hero photos are `hero-*.jpg`, card photos are `card-*.jpg`, and the gallery photos are named after their content. Current images were cropped from screenshots, so they are low resolution; use your originals.

## Still placeholders

- Email: `hello@ayenmejorada.com` (index.html, creatives.html, hosting.html footers and Dock)
- Social links: generic homepages for Instagram, Facebook, LinkedIn, GitHub (index.html)
- `tech.html` does not exist yet; the Tech card shows a "coming soon" message (see `js/index.js`)

## Deploy on GitHub Pages

1. Create a public repository and upload everything in this folder (keep the folder structure).
2. Repository Settings > Pages > Build and deployment > Deploy from a branch > `main` / `(root)` > Save.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Ideas for later

- Pull the CSS shared by `creatives.css` and `hosting.css` into one `shared.css`.
- Replace the long inline SVG strings in the JS with real `.svg` files.
- Add `tech.html` in the same style as `hosting.html`.
- Compress images and add `srcset` for sharper photos on large screens.
