# Nekingx Figma Study Summary

## 1. Frames Studied
- Selected Figma node `627:9004` only.
- Home desktop frame.
- Home mobile frame.
- Desktop game-list frame with global header/navigation and Casino/Slots state visible.
- Mobile game-list frame with global header, menu state, and bottom navigation visible.
- Global desktop header, mobile header, desktop nav, mobile menu/bottom nav patterns visible in the selected node.
- A distinct Crash-specific gameplay frame was not visible in the selected node; apply only the shared game-list/header/navigation rules below unless a Crash-specific frame is provided.

## 2. Homepage Desktop Rules
- Fixed wide desktop composition, visually aligned to a 1920px canvas.
- Header sits at the top with dark green horizontal gradient.
- Hero starts directly under header and uses a green grid/tech background with large promotional typography on the left and character/bonus imagery on the right.
- Main content flow: hero, top-series panel, dark footer/invite area.
- Top-series panel is full-width inset with rounded top corners, green gradient header, dark green body, large outlined ranking numbers, poster cards, and small TOP 10 badges.

## 3. Homepage Mobile Rules
- Narrow single-column layout.
- Header is compact: logo left, wallet/status controls right, hamburger/menu icon at far right.
- Hero keeps the same offer hierarchy but compresses imagery and text vertically.
- Announcement and top-series modules remain stacked and full-width within the mobile viewport.
- Footer content stacks vertically: logo/about text first, invite/QR block below.

## 4. Crash Desktop Rules
- Distinct Crash-specific frame was not visible in the selected node.
- Use the shared desktop game-list structure visible in the selected canvas: top global header, large promotional hero/banner, top-series strip, category icon row, search field, provider list row, game card grid, pagination, and footer.
- Desktop game-list cards use tight grid spacing, bright thumbnail imagery, small corner tags, and heart/favorite affordances.

## 5. Crash Mobile Rules
- Distinct Crash-specific mobile frame was not visible in the selected node.
- Use the shared mobile game-list structure visible in the selected canvas: compact header, green category hero tile, top-series carousel, category icon tabs, search bar, provider list, game list cards in two-column grid, footer, and fixed bottom navigation.

## 6. Global Header/Nav Rules
- Desktop header height is slim and horizontal, approximately 64-88px depending on frame scale.
- Logo aligns left after a small menu icon; desktop nav is centered with compact bold labels.
- Active nav item uses a red pill/skew style with white text.
- Wallet/user area sits on the right with dark translucent rounded rectangle, green `N` badge, balance text, refresh/status icon, and circular user/notification icons.
- Mobile header keeps logo left and wallet/menu controls right; nav links are not shown as full desktop labels.

## 7. Nav Dropdown Rules
- Dropdown/menu styling follows the same dark green/black system.
- Items use compact bold labels, icon-led rows or tiles, and active states in neon green or red depending on context.
- Radius is small to medium, usually 6-12px.
- Overlays should feel dense, game-dashboard-like, and aligned to header controls.

## 8. Mobile Bottom Nav Rules
- Fixed bottom bar uses dark background with five compact items.
- Active item uses neon green icon/text emphasis.
- Inactive items are muted gray/white.
- Icons are simple filled game/navigation symbols, about 18-24px.
- Labels are very small, centered below icons.

## 9. Typography Rules
- Brand/hero headline uses tall condensed bold display styling similar to Anton/Impact.
- UI labels use heavy/bold geometric styling similar to Geogrotesque/Geologica.
- Body/footer copy is small, light, and muted.
- Desktop hero: large 50-60px display text with tight line height.
- Panel headings: bold 20-24px.
- Small metadata labels: 10-12px uppercase.

## 10. Spacing/Grid Rules
- Desktop uses 40px outer horizontal inset for major panels.
- Large modules span nearly full width with 12px corner radius.
- Announcement bar uses 20px horizontal padding and 18px internal gap.
- Game/card grids use dense spacing with consistent gutters and aligned card rows.
- Mobile uses tight 8-12px side gutters and stacked sections.

## 11. Color/Style Rules
- Primary background: near-black green `#000f01`.
- Main neon green: `#00f243`.
- Yellow/lime accent: `#e5ff0d` and `#ffd81a`.
- Header gradients: dark blue/green to deep green.
- Panels use dark green gradients, subtle borders, and soft black shadows.
- Active red nav: vivid red around `#f01827`.
- Borders are low-opacity green or white, usually 0.5-1px.
- Glow/shadow effects are used sparingly around promotional bars and dark panels.

## 12. Asset Usage Rules
- Use real exported assets only for logos, hero characters, game thumbnails, QR code, social icons, badges, and complex bitmap backgrounds.
- Keep UI containers, gradients, borders, buttons, labels, and text as HTML/CSS.
- Do not use full-frame screenshots as implementation assets.
- Do not hotlink Figma asset URLs; assets must be local when implemented.
