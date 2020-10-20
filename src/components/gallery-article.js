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

const StyledMediaComponent = styled(() => {}).attrs(props => ({
  width: `${500 * (props.scale || 1)}px`
}))`
  ${props => rfs.marginTop(props.marginTop || `1rem`)}
  ${props => rfs(props.width, `width`)}
  float: ${props => props.$floatValue};
  ${props => props.$marginLeft}
  ${props => props.$marginRight}
  box-shadow: 0px 0px 10px #000000cc;
  border-radius: 15px;
`;

const getMarginsFromFloat = (float, marginLeft, marginRight) => {let left, right;
  switch (float) {
    case `left`:
      right = marginRight || `1rem`;
      left = marginLeft || `10px`;
      break;
    case `right`:
      right = marginRight || `10px`;
      left = marginLeft || `1rem`;
      break;
    default:
      right = marginRight || `10px`;
      left = marginLeft || `10px`;
  }
  return [rfs.marginLeft(left), rfs.marginRight(right)];
}

const StyledMedia = ({ as, float = `none`, marginLeft, marginRight, ...props }) => {
  [marginLeft, marginRight] = useMemo(
    () => getMarginsFromFloat(float, marginLeft, marginRight),
    [float, marginLeft, marginRight]
  );
  
  return <StyledMediaComponent
    as={as}
    $floatValue={float}
    $marginLeft={marginLeft}
    $marginRight={marginRight}
    {...props}
  />
}

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
);

const Floater = `figure`;

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
    Image: ({ n, ...props }) => (
      <StyledMedia
        as={Image}
        fluid={images[`img_${n}`].childImageSharp.main}
        {...props}
      />
    ),
    GIF: ({ n, ...props }) => (
      <StyledMedia
        as="img"
        src={gifs[`gif_${n}`].publicURL}
        {...props}
      />
    ),
    Video: ({ n, ...props }) => {
      const sources = videos[`vid_${n}`].childVideoFfmpeg;
      return <StyledMedia
        as={Video}
        sources={sources}
        {...props}
      />
    },
    FloatLeft: ({ children, marginRight = `10px` }) => (
      <Floater style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`, //`flex-start`,
        float: `left`,
        margin: `10px`,
        marginRight
      }}>
        {children}
      </Floater>
    ),
    FloatRight: ({ children, marginLeft = `10px` }) => (
      <Floater style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`, //`flex-end`,
        float: `right`,
        margin: `10px`,
        marginLeft
      }}>
        {children}
      </Floater>
    ),
    h1: ({ className, children, ...props }) => (
      <header className="center-children" style={{marginBottom: `1em`}}>
        <h2 className={className || ``} style={{marginBottom: 0}} {...props}>{children}</h2>
        <aside style={{fontFamily: `'Noto Sans TC'`, opacity: 0.5, marginTop: `10px`, fontSize: `16px`}}>
          <span>Built with{` `}</span>
          <BuiltWithList>
            {article.frontmatter.builtwith.map(({ name, libs }) => (
              <BuiltWithItem key={name}>
                {name}
                {libs && <>
                  {` `}
                  <BuiltWithList className="specifically">
                    {libs.map(name => (
                      <BuiltWithItem key={name} style={{display: `inline`}}>
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
