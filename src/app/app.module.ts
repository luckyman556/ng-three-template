import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {EngineComponent} from './engine/engine.component';
import {UiComponent} from './ui/ui.component';
import { BubbleComponent } from './ui/bubble/bubble.component';
import { FlatPopupComponent } from './ui/flat-popup/flat-popup.component';
import { CameraInfoComponent } from './ui/development/camera-info/camera-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { MaterialModule } from './ng-material/material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FloorSelectorComponent } from './ui/floor-selector/floor-selector.component';
import { BuildingsComponent } from './ui/development/buildings/buildings.component';
import { DevelopmentMainComponent } from './ui/development/development-main/development-main.component';
import { Objects3dComponent } from './ui/development/objects3d/objects3d.component';
import { Object3dEditComponent } from './ui/development/objects3d/object3d-edit/object3d-edit.component'; 
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MaterialComponent } from './ui/development/material/material.component';
import { ModalModule } from 'ng-modal-lib';
import { FormsModule } from '@angular/forms';
import {ColorPickerModule} from 'angular2-color-picker';
@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    BubbleComponent,
    FlatPopupComponent,
    CameraInfoComponent,
    FloorSelectorComponent,
    BuildingsComponent,
    DevelopmentMainComponent,
    Objects3dComponent,
    Object3dEditComponent,
    MaterialComponent
  ],
  imports: [
    ModalModule,
    BrowserModule,
    BrowserAnimationsModule, 
    MaterialModule, 
    NgbModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatFileUploadModule,
    FormsModule,
    ColorPickerModule 
  ], 
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
