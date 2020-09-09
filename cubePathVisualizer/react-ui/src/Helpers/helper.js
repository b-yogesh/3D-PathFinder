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