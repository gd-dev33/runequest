import { UI } from '../ui.js';
import { STATE } from '../main.js';

const PRICES = { woodaxe:15, pick:25, rod:20, sword:40, log:3, ore:4, bar:8, fish:3, cfish:6 };

export function initShop(){
  UI.shopBtn.onclick = toggleShop;
  UI.bankBtn.onclick = toggleBank;
}

export function renderShop(){
  const el=UI.shop; el.innerHTML='';
  const mkRow = (name, inner)=>{
    const d=document.createElement('div'); d.style.display='flex'; d.style.gap='6px'; d.style.alignItems='center'; d.style.marginBottom='6px';
    const span=document.createElement('div'); span.textContent=name; d.appendChild(span);
    inner.forEach(b=>d.appendChild(b)); el.appendChild(d);
  };
  // Buy
  const buyTitle=document.createElement('h3'); buyTitle.textContent='Buy'; el.appendChild(buyTitle);
  ['woodaxe','pick','rod','sword'].forEach(id=>{
    const b1=btn('+1', ()=>buyFromShop(id,1));
    const b5=btn('+5', ()=>buyFromShop(id,5));
    mkRow(`${id} @ ${PRICES[id]}`, [b1,b5]);
  });
  // Sell (aggregate)
  const sellTitle=document.createElement('h3'); sellTitle.textContent='Sell'; el.appendChild(sellTitle);
  const counts=invCounts();
  Object.keys(counts).filter(k=>k!=='coin').forEach(id=>{
    const s1=btn('Sell 1', ()=>sellToShop(id,1));
    const s5=btn('Sell 5', ()=>sellToShop(id,5));
    const sa=btn('All', ()=>sellToShop(id, counts[id]));
    mkRow(`${id} x${counts[id]} @ ${sellPrice(id)}`, [s1,s5,sa]);
  });
  if(el.children.length===2){ const p=document.createElement('p'); p.textContent='(Nothing to sell)'; el.appendChild(p); }
}
export function toggleShop(){ UI.shop.style.display = (UI.shop.style.display==='none'?'block':'none'); if(UI.shop.style.display==='block') renderShop(); }
export function toggleBank(){ UI.bank.style.display = (UI.bank.style.display==='none'?'block':'none'); }

function btn(label, fn){ const b=document.createElement('button'); b.textContent=label; b.onclick=()=>{ fn(); renderShop(); }; return b; }

function invCounts(){
  const c={}; for(const it of STATE.player.inv){ c[it.id]=(c[it.id]||0) + (it.qty||1); } return c;
}
function buyPrice(id){ return PRICES[id]||5; }
function sellPrice(id){ return Math.max(1, Math.floor((PRICES[id]||5)*0.5)); }

export function buyFromShop(id, qty){
  const total = buyPrice(id)*qty; if(STATE.player.coins < total) return 0;
  STATE.player.coins -= total;
  STATE.player.addItem(id, qty);
  UI.coinText.textContent = STATE.player.coins;
  UI.hudCoins.textContent = `💰 ${STATE.player.coins}`;
  return qty;
}
export function sellToShop(id, qty){
  // clamp to inventory
  const have = invCounts()[id]||0;
  const q = Math.max(0, Math.min(qty, have)); if(q<=0) return 0;
  STATE.player.removeItem(id, q);
  const total = sellPrice(id)*q;
  STATE.player.coins += total;
  UI.coinText.textContent = STATE.player.coins;
  UI.hudCoins.textContent = `💰 ${STATE.player.coins}`;
  return q;
}
