import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const resizeObserverLoopErr = () => {
  let resizeObserverErr = window.console.error;
  window.console.error = (...args) => {
      if (args && args.length && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop limit exceeded')) {
          return; // Suppress the error
      }
      resizeObserverErr(...args);
  };
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

resizeObserverLoopErr();