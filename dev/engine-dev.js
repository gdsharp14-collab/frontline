'use strict';
// ================= constants =================
const S=10, SQ3=Math.sqrt(3), NS='http://www.w3.org/2000/svg';
const DIRS=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]]; // neighbour k sits across hex edge k (corners k..k+1)
const GRID={cols:21,rows:23};
const NEUTRALS_PER_PAIR=2;
const NF=3, MAX_TURNS=50;
const START_ARMIES=10;   // armies each faction places in its home country before turn 1
const ARMY_COST=10;      // $ per new army
const MOVE=3;            // hexes an army can move through its own land per turn
const ROUNDS=3;          // dice rounds per battle per turn
const INCOME={hex:1,cap:2,fcap:5}; // $ per turn: plain hex, country capital, own faction capital
const PCOL=[{name:'Red',h:4},{name:'Blue',h:214},{name:'Green',h:140}];
const SYL=['ka','ro','vel','dun','mar','sil','tor','bra','en','ost','gal','ny','hal','ver','ash','kel','mor','ith','lan','zar','fen','dor','sha','bel','tir','ul','gor','ri','cas','vor','pol','stav','kur','lein','mir','tal'];
const CEND=['ia','os','ar','and','ica','ea','heim','avia','istan','onia','mark','land'];

// ================= helpers =================
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const newSeed=()=>Math.floor(Math.random()*2147483647);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ROLL=()=>1+Math.floor(Math.random()*6); // one die; tests can replace it
function setRoll(fn){ROLL=fn}
function hexDist(M,a,b){const A=M.cells[a],B=M.cells[b],dq=A.q-B.q,dr=A.r-B.r;return(Math.abs(dq)+Math.abs(dr)+Math.abs(dq+dr))/2}
const nbs=(M,i)=>M.cells[i].nb.filter(j=>j>=0);
const isLand=(M,i)=>i>=0&&!!M.cells[i]&&M.cells[i].l===1;
const isLane=(M,i)=>i>=0&&!!M.cells[i]&&M.cells[i].ft==='lane';
const passable=(M,i)=>isLand(M,i)||isLane(M,i); // sea lanes can be crossed but never owned

// ================= world generation =================
// Each faction gets a home country at the back of the map with two small countries in front of it as a buffer.
// Six neutral countries fill the gaps. Inland lakes are placed first; clumps of impassable mountains are carved
// out afterwards. Every faction starts with exactly the same number of hexes, in one connected territory.
function genWorld(seed,style){
  style=style||'classic';
  for(let a=0;a<160;a++){const w=tryWorld(seed,a,style);if(w){w.seed=seed;w.style=style;return w}}
  return null;
}
function genWorldAny(seed,style){
  for(let k=0;k<40;k++){const w=genWorld(seed,style);if(w)return w;seed=(seed*48271+11)%2147483647}
  return null;
}
// layout styles: grid size, how land is split into separate landmasses, gap between them, and sea features
const STYLES={
  classic:    {name:'Classic',     grid:{cols:21,rows:23},cont:null,     G:0,lakes:[2,3],bigSea:0,Rh:6.0,Rs:3.5,maxLane:3},
  inlandsea:  {name:'Inland Sea',  grid:{cols:23,rows:25},cont:null,     G:0,lakes:[0,1],bigSea:1,Rh:6.8,Rs:4.6,maxLane:4},
  continents: {name:'Continents',  grid:{cols:27,rows:29},cont:'faction',G:1,lakes:[0,1],bigSea:0,Rh:7.6,Rs:5.0,maxLane:3,extra:0.5,neutral:'center',varied:[2,3],long:'direct',longN:[1,2]},
  archipelago:{name:'Archipelago', grid:{cols:27,rows:29},cont:'country',G:1,lakes:[0,0],bigSea:0,Rh:7.6,Rs:4.8,maxLane:3,extra:0.25,varied:[1,2],long:'direct',longN:[1,2]}
};
function tryWorld(seed,attempt,style){
  const ST=STYLES[style]||STYLES.classic;
  const rnd=mulberry32((seed+attempt*1000003)>>>0), ri=n=>Math.floor(rnd()*n), rr=(a,b)=>a+ri(b-a+1);
  const {cols,rows}=ST.grid, cells=[], idx=new Map(), K=(q,r)=>q*1000+r;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const q=col-((row-(row&1))>>1); idx.set(K(q,row),cells.length);
    cells.push({q,r:row,col,row,x:+(S*SQ3*(col+0.5*(row&1))).toFixed(2),y:S*1.5*row,w:rnd(),c:-1,cap:-1,nb:null,ft:null});
  }
  cells.forEach(c=>c.nb=DIRS.map(([dq,dr])=>{const j=idx.get(K(c.q+dq,c.r+dr));return j===undefined?-1:j}));
  const NB=i=>cells[i].nb.filter(j=>j>=0);
  for(let k=0;k<3;k++){const nv=cells.map((c,i)=>{let s=c.w,n=1;for(const j of NB(i)){s+=cells[j].w;n++}return s/n});nv.forEach((v,i)=>cells[i].w=v)}
  const edge=c=>c.row<1||c.row>rows-2||c.col<1||c.col>cols-2;
  const hd=(a,b)=>{const A=cells[a],B=cells[b],dq=A.q-B.q,dr=A.r-B.r;return(Math.abs(dq)+Math.abs(dr)+Math.abs(dq+dr))/2};
  const center=Math.floor(rows/2)*cols+Math.floor(cols/2);
  const nearest=(x,y)=>{let b=-1,bd=1e9;cells.forEach((c,i)=>{if(edge(c)||c.c!==-1)return;const d=(c.x-x)**2+(c.y-y)**2;if(d<bd){bd=d;b=i}});return b};
  // cells within distance G (for keeping a sea gap between landmasses)
  const ring=i=>{const out=[],seen=new Set([i]);let fr=[i];for(let d=0;d<ST.G;d++){const nx=[];for(const x of fr)for(const y of NB(x))if(!seen.has(y)){seen.add(y);out.push(y);nx.push(y)}fr=nx}return out};
  const RING=ST.G?cells.map((c,i)=>ring(i)):null;
  const C=[];
  const contOf=id=>{const k=C[id];if(ST.cont==='country')return id;if(ST.cont==='faction')return k.f>=0?k.f:3;return 0};
  const gapOK=(j,id)=>{if(!ST.G)return true;const cj=contOf(id);for(const k of RING[j]){const o=cells[k].c;if(o>=0&&contOf(o)!==cj)return false}return true};
  // pre-placed water: a big central sea (Inland Sea) and inland lakes; countries grow around them
  {const inner=i=>!edge(cells[i])&&hd(i,center)>=2&&hd(i,center)<=(ST.bigSea?8:7)&&cells[i].c===-1;
   const near=i=>NB(i).some(j=>cells[j].c===-2);
   const put=i=>{cells[i].c=-2;cells[i].ft='lake'};
   if(ST.bigSea){const R=2+ri(2);cells.forEach((c,i)=>{const d=hd(i,center);if(d<R||(d===R&&rnd()<0.6))put(i)})}
   const nl=rr(ST.lakes[0],ST.lakes[1]);
   for(let k=0;k<nl;k++){const o=cells.map((c,i)=>i).filter(i=>inner(i)&&!near(i)&&(ST.bigSea?hd(i,center)>=5:hd(i,center)<=4));if(!o.length)return null;
     const blob=[o[ri(o.length)]];put(blob[0]);const tg=4+ri(4);
     while(blob.length<tg){const fr=[...new Set(blob.flatMap(NB))].filter(j=>inner(j)&&(ST.bigSea?hd(j,center)>=5:hd(j,center)<=5));if(!fr.length)break;const j=fr[ri(fr.length)];put(j);blob.push(j)}}
  }
  const addCountry=(f,L,seedCell,target)=>{const id=C.length;C.push({f,L,target,cells:[seedCell]});cells[seedCell].c=id;return id};
  // home countries (ids 0-2) at the back; small countries (ids 3-8) in front of them
  const a0=rnd()*Math.PI*2, Rh=(ST.Rh+rnd()*0.5)*S*SQ3, Rs=(ST.Rs+rnd()*0.4)*S*SQ3, cx=cells[center].x, cy=cells[center].y;
  const at=(r,a)=>nearest(cx+r*Math.cos(a),cy+r*Math.sin(a));
  const TOT=34+ri(7), split=[];
  for(let f=0;f<NF;f++){const lo=Math.max(15,TOT-24),hi=Math.min(20,TOT-16),h=lo+ri(hi-lo+1),r=TOT-h,s1lo=Math.max(8,r-12),s1hi=Math.min(12,r-8),s1=s1lo+ri(s1hi-s1lo+1);split.push([h,s1,r-s1])}
  for(let f=0;f<NF;f++){const s=at(Rh,a0+f*2*Math.PI/3);if(s<0)return null;addCountry(f,1,s,split[f][0])}
  for(let f=0;f<NF;f++)for(let k=0;k<2;k++){const s=at(Rs,a0+f*2*Math.PI/3+(k?1:-1)*(ST.cont==='country'?0.5:0.42));if(s<0)return null;addCountry(f,0,s,split[f][1+k])}
  // neutral countries: in the gaps between each pair of factions (or, for Continents, one central continent)
  const neutralIds=[];
  for(let a=0;a<NF;a++){
    if(ST.neutral==='center'){const ang=a0+(a+0.5)*2*Math.PI/3;for(const r of [1.3,3.0]){const seed=at((r+rnd()*0.3)*S*SQ3,ang);if(seed<0)return null;neutralIds.push(addCountry(-1,0,seed,8+ri(5)))}continue}
    const b=(a+1)%NF,A=cells[C[a].cells[0]],Bc=cells[C[b].cells[0]];
    const mx=(A.x+Bc.x)/2,my=(A.y+Bc.y)/2,dx=Bc.x-A.x,dy=Bc.y-A.y,L=Math.hypot(dx,dy)||1,px=-dy/L,py=dx/L;
    for(let k=0;k<NEUTRALS_PER_PAIR;k++){const off=(k-(NEUTRALS_PER_PAIR-1)/2)*(ST.cont==='country'?3.4:2.6)*S*SQ3+(rnd()-0.5)*S;
      const seed=nearest(mx+px*off,my+py*off);if(seed<0)return null;neutralIds.push(addCountry(-1,0,seed,8+ri(5)))}}
  // starting points of different landmasses must keep the sea gap
  if(ST.G){for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++)if(contOf(i)!==contOf(j)&&hd(C[i].cells[0],C[j].cells[0])<=ST.G)return null}
  const frontier=id=>{const s=new Set();for(const i of C[id].cells)for(const j of NB(i))if(cells[j].c===-1&&!edge(cells[j])&&gapOK(j,id))s.add(j);return[...s]};
  const grow=(ids,soft)=>{
    let act=ids.slice();
    while(act.length){
      for(const id of act.slice()){
        const k=C[id]; if(k.cells.length>=k.target){act=act.filter(x=>x!==id);continue}
        const fr=frontier(id); if(!fr.length){if(soft&&k.cells.length>=6){act=act.filter(x=>x!==id);continue}return false}
        let best=-1,bs=-1e9;
        for(const j of fr){let sc=NB(j).filter(n=>cells[n].c===id).length*1.1+cells[j].w*2.5+rnd()*0.9;if(k.L&&k.f>=0)sc+=0.05*hd(j,center);if(!k.L&&k.f>=0)sc-=0.35*hd(j,C[k.f].cells[0]);if(sc>bs){bs=sc;best=j}}
        cells[best].c=id;k.cells.push(best);
      }
    }
    return true;
  };
  if(!grow(C.map((k,i)=>i).filter(i=>C[i].f>=0)))return null;
  if(!grow(neutralIds,true))return null;
  const pockets=()=>{const oc=new Set(),st=[];cells.forEach((c,i)=>{if(edge(c)){oc.add(i);st.push(i)}});
    while(st.length){const x=st.pop();for(const y of NB(x))if(cells[y].c===-1&&!oc.has(y)){oc.add(y);st.push(y)}}
    cells.forEach((c,i)=>{if(c.c===-1&&!oc.has(i)){c.c=-2;c.ft='lake'}})};
  pockets();
  // mountains: 3-5 clumps of 1-4 hexes carved out of the land; faction countries are topped back up to size
  {const nm=3+ri(3);
   for(let m=0;m<nm;m++){
     const cand=cells.map((c,i)=>i).filter(i=>cells[i].c>=0&&!edge(cells[i])&&NB(i).every(j=>cells[j].c>=0));
     if(!cand.length)break;
     const blob=[cand[ri(cand.length)]],size=1+ri(4);
     while(blob.length<size){const fr=[...new Set(blob.flatMap(NB))].filter(j=>cells[j].c>=0&&!blob.includes(j));if(!fr.length)break;blob.push(fr[ri(fr.length)])}
     const was=blob.map(i=>cells[i].c);
     for(const i of blob){const id=cells[i].c;C[id].cells=C[id].cells.filter(x=>x!==i);cells[i].c=-2;cells[i].ft='mtn'}
     // undo a clump that would cut a country in two
     if([...new Set(was)].some(id=>{const ks=C[id].cells;if(!ks.length)return true;const seen=new Set([ks[0]]),q=[ks[0]];while(q.length){const x=q.pop();for(const y of NB(x))if(cells[y].c===id&&!seen.has(y)){seen.add(y);q.push(y)}}return seen.size!==ks.length}))
       blob.forEach((i,k)=>{cells[i].c=was[k];cells[i].ft=null;C[was[k]].cells.push(i)});
   }
   for(let id=0;id<C.length;id++){const k=C[id];if(k.f<0)continue;
     while(k.cells.length<k.target){
       const fr=[...new Set(k.cells.flatMap(NB))].filter(j=>{const c=cells[j];if(c.c===-1)return!edge(c)&&gapOK(j,id);return c.c>=0&&C[c.c].f<0&&C[c.c].cells.length>6&&contOf(c.c)===contOf(id)});
       if(!fr.length)return null;
       let b=-1,bs=-1e9;for(const j of fr){const sc=NB(j).filter(n=>cells[n].c===id).length+rnd()*0.5;if(sc>bs){bs=sc;b=j}}
       if(cells[b].c>=0){const o=C[cells[b].c];o.cells=o.cells.filter(x=>x!==b)}
       cells[b].c=id;k.cells.push(b);
     }}
   pockets();
   if(C.some(k=>k.f<0&&k.cells.length<6))return null;
   for(let id=0;id<C.length;id++){const ks=C[id].cells;if(!ks.length)return null;const seen=new Set([ks[0]]),q=[ks[0]];while(q.length){const x=q.pop();for(const y of NB(x))if(cells[y].c===id&&!seen.has(y)){seen.add(y);q.push(y)}}if(seen.size!==ks.length)return null}
  }
  const land=cells.map((c,i)=>i).filter(i=>cells[i].c>=0);
  {const t=[0,1,2].map(f=>land.filter(i=>C[cells[i].c].f===f).length);if(t[0]!==t[1]||t[1]!==t[2])return null}
  // tidy features: mountains with no land beside them become sea; lakes joined to the outer ocean become sea (bays)
  {cells.forEach((c,i)=>{if(c.ft==='mtn'&&!NB(i).some(j=>cells[j].c>=0)){c.ft=null;c.c=-1}});
   const q=cells.map((c,i)=>i).filter(i=>cells[i].c===-1),seen=new Set(q);
   while(q.length){const x=q.pop();for(const y of NB(x))if(!seen.has(y)&&cells[y].ft==='lake'){seen.add(y);cells[y].ft=null;cells[y].c=-1;q.push(y)}}}
  if(!ST.bigSea&&ST.lakes[1]>=2&&!cells.some(c=>c.ft==='lake'))return null;
  // sea lanes: short chains of water hexes linking separate landmasses (and, on the Inland Sea, opposite shores)
  const lanes=[];
  const water=i=>!edge(cells[i])&&cells[i].c<0&&cells[i].ft!=='mtn';
  const fOf=i=>C[cells[i].c].f, isHome=i=>C[cells[i].c].L&&fOf(i)>=0;
  const pairOK=(a,b)=>{const fa=fOf(a),fb=fOf(b);if(fa>=0&&fb>=0&&fa!==fb)return false; // never straight between two factions' land
    if(isHome(a)&&fb>=0&&fb!==fa)return false;if(isHome(b)&&fa>=0&&fa!==fb)return false;return true};
  const findLane=(fromSet,toTest,avoid)=>{ // shortest water path from a land hex in fromSet to a land hex passing toTest
    const prev=new Map(),orig=new Map(),depth=new Map(),q=[];
    fromSet.forEach(a=>NB(a).forEach(w=>{if(water(w)&&!depth.has(w)&&!(avoid&&avoid(w))){depth.set(w,1);orig.set(w,a);q.push(w)}}));
    const found=[];let best=99;
    for(let h=0;h<q.length;h++){const w=q[h],d=depth.get(w);if(d>best)break;
      for(const b of NB(w))if(cells[b].c>=0&&toTest(b)&&pairOK(orig.get(w),b)){found.push({w,b,d});best=d}
      if(d>=ST.maxLane)continue;
      for(const y of NB(w))if(water(y)&&!depth.has(y)&&!(avoid&&avoid(y))){depth.set(y,d+1);orig.set(y,orig.get(w));prev.set(y,w);q.push(y)}}
    if(!found.length)return null;
    const f=found[ri(found.length)];const path=[f.w];let x=f.w;while(prev.has(x)){x=prev.get(x);path.unshift(x)}
    return[orig.get(f.w),...path,f.b];
  };
  const addLane=p=>{lanes.push(p);p.slice(1,-1).forEach(i=>{cells[i].c=-3;cells[i].ft='lane'})};
  const near2=p=>lanes.some(l=>l.slice(1,-1).some(u=>p.slice(1,-1).some(w=>hd(u,w)<=2)));
  const adjLand=i=>NB(i).some(j=>cells[j].c>=0);
  // cheapest water route; water next to land costs extra, so routes cross open sea instead of hugging coasts
  const routeWater=(starts,goal,maxLen,pen)=>{
    const dist=new Map(),len=new Map(),prev=new Map(),from=new Map(),open=[];
    for(const s of starts){if(!water(s.w)||dist.has(s.w))continue;dist.set(s.w,1+(adjLand(s.w)?pen:0));len.set(s.w,1);from.set(s.w,s.from);open.push(s.w)}
    while(open.length){
      let bi=0;for(let k=1;k<open.length;k++)if(dist.get(open[k])<dist.get(open[bi]))bi=k;
      const w=open.splice(bi,1)[0],g=goal(w,len.get(w),from.get(w));
      if(g!=null){const path=[w];let x=w;while(prev.has(x)){x=prev.get(x);path.unshift(x)}return{path,end:g,start:from.get(w)}}
      if(len.get(w)>=maxLen)continue;
      for(const y of NB(w)){if(!water(y))continue;const nd=dist.get(w)+1+(adjLand(y)?pen:0);if(!dist.has(y)||nd<dist.get(y)){dist.set(y,nd);len.set(y,len.get(w)+1);prev.set(y,w);from.set(y,from.get(w));if(!open.includes(y))open.push(y)}}
    }
    return null;
  };
  const startsFrom=src=>{const out=[];src.forEach(a=>NB(a).forEach(w=>{if(water(w))out.push({w,from:a})}));return out};
  const landGoal=(isT,minLen,check)=>(w,l,from)=>{if(l<minLen)return null;for(const b of NB(w))if(cells[b].c>=0&&isT(b)&&(!check||check(from,b)))return b;return null};
  const laneVia=(src,via,isT,maxLen,pen,check)=>{
    const a=routeWater(startsFrom(src),w=>w===via?true:null,maxLen,pen);if(!a)return null;
    const b=routeWater([{w:via,from:a.start}],landGoal(isT,1,check),maxLen,pen);if(!b)return null;
    return[a.start,...a.path,...b.path.slice(1),b.end];
  };
  const longLanes=new Set();
  {const comp=new Array(cells.length).fill(-1);let n=0;
   land.forEach(i=>{if(comp[i]>=0)return;const q=[i];comp[i]=n;while(q.length){const x=q.pop();for(const y of NB(x))if(cells[y].c>=0&&comp[y]<0){comp[y]=n;q.push(y)}}n++});
   if(n>1){
     // link every landmass (shortest crossings first), then add a few extra crossings
     const cand=[];
     for(let A=0;A<n;A++){const As=land.filter(i=>comp[i]===A);for(let B=A+1;B<n;B++){const p=findLane(As,b=>comp[b]===B);if(p)cand.push({A,B,p})}}
     cand.sort((x,y)=>x.p.length-y.p.length);
     const par=[...Array(n).keys()],find=x=>par[x]===x?x:(par[x]=find(par[x]));
     for(const c of cand){const ra=find(c.A),rb=find(c.B);
       if(ra!==rb){par[ra]=rb;addLane(c.p)}
       else if(rnd()<(ST.extra||0)&&!near2(c.p))addLane(c.p)}
   }
   // a few longer lanes (2-7 hexes) between different landmasses, across open water
   if(ST.varied&&n>1){const want=rr(ST.varied[0],ST.varied[1]);
     for(let k=0;k<20&&want>0;k++){const a=land[ri(land.length)];if(!NB(a).some(water))continue;
       const r=routeWater(startsFrom([a]),landGoal(b=>comp[b]!==comp[a]&&hd(a,b)>=4,2,pairOK),7,1.5);
       if(!r)continue;const p=[r.start,...r.path,r.end];if(near2(p))continue;addLane(p);if(lanes.filter(l=>l.length>4).length>=want)break}}
   // long-range lanes round the outside, between two factions' land
   if(ST.long){const pairs=[[0,1],[1,2],[2,0]];let made=0;
     for(const [fa,fb] of pairs){
       const mid=[0,1,2].map(k=>a0+k*2*Math.PI/3),am=Math.atan2(Math.sin(mid[fa])+Math.sin(mid[fb]),Math.cos(mid[fa])+Math.cos(mid[fb]));
       let via=-1,bd=1e9;const R=(ST.Rh+3.2)*S*SQ3,tx=cx+R*Math.cos(am),ty=cy+R*Math.sin(am);
       cells.forEach((c,i)=>{if(!water(i)||adjLand(i))return;const d=(c.x-tx)**2+(c.y-ty)**2;if(d<bd){bd=d;via=i}});
       if(via<0)return null;
       const src=land.filter(i=>fOf(i)===fa),dst=b=>fOf(b)===fb;
       if(ST.long==='direct'){const p=laneVia(src,via,dst,14,1.5,null);if(!p||p.length-2<5)return null;addLane(p);longLanes.add(p);made++}
       else{ // a small neutral island at the halfway point, with lanes to it from both sides
         const isl=[via];cells[via].c=-9;
         for(let z=0;z<40&&isl.length<4+ri(3);z++){const fr=[...new Set(isl.flatMap(NB))].filter(j=>water(j)&&cells[j].c===-1&&!NB(j).some(x=>cells[x].c>=0||cells[x].c===-3));if(!fr.length)break;const j=fr[ri(fr.length)];cells[j].c=-9;isl.push(j)}
         if(isl.length<3)return null;
         const id=C.length;C.push({f:-1,L:0,target:isl.length,cells:isl.slice(),island:1});isl.forEach(i=>{cells[i].c=id;land.push(i)});neutralIds.push(id);
         const r1=routeWater(startsFrom(src),landGoal(b=>cells[b].c===id,1,null),9,1.5),r2=routeWater(startsFrom(land.filter(i=>fOf(i)===fb)),landGoal(b=>cells[b].c===id,1,null),9,1.5);
         if(!r1||!r2)return null;addLane([r1.start,...r1.path,r1.end]);addLane([r2.start,...r2.path,r2.end]);made++;
       }
     }
     if(made<3)return null}
   if(ST.bigSea){ // a hub in the middle of the sea, joined to 6 landing points evenly spread round the shore
     if(!water(center))return null;
     const shore=land.filter(i=>NB(i).some(j=>cells[j].ft==='lake'&&hd(j,center)<=4)&&!isHome(i));
     const angOf=i=>Math.atan2(cells[i].y-cy,cells[i].x-cx),dAng=(x,y)=>Math.abs(Math.atan2(Math.sin(x-y),Math.cos(x-y)));
     const spokes=[];
     for(let k=0;k<6;k++){const want=a0+k*Math.PI/3;
       const cand=shore.filter(i=>dAng(angOf(i),want)<0.5&&!spokes.some(s=>hd(s[0],i)<=2)).sort((x,y)=>dAng(angOf(x),want)-dAng(angOf(y),want));
       let ok=false;
       for(const l of cand.slice(0,4)){const r=routeWater(startsFrom([l]),w=>w===center?true:null,9,2.5);if(r){spokes.push([l,...r.path]);ok=true;break}}
       if(!ok)return null;
     }
     spokes.forEach(p=>{lanes.push(p);longLanes.add(p);p.slice(1).forEach(i=>{cells[i].c=-3;cells[i].ft='lane'})});
   }
  }
  // everything must be reachable over land and sea lanes
  const pass=i=>cells[i].c>=0||cells[i].c===-3;
  {const seen=new Set([land[0]]),q=[land[0]];while(q.length){const x=q.pop();for(const y of NB(x))if(pass(y)&&!seen.has(y)){seen.add(y);q.push(y)}}if(land.some(i=>!seen.has(i)))return null}
  // which countries touch (over land, or across a sea lane)
  const touch=C.map(()=>new Set());
  land.forEach(i=>NB(i).forEach(j=>{if(cells[j].c>=0&&cells[j].c!==cells[i].c)touch[cells[i].c].add(cells[j].c)}));
  lanes.forEach(p=>{if(longLanes.has(p))return;const a=cells[p[0]].c,b=cells[p[p.length-1]].c;if(a<0||b<0)return;if(a!==b){touch[a].add(b);touch[b].add(a)}});
  if(ST.neutral!=='center')for(const id of neutralIds)if(![...touch[id]].some(o=>C[o].f>=0))return null;
  if(ST.neutral==='center'){for(let a=0;a<NF;a++)if(!neutralIds.some(id=>[...touch[id]].some(o=>C[o].f===a)))return null}
  else for(let a=0;a<NF;a++){const b=(a+1)%NF;if(!neutralIds.some(id=>[...touch[id]].some(o=>C[o].f===a)&&[...touch[id]].some(o=>C[o].f===b)))return null}
  for(let f=0;f<NF;f++)if([...touch[f]].some(o=>C[o].f>=0&&C[o].f!==f))return null; // a home country never borders an enemy
  // each faction's land is one territory (its own sea lanes may join it)
  for(let f=0;f<NF;f++){const mine=land.filter(i=>C[cells[i].c].f===f);const ok=i=>(cells[i].c>=0&&C[cells[i].c].f===f)||cells[i].c===-3;
    const seen=new Set([mine[0]]),q=[mine[0]];while(q.length){const x=q.pop();for(const y of NB(x))if(ok(y)&&!seen.has(y)){seen.add(y);q.push(y)}}if(mine.some(i=>!seen.has(i)))return null}
  // capitals: the most central hex of each country
  C.forEach((k,id)=>{let best=-1,bs=-1e9;for(const i of k.cells){let sc=rnd()*0.8;for(const j of k.cells)if(hd(i,j)<=2)sc++;if(sc>bs){bs=sc;best=i}}k.cap=best;cells[best].cap=id});
  {const tmp={cells:cells.map(c=>({l:c.c>=0?1:0,nb:c.nb,cap:c.cap}))};const own=cells.map(c=>c.c>=0?C[c.c].f:-2);
   if(encircleOwners(tmp,own,new Set(),[-1]).length)return null}
  const used=new Set(), capz=s=>s[0].toUpperCase()+s.slice(1);
  const cName=()=>{for(let z=0;z<80;z++){const n=capz(SYL[ri(SYL.length)]+(rnd()<0.5?SYL[ri(SYL.length)]:'')+CEND[ri(CEND.length)]);if(!used.has(n)){used.add(n);return n}}return 'Country '+used.size};
  const countries=C.map(k=>{
    let mx=0,my=0;k.cells.forEach(i=>{mx+=cells[i].x;my+=cells[i].y});mx/=k.cells.length;my/=k.cells.length;
    let b=k.cells[0],bd=1e9;k.cells.forEach(i=>{if(i===k.cap)return;const d=(cells[i].x-mx)**2+(cells[i].y-my)**2;if(d<bd){bd=d;b=i}});
    return{name:cName(),f:k.f,L:k.L,cap:k.cap,n:k.cells.length,lx:cells[b].x,ly:cells[b].y};
  });
  let maxx=0,maxy=0;cells.forEach(c=>{maxx=Math.max(maxx,c.x);maxy=Math.max(maxy,c.y)});
  const hw=S*SQ3/2;
  return{
    cells:cells.map(c=>{const o={q:c.q,r:c.r,x:c.x,y:c.y,l:c.c>=0?1:0,c:c.c,nb:c.nb,cap:c.cap};if(c.ft)o.ft=c.ft;return o}),
    countries, factions:[0,1,2].map(f=>({cap:C[f].cap,home:f})), lanes,
    vb:[-hw-2,-S-2,+(maxx+2*hw+4).toFixed(2),maxy+2*S+4]
  };
}

// ================= game state =================
// g.st: armies on the map, one entry per faction per hex: {f,c,n}
// g.links: border battles between armies that crossed paths: [hexA, factionA, hexB, factionB]
function newGame(map,opts){
  const cpu=!!(opts&&opts.cpu);
  const players=PCOL.map((p,f)=>cpu&&f>0?{name:p.name+' (CPU)',h:p.h,uid:'ai',ai:true,alive:true}:{name:p.name,h:p.h,uid:null,alive:true});
  const owner=map.cells.map(c=>c.l?map.countries[c.c].f:-2);
  return{v:3,id:null,map,players,owner,st:[],links:[],money:players.map(()=>0),inc:players.map(()=>null),
    turn:0,maxTurns:MAX_TURNS,phase:'place',
    place:players.map(()=>[]),orders:players.map(()=>[]),recruits:players.map(()=>[]),submitted:players.map(()=>false),
    replay:null,log:[{t:0,f:-1,m:'The war begins. Each nation places its '+START_ARMIES+' armies.'}],winners:null,cpu};
}
const landCount=(g,f)=>g.owner.reduce((s,o,i)=>s+(o===f&&g.map.cells[i].l?1:0),0);
const armyCount=(g,f)=>g.st.reduce((s,a)=>s+(a.f===f?a.n:0),0);
function glog(g,f,m){g.log.push({t:g.turn,f,m});if(g.log.length>300)g.log.splice(0,g.log.length-300)}
const cname=(g,h)=>{const c=g.map.cells[h];return c.c>=0?g.map.countries[c.c].name:'a sea lane'};
function armiesAt(g,h,f){let n=0;for(const a of g.st)if(a.c===h&&a.f===f)n+=a.n;return n}
function factionsAt(g,h){const s=new Set();for(const a of g.st)if(a.c===h&&a.n>0)s.add(a.f);return s}
function normalize(st){const m=new Map();for(const a of st){if(a.n<=0)continue;const k=a.f+':'+a.c;if(m.has(k))m.get(k).n+=a.n;else m.set(k,{f:a.f,c:a.c,n:a.n})}return[...m.values()]}
const linkKey=l=>{const a=l[0]+':'+l[1],b=l[2]+':'+l[3];return a<b?a+'|'+b:b+'|'+a};
// which faction-hex pairs are in battle right now
function battleSet(g){
  const s=new Set(),byHex=new Map();
  for(const a of g.st){if(a.n<=0)continue;if(!byHex.has(a.c))byHex.set(a.c,new Set());byHex.get(a.c).add(a.f)}
  byHex.forEach((fs,h)=>{if(fs.size>1)fs.forEach(f=>s.add(f+':'+h))});
  for(const [a,fa,b,fb] of g.links||[])if(armiesAt(g,a,fa)>0&&armiesAt(g,b,fb)>0){s.add(fa+':'+a);s.add(fb+':'+b)}
  return s;
}
function incomeOf(g,f){
  const M=g.map;let hex=0,cap=0,fcap=0;
  g.owner.forEach((o,i)=>{if(o!==f||!M.cells[i].l)return;if(i===M.factions[f].cap)fcap+=INCOME.fcap;else if(M.cells[i].cap>=0)cap+=INCOME.cap;else hex+=INCOME.hex});
  return{hex,cap,fcap,total:hex+cap+fcap};
}
// hexes an army of faction f at `from` can reach this turn, with the shortest path to each.
// It moves through its own land (no enemy armies) up to MOVE hexes; entering any other hex ends the move.
// Armies in battle can only retreat 1 hex into their own land with no enemy armies.
function reachFor(g,f,from,retreat){
  const M=g.map,dist=new Map([[from,0]]),prev=new Map(),q=[from];
  const enemyIn=h=>g.st.some(a=>a.c===h&&a.f!==f&&a.n>0);
  if(retreat){for(const j of nbs(M,from))if(((isLand(M,j)&&g.owner[j]===f)||isLane(M,j))&&!enemyIn(j)){dist.set(j,1);prev.set(j,from)}return{dist,prev}}
  while(q.length){
    const x=q.shift(),d=dist.get(x);
    if(d>=MOVE)continue;
    if(x!==from&&((isLand(M,x)&&g.owner[x]!==f)||enemyIn(x)))continue; // the move ends here (sea lanes don't stop it)
    for(const y of nbs(M,x)){if(!passable(M,y)||dist.has(y))continue;dist.set(y,d+1);prev.set(y,x);q.push(y)}
  }
  return{dist,prev};
}
function pathTo(rr,start,target){const p=[];let x=target;while(x!==start&&x!=null){p.unshift(x);x=rr.prev.get(x)}return p}

// ================= placement (before turn 1) =================
function homeHexes(g,f){const M=g.map;return M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&M.cells[i].c===M.factions[f].home)}
function cleanPlace(g,f,list){
  const home=new Set(homeHexes(g,f)),out=[];let left=START_ARMIES;
  for(const p of list||[]){if(!p||!home.has(p.c))continue;const n=Math.max(0,Math.min(left,Math.floor(p.n)||0));if(!n)continue;out.push({c:p.c,n});left-=n}
  if(left>0)out.push({c:g.map.factions[f].cap,n:left}); // anything not placed goes on the capital
  return out;
}
function startPlay(g){
  g.players.forEach((p,f)=>{cleanPlace(g,f,g.place[f]).forEach(({c,n})=>g.st.push({f,c,n}))});
  g.st=normalize(g.st);g.place=g.players.map(()=>[]);
  g.turn=1;g.phase='orders';g.submitted=g.players.map(()=>false);g.orders=g.players.map(()=>[]);g.recruits=g.players.map(()=>[]);
  glog(g,-1,'All armies are in place. Turn 1 begins.');
}

// ================= carrying out orders =================
function resolveTurn(g){
  const M=g.map,T=g.turn,alive=f=>g.players[f].alive;
  const so=g.owner.slice(), su=g.st.map(a=>[a.f,a.c,a.n]);
  const inBattle=battleSet(g);
  const frames=[],tx=[];
  const snap=(k,extra)=>frames.push(Object.assign({k,st:normalize(g.st.concat(groups.map(G=>({f:G.f,c:G.c,n:G.n})))).map(a=>[a.f,a.c,a.n]),fl:[]},extra||{}));
  const setOwner=(h,f,fl)=>{if(g.owner[h]!==f){fl.push([h,f]);g.owner[h]=f}};
  // gather moving groups; their armies leave their stacks until the end of movement
  const groups=[];
  g.players.forEach((p,f)=>{
    if(!alive(f))return;
    const avail=new Map();g.st.forEach(a=>{if(a.f===f)avail.set(a.c,(avail.get(a.c)||0)+a.n)});
    for(const o of g.orders[f]||[]){
      if(!o||!Array.isArray(o.path)||!o.path.length)continue;
      const have=avail.get(o.from)||0,n=Math.min(have,Math.floor(o.n)||0);if(n<=0)continue;
      const inB=inBattle.has(f+':'+o.from);
      if(inB&&!o.r)continue; // armies in battle hold unless they retreat
      const r=inB&&!!o.r;
      avail.set(o.from,have-n);
      groups.push({f,n,c:o.from,from:o.from,path:o.path.slice(0,r?1:MOVE).map(Number),r,stop:false});
    }
  });
  groups.forEach(G=>{const a=g.st.find(a=>a.f===G.f&&a.c===G.from);a.n-=G.n});
  g.st=g.st.filter(a=>a.n>0);
  const armiesNow=(h,f)=>armiesAt(g,h,f)+groups.reduce((s,G)=>s+(G.c===h&&G.f===f?G.n:0),0);
  const enemyNow=(h,f)=>g.st.some(a=>a.c===h&&a.f!==f&&a.n>0)||groups.some(G=>G.c===h&&G.f!==f&&G.n>0);
  const controlUpdate=fl=>{
    const occ=new Map();
    g.st.forEach(a=>{if(a.n>0){if(!occ.has(a.c))occ.set(a.c,new Set());occ.get(a.c).add(a.f)}});
    groups.forEach(G=>{if(G.n>0){if(!occ.has(G.c))occ.set(G.c,new Set());occ.get(G.c).add(G.f)}});
    occ.forEach((fs,h)=>{if(fs.size===1&&M.cells[h].l)setOwner(h,[...fs][0],fl)}); // sea lanes are never owned
  };
  const checkElim=fr=>{for(let f=0;f<NF;f++)if(alive(f)&&g.owner[M.factions[f].cap]!==f)eliminate(g,f,fr,groups,tx)};
  snap('start');
  // 1. retreats
  let any=false;const rmv=[];
  for(const G of groups){if(!G.r)continue;G.stop=true;const t=G.path[0];
    if(!M.cells[G.c].nb.includes(t)||!passable(M,t)||(isLand(M,t)&&so[t]!==G.f)||enemyNow(t,G.f))continue;
    rmv.push([G.c,t,G.f,G.n]);G.c=t;any=true}
  if(any){const fr={fl:[]};controlUpdate(fr.fl);snap('retreat',{mv:rmv,fl:fr.fl});
    rmv.forEach(([a,b,f,n])=>tx.push(`↩ ${g.players[f].name}: ${n} retreat${n>1?'':'s'} from ${cname(g,a)}`))}
  // 2. movement, one hex per step for everyone at once
  for(let s=0;s<MOVE;s++){
    const movers=groups.filter(G=>!G.stop&&!G.r&&G.path.length>s&&G.n>0);
    if(!movers.length)break;
    const mv=[],cross=[];
    movers.forEach(G=>{G.to=G.path[s];if(!M.cells[G.c].nb.includes(G.to)||!passable(M,G.to)){G.stop=true;G.to=null}});
    const live=movers.filter(G=>G.to!=null);
    // armies of different factions crossing paths collide on the border: both stop and fight there
    const blocked=new Set();
    for(const A of live)for(const B of live)if(A!==B&&A.f!==B.f&&A.c===B.to&&A.to===B.c){blocked.add(A);blocked.add(B);
      const l=[A.c,A.f,B.c,B.f];if(!g.links.some(x=>linkKey(x)===linkKey(l))){g.links.push(l);cross.push(l)}}
    blocked.forEach(G=>{G.stop=true;G.to=null});
    const going=live.filter(G=>!blocked.has(G));
    going.forEach(G=>{mv.push([G.c,G.to,G.f,G.n]);G.c=G.to;G.to=null});
    // an army stops when it enters a hex it doesn't own or a hex with enemy armies
    going.forEach(G=>{if((isLand(M,G.c)&&g.owner[G.c]!==G.f)||enemyNow(G.c,G.f))G.stop=true});
    const fl=[];controlUpdate(fl);
    const fr={fl};checkElim(fr);
    snap('move',{mv,fl:fr.fl,cross,el:fr.el});
    cross.forEach(([a,fa,b,fb])=>tx.push(`⚔ ${g.players[fa].name} and ${g.players[fb].name} collide between ${cname(g,a)} and ${cname(g,b)}`));
  }
  // groups rejoin the map
  g.st=normalize(g.st.concat(groups.map(G=>({f:G.f,c:G.c,n:G.n}))));groups.length=0;
  // 3. battles: every pair of factions in contact rolls dice, ROUNDS times
  const pairings=()=>{
    const out=[],byHex=new Map();
    g.st.forEach(a=>{if(a.n>0){if(!byHex.has(a.c))byHex.set(a.c,new Set());byHex.get(a.c).add(a.f)}});
    byHex.forEach((fs,h)=>{if(fs.size<2)return;const F=[...fs].sort(),d=F.includes(so[h])?so[h]:-1;
      for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){
        const a=F[i],b=F[j];
        if(d===a)out.push({def:{f:a,h},att:{f:b,h}});else if(d===b)out.push({def:{f:b,h},att:{f:a,h}});
        else out.push({m:[{f:a,h},{f:b,h}]});
      }});
    g.links.forEach(([a,fa,b,fb])=>{if(armiesAt(g,a,fa)>0&&armiesAt(g,b,fb)>0)out.push({m:[{f:fa,h:a},{f:fb,h:b}],border:true})});
    return out;
  };
  const roll=k=>Array.from({length:k},()=>ROLL()).sort((x,y)=>y-x);
  const start=pairings();
  const summary=new Map(); // per battle place: armies before
  if(start.length){
    const places=new Map();
    start.forEach(P=>{const sides=P.m||[P.def,P.att];const key=P.border?'b'+sides.map(s=>s.h).sort().join('-'):'h'+sides[0].h;
      if(!places.has(key))places.set(key,{sides:new Map(),hexes:new Set(sides.map(s=>s.h))});
      sides.forEach(s=>places.get(key).sides.set(s.f+':'+s.h,armiesAt(g,s.h,s.f)))});
    places.forEach((v,k)=>summary.set(k,v));
  }
  for(let r=0;r<ROUNDS;r++){
    const P=pairings();if(!P.length)break;
    const loss=new Map(),add=(s,n)=>{const k=s.f+':'+s.h;loss.set(k,(loss.get(k)||0)+n)},dice=[];
    for(const p of P){
      if(p.m){const [A,B]=p.m,da=roll(Math.min(3,armiesAt(g,A.h,A.f))),db=roll(Math.min(3,armiesAt(g,B.h,B.f)));
        for(let i=0;i<Math.min(da.length,db.length);i++){if(da[i]>db[i])add(B,1);else if(db[i]>da[i])add(A,1);else{add(A,1);add(B,1)}}
        dice.push([A.f,A.h,da,B.f,B.h,db,0])}
      else{const {def,att}=p,dd=roll(Math.min(2,armiesAt(g,def.h,def.f))),da=roll(Math.min(3,armiesAt(g,att.h,att.f)));
        for(let i=0;i<Math.min(dd.length,da.length);i++){if(da[i]>dd[i])add(def,1);else add(att,1)}
        dice.push([att.f,att.h,da,def.f,def.h,dd,1])}
    }
    const hits=[];
    loss.forEach((n,k)=>{const [f,h]=k.split(':').map(Number);const a=g.st.find(a=>a.f===f&&a.c===h);if(!a)return;const l=Math.min(n,a.n);a.n-=l;hits.push([h,f,l])});
    g.st=g.st.filter(a=>a.n>0);
    const fl=[];controlUpdate(fl);const fr={fl};checkElim(fr);
    snap('battle',{round:r+1,hits,dice,fl:fr.fl,el:fr.el});
  }
  // battle summaries for the log
  summary.forEach((v,key)=>{
    const parts=[...v.sides.entries()].map(([k,before])=>{const [f,h]=k.split(':').map(Number);return`${g.players[f].name} ${before}→${armiesAt(g,h,f)}`});
    const where=key[0]==='b'?`between ${[...v.hexes].map(h=>cname(g,h)).join(' and ')}`:`at ${cname(g,[...v.hexes][0])}`;
    const fs=[...v.sides.keys()].map(k=>+k.split(':')[0]);
    glog(g,fs[0],`⚔ Battle ${where}: ${parts.join(', ')}`);tx.push(`⚔ Battle ${where}: ${parts.join(', ')}`);
  });
  // border battles end when either side is gone
  const seen=new Set();
  g.links=g.links.filter(l=>{const k=linkKey(l);if(seen.has(k))return false;seen.add(k);return alive(l[1])&&alive(l[3])&&armiesAt(g,l[0],l[1])>0&&armiesAt(g,l[2],l[3])>0});
  // 4. end of turn: encirclement, new armies, income
  const sides=g.players.map((p,f)=>p.alive?f:null).filter(f=>f!==null);sides.push(-1);
  const enc=encircleOwners(M,g.owner,new Set(g.st.map(a=>a.c)),sides);
  const gained={};enc.forEach(([h,by,was])=>{const k=by+'>'+was;gained[k]=(gained[k]||0)+1});
  Object.entries(gained).forEach(([k,n])=>{const [by,was]=k.split('>').map(Number);const m=`${g.players[by].name} encircled ${n} hex${n>1?'es':''} of ${was>=0?g.players[was].name+"'s land":'neutral land'}`;glog(g,by,m);tx.push(m)});
  const built=[];
  g.players.forEach((p,f)=>{
    if(!alive(f))return;
    for(const b of g.recruits[f]||[]){
      if(!b)continue;const c=+b.c;if(!M.cells[c]||M.cells[c].cap<0||g.owner[c]!==f)continue;
      const n=Math.min(Math.floor(b.n)||0,Math.floor(g.money[f]/ARMY_COST));if(n<=0)continue;
      g.money[f]-=n*ARMY_COST;g.st.push({f,c,n});built.push([f,c,n]);
    }
  });
  g.st=normalize(g.st);
  const bt={};built.forEach(([f,c,n])=>{bt[f]=(bt[f]||0)+n});
  Object.entries(bt).forEach(([f,n])=>{glog(g,+f,`🏭 ${g.players[f].name} recruited ${n} arm${n>1?'ies':'y'}`);tx.push(`🏭 ${g.players[f].name} recruited ${n}`)});
  g.players.forEach((p,f)=>{if(!p.alive){g.money[f]=0;g.inc[f]=null;return}const inc=incomeOf(g,f);g.money[f]+=inc.total;g.inc[f]=inc});
  snap('end',{fl:enc.map(([h,by])=>[h,by]),built});
  for(let f=0;f<NF;f++){
    let gain=0,lost=0;g.owner.forEach((o,i)=>{if(!M.cells[i].l)return;if(o===f&&so[i]!==f)gain++;if(so[i]===f&&o!==f)lost++});
    if(gain||lost)glog(g,f,`${g.players[f].name}: +${gain} / −${lost} hexes this turn (now ${landCount(g,f)})`);
  }
  g.replay={turn:T,so,su,frames,tx};
  g.turn++;
  g.orders=g.players.map(()=>[]);g.recruits=g.players.map(()=>[]);g.submitted=g.players.map(()=>false);
  const al=g.players.map((p,f)=>p.alive?f:-1).filter(f=>f>=0);
  if(g.turn>g.maxTurns||al.length<=1){
    g.phase='over';
    const sc=al.map(f=>landCount(g,f)),best=Math.max(...sc);
    g.winners=al.filter((f,k)=>sc[k]===best);
    glog(g,-1,g.winners.length>1?`Game over — a tie between ${g.winners.map(f=>g.players[f].name).join(' and ')} with ${best} hexes`:`Game over — ${g.players[g.winners[0]].name} wins with ${best} hexes`);
  }
}
function eliminate(g,f,fr,groups,tx){
  const by=g.owner[g.map.factions[f].cap];
  g.players[f].alive=false;(fr.el=fr.el||[]).push(f);
  g.owner.forEach((o,i)=>{if(o===f){fr.fl.push([i,-1]);g.owner[i]=-1}});
  g.st=g.st.filter(a=>a.f!==f);if(groups)groups.forEach(G=>{if(G.f===f)G.n=0});
  g.links=g.links.filter(l=>l[1]!==f&&l[3]!==f);
  g.money[f]=0;
  const m=`${by>=0?g.players[by].name:'Someone'} captured ${g.players[f].name}'s capital — ${g.players[f].name} is eliminated`;
  glog(g,by,m);if(tx)tx.push('☠ '+m);
}
// A group of hexes switches to an enemy if every land hex around it belongs to that one enemy.
// Ocean, lakes and mountains count as walls. Not if armies are inside; capitals never switch this way.
// sides: owners whose groups are checked (-1 = neutral land)
function encircleOwners(M,owner,occupied,sides){
  const fl=[];
  for(let pass=0,changed=true;changed&&pass<12;pass++){
    changed=false;
    for(const f of sides){
      const seen=new Set();
      for(let i=0;i<M.cells.length;i++){
        if(!M.cells[i].l||owner[i]!==f||seen.has(i))continue;
        const comp=[],stk=[i];seen.add(i);
        while(stk.length){const x=stk.pop();comp.push(x);for(const y of M.cells[x].nb)if(y>=0&&M.cells[y].l&&owner[y]===f&&!seen.has(y)){seen.add(y);stk.push(y)}}
        if(comp.some(x=>occupied.has(x)))continue;
        const set=new Set(comp),around=new Set();
        for(const x of comp)for(const y of M.cells[x].nb){if(y<0||!M.cells[y].l||set.has(y))continue;around.add(owner[y])}
        if(around.size!==1)continue;
        const by=[...around][0];if(by<0||by===f)continue;
        for(const x of comp){if(M.cells[x].cap>=0)continue;owner[x]=by;fl.push([x,by,f]);changed=true}
      }
    }
  }
  return fl;
}

// ================= computer players =================
function distFrom(g,targets){ // land distance from a set of hexes
  const M=g.map,d=new Map(),q=[];targets.forEach(h=>{d.set(h,0);q.push(h)});
  while(q.length){const x=q.shift();for(const y of nbs(M,x))if(passable(M,y)&&!d.has(y)){d.set(y,d.get(x)+1);q.push(y)}}
  return d;
}
function aiPlace(g,f){
  const M=g.map,home=homeHexes(g,f),cap=M.factions[f].cap;
  const front=distFrom(g,M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&g.owner[i]!==f));
  const edge=home.filter(h=>h!==cap).sort((a,b)=>(front.get(a)||99)-(front.get(b)||99));
  const out=[{c:cap,n:4}];[0,1,2].forEach(k=>{if(edge[k*2]!=null)out.push({c:edge[k*2],n:2})});
  return cleanPlace(g,f,out);
}
function aiRecruits(g,f){
  const M=g.map;let k=Math.floor(g.money[f]/ARMY_COST);if(k<=0)return[];
  const cap=M.factions[f].cap,enemyArmies=g.st.filter(a=>a.f!==f);
  const out=[],addTo=(c,n)=>{if(n<=0)return;const e=out.find(x=>x.c===c);if(e)e.n+=n;else out.push({c,n});k-=n};
  const threat=enemyArmies.filter(a=>hexDist(M,a.c,cap)<=4).reduce((s,a)=>s+a.n,0),guard=armiesAt(g,cap,f);
  if(threat>guard)addTo(cap,Math.min(k,threat-guard+2));
  const efront=distFrom(g,g.st.filter(a=>a.f!==f).map(a=>a.c).concat(M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&g.owner[i]>=0&&g.owner[i]!==f)));
  const caps=M.countries.map(c=>c.cap).filter(c=>g.owner[c]===f).sort((a,b)=>(efront.get(a)||99)-(efront.get(b)||99));
  if(!caps.length)return out;
  const spots=caps.slice(0,2);let i=0;while(k>0){addTo(spots[i%spots.length],1);i++}
  return out;
}
function aiOrders(g,f){
  const M=g.map,orders=[],inB=battleSet(g),cap=M.factions[f].cap;
  const enemyAt=h=>g.st.reduce((s,a)=>s+(a.c===h&&a.f!==f?a.n:0),0);
  const front=distFrom(g,M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&g.owner[i]!==f));
  const enemyDist=distFrom(g,g.st.filter(a=>a.f!==f).map(a=>a.c));
  const claimed=new Set(),sent=new Map();
  const mine=g.st.filter(a=>a.f===f).sort((a,b)=>b.n-a.n);
  const threatNear=h=>g.st.filter(a=>a.f!==f&&hexDist(M,a.c,h)<=MOVE+1).reduce((s,a)=>s+a.n,0);
  for(const a of mine){
    let avail=a.n;
    if(inB.has(f+':'+a.c)){
      // strength we face here: enemies in the hex plus enemies across a border battle
      let foe=enemyAt(a.c);g.links.forEach(([x,fx,y,fy])=>{if(x===a.c&&fx===f)foe+=armiesAt(g,y,fy);if(y===a.c&&fy===f)foe+=armiesAt(g,x,fx)});
      if(a.c!==cap&&a.n*1.7<foe){const rr=reachFor(g,f,a.c,true);let best=null;rr.dist.forEach((d,h)=>{const sc=(enemyDist.get(h)||0)+Math.random()*0.3;if(!best||sc>best.sc)best={h,sc}});
        if(best)orders.push({from:a.c,n:a.n,path:[best.h],r:true})}
      continue;
    }
    // keep a guard on the faction capital
    if(a.c===cap){const t=threatNear(cap);avail-=Math.min(avail,Math.max(2,Math.ceil(t*1.2)));}
    if(avail<=0)continue;
    const rr=reachFor(g,f,a.c,false),cands=[];
    rr.dist.forEach((d,h)=>{
      if(h===a.c||g.owner[h]===f&&!enemyAt(h))return;
      if(isLane(M,h)&&!enemyAt(h))return;
      if(claimed.has(h)&&!enemyAt(h))return;
      const e=enemyAt(h),isCap=M.cells[h].cap>=0,isFcap=M.factions.some((F,k)=>F.cap===h&&k!==f&&g.players[k].alive);
      let need,val;
      if(!e){need=1;val=2+(g.owner[h]>=0?1:0)+(isCap?5:0)+(isFcap?60:0)}
      else{const defended=g.owner[h]!==f&&g.owner[h]>=0;need=Math.ceil(e*(defended?1.6:1.3))+1;val=4+e*0.5+(isCap?5:0)+(isFcap?60:0)}
      // don't send lone armies next to big enemy stacks
      const near=Math.max(0,...nbs(M,h).map(enemyAt));if(near>need*2&&!isFcap)val-=4;
      val-=d*0.2;
      cands.push({h,need,val});
    });
    cands.sort((x,y)=>y.val/y.need-x.val/x.need);
    for(const c of cands){
      if(avail<=0)break;if(c.val<=0)continue;
      const already=sent.get(c.h)||0,still=c.need-already;
      if(still<=0)continue;
      // attacks may be pooled from several stacks; land grabs need just one army
      if(c.need>1&&avail<still&&avail+already<c.need*0.5)continue;
      const n=c.need===1?1:Math.min(avail,Math.max(still,enemyAt(c.h)>0&&avail>still*2?avail:still));
      orders.push({from:a.c,n,path:pathTo(rr,a.c,c.h)});avail-=n;claimed.add(c.h);sent.set(c.h,already+n);
    }
    // whatever is left marches toward the front through our own land
    if(avail>0&&(front.get(a.c)||0)>1){
      let best=null;rr.dist.forEach((d,h)=>{if(g.owner[h]!==f||enemyAt(h))return;const sc=-(enemyDist.get(h)!=null?enemyDist.get(h)*0.6:0)-(front.get(h)||0);if(!best||sc>best.sc)best={h,sc}});
      if(best&&best.h!==a.c)orders.push({from:a.c,n:avail,path:pathTo(rr,a.c,best.h)});
    }
  }
  return orders;
}
// ================= computer player v2 =================
// Plans the whole turn at once: knows where enemy armies could strike next turn (a threat map),
// keeps enough armies on its capitals and front line, pools armies from several stacks for attacks it
// expects to win, grabs land with single armies where it's safe, crosses sea lanes, and marches spare
// armies toward the most useful front over several turns.
function aiThreat(g,f){ // enemy armies that could reach each hex next turn
  const M=g.map,th=new Float64Array(M.cells.length);
  for(const a of g.st){if(a.f===f)continue;
    const d=new Map([[a.c,0]]),q=[a.c];
    while(q.length){const x=q.shift();const dx=d.get(x);th[x]+=a.n*[1,1,0.75,0.5,0.3][Math.min(dx,4)];if(dx>=MOVE+1)continue;for(const y of nbs(M,x))if(passable(M,y)&&!d.has(y)){d.set(y,dx+1);q.push(y)}}}
  return th;
}
function aiPlace2(g,f){
  const M=g.map,home=homeHexes(g,f),cap=M.factions[f].cap;
  const front=distFrom(g,M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&g.owner[i]!==f));
  const edge=home.filter(h=>h!==cap).sort((a,b)=>(front.get(a)||99)-(front.get(b)||99));
  // a solid guard at the capital, the rest in two groups on the side nearest the action
  const out=[{c:cap,n:4}];if(edge[0]!=null)out.push({c:edge[0],n:3});if(edge[3]!=null)out.push({c:edge[3],n:3});else if(edge[1]!=null)out.push({c:edge[1],n:3});
  return cleanPlace(g,f,out);
}
function aiRecruits2(g,f){
  const M=g.map;let k=Math.floor(g.money[f]/ARMY_COST);if(k<=0)return[];
  const th=aiThreat(g,f),out=[],add=(c,n)=>{n=Math.min(n,k);if(n<=0)return;const e=out.find(x=>x.c===c);if(e)e.n+=n;else out.push({c,n});k-=n};
  const caps=M.countries.map(c=>c.cap).filter(c=>g.owner[c]===f);if(!caps.length)return[];
  const fcap=M.factions[f].cap;
  // first make every capital safe, the faction capital most of all
  caps.sort((a,b)=>(b===fcap)-(a===fcap)||th[b]-th[a]);
  for(const c of caps){const need=Math.ceil(th[c]*(c===fcap?1.1:0.5))-armiesAt(g,c,f);if(need>0)add(c,need)}
  // then build up at the capitals closest to enemies (or to unclaimed land)
  const ed=distFrom(g,g.st.filter(a=>a.f!==f).map(a=>a.c)),fr=distFrom(g,M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&g.owner[i]!==f));
  const spots=caps.slice().sort((a,b)=>((ed.get(a)??99)+(fr.get(a)??99)*0.5)-((ed.get(b)??99)+(fr.get(b)??99)*0.5)).slice(0,2);
  let i=0;while(k>0){add(spots[i%spots.length],1);i++}
  return out;
}
function aiOrders2(g,f){
  const M=g.map,orders=[],inB=battleSet(g),fcap=M.factions[f].cap,th=aiThreat(g,f);
  const enemyAt=h=>{let n=0;for(const a of g.st)if(a.c===h&&a.f!==f)n+=a.n;return n};
  const mine=g.st.filter(a=>a.f===f);
  const avail=new Map(mine.map(a=>[a.c,a.n]));
  const capsOwned=new Set(M.countries.map(c=>c.cap).filter(c=>g.owner[c]===f));
  const isFcapOf=h=>M.factions.findIndex((F,k)=>F.cap===h&&k!==f&&g.players[k].alive);
  // 1. armies already in battle: retreat if clearly losing (never from the faction capital), else hold
  const battleNeed=new Map();
  for(const a of mine){if(!inB.has(f+':'+a.c))continue;
    let foe=enemyAt(a.c);g.links.forEach(([x,fx,y,fy])=>{if(x===a.c&&fx===f)foe+=armiesAt(g,y,fy);if(y===a.c&&fy===f)foe+=armiesAt(g,x,fx)});
    avail.set(a.c,0);
    if(a.c!==fcap&&a.n*1.6<foe&&!capsOwned.has(a.c)){const rr=reachFor(g,f,a.c,true);let best=null;rr.dist.forEach((d,h)=>{const sc=-th[h]+Math.random()*0.2;if(!best||sc>best.sc)best={h,sc}});
      if(best){orders.push({from:a.c,n:a.n,path:[best.h],r:true});continue}}
    const want=Math.ceil(foe*1.3)-a.n;if(want>0)battleNeed.set(a.c,want);
  }
  // 2. garrisons: keep enough on threatened capitals (and always 2 on the faction capital)
  for(const c of capsOwned){const keep=Math.max(c===fcap?3:0,Math.ceil(th[c]*(c===fcap?1.1:0.5)));const have=avail.get(c)||0;
    if(have>0)avail.set(c,Math.max(0,have-keep));}
  // 3. everyone's reach this turn
  const reach=new Map();for(const a of mine)if((avail.get(a.c)||0)>0)reach.set(a.c,reachFor(g,f,a.c,false));
  // 4. requests: help battles, defend threatened capitals, attack, grab land
  const req=[];
  battleNeed.forEach((need,h)=>req.push({h,need,val:9+need*0.3,kind:'help'}));
  for(const c of capsOwned){const short=Math.ceil(th[c]*(c===fcap?1.1:0.5))-armiesAt(g,c,f);if(short>0&&th[c]>0)req.push({h:c,need:short,val:(c===fcap?30:6),kind:'guard'})}
  const seenT=new Set();
  reach.forEach(rr=>rr.dist.forEach((d,h)=>{
    if(seenT.has(h))return;seenT.add(h);
    const e=enemyAt(h),land=isLand(M,h);
    if(!land&&!e)return;               // empty sea lanes aren't worth anything by themselves
    if(land&&g.owner[h]===f&&!e)return;
    const cap=land&&M.cells[h].cap>=0,fc=isFcapOf(h)>=0;
    if(!e){let val=2+(g.owner[h]>=0?1.5:0)+(cap?6:0)+(fc?80:0)-Math.min(1.5,th[h]*0.12);
      req.push({h,need:th[h]>3&&!cap?2:1,val,kind:'grab'})}
    else{const defended=land&&g.owner[h]>=0&&g.owner[h]!==f&&g.st.some(a=>a.c===h&&a.f===g.owner[h]);
      const need=Math.ceil(e*(defended?1.3:1.1))+1;
      req.push({h,need,val:6+e*0.5+(cap?6:0)+(fc?80:0)+(th[fcap]>0&&hexDist(M,h,fcap)<=MOVE+1?8:0),kind:'attack'})}
  }));
  // 5. fill requests, best value per army first; attacks only if enough armies can get there this turn
  req.sort((x,y)=>y.val/y.need-x.val/x.need);
  const claimed=new Set();
  for(const r of req){
    if(claimed.has(r.h)&&r.kind==='grab')continue;
    const sources=[...reach.entries()].filter(([c,rr])=>rr.dist.has(r.h)&&c!==r.h&&(avail.get(c)||0)>0).sort((x,y)=>x[1].dist.get(r.h)-y[1].dist.get(r.h));
    const supply=sources.reduce((s,[c])=>s+avail.get(c),0);
    if(r.kind==='attack'&&supply<r.need)continue;
    let need=r.kind==='attack'?Math.max(r.need,Math.min(supply,Math.ceil(r.need*1.3))):r.need;
    for(const [c,rr] of sources){if(need<=0)break;const n=Math.min(avail.get(c),need);
      orders.push({from:c,n,path:pathTo(rr,c,r.h)});avail.set(c,avail.get(c)-n);need-=n}
    claimed.add(r.h);
  }
  // 6. big idle stacks attack the nearest enemy army they clearly outnumber, even several turns away
  for(const a of mine){const n=avail.get(a.c)||0;if(n<8)continue;
    const rr=reach.get(a.c)||reachFor(g,f,a.c,false);let best=null;
    rr.dist.forEach((d,h)=>{const e=enemyAt(h);if(!e||n<e*1.25+1)return;const sc=e+(isLand(M,h)&&M.cells[h].cap>=0?5:0)-d;if(!best||sc>best.sc)best={h,sc}});
    if(best){orders.push({from:a.c,n,path:pathTo(rr,a.c,best.h)});avail.set(a.c,0)}}
  // 7. spare armies march toward the best front, several turns ahead if need be (sea lanes included)
  const goals=M.cells.map((c,i)=>i).filter(i=>{if(!isLand(M,i))return false;const o=g.owner[i];return o!==f});
  const gd=distFrom(g,goals),ed=distFrom(g,g.st.filter(a=>a.f!==f).map(a=>a.c));
  for(const a of mine){const n=avail.get(a.c)||0;if(n<=0)continue;
    const rr=reach.get(a.c)||reachFor(g,f,a.c,false);
    const here=(gd.get(a.c)??99)+(ed.get(a.c)??99)*0.3;
    let best=null;rr.dist.forEach((d,h)=>{if(h===a.c||enemyAt(h))return;if(isLand(M,h)&&g.owner[h]!==f)return;
      const sc=(gd.get(h)??99)+(ed.get(h)??99)*0.3+(isLane(M,h)?0.6:0)-Math.min(2,(armiesAt(g,h,f))*0.05);
      if(!best||sc<best.sc)best={h,sc}});
    if(best&&best.sc<here-0.5)orders.push({from:a.c,n,path:pathTo(rr,a.c,best.h)});
  }
  return orders;
}

// Fill in computer moves and play out the turn once every human has submitted.
// If no humans are left alive, the computers play the rest of the game out.
function advance(g){
  for(let k=0;k<=MAX_TURNS+2&&g.phase!=='over';k++){
    if(!g.players.every((p,f)=>!p.alive||p.ai||g.submitted[f]))return;
    if(g.phase==='place'){
      g.players.forEach((p,f)=>{if(p.ai&&!g.submitted[f]){g.place[f]=p.bot==='v1'?aiPlace(g,f):aiPlace2(g,f);g.submitted[f]=true}});
      startPlay(g);
    }else{
      g.players.forEach((p,f)=>{if(p.alive&&p.ai&&!g.submitted[f]){const v1=p.bot==='v1';g.orders[f]=v1?aiOrders(g,f):aiOrders2(g,f);g.recruits[f]=v1?aiRecruits(g,f):aiRecruits2(g,f);g.submitted[f]=true}});
      resolveTurn(g);
    }
    if(g.players.some(p=>p.alive&&!p.ai))return;
  }
}
if(typeof module!=='undefined')module.exports={aiOrders2,aiRecruits2,aiPlace2,isLane,passable,STYLES,genWorld,genWorldAny,newGame,startPlay,resolveTurn,advance,aiOrders,aiPlace,aiRecruits,reachFor,pathTo,battleSet,incomeOf,landCount,armyCount,armiesAt,normalize,encircleOwners,cleanPlace,homeHexes,setRoll,hexDist,START_ARMIES,ARMY_COST,MOVE,ROUNDS,INCOME,NF};
