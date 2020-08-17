import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { CONCAT_SERVER_URL } from "../utils";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    userId: null,
    BucketTime: null,
    apiToken: null,
  },
  reducers: {
    setData: (state, action) => {
      if (
        state.userId !== action.payload.user_id &&
        action.payload.user_id !== null
      ) {
        const id = action.payload.user_id;
        axios
          .post(CONCAT_SERVER_URL("/api/v1/user/count"), {
            id,
          })
          .then()
          .catch();
      }
      state.username = action.payload.username;
      state.userId = action.payload.user_id;
      state.BucketTime = action.payload.bucket_time;
      state.apiToken = action.payload.api_token;
    },
  },
});
export const { setData } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
