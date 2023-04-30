import React, { useState, useContext, useEffect } from "react";
import "./style.css";
import { cloudinary } from "../../../config";
import axios from "../../../helpers/axios";
import M from "materialize-css";
import { SnackbarContext } from "../../../App";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Button from "@mui/material/Button";

const CreatePost = () => {
  const { handleSnackBar } = useContext(SnackbarContext);
  const [data, setData] = useState({
    title: "",
    body: "",
  });
  const [image, setImage] = useState("");
  const [publisedImageUrl, setPublishedImageUrl] = useState("");

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
        console.log(res);
        M.toast({
          html: res.data.message,
          classes: "#81c784 green lighten-2 rounded",
        });
      })
      .catch((err) => {
        console.log(err.response);
        M.toast({
          html: err.response.data.error,
          classes: "#e57373 red lighten-2 rounded",
        });
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
        console.log(data);
        if (data.error) {
          M.toast({
            html: data.error.message + "  and fields",
            classes: "#c62828 red darken-3 rounded",
          });
          return;
        } else {
          setPublishedImageUrl(data.secure_url);
        }
      })
      .catch((err) => {
        M.toast({
          html: err + ", Internet DisConnected",
          classes: "#e57373 red lighten-2 rounded",
        });
      });
  };

  // submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // handleSnackBar('hahah Done yaar', 'success', 2000);
    postImage();
  };

  const { title, body } = data;
  return (
    <div className="create-postcard">
      <h2 id="heading">Create New Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="input-field col s6">
          {/* <input
                        value={title}
                        name="title"
                        onChange={InputValue}
                        id="title"
                        type="text"
                        className="validate"
                    /> */}
          <TextField
            id="standard-basic"
            label="Title"
            variant="standard"
            value={title}
            name="title"
            onChange={InputValue}
            // id="title"
            type="text"
            className="post-validate"
          />
          {/* <label htmlFor="title">Title</label> */}
        </div>
        <div className="input-field col s6">
          {/* <input value={body} name="body" onChange={InputValue} id="body" type="text" className="validate" />
                    <label htmlFor="body">Message</label> */}

          <TextareaAutosize
            value={body}
            name="body"
            onChange={InputValue}
            id="body"
            type="text"
            className="validate"
            placeholder="Write Your Message"
            style={{ width: 300, height: 200 }}
          />
        </div>

        <div className="file-field input-field">
          <div className="btn upldbtn  #64b5f6 blue lighten-1">
            <span>Upload photo</span>
            <input
              onChange={onImageChange}
              type="file"
              multiple
              accept="image/*"
            />
          </div>
          {image ? (
            <div className="avatar-preview">
              <img id="imagePreview" src={image} className="" alt="avatar" />
            </div>
          ) : (
            <span id="nophoto">No photo choosen</span>
          )}
        </div>
        <Button className="post-btn" variant="contained" type="submit">
          Create post{" "}
        </Button>

        {/* <button type="submit" className="btn waves-effect mt-3 waves-light #64b5f6 blue lighten-1">
                    Create post{" "}
                </button> */}
      </form>
    </div>
  );
};

export default CreatePost;
