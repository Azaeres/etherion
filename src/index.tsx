import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './state/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { markNeedsUpdate } from './appState';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onSuccess(registration) {
    console.log(
      'Service Worker register success > registration:',
      registration
    );
  },

  onUpdate(registration) {
    console.log('App has been updated! > registration:', registration);
    store.dispatch(markNeedsUpdate());
  },
});
