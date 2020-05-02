import React, { useContext, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Alert from "../layout/Alert";
import { AlertContext } from "../context/alert-context";

const Navbar = () => {
  const { setAlert } = useContext(AlertContext);
  const { token, setIsToLoginMode, logout, login } = useContext(AuthContext);

  const handleLogging = () => {
    if (token) {
      logout();
      setAlert("danger", "You have logged out!");
    } else {
      login();
    }
    setIsToLoginMode(true);
  };

  return (
    <Fragment>
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
              className={token ? "red" : "green"}
            >
              Log {token ? "Out" : "In"}
            </Link>
          </li>
        </ul>
      </nav>
      <Alert />
    </Fragment>
  );
};

export default Navbar;
