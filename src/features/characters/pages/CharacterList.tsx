import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePeople } from "../../../context/usePeople";
import { personIdFromUrl } from "../../../context/personIdFromUrl";
import { fetchPlanet } from "../api";

const PAGE_SIZE = 20;

export default function CharactersList() {
  const { people } = usePeople();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [planetNames, setPlanetNames] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);

  if ((page - 1) * PAGE_SIZE >= filtered.length && page !== 1) {
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const current = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    const urls = [...new Set(current.map((p) => p.homeworld))].filter(Boolean);
    const toFetch = urls.filter((u) => !(u in planetNames));

    if (toFetch.length === 0) return;

    Promise.all(
      toFetch.map(async (url) => {
        try {
          const planet = await fetchPlanet(url);
          return [url, planet.name] as const;
        } catch {
          return [url, "Unknown"] as const;
        }
      })
    ).then((pairs) => {
      setPlanetNames((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
    });
  }, [current, planetNames]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ margin: "0 0 12px" }}>Characters</h1>

      <input
        type="text"
        placeholder="Search by name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: 280, marginBottom: 12 }}
      />

      {filtered.length === 0 ? (
        <p>No characters match your search.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Name</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Gender</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Homeworld</th>
              </tr>
            </thead>
            <tbody>
              {current.map((p) => {
                const id = personIdFromUrl(p.url);
                const homeworld = planetNames[p.homeworld] ?? "Loading…";

                return (
                  <tr
                    key={p.url || p.name}
                    onClick={() => id && navigate(`/characters/${id}`)}
                    style={{ cursor: id ? "pointer" : "default" }}
                  >
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{p.name}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{p.gender ?? "-"}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{homeworld}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
