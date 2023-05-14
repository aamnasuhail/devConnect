import React, { useEffect, useState, useContext } from "react";
import axios from "../../../helpers/axios";
import { UserContext, SnackbarContext } from "../../../App";
import "./profile.css";
import { cloudinary } from "../../../config";
import { Button } from "@material-ui/core";
import CameraUpload from "../../utilityComponents/cameraUpload";
import { PostPhotoShimmer } from "../../utilityComponents/shimmer";

import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
  },
  gridTitle: {
    boxShadow:
      "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219,0.2) 0px 0px 0px 1px inset",
  },
}));

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { handleSnackBar } = useContext(SnackbarContext);
  const [image, setImage] = useState(state ? state.pic : null);
  const [publisedImageUrl, setPublishedImageUrl] = useState("");
  const [picChange, setPicChange] = useState(false);
  const classes = useStyles();

  const myPosts = () => {
    axios
      .get("/mypost", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        setPics(res.data.mypost);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //runs to update publishedurl pic of user into database
  useEffect(() => {
    if (publisedImageUrl) {
      updatePicToDB();
    }
  }, [publisedImageUrl]);

  // Runs only when mount component
  useEffect(() => {
    myPosts();
  }, []);

  // posting Image to cloudinary
  const postImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "circle");
    data.append("cloud_name", "kammy");
    fetch(cloudinary.apiUrl, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          handleSnackBar(data.error.message + "  and fields", "error", 3000);
          return;
        } else {
          setPublishedImageUrl(data.secure_url);
        }
      })
      .catch((err) => {
        handleSnackBar(err + ", Internet DisConnected", "error", 3000);
      });
  };

  // Function to set updated pic url to database
  const updatePicToDB = () => {
    let data = { pic: publisedImageUrl };
    axios
      .put("/updatepic", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, pic: res.data.result.pic })
        );
        dispatch({ type: "UPDATEPIC", payload: res.data.result.pic });
        setPicChange(false);
        handleSnackBar(res.data.message, "success", 2000);
      })
      .catch((err) => {
        console.log(err, "error in updated pic");
        setPicChange(false);
        handleSnackBar(err.error ? err.error : err, "error", 3000);
      });
  };

  // Function to choose user picture
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setPicChange(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="parent">
      <div className="holder">
        <div className="avatar">
          <img src={image} alt="avatar" width={"100%"} />
          <CameraUpload onImageChange={onImageChange} place="cameraIcon" />
          <div className="updatebtn">
            {picChange ? (
              <Button
                onClick={postImage}
                size="small"
                variant="contained"
                color="secondary"
              >
                Update Pic
              </Button>
            ) : null}
          </div>
        </div>

        {!state ? (
          "Loading..."
        ) : (
          <div className="details">
            <h2>{state.name}</h2>
            <h5>{state.email}</h5>
            <div className="flex">
              <h5>
                {mypics.length} {mypics.length < 2 ? "post" : "posts"}
              </h5>
              <h5>
                {state.followers.length}{" "}
                {state.followers.length < 2 ? "follower" : "followers"}
              </h5>
              <h5>
                {state.following.length}{" "}
                {state.following.length < 2 ? "following" : "followings"}
              </h5>
            </div>
          </div>
        )}
      </div>

      <GridList cellHeight={300} className={classes.gridList} cols={3}>
        {mypics.length === 0
          ? [<PostPhotoShimmer />, <PostPhotoShimmer />, <PostPhotoShimmer />]
          : mypics.map((item) => (
              <GridListTile key={item._id} className={classes.gridTitle}>
                <img src={item.photo} alt="mypost" />
              </GridListTile>
            ))}
      </GridList>
    </div>
  );
};

export default Profile;
