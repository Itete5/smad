// ── COLOUR / SHAPE per family (matching reference image)
// el=green circle, al=green circle(darker), cu=blue diamond, fe=orange square,
// hy=green circle(large), ot=purple inverted-triangle, hf=yellow-green star
const FAM_COL={el:'#4c8f3f',al:'#3a7a30',cu:'#4a90d9',fe:'#e0a020',hy:'#5aaa5a',ot:'#bb55cc',hf:'#aacc44'};
const FAM_SHP={el:'circle',al:'circle',cu:'diamond',fe:'square',hy:'circle',ot:'itriangle',hf:'star'};
const FAM_NAME={el:'Elemental',al:'A15/Alloy',cu:'Cuprate',fe:'Iron-based',hy:'Hydride',ot:'Other/Fullerene',hf:'Heavy-Fermion'};

const COOLANTS=[
  {name:'liq. CF₄',T:145,color:'#55bbff',dash:[6,3]},
  {name:'liq. N₂', T:77, color:'#44dd99',dash:[8,4]},
  {name:'liq. H₂', T:20.3,color:'#88aaff',dash:[4,3]},
  {name:'liq. He', T:4.2, color:'#aaaaff',dash:[3,3]}
];

// DATA: carefully placed to match the reference image
// Shape per fam, correct Tc and year from literature + reference
const DATA=[
  // Elementals (green circles)
  {name:'Hg',       form:'Hg',           tc:4.15, yr:1911, fam:'el', pres:'Ambient',  pGPa:0,   str:'Rhombohedral',      doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'First superconductor – Kamerlingh Onnes'},
  {name:'Pb',       form:'Pb',           tc:7.2,  yr:1913, fam:'el', pres:'Ambient',  pGPa:0,   str:'FCC',               doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'Nb',       form:'Nb',           tc:9.25, yr:1930, fam:'el', pres:'Ambient',  pGPa:0,   str:'BCC',               doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Highest Tc ambient elemental'},
  // A15 / Alloys (darker green circles)
  {name:'NbN',      form:'NbN',          tc:16.0, yr:1941, fam:'al', pres:'Ambient',  pGPa:0,   str:'Rock salt B1',      doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'V₃Si',     form:'V₃Si',         tc:17.1, yr:1953, fam:'al', pres:'Ambient',  pGPa:0,   str:'A15',               doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'Nb₃Sn',    form:'Nb₃Sn',        tc:18.3, yr:1954, fam:'al', pres:'Ambient',  pGPa:0,   str:'A15 Pm-3n',         doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Key magnet wire'},
  {name:'Nb₃Ge',    form:'Nb₃Ge',        tc:23.2, yr:1973, fam:'al', pres:'Ambient',  pGPa:0,   str:'A15 Pm-3n',         doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Record 1973–1986'},
  {name:'MgB₂',     form:'MgB₂',         tc:39.0, yr:2001, fam:'al', pres:'Ambient',  pGPa:0,   str:'AlB₂-type P6/mmm',  doi:'https://doi.org/10.1038/35065039', note:'Two-gap BCS'},
  // Cuprates (blue diamonds)
  {name:'LaBaCuO',  form:'LaBaCuO',      tc:30.0, yr:1986, fam:'cu', pres:'Ambient',  pGPa:0,   str:'K₂NiF₄-type',       doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Bednorz & Müller – Nobel 1987'},
  {name:'LaSrCuO',  form:'LaSrCuO',      tc:35.0, yr:1987, fam:'cu', pres:'Ambient',  pGPa:0,   str:'K₂NiF₄-type',       doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'YBaCuO',   form:'YBa₂Cu₃O₇',   tc:92.0, yr:1987, fam:'cu', pres:'Ambient',  pGPa:0,   str:'Pmmm perovskite',   doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'First LN₂ superconductor'},
  {name:'BiSrCaCuO',form:'BiSrCaCuO',    tc:110,  yr:1988, fam:'cu', pres:'Ambient',  pGPa:0,   str:'Bi-cuprate',        doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Bi-2223, 3 CuO₂ planes'},
  {name:'TlBaCaCuO',form:'TlBaCaCuO',    tc:125,  yr:1988, fam:'cu', pres:'Ambient',  pGPa:0,   str:'Tl-cuprate',        doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Tl-2223'},
  {name:'HgBaCaCuO',form:'HgBa₂Ca₂Cu₃O₈',tc:133, yr:1993, fam:'cu', pres:'Ambient',  pGPa:0,   str:'Hg-cuprate P4/mmm', doi:'https://doi.org/10.1038/363056a0', note:'Highest ambient Tc cuprate'},
  {name:'HgTlBaCaCuO',form:'HgTlBaCaCuO',tc:138, yr:1995, fam:'cu', pres:'Ambient',  pGPa:0,   str:'Hg-Tl cuprate',     doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'HgBaCaCuO\n@30GPa',form:'HgBa₂Ca₂Cu₃O₈',tc:164,yr:1994,fam:'cu',pres:'~30 GPa',pGPa:30,str:'Hg-cuprate HP', doi:'https://doi.org/10.1016/0038-1098(94)90960-1', note:'Highest confirmed Tc'},
  {name:'BKBO',     form:'Ba₁₋ₓKₓBiO₃', tc:30.0, yr:1988, fam:'cu', pres:'Ambient',  pGPa:0,   str:'Perovskite cubic',  doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Oxide, no CuO₂ planes'},
  // Iron-based (orange squares)
  {name:'LaOFFeAs', form:'LaOFFeAs',     tc:26.0, yr:2008, fam:'fe', pres:'Ambient',  pGPa:0,   str:'1111 P4/nmm',       doi:'https://doi.org/10.1021/ja800073m', note:'Kamihara et al.'},
  {name:'SrFFeAs',  form:'SmFeAsO',      tc:55.0, yr:2008, fam:'fe', pres:'Ambient',  pGPa:0,   str:'1111 P4/nmm',       doi:'https://doi.org/10.1038/nature07045', note:'Highest 1111 Tc'},
  {name:'(Ba,K)Fe₂As₂',form:'(Ba,K)Fe₂As₂',tc:38.0,yr:2008,fam:'fe',pres:'Ambient',pGPa:0,   str:'122 I4/mmm',        doi:'https://doi.org/10.1038/nature07223', note:''},
  {name:'FeSe lm',  form:'FeSe',         tc:100,  yr:2015, fam:'fe', pres:'Monolayer',pGPa:0,   str:'PbO-type',          doi:'https://doi.org/10.1038/nmat4153', note:'Monolayer FeSe on STO'},
  {name:'LaOFeP',   form:'LaOFeP',       tc:4.0,  yr:2006, fam:'fe', pres:'Ambient',  pGPa:0,   str:'1111',              doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'First oxypnictide SC'},
  // Hydrides (green circles, large)
  {name:'H₂S @155GPa',form:'H₃S',       tc:203,  yr:2015, fam:'hy', pres:'~155 GPa', pGPa:155, str:'Im-3m',             doi:'https://doi.org/10.1038/nature14964', note:'Drozdov et al.'},
  {name:'LaH₁₀ @170GPa',form:'LaH₁₀',  tc:250,  yr:2019, fam:'hy', pres:'~170 GPa', pGPa:170, str:'Fm-3m sodalite',    doi:'https://doi.org/10.1038/s41586-019-1201-8', note:'Clathrate cage structure'},
  // Other / Fullerenes (purple inverted triangles)
  {name:'K₃C₆₀',   form:'K₃C₆₀',       tc:18.0, yr:1991, fam:'ot', pres:'Ambient',  pGPa:0,   str:'FCC fullerene Fm-3m',doi:'https://doi.org/10.1038/350600a0', note:'Alkali-doped fulleride'},
  {name:'RbCsC₆₀', form:'RbCsC₆₀',     tc:33.0, yr:1991, fam:'ot', pres:'Ambient',  pGPa:0,   str:'FCC fullerene',     doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'Cs₃C₆₀\n@1.4GPa',form:'Cs₃C₆₀',tc:38.0,yr:1991,fam:'ot',pres:'~1.4 GPa', pGPa:1.4, str:'A15 fullerene',     doi:'https://doi.org/10.1038/nature07265', note:''},
  {name:'YbPd₂B₂C',form:'YbPd₂B₂C',    tc:23.0, yr:1994, fam:'ot', pres:'Ambient',  pGPa:0,   str:'LuNi₂B₂C-type',    doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Borocarbide'},
  {name:'Li @33GPa',form:'Li',           tc:20.0, yr:2002, fam:'ot', pres:'~33 GPa',  pGPa:33,  str:'OC40',             doi:'https://doi.org/10.1126/science.1071152', note:''},
  {name:'PuCoGa₅', form:'PuCoGa₅',      tc:18.5, yr:2002, fam:'ot', pres:'Ambient',  pGPa:0,   str:'HoCoGa₅-type',     doi:'https://doi.org/10.1038/nature00969', note:'Actinide SC'},
  {name:'PuRhGa₅', form:'PuRhGa₅',      tc:8.7,  yr:2003, fam:'ot', pres:'Ambient',  pGPa:0,   str:'HoCoGa₅-type',     doi:'https://doi.org/10.1038/nphys007', note:''},
  {name:'CeCoIn₅', form:'CeCoIn₅',      tc:2.3,  yr:2001, fam:'ot', pres:'Ambient',  pGPa:0,   str:'HoCoGa₅-type',     doi:'https://doi.org/10.1088/0953-2048/14/6/101', note:'d-wave heavy fermion'},
  {name:'Sr₂RuO₄', form:'Sr₂RuO₄',      tc:1.5,  yr:1994, fam:'ot', pres:'Ambient',  pGPa:0,   str:'Layered perovskite',doi:'https://doi.org/10.1038/372532a0', note:'Chiral p-wave candidate'},
  {name:'NdNiO',   form:'NdNiO₂',       tc:11.0, yr:2019, fam:'ot', pres:'Ambient',  pGPa:0,   str:'Infinite-layer',   doi:'https://doi.org/10.1038/s41586-019-1870-x', note:'Nickelate SC'},
  {name:'diamond',  form:'diamond (B)',   tc:4.0,  yr:2004, fam:'ot', pres:'Ambient',  pGPa:0,   str:'Cubic diamond',    doi:'https://doi.org/10.1038/nature02449', note:'B-doped diamond'},
  {name:'CNT',      form:'CNT',          tc:15.0, yr:2001, fam:'ot', pres:'~0',       pGPa:0,   str:'Carbon nanotube',  doi:'https://doi.org/10.1126/science.1065672', note:''},
  // Heavy Fermion (yellow-green stars)
  {name:'CeCu₂Si₂',form:'CeCu₂Si₂',    tc:0.6,  yr:1979, fam:'hf', pres:'Ambient',  pGPa:0,   str:'ThCr₂Si₂-type',    doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'First heavy-fermion SC'},
  {name:'UBe₁₃',   form:'UBe₁₃',       tc:0.85, yr:1983, fam:'hf', pres:'Ambient',  pGPa:0,   str:'NaZn₁₃-type',      doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
  {name:'UPt₃',    form:'UPt₃',         tc:0.54, yr:1984, fam:'hf', pres:'Ambient',  pGPa:0,   str:'MgZn₂-type',       doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:'Multi-component order param.'},
  {name:'UPd₂Al₃', form:'UPd₂Al₃',     tc:2.0,  yr:1991, fam:'hf', pres:'Ambient',  pGPa:0,   str:'PrNi₂Al₃-type',    doi:'https://commons.wikimedia.org/wiki/File:Timeline_of_Superconductivity_from_1900_to_2015.svg', note:''},
];

// Crystal structures for 2×2×2 supercell
// atoms: fractional coords in ONE unit cell [0..1)
// bonds: pairs of atom indices within one cell
// poly: {center idx, vertex indices, rgba color}
// polyAtomEl: which element is polyhedral center (for coloring)
const EC={Hg:'#b8b8d0',Pb:'#575961',Nb:'#73c2c9',V:'#a6a6ab',Sn:'#668080',
  N:'#3050f8',H:'#e8e8ff',La:'#70d4ff',Ba:'#00c900',Cu:'#c88033',O:'#ff0d0d',
  Y:'#94ffff',Bi:'#9e4fb5',Sr:'#00cc00',Tl:'#a6544d',Sm:'#8fdc00',Fe:'#e06633',
  As:'#bd80e3',K:'#8f40d4',Se:'#ffa100',Mg:'#8aff00',B:'#ffb5b5',C:'#909090',
  Cs:'#8f40d4',Rb:'#ff0000',Ru:'#248f8f',Ge:'#668f8f',Bi2:'#9e4fb5',
  Ce:'#ffffc7',U:'#008fff',Pd:'#aaa0e0',Al:'#bfc2c7',Si:'#f0c8a0',Be:'#c2ff00',
  Nd:'#00c8ff',Ni:'#50d050',Zn:'#7d80b0',Pu:'#dd4422',Co:'#f090a0',Ga:'#c28f8f',
  Rh:'#8080c8'};

const STRUCTS={
  // Hg - rhombohedral (shown as simple)
  'Hg':{atoms:[{el:'Hg',r:.52,x:0,y:0,z:0},{el:'Hg',r:.52,x:.5,y:.5,z:.5}],bonds:[[0,1]],poly:[{c:0,v:[1],col:'#b8b8d040'}],lat:'Rhombohedral a=3.005Å α=70.74°'},
  'Pb':{atoms:[{el:'Pb',r:.58,x:0,y:0,z:0},{el:'Pb',r:.58,x:.5,y:.5,z:0},{el:'Pb',r:.58,x:.5,y:0,z:.5},{el:'Pb',r:.58,x:0,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],poly:[{c:0,v:[1,2,3],col:'#57596155'}],lat:'FCC a=4.951Å'},
  'Nb':{atoms:[{el:'Nb',r:.52,x:0,y:0,z:0},{el:'Nb',r:.52,x:.5,y:.5,z:.5}],bonds:[[0,1]],poly:[{c:0,v:[1],col:'#73c2c944'}],lat:'BCC a=3.301Å'},
  'NbN':{atoms:[{el:'Nb',r:.50,x:0,y:0,z:0},{el:'N',r:.30,x:.5,y:0,z:0},{el:'N',r:.30,x:0,y:.5,z:0},{el:'N',r:.30,x:0,y:0,z:.5},{el:'Nb',r:.50,x:.5,y:.5,z:0},{el:'Nb',r:.50,x:.5,y:0,z:.5},{el:'Nb',r:.50,x:0,y:.5,z:.5},{el:'N',r:.30,x:.5,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[4,1],[4,2],[4,7],[5,1],[5,3],[5,7],[6,2],[6,3],[6,7]],poly:[{c:0,v:[1,2,3],col:'#73c2c944'},{c:7,v:[4,5,6],col:'#3050f844'}],lat:'Rock salt a=4.392Å'},
  'V₃Si':{atoms:[{el:'Si',r:.50,x:0,y:0,z:0},{el:'Si',r:.50,x:.5,y:.5,z:.5},{el:'V',r:.46,x:.25,y:0,z:.5},{el:'V',r:.46,x:.75,y:0,z:.5},{el:'V',r:.46,x:.5,y:.25,z:0},{el:'V',r:.46,x:.5,y:.75,z:0},{el:'V',r:.46,x:0,y:.5,z:.25},{el:'V',r:.46,x:0,y:.5,z:.75}],bonds:[[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]],poly:[{c:0,v:[2,3,4,5,6,7],col:'#a6a6ab55'},{c:1,v:[2,3,4,5,6,7],col:'#a6a6ab55'}],lat:'A15 a=4.718Å Pm-3n'},
  'Nb₃Sn':{atoms:[{el:'Sn',r:.54,x:0,y:0,z:0},{el:'Sn',r:.54,x:.5,y:.5,z:.5},{el:'Nb',r:.48,x:.25,y:0,z:.5},{el:'Nb',r:.48,x:.75,y:0,z:.5},{el:'Nb',r:.48,x:.5,y:.25,z:0},{el:'Nb',r:.48,x:.5,y:.75,z:0},{el:'Nb',r:.48,x:0,y:.5,z:.25},{el:'Nb',r:.48,x:0,y:.5,z:.75}],bonds:[[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]],poly:[{c:0,v:[2,3,4,5,6,7],col:'#66808055'},{c:1,v:[2,3,4,5,6,7],col:'#66808055'}],lat:'A15 a=5.289Å Pm-3n'},
  'Nb₃Ge':{atoms:[{el:'Ge',r:.50,x:0,y:0,z:0},{el:'Ge',r:.50,x:.5,y:.5,z:.5},{el:'Nb',r:.48,x:.25,y:0,z:.5},{el:'Nb',r:.48,x:.75,y:0,z:.5},{el:'Nb',r:.48,x:.5,y:.25,z:0},{el:'Nb',r:.48,x:.5,y:.75,z:0},{el:'Nb',r:.48,x:0,y:.5,z:.25},{el:'Nb',r:.48,x:0,y:.5,z:.75}],bonds:[[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]],poly:[{c:0,v:[2,3,4,5,6,7],col:'#668f8f55'},{c:1,v:[2,3,4,5,6,7],col:'#668f8f55'}],lat:'A15 a=5.17Å Pm-3n'},
  'MgB₂':{atoms:[{el:'Mg',r:.52,x:.333,y:.667,z:.5},{el:'B',r:.30,x:0,y:0,z:0},{el:'B',r:.30,x:.667,y:.333,z:0},{el:'B',r:.30,x:.333,y:.667,z:0},{el:'Mg',r:.52,x:.667,y:.333,z:.5}],bonds:[[1,2],[2,3],[1,3],[0,1],[0,2],[0,3],[4,1],[4,2],[4,3]],poly:[{c:0,v:[1,2,3],col:'#8aff0055'},{c:4,v:[1,2,3],col:'#8aff0055'}],lat:'P6/mmm a=3.086Å c=3.524Å'},
  'LaBaCuO':{atoms:[{el:'Cu',r:.42,x:0,y:0,z:0},{el:'O',r:.28,x:.5,y:0,z:0},{el:'O',r:.28,x:0,y:.5,z:0},{el:'O',r:.28,x:0,y:0,z:.18},{el:'O',r:.28,x:0,y:0,z:-.18},{el:'La',r:.58,x:.5,y:.5,z:.36}],bonds:[[0,1],[0,2],[0,3],[0,4]],poly:[{c:0,v:[1,2,3,4],col:'#c8803345'}],lat:'I4/mmm a=3.79Å c=13.2Å'},
  'LaSrCuO':{atoms:[{el:'Cu',r:.42,x:0,y:0,z:0},{el:'O',r:.28,x:.5,y:0,z:0},{el:'O',r:.28,x:0,y:.5,z:0},{el:'O',r:.28,x:0,y:0,z:.18},{el:'O',r:.28,x:0,y:0,z:-.18},{el:'Sr',r:.58,x:.5,y:.5,z:.36}],bonds:[[0,1],[0,2],[0,3],[0,4]],poly:[{c:0,v:[1,2,3,4],col:'#c8803345'}],lat:'I4/mmm a=3.77Å c=13.2Å'},
  'YBaCuO':{atoms:[{el:'Y',r:.54,x:.5,y:.5,z:.5},{el:'Ba',r:.62,x:.5,y:.5,z:.18},{el:'Ba',r:.62,x:.5,y:.5,z:.82},{el:'Cu',r:.42,x:0,y:0,z:0},{el:'Cu',r:.42,x:0,y:0,z:.35},{el:'O',r:.28,x:.5,y:0,z:0},{el:'O',r:.28,x:0,y:.5,z:0},{el:'O',r:.28,x:0,y:0,z:.16},{el:'O',r:.28,x:.5,y:0,z:.35},{el:'O',r:.28,x:0,y:.5,z:.35}],bonds:[[3,5],[3,6],[3,7],[4,7],[4,8],[4,9]],poly:[{c:3,v:[5,6,7],col:'#c8803350'},{c:4,v:[7,8,9],col:'#c8803350'}],lat:'Pmmm a=3.82 b=3.88 c=11.68Å'},
  'BiSrCaCuO':{atoms:[{el:'Cu',r:.42,x:.5,y:.5,z:.5},{el:'Cu',r:.42,x:.5,y:.5,z:.3},{el:'O',r:.28,x:0,y:.5,z:.5},{el:'O',r:.28,x:.5,y:0,z:.5},{el:'O',r:.28,x:0,y:.5,z:.3},{el:'O',r:.28,x:.5,y:0,z:.3},{el:'Sr',r:.58,x:.5,y:.5,z:.72},{el:'Bi',r:.62,x:.5,y:.5,z:.9}],bonds:[[0,2],[0,3],[1,4],[1,5],[0,6],[6,7]],poly:[{c:0,v:[2,3],col:'#c8803345'},{c:1,v:[4,5],col:'#c8803335'}],lat:'I4/mmm a=5.41Å c=37Å'},
  'TlBaCaCuO':{atoms:[{el:'Cu',r:.42,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5},{el:'O',r:.28,x:.5,y:0,z:.5},{el:'Ba',r:.58,x:.5,y:.5,z:.72},{el:'Tl',r:.62,x:.5,y:.5,z:.9},{el:'Ca',r:.52,x:.5,y:.5,z:.35}],bonds:[[0,1],[0,2],[0,5],[3,4]],poly:[{c:0,v:[1,2,5],col:'#c8803345'}],lat:'I4/mmm a=5.84Å c=35.9Å'},
  'HgBaCaCuO':{atoms:[{el:'Hg',r:.54,x:.5,y:.5,z:0},{el:'Ba',r:.58,x:.5,y:.5,z:.2},{el:'Cu',r:.42,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5},{el:'O',r:.28,x:.5,y:0,z:.5},{el:'Ca',r:.52,x:.5,y:.5,z:.35}],bonds:[[0,1],[1,5],[2,3],[2,4],[2,5]],poly:[{c:2,v:[3,4,5],col:'#c8803345'}],lat:'P4/mmm a=3.85Å c=15.9Å'},
  'HgTlBaCaCuO':{atoms:[{el:'Hg',r:.54,x:.5,y:.5,z:0},{el:'Tl',r:.58,x:.5,y:.5,z:.05},{el:'Ba',r:.58,x:.5,y:.5,z:.22},{el:'Cu',r:.42,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5},{el:'O',r:.28,x:.5,y:0,z:.5},{el:'Ca',r:.52,x:.5,y:.5,z:.35}],bonds:[[0,2],[1,2],[2,6],[3,4],[3,5],[3,6]],poly:[{c:3,v:[4,5,6],col:'#c8803345'}],lat:'Hg-Tl cuprate'},
  'HgBaCaCuO\n@30GPa':{atoms:[{el:'Hg',r:.54,x:.5,y:.5,z:0},{el:'Ba',r:.58,x:.5,y:.5,z:.2},{el:'Cu',r:.42,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5},{el:'O',r:.28,x:.5,y:0,z:.5},{el:'Ca',r:.52,x:.5,y:.5,z:.35}],bonds:[[0,1],[1,5],[2,3],[2,4],[2,5]],poly:[{c:2,v:[3,4,5],col:'#c8803345'}],lat:'P4/mmm compressed ~30GPa'},
  'BKBO':{atoms:[{el:'Ba',r:.60,x:0,y:0,z:0},{el:'Bi',r:.60,x:.5,y:.5,z:.5},{el:'O',r:.28,x:.5,y:0,z:0},{el:'O',r:.28,x:0,y:.5,z:0},{el:'O',r:.28,x:0,y:0,z:.5}],bonds:[[1,2],[1,3],[1,4],[0,2],[0,3],[0,4]],poly:[{c:1,v:[2,3,4],col:'#9e4fb555'}],lat:'Cubic perovskite a=4.28Å'},
  'LaOFFeAs':{atoms:[{el:'Fe',r:.44,x:0,y:0,z:0},{el:'As',r:.46,x:.5,y:.5,z:.15},{el:'As',r:.46,x:.5,y:.5,z:-.15},{el:'La',r:.58,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5}],bonds:[[0,1],[0,2],[3,4]],poly:[{c:0,v:[1,2],col:'#e0662244'}],lat:'P4/nmm a=4.03Å c=8.74Å'},
  'SrFFeAs':{atoms:[{el:'Fe',r:.44,x:0,y:0,z:0},{el:'As',r:.46,x:.5,y:.5,z:.15},{el:'As',r:.46,x:.5,y:.5,z:-.15},{el:'Sm',r:.58,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5}],bonds:[[0,1],[0,2],[3,4]],poly:[{c:0,v:[1,2],col:'#e0662244'}],lat:'P4/nmm a=3.94Å c=8.49Å'},
  '(Ba,K)Fe₂As₂':{atoms:[{el:'Ba',r:.58,x:0,y:0,z:0},{el:'Fe',r:.44,x:.5,y:0,z:.25},{el:'Fe',r:.44,x:0,y:.5,z:.25},{el:'As',r:.46,x:.5,y:.5,z:.35},{el:'As',r:.46,x:.5,y:.5,z:.15}],bonds:[[0,1],[0,2],[1,3],[1,4],[2,3],[2,4]],poly:[{c:1,v:[3,4],col:'#e0662244'},{c:2,v:[3,4],col:'#e0662244'}],lat:'I4/mmm a=3.96Å c=13.2Å'},
  'FeSe lm':{atoms:[{el:'Fe',r:.44,x:0,y:0,z:0},{el:'Se',r:.50,x:.5,y:.5,z:.23},{el:'Se',r:.50,x:.5,y:.5,z:-.23}],bonds:[[0,1],[0,2]],poly:[{c:0,v:[1,2],col:'#ffa10044'}],lat:'P4/nmm a=3.77Å c=5.52Å'},
  'LaOFeP':{atoms:[{el:'Fe',r:.44,x:0,y:0,z:0},{el:'As',r:.44,x:.5,y:.5,z:.14},{el:'As',r:.44,x:.5,y:.5,z:-.14},{el:'La',r:.58,x:.5,y:.5,z:.5},{el:'O',r:.28,x:0,y:.5,z:.5}],bonds:[[0,1],[0,2],[3,4]],poly:[{c:0,v:[1,2],col:'#e0662244'}],lat:'P4/nmm (P analog)'},
  'H₂S @155GPa':{atoms:[{el:'S',r:.52,x:0,y:0,z:0},{el:'H',r:.20,x:.5,y:.5,z:0},{el:'H',r:.20,x:.5,y:0,z:.5},{el:'H',r:.20,x:0,y:.5,z:.5},{el:'S',r:.52,x:.5,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[4,1],[4,2],[4,3],[0,4]],poly:[{c:0,v:[1,2,3],col:'#ffff3055'},{c:4,v:[1,2,3],col:'#ffff3055'}],lat:'Im-3m a=3.08Å @155GPa'},
  'LaH₁₀ @170GPa':{atoms:[{el:'La',r:.58,x:0,y:0,z:0},{el:'H',r:.18,x:.25,y:.25,z:0},{el:'H',r:.18,x:.75,y:.75,z:0},{el:'H',r:.18,x:.25,y:0,z:.25},{el:'H',r:.18,x:0,y:.25,z:.25},{el:'H',r:.18,x:.75,y:0,z:.75},{el:'H',r:.18,x:0,y:.75,z:.75},{el:'H',r:.18,x:.5,y:0,z:0},{el:'H',r:.18,x:0,y:.5,z:0},{el:'H',r:.18,x:0,y:0,z:.5}],bonds:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[1,3],[3,4],[1,4],[7,8],[8,9],[7,9]],poly:[{c:0,v:[1,2,3,4,5,6,7,8,9],col:'#70d4ff44'}],lat:'Fm-3m clathrate cage'},
  'K₃C₆₀':{atoms:[{el:'K',r:.52,x:0,y:0,z:0},{el:'C',r:.30,x:.25,y:.25,z:.25},{el:'C',r:.30,x:.5,y:.5,z:.25},{el:'C',r:.30,x:.25,y:.5,z:.5},{el:'C',r:.30,x:.5,y:.25,z:.5},{el:'K',r:.52,x:.5,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[5,1],[5,2]],poly:[{c:0,v:[1,2,3],col:'#8f40d444'},{c:5,v:[1,2,3],col:'#8f40d444'}],lat:'Fm-3m a=14.24Å'},
  'RbCsC₆₀':{atoms:[{el:'Rb',r:.54,x:0,y:0,z:0},{el:'C',r:.30,x:.25,y:.25,z:.25},{el:'C',r:.30,x:.5,y:.5,z:.25},{el:'C',r:.30,x:.25,y:.5,z:.5},{el:'Cs',r:.58,x:.5,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[4,1],[4,2],[4,3]],poly:[{c:0,v:[1,2,3],col:'#8f40d444'}],lat:'FCC fullerene'},
  'Cs₃C₆₀\n@1.4GPa':{atoms:[{el:'Cs',r:.58,x:0,y:0,z:0},{el:'C',r:.30,x:.25,y:.0,z:.5},{el:'C',r:.30,x:.0,y:.25,z:.5},{el:'C',r:.30,x:.5,y:.25,z:.0},{el:'Cs',r:.58,x:.5,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[4,1],[4,2],[4,3]],poly:[{c:0,v:[1,2,3],col:'#8f40d444'}],lat:'A15 fullerene @1.4GPa'},
  'YbPd₂B₂C':{atoms:[{el:'Nb',r:.52,x:0,y:0,z:0},{el:'Pd',r:.52,x:.5,y:.0,z:.25},{el:'Pd',r:.52,x:.0,y:.5,z:.25},{el:'B',r:.28,x:.5,y:.5,z:.17},{el:'C',r:.30,x:.5,y:.5,z:.5}],bonds:[[0,1],[0,2],[1,3],[2,3],[3,4]],poly:[{c:0,v:[1,2],col:'#ffffc755'}],lat:'LuNi₂B₂C-type tetragonal'},
  'Li @33GPa':{atoms:[{el:'La',r:.44,x:0,y:0,z:0},{el:'La',r:.44,x:.5,y:.5,z:0},{el:'La',r:.44,x:.5,y:0,z:.5},{el:'La',r:.44,x:0,y:.5,z:.5}],bonds:[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],poly:[{c:0,v:[1,2,3],col:'#cc80ff44'}],lat:'OC40 @33GPa'},
  'PuCoGa₅':{atoms:[{el:'Pu',r:.54,x:0,y:0,z:0},{el:'Co',r:.44,x:.5,y:.5,z:.5},{el:'Ga',r:.48,x:.5,y:0,z:.3},{el:'Ga',r:.48,x:0,y:.5,z:.3},{el:'Ga',r:.48,x:.5,y:.5,z:.2}],bonds:[[0,2],[0,3],[0,4],[1,2],[1,3],[1,4]],poly:[{c:0,v:[2,3,4],col:'#dd442244'},{c:1,v:[2,3,4],col:'#f090a044'}],lat:'HoCoGa₅-type a=4.24Å c=6.78Å'},
  'PuRhGa₅':{atoms:[{el:'Pu',r:.54,x:0,y:0,z:0},{el:'Rh',r:.46,x:.5,y:.5,z:.5},{el:'Ga',r:.48,x:.5,y:0,z:.3},{el:'Ga',r:.48,x:0,y:.5,z:.3},{el:'Ga',r:.48,x:.5,y:.5,z:.2}],bonds:[[0,2],[0,3],[0,4],[1,2],[1,3],[1,4]],poly:[{c:0,v:[2,3,4],col:'#dd442244'},{c:1,v:[2,3,4],col:'#8080c844'}],lat:'HoCoGa₅-type'},
  'CeCoIn₅':{atoms:[{el:'Ce',r:.54,x:0,y:0,z:0},{el:'Co',r:.44,x:.5,y:.5,z:.5},{el:'Ga',r:.48,x:.5,y:0,z:.3},{el:'Ga',r:.48,x:0,y:.5,z:.3},{el:'Ga',r:.48,x:.5,y:.5,z:.2}],bonds:[[0,2],[0,3],[0,4],[1,2],[1,3],[1,4]],poly:[{c:0,v:[2,3,4],col:'#ffffc755'},{c:1,v:[2,3,4],col:'#f090a055'}],lat:'HoCoGa₅-type a=4.62Å c=7.55Å'},
  'Sr₂RuO₄':{atoms:[{el:'Ru',r:.44,x:0,y:0,z:0},{el:'Sr',r:.58,x:.5,y:.5,z:.35},{el:'O',r:.28,x:.5,y:0,z:0},{el:'O',r:.28,x:0,y:.5,z:0},{el:'O',r:.28,x:0,y:0,z:.25}],bonds:[[0,2],[0,3],[0,4],[1,4]],poly:[{c:0,v:[2,3,4],col:'#248f8f55'}],lat:'I4/mmm a=3.87Å c=12.74Å'},
  'NdNiO':{atoms:[{el:'Nd',r:.58,x:.5,y:.5,z:.5},{el:'Ni',r:.44,x:0,y:0,z:0},{el:'O',r:.28,x:.5,y:0,z:0},{el:'O',r:.28,x:0,y:.5,z:0},{el:'O',r:.28,x:0,y:0,z:.5}],bonds:[[1,2],[1,3],[1,4]],poly:[{c:1,v:[2,3,4],col:'#50d05055'}],lat:'Infinite-layer P4/mmm'},
  'diamond':{atoms:[{el:'C',r:.32,x:0,y:0,z:0},{el:'C',r:.32,x:.25,y:.25,z:.25},{el:'C',r:.32,x:.5,y:.5,z:0},{el:'C',r:.32,x:.75,y:.75,z:.25}],bonds:[[0,1],[1,2],[2,3],[0,3]],poly:[{c:0,v:[1,2,3],col:'#90909055'}],lat:'Fd-3m a=3.57Å (B-doped)'},
  'CNT':{atoms:[{el:'C',r:.30,x:0,y:0,z:0},{el:'C',r:.30,x:.333,y:0,z:0},{el:'C',r:.30,x:.167,y:.25,z:.12},{el:'C',r:.30,x:.5,y:.25,z:.12},{el:'C',r:.30,x:.667,y:0,z:0}],bonds:[[0,2],[1,2],[1,3],[3,4],[2,3]],poly:[{c:2,v:[0,1,3],col:'#90909044'}],lat:'Carbon nanotube (armchair)'},
  'CeCu₂Si₂':{atoms:[{el:'Ce',r:.54,x:0,y:0,z:0},{el:'Cu',r:.46,x:.5,y:0,z:.25},{el:'Cu',r:.46,x:0,y:.5,z:.25},{el:'Si',r:.44,x:.5,y:.5,z:.38}],bonds:[[0,1],[0,2],[1,3],[2,3]],poly:[{c:0,v:[1,2],col:'#ffffc755'},{c:3,v:[1,2],col:'#ffffc744'}],lat:'ThCr₂Si₂ I4/mmm a=4.09Å c=9.91Å'},
  'UBe₁₃':{atoms:[{el:'U',r:.54,x:0,y:0,z:0},{el:'Be',r:.28,x:.25,y:.25,z:.25},{el:'Be',r:.28,x:.75,y:.25,z:.25},{el:'Be',r:.28,x:.25,y:.75,z:.25},{el:'Be',r:.28,x:.25,y:.25,z:.75}],bonds:[[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[2,4],[3,4]],poly:[{c:0,v:[1,2,3,4],col:'#008fff44'}],lat:'NaZn₁₃-type'},
  'UPt₃':{atoms:[{el:'U',r:.54,x:0,y:0,z:0},{el:'Pt',r:.50,x:.5,y:0,z:.25},{el:'Pt',r:.50,x:0,y:.5,z:.25},{el:'Pt',r:.50,x:.333,y:.333,z:.25}],bonds:[[0,1],[0,2],[0,3],[1,2],[2,3]],poly:[{c:0,v:[1,2,3],col:'#008fff44'}],lat:'MgZn₂-type P6₃/mmc'},
  'UPd₂Al₃':{atoms:[{el:'U',r:.54,x:0,y:0,z:0},{el:'Pd',r:.52,x:.333,y:.667,z:.5},{el:'Pd',r:.52,x:.667,y:.333,z:.5},{el:'Al',r:.44,x:.333,y:.0,z:.25},{el:'Al',r:.44,x:.0,y:.333,z:.25},{el:'Al',r:.44,x:.0,y:.0,z:.5}],bonds:[[0,1],[0,2],[0,3],[0,4],[0,5]],poly:[{c:0,v:[1,2,3,4,5],col:'#008fff44'}],lat:'PrNi₂Al₃-type P6/mmm'},
};

let scale='linear',showFront=true,showCool=true,showLbl=true,activeFam='all';
let hovered=null,selected=null,activeTab='struct';
let sRot={x:.3,y:.5},sDrag=false,sLast={x:0,y:0};

const mainC=document.getElementById('mainCanvas');
const sC=document.getElementById('structCanvas');
const pC=document.getElementById('phaseCanvas');

function hexRgba(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;}
function h2rgb(h){return{r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}

window.setScale=s=>{scale=s;document.getElementById('b-lin').classList.toggle('active',s==='linear');document.getElementById('b-log').classList.toggle('active',s==='log');drawMain();};
window.tog=t=>{if(t==='front'){showFront=!showFront;document.getElementById('b-front').classList.toggle('active',showFront);}else if(t==='cool'){showCool=!showCool;document.getElementById('b-cool').classList.toggle('active',showCool);}else{showLbl=!showLbl;document.getElementById('b-lbl').classList.toggle('active',showLbl);}drawMain();};
window.flt=f=>{activeFam=f;['all','el','al','cu','fe','hy','ot','hf'].forEach(k=>document.getElementById('f-'+k)?.classList.toggle('active',k===f));drawMain();};
window.switchTab=t=>{activeTab=t;['struct','phase'].forEach(k=>{document.getElementById('tab-'+k).classList.toggle('active',k===t);document.getElementById(k+'Panel').style.display=k===t?'flex':'none';});if(t==='phase')drawPhase(selected||hovered);else drawStruct(selected||hovered);};

const PAD={l:62,r:80,t:22,b:46};
function tcY(tc,ch){
  if(scale==='log'){const lo=Math.log10(0.3),hi=Math.log10(320);return PAD.t+ch-(Math.log10(Math.max(tc,.3))-lo)/(hi-lo)*ch;}
  return PAD.t+ch-(tc/320)*ch;
}
function yrX(yr,cw){return PAD.l+(yr-1900)/125*cw;}
function filtered(){return activeFam==='all'?DATA:DATA.filter(d=>d.fam===activeFam);}

function drawShape(ctx,shape,x,y,r,col,alpha,stroke){
  ctx.beginPath();
  if(shape==='circle'){ctx.arc(x,y,r,0,Math.PI*2);}
  else if(shape==='diamond'){ctx.moveTo(x,y-r*1.3);ctx.lineTo(x+r*1.1,y);ctx.lineTo(x,y+r*1.3);ctx.lineTo(x-r*1.1,y);ctx.closePath();}
  else if(shape==='square'){ctx.rect(x-r*.95,y-r*.95,r*1.9,r*1.9);}
  else if(shape==='itriangle'){ctx.moveTo(x,y+r*1.2);ctx.lineTo(x+r*1.1,y-r*.8);ctx.lineTo(x-r*1.1,y-r*.8);ctx.closePath();}
  else if(shape==='star'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5-Math.PI/2,ao=a+Math.PI/5,x1=x+r*1.1*Math.cos(a),y1=y+r*1.1*Math.sin(a),x2=x+r*.45*Math.cos(ao),y2=y+r*.45*Math.sin(ao);if(i===0)ctx.moveTo(x1,y1);else ctx.lineTo(x1,y1);ctx.lineTo(x2,y2);}ctx.closePath();}
  ctx.fillStyle=hexRgba(col,alpha);ctx.fill();
  if(stroke){ctx.strokeStyle=hexRgba(col,Math.min(1,alpha+.3));ctx.lineWidth=stroke;ctx.stroke();}
}

function drawMain(){
  const W=document.getElementById('left').offsetWidth||620,H=document.getElementById('left').offsetHeight||500;
  mainC.width=W;mainC.height=H;
  const ctx=mainC.getContext('2d');
  const cw=W-PAD.l-PAD.r,ch=H-PAD.t-PAD.b;
  ctx.fillStyle='#07090f';ctx.fillRect(0,0,W,H);
  // grid
  [1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020].forEach(yr=>{
    const x=yrX(yr,cw);ctx.strokeStyle='rgba(255,255,255,0.055)';ctx.lineWidth=.5;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(x,PAD.t);ctx.lineTo(x,PAD.t+ch);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(180,200,230,0.4)';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(yr,x,PAD.t+ch+14);
  });
  const tks=scale==='log'?[0.3,1,3,10,30,100,300]:[0,50,100,150,200,250,300];
  tks.forEach(tc=>{
    const y=tcY(tc,ch);if(y<PAD.t-3||y>PAD.t+ch+3)return;
    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=.5;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+cw,y);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(180,200,230,0.4)';ctx.font='9px monospace';ctx.textAlign='right';ctx.fillText(tc,PAD.l-4,y+3);
  });
  // coolant lines (right side labels)
  if(showCool){COOLANTS.forEach(cl=>{
    const y=tcY(cl.T,ch);if(y<PAD.t||y>PAD.t+ch)return;
    ctx.setLineDash(cl.dash);ctx.strokeStyle=cl.color+'99';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+cw+60,y);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=cl.color;ctx.font='9px system-ui';ctx.textAlign='left';
    ctx.fillText('← '+cl.name,PAD.l+cw+4,y+3);
  });}
  // Room T line
  const yRoomT=tcY(293,ch);
  if(yRoomT>=PAD.t&&yRoomT<=PAD.t+ch){
    ctx.setLineDash([3,3]);ctx.strokeStyle='rgba(180,200,230,0.3)';ctx.lineWidth=.7;
    ctx.beginPath();ctx.moveTo(PAD.l,yRoomT);ctx.lineTo(PAD.l+cw+60,yRoomT);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(180,200,230,0.5)';ctx.font='9px system-ui';ctx.textAlign='left';ctx.fillText('← Room T',PAD.l+cw+4,yRoomT+3);
  }
  // Frontier
  if(showFront){
    const srt=[...DATA].sort((a,b)=>a.yr-b.yr);let mx=0,fr=[];
    srt.forEach(d=>{if(d.tc>mx){mx=d.tc;fr.push(d);}});
    if(fr.length>1){
      ctx.strokeStyle='rgba(80,160,80,0.55)';ctx.lineWidth=1.5;ctx.setLineDash([]);
      ctx.beginPath();fr.forEach((d,i)=>{const x=yrX(d.yr,cw),y=tcY(d.tc,ch);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.lineTo(yrX(2021,cw),tcY(fr[fr.length-1].tc,ch));ctx.stroke();
    }
  }
  // Points
  const fil=filtered();
  DATA.forEach(d=>{
    const x=yrX(d.yr,cw),y=tcY(d.tc,ch);
    const isF=fil.includes(d),isH=hovered===d,isSel=selected===d;
    const col=FAM_COL[d.fam]||'#888',shp=FAM_SHP[d.fam]||'circle';
    const al=isF?1:0.12,r=(isH||isSel)?7:5;
    if(isSel){const c=mainC.getContext('2d');c.beginPath();c.arc(x,y,r+5,0,Math.PI*2);c.fillStyle=hexRgba(col,.15);c.fill();}
    drawShape(ctx,shp,x,y,r,col,al*(isH||isSel?1:.85),(isH||isSel)?1.5:0);
    if(showLbl&&isF&&(isH||isSel||d.tc>15)){
      const lbl=d.name.replace('\n','');
      ctx.font='bold 8px system-ui';ctx.textAlign='left';
      const tw=ctx.measureText(lbl).width;
      ctx.fillStyle='rgba(5,8,18,0.85)';ctx.fillRect(x+7,y-9,tw+4,12);
      ctx.fillStyle=col;ctx.fillText(lbl,x+9,y+1);
    }
  });
  // Axes
  ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=.8;
  ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+ch);ctx.lineTo(PAD.l+cw,PAD.t+ch);ctx.stroke();
  ctx.fillStyle='rgba(180,200,230,0.45)';ctx.font='10px system-ui';ctx.textAlign='center';
  ctx.fillText('Year',PAD.l+cw/2,H-6);
  ctx.save();ctx.translate(12,PAD.t+ch/2);ctx.rotate(-Math.PI/2);ctx.fillText('Critical temperature Tc (K)',0,0);ctx.restore();
}

// ───── 3D supercell renderer ─────
function proj3d(x,y,z,cx,cy,sc,rx,ry){
  let x1=x*Math.cos(ry)-z*Math.sin(ry),z1=x*Math.sin(ry)+z*Math.cos(ry);
  let y1=y*Math.cos(rx)-z1*Math.sin(rx),z2=y*Math.sin(rx)+z1*Math.cos(rx);
  const fov=4,pz=fov+z2*0.5;
  return{px:cx+(x1/pz)*sc*fov,py:cy+(y1/pz)*sc*fov,z:z2};
}

function drawConvexFace(ctx,pts3,col){
  if(pts3.length<3)return;
  // sort by angle around centroid for correct polygon
  const cx2=pts3.reduce((s,p)=>s+p.px,0)/pts3.length;
  const cy2=pts3.reduce((s,p)=>s+p.py,0)/pts3.length;
  const sorted=[...pts3].sort((a,b)=>Math.atan2(a.py-cy2,a.px-cx2)-Math.atan2(b.py-cy2,b.px-cx2));
  ctx.beginPath();sorted.forEach((p,i)=>i?ctx.lineTo(p.px,p.py):ctx.moveTo(p.px,p.py));ctx.closePath();
  ctx.fillStyle=col;ctx.fill();
  ctx.strokeStyle=col.replace(/[\d.]+\)$/,'0.6)');ctx.lineWidth=0.7;ctx.stroke();
}

function drawStruct(d){
  const W=sC.offsetWidth||310,H=Math.max(sC.offsetHeight||230,200);
  sC.width=W;sC.height=H;
  const ctx=sC.getContext('2d');
  ctx.fillStyle='#060810';ctx.fillRect(0,0,W,H);
  document.getElementById('structTitle').textContent='2×2×2 Supercell — '+(d?d.name.replace('\n',' '):'click a point');
  if(!d){renderInfo('structInfo',null);return;}

  const key=d.name;
  const sd=STRUCTS[key]||STRUCTS[Object.keys(STRUCTS).find(k=>k.startsWith(d.form.slice(0,4)))||'Hg'];
  const atoms=sd.atoms,bonds=sd.bonds||[],polys=sd.poly||[];

  const cx=W/2,cy=H*0.48,sc=Math.min(W,H)*0.09;
  const rx=sRot.x,ry=sRot.y;
  const REPS=2; // 2×2×2

  // Generate supercell atoms
  const all=[];
  for(let ix=0;ix<REPS;ix++)for(let iy=0;iy<REPS;iy++)for(let iz=0;iz<REPS;iz++){
    atoms.forEach((a,ai)=>{
      const fx=(a.x+ix)/REPS,fy=(a.y+iy)/REPS,fz=(a.z+iz)/REPS;
      const p3=proj3d((fx-.5)*2,(fy-.5)*2,(fz-.5)*2,cx,cy,sc,rx,ry);
      all.push({...a,...p3,fx,fy,fz,ai,ix,iy,iz});
    });
  }
  all.sort((a,b)=>a.z-b.z);

  // Supercell box edges (2×2×2 outer)
  const bcorners=[];
  for(let i=0;i<8;i++){
    const bx=(i&1)?1:-1,by=(i&2)?1:-1,bz=(i&4)?1:-1;
    bcorners.push(proj3d(bx,by,bz,cx,cy,sc,rx,ry));
  }
  ctx.strokeStyle='rgba(80,120,200,0.18)';ctx.lineWidth=0.6;
  [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b])=>{
    ctx.beginPath();ctx.moveTo(bcorners[a].px,bcorners[a].py);ctx.lineTo(bcorners[b].px,bcorners[b].py);ctx.stroke();
  });
  // Inner cell lines (unit cell boundaries)
  ctx.strokeStyle='rgba(60,90,160,0.08)';ctx.lineWidth=.3;
  [[-.5,-.5,-.5,.5,-.5,-.5],[-.5,.5,-.5,.5,.5,-.5],[-.5,-.5,.5,.5,-.5,.5],[-.5,.5,.5,.5,.5,.5],
   [-.5,-.5,-.5,-.5,.5,-.5],[.5,-.5,-.5,.5,.5,-.5],[-.5,-.5,.5,-.5,.5,.5],[.5,-.5,.5,.5,.5,.5],
   [-.5,-.5,-.5,-.5,-.5,.5],[.5,-.5,-.5,.5,-.5,.5],[-.5,.5,-.5,-.5,.5,.5],[.5,.5,-.5,.5,.5,.5]
  ].forEach(([x1,y1,z1,x2,y2,z2])=>{
    const a=proj3d(x1,y1,z1,cx,cy,sc,rx,ry),b=proj3d(x2,y2,z2,cx,cy,sc,rx,ry);
    ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(b.px,b.py);ctx.stroke();
  });

  // Draw polyhedra (per unit cell repeat)
  for(let ix=0;ix<REPS;ix++)for(let iy=0;iy<REPS;iy++)for(let iz=0;iz<REPS;iz++){
    polys.forEach(poly=>{
      if(poly.v.length<2)return;
      const cAtom=atoms[poly.c];
      // get all face triangles from center to each pair of adjacent vertices
      const vPts=poly.v.map(vi=>{
        const a=atoms[vi];
        const fx=(a.x+ix)/REPS,fy=(a.y+iy)/REPS,fz=(a.z+iz)/REPS;
        return proj3d((fx-.5)*2,(fy-.5)*2,(fz-.5)*2,cx,cy,sc,rx,ry);
      });
      const cPt=(()=>{const a=cAtom;const fx=(a.x+ix)/REPS,fy=(a.y+iy)/REPS,fz=(a.z+iz)/REPS;return proj3d((fx-.5)*2,(fy-.5)*2,(fz-.5)*2,cx,cy,sc,rx,ry);})();
      // Draw faces as filled polygon
      if(vPts.length>=3){drawConvexFace(ctx,vPts,poly.col||'rgba(100,150,255,0.12)');}
      // Also draw from center to each edge
      vPts.forEach(vp=>{
        ctx.beginPath();ctx.moveTo(cPt.px,cPt.py);ctx.lineTo(vp.px,vp.py);
        ctx.strokeStyle=(poly.col||'rgba(100,150,255,0.4)').replace(/[\d.]+\)$/,'0.35)');ctx.lineWidth=0.5;ctx.stroke();
      });
    });
  }

  // Draw bonds (supercell)
  for(let ix=0;ix<REPS;ix++)for(let iy=0;iy<REPS;iy++)for(let iz=0;iz<REPS;iz++){
    bonds.forEach(([i,j])=>{
      const ai=atoms[i],aj=atoms[j];
      const pi=proj3d(((ai.x+ix)/REPS-.5)*2,((ai.y+iy)/REPS-.5)*2,((ai.z+iz)/REPS-.5)*2,cx,cy,sc,rx,ry);
      const pj=proj3d(((aj.x+ix)/REPS-.5)*2,((aj.y+iy)/REPS-.5)*2,((aj.z+iz)/REPS-.5)*2,cx,cy,sc,rx,ry);
      ctx.strokeStyle='rgba(200,220,255,0.25)';ctx.lineWidth=.9;
      ctx.beginPath();ctx.moveTo(pi.px,pi.py);ctx.lineTo(pj.px,pj.py);ctx.stroke();
    });
  }

  // Draw atoms (sorted by z)
  all.forEach(a=>{
    const col=EC[a.el]||'#aaaaaa',rgb=h2rgb(col);
    const r=Math.max(4,Math.min(14,a.r*sc*.7));
    const grad=ctx.createRadialGradient(a.px-r*.28,a.py-r*.28,r*.04,a.px,a.py,r);
    grad.addColorStop(0,`rgba(${Math.min(255,rgb.r+70)},${Math.min(255,rgb.g+70)},${Math.min(255,rgb.b+70)},1)`);
    grad.addColorStop(.55,`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
    grad.addColorStop(1,`rgba(${Math.max(0,rgb.r-55)},${Math.max(0,rgb.g-55)},${Math.max(0,rgb.b-55)},.9)`);
    ctx.beginPath();ctx.arc(a.px,a.py,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    ctx.beginPath();ctx.arc(a.px-r*.3,a.py-r*.3,r*.26,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.38)';ctx.fill();
    if(r>7){ctx.fillStyle='rgba(0,0,0,.65)';ctx.font=`bold ${Math.round(r*.68)}px system-ui`;ctx.textAlign='center';ctx.fillText(a.el.replace(/\d/g,''),a.px,a.py+r*.28);}
  });

  // ─── XYZ axes ───
  const axO=proj3d(-1,-1,-1,cx,cy,sc,rx,ry);
  const axX=proj3d(-1+1.4,-1,-1,cx,cy,sc,rx,ry);
  const axY=proj3d(-1,-1+1.4,-1,cx,cy,sc,rx,ry);
  const axZ=proj3d(-1,-1,-1+1.4,cx,cy,sc,rx,ry);
  const drawAxis=(end,col,lbl)=>{
    ctx.strokeStyle=col;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(axO.px,axO.py);ctx.lineTo(end.px,end.py);ctx.stroke();
    // arrowhead
    const ang=Math.atan2(end.py-axO.py,end.px-axO.px);
    const ar=6;
    ctx.beginPath();ctx.moveTo(end.px,end.py);
    ctx.lineTo(end.px-ar*Math.cos(ang-0.4),end.py-ar*Math.sin(ang-0.4));
    ctx.lineTo(end.px-ar*Math.cos(ang+0.4),end.py-ar*Math.sin(ang+0.4));
    ctx.closePath();ctx.fillStyle=col;ctx.fill();
    // label
    ctx.fillStyle=col;ctx.font='bold 11px system-ui';ctx.textAlign='center';
    ctx.fillText(lbl,end.px+(end.px-axO.px)*.18,end.py+(end.py-axO.py)*.18+4);
  };
  drawAxis(axX,'#ff4444','X');
  drawAxis(axY,'#44ff44','Y');
  drawAxis(axZ,'#4488ff','Z');

  // Element legend
  const els=[...new Set(atoms.map(a=>a.el))];
  let lx=6;const ly=H-9;
  els.forEach(el=>{
    const col=EC[el]||'#aaa';
    ctx.beginPath();ctx.arc(lx+4,ly-2,4,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
    ctx.fillStyle='rgba(160,190,230,.75)';ctx.font='8px system-ui';ctx.textAlign='left';
    ctx.fillText(el.replace(/\d/g,''),lx+10,ly+1);lx+=ctx.measureText(el.replace(/\d/g,'')).width+20;
  });

  renderInfo('structInfo',d,sd);
}

function drawPhase(d){
  const W=pC.offsetWidth||310,H=Math.max(pC.offsetHeight||220,190);
  pC.width=W;pC.height=H;
  const ctx=pC.getContext('2d');
  ctx.fillStyle='#060810';ctx.fillRect(0,0,W,H);
  document.getElementById('phaseTitle').textContent='T–P Phase'+(d?' — '+d.form:'');
  if(!d){renderInfo('phaseInfo',null);return;}
  const col=FAM_COL[d.fam]||'#88a';
  const PD={l:42,r:10,t:20,b:32},cw=W-PD.l-PD.r,ch=H-PD.t-PD.b,Tc=d.tc;
  const isHP=(d.pGPa||0)>1,maxP=isHP?Math.max((d.pGPa||0)*1.5,20):8;

  if(d.fam==='fe'||d.fam==='cu'){
    const afW=cw*.35;
    ctx.beginPath();ctx.moveTo(PD.l,PD.t+ch);
    for(let i=0;i<=50;i++){const t=i/50;ctx.lineTo(PD.l+t*afW,PD.t+ch-(1-t*t)*ch*.65);}
    ctx.lineTo(PD.l+afW,PD.t+ch);ctx.closePath();
    ctx.fillStyle='rgba(200,70,70,.13)';ctx.fill();
    ctx.strokeStyle='rgba(200,70,70,.4)';ctx.lineWidth=1;ctx.stroke();
    if(d.fam==='cu'){
      ctx.beginPath();ctx.moveTo(PD.l,PD.t);
      for(let i=0;i<=80;i++){const t=i/80;ctx.lineTo(PD.l+t*cw*.9,PD.t+ch-(1-t*.7)*ch*.82);}
      ctx.lineTo(PD.l+cw*.9,PD.t+ch);ctx.lineTo(PD.l,PD.t+ch);ctx.closePath();
      ctx.fillStyle='rgba(80,160,255,.06)';ctx.fill();
      ctx.setLineDash([3,3]);ctx.strokeStyle='rgba(80,160,255,.28)';ctx.lineWidth=.7;ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(80,160,255,.4)';ctx.font='8px system-ui';ctx.textAlign='left';ctx.fillText('Pseudogap',PD.l+cw*.48,PD.t+11);
    } else {
      ctx.fillStyle='rgba(200,150,60,.1)';ctx.fillRect(PD.l+afW*.5,PD.t+ch*.22,afW*.8,ch*.48);
      ctx.fillStyle='rgba(200,150,60,.38)';ctx.font='8px system-ui';ctx.textAlign='center';ctx.fillText('Nematic',PD.l+afW*.9,PD.t+ch*.44);
    }
    const ss=cw*(d.fam==='cu'?.18:.24),se=cw*(d.fam==='cu'?.84:.74);
    ctx.beginPath();
    for(let i=0;i<=100;i++){const t=i/100,xp=PD.l+ss+t*(se-ss),t2=2*t-1;i===0?ctx.moveTo(xp,PD.t+ch):ctx.lineTo(xp,PD.t+ch-Math.max(0,Tc*(1-t2*t2))/Tc*ch);}
    ctx.lineTo(PD.l+se,PD.t+ch);ctx.closePath();ctx.fillStyle=hexRgba(col,.2);ctx.fill();
    ctx.strokeStyle=col;ctx.lineWidth=1.5;
    ctx.beginPath();
    for(let i=0;i<=100;i++){const t=i/100,xp=PD.l+ss+t*(se-ss),t2=2*t-1;i===0?ctx.moveTo(xp,PD.t+ch):ctx.lineTo(xp,PD.t+ch-Math.max(0,Tc*(1-t2*t2))/Tc*ch);}
    ctx.stroke();
    ctx.fillStyle='rgba(200,70,70,.7)';ctx.font='8px system-ui';ctx.textAlign='center';ctx.fillText('AF',PD.l+afW*.45,PD.t+ch*.5);
    ctx.fillStyle=hexRgba(col,.75);ctx.fillText('SC',PD.l+ss+(se-ss)*.5,PD.t+ch*.8);
    ctx.fillStyle='rgba(160,170,200,.4)';ctx.fillText('Normal',PD.l+cw*.82,PD.t+ch*.25);
    if(d.fam==='fe'){ctx.fillStyle='rgba(255,220,80,.5)';ctx.font='8px system-ui';ctx.textAlign='right';ctx.fillText('s± gap (ARPES)',PD.l+cw,PD.t+12);}
    ctx.fillStyle='rgba(160,190,230,.38)';ctx.font='9px system-ui';ctx.textAlign='center';ctx.fillText(isHP?'P (GPa)':'Doping x',PD.l+cw/2,H-3);
  } else {
    const pts=[];
    for(let i=0;i<=100;i++){
      const pv=i/100*maxP;let tcP;
      if(isHP){const pO=(d.pGPa||0)*.72,sig=pO*.55;tcP=Tc*Math.exp(-.5*Math.pow((pv-pO)/sig,2));}
      else{tcP=Tc*Math.pow(Math.max(0,1-pv/maxP),.6);}
      pts.push([PD.l+i/100*cw,PD.t+ch-Math.max(0,tcP)/Tc*ch]);
    }
    ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.lineTo(PD.l+cw,PD.t+ch);ctx.lineTo(PD.l,PD.t+ch);ctx.closePath();
    ctx.fillStyle=hexRgba(col,.17);ctx.fill();
    ctx.strokeStyle=col;ctx.lineWidth=1.8;
    ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
    ctx.fillStyle=hexRgba(col,.7);ctx.font='8px system-ui';ctx.textAlign='center';ctx.fillText('SC',PD.l+cw*.2,PD.t+ch*.75);
    ctx.fillStyle='rgba(160,170,200,.4)';ctx.fillText('Normal',PD.l+cw*.72,PD.t+ch*.3);
    ctx.fillStyle='rgba(160,190,230,.38)';ctx.font='9px system-ui';ctx.textAlign='center';ctx.fillText('P (GPa)',PD.l+cw/2,H-3);
  }
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=.7;
  ctx.beginPath();ctx.moveTo(PD.l,PD.t);ctx.lineTo(PD.l,PD.t+ch);ctx.lineTo(PD.l+cw,PD.t+ch);ctx.stroke();
  [0,.5,1].forEach(f=>{ctx.fillStyle='rgba(160,190,230,.35)';ctx.font='8px monospace';ctx.textAlign='right';ctx.fillText(Math.round(Tc*f),PD.l-3,PD.t+ch-f*ch+3);});
  COOLANTS.forEach(cl=>{
    if(cl.T>=Tc)return;const y=PD.t+ch-cl.T/Tc*ch;
    ctx.setLineDash([3,3]);ctx.strokeStyle=cl.color+'55';ctx.lineWidth=.6;
    ctx.beginPath();ctx.moveTo(PD.l,y);ctx.lineTo(PD.l+cw,y);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=cl.color+'88';ctx.font='7px monospace';ctx.textAlign='right';ctx.fillText(cl.name,PD.l+cw-1,y-2);
  });
  ctx.fillStyle='rgba(160,190,230,.5)';ctx.font='8px system-ui';ctx.textAlign='left';ctx.fillText('Tc='+Tc+'K',PD.l+2,PD.t+10);
  ctx.save();ctx.translate(10,PD.t+ch/2);ctx.rotate(-Math.PI/2);ctx.fillText('T (K)',0,0);ctx.restore();
  renderInfo('phaseInfo',d);
}

function renderInfo(id,d,sd){
  const el=document.getElementById(id);
  if(!d){el.innerHTML=`<div style="color:#405080;font-size:10px">${id==='structInfo'?'Click a data point to view 2×2×2 supercell with polyhedra and XYZ axes.':'Click a point to see its phase diagram.'}</div>`;return;}
  const col=FAM_COL[d.fam]||'#88a';
  const gap={cu:'d-wave',fe:'s± (ARPES)',ot:d.form.includes('Ru')?'p-wave':'s-wave',el:'s-wave',al:'s-wave',hy:'s-wave (BCS)',hf:'unconventional'}[d.fam]||'s-wave';
  el.innerHTML=`<div class="pi-name" style="color:${col}">${d.name.replace('\n',' ')}</div>
    <div class="pi-row"><span class="pi-lbl">Formula</span><span class="pi-val">${d.form}</span></div>
    <div class="pi-row"><span class="pi-lbl">Tc</span><span class="pi-val">${d.tc} K</span></div>
    <div class="pi-row"><span class="pi-lbl">Year</span><span class="pi-val">${d.yr}</span></div>
    <div class="pi-row"><span class="pi-lbl">Pressure</span><span class="pi-val">${d.pres}</span></div>
    <div class="pi-row"><span class="pi-lbl">Structure</span><span class="pi-val">${sd?sd.lat:d.str}</span></div>
    <div class="pi-row"><span class="pi-lbl">Gap</span><span class="pi-val">${gap}</span></div>
    ${d.note?`<div class="pi-row"><span class="pi-lbl">Note</span><span class="pi-val">${d.note}</span></div>`:''}
    ${d.doi?`<a class="pi-link" href="${d.doi}" target="_blank" rel="noopener">Open publication ↗</a>`:''}`;
}

// hit test
function hit(mx,my){
  const W=mainC.width,H=mainC.height,cw=W-PAD.l-PAD.r,ch=H-PAD.t-PAD.b;
  let best=null,bd=14;
  DATA.forEach(d=>{const dx=mx-yrX(d.yr,cw),dy=my-tcY(d.tc,ch),dist=Math.sqrt(dx*dx+dy*dy);if(dist<bd){bd=dist;best=d;}});
  return best;
}

mainC.addEventListener('mousemove',e=>{
  const r=mainC.getBoundingClientRect();
  const mx=(e.clientX-r.left)*(mainC.width/r.width),my=(e.clientY-r.top)*(mainC.height/r.height);
  const pt=hit(mx,my);
  if(pt!==hovered){hovered=pt;drawMain();}
  if(!selected){if(activeTab==='struct')drawStruct(pt);else drawPhase(pt);}
  if(pt){
    const tt=document.getElementById('tooltip');
    tt.style.display='block';
    tt.style.left=Math.min(e.clientX-r.left+14,r.width-240)+'px';
    tt.style.top=Math.max(e.clientY-r.top-10,4)+'px';
    document.getElementById('tt-name').textContent=pt.name.replace('\n',' ');
    document.getElementById('tt-form').textContent=pt.form;
    document.getElementById('tt-tc').textContent=pt.tc+' K';
    document.getElementById('tt-yr').textContent=pt.yr;
    document.getElementById('tt-fam').textContent=FAM_NAME[pt.fam]||pt.fam;
    document.getElementById('tt-pres').textContent=pt.pres;
    document.getElementById('tt-str').textContent=pt.str;
    const lnk=document.getElementById('tt-link');lnk.href=pt.doi||'#';lnk.style.display=pt.doi?'block':'none';
  } else {
    const tr=document.getElementById('tooltip').getBoundingClientRect();
    if(!(e.clientX>=tr.left&&e.clientX<=tr.right&&e.clientY>=tr.top&&e.clientY<=tr.bottom))document.getElementById('tooltip').style.display='none';
  }
});
mainC.addEventListener('click',e=>{
  const r=mainC.getBoundingClientRect();
  const mx=(e.clientX-r.left)*(mainC.width/r.width),my=(e.clientY-r.top)*(mainC.height/r.height);
  const pt=hit(mx,my);selected=(pt&&pt!==selected)?pt:null;
  drawMain();const sd=STRUCTS[selected?.name]||null;
  drawStruct(selected);drawPhase(selected);
});
mainC.addEventListener('mouseleave',()=>{hovered=null;document.getElementById('tooltip').style.display='none';drawMain();if(!selected){drawStruct(null);drawPhase(null);}});

// drag rotate struct
sC.addEventListener('mousedown',e=>{if(!selected)return;sDrag=true;sLast={x:e.clientX,y:e.clientY};});
window.addEventListener('mouseup',()=>sDrag=false);
window.addEventListener('mousemove',e=>{
  if(!sDrag||!selected)return;
  sRot.y+=(e.clientX-sLast.x)*.013;sRot.x+=(e.clientY-sLast.y)*.013;
  sLast={x:e.clientX,y:e.clientY};drawStruct(selected);
});
sC.addEventListener('touchstart',e=>{if(!selected)return;sDrag=true;sLast={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
sC.addEventListener('touchend',()=>sDrag=false);
sC.addEventListener('touchmove',e=>{
  if(!sDrag||!selected)return;
  sRot.y+=(e.touches[0].clientX-sLast.x)*.013;sRot.x+=(e.touches[0].clientY-sLast.y)*.013;
  sLast={x:e.touches[0].clientX,y:e.touches[0].clientY};drawStruct(selected);
},{passive:true});

function autoRot(){requestAnimationFrame(autoRot);if(selected&&!sDrag){sRot.y+=.007;drawStruct(selected);}}

function onResize(){
  const lp=document.getElementById('left'),rp=document.getElementById('right');
  mainC.style.width=lp.offsetWidth+'px';mainC.style.height=lp.offsetHeight+'px';
  sC.style.width=rp.offsetWidth+'px';sC.style.height='230px';
  pC.style.width=rp.offsetWidth+'px';pC.style.height='230px';
  drawMain();drawStruct(selected);if(activeTab==='phase')drawPhase(selected);
}
window.addEventListener('resize',onResize);
document.getElementById('structPanel').style.display='flex';
document.getElementById('phasePanel').style.display='none';
setTimeout(()=>{onResize();drawMain();drawStruct(null);requestAnimationFrame(autoRot);},80);