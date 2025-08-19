# Star Wars Characters (React + TypeScript + Vite)

A small Star Wars directory app:

- **Characters list** with search, client-side pagination, and **Home Planet** resolution  
- **Character details** (Hair/Eye/Gender/Home Planet) + **Films** + **Starships**  
- **Favourites** stored in `localStorage` (toggle in details page)  
- Route guard to support **hard refresh/deep links** (preload people before rendering)

> Built with **React 19**, **Vite 7**, **TypeScript 5**, **react-router-dom 7**, **Jest** + **@testing-library**.

---

## Architecture & Approach

**UI Layer (React pages)**  
- `CharacterList` — table + search + client-side pagination; resolves `homeworld` names  
- `CharacterDetails` — reads person from context, fetches planet/films/starships, toggles favourite  
- `Favourites` — displays saved favourites

**State & Data Layer**  
- `PeopleProvider` — preloads all people once on app start (`fetchAllPeople()`), builds `byId`, exposes `getById(id)`  
- `RequirePeople` — gates `/characters/*` until preload finishes (handles hard refresh / deep link)  
- Local component state — search, pagination; favourites synced to `localStorage`

**API Layer (`features/characters/api.ts`)**  
- `fetchAllPeople()` — full list (no server pagination)  
- `fetchPlanet(url)` — returns `{ name }`  
- `fetchFilms(urls[])` — batch fetch film titles  
- `fetchStarships(urls[])` — batch fetch starship names

---

## 📂 Project Structure (high level)

src/
    App.tsx
    App.css
    main.tsx
    context/
        PeopleProvider.tsx
        usePeople.ts
        personIdFromUrl.ts
    features/
        characters/
            api.ts
            pages/
                CharacterList.tsx
                CharacterDetails.tsx
                Favourites.tsx
    mocks/
        mockCharacters.ts
    hooks/
        useDebounce.ts
    __tests__
        CharacterList.test.tsx
        CharacterDetails.test.tsx
        Favourites.test.tsx
    setupTests.ts
    vite.config.ts


## ▶️ Run the project locally

**Prereqs**: Node 18+

```bash
# install dependencies
npm install

# start dev server (Vite)
npm run dev
# -> http://localhost:5173

# run unit tests (Jest)
npm test

# production build
npm run build

# serve built files locally
npm run preview
```

# Testing (Jest + Testing Library)

Command: npm test (Jest, coverage enabled in script)

DOM helpers: @testing-library/react, @testing-library/jest-dom

Setup: src/setupTests.ts (adds jest-dom, TextEncoder/Decoder, mocks fetch)


# Code Style & Types

TypeScript strict mode recommended

ESLint configured for React hooks and refresh

Shared types for domain models (Person, Planet, Film, Starship) live under features/characters or can be moved to a @types package if this grows



# Known Limitations 

No server pagination — list is client-filtered/paginated (OK for current data size).
If SWAPI grows, move to server-side pagination; UI is API-agnostic enough to swap.

No network cache — repeated visits re-fetch planet/films/starships.
Next step: React Query or SWR for dedupe, retries, background refresh.

Skeletons — current loaders for films/starships are text; replace with skeleton UI for polish.

Error states — show inline retry (“Films failed to load — Retry”).


# Future Enhancements

React Query/SWR + normalized cache for people/planets/films/starships

Virtualized character list for very large datasets

Prefetch details data on row hover/focus

Server-backed favourites with optimistic updates

MSW for more realistic test fixtures & contract testing


## Maintainers’ Notes

The header is persistent (Star Wars + Favourites link).

On details, the Back button is top-left; the Favourites toggle lives top-right in the toolbar.

The details grid is responsive; films and starships render in cards (two-column on desktop, stacked on mobile).

