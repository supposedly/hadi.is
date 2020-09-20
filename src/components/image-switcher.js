import PropTypes from "prop-types";
import React from "react";
import Image from "gatsby-image";
import styled, { keyframes } from "styled-components";

import RFS from '../utils/rfs.js';

const jumpDuration = `200ms`;
const rfs = new RFS();

const RoundedImage = styled(Image)`
  border-radius: 1em
`;

const ImgContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${rfs.marginTop(`1rem`)};

  picture, .gatsby-image-wrapper {
    ${rfs.rfs(`500px`, `width`)};
  }
`;

const jump = keyframes`
  0% {
    width: 0;
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: none;
  }
`

const ArrowButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
  color: white;
  font-weight: bolder;
  background-color: #999;
  box-shadow: 0 0 1px .5px #999;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 200ms, background-color 200ms, color 200ms;
  ${rfs.rfs(`50px`, `height`)};
  ${rfs.rfs(`50px`, `width`)};
  padding: 0;
  border: none;
  cursor: pointer;
  transform: none;
  z-index: 1;  // so image doesn't hide button
  outline: none;
  ${rfs.margin(`1.5rem`)};

  ${ImgContainer}:hover & {
    opacity: .34;  // #ddd on a white bg

    &:hover {
      opacity: 1;
    }

    &:focus:not(:active), &.jump {
      animation: ${jump} ${jumpDuration};
    }
  }
`;


export default class ImageSwitcher extends React.Component {
  constructor(props) {
    super();
    this.state = {currentImg: 0};
    this.arrowRefs = {left: React.createRef(), right: React.createRef()};
    this.maxImg = Object.keys(props.data).filter(k => k.startsWith(props.prefix)).length - 1;

    // this is HIDEOUS i gotta make it less awful at some point
    this.arrowTouched = false;
    this.touchActive = false;
  }

  componentDidMount() {
    // continued HIDEOUSness
    this.isFirefox = navigator.userAgent.match(/Gecko\/\S+/) !== null;
    document.addEventListener(`touchstart`, () => { this.touchActive = true; });
    document.addEventListener(`mousedown`, () => { if (!this.touchActive) this.arrowTouched = false; this.touchActive = false; });
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

  blurArrows() {
    this.arrowRefs.left.current.blur();
    this.arrowRefs.right.current.blur();
  }

  jumpArrow(refName) {
    const el = this.arrowRefs[refName].current;
    if (el === undefined || el === null || el.classList.contains(`jump`)) {
      return;
    }
    this.arrowTouched = true;
    el.classList.add(`.jump`);
    el.classList.remove(`.jump`);
    setTimeout(() => {
      this.switch(refName, true);
    }, this.isFirefox ? 75 : jumpDuration);
  }

  render() {
    return (
      <ImgContainer
        role="presentation"  // for no-noninteractive-element-interactions :/
        style={{ height: '300px', maxHeight: '300px'/*, width: '500px', maxWidth: '500px'*/}}
        onMouseLeave={this.blurArrows.bind(this)}
      >
        <ArrowButton
          ref={this.arrowRefs.left}
          onClick={() => this.switch(`left`)}
          onTouchStart={this.jumpArrow.bind(this, `left`)}
        >
          &lt;
        </ArrowButton>
        <RoundedImage
          fluid={this.props.data[`${this.props.prefix}${this.state.currentImg}`].childImageSharp.fluid}
          alt={this.props.alts[this.state.currentImg]}
          style={{ maxHeight: '100%' }}
        />
        <ArrowButton
          ref={this.arrowRefs.right}
          onClick={() => this.switch(`right`)}
          onTouchStart={this.jumpArrow.bind(this, `right`)}
        >
          &gt;
        </ArrowButton>
      </ImgContainer>
    );
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
