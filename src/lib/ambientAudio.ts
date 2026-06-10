const MUTED_STORAGE_KEY =
  "ambientAudioMuted";

let ambientAudio:
  | HTMLAudioElement
  | null = null;

let mutedState =
  false;

let mutedStateLoaded =
  false;

function canUseBrowserApis() {
  return (
    typeof window !==
      "undefined" &&
    typeof document !==
      "undefined"
  );
}

function loadMutedState() {
  if (
    mutedStateLoaded ||
    !canUseBrowserApis()
  ) {
    return;
  }

  mutedStateLoaded =
    true;

  mutedState =
    window.localStorage.getItem(
      MUTED_STORAGE_KEY
    ) === "true";
}

function getOrCreateAudio() {
  if (!canUseBrowserApis()) {
    return null;
  }

  if (!ambientAudio) {
    ambientAudio =
      new Audio();

    ambientAudio.loop =
      true;

    ambientAudio.preload =
      "auto";
  }

  return ambientAudio;
}

export function getAmbientAudioMuted() {
  loadMutedState();

  return mutedState;
}

export function setAmbientAudioMuted(
  muted:
    boolean
) {
  loadMutedState();

  mutedState =
    muted;

  if (
    canUseBrowserApis()
  ) {
    window.localStorage.setItem(
      MUTED_STORAGE_KEY,
      String(muted)
    );
  }

  if (ambientAudio) {
    ambientAudio.muted =
      muted;
  }
}

export async function playAmbientAudio(
  src:
    string,

  volume =
    0.1
) {
  const audio =
    getOrCreateAudio();

  if (!audio) {
    return;
  }

  const absoluteSource =
    new URL(
      src,
      window.location.href
    ).href;

  if (
    audio.src !==
    absoluteSource
  ) {
    audio.src =
      src;

    audio.load();
  }

  audio.volume =
    Math.min(
      1,
      Math.max(
        0,
        volume
      )
    );

  audio.muted =
    getAmbientAudioMuted();

  await audio.play();
}