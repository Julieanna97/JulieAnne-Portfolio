import PortfolioPageShell from "@/components/portfolio-pages/PortfolioPageShell";
import styles from "@/components/portfolio-pages/portfolioPages.module.css";
import { CREDIT_GROUPS } from "@/components/hero-scene/portfolioData";

export default function CreditsPage() {
  return (
    <PortfolioPageShell
      index="03"
      eyebrow="Credits"
      title="Built with care, curiosity, and a little Tokyo magic."
      intro="The tools, visual ideas, technology, and creative references behind this interactive portfolio."
    >
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Scene attribution</p>
        <h2>A Mysterious Adventure — 3D Editor Challenge.</h2>
        <p className={styles.sectionLead}>
          The main 3D scene was created by Diosmel and is used under the Creative Commons Attribution 4.0 license. The portfolio concept, interface, camera behavior, responsive implementation, lighting additions, and surrounding experience were built and customized by Julie Anne Cantillep.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Behind the experience</p>
        <h2>Technology and visual direction.</h2>
        <div className={styles.grid}>
          {CREDIT_GROUPS.map((group) => (
            <article key={group.title} className={styles.card}>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Design direction</p>
        <h2>A portfolio that feels like a place.</h2>
        <div className={styles.grid}>
          <article className={styles.card}><h3>Cozy spaces</h3><p>A small environment that feels lived-in rather than a standard landing page.</p></article>
          <article className={styles.card}><h3>Sakura nights</h3><p>Pink reflections, violet shadows, city lights, warm windows, and drifting petals.</p></article>
          <article className={styles.card}><h3>Playful interaction</h3><p>Camera journeys, numbered discoveries, animated cards, sound, and page reveals.</p></article>
        </div>
      </section>
    </PortfolioPageShell>
  );
}
