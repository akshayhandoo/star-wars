export const mockCharacters = [
  {
    name: "Luke Skywalker",
    gender: "male",
    homeworld: "https://swapi.test/api/planets/1/",
    url: "https://swapi.test/api/people/1/",
    films: [
      "https://swapi.test/api/films/1/",
      "https://swapi.test/api/films/2/",
    ],
    starships: ["https://swapi.test/api/starships/12/"],
  },
  {
    name: "Leia Organa",
    gender: "female",
    homeworld: "https://swapi.test/api/planets/2/",
    url: "https://swapi.test/api/people/5/",
    films: [],
    starships: [],
  },
];

export const mockPage = {
    count: 82,
    next: "https://swapi.test/api/people/?page=2",
    previous: null,
    results: mockCharacters,
};

export const mockCharacterDetails = {
    name: "Luke Skywalker",
    gender: "male",
    height: "172",
    mass: "77",
    birth_year: "19BBY",
    homeworld: "https://swapi.test/api/planets/1/",
    url: "https://swapi.test/api/people/1/",
    films: [
        "https://swapi.test/api/films/1/",
        "https://swapi.test/api/films/2/",
    ],
    starships: ["https://swapi.test/api/starships/12/"],
};

export const mockPlanetByUrl: Record<string, string> = {
    "https://swapi.test/api/planets/1/": "Tatooine",
    "https://swapi.test/api/planets/2/": "Alderaan",
};
