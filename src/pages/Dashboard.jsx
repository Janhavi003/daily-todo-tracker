import { useState, useEffect } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";
import WeeklyHistory from "../components/WeeklyHistory";
import useStreak from "../hooks/useStreak";

export default function Dashboard({ user }) {
  const today = new Date().toISOString().split("T")[0];

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [username, setUsername] = useState(user.displayName || "");

  const isToday = selectedDate === today;
  const streak = useStreak(user.uid);

  const isLight = document.body.classList.contains("light");

  /* =========================
     ENSURE USERNAME EXISTS
  ========================= */
  useEffect(() => {
    const ensureUsername = async () => {
      if (!user.displayName) {
        const name = prompt("Choose a username:");

        if (name && name.trim()) {
          await updateProfile(user, {
            displayName: name.trim(),
          });
          setUsername(name.trim());
        }
      } else {
        setUsername(user.displayName);
      }
    };

    ensureUsername();
  }, [user]);

  /* =========================
     THEME TOGGLE
  ========================= */
  const setLight = () => document.body.classList.add("light");
  const setDark = () => document.body.classList.remove("light");

  return (
    <div className="app">
      {/* ================= HEADER ================= */}
      <header className="header">
        <div>
          <h1>
            {isToday ? "Today’s Tasks" : `Tasks for ${selectedDate}`}
          </h1>
          <p className="user-email">
            Hi, {username || "User"} 👋
          </p>
        </div>

        <div className="theme-text-toggle">
          <span className={isLight ? "active" : ""} onClick={setLight}>
            Light
          </span>
          <span className={!isLight ? "active" : ""} onClick={setDark}>
            Dark
          </span>
        </div>
      </header>

      {/* ================= STREAK ================= */}
      <div className="streak-card">
        🔥 {streak} day streak
      </div>

      {/* ================= PROGRESS (TODAY ONLY) ================= */}
      {isToday && (
        <section className="progress-section">
          <ProgressBar tasks={tasks} />
        </section>
      )}

      {/* ================= ADD TASK (TODAY ONLY) ================= */}
      {isToday && (
        <section className="input-section">
          <TaskInput user={user} />
        </section>
      )}

      {/* ================= TASK LIST ================= */}
      <section className="tasks-section">
        <TaskList
          user={user}
          tasks={tasks}
          setTasks={setTasks}
          selectedDate={selectedDate}
          isToday={isToday}
        />
      </section>

      {/* ================= WEEKLY HISTORY ================= */}
      <WeeklyHistory
        user={user}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* ================= FOOTER ================= */}
      <footer>
        <button
          className="logout-btn"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </footer>
    </div>
  );
}