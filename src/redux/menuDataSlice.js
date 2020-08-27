import { createSlice } from "@reduxjs/toolkit";

export const menuDataSlice = createSlice({
  name: "menuData",
  initialState: {
    chats: [],
    notes: [],
    chatsCount: 0,
    notesCount: 0,
    announcementContent: "",
    announcementType: "",
    isAnnouncementOpen: false,
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload.chats;
    },

    setNotes: (state, action) => {
      state.notes = action.payload.notes;
    },

    setChatsCount: (state, action) => {
      state.chatsCount = action.payload.chatsCount;
    },

    setNotesCount: (state, action) => {
      state.notesCount = action.payload.notesCount;
    },

    setAnnouncement: (state, action) => {
      state.announcementContent = [
        {
          message: [
            {
              id: Date.now(),
              created_at: Date.now(),
              ...action.payload.content,
            },
          ],
        },
      ];
      state.isAnnouncementOpen = action.payload.isOpen;
      state.announcementType = action.payload.type;
    },

    setAnnouncementOpen: (state, action) => {
      state.isAnnouncementOpen = action.payload.isOpen;
    },

    setAnnouncementType: (state, action) => {
      state.announcementType = action.payload.type;
    },
  },
});
export const {
  setChats,
  setNotes,
  setChatsCount,
  setNotesCount,
  setAnnouncement,
  setAnnouncementOpen,
  setAnnouncementType,
} = menuDataSlice.actions;
export default menuDataSlice.reducer;
export const selectMenuData = (state) => state.menuData;
