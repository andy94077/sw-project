import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    userId: null,
    userBucketTime: null,
    api_token: null,
  },
  reducers: {
    setData: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.user_id;
      state.userBucketTime = action.payload.bucket_time;
      state.api_token = action.payload.api_token;
    },
    removeData: (state) => {
      state.username = null;
      state.userId = null;
      state.userBucketTime = null;
      state.api_token = null;
    },
  },
});
export const { setData, removeData } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
