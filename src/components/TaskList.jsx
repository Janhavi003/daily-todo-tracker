import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function TaskList({ user, tasks, setTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      where("date", "==", today)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user.uid, setTasks]);

  const toggleTask = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  };

  const saveEdit = async (task) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, "tasks", task.id), { title: editText });
    setEditingId(null);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet ✨</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task)}
          />

          {editingId === task.id ? (
            <input
              className="inline-edit"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => saveEdit(task)}
              autoFocus
            />
          ) : (
            <span
              className="task-title"
              onDoubleClick={() => {
                setEditingId(task.id);
                setEditText(task.title);
              }}
            >
              {task.title}
            </span>
          )}

          <div className="task-actions">
            <button
              className="icon-btn"
              onClick={() => deleteTask(task.id)}
              title="Delete"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}