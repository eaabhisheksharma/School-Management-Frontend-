

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// import './styles/variables.css';
// import './styles/App.css';
// import './styles/components.css';

// document.body.style.margin = '0';
// document.body.style.padding = '0';
// document.documentElement.lang = 'en';

// if (!document.querySelector('meta[charset]')) {
//   const meta = document.createElement('meta');
//   meta.setAttribute('charset', 'UTF-8');
//   document.head.prepend(meta);
// }

// if (!document.querySelector('meta[name="viewport"]')) {
//   const viewport = document.createElement('meta');
//   viewport.name = 'viewport';
//   viewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no';
//   document.head.appendChild(viewport);
// }

// if (!document.querySelector('meta[name="theme-color"]')) {
//   const themeColor = document.createElement('meta');
//   themeColor.name = 'theme-color';
//   themeColor.content = '#0f172a';
//   document.head.appendChild(themeColor);
// }

// document.title = 'School Management System';

// const reportWebVitals = (onPerfEntry) => {
//   if (onPerfEntry && typeof onPerfEntry === 'function') {
//     import('web-vitals')
//       .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//         getCLS(onPerfEntry);
//         getFID(onPerfEntry);
//         getFCP(onPerfEntry);
//         getLCP(onPerfEntry);
//         getTTFB(onPerfEntry);
//       })
//       .catch(() => {});
//   }
// };

// if (process.env.REACT_APP_ENV !== 'production') {
//   console.log(
//     '%cSchool Management System %cv' + (process.env.REACT_APP_VERSION || '1.0.0'),
//     'background:#2563eb;color:#fff;font-size:14px;font-weight:800;padding:6px 14px;border-radius:6px 0 0 6px;',
//     'background:#0f172a;color:#93c5fd;font-size:14px;font-weight:700;padding:6px 14px;border-radius:0 6px 6px 0;'
//   );

//   console.log(
//     '%cEnvironment: %c' + (process.env.REACT_APP_ENV || 'development'),
//     'color:#64748b;font-weight:600;',
//     'color:#2563eb;font-weight:800;'
//   );

//   console.log(
//     '%cAPI Base URL: %c' +
//       (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'),
//     'color:#64748b;font-weight:600;',
//     'color:#16a34a;font-weight:700;'
//   );
// }

// const container = document.getElementById('root');

// if (!container) {
//   throw new Error(
//     '[SMS] Root element not found. Make sure public/index.html contains <div id="root"></div>'
//   );
// }

// const root = ReactDOM.createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// if (process.env.REACT_APP_ENV !== 'production') {
//   reportWebVitals(({ name, value, rating }) => {
//     console.log(
//       `%c${name} %c${Math.round(value)}ms %c${rating}`,
//       'color:#64748b;font-weight:700;',
//       'color:#0f172a;font-weight:800;',
//       rating === 'good'
//         ? 'color:#16a34a;font-weight:700;'
//         : rating === 'needs-improvement'
//         ? 'color:#d97706;font-weight:700;'
//         : 'color:#dc2626;font-weight:700;'
//     );
//   });
// }



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/variables.css';
import './styles/App.css';
import './styles/components.css';

document.body.style.margin = '0';
document.body.style.padding = '0';
document.documentElement.lang = 'en';

if (!document.querySelector('meta[charset]')) {
  const meta = document.createElement('meta');
  meta.setAttribute('charset', 'UTF-8');
  document.head.prepend(meta);
}

if (!document.querySelector('meta[name="viewport"]')) {
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no';
  document.head.appendChild(viewport);
}

if (!document.querySelector('meta[name="theme-color"]')) {
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#0f172a';
  document.head.appendChild(themeColor);
}

document.title = 'School Management System';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch(() => {});
  }
};

if (process.env.REACT_APP_ENV !== 'production') {
  console.log(
    '%cSchool Management System %cv' + (process.env.REACT_APP_VERSION || '1.0.0'),
    'background:#2563eb;color:#fff;font-size:14px;font-weight:800;padding:6px 14px;border-radius:6px 0 0 6px;',
    'background:#0f172a;color:#93c5fd;font-size:14px;font-weight:700;padding:6px 14px;border-radius:0 6px 6px 0;'
  );

  console.log(
    '%cEnvironment: %c' + (process.env.REACT_APP_ENV || 'development'),
    'color:#64748b;font-weight:600;',
    'color:#2563eb;font-weight:800;'
  );

  console.log(
    '%cAPI Base URL: %c' +
      (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'),
    'color:#64748b;font-weight:600;',
    'color:#16a34a;font-weight:700;'
  );
}

const container = document.getElementById('root');

if (!container) {
  throw new Error(
    '[SMS] Root element not found. Make sure public/index.html contains <div id="root"></div>'
  );
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.REACT_APP_ENV !== 'production') {
  reportWebVitals(({ name, value, rating }) => {
    console.log(
      `%c${name} %c${Math.round(value)}ms %c${rating}`,
      'color:#64748b;font-weight:700;',
      'color:#0f172a;font-weight:800;',
      rating === 'good'
        ? 'color:#16a34a;font-weight:700;'
        : rating === 'needs-improvement'
        ? 'color:#d97706;font-weight:700;'
        : 'color:#dc2626;font-weight:700;'
    );
  });
}