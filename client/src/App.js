import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/pages/Landing";
import Auth from "./components/layout/pages/Auth";
import { AlertContext } from "./components/context/alert-context";
import { useAlert } from "./components/customized/hooks/Alert-hook";
import { useAuth } from "./components/customized/hooks/Auth-hook";
import { AuthContext } from "./components/context/auth-context";
import Profile from "./components/layout/pages/Profile";
import Dashboard from "./components/layout/pages/Dashboard";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const [alerts, setAlert] = useAlert();
  const [isToLoginMode, setIsToLoginMode] = useState(true);

  return (
    <Router>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token,
          userId,
          login,
          logout,
          isToLoginMode,
          setIsToLoginMode,
        }}
      >
        <AlertContext.Provider value={{ alerts, setAlert }}>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Switch>
              {/* <Route exact path="/" component={Landing} /> */}
              <Route exact path="/auth" component={Auth} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/profile" component={Profile} />
              {/* <Redirect to="auth" /> */}
            </Switch>
          </section>
        </AlertContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
