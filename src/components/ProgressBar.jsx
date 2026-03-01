import React from "react";

export default function ProgressBar({ tasks }) {
  if (!tasks.length) return null;

  const completed = tasks.filter((t) => t.completed).length;
  const percent = Math.round((completed / tasks.length) * 100);

  return (
    <div style={{ margin: "20px 0" }}>
      <p>
        Progress: {completed}/{tasks.length} tasks completed ({percent}%)
      </p>

      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#333",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#4caf50",
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  );
}