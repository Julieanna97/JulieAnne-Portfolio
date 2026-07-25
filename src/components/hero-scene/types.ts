export type SectionId =
  | "about"
  | "projects"
  | "credits";

export type ProjectId =
  | "sigma-autonomous-car"
  | "podmanager"
  | "practicepal"
  | "naile-ecommerce"
  | "asteroidwatch"
  | "worldbite-market"
  | "ecommerce-rest-api"
  | "bookshop"
  | "restaurant-booking";

export type ProjectCaseStudy = {
  id: ProjectId;
  title: string;
  type: string;
  role: string;
  period: string;
  summary: string;
  overview?: string[];
  technologies: string[];
  contributions: string[];
  highlights?: Array<{
    title: string;
    text: string;
  }>;
  images: string[];
  video?: string;
  externalUrl?: string;
  externalLabel?: string;
  githubUrl?: string;
  githubLabel?: string;
};

export type PortfolioSection = {
  id: SectionId;
  number: string;
  markerNumber?: string;
  title: string;
  eyebrow: string;
  hotspot: [number, number, number];
  camera: [number, number, number];
  focus: [number, number, number];
};