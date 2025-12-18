import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../api/auth";

const RoleRoute = ({ role, children }) => {
  // ❌ Not logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Support single role OR "ROLE1|ROLE2"
  const allowedRoles = typeof role === "string" ? role.split("|") : [role];

  const isAllowed = allowedRoles.some(r => hasRole(r));

  // ❌ No permission
  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />; // "/" exists
  }

  return children;
};

export default RoleRoute;
