import {Component, OnInit} from '@angular/core';
import { EngineService } from '../engine/services/engine.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html'
})
export class UiComponent implements OnInit {

  public constructor(public engServ: EngineService) {
  }

  public ngOnInit(): void {
  }

}
