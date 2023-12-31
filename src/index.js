import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
//import { Provider } from 'react-redux'
//import store from './store'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
require('dotenv').config()


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
      
      <App />

  </BrowserRouter>,
  rootElement);

registerServiceWorker();

