import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import "./Navbar.scss";

export default function Navbar(props) {
  const auth = useAuth();
  return (
    <nav className="Navbar">
      <div>
        <Link to="/">Home</Link>
        <Link to="/welcome">Welcome</Link>
      </div>
      {auth.loading ? (
        <div>Loading</div>
      ) : auth.user ? (
        <div>
          <span>{auth.user.username}</span>
          <a href="#" onClick={auth.logout}>
            Log Out
          </a>
        </div>
      ) : (
        <div>
          <span>not signed in</span>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
