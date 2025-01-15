/**
 * Application entry point for BrewLog.
 * Renders the root App component into the DOM.
 * 
 * @module index
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/App.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<App />, rootElement);
}