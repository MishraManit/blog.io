import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import classes from "./create.module.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { request } from "../../utils/fetchApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillFileImage, AiOutlineArrowRight } from "react-icons/ai";
const Create = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const categories = [
    "health & sports",
    "student perspectives",
    "intern & jobs",
    "academic success",
    "college events",
    "campus life",
    "alumni success",
  ];

  const onChangeFile = (e) => {
    setImg(e.target.files[0]);
  };

  const handleCloseImg = () => {
    setImg(null);
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide title to blog.");
      return;
    }
    if (!desc) {
      toast.error("Please provide description to blog.");
      return;
    }
    if (!category) {
      toast.error("Please select a valid category.");
      return;
    }
    if (!img) {
      toast.error("Please select an image.");
      return;
    }

    try {
      const formData = new FormData();

      let filename = null;
      if (img) {
        filename = crypto.randomUUID() + img.name;
        formData.append("filename", filename);
        formData.append("image", img);

        await fetch(`http://localhost:5000/upload`, {
          method: "POST",
          body: formData,
        });
      } else {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const options = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        title,
        desc,
        category,
        photo: filename,
      };

      const data = await request("/blog", "POST", options, body);
      navigate(`/blogDetails/${data._id}`);
    } catch (error) {
      setIsLoading(false);
      toast.error("There was an error creating the blog!");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className={classes.container}>
        <Link to={`/userDetails/${user?._id}`} className={classes.goBack}>
          Go Back <AiOutlineArrowRight />
        </Link>
        <div className={classes.wrapper}>
          <h2 className={classes.title}>Create Blog</h2>
          <form onSubmit={handleCreateBlog} encType="multipart/form-data">
            <div className={classes.inputWrapper}>
              <label>Title: </label>
              <input
                type="text"
                placeholder="Title..."
                className={classes.input}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={classes.inputWrapper}>
              <label>Description: </label>
              <ReactQuill
                className={classes.quillEditor}
                value={desc}
                onChange={setDesc}
              />
            </div>
            <div className={classes.inputWrapperSelect}>
              <label>Category: </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={crypto.randomUUID()} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className={classes.inputWrapperImg}>
              <label htmlFor="image" className={classes.labelFileInput}>
                Image: <span>Upload here</span>
              </label>
              <input
                id="image"
                type="file"
                className={classes.inputimg}
                onChange={onChangeFile}
                style={{ display: "none" }}
              />
              {img && (
                <p className={classes.imageName}>
                  {img.name}{" "}
                  <AiOutlineCloseCircle
                    className={classes.closeIcon}
                    onClick={() => handleCloseImg()}
                  />
                </p>
              )}
            </div>
            <div className={classes.buttonWrapper}>
              <button
                className={classes.submitBtn}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Wait a moment..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Create;
