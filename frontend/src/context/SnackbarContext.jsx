import React, { createContext, useContext, useState } from 'react';
import Snackbar from '../components/common/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setSnackbars(prev => [...prev, { id, message, type, duration }]);
  };

  const removeSnackbar = (id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  };

  const success = (message, duration) => showSnackbar(message, 'success', duration);
  const error = (message, duration) => showSnackbar(message, 'error', duration);
  const info = (message, duration) => showSnackbar(message, 'info', duration);

  return (
    <SnackbarContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[3000] flex flex-col gap-3 pointer-events-none">
        {snackbars.map((snackbar) => (
          <div
            key={snackbar.id}
            className="pointer-events-auto"
          >
            <Snackbar
              message={snackbar.message}
              type={snackbar.type}
              duration={snackbar.duration}
              onClose={() => removeSnackbar(snackbar.id)}
            />
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

