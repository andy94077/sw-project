import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    userId: null,
    apiToken: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.apiToken = action.payload.apiToken;
    },
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
