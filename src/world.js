import { Mob } from './entities.js';

export const MAP_W = 40, MAP_H = 24;
const BLOCKED = new Set([1,2]);
export { BLOCKED };

function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

function genOverworld(){
  const H=MAP_H, W=MAP_W;
  const m = new Array(H).fill(0).map(()=>new Array(W).fill(0));
  for(let y=5;y<18;y++){ m[y][18]=1; m[y][19]=1; } // river
  for(let x=4;x<15;x++){ m[4][x]=2; m[12][x]=2; } // walls
  for(let y=5;y<12;y++){ m[y][4]=2; m[y][14]=2; }
  m[8][4]=0; m[8][14]=0; m[4][9]=0; m[12][9]=0; // gates
  m[11][18]=0; m[11][19]=0; // bridge
  m[6][6]=8; m[7][6]=9; m[8][6]=6; m[9][6]=7; m[10][10]=10; // town
  for(let i=0;i<20;i++){ m[rand(2,H-2)][rand(22,W-2)] = 3; }
  for(let i=0;i<12;i++){ m[rand(2,H-2)][rand(22,W-2)] = 4; }
  for(let i=6;i<17;i+=3){ m[i][22]=5; }
  m[12][35]=11;
  return m;
}
function genCave(){
  const H=MAP_H, W=MAP_W;
  const m = new Array(H).fill(0).map(()=>new Array(W).fill(0));
  for(let x=0;x<W;x++){ m[0][x]=2; m[H-1][x]=2; }
  for(let y=0;y<H;y++){ m[y][0]=2; m[y][W-1]=2; }
  for(let y=5;y<19;y+=3) for(let x=6;x<34;x+=4) if(Math.random()<0.6) m[y][x]=2;
  for(let i=0;i<20;i++){ m[rand(3,H-3)][rand(3,W-3)] = 4; }
  m[12][20]=10; m[3][3]=11;
  return m;
}

export const WORLD = {
  overworld: {
    name:'Overworld', grid: genOverworld(),
    portals:[{x:35,y:12,to:'cave',sx:4,sy:4}],
    npcs:[{x:7,y:8,name:'Guide',lines:['Welcome!','Explore east to the cave.']}],
    mobs:()=>[new Mob(26,10), new Mob(28,12), new Mob(32,16)],
    drops:[]
  },
  cave: {
    name:'Cave', grid: genCave(),
    portals:[{x:3,y:3,to:'overworld',sx:35,sy:12}],
    npcs:[{x:12,y:12,name:'Hermit',lines:['Beware rats.']}],
    mobs:()=>[new Mob(20,14), new Mob(24,16)],
    drops:[]
  }
};
