import React, { useState } from "react";
import { Button } from "@material-ui/core";

import HomePage from "./Homepage/Homepage";
import LoginPage from "./Login/LoginPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import Bar from "./Bar/Bar";

export default function App() {
  const [state, setState] = useState({
    tabIndex: "LoginPage",
    contentSrc: null,
    profileUser: "test",
  });

  const handleClick = (page) => () => setState({ tabIndex: page });
  const handleSetState = (_state) => () => setState(_state);

  let currentPage;
  switch (state.tabIndex) {
    case "LoginPage":
      currentPage = <LoginPage />;
      break;
    case "Homepage":
      currentPage = (
        <HomePage
          imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)}
          handleSetState={handleSetState}
        />
      );
      break;
    case "Content":
      currentPage = (
        <Content
          imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)}
          state={state}
          handleSetState={handleSetState}
        />
      );
      break;
    case "Profile":
      currentPage = (
        <Profile
          avatar="pictures/avatar.jpeg"
          name={state.profileUser}
          url="localhost:3000"
          intro="hi"
          follow={[123, 456]}
          handleClick={handleClick}
        />
      );
      break;
    default:
      setState({ tabIndex: "Homepage" });
      currentPage = <LoginPage />;
      break;
  }
  return (
    <div>
      {state.tabIndex !== "LoginPage" && (
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
