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

  render() {
    return (
      <div
        className={styles.imgContainer} 
        style={{ height: '300px', maxHeight: '300px'/*, width: '500px', maxWidth: '500px'*/}}
        onMouseLeave={this.blurArrows.bind(this)}
      >
        <button
          ref={this.arrowRefs.left}
          className={`${styles.leftMargin} ${styles.arrowBtn}`}
          onClick={this.left.bind(this)}
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
          className={`${styles.rightMargin} ${styles.arrowBtn}`}
          onClick={this.right.bind(this)}
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
