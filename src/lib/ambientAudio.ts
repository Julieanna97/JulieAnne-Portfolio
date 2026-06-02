const AMBIENT_MUTED_STORAGE_KEY = "ambientAudioMuted";

let ambientAudio: HTMLAudioElement | null = null;
let visibilityListenerAttached = false;
let ambientMuted = false;

function readStoredMutedState() {
  if (typeof window === "undefined") return ambientMuted;

  ambientMuted =
    window.localStorage.getItem(AMBIENT_MUTED_STORAGE_KEY) === "true";

  return ambientMuted;
}

function attachVisibilityListener() {
  if (typeof window === "undefined" || visibilityListenerAttached) return;

  visibilityListenerAttached = true;

  const handleVisibilityChange = () => {
    if (!ambientAudio) return;

    if (document.hidden) {
      ambientAudio.pause();
      return;
    }

    ambientAudio.play().catch(() => {
      // Autoplay may be blocked until the user interacts with the page.
    });
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
  ambientAudio.volume = volume;
  ambientAudio.muted = readStoredMutedState();

  if (ambientAudio.paused) {
    await ambientAudio.play();
  }
}

export function getAmbientAudio() {
  return ambientAudio;
}

export function getAmbientAudioMuted() {
  return readStoredMutedState();
}

export function setAmbientAudioMuted(muted: boolean) {
  ambientMuted = muted;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      AMBIENT_MUTED_STORAGE_KEY,
      String(muted)
    );
  }

  if (ambientAudio) {
    ambientAudio.muted = muted;
  }
}

export function resumeAudioIfNeeded() {
  if (typeof window === "undefined" || !ambientAudio) return;

  if (!document.hidden && ambientAudio.paused) {
    ambientAudio.play().catch(() => {
      // Autoplay may be blocked until the user interacts with the page.
    });
  }
}
