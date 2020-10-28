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
      Map: (map, defaultVal = ``) => map[theme] || defaultVal
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
