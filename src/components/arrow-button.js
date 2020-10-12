import styled, { keyframes } from "styled-components";

import rfs from "../utils/rfs.js";


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

const cosmeticJump = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: none;
  }
`

const polygons = {
  down: `5% 50%, 50% 95%, 95% 50%, 100% 50%, 50% 100%, 0% 50%`,
  left: `50% 0, 55% 0, 5% 50%, 55% 100%, 50% 100%, 0% 50%`,
  right: `45% 0, 50% 0, 100% 50%, 50% 100%, 45% 100%, 95% 50%`,
  up: `5% 50%, 50% 5%, 95% 50%, 100% 50%, 50% 0, 0% 50%`
}

export default styled.button.attrs(props => ({
  points: polygons[props.direction],
  container: props.container || `&`,
  jumpDuration: props.jumpDuration || 200,
  changeDOMWidth: props.changeDOMWidth === undefined ? true : props.changeDOMWidth
}))`
  display: inline-flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms;
  ${rfs(`50px`, `height`)}
  ${rfs(`50px`, `width`)}
  padding: 0;
  border: none;
  cursor: pointer;
  z-index: 1;  // so image doesn't hide button
  outline: none;
  ${rfs.margin(`1.5rem`)};
  background-color: transparent;

  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: black;
    clip-path: polygon(${props => props.points});
  }

  ${props => props.container}:hover & {
    opacity: .34;  // #ddd on a white bg

    &:hover {
      opacity: 1;
    }

    &:focus:not(:active), &.jump {
      animation: ${props => props.changeDOMWidth ? jump : cosmeticJump} ${props => props.jumpDuration}ms;
    }
  }
`;
