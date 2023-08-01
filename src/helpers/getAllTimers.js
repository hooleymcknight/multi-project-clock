const getAllTimers = (store, runningTimers) => {
    const timerIds = runningTimers.map(x => x.id); // { id: data.id, count: totalCount, timeout: swTimeout }
    const timersData = store.get('clientTimers'); // [{"name":"client here","count":"2512"}] array of objects
    let newTimersData = [...timersData];
    timerIds.forEach((id) => {
        const indexToReplace = newTimersData.indexOf(newTimersData.filter(x => x.name === id)[0]);
        if (indexToReplace >= 0) {
            const count = runningTimers.filter(x => x.id === id)[0].count;
            newTimersData[indexToReplace] = { name: id, count: count, active: true };
        }
    });
    store.set('clientTimers', newTimersData);
    return newTimersData;
}

export default getAllTimers;