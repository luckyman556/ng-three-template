import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Material } from 'three';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {

  constructor(public fb : FormBuilder) { }
  @Input() material;
  form:FormGroup;
  color: string = '';
  ngOnInit(): void {
    this.color = this.material.color.getHex();
    debugger;
    this.makeForm();
  }
  makeForm () { 
    
  }

}
