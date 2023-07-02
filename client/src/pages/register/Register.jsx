import React, { useState } from "react";
import classes from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../../redux/authSlice";
import bgimg from "../../assets/manit.webp";
import { AiOutlineCloseCircle, AiOutlineFileImage } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { request } from "../../utils/fetchApi";

const Register = () => {
  const [state, setState] = useState({});
  const [img, setImg] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const onChangeFile = (e) => {
    setImg(e.target.files[0]);
  };

  const handleCloseImg = () => {
    setImg(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!img) {
      toast.error("Please select an image.");
      return;
    }
    // if (!state.name || !state.email || !state.password) {
    //   toast.error("Please fill all user details");
    //   return;
    // }
    try {
      let filename = null;
      const formData = new FormData();
      filename = crypto.randomUUID() + img.name;
      formData.append("filename", filename);
      formData.append("image", img);

      await fetch(`http://localhost:5000/upload`, {
        method: "POST",
        body: formData,
      });

      setIsLoading(true);
      const options = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = await request("/auth/register", "POST", options, {
        ...state,
        profileImg: filename,
      });

      dispatch(register(data));

      navigate("/");
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("There was an error signing up! Please try again.");
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.loginLeftSide}>
          <img src={bgimg} className={classes.leftImg} alt="Registration" />
        </div>
        <div className={classes.loginRightSide}>
          <h2 className="register">Register</h2>

          <form onSubmit={handleRegister} className={classes.loginForm}>
            <input
              type="text"
              name="username"
              placeholder="Username..."
              onChange={handleState}
            />
            <input
              type="text"
              name="email"
              placeholder="Email..."
              onChange={handleState}
            />
            <input
              type="password"
              name="password"
              placeholder="Password..."
              onChange={handleState}
            />
            <label htmlFor="photo">
              Upload photo <AiOutlineFileImage />
            </label>
            <input
              id="photo"
              type="file"
              onChange={onChangeFile}
              style={{ display: "none" }}
            />
            {img && (
              <p className={classes.imageName}>
                {img.name}{" "}
                <AiOutlineCloseCircle
                  className={classes.closeIcon}
                  onClick={handleCloseImg}
                />
              </p>
            )}
            <button
              type="submit"
              className={classes.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Wait a moment..." : "Register"}
            </button>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
