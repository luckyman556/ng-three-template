import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EngineService} from './services/engine.service';
import { Interactions } from './interactions/interactions';
import { Objects3dService } from './services/objects3d.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;  
  interaction = new Interactions(this.engServ.scene);

  public constructor(public engServ: EngineService, public objects3dService : Objects3dService) {
  }

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate(); 
    this.objects3dService.addObjectsFromSettings(this.engServ.scene)
  } 
}
