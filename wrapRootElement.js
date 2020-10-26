import React, { useContext } from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";

import { ThemeContext, ThemeProvider } from "./src/utils/dark-mode/ThemeContext";
import { themes, transitionDuration } from "./src/utils/dark-mode/theme-info";

const Provider = ({ children }) => {
  const themeContext = useContext(ThemeContext);
  return (
    <SCThemeProvider theme={themeContext.theme}>
      {children}
    </SCThemeProvider>
  );
}

export default ({ element }) => (
  <ThemeProvider themes={themes} transitionDuration={transitionDuration}>
    <Provider>
      {element}
    </Provider>
  </ThemeProvider>
);
