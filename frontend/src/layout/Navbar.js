import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Main } from "./Main";

export default function Navbar(props) {
  const auth = useAuth();
  return (
    <Main sx={{ flexDirection: "column" }}>
      <div className="Navbar">
        <nav className="NavbarContent">
          <div>
            <Link to={auth.user ? "/" : "/welcome"}>Planner</Link>
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
        </nav>
      </div>

      <Outlet />
    </Main>
  );
}
