import { TILE } from '../main.js';
export const CAMERA = { x:0, y:0, w:20, h:12, smooth:0.25 };
export function setCameraWidthTiles(w){ 
  CAMERA.w = Math.max(12, Math.min(40, Math.round(w)));
  CAMERA.h = Math.round(CAMERA.w * 24 / 40);
  CAMERA.h = Math.max(8, Math.min(24, CAMERA.h));
}
export function updateCamera(dt, STATE){
  const tx = Math.max(0, Math.min(40 - CAMERA.w, STATE.player.x - CAMERA.w/2));
  const ty = Math.max(0, Math.min(24 - CAMERA.h, STATE.player.y - CAMERA.h/2));
  const k = dt? (1 - Math.pow(1-CAMERA.smooth, dt*60)) : 1;
  CAMERA.x += (tx - CAMERA.x)*k;
  CAMERA.y += (ty - CAMERA.y)*k;
}
export function scaleFactor(CAN, CAMERA){ return CAN.width / (CAMERA.w*TILE); }
