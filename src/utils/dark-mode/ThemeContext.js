import React, { createContext, useMemo, useEffect, useState } from 'react';

const kebabCase = s => s.replace(/(?<!^)(?=[A-Z])/g, `-`).toLowerCase();

export const ThemeContext = createContext();

export const ThemeConsumer = ThemeContext.Consumer;

export const ThemeProvider = ({ children, themes, transitionDuration }) => {
  const [theme, rawSetTheme] = useState(undefined);
  
  useEffect(() => {
    const root = window.document.documentElement;
    rawSetTheme(
      root.style.getPropertyValue(`--initial-theme`)
    );
  }, []);

  // TODO: these should probably be in the useEffect thing
  const contextProps = useMemo(() => ({
    themeTransitionDuration: transitionDuration,
    theme: {
      ...themes[theme],
      // not a huge fan of the capital initials,
      // but it'd be way grodier to pollute the color
      // namespace or (worse) add a namespacing level
      Name: theme,
      Is: name => name === theme,
      IsNot: name => name !== theme,
      IsAny: names => names.includes(theme),
      Matches: check => check(theme),
      Map: (map, defaultVal) => map[theme] || defaultVal
    },
    setTheme(newTheme) {
      const root = window.document.documentElement;
      localStorage.setItem(`last-theme`, newTheme);
      Object.entries(themes[newTheme])
        .forEach(([color, variant]) => {
          root.style.setProperty(`--${kebabCase(color)}-color`, variant);
        });
      rawSetTheme(newTheme);
    }
  }), [theme, themes, transitionDuration]);

  return (
    <ThemeContext.Provider value={contextProps}>
      {children}
    </ThemeContext.Provider>
  );
};
