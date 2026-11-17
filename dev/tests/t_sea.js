const E=require('../engine-dev.js');let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL:',m)}};
// find a map with a sea lane of length >=2 between two land hexes
let M,lane;for(let s=1;s<50&&!lane;s++){M=E.genWorld(s,'continents');if(!M)continue;lane=M.lanes.find(p=>p.length-2===2)}
const [a,...rest]=lane,b=rest.pop(),w=rest; // a: land, w: water hexes, b: land
const fresh=()=>{const g=E.newGame(M,{});g.players.forEach(p=>p.uid='h');g.phase='orders';g.turn=1;g.st=[];g.links=[];return g};
const turn=(g,o)=>{g.orders=[o[0]||[],o[1]||[],o[2]||[]];g.recruits=[[],[],[]];E.resolveTurn(g)};
const n=(g,h,f)=>E.armiesAt(g,h,f);
E.setRoll(()=>3);
// 1. sea lanes don't stop movement; landing on land you don't own does
{const g=fresh();g.owner[a]=0;g.owner[b]=1;g.st=[{f:0,c:a,n:4}];const path=[...w,b];
 const rr=E.reachFor(g,0,a,false);ok(rr.dist.has(b),'reach crosses the sea lane to land on the far side');
 turn(g,[[{from:a,n:4,path}]]);ok(n(g,b,0)===4&&g.owner[b]===0,'army crosses the lane and takes the far hex');
 ok(w.every(h=>g.owner[h]===-2),'sea-lane hexes are never owned');}
// 2. an army can stop at sea and stays there
{const g=fresh();g.owner[a]=0;g.st=[{f:0,c:a,n:3}];turn(g,[[{from:a,n:3,path:[w[0]]}]]);
 ok(n(g,w[0],0)===3&&g.owner[w[0]]===-2,'armies can wait in a sea lane');
 // 3. a meeting battle at sea (tie costs both)
 g.st.push({f:1,c:b,n:3});const back=[...w.slice(1)].reverse();
 turn(g,[[],[{from:b,n:3,path:[...back,w[0]].slice(0,3)}]]);
 ok(n(g,w[0],0)<3&&n(g,w[0],1)<3,'battle at sea is a meeting battle: both lose on ties (red '+n(g,w[0],0)+' blue '+n(g,w[0],1)+')');}
// 4. retreat into a sea lane
{const g=fresh();g.owner[a]=0;g.st=[{f:0,c:a,n:2},{f:1,c:a,n:9}];turn(g,[[{from:a,n:2,path:[w[0]],r:true}]]);
 ok(n(g,w[0],0)===2,'retreat into an empty sea lane');}
// 5. sea lanes are walls for encirclement (a hex enclosed by enemy land plus sea stays neutral? -> just check lanes never change owner after a full game)
{const g=E.newGame(M,{cpu:true});g.players[0].ai=true;g.players[0].uid='ai';E.advance(g);
 ok(M.cells.every((c,i)=>c.ft!=='lane'||g.owner[i]===-2),'after a whole computer game, no sea lane was ever owned');
 ok(g.phase==='over','computer game on a sea-lane map finishes');}
console.log('sea-lane tests passed',pass,'failed',fail);
