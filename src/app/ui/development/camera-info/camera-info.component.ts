import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EngineService } from 'src/app/engine/services/engine.service'; 
@Component({
  selector: 'app-camera-info',
  templateUrl: './camera-info.component.html',
  styleUrls: ['./camera-info.component.scss']
})
export class CameraInfoComponent implements OnInit {
  rotationXOptions = { 
    floor: -1.57, 
    ceil: 1.57, 
    hideLimitLabels: false, 
    hidePointerLabels: false, 
    step: 0.01,
  };
  rotationXMin = this.engServ.scene.userData.rotationXMin;
  rotationXMax = this.engServ.scene.userData.rotationXMax;
  constructor(
    public engServ: EngineService,
    private fb: FormBuilder
    ) { 
       
    }
  settingsForm:FormGroup;
  ngOnInit(): void {
    this.makeForm();
  }
  makeForm() {    
    this.rotationXMin = this.engServ.scene.userData.rotationXMin;
    this.rotationXMax = this.engServ.scene.userData.rotationXMax;
    this.settingsForm = this.fb.group({
      rotationXMin : this.rotationXMin,
      rotationXMax : this.rotationXMax, 
    });     
  }
  saveFile() { 
 
  }


  rotationXMinChange (event) {
    this.engServ.scene.userData.rotationXMin = event;
  }
  rotationXMaxChange (event) { 
    this.engServ.scene.userData.rotationXMax = event;
  }
  getCameraSettings () { 
    return JSON.stringify({
      zoom : [0, 9999], 
      positionY : [-9999, 9999],
      rotationY : [-9999, 9999],
      rotationX : [this.engServ.scene.userData.rotationXMin, this.engServ.scene.userData.rotationXMax]
    });
  };
}
