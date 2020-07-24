import React, { useState } from "react";
import { Button } from "@material-ui/core";

import HomePage from "./Homepage/Homepage";
import LoginPage from "./Login/LoginPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import Bar from "./Bar/Bar";

export default function App() {
  const [tabIndex, setTabIndex] = useState("LoginPage");

  const handleClick = (page) => () => setTabIndex(page);

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
          avatar="pictures/avatar.jpeg"
          name="testing"
          url="localhost:3000"
          intro="hi"
          follow={[123, 456]}
          handleClick={handleClick}
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
      {tabIndex !== "LoginPage" && (
        <Bar avatar="pictures/avatar.jpeg" handleClick={handleClick} />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick("LoginPage")}
      >
        LoginPage
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick("Homepage")}
      >
        Homepage
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick("Content")}
      >
        Content
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick("Profile")}
      >
        Profile
      </Button>
      {currentPage}
    </div>
  );
}
