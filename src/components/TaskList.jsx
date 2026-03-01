import { useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function TaskList({ user, tasks, setTasks }) {
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

  if (tasks.length === 0) {
    return <p>No tasks yet</p>;
  }

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