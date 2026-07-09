# NEKINGX Typography Guide

This guide documents the **existing** typography already used across the site. Values were audited from `css/style.css` and extracted into `css/variables.css`. Do not invent new sizes unless a design requires it — then add the token here and in `variables.css`.

## Files

| File | Role |
|------|------|
| `css/variables.css` | Typography tokens |
| `css/style.css` | Components (imports variables; uses `var(...)`) |
| `NEKINGX_DESIGN_GUIDE.md` | Broader Figma / layout context |

Pages only need:

```html
<link rel="stylesheet" href="/css/style.css">
```

`style.css` already imports `variables.css`.

## Font family

```css
font-family: var(--font-primary);
/* same as --font-family-primary */
```

Stack: Geogrotesque → Inter → PingFang SC → Arial → sans-serif.

## Semantic size tokens

These match the most common hardcoded sizes found in the codebase:

| Variable | Value | Use for |
|----------|-------|---------|
| `--font-size-meta` | 10px | Badges, tiny captions, dense metadata |
| `--font-size-label` | 12px | Tabs, bottom nav labels, small UI labels |
| `--font-size-body` | 14px | Default body / table / UI copy |
| `--font-size-nav` | 14px | Desktop header nav links |
| `--font-size-button` | 14px | Primary buttons / CTAs (same px as body; use for intent) |
| `--font-size-card-title` | 20px | Card titles, panel headings, notice titles |

### Other repeated sizes (keep when already used)

| Variable | Value |
|----------|-------|
| `--font-size-11` | 11px |
| `--font-size-13` | 13px |
| `--font-size-15` | 15px |
| `--font-size-16` | 16px |
| `--font-size-18` | 18px |
| `--font-size-22` | 22px |
| `--font-size-24` | 24px |
| `--font-size-12-8` | 12.8px |

## Font weights

Weight tokens exist in `variables.css` for documentation / future use, but **`style.css` uses numeric weights** (`400`–`900`) so bold text never disappears if `variables.css` fails to load.

| Variable (in variables.css) | Value in style.css | Typical use |
|-----------------------------|--------------------|-------------|
| `--font-weight-regular` | `400` | Inactive tabs, secondary copy |
| `--font-weight-medium` | `500` | Filters / medium UI |
| `--font-weight-semibold` | `600` | Nav links, some balances |
| `--font-weight-bold` | `700` | Titles, active states |
| `--font-weight-extrabold` | `800` | Section headings, emphasis (most common) |
| `--font-weight-black` | `900` | CTAs, login, strong game labels |

Prefer writing `font-weight: 800;` (or the matching number) in component CSS.

## Line heights

| Variable | Value | Pair with |
|----------|-------|-----------|
| `--line-height-meta` | 12px | `--font-size-meta` |
| `--line-height-14` | 14px | Compact 12–14px UI |
| `--line-height-label` | 16px | `--font-size-label` / 16px text |
| `--line-height-13` | 17px | `--font-size-13` |
| `--line-height-body` | 18px | `--font-size-body` / buttons |
| `--line-height-button` | 18px | `--font-size-button` |
| `--line-height-15` | 19px | `--font-size-15` |
| `--line-height-nav` | 20px | `--font-size-nav` / card titles |
| `--line-height-card-title` | 20px | `--font-size-card-title` |
| `--line-height-22` | 22px | Wallet balance rows |
| `--line-height-24` | 24px | Larger headings |
| `--line-height-28` | 28px | Large titles |
| `--line-height-tight` | 1 | Icon-like glyphs |

## Letter spacing

| Variable | Value |
|----------|-------|
| `--letter-spacing-none` | 0 |
| `--letter-spacing-wallet` | .32px |

## Role → token cheat sheet

| Role | Size | Weight | Line height |
|------|------|--------|-------------|
| Nav link | `--font-size-nav` | `--font-weight-semibold` | `--line-height-nav` |
| Button / CTA | `--font-size-button` | `--font-weight-black` or `--font-weight-bold` | `--line-height-button` |
| Body / table | `--font-size-body` | `--font-weight-bold` or `--font-weight-semibold` | `--line-height-body` or `--line-height-14` |
| Label / tab | `--font-size-label` | `--font-weight-semibold`–`--font-weight-extrabold` | `--line-height-label` |
| Meta / badge | `--font-size-meta` | `--font-weight-bold`–`--font-weight-black` | `--line-height-meta` |
| Card title | `--font-size-card-title` | `--font-weight-bold`–`--font-weight-extrabold` | `--line-height-card-title` or `--line-height-nav` |

## Examples

```css
.desktop-nav a {
    font-size: var(--font-size-nav);
    line-height: var(--line-height-nav);
    font-weight: var(--font-weight-semibold);
}

.login-btn {
    font-size: var(--font-size-button);
    line-height: var(--line-height-button);
    font-weight: var(--font-weight-black);
}

.notice-card-title {
    font-size: var(--font-size-card-title);
    line-height: var(--line-height-nav);
    font-weight: var(--font-weight-bold);
}

.bottom-nav a {
    font-size: var(--font-size-label);
    font-weight: var(--font-weight-semibold);
}
```

## Exceptions (leave as raw px)

One-off display / decorative sizes are **not** tokenized:

- Hero / ranking numerals (`176px`, `104px`, `116px`, …)
- Rare sizes (`8px`, `9px`, `25px`, `28px`, `60px`, `.9375rem`, …)

If a rare size becomes repeated (3+ places), promote it into `variables.css` and this guide.

## Rules for new pages

1. Prefer semantic tokens (`--font-size-nav`, `--font-size-button`, etc.).
2. Match an existing component’s tokens instead of picking a new pixel value.
3. Do not change layout, spacing, or colors when adjusting typography.
4. Keep desktop and mobile visual parity with current Figma-aligned UI.
5. Update `variables.css` + this guide when introducing a new repeated size.

## Audit snapshot (source of truth)

Most common `font-size` values before tokenization: **14px**, **12px**, **13px**, **16px**, **15px**, **20px**, **10px**, **11px**, **18px**, **24px**.  
Most common `font-weight` values: **800**, **900**, **700**, **600**, **400**, **500**.
