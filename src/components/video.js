import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

import { FaVolumeOff, FaVolumeUp } from "react-icons/fa";

import { createRFS } from "../utils/rfs.js";

const rfs = createRFS({ rfsFactor: 30 });

const Jump = keyframes`
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: none;
  }
`;

const Button = styled.button`
  position: absolute;
  ${rfs(`48px`, `width`)}
  ${rfs(`48px`, `height`)}
  z-index: 1;
  border: none;
  cursor: pointer;
  background-color: transparent;
  filter: drop-shadow(0 0 3px black);

  &:focus {
    outline: none;
  }

  &:focus:not(:active) svg {
    animation: ${Jump} 100ms;
  }

  &:not(:focus):not(:active) svg {
    animation: ${Jump} 100ms;
  }
`;

const Container = styled.div`
  ${props => props.marginLeftCSS}
  ${props => props.marginRightCSS}
  ${props => props.marginTopCSS}
  overflow: hidden;
`;

export default ({
  sources,
  className,
  style,
  hasSound = false,
  playSound = false,
  marginLeftCSS = `margin-left: 10px;`,
  marginRightCSS = `margin-right: 10px;`,
  marginTopCSS = `margin-top: 10px;`,
  modalExpanded,
  ...props
}) => {
  const [muted, setMuted] = useState(true);
  const SpeakerIcon = muted  ? FaVolumeOff : FaVolumeUp;
  return (
    <Container
      marginLeftCSS={marginLeftCSS}
      marginRightCSS={marginRightCSS}
      marginTopCSS={marginTopCSS}
      className={className}
      // margin:0 because we want that to be the container's job
      // (esp so that the volume thing appears within the video's bounds)
      style={{ margin: modalExpanded ? `auto` : 0, padding: 0 }}
    >
        {hasSound && 
          <Button onClick={() => setMuted(muted => !muted)}>
            <SpeakerIcon color={muted ? `red` : `white`} size={32}/>
          </Button>
        }
        <video
          style={{
            borderRadius: `inherit`,
            width: `100%`,
            height: `100%`,
            position: `relative`,
            // idfk man
            marginBottom: `-5px`,
          }}
          autoPlay
          muted={muted}
          preload="true"
          loop
          {...props}
        >
          {Object.values(sources).map(s => (
            <source key={s.src} src={s.src} type={`video/${s.fileExtension}`} />
          ))}
        </video>
    </Container>
  );
};
