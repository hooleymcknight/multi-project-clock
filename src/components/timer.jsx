import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {startTimer, stopTimer, resetTimer} from '../js/timer.js';

const Timer = (props) => {
    return (
        <div className="stopwatch" id={props.name}>
            <div id="time">
                <span className="digit" id="hr">
                    00</span>
                <span className="txt">Hr</span>
                <span className="digit" id="min">
                    00</span>
                <span className="txt">Min</span>
                <span className="digit" id="sec">
                    00</span>
                <span className="txt">Sec</span>
                <span className="digit" id="count">
                    00</span>
            </div>
            <div id="buttons">
                <button className="btn" id="start" onClick={(e) => startTimer(e)}>
                    Start</button>
                <button className="btn" id="stop" onClick={(e) => stopTimer(e)}>
                    Stop</button>
                <button className="btn" id="reset" onClick={(e) => resetTimer(e)}>
                    Reset</button>
            </div>
        </div>
    );
}

export default Timer;