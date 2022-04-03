import { Injectable, NgZone } from "@angular/core";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Scene } from "three";
import { EngineService } from "../services/engine.service";

 
export class Controller { 
    public constructor(public scene) {  

    }  
    

    initController () {        
        this.addControllerGroup();
    } 
    addControllerGroup () {
        const controllerGroup = new Group();   
        controllerGroup.name = 'controllerGroup';      
        this.scene.add(controllerGroup);        
        this.addOuterCube(controllerGroup);
        this.addInnerCube(); 
        this.setCameraLook();
    }
    addOuterCube (controllerGroup) {
        const outerCubeGeometry = new BoxGeometry(0.1,0.1,0.1);
        const outerCubeMaterial = new MeshBasicMaterial( {color: 0x00ff00, transparent : true, opacity : 0.3} );
        const outerCube = new Mesh( outerCubeGeometry, outerCubeMaterial );
        outerCube.name = 'outerCube';
        controllerGroup.add(outerCube);
    }
    addInnerCube () {
        const outerCube = this.scene.getObjectByName('outerCube');
        const innerCubeGeometry = new BoxGeometry(0.1,0.1,0.1);
        const innerCubeMaterial = new MeshBasicMaterial( {color: 'red', transparent : true, opacity : 0.6} );
        const innerCube = new Mesh( innerCubeGeometry, innerCubeMaterial );
        innerCube.name = 'innerCube';
        outerCube.add(innerCube);        
    }
    setCameraLook () {
        const camera = this.scene.getObjectByName('mainCamera');
        const innerCube = this.scene.getObjectByName('innerCube'); 
        if (camera) {
            innerCube.add(camera);
            camera.lookAt(innerCube.position);
        }
    }
    public animateRotationX () {
        const innerCube = this.scene.getObjectByName('innerCube'); 
        if (innerCube) {
            const currentRotationX = innerCube.rotation.x; 
            let targetRotationX = this.scene.userData.targetRotationX;
            if (!targetRotationX) {
                targetRotationX = 0;
            } else {
                targetRotationX = this.scene.userData.targetRotationX;
            }
            const mod = 0.2;
            if (currentRotationX != targetRotationX) {
                const rotationDiff = targetRotationX - currentRotationX;
                const increment = rotationDiff * mod;
                if (Math.abs(increment) > 0.001) {
                    let newRotation = currentRotationX + increment;
                    innerCube.rotation.x = newRotation;
                } else {
                    innerCube.rotation.x = targetRotationX;
                }
            } 
        }
    }
    public setRotationX (rotationX) {        
        const innerCube = this.scene.getObjectByName('innerCube'); 
        this.scene.userData.targetRotationX = rotationX;
        innerCube.rotation.x = rotationX;
    }
    public animatePositionY () {
        const controllerGroup = this.scene.getObjectByName('controllerGroup');
        if (controllerGroup) {
            const currentPositionY = controllerGroup.position.y; 
            let targetPositionY = this.scene.userData.targetPositionY;
            if (!targetPositionY) {
                targetPositionY = 0;
            } else {
                targetPositionY = this.scene.userData.targetPositionY;
            }
            const mod = 0.2;
            if (currentPositionY != targetPositionY) {
                const positionDiff = targetPositionY - currentPositionY;
                const increment = positionDiff * mod;
                if (Math.abs(increment) > 0.001) {
                    let newPosition = currentPositionY + increment;
                    controllerGroup.position.y = newPosition;
                } else {
                    controllerGroup.position.y = targetPositionY;
                }
            } 
        }
    }
    public setPositionY (positionY) {        
        const controllerGroup = this.scene.getObjectByName('controllerGroup');
        this.scene.userData.targetPositionY =  positionY; 
        controllerGroup.position.y = positionY;
    }
    public animateRotationY () {
        const outerCube = this.scene.getObjectByName('outerCube'); 
        if (outerCube) {
            const currentRotationY = outerCube.rotation.y; 
            let targetRotationY = this.scene.userData.targetRotationY;
            if (!targetRotationY) {
                targetRotationY = 0;
            } else {
                targetRotationY = this.scene.userData.targetRotationY;
            }
            const mod = 0.1;
            if (currentRotationY != targetRotationY) {
                const rotationDiff = targetRotationY - currentRotationY;
                const increment = rotationDiff * mod;
                if (Math.abs(increment) > 0.001) {
                    let newRotation = currentRotationY + increment;
                    outerCube.rotation.y = newRotation;
                } else {
                    outerCube.rotation.y = targetRotationY;
                }
            } 
        }
    }
    public seRotationY (rotationY) {
        const outerCube = this.scene.getObjectByName('outerCube'); 
        this.scene.userData.targetRotationY = rotationY;
        outerCube.rotation.y = rotationY;
    }
    public animateZoom () {
        const camera = this.scene.getObjectByName('mainCamera'); 
        if (camera) {
            const currentZoom = camera.position.z; 
            let targetZoom = this.scene.userData.targetZoom;
            if (!targetZoom) {
                targetZoom = 0;
            } else {
                targetZoom = this.scene.userData.targetZoom;
            }
            const mod = 0.1;
            if (currentZoom != targetZoom) {
                const zoomDiff = targetZoom - currentZoom;
                const increment = zoomDiff * mod;
                if (Math.abs(increment) > 0.001) {
                    let newZoom = currentZoom + increment;
                    camera.position.z = newZoom;
                } else {
                    camera.position.z = targetZoom;
                }
            } 
        }
    }
    setZoom (zoom) {
        const camera = this.scene.getObjectByName('mainCamera'); 
        this.scene.userData.targetZoom = zoom;
        camera.position.z = zoom;
    }
}