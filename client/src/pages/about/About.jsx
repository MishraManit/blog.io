import React from "react";
import { Link } from "react-router-dom";
import classes from "./About.module.css";

const About = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h2>About Manit News</h2>
        <p>
          "Manit News" is a comprehensive web application that serves as a
          one-stop platform for accessing circulars and co-curricular
          information related to the prestigious Maulana Azad National Institute
          of Technology (MANIT) in Bhopal. With its user-friendly interface and
          efficient functionality, Manit News provides students, faculty, and
          staff members with easy access to the latest updates and important
          announcements.
        </p>
        <p>
          The web app features a well-organized and categorized system that
          ensures users can quickly find the circulars and co-curricular
          information they are seeking. Whether it's academic notifications,
          campus life or information about cultural and sports events, Manit
          News covers it all. Users can navigate through the app's intuitive
          interface to access the specific circulars or co-curricular updates
          they are interested in, saving them time and effort. Manit News also
          offers personalized features to enhance the user experience. Users can
          create accounts and customize their profiles.
        </p>

        <p>
          Overall, Manit News is an indispensable tool for the MANIT community,
          providing a centralized platform for accessing circulars and
          co-curricular information. Its user-friendly interface, real-time
          updates, and personalized features make it an essential companion for
          students, faculty, and staff, enabling them to stay informed and
          connected with the vibrant academic and extracurricular ecosystem at
          MANIT Bhopal.
        </p>

        <Link to="/" className={classes.goBack}>
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default About;
