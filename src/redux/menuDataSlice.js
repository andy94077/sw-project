import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import { getCookie } from "../cookieHelper";
import { CONCAT_SERVER_URL } from "../utils";

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
    setChatsNotes: (state, action) => {
      const jsonData = {
        user_id: action.payload.userId,
        start: 0,
        number: 10,
      };

      axios
        .request({
          method: "GET",
          url: CONCAT_SERVER_URL("/api/v1/chatroom"),
          params: jsonData,
        })
        .then((res) => {
          res.data.forEach((item) => {
            item.header = {
              avatar_url: item.avatar_url,
              username: item.username,
            };
            item.secondary = formatDistanceToNow(new Date(item.updated_at));
            item.content = item.last_message;
            item.created_at = format(new Date(item.updated_at), "T", {
              timeZone: "Asia/Taipei",
            });
          });
          state.chats = res.data;
        });

      axios
        .request({
          method: "GET",
          url: CONCAT_SERVER_URL("/api/v1/notifications"),
          params: jsonData,
        })
        .then((res) => {
          res.data.message.forEach((item) => {
            item.secondary = formatDistanceToNow(new Date(item.created_at));
            item.created_at = format(new Date(item.created_at), "T", {
              timeZone: "Asia/Taipei",
            });
          });
          state.notes = res.data;
        });

      const chatsTime = getCookie(`chatsTime${action.payload.userId}`);
      const cc = state.chats.filter(
        (chat) => chat.created_at > chatsTime || chatsTime === undefined
      ).length;
      state.chatsCount = cc;
      if (cc > 9) {
        state.chatsCount = "10+";
      }

      console.log(state.chats, state.notes);
      const notesTime = getCookie(`notesTime${action.payload.userId}`);
      const nc = state.notes.filter(
        (note) => note.created_at > notesTime || notesTime === undefined
      ).length;
      state.notesCount = nc;
      if (nc > 9) {
        state.notesCount = "10+";
      }
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
              ...action.payload.data,
            },
          ],
        },
      ];
      state.announcementType = "notes";
      state.isAnnouncementOpen = true;
    },
  },
});
export const {
  setChatsNotes,
  setChatsCount,
  setNotesCount,
  setAnnouncement,
} = menuDataSlice.actions;
export default menuDataSlice.reducer;
export const selectMenuData = (state) => state.menuData;
