import { graphql } from "gatsby";
import Image from "gatsby-image";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import rfs from '../utils/rfs.js';

const ImgContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${rfs.marginTop(`1rem`)}

  picture, .gatsby-image-wrapper {
    ${rfs(`50px`, `width`)}
  }

  .gatsby-image-wrapper {
    padding: 10px;
    padding-left: 25px;
    padding-right: 25px;
    border: 10px solid black;
    border-radius: 5px;
  }
`;

export default function Gallery({ children }) {
  return <>
    <section>
      {children.map(el =>
        <>
          <ImgContainer>
            <Image fluid={el.props.assets.png.thumb.childImageSharp.thumb}></Image>
          </ImgContainer>
          {el}
        </>
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
