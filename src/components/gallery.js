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
  user-select: none;

  .gatsby-image-wrapper {
    ${rfs(`55px`, `width`)}
    ${rfs(`55px`, `height`)}
    cursor: pointer;
    border-radius: 5px;
    margin: 4px;
    transition:
      box-shadow var(--theme-transition-duration),
      margin-bottom 150ms,
      margin-top 150ms;
    box-shadow: black 0 0 5px ${({ theme }) => theme.Map({ dark: `2px` }, `0`)};

    &::after {
      content: '';
      color: transparent;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: 0px solid var(--content-color);
      border-radius: 5px;
      transition: border-color var(--theme-transition-duration), border-width 50ms;
    }
  }

  &.current .gatsby-image-wrapper {
    margin-bottom: 6px;
    margin-top: 2px;

    &::after {
      content: '';
      color: transparent;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-width: 2px;
      border-radius: 5px;
    }
  }
`;

export default function Gallery({ articles }) {
  const articleEntries = Object.entries(articles);
  const [current, setCurrent] = useState(articleEntries.length - 1);
  const containerRef = useRef(null);
  const setArticle = name => {
    setCurrent(
      // probably doesn't rly need a hashmap bc not that many articles
      articleEntries.findIndex(nameAndAssets => nameAndAssets[0] === name)
    );
  }

  return (
    <section className="center-children">
      <section
        style={{ marginTop: `2rem` }}
        ref={containerRef}
        className="center-vertically"
      >
        <FlankingArrows
          directions="left right"
          containerRef={containerRef}
          container="section"
          alwaysShow={true}
          handlers={{
            onClick: [
              () => {
                if (current > 0) {
                  setCurrent(current - 1);
                } else {
                  setCurrent(articleEntries.length - 1);
                }
              },
              () => {
                if (current < articleEntries.length - 1) {
                  setCurrent(current + 1);
                } else {
                  setCurrent(0);
                }
              },
            ],
          }}
          changeDOMWidth={false}
        >
          <nav style={{ display: `inline-flex`, flexWrap: `wrap` }}>
            {articleEntries.map(([name, assets], i) => (
              // should find a way to make the onClick be on a button element idk
              <ImgContainer
                onClick={() => {
                  setCurrent(i);
                }}
                className={current === i ? `current` : `not-current`}
                key={name}
              >
                <Image fluid={assets.png.thumb.childImageSharp.thumb} />
              </ImgContainer>
            ))}
          </nav>
        </FlankingArrows>
      </section>
      {articleEntries.map(([name, assets], i) => (
        <GalleryArticle
          key={name}
          focused={current === i}
          name={name}
          assets={assets}
          setArticle={setArticle}
        />
      ))}
    </section>
  );
}

Gallery.propTypes = {
  articles: PropTypes.objectOf(PropTypes.object),
};

export const fragment = graphql`
  fragment ArticleAssets on FileConnection {
    group(field: extension) {
      extension: fieldValue
      nodes {
        name
        publicURL
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
          frontmatter {
            year
            builtwith {
              name
              libs
            }
          }
        }
        childVideoFfmpeg {
          webm: transcode(
            outputOptions: [
              "-crf 35"
              "-b:v 0"
              "-row-mt 1"
              "-deadline realtime"
              "-cpu-used 5"
            ]
            maxWidth: 900
            maxHeight: 480
            fileExtension: "webm"
            codec: "libvpx-vp9"
            audioCodec: "libvorbis"
          ) {
            src
            fileExtension
          }
          mp4: transcode(
            codec: "libx264",
            audioCodec: "libvorbis",
            maxWidth: 900,
            maxHeight: 480,
            fileExtension: "mp4",
            options:[
              ["-profile:v", "baseline"],
              ["-pix_fmt", "yuv420p"]
            ],
            outputOptions: [
              "-movflags +faststart"
            ]
          )  {
            src
            fileExtension
          }
        }
      }
    }
  }
`;
