import { useEffect, useMemo, useState } from "react";
import { PeopleCtx, type PeopleState } from "./PeopleContext";
import { fetchAllPeople, type Person } from "../features/characters/api";
import { personIdFromUrl } from "./personIdFromUrl";

export default function PeopleProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [people, setPeople]   = useState<Person[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchAllPeople();
        setPeople(all);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byId = useMemo(() => {
    const m: Record<string, Person> = {};
    for (const p of people) {
      const id = personIdFromUrl(p.url);
      if (id) m[id] = p;
    }
    return m;
  }, [people]);

  const getById = (id: string) => byId[id];

  const value: PeopleState = { loading, error, people, byId, getById };

  return <PeopleCtx.Provider value={value}>{children}</PeopleCtx.Provider>;
}
