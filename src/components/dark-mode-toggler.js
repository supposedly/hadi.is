import React from "react";
import styled, { keyframes } from "styled-components";

// the fontawesome sun is ugly
import { FiSun } from "react-icons/fi";
import { FaMoon } from "react-icons/fa";

import { ThemeToggler } from "../utils/dark-mode/ThemeToggler";
import rfs from "../utils/rfs.js";


const Jump = keyframes`
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: none;
  }
`;

const DarkModeButtonComponent = styled.button`
  position: fixed;
  top: 0;
  right: 0;
  ${rfs(`48px`, `width`)}
  ${rfs(`48px`, `height`)}
  margin-top: .5em;
  ${rfs.marginRight(`.5rem`)}
  z-index: 2;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: var(--content-color);
  transition: color --theme-transition-duration, opacity --theme-transition-duration;

  @media only screen and (min-width: 700px) {
    // something weird going on with the margin and quicc-icons
    margin-top: 0;
  }

  &:focus {
    outline: none;
  }

  &:focus:not(:active) svg {
    animation: ${Jump} 200ms;
  }

  &:not(:focus):not(:active) svg {
    animation: ${Jump} 200ms;
  }
`;

const DarkModeButton = ({ theme, setTheme, size }) => (
  <DarkModeButtonComponent
    theme={theme}
    onClick={() => setTheme(theme.Name === `light` ? `dark` : `light`)}
  >
    {theme.Name === `light` ? (
      <FaMoon size={size} />
    ) : (
      <FiSun size={size} />
    )}
  </DarkModeButtonComponent>
);

export default ({ size = 28 }) => <ThemeToggler as={DarkModeButton} size={size} />;
