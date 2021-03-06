import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar(props) {
  const auth = useAuth();
  return (
    <nav className="Navbar">
      <div className="NavbarContent">
        <div>
          <Link to={auth.user ? "/" : "/welcome"}>Home</Link>
        </div>

        <div>
          {auth.user ? (
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
      </div>
    </nav>
  );
}
