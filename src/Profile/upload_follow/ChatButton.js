import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { useSelector } from "react-redux";
import ChatIcon from "@material-ui/icons/Chat";
import axios from "axios";

import CustomModal from "../../components/CustomModal";
import Loading from "../../components/Loading";
import Chatroom from "../../Bar/Chatroom";
import { CONCAT_SERVER_URL } from "../../utils";
import { selectUser } from "../../redux/userSlice";

const useStyles = makeStyles(() => ({
  central: {
    display: "block",
    marginTop: "14px",
    marginLeft: "12px",
    width: "48px",
  },
  center: {
    textAlign: "center",
  },
  rounded: {
    marginTop: "20px",
    width: "120px",
    borderRadius: "60px",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
}));

export default function ChatButton(props) {
  const { id, name } = props;
  const { userId } = useSelector(selectUser);
  const classes = useStyles();

  const [isReady, setIsReady] = useState(false);
  const [chatInfo, setChatInfo] = useState({
    isOpen: false,
    roomId: -1,
    id,
    avatar_url: "",
    name,
  });

  useEffect(() => {
    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/user/getUserAvatar"),
        data: { name },
      })
      .then((res) =>
        setChatInfo((state) => ({
          ...state,
          avatar_url: CONCAT_SERVER_URL(`${res.data}`),
        }))
      );
  }, [name]);

  useEffect(() => {
    if (chatInfo.avatar_url === "") return;
    axios
      .get(CONCAT_SERVER_URL("/api/v1/chatroom/getRoomByUser"), {
        params: { user_id1: userId, user_id2: id },
      })
      .then((res) => {
        setChatInfo((state) => ({ ...state, roomId: res.data.room_id }));
      });
  }, [chatInfo.avatar_url, id, userId]);

  useEffect(() => {
    if (chatInfo.avatar_url !== "" && chatInfo.roomId !== -1) setIsReady(true);
  }, [chatInfo]);

  const handleOpen = () => {
    setChatInfo({
      ...chatInfo,
      isOpen: true,
    });
  };

  const onHide = () => {
    setChatInfo({
      ...chatInfo,
      isOpen: false,
      roomId: 0,
    });
  };

  if (isReady) {
    return (
      <>
        <IconButton
          onClick={handleOpen}
          component="span"
          className={classes.central}
        >
          <ChatIcon color="action" />
        </IconButton>
        <CustomModal
          show={chatInfo.isOpen}
          onHide={onHide}
          jumpFrame={classes.jumpFrame}
          backdrop
        >
          <Chatroom
            chatInfo={chatInfo}
            setChatInfo={setChatInfo}
            onHide={onHide}
          />
        </CustomModal>
      </>
    );
  }
  return <Loading />;
}
