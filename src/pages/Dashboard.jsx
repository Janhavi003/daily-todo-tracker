import { useState, useEffect, useRef } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";
import WeeklyHistory from "../components/WeeklyHistory";
import useStreak from "../hooks/useStreak";
import CalendarView from "../components/CalendarView";

export default function Dashboard({ user }) {
  const today = new Date().toISOString().split("T")[0];

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [username, setUsername] = useState(user.displayName || "");
  const [animateStreak, setAnimateStreak] = useState(false);
  const taskInputRef = useRef(null);

  const prevStreak = useRef(0);
  const streak = useStreak(user.uid);

  const isToday = selectedDate === today;
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
     STREAK ANIMATION
  ========================= */
 useEffect(() => {
  if (prevStreak.current !== 0 && streak > prevStreak.current) {
    requestAnimationFrame(() => {
      setAnimateStreak(true);

      setTimeout(() => {
        setAnimateStreak(false);
      }, 1400);
    });
  }

  prevStreak.current = streak;
}, [streak]);
  useEffect(() => {
  const handleKey = (e) => {
    const active = document.activeElement;

    // Prevent shortcuts while typing
    if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") return;

    // N → focus new task
    if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      taskInputRef.current?.focus();
    }

    // T → go to today
    if (e.key === "t" || e.key === "T") {
      e.preventDefault();
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    }

    // Arrow Right → next day
    if (e.key === "ArrowRight") {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      setSelectedDate(d.toISOString().split("T")[0]);
    }

    // Arrow Left → previous day
    if (e.key === "ArrowLeft") {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      setSelectedDate(d.toISOString().split("T")[0]);
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => window.removeEventListener("keydown", handleKey);
}, [selectedDate]);
  /* =========================
     THEME TOGGLE
  ========================= */
  const setLight = () => document.body.classList.add("light");
  const setDark = () => document.body.classList.remove("light");

  return (
    <div className="app">
      {/* HEADER */}
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

      {/* KEYBOARD SHORTCUT HINT */}
<p className="keyboard-hints">
  Shortcuts: N → new task • ← → change day • T → today
</p>
      {/* STREAK */}
      <div
        className={`streak-card ${
          animateStreak ? "streak-pop streak-glow" : ""
        }`}
      >
        🔥 {streak} day streak
      </div>
      <CalendarView
  user={user}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>

      {/* PROGRESS */}
      {isToday && (
        <section className="progress-section">
          <ProgressBar tasks={tasks} />
        </section>
      )}

      {/* ADD TASK */}
      {isToday && (
        <section className="input-section">
          <TaskInput user={user} inputRef={taskInputRef} />
        </section>
      )}

      {/* TASK LIST */}
      <section className="tasks-section">
        <TaskList
          user={user}
          tasks={tasks}
          setTasks={setTasks}
          selectedDate={selectedDate}
          isToday={isToday}
        />
      </section>

      {/* WEEKLY HISTORY */}
      <WeeklyHistory
        user={user}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* FOOTER */}
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