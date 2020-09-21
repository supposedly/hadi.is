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
  border-radius: 15px;
  ${rfs(`500px`, `width`)}
`

export default ({ data }) => (
  <Layout title="Hadi">
    <MainArticle>
      <MainImage
        fluid={data.file.childImageSharp.fluid}
        alt="Young Hadi at Disneyland, wearing a shirt that says 'I make being COOL look EASY' and striking a pose."
      ></MainImage>
      <Title text="hadi" />
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
