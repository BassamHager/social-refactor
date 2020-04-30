import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useAuth } from "../customized/hooks/Auth-hook";
import Button from "../customized/formElement/Button";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const { token } = useAuth();

  const handleLoggin = () => {
    if (token) {
      auth.logout();
    } else {
      auth.login();
    }
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
          <Link to="/auth">Register</Link>
        </li>
        <li>
          <Button onClick={handleLoggin}>
            Log {auth.token ? "Out" : "In"}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
