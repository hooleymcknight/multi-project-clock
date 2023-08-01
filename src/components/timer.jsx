import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { startTimer, stopTimer, resetTimer } from '../js/timer.js';

function msToTime(duration) {
    var milliseconds = Math.floor((duration % 100) / 1),
      seconds = Math.floor((duration / 100) % 60),
      minutes = Math.floor((duration / (100 * 60)) % 60),
      hours = Math.floor((duration / (100 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return {
        setHours: hours,
        setMinutes: minutes,
        setSeconds: seconds,
        setMS: milliseconds
    }
}

function pad(n) {
    return (n < 10 && String(n).length < 2 ? "0" + n : n);
}

const Timer = (props) => {

    let hour;
    let minute;
    let second;
    let count;

    if (props.count > 0) {
        let timeObj = msToTime(props.count)
        hour = timeObj.setHours;
        minute = timeObj.setMinutes;
        second = timeObj.setSeconds;
        count = timeObj.setMS;
    }
    else {
        hour = 0;
        minute = 0;
        second = 0;
        count = 0;
    }

    return (
        <div className={props.active ? "stopwatch active" : "stopwatch"} id={props.name} data-count={props.count}>
            <div className="time">
                <div className="timeElement">
                    <span className="digit" id="hr">
                        {pad(hour)}
                    </span>
                    <span className="txt">Hr</span>
                </div>
                <div className="timeElement divider">:</div>

                <div className="timeElement">
                    <span className="digit" id="min">
                        {pad(minute)}
                    </span>
                    <span className="txt">Min</span>
                </div>
                <div className="timeElement divider">:</div>

                <div className="timeElement">
                    <span className="digit" id="sec">
                        {pad(second)}
                    </span>
                    <span className="txt">Sec</span>
                </div>
                <div className="timeElement divider">:</div>

                <div className="timeElement">
                    <span className="digit" id="count">
                        {pad(count)}
                    </span>
                </div>
            </div>
            <div className="buttons">
                <button className="btn" id="start" onClick={(e) => startTimer(e, props)} onLoad={props.active ? startTimer(null, props) : null}>
                    Start</button>
                <button className="btn" id="stop" onClick={(e) => stopTimer(e, props)}>
                    Stop</button>
                <button className="btn" id="reset" onClick={(e) => resetTimer(e, props)}>
                    Reset</button>
            </div>
        </div>
    );
}

export default Timer;