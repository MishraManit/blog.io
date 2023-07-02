import React from "react";
import Navbar from "../../components/navbar/Navbar";

import Categories from "../../components/categories/Categories";
import FeaturedBlogs from "../../components/featuredBlogs/FeaturedBlogs";
import Footer from "../../components/footer/Footer";
import About from "../about/About";

const Home = () => {
  return (
    <>
      <Navbar />

      <div id="featuredBlogs">
        <FeaturedBlogs />
      </div>

      <div id="categories">
        <Categories />
      </div>

      {/* <div id="newsletter">
        <Newsletter />
      </div> */}

      <div id="footer">
        <Footer />
      </div>
    </>
  );
};

export default Home;
