import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-development-main',
  templateUrl: './development-main.component.html',
  styleUrls: ['./development-main.component.scss']
})
export class DevelopmentMainComponent implements OnInit {
  
  optionsOpen:boolean = false; 

  constructor() { }

  ngOnInit(): void {
  }
  toggleDevOptions () { 
    this.optionsOpen = !this.optionsOpen; 
  }
  consoleFn() { 
    console.log('consoleFn');
  }
}
