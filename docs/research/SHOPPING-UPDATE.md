# Belif storefront update

Reference: https://www.sugarcosmetics.com/ inspected 2026-10-15. Compact announcement/header, wide campaign hero, circular category navigation, dense product rows and separate shopping actions. Reference uses Jost uppercase section headings, white surface and dark header. Adaptation preserves Belif ivory/green typography and existing sections per the attached brief; no Sugar assets, prices, ratings or branding copied.

Output: existing dist/index.html and / route. No framework replacement. Tailwind compiled locally and a decorative Three.js canvas bundled with esbuild; CSS remains responsible for readable card transitions.

ProductCard > ProductImageSwitcher > front image + verified-text overlay + accessible Quick Info button. 400ms crossfade and 1.035 image scale, reduced-motion support. Detail dialog has separate front/information artwork types, thumbnails, arrows, keyboard navigation and zoom. Generated info graphics are shown only as labelled concepts in the gallery because the user explicitly forbids unverified ingredients and benefits in storefront claims.

Five image pairs matched visually. Existing soaps/gift hampers retained with honest missing-photo treatment. Other generated products are not automatically added. See image-manifest.json and IMAGE_REVIEW.md.
