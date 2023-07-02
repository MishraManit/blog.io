import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { request } from "../../utils/fetchApi";
import { format } from "timeago.js";
import classes from "./verifyBlogs.module.css";
import {
  AiFillEdit,
  AiFillLike,
  AiFillDelete,
  AiOutlineArrowRight,
  AiOutlineLike,
} from "react-icons/ai";
import { sanitizeHtml } from "../../utils/common.function";

const UpdateBlog = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [unVerfiedBlog, setUnVerifiedBlog] = useState();
  const [rejectReason, setRejectReason] = useState();
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [handleBlog, setHandleBlog] = useState();

  useEffect(() => {
    const fetchUnVerifiedBlog = async () => {
      try {
        const options = { Authorization: `Bearer ${token}` };
        const data = await request(`/blog/getUnVerified`, "GET", options);
        //console.log(data);
        setUnVerifiedBlog(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnVerifiedBlog();
  }, []);

  const handleApprove = async (id) => {
    try {
      const options = {
        "Content-Type": "application/json",
      };
      await request("/blog/updateVerification", "POST", options, {
        id: id,
        status: 1,
        rejectReason: "Approved Sucessfully ",
      });
    } catch (error) {
      console.error(error);
    }
    setUnVerifiedBlog(unVerfiedBlog.filter((obj) => obj._id !== String(id)));
  };

  const handleReject = async (id) => {
    if (showRejectBox && rejectReason) {
      try {
        const options = {
          "Content-Type": "application/json",
        };
        await request("/blog/updateVerification", "POST", options, {
          id: id,
          status: 2,
          rejectReason: `Rejected , Reason:  ${rejectReason}`,
        });
      } catch (error) {
        console.error(error);
      }
      setUnVerifiedBlog(unVerfiedBlog.filter((obj) => obj._id !== String(id)));
      setRejectReason(null);
    } else {
      setShowRejectBox(true);
      setHandleBlog(id);
    }
  };

  return (
    <>
      <Navbar />
      <div className={classes.container}>
        <Link to="/" className={classes.goBack}>
          Go Back <AiOutlineArrowRight />
        </Link>
        <h2> Verify Blogs</h2>
        <div className={classes.wrapper}>
          {unVerfiedBlog?.map((blog) => (
            <div key={blog._id} className={classes.blog}>
              <Link to={`/blogDetails/${blog?._id}`}>
                <img src={`http://localhost:5000/images/${blog?.photo}`} />
              </Link>

              <div className={classes.blogData}>
                <div className={classes.categoryAndMetadata}>
                  <span className={classes.category}>{blog?.category}</span>
                </div>
                <h4>{blog?.title}</h4>
                <p className={classes.blogDesc}>
                  {" "}
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
              </div>
              <button
                className={classes.btnA}
                onClick={() => handleApprove(blog?._id)}
              >
                Approve
              </button>
              <button
                className={classes.btnR}
                onClick={() => handleReject(blog?._id)}
              >
                Reject
              </button>
              {showRejectBox && handleBlog === blog?._id && (
                <div>
                  <span>Specify rejection Reason Then click Reject Box </span>
                  <input onChange={(e) => setRejectReason(e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateBlog;
