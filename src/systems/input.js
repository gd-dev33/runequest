import { CAN, STATE, screenToWorldTile } from '../main.js';
import { BLOCKED } from '../world.js';

let mouse={tx:0,ty:0};

export function initInput(){
  CAN.addEventListener('mousemove', e=>{
    const r=CAN.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width*CAN.width;
    const py=(e.clientY-r.top)/r.height*CAN.height;
    const w = screenToWorldTile(px,py);
    mouse.tx = w.tx; mouse.ty = w.ty;
  });
  CAN.addEventListener('click', ()=>{
    const tx=mouse.tx, ty=mouse.ty; if(tx<0||ty<0||tx>=40||ty>=24) return;
    if(BLOCKED.has(STATE.map[ty][tx])) return;
    STATE.player.moveTo(STATE.map, tx, ty);
  });
}

export function handleInput(){ /* keyboard/modes can be wired here later */ }
export function getMouseTile(){ return mouse; }
