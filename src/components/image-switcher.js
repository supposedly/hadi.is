import PropTypes from "prop-types";
import React from "react";
import Image from "gatsby-image";
import styled from "styled-components";

import { FlankingArrows } from "../components/arrow-button";

import rfs from "../utils/rfs.js";

const jumpDuration = 200;

const RoundedImage = styled(Image)`
  border-radius: 1em;
  color: transparent;  // because Firefox displays alt-text while loading
`;

const ImgContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${rfs.marginTop(`1rem`)}

  picture, .gatsby-image-wrapper {
    ${rfs(`500px`, `width`)}
  }
`;

const Dot = styled.span`
  opacity: ${props => props.isCurrent ? 0.3 : 0.1};
  display: inline-block;
  height: 20px;
  width: 20px;
  cursor: pointer;
  user-select: none;
  transition: opacity 100ms;

  &::after {
    content: '';
    display: inline-block;
    border-radius: 50%;
    background-color: black;
    height: 50%;
    width: 50%;
  }
`

export default class ImageSwitcher extends React.Component {
  constructor(props) {
    super();
    this.state = {currentImg: 0};
    this.arrowRefs = {left: React.createRef(), right: React.createRef()};
    this.containerRef = React.createRef();
    this.maxImg = Object.keys(props.data).filter(k => k.startsWith(props.prefix)).length - 1;

    // this is HIDEOUS i gotta make it less awful at some point
    this.arrowTouched = false;
    this.touchActive = false;
  }

  componentDidMount() {
    // continued HIDEOUSness
    this.isFirefox = navigator.userAgent.match(/Gecko\/\S+/) !== null;
    document.addEventListener(`touchstart`, () => { this.touchActive = true; });
    document.addEventListener(`mousedown`, () => {
      if (!this.touchActive) {
        this.arrowTouched = false;
      }
      this.touchActive = false;
    });
  }

  switch(refName, ignoreArrowTouched = false) {
    if (this.arrowTouched && !ignoreArrowTouched) {
      return;
    }
    this[refName]();
  }

  left() {
    let newImg = this.state.currentImg - 1;
    if (newImg < 0) {
      newImg = this.maxImg;
    }
    this.setState({currentImg: newImg});
  }

  right() {
    let newImg = this.state.currentImg + 1;
    if (newImg > this.maxImg) {
      newImg = 0;
    }
    this.setState({currentImg: newImg});
  }

  render() {
    return <div class="center-children">
      <ImgContainer
        ref={this.containerRef}
        style={{ maxHeight: '300px'/*, width: '500px', maxWidth: '500px'*/}}
      >
        <FlankingArrows
          ref={[this.arrowRefs.left, this.arrowRefs.right]}
          directions="left right"
          containerRef={this.containerRef}
          container={ImgContainer}
          jumpDuration={jumpDuration}
          handlers={{
            onClick: [
              () => this.switch(`left`),
              () => this.switch(`right`)
            ]
          }}
        >
          <RoundedImage
            fluid={this.props.data[`${this.props.prefix}${this.state.currentImg}`].childImageSharp.fluid}
            alt={this.props.alts[this.state.currentImg]}
            style={{ maxHeight: '100%' }}
          />
        </FlankingArrows>
      </ImgContainer>
      <div style={{marginBottom: `0.5em`}}>
        {Array.from({ length: this.maxImg + 1 }, (_, i) => (
          <Dot onClick={() => { this.setState({currentImg: i}); }} isCurrent={this.state.currentImg === i} />
        ))}
      </div>
    </div>
  }
}

ImageSwitcher.propTypes = {
  prefix: PropTypes.string,
  alts: PropTypes.arrayOf(PropTypes.string)
};

ImageSwitcher.propDefaults = {
  prefix: `img`,
  alts: []
};
