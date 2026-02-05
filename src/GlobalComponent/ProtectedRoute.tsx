import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";
import LinearProgress from "@mui/material/LinearProgress";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <LinearProgress sx={{ mt: 10 }} />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
