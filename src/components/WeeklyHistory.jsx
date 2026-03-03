import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function WeeklyHistory({ user }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchWeeklyHistory = async () => {
      const today = new Date();
      const last7Days = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        last7Days.push(d.toISOString().split("T")[0]);
      }

      const q = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid),
        where("date", "in", last7Days)
      );

      const snapshot = await getDocs(q);

      const grouped = {};

      snapshot.docs.forEach((doc) => {
        const task = doc.data();
        if (!grouped[task.date]) {
          grouped[task.date] = { total: 0, completed: 0 };
        }
        grouped[task.date].total++;
        if (task.completed) grouped[task.date].completed++;
      });

      const formatted = last7Days.map((date) => {
        const data = grouped[date] || { total: 0, completed: 0 };
        const percent =
          data.total === 0
            ? 0
            : Math.round((data.completed / data.total) * 100);

        return {
          date,
          ...data,
          percent,
        };
      });

      setHistory(formatted);
    };

    fetchWeeklyHistory();
  }, [user.uid]);

  return (
    <div className="weekly-history">
      <h3>Weekly Overview</h3>

      {history.map((day) => (
        <div key={day.date} className="weekly-row">
          <div className="weekly-label">
            {new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </div>

          <div className="weekly-bar">
            <div
              className="weekly-bar-fill"
              style={{ width: `${day.percent}%` }}
            />
          </div>

          <div className="weekly-percent">
            {day.completed}/{day.total} ({day.percent}%)
          </div>
        </div>
      ))}
    </div>
  );
}