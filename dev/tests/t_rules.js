const E=require('../engine-dev.js');let pass=0,fail=0;
const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL:',m)}};
const M=E.genWorldAny(424242);
const fresh=()=>{const g=E.newGame(M,{});g.players.forEach(p=>{p.uid='h'});g.phase='orders';g.turn=1;g.st=[];g.links=[];return g};
const N=i=>M.cells[i].nb.filter(j=>j>=0&&M.cells[j].l);
// find a straight line of 4 land hexes (no capitals) a-b-c-d
let line=null;
for(let a=0;a<M.cells.length&&!line;a++){if(!M.cells[a].l||M.cells[a].cap>=0)continue;
  for(let k=0;k<6&&!line;k++){const b=M.cells[a].nb[k];if(b<0||!M.cells[b].l||M.cells[b].cap>=0)continue;const c=M.cells[b].nb[k];if(c<0||!M.cells[c].l||M.cells[c].cap>=0)continue;const d=M.cells[c].nb[k];if(d<0||!M.cells[d].l||M.cells[d].cap>=0)continue;line=[a,b,c,d]}}
const [A,B,C,D]=line;
const turn=(g,orders)=>{g.orders=[orders[0]||[],orders[1]||[],orders[2]||[]];g.recruits=[[],[],[]];E.resolveTurn(g)};
const n=(g,h,f)=>E.armiesAt(g,h,f);

// 1. defended battle: the defender wins ties
E.setRoll(()=>3);
{const g=fresh();g.owner[A]=0;g.owner[B]=1;g.st=[{f:0,c:A,n:5},{f:1,c:B,n:3}];
 turn(g,[[{from:A,n:5,path:[B]}]]);
 ok(n(g,B,1)===3&&n(g,B,0)===0,'defender wins ties: blue 3 keeps all, red loses 5 (got red '+n(g,B,0)+' blue '+n(g,B,1)+')');}
// 2. meeting battle in neutral land: a tie costs both
{const g=fresh();g.owner[A]=0;g.owner[B]=-1;g.owner[C]=1;g.st=[{f:0,c:A,n:4},{f:1,c:C,n:4}];
 turn(g,[[{from:A,n:4,path:[B]}],[{from:C,n:4,path:[B]}]]);
 ok(n(g,B,0)===0&&n(g,B,1)===0,'meeting tie: both lose (red '+n(g,B,0)+' blue '+n(g,B,1)+')');}
// 3. attacker wins with higher dice; defender loses 2 per round
{let i=0;E.setRoll(()=>[1,1,6,6,6][i++%5]); // defender rolls 1,1 then attacker 6,6,6
 const g=fresh();g.owner[A]=0;g.owner[B]=1;g.st=[{f:0,c:A,n:5},{f:1,c:B,n:4}];
 turn(g,[[{from:A,n:5,path:[B]}]]);
 ok(n(g,B,1)===0&&n(g,B,0)===5&&g.owner[B]===0,'attacker wins and takes the hex (red '+n(g,B,0)+' blue '+n(g,B,1)+' owner '+g.owner[B]+')');}
// 4. crossing paths: both stop where they started and fight on the border
E.setRoll(()=>3);
{const g=fresh();g.owner[A]=0;g.owner[B]=1;g.st=[{f:0,c:A,n:2},{f:1,c:B,n:6}];
 turn(g,[[{from:A,n:2,path:[B,C]}],[{from:B,n:6,path:[A]}]]);
 ok(n(g,A,0)===0&&n(g,B,1)===4,'border battle: armies stay put, ties cost both (red '+n(g,A,0)+' blue '+n(g,B,1)+')');}
{const g=fresh();g.owner[A]=0;g.owner[B]=1;g.owner[C]=1;g.st=[{f:0,c:A,n:10},{f:1,c:B,n:10}];
 turn(g,[[{from:A,n:10,path:[B]}],[{from:B,n:10,path:[A]}]]);
 ok(g.links.length===1&&n(g,A,0)===1&&n(g,B,1)===1,'border battle lasts 3 rounds and carries over (red '+n(g,A,0)+' blue '+n(g,B,1)+' links '+g.links.length+')');
 // a blue army moves into hex B and joins the border battle
 g.st.push({f:1,c:C,n:3});g.st=E.normalize(g.st);
 turn(g,[[],[{from:C,n:3,path:[B]}]]);
 ok(n(g,A,0)===0,'reinforcements join the border battle (red '+n(g,A,0)+' blue '+n(g,B,1)+')');}
// 5. three-way battle in a red hex
{const g=fresh();g.owner[B]=0;g.owner[A]=1;g.owner[C]=2;g.st=[{f:0,c:B,n:6},{f:1,c:A,n:6},{f:2,c:C,n:6}];
 g.maxTurns=99;
 // one round only, to check the numbers
 const R=E.ROUNDS;
 turn(g,[[],[{from:A,n:6,path:[B]}],[{from:C,n:6,path:[B]}]]);
 // round 1: red keeps 6 (wins ties vs both); blue loses 2 (vs red) + 3 (vs green tie) = 5 → 1; green same → 1
 // round 2: red 6 vs blue 1: blue loses 1 → 0; red vs green 1: green 0; blue vs green 1v1 tie: both lose → already 0
 ok(n(g,B,0)===6&&n(g,B,1)===0&&n(g,B,2)===0,'three-way: red defends, attackers wear each other down (red '+n(g,B,0)+' blue '+n(g,B,1)+' green '+n(g,B,2)+')');}
// 6. movement: entering land you don't own ends the move; own land allows 3 hexes
{const g=fresh();g.owner[A]=0;g.owner[B]=-1;g.owner[C]=-1;g.st=[{f:0,c:A,n:3}];
 turn(g,[[{from:A,n:3,path:[B,C,D]}]]);
 ok(n(g,B,0)===3&&g.owner[B]===0&&g.owner[C]===-1,'stops after the first new hex');}
{const g=fresh();[A,B,C,D].forEach(h=>g.owner[h]=0);g.st=[{f:0,c:A,n:3}];
 turn(g,[[{from:A,n:3,path:[B,C,D]}]]);
 ok(n(g,D,0)===3,'moves 3 hexes through own land');}
// 7. splitting a stack
{const g=fresh();g.owner[A]=0;g.owner[B]=-1;g.owner[C]=0;g.st=[{f:0,c:A,n:7}];
 const other=N(A).find(h=>h!==B);g.owner[other]=-1;
 turn(g,[[{from:A,n:2,path:[B]},{from:A,n:3,path:[other]}]]);
 ok(n(g,A,0)===2&&n(g,B,0)===2&&n(g,other,0)===3,'split: 2 stay, 2 and 3 move');}
// 8. retreat from a battle
{const g=fresh();g.owner[A]=0;g.owner[B]=0;g.owner[C]=1;g.st=[{f:0,c:B,n:4},{f:1,c:B,n:9}];
 turn(g,[[{from:B,n:4,path:[A],r:true}]]);
 ok(n(g,A,0)===4&&n(g,B,0)===0,'retreat 1 hex into own land before battle (red at A '+n(g,A,0)+')');
 const g2=fresh();g2.owner[A]=0;g2.owner[B]=0;g2.owner[C]=0;g2.st=[{f:0,c:B,n:4},{f:1,c:B,n:9}];
 turn(g2,[[{from:B,n:4,path:[C,D]}]]);
 ok(n(g2,C,0)===0,'armies in battle cannot make a normal move');}
// 9. income and recruiting
{const g=fresh();g.owner=M.cells.map(c=>c.l?M.countries[c.c].f:-2);g.st=[{f:0,c:M.factions[0].cap,n:1}];g.money=[25,0,0];
 const inc=E.incomeOf(g,0),plain=M.cells.filter((c,i)=>c.l&&g.owner[i]===0&&c.cap<0).length;
 ok(inc.total===plain+2*2+5,'income: $1 per hex, $2 per capital, $5 faction capital ('+inc.total+')');
 g.recruits=[[{c:M.factions[0].cap,n:5}],[],[]];g.orders=[[],[],[]];E.resolveTurn(g);
 ok(n(g,M.factions[0].cap,0)===3&&g.money[0]===5+inc.total,'recruit: can afford 2 at $10; leftover $5 + income');}
// 10. encirclement: neutral pocket surrounded by red switches; capitals never do
{const g=fresh();g.owner=M.cells.map(c=>c.l?M.countries[c.c].f:-2);
 const nId=M.countries.findIndex(k=>k.f<0),hexes=M.cells.map((c,i)=>i).filter(i=>M.cells[i].l&&M.cells[i].c===nId);
 const around=new Set();hexes.forEach(h=>N(h).forEach(j=>{if(!hexes.includes(j))around.add(j)}));around.forEach(h=>g.owner[h]=0);
 turn(g,[]);
 const capH=M.countries[nId].cap;
 ok(hexes.every(h=>h===capH?g.owner[h]===-1:g.owner[h]===0),'encircled neutral country switches, except its capital');}
// 11. capturing a faction capital eliminates that faction
{const g=fresh();g.owner=M.cells.map(c=>c.l?M.countries[c.c].f:-2);const cap=M.factions[1].cap,nb=N(cap)[0];g.owner[nb]=0;
 g.st=[{f:0,c:nb,n:3},{f:1,c:M.factions[1].cap===nb?0:N(cap)[1],n:2}];g.st=g.st.filter(a=>a.c!==cap);
 turn(g,[[{from:nb,n:3,path:[cap]}]]);
 ok(!g.players[1].alive&&g.owner[cap]===0&&E.armyCount(g,1)===0,'capital captured → eliminated');}
// 12. placement: leftovers go on the capital, only home hexes count
{const g=E.newGame(M,{});const home=E.homeHexes(g,0);const out=E.cleanPlace(g,0,[{c:home[0],n:4},{c:-5,n:3},{c:home[1],n:20}]);
 ok(out.reduce((s,p)=>s+p.n,0)===10&&out.every(p=>home.includes(p.c)),'placement totals 10 in the home country');}
console.log('rule tests passed',pass,'failed',fail);
