import PropTypes from "prop-types";
import React from "react";
import Image from "gatsby-image";

import styles from "../styles/image-switcher.module.scss";


export default class ImageSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentImg: 0};
    this.arrowRefs = {left: React.createRef(), right: React.createRef()};
    this.maxImg = Object.keys(this.props.data).filter(k => k.startsWith(this.props.prefix)).length - 1;
    this.JUMP_DURATION = parseInt(styles.jumpDuration);
    
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
    el.classList.add(styles.jump);
    el.classList.remove(styles.jump);
    setTimeout(() => {
      this.switch(refName, true);
    }, this.isFirefox ? 75 : this.JUMP_DURATION);
  }

  render() {
    return (
      <div
        className={styles.imgContainer} 
        style={{ height: '300px', maxHeight: '300px'/*, width: '500px', maxWidth: '500px'*/}}
        onMouseLeave={this.blurArrows.bind(this)}
      >
        <button
          ref={this.arrowRefs.left}
          className={styles.arrowBtn}
          onClick={() => this.switch(`left`)}
          onTouchStart={this.jumpArrow.bind(this, `left`)}
        >
          &lt;
        </button>
        <Image
          fluid={this.props.data[`${this.props.prefix}${this.state.currentImg}`].childImageSharp.fluid}
          alt={this.props.alts[this.state.currentImg]}
          style={{ maxHeight: '100%' }}
        />
        <button
          ref={this.arrowRefs.right}
          className={styles.arrowBtn}
          onClick={() => this.switch(`right`)}
          onTouchStart={this.jumpArrow.bind(this, `right`)}
        >
          &gt;
        </button>
      </div>
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
