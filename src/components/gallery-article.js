import PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import React from "react";
import styled from "styled-components";

import rfs from "../utils/rfs.js";

const Article = styled.article`
  margin: 1rem;
  font-family: 'Epilogue', sans-serif;
  font-variation-settings: "wght" 250;
  font-weight: 250; // for firefox, idk why
  ${rfs(`19px`)}
  
  strong {
    font-variation-settings: "wght" 500;
    font-weight: 500; // for firefox, idk why
  }

  p {
    line-height: 2;
  }
`

export default function GalleryArticle({ assets }) {
  return <Article>
    <MDXRenderer>{assets.mdx.text.childMdx.body}</MDXRenderer>
  </Article>
}

GalleryArticle.propTypes = {
};

GalleryArticle.defaultProps = {
};
