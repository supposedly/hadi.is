import PropTypes from "prop-types";
import React from "react";

const NavButton = ({ id, text }) => (
  <button className="flex-last" id={id}>
    <span className="yuge">
      {text}
    </span>
  </button>
);

NavButton.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string
}

export default NavButton
