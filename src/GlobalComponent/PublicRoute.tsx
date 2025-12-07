import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = Cookies.get("auth_token");

  if (token) {
    // 🔥 If already logged in, redirect to homepage or dashboard
    return <Navigate to="/questions-list" replace />;
  }

  return children;
}
