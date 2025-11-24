import { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import "./App.css";

const INITIAL_TACHES = [
  { id: 1, texte: "Apprendre React", fait: true },
  { id: 2, texte: "Faire les exercices", fait: false },
  { id: 3, texte: "Boire un café", fait: false }
];

function App() {
  const [taches, setTaches] = useState(INITIAL_TACHES);
  const [filtre, setFiltre] = useState("toutes");
  const [dark, setDark] = useState(false);

  const [nouvelleTache, setNouvelleTache] = useState("");

  function handleAdd() {
    if (nouvelleTache.trim() === "") return;

    const nouvelle = {
      id: Date.now(),
      texte: nouvelleTache,
      fait: false
    };

    setTaches(prev => [...prev, nouvelle]);
    setNouvelleTache(""); 
  }


  
  function handleToggle(id) {
    setTaches(prev =>
      prev.map(t =>
        t.id === id ? { ...t, fait: !t.fait } : t
      )
    );
  }

  function handleDelete(id) {
    setTaches(prev => prev.filter(t => t.id !== id));
  }
  const tachesAffichees =
    filtre === "toutes"
      ? taches
      : filtre === "faites"
      ? taches.filter(t => t.fait)
      : taches.filter(t => !t.fait);

  return (
    <div className={dark ? "app dark" : "app"}>
      <h1>Ma Liste de Tâches</h1>



      <div className="add-bar">
        <input
          type="text"
          placeholder="Nouvelle tâche…"
          value={nouvelleTache}
          onChange={e => setNouvelleTache(e.target.value)}
        />
        <button onClick={handleAdd}>Ajouter</button>
      </div>


      <div className="toolbar">
        <div className="filtres">
          <button
            className={filtre === "toutes" ? "actif" : ""}
            onClick={() => setFiltre("toutes")}
          >
            Toutes
          </button>

          <button
            className={filtre === "faites" ? "actif" : ""}
            onClick={() => setFiltre("faites")}
          >
            Fait
          </button>

          <button
            className={filtre === "a-faire" ? "actif" : ""}
            onClick={() => setFiltre("a-faire")}
          >
            À faire
          </button>
        </div>

        <button className="theme-btn" onClick={() => setDark(d => !d)}>
           {dark ? "Clair" : "Sombre"}
        </button>

      </div>

      <TaskList
        taches={tachesAffichees}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
