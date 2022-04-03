import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EngineService } from 'src/app/engine/services/engine.service';
import { Objects3dService } from 'src/app/engine/services/objects3d.service';
import { Group } from 'three';

@Component({
  selector: 'app-object3d-edit',
  templateUrl: './object3d-edit.component.html',
  styleUrls: ['./object3d-edit.component.scss']
})
export class Object3dEditComponent implements OnInit {
  onScene:boolean = false;  
  attached:boolean = false;
  objectForm:FormGroup;
  objectGroup:Group;
  materials = [];
  objectsTypes = [
    'fbx',
    'texture'
 ];
  constructor(public engServ: EngineService, public objects3dService : Objects3dService, public fb: FormBuilder) { }
  @Input() object3D;
  ngOnInit(): void {
    this.makeForm () ;
    if (this.object3D.value.onScene) {
      this.addObjectOnScene (this.object3D);
    } 
  }
  setFormPropertiesFromObject (object) {
    const form = this.objectForm;
    let position = object.position;
    let rotation = object.rotation;
    let scale = object.scale;
    form.controls.positionX.setValue(position.x);
    form.controls.positionY.setValue(position.y);
    form.controls.positionZ.setValue(position.z);
    form.controls.scaleX.setValue(scale.x);
    form.controls.scaleY.setValue(scale.y);
    form.controls.scaleZ.setValue(scale.z); 
    form.controls.rotationX.setValue(rotation.x); 
    form.controls.rotationY.setValue(rotation.y); 
    form.controls.rotationZ.setValue(rotation.z);  
    this.setFormGroupData();
  }
  makeForm () {
    this.objectForm = this.fb.group({
      positionX : 0,
      positionY : 0,
      positionZ : 0,
      positionStep : 0.01,
      scaleX : 0,
      scaleY : 0,
      scaleZ : 0,
      scaleStep : 0.01,
      rotationX : 0,
      rotationY : 0,
      rotationZ : 0,
      materials : this.fb.array([])
    });
  }
  setFormPropertiesInObject () {
    if (this.objectGroup) {
      const form = this.objectForm;
      const object = this.objectGroup;
      object.position.set(form.value.positionX,  form.value.positionY, form.value.positionZ);
      object.scale.set(form.value.scaleX,  form.value.scaleY, form.value.scaleZ);
      object.rotation.set(form.value.rotationX,  form.value.rotationY, form.value.rotationZ);       
      this.setFormGroupData();  
    }
  }
  addObjectOnScene (formGroup) {  
    let objectAsync = new BehaviorSubject({
      object : null
    });  
    this.objects3dService.add3dObjectFromUI(this.engServ.scene,  formGroup.value, objectAsync); 
    this.onScene = true; 
    this.object3D.controls.onScene.setValue(true);
    objectAsync.subscribe((data)=> {
      if (data.object) {
        this.objectGroup = data.object;
        this.setFormPropertiesFromObject (data.object);      
        this.engServ.scene.userData.transformControlsBehaviorSubject.subscribe((item)=>{
          if (item ) {
            this.setFormPropertiesFromObject (item);
          }
        });
        this.objectForm.valueChanges.subscribe(()=>{
          this.setFormPropertiesInObject();
        })
        this.materials = this.objects3dService.get3dObjectMaterialsList(data.object);
      }
    }) 
  }
  attachToControls (formGroup) {    
    const scene = this.engServ.scene;
    scene.userData.transformControls.attach(scene.getObjectByName(formGroup.value.name));
    this.attached = true;
  }
  detachFromControls() {
    const scene = this.engServ.scene;
    scene.userData.transformControls.detach();
  }
  setFormGroupData () {     
    const object = this.objectGroup;
    const objectFormControls = this.object3D.controls; 
    objectFormControls.position.setValue(object.position.toArray());
    objectFormControls.rotation.setValue(object.rotation.toArray());
    objectFormControls.scale.setValue(object.scale.toArray()); 
  }
  consoleFn () {
    console.log('object3d-edit-click');
    
  }
}