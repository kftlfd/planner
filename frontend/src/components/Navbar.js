import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar(props) {
  return (
    <nav className="Navbar">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}
