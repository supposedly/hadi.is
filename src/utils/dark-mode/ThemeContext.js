import React, { createContext, useMemo, useEffect, useState } from 'react';

const kebabCase = s => s.replace(/(?!^)(?=[A-Z])/g, `-`).toLowerCase();

export const ThemeContext = createContext();

export const ThemeConsumer = ThemeContext.Consumer;

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

const storage = local => ({
  set: (key, value) => {
    if (local === undefined) {
      return;
    }
    else if (local) {
      localStorage.setItem(key, value);
    } else {
      document.cookie = `lasttheme=${encodeURIComponent(value)};max-age=31536000;path=/`;  // expire in one year
    }
  },
  get: key => {
    if (local === undefined) {
      return undefined;
    } else if (local) {
      return localStorage.getItem(key);
    } else {
      const result = document.cookie.split(';').find(
        cookie => cookie.startsWith('lasttheme=')
      );
      return result && decodeURIComponent(result.split('=')[1]);
    }
  }
});

function anyColorToRGB(document, color) {
  if (document === undefined) {
    return `0, 0, 0`;
  }
  const ctx = document.createElement(`canvas`).getContext(`2d`);
  ctx.fillStyle = color;
  const hex = ctx.fillStyle;
  const num = parseInt(hex.slice(hex.startsWith(`#`)), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

export const ThemeProvider = ({ children, themes, transitionDuration }) => {
  const [theme, rawSetTheme] = useState(undefined);
  let [storageType, setStorageType] = useState(undefined);
  
  useEffect(() => {
    const root = window.document.documentElement;
    setStorageType(localStorageAvailable());
    rawSetTheme(
      root.style.getPropertyValue(`--initial-theme`)
    );
  }, []);

  const RGB = useMemo(() => {
    const RGB = {};
    Object.entries(themes[theme] || {}).forEach(([color, variant]) => {
      RGB[color] = anyColorToRGB(document || undefined, variant);
    });
    return RGB;
  }, [themes, theme]);

  // TODO: these should probably be in the useEffect thing
  const contextProps = useMemo(() => ({
    themeTransitionDuration: transitionDuration,
    theme: {
      // not a huge fan of the capital initials,
      // but it'd be way grodier to pollute the color
      // namespace or (worse) add a namespacing level
      // just for non-color stuff
      ...themes[theme],
      RGB,
      Name: theme,
      Is: name => name === theme,
      IsNot: name => name !== theme,
      IsAny: names => names.includes(theme),
      Matches: check => check(theme),
      Map: (map, defaultVal = ``) => map[theme] === undefined ? defaultVal : map[theme]  // two accesses yay
    },
    setTheme(newTheme) {
      const root = window.document.documentElement;
      storage(storageType).set(`lasttheme`, newTheme);
      Object.entries(themes[newTheme])
        .forEach(([color, variant]) => {
          root.style.setProperty(`--${kebabCase(color)}-color`, variant);
        });
      root.classList.remove(theme);
      root.classList.add(newTheme);
      rawSetTheme(newTheme);
    }
  }), [theme, themes, transitionDuration, storageType]);

  return (
    <ThemeContext.Provider value={contextProps}>
      {children}
    </ThemeContext.Provider>
  );
};
