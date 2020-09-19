import React, {Component} from "react";
import ReactDOM from "react-dom";
import './tesseract.css';
import * as THREE from "three";
import * as OrbitControls from "three-orbitcontrols";
import * as TWEEN from "tween";
import * as helper from "../Helpers/helper.js"
import cubesToFaces from "../Mappings/cubeToFaceMapping.js";
import edgesMapping from "../Mappings/edgesMapping";
import Graph from "../Algorithms/algorithms";

import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class Tesseract extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.createEndingPoint = this.createEndingPoint.bind(this);
        this.createStartingPoint = this.createStartingPoint.bind(this);
        this.removeEndingPoint = this.removeEndingPoint.bind(this);
        this.removeStartingPoint = this.removeStartingPoint.bind(this);
        this.coordsToIndex = this.coordsToIndex.bind(this);
        this.toggle = this.toggle.bind(this);
        this.changeText = this.changeText.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.createGraph = this.createGraph.bind(this);
        this.clearWalls = this.clearWalls.bind(this);
        this.createObstacle = this.createObstacle.bind(this);
        this.removeObstacle = this.removeObstacle.bind(this);
        this.clearPath = this.clearPath.bind(this);
        this.animateVisitedNodes = this.animateVisitedNodes.bind(this);
        this.animateShortestpath = this.animateShortestpath.bind(this);
        this.getVertices = this.getVertices.bind(this);
        this.faceIndexAndCubeIndexToVertex = this.faceIndexAndCubeIndexToVertex.bind(this);
        this.setAlgorithm = this.setAlgorithm.bind(this);
        this.setDelay = this.setDelay.bind(this);
        this.state = { text: "Click to Edit"};
    }
    
    
    componentDidMount(){

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000);

        const config = {antialias: true}
        let renderer = new THREE.WebGLRenderer(config);
        this.renderer = renderer;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor( 0x545454, 1 );
        this.mount.appendChild( this.renderer.domElement );
        this.scene = scene;
        this.scene.background = new THREE.Color(0xbbd6ff);
        this.scene.fog = new THREE.Fog(0xffffff, 0, 750);
    

        var OBSTACLE = "obstacle";
        this.OBSTACLE = OBSTACLE;
        var START = "start";
        this.START = START;
        var END = "end";
        this.END = END;

        var INTERSECTED;
        this.INTERSECTED = INTERSECTED;

        var isEdit;
        this.isEdit = isEdit;

        var startOrEnd;
        this.startOrEnd = startOrEnd;

        var hoverStartColor;
        this.hoverStartColor = hoverStartColor;

        var hoverEndColor;
        this.hoverEndColor = hoverEndColor;

        var hoverUseColor;
        this.hoverUseColor = hoverUseColor;

        var spotLight = new THREE.DirectionalLight( {color:0xffffff});
        spotLight.position.set( -1, 2, 3 );
        // scene.add( spotLight );

        var spotLight2 = new THREE.DirectionalLight( {color:0xffffff});
        spotLight2.position.set( 1, -2, -3 );
        // scene.add( spotLight2 );

        var light = new THREE.AmbientLight( {color:0x111111});
         scene.add( light );
        // const color = 0xFFFFFF;
        // const intensity = 1;
        // const light = new THREE.DirectionalLight(color, intensity);
        // light.position.set(-1, 2, 4);
        // camera.add(light);
        
        var light = new THREE.PointLight(0xffffff);
        this.light = light;
        this.light.position.set(-15, 20, 30);
        // this.scene.add(light);
        
        var light2 = new THREE.PointLight(0xffffff);
        this.light2 = light2;
        this.light2.position.set(15, -20, -30);
        // this.scene.add(light2);

        const groupCubes = new THREE.Group();
        const cubes = {};
        this.cubes = cubes;
        const edges = {};
        this.edges = edges;
       
        let delay;
        this.delay = delay;
        var mazeColor = new THREE.Color(0xffffff);
        this.mazeColor = mazeColor;

        let cubeDims = 5
        this.cubeDims = cubeDims;
        for(let cubeNum = 0; cubeNum < Math.pow(cubeDims, 3); cubeNum++){
            let geometry = new THREE.BoxGeometry(1,1,1);
            const loader = new THREE.TextureLoader(new THREE.LoadingManager());
            // const material = new THREE.MeshLambertMaterial({
            //     vertexColors: THREE.FaceColors,
            //     });
            let material;
            let texture = loader.load(
                require("../assets/images/road.jpg"));
            
            material = new THREE.MeshLambertMaterial({
                map: texture,
                side: THREE.FrontSide,
                vertexColors: THREE.FaceColors,
            });
            this.cubes[cubeNum] = new THREE.Mesh(geometry, material);
            this.cubes[cubeNum].name = String(cubeNum);
            // console.log(this.cubes[cubeNum]);
           
            
            for(var i =0;i<12;i++){
                this.cubes[cubeNum].geometry.faces[i].color = mazeColor;
                this.cubes[cubeNum].geometry.faces[i].isAWall = false;
            }
            this.cubes[cubeNum].geometry.elementsNeedUpdate = true;

            
            const edges = new THREE.EdgesGeometry(geometry);

            const edgesMaterial = new THREE.LineBasicMaterial({
                color: 0x000000
            });
            this.edges[cubeNum] = new THREE.LineSegments(edges, edgesMaterial);
            
            // groupCubes.add(cubes[cubeNum]);
            this.scene.add(this.cubes[cubeNum])
            this.scene.add(this.edges[cubeNum])
        }

        let start_index = new THREE.Vector3();
        this.start_index = start_index
        this.start_index = {x:Math.floor(cubeDims / 2),y:-Math.floor(cubeDims / 2),z:Math.floor(cubeDims / 2)};
        console.log("satrindex", this.start_index);
        let cubeIndex = parseInt(cubeDims / 2)
        this.cubeIndex = cubeIndex;
        console.log("cubeindex>:::", cubeIndex);
        let cubePositions = [];
        this.cubePositions = cubePositions;
        let STARTING_POINT = 45
        let ENDING_POINT = 124
        this.STARTING_POINT = STARTING_POINT
        this.ENDING_POINT = ENDING_POINT
        let initialStartCoord;
        this.initialStartCoord = initialStartCoord;
        var initialEndCoord;
        this.initialEndCoord = initialEndCoord;
        var initialSFaceIndex = 4;
        this.initialSFaceIndex = initialSFaceIndex;
        var initialEFaceIndex = 4;
        this.initialEFaceIndex = initialEFaceIndex;
        for (let z = this.cubeIndex; z >= -this.cubeIndex; z--) {
            for (let y = -this.cubeIndex; y <= this.cubeIndex; y ++) {
                for (let x = this.cubeIndex; x >= -this.cubeIndex; x --) {
                    this.cubePositions.push([x, y, z]);
                    if((this.coordsToIndex(new THREE.Vector3(x,y,z))) === this.ENDING_POINT)
                    {
                        this.createEndingPoint(x,y,z,this.initialEFaceIndex);
                    }
                    if((this.coordsToIndex(new THREE.Vector3(x,y,z))) === this.STARTING_POINT)
                    {
                        this.createStartingPoint(x,y,z,this.initialSFaceIndex);
                    }
                }
            }
        }
        
        for(let edge in edges){
            this.edges[edge].position.set(...this.cubePositions[edge])
        }
        for(let cube in cubes){
            this.cubes[cube].position.set(...this.cubePositions[cube])
        }
           
        // scene.add(groupCubes);
        var controls = new OrbitControls( camera, renderer.domElement );
        
        this.controls = controls;
        this.controls.minDistance = 5;
        this.camera = camera;
        this.camera.position.z = 8;
        this.camera.position.y = 8;
        this.camera.position.x = 8;
        this.controls.update();
        document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
        window.addEventListener("resize", this.onWindowResize, false);
        var mouse = new THREE.Vector2();
        this.mouse = mouse;
        //this.animate = animate;
        this.animate();
        var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
        var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
        this.ray = ray;
        this.getVertices();
        this.source = 59;
        this.target = 148; 
        this.algo = 0;
          
    }

        
    changeText(){
    console.log(this.state.text, String(this.state.text) === "Click to Edit");
    if(String(this.state.text) === "Click to Edit"){
        var text =  "Exit Edit Mode";
        this.setState({ text: text },
        ()=>{
            console.log(this.state.text);
        }); 

    }
    else{
        this.setState({ text:"Click to Edit" });
        document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );

    }  
    this.toggle(); 
    } 


    animate() {
        // console.log("this...", this);
        requestAnimationFrame( this.animate );
        
        this.renderer.render( this.scene, this.camera );
        this.controls.update();
    }
    
    
    coordsToIndex(coords){
        let x = coords.x;
        let y = coords.y;
        let z = coords.z;
        let index = Math.abs(x - this.start_index.x) + this.cubeDims*Math.abs(y - this.start_index.y) + Math.pow(this.cubeDims,2)*Math.abs(z - this.start_index.z);
        //console.log("index>>>>", index, this.cubeDims);
        return index
    }

    
    onDocumentMouseDown( event ) 
    {
        event.preventDefault();   
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        this.ray.setFromCamera( this.mouse, this.camera );
        var intersects = this.ray.intersectObjects( this.scene.children, true );
        this.intersects = intersects;
        //console.log(this.intersects);
        if(this.intersects.length > 0){
            console.log(this.intersects[0]);
            var intersectIndex = -1;
            for(var i=0;i<this.intersects.length;i++){
                if(this.intersects[i].object.type === "Mesh"){
                    intersectIndex = i;
                    break;
                }
            }
            if(intersectIndex === -1) return
            //console.log(this.intersects[intersectIndex]);
            console.log(this.intersects[intersectIndex]);
            console.log("vertex",this.intersects[intersectIndex].face.vertex);
            // console.log("name:::", this.intersects[intersectIndex].face.name);
            // intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
            let faceIndex = this.intersects[intersectIndex].faceIndex;
            let position = new THREE.Vector3();
            position = this.intersects[intersectIndex].object.position;
            let ind = this.coordsToIndex(position);
            // console.log("ind...", ind);
            let normal = new THREE.Vector3();
            normal = this.intersects[intersectIndex].face.normal;

            let offsetX, offsetY, offsetZ = 0;
            let geoX, geoY, geoZ = 0;
            
            if( this.intersects[intersectIndex].face.name === this.START || this.intersects[intersectIndex].face.name === this.END){
                console.log("worked");
                if(this.isEdit){
                    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
                    if(this.intersects[intersectIndex].face.name === this.START){
                        this.startOrEnd = 1;
                        this.hoverStartColor = new THREE.Color(0xe84735);
                        this.hoverUseColor = this.hoverStartColor;
                    }
                    else if(this.intersects[intersectIndex].face.name === this.END){
                        this.startOrEnd = 0;
                        this.hoverEndColor = new THREE.Color(0x74d486);
                        this.hoverUseColor = this.hoverEndColor;
                    }
                }
                else{
                    document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );

                }
            }
            else if(this.isEdit){
                var index = this.intersects[intersectIndex].faceIndex;
                console.log("changing to::::", intersects[intersectIndex]);
                if(this.intersects[intersectIndex].object.name != this.OBSTACLE){
                    if(this.startOrEnd === 1 && this.intersects[intersectIndex].object.geometry.faces[index].name !== this.END){
                        var rPos = this.cubes[this.coordsToIndex(this.initialStartCoord)].position;
                        this.removeStartingPoint(rPos.x, rPos.y, rPos.z, this.initialSFaceIndex);
                        this.initialSFaceIndex = index;
                        var pos = this.intersects[intersectIndex].object.position;
                        this.STARTING_POINT = this.coordsToIndex(new THREE.Vector3(pos.x, pos.y, pos.z))
                        this.createStartingPoint(pos.x, pos.y, pos.z, this.initialSFaceIndex);
                    }
                    else if(this.startOrEnd === 0 && this.intersects[intersectIndex].object.geometry.faces[index].name !== this.START){
                        var rPos = this.cubes[this.coordsToIndex(this.initialEndCoord)].position;
                        this.removeEndingPoint(rPos.x, rPos.y, rPos.z, this.initialEFaceIndex);
                        this.initialEFaceIndex = index
                        var pos = this.intersects[intersectIndex].object.position;
                        this.ENDING_POINT = this.coordsToIndex(new THREE.Vector3(pos.x, pos.y, pos.z))
                        this.createEndingPoint(pos.x, pos.y, pos.z, this.initialEFaceIndex);
                    }
                }
                document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
            }
            else if(this.intersects[intersectIndex].object.name !== "obstacle"){
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
                    this.createObstacle(geoX,geoY,geoZ,offsetX,offsetY,offsetZ,intersectIndex,faceIndex);
            }        
            else{
                this.removeObstacle(intersectIndex);
            }
        }
    }


    onDocumentMouseMove(event){
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.ray.setFromCamera( this.mouse, this.camera );
        this.intersects = this.ray.intersectObjects( this.scene.children, true );
        this.intersects = this.ray.intersectObjects(this.scene.children);
        if(this.intersects.length > 0){
            var intersectIndex = -1;
            for(var i=0;i<this.intersects.length;i++){
                if(this.intersects[i].object.type === "Mesh"){
                    intersectIndex = i;
                    break;
                }
            }
            if(intersectIndex === -1) return
            if (this.intersects[intersectIndex] != this.INTERSECTED )//|| this.intersects[0].face ) 
		    {
                if (this.INTERSECTED) {
                    console.log("removing from inside",this.INTERSECTED.face.name);
                    if( (this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].name !== this.START && this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].name !== this.END)
                         && this.INTERSECTED.object.name != this.OBSTACLE){
                        this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].color = this.INTERSECTED.currentColor;
                        if(this.faceIndex % 2 === 0){
                            this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex+1)].color = this.INTERSECTED.currentColor;
                        }
                        else{
                            this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex-1)].color = this.INTERSECTED.currentColor;
                        }
                        this.INTERSECTED.object.geometry.colorsNeedUpdate = true;
                        this.INTERSECTED.object.geometry.elementsNeedUpdate = true;
                    }
                }
                
                
                this.INTERSECTED = this.intersects[intersectIndex];
                let faceIndex = this.INTERSECTED.faceIndex;  
                this.faceIndex = faceIndex;
                this.INTERSECTED.currentColor = this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].color;
                console.log("intersect", this.INTERSECTED);
                console.log("hover", this.intersects[intersectIndex].object.geometry.faces[parseInt(this.faceIndex)].name);
                if(this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].name !== this.START && this.INTERSECTED.object.geometry.faces[parseInt(faceIndex)].name !== this.END
                && this.INTERSECTED.object.name != this.OBSTACLE){
                    helper.setFaceColor(this.INTERSECTED.object.geometry, this.hoverUseColor, this.faceIndex);
                }
            }
        } 
        else {
            if (this.INTERSECTED) {
                console.log("removing from outside");
                if( (this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].name !== this.START && this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].name !== this.END
                && this.INTERSECTED.object.name != this.OBSTACLE)){
                this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex)].color = this.INTERSECTED.currentColor;
                    if(this.faceIndex%2 === 0){
                        this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex+1)].color = this.INTERSECTED.currentColor;
                    }
                    else{
                        this.INTERSECTED.object.geometry.faces[parseInt(this.faceIndex-1)].color = this.INTERSECTED.currentColor;
                    }
                    this.INTERSECTED.object.geometry.colorsNeedUpdate = true;
                    this.INTERSECTED.object.geometry.elementsNeedUpdate = true;
                }
            }
            
            this.INTERSECTED = null;
            }
    }


    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }    


    toggle(){
        console.log("clicked....");
        if(this.controls.enabled === false){
            this.controls.enabled = true;
            this.isEdit = false;
        }
        else{
            this.controls.enabled = false;
            this.isEdit = true;
        }
    }
    

    createStartingPoint(x,y,z, faceIndex){
        console.log("starting poijt is:::", this.coordsToIndex(new THREE.Vector3(x,y,z)));
        this.source = this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex].vertex;
        var color = new THREE.Color( 0xff0000 );
        this.initialStartCoord = {x,y,z};
        helper.setFaceColor(this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry, color, faceIndex);
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex].name = this.START;
        if(faceIndex%2 === 0){
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex+1].name = this.START;
        }
        else{
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex-1].name = this.START;
        }
    }
    
    
    createEndingPoint(x,y,z, faceIndex){
        console.log("ending poijt is:::", this.coordsToIndex(new THREE.Vector3(x,y,z)));
        this.target = this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex].vertex;
        this.initialEndCoord = {x,y,z};
        var color = new THREE.Color( 0x04b31b );
        helper.setFaceColor(this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry, color, faceIndex);
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex].name = this.END;
        if(faceIndex%2 === 0){
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex+1].name = this.END;
        }
        else{
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex-1].name = this.END;
        }
    }

    removeStartingPoint(x,y,z, faceIndex){
        console.log("removed starting poijt is:::", this.coordsToIndex(new THREE.Vector3(x,y,z)));
        helper.setFaceColor(this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry, this.mazeColor, faceIndex);
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex].name = "";
        if(faceIndex%2 === 0){
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex+1].name = "";
        }
        else{
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex-1].name = "";
        }
    }


    removeEndingPoint(x,y,z, faceIndex){
        console.log("removed ending poijt is:::", this.coordsToIndex(new THREE.Vector3(x,y,z)));
        helper.setFaceColor(this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry, this.mazeColor, faceIndex);
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex].name = "";
        if(faceIndex%2 === 0){
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex+1].name = "";
        }
        else{
            this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[faceIndex-1].name = "";
        }
    }


    createObstacle(geoX,geoY,geoZ,offsetX,offsetY,offsetZ,intersectIndex,faceIndex){
        console.log("creating obstacle");
        let pos = this.intersects[intersectIndex].object.position;
        let geometry = new THREE.BoxGeometry(geoX,geoY,geoZ);
        let material;
        const loader = new THREE.TextureLoader(new THREE.LoadingManager());
        let texture = loader.load(
            require("../assets/images/building.jpg"));
        
        material = new THREE.MeshBasicMaterial({
            map: texture
    
        });
        // const material = new THREE.MeshPhongMaterial({
        //     color: 0x00f00f,
        //     vertexColors: THREE.FaceColors 
        // });
        let obstacle = new THREE.Mesh(geometry, material);
        obstacle.position.set(pos.x + offsetX, pos.y + offsetY, pos.z + offsetZ);
        obstacle.name = this.OBSTACLE;
        // obstacle.vertex = this.vertices[];
        // groupCubes.add(cubes[cubeNum]);
        obstacle.castShadow = true;
        obstacle.receiveShadow = true;
        this.scene.add(obstacle); 
        obstacle.position.setY = 25;
        new TWEEN.Tween(obstacle.position)
                        .to({ y: 10}, 2000)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start();
        this.intersects[intersectIndex].object.geometry.faces[faceIndex].isAWall = true;
        let vertexIndex = this.faceIndexAndCubeIndexToVertex(faceIndex, this.coordsToIndex(new THREE.Vector3(pos.x,pos.y,pos.z)));
        obstacle.vertexIndex = vertexIndex;
        if(faceIndex%2===0){
            this.intersects[intersectIndex].object.geometry.faces[faceIndex+1].isAWall = true;
        }
        else{
            this.intersects[intersectIndex].object.geometry.faces[faceIndex-1].isAWall = true;
        }
    }


    removeObstacle(intersectIndex){
        console.log("remving obstacle", this.intersects[intersectIndex].object.uuid);
        let p = this.intersects[intersectIndex].object.position;
        let vertexIndex = this.intersects[intersectIndex].object.vertexIndex;
        console.log("vertexIndex...", vertexIndex);
        this.cubes[this.vertices[vertexIndex][3]].geometry.faces[this.vertices[vertexIndex][4]].isAWall = false;

        let uuid = this.intersects[intersectIndex].object.uuid;
        const object = this.scene.getObjectByProperty( 'uuid', uuid );
        console.log(object);
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove( object );
    }


    getVertices(){
        let vertex = 0;
        let vertices = {};
        for (let z = this.cubeIndex; z >= -this.cubeIndex; z--) {
            for (let y = -this.cubeIndex; y <= this.cubeIndex; y ++) {
                for (let x = this.cubeIndex; x >= -this.cubeIndex; x --) {
                    var noOfFaces = helper.checkHowManyFaces(x,y,z, this.cubeIndex);
                    if(noOfFaces!=0){
                        var index = this.coordsToIndex(new THREE.Vector3(x,y,z));
                        var map = cubesToFaces[index];
                        for(var i = 0; i < noOfFaces; i++){
                            //console.log(map[i]);
                            //console.log(vertex,x,y,z);
                            this.cubes[index].geometry.faces[map[i]].vertex = vertex;
                            this.cubes[index].geometry.faces[map[i]+1].vertex = vertex;
                            
                            vertices[vertex] = [x,y,z,index, map[i]];
                            vertex += 1;
                        } 
                    }
                }
            }
        }
        this.vertices = vertices;
    }

    createGraph(){
        var length = Object.keys(this.vertices).length;
        var graph = new Graph({length: length, vertices: this.vertices, cubeIndex: this.cubeIndex});
        console.log(this.vertices);
        for(let key in this.vertices){
            graph.addVertex(key);
        }
        let wallNodes = [];
        for(let edge in edgesMapping){
            let e = edgesMapping[edge];
            let index = this.vertices[edge][3];
            if(this.cubes[index].geometry.faces[this.vertices[edge][4]].isAWall === true){
                wallNodes.push(parseInt(edge));
            }
            
        }
        console.log("walls", wallNodes);
        for(let edge in edgesMapping){
            let e = edgesMapping[edge];
            let index = this.vertices[edge][3];
            if(this.cubes[index].geometry.faces[this.vertices[edge][4]].isAWall === true){
               continue;
            }
            for(let i = 0; i<4; i++){
                if(!wallNodes.includes(e[i]))
                {
                    graph.addEdge(edge, e[i]);
                }
            }
            
        }
            
        // graph.printGraph();
        if(this.algo === 0){
            alert("Please select an algorithm");
            return;
        }
        let values;
        console.log("came here", this.algo);
        switch(parseInt(this.algo)){
            case 1:
                 console.log("came here");
                 values = graph.bfs(this.source, this.target); break;
            case 2:
                 values = graph.dfs(this.source, this.target); break;
            case 3:
                 values = graph.dijkastra(this.source, this.target); break;
            case 4:
                 values = graph.a_star(this.source, this.target); break;
            case 5:
                 values = graph.bidirectional_bfs(this.source, this.target); break;

        }
        // let values = graph.bfs(this.source, this.target);
        let visitedNodesInOrder = values[0];
        let path = values[1];
        console.log("path is...", path);
        console.log("nodes...", visitedNodesInOrder);
        this.animateVisitedNodes(visitedNodesInOrder, path);
    }

    animateVisitedNodes(nodes, path){
        for(let i = 0 ; i<= nodes.length-1; i++){
            if(i === nodes.length-1){
                setTimeout(()=>{
                    this.animateShortestpath(path.reverse());
                },this.delay*i);
                return;
            }
            setTimeout(()=>{
                let v = nodes[i];
                helper.setFaceColor(this.cubes[this.coordsToIndex(new THREE.Vector3(this.vertices[v][0], this.vertices[v][1], this.vertices[v][2]))].geometry,
                         new THREE.Color(0x88ebe5), this.vertices[v][4]);
            },this.delay*i);
        } 
    }

    animateShortestpath(nodes){
        for(let i = 1 ; i< nodes.length; i++){
            setTimeout(()=>{
                let v = nodes[i];
                helper.setFaceColor(this.cubes[this.coordsToIndex(new THREE.Vector3(this.vertices[v][0], this.vertices[v][1], this.vertices[v][2]))].geometry,
                         new THREE.Color(0x7532a8), this.vertices[v][4]);
            },this.delay*i);
        }
    }


    faceIndexAndCubeIndexToVertex(faceIndex, cubeIndex){
        for(let v in this.vertices){
            if(this.vertices[v][3] === cubeIndex){
                if(this.vertices[v][4] === faceIndex)
                    return v;
                if(faceIndex % 2 == 0){
                    if(this.vertices[v][4] === faceIndex+1)
                        return v;
                }
                else{
                    if(this.vertices[v][4] === faceIndex-1)
                        return v;
                }
            }
        }
        return -1;
    }


    clearWalls(){
        for(let v in this.vertices){
            this.cubes[this.vertices[v][3]].geometry.faces[this.vertices[v][4]].isAWall = false;
        }
        let obstacles = []
        this.scene.traverse((node) => {
            if(node instanceof THREE.Mesh){
                if(node.name === this.OBSTACLE){
                    obstacles.push(node);
                }
            }
        });
        for(var i =0; i < obstacles.length; i++){
            let uuid = obstacles[i].uuid;
            const object = this.scene.getObjectByProperty( 'uuid', uuid );
            object.geometry.dispose();
            object.material.dispose();
            this.scene.remove( object );
        }
    }


    clearPath(){
        for(let v in this.vertices){
            helper.setFaceColor(this.cubes[this.vertices[v][3]].geometry, this.mazeColor, this.vertices[v][4]);
        }
        for (let z = this.cubeIndex; z >= -this.cubeIndex; z--) {
            for (let y = -this.cubeIndex; y <= this.cubeIndex; y ++) {
                for (let x = this.cubeIndex; x >= -this.cubeIndex; x --) {
                    this.cubePositions.push([x, y, z]);
                    if((this.coordsToIndex(new THREE.Vector3(x,y,z))) === this.ENDING_POINT)
                    {
                        this.createEndingPoint(x,y,z,this.initialEFaceIndex);
                    }
                    if((this.coordsToIndex(new THREE.Vector3(x,y,z))) === this.STARTING_POINT)
                    {
                        this.createStartingPoint(x,y,z,this.initialSFaceIndex);
                    }
                }
            }
        }
    }

    setAlgorithm(evt){
        this.algo = evt; 
        console.log(this.algo);
    }

    setDelay(delay){console.log(delay);
        switch(parseInt(delay)){
            case 1:
                this.delay = 1000;
                break;
            case 2:
                this.delay = 500;
                break;
            case 3:
                this.delay = 100;
                break;
            case 4:
                this.delay = 20
                break;
            case 5:
                this.delay = 1;
                break;
        }
        console.log(this.delay);
    }
    

    render() {
        const { text } = this.state
        return (
            <div className="cont" ref={(mount) => { this.mount = mount }}>
                <Button id="edit" variant="primary" onClick={this.changeText}>{text}</Button>
                <Button id="visualize" variant="success" onClick={this.createGraph.bind(this)}>Start Visualization</Button>
                <Button id="clearWalls" variant="primary" onClick={this.clearWalls}>Clear Walls</Button>
                <Button id="clearPath" variant="primary" onClick={this.clearPath}>Clear Path</Button>
                <DropdownButton id="dropdown-basic-button" title="Choose Algorithm" style={{
                    position: "absolute",
                    top: "40%"
                }} onSelect={this.setAlgorithm}>
                    <Dropdown.Item eventKey="1" >Breadth First Search</Dropdown.Item>
                    <Dropdown.Item eventKey="2" >Depth First Search</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Dijkastra</Dropdown.Item>
                    <Dropdown.Item eventKey="4">A* Search</Dropdown.Item>
                    <Dropdown.Item eventKey="5">Bidirectional BFS</Dropdown.Item>
                </DropdownButton>
                <DropdownButton id="dropdown-basic-button" title="Choose Speed" style={{
                    position: "absolute",
                    top: "50%"
                }} onSelect={this.setDelay}>
                    <Dropdown.Item eventKey="1" >Very Slow</Dropdown.Item>
                    <Dropdown.Item eventKey="2" >Slow</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Normal</Dropdown.Item>
                    <Dropdown.Item eventKey="4">Fast</Dropdown.Item>
                    <Dropdown.Item eventKey="5">Superfast</Dropdown.Item>
                </DropdownButton>
            </div>
        );
        }
 
}