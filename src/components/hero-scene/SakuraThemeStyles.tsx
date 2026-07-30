export default function SakuraThemeStyles() {
  return (
    <style jsx global>{`
      :root {
        --portfolio-paper: #fffdf7;
        --portfolio-canvas: #f3e5ba;
        --portfolio-canvas-deep: #ead39a;
        --portfolio-ink: #3a1d0c;
        --portfolio-ink-soft: #684733;
        --portfolio-muted: #947865;
        --portfolio-orange: #f29400;
        --portfolio-orange-dark: #d97b00;
        --portfolio-orange-soft: #fff0cf;
        --portfolio-line: rgba(58, 29, 12, 0.16);
        --portfolio-paper-shadow:
          0 34px 80px rgba(48, 27, 10, 0.22),
          0 7px 20px rgba(48, 27, 10, 0.1);
      }

      .adventure-scene-shell,
      .adventure-annotation-card,
      .adventure-case-study-modal,
      .adventure-section-detail-modal,
      .adventure-bottom-nav {
        font-family: var(--font-body), Arial, sans-serif;
      }

      .adventure-annotation-card h2,
      .adventure-case-study-header h2,
      .adventure-section-detail-header h2,
      .adventure-section-heading h3,
      .adventure-detail-card h3,
      .adventure-detail-card h4,
      .adventure-experience-card h4,
      .adventure-skill-card h4,
      .adventure-project-card-button strong {
        font-family: var(--font-display), Arial, sans-serif;
      }

      /* -------------------------------------------------------------------- */
      /* Existing scene atmosphere                                            */
      /* -------------------------------------------------------------------- */

      .adventure-backdrop--sakura {
        background:
          radial-gradient(
            circle at 74% 15%,
            rgba(186, 114, 255, 0.18),
            transparent 25%
          ),
          radial-gradient(
            circle at 18% 78%,
            rgba(255, 75, 167, 0.17),
            transparent 34%
          ),
          radial-gradient(
            circle at 52% 88%,
            rgba(64, 62, 139, 0.16),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            #090718 0%,
            #060511 52%,
            #02030a 100%
          );
      }

      .adventure-sakura-moon {
        position: absolute;
        top: 7%;
        right: 10%;
        width: clamp(78px, 9vw, 142px);
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(
          circle at 34% 28%,
          rgba(255, 255, 255, 0.98),
          rgba(239, 222, 255, 0.88) 36%,
          rgba(167, 120, 226, 0.5) 68%,
          transparent 71%
        );
        box-shadow:
          0 0 34px rgba(229, 202, 255, 0.36),
          0 0 90px rgba(155, 92, 255, 0.17);
        opacity: 0.82;
      }

      .adventure-original-glow.original-glow-left {
        background: rgba(255, 62, 157, 0.4);
      }

      .adventure-original-glow.original-glow-right {
        background: rgba(116, 80, 255, 0.36);
      }

      .adventure-original-glow.original-glow-bottom {
        background: rgba(255, 87, 176, 0.22);
      }

      .adventure-star {
        background: rgba(255, 241, 252, 0.88);
        box-shadow:
          0 0 8px rgba(255, 255, 255, 0.55),
          0 0 16px rgba(194, 126, 255, 0.28);
      }

      .adventure-sakura-petals {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .adventure-sakura-petals span {
        position: absolute;
        top: -8%;
        width: 8px;
        height: 13px;
        border-radius: 78% 22% 70% 30%;
        background: linear-gradient(
          145deg,
          #ffd5ea,
          #ef78bd
        );
        box-shadow: 0 0 8px rgba(255, 112, 188, 0.32);
        opacity: 0.55;
        animation: adventure-sakura-fall linear infinite;
      }

      /* -------------------------------------------------------------------- */
      /* Numbered hotspots                                                     */
      /* -------------------------------------------------------------------- */

      .adventure-annotation-wrap {
        position: relative;
        display: grid;
        place-items: center;
      }

      .adventure-number {
        position: relative;
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        border: 6px solid var(--portfolio-paper);
        border-radius: 999px;
        outline: none;
        background: var(--portfolio-ink);
        box-shadow:
          0 10px 26px rgba(25, 12, 4, 0.34),
          0 0 0 1px rgba(58, 29, 12, 0.2);
        color: var(--portfolio-paper);
        cursor: pointer;
        transform-origin: center;
      }

      .adventure-number:focus-visible {
        box-shadow:
          0 0 0 4px var(--portfolio-orange),
          0 12px 30px rgba(25, 12, 4, 0.36);
      }

      .adventure-number:disabled {
        cursor: wait;
        opacity: 0.72;
      }

      .adventure-number-core {
        position: relative;
        z-index: 4;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.04em;
      }

      .adventure-number-ripple {
        position: absolute;
        inset: -6px;
        border: 2px solid rgba(255, 253, 247, 0.7);
        border-radius: inherit;
        pointer-events: none;
        animation: editorial-hotspot-ripple 2.4s ease-out infinite;
      }

      .adventure-number-ripple.ripple-two {
        animation-delay: 1.2s;
      }

      .adventure-number.is-selected {
        background: var(--portfolio-orange);
        box-shadow:
          0 11px 28px rgba(242, 148, 0, 0.32),
          0 0 0 1px rgba(58, 29, 12, 0.12);
      }

      /* -------------------------------------------------------------------- */
      /* Preview cards                                                         */
      /* -------------------------------------------------------------------- */

      .adventure-annotation-card {
        position: absolute;
        top: -42px;
        z-index: 10;
        width: min(390px, 82vw);
        max-height: none;
        min-width: 0;
        overflow: visible;
        border: 0;
        border-radius: 28px 28px 28px 12px;
        background: var(--portfolio-paper);
        box-shadow: var(--portfolio-paper-shadow);
        padding: 30px 28px 27px;
        color: var(--portfolio-ink);
        isolation: isolate;
        -webkit-font-smoothing: antialiased;
      }

      .adventure-annotation-card.is-left {
        right: 58px;
        left: auto;
        border-radius: 28px 28px 12px 28px;
      }

      .adventure-annotation-card.is-right {
        right: auto;
        left: 58px;
        border-radius: 28px 28px 28px 12px;
      }

      .adventure-annotation-card::after {
        content: "";
        position: absolute;
        top: 48px;
        width: 60px;
        border-top: 4px dotted var(--portfolio-ink);
        opacity: 0.88;
        pointer-events: none;
      }

      .adventure-annotation-card.is-left::after {
        left: 100%;
      }

      .adventure-annotation-card.is-right::after {
        right: 100%;
      }

      .adventure-card-pin {
        position: absolute;
        top: 43px;
        z-index: 2;
        width: 11px;
        height: 11px;
        border: 3px solid var(--portfolio-paper);
        border-radius: 999px;
        background: var(--portfolio-ink);
        box-shadow: 0 2px 7px rgba(58, 29, 12, 0.28);
      }

      .adventure-annotation-card.is-left
        .adventure-card-pin {
        right: -5px;
      }

      .adventure-annotation-card.is-right
        .adventure-card-pin {
        left: -5px;
      }

      .adventure-annotation-card.is-closing {
        pointer-events: none;
      }

      .adventure-annotation-close {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 5;
        display: grid;
        width: 32px;
        height: 32px;
        place-items: center;
        border: 1px solid var(--portfolio-line);
        border-radius: 999px;
        outline: none;
        background: transparent;
        color: var(--portfolio-ink);
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 21px;
        line-height: 1;
        transition:
          color 180ms ease,
          border-color 180ms ease,
          background 180ms ease,
          transform 180ms ease;
      }

      .adventure-annotation-close:hover {
        border-color: var(--portfolio-orange);
        background: var(--portfolio-orange);
        color: white;
        transform: rotate(7deg);
      }

      .adventure-annotation-close:focus-visible,
      .adventure-detail-button:focus-visible,
      .adventure-project-card-button:focus-visible,
      .adventure-project-external-link:focus-visible,
      .adventure-case-study-close:focus-visible,
      .adventure-contact-grid a:focus-visible {
        outline: 3px solid var(--portfolio-orange);
        outline-offset: 3px;
      }

      .adventure-annotation-card-header {
        padding-right: 34px;
      }

      .adventure-annotation-card-label {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 9px;
      }

      .adventure-annotation-card-label > span {
        width: 18px;
        height: 1px;
        flex: 0 0 auto;
        background: var(--portfolio-orange);
      }

      .adventure-annotation-card-number,
      .adventure-annotation-card-eyebrow {
        margin: 0;
        color: var(--portfolio-orange);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.16em;
        line-height: 1.4;
        text-transform: uppercase;
      }

      .adventure-annotation-card-eyebrow {
        min-width: 0;
        overflow: hidden;
        color: var(--portfolio-muted);
        letter-spacing: 0.08em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .adventure-annotation-card h2 {
        margin: 22px 0 0;
        color: var(--portfolio-ink);
        font-size: clamp(1.65rem, 2.8vw, 2.25rem);
        font-weight: 850;
        letter-spacing: -0.045em;
        line-height: 1.03;
        text-shadow: none;
      }

      .adventure-annotation-card-copy {
        display: grid;
        max-height: min(350px, 58vh);
        gap: 14px;
        margin-top: 21px;
        padding-right: 5px;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        color: var(--portfolio-ink-soft);
        font-size: 13px;
        line-height: 1.72;
        scrollbar-color:
          var(--portfolio-orange)
          rgba(58, 29, 12, 0.06);
      }

      .adventure-annotation-card-copy.is-projects {
        max-height: min(430px, 62vh);
      }

      .adventure-annotation-card-copy p {
        margin: 0;
      }

      .adventure-annotation-lead {
        color: var(--portfolio-ink);
        font-size: 15px;
        font-weight: 700;
        line-height: 1.55;
      }

      .adventure-annotation-card-copy::-webkit-scrollbar,
      .adventure-case-study-modal::-webkit-scrollbar,
      .adventure-section-detail-modal::-webkit-scrollbar {
        width: 7px;
      }

      .adventure-annotation-card-copy::-webkit-scrollbar-track,
      .adventure-case-study-modal::-webkit-scrollbar-track,
      .adventure-section-detail-modal::-webkit-scrollbar-track {
        background: rgba(58, 29, 12, 0.05);
      }

      .adventure-annotation-card-copy::-webkit-scrollbar-thumb,
      .adventure-case-study-modal::-webkit-scrollbar-thumb,
      .adventure-section-detail-modal::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: var(--portfolio-orange);
      }

      /* -------------------------------------------------------------------- */
      /* Preview buttons and project list                                      */
      /* -------------------------------------------------------------------- */

      .adventure-detail-button,
      .adventure-project-external-link {
        display: inline-flex;
        width: fit-content;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        gap: 24px;
        border: 0;
        border-radius: 999px;
        outline: none;
        background: var(--portfolio-orange);
        box-shadow: none;
        padding: 0 21px;
        color: white;
        cursor: pointer;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
        line-height: 1.2;
        text-decoration: none;
        text-transform: uppercase;
        transition:
          transform 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease;
      }

      .adventure-detail-button:hover,
      .adventure-project-external-link:hover {
        border-color: transparent;
        background: var(--portfolio-orange-dark);
        box-shadow: 0 9px 21px rgba(217, 123, 0, 0.24);
        transform: translateY(-2px);
      }

      .adventure-button-arrow {
        display: grid;
        width: 21px;
        height: 21px;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.2);
        font-size: 13px;
      }

      .adventure-project-preview-list {
        display: grid;
        gap: 8px;
      }

      .adventure-project-card-button {
        position: relative;
        display: grid;
        width: 100%;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        overflow: hidden;
        border: 1px solid var(--portfolio-line);
        border-radius: 16px;
        outline: none;
        background: #fffaf0;
        padding: 13px 14px;
        color: var(--portfolio-ink);
        cursor: pointer;
        text-align: left;
        transition:
          transform 200ms ease,
          border-color 200ms ease,
          background 200ms ease,
          box-shadow 200ms ease;
      }

      .adventure-project-card-button::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--portfolio-orange);
        opacity: 0;
        transform: scaleX(0);
        transform-origin: left;
        transition:
          opacity 200ms ease,
          transform 300ms ease;
      }

      .adventure-project-card-button:hover {
        border-color: rgba(242, 148, 0, 0.52);
        background: white;
        box-shadow: 0 10px 24px rgba(58, 29, 12, 0.09);
        transform: translateY(-3px);
      }

      .adventure-project-card-button:hover::after {
        opacity: 1;
        transform: scaleX(1);
      }

      .adventure-project-index {
        color: var(--portfolio-orange);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.1em;
      }

      .adventure-project-card-main {
        display: grid;
        min-width: 0;
        gap: 4px;
      }

      .adventure-project-card-button strong {
        overflow: hidden;
        color: var(--portfolio-ink);
        font-size: 13px;
        letter-spacing: -0.01em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .adventure-project-technologies {
        overflow: hidden;
        color: var(--portfolio-muted);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.07em;
        line-height: 1.45;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .adventure-project-card-arrow {
        display: grid;
        width: 28px;
        height: 28px;
        place-items: center;
        border-radius: 999px;
        background: var(--portfolio-orange-soft);
        color: var(--portfolio-orange-dark);
        font-size: 13px;
        transition:
          color 180ms ease,
          background 180ms ease,
          transform 180ms ease;
      }

      .adventure-project-card-button:hover
        .adventure-project-card-arrow {
        background: var(--portfolio-orange);
        color: white;
        transform: translateX(2px);
      }

      /* -------------------------------------------------------------------- */
      /* Bottom navigation                                                     */
      /* -------------------------------------------------------------------- */

      .adventure-bottom-nav {
        border: 1px solid rgba(58, 29, 12, 0.1);
        background: rgba(255, 253, 247, 0.9);
        box-shadow:
          0 15px 36px rgba(20, 10, 3, 0.24),
          0 0 0 1px rgba(255, 255, 255, 0.36) inset;
        backdrop-filter: blur(18px);
      }

      .adventure-bottom-nav button {
        color: var(--portfolio-ink-soft);
      }

      .adventure-bottom-nav button:hover,
      .adventure-bottom-nav button.is-active {
        background: var(--portfolio-orange);
        box-shadow: none;
        color: white;
      }

      /* -------------------------------------------------------------------- */
      /* Full-screen views                                                     */
      /* -------------------------------------------------------------------- */

      .adventure-case-study-backdrop,
      .adventure-section-detail-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: block;
        overflow: hidden;
        padding: 0;
        background: rgba(55, 29, 10, 0.28);
        backdrop-filter: blur(14px);
      }

      .adventure-case-study-modal,
      .adventure-section-detail-modal {
        position: relative;
        width: 100vw;
        max-width: none;
        height: 100dvh;
        max-height: none;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
        border: 0;
        border-radius: 0;
        background:
          radial-gradient(
            circle at 12% 5%,
            rgba(255, 255, 255, 0.44),
            transparent 30%
          ),
          linear-gradient(
            180deg,
            #f5e9c4 0%,
            var(--portfolio-canvas) 52%,
            #efdcaa 100%
          );
        box-shadow: none;
        color: var(--portfolio-ink);
        padding:
          clamp(82px, 9vw, 138px)
          clamp(24px, 8vw, 150px)
          clamp(80px, 9vw, 140px);
        scrollbar-color:
          var(--portfolio-orange)
          rgba(58, 29, 12, 0.06);
      }

      .adventure-case-study-modal::before,
      .adventure-section-detail-modal::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 10px;
        background:
          linear-gradient(
            90deg,
            var(--portfolio-orange) 0 23%,
            #eb3f2d 23% 48%,
            #f3bf00 48% 73%,
            #14a89b 73% 100%
          );
        pointer-events: none;
      }

      .adventure-case-study-close {
        position: sticky;
        top: 20px;
        z-index: 20;
        display: grid;
        float: right;
        width: 44px;
        height: 44px;
        margin: 0 0 -44px auto;
        place-items: center;
        border: 0;
        border-radius: 999px;
        outline: none;
        background: var(--portfolio-ink);
        box-shadow: 0 9px 22px rgba(58, 29, 12, 0.2);
        color: white;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 26px;
        line-height: 1;
        transition:
          color 180ms ease,
          background 180ms ease,
          transform 180ms ease;
      }

      .adventure-case-study-close:hover {
        background: var(--portfolio-orange);
        color: white;
        transform: rotate(7deg);
      }

      .adventure-full-view-body {
        width: 100%;
        min-height: 100%;
      }

      /* -------------------------------------------------------------------- */
      /* Full view headers                                                     */
      /* -------------------------------------------------------------------- */

      .adventure-section-detail-header,
      .adventure-case-study-header {
        position: relative;
        width: min(100%, 900px);
        margin: 0 auto clamp(58px, 7vw, 96px);
        border: 0;
        border-radius: 0;
        background: transparent;
        padding: 0;
        text-align: center;
      }

      .adventure-section-detail-header > p,
      .adventure-case-study-header > p:first-child,
      .adventure-detail-kicker,
      .adventure-section-heading > p {
        margin: 0;
        color: var(--portfolio-orange);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.22em;
        line-height: 1.5;
        text-transform: uppercase;
      }

      .adventure-section-detail-header h2,
      .adventure-case-study-header h2 {
        margin: 18px 0 0;
        color: var(--portfolio-ink);
        font-size: clamp(2.7rem, 7vw, 6.8rem);
        font-weight: 850;
        letter-spacing: -0.065em;
        line-height: 0.94;
        text-shadow: none;
      }

      .adventure-section-detail-header strong {
        display: block;
        margin-top: 22px;
        color: var(--portfolio-orange-dark);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.13em;
        line-height: 1.6;
        text-transform: uppercase;
      }

      .adventure-section-detail-intro,
      .adventure-case-study-summary {
        max-width: 760px;
        margin: 25px auto 0;
        color: var(--portfolio-ink-soft);
        font-size: clamp(14px, 1.35vw, 17px);
        line-height: 1.85;
      }

      .adventure-case-study-meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 9px;
        margin-top: 24px;
      }

      .adventure-case-study-meta span {
        display: inline-flex;
        gap: 8px;
        border: 1px solid var(--portfolio-line);
        border-radius: 999px;
        background: rgba(255, 253, 247, 0.52);
        padding: 8px 13px;
        color: var(--portfolio-ink-soft);
        font-size: 11px;
      }

      .adventure-case-study-meta b {
        color: var(--portfolio-orange-dark);
      }

      .adventure-project-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 24px;
      }

      /* -------------------------------------------------------------------- */
      /* About and credits content                                             */
      /* -------------------------------------------------------------------- */

      .adventure-section-block,
      .adventure-detail-grid {
        width: min(100%, 1120px);
        margin-right: auto;
        margin-left: auto;
      }

      .adventure-section-block {
        margin-top: clamp(62px, 8vw, 110px);
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        padding: 0;
      }

      .adventure-section-heading {
        margin-bottom: 23px;
      }

      .adventure-section-heading h3 {
        margin: 9px 0 0;
        color: var(--portfolio-ink);
        font-size: clamp(1.8rem, 3.7vw, 3.3rem);
        font-weight: 850;
        letter-spacing: -0.045em;
        line-height: 1;
      }

      .adventure-detail-grid,
      .adventure-skill-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .adventure-detail-grid--three {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .adventure-section-detail-header
        + .adventure-detail-grid--three {
        margin-top: 0;
      }

      .adventure-detail-card,
      .adventure-skill-card,
      .adventure-experience-card,
      .adventure-project-highlight-list article {
        min-width: 0;
        border: 1px solid var(--portfolio-line);
        border-radius: 22px;
        background: rgba(255, 253, 247, 0.76);
        box-shadow:
          0 13px 35px rgba(58, 29, 12, 0.07),
          0 1px 0 rgba(255, 255, 255, 0.65) inset;
        padding: 24px;
        transition:
          transform 200ms ease,
          border-color 200ms ease,
          box-shadow 200ms ease;
      }

      .adventure-detail-card:hover,
      .adventure-skill-card:hover,
      .adventure-experience-card:hover {
        border-color: rgba(242, 148, 0, 0.42);
        box-shadow:
          0 18px 42px rgba(58, 29, 12, 0.11),
          0 1px 0 rgba(255, 255, 255, 0.75) inset;
        transform: translateY(-4px);
      }

      .adventure-detail-card h3,
      .adventure-detail-card h4,
      .adventure-skill-card h4,
      .adventure-experience-card h4,
      .adventure-project-highlight-list h4 {
        margin: 10px 0 0;
        color: var(--portfolio-ink);
        font-size: 17px;
        font-weight: 800;
        line-height: 1.25;
      }

      .adventure-detail-card p,
      .adventure-skill-card p,
      .adventure-project-highlight-list p {
        margin: 10px 0 0;
        color: var(--portfolio-ink-soft);
        font-size: 13px;
        line-height: 1.75;
      }

      .adventure-detail-card strong,
      .adventure-experience-card strong {
        display: block;
        margin-top: 7px;
        color: var(--portfolio-orange-dark);
        font-size: 12px;
      }

      .adventure-detail-card ul,
      .adventure-skill-card ul,
      .adventure-experience-card ul {
        display: grid;
        gap: 7px;
        margin: 14px 0 0;
        padding-left: 18px;
        color: var(--portfolio-ink-soft);
        font-size: 13px;
        line-height: 1.65;
      }

      .adventure-experience-list {
        display: grid;
        gap: 13px;
      }

      .adventure-experience-card {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 0 20px;
      }

      .adventure-experience-index {
        color: var(--portfolio-orange);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.14em;
      }

      .adventure-experience-heading {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 15px;
      }

      .adventure-experience-card h4 {
        margin-top: 0;
      }

      .adventure-experience-card time {
        color: var(--portfolio-muted);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-align: right;
      }

      .adventure-experience-card > p,
      .adventure-experience-card > ul {
        grid-column: 2;
      }

      .adventure-experience-card > p {
        margin: 14px 0 0;
        color: var(--portfolio-ink-soft);
        font-size: 13px;
        line-height: 1.65;
      }

      .adventure-skill-card
        .adventure-case-study-tags {
        margin-top: 15px;
      }

      .adventure-credit-feature {
        width: min(100%, 760px);
      }

      .adventure-connect-section {
        padding-bottom: 30px;
      }

      .adventure-contact-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .adventure-contact-grid a {
        display: grid;
        gap: 7px;
        overflow-wrap: anywhere;
        border: 1px solid var(--portfolio-line);
        border-radius: 18px;
        background: rgba(255, 253, 247, 0.72);
        padding: 19px;
        color: var(--portfolio-ink);
        text-decoration: none;
        transition:
          transform 180ms ease,
          border-color 180ms ease,
          background 180ms ease;
      }

      .adventure-contact-grid a span {
        color: var(--portfolio-muted);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .adventure-contact-grid a strong {
        font-size: 13px;
      }

      .adventure-contact-grid a:hover {
        border-color: var(--portfolio-orange);
        background: var(--portfolio-paper);
        transform: translateY(-3px);
      }

      .adventure-detail-location {
        margin: 15px 0 0;
        color: var(--portfolio-muted);
        font-size: 12px;
      }

      /* -------------------------------------------------------------------- */
      /* Project case studies                                                  */
      /* -------------------------------------------------------------------- */

      .adventure-case-study-grid {
        display: grid;
        width: min(100%, 1180px);
        grid-template-columns:
          minmax(0, 1.12fr)
          minmax(320px, 0.88fr);
        gap: clamp(30px, 5vw, 70px);
        margin: 0 auto;
      }

      .adventure-case-study-gallery,
      .adventure-case-study-content {
        min-width: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        padding: 0;
      }

      .adventure-case-study-gallery {
        align-self: start;
      }

      .adventure-case-study-main-image,
      .adventure-case-study-empty-gallery {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
        border: 10px solid rgba(255, 253, 247, 0.9);
        border-radius: 24px;
        background: var(--portfolio-paper);
        box-shadow: 0 25px 60px rgba(58, 29, 12, 0.16);
        object-fit: contain;
      }

      .adventure-case-study-empty-gallery {
        display: grid;
        box-sizing: border-box;
        place-content: center;
        gap: 8px;
        padding: 30px;
        color: var(--portfolio-ink-soft);
        text-align: center;
      }

      .adventure-case-study-empty-gallery p {
        margin: 0;
        font-size: 13px;
        line-height: 1.65;
      }

      .adventure-case-study-empty-gallery code {
        color: var(--portfolio-orange-dark);
      }

      .adventure-case-study-thumbnails {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 9px;
        margin-top: 14px;
      }

      .adventure-case-study-thumbnails button {
        overflow: hidden;
        border: 3px solid transparent;
        border-radius: 13px;
        outline: none;
        background: rgba(255, 253, 247, 0.55);
        padding: 0;
        cursor: pointer;
        opacity: 0.58;
        transition:
          opacity 180ms ease,
          border-color 180ms ease,
          box-shadow 180ms ease;
      }

      .adventure-case-study-thumbnails
        button.is-active,
      .adventure-case-study-thumbnails button:hover {
        border-color: var(--portfolio-orange);
        box-shadow: 0 8px 19px rgba(58, 29, 12, 0.13);
        opacity: 1;
      }

      .adventure-case-study-thumbnails img {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
      }

      .adventure-case-study-video {
        width: 100%;
        margin-top: 18px;
        border: 8px solid var(--portfolio-paper);
        border-radius: 22px;
        background: #120b06;
        box-shadow: 0 20px 45px rgba(58, 29, 12, 0.16);
      }

      .adventure-case-study-content {
        display: grid;
        align-content: start;
        gap: 36px;
        color: var(--portfolio-ink-soft);
        font-size: 14px;
        line-height: 1.75;
      }

      .adventure-case-study-section {
        padding-bottom: 34px;
        border-bottom: 1px solid var(--portfolio-line);
      }

      .adventure-case-study-section:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }

      .adventure-case-study-content h3 {
        margin: 9px 0 13px;
        color: var(--portfolio-ink);
        font-size: 24px;
        letter-spacing: -0.025em;
      }

      .adventure-case-study-content ul {
        display: grid;
        gap: 9px;
        margin: 0;
        padding-left: 19px;
      }

      .adventure-case-study-overview {
        display: grid;
        gap: 12px;
      }

      .adventure-case-study-overview p {
        margin: 0;
      }

      .adventure-project-highlight-list {
        display: grid;
        gap: 9px;
      }

      .adventure-project-highlight-list article {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 14px;
        border-radius: 16px;
        padding: 15px;
      }

      .adventure-project-highlight-list article > span {
        color: var(--portfolio-orange);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.12em;
      }

      .adventure-project-highlight-list h4 {
        margin: 0;
      }

      .adventure-project-highlight-list p {
        margin-top: 6px;
      }

      .adventure-case-study-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .adventure-case-study-tags span {
        border: 1px solid rgba(242, 148, 0, 0.26);
        border-radius: 999px;
        background: var(--portfolio-orange-soft);
        padding: 7px 10px;
        color: var(--portfolio-orange-dark);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      /* -------------------------------------------------------------------- */
      /* Mobile preview                                                        */
      /* -------------------------------------------------------------------- */

      .adventure-mobile-annotation-layer {
        pointer-events: none;
      }

      .adventure-annotation-card--mobile {
        pointer-events: auto;
        position: relative;
        inset: auto;
        width: min(430px, 100%);
        max-height:
          calc(
            100dvh -
              108px -
              env(safe-area-inset-bottom)
          );
        border-radius: 28px 28px 14px 14px;
        transform-origin: center bottom;
      }

      .adventure-annotation-card--mobile::after,
      .adventure-annotation-card--mobile
        .adventure-card-pin {
        display: none;
      }

      /* -------------------------------------------------------------------- */
      /* Animations                                                            */
      /* -------------------------------------------------------------------- */

      @keyframes editorial-hotspot-ripple {
        0% {
          opacity: 0;
          transform: scale(0.78);
        }

        20% {
          opacity: 0.7;
        }

        100% {
          opacity: 0;
          transform: scale(1.85);
        }
      }

      @keyframes adventure-sakura-fall {
        from {
          transform:
            translate3d(0, -10vh, 0)
            rotate(0deg);
        }

        to {
          transform:
            translate3d(11vw, 115vh, 0)
            rotate(620deg);
        }
      }

      /* -------------------------------------------------------------------- */
      /* Responsive full views                                                 */
      /* -------------------------------------------------------------------- */

      @media (max-width: 900px) {
        .adventure-case-study-modal,
        .adventure-section-detail-modal {
          padding:
            74px
            24px
            80px;
        }

        .adventure-case-study-grid {
          grid-template-columns: 1fr;
          gap: 48px;
        }

        .adventure-detail-grid--three {
          grid-template-columns: 1fr;
        }

        .adventure-contact-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 767px) {
        .adventure-sakura-moon {
          top: 8%;
          right: 7%;
          width: 88px;
        }

        .adventure-number {
          width: 38px;
          height: 38px;
          border-width: 5px;
        }

        .adventure-annotation-card {
          padding: 25px 22px 23px;
        }

        .adventure-annotation-card h2 {
          font-size: 1.75rem;
        }

        .adventure-annotation-card-copy {
          max-height:
            calc(
              100dvh -
                265px -
                env(safe-area-inset-bottom)
            );
          font-size: 12px;
        }

        .adventure-annotation-card-copy.is-projects {
          max-height:
            calc(
              100dvh -
                240px -
                env(safe-area-inset-bottom)
            );
        }

        .adventure-project-card-button {
          gap: 9px;
          padding: 11px;
        }

        .adventure-project-card-arrow {
          width: 25px;
          height: 25px;
        }

        .adventure-case-study-modal,
        .adventure-section-detail-modal {
          width: 100vw;
          height: 100dvh;
          max-height: none;
          border-radius: 0;
          padding:
            68px
            18px
            calc(70px + env(safe-area-inset-bottom));
        }

        .adventure-case-study-close {
          top: 13px;
          width: 40px;
          height: 40px;
          margin-bottom: -40px;
        }

        .adventure-section-detail-header,
        .adventure-case-study-header {
          margin-bottom: 48px;
          padding-right: 0;
          text-align: left;
        }

        .adventure-section-detail-header h2,
        .adventure-case-study-header h2 {
          margin-top: 14px;
          font-size: clamp(2.45rem, 14vw, 4.2rem);
        }

        .adventure-section-detail-intro,
        .adventure-case-study-summary {
          margin-right: 0;
          margin-left: 0;
          font-size: 14px;
          line-height: 1.75;
        }

        .adventure-case-study-meta,
        .adventure-project-links {
          justify-content: flex-start;
        }

        .adventure-detail-grid,
        .adventure-detail-grid--three,
        .adventure-skill-grid {
          grid-template-columns: 1fr;
        }

        .adventure-section-block {
          margin-top: 62px;
        }

        .adventure-detail-card,
        .adventure-skill-card,
        .adventure-experience-card {
          padding: 19px;
        }

        .adventure-experience-card {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .adventure-experience-index {
          display: block;
        }

        .adventure-experience-heading {
          grid-template-columns: 1fr;
          gap: 5px;
        }

        .adventure-experience-card time {
          text-align: left;
        }

        .adventure-experience-card > p,
        .adventure-experience-card > ul {
          grid-column: 1;
        }

        .adventure-case-study-main-image,
        .adventure-case-study-empty-gallery {
          border-width: 6px;
          border-radius: 18px;
        }

        .adventure-case-study-thumbnails {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .adventure-case-study-content {
          gap: 31px;
        }

        .adventure-case-study-content h3 {
          font-size: 21px;
        }

        .adventure-bottom-nav {
          max-width: calc(100vw - 20px);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .adventure-bottom-nav::-webkit-scrollbar {
          display: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .adventure-sakura-petals span,
        .adventure-number-ripple {
          animation: none;
        }

        .adventure-number,
        .adventure-annotation-close,
        .adventure-detail-button,
        .adventure-project-card-button,
        .adventure-project-card-arrow,
        .adventure-project-external-link,
        .adventure-case-study-close,
        .adventure-detail-card,
        .adventure-skill-card,
        .adventure-experience-card {
          scroll-behavior: auto;
          transition-duration: 0.01ms;
        }
      }
    `}</style>
  );
}