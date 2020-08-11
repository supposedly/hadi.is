import React from "react";
import { Link, graphql } from "gatsby"

import Layout from "../components/layout";
import Title from "../components/title";
import NavButton from "../components/navbutton";
import ImageSwitcher from "../components/image-switcher";

import "../styles/index.scss";

const mainRef = React.createRef();
const linksRef = React.createRef();

function showLinks() {
  linksRef.current.classList.toggle(`hidden`);
  linksRef.current.scrollIntoView({behavior: `smooth`, block: `start`, inline: `nearest`});
  awaitScrollEnd(
    () => mainRef.current.classList.toggle(`hidden`)
  );
}

function showMain() {
  mainRef.current.classList.toggle(`hidden`);
  linksRef.current.scrollIntoView(true);
  setTimeout(() => window.scrollTo({top: 0, behavior: `smooth`}), 1);
  awaitScrollEnd(
    () => linksRef.current.classList.toggle(`hidden`)
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
  path = path.replace(/\//g, ` `).trim();
  return path && !path.includes(`404`);
}

function fixPath(path) {
  console.log(path);
  return path.replace(/\..+$/g, ``).replace(/\//g, ` `).trim();
}

function noSlash(path) {
  return path.replace(/\/$/, ``);
}

export default (props) => {
  return (
    <Layout>
      <section ref={mainRef} id="main" className="center-children">
        <div className="flex-main center-children" style={{ width: `100%` }}>
          <ImageSwitcher
            data={props.data}
            alts={[
              `fancy fake signature`,
              `hadi`
            ]}
            prefix="img"
          />
          <Title text="this guy" after="⤴" />
        </div>
        <NavButton className="fat-btn" id="show-links" text="&amp;" onClick={showLinks} />
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
        <NavButton className="fat-btn" id="show-main" text="👆" onClick={showMain} />
      </section>
    </Layout>
  );
}

export const query = graphql`
  query PageQuery {
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
