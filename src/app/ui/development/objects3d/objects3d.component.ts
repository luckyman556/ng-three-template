import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EngineService } from 'src/app/engine/services/engine.service';
import { Objects3dService } from 'src/app/engine/services/objects3d.service';
import {objects3d} from 'src/app/settings/objects3d';
@Component({
  selector: 'app-objects3d',
  templateUrl: './objects3d.component.html',
  styleUrls: ['./objects3d.component.scss']
})
export class Objects3dComponent implements OnInit {
  objects3dData:any = objects3d;
  objects3D = [];
  form:FormGroup;
  constructor(public fb : FormBuilder, public objects3dService : Objects3dService, public engServ : EngineService) {}
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';
  ngOnInit(): void {
    console.log(this.objects3dData); 
    this.objects3dData.forEach((object3d, index)=>{
      this.objects3D.push(this.fb.group({
        folder : object3d.folder,
        filename : object3d.filename,
        name : object3d.name,
        type : object3d.type,
        position : [object3d.position, null],
        scale : [object3d.scale, null],
        rotation : [object3d.rotation, null],
        onScene : object3d.onScene,
      }));   
    });
  }
  getObjectForm () {
    return  this.fb.group({
      folder : '',
      filename : '',
      name : '',
      type : 'fbx',
      position : [0,0,0],
      scale : [0,0,0],
      rotation : [0,0,0,'XYZ'],
      onScene : false,
    });
  }
  add3DObject() {  
    this.objects3D.push(this.getObjectForm()); 
  } 
  copy3dObjects () {
    let objects3d = [];
    this.objects3D.forEach((object)=>{
      objects3d.push(object.value);
    });
    return 'export const objects3d = ' + JSON.stringify(objects3d); 
  }
}
