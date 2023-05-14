import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { cloudinary } from "../../../config";
import axios from "../../../helpers/axios";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { makeStyles } from "@material-ui/core/styles";
import { SnackbarContext } from "../../../App";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "50%",
    borderRadius: "8px",
    background: "white",
    padding: "40px",
    boxShadow: "0px 10px 20px 2px rgba(0, 0, 0, 0.25)",
    margin: "100px auto 20px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90vw",
    },
  },
  heading: {
    fontSize: "24px",
    textAlign: "center",
  },
  blankscreen: {
    display: "flex",
    height: "calc(100vh - 100px)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const CreatePost = () => {
  const { handleSnackBar } = useContext(SnackbarContext);

  const [data, setData] = useState({
    title: "",
    body: "",
  });
  const [image, setImage] = useState("");
  const [publisedImageUrl, setPublishedImageUrl] = useState("");
  const classes = useStyles();
  const InputValue = (e) => {
    const { name, value } = e.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  // when state changes this function gets kicked
  useEffect(() => {
    if (publisedImageUrl) {
      post();
      setData({
        title: "",
        body: "",
      });
    }
  }, [publisedImageUrl]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // posting data to database
  function post() {
    let data = {
      title,
      body,
      pic: publisedImageUrl,
    };

    axios
      .post("/createpost", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        handleSnackBar(res.data.message, "success", 1000);
      })
      .catch((err) => {
        handleSnackBar(err.response.data.error, "error", 1000);
      });
  }
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
          handleSnackBar(
            `All fields are required. So, Please fill them.`,
            "error",
            1000
          );
          return;
        } else {
          setPublishedImageUrl(data.secure_url);
        }
      })
      .catch((err) => {
        handleSnackBar(`${err}, Internet DisConnected`, "error", 1000);
      });
  };

  // submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    postImage();
    setImage("");
    setPublishedImageUrl("");
  };

  const { title, body } = data;
  return (
    <section className={classes.root}>
      <h2 id="heading" className={classes.heading}>
        Create New Post
      </h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="title" className="form-label">
              Post Title
            </label>
            <input
              value={title}
              onChange={InputValue}
              id="title"
              type="text"
              name="title"
              className="form-input"
              placeholder="What is on your mind..."
            />
          </div>

          <div className="form-row">
            <label htmlFor="body" className="form-label">
              Post Description
            </label>
            <TextareaAutosize
              value={body}
              name="body"
              onChange={InputValue}
              id="body"
              type="text"
              className="form-textarea"
              placeholder="Write more about your Post..."
              style={{
                width: "100%",
                height: 200,
                resize: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <div className="form-row">
              <label htmlFor="postInfo" className="form-label">
                Upload Picture
              </label>
              <input
                onChange={onImageChange}
                type="file"
                multiple
                accept="image/*"
                className="form-input"
              />
            </div>
            {image ? (
              <div className="image">
                <img
                  id="imagePreview"
                  src={image}
                  className="img-output"
                  alt="avatar"
                />
              </div>
            ) : (
              <span id="nophoto">No photo choosen</span>
            )}
          </div>
          <button className="btn btn-block" type="submit">
            Create Post
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
