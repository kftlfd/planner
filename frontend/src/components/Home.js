import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Home(props) {
  const auth = useAuth();
  const redirect = useNavigate();

  return (
    <>
      {auth.loading ? (
        <div>Loading</div>
      ) : auth.user ? (
        <h1>Home</h1>
      ) : (
        redirect("/welcome")
      )}
    </>
  );
}
