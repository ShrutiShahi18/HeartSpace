import React from 'react';

const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`flex min-h-[200px] w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 resize-y ${className}`}
      {...props}
    />
  );
};

export default Textarea;

