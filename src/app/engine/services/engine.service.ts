import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';  
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'; 
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'; 
import { BoxHelper, Color, Euler, Group, InstancedMesh, InterpolateSmooth, Matrix4, MeshBasicMaterial, MeshPhongMaterial, RedFormat, Scene, Vector2, Vector3 } from 'three'; 
import Stats from 'three/examples/jsm/libs/stats.module.js';  
import { Controller } from '../controller/controller';
import { Hightlights } from '../hightlights/hightlights';
import * as TWEEN from '@tweenjs/tween.js';
import * as cameraAnimation from '../animations/cameraAnimations';
import { playStartCameraAnimation, setLimits, setStartCameraPosition } from '../setup/setup';
import { floorSlideUp, floorOutScale } from '../animations/floorsAnimations';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({providedIn: 'root'})

export class EngineService implements OnDestroy {
  loaderFBXnoManager = new FBXLoader();  
  controls: any; 
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene = new THREE.Scene();
  public raycaster :THREE.Raycaster;
  private light: THREE.DirectionalLight; 
  public controller : Controller; 
  public tween = TWEEN; 
  public loadingForm:FormGroup; 
  loadingObserver:Observable<any>;
  hightlights = new Hightlights(this.scene, this); 
  stats : Stats;
  buildingPromises = [];
  manager = new THREE.LoadingManager();
  loaderFBX = new FBXLoader(this.manager);  
  textureLoader = new THREE.TextureLoader(this.manager);  

  buildings = {};

  private frameId: number = null;

  public constructor(private ngZone: NgZone, private fb: FormBuilder) {    
    globalThis.scene = this.scene;
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {  
    this.makeLoadingForm();  
    this.addRenderer(canvas); 
    this.addCamera();
    this.controller = new Controller(this.scene); 
    this.controller.initController();  
    this.addRaycaster();
    this.addLight();     
    this.addTransformControls();    
    this.loadingForm.controls.buildingLoaded.valueChanges.subscribe((newValue)=>{ 
      if (newValue === true) {
       // this.addHightlights();  
      }
    });  
   // this.addBulding(); 
  
    this.setSceneSettings ();
    this.addStats();  
     
  }
  makeLoadingForm() {
    this.loadingForm = this.fb.group({
      buildingLoaded : false,
      hightlightsLoaded : false, 
      setTover1Floors: false,
    }); 
  }
  addRenderer (canvas) {
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true, // smooth edges
      logarithmicDepthBuffer : true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  } 
  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );  
    this.camera.name = 'mainCamera';
    this.scene.add(this.camera);
  }
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();      
      this.stats.update();
    }); 
    TWEEN.update();
    this.controller.animateRotationX();
    this.controller.animateRotationY();
    this.controller.animatePositionY();
    this.controller.animateZoom ();
    this.updateRaycaster();
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
    // add models methods 
    addBulding () {
      this.loaderFBX.load('assets/models/main-building_v9_.fbx',  (building) => {
 
        const scale = 0.01;
        building.scale.set(scale,scale,scale);
        building.name = 'building';
        const newMaterial = this.getBuildingMaterial();
        building.traverse((item:any)=>{
          item.material = newMaterial;
        });
        this.scene.add(building);
        let colors= ['green', 'blue', 'yellow', 'gray', 'brown']; 
        this.loadingForm.controls.buildingLoaded.setValue(true);
        this.loadingForm.controls.hightlightsLoaded.valueChanges.subscribe((newValue)=>{
          if (newValue === true) {
            this.setTover1Floors(building); 
          }
        });  
      });
    }
    addRaycaster () {
      this.raycaster = new THREE.Raycaster();
      if (!this.scene.userData.pointer) {
        this.scene.userData.pointer = new Vector2(0,0);        
        this.scene.userData.pointerPx = new Vector2(0,0);
      } 
      if (!this.scene.userData.objectsForRaycast) {
        this.scene.userData.objectsForRaycast = [];
      }
    }
    updateRaycaster () {
      this.raycaster.setFromCamera( this.scene.userData.pointer, this.camera );
      const intersects = this.raycaster.intersectObjects( this.scene.userData.objectsForRaycast , true);
      this.scene.userData.intersects = intersects;
      this.checkRaycasterClick();
    }
    checkRaycasterClick() {
      if (this.scene.userData.click) { 
        let intersects = this.scene.userData.intersects;
        if (intersects) {
          let intersectionObj = intersects[0];
          if (intersectionObj) { 
            let object3d = intersectionObj.object;
            if (object3d.userData.click) {
              this.ngZone.run(()=>{
                object3d.userData.click(intersectionObj);
              });
            } 
          }
        }        
        this.scene.userData.click = false;
      }
    }
    updateObjectsForRaycast (objects) {
      this.scene.userData.objectsForRaycast = objects;
    }
    getBuildingMaterial () {
      return  new MeshBasicMaterial({
        color: new Color('white'),
        map : this.getBuildingMaterialMap()
      })
    }
    getBuildingMaterialMap () {      
      return new THREE.TextureLoader().load( 'assets/img/texture.jpg' );  
    }
    addHightlights () {      
      this.loaderFBX.load('assets/highlights/select_boxes.fbx',  (obj) => {
 
        const scale = 0.01;
        obj.scale.set(scale,scale,scale);
        obj.name = 'highlights';
        obj.position.set(40.5, 0 , -1);
        this.scene.add(obj); 
        let newHightlightMaterial = new THREE.MeshBasicMaterial({
          color : 'white',
          transparent : true,
          opacity: 0,
          name : 'newHightlightMaterial'
        });  

        this.addMaterialToList(newHightlightMaterial);
        let hoverMaterial = new THREE.MeshBasicMaterial({
          color: 'red',
          transparent : true,
          opacity: 0.6,
          name : 'hoverMaterial1'
        });  
        this.addMaterialToList(hoverMaterial);
        let hoverMaterial2 = new THREE.MeshBasicMaterial({
          color: 'blue',
          transparent : true,
          opacity: 0.6,
          name : 'hoverMaterial2'
        }); 
        this.addMaterialToList(hoverMaterial2);

        this.scene.userData.hoverMaterial = hoverMaterial;   
        obj.traverse((item:any)=>{
          if (item.type === 'Mesh') {
            if (Math.random() < 0.5) {               
              item.userData.hoverMaterial = hoverMaterial;
            } else {
              item.userData.hoverMaterial = hoverMaterial2;
            }
            item.visible = false;
            item.cursor = 'pointer';    
            item.material = newHightlightMaterial; 
            item.userData.hover = (itersectionObj) => {
              this.hightlights.flatHover(itersectionObj);
            }
            item.userData.hoverOut = (itersectionObj, forceHoverOut?) => {
              this.hightlights.flatHoverOut(itersectionObj, forceHoverOut);
            };
            item.userData.click = (itersectionObj) => {
              this.hightlights.flatClick(itersectionObj); 
            }
          }
        });
        this.setBuildingsData ();
        this.hideBuildingHightlights(1);
        this.hideBuildingHightlights(2);
        this.updateObjectsForRaycast(this.scene.userData.buildings[0].flats.children);
        this.loadingForm.controls.setTover1Floors.valueChanges.subscribe((newValue)=>{ 
          if (newValue === true) {
            obj.children[0].children.forEach((item)=>{ 
              const floorId = Number(item.name.replace('F_', ''));
              const floorObjToWork = this.scene.userData.buildings[0].floors.find((floorObj)=>{
                if (floorObj.floor.id === floorId){
                  return true;
                }
              }) 
              if (floorObjToWork) {
                floorObjToWork.hightlights = item.children; 
              }
            });  
            this.hightlights.updateHightlightsToIntersectionList();
          }
        });


        this.loadingForm.controls.hightlightsLoaded.setValue(true);
        //this.transformControls.attach(obj); 
      });
    }
 

    setTover1Floors (building) {
      let instanceHeight = 604;
      let inputFloorsList = [
        {
          id : 7,
          key : 'floor_7',
          type : 'mesh', 
          axis : 'z', 
        },
        {
          id : 8,
          key : 'floor_008',
          type : 'mesh', 
          axis : 'z', 
        },
        {
          id : 9,
          key : 'floor_009',
          type : 'mesh', 
          axis : 'z', 
        },
        {
          id : 10,
          key : 'floor_010',
          type : 'mesh', 
          axis : 'z', 
        },
        {
          id : 11,
          key : 'floor_011',
          type : 'mesh', 
          axis : 'z', 
        },
        {
          id : 12,
          key : 'floor_012_14_16',
          remove : 'floor_012_14_16',
          type : 'instance', 
          count : 3,
          index : 0,
          axis : 'z',
          position : new Vector3(0,0,0),
        },
        {
          id : 13,
          key : 'floor_013_15',
          remove : 'floor_013_15',
          type : 'instance', 
          count : 3,
          index : 0,
          axis : 'z',
          position : new Vector3(0,0,0),
        },
        {
          id : 14,
          key : 'floor_012_14_16',
          remove : 'floor_014',
          type : 'instance', 
          count : 3,
          index : 1,
          axis : 'z',
          position : new Vector3(0,0, instanceHeight * 1),
        },
        {
          id : 15,
          key : 'floor_013_15',
          remove : 'floor_015',
          type : 'instance', 
          count : 2,
          index : 1,
          axis : 'z',
          position : new Vector3(0,0, instanceHeight * 1),
        },
        {
          id : 16,
          key : 'floor_012_14_16',
          remove : 'floor_016',
          type : 'instance', 
          count : 3,
          index : 2,
          axis : 'z',
          position : new Vector3(0,0, instanceHeight * 2),
        },
        {
          id : 17,
          key : 'floor_017', 
          type : 'mesh',  
          axis : 'z', 
        },
        {
          id : 18,
          key : 'floor_018', 
          type : 'mesh',  
          axis : 'z', 
        },
        {
          id : 19,
          key : 'floor_019_27',
          remove : 'floor_019_27',
          type : 'instance', 
          count : 5,
          index : 0,
          axis : 'z',
          position : new Vector3(0,0,0),
        },
        {
          id : 20,
          key : 'floor_020',
          remove : 'floor_020',
          type : 'instance', 
          count : 5,
          index : 0,
          axis : 'z',
          position : new Vector3(0,0,0),
        },
        {
          id : 21,
          key : 'floor_019_27',
          remove : 'floor_021_29',
          type : 'instance', 
          count : 5,
          index : 1,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 1),
        },
        {
          id : 22,
          key : 'floor_020',
          remove : 'floor_022',
          type : 'instance', 
          count : 5,
          index : 1,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 1),
        },
        {
          id : 23,
          key : 'floor_019_27',
          remove : 'floor_023',
          type : 'instance', 
          count : 5,
          index : 2,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 2),
        },
        {
          id : 24,
          key : 'floor_020',
          remove : 'floor_024',
          type : 'instance', 
          count : 5,
          index : 2,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 2),
        },
        {
          id : 25,
          key : 'floor_019_27',
          remove : 'floor_025',
          type : 'instance', 
          count : 5,
          index : 3,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 3),
        },
        {
          id : 26,
          key : 'floor_020',
          remove : 'floor_026',
          type : 'instance', 
          count : 5,
          index : 3,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 3),
        },
        {
          id : 27,
          key : 'floor_019_27',
          remove : 'floor_027',
          type : 'instance', 
          count : 5,
          index : 4,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight * 4),
        },
        {
          id : 28,
          key : 'floor_028',
          remove : 'floor_028',
          type : 'instance', 
          count : 17,
          index : 0,
          axis : 'z',
          position : new Vector3(0,0, instanceHeight / 2 * 0),
        },
        {
          id : 29,
          key : 'floor_028',
          remove : 'floor_029',
          type : 'instance', 
          count : 17,
          index : 1,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 1),
        },
        {
          id : 30,
          key : 'floor_028',
          remove : 'floor_030_38',
          type : 'instance', 
          count : 17,
          index : 2,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 2),
        },
        {
          id : 31,
          key : 'floor_028',
          remove : 'floor_031_39',
          type : 'instance', 
          count : 17,
          index : 3,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 3), 
        },
        {
          id : 32,
          key : 'floor_028',
          remove : 'floor_032',
          type : 'instance', 
          count : 17,
          index : 4,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 4), 
        },
        {
          id : 33,
          key : 'floor_028',
          remove : 'floor_033',
          type : 'instance', 
          count : 17,
          index : 5,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 5), 
        },
        {
          id : 34,
          key : 'floor_028',
          remove : 'floor_034',
          type : 'instance', 
          count : 17,
          index : 6,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 6), 
        },
        {
          id : 35,
          key : 'floor_028',
          remove : 'floor_035',
          type : 'instance', 
          count : 17,
          index : 7,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 7), 
        },
        {
          id : 36,
          key : 'floor_028',
          remove : 'floor_036',
          type : 'instance', 
          count : 17,
          index : 8,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 8), 
        },
        {
          id : 37,
          key : 'floor_028',
          remove : 'floor_037',
          type : 'instance', 
          count : 17,
          index : 9,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 9), 
        },
        {
          id : 38,
          key : 'floor_028',
          remove : 'floor_038',
          type : 'instance', 
          count : 17,
          index : 10,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 10), 
        },
        {
          id : 39,
          key : 'floor_028',
          remove : 'floor_039',
          type : 'instance', 
          count : 17,
          index : 11,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 11), 
        },
        {
          id : 40,
          key : 'floor_028',
          remove : 'floor_040',
          type : 'instance', 
          count : 17,
          index : 12,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 12), 
        },
        {
          id : 41,
          key : 'floor_028',
          remove : 'floor_041',
          type : 'instance', 
          count : 17,
          index : 13,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 13), 
        },
        {
          id : 42,
          key : 'floor_028',
          remove : 'floor_042',
          type : 'instance', 
          count : 17,
          index : 14,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 14), 
        },
        {
          id : 43,
          key : 'floor_028',
          remove : 'floor_043',
          type : 'instance', 
          count : 17,
          index : 15,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 15), 
        },
        {
          id : 44,
          key : 'floor_028',
          remove : 'floor_044',
          type : 'instance', 
          count : 17,
          index : 16,
          axis : 'z',
          position : new Vector3(0,0,instanceHeight / 2 * 16), 
        },
      ]; 

      let floorsParent = building.getObjectByName('A');
      let outputFloorsList = [];
      inputFloorsList.forEach((floor, index)=>{
        var floor3dObject = floorsParent.getObjectByName(floor.key);
        if (floor3dObject ) {
          let floorForOutpoot;
          if (floor.type === 'instance') {
            let instanceCheck = this.checkOutpootForInstanceExist(outputFloorsList, floor.key);
            if (instanceCheck) {
              floorForOutpoot = this.setExistInstance(instanceCheck, floor);
            } else {
              floorForOutpoot = this.addNewInstanceFloor(floor3dObject , floor); 
            }             
          }
          if (floor.type ==='mesh') {
            floorForOutpoot = this.addMeshFloor(floor3dObject , floor); 
          }
          if (floorForOutpoot) {
            floorForOutpoot.show = true;
            floorForOutpoot.index = index;
            outputFloorsList.push(floorForOutpoot);
          }
        }        
      }); 
      this.scene.userData.buildings[0].floors = outputFloorsList;
      this.loadingForm.controls.setTover1Floors.setValue(true);
    } 
    checkOutpootForInstanceExist (outputFloorsList, key) {  
      let check = outputFloorsList.filter((item)=>{ 
        if (item.floor.key === key) {
          return true;
        }
      }); 
      if (check.length !== 0) { 
        return check[0].object;
      } else {
        return false;
      }
    }
    addNewInstanceFloor (floor3dObject, floor) {
      const geometry = floor3dObject.geometry; 
      const material = floor3dObject.material.clone();         
      const instance = new InstancedMesh(geometry,material, floor.count); 
      instance.position.copy(floor3dObject.position); 
      instance.rotation.copy(floor3dObject.rotation);
      instance.rotation.copy(floor3dObject.scale);
      instance.name = floor.key;
      const matrix = new Matrix4();
      matrix.setPosition( floor.position );
      instance.setMatrixAt( 0, matrix );  
      floor3dObject.parent.add(instance); 
      this.removeObject(floor.remove, floor3dObject.parent); 
      return {
        object : instance,
        floor : floor
      };
    }
    setExistInstance (instance, floor) {
      const matrix = new Matrix4();
      matrix.setPosition( floor.position );
      instance.setMatrixAt( floor.index, matrix ); 
      this.removeObject(floor.remove, instance.parent); 
      return {
        object : instance,
        floor : floor
      };
    }
    addMeshFloor (floor3dObject, floor) {
      return {
        object : floor3dObject,
        floor : floor
      };
    }
    removeObject (name, parent) {
      let objectToRemove = parent.getObjectByName(name);
      if (objectToRemove) {
        objectToRemove.parent.remove(objectToRemove); 
      } 
    } 
    addMaterialToList (material) {
      if (!this.scene.userData.materialsList) {
        this.scene.userData.materialsList = {};
      }
      this.scene.userData.materialsList[material.name] = material;

    }   
    addLight () { 
      this.light = new THREE.DirectionalLight('white');
      this.light.position.z = 50;
      this.light.position.y = 50;
      this.light.intensity = 0.5;
      this.scene.add(this.light);    
      let ambientLight = new THREE.AmbientLight('white');
      ambientLight.intensity = 0.5;     
      this.scene.add(ambientLight);        
    }
    addStats () {
      this.stats = Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.top = '0px';
			document.querySelector('body').appendChild( this.stats.domElement );
    }
    
    setBuildingsData () {
      let scene = this.scene;
      let highlights = scene.getObjectByName('highlights');
      scene.userData.buildings = [];
      scene.userData.buildings.push({
        name : 'building 1',
        flats : highlights.children[0]
      });  
      scene.userData.buildings.push({
        name : 'building 2',
        flats : highlights.children[1]
      });  
      scene.userData.buildings.push({
        name : 'building 3',
        flats : highlights.children[2]
      });  
    } 
    hideBuildingHightlights (index:number) {
      let scene = this.scene;
      if (scene.userData.buildings) { 
        let building = scene.userData.buildings[index]; 
        building.flats.traverse((item) => {
          item.visible = false;
        });
      }
    } 
    setSceneSettings () {
      setStartCameraPosition(this.scene);
      setLimits(this.scene);
      playStartCameraAnimation(this);
      this.scene.userData.dragXMode = 'changePositionY';
    }   
    addTransformControls () {
      let transformControls = new TransformControls(this.camera, this.renderer.domElement);
      this.scene.add(transformControls);
      this.scene.userData.transformControls = transformControls;
      this.scene.userData.transformControlsBehaviorSubject = new BehaviorSubject(null);
      transformControls.addEventListener( 'dragging-changed',  ( event ) => {
        this.scene.userData.controllerDisabled = event.value; 
        this.scene.userData.transformControlsBehaviorSubject.next(transformControls.object);
      } );
      window.addEventListener( 'keydown', function ( event ) {

        switch ( event.keyCode ) {

          case 81: // Q
          transformControls.setSpace( transformControls.space === 'local' ? 'world' : 'local' );
            break;

          case 16: // Shift
            transformControls.setTranslationSnap( 100 );
            transformControls.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
            transformControls.setScaleSnap( 0.25 );
            break;

          case 87: // W
            transformControls.setMode( 'translate' );
            break;

          case 69: // E
            transformControls.setMode( 'rotate' );
            break;

          case 82: // R
            transformControls.setMode( 'scale' ); 
            break;
          
          case 88: // X
            transformControls.showX = ! transformControls.showX;
            break;

          case 89: // Y
            transformControls.showY = ! transformControls.showY;
            break;

          case 90: // Z
            transformControls.showZ = ! transformControls.showZ;
            break; 

        }

      } );
    }
  }
