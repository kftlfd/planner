import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import "./Navbar.scss";

export default function Navbar(props) {
  const auth = useAuth();
  return (
    <nav className="Navbar">
      <div>
        <Link to={auth.user ? "/" : "#"}>Home</Link>
      </div>

      <div>
        {auth.loading ? (
          <>Loading</>
        ) : auth.user ? (
          <>
            <span>{auth.user.username}</span>
            <a href="#" onClick={auth.logout}>
              Log Out
            </a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
