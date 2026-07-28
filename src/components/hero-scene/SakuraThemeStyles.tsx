export default function SakuraThemeStyles() {
  return (
    <style jsx global>{`
      :root {
        --sakura-pink: #ff68b7;
        --sakura-pink-strong: #ff3f9f;
        --sakura-violet: #9a5cff;
        --sakura-cyan: #69dfff;
        --sakura-ink: #080612;
        --sakura-panel: rgba(11, 9, 27, 0.88);
        --sakura-border: rgba(232, 144, 255, 0.28);
        --sakura-copy: rgba(244, 238, 255, 0.74);
      }

      .adventure-scene-shell,
      .adventure-annotation-card,
      .adventure-case-study-modal,
      .adventure-section-detail-modal,
      .adventure-bottom-nav {
        font-family: var(--font-body), sans-serif;
      }

      .adventure-annotation-card h2,
      .adventure-case-study-header h2,
      .adventure-section-detail-header h2,
      .adventure-detail-card h3,
      .adventure-detail-card h4,
      .adventure-experience-card h4,
      .adventure-skill-card h4,
      .adventure-project-card-button strong {
        font-family: var(--font-display), sans-serif;
        font-weight: 800;
      }

      .adventure-backdrop--sakura {
        background:
          radial-gradient(circle at 74% 15%, rgba(186, 114, 255, 0.18), transparent 25%),
          radial-gradient(circle at 18% 78%, rgba(255, 75, 167, 0.17), transparent 34%),
          radial-gradient(circle at 52% 88%, rgba(64, 62, 139, 0.16), transparent 34%),
          linear-gradient(180deg, #090718 0%, #060511 52%, #02030a 100%);
      }

      .adventure-sakura-moon {
        position: absolute;
        top: 7%;
        right: 10%;
        width: clamp(78px, 9vw, 142px);
        aspect-ratio: 1;
        border-radius: 50%;
        background:
          radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.98), rgba(239, 222, 255, 0.88) 36%, rgba(167, 120, 226, 0.5) 68%, transparent 71%);
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
        background: linear-gradient(145deg, #ffd5ea, #ef78bd);
        box-shadow: 0 0 8px rgba(255, 112, 188, 0.32);
        opacity: 0.55;
        animation: adventure-sakura-fall linear infinite;
      }

      .adventure-annotation-card {
        width: min(360px, 79vw);
        max-height: min(510px, 72vh);
        border: 1px solid var(--sakura-border);
        border-radius: 22px;
        background:
          linear-gradient(145deg, rgba(20, 14, 42, 0.94), rgba(8, 8, 23, 0.9)),
          var(--sakura-panel);
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.035) inset,
          0 0 27px rgba(211, 73, 255, 0.17),
          0 24px 60px rgba(0, 0, 0, 0.5);
        padding: 19px;
        backdrop-filter: blur(22px) saturate(1.15);
      }

      .adventure-annotation-card::before {
        content: "";
        position: absolute;
        left: 0;
        top: 22px;
        bottom: 22px;
        width: 3px;
        border-radius: 0 99px 99px 0;
        background: linear-gradient(180deg, var(--sakura-violet), var(--sakura-pink));
        box-shadow: 0 0 15px rgba(255, 80, 178, 0.72);
      }

      .adventure-annotation-card-number,
      .adventure-annotation-card-eyebrow,
      .adventure-case-study-header > p,
      .adventure-section-detail-header > p,
      .adventure-detail-kicker {
        color: #f18cd2;
        font-family: var(--font-mono), monospace;
        font-weight: 700;
        letter-spacing: 0.2em;
      }

      .adventure-annotation-card h2 {
        color: #fff7fd;
        font-size: 27px;
        letter-spacing: -0.045em;
        text-shadow: 0 0 20px rgba(255, 100, 186, 0.16);
      }

      .adventure-annotation-card-copy {
        color: var(--sakura-copy);
      }

      .adventure-annotation-close,
      .adventure-case-study-close {
        border-color: rgba(237, 148, 255, 0.24);
        background: rgba(149, 71, 197, 0.12);
        box-shadow: 0 0 14px rgba(193, 74, 239, 0.13);
      }

      .adventure-annotation-close:hover,
      .adventure-case-study-close:hover {
        border-color: rgba(255, 139, 211, 0.72);
        background: rgba(255, 90, 182, 0.16);
      }

      .adventure-project-card-button {
        position: relative;
        gap: 7px;
        overflow: hidden;
        border: 1px solid rgba(236, 153, 255, 0.16);
        border-radius: 15px;
        background:
          linear-gradient(135deg, rgba(115, 67, 173, 0.11), rgba(255, 71, 166, 0.055)),
          rgba(255, 255, 255, 0.025);
        padding: 13px 14px;
      }

      .adventure-project-card-button::after {
        content: "";
        position: absolute;
        inset: auto 14px 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 94, 183, 0.55), transparent);
        opacity: 0;
        transition: opacity 180ms ease;
      }

      .adventure-project-card-button:hover {
        transform: translateY(-3px) scale(1.01);
        border-color: rgba(255, 128, 208, 0.5);
        background:
          linear-gradient(135deg, rgba(135, 70, 210, 0.17), rgba(255, 71, 166, 0.1)),
          rgba(255, 255, 255, 0.035);
        box-shadow: 0 10px 28px rgba(114, 42, 159, 0.18), 0 0 18px rgba(255, 76, 173, 0.1);
      }

      .adventure-project-card-button:hover::after {
        opacity: 1;
      }

      .adventure-project-card-button strong {
        color: #fff7fc;
        font-size: 13px;
      }

      .adventure-project-card-button span {
        color: #caa8ff;
      }

      .adventure-project-card-button em {
        color: #ff83c7;
      }

      .adventure-bottom-nav {
        border-color: rgba(234, 147, 255, 0.25);
        background: rgba(10, 7, 25, 0.78);
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.035) inset,
          0 0 25px rgba(167, 66, 222, 0.13),
          0 15px 34px rgba(0, 0, 0, 0.36);
      }

      .adventure-bottom-nav button:hover,
      .adventure-bottom-nav button.is-active {
        background: linear-gradient(90deg, rgba(137, 73, 219, 0.86), rgba(244, 73, 172, 0.88));
        color: white;
        box-shadow: 0 0 17px rgba(231, 78, 187, 0.32);
      }

      .adventure-case-study-backdrop,
      .adventure-section-detail-backdrop {
        background:
          radial-gradient(circle at 16% 14%, rgba(142, 76, 225, 0.16), transparent 30%),
          radial-gradient(circle at 85% 84%, rgba(255, 67, 163, 0.12), transparent 34%),
          rgba(3, 3, 11, 0.79);
        backdrop-filter: blur(18px) saturate(1.1);
      }

      .adventure-case-study-modal,
      .adventure-section-detail-modal {
        scrollbar-color: rgba(255, 92, 184, 0.75) rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(235, 145, 255, 0.33);
        border-radius: 28px;
        background:
          radial-gradient(circle at 90% 0%, rgba(118, 76, 222, 0.13), transparent 32%),
          linear-gradient(145deg, rgba(15, 12, 34, 0.985), rgba(8, 8, 24, 0.97));
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.035) inset,
          0 0 38px rgba(192, 67, 244, 0.2),
          0 35px 110px rgba(0, 0, 0, 0.68);
      }

      .adventure-case-study-modal::before,
      .adventure-section-detail-modal::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background:
          linear-gradient(90deg, rgba(255, 76, 174, 0.58), transparent 18%) top left / 180px 2px no-repeat,
          linear-gradient(180deg, rgba(155, 91, 255, 0.54), transparent 24%) top left / 2px 220px no-repeat,
          linear-gradient(270deg, rgba(93, 220, 255, 0.4), transparent 20%) bottom right / 180px 1px no-repeat;
      }

      .adventure-case-study-header,
      .adventure-section-detail-header {
        position: relative;
        margin: -4px -4px 22px;
        border: 1px solid rgba(234, 151, 255, 0.13);
        border-radius: 20px;
        background:
          linear-gradient(135deg, rgba(140, 76, 222, 0.12), rgba(255, 74, 169, 0.055)),
          rgba(255, 255, 255, 0.018);
        padding: 21px 22px;
      }

      .adventure-case-study-header h2,
      .adventure-section-detail-header h2 {
        color: #fff8fd;
        letter-spacing: -0.055em;
        text-shadow: 0 0 24px rgba(255, 94, 183, 0.14);
      }

      .adventure-case-study-meta span,
      .adventure-case-study-tags span {
        border-color: rgba(222, 140, 255, 0.2);
        background: rgba(157, 83, 220, 0.1);
        color: #dfc4ff;
      }

      .adventure-case-study-grid {
        gap: 24px;
      }

      .adventure-case-study-gallery,
      .adventure-case-study-content,
      .adventure-section-block,
      .adventure-detail-card,
      .adventure-experience-card,
      .adventure-skill-card {
        border: 1px solid rgba(235, 151, 255, 0.14);
        border-radius: 18px;
        background:
          linear-gradient(145deg, rgba(120, 68, 186, 0.075), rgba(255, 73, 169, 0.025)),
          rgba(255, 255, 255, 0.018);
        box-shadow: inset 0 0 22px rgba(115, 54, 172, 0.045);
      }

      .adventure-case-study-gallery,
      .adventure-case-study-content {
        padding: 14px;
      }

      .adventure-case-study-content {
        color: var(--sakura-copy);
      }

      .adventure-case-study-main-image,
      .adventure-case-study-empty-gallery,
      .adventure-case-study-video {
        border-color: rgba(238, 151, 255, 0.2);
        box-shadow: 0 0 22px rgba(148, 67, 211, 0.1);
      }

      .adventure-case-study-thumbnails button {
        border-color: rgba(235, 145, 255, 0.18);
      }

      .adventure-case-study-thumbnails button.is-active,
      .adventure-case-study-thumbnails button:hover {
        border-color: rgba(255, 103, 191, 0.72);
        box-shadow: 0 0 13px rgba(255, 75, 175, 0.25);
      }

      .adventure-case-study-content h3,
      .adventure-section-block > h3 {
        color: #fff7fd;
        font-family: var(--font-display), sans-serif;
        font-weight: 800;
      }

      .adventure-section-block {
        margin-top: 18px;
        padding: 18px;
      }

      .adventure-detail-grid,
      .adventure-skill-grid,
      .adventure-experience-list {
        gap: 13px;
      }

      .adventure-detail-card,
      .adventure-experience-card,
      .adventure-skill-card {
        padding: 17px;
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
      }

      .adventure-detail-card:hover,
      .adventure-experience-card:hover,
      .adventure-skill-card:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 126, 205, 0.34);
        box-shadow: 0 12px 28px rgba(86, 34, 133, 0.15), 0 0 18px rgba(255, 76, 175, 0.07);
      }

      .adventure-detail-button,
      .adventure-project-external-link {
        border-color: rgba(255, 121, 204, 0.32);
        background: linear-gradient(90deg, rgba(137, 72, 216, 0.18), rgba(255, 74, 171, 0.16));
        color: #fff3fb;
      }

      .adventure-detail-button:hover,
      .adventure-project-external-link:hover {
        border-color: rgba(255, 139, 213, 0.78);
        background: linear-gradient(90deg, rgba(137, 72, 216, 0.34), rgba(255, 74, 171, 0.3));
        box-shadow: 0 0 19px rgba(244, 72, 180, 0.2);
      }

      .adventure-contact-grid a {
        border: 1px solid rgba(232, 148, 255, 0.18);
        border-radius: 13px;
        background: rgba(137, 76, 202, 0.08);
        color: #f5dfff;
        transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
      }

      .adventure-contact-grid a:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 122, 205, 0.58);
        background: rgba(255, 76, 174, 0.11);
      }

      .adventure-case-study-modal::-webkit-scrollbar,
      .adventure-section-detail-modal::-webkit-scrollbar,
      .adventure-annotation-card::-webkit-scrollbar {
        width: 7px;
      }

      .adventure-case-study-modal::-webkit-scrollbar-track,
      .adventure-section-detail-modal::-webkit-scrollbar-track,
      .adventure-annotation-card::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.025);
      }

      .adventure-case-study-modal::-webkit-scrollbar-thumb,
      .adventure-section-detail-modal::-webkit-scrollbar-thumb,
      .adventure-annotation-card::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: linear-gradient(#985cff, #ff5fb7);
      }

      @keyframes adventure-sakura-fall {
        from {
          transform: translate3d(0, -10vh, 0) rotate(0deg);
        }

        to {
          transform: translate3d(11vw, 115vh, 0) rotate(620deg);
        }
      }

      @media (max-width: 767px) {
        .adventure-sakura-moon {
          top: 8%;
          right: 7%;
          width: 88px;
        }

        .adventure-case-study-backdrop,
        .adventure-section-detail-backdrop {
          padding: 10px;
        }

        .adventure-case-study-modal,
        .adventure-section-detail-modal {
          max-height: calc(100dvh - 20px);
          border-radius: 21px;
          padding: 17px;
        }

        .adventure-case-study-header,
        .adventure-section-detail-header {
          padding: 17px;
        }

        .adventure-case-study-gallery,
        .adventure-case-study-content,
        .adventure-section-block {
          padding: 12px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .adventure-sakura-petals span {
          animation: none;
        }
      }
    `}</style>
  );
}
