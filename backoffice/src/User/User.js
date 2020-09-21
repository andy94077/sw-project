import React, { useEffect } from "react";
// import PropTypes from "prop-types";
import List from "./components/List";

export default function User(props) {
  useEffect(() => {
    document.title = "User";
  }, []);
  return <List />;
}

// User.propTypes = {
//   user: PropTypes.object,
//   location: PropTypes.object,
//   dispatch: PropTypes.func,
//   loading: PropTypes.object,
// };
