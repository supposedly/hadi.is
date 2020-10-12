import PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import React from "react";
import styled from "styled-components";

import Image from "gatsby-image";

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

const ImgContainer = styled.section`
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  ${rfs.marginTop(`1rem`)}

  picture, .gatsby-image-wrapper {
    ${rfs(`300px`, `width`)}
  }

  .gatsby-image-wrapper {
    ${rfs(`300px`, `width`)}
    border: 2px solid black;
    border-radius: 5px;
  }
`;

export default function GalleryArticle({ assets, className }) {
  const images = {...assets.png, ...assets.jpg};
  return <Article className={className}>
    <MDXProvider components={{
      Image0: (props) => <ImgContainer {...props}><Image fluid={images.img_0.childImageSharp.main}/></ImgContainer>
    }}>
      <MDXRenderer>
        {assets.mdx.text.childMdx.body}
      </MDXRenderer>
    </MDXProvider>
  </Article>
}
