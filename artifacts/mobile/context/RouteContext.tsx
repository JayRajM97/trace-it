import React, { createContext, useContext, useReducer } from "react";
import type { RouteResponse } from "@workspace/api-zod";
import type { LatLng } from "../lib/geo";
import type { WalkedPoint } from "../lib/gpxSerializer";

interface RouteState {
  center: LatLng | null;
  diameterMeters: number;
  selectedShapeId: string | null;
  activeRoute: RouteResponse | null;
  currentStepIndex: number;
  walkedPolyline: WalkedPoint[];
  isWalking: boolean;
}

type RouteAction =
  | { type: "SET_CENTER"; payload: LatLng }
  | { type: "SET_DIAMETER"; payload: number }
  | { type: "SELECT_SHAPE"; payload: string }
  | { type: "SET_ACTIVE_ROUTE"; payload: RouteResponse }
  | { type: "START_WALKING" }
  | { type: "ADVANCE_STEP" }
  | { type: "APPEND_WALKED_POINT"; payload: WalkedPoint }
  | { type: "FINISH_WALKING" }
  | { type: "RESET" };

const initialState: RouteState = {
  center: null,
  diameterMeters: 1000,
  selectedShapeId: null,
  activeRoute: null,
  currentStepIndex: 0,
  walkedPolyline: [],
  isWalking: false,
};

function reducer(state: RouteState, action: RouteAction): RouteState {
  switch (action.type) {
    case "SET_CENTER":
      return { ...state, center: action.payload };
    case "SET_DIAMETER":
      return { ...state, diameterMeters: action.payload };
    case "SELECT_SHAPE":
      return { ...state, selectedShapeId: action.payload };
    case "SET_ACTIVE_ROUTE":
      return { ...state, activeRoute: action.payload, currentStepIndex: 0, walkedPolyline: [] };
    case "START_WALKING":
      return { ...state, isWalking: true };
    case "ADVANCE_STEP":
      return {
        ...state,
        currentStepIndex: Math.min(
          state.currentStepIndex + 1,
          (state.activeRoute?.turns.length ?? 1) - 1
        ),
      };
    case "APPEND_WALKED_POINT":
      return { ...state, walkedPolyline: [...state.walkedPolyline, action.payload] };
    case "FINISH_WALKING":
      return { ...state, isWalking: false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface RouteContextValue extends RouteState {
  setCenter: (ll: LatLng) => void;
  setDiameter: (m: number) => void;
  selectShape: (id: string) => void;
  setActiveRoute: (r: RouteResponse) => void;
  startWalking: () => void;
  advanceStep: () => void;
  appendWalkedPoint: (p: WalkedPoint) => void;
  finishWalking: () => void;
  reset: () => void;
}

const RouteContext = createContext<RouteContextValue | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: RouteContextValue = {
    ...state,
    setCenter: (ll) => dispatch({ type: "SET_CENTER", payload: ll }),
    setDiameter: (m) => dispatch({ type: "SET_DIAMETER", payload: m }),
    selectShape: (id) => dispatch({ type: "SELECT_SHAPE", payload: id }),
    setActiveRoute: (r) => dispatch({ type: "SET_ACTIVE_ROUTE", payload: r }),
    startWalking: () => dispatch({ type: "START_WALKING" }),
    advanceStep: () => dispatch({ type: "ADVANCE_STEP" }),
    appendWalkedPoint: (p) => dispatch({ type: "APPEND_WALKED_POINT", payload: p }),
    finishWalking: () => dispatch({ type: "FINISH_WALKING" }),
    reset: () => dispatch({ type: "RESET" }),
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRouteContext(): RouteContextValue {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error("useRouteContext must be inside RouteProvider");
  return ctx;
}
