import { TILE, CAN } from './main.js';
import { CAMERA, scaleFactor } from './systems/camera.js';
import { WORLD } from './world.js';

export function drawWorld(CTX, STATE){
  const map=STATE.map, H=map.length, W=map[0].length;
  const xs=Math.max(0, Math.floor(CAMERA.x)-1), xe=Math.min(W, Math.ceil(CAMERA.x+CAMERA.w)+1);
  const ys=Math.max(0, Math.floor(CAMERA.y)-1), ye=Math.min(H, Math.ceil(CAMERA.y+CAMERA.h)+1);
  for(let y=ys;y<ye;y++) for(let x=xs;x<xe;x++){
    const code=map[y][x];
    if(code===1){ CTX.fillStyle='#103a4a'; }
    else if(code===2){ CTX.fillStyle='#2b2f3a'; }
    else CTX.fillStyle = ((x+y)%2? '#16342f' : '#183a34');
    CTX.fillRect(x*TILE,y*TILE,TILE,TILE);
  }
  for(const p of WORLD[STATE.area].portals){ if(p.x>=xs-1&&p.x<xe+1&&p.y>=ys-1&&p.y<ye+1) drawPortal(CTX,p.x,p.y); }
  // static props can be drawn similarly if desired
}
export function drawEntities(CTX, STATE){
  for(const m of STATE.mobs){ if(m.dead) continue; CTX.fillStyle='#eaa'; CTX.beginPath(); CTX.arc(m.x*TILE+16, m.y*TILE+16, 10, 0, Math.PI*2); CTX.fill(); }
  for(const n of STATE.npcs){ CTX.fillStyle='#6dc2ff'; CTX.beginPath(); CTX.arc(n.x*TILE+16, n.y*TILE+16, 10, 0, Math.PI*2); CTX.fill(); }
  CTX.fillStyle='#9be67a'; CTX.beginPath(); CTX.arc(STATE.player.x*TILE+16, STATE.player.y*TILE+16, 12, 0, Math.PI*2); CTX.fill();
}
export function drawFX(CTX, STATE){ /* click ripples, floating text ... */ }
export function tickFX(dt, STATE){ /* update fx lifetimes ... */ }

function drawPortal(CTX,x,y){ CTX.strokeStyle='#bda6ff'; CTX.strokeRect(x*TILE+6,y*TILE+6,20,20); CTX.strokeStyle='#7e66ff'; CTX.strokeRect(x*TILE+8,y*TILE+8,16,16); }
