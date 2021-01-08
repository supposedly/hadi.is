process.env[`FFMPEG_PATH`] = require(`ffmpeg-static`);
process.env[`FFPROBE_PATH`] = require(`ffprobe-static`).path;

module.exports = {
  siteMetadata: {
    titleTemplate: `%s`,
    title: `I'm Hadi`,
    description: `I'm Hadi`,
    author: `github/supposedly`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-disable-404`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-remove-trailing-slashes`,
    // `gatsby-transformer-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/src/assets/articles`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    `gatsby-transformer-sharp`,
    // gatsby-video is bad and pinned at gatsby-transformer-ffmpeg@0.3.3,
    // but this project uses features/bugfixes from 0.3.8 or something
    // so i use an alias (appending a "2") for the 0.3.8 one in order
    // for npm's peer-dependency-checker thing not to throw a fit over
    // me requesting gatsby-transformer-ffmpeg@^0.3.8 in package.json
    // but gatsby-video requesting gatsby-transformer-ffmpeg@0.3.3
    `gatsby-transformer-ffmpeg2`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-mdx`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#f00`,
        theme_color: `#000`,
        display: `minimal-ui`,
        icon: `src/assets/h.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
