import { WORLD } from '../world.js';
import { STATE } from '../main.js';

export function tests(){
  const t=(name,fn)=>{ try{ fn(); console.log('[TEST]',name,'✅'); } catch(e){ console.error('[TEST]',name,'❌', e.message);} };
  t('overworld portal exists', ()=>{ if(WORLD.overworld.grid[12][35]!==11) throw new Error('missing portal'); });
  t('player not on blocked', ()=>{ const code=WORLD.overworld.grid[8][8]; if(code===1||code===2) throw new Error('player spawned in wall/water'); });
}
