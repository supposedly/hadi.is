/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 * 
 * (I updated this to the modern Helmet syntax)
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql, withPrefix } from "gatsby";

export default function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            titleTemplate
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet titleTemplate={site.siteMetadata.titleTemplate}>
      <html lang={lang} />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="description" content={metaDescription} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
      <meta name="twitter:description" content={metaDescription} />
      <meta property="og:url" content={withPrefix(pathname)} />
      <link rel="canonical" href={withPrefix(pathname)} />,
      {meta.map(o => <meta key={o.name | o.property} name={o.name} property={o.property} content={o.content} />)}
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};
