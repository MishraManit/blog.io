import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { request } from "../../utils/fetchApi";
import classes from "./updateBlog.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillFileImage, AiOutlineArrowRight } from "react-icons/ai";

const UpdateBlog = () => {
  const [blogDetails, setBlogDetails] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "health & sports",
    "student perspectives",
    "intern & jobs",

    "academic success",
    "college events",
    "campus life",
    "alumini success",
  ];

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const options = { Authorization: `Bearer ${token}` };
        const data = await request(`/blog/find/${id}`, "GET", options);
        setBlogDetails(data);
        setTitle(data.title);
        setDesc(data.desc);
        setCategory(data.category);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogDetails();
  }, [id]);
  const isFormValid = title && desc && category;

  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const options = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await request(`/blog/updateBlog/${id}`, "PUT", options, {
        title,
        desc,
        category,
        isVerfied: 0,
      });

      navigate(`/blogDetails/${id}`);
    } catch (error) {
      setIsLoading(false);
      toast.error("There was an error creating the blog!");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={classes.container}>
        <Link to={`/userDetails/${user?._id}`} className={classes.goBack}>
          Go Back <AiOutlineArrowRight />
        </Link>
        <div className={classes.wrapper}>
          <h2>Update Blog</h2>
          <form onSubmit={handleUpdateBlog}>
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

            <div className={classes.buttonWrapper}>
              <button
                className={classes.submitBtn}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Wait a moment..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateBlog;
