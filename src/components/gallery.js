import { graphql } from "gatsby";
import Image from "gatsby-image";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import GalleryArticle from "../components/gallery-article";
import { FlankingArrows } from "../components/arrow-button";

import rfs from "../utils/rfs.js";

const ImgContainer = styled.section`
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;

  .gatsby-image-wrapper {
    ${rfs(`55px`, `width`)}
    ${rfs(`55px`, `height`)}
    cursor: pointer;
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

  &.current .gatsby-image-wrapper {
    border-bottom-style: dashed;
    border-top-style: dashed;
  }

  &.not-current .gatsby-image-wrapper {
    border-style: solid;
  }
`;

export default function Gallery({ articles }) {
  const articleEntries = Object.entries(articles);
  const [current, setCurrent] = useState(articleEntries.length - 1);
  const containerRef = useRef(null);
  return <>
    {/* <p>(this page is under construction <span role="img" aria-label="blushing face">😊</span>)</p> */}
    <section className="center-children">
      <section style={{ marginTop: `2rem` }} ref={containerRef} className="center-vertically">
        <FlankingArrows
          directions="left right"
          containerRef={containerRef}
          container="section"
          alwaysShow={true}
          handlers={{
            onClick: [
              () => { if (current > 0) { setCurrent(current - 1); } else { setCurrent(articleEntries.length - 1); } },
              () => { if (current < articleEntries.length - 1) { setCurrent(current + 1); } else { setCurrent(0); } }
            ]
          }}
          changeDOMWidth={false}
        >
          <nav style={{ display: `inline-block` }}>
            {articleEntries.map(([name, assets], i) =>
              // should find a way to make the onClick be on a button element idk
              <ImgContainer
                onClick={() => { setCurrent(i); }}
                className={current === i ? `current` : `not-current`}
                key={name}
              >
                <Image
                  fluid={assets.png.thumb.childImageSharp.thumb}
                />
              </ImgContainer>
            )}
          </nav>
        </FlankingArrows>
      </section>
      {articleEntries.map(([name, assets], i) =>
        <GalleryArticle
          key={name}
          focused={current === i}
          name={name}
          assets={assets}
        />
      )}
    </section>
  </>;
}

Gallery.propTypes = {
  articles: PropTypes.objectOf(PropTypes.object)
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
          main: fluid(maxWidth: 500, quality: 100) {
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
