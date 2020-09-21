import React from "react";
import { Link, graphql } from "gatsby";
import Image from "gatsby-image";
import styled from "styled-components";

import rfs from "../utils/rfs.js";

import Layout from "../components/layout";
import Title from "../components/title";

const MainArticle = styled.article`
  margin-top: 1rem;
  margin-left: 64px;
`  

const MainImage = styled(Image)`
  margin-top: 1rem;
  margin-left: 64px;
  float: left;
  border-radius: 15px;
  ${rfs(`500px`, `width`)}
`

export default ({ data }) => (
  <Layout title="Hadi">
      <MainImage
        fluid={data.file.childImageSharp.fluid}
        alt="Young Hadi at Disneyland, striking a pose and wearing a shirt that says 'I make being COOL look EASY'."
      ></MainImage>
      <MainArticle>
        <header>
          <Title inline text="hadi" />
        </header>
        <p style={{padding: `2em`}}>blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blahv</p>
    </MainArticle>
  </Layout>
)


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
`
