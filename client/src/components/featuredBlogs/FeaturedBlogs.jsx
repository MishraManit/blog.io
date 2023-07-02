import React, { useState, useEffect } from "react";
import classes from "./featuredBlogs.module.css";
import { MdOutlinePreview } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { request } from "../../utils/fetchApi";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { sanitizeHtml } from "../../utils/common.function";

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const data = await request("/blog/featured", "GET");
        setFeaturedBlogs(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeaturedBlogs();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h3>Trending Blogs</h3>
        <div className={classes.blogs}>
          {featuredBlogs.map((blog) => (
            <div key={blog._id} className={classes.blog}>
              <Link to={`/blogDetails/${blog?._id}`}>
                <img src={`http://localhost:5000/images/${blog?.photo}`} />
              </Link>

              <div className={classes.blogData}>
                <div className={classes.categoryAndMetadata}>
                  <span className={classes.category}>{blog?.category}</span>
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
      </div>
    </div>
  );
};

export default FeaturedBlogs;
