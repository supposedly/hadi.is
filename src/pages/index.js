import React from "react";
import Image from "gatsby-image";
import { Link } from "gatsby"

import Layout from "../components/layout";
import Title from "../components/title";
import NavButton from "../components/navbutton";

import "../styles/index.scss";

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    [
      this.mainRef,
      this.linksRef,
    ] = Array.from({length: 2}, () => React.createRef());
  }

  showLinks() {
    document.getElementById('links').classList.toggle('hidden');
    document.getElementById('links').scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    this.awaitScrollEnd(
      () => document.getElementById('main').classList.toggle('hidden')
    );
  }

  showMain() {
    document.getElementById('main').classList.toggle('hidden');
    document.getElementById('links').scrollIntoView(true);
    setTimeout(() => window.scrollTo({top: 0, behavior: 'smooth'}), 1);
    this.awaitScrollEnd(
      () => document.getElementById('links').classList.toggle('hidden')
    );
  }

  // thanks https://stackoverflow.com/a/51142522/
  awaitScrollEnd(callback) {
    let timeout;
    function run() {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        callback();
        window.removeEventListener('scroll', run);
      }, 100);
    }
    window.addEventListener('scroll', run);
  }

  fixPath(path) {
    return path.replace(/\/|(\..+$)/g, '');
  }

  render() {
    return (
      <Layout>
        <section ref={this.mainRef} id="main" className="center-children">
          <div className="flex-main center-children" style={{ width: `100%` }}>
            <Image
              fluid={this.props.data.file.childImageSharp.fluid}
            />
            <Title text="this guy" after="⤴" />
          </div>
          <NavButton id="show-links" text="&amp;" onClick={this.showLinks.bind(this)} />
        </section>
        <section ref={this.linksRef} id="links" className="hidden center-children">
          <div className="flex-main center-children">
            <div className="big">
              <Title after="also" inline={true} />
              {` `}
              <nav>
                {
                  this.props.data.allSitePage.nodes.filter(e => this.fixPath(e.path)).map(e => (
                    <>
                      <Link key={e.id} to={e.path}>{this.fixPath(e.path)}</Link>
                      {` `}
                      <span> ⦁ </span>
                    </>
                  ))
                }
              </nav>
            </div>
          </div>
          <NavButton id="show-main" text="👆" onClick={this.showMain.bind(this)} />
        </section>
      </Layout>
    );
  }
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
