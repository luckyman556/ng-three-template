import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import {objects3d} from 'src/app/settings/objects3d';

@Injectable({
  providedIn: 'root'
})
export class Objects3dService {
  objects3dData:any = objects3d;
  loaderFBX = new FBXLoader();  
  constructor() { 

  }
  addObjectsFromSettings (scene) {
    this.objects3dData.forEach((object3d, index)=>{  
      if (object3d.onScene) {
        this.add3dObjectFromUI(scene, this.objects3dData[index]); 
      }
    });
  }
  add3dObjectFromUI (scene, formGroup, objectAsync?) { 
    if (scene.getObjectByName(formGroup.name)){
      objectAsync.next({
        object : scene.getObjectByName(formGroup.name)
      });
    }  else {

      if (formGroup.type === 'fbx') {
        this.addFbxObjectOnScene (scene, formGroup, objectAsync); 
      }
    }
  }
  get3dObjectMaterialsList (object):Array<{}> {
    let materialsList = [];
    object.traverse((item)=>{
      let material = item.material;
      if (material) {
        if (Array.isArray(material)) {
          material.forEach(materialInArray => {
            if (!this.checkMaterialAppearanceInList (materialInArray, materialsList)) {
              materialsList.push(materialInArray);
            }
          });
        } else {
          if (!this.checkMaterialAppearanceInList (material, materialsList)) {
            materialsList.push(material);
          }
        }
      }
    });  
    return materialsList;
  }
  checkMaterialAppearanceInList (material, list):boolean {
    let materialAppearence = false;
    let findResult = list.find((element, index, array) => {
      if (material.id === element.id) {
        return true;
      } else {
        return false;
      }
    }); 
    if (findResult) {
      materialAppearence = true;
    }
    
    return materialAppearence;
  }
  addFbxObjectOnScene (scene, formGroup, objectAsync?) {
    const url = 'http://carousel.lc/assets/' + formGroup.folder + '/' + formGroup.filename + '.fbx'; 
    this.loaderFBX.load(url,  (object3d) => { 
      object3d.position.set(formGroup.position[0],formGroup.position[1],formGroup.position[2]);
      object3d.rotation.set(formGroup.rotation[0],formGroup.rotation[1],formGroup.rotation[2]);
      object3d.scale.set(formGroup.scale[0],formGroup.scale[1],formGroup.scale[2]);
      object3d.name = formGroup.name;
      scene.add(object3d); 
      if (objectAsync) {
      objectAsync.next({
          object : object3d
        });
      } 
    }, 
    undefined,
    (error) => {
      console.log(error);
    }
    );
  }
}
