import * as cameraSettings from '../../settings/cameraSettings';
import { animateCamera } from '../animations/cameraAnimations';
import { Controller } from '../controller/controller';

export function playStartCameraAnimation (engServ) {
    animateCamera(engServ, {
        zoom : cameraSettings.startAnimation.zoom,
        positionY : cameraSettings.startAnimation.positionY,
        rotationX : cameraSettings.startAnimation.rotationX,
        rotationY : cameraSettings.startAnimation.rotationY,
        duration : cameraSettings.startAnimation.duration,
        delay : cameraSettings.startAnimation.delay,
        easing : cameraSettings.startAnimation.easing,
    });
}
export function setLimits (scene) {
    scene.userData.rotationXMin = cameraSettings.cameraLimits.rotationX[0];
    scene.userData.rotationXMax = cameraSettings.cameraLimits.rotationX[1]; 
    scene.userData.positionYMin = cameraSettings.cameraLimits.positionY[0];
    scene.userData.positionYMax = cameraSettings.cameraLimits.positionY[1]; 
    scene.userData.zoomMin = cameraSettings.cameraLimits.zoom[0];
    scene.userData.zoomMax = cameraSettings.cameraLimits.zoom[1]; 
}
export function setStartCameraPosition (scene) {
    let controller = new Controller(scene); 
    controller.setZoom(cameraSettings.startPosition.zoom);
    controller.setPositionY(cameraSettings.startPosition.positionY);
    controller.setRotationX(cameraSettings.startPosition.rotationX);
    controller.seRotationY(cameraSettings.startPosition.rotationY);
}