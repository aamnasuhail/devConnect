import React, { useState, useEffect } from "react";
import axios from "../../../helpers/axios";
import Post from "../post/post";
import { Alert, AlertTitle } from "@material-ui/lab";
import PostShimmer from "../../utilityComponents/shimmer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "100px auto 20px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "95vw",
    },
  },
  blankscreen: {
    display: "flex",
    height: "calc(100vh - 100px)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const MyFollowingPosts = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  //function to fetch My following posts
  const fetchAllPosts = () => {
    axios
      .get("/myfollowingposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.posts !== "undefined") {
          setData(res.data.posts);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className={classes.root}>
      {data && data.length === 0 && <PostShimmer />}

      {!data ? (
        <Alert severity="info">
          <AlertTitle>Posts</AlertTitle>
          No posts available —{" "}
          <strong>Maybe your following have not posted anything yet</strong>
        </Alert>
      ) : (
        data.map((item) => {
          return <Post key={item._id} item={item} />;
        })
      )}
    </div>
  );
};

export default MyFollowingPosts;
