import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/services/engine.service';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit {
  lastHovered:any; 
  constructor(public engServ: EngineService) {  
  }
  scene = this.engServ.scene;
  ngOnInit(): void { 
    this.lastHovered = this.engServ.scene.userData.lastHovered;
  }
  bubbleEnable () {
    if (this.scene.userData.hoveredAny) {
      return true;
    } else {
      return false;
    }
  }
  getBubble () {
    let html:string = '';
    let top:number = 0;
    let left:number = 0;
    if (this.scene.userData.intersects[0]) {
      if (this.scene.userData.intersects[0].object.name) {
        html = this.scene.userData.intersects[0].object.name;
      } else {
        html = 'empty'
      }      
    }
    if (this.scene.userData.pointerPx) {
      top = this.scene.userData.pointerPx.y;
      left = this.scene.userData.pointerPx.x;
    }
    return {
      html : html,
      top : top,
      left : left
    }


  }
  hideBubble () {
    return this.scene.userData.lastHoveredTime + 500 < Date.now();
  }
  ngIfBubble () {
    return this.scene.userData.lastHoveredTime + 600 > Date.now();
  }

}
