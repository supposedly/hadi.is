import React from "react";
import { withPrefix } from "gatsby";

export function onRenderBody({ setHeadComponents, pathname }) {
  setHeadComponents([
    <link key="canonicalLink" rel="canonical" href={withPrefix(pathname)} />,
    <meta key="openGraphLink" property="og:url" content={withPrefix(pathname)} />
  ]);
}
