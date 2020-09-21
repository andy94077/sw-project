import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import broadcastReducer from "./broadcastSlice";
import dialogReducer from "./dialogSlice";
import menuDataReducer from "./menuDataSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    broadcast: broadcastReducer,
    dialog: dialogReducer,
    menuData: menuDataReducer,
  },
});
