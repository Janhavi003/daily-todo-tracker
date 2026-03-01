import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Dashboard({ user }) {
  return (
    <div>
      <h1>Today’s Tasks</h1>
      <p>{user.email}</p>

      <TaskInput user={user} />
      <TaskList user={user} />

      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
}