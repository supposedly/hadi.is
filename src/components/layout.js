/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useContext } from "react";
import Helmet from "react-helmet";
import {
  FaHome,
  FaLinkedin,
  FaGithub,
  FaFolderOpen,
  FaEnvelope,
  FaTwitter,
  FaMoon,
} from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { useStaticQuery, graphql, Link } from "gatsby";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { ThemeToggler, ThemeContext } from "gatsby-plugin-ultimate-dark-mode";

import rfs from "../utils/rfs.js";
import SEO from "./seo";
import EpilogueWithSlant from "../assets/Epilogue[slnt,wght].woff2";
import "../styles/global.scss";

const iconNavHeight = `39.33px`;

const IconSpaceholder = styled.div`
  top: 0;
  height: ${iconNavHeight};
`;

const QuiccIcons = styled.nav`
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
    opacity: ${({ theme }) => theme.Map({light: 0.25, dark: 0.5})};
    transition: color --theme-transition-duration, opacity --theme-transition-duration;

    &.local {
      color: red;
    }

    &:hover {
      transition: opacity 75ms;
      opacity: 1;
    }

    &:not(.no-skew) {
      // pseudo-pseudo-random rotation
      &:nth-child(3n + 1) svg,
      &:nth-child(3n-1) svg {
        transform: rotate(-10deg);
      }
      &:nth-child(3n) svg {
        transform: rotate(3deg);
      }
      &:nth-child(4n-2) svg {
        transform: rotate(10deg);
      }
      &:nth-child(4n + 1) svg {
        transform: rotate(-8deg);
      }
    }
  }
`;

const Jump = keyframes`
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: none;
  }
`;

const DarkModeButtonComponent = styled.button`
  position: fixed;
  top: 0;
  right: 0;
  ${rfs(`48px`, `width`)}
  ${rfs(`48px`, `height`)}
  ${rfs.marginTop(`.5rem`)}
  ${rfs.marginRight(`.5rem`)}
  z-index: 2;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: var(--content-color);
  transition: color --theme-transition-duration, opacity --theme-transition-duration;

  @media only screen and (min-width: 700px) {
    // something weird going on with the margin and quicc-icons
    margin-top: 0;
  }

  &:focus {
    outline: none;
  }

  &:focus:not(:active) svg {
    animation: ${Jump} 200ms;
  }

  &:not(:focus):not(:active) svg {
    animation: ${Jump} 200ms;
  }
`;

const DarkModeButton = ({ theme, themeTransitionDuration, setTheme }) => (
  <DarkModeButtonComponent
    theme={theme}
    themeTransitionDuration={themeTransitionDuration}
    onClick={() => setTheme(theme.Name === `light` ? `dark` : `light`)}
  >
    {theme.Name === `light` ? (
      <FaMoon size={32} />
    ) : (
      <FiSun size={32} />
    )}
  </DarkModeButtonComponent>
);

export default function Layout({ children, title, literalTitle }) {
  const themeContext = useContext(ThemeContext);
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
  if (title === ``) {
    onHomepage = true;
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
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Inconsolata:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @font-face {
            font-family: Epilogue;
            src: url(${EpilogueWithSlant}) format('woff2-variations');
          }
        `}</style>
      </Helmet>
      <IconSpaceholder />
      <QuiccIcons theme={themeContext.theme} className={onHomepage ? `` : `invariable`}>
        {onHomepage ? (
          <>
            {/* <Link title="blog" to="/blog">
              <FaPencilAlt size={32} />
            </Link> */}
            <Link title="portfolio" to="/stuff" className="local">
              <FaFolderOpen size={32} />
            </Link>
            {/* the title attr below has a fullwidth @ and a cyrillic o and i */}
            {/* TODO: maybe url-encode the href */}
            <a
              title="hі＠hоw.hadі.іs"
              href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#104;&#105;&#64;&#104;&#111;&#119;&#46;&#104;&#97;&#100;&#105;&#46;&#105;&#115;"
            >
              <FaEnvelope size={32} />
            </a>
            <a title="twitter" href="https://twitter.com/tarxini">
              <FaTwitter size={32} />
            </a>
            <a title="linkedin" href="https://linkedin.com/in/hat">
              <FaLinkedin size={32} />
            </a>
            <a title="github" href="https://github.com/supposedly">
              <FaGithub size={32} />
            </a>
          </>
        ) : (
          <Link title="main page" to="/" className="no-skew local">
            <FaHome size={34} />
          </Link>
        )}
      </QuiccIcons>
      <ThemeToggler as={DarkModeButton} />
      {/* thanks Rapti, https://stackoverflow.com/a/7607206 */}
      <main style={{ paddingLeft: `calc(100vw - 100%)` }}>
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
};

Layout.defaultProps = {
  children: undefined,
  title: ``,
  literalTitle: false,
};
