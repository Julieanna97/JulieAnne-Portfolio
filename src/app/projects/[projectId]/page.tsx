import { notFound } from "next/navigation";
import PortfolioPageShell from "@/components/portfolio-pages/PortfolioPageShell";
import styles from "@/components/portfolio-pages/portfolioPages.module.css";
import { PROJECT_CASE_STUDIES } from "@/components/hero-scene/portfolioData";
import type { ProjectId } from "@/components/hero-scene/types";

export function generateStaticParams() {
  return Object.keys(PROJECT_CASE_STUDIES).map((projectId) => ({ projectId }));
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = PROJECT_CASE_STUDIES[projectId as ProjectId];

  if (!project) notFound();

  return (
    <PortfolioPageShell
      index="02"
      eyebrow={project.type}
      title={project.title}
      intro={project.summary}
    >
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Case study</p>
        <h2>{project.role}</h2>
        <p className={styles.sectionLead}>{project.period}</p>
        <div className={styles.projectActions}>
          {project.externalUrl && <a className={styles.button} href={project.externalUrl} target="_blank" rel="noreferrer">{project.externalLabel ?? "Open live site ↗"}</a>}
          {project.githubUrl && <a className={styles.button} href={project.githubUrl} target="_blank" rel="noreferrer">{project.githubLabel ?? "View GitHub ↗"}</a>}
        </div>
        {project.images.length > 0 && (
          <div className={styles.gallery}>
            {project.images.map((image, index) => <img key={image} src={image} alt={`${project.title} screenshot ${index + 1}`} />)}
            {project.video && <video controls preload="metadata" poster={project.images[0]}><source src={project.video} type="video/mp4" /></video>}
          </div>
        )}
      </section>

      {project.overview && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Overview</p>
          <h2>How the project came together.</h2>
          {project.overview.map((paragraph) => <p key={paragraph} className={styles.sectionLead}>{paragraph}</p>)}
        </section>
      )}

      {project.highlights && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Highlights</p>
          <h2>The parts that mattered most.</h2>
          <div className={styles.grid}>
            {project.highlights.map((highlight) => <article key={highlight.title} className={styles.card}><h3>{highlight.title}</h3><p>{highlight.text}</p></article>)}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Contribution</p>
        <h2>What I worked on.</h2>
        <div className={styles.projectGrid}>
          {project.contributions.map((contribution, index) => <article key={contribution} className={styles.card}><p className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</p><p>{contribution}</p></article>)}
        </div>
        <div className={styles.tags}>{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      </section>
    </PortfolioPageShell>
  );
}
