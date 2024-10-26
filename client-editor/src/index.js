import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CookiesProvider } from "react-cookie";
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-quill/dist/quill.snow.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <GoogleOAuthProvider clientId="661453363088-trmdqbb0osd987aeb504onjgalhlqaph.apps.googleusercontent.com"> {/* Replace with your actual client ID */}
          <App />
        </GoogleOAuthProvider>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

