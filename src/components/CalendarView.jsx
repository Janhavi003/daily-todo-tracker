import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CalendarView({ user, setSelectedDate, selectedDate }) {
  const [taskDays, setTaskDays] = useState([]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  useEffect(() => {
    const loadMonthData = async () => {
      const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const end = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth}`;

      const q = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid),
        where("date", ">=", start),
        where("date", "<=", end)
      );

      const snap = await getDocs(q);

      const dates = new Set();

      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.completed) {
          dates.add(data.date);
        }
      });

      setTaskDays([...dates]);
    };

    loadMonthData();
  }, [user.uid]);

  const days = [];

  for (let i = 0; i < startWeekday; i++) {
    days.push(<div key={"empty-" + i}></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;

    const isCompleted = taskDays.includes(dateStr);
    const isSelected = selectedDate === dateStr;

    days.push(
      <div
        key={dateStr}
        className={`calendar-day ${
          isCompleted ? "calendar-complete" : ""
        } ${isSelected ? "calendar-selected" : ""}`}
        onClick={() => setSelectedDate(dateStr)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="calendar">
      <h3>This Month</h3>

      <div className="calendar-grid">{days}</div>
    </div>
  );
}