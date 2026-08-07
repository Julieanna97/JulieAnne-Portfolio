"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  PortfolioSection,
  ProjectId,
  SectionId,
} from "../types";

import type {
  HotspotProjection,
} from "../scene/AutomaticHotspotController";

import AnnotationContent from "./AnnotationContent";

export type AutoCardStackHandle = {
  updateHotspotPosition: (
    projection: HotspotProjection,
  ) => void;
};

type AutoCardStackProps = {
  sections: PortfolioSection[];

  activeId:
    | SectionId
    | null;

  onProjectSelect: (
    id: ProjectId,
  ) => void;

  onOpenSectionDetail: (
    id:
      | "about"
      | "credits",
  ) => void;
};

const AutoCardStack =
  forwardRef<
    AutoCardStackHandle,
    AutoCardStackProps
  >(function AutoCardStack(
    {
      sections,
      activeId,
      onProjectSelect,
      onOpenSectionDetail,
    },
    forwardedRef,
  ) {
    const reduceMotion =
      useReducedMotion();

    const rootRef =
      useRef<HTMLDivElement | null>(
        null,
      );

    const connectorPathRef =
      useRef<SVGPathElement | null>(
        null,
      );

    const connectorDotRef =
      useRef<SVGCircleElement | null>(
        null,
      );

    const projectionRef =
      useRef<HotspotProjection>({
        x: 0,
        y: 0,
        visible: false,
      });

    const updateConnector =
      useCallback(() => {
        const root =
          rootRef.current;

        const path =
          connectorPathRef.current;

        const dot =
          connectorDotRef.current;

        const projection =
          projectionRef.current;

        if (
          !root ||
          !path ||
          !dot ||
          !projection.visible ||
          window.innerWidth < 768
        ) {
          if (path) {
            path.style.opacity =
              "0";
          }

          if (dot) {
            dot.style.opacity =
              "0";
          }

          return;
        }

        const activeCard =
          root.querySelector<HTMLElement>(
            '[data-active-card="true"]',
          );

        if (!activeCard) {
          path.style.opacity =
            "0";

          dot.style.opacity =
            "0";

          return;
        }

        const bounds =
          activeCard.getBoundingClientRect();

        const startX =
          bounds.right - 1;

        const startY =
          bounds.top +
          Math.min(
            96,
            bounds.height *
              0.22,
          );

        const endX =
          projection.x;

        const endY =
          projection.y;

        const distance =
          Math.abs(
            endX - startX,
          );

        const direction =
          endX >= startX
            ? 1
            : -1;

        const curveAmount =
          Math.max(
            55,
            Math.min(
              210,
              distance * 0.4,
            ),
          );

        const firstControlX =
          startX +
          curveAmount *
            direction;

        const secondControlX =
          endX -
          curveAmount *
            direction;

        path.setAttribute(
          "d",
          [
            `M ${startX} ${startY}`,
            `C ${firstControlX} ${startY},`,
            `${secondControlX} ${endY},`,
            `${endX} ${endY}`,
          ].join(" "),
        );

        path.style.opacity =
          "1";

        dot.setAttribute(
          "cx",
          String(endX),
        );

        dot.setAttribute(
          "cy",
          String(endY),
        );

        dot.style.opacity =
          "1";
      }, []);

    useImperativeHandle(
      forwardedRef,
      () => ({
        updateHotspotPosition: (
          projection,
        ) => {
          projectionRef.current =
            projection;

          updateConnector();
        },
      }),
      [updateConnector],
    );

    useLayoutEffect(() => {
      const frame =
        window.requestAnimationFrame(
          updateConnector,
        );

      return () => {
        window.cancelAnimationFrame(
          frame,
        );
      };
    }, [
      activeId,
      sections,
      updateConnector,
    ]);

    useEffect(() => {
      const handleResize = () => {
        updateConnector();
      };

      window.addEventListener(
        "resize",
        handleResize,
      );

      return () => {
        window.removeEventListener(
          "resize",
          handleResize,
        );
      };
    }, [updateConnector]);

    if (
      sections.length === 0
    ) {
      return null;
    }

    return (
      <div
        ref={rootRef}
        className="adventure-auto-card-layer"
        aria-live="polite"
      >
        <svg
          className="adventure-auto-card-connector"
          aria-hidden="true"
        >
          <path
            ref={connectorPathRef}
            className="adventure-auto-card-connector-path"
          />

          <circle
            ref={connectorDotRef}
            className="adventure-auto-card-connector-dot"
            r="5"
          />
        </svg>

        <div className="adventure-auto-card-stack">
          <AnimatePresence
            initial={false}
            mode="popLayout"
          >
            {sections.map(
              (
                section,
                index,
              ) => {
                const isActive =
                  section.id ===
                  activeId;

                const depth =
                  sections.length -
                  1 -
                  index;

                return (
                  <motion.article
                    key={
                      section.id
                    }
                    layout
                    className={`adventure-auto-card ${
                      isActive
                        ? "is-active"
                        : "is-behind"
                    }`}
                    data-active-card={
                      isActive
                        ? "true"
                        : "false"
                    }
                    aria-hidden={
                      !isActive
                    }
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity:
                              0,

                            x: -36,
                            y: 18,

                            scale:
                              0.92,

                            rotate:
                              -1.5,
                          }
                    }
                    animate={{
                      opacity:
                        isActive
                          ? 1
                          : Math.max(
                              0.54,
                              0.88 -
                                depth *
                                  0.15,
                            ),

                      x:
                        depth *
                        11,

                      y:
                        depth *
                        -11,

                      scale:
                        1 -
                        depth *
                          0.028,

                      rotate:
                        depth *
                        0.45,
                    }}
                    exit={
                      reduceMotion
                        ? {
                            opacity:
                              0,
                          }
                        : {
                            opacity:
                              0,

                            x: -34,
                            y: 14,

                            scale:
                              0.94,

                            transition:
                              {
                                duration:
                                  0.18,

                                ease: [
                                  0.4,
                                  0,
                                  1,
                                  1,
                                ],
                              },
                          }
                    }
                    transition={
                      reduceMotion
                        ? {
                            duration:
                              0,
                          }
                        : {
                            type:
                              "spring",

                            stiffness:
                              360,

                            damping:
                              29,

                            mass:
                              0.7,
                          }
                    }
                    style={{
                      zIndex:
                        index + 1,

                      pointerEvents:
                        isActive
                          ? "auto"
                          : "none",
                    }}
                  >
                    <div className="adventure-auto-card-inner">
                      {/*
                       * Updated hierarchy:
                       *
                       * eyebrow
                       * title
                       * body copy
                       *
                       * The old section number and
                       * horizontal separator are gone.
                       */}
                      <header className="adventure-auto-card-header">
                        <p className="adventure-annotation-card-eyebrow">
                          {
                            section.eyebrow
                          }
                        </p>

                        <h2>
                          {
                            section.title
                          }
                        </h2>
                      </header>

                      <div
                        className={`adventure-auto-card-copy is-${section.id}`}
                      >
                        <AnnotationContent
                          id={
                            section.id
                          }
                          onProjectSelect={
                            onProjectSelect
                          }
                          onOpenSectionDetail={
                            onOpenSectionDetail
                          }
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              },
            )}
          </AnimatePresence>
        </div>

        <style jsx global>{`
          /*
           * =================================================
           * LAYER
           * =================================================
           */

          .adventure-auto-card-layer {
            position: absolute;
            inset: 0;
            z-index: 55;

            overflow: hidden;
            pointer-events: none;
          }

          /*
           * =================================================
           * CONNECTOR LINE
           * =================================================
           */

          .adventure-auto-card-connector {
            position: fixed;
            inset: 0;
            z-index: 1;

            width: 100vw;
            height: 100vh;
            height: 100dvh;

            overflow: visible;
            pointer-events: none;
          }

          .adventure-auto-card-connector-path {
            fill: none;

            stroke:
              var(
                --portfolio-orange,
                #ff68b7
              );

            stroke-width: 4;
            stroke-linecap: round;
            stroke-dasharray:
              2 13;

            opacity: 0;

            filter:
              drop-shadow(
                0 0 5px
                  rgba(
                    255,
                    95,
                    183,
                    0.48
                  )
              );

            transition:
              opacity
              140ms ease;
          }

          .adventure-auto-card-connector-dot {
            fill:
              var(
                --portfolio-orange,
                #ff68b7
              );

            stroke:
              var(
                --portfolio-paper,
                #100c25
              );

            stroke-width: 4;

            opacity: 0;

            filter:
              drop-shadow(
                0 0 7px
                  rgba(
                    255,
                    95,
                    183,
                    0.75
                  )
              );

            transition:
              opacity
              140ms ease;
          }

          /*
           * =================================================
           * CARD STACK POSITION
           * =================================================
           */

          .adventure-auto-card-stack {
            position: absolute;

            top: 50%;

            left:
              clamp(
                22px,
                3.2vw,
                58px
              );

            z-index: 2;

            display: grid;

            width:
              min(
                390px,
                calc(
                  100vw - 44px
                )
              );

            transform:
              translateY(-50%);

            perspective:
              1000px;
          }

          /*
           * =================================================
           * CARD
           * =================================================
           */

          .adventure-auto-card {
            position: relative;

            grid-area:
              1 / 1;

            display: flex;

            width: 100%;

            height:
              min(
                560px,
                72vh
              );

            min-height:
              410px;

            box-sizing:
              border-box;

            flex-direction:
              column;

            overflow: hidden;

            border:
              1px solid
              var(
                --portfolio-line,
                rgba(
                  232,
                  144,
                  255,
                  0.24
                )
              );

            border-radius:
              28px
              28px
              28px
              12px;

            background:
              var(
                --portfolio-paper,
                #100c25
              );

            box-shadow:
              var(
                --portfolio-paper-shadow,
                0 30px 80px
                  rgba(
                    0,
                    0,
                    0,
                    0.6
                  )
              );

            /*
             * More generous inset like the
             * reference card.
             */
            padding:
              42px
              34px
              32px;

            color:
              var(
                --portfolio-ink,
                #fff7fd
              );

            transform-origin:
              right 80px;

            transition:
              border-color
                180ms ease,
              box-shadow
                180ms ease,
              filter
                180ms ease;
          }

          /*
           * Decorative corner dot from the reference.
           */
          .adventure-auto-card::before {
            content: "";

            position:
              absolute;

            top: 18px;
            right: 18px;

            z-index: 2;

            width: 8px;
            height: 8px;

            border-radius:
              50%;

            background:
              var(
                --portfolio-orange,
                #ff68b7
              );

            box-shadow:
              0 0 8px
                rgba(
                  255,
                  104,
                  183,
                  0.5
                );

            pointer-events:
              none;
          }

          /*
           * Remove the old number/line styling if another
           * stylesheet still contains it.
           */
          .adventure-auto-card
            .adventure-annotation-card-number,
          .adventure-auto-card
            .adventure-annotation-card-label {
            display:
              none !important;
          }

          /*
           * =================================================
           * ACTIVE CARD
           * =================================================
           */

          .adventure-auto-card.is-active:hover,
          .adventure-auto-card.is-active:has(
              :focus-visible
            ) {
            border-color:
              var(
                --portfolio-orange,
                #ff68b7
              );

            box-shadow:
              0 0 0 3px
                color-mix(
                  in srgb,
                  var(
                      --portfolio-orange,
                      #ff68b7
                    )
                    24%,
                  transparent
                ),
              0 0 0 7px
                rgba(
                  154,
                  92,
                  255,
                  0.08
                ),
              var(
                --portfolio-paper-shadow,
                0 30px 80px
                  rgba(
                    0,
                    0,
                    0,
                    0.6
                  )
              );
          }

          /*
           * =================================================
           * STACKED CARDS
           * =================================================
           */

          .adventure-auto-card.is-behind {
            filter:
              brightness(0.84)
              saturate(0.88);
          }

          .adventure-auto-card-inner {
            display: flex;

            min-width: 0;
            min-height: 0;

            flex: 1;

            flex-direction:
              column;

            align-items:
              stretch;
          }

          .adventure-auto-card.is-behind
            .adventure-auto-card-inner {
            visibility:
              hidden;

            opacity: 0;
          }

          /*
           * =================================================
           * HEADER
           * =================================================
           */

          .adventure-auto-card-header {
            display: flex;

            min-width: 0;

            flex:
              0 0 auto;

            flex-direction:
              column;

            align-items:
              flex-start;
          }

          /*
           * Small category/eyebrow.
           *
           * This replaces the old:
           *
           * 03 — ATTRIBUTION AND TOOLS
           *
           * with:
           *
           * ATTRIBUTION AND TOOLS
           */
          .adventure-auto-card-header
            .adventure-annotation-card-eyebrow {
            margin: 0;

            color:
              var(
                --portfolio-orange,
                #ff68b7
              );

            font-family:
              var(
                --font-body
              ),
              Arial,
              sans-serif;

            font-size:
              0.72rem;

            font-weight:
              850;

            line-height:
              1.25;

            letter-spacing:
              0.045em;

            text-transform:
              uppercase;
          }

          /*
           * Main title directly underneath the eyebrow.
           */
          .adventure-auto-card-header
            h2 {
            max-width: 100%;

            margin:
              9px
              0
              0;

            color:
              var(
                --portfolio-ink,
                #fff7fd
              );

            font-family:
              var(
                --font-display
              ),
              Arial,
              sans-serif;

            font-size:
              clamp(
                1.85rem,
                3vw,
                2.4rem
              );

            font-weight:
              850;

            letter-spacing:
              -0.045em;

            line-height:
              1.05;

            overflow-wrap:
              anywhere;
          }

          /*
           * =================================================
           * BODY CONTENT
           * =================================================
           */

          .adventure-auto-card-copy {
            display: grid;

            min-width: 0;
            min-height: 0;

            flex: 1;

            align-content:
              start;

            /*
             * Gives the individual blocks inside
             * AnnotationContent breathing room.
             */
            gap: 17px;

            /*
             * Larger gap between title and body,
             * matching the reference composition.
             */
            margin-top:
              30px;

            padding-right:
              5px;

            overflow-x:
              hidden;

            overflow-y:
              auto;

            overscroll-behavior:
              contain;

            color:
              var(
                --portfolio-ink-soft,
                rgba(
                  244,
                  238,
                  255,
                  0.76
                )
              );

            font-size:
              13px;

            line-height:
              1.75;

            scrollbar-color:
              var(
                --portfolio-orange,
                #ff68b7
              )
              transparent;
          }

          /*
           * Remove unwanted inherited paragraph margins.
           */
          .adventure-auto-card-copy
            p {
            margin: 0;

            color:
              var(
                --portfolio-ink-soft,
                rgba(
                  244,
                  238,
                  255,
                  0.76
                )
              );
          }

          /*
           * First bold introduction, similar to the
           * reference card's stronger first paragraph.
           */
          .adventure-auto-card-copy
            .adventure-annotation-lead {
            margin: 0;

            color:
              var(
                --portfolio-ink,
                #fff7fd
              );

            font-size:
              0.98rem;

            font-weight:
              760;

            line-height:
              1.58;
          }

          /*
           * Supporting text.
           */
          .adventure-auto-card-copy
            .adventure-annotation-copy,
          .adventure-auto-card-copy
            .adventure-annotation-description {
            color:
              var(
                --portfolio-ink-soft,
                rgba(
                  244,
                  238,
                  255,
                  0.76
                )
              );

            line-height:
              1.75;
          }

          /*
           * Give buttons and detail actions some breathing
           * room from the paragraph above.
           */
          .adventure-auto-card-copy
            button,
          .adventure-auto-card-copy
            a {
            margin-top:
              4px;
          }

          /*
           * =================================================
           * SCROLLBAR
           * =================================================
           */

          .adventure-auto-card-copy::-webkit-scrollbar {
            width: 7px;
          }

          .adventure-auto-card-copy::-webkit-scrollbar-track {
            background:
              transparent;
          }

          .adventure-auto-card-copy::-webkit-scrollbar-thumb {
            border-radius:
              999px;

            background:
              var(
                --portfolio-orange,
                #ff68b7
              );
          }

          /*
           * =================================================
           * MOBILE
           * =================================================
           */

          @media (
            max-width: 767px
          ) {
            .adventure-auto-card-layer {
              display: flex;

              align-items:
                flex-end;

              justify-content:
                center;

              padding:
                14px
                12px
                calc(
                  18px +
                    env(
                      safe-area-inset-bottom
                    )
                );
            }

            .adventure-auto-card-connector {
              display: none;
            }

            .adventure-auto-card-stack {
              position:
                relative;

              inset: auto;

              width:
                min(
                  430px,
                  100%
                );

              transform:
                none;
            }

            .adventure-auto-card {
              height:
                min(
                  540px,
                  calc(
                    100dvh -
                      100px
                  )
                );

              min-height: 0;

              border-radius:
                26px
                26px
                14px
                14px;

              padding:
                40px
                26px
                28px;
            }

            .adventure-auto-card::before {
              top: 16px;
              right: 16px;

              width: 7px;
              height: 7px;
            }

            .adventure-auto-card-header
              .adventure-annotation-card-eyebrow {
              font-size:
                0.68rem;
            }

            .adventure-auto-card-header
              h2 {
              margin-top:
                7px;

              font-size:
                1.8rem;

              line-height:
                1.06;
            }

            .adventure-auto-card-copy {
              gap: 15px;

              margin-top:
                25px;

              padding-right:
                2px;

              font-size:
                12px;
            }

            .adventure-auto-card-copy
              .adventure-annotation-lead {
              font-size:
                0.94rem;

              line-height:
                1.58;
            }
          }

          /*
           * =================================================
           * REDUCED MOTION
           * =================================================
           */

          @media (
            prefers-reduced-motion:
              reduce
          ) {
            .adventure-auto-card,
            .adventure-auto-card-connector-path,
            .adventure-auto-card-connector-dot {
              transition-duration:
                0.01ms;
            }
          }
        `}</style>
      </div>
    );
  });

export default AutoCardStack;