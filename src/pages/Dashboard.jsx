import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Dashboard({ user }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user.email}</p>

      <button onClick={() => signOut(auth)}>
        Logout
      </button>
    </div>
  );
}