import { MAP_W, MAP_H, BLOCKED } from './world.js';

export class Entity{
  constructor(x,y){ this.x=x; this.y=y; this.path=[]; this.speed=4; this.dead=false; }
  update(dt, STATE){
    if(this.path.length){
      const [nx,ny]=this.path[0];
      const dx=nx-this.x, dy=ny-this.y, d=Math.hypot(dx,dy);
      const step=this.speed*dt;
      if(d<=0.01){ this.x=nx; this.y=ny; this.path.shift(); }
      else { this.x += dx/d*step; this.y += dy/d*step; }
    }
  }
}

function astar(grid, sx, sy, tx, ty){
  if(sx===tx && sy===ty) return [];
  const H=grid.length, W=grid[0].length;
  const open=[], g=new Map(), came=new Map();
  const key=(x,y)=>x+','+y, h=(x,y)=>Math.abs(x-tx)+Math.abs(y-ty);
  const push=(x,y,cost)=>{ open.push([cost+h(x,y), x, y]); };
  g.set(key(sx,sy),0); push(sx,sy,0);
  while(open.length){
    open.sort((a,b)=>a[0]-b[0]);
    const [_, x,y]=open.shift();
    if(x===tx&&y===ty) break;
    const cost=g.get(key(x,y));
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue;
      if(BLOCKED.has(grid[ny][nx])) continue;
      const nk=key(nx,ny), ng=cost+1;
      if(ng < (g.get(nk)||Infinity)){ g.set(nk,ng); came.set(nk,key(x,y)); push(nx,ny,ng); }
    }
  }
  const path=[]; let ck=key(tx,ty); if(!came.has(ck)) return [];
  while(ck!==key(sx,sy)){ const [cx,cy]=ck.split(',').map(Number); path.push([cx,cy]); ck=came.get(ck); }
  return path.reverse();
}

export class Player extends Entity{
  constructor(x,y){ super(x,y); this.hp=10; this.maxhp=10; this.inv=[]; this.bank=[]; this.coins=50; this.equip={weapon:null}; this.mode='attack'; this.cool=0; }
  moveTo(grid, tx,ty){ this.path = astar(grid, Math.floor(this.x), Math.floor(this.y), tx,ty); }
  damage(n){ this.hp=Math.max(0,this.hp-n); }
  addItem(id, qty=1){ const stackable = ['coin','log','ore','bar','fish','cfish'].includes(id);
    if(stackable){ const s=this.inv.find(i=>i.id===id); if(s) s.qty+=qty; else this.inv.push({id,qty}); }
    else { for(let i=0;i<qty;i++) this.inv.push({id,qty:1}); }
    if(id==='coin') this.coins+=qty;
  }
  removeItem(id, qty=1){
    const stackable = ['coin','log','ore','bar','fish','cfish'].includes(id);
    if(stackable){ const s=this.inv.find(i=>i.id===id); if(!s||s.qty<qty) return false; s.qty-=qty; if(s.qty===0) this.inv.splice(this.inv.indexOf(s),1); return true; }
    let left=qty; for(let i=this.inv.length-1;i>=0 && left>0;i--){ if(this.inv[i].id===id){ this.inv.splice(i,1); left--; } } return left===0;
  }
}

export class Mob extends Entity{ constructor(x,y){ super(x,y); this.hp=5; this.maxhp=5; } }

export class NPC extends Entity{ constructor(x,y,name,lines){ super(x,y); this.name=name; this.lines=lines; this.speed=0; }
  talk(){ /* dialog handled by UI/log elsewhere */ }
}
