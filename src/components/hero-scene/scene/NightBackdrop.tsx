import { useMemo } from "react";

export default function NightBackdrop() {
  return (
    <div
      className="adventure-backdrop adventure-backdrop--original"
      aria-hidden="true"
    >
      <span className="adventure-original-glow original-glow-left" />
      <span className="adventure-original-glow original-glow-right" />
      <span className="adventure-original-glow original-glow-bottom" />

      <FullscreenNightStars />

      <span className="adventure-original-vignette" />
    </div>
  );
}

function FullscreenNightStars() {
  const stars =
    useMemo(
      () =>
        Array.from(
          {
            length:
              14,
          },

          (
            _,
            index
          ) => ({
            id:
              index,

            left:
              `${
                (
                  index *
                    37 +
                  13
                ) %
                100
              }%`,

            top:
              `${
                (
                  index *
                    53 +
                  9
                ) %
                95
              }%`,

            size:
              4 +
              (index *
                11) %
                10,

            delay:
              `-${
                (
                  index *
                  0.43
                ) %
                5.8
              }s`,

            duration:
              `${
                2.8 +
                ((index *
                  7) %
                  22) /
                  10
              }s`,
          })
        ),
      []
    );

  return (
    <div className="adventure-stars">
      {stars.map(
        (
          star
        ) => (
          <span
            key={
              star.id
            }
            className="adventure-star"
            style={{
              left:
                star.left,

              top:
                star.top,

              width:
                `${star.size}px`,

              height:
                `${star.size}px`,

              animationDelay:
                star.delay,

              animationDuration:
                star.duration,
            }}
          />
        )
      )}
    </div>
  );
}
