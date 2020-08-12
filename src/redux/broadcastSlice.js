import { createSlice } from "@reduxjs/toolkit";

export const broadcastSlice = createSlice({
  name: "broadcast",
  initialState: {
    message: "Happy Tree Friend",
  },
  reducers: {
    setMessage: (state, action) => {
      if (action.payload.message != null) {
        state.message = action.payload.message;
      }
    },
  },
});

export default broadcastSlice.reducer;
export const selectBroadcast = (state) => state.broadcast;
