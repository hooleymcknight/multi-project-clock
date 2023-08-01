// function logEvent(event) {
//     let now = new Date();
//     console.log(now, event);
// }

/* input looks like this:
    const stopWatchData = {
        id: timer.id,
        count: totalCount,
        active: timer.classList.contains('active'), // true or false
        win: win // mainWindow
    }
*/

let swTimeouts = [
    null, // { id: data.id, count: count, timeout: swTimeout }
    null,
    null,
    null,
    null,
    null,
    null,
    null
]

function stopWatch(data) {
    let swTimeout;
    if (swTimeouts.filter(x => x !== null).filter(x => x.id === data.id).length) { // timeout exists
        swTimeout = swTimeouts.filter(x => x !== null).filter(x => x.id === data.id)[0].timeout;
        swTimeouts.filter(x => x !== null).filter(x => x.id === data.id)[0].count = Number(data.count);
        clearTimeout(swTimeout);
    }
    else { // need to create timeout
        const indexToSet = swTimeouts.indexOf(swTimeouts.filter(x => x === null)[0]);
        swTimeouts[indexToSet] = { id: data.id, count: Number(data.count), timeout: null };
    }

    let totalCount = Number(data.count);
    const win = data.win;

    if (data.active) {
        totalCount++;

        const stopWatchData = {
            id: data.id,
            count: totalCount,
            active: data.active, // this needs to change, we need to search this info out, I believe.
            win: win
        }

        swTimeouts.filter(x => x !== null).filter(x => x.id === data.id)[0].timeout = setTimeout(() => {
            stopWatch(stopWatchData);
        }, 10);
    }
}

export { stopWatch, swTimeouts }