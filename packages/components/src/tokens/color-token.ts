import { unsafeCSS } from 'lit';

/** Color tokens for the app */
export const ColorToken = {
  /** Color for surfaces and backgrounds */
  onSurfaceLabel: unsafeCSS(`rgb(153 140 159)`),

  /** Color for interactive elements */
  secondary: unsafeCSS(`#297eff`) /* customized */,

  /** Color for primary elements */
  primary: unsafeCSS(`#bb5fff`) /* customized */,

  /** Color for informational elements */
  labelInfo: unsafeCSS(`hsl(240, 3%, 60%)`),

  /** Lighter color for icons */
  iconSecondary: unsafeCSS(`hsl(240, 3%, 80%)`),

  /** Colors for accents */
  pink: unsafeCSS(`hsl(300, 70%, 70%)`),

  /** Brand gradient for text and backgrounds */
  brandGradient: unsafeCSS(`
    linear-gradient(
      to right,
      var(--tt-color-primary) 10%,
      var(--tt-color-secondary) 40%,
      var(--tt-color-primary) 70%,
      var(--tt-color-secondary) 100%
    ) -100%/
    200%
  `),

  /** Brand gradient for text and backgrounds */
  brandGradientReversed: unsafeCSS(`
    linear-gradient(
      to right,
      var(--tt-color-primary) 10%,
      var(--tt-color-secondary) 30%,
      var(--tt-color-primary) 70%,
      var(--tt-color-secondary) 100%
    ) -100%/
    200%
  `),
} as const;
