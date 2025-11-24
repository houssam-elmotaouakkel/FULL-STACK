import React, { useState, useEffect, useMemo } from "react";
import useFetch from "./hooks/useFetch.jsx";
import useLocalStorage from "./hooks/useLocalStorage.jsx";
import "./App.css";

export default function App() {
  const { data: users = [], loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const [search, setSearch] = useState("");
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const [theme, setTheme] = useLocalStorage("theme", "light");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [openIds, setOpenIds] = useState([]);
  const toggleUser = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Annuaire d'utilisateurs</h1>
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <p>Auto-refresh dans : {seconds} secondes</p>

      <input
        className="search"
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="user-list">
        {filteredUsers.map((user) => {
          const isOpen = openIds.includes(user.id);
          return (
            <li key={user.id} className="user-item">
              <div className="user-header">
                <strong>{user.name}</strong>
                <button onClick={() => toggleUser(user.id)}>
                  {isOpen ? "Cacher détails" : "Voir détails"}
                </button>
              </div>
              {isOpen && (
                <div className="user-details">
                  <p>Email: {user.email}</p>
                  <p>Téléphone: {user.phone}</p>
                  <p>
                    Adresse: {user.address?.street}, {user.address?.city}
                  </p>
                  <p>Entreprise: {user.company?.name}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
