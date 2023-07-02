import React from "react";
import { useState } from "react";
import classes from "./blogDetails.module.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { request } from "../../utils/fetchApi";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { format } from "timeago.js";
import {
  AiFillEdit,
  AiFillLike,
  AiFillDelete,
  AiOutlineArrowRight,
  AiOutlineLike,
} from "react-icons/ai";
import { sanitizeHtml } from "../../utils/common.function";

const BlogDetails = () => {
  const [blogDetails, setBlogDetails] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const options = { Authorization: `Bearer ${token}` };
        const data = await request(`/blog/find/${id}`, "GET", options);
        //console.log(data);
        setBlogDetails(data);
        setIsLiked(data.likes.includes(user._id));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogDetails();
  }, [id]);

  // like
  const handleLikePost = async () => {
    try {
      const options = { Authorization: `Bearer ${token}` };
      await request(`/blog/likeBlog/${id}`, "PUT", options);
      setIsLiked((prev) => !prev);
      // setBlogDetails({
      //   ...blogDetails ,

      // })
    } catch (error) {
      console.error(error);
    }
  };

  // delete
  const handleDeleteBlog = async () => {
    try {
      const options = { Authorization: `Bearer ${token}` };
      await request(`/blog/deleteBlog/${id}`, "DELETE", options);
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };
  //console.log(blogDetails);

  return (
    <div>
      <Navbar />
      <div className={classes.container}>
        <Link to={`/userDetails/${user?._id}`} className={classes.goBack}>
          Go Back <AiOutlineArrowRight />
        </Link>
        <div className={classes.wrapper}>
          {blogDetails?.photo ? (
            <img src={`http://localhost:5000/images/${blogDetails?.photo}`} />
          ) : (
            <div> Loading...</div>
          )}

          <div className={classes.titleAndControls}>
            <h3 className={classes.title}>{blogDetails?.title}</h3>

            {blogDetails?.isVerfied !== 1 &&
            blogDetails?.userId?._id === user._id ? (
              <div className={classes.controls}>
                <Link
                  to={`/updateBlog/${blogDetails?._id}`}
                  className={classes.edit}
                >
                  <AiFillEdit />
                </Link>
                <div className={classes.delete}>
                  <AiFillDelete onClick={handleDeleteBlog} />
                </div>
              </div>
            ) : (
              <>
                {isLiked ? (
                  <div className={classes.like}>
                    <AiFillLike onClick={handleLikePost} />
                  </div>
                ) : (
                  <div className={classes.like}>
                    <AiOutlineLike onClick={handleLikePost} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={classes.descAndLikesViews}>
            <p className={classes.desc}>
              <span>Description: </span>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(blogDetails?.desc),
                }}
              />
            </p>
            <div className={classes.likesAndViews}>
              <span>{blogDetails?.views} views</span>
              <span>{blogDetails?.likes?.length} likes</span>
            </div>
          </div>
          <div className={classes.authorAndCreatedAt}>
            <span>
              <span>Author:</span> {blogDetails?.userId?.username}
            </span>
            <span>
              <span>Created At:</span> {format(blogDetails?.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetails;
