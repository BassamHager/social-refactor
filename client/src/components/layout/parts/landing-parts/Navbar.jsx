import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
// context
import { AuthContext } from "../../../customized/context/auth-context";
import { AlertContext } from "../../../customized/context/alert-context";
// parts
import Alert from "../auth-parts/Alert";

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
          <Link to="/">Social_Dev_Connector</Link>
        </h1>
        <ul>
          {token && (
            <li>
              <Link to="/developers">Developers</Link>
            </li>
          )}
          {!token && (
            <li>
              <Link to="/auth" onClick={() => setIsToLoginMode(false)}>
                Register
              </Link>
            </li>
          )}
          {token && (
            <li className="fas fa-user">
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
          {token && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
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
      {!token && <Alert />}
    </Fragment>
  );
};

export default Navbar;
