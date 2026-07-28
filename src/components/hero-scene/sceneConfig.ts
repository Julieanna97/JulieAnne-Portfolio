import type { PortfolioSection } from "./types";

/*
  Keep this disabled when you are not positioning lights or meshes.
  This removes the cyan debugging spheres.
*/
export const ENABLE_LIGHT_DEBUGGER =
  false;

/* -------------------------------------------------------------------------- */
/* Main whole-building camera                                                 */
/* -------------------------------------------------------------------------- */

/*
  Final desktop position after the intro.

  This is closer to the building than the previous camera position,
  while still leaving enough room to see the roof and floor text.
*/
export const HOME_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  20.6,
  9.6,
  16.8,
];

/*
  Mobile needs a little more distance because the viewport is narrower.
*/
export const HOME_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  26.2,
  12.7,
  21.4,
];

/*
  OrbitControls rotates around this position.

  The Y value keeps the pivot near the vertical center of the
  complete building rather than near the street.
*/
export const HOME_TARGET: [
  number,
  number,
  number,
] = [
  0,
  5.7,
  0,
];

/* -------------------------------------------------------------------------- */
/* Intro camera                                                               */
/* -------------------------------------------------------------------------- */

/*
  The intro begins closer, higher, and on the opposite side.

  The custom intro animation should rotate around the building,
  descend slightly, and zoom outward toward the final home camera.
*/
export const INTRO_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  -13.8,
  15.8,
  4.6,
];

export const INTRO_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  -17.4,
  19.2,
  5.8,
];

/*
  Kept for compatibility with any remaining code that imports
  INTRO_TARGET.
*/
export const INTRO_TARGET: [
  number,
  number,
  number,
] = [
  0,
  5.7,
  0,
];

/*
  The intro and manual OrbitControls use the same centered pivot.
*/
export const INTRO_STREET_TARGET: [
  number,
  number,
  number,
] = [
  0,
  5.7,
  0,
];

/*
  Final desktop position after the intro rotation.
*/
export const INTRO_STREET_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  20.6,
  9.6,
  16.8,
];

/*
  Final mobile position after the intro rotation.
*/
export const INTRO_STREET_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  26.2,
  12.7,
  21.4,
];

/*
  Faster intro movement, close to the speed of the inspiration site.
*/
export const INTRO_ZOOM_DURATION =
  1.55;

/* -------------------------------------------------------------------------- */
/* About Me doorway camera                                                    */
/* -------------------------------------------------------------------------- */

export const ABOUT_HOTSPOT: [
  number,
  number,
  number,
] = [
  4.545,
  2.672,
  -1.46,
];

export const ABOUT_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  8.3,
  2.72,
  -8.4,
];

export const ABOUT_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  10.7,
  3.85,
  -9.5,
];

export const ABOUT_FOCUS: [
  number,
  number,
  number,
] = [
  4.35,
  1.62,
  -3,
];

/* -------------------------------------------------------------------------- */
/* Projects storefront camera                                                 */
/* -------------------------------------------------------------------------- */

export const PROJECTS_HOTSPOT: [
  number,
  number,
  number,
] = [
  -3.221,
  2.232,
  4.528,
];

export const PROJECTS_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  -1.45,
  2.72,
  12.65,
];

export const PROJECTS_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  -0.65,
  3.85,
  15.7,
];

export const PROJECTS_FOCUS: [
  number,
  number,
  number,
] = [
  -3.221,
  1.82,
  4.528,
];

/* -------------------------------------------------------------------------- */
/* Credits rooftop camera                                                     */
/* -------------------------------------------------------------------------- */

export const CREDITS_HOTSPOT: [
  number,
  number,
  number,
] = [
  -0.408,
  11.768,
  -3.875,
];

export const CREDITS_FOCUS: [
  number,
  number,
  number,
] = [
  0.55,
  12.55,
  5.1,
];

export const CREDITS_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  0.2,
  13.65,
  6.95,
];

export const CREDITS_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  1,
  15.1,
  8.95,
];

/* -------------------------------------------------------------------------- */
/* Portfolio sections                                                         */
/* -------------------------------------------------------------------------- */

export const SECTIONS: PortfolioSection[] = [
  {
    id:
      "about",

    number:
      "01",

    markerNumber:
      "1",

    title:
      "About Me",

    eyebrow:
      "Fullstack · Embedded · Software Developer",

    hotspot:
      ABOUT_HOTSPOT,

    camera:
      ABOUT_CAMERA_DESKTOP,

    focus:
      ABOUT_FOCUS,
  },

  {
    id:
      "projects",

    number:
      "02",

    markerNumber:
      "2",

    title:
      "Projects",

    eyebrow:
      "Selected development work",

    hotspot:
      PROJECTS_HOTSPOT,

    camera:
      PROJECTS_CAMERA_DESKTOP,

    focus:
      PROJECTS_FOCUS,
  },

  {
    id:
      "credits",

    number:
      "03",

    markerNumber:
      "3",

    title:
      "Credits",

    eyebrow:
      "Attribution and tools",

    hotspot:
      CREDITS_HOTSPOT,

    camera:
      CREDITS_CAMERA_DESKTOP,

    focus:
      CREDITS_FOCUS,
  },
];