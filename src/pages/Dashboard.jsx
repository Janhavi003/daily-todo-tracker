import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>Today’s Tasks</h1>
      <p>{user.email}</p>

      <ProgressBar tasks={tasks} />

      <TaskInput user={user} />
      <TaskList user={user} tasks={tasks} setTasks={setTasks} />

      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
}