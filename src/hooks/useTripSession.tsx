import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BuddyProfile, TripRequest } from "../types/buddy";
import type { Match, TripSessionState, TripStage } from "../types/trip";
import { DEFAULT_TRIP } from "../lib/constants";
import { overlapSummary } from "../lib/matching";

/**
 * The trip the rider is planning, plus any active match. Kept in
 * sessionStorage so a refresh mid-demo does not lose the flow, and cleared on
 * arrival so nothing about a completed trip lingers.
 */

const STORAGE_KEY = "martamate.tripSession";

const initialState: TripSessionState = {
  trip: DEFAULT_TRIP,
  stage: "planning",
  match: null,
  matchedBuddy: null,
  blockedBuddyIds: [],
  checkInsSent: 0,
};

const readStored = (): TripSessionState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as Partial<TripSessionState>) };
  } catch {
    return initialState;
  }
};

interface TripSessionValue extends TripSessionState {
  updateTrip: (patch: Partial<TripRequest>) => void;
  setTrip: (trip: TripRequest) => void;
  setStage: (stage: TripStage) => void;
  requestMatch: (buddy: BuddyProfile) => Match;
  leaveMatch: () => void;
  blockBuddy: (buddyId: string) => void;
  recordCheckIn: () => void;
  markArrived: () => void;
  resetTrip: () => void;
}

const TripSessionContext = createContext<TripSessionValue | null>(null);

export const TripSessionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TripSessionState>(readStored);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateTrip = useCallback((patch: Partial<TripRequest>) => {
    setState((current) => ({ ...current, trip: { ...current.trip, ...patch } }));
  }, []);

  const setTrip = useCallback((trip: TripRequest) => {
    setState((current) => ({ ...current, trip }));
  }, []);

  const setStage = useCallback((stage: TripStage) => {
    setState((current) => ({ ...current, stage }));
  }, []);

  const requestMatch = useCallback((buddy: BuddyProfile) => {
    const match: Match = {
      id: `match-${buddy.id}-${Date.now()}`,
      buddyId: buddy.id,
      overlapSummary: "",
      meetingArea: `${buddy.originStationZone} — main entrance`,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setState((current) => ({
      ...current,
      stage: "matched",
      matchedBuddy: buddy,
      match: { ...match, overlapSummary: overlapSummary(buddy, current.trip) },
    }));

    return match;
  }, []);

  const leaveMatch = useCallback(() => {
    setState((current) => ({
      ...current,
      stage: "planning",
      match: null,
      matchedBuddy: null,
    }));
  }, []);

  const blockBuddy = useCallback((buddyId: string) => {
    setState((current) => ({
      ...current,
      stage: current.matchedBuddy?.id === buddyId ? "planning" : current.stage,
      match: current.matchedBuddy?.id === buddyId ? null : current.match,
      matchedBuddy: current.matchedBuddy?.id === buddyId ? null : current.matchedBuddy,
      blockedBuddyIds: current.blockedBuddyIds.includes(buddyId)
        ? current.blockedBuddyIds
        : [...current.blockedBuddyIds, buddyId],
    }));
  }, []);

  const recordCheckIn = useCallback(() => {
    setState((current) => ({
      ...current,
      stage: current.stage === "matched" ? "in_transit" : current.stage,
      checkInsSent: current.checkInsSent + 1,
    }));
  }, []);

  const markArrived = useCallback(() => {
    setState((current) => ({
      ...current,
      stage: "arrived",
      match: current.match ? { ...current.match, status: "completed" } : null,
    }));
  }, []);

  const resetTrip = useCallback(() => {
    setState({ ...initialState, trip: DEFAULT_TRIP });
  }, []);

  const value = useMemo<TripSessionValue>(
    () => ({
      ...state,
      updateTrip,
      setTrip,
      setStage,
      requestMatch,
      leaveMatch,
      blockBuddy,
      recordCheckIn,
      markArrived,
      resetTrip,
    }),
    [
      state,
      updateTrip,
      setTrip,
      setStage,
      requestMatch,
      leaveMatch,
      blockBuddy,
      recordCheckIn,
      markArrived,
      resetTrip,
    ],
  );

  return (
    <TripSessionContext.Provider value={value}>{children}</TripSessionContext.Provider>
  );
};

export const useTripSession = (): TripSessionValue => {
  const context = useContext(TripSessionContext);
  if (!context) {
    throw new Error("useTripSession must be used within a TripSessionProvider");
  }
  return context;
};
