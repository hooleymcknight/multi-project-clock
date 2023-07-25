import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faCheck, faSquareXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import Timer from "./components/timer.jsx";
const ipcRenderer = window.require('electron').ipcRenderer;

const ClockApp = () => {
    const [timersData, setTimersData] = React.useState([])
    const [editing, setEditing] = React.useState('');
    const [isInputValid, setIsInputValid] = React.useState(true);

    const stopHandler = (timer) => {
        const newCount = timer.dataset.count;
        const timerId = timer.id;

        const newTimersData = [...timersData];
        const indexToReplace = newTimersData.indexOf(newTimersData.filter(x => x.name === timerId)[0]);
        newTimersData[indexToReplace] = { name: timerId, count: newCount };
        ipcRenderer.send('updateSavedTimers', newTimersData);
        setTimersData(newTimersData);
    }

    const openEditName = (e) => {
        const container = e.target.closest('.stopwatch-section')
        const timerId = container.querySelector('.stopwatch').id;
        setEditing(timerId);
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
        if (e.target.value.length < 2) {
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

    const removeHandler = (e) => {
        const container = e.target.closest('.stopwatch-section')
        const timerId = container.querySelector('.stopwatch').id;

        let newTimersData = [...timersData];
        newTimersData = newTimersData.filter(x => x.name !== timerId);
        ipcRenderer.send('addOrDelete', newTimersData);
        setTimersData(newTimersData);
    }

    React.useEffect(() => {
        if (timersData.length > 0) return;
        ipcRenderer.send('loadSavedTimers', []);
        ipcRenderer.on('loadSavedTimersReply', (event, data) => {
            setTimersData(data);
        })
    }, [timersData])

    return (
        <main className="clock-app">
            {
                timersData.map(x => 
                    <div key={x.name} className="stopwatch-section">
                        
                        {editing == x.name ? 
                            <div className="sw-header">
                                <input type="text" defaultValue={x.name} onChange={(e) => validateInput(e)}></input>
                                <button id="edit" disabled={!isInputValid} onClick={(e) => closeEditName(e)}><FontAwesomeIcon icon={faCheck} /></button>
                            </div>
                        :
                            <div className="sw-header">
                                <h2>{x.name}</h2>
                                <button id="edit" onClick={(e) => openEditName(e)}><FontAwesomeIcon icon={faPencil} /></button>
                            </div>
                        }

                        <button id="remove" onClick={(e) => removeHandler(e)}>
                            <FontAwesomeIcon icon={faSquareXmark} />
                        </button>

                        <Timer name={x.name} count={x.count} onStop={(e) => stopHandler(e)}></Timer>
                    </div>
                )
            }
            <button className="btn" id="add" onClick={() => addHandler()}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </main>
    );
}

export default ClockApp;