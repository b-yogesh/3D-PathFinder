import React, {Component} from "react";
import ReactDOM from "react-dom";
import Tesseract from "../Tesseract/tesseract";

export default class Visualizer extends React.Component {
    constructor(props){
        super(props);
        let ts = new Tesseract();
        this.ts = ts;
    }

    componentDidMount() {
        this.ts = Tesseract.bind(this)
        //this.ts()
    }

    render() {
        return(
            <div>
                <Tesseract/>
            </div>
        )
    }
}
