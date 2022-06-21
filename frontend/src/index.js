import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { BrowserRouter } from "react-router-dom";
import ProvideAuth from './auth';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvideAuth>
        <App />
      </ProvideAuth>
    </BrowserRouter>
  </React.StrictMode>
)
