import * as React from 'react';
import * as ReactDOM from 'react-dom';

const ConfirmModal = (props) => {

    const clickHandler = (e) => {
        if (!e.target.closest('.modal-inner') || e.target.closest('#no')) {
            // clicked the overlay or no button, fire "no" function
            props.onCancel();
        }
        else if(e.target.closest('#yes')) {
            // clicked yes, delete it.
            props.onDelete(e);
        }
    }

    return (
        <div className="confirm-modal" id={props.name} onClick={(e) => clickHandler(e)}>
            {props.aggro ? 
                <div className="modal-inner">
                    <p>Bitch you sure???</p>
                    <button className="btn" id="yes">Nuke it</button>
                    <button className="btn" id="no">No that was dumb</button>
                </div>
            :
                <div className="modal-inner">
                    <p>Are you super sure you want to delete your timer for {props.name}?</p>
                    <button className="btn" id="yes">Yes</button>
                    <button className="btn" id="no">No</button>
                </div>
            }
        </div>
    );
}

export default ConfirmModal;