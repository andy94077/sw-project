import React, { useState } from "react";

import HomePage from "./Homepage/Homepage";
import LoginPage from "./Login/LoginPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import Bar from "./Bar/Bar";

export default function App() {
  const [tabIndex, setTabIndex] = useState("Profile");

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
      currentPage = (
        <Profile
          avatar="pictures/1.jpg"
          name="testing"
          url="localhost:3000"
          intro="hi"
          follow={[123, 456]}
        />
      );
      break;
    default:
      setTabIndex("Homepage");
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
