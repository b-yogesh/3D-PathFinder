import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as setFaceColor from "../Helpers/helper.js"
import Stack from "./Stack"
import * as helper from "../Helpers/helper.js"
import * as THREE from "three";



export default class Maze extends React.Component  {
    
        constructor(props)
        { 
            super(props);
            console.log("Creating Maze");
            console.log(props);
            this.noOfVertices = props.length; 
            this.vertices = props.vertices;
            this.cubeIndex = props.cubeIndex;
            this.cubes = props.cubes;
            // this.neighbours = props.neighbours;
            this.createMaze = this.createMaze.bind(this);
            this.createWalls = this.createWalls.bind(this);
            this.obstacles = [];
            const loader = new THREE.TextureLoader(new THREE.LoadingManager());
            let texture = loader.load(
                require("../assets/images/building1.jpg")
                );
            
            this.material1 = new THREE.MeshBasicMaterial({
                 map: texture
            });

            texture = loader.load(
                require("../assets/images/building2.jpg")
                );
            
            this.material2 = new THREE.MeshBasicMaterial({
                 map: texture
            });

            texture = loader.load(
                require("../assets/images/building3.jpg")
                );
            
            this.material3 = new THREE.MeshBasicMaterial({
                 map: texture
            });
        
        }
        
        createMaze(){

            for(var i =0; i< this.noOfVertices; i++){
                let rand = Math.random()
                console.log(rand);
                 if(rand<0.25){
                    this.createWalls(this.vertices[i]);
                 }
            }
            return this.obstacles;
        }

        createWalls(vertex){
            let x = vertex[0];
            let y = vertex[1];
            let z = vertex[2];
            let index = vertex[3];
            let faceIndex = vertex[4];
            console.log(this.cubes[index]);
            let normal = this.cubes[index].geometry.faces[faceIndex].normal;
            console.log("normal", normal);
            let offsetX, offsetY, offsetZ = 0;
            let geoX, geoY, geoZ = 0;
            if(normal.x === 1){
                offsetX = 1;
                offsetY = 0;
                offsetZ = 0;
                geoX = Math.floor(Math.random() * 3) + 1;
                geoY = 0.95;
                geoZ = 0.95;
            }
            else if (normal.y === 1){
                offsetX = 0;
                offsetY = 1;
                offsetZ = 0;
                geoY = Math.floor(Math.random() * 3) + 1;
                geoX = 0.95;
                geoZ = 0.95;
            }
            else if (normal.z === 1){
                offsetX = 0;
                offsetY = 0;
                offsetZ = 1;
                geoZ = Math.floor(Math.random() * 3) + 1;
                geoX = 0.95;
                geoY = 0.95;
            }
            else if(normal.x === -1){
                offsetX = -1;
                offsetY = 0;
                offsetZ = 0;
                geoX = Math.floor(Math.random() * 3) + 1;
                geoY= 0.95; 
                geoZ = 0.95;
            }
            else if (normal.y === -1){
                offsetX = 0;
                offsetY = -1;
                offsetZ = 0;
                geoY = Math.floor(Math.random() * 3) + 1;
                geoX = 0.95;
                geoZ = 0.95;
            }
            else if (normal.z === -1){
                offsetX = 0;
                offsetY = 0;
                offsetZ = -1;
                geoZ = Math.floor(Math.random() * 3) + 1;
                geoX= 0.95; 
                geoY = 0.95;
            }


            console.log("creating obstacle");
            let pos = this.cubes[index].position;
            console.log(pos, x, y, z);
            let geometry = new THREE.BoxGeometry(geoX,geoY,geoZ);
            
            // });
            // const material = new THREE.MeshPhongMaterial({
            //     color: 0x00f00f,
            //     vertexColors: THREE.FaceColors 
            // });
            let rand = Math.random();
            let material;
            if(rand < 0.33){
               material = this.material1;
            }
            else if(rand > 0.66){
                material = this.material2;
            }
            else{
                material = this.material3;
            }
            let obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(pos.x + offsetX, pos.y + offsetY, pos.z + offsetZ);
            obstacle.name = "obstacle";
            // obstacle.vertex = this.vertices[];
            // groupCubes.add(cubes[cubeNum]);
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            // this.scene.add(obstacle); 
            obstacle.position.setY = 25;
            // new TWEEN.Tween(obstacle.position)
            //                 .to({ y: 10}, 2000)
            //                 .easing(TWEEN.Easing.Bounce.Out)
            //                 .start();
            this.cubes[index].geometry.faces[faceIndex].isAWall = true;
            let vertexIndex = helper.faceIndexAndCubeIndexToVertex(faceIndex, helper.coordsToIndex(new THREE.Vector3(pos.x,pos.y,pos.z)), this.vertices);
            obstacle.vertexIndex = vertexIndex;
            this.obstacles.push(obstacle);
            if(faceIndex%2===0){
                this.cubes[index].geometry.faces[faceIndex+1].isAWall = true;
            }
            else{
                this.cubes[index].geometry.faces[faceIndex-1].isAWall = true;
            }
        }
      
      


}
