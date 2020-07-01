import PropTypes from "prop-types";
import React from "react";

const Title = ({ inline, adverb, text, after }) => {
  const Wrapper = inline ? `span` : `p`;
  return (
    <Wrapper className="big">
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
};

Title.propTypes = {
  inline: PropTypes.bool,
  adverb: PropTypes.string,
  text: PropTypes.string,
  after: PropTypes.string
}

Title.defaultProps = {
  inline: false,
  adverb: ``,
  text: ``,
  after: ``
}

export default Title
