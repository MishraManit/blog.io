import React from "react";
import classes from "./footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className={classes.wrapper}>
        <div className={classes.col}>
          <h2>About the Author</h2>
          <p>
            Made with ❤️ by Devesh Mishra Coder, Mern Stack Developer,Final Year
            Student At Maulana Azad National Institute Of Technology Bhopal M.P.
          </p>
        </div>
        <div className={classes.col}>
          <h2>Contacts</h2>
          <span>Phone: 8004473290</span>
          <span>
            LinkedIn:
            <a href="https://www.linkedin.com/in/devesh-mishra-47a604206/">
              Devesh Mishra
            </a>
          </span>
          <span>
            GitHub:
            <a href="https://github.com/MishraManit">MishraManit</a>
          </span>
        </div>
        <div className={classes.col}>
          <h2>Location</h2>

          <span>Bhopal</span>
          <span>Ayodhya</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
