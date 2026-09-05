"use client";

import {
  useEffect,
  useState,
  type RefObject,
} from "react";

import { ArrowUp } from "lucide-react";

type ScrollToTopButtonProps = {
  scrollRef: RefObject<HTMLElement | null>;
  threshold?: number;
};

export default function ScrollToTopButton({
  scrollRef,
  threshold = 360,
}: ScrollToTopButtonProps) {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const scrollElement =
      scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      setVisible(
        scrollElement.scrollTop >
          threshold,
      );
    };

    handleScroll();

    scrollElement.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      scrollElement.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [scrollRef, threshold]);

  const handleScrollToTop = () => {
    const scrollElement =
      scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    scrollElement.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? "auto"
        : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        /*
         * IMPORTANT:
         *
         * The button lives inside the modal backdrop.
         * The backdrop closes the modal when clicked.
         *
         * Without stopPropagation(), clicking this
         * button also triggers the backdrop's onClick
         * and closes the popup.
         */
        event.stopPropagation();

        handleScrollToTop();
      }}
      onPointerDown={(event) => {
        /*
         * Prevent pointer interaction from bubbling
         * into the backdrop as well.
         */
        event.stopPropagation();
      }}
      aria-label="Scroll back to top"
      title="Back to top"
      className={[
        "group fixed z-[150]",

        "grid h-12 w-12 sm:h-14 sm:w-14",
        "place-items-center",

        "overflow-hidden",
        "rounded-full",

        "border border-[#ff8ec9]/40",

        "bg-[linear-gradient(135deg,#9a5cff_0%,#ff4fb1_72%,#ff8ec9_100%)]",

        "text-white",

        "shadow-[0_0_24px_rgba(255,79,177,0.28),0_14px_34px_rgba(0,0,0,0.4)]",

        "backdrop-blur-xl",

        "transition-all duration-300 ease-out",

        "hover:-translate-y-1",

        "hover:shadow-[0_0_32px_rgba(255,79,177,0.42),0_18px_40px_rgba(0,0,0,0.45)]",

        "active:scale-95",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#69dfff]",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#080612]",

        "motion-reduce:transition-none",

        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
      style={{
        /*
         * Audio button stays exactly
         * where it originally is.
         *
         * Only the jump button is moved
         * diagonally upward and left.
         */
        right:
          "max(5.25rem, calc(env(safe-area-inset-right) + 5.25rem))",

        bottom:
          "max(5.25rem, calc(env(safe-area-inset-bottom) + 5.25rem))",
      }}
    >
      <span
        className="relative block h-5 w-5 overflow-hidden"
        aria-hidden="true"
      >
        {/*
         * First arrow:
         * moves upward and out on hover.
         */}
        <ArrowUp
          strokeWidth={2.3}
          className="
            absolute
            left-0
            top-0
            h-5
            w-5

            transition-transform
            duration-300

            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:-translate-y-7

            motion-reduce:transition-none
          "
        />

        {/*
         * Second arrow:
         * rises in from underneath.
         */}
        <ArrowUp
          strokeWidth={2.3}
          className="
            absolute
            left-0
            top-7
            h-5
            w-5

            transition-transform
            duration-300

            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:-translate-y-7

            motion-reduce:transition-none
          "
        />
      </span>
    </button>
  );
}