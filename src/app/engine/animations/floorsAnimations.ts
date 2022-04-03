import { animationFrameScheduler } from "rxjs";
import { Matrix4, PositionalAudio, Quaternion, Vector3 } from "three";

export function floorSlideUp (floorObj, engServ, customOptions?) { 
    floorObj.show = false;
    const TWEEN = engServ.tween;
    const object = floorObj.object;
    const axis = floorObj.floor.axis;
    const type = floorObj.floor.type;
    let from;
    let index;
    if (type === 'instance') {
        index = floorObj.floor.index;
    }
    let startPositionKey = 'startOutPosition';
    if (type === 'instance') {
        startPositionKey = startPositionKey + index;
    }
    if (object.userData[startPositionKey] === undefined) {
        if (type == 'mesh') {
            from = object.position[axis];
        } 
        if (type === 'instance') { 
            const matrix = new Matrix4();
            object.getMatrixAt(index, matrix);
            from = new Vector3().setFromMatrixPosition( matrix)[axis]; 
        }
        object.userData[startPositionKey] = from;
    } else {
        from = object.userData[startPositionKey]; 
    }  
    let options = {
        delay : 0,
        duration : 2000,
        easing : TWEEN.Easing.Sinusoidal.InOut,
        multiply : 1,
    };
    if (customOptions) {
        Object.keys(customOptions).forEach((key)=>{  
            options[key] = customOptions[key];
        });  
    }    
    const to = from + 10000 + 3000 * options.multiply;  
    let animation = new TWEEN.Tween({position: from}).to({position: to}, options.duration);
    animation.onUpdate( (event) => { 
        if (type === 'mesh') {
            object.position[axis] = event.position;  
        }
        if (type === 'instance') {
            const matrix = new Matrix4();            
            const position = new Vector3();
            position[axis] = event.position; 
            matrix.setPosition(position);
            object.setMatrixAt(index, matrix);
            object.instanceMatrix.needsUpdate = true;
        }
    });
    animation.onComplete(()=>{
        if (type === 'mesh') {
            object.scale.set(0,0,0);
        }
        if (type === 'instance') {
            const matrix = new Matrix4();    
            matrix.scale(new Vector3(0,0,0));
            object.setMatrixAt(index, matrix);
            object.instanceMatrix.needsUpdate = true;
        }
    });
    animation.delay(options.delay);
    animation.easing(TWEEN.Easing.Sinusoidal.InOut);
    TWEEN.add(animation);
    animation.start();
}
export function floorOutScale (floorObj, engServ, customOptions?) {
    const TWEEN = engServ.tween;
    const object = floorObj.object;
    const axis = floorObj.floor.axis;
    const type = floorObj.floor.type;
    let from;
    let index;
    if (type === 'instance') {
        index = floorObj.floor.index;
    }
    let startPositionKey = 'startOutPosition';
    if (type === 'instance') {
        startPositionKey = startPositionKey + index;
    }
    if (object.userData[startPositionKey] === undefined) {
        if (type == 'mesh') {
            from = object.position[axis];
        } 
        if (type === 'instance') { 
            const matrix = new Matrix4();
            object.getMatrixAt(index, matrix);
            from = new Vector3().setFromMatrixPosition( matrix)[axis]; 
        }
        object.userData[startPositionKey] = from;
    } else {
        from = object.userData[startPositionKey]; 
    }  
    const to = from + 300; 
    let options = {
        delay : 0,
        duration : 2000,
        easing : TWEEN.Easing.Sinusoidal.InOut
    };
    if (customOptions) {
        Object.keys(customOptions).forEach((key)=>{  
            options[key] = customOptions[key];
        });  
    }
    let animation = new TWEEN.Tween({position: from, scale : 1}).to({position: to, scale : 0}, options.duration);
    animation.onUpdate( (event) => { 
        if (type === 'mesh') {
            object.position[axis] = event.position;  
            object.scale[axis] = event.scale;
        }
        if (type === 'instance') {
            const matrix = new Matrix4();            
            const position = new Vector3();
            const matrixPosition = new Vector3();
            const matrixScale = new Vector3();
            const matrixRotation = new Quaternion(); 
            matrix.decompose(matrixPosition, matrixRotation, matrixScale);            
            matrixPosition[axis] = event.position;
            matrixScale[axis] = event.scale;
            matrix.compose(matrixPosition, matrixRotation, matrixScale); 
            object.setMatrixAt(index, matrix);
            object.instanceMatrix.needsUpdate = true;
        }
    });
    animation.onComplete(()=>{
        if (type === 'instance') {
            const matrix = new Matrix4();            
            const position = new Vector3();
            const matrixPosition = new Vector3();
            const matrixScale = new Vector3();
            const matrixRotation = new Quaternion(); 
            matrix.decompose(matrixPosition, matrixRotation, matrixScale);   
            matrixScale.set(0,0,0);      
            matrix.compose(matrixPosition, matrixRotation, matrixScale); 
            object.setMatrixAt(index, matrix);
            object.instanceMatrix.needsUpdate = true;
        }
    }); 
    animation.delay(options.delay);
    animation.easing(TWEEN.Easing.Sinusoidal.InOut);
    TWEEN.add(animation);
    animation.start();
}
