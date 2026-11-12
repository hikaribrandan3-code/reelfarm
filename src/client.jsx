import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
hydrateRoot(document.getElementById('root'), <App initialPath={window.location.pathname} initialSearch=""/>);
import './demo/demo.css';
import './desktop/desktop.css';
import './mobile-polish.css';
