import React, { useEffect } from "react";
import classes from "./navbar.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { request } from "../../utils/fetchApi";
import useOnClickOutside from "use-onclickoutside";
import About from "../../pages/about/About";

const ColoredCircle = ({ color }) => {
  const styles = { backgroundColor: color };

  return color ? <span className="colored-circle" style={styles} /> : null;
};

const Navbar = (targetDiv) => {
  const [state, setState] = useState({});
  const popupRef = React.useRef(null);

  const [photo, setPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  useEffect(() => {
    const IsUnverifiedExists = async () => {
      if (user.IsAdmin) {
        try {
          const options = { Authorization: `Bearer ${token}` };
          const data = await request(
            `/blog/IsUnVerifiedBlogExists`,
            "GET",
            options
          );
          console.log(data);
          setShowDot(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    IsUnverifiedExists();
  }, [user]);

  const renderColoredCircle = () => {
    const color = "red";
    return <ColoredCircle color={color} />;
  };

  const handleAboutClick = () => {
    dispatch(<About />);

    // Navigate to the "About" page
    navigate("/about");
  };

  const scrollToDiv = (targetDiv) => {
    const getDiv = document.getElementById(targetDiv);
    //console.log(getDiv);
    if (getDiv) {
      getDiv.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleGoBack = () => {
    navigate("/");
    scrollToDiv("footer");
  };
  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  useOnClickOutside(popupRef, handleToggleModal);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/4/4f/Maulana_Azad_National_Institute_of_Technology_Logo.png"
            alt="MANIT Logo"
            className={classes.logo}
          />
          <Link to="/">Manit-News</Link>
        </div>
        <ul className={classes.center}>
          <li
            className={classes.listItem}
            onClick={() => scrollToDiv("featuredBlogs") || navigate("/")}
          >
            Trending🔥
          </li>
          <li className={classes.listItem} onClick={handleAboutClick}>
            About
          </li>
          <li className={classes.listItem} onClick={handleGoBack}>
            Contacts
          </li>
          <li
            onClick={() => scrollToDiv("categories") || navigate("/")}
            className={classes.listItem}
          >
            Categories
          </li>
        </ul>

        <div className={classes.right}>
          {!user ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login in</Link>
            </>
          ) : (
            <>
              <span
                className={classes.username}
                onClick={() => setShowModal((prev) => !prev)}
              >
                Hello {user.username}!
              </span>
              <img
                onClick={() => setShowModal((prev) => !prev)}
                className={classes.img}
                src={`http://localhost:5000/images/${user?.profileImg}`}
              />

              {showDot && (
                <div className={classes.reddot}>
                  <Link to={`/verifyBlog`}>{renderColoredCircle()}</Link>
                </div>
              )}

              {showModal && (
                <div className={classes.modal} ref={popupRef}>
                  <ul>
                    <li>
                      <Link to="/create">Create Blog</Link>
                    </li>
                    <li>
                      <Link to={`/userDetails/${user._id}`}>User Details</Link>
                    </li>
                    {user?.IsAdmin && (
                      <li>
                        <Link to={`/verifyBlog`}>verify Blog</Link>
                      </li>
                    )}

                    <li>
                      <Link
                        className={classes.logoutBtn}
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
