import { createSlice } from "@reduxjs/toolkit";

export const dialogSlice = createSlice({
  name: "dialog",
  initialState: {
    title: "",
    message: "",
    isOpen: false,
    component: null,
  },
  reducers: {
    setDialog: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});
export const { setDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
export const selectDialog = (state) => state.dialog;
