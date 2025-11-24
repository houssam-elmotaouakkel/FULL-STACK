function TaskItem({ id, texte, fait, onToggle, onDelete }) {
  return (
    <li className={fait ? "tache tache-fait" : "tache"}>
      <input
        type="checkbox"
        checked={fait}
        onChange={() => onToggle(id)}
      />

      <span>{texte}</span>

      <button className="delete-btn" onClick={() => onDelete(id)}>
        SUPRRIMER
      </button>
    </li>
  );
}

export default TaskItem;
