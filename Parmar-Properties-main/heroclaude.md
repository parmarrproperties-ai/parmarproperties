# HeroSection Animation & SVG Changes

The following is a complete and detailed log of the exact changes applied to `src/sections/HeroSection/index.tsx`. You can provide this to another agent to precisely replicate the current state of the hero section.

## 1. SVG Path Replacements
Replaced the `PARMAR_PATHS` and `PROPS_PATHS` arrays with single, unified compound paths generated from the "Playfair Display Black" font.

```tsx
const PARMAR_PATHS = [
  "M 302.06 11.66 L ... Z" // (The single long compound path string for PARMAR)
];

const PROPS_PATHS = [
  "M 277.7 62.201 L ... Z" // (The single long compound path string for PROPERTIES)
];
```

## 2. SVG Container & Positioning
- Updated the main `<svg>` element's `viewBox` from `0 0 1200 420` to `0 0 760 180`. The width was specifically increased to 760 to prevent the trailing "S" in PROPERTIES from getting clipped after being scaled.
- Reduced the overall container scale to roughly 40% size to make it smaller on screen:
  ```tsx
  const maskScale = 0.40 + p3e * 0.05;
  ```

## 3. SVG Structure Updates (Masks and Strokes)
Inside both the `<mask id="parmar-mask">` and the `.lp` stroke sections, the old individual paths were deleted and replaced with exactly two `<g>` (group) wrappers that apply specific translations and scales to fit the two words together harmoniously:

```tsx
{/* PARMAR group */}
<g transform="translate(119, 10) scale(1)">
  <path ... d={PARMAR_PATHS[0]} />
</g>

{/* PROPERTIES group */}
<g transform="translate(34, 105) scale(1.11)">
  <path ... d={PROPS_PATHS[0]} />
</g>
```

## 4. Solid White, Permanent Strokes
The SVG stroke lines were made solid white and permanently visible, completely removing any fading:
- Set `stroke="white"` on the `.lp` paths.
- Set `strokeWidth="1.5"` on the `.lp` paths.
- Removed dynamic opacity and hardcoded `opacity={1}` on the `.lp` paths.
- Modified the `strokeOpacity` variable (used elsewhere) so it no longer fades out when the image fill happens: `const strokeOpacity = Math.max(0, Math.min(1, p3 * 5));`

## 5. Animation Phase Timings (The Scroll Logic)
The core scroll progress mapping variables (`p1` through `p5`) were significantly adjusted to give each animation step room to breathe.

- **Fast Stroke Drawing (`p3`):** 
  ```tsx
  const p3 = Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.20)); // (0.25 → 0.45)
  ```
  *Crucial Fix:* This exact `0.20` duration formula was synced *both* in the outer render scope and *inside* the `useEffect` that calculates the `strokeDashoffset`. This ensures the stroke finishes drawing rapidly by 45% scroll, so it can sit fully visible on the screen.

- **Delayed Image Fill (`p4`):**
  ```tsx
  const p4 = Math.max(0, Math.min(1, (scrollProgress - 0.65) / 0.17)); // (0.65 → 0.82)
  ```
  The image fill transition was pushed all the way back to 65% scroll, creating a solid 20% scroll window (from 0.45 to 0.65) where the fully drawn outline sits perfectly still and visible before filling in.

- **Smoke Reveal (`p2`):**
  ```tsx
  const p2 = Math.max(0, Math.min(1, (scrollProgress - 0.80) / 0.20)); // (0.80 → 1.00)
  ```
  The smoke logic was updated to be completely visible at the bottom of the screen right from load:
  ```tsx
  const smokeOpacity = 1; // Removed easeOut(p2), it is now always 1
  ```
  The smoke simply waits at `translateY(40%)` until the user hits 80% scroll progress, at which point it violently rises up and scales up. Because it lives at `z-30` (above the `z-25` building but below the `z-40` SVG), it perfectly blankets the building while letting the white SVG strokes punch through cleanly.

## 6. Mathematical Bug Fix (Disappearing Text)
Fixed a major bug where the entire `z-40` SVG text layer would randomly blink out of existence. The `textLayerOpacity` easing function was being fed values well above 1, causing the `easeOut2` math (`1 - (1-t)^2`) to plummet into negative numbers.
- Added a proper `Math.min(1, ...)` clamp:
  ```tsx
  const textLayerOpacity = easeOut2(Math.max(0, Math.min(1, (scrollProgress - 0.24) / 0.04)));
  ```
