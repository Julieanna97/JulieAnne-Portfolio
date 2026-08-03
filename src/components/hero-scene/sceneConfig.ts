import type { PortfolioSection } from "./types";

/*
 * Keep this disabled when you are not positioning lights
 * or meshes. This removes the cyan debugging spheres.
 */
export const ENABLE_LIGHT_DEBUGGER =
  false;

/* -------------------------------------------------------------------------- */
/* Main whole-building camera                                                 */
/* -------------------------------------------------------------------------- */

/*
 * Slightly closer than the previous desktop position.
 *
 * The camera height remains 9.6, so the view does not
 * lift upward.
 */
export const HOME_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  21.4,
  9.6,
  17.4,
];

/*
 * Mobile remains farther away because its viewport is
 * narrower. Its height is also unchanged.
 */
export const HOME_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  27.1,
  12.7,
  22.3,
];

/*
 * Keep the original rotation target.
 *
 * This prevents the camera from tilting upward and keeps
 * the automatic route centered on the building.
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
 * Kept for compatibility with any remaining imports.
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
 * The intro and automatic OrbitControls route use the
 * same centered pivot.
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
 * The intro ends at the updated fixed desktop view.
 */
export const INTRO_STREET_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  21.4,
  9.6,
  17.4,
];

/*
 * The intro ends at the updated fixed mobile view.
 */
export const INTRO_STREET_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  27.1,
  12.7,
  22.3,
];

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

/*
 * Wider Credits view.
 *
 * Pulled farther back and slightly left so the rooftop,
 * surrounding buildings, and Credits marker remain visible
 * without the lucky cat filling the right side of the frame.
 */
export const CREDITS_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  -0.8,
  14.6,
  11.2,
];

export const CREDITS_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  -0.4,
  16.2,
  13.8,
];

/* -------------------------------------------------------------------------- */
/* Portfolio sections                                                         */
/* -------------------------------------------------------------------------- */

export const SECTIONS:
  PortfolioSection[] = [
    {
      id: "about",

      number: "01",

      markerNumber: "1",

      title: "About Me",

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
      id: "projects",

      number: "02",

      markerNumber: "2",

      title: "Projects",

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
      id: "credits",

      number: "03",

      markerNumber: "3",

      title: "Credits",

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