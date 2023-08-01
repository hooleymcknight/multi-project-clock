const ipcRenderer = window.require('electron').ipcRenderer;

// function logEvent(event) {
//     let now = new Date();
//     console.log(now, event);
// }

function updateTimeStrings(timer, hour, minute, second, count) {
    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    timer.querySelector('#hr').innerHTML = hrString;
    timer.querySelector('#min').innerHTML = minString;
    timer.querySelector('#sec').innerHTML = secString;
    timer.querySelector('#count').innerHTML = countString;
}

let currentTimeout = null

function displayStopWatch(timer, hour, minute, second, count) {
    if (currentTimeout !== null) {
        clearTimeout(currentTimeout)
    }
    if (timer.classList.contains('active')) {
        let totalCount = timer.dataset.count;
        totalCount++;

        let times = msToTime(totalCount)

        updateTimeStrings(timer, times.setHours, times.setMinutes, times.setSeconds, times.setMS);
        timer.dataset.count = totalCount;

        currentTimeout = setTimeout(() => {
            displayStopWatch(timer);
        }, 10);
    }
}

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


const startTimer = (e, props) => {
    let timer;
    if (e === null) {
        timer = document.querySelector(`.stopwatch[id="${props.name}"]`);
    }
    else {
        timer = e.target.closest('.stopwatch');
    }
    
    timer.classList.add('active');
    let totalCount = Number(timer.dataset.count);

    let hour;
    let minute;
    let second;
    let count;

    if (totalCount > 0) {
        let timeObj = msToTime(totalCount)
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

    if (timer.querySelector('#hr').textContent !== '00') {
        hour = Number(timer.querySelector('#hr').textContent);
    }
    if (timer.querySelector('#min').textContent !== '00') {
        minute = Number(timer.querySelector('#min').textContent);
    }
    if (timer.querySelector('#sec').textContent !== '00') {
        second = Number(timer.querySelector('#sec').textContent);
    }
    if (timer.querySelector('#count').textContent !== '00') {
        count = Number(timer.querySelector('#count').textContent);
    }

    // check if another timer is running
    const timerId = timer.id;
    const prevTimer = timer.closest('.clock-app').querySelector(`.stopwatch.active:not([id="${timerId}"])`)
    if (prevTimer) {
        props.onStop(prevTimer);
        prevTimer.classList.remove('active');
    }

    ipcRenderer.send('timersToggled', true);

    const stopWatchData = {
        id: timer.id,
        count: totalCount,
        active: timer.classList.contains('active') // true or false
    }

    ipcRenderer.send('stopWatch', stopWatchData);
    displayStopWatch(timer, hour, minute, second, count, totalCount);
}

const stopTimer = (e, props) => {
    const timer = e.target.closest('.stopwatch');
    props.onStop(timer);
    timer.classList.remove('active');

    ipcRenderer.send('timersToggled', false);

    const stopWatchData = {
        id: timer.id,
        count: 0, // I dont think this value matters either.
        active: timer.classList.contains('active') // true or false
    }

    ipcRenderer.send('stopWatch', stopWatchData);
}

const resetTimer = (e, props) => {
    const thisTimer = e.target.closest('.stopwatch');
    thisTimer.querySelector('#hr').innerHTML = '00';
    thisTimer.querySelector('#min').innerHTML = '00';
    thisTimer.querySelector('#sec').innerHTML = '00';
    thisTimer.querySelector('#count').innerHTML = '00';
    thisTimer.dataset.count = '0';

    props.onStop(thisTimer);
    thisTimer.classList.remove('active');

    ipcRenderer.send('timersToggled', false);

    const stopWatchData = {
        id: thisTimer.id,
        count: 0, // I dont think this value matters.
        active: thisTimer.classList.contains('active') // true or false
    }

    ipcRenderer.send('stopWatch', stopWatchData);
}

export { startTimer, stopTimer, resetTimer, updateTimeStrings, msToTime }