import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faCheck, faSquareXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import Timer from "./components/timer.jsx";
import ConfirmModal from './components/confirmModal.jsx';
const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('testEvent', (event, data) => {
    console.log('test event received')
    if (data) console.log(data);
})

ipcRenderer.on('darkModeToggle', (event, data) => {
    if (data) {
        document.documentElement.classList.add('dark-mode');
    }
    else {
        document.documentElement.classList.remove('dark-mode');
    }
})

// function logEvent(event) {
//     let now = new Date();
//     console.log(now, event);
// }

const ClockApp = () => {
    const [timersData, setTimersData] = React.useState([])
    const [editing, setEditing] = React.useState('');
    const [isInputValid, setIsInputValid] = React.useState(true);
    const [deleting, setDeleting] = React.useState('');
    const [isAggro, setIsAggro] = React.useState(false);

    ipcRenderer.on('aggroModeToggle', (event, data) => {
        setIsAggro(data);
    })

    ipcRenderer.on('updateTime', (event, data) => {
        let newData = JSON.parse(data);
        // console.log(timersData);
        console.log(newData.count)
        const newTimersData = [...timersData];
        const indexToReplace = newTimersData.indexOf(newTimersData.filter(x => x.name === newData.id)[0]);
        newTimersData[indexToReplace] = { name: newData.id, count: Number(newData.count) };
        // console.log(newTimersData);
        setTimersData(newTimersData);
    })

    const stopHandler = (timer, closingWindow) => {
        const newCount = timer.dataset.count;
        const timerId = timer.id;

        const newTimersData = [...timersData];
        const indexToReplace = newTimersData.indexOf(newTimersData.filter(x => x.name === timerId)[0]);
        newTimersData[indexToReplace] = { name: timerId, count: newCount };
        ipcRenderer.send('updateSavedTimers', newTimersData);

        if (closingWindow) {
            ipcRenderer.send('closeWindow');
        }
        else {
            setTimersData(newTimersData);
        }
    }

    const openEditName = (e) => {
        const container = e.target.closest('.stopwatch-section')
        const timerId = container.querySelector('.stopwatch').id;
        setEditing(timerId);
    }

    const handleKeyPress = (e) => {
        if (!e.code) return;

        if (e.code === 'Enter' && isInputValid) {
            closeEditName(e);
        }
        else if (e.code === 'Escape') {
            setEditing('');
        }
    }

    const closeEditName = (e) => {
        const container = e.target.closest('.stopwatch-section')
        const newName = container.querySelector('input').value;
        const currentName = container.querySelector('.stopwatch').id;

        const newTimersData = [...timersData];
        const currentTimer = newTimersData.filter(x => x.name === currentName)[0];
        const indexToReplace = newTimersData.indexOf(currentTimer);
        newTimersData[indexToReplace] = { name: newName, count: currentTimer.count };
        
        ipcRenderer.send('updateSavedTimers', newTimersData);
        setEditing('');
        setTimersData(newTimersData);
    }

    const validateInput = (e) => {
        const currentIndex = e.target.closest('.stopwatch-section').dataset.index;
        const matchingIds = e.target.closest('.clock-app').querySelectorAll(`.stopwatch-section:not([data-index="${currentIndex}"]) .stopwatch[id="${e.target.value}"]`);
        if (e.target.value.length < 2 || matchingIds.length) {
            setIsInputValid(false);
        }
        else {
            setIsInputValid(true);
        }
    }

    const addHandler = () => {
        const newItemNumber = timersData.length + 1;
        const newItem = {
            name: `Client #${newItemNumber}`,
            count: 0
        }
        const newTimersData = [...timersData, newItem];
        ipcRenderer.send('addOrDelete', newTimersData);
        setTimersData(newTimersData);
    }

    const triggerRemoveModal = (e) => {
        const container = e.target.closest('.stopwatch-section');
        const timerId = container.querySelector('.stopwatch').id;

        setDeleting(timerId);
    }

    const removeHandler = (e, timerId) => {
        const container = e.target.closest('.clock-app').querySelector(`[id="${timerId}"]`);

        let newTimersData = [...timersData];
        newTimersData = newTimersData.filter(x => x.name !== timerId);
        ipcRenderer.send('addOrDelete', newTimersData);
        setTimersData(newTimersData);
        setDeleting('');
    }

    React.useEffect(() => {
        ipcRenderer.on('saveTimers', () => {
            const activeTimers = document.querySelectorAll('.stopwatch.active');
            if (activeTimers.length) {
                activeTimers.forEach((timer) => {
                    stopHandler(timer, true);
                    ipcRenderer.send('saveTimersReply', timersData);
                });
            }
            else {
                ipcRenderer.send('closeWindow');
            }
        });

        ipcRenderer.send('requestAggro');
        ipcRenderer.on('sendAggroState', (event, data) => {
            setIsAggro(data);
        })

        if (timersData.length > 0) return;
        ipcRenderer.send('loadSavedTimers', []);
        ipcRenderer.on('loadSavedTimersReply', (event, data) => {
            setTimersData(data);
        })
    }, [timersData]);

    return (
        <main className="clock-app">
            {
                timersData.map((x, idx) => 
                    <div key={x.name} className="stopwatch-section" data-index={idx}>
                        
                        {editing == x.name ? 
                            <div className="sw-header">
                                <input autoFocus="true" type="text" defaultValue={x.name} onChange={(e) => validateInput(e)} onKeyUp={(e) => handleKeyPress(e)}></input>
                                <button id="edit" disabled={!isInputValid} onClick={(e) => closeEditName(e)}><FontAwesomeIcon icon={faCheck} /></button>
                            </div>
                        :
                            <div className="sw-header">
                                <h2>{x.name}</h2>
                                <button id="edit" onClick={(e) => openEditName(e)}><FontAwesomeIcon icon={faPencil} /></button>
                            </div>
                        }

                        <button id="remove" onClick={(e) => triggerRemoveModal(e)}>
                            <FontAwesomeIcon icon={faSquareXmark} />
                        </button>

                        <Timer name={x.name} count={x.count} onStop={(e) => stopHandler(e)}></Timer>
                    </div>
                )
            }
            <button className="btn" id="add" onClick={() => addHandler()}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            {deleting ?
                <ConfirmModal name={deleting} aggro={isAggro} onDelete={(e) => removeHandler(e, deleting)} onCancel={() => setDeleting('')} />
            :
                ''
            }
        </main>
    );
}

export default ClockApp;