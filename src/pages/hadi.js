import React from "react";
import { Link, graphql } from "gatsby";
import Image from "gatsby-image";
import styled from "styled-components";

import rfs from "../utils/rfs.js";

import Layout from "../components/layout";
import Title from "../components/title";

const MainArticle = styled.article`
  margin: 1rem;
  font-family: "Epilogue", sans-serif;
  font-variation-settings: "wght" 250;
  font-weight: 250; // for firefox, idk why
  ${rfs(`16px`)}

  @media only screen and (min-width: 700px) {
    ${rfs(`19px`)}
  }

  strong {
    font-variation-settings: "wght" 500;
    font-weight: 500; // for firefox, idk why
  }
`;

const P = styled.p`
  line-height: 2;
`;

const MainImage = styled(Image)`
  margin: 1rem;
  float: left;
  border-radius: 15px;
  ${rfs(`500px`, `width`)}
`;

const birthTime = new Date(2001, 9, 18).getTime();

export default ({ data }) => {
  const age = new Date(Date.now() - birthTime).getUTCFullYear() - 1970;
  return (
    <Layout title="Hadi">
      {/* <MainImage as="div"></MainImage> */}
      <MainArticle>
        <Title inline text="hadi" />
        <MainImage
          fluid={data.file.childImageSharp.fluid}
          alt="Young Hadi at Disneyland, striking a pose and wearing a shirt that says 'I make being COOL look EASY'."
        ></MainImage>
        <P>
          I'm Hadi! Thanks for checking my site out. I'm {age}, living in the
          Seattle area, and my professional and personal interests include
          software development, linguistics, and animation.
        </P>
        <P>
          If you wanna see what I've been up to in those terms, my portfolio's
          at{` `}
          <Link to="/stuff">
            hadi is <strong>stuff</strong>
          </Link>
          . Feel free to snoop around some other pages afterwards, too!
        </P>
        <P>
          If you'd like to get in touch, check out the upper left of{` `}
          <Link to="/">the homepage</Link> for links. In particular, I'm always
          reachable{` `}
          <a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#104;&#105;&#64;&#104;&#111;&#119;&#46;&#104;&#97;&#100;&#105;&#46;&#105;&#115;">
            by email
          </a>{` `}
          and <a href="https://twitter.com/tarxini">on Twitter</a>.
        </P>
      </MainArticle>
    </Layout>
  );
};

export const query = graphql`
  query BioQuery {
    file(relativePath: { eq: "cool-ez.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
