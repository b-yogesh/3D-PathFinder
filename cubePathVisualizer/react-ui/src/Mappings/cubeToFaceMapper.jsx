import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as helper from "../Helpers/helper.js"
import * as THREE from "three";


export default function cubeToFaceMapper(cubeIndex){

    // value :: 1 -> x, 2->y, 3 ->z
    let faceCoords = {
        "x"  : 0 ,
        "-x" : 2 ,
        "y"  : 4 ,
        "-y" : 6,
        "z"  : 8,
        "-z" : 10 
    }

    let mapper = {};
    console.log("cubeIndx", cubeIndex);
    for (let z = cubeIndex; z >= -cubeIndex; z--) {
        for (let y = -cubeIndex; y <= cubeIndex; y ++) {
            for (let x = cubeIndex; x >= -cubeIndex; x --) {
                let index = helper.coordsToIndex(new THREE.Vector3(x, y ,z))
                mapper[index] = []
                if(x === cubeIndex)
                    mapper[index].push(faceCoords["x"])
                if(y === cubeIndex)
                    mapper[index].push(faceCoords["y"])
                if(z === cubeIndex)
                    mapper[index].push(faceCoords["z"])
                if(x === -cubeIndex)
                    mapper[index].push(faceCoords["-x"])
                if(y === -cubeIndex)
                    mapper[index].push(faceCoords["-y"])
                if(z === -cubeIndex)
                    mapper[index].push(faceCoords["-z"])

            }
        }
    }
    console.log("mapper:::::",mapper);
    return mapper;

}