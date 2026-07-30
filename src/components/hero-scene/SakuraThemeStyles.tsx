export default function SakuraThemeStyles() {
  return (
    <style jsx global>{`
      :root {
        color-scheme: dark;

        --portfolio-paper: #100c25;
        --portfolio-paper-soft: #171031;

        --portfolio-canvas: #080612;
        --portfolio-canvas-deep: #03030b;

        --portfolio-ink: #fff7fd;
        --portfolio-ink-soft: rgba(244, 238, 255, 0.76);
        --portfolio-muted: #caa8ff;

        /*
         * The existing variable names are kept so the
         * component structure does not need to change.
         */
        --portfolio-orange: #ff68b7;
        --portfolio-orange-dark: #ff3f9f;
        --portfolio-orange-soft: rgba(255, 104, 183, 0.12);

        --portfolio-violet: #9a5cff;
        --portfolio-cyan: #69dfff;

        --portfolio-line: rgba(232, 144, 255, 0.2);
        --portfolio-line-strong: rgba(232, 144, 255, 0.36);

        --portfolio-gradient: linear-gradient(
          105deg,
          var(--portfolio-violet),
          var(--portfolio-orange-dark)
        );

        --portfolio-card-background:
          radial-gradient(
            circle at 92% 5%,
            rgba(154, 92, 255, 0.17),
            transparent 35%
          ),
          radial-gradient(
            circle at 5% 96%,
            rgba(255, 63, 159, 0.1),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            rgba(20, 14, 42, 0.98),
            rgba(8, 8, 23, 0.97)
          );

        --portfolio-paper-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.035) inset,
          0 0 31px rgba(193, 74, 239, 0.19),
          0 30px 80px rgba(0, 0, 0, 0.6);
      }

      /* ================================================================ */
      /* Typography                                                       */
      /* ================================================================ */

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

      /* ================================================================ */
      /* Existing night scene atmosphere                                  */
      /* ================================================================ */

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

        box-shadow:
          0 0 8px rgba(255, 112, 188, 0.32);

        opacity: 0.55;

        animation:
          adventure-sakura-fall
          linear
          infinite;
      }

      /* ================================================================ */
      /* Numbered hotspots                                                */
      /* ================================================================ */

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

        border: 6px solid rgba(255, 247, 253, 0.94);
        border-radius: 999px;
        outline: none;

        background: var(--portfolio-gradient);

        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.14) inset,
          0 0 20px rgba(255, 75, 174, 0.46),
          0 12px 30px rgba(0, 0, 0, 0.56);

        color: #ffffff;
        cursor: pointer;

        transform-origin: center;

        transition:
          border-color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .adventure-number:hover,
      .adventure-number.is-selected {
        border-color: #ffffff;

        background: linear-gradient(
          135deg,
          #b477ff,
          #ff4aa9
        );

        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.18) inset,
          0 0 29px rgba(255, 75, 174, 0.68),
          0 0 50px rgba(154, 92, 255, 0.23),
          0 14px 34px rgba(0, 0, 0, 0.6);

        transform: scale(1.04);
      }

      .adventure-number:focus-visible {
        box-shadow:
          0 0 0 4px rgba(105, 223, 255, 0.9),
          0 0 28px rgba(255, 75, 174, 0.65),
          0 14px 34px rgba(0, 0, 0, 0.6);
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

        border: 2px solid rgba(255, 104, 183, 0.72);
        border-radius: inherit;

        box-shadow:
          0 0 12px rgba(255, 95, 183, 0.25);

        pointer-events: none;

        animation:
          editorial-hotspot-ripple
          2.4s
          ease-out
          infinite;
      }

      .adventure-number-ripple.ripple-two {
        animation-delay: 1.2s;
      }

      /* ================================================================ */
      /* Preview cards                                                    */
      /* ================================================================ */

      .adventure-annotation-card {
        position: absolute;
        top: -42px;
        z-index: 10;

        width: min(390px, 82vw);
        max-height: none;
        min-width: 0;

        overflow: visible;

        border: 1px solid var(--portfolio-line);
        border-radius: 28px 28px 28px 12px;

        background: var(--portfolio-card-background);

        box-shadow: var(--portfolio-paper-shadow);

        padding: 30px 28px 27px;

        color: var(--portfolio-ink);

        isolation: isolate;

        backdrop-filter:
          blur(24px)
          saturate(1.16);

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

        border-top:
          4px dotted
          rgba(255, 104, 183, 0.86);

        opacity: 0.88;

        filter:
          drop-shadow(
            0 0 4px
            rgba(255, 95, 183, 0.5)
          );

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

        background: var(--portfolio-orange);

        box-shadow:
          0 0 12px rgba(255, 95, 183, 0.8),
          0 2px 8px rgba(0, 0, 0, 0.5);
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

      /* ================================================================ */
      /* Preview close button                                             */
      /* ================================================================ */

      .adventure-annotation-close {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 5;

        display: grid;
        width: 32px;
        height: 32px;
        place-items: center;

        border:
          1px solid
          rgba(237, 148, 255, 0.28);

        border-radius: 999px;
        outline: none;

        background:
          linear-gradient(
            135deg,
            rgba(154, 92, 255, 0.16),
            rgba(255, 63, 159, 0.1)
          ),
          rgba(13, 9, 31, 0.84);

        box-shadow:
          0 0 15px rgba(193, 74, 239, 0.14),
          0 5px 14px rgba(0, 0, 0, 0.24);

        color: var(--portfolio-ink);
        cursor: pointer;

        font-family: Arial, sans-serif;
        font-size: 21px;
        line-height: 1;

        transition:
          color 180ms ease,
          border-color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .adventure-annotation-close:hover {
        border-color: rgba(255, 139, 211, 0.8);

        background: var(--portfolio-gradient);

        color: #ffffff;

        box-shadow:
          0 0 20px rgba(255, 75, 175, 0.36),
          0 7px 18px rgba(0, 0, 0, 0.3);

        transform: rotate(7deg);
      }

      /* ================================================================ */
      /* Preview card typography                                         */
      /* ================================================================ */

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

        background: linear-gradient(
          90deg,
          var(--portfolio-violet),
          var(--portfolio-orange)
        );

        box-shadow:
          0 0 9px rgba(255, 95, 183, 0.45);
      }

      .adventure-annotation-card-number,
      .adventure-annotation-card-eyebrow {
        margin: 0;

        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.16em;
        line-height: 1.4;
        text-transform: uppercase;
      }

      .adventure-annotation-card-number {
        color: var(--portfolio-orange);

        text-shadow:
          0 0 12px rgba(255, 95, 183, 0.32);
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

        font-size:
          clamp(
            1.65rem,
            2.8vw,
            2.25rem
          );

        font-weight: 850;
        letter-spacing: -0.045em;
        line-height: 1.03;

        text-shadow:
          0 0 22px rgba(255, 100, 186, 0.17),
          0 0 38px rgba(154, 92, 255, 0.08);
      }

      .adventure-annotation-card-copy {
        display: grid;

        max-height:
          min(
            350px,
            58vh
          );

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
          rgba(255, 255, 255, 0.035);
      }

      .adventure-annotation-card-copy.is-projects {
        max-height:
          min(
            430px,
            62vh
          );
      }

      .adventure-annotation-card-copy p {
        margin: 0;

        color: var(--portfolio-ink-soft);
      }

      .adventure-annotation-lead {
        color: #fff5fc;

        font-size: 15px;
        font-weight: 700;
        line-height: 1.55;
      }

      /* ================================================================ */
      /* Scrollbars                                                       */
      /* ================================================================ */

      .adventure-annotation-card-copy::-webkit-scrollbar,
      .adventure-case-study-modal::-webkit-scrollbar,
      .adventure-section-detail-modal::-webkit-scrollbar {
        width: 7px;
      }

      .adventure-annotation-card-copy::-webkit-scrollbar-track,
      .adventure-case-study-modal::-webkit-scrollbar-track,
      .adventure-section-detail-modal::-webkit-scrollbar-track {
        background:
          rgba(
            255,
            255,
            255,
            0.025
          );
      }

      .adventure-annotation-card-copy::-webkit-scrollbar-thumb,
      .adventure-case-study-modal::-webkit-scrollbar-thumb,
      .adventure-section-detail-modal::-webkit-scrollbar-thumb {
        border-radius: 999px;

        background: linear-gradient(
          180deg,
          var(--portfolio-violet),
          var(--portfolio-orange)
        );

        box-shadow:
          0 0 9px rgba(255, 95, 183, 0.25);
      }

      /* ================================================================ */
      /* Main buttons                                                     */
      /* ================================================================ */

      .adventure-detail-button,
      .adventure-project-external-link {
        display: inline-flex;

        width: fit-content;
        min-height: 44px;

        align-items: center;
        justify-content: center;

        gap: 24px;

        border:
          1px solid
          rgba(255, 139, 213, 0.34);

        border-radius: 999px;
        outline: none;

        background: var(--portfolio-gradient);

        box-shadow:
          0 0 18px rgba(255, 75, 175, 0.21),
          0 8px 22px rgba(0, 0, 0, 0.28);

        padding: 0 21px;

        color: #ffffff;
        cursor: pointer;

        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
        line-height: 1.2;
        text-decoration: none;
        text-transform: uppercase;

        transition:
          transform 180ms ease,
          border-color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease,
          filter 180ms ease;
      }

      .adventure-detail-button:hover,
      .adventure-project-external-link:hover {
        border-color:
          rgba(
            105,
            223,
            255,
            0.58
          );

        background: linear-gradient(
          90deg,
          #8d55f6,
          #ff4aa9
        );

        box-shadow:
          0 0 25px rgba(244, 72, 180, 0.37),
          0 11px 25px rgba(0, 0, 0, 0.34);

        filter: brightness(1.08);

        transform: translateY(-2px);
      }

      .adventure-button-arrow {
        display: grid;

        width: 21px;
        height: 21px;

        place-items: center;

        border-radius: 999px;

        background:
          rgba(
            255,
            255,
            255,
            0.18
          );

        color: #ffffff;

        font-size: 13px;
      }

      /* ================================================================ */
      /* Project cards inside the preview                                 */
      /* ================================================================ */

      .adventure-project-preview-list {
        display: grid;
        gap: 8px;
      }

      .adventure-project-card-button {
        position: relative;

        display: grid;
        width: 100%;

        grid-template-columns:
          auto
          minmax(0, 1fr)
          auto;

        align-items: center;

        gap: 12px;

        overflow: hidden;

        border:
          1px solid
          rgba(236, 153, 255, 0.18);

        border-radius: 16px;
        outline: none;

        background:
          linear-gradient(
            135deg,
            rgba(115, 67, 173, 0.14),
            rgba(255, 71, 166, 0.07)
          ),
          rgba(255, 255, 255, 0.025);

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

        background: linear-gradient(
          90deg,
          var(--portfolio-violet),
          var(--portfolio-orange),
          var(--portfolio-cyan)
        );

        box-shadow:
          0 0 13px rgba(255, 94, 183, 0.48);

        opacity: 0;

        transform: scaleX(0);
        transform-origin: left;

        transition:
          opacity 200ms ease,
          transform 300ms ease;
      }

      .adventure-project-card-button:hover {
        border-color:
          rgba(
            255,
            128,
            208,
            0.56
          );

        background:
          linear-gradient(
            135deg,
            rgba(135, 70, 210, 0.21),
            rgba(255, 71, 166, 0.13)
          ),
          rgba(255, 255, 255, 0.04);

        box-shadow:
          0 12px 30px rgba(114, 42, 159, 0.24),
          0 0 20px rgba(255, 76, 173, 0.14);

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

        background:
          rgba(
            154,
            92,
            255,
            0.17
          );

        color: var(--portfolio-orange);

        font-size: 13px;

        transition:
          color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .adventure-project-card-button:hover
        .adventure-project-card-arrow {
        background: var(--portfolio-gradient);

        color: #ffffff;

        box-shadow:
          0 0 14px rgba(255, 95, 183, 0.28);

        transform: translateX(2px);
      }

      /* ================================================================ */
      /* Bottom navigation                                                */
      /* ================================================================ */

      .adventure-bottom-nav {
        border:
          1px solid
          rgba(234, 147, 255, 0.26);

        background:
          linear-gradient(
            135deg,
            rgba(154, 92, 255, 0.07),
            rgba(255, 63, 159, 0.04)
          ),
          rgba(10, 7, 25, 0.86);

        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.035) inset,
          0 0 26px rgba(167, 66, 222, 0.16),
          0 15px 36px rgba(0, 0, 0, 0.46);

        backdrop-filter:
          blur(20px)
          saturate(1.15);
      }

      .adventure-bottom-nav button {
        color: #d9c4ee;
      }

      .adventure-bottom-nav button span {
        color: var(--portfolio-orange);
      }

      .adventure-bottom-nav button:hover,
      .adventure-bottom-nav button.is-active {
        background: var(--portfolio-gradient);

        box-shadow:
          0 0 19px rgba(231, 78, 187, 0.36),
          0 7px 18px rgba(0, 0, 0, 0.24);

        color: #ffffff;
      }

      .adventure-bottom-nav button:hover span,
      .adventure-bottom-nav button.is-active span {
        color: #ffffff;
      }

      /* ================================================================ */
      /* Full-screen backdrops                                            */
      /* ================================================================ */

      .adventure-case-study-backdrop,
      .adventure-section-detail-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;

        display: block;

        overflow: hidden;

        padding: 0;

        background:
          radial-gradient(
            circle at 16% 14%,
            rgba(142, 76, 225, 0.2),
            transparent 32%
          ),
          radial-gradient(
            circle at 85% 84%,
            rgba(255, 67, 163, 0.15),
            transparent 36%
          ),
          rgba(3, 3, 11, 0.88);

        backdrop-filter:
          blur(14px)
          saturate(1.08);
      }

      /* ================================================================ */
      /* Full-screen modal panels                                         */
      /* ================================================================ */

      .adventure-case-study-modal,
      .adventure-section-detail-modal {
        position: relative;

        width: 100vw;
        max-width: none;

        height: 100dvh;
        max-height: none;

        box-sizing: border-box;

        overflow-x: hidden;
        overflow-y: auto;

        border: 0;
        border-radius: 0;

        background:
          radial-gradient(
            circle at 86% 4%,
            rgba(118, 76, 222, 0.19),
            transparent 30%
          ),
          radial-gradient(
            circle at 8% 88%,
            rgba(255, 63, 159, 0.13),
            transparent 34%
          ),
          radial-gradient(
            circle at 52% 112%,
            rgba(105, 223, 255, 0.075),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            #0b081a 0%,
            #070511 53%,
            #03030a 100%
          );

        box-shadow: none;

        padding:
          clamp(82px, 9vw, 138px)
          clamp(24px, 8vw, 150px)
          clamp(80px, 9vw, 140px);

        color: var(--portfolio-ink);

        scrollbar-color:
          var(--portfolio-orange)
          rgba(255, 255, 255, 0.035);
      }

      .adventure-case-study-modal::before,
      .adventure-section-detail-modal::before {
        content: "";

        position: absolute;
        top: 0;
        right: 0;
        left: 0;

        height: 10px;

        background: linear-gradient(
          90deg,
          var(--portfolio-violet) 0%,
          var(--portfolio-orange-dark) 43%,
          var(--portfolio-orange) 69%,
          var(--portfolio-cyan) 100%
        );

        box-shadow:
          0 0 25px rgba(255, 75, 174, 0.36),
          0 0 50px rgba(154, 92, 255, 0.17);

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

        border:
          1px solid
          rgba(237, 148, 255, 0.3);

        border-radius: 999px;
        outline: none;

        background: var(--portfolio-gradient);

        box-shadow:
          0 0 20px rgba(255, 75, 175, 0.28),
          0 10px 27px rgba(0, 0, 0, 0.47);

        color: #ffffff;
        cursor: pointer;

        font-family: Arial, sans-serif;
        font-size: 26px;
        line-height: 1;

        transition:
          color 180ms ease,
          border-color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .adventure-case-study-close:hover {
        border-color: var(--portfolio-cyan);

        background: linear-gradient(
          135deg,
          #ae76ff,
          #ff5fb7
        );

        color: #ffffff;

        box-shadow:
          0 0 27px rgba(255, 75, 175, 0.46),
          0 0 13px rgba(105, 223, 255, 0.18);

        transform: rotate(7deg);
      }

      .adventure-full-view-body {
        width: 100%;
        min-height: 100%;
      }

      /* ================================================================ */
      /* Full-view headers                                                */
      /* ================================================================ */

      .adventure-section-detail-header,
      .adventure-case-study-header {
        position: relative;

        width: min(100%, 900px);

        margin:
          0
          auto
          clamp(58px, 7vw, 96px);

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

        text-shadow:
          0 0 14px rgba(255, 95, 183, 0.28);
      }

      .adventure-section-detail-header h2,
      .adventure-case-study-header h2 {
        margin: 18px 0 0;

        color: var(--portfolio-ink);

        font-size:
          clamp(
            2.7rem,
            7vw,
            6.8rem
          );

        font-weight: 850;
        letter-spacing: -0.065em;
        line-height: 0.94;

        text-shadow:
          0 0 25px rgba(255, 94, 183, 0.15),
          0 0 56px rgba(154, 92, 255, 0.09);
      }

      .adventure-section-detail-header strong {
        display: block;

        margin-top: 22px;

        color: #d8b8ff;

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

        font-size:
          clamp(
            14px,
            1.35vw,
            17px
          );

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

        border:
          1px solid
          rgba(222, 140, 255, 0.21);

        border-radius: 999px;

        background:
          rgba(
            157,
            83,
            220,
            0.11
          );

        padding: 8px 13px;

        color: #dfc4ff;

        font-size: 11px;
      }

      .adventure-case-study-meta b {
        color: var(--portfolio-orange);
      }

      .adventure-project-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        gap: 10px;

        margin-top: 24px;
      }

      /* ================================================================ */
      /* About and credits content                                        */
      /* ================================================================ */

      .adventure-section-block,
      .adventure-detail-grid {
        width: min(100%, 1120px);

        margin-right: auto;
        margin-left: auto;
      }

      .adventure-section-block {
        margin-top:
          clamp(
            62px,
            8vw,
            110px
          );

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

        font-size:
          clamp(
            1.8rem,
            3.7vw,
            3.3rem
          );

        font-weight: 850;
        letter-spacing: -0.045em;
        line-height: 1;

        text-shadow:
          0 0 25px rgba(255, 94, 183, 0.12),
          0 0 45px rgba(154, 92, 255, 0.07);
      }

      .adventure-detail-grid,
      .adventure-skill-grid {
        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );

        gap: 16px;
      }

      .adventure-detail-grid--three {
        grid-template-columns:
          repeat(
            3,
            minmax(0, 1fr)
          );
      }

      .adventure-section-detail-header
        + .adventure-detail-grid--three {
        margin-top: 0;
      }

      /* ================================================================ */
      /* Information cards                                                */
      /* ================================================================ */

      .adventure-detail-card,
      .adventure-skill-card,
      .adventure-experience-card,
      .adventure-project-highlight-list article {
        min-width: 0;

        border:
          1px solid
          rgba(232, 144, 255, 0.15);

        border-radius: 22px;

        background:
          linear-gradient(
            145deg,
            rgba(120, 68, 186, 0.09),
            rgba(255, 73, 169, 0.035)
          ),
          rgba(255, 255, 255, 0.02);

        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.018) inset,
          0 13px 36px rgba(0, 0, 0, 0.2);

        padding: 24px;

        backdrop-filter: blur(12px);

        transition:
          transform 200ms ease,
          border-color 200ms ease,
          background 200ms ease,
          box-shadow 200ms ease;
      }

      .adventure-detail-card:hover,
      .adventure-skill-card:hover,
      .adventure-experience-card:hover,
      .adventure-project-highlight-list article:hover {
        border-color:
          rgba(
            255,
            126,
            205,
            0.4
          );

        background:
          linear-gradient(
            145deg,
            rgba(120, 68, 186, 0.14),
            rgba(255, 73, 169, 0.06)
          ),
          rgba(255, 255, 255, 0.026);

        box-shadow:
          0 17px 40px rgba(0, 0, 0, 0.27),
          0 0 24px rgba(255, 76, 175, 0.09);

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

      .adventure-detail-card h3:first-child,
      .adventure-detail-card h4:first-child,
      .adventure-skill-card h4:first-child,
      .adventure-experience-card h4:first-child {
        margin-top: 0;
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

        color: var(--portfolio-orange);

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

      /* ================================================================ */
      /* Experience cards                                                 */
      /* ================================================================ */

      .adventure-experience-list {
        display: grid;
        gap: 13px;
      }

      .adventure-experience-card {
        display: grid;

        grid-template-columns:
          auto
          minmax(0, 1fr);

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

        grid-template-columns:
          minmax(0, 1fr)
          auto;

        gap: 15px;
      }

      .adventure-experience-card h4 {
        margin-top: 0;
      }

      .adventure-experience-card time {
        color: #b99ad9;

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

      /* ================================================================ */
      /* Contact cards                                                    */
      /* ================================================================ */

      .adventure-contact-grid {
        display: grid;

        grid-template-columns:
          repeat(
            3,
            minmax(0, 1fr)
          );

        gap: 12px;
      }

      .adventure-contact-grid a {
        display: grid;

        gap: 7px;

        overflow-wrap: anywhere;

        border:
          1px solid
          rgba(232, 148, 255, 0.2);

        border-radius: 18px;

        outline: none;

        background:
          linear-gradient(
            135deg,
            rgba(137, 76, 202, 0.11),
            rgba(255, 71, 166, 0.04)
          ),
          rgba(255, 255, 255, 0.015);

        padding: 19px;

        color: #f5dfff;

        text-decoration: none;

        transition:
          transform 180ms ease,
          border-color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease;
      }

      .adventure-contact-grid a span {
        color: var(--portfolio-muted);

        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .adventure-contact-grid a strong {
        color: var(--portfolio-ink);

        font-size: 13px;
      }

      .adventure-contact-grid a:hover {
        border-color:
          rgba(
            255,
            122,
            205,
            0.64
          );

        background:
          linear-gradient(
            135deg,
            rgba(137, 76, 202, 0.17),
            rgba(255, 76, 174, 0.13)
          ),
          rgba(255, 255, 255, 0.025);

        box-shadow:
          0 0 22px rgba(255, 75, 175, 0.11),
          0 12px 27px rgba(0, 0, 0, 0.22);

        transform: translateY(-3px);
      }

      .adventure-detail-location {
        margin: 15px 0 0;

        color: #b99ad9;

        font-size: 12px;
      }

      /* ================================================================ */
      /* Project case study layout                                        */
      /* ================================================================ */

      .adventure-case-study-grid {
        display: grid;

        width: min(100%, 1180px);

        grid-template-columns:
          minmax(0, 1.12fr)
          minmax(320px, 0.88fr);

        gap:
          clamp(
            30px,
            5vw,
            70px
          );

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

        box-sizing: border-box;

        border:
          10px solid
          rgba(21, 15, 43, 0.96);

        border-radius: 24px;

        background: #0c091a;

        box-shadow:
          0 0 0 1px rgba(235, 145, 255, 0.19),
          0 0 28px rgba(148, 67, 211, 0.15),
          0 28px 66px rgba(0, 0, 0, 0.5);

        object-fit: contain;
      }

      .adventure-case-study-empty-gallery {
        display: grid;

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
        color: var(--portfolio-orange);
      }

      .adventure-case-study-thumbnails {
        display: grid;

        grid-template-columns:
          repeat(
            4,
            minmax(0, 1fr)
          );

        gap: 9px;

        margin-top: 14px;
      }

      .adventure-case-study-thumbnails button {
        overflow: hidden;

        border:
          3px solid
          rgba(235, 145, 255, 0.18);

        border-radius: 13px;
        outline: none;

        background:
          rgba(
            15,
            11,
            35,
            0.84
          );

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
        border-color:
          rgba(
            255,
            103,
            191,
            0.8
          );

        box-shadow:
          0 0 16px rgba(255, 75, 175, 0.29),
          0 8px 21px rgba(0, 0, 0, 0.34);

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
        box-sizing: border-box;

        margin-top: 18px;

        border:
          8px solid
          rgba(21, 15, 43, 0.96);

        border-radius: 22px;

        background: #020207;

        box-shadow:
          0 0 0 1px rgba(235, 145, 255, 0.17),
          0 0 25px rgba(148, 67, 211, 0.13),
          0 24px 59px rgba(0, 0, 0, 0.5);
      }

      /* ================================================================ */
      /* Project case study content                                       */
      /* ================================================================ */

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

        border-bottom:
          1px solid
          rgba(232, 144, 255, 0.15);
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

        color: var(--portfolio-ink-soft);
      }

      .adventure-case-study-overview {
        display: grid;
        gap: 12px;
      }

      .adventure-case-study-overview p {
        margin: 0;

        color: var(--portfolio-ink-soft);
      }

      .adventure-project-highlight-list {
        display: grid;
        gap: 9px;
      }

      .adventure-project-highlight-list article {
        display: grid;

        grid-template-columns:
          auto
          minmax(0, 1fr);

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

        color: var(--portfolio-ink);
      }

      .adventure-project-highlight-list p {
        margin-top: 6px;

        color: var(--portfolio-ink-soft);
      }

      /* ================================================================ */
      /* Tags                                                             */
      /* ================================================================ */

      .adventure-case-study-tags {
        display: flex;
        flex-wrap: wrap;

        gap: 7px;
      }

      .adventure-case-study-tags span {
        border:
          1px solid
          rgba(222, 140, 255, 0.24);

        border-radius: 999px;

        background: linear-gradient(
          90deg,
          rgba(154, 92, 255, 0.14),
          rgba(255, 95, 183, 0.11)
        );

        padding: 7px 10px;

        color: #e7d2ff;

        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      .adventure-case-study-tags span:nth-child(3n) {
        border-color:
          rgba(
            105,
            223,
            255,
            0.21
          );

        background:
          rgba(
            105,
            223,
            255,
            0.08
          );

        color: #bdefff;
      }

      /* ================================================================ */
      /* Mobile preview card                                              */
      /* ================================================================ */

      .adventure-mobile-annotation-layer {
        pointer-events: none;
      }

      .adventure-annotation-card--mobile {
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

        background:
          radial-gradient(
            circle at 90% 0%,
            rgba(154, 92, 255, 0.2),
            transparent 38%
          ),
          radial-gradient(
            circle at 4% 100%,
            rgba(255, 63, 159, 0.11),
            transparent 36%
          ),
          linear-gradient(
            155deg,
            rgba(21, 14, 46, 0.99),
            rgba(7, 7, 21, 0.985)
          );

        box-shadow:
          0 0 0 1px rgba(232, 144, 255, 0.22) inset,
          0 -10px 38px rgba(193, 74, 239, 0.14),
          0 -22px 60px rgba(0, 0, 0, 0.55);

        pointer-events: auto;

        transform-origin: center bottom;
      }

      .adventure-annotation-card--mobile::after,
      .adventure-annotation-card--mobile
        .adventure-card-pin {
        display: none;
      }

      /* ================================================================ */
      /* Keyboard focus                                                   */
      /* ================================================================ */

      .adventure-annotation-close:focus-visible,
      .adventure-detail-button:focus-visible,
      .adventure-project-card-button:focus-visible,
      .adventure-project-external-link:focus-visible,
      .adventure-case-study-close:focus-visible,
      .adventure-contact-grid a:focus-visible,
      .adventure-case-study-thumbnails button:focus-visible,
      .adventure-bottom-nav button:focus-visible {
        outline:
          3px solid
          var(--portfolio-cyan);

        outline-offset: 3px;

        box-shadow:
          0 0 17px rgba(105, 223, 255, 0.27);
      }

      /* ================================================================ */
      /* Animations                                                       */
      /* ================================================================ */

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

      /* ================================================================ */
      /* Tablet                                                          */
      /* ================================================================ */

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

      /* ================================================================ */
      /* Mobile                                                          */
      /* ================================================================ */

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
            calc(
              70px +
                env(safe-area-inset-bottom)
            );

          background:
            radial-gradient(
              circle at 88% 3%,
              rgba(118, 76, 222, 0.18),
              transparent 34%
            ),
            radial-gradient(
              circle at 7% 96%,
              rgba(255, 63, 159, 0.11),
              transparent 38%
            ),
            linear-gradient(
              180deg,
              #0b081a,
              #05040e
            );
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

          font-size:
            clamp(
              2.45rem,
              14vw,
              4.2rem
            );
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
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
        }

        .adventure-case-study-content {
          gap: 31px;
        }

        .adventure-case-study-content h3 {
          font-size: 21px;
        }

        .adventure-bottom-nav {
          max-width:
            calc(
              100vw -
                20px
            );

          overflow-x: auto;

          scrollbar-width: none;
        }

        .adventure-bottom-nav::-webkit-scrollbar {
          display: none;
        }
      }

      /* ================================================================ */
      /* Reduced motion                                                  */
      /* ================================================================ */

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
        .adventure-experience-card,
        .adventure-contact-grid a,
        .adventure-bottom-nav button {
          scroll-behavior: auto;
          transition-duration: 0.01ms;
        }
      }
    `}</style>
  );
}