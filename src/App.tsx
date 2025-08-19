import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import CharacterList from './features/characters/pages/CharacterList';
import CharacterDetails from './features/characters/pages/CharacterDetails';
import Favourites from './features/characters/pages/Favourites';
import RequirePeople from './RequirePeople';
import PeopleProvider from './context/PeopleProvider';
import './App.css';

function App() {
  return (
    <PeopleProvider>
      <div className="app-root">
        {/* Header */}
        <header className="app-header">
          <Link to="/characters" className="brand">
            Star Wars
          </Link>

          <nav className="nav-right">
            <NavLink
              to="/favourites"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Favourites
            </NavLink>
          </nav>
        </header>

        {/* Main content */}
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/characters" replace />} />

            <Route
              path="/characters"
              element={
                <RequirePeople>
                  <CharacterList />
                </RequirePeople>
              }
            />
            <Route
              path="/characters/:id"
              element={
                <RequirePeople>
                  <CharacterDetails />
                </RequirePeople>
              }
            />
            <Route path="/favourites" element={<Favourites />} />
          </Routes>
        </main>
      </div>
    </PeopleProvider>
  );
}

export default App;
