import { useEffect, useState } from "react";
import type { HealthResponse } from "../types/api";

const OFFLINE: HealthResponse["integrations"] = {
  gemini: false,
  elevenlabs: false,
  tigerData: false,
};

/** Which sponsor APIs are live right now — booleans only, never key values. */
export const useIntegrationStatus = () => {
  const [integrations, setIntegrations] =
    useState<HealthResponse["integrations"]>(OFFLINE);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/health")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: HealthResponse | null) => {
        if (!active) return;
        setIntegrations(payload?.integrations ?? OFFLINE);
        setChecked(true);
      })
      .catch(() => {
        if (active) setChecked(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return { integrations, checked };
};
