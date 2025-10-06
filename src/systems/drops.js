import { UI } from '../ui.js';
export function spawnDrop(x,y,id,qty, STATE){ STATE.drops.push({x,y,id,qty}); }
export function pickupDrop(d, STATE){ STATE.player.addItem(d.id, d.qty); STATE.drops.splice(STATE.drops.indexOf(d),1); }
