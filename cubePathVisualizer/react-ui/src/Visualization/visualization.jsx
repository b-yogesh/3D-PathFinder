import React, {Component} from "react";
import ReactDOM from "react-dom";
import Tesseract from "../Tesseract/tesseract";

export default class Visualizer extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.Tesseract = Tesseract.bind(this)
        this.Tesseract()
    }

    render() {
        return(
            <div>
            
            </div>
        )
    }
}
