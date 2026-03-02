import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="app">
      <header className="header">
        <h1>Today’s Tasks</h1>
        <p className="user-email">{user.email}</p>
      </header>

      <section className="progress-section">
        <ProgressBar tasks={tasks} />
      </section>

      <section className="input-section">
        <TaskInput user={user} />
      </section>

      <section className="tasks-section">
        <TaskList user={user} tasks={tasks} setTasks={setTasks} />
      </section>

      <footer className="footer">
        <button className="logout-btn" onClick={() => signOut(auth)}>
          Logout
        </button>
      </footer>
    </div>
  );
}