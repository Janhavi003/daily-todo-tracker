import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TaskList({ user, tasks, setTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      where("date", "==", today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTasks(data);
    });

    return () => unsubscribe();
  }, [user.uid, setTasks]);

  const toggleTask = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async (task) => {
    if (!editValue.trim()) return;

    await updateDoc(doc(db, "tasks", task.id), {
      title: editValue,
    });

    setEditingId(null);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks for today</p>;
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
              className="edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(task)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit(task)}
              autoFocus
            />
          ) : (
            <span
              className="task-title"
              onDoubleClick={() => startEdit(task)}
            >
              {task.title}
            </span>
          )}

          <div className="task-actions">
            <button onClick={() => startEdit(task)}>edit</button>
            <button onClick={() => deleteTask(task.id)}>delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}