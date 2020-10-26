import React from "react";
import { Link, graphql } from "gatsby";
import styled from "styled-components";

import Layout from "../components/layout";
import Title from "../components/title";
import NavButton from "../components/navbutton";
import ImageSwitcher from "../components/image-switcher";

import rfs from "../utils/rfs.js";

const FatButton = styled.button`
  ${rfs.padding(`1rem`)}
  ${rfs.fontSize(`3.2rem`)}
  ${rfs(`9rem`, `height`)}
  -webkit-tap-highlight-color: transparent;
  width: 80%;
  cursor: pointer;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0);
  color: black;
  box-shadow: none;
  border: none;
  border-radius: 5px;
  font-weight: 600;

  &:hover .yuge {
    transition-duration: 400ms;
    ${rfs(`7.5rem`, `height`)}
    ${rfs(`7.5rem`, `width`)}
    ${rfs(`7.5rem`, `line-height`)}
  }

  .yuge {
    background-color: rgba(255, 191, 191, ${({ theme }) => theme.Map({ dark: 0.5 }, 0.8)});
    color: var(--content-color);
    border-radius: 50%;
    ${rfs(`6rem`, `height`)}
    ${rfs(`6rem`, `width`)}
    ${rfs(`6rem`, `line-height`)}
    display: inline-flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    transition:
      background-color var(--theme-transition-duration),
      color var(--theme-transition-duration),
      width 700ms, height 700ms, line-height 700ms, margin 700ms;

    &:hover {
      transition-duration: 450ms;
      // background-color: rgba(255, 64, 64, 1);
      ${rfs(`9rem`, `height`)}
      ${rfs(`9rem`, `width`)}
      ${rfs(`9rem`, `line-height`)}
    }
  }

  &:focus, &:active {
    outline: none;
    z-index: 1;

    .yuge {
      ${rfs(`60rem`, `height`)}
      ${rfs(`100vw`, `width`)}
      ${rfs(`100rem`, `line-height`)}
    }
  }

  &#show-links {
    font-family: 'Arial', sans-serif;
  }
`;

const LinksSection = styled.section`
  > div {
    width: 50%;
    ${rfs.marginTop(`3rem`)}
    align-items: flex-start;
  }
  nav,
  a {
    color: var(--content-color);
    transition: color var(--theme-transition-duration), opacity var(--theme-transition-duration);
  }
  a {
    opacity: ${({ theme }) => theme.Map({ dark: 0.5 }, 0.25)};
    &:hover,
    &.activate {
      transition: opacity 0ms;
      opacity: 1;
    }
    text-decoration: none;
  }
  nav {
    display: inline;
    a {
      // comment these out for the no-list effect
      &::after {
        content: ", ";
      }
      &:first-child:nth-last-child(2)::after {
        content: " ";
      }
      &:last-child:not(:first-child)::before {
        content: "and ";
      }
      &:last-child::after {
        content: ".";
      }
    }
  }
`;

const mainRef = React.createRef();
const linksRef = React.createRef();

// TODO: This is kinda icky, fix
function blurSoon(delay = 350) {
  setTimeout(() => document.activeElement.blur(), delay);
}

function showLinks() {
  linksRef.current.scrollIntoView({
    behavior: `smooth`,
    block: `start`,
    inline: `nearest`,
  });
  blurSoon();
}

function showMain() {
  window.scrollTo({ top: 0, behavior: `smooth` });
  blurSoon();
}

function checkPath(path) {
  path = path.replace(/\//g, ` `).trim();
  return path && !path.includes(`404`);
}

function fixPath(path) {
  return path.replace(/\..+$/g, ``).replace(/\//g, ` `).trim();
}

function noSlash(path) {
  return path.replace(/\/$/, ``);
}

export default ({ data }) => (
  <Layout>
    <section
      ref={mainRef}
      style={{ height: `inherit` }}
      id="main"
      className="center-children"
    >
      <div className="flex-main center-children" style={{ width: `100%` }}>
        <ImageSwitcher
          data={data}
          alts={[`fancy fake signature`, `hadi`]}
          prefix="img"
        />
        <Title text="this guy" after="⤴" />
      </div>
      <FatButton
        as={NavButton}
        id="show-links"
        text="&amp;"
        onClick={showLinks}
      />
    </section>
    <LinksSection
      ref={linksRef}
      style={{ height: `inherit` }}
      id="links"
      className="center-children"
    >
      <div className="flex-main center-children">
        <div className="big">
          <Title punctuation space after="also" inline />
          {` `}
          <nav>
            {
              data.allSitePage.nodes
                .filter(e => checkPath(e.path))
                .map(e => (
                  <Link key={e.id} to={noSlash(e.path)}>
                    {fixPath(e.path)}
                  </Link>
                ))
            }
          </nav>
        </div>
      </div>
      <FatButton
        as={NavButton}
        id="show-main"
        text={
          <span role="img" aria-label="go back up">
            👆
          </span>
        }
        onClick={showMain}
      />
    </LinksSection>
  </Layout>
);

export const query = graphql`
  query IndexQuery {
    allSitePage {
      nodes {
        id
        path
      }
    }
    img0: file(relativePath: { eq: "siggy.png" }) {
      childImageSharp {
        fluid(maxWidth: 500, maxHeight: 350) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    img1: file(relativePath: { eq: "facepic.png" }) {
      childImageSharp {
        fluid(maxWidth: 500, maxHeight: 350) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
