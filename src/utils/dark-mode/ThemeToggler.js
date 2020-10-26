import React, { useContext } from 'react';

import { ThemeContext } from './ThemeContext';

export const ThemeToggler = React.forwardRef(({ children, as: OuterElement, ...props }, ref) => {
  const context = useContext(ThemeContext);

  if (!context.theme.Name) {
    return null;
  }

  return (
    <OuterElement ref={ref} {...context} {...props}>
      {children}
    </OuterElement>
  );
});
