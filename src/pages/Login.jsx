import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isLight = document.body.classList.contains("light");

  const setLight = () => document.body.classList.add("light");
  const setDark = () => document.body.classList.remove("light");

  const signup = async () => {
    try {
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="header">
          <div>
            <h1 className="auth-title">Welcome! </h1>
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
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="auth-actions">
          <button onClick={signup}>Sign Up</button>
          <button className="secondary" onClick={login}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}