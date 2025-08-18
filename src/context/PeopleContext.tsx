import { createContext } from "react";
import type { Person } from "../features/characters/api";


export type PeopleState = {
    loading: boolean;
    error: string | null;
    people: Person[];
    byId: Record<string, Person>;
    getById: (id: string) => Person | undefined;
};

export const PeopleCtx = createContext<PeopleState | null>(null);
