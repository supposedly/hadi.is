import React, { useMemo, useRef } from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Title from "../components/title";
import Gallery from "../components/gallery";
import GalleryArticle from "../components/gallery-article";

export default ({ data }) => {
  const dataMap = useRef();

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
      <Gallery>
        {Object.entries(dataMap.current).map(([name, assets]) =>
          <GalleryArticle key={name} name={name} assets={assets}></GalleryArticle>
        )}
      </Gallery>
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
    lebnxyz: allFile(filter: {relativeDirectory: {eq: "lebnxyz"}}) {
      ...ArticleAssets
    }
    copy: allFile(filter: {relativeDirectory: {eq: "copy"}}) {
      ...ArticleAssets
    }
    nutshell: allFile(filter: {relativeDirectory: {eq: "nutshell"}}) {
      ...ArticleAssets
    }
  }
`;
