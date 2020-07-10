import PropTypes from "prop-types";
import React from "react";

export default function NavButton({ className, id, text, onClick }) {
  return (
    <button
      className={`flex-last center-children center-across ${className}`}
      id={id}
      onClick={onClick}
      style={{ position: `sticky`, bottom: `0` }}
    >
      <span className="yuge">
        {text}
      </span>
    </button>
  );
}

NavButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  text: PropTypes.string
};
