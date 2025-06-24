import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import ErrorBoundary from './components/common/ErrorBoundary';
  import './index.css';

  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found. Ensure there is a <div id="root"></div> in index.html');
  }