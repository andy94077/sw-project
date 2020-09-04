import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from "@material-ui/core";

import { selectUser } from "../redux/userSlice";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../utils";

export default function PostList() {
  const user = useSelector(selectUser);
  const [state, setState] = useState("Loading");
  const column = [
    "id",
    "picture",
    "content",
    "tag",
    "likes",
    "comments",
    "publish time",
  ];
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    setState("Loading");
    if (user.userId === null) {
      setState("noUser");
    } else {
      axios
        .get(CONCAT_SERVER_URL("/api/v1/posts"), {
          params: { user_id: user.userId },
        })
        .then((res) => {
          setPosts(res.data);
          setState(null);
        });
    }
  }, [user]);
  if (state === "Loading") {
    return <Loading />;
  }
  if (state === "noUser") {
    return <Redirect to="/home" />;
  }
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {column.map((item) => (
              <TableCell>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                <Link to={`/picture/${post.id}`}>
                  <Avatar variant="square" src={CONCAT_SERVER_URL(post.url)} />
                </Link>
              </TableCell>
              <TableCell>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </TableCell>
              <TableCell>{post.tag}</TableCell>
              <TableCell>{post.like}</TableCell>
              <TableCell>{post.comment}</TableCell>
              <TableCell>{post.publish_time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
