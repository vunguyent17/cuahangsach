import React, { useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
      <button
      className="position-fixed btn btn-success btn-sm rounded m-2 end-0 bottom-0"
      onClick={scrollToTop}
      style={{
        display: visible ? "inline" : "none",
      }}
    >
      <FontAwesomeIcon className="fs-4" icon={faArrowUp} />
    </button>
    
  );
};

export default ScrollButton;
