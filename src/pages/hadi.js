import React from "react";
import { Link, graphql } from "gatsby";
import Image from "gatsby-image";

import Layout from "../components/layout";

export default ({ data }) => (
  <Layout title="Hadi">
    <Image
      fluid={data.file.childImageSharp.fluid}
      alt="Young Hadi at Disneyland, wearing a shirt that says 'I make being COOL look EASY' and striking a pose."
    ></Image>
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
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
