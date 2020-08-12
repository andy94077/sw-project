import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import broadcastReducer from "./broadcastSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    broadcast: broadcastReducer,
  },
});
