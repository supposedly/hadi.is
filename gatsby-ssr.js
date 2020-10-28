export { default as wrapRootElement } from "./wrapRootElement";

import React from "react";

import { themes, defaultTheme, transitionDuration } from "./src/utils/dark-mode/theme-info";

/*
 * Heavily informed by Josh W. Comeau's "The Quest for the Perfect Dark mode"
 * getInitialTheme() copied verbatim (albeit renamed)
 */

const kebabCase = s => s.replace(/(?!^)(?=[A-Z])/g, `-`).toLowerCase();

const StyleInjector = ({ themes, transitionDuration }) => {
  const injectedFunc = `
    (function() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
      function localStorageAvailable() {
        let storage;
        try {
          storage = window.localStorage;
          let x = '__storage_test__';
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        }
        catch(e) {
            return e instanceof DOMException && (
              // everything except Firefox
              e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === 'QuotaExceededError' ||
              // Firefox
              e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
            // acknowledge QuotaExceededError only if there's something already stored
            ) && (
              storage && storage.length !== 0
            );
        }
      }
      
      const storage = {
        local: localStorageAvailable(),
        set: (key, value) => {
          if (storage.local) {
            localStorage.setItem(key, value);
          } else {
            document.cookie = 'lasttheme='+encodeURIComponent(value)+';max-age=31536000;path=/';  // expire in one year
          }
        },
        get: key => {
          if (storage.local) {
            return localStorage.getItem(key);
          } else {
            const result = document.cookie.split(';').find(
              cookie => cookie.startsWith('lasttheme=')
            );
            return result && decodeURIComponent(result.split('=')[1]);
          }
        }
      };

      function getInitialTheme() {
        const persistedColorPreference = storage.get(
          'lasttheme'
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
      
      ${
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
      }
      root.style.setProperty('--theme-transition-duration', '${transitionDuration}');
      root.style.setProperty('--initial-theme', initialTheme);
      root.classList.add(initialTheme);
    })();
  `;
  return (
    // eslint-disable-next-line react/no-danger
    <script dangerouslySetInnerHTML={{ __html: injectedFunc }} />
  );
};

const DefaultStyles = ({ themes, defaultTheme, transitionDuration }) => {
  return (
    <style>
      {`
        :root {
          ${
            Object.entries(themes[defaultTheme])
              .map(([color, variant]) => (
                `--${kebabCase(color)}-color: ${variant};`
              ))
              .join(`\n`)
          }
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
