"use client";

import type {
  MouseEvent,
  Ref,
} from "react";

type SceneReturnButtonProps = {
  onClick: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
  ariaLabel?: string;
  primaryText?: string;
  secondaryText?: string;
  tooltip?: string;

  /*
   * Only the instance rendered by page.tsx should use this.
   *
   * Modal copies do not pass this property, so they render
   * nothing. This prevents the sticker from remounting or
   * popping when a modal opens.
   */
  persistent?: boolean;
};

export default function SceneReturnButton({
  onClick,
  buttonRef,
  ariaLabel = "Return to the 3D model",
  primaryText = "Julie Anne",
  secondaryText = "3D Portfolio",
  tooltip = "Return to the 3D home view",
  persistent = false,
}: SceneReturnButtonProps) {
  /*
   * Projects, About, Credits, and project case studies may
   * still contain old SceneReturnButton instances.
   *
   * Only the permanent page-level instance is displayed.
   */
  if (!persistent) {
    return null;
  }

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="scene-return-button"
        onClick={handleClick}
        aria-label={ariaLabel}
        title={tooltip}
      >
        <span
          className="scene-return-button__icon"
          aria-hidden="true"
        >
          <span>JA</span>
        </span>

        <span className="scene-return-button__copy">
          <strong>
            {primaryText}
          </strong>

          <small>
            {secondaryText}
          </small>
        </span>
      </button>

      <style jsx>{`
        .scene-return-button {
          position: fixed;

          top: max(
            24px,
            env(safe-area-inset-top)
          );

          left: max(
            24px,
            env(safe-area-inset-left)
          );

          /*
           * Projects and other full-screen windows use lower
           * layers, so the sticker remains above them.
           */
          z-index: 400;

          display: inline-flex;
          align-items: center;
          gap: 11px;

          margin: 0;
          border: 0;
          border-radius: 12px;
          outline: none;

          background: transparent;

          padding: 0;

          color: #fff7fd;
          cursor: pointer;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          text-align: left;

          -webkit-tap-highlight-color: transparent;

          transition:
            filter 180ms ease,
            transform 180ms ease;
        }

        .scene-return-button:hover {
          filter: brightness(1.08);

          transform:
            translateY(-2px);
        }

        .scene-return-button:active {
          transform:
            translateY(0)
            scale(0.97);
        }

        .scene-return-button:focus-visible {
          outline:
            3px solid
            #69dfff;

          outline-offset: 6px;
        }

        .scene-return-button__icon {
          position: relative;

          display: grid;

          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          overflow: hidden;

          border:
            2px solid
            #ff68b7;

          border-radius: 11px;

          background:
            radial-gradient(
              circle,
              rgba(
                255,
                188,
                228,
                0.8
              )
                1.25px,
              transparent
                1.6px
            );

          background-color:
            rgba(
              53,
              20,
              76,
              0.94
            );

          background-size:
            7px 7px;

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.05
              )
              inset,
            0 0 18px
              rgba(
                255,
                104,
                183,
                0.24
              ),
            0 10px 28px
              rgba(
                0,
                0,
                0,
                0.26
              );

          place-items: center;

          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .scene-return-button:hover
          .scene-return-button__icon {
          border-color:
            #69dfff;

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.08
              )
              inset,
            0 0 24px
              rgba(
                255,
                104,
                183,
                0.38
              ),
            0 12px 30px
              rgba(
                0,
                0,
                0,
                0.32
              );

          transform:
            rotate(-3deg);
        }

        .scene-return-button__icon
          > span {
          position: relative;
          z-index: 2;

          display: grid;

          width: 27px;
          height: 27px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.12
            );

          border-radius: 7px;

          background:
            rgba(
              8,
              6,
              18,
              0.9
            );

          color: #fff7fd;

          font-family:
            var(--font-mono),
            monospace;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: -0.05em;

          place-items: center;
        }

        .scene-return-button__copy {
          display: grid;
          gap: 4px;

          line-height: 1;
        }

        .scene-return-button__copy
          strong {
          color: #fff7fd;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.17em;
          text-transform: uppercase;

          transition:
            color 180ms ease;
        }

        .scene-return-button__copy
          small {
          color: #caa8ff;

          font-size: 7px;
          font-weight: 800;

          letter-spacing: 0.2em;
          text-transform: uppercase;

          transition:
            color 180ms ease;
        }

        .scene-return-button:hover
          .scene-return-button__copy
          strong {
          color: #ff9dce;
        }

        .scene-return-button:hover
          .scene-return-button__copy
          small {
          color: #69dfff;
        }

        @media (max-width: 600px) {
          .scene-return-button {
            top: max(
              18px,
              env(safe-area-inset-top)
            );

            left: max(
              18px,
              env(safe-area-inset-left)
            );

            gap: 9px;
          }

          .scene-return-button__icon {
            width: 37px;
            height: 37px;

            flex-basis: 37px;
          }

          .scene-return-button__icon
            > span {
            width: 24px;
            height: 24px;

            font-size: 8px;
          }

          .scene-return-button__copy
            strong {
            font-size: 9px;
          }

          .scene-return-button__copy
            small {
            font-size: 6px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .scene-return-button,
          .scene-return-button__icon,
          .scene-return-button__copy
            strong,
          .scene-return-button__copy
            small {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}