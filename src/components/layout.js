/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import Helmet from "react-helmet";
import {
  FaHome,
  FaPen,
  FaLinkedin,
  FaGithub,
  FaFolderOpen,
  FaEnvelope,
  FaTwitter,
} from "react-icons/fa";

import { useStaticQuery, graphql, Link } from "gatsby";
import PropTypes from "prop-types";
import styled from "styled-components";

import DarkModeToggler from "./dark-mode-toggler";
import SEO from "./seo";
import rfs from "../utils/rfs.js";

import "../styles/global.scss";


const HOME = ``;
const iconNavHeight = `39.33px`;

export const IconSpaceholder = styled.div`
  top: 0;
  height: ${iconNavHeight};
`;

export const QuiccIcons = styled.nav`
  position: fixed;
  top: 0; // https://stackoverflow.com/a/38679996
  left: 0;
  z-index: 2; // so they don't get covered by a main-image being funky (z0) or by the nav-btn (z1)
  ${rfs.marginTop(`.5rem`)}
  ${rfs.marginLeft(`.5rem`)}
  height: calc(100% - 5vh); // idk helps the bottom icon not run off shorter screens when vertical
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media only screen and (min-width: 700px) {
    display: block;
    height: auto; // iconNavHeight
  }

  // weird redundancy idk
  &.invariable {
    display: block;
    height: auto; // iconNavHeight
  }

  a {
    margin-right: 1em;
    color: var(--content-color);
    opacity: ${({ theme }) => theme.Map({ dark: 0.5 }, 0.25)};
    transition: color var(--theme-transition-duration), opacity var(--theme-transition-duration);

    &.local {
      color: red;
    }

    &:hover {
      transition: opacity 0ms;
      opacity: 1;
    }

    &:not(.no-skew) {
      // pseudo-pseudo-random rotation
      &:nth-child(3n + 1) svg,
      &:nth-child(3n - 1) svg {
        transform: rotate(-10deg);
      }
      &:nth-child(2n) svg {
        transform: rotate(5deg);
      }
      &:nth-child(3n) svg {
        transform: rotate(14deg);
      }
      &:nth-child(5n - 1) svg {
        transform: rotate(10deg);
      }
      &:nth-child(5n + 1) svg {
        transform: rotate(-12deg);
      }
    }
  }
`;

export default function Layout({
  children,
  title,
  literalTitle,
  style,
  showAllIcons = false,
  iconSize = 30
}) {
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
  let originalTitle = title;
  if (title === HOME) {
    onHomepage = true;
    showAllIcons = true;
    title = data.site.siteMetadata.title;
  } else if (!literalTitle) {
    title = `Hadi is ${title}`.toLowerCase();
  }

  return (
    <>
      <SEO title={title} />
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600&family=Epilogue:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;900&text=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%20%21.-()%23%2C%E2%A4%B4&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <IconSpaceholder />
      <QuiccIcons className={showAllIcons ? `` : `invariable`}>
        {!onHomepage && (
          <Link title="main page" to="/" className="no-skew local">
            <FaHome size={iconSize + 2} />
          </Link>
        )}
        {showAllIcons && (
          <>
            {originalTitle !== `stuff` && (
              <Link title="portfolio" to="/stuff" className="local">
                <FaFolderOpen size={iconSize} />
              </Link>
            )}
            {/* {originalTitle !== `blog` && (
              <Link title="blog" to="/writing" className="local">
                <FaPen size={iconSize} />
              </Link>
            )} */}
            {/* the title attr below has a fullwidth @ and a cyrillic o and i */}
            {/* TODO: maybe url-encode the href */}
            <a
              title="hі＠hоw.hadі.іs"
              href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%68%69%40%68%6F%77%2E%68%61%64%69%2E%69%73"
            >
              <FaEnvelope size={iconSize} />
            </a>
            <a title="twitter" href="https://twitter.com/tarxini">
              <FaTwitter size={iconSize} />
            </a>
            <a title="linkedin" href="https://linkedin.com/in/hat">
              <FaLinkedin size={iconSize} />
            </a>
            <a title="github" href="https://github.com/supposedly">
              <FaGithub size={iconSize} />
            </a>
          </>
        )}
      </QuiccIcons>
      <DarkModeToggler />
      {/* thanks Rapti for this paddingLeft solution, https://stackoverflow.com/a/7607206 */}
      <main style={{ paddingLeft: `calc(100vw - 100%)`, ...style }}>
        {children}
      </main>
      {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer> */}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
  literalTitle: PropTypes.bool,
  style: PropTypes.object,
  iconSize: PropTypes.number
};

Layout.defaultProps = {
  children: undefined,
  title: ``,
  literalTitle: false,
  style: undefined,
  iconSize: 30
};
