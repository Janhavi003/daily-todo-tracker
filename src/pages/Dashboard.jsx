import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";
import WeeklyHistory from "../components/WeeklyHistory";

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  const isLight = document.body.classList.contains("light");

  const setLight = () => document.body.classList.add("light");
  const setDark = () => document.body.classList.remove("light");

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Today’s Tasks</h1>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="theme-text-toggle">
          <span
            className={isLight ? "active" : ""}
            onClick={setLight}
          >
            Light
          </span>
          <span
            className={!isLight ? "active" : ""}
            onClick={setDark}
          >
            Dark
          </span>
        </div>
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
      <WeeklyHistory user={user} />

      <footer>
        <button className="logout-btn" onClick={() => signOut(auth)}>
          Logout
        </button>
      </footer>
    </div>
  );
}