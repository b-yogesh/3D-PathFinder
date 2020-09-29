import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as helper from "../Helpers/helper.js"
import * as THREE from "three";


export default function mapper(cubes, vertices, cubeIndex){

    // value :: 0 -> x, 1->y, 2 ->z
    let facesDirections = {
        0 : [1,2],
        2 : [1,2],
        4 : [0,2],
        6 : [0,2],
        8 : [0,1],
        10 : [0,1]
    }

    // let adjacentFaces = {
    //     0 : [4,6,8,10],
    //     2 : [4,6,8,10],
    //     4 : [0,2,8,10],
    //     6 : [0,2,8,10],
    //     8 : [0,2,4,6],
    //     10 : [0,2,4,6]
    // }


    let neighbours = {}
    // console.log(cubeIndex);
    for(let i in vertices){
        let v = vertices[i];
        let x = v[0];
        let y = v[1];
        let z = v[2];
        let index = v[3];
        let faceIndex= parseInt(v[4]);
        if(!faceIndex%2!==0 && faceIndex !== 0){
            faceIndex = v[4]-1
        }
        let direction = [];
        direction = facesDirections[faceIndex];
        // let index = helper.coordsToIndex(new THREE.Vector3(x,y,z));

        let noOfFaces = helper.checkHowManyFaces(x,y,z,cubeIndex);

        // if the current vertex lies on an edge or corner
        let cornerOrEdgeNeighbours;
        if(noOfFaces-1){
            cornerOrEdgeNeighbours = []
            for(let j = 0; j<6; j++){
                if(cubes[index].geometry.faces[j*2].vertex !== undefined && j*2 !== faceIndex){
                    cornerOrEdgeNeighbours.push(cubes[index].geometry.faces[j*2].vertex)
                }
            }
        }

        let left, right, top, bottom;

        if(faceIndex === 0 || faceIndex === 2){
            if(y !== cubeIndex)
                right = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                    helper.coordsToIndex(new THREE.Vector3(x, y+1 ,z)),vertices)
            if(y !== -cubeIndex)
                left = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                    helper.coordsToIndex(new THREE.Vector3(x, y-1 ,z)),vertices)
            if(z !== cubeIndex)
                top = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                    helper.coordsToIndex(new THREE.Vector3(x, y ,z+1)),vertices)
            if(z !== -cubeIndex)
                bottom = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                        helper.coordsToIndex(new THREE.Vector3(x, y ,z-1)),vertices)
        }

        if(faceIndex === 4 || faceIndex === 6){
            if(x !== cubeIndex)
                right = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                        helper.coordsToIndex(new THREE.Vector3(x+1, y ,z)),vertices)
            if(x !== -cubeIndex)
                left = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                       helper.coordsToIndex(new THREE.Vector3(x-1, y ,z)),vertices)
            if(z !== cubeIndex)
                top = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                      helper.coordsToIndex(new THREE.Vector3(x, y ,z+1)),vertices)
            if(z !== -cubeIndex)
                bottom = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                        helper.coordsToIndex(new THREE.Vector3(x, y ,z-1)),vertices)
        }

        if(faceIndex === 8 || faceIndex === 10){
            if(x !== cubeIndex)
                right = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                        helper.coordsToIndex(new THREE.Vector3(x+1, y ,z)),vertices)
            if(x !== -cubeIndex)
                left = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                       helper.coordsToIndex(new THREE.Vector3(x-1, y ,z)),vertices)
            if(y !== cubeIndex)
                top = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                      helper.coordsToIndex(new THREE.Vector3(x, y+1 ,z)),vertices)
            if(y !== -cubeIndex)
                bottom = helper.faceIndexAndCubeIndexToVertex(faceIndex, 
                        helper.coordsToIndex(new THREE.Vector3(x, y-1 ,z)),vertices)
        }   

        neighbours[i] = [];
        if(cornerOrEdgeNeighbours)
            for(let k = 0; k<cornerOrEdgeNeighbours.length; k++){
                neighbours[i].push(parseInt(cornerOrEdgeNeighbours[k])); 
            }
        if(left)
            neighbours[i].push(parseInt(left))
        if(right)
            neighbours[i].push(parseInt(right))
        if(top)
            neighbours[i].push(parseInt(top))
        if(bottom)
            neighbours[i].push(parseInt(bottom))
            
        }
        // console.log(neighbours)
        return neighbours
}