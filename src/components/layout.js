/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import Helmet from "react-helmet";
import { FaLinkedin, FaGithub, FaPencilAlt, FaRegFileAlt, FaRegEnvelope } from "react-icons/fa";
import { useStaticQuery, graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import SEO from "./seo";
import "../styles/global.scss";
import "font-awesome/css/font-awesome.min.css";

export default function Layout({ children, title, literalTitle }) {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  if (title === ``) {
    title = data.site.siteMetadata.title;
  } else if (!literalTitle) {
    title = `hadi is ${title}`;
  }

  return (
    <>
      <SEO title={title} />
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Inconsolata:wght@400&family=Raleway:wght@700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <main>
        <nav id="quicc-icons">
          <Link title="Resume" to="/resume">
            <FaRegFileAlt size={32} />
          </Link>
          <Link title="Blog" to="/blog">
            <FaPencilAlt size={32} />
          </Link>
          <a title="hi@how.hadi.is" href="mailto:hi@how.hadi.is">
            <FaRegEnvelope size={32} />
          </a>
          <a title="Linkedin" href="https://linkedin.com/in/hat">
            <FaLinkedin size={32} />
          </a>
          <a title="Github" href="https://github.com/supposedly">
            <FaGithub size={32} />
          </a>
        </nav>
        {children}
      </main>
      {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer> */}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
  literalTitle: PropTypes.bool
};

Layout.defaultProps = {
  children: undefined,
  title: ``,
  literalTitle: false
};
