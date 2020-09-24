import React from "react";
import styled from "styled-components";

import rfs from "../utils/rfs.js";

import Layout from "../components/layout";
import Title from "../components/title";

const MainArticle = styled.article`
  margin: 1rem;
  font-family: 'Epilogue', sans-serif;
  font-variation-settings: "wght" 250;
  font-weight: 250; // for firefox, idk why
  ${rfs(`19px`)}
  
  strong {
    font-variation-settings: "wght" 500;
    font-weight: 500; // for firefox, idk why
  }
`

const P = styled.p`
  line-height: 2;
`

export default () => (
  <Layout title="stuff">
    <header class="center-children">
      <Title text="stuff" />
      <MainArticle>
        <P>This page is under construction. When complete in a couple days, it'll be a gallery of projects, including:</P>
        <ul>
          <li>lebn.xyz and map</li>
          <li>&amp;copy;</li>
          <li>nutshell</li>
          <li>joffrey</li>
          <li>mine-tac-toe</li>
          <li>WACOMophone</li>
          <li>booksy</li>
          <li>MOVE3 and Odd One Out</li>
          <li>more!</li>
        </ul>
      </MainArticle>
    </header>
  </Layout>
)
