import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./componentes/layout/Navbar";
import Landing from "./componentes/layout/Landing";
import Auth from "./componentes/auth/Auth";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/auth" component={Auth} />
          {/* <Route exact path="/login" component={Login} /> */}
        </Switch>
      </section>
    </Router>
  );
};

export default App;
