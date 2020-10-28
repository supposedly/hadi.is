// XXX: too much going on in this one file lol

import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import styled from "styled-components";
import Highlight, { defaultProps } from 'prism-react-renderer';
import paleNight from "prism-react-renderer/themes/paleNight";

import Image from "gatsby-image";
import DevIconComponent from "../components/devicon";
import Video from "../components/video";

import rfs from "../utils/rfs.js";

const visibilityDelay = 300;
const viewportCoefficient = .8;

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

  ${props => props.theme.Is(`dark`) &&
    `a {
        color: cornflowerblue;

      &:visited {
        color: mediumpurple;
      }
    }`
  }
`;

const BuiltWithList = styled.ul`
  display: inline;
  list-style-type: none;
  font-size: 16px;
  margin: 0;
  padding: 0;
`;

const BuiltWithItem = styled.li`
  display: inline;

  &::after {
    content: ", ";
  }

  &:first-child:nth-last-child(2)::after {
    content: " ";
  }

  &:last-child {
    &:not(:first-child)::before {
      content: "and ";
    }

    &::after {
      content: "";
    }
  }

  .specifically {
    &::before {
      content: "(using ";
    }
    &::after {
      content: ")";
    }
  }

  &:first-child:last-child .specifically {
    &::before {
      content: "using ";
    }
    &::after {
      content: "";
    }
  }
`;

const DevIcon = styled(DevIconComponent)`
  ${props => rfs(props.width, `width`)}
`;

const StyledMediaComponent = styled(() => {}).attrs(props => ({
  width: `${(props.modalExpanded ? props.$expandedWidth : 500 * props.scale)}px`,
}))`
  ${props => rfs(props.width, `width`)}
  height: ${props => props.expandedHeight};
  border-radius: 15px;
  box-shadow: 0px 0px 10px #000000cc;

  &.expanded {
    transition: height 200ms, width 200ms, max-height 200ms;
    position: fixed;
    float: none;
    top: 50%;
    left: 0;
    right: 0;
    margin: auto;
    width: ${props => props.width};
    transform: translateY(-50%);
    z-index: 3;
  }
`;

// semantics be damned, making this a div instead of a button is the
// only reasonable way to allow for StyledMedia components with buttons
// of their own (e.g. the mute button on <Video />)
const ModalButton = styled.div`
  background-color: transparent;
  border: none;
  float: ${props => props.float};
  ${props => props.marginLeftCSS}
  ${props => props.marginRightCSS}
  ${props => props.marginTopCSS}
  transition: opacity 200ms;

  &::after {
    content: '';
    opacity: 0;
    background-color: black;
    transition: opacity 200ms;
  }

  &.expanded::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 100vh;
    width: 100vw;
    opacity: .6;
    z-index: 2;
  }

  &:focus {
    outline: none;
  }
`;

const getMarginsFromFloat = (float, marginLeft, marginRight) => {
  let left, right;
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
  return [left, right];
};

const StyledMedia = ({
  as,
  float = `none`,
  marginLeft,
  marginRight,
  marginTop = `1rem`,
  scale,
  ...props
}) => {
  const [
    marginLeftCSS,
    marginRightCSS,
    marginTopCSS
  ] = useMemo(
    () => {
      const [left, right] = getMarginsFromFloat(float, marginLeft, marginRight);
      return [
        rfs.marginLeft(left),
        rfs.marginRight(right),
        rfs.marginTop(marginTop)
      ];
    },
    [float, marginLeft, marginRight, marginTop]
  );
  const [expanded, setExpanded] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState(null);
  const [expandedHeight, setExpandedHeight] = useState(null);
  const [scaledViewport, setScaledViewport] = useState(null);
  const mediaRef = useRef(null);

  useEffect(() => {
    const f = () => {
      const root = document.documentElement || {};
      setScaledViewport({
        width: viewportCoefficient * Math.max(root.clientWidth || 0, window.innerWidth || 0),
        height: viewportCoefficient * Math.max(root.clientHeight || 0, window.innerHeight || 0)
      });
    };
    f();
    window.addEventListener(`resize`, f);
    return () => {
      window.removeEventListener(`resize`, f);
    };
  }, []);

  useEffect(() => {
    let el = mediaRef.current;
    if (!el || !scaledViewport) {
      return;
    }
    if (!el.clientWidth) {
      // lol
      el = el.imageRef.current;
    }
    if (!el) {
      // again lol for Safari
      return;
    }
    const ratio = el.clientHeight / el.clientWidth;
    const viewportRatio = scaledViewport.height / scaledViewport.width;
    if (viewportRatio < 1) {
      // LANDSCAPE
      let newHeight = scaledViewport.height;
      let newWidth = scaledViewport.height / ratio;

      // could be "expandedWidth * viewportCoefficient" but actually we don't
      // want it to be greater than even 80% of the width
      if (newWidth > scaledViewport.width) {
        newWidth = scaledViewport.width;
        newHeight = scaledViewport.width * ratio;
      }

      setExpandedHeight(newHeight);
      setExpandedWidth(newWidth);
    } else {
      // PORTRAIT or SQUARE
      let newWidth = scaledViewport.width;
      let newHeight = scaledViewport.width * ratio;

      if (newHeight > scaledViewport.height) {
        newHeight = scaledViewport.height;
        newWidth = scaledViewport.height / ratio;
      }

      setExpandedWidth(newWidth);
      setExpandedHeight(newHeight);
    }
  }, [
    mediaRef,
    scaledViewport,
    expanded
  ]);

  return (
    <ModalButton
      className={expanded ? `expanded` : ``}
      onClick={() => setExpanded(v => !v)}
      float={float}
      marginLeftCSS={marginLeftCSS}
      marginRightCSS={marginRightCSS}
      marginTopCSS={marginTopCSS}
    >
      <StyledMediaComponent
        as={as}
        ref={mediaRef}
        modalExpanded={expanded}
        className={expanded ? `expanded` : ``}
        style={expanded ? { position: `fixed` } : undefined}
        scale={scale || 1}
        $expandedWidth={expandedWidth}
        $expandedHeight={expandedHeight}
        {...props}
      />
    </ModalButton>
  );
};

const FakeLink = styled.button`
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  border-radius: 0;
  padding: 0;
  cursor: pointer;

  transition: border-width 150ms;

  &:hover, &:focus {
    outline: none;
    border-bottom: 3px solid black;
  }

  &:active {
    outline: none;
    position: relative;
    top: 2px;
  }
`

const Floater = `figure`;

export default function GalleryArticle({
  assets,
  focused,
  setArticle,
  name: nameForDebugging
}) {
  const [article, images, gifs, videos] = useMemo(
    () => [
      assets.mdx ? assets.mdx.text.childMdx : { body: nameForDebugging },
      { ...assets.png, ...assets.jpg },
      assets.gif,
      { ...assets.mp4, ...assets.webm },
    ],
    [assets, nameForDebugging]
  );
  const components = useMemo(
    () => ({
      ArticleLink: ({ children, n: name, ...props }) => (
        <FakeLink
          onClick={() => { setArticle(name); }}
          {...props}
        >
          {children}
        </FakeLink>
      ),
      Image: ({ n, ...props }) => (
        <StyledMedia
          as={Image}
          fluid={images[`img_${n}`].childImageSharp.main}
          {...props}
        />
      ),
      GIF: ({ n, ...props }) => (
        <StyledMedia as="img" src={gifs[`gif_${n}`].publicURL} {...props} />
      ),
      Video: ({ n, ...props }) => {
        const sources = videos[`vid_${n}`].childVideoFfmpeg;
        return <StyledMedia as={Video} sources={sources} playSound={focused} {...props} />;
      },
      FloatLeft: ({ children, marginRight = `10px` }) => (
        <Floater
          style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`, //`flex-start`,
            float: `left`,
            margin: `10px`,
            marginRight,
          }}
        >
          {children}
        </Floater>
      ),
      FloatRight: ({ children, marginLeft = `10px` }) => (
        <Floater
          style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`, //`flex-end`,
            float: `right`,
            margin: `10px`,
            marginLeft,
          }}
        >
          {children}
        </Floater>
      ),
      code: ({ children, className }) => (
        <Highlight
          {...defaultProps}
          theme={paleNight}
          code={children}
          language={(className || ``).replace(/language-/, '')}
        >
          {({className, style, tokens, getLineProps, getTokenProps}) => (
            <pre className={className} style={{...style, padding: '20px'}}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({line, key: i})}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      ),
      h1: ({ className, children, ...props }) => (
        <header className="center-children" style={{ marginBottom: `1em` }}>
          <h2
            className={className || ``}
            style={{ marginBottom: 0 }}
            {...props}
          >
            {children}
            {` `}
            {article.frontmatter.builtwith.map(({ name }) => (
              <DevIcon
                key={name}
                style={{ opacity: 0.6, verticalAlign: `text-bottom` }}
                width="35px"
                name={name.toLowerCase()}
              />
            ))}
          </h2>
          <aside
            style={{
              fontFamily: `'Noto Sans TC'`,
              opacity: 0.5,
              marginTop: `10px`,
              fontSize: `16px`,
            }}
          >
            <span>Built with{` `}</span>
            <BuiltWithList>
              {article.frontmatter.builtwith.map(({ name, libs }) => (
                <BuiltWithItem key={name}>
                  <span style={{fontWeight: `bold`}}>{name}</span>
                  {libs && (
                    <>
                      {` `}
                      <BuiltWithList className="specifically">
                        {libs.map(name => (
                          <BuiltWithItem
                            key={name}
                            style={{ display: `inline` }}
                          >
                            {name}
                          </BuiltWithItem>
                        ))}
                      </BuiltWithList>
                    </>
                  )}
                </BuiltWithItem>
              ))}
            </BuiltWithList>
            <span>.</span>
          </aside>
        </header>
      ),
    }),
    [article, images, gifs, videos, focused, setArticle]
  );
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

  return (
    <Article
      className={focused ? `visible` : `invisible`}
    >
      {visible ? (
        <MDXProvider components={components}>
          <MDXRenderer>{article.body}</MDXRenderer>
        </MDXProvider>
      ) : (
        <></>
      )}
    </Article>
  );
}

GalleryArticle.propTypes = {
  assets: PropTypes.objectOf(PropTypes.object).isRequired,
  focused: PropTypes.bool,
};

GalleryArticle.defaultProps = {
  assets: undefined,
  focused: false,
};
