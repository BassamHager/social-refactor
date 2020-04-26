import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/pages/Landing";
import Auth from "./components/layout/pages/Auth";
import { AlertContext } from "./components/context/alert-context";
import { useAlert } from "./components/customized/hooks/Alert-hook";
import Alert from "./components/layout/Alert";
import { useAuth } from "./components/customized/hooks/Auth-hook";
import { AuthContext } from "./components/context/auth-context";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const [alerts, setAlert] = useAlert();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <AlertContext.Provider value={{ alerts, setAlert }}>
        <Router>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/auth" component={Auth} />
            </Switch>
          </section>
        </Router>
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
