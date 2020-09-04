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
    renderer.setClearColor( 0x545454, 1 );
    document.body.appendChild( renderer.domElement );

    
    

    var spotLight = new THREE.DirectionalLight( {color:0xffffff});
    spotLight.position.set( -2, 4, 6 );
    scene.add( spotLight );

    var spotLight2 = new THREE.DirectionalLight( {color:0xffffff});
    spotLight2.position.set( 2, -4, -6 );
     scene.add( spotLight2 );

    // var light = new THREE.AmbientLight( {color:0xffffff});
    // scene.add( light );
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(-1, 2, 4);
    // camera.add(light);

    const groupCubes = new THREE.Group();
    const cubes = {};

    var floorMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide ,color:0xaf006f});
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -2.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
    
    let cubeDims = 5
    for(let cubeNum = 0; cubeNum < Math.pow(cubeDims, 3); cubeNum++){
        let geometry = new THREE.BoxGeometry(0.95,0.95,0.95);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00afaf,
            vertexColors: THREE.FaceColors 
            });
        cubes[cubeNum] = new THREE.Mesh(geometry, material);
        // groupCubes.add(cubes[cubeNum]);
        scene.add(cubes[cubeNum])
    }
    let cubeIndex = parseInt(cubeDims / 2)
    console.log("cubeindex>:::", cubeIndex);
    let cubePositions = [];
    for (let z = cubeIndex; z >= -cubeIndex; z--) {
        for (let y = -cubeIndex; y <= cubeIndex; y ++) {
            for (let x = cubeIndex; x >= -cubeIndex; x --) {
                cubePositions.push([x, y, z]);
            }
        }
    }

    for(let cube in cubes){
        cubes[cube].position.set(...cubePositions[cube])
    }

    // scene.add(groupCubes);
    var controls = new OrbitControls( camera, renderer.domElement );


    camera.position.z = 8;
    camera.position.y = 8;
    camera.position.x = 8;
    controls.update();

    function animate() {
        requestAnimationFrame( animate );
        
        renderer.render( scene, camera );
        controls.update();
    }

    var targetList = [];
    // targetList.push(groupCubes);

    // projector = new THREE.Raycaster():

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    var mouse = new THREE.Vector2();


    function onDocumentMouseDown( event ) 
    {

    event.preventDefault();
	
	console.log("Click.");
	
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	// projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    ray.setFromCamera( mouse, camera );
	var intersects = ray.intersectObjects( scene.children, true );
    console.log(intersects[0].object.position);
    console.log(intersects);
    // intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    let faceIndex = intersects[0].faceIndex;
    intersects[0].object.geometry.faces[faceIndex].color.setRGB( 0.8 * Math.random() + 0.2, 25, 45 ); 
    if(faceIndex === 0 || faceIndex%2 === 0){
        intersects[0].object.geometry.faces[faceIndex + 1].color.setRGB( 0.8 * Math.random() + 0.2, 25, 45 ); 
    }
    else{
        intersects[0].object.geometry.faces[faceIndex - 1].color.setRGB( 0.8 * Math.random() + 0.2, 25, 45 ); 
    }
    // intersects[0].object.material.emissive.setHex((0.1 * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
	// // if there is one (or more) intersections
	// if ( intersects.length > 0 )
	// {
	// 	console.log("Hit @ " + toString( intersects[0].point ) );
	// 	// change the color of the closest face.
	// 	intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
	// 	intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
	// }

}

    animate();
    console.log("scene created");
    
 
}