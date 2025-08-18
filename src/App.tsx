import { Routes, Route, Link, Navigate } from 'react-router-dom';
import CharacterList from './features/characters/pages/CharacterList';
import CharacterDetails from './features/characters/pages/CharacterDetails';
import Favourites from './features/characters/pages/Favourites';
import RequirePeople from './RequirePeople';
import PeopleProvider from './context/PeopleProvider'; // <-- your provider
import './App.css';

function App() {
  return (
    <PeopleProvider>
      <div className="container">
        <nav>
          <Link to="/favourites">Favourites</Link>
        </nav>

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
      </div>
    </PeopleProvider>
  );
}

export default App;
