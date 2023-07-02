import DOMPurify from "dompurify";

import "./fun.css";
export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
};
