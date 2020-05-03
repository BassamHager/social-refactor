import React, { useContext } from "react";
import { Link } from "react-router-dom";
// context
import { AuthContext } from "../../customized/context/auth-context";

const Landing = () => {
  const { setIsToLoginMode } = useContext(AuthContext);

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link
              to="/auth"
              onClick={() => setIsToLoginMode(false)}
              className="btn btn-primary"
            >
              Sign Up
            </Link>
            <Link
              to="/auth"
              onClick={() => setIsToLoginMode(true)}
              className="btn btn-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
