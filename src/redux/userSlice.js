import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { CONCAT_SERVER_URL } from "../utils";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    userId: null,
    userAvatar: null,
    BucketTime: null,
    apiToken: null,
    verified: null,
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
      state.userAvatar = action.payload.userAvatar;
      state.BucketTime = action.payload.bucket_time;
      state.apiToken = action.payload.api_token;
      state.verified = action.payload.verified;
    },
    setAvatar: (state, action) => {
      state.userAvatar = action.payload.userAvatar;
    },
    setVerified: (state, action) => {
      state.verified = action.payload.verified;
    },
    setId: (state, action) => {
      state.userId = action.payload.user_id;
    },
  },
});
export const { setData, setAvatar, setVerified, setId } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
