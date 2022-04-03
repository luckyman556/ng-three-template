import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/services/engine.service';

@Component({
  selector: 'app-floor-selector',
  templateUrl: './floor-selector.component.html',
  styleUrls: ['./floor-selector.component.scss']
})
export class FloorSelectorComponent implements OnInit {

  constructor(public engServ : EngineService) { }

  ngOnInit(): void {
  }

}
