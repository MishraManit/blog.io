import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../utils/fetchApi";
import classes from "./login.module.css";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import img from "../../assets/manit.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setEmptyFields(true);
      setTimeout(() => {
        setEmptyFields(false);
      }, 2500);
    }

    setIsLoading(true);
    try {
      const options = {
        "Content-Type": "application/json",
      };

      const data = await request("/auth/login", "POST", options, {
        email,
        password,
      });
      dispatch(login(data));

      setIsLoggedIn(true);

      navigate("/");
    } catch (error) {
      toast.error(
        "There was an error signing in! Wrong credentials or server error"
      );
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.loginLeftSide}>
          <img src={img} className={classes.leftImg} alt="Login" />
        </div>
        <div className={classes.loginRightSide}>
          {isLoggedIn ? <h2>Welcome back!</h2> : <h2>Login</h2>}

          <form onSubmit={handleLogin} className={classes.loginForm}>
            <input
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className={classes.submitBtn}
              disabled={isLoading} // Disable the button while isLoading is true
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
