import { NgZone } from "@angular/core";
import { Scene } from "three";

export class Interactions {  
    ngZone:NgZone;
    scene:any;
    public constructor(scene) { 
        this.ngZone = new NgZone({ enableLongStackTrace: false, shouldCoalesceEventChangeDetection: false, shouldCoalesceRunChangeDetection: false });
        this.scene = scene;
    } 
    public click (event) {
         
        this.scene.userData.click = true;        
    }
    public pointerDown (event) {
        
        const scene = this.scene; 
        if (!scene.userData.controllerDisabled) {
            this.ngZone.run(()=>{
                scene.userData.pointerDown = this.eventToVector(event); 
                this.setCurrentPointerPosition(event);
            });
            const innerCube = scene.getObjectByName('innerCube');
            const outerCube = scene.getObjectByName('outerCube');
            const controllerGroup = scene.getObjectByName('controllerGroup');
            if (event.which === 1) {
                scene.userData.dragXMode = 'changePositionY';
            }
            if (event.which === 3) {
                scene.userData.dragXMode = 'changeRotationX';
            } 
            if (innerCube) {            
                scene.userData.startRotationX = innerCube.rotation.x;
                scene.userData.startRotationY = outerCube.rotation.y;
                scene.userData.startPositionY = controllerGroup.position.y;
            }  
        }
    }
    public pointerUp (event) {
        const scene = this.scene;
        if (scene.userData.pointerDown) {
            scene.userData.pointerDown = false;
        }
    }
    public mousemove (event) { 
       this.mousemoveForHover (event);
       this.mousemoveForDrag (event);
    }

    getInteractionType (event) {
        
    }

    mousemoveForDrag (event) {        
        const scene = this.scene;
        if (scene.userData.pointerDown) {
            if (scene.userData.dragXMode === 'changePositionY'){
                this.changePositionY(scene, event);  
            }
            if (scene.userData.dragXMode === 'changeRotationX') {
                this.changeRotationX(scene, event);  
            }
            this.changeRotationY(scene, event);  
        }
    }
    changeRotationY(scene, event) {
        const mod = 0.02;
        const xDiff = scene.userData.pointerDown.x - this.eventToVector(event).x;
        scene.userData.targetRotationY = scene.userData.startRotationY + xDiff * mod;
    }
    changeRotationX (scene, event) {
        const mod = 0.01;
        const yDiff = scene.userData.pointerDown.y - this.eventToVector(event).y;
        scene.userData.targetRotationX = this.rotationXInLimits(scene.userData.startRotationX + yDiff * mod); 
    }
    rotationXInLimits (rotationX) {        
        const scene = this.scene; 
        const MIN = scene.userData.rotationXMin; 
        const MAX = scene.userData.rotationXMax;   
        const parsed = rotationX;
        return Math.min(Math.max(parsed, MIN), MAX);
    }
    changePositionY (scene, event) {
        const mod = 0.1;
        const yDiff = scene.userData.pointerDown.y - this.eventToVector(event).y; 
        scene.userData.targetPositionY = this.positionYInLimits(scene.userData.startPositionY - yDiff * mod); 
    }

    positionYInLimits (positionY) {        
        const scene = this.scene; 
        const MIN = scene.userData.positionYMin; 
        const MAX = scene.userData.positionYMax;   
        const parsed = positionY;
        return Math.min(Math.max(parsed, MIN), MAX);
    }

    mousemoveForHover (event) {
        const scene = this.scene;
        scene.userData.hoveredAny = false; 
        this.setCurrentPointerPosition(event);
        const intersects = scene.userData.intersects;
        const lastHoverObject = scene.userData.lastHoverObject;
        if (lastHoverObject) { 
            const lastObjectId = lastHoverObject.object.ID;
            let intersectsId ='random'; 
            if (intersects[0]) {
                intersectsId = intersects[0].object.ID;
            }           
            if ( lastObjectId !=  intersectsId) {  
                if (lastHoverObject.object.userData.hoverOut) {
                    lastHoverObject.object.userData.hoverOut(lastHoverObject); 
                }
            }
        }
        if (intersects[0]) { 
            const object = intersects[0].object; 
            if(object.userData.hover) { 
                object.userData.hover(intersects[0]);  
            } 

        }  
    }
    setCurrentPointerPosition (event) {
        const scene = this.scene;
        if (scene.userData.pointer) {        
            const x = ( event.clientX / window.innerWidth ) * 2 - 1;
            const y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            this.ngZone.run(()=>{
                scene.userData.pointer.set(x, y);
                scene.userData.pointerPx.set(event.clientX, event.clientY);
            });
        }
    }
    eventToVector (event) { 
        let x = 0,y = 0;
        if (event.changedTouches || event.touches ) {
            if (event.changedTouches) {
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
            } else {
                x = event.touches[0].pageX;
                y = event.touches[0].pageY;
            }
        } else {            
            x = event.pageX;
            y = event.pageY;
        }
        return {
            x : x,
            y : y,
        };  
    }
    mouseWheel (event) {        
        let diff = event.deltaY * 0.05;        
        const scene = this.scene;
        scene.userData.targetZoom = this.zoomInLimits(scene.userData.targetZoom + diff); 
    }
    zoomInLimits (zoom) {        
        const scene = this.scene; 
        const MIN = scene.userData.zoomMin; 
        const MAX = scene.userData.zoomMax;   
        const parsed = zoom;    
        return Math.min(Math.max(parsed, MIN), MAX);
    }

}
