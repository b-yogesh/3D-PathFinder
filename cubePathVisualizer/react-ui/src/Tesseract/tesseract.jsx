import React, {Component} from "react";
import ReactDOM from "react-dom";
import './tesseract.css';
import * as THREE from "three";
import * as OrbitControls from "three-orbitcontrols"

export default function Tesseract() {
    
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000 
        );

    const config = {antialias: true}
    let renderer = new THREE.WebGLRenderer(config);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    
    let geometry = new THREE.BoxGeometry(0.85,0.85,0.85);
    const material = new THREE.MeshBasicMaterial({ color:0xffffff, vertexColors: THREE.FaceColors})
    // let cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    // let cube2 = new THREE.Mesh( geometry, material );
    // scene.add( cube2 );
    const groupCubes = new THREE.Group();
    const cubes = {};
    for(let cubeNum = 0; cubeNum < 27; cubeNum++){
        cubes[cubeNum] = new THREE.Mesh(geometry, material);
        groupCubes.add(cubes[cubeNum]);
    }

    let cubePositions = [];
    for (let z = 1; z >= -1; z--) {
        for (let y = -1; y <= 1; y ++) {
            for (let x = 1; x >= -1; x --) {
                cubePositions.push([x, y, z]);
            }
        }
    }

    for(let cube in cubes){
        cubes[cube].position.set(...cubePositions[cube])
    }

    scene.add(groupCubes);
    var controls = new OrbitControls( camera, renderer.domElement );





    camera.position.z = 10;
    controls.update();
    function animate() {
        requestAnimationFrame( animate );
        // cubes[2].rotation.x += 0.01;
        // cubes[5].rotation.y += 0.01;
        renderer.render( scene, camera );
        controls.update();
    }

    animate();
    console.log("scene created");
    
 
}