import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePeople } from "../../../context/usePeople";
import { fetchPlanet, fetchFilms, fetchStarships } from "../api";

type FavouriteCharacter = {
    name: string;
    gender: string;
    height: string;
    homeworld: string;
};

export default function CharacterDetails() {
    const { id = "" } = useParams();
    const { getById } = usePeople();
    const navigate = useNavigate();

    const person = getById(id);

    const [planetName, setPlanetName] = useState<string>("");
    const [films, setFilms] = useState<{ title: string }[]>([]);
    const [starships, setStarships] = useState<{ name: string }[]>([]);
    const [filmsLoading, setFilmsLoading] = useState(false);
    const [starshipsLoading, setStarshipsLoading] = useState(false);

    const [favourites, setFavourites] = useState<FavouriteCharacter[]>(() => {
        try {
            const stored = localStorage.getItem("favourites");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist favourites to localStorage
    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

    // Fetch homeworld name if available
    useEffect(() => {
        let alive = true;
        if (person?.homeworld) {
            fetchPlanet(person.homeworld)
                .then((planet) => alive && setPlanetName(planet.name))
                .catch(() => alive && setPlanetName("Unknown"));
        } else {
            setPlanetName("");
        }
        return () => {
            alive = false;
        };
    }, [person?.homeworld]);

    // Films
    useEffect(() => {
        let alive = true;
        if (Array.isArray(person?.films) && person.films.length > 0) {
            setFilmsLoading(true);
            fetchFilms(person.films)
                .then((data) => alive && setFilms(data))
                .catch(() => alive && setFilms([]))
                .finally(() => alive && setFilmsLoading(false));
        } else {
            setFilms([]);
            setFilmsLoading(false);
        }
        return () => {
            alive = false;
        };
    }, [person?.films]);

    // Starships
    useEffect(() => {
        let alive = true;
        if (Array.isArray(person?.starships) && person.starships.length > 0) {
            setStarshipsLoading(true);
            fetchStarships(person.starships)
                .then((data) => alive && setStarships(data))
                .catch(() => alive && setStarships([]))
                .finally(() => alive && setStarshipsLoading(false));
        } else {
            setStarships([]);
            setStarshipsLoading(false);
        }
        return () => {
            alive = false;
        };
    }, [person?.starships]);

    if (!person) {
        return (
            <div style={{ padding: 16 }}>
                <p>Character not found. Try going back to the list.</p>
                <button onClick={() => navigate("/characters")}>Back to list</button>
            </div>
        );
    }

    const isFavourite = favourites.some((f) => f.name === person.name);

    const toggleFavourite = () => {
        if (!planetName) return;
        if (isFavourite) {
            setFavourites((prev) => prev.filter((f) => f.name !== person.name));
        } else {
            const newFav: FavouriteCharacter = {
                name: person.name,
                gender: person.gender ?? "-",
                height: person.height ?? "-",
                homeworld: planetName || "Unknown",
            };
            setFavourites((prev) => [...prev, newFav]);
        }
    };

    const fmt = (v?: string) => {
        const s = (v ?? "").trim().toLowerCase();
        if (!s || s === "n/a" || s === "unknown") return "-";
        return (v ?? "-");
    };

    return (
        <div className="page">
            <div className="page-toolbar">
                <button onClick={() => navigate(-1)} className="back-btn" aria-label="Go back">
                    ← Back
                </button>

                <button
                    onClick={toggleFavourite}
                    className={`fav-btn ${isFavourite ? "active" : ""}`}
                    aria-pressed={isFavourite}
                    aria-label={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                    title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                >
                    {isFavourite ? "★ Favourited" : "☆ Add to Favourites"}
                </button>
            </div>

            <h1 className="page-title">{person.name}</h1>

            <section className="card details-grid">
                <div>Hair Colour</div><div>{fmt(person.hair_color)}</div>
                <div>Eye Colour</div><div>{fmt(person.eye_color)}</div>
                <div>Gender</div><div>{fmt(person.gender)}</div>
                <div>Home Planet</div><div>{planetName || "Loading..."}</div>
            </section>

            {(filmsLoading || films.length > 0 || starshipsLoading || starships.length > 0) && (
                <div className="two-col">
                    {(filmsLoading || films.length > 0) && (
                        <section className="card">
                            <h3>Films</h3>
                            {filmsLoading ? <p className="muted">Loading films…</p> : (
                                <ul style={{ marginLeft: "10px" }}>{films.map((f) => <li key={f.title}>{f.title}</li>)}</ul>
                            )}
                        </section>
                    )}

                    {(starshipsLoading || starships.length > 0) && (
                        <section className="card">
                            <h3>Starships</h3>
                            {starshipsLoading ? <p className="muted">Loading starships…</p> : (
                                <ul style={{ marginLeft: "10px" }}>{starships.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
                            )}
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
