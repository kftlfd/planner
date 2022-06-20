import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Home(props) {
  const auth = useAuth();

  if (auth.loading) {
    return(
      <div>Loading</div>
    )
  } else if (!auth.user) {
    return(
      <Navigate to="/welcome" />
    )
  }

  return (
    <h1>Home</h1>
  );
}
