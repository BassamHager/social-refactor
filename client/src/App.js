import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./componentes/layout/Navbar";
import Landing from "./componentes/layout/Landing";
import Register from "./componentes/auth/Register";
import Login from "./componentes/auth/Login";

const App = () => (
  <Router>
    <Navbar />
    <Route exact path="/" component={Landing} />
    <section className="container">
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </section>
  </Router>
);

export default App;
