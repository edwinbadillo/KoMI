import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';

window.komga = window.komga || {};

const initialize = () => {
  const parentElement = document.querySelector('.v-main__wrap .v-toolbar__content')
  if (parentElement && window.location.href.startsWith(`${window.location.origin}/series`)) {
    const element = document.createElement('div');
    element.id = 'mangaScrapper'
    parentElement.appendChild(element);
    ReactDOM.render(<App />, element);
    clearInterval(window.komga.mountInterval);
    const url = window.location.href;

    window.komga.unmountInterval = setInterval(()=>{
      if(url !== window.location.href || !document.getElementById('mangaScrapper')){
        ReactDOM.unmountComponentAtNode(element);
        clearInterval(window.komga.unmountInterval);
        window.komga.mountInterval = setInterval(initialize, 1000);
      }
    }, 1000)
  } 
}
window.komga.mountInterval = setInterval(initialize, 1000);
