import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
// pages
import Landing from "./components/layout/pages/Landing";
import Profile from "./components/layout/pages/Profile";
import Dashboard from "./components/layout/pages/Dashboard";
import Auth from "./components/layout/pages/Auth";
// parts
import Navbar from "./components/layout/parts/landing-parts/Navbar";
// customized
import { useAlert } from "./components/customized/hooks/Alert-hook";
import { useAuth } from "./components/customized/hooks/Auth-hook";
// context
import { AlertContext } from "./components/customized/context/alert-context";
import { AuthContext } from "./components/customized/context/auth-context";
import { ProfileContext } from "./components/customized/context/profile-context";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const [alerts, setAlert] = useAlert();
  const [isToLoginMode, setIsToLoginMode] = useState(true);
  const [profile, setProfile] = useState({});

  return (
    <Router>
      <ProfileContext.Provider
        value={{
          profile,
          setProfile,
        }}
      >
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
      </ProfileContext.Provider>
    </Router>
  );
};

export default App;
