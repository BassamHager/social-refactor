import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function Navbar() {
  const { token, setIsToLoginMode, logout, login } = useContext(AuthContext);

  const handleLogging = () => {
    if (token) {
      logout();
    } else {
      login();
    }
    setIsToLoginMode(true);
  };

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
          <Link to="/auth" onClick={() => setIsToLoginMode(false)}>
            Register
          </Link>
        </li>
        <li>
          <Link
            to="/auth"
            onClick={handleLogging}
            className={token ? "red" : "greed"}
          >
            Log {token ? "Out" : "In"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
