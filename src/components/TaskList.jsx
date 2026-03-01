import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      where("date", "==", today)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user.uid]);

  const toggleTask = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task)}
          />
          {task.title}
        </li>
      ))}
    </ul>
  );
}