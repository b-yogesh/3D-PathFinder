import React, {Component} from "react";
import ReactDOM from "react-dom";
import './tesseract.css';
import * as THREE from "three";
import * as OrbitControls from "three-orbitcontrols";
import * as TWEEN from "tween";

export default class Tesseract extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.createEndingPoint = this.createEndingPoint.bind(this);
        this.createStartingPoint = this.createStartingPoint.bind(this);
        this.coordsToIndex = this.coordsToIndex.bind(this);
    }
    
    componentDidMount(){

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 
            75, 
            window.innerWidth / window.innerHeight, 
        0.1, 
        1000 
        );

        const config = {antialias: true}
    let renderer = new THREE.WebGLRenderer(config);
    this.renderer = renderer;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor( 0x545454, 1 );
    this.mount.appendChild( this.renderer.domElement );
    this.scene = scene;
    this.scene.background = new THREE.Color(0xbbd6ff);
	this.scene.fog = new THREE.Fog(0xffffff, 0, 750);
    

    var spotLight = new THREE.DirectionalLight( {color:0xffffff});
    spotLight.position.set( -1, 2, 3 );
    // scene.add( spotLight );

    var spotLight2 = new THREE.DirectionalLight( {color:0xffffff});
    spotLight2.position.set( 1, -2, -3 );
    // scene.add( spotLight2 );

    var light = new THREE.AmbientLight( {color:0x111111});
    // scene.add( light );
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(-1, 2, 4);
    // camera.add(light);
    
    var light = new THREE.PointLight(0xffffff);
    this.light = light;
	this.light.position.set(-15, 20, 30);
    this.scene.add(light);
    
    this.light = new THREE.PointLight(0xffffff);
	this.light.position.set(15, -20, -30);
	this.scene.add(light);

    const groupCubes = new THREE.Group();
    const cubes = {};
    this.cubes = cubes;
    var floorMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide ,color:0xaf006f});
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -2.5;
	floor.rotation.x = Math.PI / 2;
	// scene.add(floor);
    
    let cubeDims = 5
    this.cubeDims = cubeDims;
    for(let cubeNum = 0; cubeNum < Math.pow(cubeDims, 3); cubeNum++){
        let geometry = new THREE.BoxGeometry(0.99,0.99,0.99);
        const material = new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors 
            });
            this.cubes[cubeNum] = new THREE.Mesh(geometry, material);
        this.cubes[cubeNum].name = String(cubeNum);
        // groupCubes.add(cubes[cubeNum]);
        this.scene.add(cubes[cubeNum])
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
    for (let z = this.cubeIndex; z >= -this.cubeIndex; z--) {
        for (let y = -this.cubeIndex; y <= this.cubeIndex; y ++) {
            for (let x = this.cubeIndex; x >= -this.cubeIndex; x --) {
                this.cubePositions.push([x, y, z]);
                if((this.coordsToIndex(new THREE.Vector3(x,y,z))) === ENDING_POINT)
                {
                    this.createEndingPoint(x,y,z);
                }
                if((this.coordsToIndex(new THREE.Vector3(x,y,z))) === STARTING_POINT)
                {
                    this.createStartingPoint(x,y,z);
                }
            }
        }
    }
    
    for(let cube in cubes){
        this.cubes[cube].position.set(...this.cubePositions[cube])
    }
    
    
    
    
    
    
    
    // scene.add(groupCubes);
    var controls = new OrbitControls( camera, renderer.domElement );
    
    this.controls = controls;
    this.camera = camera;
    this.camera.position.z = 8;
    this.camera.position.y = 8;
    this.camera.position.x = 8;
    this.controls.update();
    document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
    
    var mouse = new THREE.Vector2();
    this.mouse = mouse;
    //this.animate = animate;
    this.animate();
    console.log("thisq....", this);
    var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
    var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
    this.ray = ray;
}


animate() {
    // console.log("this...", this);
        requestAnimationFrame( this.animate );
        
        this.renderer.render( this.scene, this.camera );
        this.controls.update();
    }
    // targetList.push(groupCubes);
    
    // projector = new THREE.Raycaster():
    
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
        
        console.log("Click.", this);
        
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        
        
        // projector.unprojectVector( vector, camera );
        
        this.ray.setFromCamera( this.mouse, this.camera );
        var intersects = this.ray.intersectObjects( this.scene.children, true );
        this.intersects = intersects;
        console.log(this.intersects);
        if(this.intersects.length > 0){
            
            console.log(this.intersects[0].object.position);
            console.log("name:::", this.intersects[0].face.name);
            // intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
            let faceIndex = this.intersects[0].faceIndex;
            let position = new THREE.Vector3();
            position = this.intersects[0].object.position;
            let ind = this.coordsToIndex(position);
            console.log("ind...", this.ind);
            let normal = new THREE.Vector3();
            normal = intersects[0].face.normal;

            let offsetX, offsetY, offsetZ = 0;
            let geoX, geoY, geoZ = 0;
            
            if( this.intersects[0].face.name === "ENDING_POINT"){
                console.log("worked");
                return;
            }
            else if( this.intersects[0].face.name === "STARTING_POINT"){
                console.log("worked");
                return;
            }
            else if(this.intersects[0].object.geometry.name !== "obstacle"){
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
                let geometry = new THREE.BoxGeometry(geoX,geoY,geoZ);
                geometry.name = "obstacle";
                const material = new THREE.MeshPhongMaterial({
                    color: 0x00f00f,
                    vertexColors: THREE.FaceColors 
                });
                    let obstacle = new THREE.Mesh(geometry, material);
                    obstacle.position.set(position.x + offsetX, position.y + offsetY, position.z + offsetZ);
                // groupCubes.add(cubes[cubeNum]);
                obstacle.castShadow = true;
                obstacle.receiveShadow = true;
                this.scene.add(obstacle); 
                obstacle.position.setY = 25;
                new TWEEN.Tween(obstacle.position)
                                .to({ y: 10}, 2000)
                                .easing(TWEEN.Easing.Bounce.Out)
                                .start();
                            
        
                // intersects[0].object.geometry.faces[faceIndex].color.setRGB( 54, 25, 45 ); 
                // if(faceIndex === 0 || faceIndex%2 === 0){
                //     intersects[0].object.geometry.faces[faceIndex + 1].color.setRGB( 54, 25, 45 ); 
                // }
                // else{
                //     intersects[0].object.geometry.faces[faceIndex - 1].color.setRGB( 54, 25, 45 ); 
                // }
                // intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
                }
                else{
                    console.log("remving obstacle", intersects[0].object.uuid);
                    let uuid = intersects[0].object.uuid;
                    const object = this.scene.getObjectByProperty( 'uuid', uuid );
                    console.log(object);
                    object.geometry.dispose();
                    object.material.dispose();
                    this.scene.remove( object );
                    
                }
                // intersects[0].object.material.emissive.setHex((0.1 * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
                    // // if there is one (or more) intersections
                    // if ( intersects.length > 0 )
                    // {
                        // 	console.log("Hit @ " + toString( intersects[0].point ) );
                        // 	// change the color of the closest face.
                        // 	intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
                        // 	intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
                        // }
            
        }
    
    }
     toggle(){
        console.log("clicked....");
        if(this.controls.enabled === false){
            this.controls.enabled = true;
        }
        else{
            this.controls.enabled = false;
        }
    }

    //animate();
    //console.log("scene created");
     createStartingPoint(x,y,z){
        console.log("starting poijt is:::", this.coordsToIndex(new THREE.Vector3(x,y,z)));
        var color = new THREE.Color( 0xff0000 );
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4].color = color;
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4+1].color = color; 
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.colorsNeedUpdate = true;
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4].name = "STARTING_POINT";
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4+1].name = "STARTING_POINT";
    }

     createEndingPoint(x,y,z){
        console.log("ending poijt is:::", this.coordsToIndex(new THREE.Vector3(x,y,z)));
        var color = new THREE.Color( 0x294dc4 );
    
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4].color = color;
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4+1].color = color;
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4].name = "ENDING_POINT";
        this.cubes[this.coordsToIndex(new THREE.Vector3(x,y,z))].geometry.faces[4+1].name = "ENDING_POINT";
    }

    render() {
        return (
            <div ref={(mount) => { this.mount = mount }}>
        <button onClick={this.toggle.bind(this)}>Click me</button>
        
            </div>

        );
        }
 
}