import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TaskInput({ user }) {
  const [title, setTitle] = useState("");

  const addTask = async () => {
    if (!title.trim()) return;

    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      title,
      completed: false,
      date: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });

    setTitle("");
  };

  return (
    <div>
      <input
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}