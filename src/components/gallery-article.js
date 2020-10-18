import PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import Image from "gatsby-image";

import rfs from "../utils/rfs.js";

const visibilityDelay = 300;

const Article = styled.article`
  margin-left: 1rem;
  margin-right: 1rem;
  font-family: 'Epilogue', sans-serif;
  font-variation-settings: "wght" 250;
  font-weight: 250; // for firefox, idk why
  ${rfs(`16px`)}
  transition: visibility 0ms ${visibilityDelay}ms, opacity ${visibilityDelay}ms;
  overflow: hidden;

  @media only screen and (min-width: 700px) {
    ${rfs(`19px`)}
  }

  &.invisible {
    opacity: 0;
    height: 0;
  }

  &.visible {
    opacity: 1;
  }
  
  strong {
    font-variation-settings: "wght" 500;
    font-weight: 500; // for firefox, idk why
  }

  p {
    line-height: 2;
  }

  .center-self {
    align-self: center;
  }
`

const Video = ({ sources, className, autoplay = true, ...props }) => (
  <video
    className={className}
    preload="true"
    autoPlay={autoplay}
    muted
    controls={!autoplay}
    loop
    {...props}
  >
    {Object.values(sources).map(s => (
      <source
        key={s.src}
        src={s.src}
        type={`video/${s.fileExtension}`}
      />
    ))}
  </video>
)

const StyledMedia = styled(() => {}).attrs(props => ({
  width: `${500 * (props.scale || 1)}px`
}))`
  ${rfs.marginTop(`1rem`)}
  ${props => rfs(props.width, `width`)}
  box-shadow: 0px 0px 10px #000000cc;
  margin: 10px;
  border-radius: 15px;
`;

const BuiltWithList = styled.ul`
  display: inline;
  list-style-type: none;
  font-size: 16px;
  margin: 0;
  padding: 0;
`

const BuiltWithItem = styled.li`
  display: inline;

  &::after {
    content: ', ';
  }

  &:first-child:nth-last-child(2)::after {
    content: ' ';
  }

  &:last-child {
    &:not(:first-child)::before {
      content: 'and ';
    }

    &::after {
      content: '';
    }
  }

  .specifically {
    &::before {
      content: '(using ';
    }
    &::after {
      content: ')';
    }
  }

  &:first-child:last-child .specifically {
    &::before {
      content: 'using ';
    }
    &::after {
      content: '';
    }
  }
`

export default function GalleryArticle({ assets, name: nameForDebugging, focused }) {
  // ignore all of the weird outer divs
  const [article, images, gifs, videos] = useMemo(
    () => [
      assets.mdx ? assets.mdx.text.childMdx : {body: nameForDebugging},
      {...assets.png, ...assets.jpg},
      assets.gif,
      {...assets.mp4, ...assets.webm}
    ],
    [assets, nameForDebugging]
  );
  const components = useMemo(() => ({
    Image: ({ n, float, margin, marginLeft, marginRight, scale, style, ...props }) => (
      <StyledMedia
        as={Image}
        scale={scale}
        style={{float, margin, marginLeft, marginRight, ...style}}
        fluid={images[`img_${n}`].childImageSharp.main}
        {...props}
      />
    ),
    GIF: ({ n, float, margin, marginLeft, marginRight, scale, style, ...props }) => (
      <StyledMedia
        as="img"
        scale={scale}
        style={{float, margin, marginLeft, marginRight, ...style}}
        src={gifs[`gif_${n}`].publicURL}
        {...props}
      />
    ),
    Video: ({ n, float, margin, marginLeft, marginRight, scale, style, ...props }) => {
      const sources = videos[`vid_${n}`].childVideoFfmpeg;
      return <StyledMedia
        as={Video}
        scale={scale}
        style={{float, margin, marginLeft, marginRight, ...style}}
        sources={sources}
        {...props}
      />
    },
    Comment: () => <></>,
    h1: ({ className, children, ...props }) => (
      <header className="center-children" style={{marginBottom: `1em`}}>
        <h2 className={className || ``} style={{marginBottom: 0}} {...props}>{children}</h2>
        <aside style={{opacity: 0.5, marginTop: `10px`, fontSize: `16px`}}>
          <span>Built with{` `}</span>
          <BuiltWithList>
            {article.frontmatter.builtwith.map(({ name, libs }) => (
              <BuiltWithItem key={name}>
                {name}
                {libs && <>
                  {` `}
                  <BuiltWithList className="specifically">
                    {libs.map(name => (
                      <BuiltWithItem style={{display: `inline`}}>
                        {name}
                      </BuiltWithItem>
                    ))}
                  </BuiltWithList>
                </>}
              </BuiltWithItem>
            ))}
          </BuiltWithList>
          <span>.</span>
        </aside>
      </header>
    )
  }), [article, images, gifs, videos]);
  const [visible, setVisible] = useState(focused);
  useEffect(() => {
    let handle;
    if (focused) {
      setVisible(focused);
    } else {
      handle = setTimeout(() => setVisible(focused), visibilityDelay);
    }
    return () => clearTimeout(handle);
  }, [focused]);
  return <Article className={focused ? `visible` : `invisible`}>
    {visible ?
      <MDXProvider components={components}>
        <MDXRenderer>
          {article.body}
        </MDXRenderer>
      </MDXProvider>
      :
      <></>
    }
  </Article>
}

GalleryArticle.propTypes = {
  assets: PropTypes.objectOf(PropTypes.object).isRequired,
  focused: PropTypes.bool,
}

GalleryArticle.defaultProps = {
  assets: undefined,
  focused: false,
}
