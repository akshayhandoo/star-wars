import { useContext } from "react";
import { PeopleCtx } from "./PeopleContext";

export function usePeople() {
  const ctx = useContext(PeopleCtx);
  if (!ctx) throw new Error("usePeople must be used within <PeopleProvider>");
  return ctx;
}