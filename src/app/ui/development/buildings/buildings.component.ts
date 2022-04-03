import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {
  buildings = [];
  constructor(fb: FormBuilder) { }

  ngOnInit(): void {
    
  }
  addBuilding () {
    let buildingForm = '';
    
  }
}
