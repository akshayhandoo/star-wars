import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PeopleProvider from "../context/PeopleProvider";
import CharacterDetails from "../features/characters/pages/CharacterDetails";
import {
    mockCharacters,
    mockCharacterDetails,
    mockPlanetByUrl,
} from "../__mocks__/mockCharacters";

// Mock API
jest.mock("../features/characters/api", () => {
    return {
        fetchAllPeople: jest.fn(async () => mockCharacters),
        fetchCharacter: jest.fn(async () => mockCharacterDetails),
        fetchPlanet: jest.fn(async (url: string) => ({
            name: mockPlanetByUrl[url] || "Unknown",
        })),
        fetchFilms: jest.fn(async () => [
            { title: "A New Hope" },
            { title: "The Empire Strikes Back" },
        ]),
        fetchStarships: jest.fn(async () => [{ name: "X-wing" }]),
    };
});

beforeEach(() => {
    localStorage.clear();
});

function renderWithProviders(initialPath: string) {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <PeopleProvider>
                <Routes>
                    <Route path="/characters/:id" element={<CharacterDetails />} />
                </Routes>
            </PeopleProvider>
        </MemoryRouter>
    );
}

describe("CharacterDetails", () => {
    test("renders character details and toggles favourites", async () => {
        renderWithProviders("/characters/1");

        // wait for character + planet
        expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
        expect(await screen.findByText(/Tatooine/i)).toBeInTheDocument();

        // toggle favourite
        const favBtn = await screen.findByRole("button", { name: /add to favourites/i });
        fireEvent.click(favBtn);

        let stored = JSON.parse(localStorage.getItem("favourites") || "[]");
        expect(stored.length).toBe(1);

        // toggle back
        fireEvent.click(await screen.findByRole("button", { name: /remove from favourites/i }));
        stored = JSON.parse(localStorage.getItem("favourites") || "[]");
        expect(stored.length).toBe(0);
    });

    test("renders films and starships list", async () => {
        renderWithProviders("/characters/1");

        expect(await screen.findByText(/A New Hope/i)).toBeInTheDocument();
        expect(await screen.findByText(/The Empire Strikes Back/i)).toBeInTheDocument();
        expect(await screen.findByText(/X-wing/i)).toBeInTheDocument();
    });
});
