import React from "react";
import Image from "gatsby-image";
import { Link, graphql } from "gatsby"

import Layout from "../components/layout";
import Title from "../components/title";
import NavButton from "../components/navbutton";

import "../styles/index.scss";

const [
  mainRef,
  linksRef,
] = Array.from({length: 2}, () => React.createRef());

function showLinks() {
  document.getElementById(`links`).classList.toggle(`hidden`);
  document.getElementById(`links`).scrollIntoView({behavior: `smooth`, block: `start`, inline: `nearest`});
  awaitScrollEnd(
    () => document.getElementById(`main`).classList.toggle(`hidden`)
  );
}

function showMain() {
  document.getElementById(`main`).classList.toggle(`hidden`);
  document.getElementById(`links`).scrollIntoView(true);
  setTimeout(() => window.scrollTo({top: 0, behavior: `smooth`}), 1);
  awaitScrollEnd(
    () => document.getElementById(`links`).classList.toggle(`hidden`)
  );
}

// thanks https://stackoverflow.com/a/51142522/
function awaitScrollEnd(callback) {
  let timeout;
  function run() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      callback();
      window.removeEventListener(`scroll`, run);
    }, 100);
  }
  window.addEventListener(`scroll`, run);
}

function checkPath(path) {
  path = path.replace(`/`, ``);
  return path && !path.includes(`404`);
}

function fixPath(path) {
  return path.replace(/\/|(\..+$)/g, ``);
}

function noSlash(path) {
  return path.replace(/\/$/, ``);
}

export default (props) => {
  return (
    <Layout>
      <section ref={mainRef} id="main" className="center-children">
        <div className="flex-main center-children" style={{ width: `100%` }}>
          <Image
            fluid={props.data.file.childImageSharp.fluid}
          />
          <Title text="this guy" after="⤴" />
        </div>
        <NavButton id="show-links" text="&amp;" onClick={showLinks} />
      </section>
      <section ref={linksRef} id="links" className="hidden center-children">
        <div className="flex-main center-children">
          <div className="big">
            <Title after="also" inline={true} />
            {` `}
            <nav>
              {
                props.data.allSitePage.nodes
                  .filter(e => checkPath(e.path))
                  .map(e => (
                    <Link key={e.id} to={noSlash(e.path)}>{fixPath(e.path)}</Link>
                  ))
              }
            </nav>
          </div>
        </div>
        <NavButton id="show-main" text="👆" onClick={showMain} />
      </section>
    </Layout>
  );
}

export const query = graphql`
  query ImageQuery {
    file(relativePath: { eq: "siggy.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    allSitePage {
      nodes {
        id
        path
      }
    }
  }
`;
