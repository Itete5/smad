/* CrystalForge (browser-based crystal discovery platform)
 * Based on provided XtalForge code, adapted for SMAD:
 * - Branding: CrystalForge
 * - Saves current structure for MD at localStorage key: smad-structure-for-md
 */
'use strict';

// ─────────────────────────────────────────────────────────────────────
// Theme (light default + persistent toggle)
// ─────────────────────────────────────────────────────────────────────
function isDarkTheme(){
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function getSavedTheme(){
  return localStorage.getItem('cf-theme') || 'light';
}

function applyTheme(theme){
  const t = (theme === 'dark') ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('cf-theme', t);

  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (icon) icon.textContent = (t === 'dark') ? '☀️' : '🌙';
  if (label) label.textContent = (t === 'dark') ? 'Light' : 'Dark';

  refreshThreeTheme();
  refreshPlotsTheme();
}

function toggleTheme(){
  applyTheme(isDarkTheme() ? 'light' : 'dark');
}

function refreshThreeTheme(){
  if (!VIZ || !VIZ.renderer) return;
  VIZ.renderer.setClearColor(isDarkTheme() ? 0x010306 : 0x0d1117, 1);
}

function getPlotlyLayout(){
  const dark=isDarkTheme();
  return{
    paper_bgcolor:'transparent',
    plot_bgcolor:dark?'rgba(1,3,6,0.5)':'rgba(245,246,248,0.8)',
    font:{color:dark?'#8b949e':'#52596e',size:9.5,family:'IBM Plex Mono'},
    margin:{t:18,r:10,b:32,l:44},
    xaxis:{gridcolor:dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.06)',zeroline:false,linecolor:dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'},
    yaxis:{gridcolor:dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.06)',zeroline:false,linecolor:dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'},
    legend:{bgcolor:'transparent',font:{size:9}},showlegend:true,
  };
}

function refreshPlotsTheme(){
  const base=getPlotlyLayout();
  const ids=['pEnergy','pRDF','pXRD','pBonds','pCoord','pADF'];
  ids.forEach(id=>{
    try{
      Plotly.relayout(id,{
        paper_bgcolor:base.paper_bgcolor,
        plot_bgcolor:base.plot_bgcolor,
        'font.color':base.font.color,
        'xaxis.gridcolor':base.xaxis.gridcolor,
        'yaxis.gridcolor':base.yaxis.gridcolor,
        'xaxis.linecolor':base.xaxis.linecolor,
        'yaxis.linecolor':base.yaxis.linecolor,
      });
    }catch(_){}
  });
}

// ══════════════════════════════════════════════════════════════════════
// MODULE 1: ELEMENT DATABASE (subset + common; extendable)
// ══════════════════════════════════════════════════════════════════════
const EL = {
  H:{Z:1,name:'Hydrogen',mass:1.008,color:'#ffffff',r:0.25,eps:0.00074,sig:2.40,eneg:2.20},
  C:{Z:6,name:'Carbon',mass:12.011,color:'#909090',r:0.38,eps:0.00347,sig:3.47,eneg:2.55},
  N:{Z:7,name:'Nitrogen',mass:14.007,color:'#3050f8',r:0.36,eps:0.00664,sig:3.26,eneg:3.04},
  O:{Z:8,name:'Oxygen',mass:15.999,color:'#ff2020',r:0.34,eps:0.00657,sig:3.12,eneg:3.44},
  Ne:{Z:10,name:'Neon',mass:20.18,color:'#b3e0ff',r:0.34,eps:0.00296,sig:2.74,eneg:0},
  Na:{Z:11,name:'Sodium',mass:22.99,color:'#ab5cf2',r:0.55,eps:0.005,sig:2.50,eneg:0.93},
  Mg:{Z:12,name:'Magnesium',mass:24.305,color:'#8aff00',r:0.50,eps:0.00773,sig:2.74,eneg:1.31},
  Al:{Z:13,name:'Aluminium',mass:26.982,color:'#bfa6a6',r:0.50,eps:0.0222,sig:2.55,eneg:1.61},
  Si:{Z:14,name:'Silicon',mass:28.086,color:'#f0c060',r:0.48,eps:0.020,sig:2.10,eneg:1.90},
  S:{Z:16,name:'Sulfur',mass:32.06,color:'#ffff30',r:0.44,eps:0.0109,sig:3.59,eneg:2.58},
  Cl:{Z:17,name:'Chlorine',mass:35.45,color:'#1ff01f',r:0.44,eps:0.0105,sig:3.52,eneg:3.16},
  Ar:{Z:18,name:'Argon',mass:39.948,color:'#80d4ff',r:0.45,eps:0.01032,sig:3.405,eneg:0},
  K:{Z:19,name:'Potassium',mass:39.098,color:'#8f40d4',r:0.62,eps:0.0036,sig:3.40,eneg:0.82},
  Ca:{Z:20,name:'Calcium',mass:40.078,color:'#3dff00',r:0.58,eps:0.010,sig:2.97,eneg:1.00},
  Ti:{Z:22,name:'Titanium',mass:47.867,color:'#bfc2c7',r:0.52,eps:0.028,sig:2.83,eneg:1.54},
  Fe:{Z:26,name:'Iron',mass:55.845,color:'#e06633',r:0.50,eps:0.050,sig:2.48,eneg:1.83},
  Cu:{Z:29,name:'Copper',mass:63.546,color:'#c88033',r:0.48,eps:0.040,sig:2.34,eneg:1.90},
  Zn:{Z:30,name:'Zinc',mass:65.38,color:'#7d80b0',r:0.48,eps:0.035,sig:2.46,eneg:1.65},
  Ba:{Z:56,name:'Barium',mass:137.327,color:'#00c900',r:0.63,eps:0.016,sig:3.59,eneg:0.89},
};

// ══════════════════════════════════════════════════════════════════════
// MODULE 2: CRYSTAL ENGINE — lattice math, frac↔cart, prototypes
// ══════════════════════════════════════════════════════════════════════
let CRYSTAL = {
  lattice: { a:4.046, b:4.046, c:4.046, alpha:90, beta:90, gamma:90 },
  spaceGroup: { num:225, symbol:'Fm-3m', crystal:'Cubic', system:'cubic' },
  atoms: [],    // {el, x,y,z (frac), cx,cy,cz (cart), id}
  M: null,
  Minv: null,
};

function degToRad(d){ return d*Math.PI/180; }

function buildOrthoMatrix(a,b,c,al,be,ga){
  const cosAl=Math.cos(degToRad(al)), cosBe=Math.cos(degToRad(be)), cosGa=Math.cos(degToRad(ga));
  const sinGa=Math.sin(degToRad(ga));
  const V=Math.sqrt(Math.max(0, 1-cosAl*cosAl-cosBe*cosBe-cosGa*cosGa+2*cosAl*cosBe*cosGa));
  return [
    [a, b*cosGa, c*cosBe],
    [0, b*sinGa, c*(cosAl-cosBe*cosGa)/sinGa],
    [0, 0, c*V/sinGa]
  ];
}

function mat3Inv(m){
  const [[a,b,c],[d,e,f],[g,h,i]]=m;
  const det=a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
  if(Math.abs(det)<1e-12)return null;
  return [
    [(e*i-f*h)/det,(c*h-b*i)/det,(b*f-c*e)/det],
    [(f*g-d*i)/det,(a*i-c*g)/det,(c*d-a*f)/det],
    [(d*h-e*g)/det,(b*g-a*h)/det,(a*e-b*d)/det]
  ];
}

function fracToCart(fx,fy,fz, M){
  const m=M||CRYSTAL.M;
  return [m[0][0]*fx+m[0][1]*fy+m[0][2]*fz, m[1][0]*fx+m[1][1]*fy+m[1][2]*fz, m[2][0]*fx+m[2][1]*fy+m[2][2]*fz];
}
function cartToFrac(cx,cy,cz, Minv){
  const m=Minv||CRYSTAL.Minv;
  return [m[0][0]*cx+m[0][1]*cy+m[0][2]*cz, m[1][0]*cx+m[1][1]*cy+m[1][2]*cz, m[2][0]*cx+m[2][1]*cy+m[2][2]*cz];
}

function updateMatrices(){
  const{a,b,c,alpha,beta,gamma}=CRYSTAL.lattice;
  CRYSTAL.M=buildOrthoMatrix(a,b,c,alpha,beta,gamma);
  CRYSTAL.Minv=mat3Inv(CRYSTAL.M);
}

function calcVolume(){
  const{a,b,c,alpha,beta,gamma}=CRYSTAL.lattice;
  const cosAl=Math.cos(degToRad(alpha)),cosBe=Math.cos(degToRad(beta)),cosGa=Math.cos(degToRad(gamma));
  return a*b*c*Math.sqrt(Math.max(0, 1-cosAl*cosAl-cosBe*cosBe-cosGa*cosGa+2*cosAl*cosBe*cosGa));
}

function cartesianiseAll(){
  CRYSTAL.atoms.forEach(a=>{ [a.cx,a.cy,a.cz]=fracToCart(a.x,a.y,a.z); });
}

function wrapFrac(f){ return ((f%1)+1)%1; }

const PROTOTYPES = {
  sc:{ a:3.0, sg:221, sgSym:'Pm-3m', atoms:[{el:'A',x:0,y:0,z:0}], crystal:'Cubic', bElements:0 },
  fcc:{ a:4.046, sg:225, sgSym:'Fm-3m', atoms:[{el:'A',x:0,y:0,z:0}], crystal:'Cubic', bElements:0 },
  bcc:{ a:2.87, sg:229, sgSym:'Im-3m', atoms:[{el:'A',x:0,y:0,z:0}], crystal:'Cubic', bElements:0 },
  diamond:{ a:5.43, sg:227, sgSym:'Fd-3m', atoms:[{el:'A',x:0,y:0,z:0},{el:'A',x:.25,y:.25,z:.25}], crystal:'Cubic', bElements:0 },
  hcp:{ a:3.21, c:5.21, sg:194, sgSym:'P6_3/mmc', atoms:[{el:'A',x:1/3,y:2/3,z:.25},{el:'A',x:2/3,y:1/3,z:.75}], crystal:'Hexagonal', bElements:0 },
  nacl:{ a:5.64, sg:225, sgSym:'Fm-3m', atoms:[{el:'A',x:0,y:0,z:0},{el:'B',x:.5,y:.5,z:.5}], crystal:'Cubic', bElements:1 },
  zincblende:{ a:5.43, sg:216, sgSym:'F-43m', atoms:[{el:'A',x:0,y:0,z:0},{el:'B',x:.25,y:.25,z:.25}], crystal:'Cubic', bElements:1 },
  perovskite:{ a:3.905, sg:221, sgSym:'Pm-3m', atoms:[{el:'A',x:.5,y:.5,z:.5},{el:'B',x:0,y:0,z:0},{el:'C',x:.5,y:0,z:0},{el:'C',x:0,y:.5,z:0},{el:'C',x:0,y:0,z:.5}], crystal:'Cubic', bElements:2 },
  spinel:{ a:8.09, sg:227, sgSym:'Fd-3m',
    atoms:[{el:'A',x:0,y:0,z:0},{el:'A',x:.25,y:.25,z:.25},{el:'B',x:.625,y:.625,z:.625},{el:'B',x:.875,y:.875,z:.875},{el:'C',x:.25,y:.25,z:.5},{el:'C',x:0,y:.5,z:.25}], crystal:'Cubic', bElements:2 },
  rutile:{ a:4.59, b:4.59, c:2.96, sg:136, sgSym:'P4_2/mnm', atoms:[{el:'A',x:0,y:0,z:0},{el:'A',x:.5,y:.5,z:.5},{el:'B',x:.3,y:.3,z:0},{el:'B',x:.7,y:.7,z:0},{el:'B',x:.2,y:.8,z:.5},{el:'B',x:.8,y:.2,z:.5}], crystal:'Tetragonal', bElements:1 },
  graphite:{ a:2.464, b:2.464, c:6.71, gamma:120, sg:194, sgSym:'P6_3/mmc', atoms:[{el:'A',x:0,y:0,z:.25},{el:'A',x:1/3,y:2/3,z:.25},{el:'A',x:0,y:0,z:.75},{el:'A',x:2/3,y:1/3,z:.75}], crystal:'Hexagonal', bElements:0 },
  custom:{ a:5.0, sg:1, sgSym:'P1', atoms:[], crystal:'Triclinic', bElements:0 },
};

// Database quick-load presets (Build + Database tab)
const DB_PRESETS = {
  mp_Al: { proto:'fcc', elA:'Al', a:4.046, note:'Al FCC' },
  mp_Fe: { proto:'bcc', elA:'Fe', a:2.87, note:'Fe BCC' },
  mp_Si: { proto:'diamond', elA:'Si', a:5.43, note:'Si Diamond' },
  mp_NaCl: { proto:'nacl', elA:'Na', elB:'Cl', a:5.64, note:'NaCl' },
  mp_TiO2: { proto:'rutile', elA:'Ti', elB:'O', a:4.59, c:2.96, note:'TiO₂ Rutile' },
  mp_BaTiO3: { proto:'perovskite', elA:'Ba', elB:'Ti', elC:'O', a:3.99, note:'BaTiO₃' },
  mp_MgAl2O4: { proto:'spinel', elA:'Mg', elB:'Al', elC:'O', a:8.09, note:'Spinel MgAl₂O₄' },
  mp_graphite: { proto:'graphite', elA:'C', a:2.464, c:6.71, note:'Graphite' },
};

function quickLoad(name){
  const p = DB_PRESETS[name];
  if (!p) return;
  const protoEl = document.getElementById('protoSelect');
  if (protoEl) protoEl.value = p.proto;
  const elA = document.getElementById('elA');
  if (elA) elA.value = p.elA || 'Al';
  const elB = document.getElementById('elB');
  if (elB && p.elB) elB.value = p.elB;
  const elC = document.getElementById('elC');
  if (elC && p.elC) elC.value = p.elC;
  const lpA = document.getElementById('lpA');
  if (lpA && p.a) lpA.value = p.a;
  const lpC = document.getElementById('lpC');
  if (lpC && p.c) lpC.value = p.c;
  applyPrototype(p.proto);
  log('Quick load: ' + (p.note || name), 'info');
}

function crystalSystemFromSG(n){
  if(n>=1&&n<=2)return'triclinic';
  if(n>=3&&n<=15)return'monoclinic';
  if(n>=16&&n<=74)return'orthorhombic';
  if(n>=75&&n<=142)return'tetragonal';
  if(n>=143&&n<=167)return'trigonal';
  if(n>=168&&n<=194)return'hexagonal';
  if(n>=195&&n<=230)return'cubic';
  return'triclinic';
}

function expandProtoAtoms(p, name, elA, elB, elC){
  const atoms=[];
  const elMap={A:elA,B:elB,C:elC};
  const fccTrans=[[0,0,0],[.5,.5,0],[.5,0,.5],[0,.5,.5]];
  const bccTrans=[[0,0,0],[.5,.5,.5]];
  let translations=[[0,0,0]];
  if(['fcc','nacl','zincblende','diamond','spinel'].includes(name)) translations=fccTrans;
  else if(['bcc'].includes(name)) translations=bccTrans;
  // rutile, graphite: no extra translations

  p.atoms.forEach(base=>{
    const el=elMap[base.el]||base.el;
    translations.forEach(t=>{
      const x=wrapFrac(base.x+t[0]);
      const y=wrapFrac(base.y+t[1]);
      const z=wrapFrac(base.z+t[2]);
      if(!atoms.find(a=>Math.abs(a.x-x)<0.001&&Math.abs(a.y-y)<0.001&&Math.abs(a.z-z)<0.001))
        atoms.push({el,x,y,z,id:atoms.length});
    });
  });
  return atoms;
}

function saveForMD(){
  try {
    if (!CRYSTAL.M || !CRYSTAL.atoms.length) return;
    const M = CRYSTAL.M;
    const vecs = [
      [M[0][0], M[1][0], M[2][0]],
      [M[0][1], M[1][1], M[2][1]],
      [M[0][2], M[1][2], M[2][2]],
    ];
    const atoms = CRYSTAL.atoms.map(a => ({ x: a.cx, y: a.cy, z: a.cz, role: a.el }));
    localStorage.setItem('smad-structure-for-md', JSON.stringify({ atoms, vecs }));
  } catch (e) {}
}

function log(msg,type=''){
  const con=document.getElementById('con');
  if(!con) return;
  const s=document.createElement('span');
  if(type)s.className=type;
  s.textContent='> '+msg;
  con.appendChild(document.createTextNode('\n'));
  con.appendChild(s);
  con.scrollTop=con.scrollHeight;
}

function updateStats(){
  const N=CRYSTAL.atoms.length;
  const sg=CRYSTAL.spaceGroup;
  const V=calcVolume();
  const elems=[...new Set(CRYSTAL.atoms.map(a=>a.el))];
  const formula=elems.map(e=>e+CRYSTAL.atoms.filter(a=>a.el===e).length).join('');
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  set('hudSG', sg.symbol||'—');
  set('hudN', String(N));
  set('hudV', (isFinite(V)?V.toFixed(2):'—')+' Å³');
  set('hudA', CRYSTAL.lattice.a.toFixed(3)+' Å');
  set('hudB', CRYSTAL.lattice.b.toFixed(3)+' Å');
  set('hudC', CRYSTAL.lattice.c.toFixed(3)+' Å');
  set('statSG', (sg.symbol||'—')+' (#'+(sg.num||'—')+')');
  set('statFormula', formula||'—');
  set('statV', isFinite(V)?V.toFixed(2):'—');
  set('navSG', (sg.symbol||'P1')+' (#'+(sg.num||1)+')');
  set('navNAtoms', N+' atoms');
  set('rpN', String(N));
  set('rpSpec', elems.join(', ')||'—');
  set('rpSym', sg.symbol||'—');
  set('rpSys', sg.crystal||'—');
  saveForMD();
}

function applyPrototype(name){
  const p=PROTOTYPES[name]; if(!p) return;
  const elA=(document.getElementById('elA')?.value||'Al').trim()||'Al';
  const elB=(document.getElementById('elB')?.value||'O').trim()||'O';
  const elC=(document.getElementById('elC')?.value||'O').trim()||'O';

  CRYSTAL.lattice.a=p.a||4.0;
  CRYSTAL.lattice.b=p.b||p.a||4.0;
  CRYSTAL.lattice.c=p.c||p.a||4.0;
  CRYSTAL.lattice.alpha=p.alpha||90;
  CRYSTAL.lattice.beta=p.beta||90;
  CRYSTAL.lattice.gamma=p.gamma||(name==='hcp'||name==='graphite'?120:90);

  const lpA=document.getElementById('lpA'); const lpB=document.getElementById('lpB'); const lpC=document.getElementById('lpC');
  if(lpA) lpA.value=CRYSTAL.lattice.a.toFixed(3);
  if(lpB) lpB.value=CRYSTAL.lattice.b.toFixed(3);
  if(lpC) lpC.value=CRYSTAL.lattice.c.toFixed(3);
  const lpAlpha=document.getElementById('lpAlpha'); const lpBeta=document.getElementById('lpBeta'); const lpGamma=document.getElementById('lpGamma');
  if(lpAlpha) lpAlpha.value=CRYSTAL.lattice.alpha;
  if(lpBeta) lpBeta.value=CRYSTAL.lattice.beta;
  if(lpGamma) lpGamma.value=CRYSTAL.lattice.gamma;

  const elBRow=document.getElementById('elBRow'); const elCRow=document.getElementById('elCRow');
  if(elBRow) elBRow.style.display=p.bElements>=1?'flex':'none';
  if(elCRow) elCRow.style.display=p.bElements>=2?'flex':'none';

  CRYSTAL.atoms=[];
  updateMatrices();
  CRYSTAL.atoms=expandProtoAtoms(p,name,elA,elB,elC);
  cartesianiseAll();

  CRYSTAL.spaceGroup={num:p.sg, symbol:p.sgSym, crystal:p.crystal, system:crystalSystemFromSG(p.sg)};
  const sgInput=document.getElementById('sgInput');
  if(sgInput) sgInput.value=`${p.sgSym} (#${p.sg})`;

  updateStats();
  rebuildMeshes();
  buildAtomList();
  updateLatticeInfo();
  log(`Prototype: ${name} · ${CRYSTAL.atoms.length} atoms · SG ${p.sgSym}`, 'info');
}

function getLatticeSystemLabel(){
  const sys=CRYSTAL.spaceGroup.system||'triclinic';
  const map={cubic:'Cubic',tetragonal:'Tetragonal',orthorhombic:'Orthorhombic',hexagonal:'Hexagonal',trigonal:'Trigonal',monoclinic:'Monoclinic',triclinic:'Triclinic'};
  return map[sys]||'Unknown';
}
function updateLatticeInfo(){
  const V=calcVolume();
  const el=document.getElementById('latticeInfo');
  if(el) el.textContent=`${getLatticeSystemLabel()} · V = ${V.toFixed(2)} Å³`;
}
function updateLattice(){
  CRYSTAL.lattice.a=parseFloat(document.getElementById('lpA')?.value)||4.0;
  CRYSTAL.lattice.b=parseFloat(document.getElementById('lpB')?.value)||4.0;
  CRYSTAL.lattice.c=parseFloat(document.getElementById('lpC')?.value)||4.0;
  CRYSTAL.lattice.alpha=parseFloat(document.getElementById('lpAlpha')?.value)||90;
  CRYSTAL.lattice.beta=parseFloat(document.getElementById('lpBeta')?.value)||90;
  CRYSTAL.lattice.gamma=parseFloat(document.getElementById('lpGamma')?.value)||90;
  updateMatrices(); cartesianiseAll(); updateLatticeInfo(); updateStats(); rebuildMeshes();
}

function buildStructure(){ applyPrototype(document.getElementById('protoSelect')?.value||'fcc'); }
function rebuildFromProto(){ buildStructure(); }
function updateElementA(){ rebuildFromProto(); }

function clearAtoms(){ CRYSTAL.atoms=[]; rebuildMeshes(); buildAtomList(); updateStats(); log('Cleared atoms','warn'); }

function addManualAtoms(){
  const isFrac=document.getElementById('atom-frac')?.classList.contains('active');
  const txt=(isFrac?document.getElementById('fracCoords'):document.getElementById('cartCoords'))?.value||'';
  updateMatrices();
  txt.trim().split('\n').forEach(line=>{
    const p=line.trim().split(/\s+/); if(p.length<4) return;
    const el=p[0]; const a=parseFloat(p[1]), b=parseFloat(p[2]), c=parseFloat(p[3]);
    if(isNaN(a)||isNaN(b)||isNaN(c)) return;
    let x=a,y=b,z=c;
    if(!isFrac){ [x,y,z]=cartToFrac(a,b,c); }
    CRYSTAL.atoms.push({el,x:wrapFrac(x),y:wrapFrac(y),z:wrapFrac(z),id:CRYSTAL.atoms.length});
  });
  cartesianiseAll(); rebuildMeshes(); buildAtomList(); updateStats();
  log(`Added atoms. Total: ${CRYSTAL.atoms.length}`,'info');
}

function showAtomTab(id,btn){
  document.getElementById('atom-frac')?.classList.toggle('active',id==='frac');
  document.getElementById('atom-cart')?.classList.toggle('active',id==='cart');
  const bar=btn?.parentElement;
  if(bar) bar.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b===btn));
}
function showImportTab(id,btn){
  document.getElementById('imp-file')?.classList.toggle('active',id==='file');
  document.getElementById('imp-paste')?.classList.toggle('active',id==='paste');
  const bar=btn?.parentElement;
  if(bar) bar.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b===btn));
}

// ══════════════════════════════════════════════════════════════════════
// MODULE 9: THREE.JS INSTANCED RENDERER (minimal)
// ══════════════════════════════════════════════════════════════════════
let VIZ = {
  renderer:null,scene:null,camera:null,
  instanceMeshes:{},cellMesh:null,axesHelper:null,
  rotX:0.3,rotY:0.5,zoom:1.0,
  mouse:{down:false,lastX:0,lastY:0},
  autoRot:true,
};

function initThree(){
  const wrap=document.getElementById('threeWrap');
  const W=wrap.clientWidth||800,H=wrap.clientHeight||500;
  VIZ.renderer=new THREE.WebGLRenderer({canvas:document.getElementById('threeCanvas'),antialias:true,alpha:false,preserveDrawingBuffer:true});
  VIZ.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  VIZ.renderer.setClearColor(isDarkTheme()?0x010306:0x0d1117,1);
  VIZ.renderer.setSize(W,H);
  VIZ.camera=new THREE.PerspectiveCamera(50,W/H,0.1,2000);
  VIZ.camera.position.z=60;
  VIZ.scene=new THREE.Scene();
  VIZ.scene.add(new THREE.AmbientLight(0x304060,0.7));
  const d1=new THREE.DirectionalLight(0xffffff,0.8);d1.position.set(2,3,4);VIZ.scene.add(d1);
  const d2=new THREE.DirectionalLight(0x00aaff,0.35);d2.position.set(-3,-2,-2);VIZ.scene.add(d2);
  const d3=new THREE.DirectionalLight(0xffaa00,0.2);d3.position.set(1,-3,2);VIZ.scene.add(d3);
  // X=red, Y=green, Z=blue axes at origin (center of cell)
  VIZ.axesHelper = new THREE.AxesHelper(6);
  VIZ.axesHelper.position.set(0, 0, 0);
  VIZ.scene.add(VIZ.axesHelper);
  setupVizMouse();
  startVizLoop();
}

const _dummy=new THREE.Object3D();
function rebuildMeshes(){
  if(!VIZ.renderer) return;
  Object.values(VIZ.instanceMeshes).forEach(m=>{VIZ.scene.remove(m);m.geometry.dispose();m.material.dispose();});
  VIZ.instanceMeshes={};
  if(VIZ.cellMesh){VIZ.scene.remove(VIZ.cellMesh);VIZ.cellMesh.geometry.dispose();VIZ.cellMesh=null;}
  if(!CRYSTAL.atoms.length) return;

  const scale=parseFloat(document.getElementById('atomScale')?.value)||0.4;
  const byEl={};
  CRYSTAL.atoms.forEach((a,i)=>{if(!byEl[a.el])byEl[a.el]=[];byEl[a.el].push(i);});
  const cx=CRYSTAL.lattice.a/2,cy=CRYSTAL.lattice.b/2,cz=CRYSTAL.lattice.c/2;

  Object.entries(byEl).forEach(([el,idxArr])=>{
    const elData=EL[el]||{r:0.4,color:'#aaaaaa'};
    const baseR=elData.r*2.5*scale;
    const geo=new THREE.SphereGeometry(baseR,14,10);
    const mat=new THREE.MeshPhongMaterial({color:new THREE.Color(elData.color),shininess:80,specular:new THREE.Color(0.3,0.3,0.3)});
    const mesh=new THREE.InstancedMesh(geo,mat,idxArr.length);
    mesh.userData={el,indices:idxArr};
    VIZ.instanceMeshes[el]=mesh;
    VIZ.scene.add(mesh);
    idxArr.forEach((atomIdx,localIdx)=>{
      const a=CRYSTAL.atoms[atomIdx];
      _dummy.position.set(a.cx-cx,a.cy-cy,a.cz-cz);
      _dummy.updateMatrix();
      mesh.setMatrixAt(localIdx,_dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate=true;
  });
  buildCellMesh(cx,cy,cz);
}

function buildCellMesh(cx,cy,cz){
  if(!CRYSTAL.M)return;
  const v=(fx,fy,fz)=>{
    const[x,y,z]=fracToCart(fx,fy,fz);
    return new THREE.Vector3(x-cx,y-cy,z-cz);
  };
  const pts=[v(0,0,0),v(1,0,0),v(1,1,0),v(0,1,0),v(0,0,1),v(1,0,1),v(1,1,1),v(0,1,1)];
  const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const positions=[];
  edges.forEach(([i,j])=>positions.push(pts[i].x,pts[i].y,pts[i].z,pts[j].x,pts[j].y,pts[j].z));
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  VIZ.cellMesh=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0x00d4c8,opacity:0.35,transparent:true}));
  VIZ.scene.add(VIZ.cellMesh);
}

function setupVizMouse(){
  const canvas=document.getElementById('threeCanvas');
  canvas.addEventListener('mousedown',e=>{VIZ.mouse.down=true;VIZ.mouse.lastX=e.clientX;VIZ.mouse.lastY=e.clientY;});
  window.addEventListener('mousemove',e=>{
    if(!VIZ.mouse.down)return;
    const dx=e.clientX-VIZ.mouse.lastX,dy=e.clientY-VIZ.mouse.lastY;
    VIZ.rotY+=dx*0.008;VIZ.rotX+=dy*0.008;
    VIZ.mouse.lastX=e.clientX;VIZ.mouse.lastY=e.clientY;
  });
  window.addEventListener('mouseup',()=>{VIZ.mouse.down=false;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();VIZ.zoom*=e.deltaY>0?.92:1.09;VIZ.zoom=Math.max(.1,Math.min(10,VIZ.zoom));},{passive:false});
  window.addEventListener('resize',resizeViz);
}
function resizeViz(){
  const wrap=document.getElementById('threeWrap');
  if(!wrap||!VIZ.renderer||!VIZ.camera)return;
  const W=wrap.clientWidth,H=wrap.clientHeight;
  VIZ.renderer.setSize(W,H);
  VIZ.camera.aspect=W/H;VIZ.camera.updateProjectionMatrix();
}
function startVizLoop(){
  const loop=()=>{
    requestAnimationFrame(loop);
    if(VIZ.autoRot&&!VIZ.mouse.down)VIZ.rotY+=0.004;
    VIZ.scene.rotation.x=VIZ.rotX;VIZ.scene.rotation.y=VIZ.rotY;
    VIZ.camera.position.z=60/VIZ.zoom;
    VIZ.renderer.render(VIZ.scene,VIZ.camera);
  };
  loop();
}
function resetCam(){VIZ.rotX=0.3;VIZ.rotY=0.5;VIZ.zoom=1.0;}
function toggleAutoRot(){VIZ.autoRot=!VIZ.autoRot;document.getElementById('autoRotBtn')?.classList.toggle('on',VIZ.autoRot);}
function toggleCell(){
  if(!VIZ.cellMesh){ rebuildMeshes(); return; }
  const on=VIZ.cellMesh.visible=!VIZ.cellMesh.visible;
  document.getElementById('cellBtn')?.classList.toggle('on',on);
}
function toggleAxes(){
  if(!VIZ.axesHelper) return;
  VIZ.axesHelper.visible = !VIZ.axesHelper.visible;
  document.getElementById('axesBtn')?.classList.toggle('on',VIZ.axesHelper.visible);
}

// ══════════════════════════════════════════════════════════════════════
// MODULE 10: PLOTLY (minimal placeholders)
// ══════════════════════════════════════════════════════════════════════
const PL={
  ...getPlotlyLayout(),
};
const PC={responsive:true,displayModeBar:false};
function initPlots(){
  const L=(xl,yl)=>{const b=getPlotlyLayout();return {...b,xaxis:{...b.xaxis,title:{text:xl,font:{size:9}}},yaxis:{...b.yaxis,title:{text:yl,font:{size:9}}}};};
  Plotly.newPlot('pEnergy',[{x:[],y:[],name:'Best',mode:'lines+markers',line:{color:'#1a6fba',width:2},marker:{size:4,color:'#1a6fba'}}],L('Generation','Energy (eV/atom)'),PC);
  Plotly.newPlot('pRDF',[{x:[],y:[],name:'g(r)',mode:'lines',line:{color:'#1a6fba',width:2},fill:'tozeroy',fillcolor:'rgba(26,111,186,0.08)'}],L('r (Å)','g(r)'),PC);
  Plotly.newPlot('pXRD',[{x:[],y:[],name:'I',mode:'lines',line:{color:'#c47b00',width:1.5},fill:'tozeroy',fillcolor:'rgba(196,123,0,0.07)'}],{...L('2θ (°)','Intensity (%)'),showlegend:false},PC);
  Plotly.newPlot('pBonds',[{x:[],type:'histogram',name:'Bond lengths',marker:{color:'rgba(26,111,186,0.6)',line:{color:'rgba(26,111,186,0.9)',width:1}}}],{...L('Bond length (Å)','Count'),showlegend:false},PC);
  Plotly.newPlot('pCoord',[{x:[],y:[],name:'CN',type:'bar',marker:{color:'rgba(196,123,0,0.7)',line:{color:'rgba(196,123,0,1)',width:1}}}],{...L('Coordination #','Count'),showlegend:false},PC);
  Plotly.newPlot('pADF',[{x:[],y:[],name:'P(θ)',mode:'lines',line:{color:'#6a3daa',width:2},fill:'tozeroy',fillcolor:'rgba(106,61,170,0.07)'}],L('Angle (°)','P(θ)'),PC);
  refreshPlotsTheme();
}
function showPlot(name,btn){
  const map={energy:'pEnergy',rdf:'pRDF',xrd:'pXRD',bonds:'pBonds',coord:'pCoord',adf:'pADF'};
  document.querySelectorAll('.ppane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(b=>b.classList.remove('active'));
  document.getElementById(map[name])?.classList.add('active');
  btn?.classList.add('active');
}

// Atom list UI
function buildAtomList(){
  const list=document.getElementById('atomList');
  if(!list) return;
  const atoms=CRYSTAL.atoms.slice(0,200);
  list.innerHTML=atoms.map((a,i)=>{
    const elData=EL[a.el]||{color:'#aaaaaa'};
    return`<div class="atom-row" data-id="${i}">
      <div class="atom-swatch" style="background:${elData.color}"></div>
      <div class="atom-sym">${a.el}</div>
      <div class="atom-info">(${a.x.toFixed(3)}, ${a.y.toFixed(3)}, ${a.z.toFixed(3)})</div>
    </div>`;
  }).join('')+(CRYSTAL.atoms.length>200?`<div class="atom-row"><div class="atom-info" style="color:var(--text3)">… ${CRYSTAL.atoms.length-200} more atoms</div></div>`:'');
}

function switchMainTab(name,btn){
  document.querySelectorAll('.main-tab-content').forEach(t=>t.style.display='none');
  document.querySelectorAll('.ntab').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).style.display='block';
  btn?.classList.add('active');
}

// Startup loading animation
const LOAD_STEPS=['Initialising crystal engine...','Loading element database...','Starting WebGL renderer...','Loading default structure...','Ready!'];
let loadStep=0;
function loadTick(){
  if(loadStep>=LOAD_STEPS.length){ document.getElementById('loading')?.classList.add('gone'); return; }
  const t=document.getElementById('l-txt'); const p=document.getElementById('l-prog');
  if(t) t.textContent=LOAD_STEPS[loadStep];
  if(p) p.style.width=((loadStep+1)/LOAD_STEPS.length*100)+'%';
  loadStep++;
  setTimeout(loadTick,170);
}

window.addEventListener('DOMContentLoaded',()=>{
  applyTheme(getSavedTheme());
  loadTick();
  setTimeout(()=>{
    updateMatrices();
    initThree();
    initPlots();
    applyPrototype('fcc');
    log('CrystalForge ready', 'info');
  },200);
});

// Expose functions used by inline onclick handlers.
Object.assign(window, {
  toggleTheme,
  switchMainTab, showPlot,
  applyPrototype, updateLattice, buildStructure, rebuildFromProto, updateElementA,
  showAtomTab, showImportTab,
  clearAtoms, addManualAtoms,
  quickLoad,
  resetCam, toggleAutoRot, toggleCell, toggleAxes,
});
