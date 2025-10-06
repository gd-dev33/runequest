// Entry: sets up subsystems and starts loop
import { UI, initUI } from './ui.js';
import { CAMERA, updateCamera, setCameraWidthTiles, scaleFactor } from './systems/camera.js';
import { WORLD, changeArea, MAP_W, MAP_H } from './world.js';
import { Player, Mob, NPC } from './entities.js';
import { drawWorld, drawEntities, drawFX, tickFX } from './render.js';
import { handleInput, getMouseTile, initInput } from './systems/input.js';
import { sellToShop, buyFromShop, renderShop, toggleShop, initShop } from './systems/shop.js';
import { spawnDrop, pickupDrop } from './systems/drops.js';
import { interactAt } from './systems/interact.js';
import { tests } from './systems/tests.js';

export const TILE = 32;
export const CAN = document.getElementById('game');
export const CTX = CAN.getContext('2d');

export const STATE = {
  area: 'overworld',
  map: WORLD['overworld'].grid,
  player: null,
  mobs: [], drops: [], npcs: [],
  clickFX: [], floats: [],
  dt: 0.016, last: performance.now()/1000
};

export function boot(){
  initUI();
  initShop();
  initInput();
  STATE.player = new Player(8,8);
  hydrateArea('overworld', 8,8);
  setCameraWidthTiles(20);
  updateCamera(0); // snap
  tests(); // run small sanity tests once
  loop();
}

export function hydrateArea(name, sx, sy){
  STATE.area = name;
  STATE.map = WORLD[name].grid;
  STATE.mobs = WORLD[name].mobs();
  STATE.drops = WORLD[name].drops;
  STATE.npcs = WORLD[name].npcs.map(n=> new NPC(n.x,n.y,n.name,n.lines));
  STATE.player.x = sx; STATE.player.y = sy; STATE.player.path = [];
  UI.hudArea.textContent = WORLD[name].name;
  UI.areaText.textContent = WORLD[name].name;
}

function update(dt){
  STATE.player.update(dt, STATE);
  STATE.mobs.forEach(m=>m.update(dt, STATE));
  tickFX(dt, STATE);
  updateCamera(dt, STATE);
  // auto-pickup
  const px=Math.floor(STATE.player.x), py=Math.floor(STATE.player.y);
  const at = STATE.drops.find(d=>d.x===px&&d.y===py);
  if(at) pickupDrop(at, STATE);
}

function draw(){
  CTX.setTransform(1,0,0,1,0,0);
  CTX.clearRect(0,0,CAN.width,CAN.height);
  const s = scaleFactor(CAN, CAMERA);
  CTX.setTransform(s,0,0,s, -CAMERA.x*TILE*s, -CAMERA.y*TILE*s);
  drawWorld(CTX, STATE);
  drawEntities(CTX, STATE);
  drawFX(CTX, STATE);
}

function loop(){
  const t = performance.now()/1000;
  STATE.dt = Math.min(0.05, t-STATE.last); STATE.last = t;
  handleInput(STATE);
  update(STATE.dt);
  draw();
  requestAnimationFrame(loop);
}

// Expose helpers used by other modules
export function worldToCanvas(x,y){ const s=scaleFactor(CAN, CAMERA); return {x:(x-CAMERA.x)*TILE*s, y:(y-CAMERA.y)*TILE*s}; }
export function screenToWorldTile(px,py){ const s=scaleFactor(CAN, CAMERA); return { tx: Math.floor(CAMERA.x + px/(TILE*s)), ty: Math.floor(CAMERA.y + py/(TILE*s)) }; }
