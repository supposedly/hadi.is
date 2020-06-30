import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Title from "../components/title";
import NavButton from "../components/navbutton";

import "../styles/index.scss";
import siggy from "../images/siggy.png";

const IndexPage = () => (
  <Layout stylesheets={[`../styles/index.scss`]}>
    {/* <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link> */}

    <section id="main" className="center-children">
      <div className="flex-main center-children">
        <img id="main-image" alt="a signature (placeholder for a real portrait)" src={siggy} />
        <Title text="this guy" after="⤴" />
      </div>
      <NavButton id="show-links" text="&amp;" />
    </section>
    <section id="links" className="hidden center-children">
      <div className="flex-main center-children">
        <div className="big">
          <Title after="also" inline={true} />
          <nav>
            {/* {% for subpage in site.subpages %}
              <a href="{{ subpage.url }}">{{ subpage.title | downcase }}</a>
              <!-- <span> ⦁ </span> -->
            {% endfor %} */}
            <span>pebis</span>
          </nav>
        </div>
      </div>
      <NavButton id="show-main" text="👆" />
    </section>
  </Layout>
)

export default IndexPage
