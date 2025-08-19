import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type FavouriteCharacter = {
  name: string;
  gender: string;
  height: string;
  homeworld: string;
};

export default function Favourites() {
  const [favourites, setFavourites] = useState<FavouriteCharacter[]>(() => {
    try {
      const stored = localStorage.getItem("favourites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  const [editing, setEditing] = useState<string | null>(null);
  const [draftGender, setDraftGender] = useState("");
  const [draftHeight, setDraftHeight] = useState("");

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const removeFromFavourites = (name: string) => {
    setFavourites(favourites.filter((f) => f.name !== name));
  };

  const startEditing = (char: FavouriteCharacter) => {
    setEditing(char.name);
    setDraftGender(char.gender);
    setDraftHeight(char.height);
  };

  const saveEdit = (name: string) => {
    setFavourites(
      favourites.map((f) =>
        f.name === name ? { ...f, gender: draftGender, height: draftHeight } : f
      )
    );
    setEditing(null);
  };

  return (
    <div className="page">
      <div className="page-toolbar">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      </div>
      <h1 className="page-title">Favourites</h1>
      {favourites.length === 0 ? (
        <p className="empty-text">No favourites yet</p>
      ) : (
        <div className="favourites-grid">
          {favourites.map((f) => (
            <div className="fav-card" key={f.name}>
              {editing === f.name ? (
                <>
                  <h3>{f.name}</h3>
                  <div className="field">
                    Gender:
                    <input
                      value={draftGender}
                      onChange={(e) => setDraftGender(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    Height:
                    <input
                      value={draftHeight}
                      onChange={(e) => setDraftHeight(e.target.value)}
                    />
                  </div>
                  <div className="btn-row">
                    <button className="save-btn" onClick={() => saveEdit(f.name)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{f.name}</h3>
                  <p><strong>Gender:</strong> {f.gender}</p>
                  <p><strong>Height:</strong> {f.height} cm</p>
                  <p><strong>Home:</strong> {f.homeworld}</p>
                  <div className="btn-row">
                    <button className="edit-btn" onClick={() => startEditing(f)}>Edit</button>
                    <button className="remove-btn" onClick={() => removeFromFavourites(f.name)}>Remove</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
