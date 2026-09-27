import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext(null);

export const RouterProvider = ({ children }) => {
  // Read initial path from hash or default to student dashboard
  const getInitialPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/student/dashboard';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || '/student/dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Helper to match parameterized routes like /admin/import/validate/:jobId or /mentor/student/:id
  const matchRoute = (pattern, path) => {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, matchRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
