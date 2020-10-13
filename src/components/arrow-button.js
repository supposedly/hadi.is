import React, { useMemo, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

import rfs from "../utils/rfs.js";

const polygons = {
  down: `5% 50%, 50% 95%, 95% 50%, 100% 50%, 50% 100%, 0% 50%`,
  left: `50% 0, 55% 0, 5% 50%, 55% 100%, 50% 100%, 0% 50%`,
  right: `45% 0, 50% 0, 100% 50%, 50% 100%, 45% 100%, 95% 50%`,
  up: `5% 50%, 50% 5%, 95% 50%, 100% 50%, 50% 0, 0% 50%`
}

const inverses = {
  down: `up`,
  left: `right`,
  right: `left`,
  up: `down`
}

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

const ArrowComponent = styled.button.attrs(props => {
  const direction = props.direction || `right`;
  const marginForward = `margin-${direction}`;
  const marginBackward = `margin-${inverses[direction]}`;
  return {
    direction,
    marginForward,
    marginBackward,
    container: props.container || `&`,
    jumpDuration: props.jumpDuration || 200,
    changeDOMWidth: props.changeDOMWidth === undefined ? true : props.changeDOMWidth,
    useRFS: props.useRFS === undefined ? true : props.useRFS,
    backgroundColor: props.backgroundColor || `#999`,
    height: props.height || props.dims || `50px`,
    width: props.width || props.dims || `50px`,
    [marginForward]: props.margin || `1.5rem`,
    [marginBackward]: props.margin || `1.5rem`
  };
})`
  display: inline-flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms;
  ${props => props.useRFS ? rfs(props.height, `height`) : props.height}
  ${props => props.useRFS ? rfs(props.width, `width`) : props.width}
  padding: 0;
  border: none;
  cursor: pointer;
  z-index: 1;  // so image doesn't hide button
  outline: none;
  ${props => rfs[props.marginForward](`1.5rem`)}
  ${props => rfs[props.marginBackward](`1.5rem`)}
  background-color: transparent;

  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: ${props => props.backgroundColor};
    clip-path: polygon(${props => polygons[props.direction]});
  }

  ${props => props.container}:hover > & {
    opacity: .34;  // #ddd on a white bg

    &:hover {
      opacity: 1;
    }

    &:focus:not(:active), &.jump {
      animation: ${props => props.changeDOMWidth ? jump : cosmeticJump} ${props => props.jumpDuration}ms;
    }
  }
`;

const ArrowButton = React.forwardRef(({ onClick, containerRef, ...props }, ref) => {
  if (!ref) {
    ref = useRef(null);
  }
  useEffect(() => {
    let nonNullContainer;
    if (containerRef && containerRef.current && ref) {
      nonNullContainer = containerRef.current;
      containerRef.current.addEventListener(`mouseleave`, () => { if (ref.current) ref.current.blur(); });
    }
    return () => {
      if (nonNullContainer) {
        nonNullContainer.removeEventListener(`mouseleave`, () => { if (ref.current) ref.current.blur(); });
      }
    }
  }, [containerRef, ref]);
  console.log(props);
  return <ArrowComponent
    ref={ref}
    onClick={(...args) => { if (onClick) onClick(...args); }}
    {...props}
  />;
})

export const ArrowPair = React.forwardRef(({ children, directions, handlers, ...props }, refs) => {
  delete props.direction;  // just in case
  let [ref1, ref2] = [useRef(null), useRef(null)];
  if (refs) {
    [ref1, ref2] = refs;
  }
  const [dir1, dir2] = directions.split(/\s+/);
  const [handlers1, handlers2] = useMemo(() => {
    const handlers1 = {}, handlers2 = {};
    Object.entries(handlers).forEach(([handler, [func1, func2]]) => {
      handlers1[handler] = func1;
      handlers2[handler] = func2;
    });
    return [handlers1, handlers2];
  });
  console.log(dir2);
  return <>
    <ArrowButton direction={dir1} ref={ref1 || useRef(null)} {...handlers1} {...props}/>
      {children}
    <ArrowButton direction={dir2} ref={ref2 || useRef(null)} {...handlers2} {...props} />
  </>
})

export default ArrowButton;
