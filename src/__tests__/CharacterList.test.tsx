import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CharacterList from "../features/characters/pages/CharacterList";
import PeopleProvider from "../context/PeopleProvider";   // ✅ default import
import { mockCharacters, mockPlanetByUrl } from "../__mocks__/mockCharacters";

// Mock the API used inside PeopleProvider + CharacterList
jest.mock("../features/characters/api", () => ({
    fetchAllPeople: jest.fn(async () => mockCharacters), // PeopleProvider will call this
    fetchPlanet: jest.fn(async (url: string) => ({ name: mockPlanetByUrl[url] || "—" })),
}));

function renderWithProviders(ui: React.ReactNode) {
    return render(
        <MemoryRouter>
            <PeopleProvider>{ui}</PeopleProvider>
        </MemoryRouter>
    );
}

describe("CharacterList", () => {
    test("renders characters from context", async () => {
        renderWithProviders(<CharacterList />);

        expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
        expect(await screen.findByText(/Leia Organa/i)).toBeInTheDocument();
        expect(await screen.findByText(/Tatooine/i)).toBeInTheDocument();
        expect(await screen.findByText(/Alderaan/i)).toBeInTheDocument();
    });

    test("search filters characters", async () => {
        renderWithProviders(<CharacterList />);
        const input = screen.getByPlaceholderText(/Search by name/i);
        fireEvent.change(input, { target: { value: "Luke" } });

        expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
        expect(screen.queryByText(/Leia Organa/i)).not.toBeInTheDocument();
    });
});
