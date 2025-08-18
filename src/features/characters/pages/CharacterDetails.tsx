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
        if (person?.homeworld) {
            fetchPlanet(person.homeworld)
                .then((planet) => setPlanetName(planet.name))
                .catch(() => setPlanetName("Unknown"));
        }
    }, [person?.homeworld]);

    useEffect(() => {
        if (Array.isArray(person?.films) && person.films.length > 0) {
            fetchFilms(person.films)
                .then(setFilms)
                .catch(() => setFilms([]));
        }
    }, [person?.films]);

    useEffect(() => {
        if (Array.isArray(person?.starships) && person.starships.length > 0) {
            fetchStarships(person.starships)
                .then(setStarships)
                .catch(() => setStarships([]));
        }
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


    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
                ← Back
            </button>

            <h1 style={{ marginTop: 0 }}>{person.name}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 8 }}>
                <div>Gender</div>
                <div>{person.gender ?? "-"}</div>

                <div>Height</div>
                <div>{person.height ?? "-"}</div>

                <div>Mass</div>
                <div>{person.mass ?? "-"}</div>

                <div>Birth Year</div>
                <div>{person.birth_year ?? "-"}</div>

                <div>Homeworld</div>
                <div>{planetName || "Loading..."}</div>
            </div>

            <div style={{ marginTop: 16 }}>
                <button
                    onClick={toggleFavourite}
                    style={{
                        padding: "8px 12px",
                        background: isFavourite ? "crimson" : "#0077ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                    }}
                >
                    {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                </button>
            </div>

            {films.length > 0 && (
                <>
                    <h3 style={{ marginTop: 16 }}>Films</h3>
                    <ul>
                        {films.map((f) => (
                            <li key={f.title}>{f.title}</li>
                        ))}
                    </ul>
                </>
            )}

            {starships.length > 0 && (
                <>
                    <h3 style={{ marginTop: 16 }}>Starships</h3>
                    <ul>
                        {starships.map((s) => (
                            <li key={s.name}>{s.name}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
