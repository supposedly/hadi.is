/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import SEO from "./seo";
import "../styles/global.scss";

const Layout = ({ children, title, scripts }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  let useTitle = true;
  if (title === null) {
    useTitle = false;
    title = ``;
  }

  if (title === ``) {
    title = data.site.siteMetadata.title;
  }

  return (
    <>
      <SEO title={useTitle ? title : null} />
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Inconsolata:wght@400&family=Raleway:wght@700&display=swap"
          rel="stylesheet"
        />
        {
          scripts.map(
            (script, i) => <script key={i} src={script} />
          )
        }
      </Helmet>
      <main>{children}</main>
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
  scripts: PropTypes.arrayOf(PropTypes.string),
}

Layout.defaultProps = {
  children: undefined,
  title: ``,
  scripts: [],
}

export default Layout
