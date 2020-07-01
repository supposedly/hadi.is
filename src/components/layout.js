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
import { Location } from "@reach/router";

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

  if (title === ``) {
    title = data.site.siteMetadata.siteTitle;
  }

  return (
    <>
      <SEO title="I'm Hadi" />
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
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta property="og:title" content={title} />
        {/* <meta property="og:description" content="{{ page.excerpt }}" /> */}
        <Location>
          {({ location }) => (
            <>
              <meta property="og:url" content={location.href} />
              <link rel="canonical" href={location.href} />
            </>
          )}
        </Location>
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
  title: PropTypes.string,
  scripts: PropTypes.arrayOf(PropTypes.string),
}

Layout.defaultProps = {
  children: undefined,
  title: `I'm Hadi`,  // may as well hardcode here too
  scripts: [],
}

export default Layout
