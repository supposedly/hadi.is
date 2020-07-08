import PropTypes from "prop-types";
import React from "react";

export default function Title ({ inline, adverb, text, after, style }) {
  const Wrapper = inline ? `span` : `p`;
  return (
    <Wrapper className="big" style={{ cursor: 'default', ...style }}>
      hadi is
      {` `}
      {adverb
        ? <>
            <span className="red">{adverb}</span>
            <span className="input">{text}</span>
          </>
        : <span className="red input">{text}</span>
      }
      {` `}
      {after}
    </Wrapper>
  );
}

Title.propTypes = {
  inline: PropTypes.bool,
  adverb: PropTypes.string,
  text: PropTypes.string,
  after: PropTypes.string,
  style: PropTypes.object
};

Title.defaultProps = {
  inline: false,
  adverb: ``,
  text: ``,
  after: ``,
  style: {}
};
