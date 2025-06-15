import React from 'react';
import classNames from 'classnames';

/**
 * A customizable button component styled for gamified pixel UIs.
 * @param {string} variant - 'primary', 'outline', or 'ghost'
 * @param {string} className - Additional classes
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Content inside the button
 */
export function Button({ variant = 'primary', className = '', onClick, children }) {
  const baseStyles = 'px-5 py-2 rounded-xl font-bold transition-all duration-200';
  const variants = {
    primary: 'bg-green-500 text-black hover:bg-green-400 shadow-md',
    outline: 'border-2 border-green-400 text-green-300 bg-transparent hover:bg-green-400 hover:text-black',
    ghost: 'text-gray-300 hover:text-white',
  };

  return (
    <button
      onClick={onClick}
      className={classNames(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
}

export default Button;
