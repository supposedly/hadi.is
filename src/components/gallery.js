import { graphql } from "gatsby";
import Image from "gatsby-image";
import PropTypes from "prop-types";
import React, { createRef } from "react";
import styled from "styled-components";

import GalleryArticle from "../components/gallery-article";
import ArrowButton from "../components/arrow-button";

import rfs from "../utils/rfs.js";

const ImgContainer = styled.section`
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  ${rfs.marginTop(`1rem`)}

  picture, .gatsby-image-wrapper {
    ${rfs(`50px`, `width`)}
  }

  .gatsby-image-wrapper {
    ${rfs(`75px`, `width`)}
    ${rfs(`75px`, `height`)}
    border: 4px solid black;
  }

  &:not(:last-child) .gatsby-image-wrapper {
    border-right-width: 2px;
  }

  &:first-child .gatsby-image-wrapper {
    border-radius: 5px 0 0 5px;
  }

  &:not(:first-child) .gatsby-image-wrapper {
    border-left-width: 2px;
  }

  &:last-child .gatsby-image-wrapper {
    border-radius: 0 5px 5px 0;
  }

  .highlighted .gatsby-image-wrapper {
    border: 8px solid white;
  }
`;

export default function Gallery({ articles }) {
  const articleEntries = Object.entries(articles);
  const articleRefs = articleEntries.map(createRef);
  return <>
    <section className="center-children">
      <nav>
        <ArrowButton direction="left" container="nav" changeDOMWidth={false} />
        {articleEntries.map(([name, assets]) =>
          <ImgContainer key={name}>
            <Image fluid={assets.png.thumb.childImageSharp.thumb}></Image>
          </ImgContainer>
        )}
        <ArrowButton direction="right" container="nav" changeDOMWidth={false} />
      </nav>
      {articleEntries.map(([name, assets], i) =>
        <GalleryArticle
          ref={articleRefs[i]}
          key={name}
          className="center-children"
          name={name}
          assets={assets}
        />
      )}
    </section>
  </>;
}

Gallery.propTypes = {
};

Gallery.defaultProps = {
};

export const fragment = graphql`
  fragment ArticleAssets on FileConnection {
    group(field: extension) {
      extension: fieldValue
      nodes {
        name
        childImageSharp {
          thumb: fluid(maxWidth: 100) {
            ...GatsbyImageSharpFluid
          }
          main: fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
        childMdx {
          body
        }
      }
    }
  }
`
