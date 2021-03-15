import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'react-app-polyfill/stable';
import 'regenerator-runtime/runtime';
import configureStore from './store';
import App from './app';

const store = configureStore();

window.komga = window.komga || {};

// eslint-disable-next-line
// window.komga.genres = ["action","action/adventure","adventure","comedy","crime","drama","ecchi","fantasy","horror","manga","mecha","music","mystery","psychological","religious","romance","sci-fi","slice of life","sports","supernatural","thriller","video games"];

const initialize = () => {
  const parentElement = document.querySelector('.v-main__wrap .v-toolbar__content');
  if (parentElement && window.location.href.startsWith(`${window.location.origin}`)) {
    const element = document.createElement('div');
    element.id = 'mangaScrapper';
    parentElement.appendChild(element);
    ReactDOM.render(<Provider store={store}><App /></Provider>, element);
    clearInterval(window.komga.mountInterval);
    const url = window.location.href;

    window.komga.unmountInterval = setInterval(() => {
      if (url !== window.location.href || !document.getElementById('mangaScrapper')) {
        ReactDOM.unmountComponentAtNode(element);
        clearInterval(window.komga.unmountInterval);
        window.komga.mountInterval = setInterval(initialize, 1000);
      }
    }, 1000);
  }
};
window.komga.mountInterval = setInterval(initialize, 1000);
