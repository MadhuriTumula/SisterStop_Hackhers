import { useCallback, useEffect, useRef, useState } from "react";
import { resolveAudio, speak, stopSpeech, type AudioSource } from "../lib/audio";
import type { AudioType } from "../types/api";

export type AudioStatus = "idle" | "loading" | "playing" | "error";

export const useAudioTool = () => {
  const [activeId, setActiveId] = useState<AudioType | null>(null);
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [source, setSource] = useState<AudioSource | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const teardown = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    stopSpeech();
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const stop = useCallback(() => {
    teardown();
    setStatus("idle");
    setActiveId(null);
  }, [teardown]);

  /** Always triggered by an explicit tap — nothing autoplays. */
  const play = useCallback(
    async (audioType: AudioType) => {
      teardown();
      setActiveId(audioType);
      setStatus("loading");

      const playback = await resolveAudio(audioType);
      setSource(playback.source);
      cleanupRef.current = playback.cleanup ?? null;

      if (playback.url) {
        const audio = new Audio(playback.url);
        audioRef.current = audio;
        audio.onended = () => {
          setStatus("idle");
          setActiveId(null);
        };
        audio.onerror = () => {
          // Last resort: read the same reviewed script aloud in the browser.
          const spoke = speak(audioType, {
            onEnd: () => {
              setStatus("idle");
              setActiveId(null);
            },
            onError: () => setStatus("error"),
          });
          setSource(spoke ? "speech" : null);
          setStatus(spoke ? "playing" : "error");
        };

        try {
          await audio.play();
          setStatus("playing");
          return;
        } catch {
          // Fall through to speech synthesis below.
        }
      }

      const spoke = speak(audioType, {
        onEnd: () => {
          setStatus("idle");
          setActiveId(null);
        },
        onError: () => setStatus("error"),
      });
      setSource(spoke ? "speech" : null);
      setStatus(spoke ? "playing" : "error");
    },
    [teardown],
  );

  return { activeId, status, source, play, stop };
};
