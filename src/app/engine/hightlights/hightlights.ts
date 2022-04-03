import { NgZone } from "@angular/core";
import { Vector3 } from "three";
import { animateCamera } from "../animations/cameraAnimations";
import { floorSlideUp } from "../animations/floorsAnimations"; 
import * as TWEEN from '@tweenjs/tween.js';
export class Hightlights { 
    public constructor(public scene, public engServ) { 

    } 

    flatClick (itersectionObj) {  
        let item = itersectionObj.object;
        this.scene.userData.flat = item;
        this.scene.userData.flatOpen = true; 
        if (this.scene.userData.activeFlat) {
            const activeFlatIntersectionObj = this.scene.userData.activeFlat;
            const item = activeFlatIntersectionObj.object; 
            if (item != itersectionObj.object) {
                item.userData.hoverOut(activeFlatIntersectionObj, true);
            }            
        }
        this.scene.userData.activeFlat = itersectionObj;   
        let floors = this.scene.userData.buildings[0].floors; 
        let floorId = Number(itersectionObj.object.parent.name.replace('F_', '')); 
        if (floors) {  
          floors.reverse().forEach((floor,index)=>{  
            if (floorId < floor.floor.id) {
                if (floor.show) {
                    floorSlideUp(floor, this.engServ, { 
                        multiply : floors.length - index, 
                        easing : TWEEN.Easing.Cubic.InOut
                    });  
                }
            }
          });          
          this.updateHightlightsToIntersectionList ();
          
          let flatPosition = itersectionObj.object.getWorldPosition(new Vector3());  
          animateCamera(this.engServ,{
            positionY : flatPosition.y,
            duration: 1000,
            zoom : 50,
            rotationX : -0.83,
            easing: TWEEN.Easing.Sinusoidal.Out
          });
        };
    }


    getMaterialFromList (materialName) {
        let scene = this.scene;
        if (scene.userData.materialsList) {
          if (scene.userData.materialsList[materialName]) {
            return scene.userData.materialsList[materialName];
          }
        }
        return false;
    }

    flatHoverOut (itersectionObj, forceHoverOut?)  { 
        const item = itersectionObj.object;
        let activeFlatItem = false;
        const activeFlat =  this.scene.userData.activeFlat;

        if (!forceHoverOut) {
            if (activeFlat) {
                activeFlatItem = activeFlat.object;
            }
        } 
        if (item != activeFlatItem) {
            item.material = this.getMaterialFromList(item.userData.baseMaterial); 
            item.visible = false;
        }
    }
    flatHover (itersectionObj) {
        let scene =  this.scene;
        let item = itersectionObj.object;
        item.userData.baseMaterialName = item.material.name;              
        item.material = item.userData.hoverMaterial;
        item.visible = true;
        scene.userData.lastHoverObject = itersectionObj;  
        scene.userData.lastHovered = item.name;                            
        scene.userData.hoveredAny = true; 
    }

    updateHightlightsToIntersectionList () {
        const currentBuilding = this.scene.userData.buildings[0];
        const floors = currentBuilding.floors;
        let hightlightsList = [];
        floors.forEach((floor)=>{ 
            if (floor.show) {
                floor.hightlights.forEach(mesh => {
                    hightlightsList.push(mesh); 
                });
            }
        });
        this.scene.userData.objectsForRaycast = hightlightsList; 
    }
}
