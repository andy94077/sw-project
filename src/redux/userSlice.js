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
      // eslint-disable-next-line no-param-reassign
      state.username = action.payload.username;
      // eslint-disable-next-line no-param-reassign
      state.userId = action.payload.user_id;
      // eslint-disable-next-line no-param-reassign
      state.userBucketTime = action.payload.bucket_time;
      // eslint-disable-next-line no-param-reassign
      state.api_token = action.payload.api_token;
    },
    removeData: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.username = null;
      // eslint-disable-next-line no-param-reassign
      state.userId = null;
      // eslint-disable-next-line no-param-reassign
      state.userBucketTime = null;
      // eslint-disable-next-line no-param-reassign
      state.api_token = null;
    },
  },
});
export const { setData, removeData } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
