import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function WeeklyHistory({
  user,
  selectedDate,
  setSelectedDate,
}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const today = new Date();
      const days = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().split("T")[0]);
      }

      const q = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid),
        where("date", "in", days)
      );

      const snapshot = await getDocs(q);

      const grouped = {};
      snapshot.docs.forEach((doc) => {
        const t = doc.data();
        if (!grouped[t.date]) {
          grouped[t.date] = { total: 0, done: 0 };
        }
        grouped[t.date].total++;
        if (t.completed) grouped[t.date].done++;
      });

      setHistory(
        days.map((date) => {
          const d = grouped[date] || { total: 0, done: 0 };
          const percent =
            d.total === 0 ? 0 : Math.round((d.done / d.total) * 100);

          return { date, ...d, percent };
        })
      );
    };

    fetchHistory();
  }, [user.uid]);

  return (
    <div className="weekly-history">
      <h3>Weekly Overview</h3>

      {history.map((day) => (
        <div
          key={day.date}
          className={`weekly-row ${
            selectedDate === day.date ? "active" : ""
          }`}
          onClick={() => setSelectedDate(day.date)}
        >
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
            {day.done}/{day.total}
          </div>
        </div>
      ))}
    </div>
  );
}