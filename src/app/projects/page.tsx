import Link from "next/link";
import PortfolioPageShell from "@/components/portfolio-pages/PortfolioPageShell";
import styles from "@/components/portfolio-pages/portfolioPages.module.css";
import { PROJECT_CASE_STUDIES } from "@/components/hero-scene/portfolioData";

export default function ProjectsPage() {
  const projects = Object.values(PROJECT_CASE_STUDIES);

  return (
    <PortfolioPageShell
      index="02"
      eyebrow="Selected work"
      title="Projects made to solve, teach, and delight."
      intro="A collection of fullstack applications, production work, embedded systems, e-commerce experiences, and creative web experiments."
    >
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Project archive</p>
        <h2>Choose a case study.</h2>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <Link key={project.id} href={`/projects/${project.id}`} className={styles.projectCard}>
              <div>
                <p className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</p>
                <h3>{project.title}</h3>
                <p className={styles.projectMeta}>{project.type} · {project.period}</p>
                <p>{project.summary}</p>
              </div>
              <span className={styles.projectArrow}>Open case study →</span>
            </Link>
          ))}
        </div>
      </section>
    </PortfolioPageShell>
  );
}
