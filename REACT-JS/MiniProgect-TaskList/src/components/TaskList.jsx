import TaskItem from "./TaskItem";

function TaskList({ taches, onToggle, onDelete }) {
  if (taches.length === 0) {
    return <p>Aucune tâche à afficher.</p>;
  }

  return (
    <ul>
      {taches.map(t => (
        <TaskItem
          key={t.id}
          id={t.id}
          texte={t.texte}
          fait={t.fait}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
