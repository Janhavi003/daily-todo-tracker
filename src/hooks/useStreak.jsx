import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function useStreak(uid) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = async () => {
      let currentStreak = 0;
      const today = new Date();

      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];

        const q = query(
          collection(db, "tasks"),
          where("uid", "==", uid),
          where("date", "==", dateStr)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) break;

        const tasks = snapshot.docs.map((doc) => doc.data());
        const allDone = tasks.every((t) => t.completed);

        if (!allDone) break;

        currentStreak++;
      }

      setStreak(currentStreak);
    };

    calculateStreak();
  }, [uid]);

  return streak;
}