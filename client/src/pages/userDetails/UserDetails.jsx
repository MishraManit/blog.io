import React from "react";
import { useState } from "react";
import classes from "./userDetails.module.css";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { request } from "../../utils/fetchApi";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { logout } from "../../redux/authSlice";
import { AiFillEdit, AiFillDelete, AiOutlineArrowRight } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import { format } from "timeago.js";
import { AiFillLike } from "react-icons/ai";
import { MdOutlinePreview } from "react-icons/md";
import { sanitizeHtml } from "../../utils/common.function";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const [approvedBlogs, setApprovedBlogs] = useState("");

  useEffect(() => {
    const fetchApprovedBlogs = async () => {
      try {
        const options = {
          Authorization: `Bearer ${token}`,
        };
        const data = await request(`/blog/myblogs/${id}`, "GET", options);

        setApprovedBlogs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApprovedBlogs();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const options = { Authorization: `Bearer ${token}` };
        const data = await request(`/user/find/${id}`, "GET", options);
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
  }, [id]);

  const handleDeleteUser = async () => {
    try {
      const options = { Authorization: `Bearer ${token}` };
      await request(`/user/deleteUser/${id}`, "DELETE", options);
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(approvedBlogs);
  return (
    <div>
      <Navbar />
      <div className={classes.container}>
        <Link to="/" className={classes.goBack}>
          Go Back <AiOutlineArrowRight />
        </Link>
        <div className={classes.wrapper}>
          <img src={`http://localhost:5000/images/${user?.profileImg}`} />
          <div className={classes.titleAndControls}>
            <h3 className={classes.title}>{user?.username}</h3>
            <div className={classes.controls}>
              <Link
                to={`/updateProfile/${userDetails?._id}`}
                className={classes.edit}
              >
                <AiFillEdit />
              </Link>
              <div className={classes.delete}>
                <AiFillDelete onClick={handleDeleteUser} />
              </div>
            </div>
          </div>

          <h1 className="h1">My All Blogs</h1>

          <div className={classes.categoriesAndBlogs}>
            <div className={classes.categories}></div>
            {approvedBlogs?.length > 0 ? (
              <div className={classes.blogs}>
                {approvedBlogs?.map((blog) => (
                  <div key={blog._id} className={classes.blog}>
                    <Link to={`/blogDetails/${blog?._id}`}>
                      <img
                        src={`http://localhost:5000/images/${blog?.photo}`}
                      />
                    </Link>
                    <div className={classes.blogData}>
                      <div className={classes.categoryAndMetadata}>
                        <span className={classes.category}>
                          {blog?.category}
                        </span>
                        <div className={classes.metadata}>
                          <MdOutlinePreview /> {blog.views} views
                        </div>
                        <div className={classes.metadata}>
                          <AiFillLike /> {blog?.likes?.length} likes
                        </div>
                      </div>

                      <h4>{blog?.title}</h4>
                      <p className={classes.blogDesc}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(blog?.desc)
                              .slice(0, 93)
                              .concat(". . ."),
                          }}
                        />
                      </p>
                      <div className={classes.authorAndCreatedAt}>
                        <span>
                          <span>Author:</span> {blog?.userId?.username}
                        </span>
                        <span>
                          <span>Created:</span> {format(blog?.createdAt)}
                        </span>
                      </div>

                      {blog.isVerfied != 0 && (
                        <span>
                          <span>Status:</span> {blog?.rejectReason}
                        </span>
                      )}
                      <Link
                        to={`/blogDetails/${blog._id}`}
                        className={classes.readMore}
                      >
                        Read More <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h3 className={classes.noBlogsMessage}>No blogs</h3>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDetails;
