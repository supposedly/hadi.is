import PropTypes from "prop-types";
import React from "react";

const NavButton = React.forwardRef(({ className, id, text, onClick }, ref) => {
  return (
    <button
      ref={ref}
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
});

NavButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.elementType])
};

export default NavButton;
