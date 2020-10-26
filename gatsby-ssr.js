export { default as wrapRootElement } from "./wrapRootElement";

import React from "react";

import { themes, defaultTheme, transitionDuration } from "./src/utils/dark-mode/theme-info";

// Heavily informed by Josh W. Comeau's "The Quest for the Perfect Dark mode"
// getInitialTheme() copied verbatim (albeit renamed)

const kebabCase = s => s.replace(/^\K(?=[A-Z])/g, `-`).toLowerCase();

const generateSettersJS = themes => (
  Object.entries(themes)
    .map(([theme, colors], i, arr) => (
      `${i === arr.length - 1 ? (
        `{`
      ) : (
        `if (initialTheme === '${theme}') {`
      )}
        ${
          Object.entries(colors)
            .map(([color, variant]) => (
              `root.style.setProperty(
                '--${kebabCase(color)}-color',
                '${variant}'
              );`
            ))
            .join(`\n`)
        }
      }`
    ))
    .join(` else `)
);

const generateSettersCSS = theme => (
  Object.entries(theme)
    .map(([color, variant]) => (
      `--${kebabCase(color)}-color: ${variant};`
    ))
    .join(`\n`)
);

const StyleInjector = ({ themes, transitionDuration }) => {
  const setters = generateSettersJS(themes);
  const injectedFunc = `
    (function() {
      function getInitialTheme() {
        const persistedColorPreference = window.localStorage.getItem(
          'last-theme'
        );
        const hasPersistedPreference = (
          typeof persistedColorPreference === 'string'
        );
        // If the user has explicitly chosen light or dark,
        // let's use it. Otherwise, this value will be null.
        if (hasPersistedPreference) {
          return persistedColorPreference;
        }
        // If they haven't been explicit, let's check the media
        // query
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const hasMediaQueryPreference = typeof mql.matches === 'boolean';
        if (hasMediaQueryPreference) {
          return mql.matches ? 'dark' : 'light';
        }
        // If they are using a browser/OS that doesn't support
        // color themes, let's default to 'light'.
        return 'light';
      }

      const initialTheme = getInitialTheme();

      const root = document.documentElement;
      
      ${setters}
      root.style.setProperty('--theme-transition-duration', '${transitionDuration}');
      root.style.setProperty('--initial-theme', initialTheme);

    })()
  `;
  return (
    // eslint-disable-next-line react/no-danger
    <script dangerouslySetInnerHTML={{ __html: injectedFunc }} />
  );
};

const DefaultStyles = ({ themes, defaultTheme, transitionDuration }) => {
  const setters = generateSettersCSS(themes[defaultTheme]);
  return (
    <style>
      {`
        :root {
          ${setters}
          --theme-transition-duration: ${transitionDuration};
        }
      `}
    </style>
  );
}

export const onRenderBody = (
  {
    setHeadComponents,
    setPreBodyComponents
  }
) => {
  setHeadComponents(
    <DefaultStyles
      themes={themes || {}}
      defaultTheme={defaultTheme || `light`}
      transitionDuration={transitionDuration || `0ms`}
    />
  );
  setPreBodyComponents(
    <StyleInjector
      themes={themes}
      transitionDuration={transitionDuration || `0ms`}
    />
  );
};
