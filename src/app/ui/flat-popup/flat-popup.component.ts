import { Component, Input, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/services/engine.service';

@Component({
  selector: 'app-flat-popup',
  templateUrl: './flat-popup.component.html',
  styleUrls: ['./flat-popup.component.scss']
})
export class FlatPopupComponent implements OnInit {
  @Input() open:boolean;
  scene:any = this.engServ.scene;
  constructor(public engServ: EngineService) { }

  ngOnInit(): void {

  }
  popupEnable () { 
    if (this.scene.userData.flatOpen) {
      return true;
    } else {
      return false;
    }
  }
  getFlatInfo () { 
    let flatName = '';
    let flatParent = '';
    if (this.scene.userData.flat) {
      flatName = this.scene.userData.flat.name;
      flatParent = this.scene.userData.flat.parent.name;
    }
    return {
      flatName : flatName,
      flatParent : flatParent
    };
  }
  closePopup () {
    this.scene.userData.flatOpen = false; 
  }

}
