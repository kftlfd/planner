import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../context/ActionsContext";
import { selectUser } from "../store/usersSlice";
import { Main } from "./Main";

export default function Navbar(props) {
  const user = useSelector(selectUser);
  const actions = useActions();

  return (
    <Main sx={{ flexDirection: "column" }}>
      <div className="Navbar">
        <nav className="NavbarContent">
          <div>
            <Link to={user ? "/" : "/welcome"}>Planner</Link>
          </div>

          <div>
            {user ? (
              <>
                <span>{user.username}</span>
                <a href="#" onClick={actions.user.logout}>
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
