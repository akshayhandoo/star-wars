import { BASE } from "../../lib/constant";

export type Person = {
  name: string;
  gender: string;
  homeworld: string;
  url: string;
  films: string[];
  starships: string[];
  height?: string;
  mass?: string;
  birth_year?: string;
};

export type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Planet = { name: string; url?: string };
export type Film = { title: string };
export type Starship = { name: string };

// --- API helpers ---

export async function fetchAllPeople(): Promise<Person[]> {
  const res = await fetch(`${BASE}people`);
  const data = await res.json();
  if (Array.isArray(data)) return data as Person[];
  return [];
}

export async function fetchPeoplePage(page: number): Promise<Page<Person>> {
  const res = await fetch(`${BASE}people?page=${page}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function searchPeople(query: string): Promise<Page<Person>> {
  const res = await fetch(`${BASE}people?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchCharacter(id: string): Promise<Person> {
  const res = await fetch(`${BASE}people/${id}/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchPlanet(url: string): Promise<Planet> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchFilms(urls: string[]): Promise<Film[]> {
  return Promise.all(urls.map(async (u) => {
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }));
}

export async function fetchStarships(urls: string[]): Promise<Starship[]> {
  return Promise.all(urls.map(async (u) => {
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }));
}
