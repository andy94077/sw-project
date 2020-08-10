import React from "react";
import "./LoginPage.css";

import LoginForm from "./LoginForm";
import { CONCAT_BACKOFFICE_URL } from "../constants";

export default function LoginPage() {
  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      url(${CONCAT_BACKOFFICE_URL("/pictures/desktop.png")}`,
      }}
    >
      <h1 className="login-page-title">sw-project back office</h1>
      <LoginForm />
    </div>
  );
}
