// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait until auth state is known
  if (!user) return <Navigate to="/login" replace />; // redirect if not logged in

  return children; // show content if logged in
};

export default ProtectedRoute;
