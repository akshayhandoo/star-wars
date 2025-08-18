*********  Architecture & Approach *********
1) UI Layer (React Components)

Pages: CharacterList, CharacterDetails, Favourites

Role: Presentation + user interaction only.

Notes:

CharacterList shows Homeworld name (resolved via API).

CharacterDetails reads the person from in-memory store, fetches planet/films/starships names, and provides a toggle Favourite button (localStorage-backed).

2) State & Data Layer

PeopleProvider (context/PeopleProvider.tsx):

Preloads all people once on app start (fetchAllPeople()).

Builds an byId map and exposes getById(id).

Route Guard (RequirePeople):

Gates /characters routes until preload finishes (handles hard refresh/deep link).

Local state: component UI state (search, pagination), localStorage sync for favourites.

(Optional) useDebounce:

Not required with current client-side search, but ready if we move to server-side search.

3) API Layer (features/characters/api.ts)

Endpoints in use:

fetchAllPeople() — loads the full list (no server pagination).

fetchPlanet(url) — returns { name } (with a small in-memory cache recommended).

fetchFilms(urls[]) — batch-fetch film titles.

fetchStarships(urls[]) — batch-fetch starship names.





*********  Additional Considerations *********

1. Maintainability

Modular structure:

features/c1) Maintainability

Clear boundaries:

features/characters/api.ts → networking

features/characters/pages/ → UI

context/ → app data store

hooks/ → reusable hooks

Centralized mocks: __mocks__/mockCharacters.ts power unit tests.

Type safety: shared types; strict TS settings.

Fast Refresh friendliness: files that export components do not export utilities; hooks/utils live in their own files.

2) Scalability

Data growth:

Today: client-side filtering + pagination on the full list.

If people count grows large: switch to server pagination; keep UI API-agnostic.

Caching: Introduce React Query/SWR for dedupe, background refresh, and retries.

Composition: The same pattern can scale to Starships, Planets, etc.

Persistence:

Now: localStorage for favourites.

Later: server-backed profiles to sync across devices.

3) Clarity & Understandability

Domain naming: CharacterList, Favourites, etc.

Tests as docs: Expectations for list rendering, details lookups, favourite toggling, and name resolution.




*********  If This Became a Multi-Team Foundation *********

1) Repo & Packages

Monorepo with workspaces:

apps/web (this app)

packages/@ui (design system + Storybook)

packages/@types (domain models: Person, Planet, Film, Starship)

packages/@api (generated client from OpenAPI/JSON-Schema; shared fetch layer)

packages/@config (eslint/prettier/tsconfig)

packages/@testing (test utils, MSW handlers)

Ownership: CODEOWNERS per package/feature.

2) Contracts & Data

Source-of-truth schema: OpenAPI/JSON-Schema; generate types + clients.

Contract tests: validate mocks against schema (avoid drift).

MSW in tests and local dev to simulate backend scenarios.

3) Design System & Accessibility

Shared components in @ui with Storybook and visual tests.

A11y: lint rules + axe checks, keyboard navigation, focus management.

i18n: message catalogs + ICU formatting + RTL support.

4) CI/CD & Quality Gates

Pipelines: typecheck, eslint, unit tests, MSW contract tests, e2e (Playwright), a11y checks.

Budgets: bundle size, Lighthouse (web vitals), performance budgets.

Preview deploys per PR.

5) Runtime Ops

Observability: Sentry (errors), RUM/web-vitals, feature usage telemetry.

Feature flags: LaunchDarkly/Unleash for safe rollouts.

Security: Dependabot, npm audit, CSP, SRI, and allowed-list proxies.

6) Data Layer Evolution

React Query/SWR as the standard fetch layer (query keys per entity).

Normalized cache for cross-screen consistency (people/planets/films/starships).

Prefetching on route transitions; stale-while-revalidate.




*********  Future Enhancements *********

Migrate to React Query with query keys: ['people'], ['planet', id], ['film', id], ['starship', id].

Error Boundaries per route segment.

Virtualized lists for very large datasets.

Server pagination + filters when SWAPI (or a proxy) supports it.

Server-backed favourites (user profiles) with optimistic updates.