const ipcRenderer = window.require('electron').ipcRenderer;

function stopWatch(timer, hour, minute, second, count, totalCount) {
    if (timer.classList.contains('active')) {
        count++;
        totalCount++;

        if (count == 100) {
            second++;
            count = 0;
        }
    
        if (second == 60) {
            minute++;
            second = 0;
        }
    
        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }
    
        let hrString = hour;
        let minString = minute;
        let secString = second;
        let countString = count;
    
        if (hour < 10 && hrString !== '00') {
            hrString = "0" + hrString;
        }
    
        if (minute < 10 && minString !== '00') {
            minString = "0" + minString;
        }
    
        if (second < 10 && secString !== '00') {
            secString = "0" + secString;
        }
    
        if (count < 10 && countString !== '00') {
            countString = "0" + countString;
        }
    
        timer.querySelector('#hr').innerHTML = hrString;
        timer.querySelector('#min').innerHTML = minString;
        timer.querySelector('#sec').innerHTML = secString;
        timer.querySelector('#count').innerHTML = countString;
        timer.dataset.count = totalCount;
        setTimeout(() => {
            stopWatch(timer, hour, minute, second, count, totalCount);
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
    const timer = e.target.closest('.stopwatch');
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
    // window.setOverlayIcon(path.join(__dirname, ''), 'timers are going');
    stopWatch(timer, hour, minute, second, count, totalCount);
}

const stopTimer = (e, props) => {
    const timer = e.target.closest('.stopwatch');
    props.onStop(timer);
    timer.classList.remove('active');

    ipcRenderer.send('timersToggled', false);
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
}

export { startTimer, stopTimer, resetTimer }