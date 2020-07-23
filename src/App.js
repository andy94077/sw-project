import React, { useState } from "react";

import HomePage from "./Homepage/Homepage";
import LoginPage from "./Login/LoginPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import Bar from "./Bar/Bar";

function App() {
  const [tabIndex, setTabIndex] = useState("Homepage");

  setTabIndex("Homepage");

  let currentPage;
  switch (tabIndex) {
    case "LoginPage":
      currentPage = <LoginPage />;
      break;
    case "Homepage":
      currentPage = (
        <HomePage
          imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)}
        />
      );
      break;
    case "Content":
      currentPage = <Content />;
      break;
    case "Profile":
      currentPage = <Profile />;
      break;
    default:
      currentPage = <LoginPage />;
      break;
  }
  return (
    <div>
      <Bar avatar="pictures/avatar.jpg" />
      {currentPage}
    </div>
  );
}

export default App;
