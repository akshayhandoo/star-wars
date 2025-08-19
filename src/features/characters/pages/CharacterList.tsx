import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePeople } from "../../../context/usePeople";
import { personIdFromUrl } from "../../../context/personIdFromUrl";
import { fetchPlanet } from "../api";

export default function CharactersList() {
  const { people } = usePeople();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState<number>(10);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const [planetNames, setPlanetNames] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);

  useEffect(() => {
    if (allSelected) {
      setPageSize(filtered.length || 1);
      setPage(1);
    }
  }, [filtered.length, allSelected]);
  
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil((filtered.length || 1) / (pageSize || 1)));
    if (page > maxPage) setPage(1);
  }, [filtered.length, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / (pageSize || 1)));
  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  // Page-size options that adapt to data length
  const sizeOptions = useMemo(() => {
    const base = [5, 10, 20, 50, 100];
    const opts = base.filter((n) => n < filtered.length);
    return opts;
  }, [filtered.length]);

  useEffect(() => {
    const urls = [...new Set(current.map((p) => p.homeworld))].filter(Boolean) as string[];
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

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "all") {
      setAllSelected(true);
      setPageSize(filtered.length || 1);
    } else {
      setAllSelected(false);
      setPageSize(Number(val));
    }
    setPage(1);
  };

  return (
    <div className="page">
      <div className="page-toolbar">
        <h1 className="page-title">Characters</h1>
      </div>

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
          <table className="characters-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Name</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Gender</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Home Planet</th>
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
                    <td data-label="Name" style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{p.name}</td>
                    <td data-label="Gender" style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      {p.gender === "n/a" ? "-" : p.gender}
                    </td>
                    <td data-label="Homeworld" style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{homeworld}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination + page-size controls */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <label htmlFor="page-size">Rows per page:</label>
              <select
                id="page-size"
                value={allSelected ? "all" : String(pageSize)}
                onChange={handlePageSizeChange}
              >
                {sizeOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
                {filtered.length > 0 && <option value="all">All ({filtered.length})</option>}
              </select>

              <span style={{ opacity: 0.8 }}>
                Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
