import React from "react";
import "./LoginPage.css";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="login-page">
      <h1 className="login-page-title">sw-project back office</h1>
      <LoginForm />
    </div>
  );
}
