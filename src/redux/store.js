import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import broadcastReducer from "./broadcastSlice";
import dialogReducer from "./dialogSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    broadcast: broadcastReducer,
    dialog: dialogReducer,
  },
});
