import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Header = styled.h1`
  cursor: default;
  font-family: 'Noto Sans TC', sans-serif;
  display: ${props => props.inline ? `inline-block` : `block`};
  margin: 0;
  ${props => props.inline ? `` : `margin-top: 1em`}
`

export default function Title ({
  inline = false,
  adverb,
  punctuation = `.`,
  space = `\u00A0`,
  text,
  after,
  style
}) {
  return (
    <Header className="big" inline={inline} style={style}>
      hadi is
      {` `}
      {adverb
        ? <>
            <span className="red">{adverb}</span>
            <span className="input">{text}</span>
          </>
        : <span className="red input">{text}</span>
      }
      {punctuation}{space}{after}
    </Header>
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
