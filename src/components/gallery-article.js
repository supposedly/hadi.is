import PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import React, { useMemo } from "react";
import styled from "styled-components";

import Image from "gatsby-image";

import rfs from "../utils/rfs.js";

const Article = styled.article`
  margin-left: 1rem;
  margin-right: 1rem;
  font-family: 'Epilogue', sans-serif;
  font-variation-settings: "wght" 250;
  font-weight: 250; // for firefox, idk why
  ${rfs(`16px`)}
  transition: height 0ms 300ms, opacity 300ms;
  overflow: hidden;

  @media only screen and (min-width: 700px) {
    ${rfs(`19px`)}
  }

  &.invisible {
    opacity: 0;
    height: 0;
  }

  &.visible {
    opacity: 1;
  }
  
  strong {
    font-variation-settings: "wght" 500;
    font-weight: 500; // for firefox, idk why
  }

  p {
    line-height: 2;
  }

  .center-self {
    align-self: center;
  }
`

const ImgContainer = styled(Image).attrs(props => ({
  width: `${500 * (props.scale || 1)}px`
}))`
  ${rfs.marginTop(`1rem`)}
  ${props => rfs(props.width, `width`)}
  border: 2px solid black;
  border-radius: 5px;

  picture {
    float: left;
  }
`;

export default function GalleryArticle({ assets, focused }) {
  const images = useMemo(
    () => ({...assets.png, ...assets.jpg}),
    [assets]
  );
  const components = useMemo(() => ({
    Image: ({ n, float, margin, marginLeft, marginRight, scale, style, ...props }) => (
      <ImgContainer
        scale={scale}
        style={{float, margin, marginLeft, marginRight, ...style}}
        fluid={images[`img_${n}`].childImageSharp.main}
        {...props}
      />
    ),
    h2: ({ className, children, ...props }) => (
      <h2 className={`center-children ${className}`} {...props}>{children}</h2>
    )
  }), [images]);
  return <Article className={focused ? `visible` : `invisible`}>
    <MDXProvider components={components}>
      <MDXRenderer>
        {assets.mdx.text.childMdx.body}
      </MDXRenderer>
    </MDXProvider>
  </Article>
}

GalleryArticle.propTypes = {
  assets: PropTypes.objectOf(PropTypes.object).isRequired,
  focused: PropTypes.bool,
}

GalleryArticle.defaultProps = {
  assets: undefined,
  focused: false,
}
