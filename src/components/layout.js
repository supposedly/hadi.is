/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import Helmet from "react-helmet";
import { FaHome, FaLinkedin, FaGithub, FaRegAddressBook, FaAt, FaTwitter } from "react-icons/fa";
import { useStaticQuery, graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import SEO from "./seo";
import "../styles/global.scss";

export default function Layout({ children, title, literalTitle }) {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  let onHomepage = false;
  const originalTitle = title;
  if (title === ``) {
    onHomepage = true;
    title = data.site.siteMetadata.title;
  } else if (!literalTitle) {
    title = `Hadi is ${title}`;
  }

  return (
    <>
      <SEO title={title} />
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Inconsolata:wght@400&family=Raleway:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <main>
        <div id="icon-spaceholder"></div>
        <nav id="quicc-icons" className={onHomepage ? `` : `invariable`}>
          { onHomepage ?
            <>
              {/* <Link title="blog" to="/blog">
                <FaPencilAlt size={32} />
              </Link> */}
              <Link title="portfolio" to="/stuff">
                <FaRegAddressBook size={32} />
              </Link>
              {/* the title attr below has a fullwidth @ and a cyrillic o and i */}
              <a title="hі＠hоw.hadі.іs" href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#104;&#105;&#64;&#104;&#111;&#119;&#46;&#104;&#97;&#100;&#105;&#46;&#105;&#115;">
                <FaAt size={32} />
              </a>
              <a title="twitter" href="https://twitter.com/tarhyny">
                <FaTwitter size={32} />
              </a>
              <a title="linkedin" href="https://linkedin.com/in/hat">
                <FaLinkedin size={32} />
              </a>
              <a title="github" href="https://github.com/supposedly">
                <FaGithub size={32} />
              </a>
            </>
          :
            <a title="main page" href="/" className="no-skew" style={{ color: 'red' }}>
              <FaHome size={34} />
            </a>
          }
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
