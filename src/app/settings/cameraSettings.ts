import * as TWEEN from '@tweenjs/tween.js'
export const startPosition = {
    zoom : 275,
    positionY : 73,
    rotationY : -0.488,
    rotationX : -0.86
}
export const startAnimation = {
    zoom : 129.3,
    positionY : 73.2,
    rotationY : 0.532,
    rotationX : -0.150,
    duration : 3000,
    delay: 1000,
    easing : TWEEN.Easing.Sinusoidal.InOut
}
export const cameraLimits = {"zoom":[0,9999],"positionY":[-9999,9999],"rotationY":[-9999,9999],"rotationX":[-1.21,0.54]};