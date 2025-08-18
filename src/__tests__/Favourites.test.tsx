import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Favourites from "../features/characters/pages/Favourites";

describe("Favourites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders empty state when no favourites", () => {
    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );
    expect(screen.getByText(/No favourites yet/i)).toBeInTheDocument();
  });

  test("renders favourites from localStorage", () => {
    localStorage.setItem(
      "favourites",
      JSON.stringify([{ name: "Luke Skywalker", gender: "male", height: "172", homeworld: "Tatooine" }])
    );

    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );

    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Tatooine/i)).toBeInTheDocument();
  });

  test("can edit and save favourite", () => {
    localStorage.setItem(
      "favourites",
      JSON.stringify([{ name: "Leia Organa", gender: "female", height: "150", homeworld: "Alderaan" }])
    );

    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    const genderInput = screen.getByDisplayValue("female");
    fireEvent.change(genderInput, { target: { value: "queen" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText(/queen/i)).toBeInTheDocument();
  });

  test("can remove favourite", () => {
    localStorage.setItem(
      "favourites",
      JSON.stringify([{ name: "Luke Skywalker", gender: "male", height: "172", homeworld: "Tatooine" }])
    );

    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.getByText(/No favourites yet/i)).toBeInTheDocument();
  });
});
