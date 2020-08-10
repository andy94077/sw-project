import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { BACKOFFICE_URL } from "./constants";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Router basename={BACKOFFICE_URL}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
