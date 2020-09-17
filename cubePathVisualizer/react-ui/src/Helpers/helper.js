

export function setFaceColor(geometry, color, faceIndex){
    console.log("setting face color for index", faceIndex);
    geometry.faces[faceIndex].color = color;
    if(faceIndex%2 === 0){
        geometry.faces[faceIndex+1].color = color;
    }
    else{
        geometry.faces[faceIndex-1].color = color;
    }
    geometry.colorsNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
}

export function coordsToIndex(coords){
    let x = coords.x;
    let y = coords.y;
    let z = coords.z;
    var start_index;
    var cubeDims = 5;
    start_index = {x:Math.floor(cubeDims / 2),y:-Math.floor(cubeDims / 2),z:Math.floor(cubeDims / 2)};
    console.log(start_index);
    let index = Math.abs(x - start_index.x) + cubeDims*Math.abs(y - start_index.y) + Math.pow(cubeDims,2)*Math.abs(z - start_index.z);
    //console.log("index>>>>", index, this.cubeDims);
    return index
}

export function checkHowManyFaces(x,y,z,cubeIndex){
    let faces = 0;
    if(x===cubeIndex || x===-cubeIndex){
        faces += 1;
    }
    if(y===cubeIndex || y === -cubeIndex){
        faces += 1;
    }
    if(z===cubeIndex || z === -cubeIndex){
        faces += 1;
    }
    return faces;
}
