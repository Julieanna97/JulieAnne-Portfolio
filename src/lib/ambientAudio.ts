let ambientAudio: HTMLAudioElement | null = null;
let visibilityListenerAttached = false;

function attachVisibilityListener() {
  if (typeof window === "undefined" || visibilityListenerAttached) return;
  visibilityListenerAttached = true;

  const handleVisibilityChange = () => {
    if (!ambientAudio) return;
    if (document.hidden) {
      ambientAudio.pause();
    } else {
      ambientAudio.play().catch(() => {
        // Autoplay blocked or other error
      });
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
}

export async function playAmbientAudio(src: string, volume = 0.4) {
  if (typeof window === "undefined") return;

  if (!ambientAudio) {
    ambientAudio = new Audio(src);
    ambientAudio.preload = "auto";
    attachVisibilityListener();
  }

  if (!ambientAudio.src.endsWith(src)) {
    ambientAudio.src = src;
  }

  ambientAudio.loop = true;
  ambientAudio.muted = false;
  ambientAudio.volume = volume;

  if (ambientAudio.paused) {
    await ambientAudio.play();
  }
}

export function getAmbientAudio() {
  return ambientAudio;
}

export function resumeAudioIfNeeded() {
  if (typeof window === "undefined" || !ambientAudio) return;
  if (!document.hidden && ambientAudio.paused) {
    ambientAudio.play().catch(() => {
      // Autoplay blocked
    });
  }
}
