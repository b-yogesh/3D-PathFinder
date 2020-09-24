import React from "react";
import Button from 'react-bootstrap/Button';
import './Tutorial.css';
import * as $ from 'jquery';


export default class Modal extends React.Component {

    render() {
        console.log(this.props);
        if(!this.props.show){
            // $(".canvas-container").removeClass("blur-filter"); 
            return null;
        }
        
        console.log(this.props.index);
        let disableNext = false;
        if(this.props.index===8) disableNext = true;
        return (
        <div className="tutorial" id="modal">
            <h2>{this.props.title}</h2>
            <div className="content">{this.props.message}</div>
            <div className="actions">
                <Button className="previous-button" disabled={!this.props.index} onClick={e => { this.props.onPrevious(e); }} >
                    Previous
                </Button>
                <Button className="next-button" disabled={disableNext} onClick={e => { this.props.onNext(e); }} >
                    Next
                </Button>
                <Button className="close-button" onClick={e => { this.props.onClose(e);  }} >
                    Close
                </Button>
            </div>
        </div>);
    }
}