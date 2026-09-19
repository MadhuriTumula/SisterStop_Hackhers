import { useCallback, useState } from "react";
import { LOCAL_FALLBACK, requestCalmCoach } from "../lib/gemini";
import type { CalmCoachRequest, CalmCoachResponse } from "../types/api";

export type CalmCoachStatus = "idle" | "loading" | "ready" | "degraded";

export const useCalmCoach = () => {
  const [status, setStatus] = useState<CalmCoachStatus>("idle");
  const [response, setResponse] = useState<CalmCoachResponse | null>(null);

  const ask = useCallback(async (input: CalmCoachRequest) => {
    setStatus("loading");
    try {
      const result = await requestCalmCoach(input);
      setResponse(result);
      setStatus("ready");
      return result;
    } catch {
      // The rider still gets bounded, useful support copy.
      setResponse(LOCAL_FALLBACK);
      setStatus("degraded");
      return LOCAL_FALLBACK;
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setStatus("idle");
  }, []);

  return { status, response, ask, reset };
};
