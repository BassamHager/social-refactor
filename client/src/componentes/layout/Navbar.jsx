import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> Social_Dev_Connector
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/">Developers</Link>
        </li>
        <li>
          {/* {!isLoginMode ? "In" : "Out"} */}
          <Link to="/auth">Sign </Link>
        </li>
      </ul>
    </nav>
  );
}
