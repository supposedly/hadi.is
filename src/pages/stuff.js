import React, { useMemo, useRef } from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Title from "../components/title";
import Gallery from "../components/gallery";

export default ({ data }) => {
  const dataMap = useRef();

  // this is like 78% faster than if i did it with Object.fromEntries()
  useMemo(() => {
    dataMap.current = {};
    Object.keys(data).forEach(k => {
      const extensions = {};
      data[k].group.forEach(
        ({extension, nodes}) => {
          const assets = {};
          nodes.forEach(({name, ...data}) => {
            assets[name] = data;
          });
          extensions[extension] = assets;
        }
      );
      dataMap.current[k] = extensions;
    });
  }, [data]);

  return <Layout title="stuff">
    <header className="center-children">
      <Title text="stuff" />
      <Gallery articles={dataMap.current} />
    </header>
  </Layout>
}

// childVideoFfmpeg {
//   mp4: transcode(
//     maxWidth: 900
//     maxHeight: 480
//     fileExtension: "mp4"
//     codec: "libx264"
//   ) {
//     width
//     src
//     presentationMaxWidth
//     presentationMaxHeight
//     originalName
//     height
//     fileExtension
//     aspectRatio
//   }
// }

// NOTE to future me: you can optionally specify sourceInstanceName to be "articles"
export const query = graphql`
  query PortfolioQuery {
    calcstuff: allFile(filter: {relativeDirectory: {eq: "calculator-stuff"}}) {
      ...ArticleAssets
    }
    caterer: allFile(filter: {relativeDirectory: {eq: "caterer"}}) {
      ...ArticleAssets
    }
    booksy: allFile(filter: {relativeDirectory: {eq: "booksy"}}) {
      ...ArticleAssets
    }
    nutshell: allFile(filter: {relativeDirectory: {eq: "nutshell"}}) {
      ...ArticleAssets
    }
    joffrey: allFile(filter: {relativeDirectory: {eq: "joffrey"}}) {
      ...ArticleAssets
    }
    wacomophone: allFile(filter: {relativeDirectory: {eq: "wacomophone"}}) {
      ...ArticleAssets
    }
    copy: allFile(filter: {relativeDirectory: {eq: "copy"}}) {
      ...ArticleAssets
    }
    minetactoe: allFile(filter: {relativeDirectory: {eq: "mine-tac-toe"}}) {
      ...ArticleAssets
    }
    lebnxyz: allFile(filter: {relativeDirectory: {eq: "lebnxyz"}}) {
      ...ArticleAssets
    }
  }
`;
