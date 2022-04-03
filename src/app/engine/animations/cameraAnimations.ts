import { EngineService } from "../services/engine.service";

export function animateCameraZoom (engServ:EngineService, customOptions) {
    const TWEEN = engServ.tween; 
    const scene = engServ.scene;
    const camera = scene.getObjectByName('mainCamera'); 
    if (!customOptions.from) {
        customOptions.from = camera.position.z;
    }
    let options = getOptions(customOptions, TWEEN);
    let animation = new TWEEN.Tween({zoom: options.from}).to({zoom: options.to}, options.duration);
    animation.onUpdate( (event) => { 
        camera.position.z = event.zoom;
        scene.userData.targetZoom = event.zoom; 
    });

    animation.easing(options.easing);
    TWEEN.add(animation);
    animation.start();
}
export function animateCameraRotateY (engServ:EngineService, customOptions) {
    const TWEEN = engServ.tween; 
    const scene = engServ.scene;
    const outerCube = scene.getObjectByName('outerCube'); 
    if (!customOptions.from) {
        customOptions.from = outerCube.rotation.y;
    }
    let options = getOptions(customOptions, TWEEN);
    let animation = new TWEEN.Tween({rotateY: options.from}).to({rotateY: options.to}, options.duration);
    animation.onUpdate( (event) => { 
        outerCube.rotation.y = event.rotateY; 
        scene.userData.targetRotationY = event.rotateY;
    });
    animation.easing(options.easing);
    TWEEN.add(animation);
    animation.start();
}

export function animateCameraRotateX (engServ:EngineService, customOptions) {
    const TWEEN = engServ.tween; 
    const scene = engServ.scene;
    const innerCube = scene.getObjectByName('innerCube');  
    if (!customOptions.from) {
        customOptions.from = innerCube.rotation.x;
    }
    let options = getOptions(customOptions, TWEEN);
    let animation = new TWEEN.Tween({rotateX: options.from}).to({rotateX: options.to}, options.duration);
    animation.onUpdate( (event) => { 
        innerCube.rotation.x = event.rotateX; 
        scene.userData.targetRotationX = event.rotateX;
    });
    animation.easing(options.easing);
    TWEEN.add(animation);
    animation.start();
}

export function animateCameraPositionY (engServ:EngineService, customOptions) {
    const TWEEN = engServ.tween; 
    const scene = engServ.scene;
    const controllerGroup = scene.getObjectByName('controllerGroup');
    if (!customOptions.from) {
        customOptions.from = controllerGroup.position.y;
    }
    let options = getOptions(customOptions, TWEEN);
    let animation = new TWEEN.Tween({positionY: options.from}).to({positionY: options.to}, options.duration);
    animation.onUpdate( (event) => { 
        controllerGroup.position.y = event.positionY; 
        scene.userData.targetPositionY = event.positionY;
    });
    animation.easing(options.easing);
    TWEEN.add(animation);
    animation.start();
}

export function animateCamera (engServ, customOptions) {
    const TWEEN = engServ.tween; 
    let options:any = { 
        delay: 0,
        duration : 1000,
        easing : TWEEN.Easing.Back.InOut,
    }
    Object.keys(customOptions).forEach((key)=>{  
        options[key] = customOptions[key];
    });  
    if (options.rotationX) {
        
        animateCameraRotateX(engServ, { 
            to : options.rotationX,
            delay: options.delay,
            duration : options.duration,
            easing : options.easing,
        });
    }
    if (options.rotationY) {
        animateCameraRotateY(engServ, { 
            to : options.rotationY,
            delay: options.delay,
            duration : options.duration,
            easing : options.easing,
        });
    } 
    if (options.positionY) {
        animateCameraPositionY(engServ, { 
            to : options.positionY,
            delay: options.delay,
            duration : options.duration,
            easing : options.easing,
        });
    }
    if (options.zoom) {
        animateCameraZoom(engServ, { 
            to : options.zoom,
            delay: options.delay,
            duration : options.duration,
            easing : options.easing,
        });
    }
}

function getOptions (customOptions, TWEEN) {
    let options = {
        from : 0,
        to : 0,
        delay: 0,
        duration : 1000,
        easing : TWEEN.Easing.Back.InOut,
    }
    Object.keys(options).forEach((key)=>{
        if (customOptions[key]) {
            options[key] = customOptions[key]
        }
    });
    return options;
}