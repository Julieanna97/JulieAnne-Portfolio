import PortfolioPageShell from "@/components/portfolio-pages/PortfolioPageShell";
import styles from "@/components/portfolio-pages/portfolioPages.module.css";
import { ABOUT_EXPERIENCE, ABOUT_SKILL_GROUPS } from "@/components/hero-scene/portfolioData";

export default function AboutPage() {
  return (
    <PortfolioPageShell
      index="01"
      eyebrow="About me"
      title="Building useful things with personality."
      intro="I’m Julie Anne, a software developer working across fullstack applications, embedded systems, AI-related projects, and playful 3D web experiences."
    >
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Profile</p>
        <h2>Clean code, thoughtful interfaces, and curious problem-solving.</h2>
        <p className={styles.sectionLead}>
          I enjoy taking an idea from its early structure to a finished experience—designing the interface, building the logic behind it, connecting data, and polishing the details that make it feel easy to use.
        </p>
        <div className={styles.grid}>
          <article className={styles.card}><h3>Frontend</h3><p>React, Next.js, TypeScript, responsive UI, motion, accessibility, and design-focused implementation.</p></article>
          <article className={styles.card}><h3>Backend</h3><p>Node.js, Express, FastAPI, databases, authentication, payments, REST APIs, and production workflows.</p></article>
          <article className={styles.card}><h3>Creative & embedded</h3><p>Three.js, React Three Fiber, animation, C/C++, Python, electronics, sensors, and system testing.</p></article>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Experience</p>
        <h2>Work and practical projects.</h2>
        <div className={styles.projectGrid}>
          {ABOUT_EXPERIENCE.map((experience) => (
            <article key={`${experience.company}-${experience.period}`} className={styles.card}>
              <p className={styles.projectNumber}>{experience.period}</p>
              <h3>{experience.role}</h3>
              <p className={styles.projectMeta}>{experience.company}</p>
              <p>{experience.summary}</p>
              <ul>{experience.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Toolkit</p>
        <h2>Skills I use to bring projects together.</h2>
        <div className={styles.grid}>
          {ABOUT_SKILL_GROUPS.map((group) => (
            <article key={group.title} className={styles.card}>
              <h3>{group.title}</h3>
              <div className={styles.tags}>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Contact</p>
        <h2>Let’s create something thoughtful.</h2>
        <div className={styles.linkGrid}>
          <a className={styles.linkCard} href="mailto:kisamae1997@gmail.com">Email me ↗</a>
          <a className={styles.linkCard} href="https://www.linkedin.com/in/julie-anne-cantillep-4ba4ab250/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a className={styles.linkCard} href="https://github.com/Julieanna97" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </section>
    </PortfolioPageShell>
  );
}
