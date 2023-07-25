function stopWatch(timer, hour, minute, second, count) {
    if (timer.classList.contains('active')) {
        count++;

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
    
        if (hour < 10) {
            hrString = "0" + hrString;
        }
    
        if (minute < 10) {
            minString = "0" + minString;
        }
    
        if (second < 10) {
            secString = "0" + secString;
        }
    
        if (count < 10) {
            countString = "0" + countString;
        }
    
        timer.querySelector('#hr').innerHTML = hrString;
        timer.querySelector('#min').innerHTML = minString;
        timer.querySelector('#sec').innerHTML = secString;
        timer.querySelector('#count').innerHTML = countString;
        setTimeout(() => {
            stopWatch(timer, hour, minute, second, count);
        }, 10);
    }
}


const startTimer = (e) => {
    const timer = e.target.closest('.stopwatch');
    timer.classList.add('active');

    let hour = 0;
    let minute = 0;
    let second = 0;
    let count = 0;

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
    timer.closest('.clock-app').querySelector(`.stopwatch.active:not([id="${timerId}"])`)?.classList.remove('active');

    stopWatch(timer, hour, minute, second, count);
}

const stopTimer = (e) => {
    const timer = e.target.closest('.stopwatch');
    timer.classList.remove('active');
}

const resetTimer = (e) => {
    const thisTimer = e.target.closest('.stopwatch');
    thisTimer.querySelector('#hr').innerHTML = '00';
    thisTimer.querySelector('#min').innerHTML = '00';
    thisTimer.querySelector('#sec').innerHTML = '00';
    thisTimer.querySelector('#count').innerHTML = '00';
}

export { startTimer, stopTimer, resetTimer }