import type { PortfolioSection } from "./types";

export const ENABLE_LIGHT_DEBUGGER =
  true;

/* -------------------------------------------------------------------------- */
/* Camera positions                                                           */
/* -------------------------------------------------------------------------- */

export const HOME_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  19.4,
  10.45,
  24.6,
];

export const HOME_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  24.8,
  13.8,
  31.4,
];

export const HOME_TARGET: [
  number,
  number,
  number,
] = [
  0,
  4.18,
  0,
];

/*
  Initial wide shot shown when the intro starts.
*/
export const INTRO_CAMERA: [
  number,
  number,
  number,
] = [
  -25,
  17.5,
  29,
];

export const INTRO_TARGET: [
  number,
  number,
  number,
] = [
  0,
  5.2,
  0,
];

/*
  Final intro view.

  The camera moves directly here without an intermediate waypoint.
  It remains here after the intro finishes.
*/
export const INTRO_STREET_TARGET: [
  number,
  number,
  number,
] = [
  5,
  1.62,
  1.25,
];

export const INTRO_STREET_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  11.75,
  2.72,
  1.25,
];

export const INTRO_STREET_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  14.4,
  3.85,
  1.25,
];

/*
  A short direct movement makes the zoom start immediately.

  Increase this slightly for a calmer animation or decrease it for a faster
  transition.
*/
export const INTRO_ZOOM_DURATION =
  2;

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
/* Credits rooftop cat camera                                                 */
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
