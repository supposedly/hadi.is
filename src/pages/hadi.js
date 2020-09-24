import React from "react";
import { Link, graphql } from "gatsby";
import Image from "gatsby-image";
import styled from "styled-components";

import rfs from "../utils/rfs.js";

import Layout from "../components/layout";
import Title from "../components/title";

const MainArticle = styled.article`
  margin: 1rem;
  font-family: 'Epilogue', sans-serif;
  ${rfs(`16px`)}
`  

const MainImage = styled(Image)`
  margin: 1rem;
  float: left;
  border-radius: 15px;
  ${rfs(`500px`, `width`)}
`

export default ({ data }) => (
  <Layout title="Hadi">
      {/* <MainImage as="div"></MainImage> */}
      <MainArticle>
        <Title inline text="hadi" />
        <MainImage
          fluid={data.file.childImageSharp.fluid}
          alt="Young Hadi at Disneyland, striking a pose and wearing a shirt that says 'I make being COOL look EASY'."
        ></MainImage>
        <p>
          I'm Hadi! I eat code for a living. Most of it doesn't taste that good.
        </p>
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
