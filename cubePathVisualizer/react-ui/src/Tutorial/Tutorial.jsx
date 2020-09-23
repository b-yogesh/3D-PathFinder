import React from "react";
import Button from 'react-bootstrap/Button';
import './Tutorial.css';


export default class Modal extends React.Component {

    onClose = e => {
       this.props.onClose(e)
    };

    render() {
        console.log(this.props);
        if(!this.props.show){
            return null;
        }
        return (
        <div className="tutorial" id="modal">
            <h2>{this.props.title}</h2>
            <div className="content">{this.props.message}</div>
            <div className="actions">
                <Button className="toggle-button" onClick={e => { this.onClose(e); }} >
                    Close
                </Button>
            </div>
        </div>);
    }
}