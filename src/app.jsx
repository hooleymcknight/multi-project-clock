import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import ClockApp from './clockApp.jsx';

function render() {
    const root = createRoot(document.getElementById('app-content'));
    root.render(<ClockApp></ClockApp>);
}

render();