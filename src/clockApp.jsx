import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Timer from "./components/timer.jsx";

const data = [ "Client #1", "Client #2" ]

const ClockApp = () => {
    return (
        <main className="clock-app">
            {
                data.map(x => 
                    <div key={x} className="stopwatch-section">
                        <h2>{x}</h2>
                        <Timer name={x}></Timer>
                    </div>
                )
            }
        </main>
    );
}

export default ClockApp;