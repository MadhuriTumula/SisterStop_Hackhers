import type { AudioType } from "../types/api";
import { AUDIO_TOOLS } from "./constants";

export type AudioSource = "elevenlabs" | "file" | "speech";

export interface AudioPlayback {
  source: AudioSource;
  /** Present for audio-element playback; absent for speech synthesis. */
  url?: string;
  cleanup?: () => void;
}

const scriptFor = (audioType: AudioType): string =>
  AUDIO_TOOLS.find((tool) => tool.id === audioType)?.script ?? "";

const fileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const type = response.headers.get("content-type") ?? "";
    return response.ok && type.includes("audio");
  } catch {
    return false;
  }
};

/**
 * Three-step ladder so a voice is always available during judging:
 * 1. ElevenLabs audio from the server endpoint.
 * 2. The pre-generated MP3 in public/audio, if it has been added.
 * 3. The browser's own speech synthesis, reading the same reviewed script.
 */
export const resolveAudio = async (audioType: AudioType): Promise<AudioPlayback> => {
  try {
    const response = await fetch("/api/elevenlabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioType }),
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (response.ok && contentType.includes("audio")) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return { source: "elevenlabs", url, cleanup: () => URL.revokeObjectURL(url) };
    }

    if (response.ok && contentType.includes("json")) {
      const payload = (await response.json()) as { audioUrl?: string };
      if (payload.audioUrl && (await fileExists(payload.audioUrl))) {
        return { source: "file", url: payload.audioUrl };
      }
    }
  } catch {
    // Fall through to speech synthesis.
  }

  return { source: "speech" };
};

export const speak = (
  audioType: AudioType,
  handlers: { onEnd?: () => void; onError?: () => void } = {},
): boolean => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    handlers.onError?.();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(scriptFor(audioType));
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onError?.();

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = (): void => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
