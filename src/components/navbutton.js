import PropTypes from "prop-types";
import React from "react";

export default function NavButton({ id, text, onClick }) {
  return (
    <button className="flex-last" id={id} onClick={onClick}>
      <span className="yuge">
        {text}
      </span>
    </button>
  );
}

NavButton.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string
};
