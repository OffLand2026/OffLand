/* OffLand – Spiellogik */
(function(){
"use strict";

/* ---------- Daten ---------- */
const HUMAN_NAMES=["Mia","Jonte","Frieda","Hannes","Ole","Lotta","Ida","Ben","Nele","Piet","Greta","Malte","Smilla","Fiete","Hanna","Jasper","Merle","Henrik","Juna","Til"];
const ANIMAL_NAMES=["Lotte","Bruno","Krümel","Gerda","Paula","Socke","Wolke","Kalle","Möhre","Pünktchen","Flocke","Bommel","Strubbel","Rosi","Kuno"];
const LAND=["Ziege","Huhn","Schaf","Esel","Katze","Hund","Meerschweinchen","Hase","Robbe"];
const SEA=["Delfin","Wal"];
const PLURAL={Ziege:"Ziegen",Huhn:"Hühner",Schaf:"Schafe",Esel:"Esel",Katze:"Katzen",Hund:"Hunde",Meerschweinchen:"Meerschweinchen",Hase:"Hasen",Robbe:"Robben",Delfin:"Delfine",Wal:"Wale"};
const SOUND={Ziege:"Mäh!",Huhn:"Gack-gack!",Schaf:"Bäh!",Esel:"I-ah!",Katze:"Miau!",Hund:"Wuff!",Meerschweinchen:"Quiek!",Hase:"Schnupper-schnupper!",Robbe:"Ö-ö-ö!",Delfin:"Kliek-kliek!",Wal:"Wuuuuh!"};
const isSea=r=>SEA.includes(r.art);
const MOTIFS=[
  {id:"moewen",title:"Grüße von der Möweninsel",sky:"#9CC8EE",sea:"#3A6FA8"},
  {id:"sonne",title:"Sonnenuntergang am Kliff",sky:"#FFB86B",sea:"#5B4F8C"},
  {id:"berg",title:"Grüße vom Bergsee",sky:"#BFE0F5",sea:"#4C8FB8"},
  {id:"hafen",title:"Moin aus der Hafenstadt",sky:"#C9D6E8",sea:"#2E5C8A"},
  {id:"nacht",title:"Sternennacht am Strand",sky:"#1B2340",sea:"#24375A"},
  {id:"wal",title:"Walbeobachtung im Norden",sky:"#D6E6F0",sea:"#2F5F86"}
];
const PROJECTS=[
  {id:"leuchtturm",name:"Leuchtturm",hours:25,text:"Die Insel leuchtet nachts, +2 Plätze für Bewohner"},
  {id:"bruecke",name:"Brücke zur Nachbarinsel",hours:30,text:"Eine zweite Insel kommt dazu, +4 Plätze"},
  {id:"schiff",name:"Schiff",hours:35,text:"Hannes und Co. können fischen, +2 Plätze"},
  {id:"windmuehle",name:"Windmühle",hours:40,text:"Brot für alle, +3 Plätze"},
  {id:"insel3",name:"Dritte Insel",hours:50,text:"Noch mehr Platz, +4 Plätze"},
  {id:"baumhaus",name:"Baumhaus",hours:45,text:"Ein Versteck in den Baumkronen, +2 Plätze"},
  {id:"floss",name:"Floß",hours:50,text:"Fokus-Bootsfahrten bringen doppelt so viele Fische"},
  {id:"festzelt",name:"Festzelt",hours:60,text:"Inselfeste schon ab 4 guten Tagen pro Woche, +20 Punkte extra"},
  {id:"strandhaus",name:"Strandhaus",hours:70,text:"Wohnen direkt am Meer, +3 Plätze"},
  {id:"beachclub",name:"Beachclub",hours:85,text:"+10 Punkte und +1 % Glück an jedem Tag im Budget, +2 Plätze"}
];
const QUESTS=[
  {id:"fruehstueck",name:"Handyfreies Frühstück"},
  {id:"mittag",name:"Mittagspause ohne Scrollen"},
  {id:"abend",name:"Handy ab 22 Uhr weggelegt"}
];

/* Berufe, Eigenschaften, Laden */
const JOBS=[
  {id:"fischer",n:"Fischer:in",fx:"+5 Punkte pro Tag"},
  {id:"baecker",n:"Bäcker:in",fx:"+5 Punkte pro Tag"},
  {id:"musiker",n:"Musiker:in",fx:"+1 % Glück an jedem guten Tag"},
  {id:"aerztin",n:"Inselärzt:in",fx:"Wegzug-Frist 1 Tag länger"},
  {id:"tischler",n:"Tischler:in",fx:"Alles im Laden 10 % billiger"},
  {id:"tierpfleger",n:"Tierpfleger:in",fx:"Öfter Nachwuchs"},
  {id:"gaertner",n:"Gärtner:in",fx:"Blumenbeete bringen doppelt Glück"},
  {id:"lehrer",n:"Lehrer:in",fx:"Kinder werden schneller erwachsen"},
  {id:"koch",n:"Koch / Köchin",fx:"Streit legt sich leichter"},
  {id:"waerter",n:"Leuchtturmwärter:in",fx:"Lockt Delfine und Wale an",need:"leuchtturm"}
];
const TRAITS=[
  {id:"gesellig",n:"gesellig"},{id:"stur",n:"stur",hot:1},{id:"ehrgeizig",n:"ehrgeizig",hot:1},
  {id:"vertraeumt",n:"verträumt"},{id:"hitzkoepfig",n:"hitzköpfig",hot:2},{id:"hilfsbereit",n:"hilfsbereit"}
];
const SHOP=[
  /* Vorräte */
  {id:"sonne",n:"Sonnenschein",cost:120,cat:"vorrat",fx:"Vertreibt einmal die Wolken: Der nächste Tag über dem Budget kostet nur halb so viel Glück.",consumable:true},
  {id:"tee",n:"Kräutertee",cost:60,cat:"vorrat",fx:"Macht einen kranken Bewohner sofort wieder gesund.",consumable:true},
  {id:"klee",n:"Glücksklee",cost:90,cat:"vorrat",fx:"+5 % Inselglück, sofort.",consumable:true},
  /* Nützliches */
  {id:"blumen",n:"Blumenbeet",cost:250,cat:"nutzen",fx:"+1 % Glück an jedem guten Tag, mit Gärtner:in +2 %."},
  {id:"bank",n:"Bank am Strand",cost:120,cat:"nutzen",fx:"Bewohner verstehen sich jeden Tag ein bisschen besser."},
  {id:"picknick",n:"Picknickdecke",cost:130,cat:"nutzen",fx:"Freundschaften wachsen noch schneller."},
  {id:"vogelhaus",n:"Vogelhaus",cost:140,cat:"nutzen",fx:"Zugvögel kommen doppelt so oft vorbei."},
  {id:"angel",n:"Angelsteg",cost:180,cat:"nutzen",fx:"Fokus-Bootsfahrten bringen 20 % mehr Punkte."},
  {id:"schaukel",n:"Schaukel",cost:200,cat:"nutzen",fx:"+1 % Glück an guten Tagen, wenn Kinder auf der Insel sind."},
  {id:"garten",n:"Gemüsegarten",cost:220,cat:"nutzen",fx:"+5 Punkte an jedem Tag im Budget."},
  {id:"haengematte",n:"Hängematte",cost:250,cat:"nutzen",fx:"+5 Punkte für jede erledigte Quest."},
  {id:"bienen",n:"Bienenstock",cost:260,cat:"nutzen",fx:"Zusammen mit dem Blumenbeet +1 % Glück mehr an guten Tagen."},
  {id:"brunnen",n:"Brunnen",cost:300,cat:"nutzen",fx:"Wer wegziehen will, wartet 1 Tag länger."},
  {id:"feuer",n:"Lagerfeuer",cost:350,cat:"nutzen",fx:"Weniger Streit auf der Insel."},
  {id:"stall",n:"Tierstall",cost:400,cat:"nutzen",fx:"+3 Plätze für neue Bewohner."},
  {id:"spielplatz",n:"Spielplatz",cost:450,cat:"nutzen",fx:"Familien bekommen öfter Nachwuchs."},
  {id:"sternwarte",n:"Sternwarte",cost:480,cat:"nutzen",fx:"Polarlichter bleiben einen Tag länger."},
  /* Deko */
  {id:"sandburg",n:"Sandburg",cost:50,cat:"deko",fx:"Hält bis zur nächsten großen Flut."},
  {id:"zwerg",n:"Gartenzwerg",cost:60,cat:"deko",fx:"Bewacht die Beete und wackelt manchmal."},
  {id:"windspiel",n:"Windspiel",cost:70,cat:"deko",fx:"Klingt leise im Wind."},
  {id:"flagge",n:"Inselflagge",cost:80,cat:"deko",fx:"Weht stolz über der Hütte."},
  {id:"schirm",n:"Sonnenschirm",cost:110,cat:"deko",fx:"Ein schattiges Plätzchen am Strand."},
  {id:"palme",n:"Palme",cost:150,cat:"deko",fx:"Schatten und ein bisschen Urlaubsgefühl."},
  {id:"lichter",n:"Lichterkette",cost:160,cat:"deko",fx:"Funkelt bunt über der Hütte."},
  {id:"laternen",n:"Laternen",cost:200,cat:"deko",fx:"Die Insel leuchtet nachts."},
  {id:"teich",n:"Ententeich",cost:320,cat:"deko",fx:"Zwei Enten ziehen mit ein."}
];
/* Seltene Dinge vom Händlerschiff */
const RARE=[
  {id:"regenbogen",n:"Regenbogen",cost:300,fx:"+2 % Glück nach jedem schlechten Tag."},
  {id:"glocke",n:"Goldene Glocke",cost:350,fx:"+2 % Glück an jedem guten Tag."},
  {id:"teleskop",n:"Teleskop",cost:280,fx:"Mehr Strandgut am Morgen."},
  {id:"muschelweg",n:"Muschelweg",cost:200,fx:"Ein glitzernder Weg über die Insel."}
];
/* App-Monster: jede Zeitfresser-App bekommt ein Wesen */
const DEFAULT_APPS=[
  {id:"insta",name:"Instagram",limit:45,m:"krake"},
  {id:"tiktok",name:"TikTok",limit:30,m:"strudel"},
  {id:"yt",name:"YouTube",limit:45,m:"schlange"},
  {id:"games",name:"Spiele",limit:30,m:"nebel"}
];
const MONSTERS={krake:["die","Krake"],strudel:["der","Strudel"],schlange:["die","Seeschlange"],nebel:["der","Nebelgeist"]};
const monName=(a,art)=>(art===false?"":MONSTERS[a.m][0]+" ")+a.name+"-"+MONSTERS[a.m][1];
/* Strandgut */
const FINDS=[
  {id:"muschel",n:"Muschel",pts:20,w:5},
  {id:"seestern",n:"Seestern",pts:25,w:4},
  {id:"flaschenpost",n:"Flaschenpost",pts:30,w:3},
  {id:"treibholz",n:"Treibholz",mat:60,w:3},
  {id:"bernstein",n:"Bernstein",pts:50,w:2},
  {id:"perle",n:"Perle",pts:80,w:1},
  {id:"nelke",n:"Seltene Strandnelke",glueck:4,w:1}
];
const BOTTLE=[
  "„Wer das findet: Leg heute Abend das Handy weg und schau aufs Meer. Es lohnt sich.“",
  "„Ich habe 3 Wochen ohne Social Media verbracht und zum ersten Mal seit Jahren ein Buch zu Ende gelesen.“",
  "„Grüße von einer anderen Insel! Unser Leuchtturm steht schon. Eurer auch?“",
  "„Langeweile ist der Anfang von guten Ideen.“",
  "„Ruf heute jemanden an, statt zu schreiben.“"
];
/* Echte Aktivitäten */
const ACTIVITIES=[
  {id:"spaziergang",n:"Spaziergang",fx:"Der Weg über die Insel wird länger, +1 % Glück",ic:'<circle cx="13" cy="4" r="2"/><path d="M9 21l2-6 3 3v3M7 12l3-3 4 1 3 3M11 15l-1-6"/>'},
  {id:"lesen",n:"Gelesen",fx:"+1 % Glück, Bücherregal füllt sich",ic:'<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>'},
  {id:"sport",n:"Sport",fx:"+2 % Glück",ic:'<path d="M5 19h4l2-4 3 2 1 4M10 8l3-1 2 3 3 1M13 7l-2 5"/><circle cx="15" cy="4" r="2"/>'},
  {id:"kochen",n:"Gekocht",fx:"+15 Punkte",ic:'<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM2 11h2M20 11h2M9 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4"/>'},
  {id:"freunde",n:"Freund:innen getroffen",fx:"Die Bewohner verstehen sich besser, +1 % Glück",ic:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-4 3-6 6-6s6 2 6 6M12 20c0-4 2-6 4-6s6 2 6 6"/>'}
];
const PETS=["Hund","Katze","Meerschweinchen","Hase"];
const owns=id=>S.items.includes(id);
const adults=()=>here().filter(r=>r.kind==="mensch"&&r.job);
const jobOn=id=>adults().some(r=>r.job===id&&!r.retired&&!r.sick);
const jobName=id=>(JOBS.find(j=>j.id===id)||{}).n||"";
const traitName=id=>(TRAITS.find(t=>t.id===id)||{}).n||"";
const price=it=>Math.round(it.cost*(jobOn("tischler")?0.9:1));
function pickJob(){
  const pool=JOBS.filter(j=>!j.need||S.built.includes(j.need));
  const taken=new Set(S.residents.filter(r=>r.status==="da").map(r=>r.job));
  const fresh=pool.filter(j=>!taken.has(j.id));
  return pick(fresh.length?fresh:pool).id;
}
const rk=(a,b)=>a<b?a+"|"+b:b+"|"+a;
const relOf=(a,b)=>S.rel[rk(a,b)]||0;
function addRel(a,b,v){const k=rk(a,b);S.rel[k]=clamp((S.rel[k]||0)+v,-100,100)}

/* Streit-Vorlagen: {a},{b} Namen, {ja},{jb} Berufe */
function conflictText(a,b){
  const c=[];
  if(a.job==="fischer"&&b.job==="gaertner") c.push(`Die Möwen fressen ${b.name}s Beet, weil ${a.name} Fischreste am Strand liegen lässt.`);
  if(a.job==="musiker") c.push(`${a.name} übt jeden Abend Trompete. ${b.name} kann nicht mehr schlafen.`);
  if(b.job==="baecker") c.push(`${a.name} hat ${b.name}s letzte Zimtschnecken gegessen, ohne zu fragen.`);
  if(a.job==="lehrer") c.push(`${a.name} findet, ${b.name} lässt die Kinder viel zu lange aufbleiben.`);
  if(a.job==="tischler") c.push(`${a.name} hat ${b.name}s Zaun repariert, aber ganz anders als gewünscht.`);
  if(a.job==="koch") c.push(`${b.name} hat ${a.name}s Suppe vor allen „okay“ genannt. ${a.name} ist gekränkt.`);
  c.push(`${a.name} (${jobName(a.job)}) und ${b.name} (${jobName(b.job)}) streiten, wer morgens zuerst den Steg benutzen darf.`,
    `${b.name} hat sich ${a.name}s Boot geliehen und es nicht zurückgebracht.`,
    `${a.name} findet, ${b.name} hilft zu wenig bei der Arbeit auf der Insel.`,
    `${a.name} und ${b.name} haben sich über den besten Platz am Strand zerstritten.`);
  return pick(c);
}

/* Was man mit Zeit machen kann (Faustwerte) */
const ACTS=[
  {n:"Spaziergänge",d:"à 30 min",min:30,ic:'<circle cx="13" cy="4" r="2"/><path d="M9 21l2-6 3 3v3M7 12l3-3 4 1 3 3M11 15l-1-6"/>'},
  {n:"Buchkapitel",d:"à 20 min",min:20,ic:'<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>'},
  {n:"Sprachlektionen",d:"à 15 min",min:15,ic:'<path d="M4 5h11v8H8l-4 3zM15 9h5v8l-3-2h-5v-2"/>'},
  {n:"5-km-Läufe",d:"à 35 min",min:35,ic:'<path d="M5 19h4l2-4 3 2 1 4M10 8l3-1 2 3 3 1M13 7l-2 5"/><circle cx="15" cy="4" r="2"/>'},
  {n:"selbst gekochte Abendessen",d:"à 45 min",min:45,ic:'<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM2 11h2M20 11h2M9 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4"/>'},
  {n:"Yoga-Einheiten",d:"à 30 min",min:30,ic:'<circle cx="12" cy="4" r="2"/><path d="M12 7v6M5 10l7 3 7-3M7 21l5-8 5 8"/>'},
  {n:"Kinofilme",d:"à 2 h",min:120,ic:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M8 6l2 4M13 6l2 4"/>'},
  {n:"Treffen mit Freund:innen",d:"à 2 h",min:120,ic:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-4 3-6 6-6s6 2 6 6M12 20c0-4 2-6 4-6s6 2 6 6"/>'},
  {n:"ganze Bücher",d:"à 6 h",min:360,ic:'<path d="M5 4h4v16H5zM10 4h4v16h-4zM15 5l4-1 3 15-4 1z"/>'},
  {n:"Nächte Schlaf",d:"à 8 h",min:480,ic:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'}
];
const actIcon=a=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a.ic}</svg>`;
function equivTop(min){
  const fits=ACTS.filter(a=>min>=a.min).sort((a,b)=>b.min-a.min);
  if(!fits.length) return [];
  const pickd=[fits[0],fits[Math.floor(fits.length/2)],fits[fits.length-1]];
  return [...new Set(pickd)].map(a=>({a,c:Math.floor(min/a.min)}));
}
const SING={"Spaziergänge":"Spaziergang","Buchkapitel":"Buchkapitel","Sprachlektionen":"Sprachlektion","5-km-Läufe":"5-km-Lauf","selbst gekochte Abendessen":"selbst gekochtes Abendessen","Yoga-Einheiten":"Yoga-Einheit","Kinofilme":"Kinofilm","Treffen mit Freund:innen":"Treffen mit Freund:innen","ganze Bücher":"ganzes Buch","Nächte Schlaf":"Nacht Schlaf"};
const eqText=list=>list.map(x=>x.c+" "+(x.c===1?SING[x.a.n]:x.a.n)).join(", ");

/* ---------- Hilfen ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const uid=()=>Math.random().toString(36).slice(2,9);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const nice=s=>parse(s).toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"short"});
const hm=m=>{m=Math.round(m);const h=Math.floor(Math.abs(m)/60),r=Math.abs(m)%60;return ((m<0?"−":"")+(h?h+" h ":"")+(r||!h?r+" min":"")).trim()};
const today=()=>iso(new Date());

function freeName(list,used){const free=list.filter(n=>!used.includes(n));return pick(free.length?free:list)}

/* ---------- Spielstand ---------- */
function newGame(){
  const used=[];
  const h1=freeName(HUMAN_NAMES,used);used.push(h1);
  const h2=freeName(HUMAN_NAMES,used);used.push(h2);
  const a1=freeName(ANIMAL_NAMES,used);used.push(a1);
  const a2=freeName(ANIMAL_NAMES,used);
  const p1=uid(),p2=uid(),z1=uid(),z2=uid();
  return {
    v:1, setup:false, budget:180, baseline:240,
    glueck:60, happyStreak:0, unhappyStreak:0, dayCount:0,
    lastDay:null, material:0, projectIdx:0, built:[],
    residents:[
      {id:p1,name:h1,kind:"mensch",art:"Mensch",pair:p2,status:"da",ret:0,born:0},
      {id:p2,name:h2,kind:"mensch",art:"Mensch",pair:p1,status:"da",ret:0,born:0},
      {id:z1,name:a1,kind:"tier",art:"Ziege",pair:z2,status:"da",ret:0,born:0},
      {id:z2,name:a2,kind:"tier",art:"Ziege",pair:z1,status:"da",ret:0,born:0}
    ],
    warn:null, pending:[], days:[], feed:[], postcards:[], testmode:false,
    points:0, items:[], sun:0, rel:{}, conflict:null, arrC:0, birthC:0
  };
}
function migrate(st){
  if(!st.postcards)st.postcards=[];
  if(st.points==null)st.points=0; if(!st.items)st.items=[]; if(!st.sun)st.sun=0;
  if(!st.rel)st.rel={}; if(st.conflict===undefined)st.conflict=null;
  if(!st.arrC)st.arrC=0; if(!st.birthC)st.birthC=0;
  const D={apps:DEFAULT_APPS.map(x=>Object.assign({},x)),monsters:[],budgetStreak:0,aurora:0,birds:0,trader:null,wish:null,chronicle:[],finds:[],capsules:[],night:null,boat:null,activities:{},actTotals:{},path:0,repair:null,vacation:null,builtLog:[],lastMonth:null,fish:0,focusMin:0,tea:0,memorials:[],natDeath:true,sound:true};
  for(const k in D){ if(st[k]===undefined) st[k]=D[k]; }
  const prevS=S; S=st;
  st.residents.forEach(r=>{if(r.born==null)r.born=0; if(r.kind==="mensch"){if(!r.trait)r.trait=pick(TRAITS).id; if(!r.job&&!r.parents)r.job=pickJob()}});
  S=prevS; return st;
}
let S=newGame();
S=migrate(S);
let tab="heute";

/* ---------- Speichern: db (pro Person privat), sonst Browser ---------- */
let db=null, ref=null, saveTimer=null;
const OLD_LS="offline-insel-v1";
let LS=null; // Speicherschlüssel des angemeldeten Kontos
function lsGet(){if(!LS)return null;try{const t=localStorage.getItem(LS);return t?JSON.parse(t):null}catch(e){return null}}
function lsSet(){if(!LS)return;try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
function save(){
  if(!famCode()) lsSet();
  if(!ref) return;
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{lastWriteAt=Date.now();ref.set({state:JSON.stringify(S),at:lastWriteAt}).catch(()=>{})},400);
}
async function initStore(){
  if(!window.claude||!window.claude.use) return;
  try{
    const [d,u]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
    if(!d||!u) return;
    const id=await u.id(); if(!id) return;
    db=d; USER=u; MY_ID=id;
    await connectStore();
    loadShared();
  }catch(e){}
}
async function connectStore(){
  if(!db||!MY_ID) return;
  if(famUnsub){famUnsub();famUnsub=null}
  const code=famCode();
  ref=code?db.doc("familien/"+code):db.doc("data/users/"+MY_ID+"/insel");
  try{
    const snap=await ref.get();
    if(snap.exists){
      try{const st=JSON.parse(snap.data().state); if(st&&st.v===1){S=migrate(st);if(!code)lsSet();render()}}catch(e){}
    } else if(code){ save() }
    else { const local=lsGet(); if(local&&local.v===1){S=migrate(local);render()} save() }
    if(code){
      famUnsub=ref.onSnapshot(sn=>{
        if(!sn.exists) return; const v=sn.data();
        if(v.at===lastWriteAt||$("#modalRoot").innerHTML) return;
        try{const st=JSON.parse(v.state);if(st&&st.v===1){S=migrate(st);render()}}catch(e){}
      },()=>{});
    }
  }catch(e){}
  render();
}

/* ---------- Abgeleitete Werte ---------- */
const here=()=>S.residents.filter(r=>r.status==="da");
function capacity(){
  let c=6+(S.items.includes("stall")?3:0);
  for(const b of S.built){c+={leuchtturm:2,bruecke:4,schiff:2,windmuehle:3,insel3:4,baumhaus:2,strandhaus:3,beachclub:2}[b]||0}
  return c;
}
const has=b=>S.built.includes(b);
function mood(){return S.glueck>=80?["aufblühend","good"]:S.glueck>=40?["zufrieden","ok"]:["unglücklich","bad"]}
function savedTotal(){return S.days.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0)}
function nextDay(){return S.lastDay?addDays(S.lastDay,1):today()}
function canClose(){return S.testmode||nextDay()<=today()}

/* ---------- Ereignisse ---------- */
function log(text,kind){S.feed.unshift({day:S.lastDay,text,kind:kind||"info"});S.feed=S.feed.slice(0,80)}

function arrival(){
  if(here().length>=capacity()) {log("Jemand wollte einziehen, aber es ist kein Platz frei. Ein Großprojekt schafft neuen Platz.","info");return}
  const humans=here().filter(r=>r.kind==="mensch").length, animals=here().length-humans;
  const isHuman=humans<=animals;
  const used=S.residents.map(r=>r.name);
  if(isHuman){
    const single=here().find(r=>r.kind==="mensch"&&!r.pair);
    const r={id:uid(),name:freeName(HUMAN_NAMES,used),kind:"mensch",art:"Mensch",pair:null,status:"da",ret:0,born:S.dayCount,job:pickJob(),trait:pick(TRAITS).id};
    if(single&&Math.random()<.5){r.pair=single.id;single.pair=r.id}
    else{const pal=adults().filter(x=>x.id!==r.id); if(pal.length) addRel(r.id,pick(pal).id,25)}
    S.residents.push(r); S.pending.push({type:"arrival",id:r.id,partner:single?single.id:null});
  } else {
    const pool=LAND.concat(has("leuchtturm")?SEA:[]).concat(jobOn("waerter")?SEA:[]);
    const present=new Set(here().map(x=>x.art));
    const fresh=pool.filter(a=>!present.has(a));
    const art=pick(fresh.length?fresh:pool);
    const mate=here().find(x=>x.kind==="tier"&&x.art===art&&!x.pair);
    const r={id:uid(),name:freeName(ANIMAL_NAMES,used),kind:"tier",art,pair:null,status:"da",ret:0,born:S.dayCount};
    if(PETS.includes(art)&&adults().length) r.owner=pick(adults()).id;
    S.residents.push(r);
    if(mate){r.pair=mate.id;mate.pair=r.id; S.pending.push({type:"arrival",id:r.id,partner:mate.id})}
    else if(here().length<capacity()){
      used.push(r.name);
      const r2={id:uid(),name:freeName(ANIMAL_NAMES,used),kind:"tier",art,pair:r.id,status:"da",ret:0,born:S.dayCount,owner:r.owner};
      r.pair=r2.id; S.residents.push(r2);
      S.pending.push({type:"arrival",id:r.id,partner:null},{type:"arrival",id:r2.id,partner:r.id});
    } else S.pending.push({type:"arrival",id:r.id,partner:null});
  }
}
function birth(){
  if(here().length>=capacity()) return false;
  const pairs=here().filter(r=>r.pair&&S.residents.find(x=>x.id===r.pair&&x.status==="da"));
  if(!pairs.length) return false;
  const a=pick(pairs), b=S.residents.find(x=>x.id===a.pair);
  const used=S.residents.map(r=>r.name);
  const kid={id:uid(),name:freeName(a.kind==="mensch"?HUMAN_NAMES:ANIMAL_NAMES,used),kind:a.kind,art:a.art,pair:null,parents:[a.id,b.id],status:"da",ret:0,born:S.dayCount};
  if(kid.kind==="mensch") kid.trait=pick(TRAITS).id;
  S.residents.push(kid); S.pending.push({type:"birth",id:kid.id,parents:[a.id,b.id]});
  return true;
}
function familyOf(r){
  const ids=new Set([r.id]); if(r.pair) ids.add(r.pair);
  S.residents.forEach(x=>{if(x.parents&&x.parents.some(p=>ids.has(p))) ids.add(x.id)});
  return S.residents.filter(x=>ids.has(x.id)&&x.status==="da");
}
/* Namen natürlich aufzählen: "Mia", "Mia und Ben", "Mia, Ben und Ole" */
function nameList(names){return names.length<2?(names[0]||""):names.slice(0,-1).join(", ")+" und "+names[names.length-1]}
/* Verb passend zur Anzahl: eine Person → Einzahl, mehrere → Mehrzahl */
const vb=(g,one,many)=>g.length===1?one:many;
function groupName(g){
  if(g.length===1) return g[0].name;
  const n=nameList(g.map(x=>x.name));
  return g[0].kind==="tier"?n+" ("+(PLURAL[g[0].art]||g[0].art)+")":n;
}

/* ---------- Zusammenleben: Beziehungen, Berufe, Streit, Liebe ---------- */
function social(good){
  if(S.conflict&&S.conflict.state==="neu"&&S.conflict.day!==S.lastDay) resolveConflict("egal");
  const ad=adults();
  // Beziehungen verändern sich mit der Stimmung
  for(let i=0;i<Math.min(3,ad.length);i++){
    const a=pick(ad), b=pick(ad); if(a.id===b.id) continue;
    addRel(a.id,b.id,good?(2+(owns("bank")?2:0)+(owns("picknick")?1:0)+(a.trait==="gesellig"?1:0)):-3);
  }
  // Kinder werden erwachsen und bekommen einen Beruf
  here().filter(r=>r.kind==="mensch"&&r.parents&&!r.job).forEach(r=>{
    if(S.dayCount-(r.born||0)>=(jobOn("lehrer")?6:10)){r.job=pickJob();log(r.name+" ist erwachsen geworden und arbeitet jetzt als "+jobName(r.job)+".","good");chron([r.id],r.name+" ist erwachsen und wird "+jobName(r.job)+".")}
  });
  // Laufender Streit: Klärungsabend
  if(S.conflict&&S.conflict.state==="abend"){
    const a=S.residents.find(r=>r.id===S.conflict.a), b=S.residents.find(r=>r.id===S.conflict.b);
    const ok=good||(jobOn("koch")&&Math.random()<.5);
    if(a&&b){
      if(ok){addRel(a.id,b.id,35);S.glueck=clamp(S.glueck+4,0,100);log(a.name+" und "+b.name+" haben sich am handyfreien Abend ausgesprochen und vertragen sich wieder.","good")}
      else{addRel(a.id,b.id,-25);S.glueck=clamp(S.glueck-3,0,100);log("Der Klärungsabend ist ausgefallen. "+a.name+" und "+b.name+" reden nicht mehr miteinander.","bad")}
      S.pending.push({type:"conflictResult",a:a.id,b:b.id,ok});
      escalate(a,b);
    }
    S.conflict=null; return;
  }
  // Verlieben
  if(good){
    const singles=ad.filter(r=>!r.pair);
    for(const a of singles){for(const b of singles){
      if(a.id<b.id&&relOf(a.id,b.id)>=40&&Math.random()<.35&&!a.pair&&!b.pair){
        a.pair=b.id;b.pair=a.id;S.pending.push({type:"love",a:a.id,b:b.id});
        log(a.name+" und "+b.name+" haben sich verliebt!","good");
        chron([a.id,b.id],a.name+" und "+b.name+" haben sich verliebt.");
      }}}
  }
  // Neuer Streit
  if(!S.conflict&&ad.length>=2){
    let p=0.14+(S.glueck<80?0.1:0)+(S.glueck<40?0.1:0)-(owns("feuer")?0.08:0);
    const w=ad.map(r=>1+((TRAITS.find(t=>t.id===r.trait)||{}).hot||0));
    if(Math.random()<p){
      const wpick=()=>{let t=w.reduce((x,y)=>x+y,0)*Math.random();for(let i=0;i<ad.length;i++){t-=w[i];if(t<=0)return ad[i]}return ad[0]};
      const a=wpick(); let b=wpick(), tries=0; while(b.id===a.id&&tries++<10) b=wpick();
      if(a.id!==b.id){
        addRel(a.id,b.id,-15);
        S.conflict={a:a.id,b:b.id,text:conflictText(a,b),state:"neu",day:S.lastDay};
        S.pending.push({type:"conflict"});
        log("Streit: "+S.conflict.text,"bad");
      }
    }
  }
}
function escalate(a,b){
  if(relOf(a.id,b.id)>-60||a.status!=="da"||b.status!=="da") return;
  const leaver=[a,b].find(r=>r.trait==="stur"||r.trait==="hitzkoepfig")||pick([a,b]);
  const g=[leaver];
  leaver.status="weg"; leaver.ret=0;
  log(leaver.name+" hält den Streit nicht mehr aus und zieht weg.","bad");
  chron([leaver.id],leaver.name+" ist nach einem Streit mit "+(leaver===a?b:a).name+" weggezogen.");
  S.pending.push({type:"left",ids:g.map(x=>x.id)});
}
function resolveConflict(choice){
  const c=S.conflict; if(!c) return;
  const a=S.residents.find(r=>r.id===c.a), b=S.residents.find(r=>r.id===c.b);
  if(choice==="abend"){c.state="abend";log("Morgen gibt es einen handyfreien Klärungsabend für "+a.name+" und "+b.name+".","info")}
  else if(choice==="kuchen"){
    S.points-=60; addRel(a.id,b.id,25); S.conflict=null;
    log("Du hast Kuchen für "+a.name+" und "+b.name+" spendiert. Sie vertragen sich wieder.","good");
  } else {
    S.conflict=null;
    if(Math.random()<.4){addRel(a.id,b.id,10);log(a.name+" und "+b.name+" haben sich von selbst wieder eingekriegt.","good")}
    else{addRel(a.id,b.id,-30);S.glueck=clamp(S.glueck-3,0,100);log("Der Streit zwischen "+a.name+" und "+b.name+" schwelt weiter.","bad");escalate(a,b)}
  }
  save();
}

/* ---------- Erweiterungen: Chronik, Strandgut, Besucher, Wünsche, Feste, Kapseln ---------- */
function chron(ids,text){S.chronicle.push({day:S.lastDay,ids,text});if(S.chronicle.length>400)S.chronicle.shift()}
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
function wpickF(list){let t=list.reduce((a,x)=>a+x.w,0)*Math.random();for(const x of list){t-=x.w;if(t<=0)return x}return list[0]}
const allItems=()=>SHOP.concat(RARE);
const itemName=id=>(allItems().find(x=>x.id===id)||{}).n||id;
function extras(day,diff,quests,dreamt){
  const good=diff>=0;
  healthAndAge(day,good);
  // Haustiere vermissen ihre Besitzer:innen
  here().forEach(r=>{if(r.owner){const o=S.residents.find(x=>x.id===r.owner);r.sad=!!(o&&o.status==="weg")}});
  // Lebensgeschichten: Rente, Berufswechsel
  adults().forEach(r=>{
    const age=S.dayCount-(r.born||0);
    if(!r.retired&&age>=(r.parents?150:90)){r.retired=true;r.retiredAt=S.dayCount;log(r.name+" geht in Rente und erzählt jetzt Geschichten am Strand.","info");chron([r.id],r.name+" ist in Rente gegangen.")}
    else if(!r.retired&&S.dayCount-(S.lastJobChange||0)>=10&&Math.random()<0.03){S.lastJobChange=S.dayCount;const old=r.job,nj=pickJob();if(nj!==old){r.job=nj;log(r.name+" wechselt den Beruf: "+jobName(old)+" → "+jobName(nj)+".","info");chron([r.id],r.name+" arbeitet jetzt als "+jobName(nj)+" statt als "+jobName(old)+".")}}
  });
  // Wünsche
  if(!S.wish&&S.dayCount%4===0){
    const cand=adults().filter(r=>!r.wishDone), items=SHOP.filter(it=>!it.consumable&&!owns(it.id));
    if(cand.length&&items.length){const r=pick(cand),it=pick(items);S.wish={rid:r.id,item:it.id,day};log(r.name+" wünscht sich: "+it.n+".","info")}
  }
  if(S.wish&&!S.residents.find(x=>x.id===S.wish.rid&&x.status==="da")) S.wish=null;
  // Strandgut
  const chance=.3+(quests.includes("abend")?.2:0)+(dreamt?.2:0)+(owns("teleskop")?.15:0);
  if(Math.random()<chance){
    const f=wpickF(FINDS);
    if(f.pts) S.points+=f.pts; if(f.mat) S.material+=f.mat; if(f.glueck) S.glueck=clamp(S.glueck+f.glueck,0,100);
    const msg=f.id==="flaschenpost"?pick(BOTTLE):null;
    S.finds.push({id:f.id,day,msg});
    S.pending.push({type:"strandgut",find:f.id,msg});
    log("Strandgut: "+f.n+" angespült.","good");
  }
  // Seltene Besucher
  if(S.aurora>0)S.aurora--; if(S.birds>0)S.birds--;
  if(S.trader&&day>=S.trader.until) S.trader=null;
  if(S.budgetStreak>0&&S.budgetStreak%7===0){
    S.aurora=owns("sternwarte")?4:3; S.pending.push({type:"visitor",kind:"aurora"}); log("Polarlicht über der Insel! 7 Tage am Stück im Budget.","good"); chron([],"Polarlicht nach "+S.budgetStreak+" Tagen im Budget.");
  } else if(good&&S.glueck>=60&&!S.birds&&Math.random()<(owns("vogelhaus")?.2:.1)){
    S.birds=2; S.glueck=clamp(S.glueck+3,0,100); S.pending.push({type:"visitor",kind:"birds"}); log("Ein Schwarm Zugvögel rastet auf der Insel. +3 % Glück.","good");
  } else if(!S.trader&&Math.random()<.12){
    const offer=RARE.filter(x=>!owns(x.id));
    if(offer.length){S.trader={until:addDays(day,2),items:shuffle(offer).slice(0,2).map(x=>x.id)};S.pending.push({type:"visitor",kind:"trader"});log("Ein Händlerschiff hat angelegt. Es bleibt 2 Tage.","info")}
  }
  // Inselfest nach einer guten Woche
  if(S.dayCount%7===0){
    const g=S.days.slice(-7).filter(d=>d.min<=S.budget).length;
    if(g>=(has("festzelt")?4:5)){const fp=has("festzelt")?50:30;S.glueck=clamp(S.glueck+5,0,100);S.points+=fp;S.pending.push({type:"fest",good:g});log("Inselfest! "+g+" von 7 Tagen im Budget. +5 % Glück, +"+fp+" Punkte.","good");chron([],"Inselfest nach "+g+" guten Tagen.")}
  }
  // Monats-Zeitkapsel
  const mon=day.slice(0,7);
  if(S.lastMonth&&S.lastMonth!==mon){const cap=makeCapsule(S.lastMonth);S.capsules.push(cap);S.pending.push({type:"kapsel",id:cap.id})}
  S.lastMonth=mon;
  shareProgress();
}
function monthName(m){const [y,mo]=m.split("-").map(Number);return new Date(y,mo-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"})}
function makeCapsule(m){
  const ds=S.days.filter(d=>d.day.startsWith(m));
  const saved=ds.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0);
  const good=ds.filter(d=>d.min<=S.budget).length;
  const ch=S.chronicle.filter(c=>c.day&&c.day.startsWith(m));
  const moved=ch.filter(c=>/eingezogen/.test(c.text)).length, born=ch.filter(c=>/geboren/.test(c.text)).length;
  const built=S.builtLog.filter(b=>b.day.startsWith(m)).map(b=>(PROJECTS.find(p=>p.id===b.id)||{}).name);
  const best=ds.slice().sort((a,b)=>a.min-b.min)[0];
  const cards=S.postcards.filter(c=>c.day&&c.day.startsWith(m)).length;
  const lines=[
    `${hm(saved)} zurückgewonnen, ${good} von ${ds.length} Tagen im Budget.`,
    moved||born?`${moved} neue Bewohner, ${born}× Nachwuchs.`:"",
    built.length?`Gebaut: ${built.join(", ")}.`:"",
    cards?`${cards} Postkarte${cards>1?"n":""} bekommen.`:"",
    best?`Bester Tag: ${nice(best.day)} mit nur ${hm(best.min)}.`:""
  ].filter(Boolean);
  return {id:uid(),month:m,title:monthName(m),lines,saved,good,total:ds.length};
}

/* ---------- Gesundheit und friedlicher Abschied ---------- */
const ILLS=["Schnupfen","Husten","Bauchweh","Fieber","Halsweh"];
function healthAndAge(day,good){
  // Genesung
  here().filter(r=>r.sick).forEach(r=>{
    const days=S.dayCount-(r.sick.since||0);
    const p=0.3+(good?0.25:0)+(jobOn("aerztin")?0.25:0);
    if(days>=6||Math.random()<p){log(r.name+" ist wieder gesund.","good");chron([r.id],r.name+" hat "+r.sick.kind+" überstanden.");r.sick=null}
  });
  // Krank werden bei wenig Glück
  const healthy=here().filter(r=>r.kind==="mensch"&&!r.sick);
  const p=S.glueck<40?0.25:S.glueck<60?0.06:0;
  if(healthy.length&&Math.random()<p){
    const r=pick(healthy); r.sick={since:S.dayCount,kind:pick(ILLS)};
    log(r.name+" hat "+r.sick.kind+" und liegt im Bett. Gute Tage, die Inselärzt:in oder Kräutertee helfen.","bad");
    S.pending.push({type:"sick",rid:r.id});
  }
  // Friedlicher Abschied im hohen Alter (abschaltbar)
  if(S.natDeath){
    here().filter(r=>r.kind==="mensch"&&r.retired&&S.dayCount-(r.retiredAt||r.born||0)>=60).forEach(r=>{
      if(Math.random()<0.03) farewell(r,day);
    });
  }
  if(S.conflict){const a=S.residents.find(x=>x.id===S.conflict.a),b=S.residents.find(x=>x.id===S.conflict.b);if(!a||!b||a.status!=="da"||b.status!=="da")S.conflict=null}
}
function farewell(r,day){
  r.status="verstorben"; r.diedDay=day; r.sick=null;
  const partner=r.pair?S.residents.find(x=>x.id===r.pair):null;
  if(partner){partner.pair=null;partner.widowOf=r.id}
  // Haustiere bekommen ein neues Zuhause
  here().filter(pt=>pt.owner===r.id).forEach(pt=>{const n=(partner&&partner.status==="da")?partner:pick(adults().filter(x=>x.id!==r.id));pt.owner=n?n.id:null;pt.sad=false});
  S.memorials.push({rid:r.id,name:r.name,day,job:r.job});
  log(r.name+" hat sich nach einem langen Leben auf der Insel friedlich verabschiedet.","info");
  chron([r.id],r.name+" ist friedlich eingeschlafen. Ein Erinnerungsbaum erinnert an "+r.name+".");
  S.pending.push({type:"farewell",rid:r.id});
}
function giveTea(id){
  const r=S.residents.find(x=>x.id===id); if(!r||!r.sick||S.tea<1) return;
  S.tea--; log(r.name+" hat Kräutertee bekommen und ist wieder gesund.","good"); chron([r.id],r.name+" wurde mit Kräutertee gesund gepflegt."); r.sick=null;
  toast(r.name+" ist wieder gesund"); save(); render();
}

/* ---------- Aktivitäten, Bootsfahrt, Gute Nacht, Urlaub ---------- */
const actDay=()=>S.testmode?nextDay():today();
function doActivity(id){
  const k=actDay(); S.activities[k]=S.activities[k]||[];
  if(S.activities[k].includes(id)) return;
  S.activities[k].push(id); S.actTotals[id]=(S.actTotals[id]||0)+1;
  const a=ACTIVITIES.find(x=>x.id===id);
  if(id==="spaziergang"){S.path++;S.glueck=clamp(S.glueck+1,0,100)}
  if(id==="lesen"){S.glueck=clamp(S.glueck+1,0,100)}
  if(id==="sport"){S.glueck=clamp(S.glueck+2,0,100)}
  if(id==="kochen"){S.points+=15}
  if(id==="freunde"){const ad=adults();for(let i=0;i<3&&ad.length>1;i++){const x=pick(ad),y=pick(ad);if(x.id!==y.id)addRel(x.id,y.id,5)}S.glueck=clamp(S.glueck+1,0,100)}
  log("Echte Aktivität: "+a.n+". "+a.fx+".","good"); toast(a.n+" eingetragen");
  save(); render();
}
function startBoat(dur){
  const crew=adults().find(r=>r.job==="fischer")||pick(adults())||null;
  S.boat={start:Date.now(),dur,crew:crew?crew.id:null,left:0}; save();
  const el=document.documentElement;
  if(el.requestFullscreen&&!document.fullscreenElement) el.requestFullscreen().catch(()=>{});
  render();
}
function boatLeft(){if(!S.boat)return 0;return Math.max(0,S.boat.start+S.boat.dur*60000-Date.now())}
function finishBoat(){
  if(!S.boat) return;
  const b=S.boat; S.boat=null;
  S.pending.push({type:"boat",dur:b.dur,crew:b.crew,left:b.left||0});
  save(); render(); showPending();
}
function boatHonest(ok,dur,crewId){
  if(ok){const fish=Math.max(1,Math.round(dur/10))*(has("floss")?2:1), pts=owns("angel")?Math.round(dur*1.2):dur;S.fish+=fish;S.points+=pts;S.material+=dur;S.focusMin+=dur;
    log("Fokus-Bootsfahrt: "+dur+" Minuten ohne Handy. "+fish+" Fische, +"+pts+" Punkte.","good")}
  else log("Die Bootsfahrt kam leer zurück. Beim nächsten Mal klappt es.","bad");
  save();
}
document.addEventListener("visibilitychange",()=>{if(document.hidden&&S.boat){S.boat.left=(S.boat.left||0)+1;save()}});
setInterval(()=>{
  if(!S.boat) return;
  updateFocus();
  if(boatLeft()<=0) finishBoat();
},1000);
/* ---------- Fokus-Bootsfahrt im Vollbild ---------- */
const lerp=(a,b,t)=>a+(b-a)*t;
function wavePath(y,amp){let d=`M-120 ${y}`;for(let x=-120;x<480;x+=30)d+=` q15 ${(x/30)%2?amp:-amp} 30 0`;return d}
function focusSvg(){
  const sk=skyNow(), night=sk.k==="nacht";
  const crew=S.boat.crew?S.residents.find(r=>r.id===S.boat.crew):null;
  const top=night?"#0F1630":sk.k==="abend"?"#4B3B78":sk.k==="morgen"?"#C98A7A":"#5FA3DA";
  const bottom=night?"#26335C":sk.k==="abend"?"#E59A7A":sk.k==="morgen"?"#F2C29A":"#BFE0F5";
  const seaTop=night?"#22365E":"#3A6FA8", seaBottom=night?"#101A33":"#1E3F6E";
  const stars=night?`<g fill="#F3F1EA">${Array.from({length:26},(_,i)=>`<circle class="glow" style="animation-delay:${(i*0.37)%2.4}s" cx="${(i*67)%360}" cy="${20+(i*53)%300}" r="${i%3?1:1.6}"/>`).join("")}</g>`:"";
  const island=(grass,hut)=>`<ellipse cx="0" cy="0" rx="90" ry="16" fill="#E9D7A6"/><path d="M-76 -2c8-34 42-50 76-50s68 16 76 50z" fill="${grass}"/>${hut?`<path d="M14 -8v-20l16-12 16 12v20z" fill="#F3F1EA"/><path d="M10 -26l20-15 20 15" fill="none" stroke="#FF9C7A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`:`<rect x="-30" y="-46" width="5" height="26" fill="#8A5A3B"/><circle cx="-28" cy="-52" r="13" fill="#4E9A58"/><rect x="8" y="-36" width="4" height="22" fill="#8A5A3B"/><circle cx="10" cy="-40" r="10" fill="#4E9A58"/><path d="M40 -6v-30l14 30z" fill="#F3F1EA"/>`}`;
  return `<svg viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="fSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
      <linearGradient id="fSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${seaTop}"/><stop offset="1" stop-color="${seaBottom}"/></linearGradient></defs>
    <rect width="360" height="640" fill="url(#fSky)"/>${stars}
    <g id="fSun" class="f-move">${night?`<circle r="18" fill="#F3F1EA"/><circle cx="7" cy="-5" r="17" fill="${top}"/>`:`<circle r="34" fill="#FFE7A3" opacity=".25"/><circle r="22" fill="${sk.k==="abend"?"#FF9C7A":"#FFE7A3"}"/>`}</g>
    <g class="drift" style="animation-duration:14s" opacity="${night?.25:.85}"><g fill="#F3F1EA"><circle cx="70" cy="190" r="16"/><circle cx="92" cy="182" r="20"/><circle cx="114" cy="192" r="14"/><rect x="56" y="190" width="72" height="14" rx="7"/></g><g fill="#F3F1EA"><circle cx="250" cy="120" r="12"/><circle cx="268" cy="114" r="16"/><circle cx="286" cy="122" r="11"/><rect x="240" y="120" width="56" height="11" rx="5"/></g></g>
    <g class="drift" style="animation-duration:9s"><path d="M150 240q6-6 12 0q6-6 12 0M184 258q5-5 10 0q5-5 10 0" stroke="${night?"#F3F1EA":"#14151F"}" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    <rect y="380" width="360" height="260" fill="url(#fSea)"/>
    <g id="fHome" class="f-move">${island("#7FC57A",true)}</g>
    <g id="fDest" class="f-move">${island("#5FA864",false)}</g>
    <g class="f-waves" stroke="#9CC8EE" fill="none" stroke-linecap="round">
      <path class="wscroll" style="animation-duration:5s" d="${wavePath(400,2)}" stroke-width="1.5" opacity=".35"/>
      <path class="wscroll" style="animation-duration:3.6s" d="${wavePath(470,3)}" stroke-width="2" opacity=".45"/>
    </g>
    <g id="fBoat" class="f-move"><g class="bob" style="animation-duration:2.2s"><g class="wave fb" style="animation-duration:3s">
      <path d="M-62 4q-20 2-40 0M-58 10q-26 3-52 0" stroke="#F3F1EA" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>
      <path d="M-40 0h80l-12 18h-56z" fill="#FF9C7A"/><path d="M-40 0h80" stroke="#C25E3A" stroke-width="2"/>
      <path d="M2 0v-62l40 56z" fill="#F3F1EA"/><path d="M-2 0v-50l-30 46z" fill="#B6A4FF"/><path d="M0 2v-66" stroke="#8A5A3B" stroke-width="3"/>
      ${crew?`<g transform="translate(-20 0) scale(1.3)">${figure(crew,0,0)}</g>`:""}
    </g></g></g>
    <g class="fishes">${[0,1,2].map(i=>`<g transform="translate(${[60,250,170][i]} ${[520,560,610][i]})"><g class="fishjump" style="animation-delay:${i*3.1+1}s"><path d="M-8 0q8-7 16 0q-8 7-16 0zM8 0l6-5v10z" fill="#FFB86B"/></g></g>`).join("")}</g>
    <g class="f-waves" stroke="#BFE0F5" fill="none" stroke-linecap="round">
      <path class="wscroll" style="animation-duration:2.6s" d="${wavePath(540,4)}" stroke-width="2.5" opacity=".5"/>
      <path class="wscroll" style="animation-duration:2s" d="${wavePath(610,5)}" stroke-width="3" opacity=".55"/>
    </g>
  </svg>`;
}
function renderFocus(){
  let el=$("#focus");
  const on=!!(ACC&&S.boat);
  document.body.classList.toggle("focus-on",on);
  if(!on){
    if(el) el.remove();
    if(document.fullscreenElement&&document.exitFullscreen) document.exitFullscreen().catch(()=>{});
    return;
  }
  if(el&&+el.dataset.start===S.boat.start) return updateFocus();
  if(el) el.remove();
  const crew=S.boat.crew?S.residents.find(r=>r.id===S.boat.crew):null;
  el=document.createElement("div"); el.id="focus"; el.className="focus"; el.dataset.start=S.boat.start;
  el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); el.setAttribute("aria-label","Fokus-Bootsfahrt");
  el.innerHTML=`<div class="focus-scene">${focusSvg()}</div>
    <div class="focus-top">
      <p class="label" style="color:#F3F1EA;opacity:.8">Fokus-Bootsfahrt · ${S.boat.dur} min</p>
      <p class="focus-time num" id="boatTime" aria-live="off">--:--</p>
      <p class="focus-msg">${crew?esc(crew.name)+" ist draußen beim Fischen.":"Das Boot ist draußen."} Leg das Handy weg, bis es zurück ist.</p>
    </div>
    <div class="focus-bottom">
      <div class="row between small" style="font-weight:700"><span id="focusFish">Noch kein Fang</span><span id="focusPct">0 %</span></div>
      <div class="bar" style="background:rgba(255,255,255,.18)"><i id="boatBar" style="width:0%;background:var(--lime)"></i></div>
      <button class="btn ghost" id="boatStop" style="color:#F3F1EA;border-color:rgba(243,241,234,.35)">Bootsfahrt abbrechen</button>
    </div>`;
  document.body.appendChild(el);
  $("#boatStop").onclick=()=>{
    modal(`<h2>Bootsfahrt abbrechen?</h2><p class="muted">Das Boot kehrt ohne Fang zurück. Punkte und Baumaterial gibt es nur, wenn du durchhältst.</p>
      <div class="row"><button class="btn grow" id="stopNo">Weiterfahren</button><button class="btn secondary grow" id="stopYes">Abbrechen</button></div>`);
    $("#stopNo").onclick=closeModal;
    $("#stopYes").onclick=()=>{S.boat=null;log("Bootsfahrt abgebrochen.","info");save();closeModal();render()};
    $("#stopNo").focus();
  };
  updateFocus();
}
function updateFocus(){
  if(!S.boat||!$("#focus")) return;
  const total=S.boat.dur*60000, ms=boatLeft(), p=clamp(1-ms/total,0,1);
  $("#boatTime").textContent=Math.floor(ms/60000)+":"+pad(Math.floor(ms/1000)%60);
  $("#boatBar").style.width=(p*100)+"%";
  $("#focusPct").textContent=Math.floor(p*100)+" %";
  const fish=Math.floor(p*Math.max(1,Math.round(S.boat.dur/10)));
  $("#focusFish").textContent=fish?fish+(fish===1?" Fisch":" Fische")+" im Netz":"Noch kein Fang";
  const set=(id,x,y,sc)=>{const g=document.getElementById(id);if(g)g.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)${sc?` scale(${sc.toFixed(3)})`:""}`};
  set("fBoat",lerp(80,210,p),455);
  set("fHome",lerp(40,-200,Math.min(1,p*1.6)),396,lerp(1,.6,p));
  set("fDest",lerp(470,285,p),394,lerp(.35,1,p));
  set("fSun",lerp(40,320,p),340-Math.sin(p*Math.PI)*110);
}
function sleeping(){const h=new Date().getHours();return !!(S.night&&S.night.after===S.lastDay&&(h>=20||h<9))}
function goodNight(){S.night={after:S.lastDay,at:Date.now()};log("Gute Nacht, Insel. Das Handy ruht bis morgen.","info");save();render();toast("Gute Nacht! Morgen gibt es Traumpunkte.")}
function setVacation(on){
  if(on){const g=adults()[0];S.vacation={since:today(),guard:g?g.id:null};log("Urlaubsmodus an"+(g?". "+g.name+" hütet die Insel.":"."),"info")}
  else if(S.vacation){
    const since=S.vacation.since, g=S.vacation.guard; S.vacation=null;
    const y=addDays(today(),-1); if(!S.lastDay||S.lastDay<y) S.lastDay=y;
    const days=Math.max(0,Math.round((parse(today())-parse(since))/864e5));
    S.pending.push({type:"welcome",days,guard:g});
    log("Willkommen zurück nach "+days+" Tagen Urlaub. Alles ist noch da.","good");
  }
  save(); render(); showPending();
}

/* ---------- Inselgeflüster: Bewohner sprechen dich an ---------- */
function srand(n){const x=Math.sin(n*9301+49297)*233280;return x-Math.floor(x)}
function linesFor(r){
  const L=[];
  const last=S.days[S.days.length-1], good=last&&last.min<=S.budget;
  if(r.kind==="tier"){
    if(r.sad){const o=S.residents.find(x=>x.id===r.owner);L.push(`${SOUND[r.art]||""} … (sitzt jeden Abend am Steg und wartet auf ${o?o.name:"jemanden"})`)}
    else L.push(`${SOUND[r.art]||""} ${S.glueck>=80?"(sehr zufrieden)":S.glueck<40?"(guckt traurig in den Regen)":"(döst in der Sonne)"}`);
    return L;
  }
  if(r.sick) return [`Hatschi! Ich hab ${r.sick.kind} und lieg heute flach.`,"Ein Kräutertee wäre jetzt schön …","Wenn die Insel wieder fröhlicher ist, geht's mir bestimmt bald besser."];
  const lost=S.memorials.find(m=>{const d=S.residents.find(x=>x.id===m.rid);return d&&(r.widowOf===m.rid||(r.parents||[]).includes(m.rid)||(d.parents||[]).includes(r.id))});
  if(lost) L.push(`Ich denke oft an ${lost.name}. Am Erinnerungsbaum ist es so schön ruhig.`);
  if(!r.job) {L.push("Spielst du heute mit uns? Aber ohne Handy!","Ich will später "+pick(JOBS).n+" werden!");return L}
  if(S.wish&&S.wish.rid===r.id) L.push(`Ich träume von: ${itemName(S.wish.item)}. Vielleicht ja bald?`);
  if(r.retired) L.push(pick(["Früher, als hier noch keine Hütte stand, saßen wir abends nur am Wasser. Ganz ohne Bildschirme.","Ich erzähl euch vom Winter, in dem der Strom ausfiel und alle zusammen Karten gespielt haben.","In meinem Alter weiß man: Die Zeit am Handy holt keiner zurück."]));
  if(S.monsters.length){const a=S.apps.find(x=>x.id===S.monsters[0]);if(a) L.push(`Hast du ${monName(a)} gesehen? Die hat alle Fische verscheucht!`)}
  if(S.conflict&&(S.conflict.a===r.id||S.conflict.b===r.id)){const o=S.residents.find(x=>x.id===(S.conflict.a===r.id?S.conflict.b:S.conflict.a));if(o) L.push(`Mit ${o.name} rede ich gerade nicht.`)}
  if(S.repair) L.push("Wenn du heute im Budget bleibst und zwei Quests schaffst, wird alles wieder gut.");
  const J={
    fischer:good?`Heute ${2+Math.round(srand(S.dayCount)*6)} Fische gefangen, weil du so wenig am Handy warst!`:"Bei dem Wetter beißt kein Fisch an.",
    baecker:"Frische Zimtschnecken! Riechst du das bis zu dir?",
    musiker:"Lässt du heute Abend das Handy liegen? Ich spiel was am Feuer.",
    aerztin:"Augen brauchen Pausen. Schau mal 20 Sekunden in die Ferne.",
    tischler:owns("bank")?"Die Bank am Strand hält bombenfest. Setz dich mal drauf.":"Für ein paar Punkte bau ich uns eine Bank am Strand.",
    tierpfleger:"Die Tiere sind heute ganz verschmust.",
    gaertner:owns("blumen")?"Die Blumen blühen wie verrückt!":"Ein Blumenbeet wäre so schön …",
    lehrer:"Die Kinder fragen, warum Erwachsene so oft aufs Handy schauen.",
    koch:"Heute gibt es Fischsuppe. Kommst du ohne Handy zum Essen?",
    waerter:has("leuchtturm")?"Heute Nacht hab ich Delfine im Lichtkegel gesehen!":"Ohne Leuchtturm bin ich hier ziemlich arbeitslos."
  };
  L.push(J[r.job]||"Schöner Tag heute.");
  if(S.glueck>=80) L.push("Was für eine Zeit! Alle sind so gut drauf.");
  if(S.glueck<40) L.push("Es ist so grau hier in letzter Zeit …");
  return L;
}
function whispers(){
  const ppl=here(); if(!ppl.length) return [];
  const seed=S.dayCount*7+new Date().getHours();
  const out=[], used=new Set();
  const priority=ppl.filter(r=>r.sad||(S.wish&&S.wish.rid===r.id)||(S.conflict&&(S.conflict.a===r.id||S.conflict.b===r.id)));
  const order=priority.concat(ppl.filter(r=>!priority.includes(r)).sort((a,b)=>srand(seed+a.name.length)-srand(seed+b.name.length)));
  for(const r of order){if(out.length>=2)break;if(used.has(r.id))continue;used.add(r.id);const L=linesFor(r);out.push({r,t:L[Math.floor(srand(seed+out.length)*L.length)]})}
  return out;
}

/* ---------- Gemeinsam: Freund:innen-Inseln, Geschenke, gemeinsames Projekt, Familieninsel ---------- */
let MY_ID=null, USER=null, FRIENDS=null, NAMES={}, JOINT=null, famUnsub=null, lastWriteAt=0;
const FAM_KEY="offline-insel-familie";
function famCode(){try{return localStorage.getItem(FAM_KEY)||""}catch(e){return ""}}
function islandSummary(){
  const keep=["glueck","residents","items","built","sun","aurora","birds","path","budget","fish"];
  const o={}; keep.forEach(k=>o[k]=S[k]); o.days=S.days.slice(-1); o.monsters=[]; o.dayCount=S.dayCount;
  return o;
}
function shareProgress(){
  if(!db||!MY_ID) return;
  db.doc("inseln/"+MY_ID).set({owner:MY_ID,summary:JSON.stringify(islandSummary()),at:Date.now()}).catch(()=>{});
  db.doc("gemeinsam/"+MY_ID).set({owner:MY_ID,min:savedTotal(),at:Date.now()}).catch(()=>{});
}
async function loadShared(){
  if(!db||!MY_ID) return;
  try{
    const qs=await db.collection("inseln").get();
    FRIENDS=qs.docs.filter(d=>d.id!==MY_ID).map(d=>{const v=d.data();let sum=null;try{sum=JSON.parse(v.summary)}catch(e){}return {id:d.id,sum,at:v.at}}).filter(f=>f.sum);
    const js=await db.collection("gemeinsam").get();
    JOINT={total:js.docs.reduce((a,d)=>a+((d.data()||{}).min||0),0),n:js.size};
    if(USER&&FRIENDS.length){try{const ps=await USER.profiles(FRIENDS.map(f=>f.id));for(const k in ps) NAMES[k]=ps[k].name||""}catch(e){}}
    const gs=await db.collection("geschenke").where("to","==",MY_ID).get();
    for(const d of gs.docs){const v=d.data()||{};S.points+=v.pts||0;
      let from="Jemand"; try{const ps=await USER.profiles([v.from]);from=(ps[v.from]&&ps[v.from].name)||"Jemand"}catch(e){}
      log("Geschenk von "+from+": "+(v.what||"ein Paket")+", +"+(v.pts||0)+" Punkte.","good");
      S.pending.push({type:"gift",from,what:v.what||"ein Paket",pts:v.pts||0});
      db.doc("geschenke/"+d.id).delete().catch(()=>{});
    }
    if(gs.size) save();
    render(); showPending();
  }catch(e){}
}
function sceneFor(sum){const keep=S;try{S=migrate(Object.assign(newGame(),sum,{feed:[],pending:[],postcards:[],chronicle:[],capsules:[],finds:[]}));return scene()}finally{S=keep}}
async function sendGift(fid,what,pts){
  if(!db||S.points<pts) return;
  S.points-=pts; save();
  try{await db.collection("geschenke").add({to:fid,from:MY_ID,what,pts,at:Date.now()});toast("Geschenk ist unterwegs!");log("Du hast "+(NAMES[fid]||"jemandem")+" "+what+" geschenkt.","good")}
  catch(e){S.points+=pts;toast("Das Geschenk konnte nicht verschickt werden.")}
  save(); render();
}
async function joinFamily(code){
  code=(code||"").trim().toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,30);
  if(!db||!code) return toast("Familieninsel braucht einen Code aus Buchstaben oder Zahlen.");
  try{localStorage.setItem(FAM_KEY,code)}catch(e){}
  await connectStore();
  toast("Du spielst jetzt auf der Familieninsel „"+code+"“.");
}
async function leaveFamily(){try{localStorage.removeItem(FAM_KEY)}catch(e){} await connectStore(); toast("Zurück auf deiner eigenen Insel.")}

/* ---------- Tag abschließen ---------- */
function closeDay(min,quests,appMin){
  appMin=appMin||{};
  const day=nextDay();
  const diff=S.budget-min;
  const prevLast=S.lastDay;
  // App-Monster: Apps über ihrem eigenen Limit
  const monsters=S.apps.filter(a=>(appMin[a.id]||0)>a.limit).map(a=>a.id);
  let delta, sunny=false;
  if(diff>=0){
    delta=6+Math.min(6,Math.floor(diff/15));
    if(jobOn("musiker")) delta+=1;
    if(owns("blumen")) delta+=(jobOn("gaertner")?2:1)+(owns("bienen")?1:0);
    if(owns("schaukel")&&here().some(r=>r.kind==="mensch"&&r.parents&&!r.job)) delta+=1;
    if(has("beachclub")) delta+=1;
    if(owns("glocke")) delta+=2;
  } else {
    delta=-(8+Math.min(12,Math.floor(-diff/15)));
    if(S.sun>0){S.sun--;delta=Math.round(delta/2);sunny=true}
    if(owns("regenbogen")) delta+=2;
  }
  delta+=quests.length*3;
  delta-=Math.min(4,monsters.length*2);
  // Schlechten Tag reparieren
  let repaired=0;
  if(S.repair){ if(diff>=0&&quests.length>=2){repaired=S.repair.amount;delta+=repaired} S.repair=null; }
  const before=S.glueck;
  S.glueck=clamp(S.glueck+delta,0,100);
  if(diff<0) S.repair={amount:Math.max(2,Math.round((before-S.glueck)/2))};
  const saved=Math.max(0,S.baseline-min);
  S.material+=saved;
  // Punkte: jede Minute unter Budget, Quests, Berufe
  let pts=Math.round(Math.max(0,Math.min(240,diff))/3)+quests.length*(10+(owns("haengematte")?5:0));
  if(diff>=0){ if(jobOn("fischer")&&!monsters.length) pts+=5; if(jobOn("baecker")) pts+=5; if(owns("garten")) pts+=5; if(has("beachclub")) pts+=10; }
  pts+=here().filter(r=>r.wishDone).length*3;
  // Gute-Nacht-Ritual vom Vorabend
  const dreamt=!!(S.night&&S.night.after===prevLast&&prevLast);
  if(dreamt) pts+=15;
  S.points+=pts;
  S.monsters=monsters;
  S.days.push({day,min,quests,glueck:S.glueck,sunny,pts,apps:appMin,monsters,by:MY_ID||null});
  S.lastDay=day; S.dayCount++;
  S.budgetStreak=diff>=0?S.budgetStreak+1:0;

  log((diff>=0?"Im Budget: ":"Über dem Budget: ")+hm(min)+" Bildschirmzeit. Inselglück "+before+" → "+S.glueck+" %, +"+pts+" Punkte.", diff>=0?"good":"bad");
  if(sunny) log("Dein Sonnenschein hat die Wolken vertrieben. Der Tag hat nur halb so viel Glück gekostet.","info");
  if(repaired) log("Reparatur geschafft: "+repaired+" % Glück vom schlechten Tag zurückgeholt.","good");
  if(dreamt) log("Gute-Nacht-Ritual: +15 Traumpunkte.","good");
  monsters.forEach(id=>{const a=S.apps.find(x=>x.id===id);const n=monName(a);log(n.charAt(0).toUpperCase()+n.slice(1)+" ist aufgetaucht: "+a.name+" lag über "+hm(a.limit)+".","bad")});
  if(!S.testmode) S.pending.push({type:"day",day,min,before,after:S.glueck,saved,pts,sunny,repaired,dreamt,monsters});

  social(diff>=0);
  extras(day,diff,quests,dreamt);

  // Streaks
  if(S.glueck>=80){S.happyStreak++}else S.happyStreak=0;
  if(S.glueck<40){S.unhappyStreak++}else{
    if(S.warn){const wg=S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean);log(groupName(wg)+vb(wg," packt die Koffer wieder aus und bleibt!"," packen die Koffer wieder aus und bleiben!"),"good");S.warn=null}
    S.unhappyStreak=0;
  }

  // Zuzug und Nachwuchs
  if(S.glueck>=80){
    S.arrC++; S.birthC++;
    const birthEvery=Math.max(2,4-(owns("spielplatz")?1:0)-(jobOn("tierpfleger")?1:0));
    if(S.arrC>=3){S.arrC=0;arrival()}
    else if(S.birthC>=birthEvery){S.birthC=0;birth()}
  }

  // Wegzug
  if(S.unhappyStreak===3&&!S.warn){
    const cands=here(); if(cands.length){
      const g=familyOf(pick(cands));
      S.warn={ids:g.map(x=>x.id),deadline:addDays(day,2+(jobOn("aerztin")?1:0)+(owns("brunnen")?1:0))};
      log(groupName(g)+vb(g," packt die Koffer. Noch 2 Tage bis zum Wegzug."," packen die Koffer. Noch 2 Tage bis zum Wegzug."),"bad");
      S.pending.push({type:"warn",ids:g.map(x=>x.id)});
    }
  }
  if(S.warn&&day>=S.warn.deadline&&S.glueck<40){
    const g=S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(r=>r&&r.status==="da");
    g.forEach(r=>{r.status="weg";r.ret=0});
    if(g.length){
      log(groupName(g)+vb(g," ist auf die Möweninsel gezogen und schreibt: „Wenn es wieder 5 gute Tage gibt, komme ich zurück.“"," sind auf die Möweninsel gezogen und schreiben: „Wenn es wieder 5 gute Tage gibt, kommen wir zurück.“"),"bad");
      chron(g.map(r=>r.id),groupName(g)+vb(g," ist weggezogen."," sind weggezogen."));
      S.pending.push({type:"left",ids:g.map(x=>x.id)});
    }
    S.warn=null;
  }
  // Rückkehr
  const gone=S.residents.filter(r=>r.status==="weg");
  if(gone.length&&S.glueck>=60){
    gone.forEach(r=>r.ret++);
    const hint=gone.filter(r=>r.ret===3);
    if(hint.length) S.pending.push({type:"postcard",ids:hint.map(x=>x.id),hint:true});
    const back=gone.filter(r=>r.ret>=5);
    if(back.length&&here().length+back.length<=capacity()){
      back.forEach(r=>{r.status="da";r.ret=0});
      log(nameList(back.map(r=>r.name))+vb(back," ist zurückgekommen!"," sind zurückgekommen!"),"good");
      chron(back.map(r=>r.id),nameList(back.map(r=>r.name))+vb(back," ist von der Möweninsel zurückgekehrt."," sind von der Möweninsel zurückgekehrt."));
      S.pending.push({type:"return",ids:back.map(x=>x.id)});
      const ids=new Set(back.map(r=>r.id));
      here().filter(pt=>pt.owner&&ids.has(pt.owner)&&pt.kind==="tier").forEach(pt=>S.pending.push({type:"reunion",pet:pt.id,owner:pt.owner}));
    }
  }

  // Projekt
  const p=PROJECTS[S.projectIdx];
  if(p&&S.material>=p.hours*60){
    S.material-=p.hours*60; S.built.push(p.id); S.projectIdx++; S.builtLog.push({id:p.id,day});
    chron([],"Großprojekt fertig: "+p.name+".");
    log("Großprojekt fertig: "+p.name+". "+p.text+".","good");
    S.pending.push({type:"project",id:p.id});
  }
  save(); render(); showPending();
}

/* ---------- Insel-Szene ---------- */
/* Aussehen: aus der ID abgeleitet, damit jede:r immer gleich aussieht */
function hsh(t){let h=2166136261;for(const c of String(t||""))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
const SKIN=["#F3D2B8","#E8B48F","#D9A27E","#B07A55","#8A5A3B","#6B4430"];
const HAIR=["#2B2118","#4A3222","#7A4A2A","#B8743A","#E0B867","#C8442E","#1E1E28"];
const SHIRT=["#B6A4FF","#C8F169","#FFB86B","#5B8CD6","#FF9C7A","#5BC0A8","#E07AB8","#F3F1EA"];
const PANTS=["#3A3D58","#2F4A6E","#5A4636","#4A5A3A"];
function hairSvg(style,c){
  switch(style){
    case 0: return {back:"",front:`<path d="M-5.3 -16.6a5.3 5.5 0 0 1 10.6 0q-2.6-2.2-5.3-1.6t-5.3 1.6z" fill="${c}"/>`};
    case 1: return {back:`<path d="M-5.8 -16.5a5.8 6 0 0 1 11.6 0v7.2q-1.2 .9-2.4 0v-5h-6.8v5q-1.2 .9-2.4 0z" fill="${c}"/>`,front:`<path d="M-5.4 -16.2a5.4 5.6 0 0 1 10.8 0q-3-2.6-6.4-1.2-2.4 1-4.4 1.2z" fill="${c}"/>`};
    case 2: return {back:`<circle cx="0" cy="-22.2" r="2.6" fill="${c}"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-2.6-10.6 0z" fill="${c}"/>`};
    case 3: return {back:`<path d="M4 -18q4.4 1 3.6 6.6q-2.2-1.6-2.4-4.6z" fill="${c}"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-2.6-10.6 0z" fill="${c}"/>`};
    case 4: return {back:"",front:`<g fill="${c}"><circle cx="-4.2" cy="-18.6" r="2.5"/><circle cx="-1.4" cy="-20.6" r="2.6"/><circle cx="1.8" cy="-20.6" r="2.6"/><circle cx="4.4" cy="-18.4" r="2.4"/><circle cx="-5.4" cy="-16.2" r="1.7"/><circle cx="5.5" cy="-16" r="1.7"/></g>`};
    case 5: return {back:"",front:`<path d="M-5.6 -17.2a5.6 4.6 0 0 1 11.2 0z" fill="${c}"/><path d="M-5.6 -17.4h8.8q2.4 0 3.6 1.2h-12.4z" fill="${c}" opacity=".85"/>`};
    default: return {back:"",front:`<path d="M-5 -17.6a5 4 0 0 1 10 0q-5-1.2-10 0z" fill="${c}"/>`};
  }
}
const STYLE_NAMES=["Kurz","Lang","Dutt","Zopf","Locken","Mütze","Stoppeln"];
function lookIdx(r){
  const h=hsh(r.id||r.name), o=r.look||{};
  const pickI=(k,v)=>o[k]!=null?o[k]:v;
  return {skin:pickI("skin",h%SKIN.length),hair:pickI("hair",(h>>>3)%HAIR.length),style:pickI("style",(h>>>6)%7),shirt:pickI("shirt",(h>>>9)%SHIRT.length)};
}
function looks(r){
  const h=hsh(r.id||r.name), i=lookIdx(r);
  return {skin:SKIN[i.skin],hair:r.retired?"#D9D6CE":HAIR[i.hair],style:i.style,
    shirt:SHIRT[i.shirt],pants:PANTS[(h>>>12)%PANTS.length],cap:SHIRT[(h>>>15)%SHIRT.length]};
}
function figure(r,x,y){
  if(r.kind==="mensch"){
    const L=looks(r), kid=r.parents&&!r.job?0.72:1;
    const hair=hairSvg(L.style,L.style===5?L.cap:L.hair);
    if(r.sick) return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)} (krank: ${esc(r.sick.kind)})</title><rect x="-9" y="-6" width="18" height="6" rx="2" fill="#8A5A3B"/><rect x="-8" y="-9" width="16" height="5" rx="2" fill="#9CC8EE"/><circle cx="-6" cy="-10" r="4" fill="${L.skin}"/><path d="M-9.6 -11a4 4 0 0 1 6.6-2.6" stroke="${L.hair}" stroke-width="2" fill="none"/><path d="M-7.4 -10.4h1.2M-5 -10.4h1.2" stroke="#14151F" stroke-width=".6"/><circle cx="-8" cy="-9" r="1" fill="#E5484D" opacity=".7"/><text x="2" y="-12" font-size="6" fill="#F3F1EA" font-family="Manrope, sans-serif">z</text></g>`;
    const sad=typeof S!=="undefined"&&S.glueck<40;
    const mouth=sad?`<path d="M-1.4 -12.6q1.4-1 2.8 0" stroke="#5A3A2A" stroke-width=".7" fill="none" stroke-linecap="round"/>`:`<path d="M-1.6 -13.3q1.6 1.3 3.2 0" stroke="#5A3A2A" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)}</title>
      <path d="M-2.4 -3.4v3.2M2.4 -3.4v3.2" stroke="${L.pants}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-6 -2.6c0-6 2.4-8.6 6-8.6s6 2.6 6 8.6z" fill="${L.shirt}"/>
      ${hair.back}<circle cx="0" cy="-16" r="5" fill="${L.skin}"/>${hair.front}
      <circle cx="-1.8" cy="-15.6" r=".75" fill="#14151F"/><circle cx="1.8" cy="-15.6" r=".75" fill="#14151F"/>
      <circle cx="-3.2" cy="-13.8" r="1" fill="#FF9C7A" opacity=".35"/><circle cx="3.2" cy="-13.8" r="1" fill="#FF9C7A" opacity=".35"/>${mouth}
      ${r.retired?`<path d="M-3.6 -16.4h2.6M1 -16.4h2.6M-1 -16.4h2" stroke="#3A3D58" stroke-width=".5" fill="none"/><circle cx="-1.8" cy="-16" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/><circle cx="1.8" cy="-16" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/>`:""}</g>`;
  }
  const s=(r.parents?0.7:1)*(r.art==="Wal"?1.6:1);
  return `<g transform="translate(${x} ${y}) scale(${s})"><title>${esc(r.name)} (${esc(r.art)})</title>${animalSvg(r.art,animalVar(r))}</g>`;
}
/* Fellfarben: Ersetzungen der Grundfarben je Tierart */
const FUR={
  Huhn:[{},{"#F3F1EA":"#C98A52","#D9D4C6":"#A86A38"},{"#F3F1EA":"#5A5D78","#D9D4C6":"#3A3D58"}],
  Ziege:[{},{"#F3F1EA":"#B07A55","#D9D4C6":"#8A5A3B"},{"#F3F1EA":"#4A4D66","#D9D4C6":"#3A3D58"}],
  Schaf:[{},{"#F3F1EA":"#E9D7A6"},{"#F3F1EA":"#6B6E88"}],
  Esel:[{},{"#9EA3B8":"#8A6A55"},{"#9EA3B8":"#C9C6BE"}],
  Katze:[{},{"#F0A35E":"#9EA3B8","#C97A38":"#6E7488"},{"#F0A35E":"#3F4258","#C97A38":"#2A2C3E"},{"#F0A35E":"#F3F1EA","#C97A38":"#E0A06A"}],
  Hund:[{},{"#B07A55":"#E0B06A","#D9A27E":"#F3DDAA","#7A5038":"#B08040"},{"#B07A55":"#3F4258","#D9A27E":"#8F96A8","#7A5038":"#26283A"},{"#B07A55":"#F3F1EA","#D9A27E":"#FFFFFF","#7A5038":"#B07A55"}],
  Meerschweinchen:[{},{"#C98A52":"#3F4258"},{"#C98A52":"#E9D7A6"}],
  Hase:[{},{"#A88A70":"#9EA3B8"},{"#A88A70":"#F3F1EA"}],
  Robbe:[{},{"#8F96A8":"#5F6680","#6E7488":"#454B63"},{"#8F96A8":"#C9CBDD","#6E7488":"#9EA3B8"}],
  Delfin:[{},{"#7C9CC4":"#9EA3B8"}],
  Wal:[{},{"#3E5C8A":"#2F3B57"},{"#3E5C8A":"#5F6680"}]
};
function animalVar(r,depth){
  const n=(FUR[r.art]||[{}]).length, h=hsh(r.id||r.name);
  if(r.fur!=null&&r.fur<n) return r.fur;
  if(r.parents&&!depth&&h%3!==0){const p=S.residents.find(x=>x.id===r.parents[h%r.parents.length]);if(p&&p.art===r.art)return animalVar(p,1)}
  return h%n;
}
/* Tiere: Ursprung = Füße bzw. Wasserlinie, Blick nach links */
function animalSvg(art,v){
  let out=animalShape(art);
  const map=(FUR[art]||[])[v||0];
  if(map) for(const k in map) out=out.split(k).join(map[k]);
  return out;
}
function animalShape(art){
  const E=(x,y)=>`<circle cx="${x}" cy="${y}" r=".95" fill="#14151F"/>`;
  switch(art){
  case "Huhn": return `<path d="M5 -9l5 -6 1 8z" fill="#F3F1EA"/><ellipse cx="1" cy="-6" rx="6.5" ry="5" fill="#F3F1EA"/><path d="M2 -6q3 1 4 -2" stroke="#D9D4C6" stroke-width="1.2" fill="none"/><circle cx="-5" cy="-11" r="3.2" fill="#F3F1EA"/><path d="M-7.5 -13.5q.6-2.4 1.6-1q.8-2.6 1.8-.6q1-2 1.6 .4z" fill="#E5484D"/><path d="M-8 -11.6l-3.4 1 3.4 1z" fill="#FFB86B"/><circle cx="-7" cy="-8.4" r="1.1" fill="#E5484D"/>${E(-5.6,-11.6)}<path d="M-1 -1.2v2.4M3 -1.2v2.4" stroke="#FFB86B" stroke-width="1.3" stroke-linecap="round"/>`;
  case "Ziege": return `<ellipse cx="2" cy="-7" rx="8" ry="4.6" fill="#F3F1EA"/><path d="M-5 -9l-3 -4" stroke="#F3F1EA" stroke-width="4" stroke-linecap="round"/><ellipse cx="-9" cy="-14" rx="3.2" ry="2.6" fill="#F3F1EA"/><path d="M-9 -16q-1-4 2-5M-7.5 -16q1-3 3-3" stroke="#A4A6BD" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M-11 -12.4l-.6 3 1.6-1z" fill="#D9D4C6"/>${E(-9.6,-14.4)}<path d="M-3 -3v4M7 -3v4" stroke="#F3F1EA" stroke-width="2" stroke-linecap="round"/><path d="M10 -9l2 -2" stroke="#F3F1EA" stroke-width="1.6" stroke-linecap="round"/>`;
  case "Schaf": return `<g fill="#F3F1EA"><circle cx="-3" cy="-8" r="4"/><circle cx="2" cy="-9.5" r="4.4"/><circle cx="6.5" cy="-7.5" r="3.8"/><circle cx="1" cy="-5" r="4.4"/><circle cx="5.5" cy="-4.6" r="3.4"/></g><ellipse cx="-7.5" cy="-8.5" rx="2.8" ry="3.4" fill="#3A3D58"/><path d="M-9.5 -10.5l-2.4 -.4" stroke="#3A3D58" stroke-width="1.6" stroke-linecap="round"/><circle cx="-8.4" cy="-9.2" r=".8" fill="#F3F1EA"/><path d="M-1 -1.5v3M5 -1.5v3" stroke="#3A3D58" stroke-width="1.8" stroke-linecap="round"/>`;
  case "Esel": return `<ellipse cx="2" cy="-8" rx="8.5" ry="4.8" fill="#9EA3B8"/><path d="M-5 -10l-4 -5" stroke="#9EA3B8" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="-11" cy="-15" rx="3.6" ry="2.6" fill="#9EA3B8"/><ellipse cx="-13.4" cy="-14.4" rx="1.6" ry="1.4" fill="#D9D4C6"/><path d="M-9 -17l-1 -6M-7.6 -17l1 -5.6" stroke="#9EA3B8" stroke-width="1.8" stroke-linecap="round"/>${E(-10.6,-15.6)}<path d="M-3 -4v5M7 -4v5" stroke="#9EA3B8" stroke-width="2.2" stroke-linecap="round"/><path d="M10.5 -9l2 3" stroke="#3A3D58" stroke-width="1.4" stroke-linecap="round"/>`;
  case "Katze": return `<path d="M7 -3q6 -2 4 -9" stroke="#F0A35E" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="2" cy="-5" rx="6" ry="5" fill="#F0A35E"/><circle cx="-4" cy="-10" r="4" fill="#F0A35E"/><path d="M-7.4 -12.4l-.6 -4 3 2.4zM-2.6 -13l1.4 -3.6 1 4z" fill="#F0A35E"/><path d="M1 -8l2 1M2 -5l2 1" stroke="#C97A38" stroke-width="1.2" stroke-linecap="round"/>${E(-5.4,-10.6)}${E(-2.8,-10.6)}<path d="M-9 -9.4h3M-9 -8.4l3 .2" stroke="#F3F1EA" stroke-width=".5"/>`;
  case "Hund": return `<path d="M8 -9q4 -2 3 -6" stroke="#B07A55" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="2" cy="-7" rx="7.5" ry="4.4" fill="#B07A55"/><circle cx="-6" cy="-11.5" r="4" fill="#B07A55"/><ellipse cx="-9.6" cy="-10.4" rx="2.6" ry="1.8" fill="#D9A27E"/><circle cx="-11.6" cy="-10.8" r="1.1" fill="#14151F"/><path d="M-4 -14.6q3 1 2 6" stroke="#7A5038" stroke-width="2.6" fill="none" stroke-linecap="round"/>${E(-7,-12.6)}<path d="M-3 -4v4.4M6 -4v4.4" stroke="#B07A55" stroke-width="2.2" stroke-linecap="round"/>`;
  case "Meerschweinchen": return `<ellipse cx="0" cy="-4.6" rx="8" ry="4.8" fill="#C98A52"/><path d="M-1 -9.2q4 -1 6 2q1 3 -1 5.6h-4q-2 -3 -1 -7.6z" fill="#F3F1EA"/><circle cx="-6.4" cy="-6.6" r="3.4" fill="#C98A52"/><circle cx="-4.6" cy="-9.4" r="1.4" fill="#E8B48F"/>${E(-7.4,-7.2)}<circle cx="-9.4" cy="-5.6" r=".7" fill="#E5484D"/>`;
  case "Hase": return `<circle cx="7.2" cy="-6" r="2.2" fill="#F3F1EA"/><ellipse cx="2" cy="-5.4" rx="6.4" ry="5" fill="#A88A70"/><circle cx="-4.6" cy="-9" r="3.6" fill="#A88A70"/><path d="M-5.6 -11.6q-2.6 -6 -.6 -8.4q2 2 1.6 8M-3.4 -11.8q0 -6.4 2.6 -7.6q1.2 2.6 -1 7.8" fill="#A88A70"/><path d="M-5 -13q-1 -3 -.4 -5M-2.6 -13q.2 -3 1.4 -4.4" stroke="#E8B48F" stroke-width=".9"/>${E(-5.8,-9.4)}<circle cx="-8" cy="-8.2" r=".7" fill="#E5484D"/>`;
  case "Robbe": return `<path d="M-10 -1c0-8 6-12 13-12 4 0 6 2 6 5 0 2-2 3-4 3 3 2 6 3 9 6z" fill="#8F96A8"/><path d="M2 -2l-2 2.6M8 -1.4l4 2" stroke="#6E7488" stroke-width="2" stroke-linecap="round"/>${E(3.6,-9.6)}<path d="M8 -8.2h3M8 -7.2l3 .6" stroke="#F3F1EA" stroke-width=".5"/><circle cx="7.6" cy="-8.4" r=".8" fill="#14151F"/>`;
  case "Delfin": return `<path d="M-12 -2q6 -12 18 -9q6 1 8 5l-3 .4q-4 -3 -9 -2q-6 1 -10 6.6z" fill="#7C9CC4"/><path d="M0 -10.6l2.6 -4.4 1.6 4.6z" fill="#7C9CC4"/><path d="M11 -5.6l4 -3 -1 4.4z" fill="#7C9CC4"/><path d="M-11 -2.6q5 -2.6 9 -2" stroke="#C8D6EA" stroke-width="1.2" fill="none"/>${E(-6,-6.6)}`;
  case "Wal": return `<path d="M-14 -2q2 -10 14 -10q10 0 14 6l5 -4 -1 6 1 6 -5 -3q-4 3 -14 2q-10 0 -14 -3z" fill="#3E5C8A"/><path d="M-12 -1q10 3 22 0" stroke="#9CB4D4" stroke-width="1.4" fill="none"/>${E(-8,-6)}<path d="M-6 -12q-1 -4 -3 -5M-6 -12q1 -4 3 -5" stroke="#C8E2F5" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  default: return `<ellipse cx="0" cy="-5" rx="8" ry="5" fill="#F3F1EA"/><circle cx="-8" cy="-10" r="3.6" fill="#F3F1EA"/>${E(-9,-10.5)}`;
  }
}
function skyNow(){
  const h=new Date().getHours();
  if(h>=21||h<6) return {k:"nacht",sky:"#1B2340",sea:"#24375A",stars:true};
  if(h<9) return {k:"morgen",sky:"#E8A98C",sea:"#3B5C86",sun:[60,70,"#FFD27A"]};
  if(h<18) return {k:"tag",sky:"#86BFE6",sea:"#3A6FA8",sun:[300,40,"#FFE7A3"]};
  return {k:"abend",sky:"#7A5C9E",sea:"#34507E",sun:[300,92,"#FF9C7A"]};
}
function season(){const m=new Date().getMonth();return m===11||m<2?"winter":m<5?"fruehling":m<8?"sommer":"herbst"}
function monsterSvg(kind){
  switch(kind){
  case "krake": return `<ellipse cx="0" cy="-14" rx="11" ry="10" fill="#9B6BD6"/><circle cx="-4" cy="-15" r="2.4" fill="#F3F1EA"/><circle cx="4" cy="-15" r="2.4" fill="#F3F1EA"/><circle cx="-4" cy="-15" r="1.1" fill="#14151F"/><circle cx="4" cy="-15" r="1.1" fill="#14151F"/><path d="M-10 -6q-6 6-2 10M-4 -5q-3 7 1 10M4 -5q3 7-1 10M10 -6q6 6 2 10" stroke="#9B6BD6" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="-5" y="-30" width="10" height="7" rx="1.5" fill="#14151F" stroke="#C8A8FF"/>`;
  case "strudel": return `<path d="M0 -4a12 6 0 1 0 0.1 0M0 -4a8 4 0 1 1-0.1 0M0 -4a4 2 0 1 0 0.1 0" stroke="#7CE0E8" stroke-width="2.4" fill="none" transform="translate(0 -4)"/><circle cx="-3" cy="-14" r="1.6" fill="#FF5C8A"/><circle cx="3" cy="-14" r="1.6" fill="#7CE0E8"/>`;
  case "schlange": return `<path d="M-22 0q5-14 10 0t10 0 10 0" stroke="#E5484D" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="10" cy="-6" r="5" fill="#E5484D"/><circle cx="12" cy="-7" r="1.3" fill="#FFD27A"/><path d="M15 -5l5 1-5 1" fill="#FFD27A"/>`;
  case "nebel": return `<path d="M-12 0v-16a12 12 0 0 1 24 0v16l-4-3-4 3-4-3-4 3-4-3z" fill="#C9CBDD" opacity=".85"/><circle cx="-4" cy="-14" r="2" fill="#14151F"/><circle cx="4" cy="-14" r="2" fill="#14151F"/><path d="M-3 -8q3 2 6 0" stroke="#14151F" stroke-width="1.4" fill="none"/>`;
  }
  return "";
}
/* Gekaufte Gegenstände automatisch verteilen: Jeder Gegenstand nimmt den freien Platz,
   der am weitesten von den schon platzierten entfernt ist, und weicht Gebäuden und Bäumen aus. */
const ITEM_W={teich:36,picknick:34,garten:32,sandburg:30,schaukel:30,spielplatz:28,haengematte:28,stall:28,blumen:28,palme:26,bank:26,feuer:22,brunnen:24,sternwarte:26,bienen:22,schirm:30,vogelhaus:20,zwerg:12,laternen:12,glocke:18,teleskop:28,muschelweg:34,regenbogen:34};
const ITEM_H={palme:30,laternen:28,vogelhaus:30,schirm:26,glocke:28,sternwarte:30,schaukel:26,haengematte:20,spielplatz:22,stall:22,bienen:24,teleskop:24,feuer:24};
const FIXED_ITEMS={flagge:c=>[c.cx+50,122],lichter:c=>[c.cx+50,148],windspiel:c=>[c.cx+28,160],angel:c=>[c.cx+108,198]};
function layoutItems(cx,two,three,nTrees){
  const out={}, S8=.8, ctx={cx};
  const blocks=[[cx+24,116,cx+76,162]];                                   // Hütte
  if(has("leuchtturm")) blocks.push([cx-73,74,cx-51,162]);
  if(has("windmuehle")) blocks.push([cx+76,118,cx+98,162]);
  if(has("baumhaus")) blocks.push([cx-118,118,cx-72,170]);
  if(owns("laternen")) blocks.push([cx+86,146,cx+98,172]);
  for(let i=0;i<nTrees;i++){const tx=cx-40+i*22-(i%2)*6, ty=128+(i%2)*8;blocks.push([tx-6,ty-20,tx+6,ty+27])}
  if(has("festzelt")&&two) blocks.push([302,128,334,154]);
  if(has("strandhaus")&&two) blocks.push([246,142,278,170]);
  if(has("beachclub")&&three) blocks.push([272,196,310,218]);
  // mögliche Plätze (Fußpunkt), nur auf Sand/Gras
  const cand=[];
  const onMain=(x,y)=>{const dy=(y-176)/20;return Math.abs(x-cx)<=106*Math.sqrt(Math.max(0,1-dy*dy))-12};
  for(const y of [158,165,172,179,186,193]) for(let x=cx-104;x<=cx+104;x+=5) if(onMain(x,y)&&(y>=165||Math.abs(x-cx)<86)) cand.push([x,y,0]);
  if(two) for(const y of [152,159,166,172]) for(let x=252;x<=348;x+=5){const dy=(y-160)/14;if(Math.abs(x-300)<=54*Math.sqrt(Math.max(0,1-dy*dy))-8) cand.push([x,y,1])}
  if(three) for(const y of [208,214]) for(let x=270;x<=332;x+=5) cand.push([x,y,2]);
  const rects=[];
  const area=(r,b)=>Math.max(0,Math.min(r[2],b[2]+2)-Math.max(r[0],b[0]-2))*Math.max(0,Math.min(r[3],b[3]+1)-Math.max(r[1],b[1]-1));
  const clash=r=>blocks.concat(rects).reduce((t,b)=>t+area(r,b),0);
  const pickSpot=(w,h,strict)=>{
    let best=null, bestScore=-1e9;
    for(const [x,y,isl] of cand){
      const r=[x-w/2,y-h,x+w/2,y], c=clash(r);
      if(strict&&c>0) continue;
      let d=999; for(const q of rects){d=Math.min(d,Math.hypot(x-(q[0]+q[2])/2,(y-q[3])*1.6))}
      const score=strict?Math.min(d,90)-isl*25+(y>=170&&y<=188?6:0):-c+Math.min(d,40)/10;
      if(score>bestScore){bestScore=score;best=[x,y]}
    }
    return best;
  };
  for(const id of S.items){
    if(FIXED_ITEMS[id]){out[id]=FIXED_ITEMS[id](ctx);continue}
    if(!itemSvg(id)) continue;
    let sc=S8, w=(ITEM_W[id]||24), h=(ITEM_H[id]||18), spot=pickSpot(w*sc,h*sc,true);
    if(!spot){sc=.62;spot=pickSpot(w*sc,h*sc,true)}          // eng: etwas kleiner
    if(!spot){sc=.62;spot=pickSpot(w*sc,h*sc,false)}         // sehr eng: geringste Überschneidung
    out[id]=[spot[0],spot[1],sc];
    rects.push([spot[0]-w*sc/2,spot[1]-h*sc,spot[0]+w*sc/2,spot[1]]);
  }
  return out;
}
function scene(){
  const two=has("bruecke"), three=has("insel3");
  const lastD=S.days[S.days.length-1];
  const clouds=S.glueck<40||(lastD&&lastD.min>S.budget&&!lastD.sunny);
  const nTrees=1+Math.min(3,Math.floor(savedTotal()/600));
  const sk=skyNow(), sea=season(), sleep=sleeping();
  const night=sk.k==="nacht"||sleep;
  let s=`<svg viewBox="0 0 360 240" role="img" aria-label="Deine Insel mit ${here().length} Bewohnern, Inselglück ${S.glueck} Prozent">`;
  s+=`<rect width="360" height="240" fill="${clouds?"#2A2E40":night?"#1B2340":sk.sky}"/>`;
  // Polarlicht
  if(S.aurora>0&&night&&!clouds) s+=`<g class="glow" style="animation-duration:5s"><path d="M0 60q60-40 120-10t120-20 120 10v-30q-60-20-120 0t-120 10-120-10z" fill="#5BF0A4" opacity=".5"/><path d="M0 80q80-30 160 0t200-20v-14q-80 10-180-12t-180 20z" fill="#B6A4FF" opacity=".4"/></g>`;
  if(night&&!clouds){s+=`<g fill="#F3F1EA"><circle cx="30" cy="24" r="1.6"/><circle cx="110" cy="40" r="1.2"/><circle cx="200" cy="18" r="1.8"/><circle cx="300" cy="44" r="1.3"/><circle cx="250" cy="70" r="1"/></g><circle cx="320" cy="34" r="14" fill="#F3F1EA"/><circle cx="327" cy="29" r="13" fill="#1B2340"/>`}
  else if(sk.sun&&!clouds) s+=`<circle cx="${sk.sun[0]}" cy="${sk.sun[1]}" r="16" fill="${sk.sun[2]}"/>`;
  if(owns("regenbogen")&&!night) s+=`<g fill="none" stroke-width="5" opacity=".75"><path d="M40 170a140 120 0 0 1 280 0" stroke="#FF9C7A"/><path d="M46 170a134 114 0 0 1 268 0" stroke="#FFD27A"/><path d="M52 170a128 108 0 0 1 256 0" stroke="#C8F169"/><path d="M58 170a122 102 0 0 1 244 0" stroke="#7CB8E8"/><path d="M64 170a116 96 0 0 1 232 0" stroke="#B6A4FF"/></g>`;
  // Zugvögel
  if(S.birds>0) s+=`<g class="drift" style="animation-duration:5s">${[0,1,2,3,4].map(i=>`<path d="M${120+i*16} ${50+Math.abs(i-2)*8}q5-5 10 0q5-5 10 0" stroke="${night?"#F3F1EA":"#14151F"}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  s+=`<rect y="170" width="360" height="70" fill="${clouds?"#26314A":night?"#24375A":sk.sea}"/>`;
  const sand=clouds?"#BDB08C":"#E9D7A6", grass=clouds?"#5E8A5C":sea==="winter"?"#DDE6EE":sea==="herbst"?"#A9B86A":"#7FC57A";
  const leaf=clouds?"#4A7550":sea==="herbst"?"#E08A3C":sea==="winter"?"#5E8A6C":"#4E9A58";
  const cx=two?120:180;
  s+=`<ellipse cx="${cx}" cy="176" rx="110" ry="20" fill="${sand}"/><path d="M${cx-96} 172c10-40 52-58 96-58s86 18 96 58z" fill="${grass}"/>`;
  // Weg aus Spaziergängen, Muschelweg
  if(S.path>0||owns("muschelweg")){const len=Math.min(160,20+S.path*14);s+=`<path d="M${cx-80} 168q${len/2} -10 ${len} -2" stroke="${owns("muschelweg")?"#F3F1EA":"#D9C38E"}" stroke-width="4" stroke-dasharray="${owns("muschelweg")?"2 5":"6 4"}" fill="none" stroke-linecap="round"/>`}
  if(has("leuchtturm")){
    if(night&&!clouds) s+=`<path d="M${cx-62} 82L0 50v50z" fill="#FFD27A" opacity=".18"/>`;
    s+=`<path d="M${cx-70} 160h16l-3-72h-10z" fill="#F3F1EA"/><path d="M${cx-69} 146h14M${cx-68} 126h12M${cx-67} 106h10" stroke="#FF9C7A" stroke-width="5"/><rect x="${cx-68}" y="76" width="12" height="12" rx="2" fill="${night?"#FFD27A":"#E9E2C8"}"/>`;
  }
  for(let i=0;i<nTrees;i++){const tx=cx-40+i*22-(i%2)*6, ty=128+(i%2)*8;s+=`<rect x="${tx-3}" y="${ty}" width="6" height="26" rx="2" fill="#8A5A3B"/><circle cx="${tx}" cy="${ty-6}" r="15" fill="${leaf}"/>`;
    if(sea==="fruehling"&&!clouds) s+=`<g fill="#FFB3C7"><circle cx="${tx-6}" cy="${ty-10}" r="2"/><circle cx="${tx+5}" cy="${ty-4}" r="2"/><circle cx="${tx+2}" cy="${ty-14}" r="2"/></g>`;
    if(sea==="winter") s+=`<path d="M${tx-14} ${ty-10}q14-14 28 0" stroke="#F3F1EA" stroke-width="4" fill="none" stroke-linecap="round"/>`;}
  const place=layoutItems(cx,two,three,nTrees);
  // Gegenstände auf den Nebeninseln (x ≥ 244) erst nach diesen Inseln zeichnen, sonst verdecken die Inseln sie
  const drawItems=far=>S.items.filter(id=>place[id]&&(two&&place[id][0]>=244)===far).sort((a,b)=>place[a][1]-place[b][1]).forEach(id=>{const p=place[id];s+=`<g data-item="${id}" transform="translate(${p[0]} ${p[1]}) scale(${p[2]||.8})">${itemSvg(id)}</g>`});
  drawItems(false);
  if(owns("laternen")) s+=`<g transform="translate(${cx+92} 170) scale(.8)">${itemSvg("laternen")}</g>`;
  if(S.sun>0&&!clouds&&!night) s+=`<g transform="translate(46 54) scale(.9)">${itemSvg("sonne")}</g>`;
  // Erinnerungsbäume
  S.memorials.slice(0,4).forEach((m,i)=>{const px=[cx-104,cx-112,cx+102,cx+110][i], py=[176,184,180,186][i];
    s+=`<g><title>Erinnerungsbaum für ${esc(m.name)}</title><rect x="${px-1.5}" y="${py-14}" width="3" height="14" fill="#8A5A3B"/><circle cx="${px}" cy="${py-17}" r="7" fill="${leaf}"/><circle cx="${px-2}" cy="${py-19}" r="1.6" fill="#FFD27A"/><rect x="${px+3}" y="${py-6}" width="6" height="5" rx="1" fill="#A4A6BD"/></g>`});
  // Hütte (Licht aus, wenn alle schlafen)
  s+=`<path d="M${cx+30} 160v-24l20-15 20 15v24z" fill="#F3F1EA"/><path d="M${cx+26} 138l24-18 24 18" fill="none" stroke="#FF9C7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="${cx+44}" y="144" width="11" height="16" rx="2" fill="#B6A4FF"/><rect x="${cx+57}" y="140" width="8" height="8" rx="1" fill="${sleep?"#3A3D58":night?"#FFD27A":"#9CC8EE"}"/>`;
  if(sea==="winter") s+=`<path d="M${cx+26} 138l24-18 24 18" fill="none" stroke="#F3F1EA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(has("windmuehle")) s+=`<path d="M${cx+82} 160h10l-1-30h-8z" fill="#F3F1EA"/><path d="M${cx+87} 130l-12-10M${cx+87} 130l12-10M${cx+87} 130l-9 12M${cx+87} 130l9 12" stroke="#FFB86B" stroke-width="3" stroke-linecap="round"/>`;
  if(has("schiff")) s+=`<path d="M${two?160:260} 200h40l-7 10h-26z" fill="#FF9C7A"/><path d="M${two?180:280} 200v-22l12 18z" fill="#F3F1EA"/>`;
  if(two){
    s+=`<path d="M222 150q20-18 40-20" fill="none" stroke="#8A5A3B" stroke-width="5" stroke-linecap="round"/>`;
    s+=`<ellipse cx="300" cy="160" rx="56" ry="14" fill="${sand}"/><path d="M252 158c8-26 30-36 48-36s40 10 48 36z" fill="${grass}"/>`;
  }
  if(three){ s+=`<ellipse cx="300" cy="214" rx="40" ry="9" fill="${sand}"/><path d="M266 213c6-16 20-22 34-22s28 6 34 22z" fill="${grass}"/>`; }
  drawItems(true);
  // Neue Großprojekte
  const PPOS={baumhaus:[cx-96,168,.8],festzelt:two?[318,152,.72]:[cx+60,186,.7],strandhaus:two?[262,168,.62]:[cx+96,194,.75],beachclub:three?[288,216,.66]:two?[268,170,.7]:[cx-70,196,.7],floss:[72,222,.8]};
  ["baumhaus","festzelt","beachclub","strandhaus","floss"].forEach(id=>{if(has(id)){const q=PPOS[id];s+=`<g transform="translate(${q[0]} ${q[1]}) scale(${q[2]})">${projectSvg(id)}</g>`}});
  // Händlerschiff
  if(S.trader) s+=`<g class="wave"><path d="M20 212h56l-8 12H28z" fill="#8A5A3B"/><path d="M48 212v-36l24 32z" fill="#FFD27A"/><path d="M48 180h20M48 190h22M48 200h24" stroke="#FF9C7A" stroke-width="3"/><path d="M46 212v-30l-18 28z" fill="#F3F1EA"/></g>`;
  // Fokus-Boot draußen auf See
  if(S.boat) s+=`<g class="wave"><path d="M290 186h30l-5 7h-20z" fill="#FF9C7A"/><path d="M305 186v-16l9 13z" fill="#F3F1EA"/></g>`;
  // Bewohner
  const people=here();
  // Plätze über die ganze Insel verteilt (hinten → vorne), abwechselnd auf alle Inseln
  const slotsMain=[[cx-58,166],[cx+2,165],[cx-84,175],[cx-30,173],[cx+24,172],[cx+80,174],[cx-60,183],[cx-6,182],[cx+50,183],[cx-90,186],[cx+86,186]];
  const slotsTwo=[[272,157],[300,155],[328,158],[286,166],[316,166]];
  const slotsThree=[[284,210],[304,208],[322,211]];
  const all=[];
  for(let i=0;i<slotsMain.length;i++){all.push(slotsMain[i]);if(two&&slotsTwo[i])all.push(slotsTwo[i]);if(three&&slotsThree[i])all.push(slotsThree[i])}
  const land=people.filter(r=>!isSea(r)), seaP=people.filter(isSea);
  const sadPets=land.filter(r=>r.sad), walkers=land.filter(r=>!r.sad);
  const shown=walkers.slice(0,all.length), inside=walkers.length-shown.length;
  const placed=shown.map((r,i)=>({r,x:all[i][0],y:all[i][1]})).concat(sadPets.map((r,i)=>({r,x:cx+100+i*8,y:172,still:true})));
  placed.sort((a,b)=>a.y-b.y).forEach(({r,x,y,still},i)=>{
    const h=hsh(r.id||r.name), idle=still||sleep||h%5===0;
    const wx=4+h%9, dur=7+(h>>>4)%8, del=-((h>>>8)%100)/10;
    s+=`<g transform="translate(${x} ${y})"><g class="${idle?"":"wander"}" style="--wx:${wx}px;animation-duration:${dur}s;animation-delay:${del}s"><g class="${sleep?"":"bob"}" style="animation-duration:${2.2+(h%9)/10}s;animation-delay:${-((h>>>3)%28)/10}s">${figure(r,0,0)}</g></g></g>`;
  });
  if(inside>0) s+=`<g transform="translate(${cx+50} 110)"><title>${inside} ${inside===1?"weitere Person ist":"weitere Bewohner sind"} gerade im Haus</title><rect x="-12" y="-8" width="24" height="13" rx="6.5" fill="#14151F" opacity=".78"/><text x="0" y="1.6" text-anchor="middle" font-size="8.5" font-weight="800" fill="#F3F1EA" font-family="Manrope, sans-serif">+${inside}</text></g>`;
  const seaSlots=[[40,214],[80,226],[200,222],[240,212],[150,230],[330,228],[20,232],[270,232]];
  seaP.forEach((r,i)=>{const sl=seaSlots[i%seaSlots.length];s+=`<g class="wave" style="animation-delay:${i*0.5}s">${figure(r,sl[0],sl[1])}</g><path d="M${sl[0]-14} ${sl[1]+1}q7 -3 14 0t14 0" stroke="#5B7FB0" stroke-width="1.5" fill="none"/>`});
  // App-Monster im Wasser
  const mPos=[[110,222],[200,230],[310,214],[60,230]];
  (S.monsters||[]).forEach((id,i)=>{const a=S.apps.find(x=>x.id===id);if(!a)return;const p=mPos[i%4];s+=`<g transform="translate(${p[0]} ${p[1]})"><g class="wave"><title>${esc(monName(a,false))}</title>${monsterSvg(a.m)}</g></g>`});
  if(sleep) s+=`<g font-family="Bricolage Grotesque, sans-serif" font-weight="800" fill="#F3F1EA"><text x="${cx+64}" y="128" font-size="10" class="heart">z</text><text x="${cx+70}" y="118" font-size="13" class="heart" style="animation-delay:.8s">z</text><text x="${cx+78}" y="106" font-size="16" class="heart" style="animation-delay:1.6s">Z</text></g>`;
  if(sea==="winter"&&!clouds) s+=`<g fill="#F3F1EA">${Array.from({length:14},(_,i)=>`<g class="rain" style="animation-duration:3s;animation-delay:${(i*.23)%3}s"><circle cx="${12+i*25}" cy="${30+(i*37)%110}" r="1.6"/></g>`).join("")}</g>`;
  if(clouds) s+=cloudsSvg();
  return s+"</svg>";
}

/* ---------- Animierte Szenen für Ereignisse ---------- */
function cloudsSvg(){
  return `<g class="drift"><g fill="#4A4F68"><circle cx="90" cy="46" r="24"/><circle cx="120" cy="38" r="28"/><circle cx="152" cy="50" r="20"/><rect x="70" y="46" width="100" height="22" rx="11"/></g></g>`+
  `<g class="drift" style="animation-delay:-3s"><g fill="#5A607C"><circle cx="230" cy="60" r="20"/><circle cx="258" cy="52" r="24"/><circle cx="284" cy="64" r="16"/><rect x="212" y="60" width="90" height="20" rx="10"/></g></g>`+
  `<g stroke="#7C8FB8" stroke-width="2.5" stroke-linecap="round">${[90,120,150,240,270,296].map((x,i)=>`<g class="rain" style="animation-delay:${i*0.17}s"><path d="M${x} ${78+(i%2)*6}l-4 12"/></g>`).join("")}</g>`;
}
function base(inner,cloudy){
  let s=`<svg viewBox="0 0 360 200" aria-hidden="true"><rect width="360" height="200" fill="${cloudy?"#2A2E40":"#1B2340"}"/>`;
  if(!cloudy) s+=`<g fill="#F3F1EA"><circle cx="40" cy="26" r="1.6"/><circle cx="120" cy="44" r="1.2"/><circle cx="210" cy="20" r="1.8"/><circle cx="330" cy="40" r="1.3"/></g>`;
  s+=`<rect y="132" width="360" height="68" fill="${cloudy?"#26314A":"#24375A"}"/>`;
  s+=`<path d="M20 160h40M200 180h50M90 190h40" stroke="${cloudy?"#2F3B57":"#3A5683"}" stroke-width="3" stroke-linecap="round"/>`;
  s+=`<ellipse cx="282" cy="138" rx="100" ry="16" fill="${cloudy?"#BDB08C":"#E9D7A6"}"/><path d="M192 136c10-34 52-48 90-48s80 14 90 48z" fill="${cloudy?"#5E8A5C":"#7FC57A"}"/>`;
  s+=`<path d="M276 126v-22l18-13 18 13v22z" fill="${cloudy?"#C9C6BE":"#F3F1EA"}"/><path d="M272 106l22-17 22 17" fill="none" stroke="#FF9C7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="288" y="112" width="10" height="14" rx="2" fill="#B6A4FF"/>`;
  s+=`<path d="M150 136h50" stroke="#8A5A3B" stroke-width="5" stroke-linecap="round"/><path d="M160 136v12M190 136v12" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round"/>`;
  return s+inner+(cloudy?cloudsSvg():"")+"</svg>";
}
function boat(people,cls,extra){
  let s=`<g class="${cls}"><g class="wave fb"><path d="M60 140h86l-12 16H72z" fill="#FF9C7A"/><path d="M108 140V96l30 40z" fill="#F3F1EA"/><path d="M104 140V104l-22 32z" fill="#B6A4FF"/>`;
  people.forEach((r,i)=>{const f=figure(r,74+i*12,140);s+=(extra&&i===0)?`<g class="${extra}">${f}</g>`:f});
  return s+`</g></g>`;
}
function hearts(cx,cy){return [0,1,2,3].map(i=>`<g class="heart" style="animation-delay:${i*0.6}s"><path transform="translate(${cx-14+i*10} ${cy})" d="M0 0c-3-4-9-1-6 4l6 5 6-5c3-5-3-8-6-4z" fill="#FF9C7A"/></g>`).join("")}
function confetti(){const c=["#C8F169","#B6A4FF","#FF9C7A","#FFD27A"];return Array.from({length:16},(_,i)=>`<g class="conf" style="animation-delay:${(i*0.19)%2.8}s"><rect x="${12+i*22}" y="0" width="7" height="11" rx="2" fill="${c[i%4]}"/></g>`).join("")}
function suitcase(x,y){return `<g class="shake fb"><rect x="${x}" y="${y}" width="14" height="11" rx="2" fill="#B87A66"/><path d="M${x+4} ${y}v-3h6v3" fill="none" stroke="#B87A66" stroke-width="2"/></g>`}
const idsTo=ids=>ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean);
function animScene(ev){
  if(ev.type==="arrival"){const r=S.residents.find(x=>x.id===ev.id);
    if(isSea(r)) return base(`<g class="sail-in"><g class="wave fb">${figure(r,120,168)}</g></g>`+`<g class="pop fb" style="animation-delay:2.4s">${hearts(120,140)}</g>`,false);
    return base(boat([r],"sail-in","hop"),false)}
  if(ev.type==="return"){const g=idsTo(ev.ids).slice(0,5);return base(boat(g,"sail-in")+`<g class="pop fb" style="animation-delay:2.4s">${hearts(170,112)}</g>`,false)}
  if(ev.type==="left"){const g=idsTo(ev.ids).slice(0,5);return base(boat(g,"sail-out")+suitcase(200,124),true)}
  if(ev.type==="warn"){const g=idsTo(ev.ids).slice(0,4);return base(g.map((r,i)=>figure(r,212+i*14,134)).join("")+suitcase(196,123)+suitcase(262,123),true)}
  if(ev.type==="birth"){
    const ps=idsTo(ev.parents), kid=S.residents.find(x=>x.id===ev.id);
    if(isSea(kid)) return base(ps.map((p,i)=>`<g class="wave">${figure(p,90+i*70,170)}</g>`).join("")+`<g class="pop fb">${figure(kid,128,178)}</g>`+hearts(128,140),false);
    return base(ps.map((p,i)=>figure(p,226+i*40,134)).join("")+`<g class="pop fb">${figure(kid,246,134)}</g>`+hearts(250,100),false);
  }
  if(ev.type==="project"){
    const b={leuchtturm:`<path d="M226 132h20l-4-74h-12z" fill="#F3F1EA"/><path d="M227 118h18M228 98h16M229 78h14" stroke="#FF9C7A" stroke-width="6"/><rect x="228" y="44" width="16" height="14" rx="2" fill="#FFD27A"/>`,
      bruecke:`<path d="M150 120q60-50 120 0" fill="none" stroke="#8A5A3B" stroke-width="7" stroke-linecap="round"/><path d="M170 108v14M190 98v24M210 94v28M230 98v24M250 108v14" stroke="#8A5A3B" stroke-width="3"/>`,
      schiff:`<path d="M150 128h80l-12 16h-56z" fill="#FF9C7A"/><path d="M190 128V80l30 44z" fill="#F3F1EA"/><path d="M186 128V88l-24 36z" fill="#B6A4FF"/>`,
      windmuehle:`<path d="M226 132h18l-3-50h-12z" fill="#F3F1EA"/><path d="M235 82l-24-18M235 82l24-18M235 82l-18 26M235 82l18 26" stroke="#FFB86B" stroke-width="5" stroke-linecap="round"/>`,
      insel3:`<ellipse cx="120" cy="160" rx="70" ry="14" fill="#E9D7A6"/><path d="M58 158c8-24 36-32 62-32s54 8 62 32z" fill="#7FC57A"/>`}[ev.id]||"";
    const np=projectSvg(ev.id); if(np) return base(`<g class="rise fb"><g transform="translate(236 134) scale(1.7)">${np}</g></g>`+confetti(),false);
    const glow=ev.id==="leuchtturm"?`<path d="M236 52L40 20v60z" fill="#FFD27A" class="glow"/>`:"";
    return base(glow+`<g class="rise fb">${b}</g>`+confetti(),false);
  }
  if(ev.type==="day"){
    const good=ev.min<=S.budget;
    return base(good?`<circle cx="70" cy="60" r="22" fill="#FFD27A" class="pop fb"/>`+here().slice(0,4).map((r,i)=>`<g class="bob" style="animation-delay:${i*.4}s">${figure(r,214+i*14,134)}</g>`).join(""):here().slice(0,4).map((r,i)=>figure(r,214+i*14,134)).join(""),!good);
  }
  return "";
}
function makeCard(g,hint){
  const names=nameList(g.map(r=>r.name)), one=g.length===1;
  const w=(a,b)=>one?a:b;
  const animals=g.length&&g[0].kind==="tier";
  const left=g.length?Math.max(1,5-g[0].ret):5;
  const have=new Set(S.postcards.map(c=>c.motif));
  const freshM=MOTIFS.filter(m=>!have.has(m.id));
  const motif=pick(freshM.length?freshM:MOTIFS);
  const place=motif.title.replace(/^(Grüße vo[nm] |Moin aus |Grüße aus )/,"");
  let text;
  if(animals){
    const snd=SOUND[g[0].art]||"";
    text=hint?`${snd} ${snd} ${w("Ich habe","Wir haben")} gehört, dass es bei dir wieder schön ist. Noch ${left} gute Tage! – ${names}`
             :`${snd} ${w("Ich bin","Wir sind")} jetzt hier: ${place}. Ganz nett, aber ${w("ich vermisse","wir vermissen")} dich. Nach 5 guten Tagen ${w("komme ich","kommen wir")} zurück. – ${names}`;
  } else {
    text=hint?pick([`Moin! ${w("Ich höre","Wir hören")}, dass es auf der Insel wieder aufwärts geht. Noch ${left} gute Tage, dann ${w("packe ich","packen wir")} die Koffer. ${names}`,
                    `Hier reden alle von deiner Insel! Noch ${left} gute Tage und ${w("ich bin","wir sind")} wieder da. ${names}`])
             :pick([`Gut angekommen: ${place}. Schön hier, aber ${w("ich vermisse","wir vermissen")} den Steg und die Abende am Feuer. Nach 5 guten Tagen ${w("komme ich","kommen wir")} zurück. ${names}`,
                    `Die Aussicht ist toll, aber Zuhause ist woanders. 5 gute Tage auf deiner Insel, dann ${w("bin ich","sind wir")} wieder bei dir. ${names}`]);
  }
  const card={id:uid(),day:S.lastDay,motif:motif.id,text,animal:animals?g[0].art:null,hint:!!hint};
  S.postcards.push(card); return card;
}
function motifSvg(m,small){
  let s=`<svg viewBox="0 0 350 120" style="display:block;width:100%;height:auto" aria-hidden="true"><rect width="350" height="120" fill="${m.sky}"/>`;
  if(m.id==="sonne") s+=`<circle cx="175" cy="84" r="30" fill="#FF9C7A"/>`;
  if(m.id==="nacht") s+=`<g fill="#F3F1EA"><circle cx="40" cy="20" r="1.8"/><circle cx="120" cy="36" r="1.4"/><circle cx="220" cy="16" r="2"/><circle cx="300" cy="40" r="1.4"/></g><circle cx="290" cy="30" r="12" fill="#F3F1EA"/>`;
  if(m.id==="berg") s+=`<path d="M0 82l60-56 50 40 60-50 80 66 100-30v30z" fill="#8F96A8"/><path d="M48 38l12-12 12 10M158 26l12-10 14 12" fill="#F3F1EA"/>`;
  s+=`<rect y="78" width="350" height="42" fill="${m.sea}"/>`;
  if(m.id==="moewen"||m.id==="sonne"||m.id==="nacht") s+=`<ellipse cx="250" cy="80" rx="80" ry="14" fill="#E9D7A6"/><path d="M180 78c10-18 40-26 70-26s60 8 70 26z" fill="#7FC57A"/>`;
  if(m.id==="hafen") s+=`<g><rect x="200" y="46" width="22" height="32" fill="#FF9C7A"/><rect x="224" y="38" width="20" height="40" fill="#F3F1EA"/><rect x="246" y="50" width="24" height="28" fill="#B6A4FF"/><rect x="272" y="42" width="18" height="36" fill="#FFB86B"/><path d="M200 46l11-10 11 10M224 38l10-10 10 10M272 42l9-9 9 9" fill="#B87A66"/></g><path d="M60 86h50l-8 10H68z" fill="#F3F1EA"/>`;
  if(m.id==="wal") s+=`<g transform="translate(150 92) scale(3)">${animalSvg("Wal")}</g>`;
  if(m.id!=="nacht") s+=`<g class="drift"><path d="M60 34q8-8 16 0q8-8 16 0M110 50q6-6 12 0q6-6 12 0" stroke="#14151F" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  if(!small) s+=`<text x="16" y="110" font-family="Bricolage Grotesque, sans-serif" font-size="17" font-weight="800" fill="#F3F1EA">${esc(m.title)}</text>`;
  return s+"</svg>";
}
function postcardHtml(card){
  const m=MOTIFS.find(x=>x.id===card.motif)||MOTIFS[0];
  const sig=card.animal?`<svg width="44" height="30" viewBox="-22 -24 44 30" aria-hidden="true">${animalSvg(card.animal)}</svg>`:"";
  return `<div class="postcard">${motifSvg(m)}
    <div style="padding:16px 18px;display:flex;gap:12px;align-items:flex-start">
      <div style="flex:1;display:flex;flex-direction:column;gap:6px"><p class="hand">${esc(card.text)}</p>${sig}${card.day?`<p style="font-size:12px;color:#5F6E82">${nice(card.day)}</p>`:""}</div>
      <svg class="stamp fb" width="48" height="58" viewBox="0 0 48 58" aria-hidden="true"><rect x="2" y="2" width="44" height="54" rx="3" fill="none" stroke="#B87A66" stroke-width="2" stroke-dasharray="4 3"/><path d="M18 50h12l-2-30h-8z" fill="#FF9C7A"/><rect x="19" y="12" width="10" height="8" rx="1.5" fill="#FFB86B"/></svg>
    </div></div>`;
}
function countUp(el,from,to){
  if(!el) return; const t0=performance.now(), dur=1200;
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){el.textContent=to+" %";return}
  (function step(t){const k=Math.min(1,(t-t0)/dur);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3)))+" %";if(k<1)requestAnimationFrame(step)})(t0);
}

/* ---------- Ansichten ---------- */
function viewSetup(){
  return `<div class="card">
    <h2>Willkommen${ACC?", "+esc(ACC.name):""}!</h2>
    <p class="muted">Lege fest, wie viel Bildschirmzeit du dir pro Tag geben willst, und wie viel es bisher im Schnitt war. Deine iPhone- oder Android-Einstellungen unter „Bildschirmzeit“ bzw. „Digital Wellbeing“ zeigen dir den Schnitt.</p>
    <label class="field" for="setBudget">Tagesbudget: <span id="setBudgetOut" class="num">${hm(S.budget)}</span>
      <input id="setBudget" type="range" min="30" max="480" step="15" value="${S.budget}"></label>
    <label class="field" for="setBase">Bisheriger Schnitt pro Tag: <span id="setBaseOut" class="num">${hm(S.baseline)}</span>
      <input id="setBase" type="range" min="30" max="600" step="15" value="${S.baseline}"></label>
    <p class="small muted">Deine ersten Bewohner heißen ${here().map(r=>esc(r.name)).join(", ")}. Umbenennen kannst du sie unter „Bewohner“.</p>
    <button class="btn" id="startBtn">Insel starten</button>
  </div>`;
}
function viewHeute(){
  const [mText,mCls]=mood();
  const nd=nextDay(), ok=canClose()&&!S.vacation;
  const last=S.days[S.days.length-1];
  const p=PROJECTS[S.projectIdx];
  const warn=S.warn?S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean):null;
  const wh=whispers();
  const wisher=S.wish?S.residents.find(r=>r.id===S.wish.rid):null;
  const canNight=S.lastDay&&!sleeping()&&(S.testmode||S.lastDay===today())&&!(S.night&&S.night.after===S.lastDay);
  const mons=(S.monsters||[]).map(id=>S.apps.find(a=>a.id===id)).filter(Boolean);
  const guard=S.vacation&&S.vacation.guard?S.residents.find(r=>r.id===S.vacation.guard):null;
  return `
  ${goalCard(ok,nd)}
  <div class="stats">
    <div class="stat"><span class="label">Glück</span><b class="num" style="color:${mCls==="good"?"var(--lime)":mCls==="ok"?"var(--amber)":"var(--coral)"}">${S.glueck} %</b><span class="small muted">${mText}</span></div>
    <div class="stat"><span class="label">Bewohner</span><b class="num">${here().length}/${capacity()}</b><span class="small muted">Plätze</span></div>
    <div class="stat"><span class="label">Punkte</span><b class="num" style="color:var(--lilac)">${S.points}</b><span class="small muted">${S.sun?S.sun+"× Sonne":"zum Bauen"}</span></div>
  </div>
  ${S.vacation?`<div class="card" style="border:1.5px solid var(--lilac)"><p class="label" style="color:var(--lilac)">Urlaubsmodus</p><p>${guard?`<b>${esc(guard.name)}</b> hütet die Insel, bis du zurück bist.`:"Die Insel schläft, bis du zurück bist."} Das Glück sinkt in der Zeit nicht.</p><button class="btn secondary" id="vacOff">Ich bin zurück</button></div>`:""}
  ${warn?`<div class="card warn"><p class="label" style="color:var(--amber)">Wegzug droht</p><p><b>${esc(groupName(warn))}</b> ${vb(warn,"packt","packen")} die Koffer. Bring das Inselglück bis ${nice(S.warn.deadline)} über 40 %, dann ${vb(warn,"bleibt "+esc(warn[0].name),"bleiben alle")}.</p></div>`:""}
  ${wh.length?`<div class="card"><p class="label">Inselgeflüster</p>${wh.map(w=>`<div class="row" style="align-items:flex-start"><div class="avatar" style="background:${w.r.kind==="mensch"?"#26233D":"#22301F"}"><svg width="40" height="40" viewBox="-13 -24 26 27" aria-hidden="true">${figure(w.r,0,0)}</svg></div><div class="grow" style="background:var(--ground);border-radius:4px 16px 16px 16px;padding:10px 12px"><p class="small" style="font-weight:700;color:var(--lilac)">${esc(w.r.name)}${w.r.job?" · "+esc(jobName(w.r.job)):""}</p><p>${esc(w.t)}</p></div></div>`).join("")}</div>`:""}
  ${S.wish&&wisher?`<div class="card"><div class="row"><div class="badge" style="background:#26233D"><svg width="36" height="30" viewBox="-20 -34 40 38" aria-hidden="true">${itemSvg(S.wish.item)}</svg></div><div class="grow"><p class="label">Wunsch</p><p><b>${esc(wisher.name)}</b> wünscht sich: ${esc(itemName(S.wish.item))}</p><p class="small muted">Erfüllst du ihn im Laden, strahlt ${esc(wisher.name)} und bringt dir jeden Tag +3 Punkte.</p></div></div></div>`:""}
  ${mons.length?`<div class="card" style="border:1.5px solid #9B6BD6"><p class="label" style="color:#C8A8FF">App-Monster vor der Insel</p>${mons.map(a=>`<div class="row"><svg width="48" height="40" viewBox="-24 -34 48 40" aria-hidden="true">${monsterSvg(a.m)}</svg><p class="grow">${esc(monName(a,false))}: ${esc(a.name)} lag gestern über ${hm(a.limit)}. Es verscheucht die Fische und kostet Glück.</p></div>`).join("")}<p class="small muted">Bleib heute bei diesen Apps unter dem Limit, dann tauchen sie wieder ab.</p></div>`:""}
  <div class="card">
    <div class="row between"><p class="label">Fokus-Bootsfahrt</p></div>
    ${S.boat?`<p>Das Boot ist draußen. Leg das Handy weg, bis es zurück ist.</p>`
    :`<p class="small muted">Ein Bewohner fährt zum Fischen raus, solange du das Handy weglegst. Hältst du durch, bringt das Boot Punkte und Baumaterial.</p>
      <div class="row">${[15,30,60].map(m=>`<button class="btn secondary grow" style="padding:0" data-boat="${m}" ${adults().length?"":"disabled"}>${m} min</button>`).join("")}</div>`}
  </div>
  <div class="card" id="closeCard">
    <div class="row between"><h2>${S.vacation?"Urlaub":ok?"Tag eintragen":"Bis morgen!"}</h2><span class="small muted">${nice(nd)}</span></div>
    ${ok?`
    ${S.repair?`<p class="small" style="color:var(--amber)">Reparatur möglich: Bleib im Budget und schaff 2 Quests, dann holst du ${S.repair.amount} % Glück zurück.</p>`:""}
    <p class="small muted">Trag die Bildschirmzeit aus deinen Handy-Einstellungen ein. Budget: ${hm(S.budget)}.</p>
    <div class="time">
      <label class="field" for="inH">Stunden<input id="inH" type="number" min="0" max="24" inputmode="numeric" value="${last?Math.floor(last.min/60):2}"></label>
      <label class="field" for="inM">Minuten<input id="inM" type="number" min="0" max="59" step="5" inputmode="numeric" value="${last?last.min%60:30}"></label>
    </div>
    <div class="goal-bar" id="liveBar" aria-hidden="true"><i></i><span class="goal-mark"></span></div>
    <p class="small" id="liveTxt" aria-live="polite" style="font-weight:700;margin-top:-4px"></p>
    <details><summary style="cursor:pointer;font-weight:700;min-height:44px;display:flex;align-items:center">Pro App eintragen (für die App-Monster)</summary>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:6px">${S.apps.map(a=>`<label class="field" for="app_${a.id}" style="font-size:13px">${esc(a.name)} <span class="muted" style="font-weight:500">Limit ${a.limit} min</span><input id="app_${a.id}" type="number" min="0" max="1440" inputmode="numeric" placeholder="Minuten"></label>`).join("")}</div>
    </details>
    <div>${QUESTS.map(q=>`<label class="check" for="q_${q.id}"><input type="checkbox" id="q_${q.id}"> ${q.name} <span class="small muted">+3 %</span></label>`).join("")}</div>
    <button class="btn" id="closeBtn">Tag abschließen</button>`
    :S.vacation?`<p class="muted">Im Urlaubsmodus musst du nichts eintragen.</p>`:`<p class="muted">Heute ist schon eingetragen. Komm morgen Abend wieder und trag den Tag ein.</p>`}
    ${canNight?`<button class="btn secondary" id="nightBtn">Gute Nacht, Insel</button><p class="small muted" style="margin-top:-4px">Leg danach das Handy weg. Morgen gibt es +15 Traumpunkte und mehr Strandgut.</p>`:""}
    ${sleeping()?`<p class="small" style="color:var(--lilac)">Die Insel schläft. Bis morgen!</p>`:""}
  </div>
  ${p?`<div class="card"><div class="row between"><p class="label">Großprojekt</p><span class="small muted num">${Math.floor(S.material/60)} / ${p.hours} h</span></div><p><b>${p.name}</b></p><div class="bar"><i style="width:${Math.min(100,S.material/(p.hours*60)*100)}%;background:var(--lilac)"></i></div><p class="small muted">Jede Minute unter deinem bisherigen Schnitt (${hm(S.baseline)}) wird Baumaterial.</p></div>`:""}
  <div class="card">
    <div class="row between"><p class="label">Testmodus</p><label class="check" for="tm" style="min-height:auto"><input type="checkbox" id="tm" ${S.testmode?"checked":""}> an</label></div>
    <p class="small muted">Im Testmodus kannst du beliebig viele Tage nacheinander eintragen oder zufällig simulieren.</p>
    ${S.testmode?`<div class="row"><button class="btn secondary grow" id="simGood">Guter Tag</button><button class="btn secondary grow" id="simBad">Schlechter Tag</button></div>
    <button class="btn ghost" id="sim10">10 Tage gemischt</button>
    <button class="btn ghost" id="resetBtn">Spielstand zurücksetzen</button>`:""}
  </div>`;
}
/* Tagesziel: Budget, letzter Tag und die letzten 7 Tage auf einen Blick */
function dayLabel(d){return d===today()?"Heute":d===addDays(today(),-1)?"Gestern":nice(d)}
function goalCard(ok,nd){
  const last=S.days[S.days.length-1], week=S.days.slice(-7);
  const inB=week.filter(d=>d.min<=S.budget).length;
  let main;
  if(last){
    const good=last.min<=S.budget, diff=Math.abs(S.budget-last.min), col=good?"var(--lime)":"var(--coral)";
    const scale=Math.max(S.budget*1.5,last.min), bp=S.budget/scale*100;
    main=`<div class="row between" style="align-items:flex-end">
        <div><p class="small muted">${dayLabel(last.day)}</p><p class="goal-num num" style="color:${col}">${hm(last.min)}</p></div>
        <p class="small" style="text-align:right;font-weight:700;color:${col}">${hm(diff)} ${good?"unter":"über"}<br>deinem Ziel</p></div>
      <div class="goal-bar" role="img" aria-label="${hm(last.min)} von ${hm(S.budget)} Tagesziel"><i style="width:${Math.min(100,last.min/scale*100)}%;background:${col}"></i><span class="goal-mark" style="left:${bp}%"></span></div>
      <div class="goal-scale"><span style="left:${clamp(bp,14,86)}%">Ziel ${hm(S.budget)}</span></div>`;
  } else {
    main=`<p class="goal-num num">${hm(S.budget)}</p><p class="small muted">So viel Bildschirmzeit gibst du dir pro Tag. Trag abends ein, wie lange du am Handy warst.</p>`;
  }
  const wmax=Math.max(S.budget*1.5,...week.map(d=>d.min));
  const strip=Array.from({length:7},(_,i)=>{
    const d=week[i-(7-week.length)];
    if(!d) return `<div class="wk"><div class="wk-bar"></div><span>&nbsp;</span></div>`;
    const good=d.min<=S.budget;
    return `<div class="wk${d.day===today()?" now":""}" title="${nice(d.day)}: ${hm(d.min)}"><div class="wk-bar"><i style="height:${Math.max(6,d.min/wmax*100)}%;background:${good?"var(--lime)":"var(--coral)"}"></i><span class="wk-line" style="bottom:${S.budget/wmax*100}%"></span></div><span>${parse(d.day).toLocaleDateString("de-DE",{weekday:"short"}).replace(".","")}</span></div>`;
  }).join("");
  return `<div class="card goal">
    <div class="row between"><p class="label">Tagesziel</p>${S.budgetStreak>1?`<span class="chip good">${S.budgetStreak} Tage in Folge im Ziel</span>`:""}</div>
    ${main}
    ${week.length?`<div class="week" role="img" aria-label="${inB} von ${week.length} Tagen im Ziel">${strip}</div>
    <p class="small muted">Letzte ${week.length} ${week.length===1?"Tag":"Tage"}: <b style="color:var(--ink)">${inB} von ${week.length}</b> im Ziel</p>`:""}
    ${ok?`<button class="btn" id="goalGo">${nd===today()?"Heute eintragen":"Tag eintragen · "+nice(nd)}</button>`
      :S.vacation?"":`<p class="small" style="color:var(--lime);font-weight:700">Heute ist eingetragen. Bis morgen!</p>`}
  </div>`;
}
function liveUpdate(){
  const h=$("#inH"), m=$("#inM"), bar=$("#liveBar"); if(!h||!m||!bar) return;
  const min=clamp((+h.value||0)*60+(+m.value||0),0,1440), good=min<=S.budget;
  const scale=Math.max(S.budget*1.5,min), col=good?"var(--lime)":"var(--coral)";
  const i=bar.querySelector("i"); i.style.width=Math.min(100,min/scale*100)+"%"; i.style.background=col;
  bar.querySelector(".goal-mark").style.left=(S.budget/scale*100)+"%";
  const t=$("#liveTxt"); t.style.color=col;
  t.textContent=hm(min)+(good?" · "+hm(S.budget-min)+" unter deinem Ziel":" · "+hm(min-S.budget)+" über deinem Ziel");
}

function resRow(r){
  const [mText,mCls]=r.status==="verstorben"?["in Erinnerung","gone"]:r.status==="weg"?["weggezogen","gone"]:r.sick?["krank: "+r.sick.kind,"bad"]:mood();
  const partner=r.pair?S.residents.find(x=>x.id===r.pair):null;
  const parents=r.parents?r.parents.map(id=>S.residents.find(x=>x.id===id)).filter(Boolean):[];
  let friend=null, foe=null;
  if(r.kind==="mensch"&&r.status==="da"){
    adults().concat(here().filter(x=>x.kind==="mensch"&&!x.job)).forEach(x=>{if(x.id===r.id||x.id===r.pair)return;const v=relOf(r.id,x.id);
      if(v>=30&&(!friend||v>friend[1]))friend=[x,v]; if(v<=-25&&(!foe||v<foe[1]))foe=[x,v]});
  }
  const age=S.dayCount-(r.born||0);
  const owner=r.owner?S.residents.find(x=>x.id===r.owner):null;
  const sub=[r.kind==="mensch"?(r.job?(r.retired?"Rentner:in, früher "+jobName(r.job):jobName(r.job)):(age>=3?"Schulkind":"Baby"))+(r.trait?", "+traitName(r.trait):""):r.art,
    owner?(r.sad?"vermisst "+owner.name+", wartet am Steg":"gehört zu "+owner.name):"", r.wishDone?"strahlt (Wunsch erfüllt)":"",
    partner?"Partner:in "+partner.name:"",
    friend?"befreundet mit "+friend[0].name:"", foe?"zerstritten mit "+foe[0].name:"", parents.length?"Kind von "+parents.map(p=>p.name).join(" & "):"", r.status==="weg"?"Rückkehr "+r.ret+"/5 gute Tage":""].filter(Boolean).join(" · ");
  const bg=r.kind==="mensch"?"#26233D":"#22301F";
  return `<div class="res"><div class="avatar" style="background:${bg}"><svg width="40" height="40" viewBox="-13 -24 26 27" aria-hidden="true">${figure(r,0,0)}</svg></div>
    <div class="grow"><p><b>${esc(r.name)}</b></p><p class="small muted">${esc(sub||"Bewohner:in")}</p></div>
    <span class="chip ${mCls}">${mText}</span>
    ${r.sick&&S.tea>0?`<button class="iconbtn" style="width:44px;height:44px;background:#22301F" data-tea="${r.id}" aria-label="${esc(r.name)} Kräutertee geben"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8F169" stroke-width="2" stroke-linecap="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></svg></button>`:""}
    ${r.status==="da"?`<button class="iconbtn" style="width:44px;height:44px" data-rename="${r.id}" aria-label="${esc(r.name)} bearbeiten"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B6A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button>`:""}
  </div>`;
}
function viewBewohner(){
  const humans=S.residents.filter(r=>r.kind==="mensch"&&r.status!=="verstorben"), animals=S.residents.filter(r=>r.kind==="tier"&&r.status!=="verstorben");
  return `
  <div class="card"><div class="row between"><p class="label">Inselglück</p><b class="num">${S.glueck} %</b></div><div class="bar"><i style="width:${S.glueck}%"></i></div>
  <p class="small muted">Ab 80 %: alle 3 Tage zieht jemand ein, dazwischen kann es Nachwuchs geben. Unter 40 % gibt es öfter Streit, nach 3 Tagen droht Wegzug.</p></div>
  <div class="card"><p class="label">Menschen</p>${humans.map(resRow).join("")||`<p class="muted">Noch niemand.</p>`}</div>
  <div class="card"><p class="label">Tiere</p>${animals.map(resRow).join("")||`<p class="muted">Noch keine Tiere.</p>`}</div>
  ${S.tea?`<p class="small muted" style="padding:0 4px">Kräutertee im Vorrat: ${S.tea}. Tippe bei kranken Bewohnern auf die Tasse.</p>`:""}
  ${S.memorials.length?`<div class="card"><p class="label">In Erinnerung</p>${S.memorials.slice().reverse().map(m=>{const r=S.residents.find(x=>x.id===m.rid);const kids=S.residents.filter(k=>k.parents&&k.parents.includes(m.rid));
    return `<div class="row" style="padding:6px 0;border-top:1px solid var(--card2)"><svg width="36" height="36" viewBox="-12 -26 24 28" aria-hidden="true"><rect x="-1.5" y="-14" width="3" height="14" fill="#8A5A3B"/><circle cx="0" cy="-17" r="8" fill="#4E9A58"/><circle cx="-2" cy="-19" r="1.8" fill="#FFD27A"/></svg><div class="grow"><p><b>${esc(m.name)}</b></p><p class="small muted">${m.job?esc(jobName(m.job))+", ":""}verabschiedet am ${nice(m.day)}${kids.length?" · Kinder: "+kids.map(k=>esc(k.name)).join(", "):""}</p></div></div>`}).join("")}
  <p class="small muted">Für jede:n steht ein Erinnerungsbaum auf der Insel.</p></div>`:""}
  ${viewArten()}
  ${viewStammbaum()}
  ${viewChronik()}`;
}
function viewStammbaum(){
  const humans=S.residents.filter(r=>r.kind==="mensch"), allH=humans;
  const roots=humans.filter(r=>!r.parents);
  const seen=new Set(); const fams=[];
  roots.forEach(r=>{if(seen.has(r.id))return;const p=r.pair?S.residents.find(x=>x.id===r.pair):null;seen.add(r.id);if(p)seen.add(p.id);
    const kids=allH.filter(k=>k.parents&&k.parents.some(x=>x===r.id||(p&&x===p.id)));fams.push({a:r,b:p,kids})});
  const tag=r=>`<span style="display:inline-flex;align-items:center;gap:4px;background:var(--ground);border-radius:999px;padding:3px 10px 3px 4px;font-size:13px;font-weight:700;${r.status!=="da"?"opacity:.5":""}" title="${r.status==="verstorben"?"in Erinnerung":""}"><svg width="22" height="22" viewBox="-13 -24 26 27" aria-hidden="true">${figure(r,0,0)}</svg>${esc(r.name)}</span>`;
  return `<div class="card"><p class="label">Stammbaum</p>${fams.filter(f=>f.b||f.kids.length).map(f=>`<div style="display:flex;flex-direction:column;gap:6px;padding:6px 0;border-top:1px solid var(--card2)">
    <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${tag(f.a)}${f.b?`<span class="muted">♥</span>${tag(f.b)}`:""}</div>
    ${f.kids.length?`<div style="display:flex;flex-wrap:wrap;gap:6px;padding-left:18px;border-left:2px solid var(--line);margin-left:12px">${f.kids.map(tag).join("")}</div>`:""}</div>`).join("")||`<p class="small muted">Noch keine Familien. Paare entstehen durch Zuzug oder wenn sich zwei verlieben.</p>`}</div>`;
}
function viewChronik(){
  const items=S.chronicle.slice(-25).reverse();
  return `<div class="card feed"><p class="label">Inselchronik</p><ul>${items.map(c=>`<li><span class="dot" style="background:var(--lilac)"></span><div><p>${esc(c.text)}</p>${c.day?`<p class="small muted">${nice(c.day)}</p>`:""}</div></li>`).join("")||`<li><p class="muted">Hier stehen die großen Momente deiner Bewohner.</p></li>`}</ul></div>`;
}
function viewArten(){
  const seen=new Set(S.residents.filter(r=>r.kind==="tier").map(r=>r.art));
  const all=LAND.concat(SEA);
  return `<div class="card"><div class="row between"><p class="label">Tierarten entdeckt</p><span class="small muted num">${all.filter(a=>seen.has(a)).length} / ${all.length}</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${all.map(a=>{const ok=seen.has(a);
    return `<div style="background:var(--ground);border-radius:14px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;${ok?"":"opacity:.4"}">
      <svg width="48" height="34" viewBox="${a==="Wal"?"-24 -20 48 26":"-16 -22 32 24"}" aria-hidden="true">${ok?animalSvg(a):`<g opacity=".5" style="filter:brightness(0) invert(.45)">${animalSvg(a)}</g>`}</svg>
      <span style="font-size:11px;font-weight:700;text-align:center;line-height:1.2">${ok?a:"?"}</span></div>`}).join("")}</div>
  <p class="small muted">Delfine und Wale kommen erst, wenn der Leuchtturm steht.</p></div>`;
}
function viewAlbum(){
  const have=new Set(S.postcards.map(c=>c.motif));
  const cards=S.postcards.slice().reverse();
  return `<div class="card"><div class="row between"><p class="label">Postkarten-Album</p><span class="small muted num">${have.size} / ${MOTIFS.length} Motive</span></div>
  <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">${MOTIFS.map(m=>have.has(m.id)
    ?`<div style="border-radius:8px;overflow:hidden;border:2px solid #F3F1EA">${motifSvg(m,true)}</div>`
    :`<div style="border-radius:8px;border:1.5px dashed var(--line);aspect-ratio:350/120;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C7F99" stroke-width="2" stroke-linecap="round" aria-label="Noch nicht gesammelt"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></div>`).join("")}</div>
  ${cards.length?`<div style="display:flex;flex-direction:column;gap:6px;margin-top:4px">${cards.map(c=>{const m=MOTIFS.find(x=>x.id===c.motif)||MOTIFS[0];
    return `<button data-card="${c.id}" style="display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 10px;border:none;border-radius:14px;background:var(--ground);color:var(--ink);text-align:left">
      <span style="width:56px;flex-shrink:0;border-radius:4px;overflow:hidden">${motifSvg(m,true)}</span>
      <span class="grow" style="display:flex;flex-direction:column"><b style="font-size:14px">${esc(m.title)}</b><span class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.text)}</span></span></button>`}).join("")}</div>`
  :`<p class="small muted">Noch keine Post. Wer wegzieht, schreibt dir. Jede Karte hat ein Motiv, das du sammeln kannst.</p>`}
  </div>`;
}
function viewZeit(){
  const n=S.days.length;
  const saved=savedTotal();
  const over=S.days.reduce((a,d)=>a+Math.max(0,d.min-S.budget),0);
  const total=S.days.reduce((a,d)=>a+d.min,0);
  const avg=n?total/n:S.baseline;
  const yearOld=S.baseline*365/60/24, yearNow=avg*365/60/24;
  const eqGrid=min=>`<div class="eq">${ACTS.map(a=>{const c=Math.floor(min/a.min);return `<div class="eqi ${c?"":"zero"}" style="color:${c?"var(--lime)":"var(--muted)"}">${actIcon(a)}<div><b class="num" style="color:var(--ink)">${c}</b><span class="small muted">${esc(c===1?SING[a.n]:a.n)}</span></div></div>`}).join("")}</div>`;
  const week=S.days.slice(-7), prev=S.days.slice(-14,-7);
  const sum=a=>a.reduce((x,d)=>x+d.min,0);
  return `
  <div class="card">
    <p class="label">Zurückgewonnene Zeit</p>
    <p class="big num" style="color:var(--lime)">${hm(saved)}</p>
    <p class="small muted">gegenüber deinem bisherigen Schnitt von ${hm(S.baseline)} pro Tag, in ${n} ${n===1?"Tag":"Tagen"}.</p>
    <p style="margin-top:4px"><b>Damit hast du Zeit gewonnen für:</b></p>
    ${eqGrid(saved)}
  </div>
  <div class="card">
    <p class="label">Über dem Budget verbracht</p>
    <p class="big num" style="color:var(--coral)">${hm(over)}</p>
    <p class="small muted">${over?"Das wären gewesen: "+esc(eqText(equivTop(over)))+".":"Bisher bist du immer im Budget geblieben."}</p>
  </div>
  <div class="card">
    <p class="label">Hochgerechnet aufs Jahr</p>
    <div class="row between"><span>Mit deinem alten Schnitt</span><b class="num">${Math.round(yearOld)} Tage</b></div>
    <div class="bar"><i style="width:${Math.min(100,yearOld/120*100)}%;background:var(--coral)"></i></div>
    <div class="row between"><span>Mit deinem jetzigen Schnitt (${hm(avg)})</span><b class="num">${Math.round(yearNow)} Tage</b></div>
    <div class="bar"><i style="width:${Math.min(100,yearNow/120*100)}%"></i></div>
    <p class="small muted">${yearOld>yearNow?"Du gewinnst so rund "+Math.round(yearOld-yearNow)+" ganze Tage pro Jahr zurück, rund um die Uhr gerechnet.":"Noch kein Unterschied. Jeder Tag im Budget verschiebt diese Zahl."}</p>
  </div>
  ${week.length?`<div class="card"><p class="label">Diese 7 Tage</p><div class="row between"><span>Bildschirmzeit</span><b class="num">${hm(sum(week))}</b></div>
  ${prev.length?`<div class="row between"><span>Die 7 Tage davor</span><b class="num">${hm(sum(prev))}</b></div><p class="small" style="color:${sum(week)<=sum(prev)?"var(--lime)":"var(--coral)"}">${sum(week)<=sum(prev)?"−"+hm(sum(prev)-sum(week))+" weniger als davor":"+"+hm(sum(week)-sum(prev))+" mehr als davor"}</p>`:""}</div>`:""}
  <div class="card"><p class="label">App-Monster</p>
  ${S.apps.map(a=>{const ds=S.days.filter(d=>d.apps&&d.apps[a.id]!=null);const tot=ds.reduce((x,d)=>x+(d.apps[a.id]||0),0);const over=ds.filter(d=>d.apps[a.id]>a.limit).length;
    return `<div class="row" style="padding:6px 0;border-top:1px solid var(--card2)"><svg width="44" height="36" viewBox="-24 -34 48 40" aria-hidden="true" style="${over?"":"opacity:.35"}">${monsterSvg(a.m)}</svg><div class="grow"><p><b>${esc(a.name)}</b> <span class="small muted">· Limit ${a.limit} min</span></p><p class="small muted">${ds.length?`${hm(tot)} in ${ds.length} Tagen · ${over}× ${esc(monName(a,false))} aufgetaucht`:"Noch nicht eingetragen"}</p></div></div>`}).join("")}
  <p class="small muted">Trag beim Tagesabschluss die Minuten pro App ein, dann siehst du hier, welche App die meiste Zeit frisst.</p></div>
  <p class="small muted" style="padding:0 4px">Die Umrechnungen sind Faustwerte, zum Beispiel 30 Minuten für einen Spaziergang oder 6 Stunden für ein Buch.</p>`;
}
function viewShop(){
  return `<div class="card"><div class="row between"><h2>Inselladen</h2><span class="chip" style="background:#26233D;color:var(--lilac)">${S.points} Punkte</span></div>
  <p class="small muted">Punkte gibt es für jede Minute unter deinem Budget und für Quests. ${jobOn("tischler")?"Dank Tischler:in ist alles 10 % billiger.":""}</p>
  ${[["vorrat","Vorräte","Wird beim Kauf verbraucht"],["nutzen","Nützliches","Steht auf der Insel und hilft"],["deko","Deko","Macht die Insel schöner"]].map(([cat,title,sub])=>{
    const list=SHOP.filter(it=>it.cat===cat), have=list.filter(it=>!it.consumable&&owns(it.id)).length;
    return `<div class="shop-head"><p class="label">${title}</p><span class="small muted">${cat==="vorrat"?sub:have+" von "+list.length+" auf der Insel"}</span></div>
    <div class="shop-grid">${list.map(it=>{
    const own=!it.consumable&&owns(it.id), cost=price(it), can=S.points>=cost, stock=it.id==="tee"?S.tea:it.id==="sonne"?S.sun:0;
    return `<div class="shop-item${own?" owned":""}">
      <div class="shop-pic"><svg width="70" height="56" viewBox="-20 -34 40 38" aria-hidden="true">${itemSvg(it.id)}</svg></div>
      <p style="font-weight:700">${esc(it.n)}${stock?` <span class="small muted">· Vorrat ${stock}</span>`:""}</p>
      <p class="small muted" style="flex:1">${esc(it.fx)}</p>
      ${own?`<span class="chip good" style="align-self:flex-start">auf der Insel</span>`:`<button class="btn ${can?"":"secondary"}" style="height:44px;font-size:14px" data-buy="${it.id}" ${can?"":"disabled"}>${cost} Punkte</button>`}
    </div>`}).join("")}</div>`}).join("")}
  ${S.trader?`<div style="margin-top:6px;padding:14px;border-radius:18px;border:1.5px solid var(--amber);display:flex;flex-direction:column;gap:8px">
    <p class="label" style="color:var(--amber)">Händlerschiff · nur bis ${nice(S.trader.until)}</p>
    ${S.trader.items.map(id=>{const it=RARE.find(x=>x.id===id);const own=owns(id),cost=price(it),can=S.points>=cost;
      return `<div class="row"><div class="badge" style="background:var(--card2)"><svg width="36" height="30" viewBox="-20 -34 40 38" aria-hidden="true">${itemSvg(id)}</svg></div><div class="grow"><p><b>${esc(it.n)}</b></p><p class="small muted">${esc(it.fx)}</p></div>${own?`<span class="chip good">gekauft</span>`:`<button class="btn ${can?"":"secondary"}" style="height:44px;font-size:14px;padding:0 14px" data-buy="${id}" ${can?"":"disabled"}>${cost}</button>`}</div>`}).join("")}
  </div>`:""}
  </div>`;
}
function itemSvg(id){
  switch(id){
  case "sonne": return `<g class="spin" style="animation-duration:14s"><g stroke="#FFB86B" stroke-width="2" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<path d="M${(Math.cos(r)*11).toFixed(1)} ${(-15+Math.sin(r)*11).toFixed(1)}L${(Math.cos(r)*15).toFixed(1)} ${(-15+Math.sin(r)*15).toFixed(1)}"/>`}).join("")}</g></g><circle cx="0" cy="-15" r="8" fill="#FFD27A"/><circle cx="-2.6" cy="-16" r=".9" fill="#8A5A3B"/><circle cx="2.6" cy="-16" r=".9" fill="#8A5A3B"/><path d="M-2.6 -12.6q2.6 2 5.2 0" stroke="#8A5A3B" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  case "tee": return `<ellipse cx="0" cy="-1" rx="12" ry="2.6" fill="#A4A6BD"/><path d="M-8 -14h16v4a8 8 0 0 1-16 0z" fill="#F3F1EA"/><path d="M8 -12.5h2.4a3 3 0 0 1 0 6h-3" stroke="#F3F1EA" stroke-width="1.8" fill="none"/><ellipse cx="0" cy="-14" rx="8" ry="1.6" fill="#8FBF6A"/><path d="M-3 -9l2 2 4-4" stroke="#C8F169" stroke-width="1.2" fill="none" opacity=".7"/><g stroke="#F3F1EA" stroke-width="1.5" fill="none" stroke-linecap="round"><path class="steam" d="M-3 -17q-2.4-3 0-6t0-6"/><path class="steam" style="animation-delay:.8s" d="M3 -17q-2.4-3 0-6t0-6"/><path class="steam" style="animation-delay:1.6s" d="M0 -18q-2.4-3 0-6t0-6"/></g>`;
  case "klee": return `<g class="bob" style="animation-duration:2.4s"><path d="M0 -12q2 6 -1 12" stroke="#4E9A58" stroke-width="1.6" fill="none"/><g fill="#5FB86A"><circle cx="-4" cy="-16" r="4.4"/><circle cx="4" cy="-16" r="4.4"/><circle cx="-4" cy="-8.6" r="4.4"/><circle cx="4" cy="-8.6" r="4.4"/></g><g class="glow" style="animation-duration:1.8s"><path d="M10 -24l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FFD27A"/></g></g>`;
  case "blumen": return `<rect x="-13" y="-5" width="26" height="6" rx="2" fill="#8A5A3B"/><g class="sway" style="animation-duration:3.4s"><path d="M-8 -5v-6M-2 -5v-8M4 -5v-6M9 -5v-7" stroke="#5FA864" stroke-width="1.6"/><circle cx="-8" cy="-12" r="2.6" fill="#FF9C7A"/><circle cx="-2" cy="-14" r="2.6" fill="#FFD27A"/><circle cx="4" cy="-12" r="2.6" fill="#B6A4FF"/><circle cx="9" cy="-13" r="2.6" fill="#FF9C7A"/></g>`;
  case "palme": return `<path d="M0 0q2-14 5-26" stroke="#8A5A3B" stroke-width="3.4" fill="none" stroke-linecap="round"/><g class="sway" style="animation-duration:4s"><path d="M5 -26q-10-4-16 2M5 -26q10-5 15 2M5 -26q-4-9-12-9M5 -26q5-9 13-8M5 -26q0 8 -3 12" stroke="#4E9A58" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="4" cy="-24" r="1.8" fill="#8A5A3B"/></g>`;
  case "bank": return `<rect x="-12" y="-9" width="24" height="3" rx="1" fill="#B07A55"/><rect x="-12" y="-15" width="24" height="3" rx="1" fill="#B07A55"/><path d="M-10 -6v6M10 -6v6M-10 -12v6M10 -12v6" stroke="#7A5038" stroke-width="2"/>`;
  case "feuer": return `<path d="M-10 0l20-5M-10 -5l20 5" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round"/><g class="flick"><path d="M0 -4c-6 0-7-6-3-11 0 3 2 3 2 3 0-6 3-9 5-12 0 6 4 8 4 12 0 5-3 8-8 8z" fill="#FFB86B"/><path d="M0 -4c-2 0-3-2-1-5 1 2 2 2 2 2 0-2 1-4 2-5 1 3 1 4 1 6s-2 2-4 2z" fill="#FFD27A"/></g><g class="glow" style="animation-duration:1.4s"><circle cx="0" cy="-10" r="12" fill="#FFB86B" opacity=".25"/></g>`;
  case "laternen": return `<path d="M0 0v-22" stroke="#7C7F99" stroke-width="2"/><rect x="-3.5" y="-28" width="7" height="8" rx="1.5" fill="#FFD27A"/><path d="M-4.5 -28h9l-4.5-3z" fill="#5F6380"/><g class="glow" style="animation-duration:2.2s"><circle cx="0" cy="-24" r="9" fill="#FFD27A"/></g>`;
  case "brunnen": return `<rect x="-10" y="-8" width="20" height="8" rx="2" fill="#A4A6BD"/><ellipse cx="0" cy="-8" rx="10" ry="2.6" fill="#7CB8E8"/><g class="glow" style="animation-duration:2s"><ellipse cx="-2" cy="-8.4" rx="4" ry="1" fill="#F3F1EA"/></g><path d="M-8 -8v-12M8 -8v-12" stroke="#8A5A3B" stroke-width="2"/><path d="M-11 -20l11-6 11 6z" fill="#FF9C7A"/><g class="swing" style="animation-duration:3s"><path d="M0 -20v6" stroke="#7C7F99" stroke-width="1"/><rect x="-2" y="-14" width="4" height="3.4" rx="1" fill="#8A5A3B"/></g>`;
  case "spielplatz": return `<path d="M-12 0l4-20h16l4 20M-8 -20h16" stroke="#B6A4FF" stroke-width="2.4" fill="none" stroke-linejoin="round"/><g class="swing" style="animation-duration:2.2s"><path d="M-2 -20v12M4 -20v12" stroke="#A4A6BD" stroke-width="1"/><rect x="-4" y="-8" width="10" height="2.6" rx="1" fill="#FF9C7A"/></g>`;
  case "stall": return `<path d="M-12 0v-12l12-9 12 9v12z" fill="#C25E3A"/><rect x="-4" y="-9" width="8" height="9" fill="#7A3A22"/><path d="M-4 -9l8 9M4 -9l-8 9" stroke="#F3F1EA" stroke-width="1"/><path d="M-13 -12l13-10 13 10" stroke="#F3F1EA" stroke-width="1.6" fill="none"/>`;
  case "haengematte": return `<path d="M-13 0v-18M13 0v-18" stroke="#8A5A3B" stroke-width="2.4" stroke-linecap="round"/><g class="swing" style="animation-duration:3.2s"><path d="M-13 -15q13 12 26 0" stroke="#C8F169" stroke-width="3.4" fill="none"/></g>`;
  case "picknick": return `<path d="M-16 -1l4-7h24l4 7z" fill="#FF9C7A"/><path d="M-12 -8l-2 3.5M-6 -8l-2 7M0 -8v7M6 -8l2 7M12 -8l2 3.5M-14 -4.5h28" stroke="#F3F1EA" stroke-width="1.4" opacity=".8"/><rect x="2" y="-14" width="10" height="7" rx="1.6" fill="#B07A55"/><path d="M3 -14q4-6 8 0" stroke="#7A5038" stroke-width="1.4" fill="none"/><circle cx="-6" cy="-6" r="2" fill="#E5484D"/><path d="M-6 -8l1-1.6" stroke="#5FA864" stroke-width="1"/>`;
  case "vogelhaus": return `<path d="M0 0v-16" stroke="#8A5A3B" stroke-width="2.4"/><rect x="-7" y="-26" width="14" height="11" rx="1.5" fill="#B07A55"/><path d="M-9 -25l9-7 9 7z" fill="#5BC0A8"/><circle cx="0" cy="-21" r="2.4" fill="#3A3D58"/><g class="bob" style="animation-duration:1.4s"><path d="M8 -15q2-3 5-2l2-1-1 2q0 3-3 3h-3z" fill="#FFB86B"/><circle cx="12.4" cy="-16.6" r=".6" fill="#14151F"/></g>`;
  case "angel": return `<path d="M-16 -4h24" stroke="#8A5A3B" stroke-width="4"/><path d="M-12 -4v6M2 -4v6" stroke="#7A5038" stroke-width="2"/><path d="M-4 -6l14-22" stroke="#7A5038" stroke-width="1.6" stroke-linecap="round"/><path d="M10 -28q6 8 6 26" stroke="#F3F1EA" stroke-width=".6" fill="none"/><g class="wave"><circle cx="16" cy="-1" r="1.8" fill="#E5484D"/><path d="M12 1q4-2 8 0" stroke="#9CC8EE" stroke-width="1" fill="none"/></g>`;
  case "schaukel": return `<path d="M-14 0l6-24h16l6 24M-10 -24h20" stroke="#8A5A3B" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><g class="swing" style="animation-duration:2.4s"><path d="M-4 -24v16M4 -24v16" stroke="#A4A6BD" stroke-width="1"/><rect x="-6" y="-9" width="12" height="2.6" rx="1" fill="#5BC0A8"/></g>`;
  case "garten": return `<rect x="-15" y="-5" width="30" height="5" rx="2" fill="#7A5038"/><g class="sway" style="animation-duration:3.6s"><path d="M-10 -5l-2-6M-10 -5l0-7M-10 -5l2-6" stroke="#5FA864" stroke-width="1.4" stroke-linecap="round"/><path d="M-1 -5l-2-6M-1 -5l0-7M-1 -5l2-6" stroke="#5FA864" stroke-width="1.4" stroke-linecap="round"/></g><path d="M-11.4 -5l1.4 4 1.4-4z" fill="#FF9C7A"/><path d="M-2.4 -5l1.4 4 1.4-4z" fill="#FF9C7A"/><circle cx="9" cy="-8" r="4.4" fill="#8FD18A"/><circle cx="9" cy="-8" r="2.4" fill="#5FA864"/>`;
  case "bienen": return `<path d="M-6 0v-4M6 0v-4" stroke="#8A5A3B" stroke-width="2"/><path d="M-9 -4q0-18 9-18t9 18z" fill="#FFD27A"/><path d="M-8 -9h16M-7 -14h14M-4.6 -18.6h9.2" stroke="#E0A93C" stroke-width="1.4"/><rect x="-2" y="-8" width="4" height="4" rx="2" fill="#5A3A2A"/><g class="buzz"><ellipse cx="12" cy="-20" rx="2" ry="1.4" fill="#FFD27A"/><path d="M11 -20.8v1.6M13 -20.8v1.6" stroke="#14151F" stroke-width=".6"/><ellipse cx="12" cy="-21.6" rx="1.4" ry=".8" fill="#F3F1EA" opacity=".8"/></g><g class="buzz" style="animation-delay:-1.1s;animation-duration:2.8s"><ellipse cx="-12" cy="-16" rx="2" ry="1.4" fill="#FFD27A"/><path d="M-13 -16.8v1.6M-11 -16.8v1.6" stroke="#14151F" stroke-width=".6"/></g>`;
  case "baumhaus": return `<rect x="-3" y="-20" width="6" height="20" fill="#8A5A3B"/><circle cx="0" cy="-26" r="12" fill="#4E9A58"/><rect x="-9" y="-26" width="18" height="10" rx="1" fill="#B07A55"/><path d="M-11 -26l11-6 11 6z" fill="#FF9C7A"/><rect x="-2.4" y="-23" width="4.8" height="7" fill="#7A3A22"/><g class="glow" style="animation-duration:3s"><rect x="4" y="-24" width="3.4" height="3.4" fill="#FFD27A"/></g><path d="M7 -16l3 16M10 -16l3 16M7.6 -12h3M8.4 -8h3M9.2 -4h3" stroke="#D9C38E" stroke-width="1"/>`;
  case "sternwarte": return `<rect x="-11" y="-12" width="22" height="12" rx="1" fill="#C9C6BE"/><path d="M-12 -12a12 12 0 0 1 24 0z" fill="#5F6380"/><path d="M-2 -23v11h4v-11" fill="#14151F"/><path d="M0 -20l6-8" stroke="#B6A4FF" stroke-width="3" stroke-linecap="round"/><rect x="-3" y="-8" width="6" height="8" fill="#3A3D58"/><g class="glow" style="animation-duration:1.6s"><path d="M12 -30l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FFD27A"/></g><g class="glow" style="animation-duration:2.3s;animation-delay:.7s"><path d="M-12 -28l.8 1.6 1.6.8-1.6.8-.8 1.6-.8-1.6-1.6-.8 1.6-.8z" fill="#F3F1EA"/></g>`;
  case "sandburg": return `<path d="M-14 0v-8h4v-3h3v3h4v-10h3v-2h3v2h3v10h4v-3h3v3h4v8z" fill="#E9D7A6" stroke="#D9C38E" stroke-width=".8"/><rect x="-2" y="-6" width="4" height="6" rx="2" fill="#C9B07A"/><path d="M1.6 -22v-6" stroke="#8A5A3B" stroke-width=".8"/><g class="flagwave"><path d="M1.6 -28h5l-1.6 1.6 1.6 1.6h-5z" fill="#FF9C7A"/></g>`;
  case "zwerg": return `<g class="sway" style="animation-duration:2.6s"><path d="M-5 0h10l-1-8h-8z" fill="#5B8CD6"/><circle cx="0" cy="-11" r="3.6" fill="#F3D2B8"/><path d="M-4 -10q4 9 8 0" fill="#F3F1EA"/><path d="M-4.6 -12.6l4.6-10 4.6 10z" fill="#E5484D"/><circle cx="-1.2" cy="-12" r=".6" fill="#14151F"/><circle cx="1.2" cy="-12" r=".6" fill="#14151F"/><circle cx="0" cy="-10.6" r="1" fill="#FF9C7A"/></g>`;
  case "windspiel": return `<path d="M-10 -26h20" stroke="#8A5A3B" stroke-width="1.6" stroke-linecap="round"/><g class="swing" style="animation-duration:2s"><path d="M-6 -26v10M0 -26v14M6 -26v8" stroke="#7C7F99" stroke-width=".6"/><rect x="-7" y="-16" width="2" height="7" rx="1" fill="#C8F169"/><rect x="-1" y="-12" width="2" height="8" rx="1" fill="#B6A4FF"/><rect x="5" y="-18" width="2" height="6" rx="1" fill="#FFB86B"/></g>`;
  case "flagge": return `<path d="M-8 0v-30" stroke="#A4A6BD" stroke-width="1.8" stroke-linecap="round"/><g class="flagwave"><path d="M-7 -30h16q-3 5 0 10h-16z" fill="#C8F169"/><circle cx="1" cy="-25" r="2.6" fill="#5B8CD6"/></g>`;
  case "schirm": return `<path d="M0 0l2-22" stroke="#7A5038" stroke-width="1.6"/><g class="sway" style="animation-duration:4s"><path d="M-14 -18q16-14 32 4z" fill="#FF9C7A"/><path d="M-6 -24q3 8 2 9M4 -25q2 7 4 9" stroke="#F3F1EA" stroke-width="3" fill="none"/></g><ellipse cx="0" cy="0" rx="10" ry="2" fill="#000" opacity=".12"/>`;
  case "lichter": return `<path d="M-18 -26q18 14 36 0" stroke="#3A3D58" stroke-width=".8" fill="none"/>${[[-14,-23,"#FF9C7A"],[-8,-20,"#FFD27A"],[-2,-19,"#C8F169"],[4,-19,"#B6A4FF"],[10,-21,"#5BC0A8"],[15,-24,"#FF9C7A"]].map((b,i)=>`<g class="glow" style="animation-duration:1.6s;animation-delay:${i*.27}s"><circle cx="${b[0]}" cy="${b[1]}" r="2.4" fill="${b[2]}"/></g><circle cx="${b[0]}" cy="${b[1]}" r="1.3" fill="${b[2]}"/>`).join("")}`;
  case "teich": return `<ellipse cx="0" cy="-3" rx="17" ry="5" fill="#7CB8E8"/><ellipse cx="-4" cy="-4" rx="8" ry="1.6" fill="#F3F1EA" opacity=".35"/><path d="M14 -6v-6M16 -6v-8M12 -6v-5" stroke="#5FA864" stroke-width="1.4" stroke-linecap="round"/><g class="bob" style="animation-duration:2s"><path d="M-10 -5q0-4 4-4h2q0-3 3-3t3 3l-2 1q2 0 1 3z" fill="#F3F1EA"/><path d="M2.2 -11.6l2.4 .6-2.4 .6z" fill="#FFB86B"/><circle cx="0.6" cy="-11.8" r=".5" fill="#14151F"/></g><g class="bob" style="animation-duration:2.4s;animation-delay:-.8s"><path d="M2 -3q0-3 3-3h1.4q0-2.4 2.2-2.4t2.2 2.4l-1.4 .8q1.4 0 .8 2.2z" fill="#FFD27A"/><path d="M10.6 -8l1.8 .5-1.8 .5z" fill="#FFB86B"/></g>`;
  case "regenbogen": return `<g fill="none" stroke-width="3"><path d="M-16 0a16 16 0 0 1 32 0" stroke="#FF9C7A"/><path d="M-12.5 0a12.5 12.5 0 0 1 25 0" stroke="#FFD27A"/><path d="M-9 0a9 9 0 0 1 18 0" stroke="#C8F169"/><path d="M-5.5 0a5.5 5.5 0 0 1 11 0" stroke="#B6A4FF"/></g><g class="glow"><circle cx="-12" cy="-16" r="1.4" fill="#F3F1EA"/><circle cx="13" cy="-12" r="1" fill="#F3F1EA"/></g>`;
  case "glocke": return `<path d="M-8 0v-26h16v26" stroke="#8A5A3B" stroke-width="1.6" fill="none"/><g class="swing" style="animation-duration:1.8s"><path d="M0 -26v3M-8 -6q0-16 8-17q8 1 8 17l3 3h-22z" fill="#FFD27A" stroke="#E0A93C" stroke-width="1"/><circle cx="0" cy="-1" r="2.4" fill="#E0A93C"/></g>`;
  case "teleskop": return `<path d="M-10 0l8-12M10 0l-8-12M0 0v-12" stroke="#8A5A3B" stroke-width="2"/><rect x="-14" y="-22" width="26" height="7" rx="3" fill="#B6A4FF" transform="rotate(-20 0 -18)"/><g class="glow" style="animation-duration:2s"><circle cx="13" cy="-27" r="2" fill="#FFD27A"/></g>`;
  case "muschelweg": return `<path d="M-16 -4q16 -8 32 0" stroke="#D9C38E" stroke-width="5" fill="none" stroke-linecap="round"/><g fill="#F3F1EA">${[[-10,-6],[-2,-8],[6,-8],[13,-6]].map((c,i)=>`<g class="glow" style="animation-duration:2.6s;animation-delay:${i*.5}s"><circle cx="${c[0]}" cy="${c[1]}" r="2.4"/></g><circle cx="${c[0]}" cy="${c[1]}" r="2"/>`).join("")}</g>`;
  }
  return "";
}
function projectSvg(id){
  switch(id){
  case "baumhaus": return `<rect x="-4" y="-34" width="8" height="34" fill="#8A5A3B"/><path d="M-4 -12l-8 6M4 -16l7 5" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round"/><g class="sway" style="animation-duration:5s"><circle cx="-10" cy="-44" r="14" fill="#4E9A58"/><circle cx="10" cy="-46" r="14" fill="#5FA864"/><circle cx="0" cy="-56" r="13" fill="#4E9A58"/></g><rect x="-12" y="-42" width="24" height="13" rx="1.5" fill="#B07A55"/><path d="M-15 -42l15-9 15 9z" fill="#FF9C7A"/><rect x="-3" y="-39" width="6" height="10" fill="#7A3A22"/><g class="glow" style="animation-duration:3s"><rect x="5" y="-39" width="4" height="4" fill="#FFD27A"/></g><path d="M-14 -29h28" stroke="#7A5038" stroke-width="2"/><path d="M10 -29l3 29M14 -29l3 29M10.6 -22h4M11.4 -15h4M12.2 -8h4" stroke="#D9C38E" stroke-width="1.2"/>`;
  case "floss": return `<g class="wave" style="animation-duration:3.2s"><g fill="#B07A55" stroke="#7A5038" stroke-width=".8">${[-18,-10,-2,6,14].map(x=>`<rect x="${x}" y="-6" width="7" height="6" rx="3"/>`).join("")}</g><path d="M-16 -4h34" stroke="#7A5038" stroke-width="1.2"/><path d="M0 -6v-30" stroke="#8A5A3B" stroke-width="2"/><g class="sway" style="animation-duration:3s"><path d="M1 -34q14 10 0 24z" fill="#F3F1EA"/></g><g class="flagwave"><path d="M0 -36h7l-2 2 2 2h-7z" fill="#C8F169"/></g><path d="M-14 -6v-6M-14 -12l-4 6" stroke="#7A5038" stroke-width="1"/></g>`;
  case "festzelt": return `<path d="M-22 0v-14l22-14 22 14v14z" fill="#F3F1EA"/>${[-16,-6,4,14].map(x=>`<path d="M${x} 0v-14l${x<0?3:-3} -${x<0?2:2}" stroke="#FF9C7A" stroke-width="5" fill="none"/>`).join("")}<path d="M-22 -14l22-14 22 14" fill="none" stroke="#E5484D" stroke-width="2.4" stroke-linejoin="round"/><path d="M-6 0v-10q6-5 12 0v10z" fill="#3A3D58"/><path d="M0 -28v-8" stroke="#A4A6BD" stroke-width="1.4"/><g class="flagwave"><path d="M0 -36h8l-2 2 2 2h-8z" fill="#FFD27A"/></g>${[-18,-10,-2,6,14].map((x,i)=>`<g class="glow" style="animation-duration:1.4s;animation-delay:${i*.25}s"><circle cx="${x+2}" cy="${-15+Math.abs(x+2)/6}" r="1.8" fill="${["#FFD27A","#C8F169","#B6A4FF","#FF9C7A","#5BC0A8"][i]}"/></g>`).join("")}`;
  case "strandhaus": return `<path d="M-18 0v-8M18 0v-8M0 0v-8" stroke="#8A5A3B" stroke-width="2.4"/><rect x="-22" y="-10" width="44" height="3" fill="#B07A55"/><rect x="-16" y="-28" width="32" height="18" fill="#7CB8E8"/><path d="M-16 -24h32M-16 -20h32M-16 -16h32M-16 -12h32" stroke="#5F9ED4" stroke-width=".8"/><path d="M-20 -28l20-12 20 12z" fill="#F3F1EA"/><rect x="-4" y="-22" width="8" height="12" fill="#F3F1EA"/><g class="glow" style="animation-duration:3s"><rect x="-13" y="-24" width="6" height="6" fill="#FFD27A"/></g><rect x="7" y="-24" width="6" height="6" fill="#F3F1EA"/><path d="M-22 -10v-5h4" stroke="#F3F1EA" stroke-width="1"/><g class="sway" style="animation-duration:3.6s"><path d="M19 -10l3-4M19 -10l4 0" stroke="#FFB86B" stroke-width="1.6"/></g>`;
  case "beachclub": return `<path d="M-20 0v-10h22v10z" fill="#B07A55"/><rect x="-21" y="-12" width="24" height="3" rx="1" fill="#7A5038"/><path d="M-22 -26l12-6 12 6z" fill="#5BC0A8"/><path d="M-18 -26v14M-2 -26v14" stroke="#8A5A3B" stroke-width="1.6"/><path d="M-16 -36q8-6 16 0" stroke="#3A3D58" stroke-width=".6" fill="none"/>${[-15,-11,-7,-3].map((x,i)=>`<g class="glow" style="animation-duration:1.5s;animation-delay:${i*.3}s"><circle cx="${x}" cy="${-34+Math.abs(x+9)/3}" r="1.6" fill="${["#FF9C7A","#FFD27A","#C8F169","#B6A4FF"][i]}"/></g>`).join("")}<g transform="translate(-14 -12)"><rect x="-1.4" y="-6" width="2.8" height="6" rx="1" fill="#E5484D" opacity=".85"/><path d="M0 -6l2-3" stroke="#C8F169" stroke-width=".8"/></g><g transform="translate(-6 -12)"><rect x="-1.4" y="-5" width="2.8" height="5" rx="1" fill="#FFB86B" opacity=".85"/></g><path d="M14 0l2-24" stroke="#7A5038" stroke-width="1.4"/><g class="sway" style="animation-duration:4s"><path d="M4 -22q12-12 26 2z" fill="#FFD27A"/><path d="M10 -26q2 4 2 6M20 -27q2 3 3 6" stroke="#FF9C7A" stroke-width="2.6" fill="none"/></g><path d="M8 0l4-6h8l4 6" stroke="#F3F1EA" stroke-width="1.4" fill="none"/>`;
  }
  return "";
}
function viewProjekt(){
  return viewShop()+`<div class="card"><h2>Großprojekte</h2><p class="muted small">Ist ein Projekt fertig, startet sofort das nächste.</p>
  ${PROJECTS.map((p,i)=>{
    const done=S.built.includes(p.id), cur=i===S.projectIdx;
    const prog=cur?Math.min(100,S.material/(p.hours*60)*100):done?100:0;
    return `<div class="proj"><div class="badge" style="${done?"background:var(--lime);color:#14151F":cur?"background:var(--lilac);color:#14151F":""}">${i+1}</div>
    <div class="grow"><p><b>${p.name}</b> <span class="small muted">· ${p.hours} h</span></p><p class="small muted">${p.text}</p>
    ${cur?`<div class="bar" style="margin-top:6px"><i style="width:${prog}%;background:var(--lilac)"></i></div>`:""}</div>
    <span class="chip ${done?"good":cur?"ok":"gone"}">${done?"gebaut":cur?"läuft":"später"}</span></div>`}).join("")}
  </div>${viewGemeinsam()}`;
}
function viewGemeinsam(){
  if(!db||!MY_ID) return `<div class="card"><p class="label">Gemeinsam</p><p class="small muted">Inseln von Freund:innen, Geschenke und das gemeinsame Projekt brauchen einen Online-Speicher. In dieser Version bleibt deine Insel nur auf diesem Gerät.</p></div>`;
  const GOAL=100*60;
  const jt=JOINT?JOINT.total:0;
  const canSail=has("schiff")||S.testmode;
  return `<div class="card"><p class="label">Gemeinsames Großprojekt</p><p><b>Brücke der Freundschaft</b></p>
    <div class="bar"><i style="width:${Math.min(100,jt/GOAL*100)}%;background:var(--amber)"></i></div>
    <p class="small muted">${JOINT?`${hm(jt)} von 100 h, gesammelt von ${JOINT.n} ${JOINT.n===1?"Insel":"Inseln"}. Jede gesparte Minute zählt, ohne Rangliste.`:"Wird geladen …"}</p></div>
  <div class="card"><p class="label">Inseln deiner Freund:innen</p>
    ${!canSail?`<p class="small muted">Mit dem Schiff (Großprojekt 3) kannst du andere Inseln besuchen. Im Testmodus geht es schon jetzt.</p>`
    :FRIENDS===null?`<p class="small muted">Wird geladen …</p>`
    :FRIENDS.length?FRIENDS.map(f=>`<div class="row" style="padding:8px 0;border-top:1px solid var(--card2)"><div class="grow"><p><b>${esc(NAMES[f.id]||"Eine Insel")}</b></p><p class="small muted">${(f.sum.residents||[]).filter(r=>r.status==="da").length} Bewohner · Glück ${f.sum.glueck} %</p></div><button class="btn secondary" style="height:44px;font-size:14px" data-visit="${f.id}">Besuchen</button></div>`).join("")
    :`<p class="small muted">Noch keine anderen Inseln. Teile diese App über das Teilen-Menü mit Freund:innen, dann erscheinen ihre Inseln hier.</p>`}
  </div>`;
}
function chart(){
  const d=S.days.slice(-14); if(!d.length) return "";
  const W=320,H=140,max=Math.max(S.budget*1.5,...d.map(x=>x.min));
  const bw=W/14;
  let s=`<svg viewBox="0 0 ${W} ${H+20}" style="width:100%;height:auto" role="img" aria-label="Bildschirmzeit der letzten ${d.length} Tage">`;
  const by=H-S.budget/max*H;
  s+=`<line x1="0" x2="${W}" y1="${by}" y2="${by}" stroke="#7C7F99" stroke-dasharray="4 4"/><text x="${W}" y="${by-4}" text-anchor="end" font-size="10" fill="#A4A6BD" font-family="Manrope, sans-serif">Budget ${hm(S.budget)}</text>`;
  d.forEach((x,i)=>{const h=Math.max(2,x.min/max*H);s+=`<rect x="${i*bw+3}" y="${H-h}" width="${bw-6}" height="${h}" rx="4" fill="${x.min<=S.budget?"#C8F169":"#FF9C7A"}"><title>${nice(x.day)}: ${hm(x.min)}</title></rect><text x="${i*bw+bw/2}" y="${H+14}" text-anchor="middle" font-size="9" fill="#A4A6BD" font-family="Manrope, sans-serif">${parse(x.day).getDate()}.</text>`});
  return s+"</svg>";
}
function findSvg(id){
  switch(id){
  case "muschel": return `<path d="M0 -2l-12 -10a14 14 0 0 1 24 0z" fill="#FFB3C7"/><path d="M0 -2l-6 -14M0 -2v-15M0 -2l6 -14" stroke="#E08AA0" stroke-width="1.4"/>`;
  case "seestern": return `<path d="M0 -20l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#FF9C7A"/>`;
  case "flaschenpost": return `<rect x="-14" y="-12" width="22" height="10" rx="4" fill="#9CD3C4" opacity=".9"/><rect x="8" y="-10" width="6" height="6" rx="1" fill="#8A5A3B"/><rect x="-9" y="-10" width="12" height="6" rx="1" fill="#F3F1EA"/>`;
  case "treibholz": return `<path d="M-14 -4q14-6 28 0" stroke="#A88A70" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M4 -7l5 -5" stroke="#A88A70" stroke-width="3" stroke-linecap="round"/>`;
  case "bernstein": return `<path d="M-8 -4l3-10h10l3 10-8 4z" fill="#F0A35E"/><path d="M-2 -10l3 0" stroke="#FFD27A" stroke-width="2"/>`;
  case "perle": return `<path d="M-12 -4a12 8 0 0 1 24 0z" fill="#A4A6BD"/><circle cx="0" cy="-8" r="5" fill="#F3F1EA"/><circle cx="-1.5" cy="-9.5" r="1.4" fill="#FFFFFF"/>`;
  case "nelke": return `<path d="M0 0v-12" stroke="#5FA864" stroke-width="1.6"/><circle cx="0" cy="-15" r="5" fill="#E07AB8"/><circle cx="0" cy="-15" r="2" fill="#FFD27A"/>`;
  }
  return "";
}
function viewStrandgut(){
  const have=new Set(S.finds.map(f=>f.id));
  const bottles=S.finds.filter(f=>f.msg).slice(-3).reverse();
  return `<div class="card"><div class="row between"><p class="label">Strandgut-Sammlung</p><span class="small muted num">${have.size} / ${FINDS.length} · ${S.finds.length} Funde</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${FINDS.map(f=>{const ok=have.has(f.id);const n=S.finds.filter(x=>x.id===f.id).length;
    return `<div style="background:var(--ground);border-radius:14px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;${ok?"":"opacity:.4"}"><svg width="40" height="30" viewBox="-16 -22 32 24" aria-hidden="true">${ok?findSvg(f.id):`<g style="filter:brightness(0) invert(.45)">${findSvg(f.id)}</g>`}</svg><span style="font-size:11px;font-weight:700;text-align:center;line-height:1.2">${ok?esc(f.n)+(n>1?" ×"+n:""):"?"}</span></div>`}).join("")}</div>
  ${bottles.length?`<p class="small" style="font-weight:700">Flaschenpost</p>${bottles.map(b=>`<p class="small" style="font-family:'Caveat',cursive;font-size:19px;line-height:1.2">${esc(b.msg)}</p>`).join("")}`:""}
  <p class="small muted">Je früher das Handy abends weg ist, desto mehr wird angespült.</p></div>`;
}
function viewKapseln(){
  const cs=S.capsules.slice().reverse();
  return `<div class="card"><p class="label">Zeitkapseln</p>${cs.length?cs.map(c=>`<button data-kapsel="${c.id}" style="display:flex;flex-direction:column;gap:2px;text-align:left;border:none;border-radius:14px;background:var(--ground);color:var(--ink);padding:10px 12px;min-height:48px"><b>${esc(c.title)}</b><span class="small muted">${esc(c.lines[0])}</span></button>`).join("")
    :`<p class="small muted">Am Ende jedes Monats bekommst du hier eine Rückblick-Karte, die du teilen kannst.</p>`}</div>`;
}
function viewVerlauf(){
  const col={good:"var(--lime)",bad:"var(--coral)",info:"var(--lilac)"};
  return `${viewAlbum()}${viewStrandgut()}${viewKapseln()}
  <div class="card"><div class="row between"><p class="label">Letzte 14 Tage</p><span class="small muted">${S.days.length} Tage gespielt</span></div>${chart()||`<p class="muted">Noch keine Tage eingetragen.</p>`}</div>
  <div class="card feed"><p class="label">Inseltagebuch</p><ul>${S.feed.slice(0,40).map(f=>`<li><span class="dot" style="background:${col[f.kind]}"></span><div><p>${esc(f.text)}</p>${f.day?`<p class="small muted">${nice(f.day)}</p>`:""}</div></li>`).join("")||`<li><p class="muted">Hier erscheint, was auf deiner Insel passiert.</p></li>`}</ul></div>
`;
}
/* Einstellungen: erreichbar über das Profilbild oben rechts */
function settingsHtml(){
  const fam=famCode();
  return `
  <div class="card"><p class="label">Spiel</p>
    <label class="field" for="setBudget">Tagesbudget: <span id="setBudgetOut" class="num">${hm(S.budget)}</span><input id="setBudget" type="range" min="30" max="480" step="15" value="${S.budget}"></label>
    <label class="field" for="setBase">Bisheriger Schnitt: <span id="setBaseOut" class="num">${hm(S.baseline)}</span><input id="setBase" type="range" min="30" max="600" step="15" value="${S.baseline}"></label>
    <p style="font-weight:700;margin-top:6px">App-Limits für die Monster</p>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">${S.apps.map(a=>`<label class="field" for="lim_${a.id}" style="font-size:13px">${esc(a.name)} (min)<input id="lim_${a.id}" type="number" min="5" max="600" step="5" value="${a.limit}" data-lim="${a.id}"></label>`).join("")}</div>
    <label class="check" for="deathToggle"><input type="checkbox" id="deathToggle" ${S.natDeath?"checked":""}> Natürlicher Abschied im hohen Alter</label>
    <label class="check" for="vacToggle" style="margin-top:6px"><input type="checkbox" id="vacToggle" ${S.vacation?"checked":""}> Urlaubsmodus: Die Insel schläft, nichts geht verloren</label>
    <label class="check" for="soundToggle"><input type="checkbox" id="soundToggle" ${S.sound!==false?"checked":""}> Töne und Geräusche</label>
  </div>
  <div class="card"><p class="label">Sicherung</p>
    <p class="small muted">Dein Spielstand liegt nur in diesem Browser. Lade ab und zu eine Sicherung herunter, um ihn auf ein anderes Gerät mitzunehmen.</p>
    <div class="row"><button class="btn secondary grow" id="exportBtn">Sichern</button><button class="btn secondary grow" id="importBtn">Laden</button></div>
    <input type="file" id="importFile" accept="application/json,.json" hidden>
  </div>
  <div class="card"><p class="label">Familieninsel</p>
    ${!db?`<p class="small muted">Die Familieninsel braucht einen Online-Speicher und ist in dieser Version noch nicht verfügbar.</p>`
    :fam?`<p>Du spielst auf der Familieninsel <b>„${esc(fam)}“</b>. Alle mit demselben Code sehen und pflegen dieselbe Insel.</p><button class="btn ghost" id="famLeave">Zurück zur eigenen Insel</button>`
    :`<p class="small muted">Eltern und Kinder teilen sich eine Insel. Denkt euch einen Code aus und gebt ihn alle ein. Deine eigene Insel bleibt gespeichert.</p>
      <div class="row"><input id="famIn" type="text" maxlength="30" placeholder="z. B. inselbande-7" aria-label="Code der Familieninsel"><button class="btn" id="famJoin" style="height:52px">Beitreten</button></div>`}
  </div>`;
}

/* ---------- Inselansicht: Gesamtbild oder einzelne Insel, per Wischen ---------- */
let islandView=0, vbAnim=null;
function islandViews(){
  const v=[{n:"Alle Inseln",vb:[0,0,360,240]}];
  if(!has("bruecke")) return v;
  v.push({n:"Hauptinsel",vb:[0,62,246,164]});
  v.push({n:"Nachbarinsel",vb:[204,94,156,104]});
  if(has("insel3")) v.push({n:"Dritte Insel",vb:[234,156,126,84]});
  return v;
}
function setViewBox(vb){const svg=$("#scene > svg");if(svg)svg.setAttribute("viewBox",vb.map(n=>n.toFixed(1)).join(" "))}
function renderScene(){
  const views=islandViews(); if(islandView>=views.length) islandView=0;
  const nav=views.length>1?`<div class="scene-nav">
      <button class="snav" data-snav="-1" aria-label="Vorherige Insel">‹</button>
      <div class="snav-mid"><span class="snav-label">${views[islandView].n}</span><span class="snav-dots">${views.map((v,i)=>`<button class="${i===islandView?"on":""}" data-sview="${i}" aria-label="${v.n}"></button>`).join("")}</span></div>
      <button class="snav" data-snav="1" aria-label="Nächste Insel">›</button></div>`:"";
  $("#scene").innerHTML=scene()+nav;
  setViewBox(views[islandView].vb);
  document.querySelectorAll("[data-snav]").forEach(b=>b.onclick=()=>goView(islandView+ +b.dataset.snav));
  document.querySelectorAll("[data-sview]").forEach(b=>b.onclick=()=>goView(+b.dataset.sview));
}
function goView(i){
  const views=islandViews(); if(views.length<2) return;
  i=(i+views.length)%views.length; if(i===islandView) return;
  const from=views[islandView].vb, to=views[i].vb; islandView=i;
  const lab=$(".snav-label"); if(lab) lab.textContent=views[i].n;
  document.querySelectorAll("[data-sview]").forEach((b,k)=>b.classList.toggle("on",k===i));
  cancelAnimationFrame(vbAnim);
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce) return setViewBox(to);
  const t0=performance.now(), dur=450;
  (function step(t){const k=Math.min(1,(t-t0)/dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    setViewBox(from.map((f,j)=>f+(to[j]-f)*e)); if(k<1) vbAnim=requestAnimationFrame(step)})(t0);
}
(function(){ // Wischen auf dem Inselbild
  const el=$("#scene"); let x0=null,y0=0;
  el.addEventListener("touchstart",e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  el.addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3) goView(islandView+(dx<0?1:-1))},{passive:true});
})();

/* ---------- Rendern ---------- */
function render(){
  renderScene();
  $("#streakChip").textContent=S.happyStreak>0?S.happyStreak+" glückliche Tage":S.dayCount+(S.dayCount===1?" Tag":" Tage")+" gespielt";
  $("#streakChip").className="chip "+(S.happyStreak>0?"good":"gone");
  $("#accBtn").innerHTML=ACC?avatarSvg(ACC.avatar,40):"";
  $("#dateline").textContent="OffLand · "+new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===tab?"page":"false"));
  const v=!S.setup?viewSetup():tab==="heute"?viewHeute():tab==="bewohner"?viewBewohner():tab==="zeit"?viewZeit():tab==="projekt"?viewProjekt():viewVerlauf();
  $("#view").innerHTML=`<div style="display:flex;flex-direction:column;gap:12px">${v}</div>`;
  bind();
  renderFocus();
}
function bind(){
  const sb=$("#setBudget"), sa=$("#setBase");
  if(sb) sb.oninput=()=>{S.budget=+sb.value;$("#setBudgetOut").textContent=hm(S.budget)};
  if(sa) sa.oninput=()=>{S.baseline=+sa.value;$("#setBaseOut").textContent=hm(S.baseline)};
  if(sb) sb.onchange=save; if(sa) sa.onchange=save;
  const st=$("#startBtn"); if(st) st.onclick=()=>{S.setup=true;log("Deine Insel ist gegründet. "+nameList(here().map(r=>r.name))+" ziehen ein.","good");save();render()};
  const gg=$("#goalGo"); if(gg) gg.onclick=()=>{const c=$("#closeCard");if(c)c.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(()=>{const h=$("#inH");if(h)h.focus({preventScroll:true})},450)};
  ["#inH","#inM"].forEach(id=>{const el=$(id);if(el)el.oninput=liveUpdate}); liveUpdate();
  const cb=$("#closeBtn"); if(cb) cb.onclick=()=>{
    const h=+($("#inH").value||0), m=+($("#inM").value||0);
    const min=clamp(h*60+m,0,1440);
    const q=QUESTS.filter(x=>$("#q_"+x.id).checked).map(x=>x.id);
    const apps={}; S.apps.forEach(a=>{const el=$("#app_"+a.id);if(el&&el.value!=="")apps[a.id]=clamp(+el.value,0,1440)});
    closeDay(min,q,apps);
  };
  const tm=$("#tm"); if(tm) tm.onchange=()=>{S.testmode=tm.checked;save();render()};
  const simApps=bad=>{const o={};S.apps.forEach(a=>{o[a.id]=Math.round(a.limit*(bad?(0.6+Math.random()*1.2):(0.2+Math.random()*0.7)))});return o};
  const simDay=bad=>closeDay(Math.round(S.budget*(bad?(1.3+Math.random()*0.8):(0.4+Math.random()*0.5))/5)*5,bad?[]:QUESTS.filter(()=>Math.random()<.6).map(x=>x.id),simApps(bad));
  const g=$("#simGood"); if(g) g.onclick=()=>simDay(false);
  const b=$("#simBad"); if(b) b.onclick=()=>simDay(true);
  const s10=$("#sim10"); if(s10) s10.onclick=()=>{const keep=S.pending.length;for(let i=0;i<10;i++){if($("#modalRoot").innerHTML) break; simDay(Math.random()<.25)}};
  document.querySelectorAll("[data-boat]").forEach(x=>x.onclick=()=>startBoat(+x.dataset.boat));
  document.querySelectorAll("[data-act]").forEach(x=>x.onclick=()=>doActivity(x.dataset.act));
  const nb=$("#nightBtn"); if(nb) nb.onclick=goodNight;
  const vo=$("#vacOff"); if(vo) vo.onclick=()=>setVacation(false);
  const dt=$("#deathToggle"); if(dt) dt.onchange=()=>{S.natDeath=dt.checked;save()};
  document.querySelectorAll("[data-tea]").forEach(x=>x.onclick=()=>giveTea(x.dataset.tea));
  const vt=$("#vacToggle"); if(vt) vt.onchange=()=>setVacation(vt.checked);
  const so=$("#soundToggle"); if(so) so.onchange=()=>{S.sound=so.checked;save();if(so.checked)sfx("return")};
  document.querySelectorAll("[data-lim]").forEach(x=>x.onchange=()=>{const a=S.apps.find(y=>y.id===x.dataset.lim);if(a){a.limit=clamp(+x.value||a.limit,5,600);save()}});
  const fj=$("#famJoin"); if(fj) fj.onclick=()=>joinFamily($("#famIn").value);
  const fl=$("#famLeave"); if(fl) fl.onclick=leaveFamily;
  document.querySelectorAll("[data-visit]").forEach(x=>x.onclick=()=>visitSheet(x.dataset.visit));
  document.querySelectorAll("[data-kapsel]").forEach(x=>x.onclick=()=>{const c=S.capsules.find(y=>y.id===x.dataset.kapsel);if(c) capsuleSheet(c)});
  const rs=$("#resetBtn"); if(rs) rs.onclick=confirmReset;
  const ex=$("#exportBtn"); if(ex) ex.onclick=exportSave;
  const im=$("#importBtn"), imf=$("#importFile"); if(im&&imf){im.onclick=()=>imf.click();imf.onchange=()=>{if(imf.files[0]) importSave(imf.files[0])}}
  document.querySelectorAll("[data-buy]").forEach(btn=>btn.onclick=()=>{
    const it=allItems().find(x=>x.id===btn.dataset.buy), cost=price(it); if(S.points<cost) return;
    S.points-=cost;
    if(it.consumable){if(it.id==="tee")S.tea++;else if(it.id==="klee")S.glueck=clamp(S.glueck+5,0,100);else S.sun++} else if(!owns(it.id)) S.items.push(it.id);
    sfx("buy"); log("Gekauft: "+it.n+" für "+cost+" Punkte.","good"); toast(it.n+(it.consumable?" auf Vorrat":" steht jetzt auf deiner Insel"));
    if(S.wish&&S.wish.item===it.id){const r=S.residents.find(x=>x.id===S.wish.rid);if(r){r.wishDone=true;S.glueck=clamp(S.glueck+6,0,100);chron([r.id],r.name+"s Wunsch ist erfüllt: "+it.n+".");log(r.name+"s Wunsch ist erfüllt! +6 % Glück.","good");S.pending.push({type:"wish",rid:r.id,item:it.id})}S.wish=null}
    save(); render(); showPending();
  });
  document.querySelectorAll("[data-card]").forEach(btn=>btn.onclick=()=>{const c=S.postcards.find(x=>x.id===btn.dataset.card);if(c) sheet(`<p class="label" style="color:var(--lilac)">Aus deinem Album</p>${postcardHtml(c)}<button class="btn" data-ok>Schließen</button>`)});
  document.querySelectorAll("[data-rename]").forEach(btn=>btn.onclick=()=>nameSheet({type:"rename",id:btn.dataset.rename}));
}
document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render();window.scrollTo(0,0)});

/* ---------- Dialoge ---------- */
let toastT;
function toast(t){let el=$(".toast");if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=t;clearTimeout(toastT);toastT=setTimeout(()=>el.remove(),2600)}
function closeModal(){$("#modalRoot").innerHTML=""}
/* ---------- Geräusche: im Browser erzeugt (Web Audio), keine Audiodateien ---------- */
let AC=null, NOISE=null;
function audio(){
  if(S&&S.sound===false) return null;
  try{
    if(!AC){const C=window.AudioContext||window.webkitAudioContext; if(!C) return null; AC=new C();
      NOISE=AC.createBuffer(1,AC.sampleRate*0.6,AC.sampleRate); const d=NOISE.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;}
    if(AC.state==="suspended") AC.resume();
    return AC;
  }catch(e){return null}
}
// iOS/Safari geben Töne erst nach einer Berührung frei
["pointerdown","touchend","keydown"].forEach(t=>document.addEventListener(t,()=>{if(AC&&AC.state==="suspended")AC.resume();else if(!AC&&S&&S.sound!==false)audio()},{passive:true}));
function tone(ac,f,t,dur,o){
  o=o||{}; const osc=ac.createOscillator(), g=ac.createGain(), now=ac.currentTime+t, v=(o.vol||.18);
  osc.type=o.type||"sine"; osc.frequency.setValueAtTime(f,now);
  if(o.to) osc.frequency.exponentialRampToValueAtTime(o.to,now+dur);
  if(o.vib){const l=ac.createOscillator(), lg=ac.createGain(); l.frequency.value=o.vib; lg.gain.value=f*.04; l.connect(lg).connect(osc.frequency); l.start(now); l.stop(now+dur)}
  g.gain.setValueAtTime(0.0001,now); g.gain.exponentialRampToValueAtTime(v,now+(o.att||.015)); g.gain.exponentialRampToValueAtTime(0.0001,now+dur);
  osc.connect(g).connect(ac.destination); osc.start(now); osc.stop(now+dur+.05);
}
function noise(ac,t,dur,o){
  o=o||{}; const src=ac.createBufferSource(), f=ac.createBiquadFilter(), g=ac.createGain(), now=ac.currentTime+t;
  src.buffer=NOISE; f.type=o.type||"bandpass"; f.frequency.value=o.freq||1200; f.Q.value=o.q||1;
  g.gain.setValueAtTime(0.0001,now); g.gain.exponentialRampToValueAtTime(o.vol||.15,now+.02); g.gain.exponentialRampToValueAtTime(0.0001,now+dur);
  src.connect(f).connect(g).connect(ac.destination); src.start(now); src.stop(now+dur+.05);
}
const N={C4:262,D4:294,E4:330,F4:349,G4:392,A4:440,B4:494,C5:523,D5:587,E5:659,F5:698,G5:784,A5:880,C6:1047,E6:1319,G6:1568,C7:2093};
const notes=(ac,list,step,o)=>list.forEach((n,i)=>tone(ac,N[n]||n,i*step,(o&&o.len)||.35,o));
function animalSound(ac,art){
  switch(art){
    case "Huhn": [0,.12,.24].forEach(t=>tone(ac,1800,t,.08,{to:2400,type:"triangle",vol:.12})); break;
    case "Katze": tone(ac,650,0,.55,{to:480,type:"sawtooth",vol:.06,att:.08}); tone(ac,650,0,.55,{to:480,vol:.12,att:.08}); break;
    case "Hund": [0,.22].forEach(t=>{tone(ac,260,t,.14,{to:170,type:"square",vol:.08});noise(ac,t,.1,{freq:500,vol:.08})}); break;
    case "Ziege": case "Schaf": tone(ac,420,0,.7,{vib:18,type:"sawtooth",vol:.06,att:.04}); tone(ac,420,0,.7,{vib:18,vol:.1}); break;
    case "Esel": tone(ac,700,0,.35,{to:820,type:"sawtooth",vol:.06}); tone(ac,330,.38,.45,{to:260,type:"sawtooth",vol:.07}); break;
    case "Meerschweinchen": [0,.1,.2,.3].forEach(t=>tone(ac,1500,t,.07,{to:1900,vol:.1})); break;
    case "Hase": noise(ac,0,.08,{freq:3000,vol:.06}); noise(ac,.14,.08,{freq:3000,vol:.06}); tone(ac,900,.3,.12,{to:1200,vol:.08}); break;
    case "Robbe": [0,.25,.5].forEach(t=>tone(ac,380,t,.18,{to:300,type:"sawtooth",vol:.06})); break;
    case "Delfin": [0,.07,.14].forEach(t=>noise(ac,t,.03,{freq:5000,q:6,vol:.12})); tone(ac,1400,.25,.5,{to:2600,vol:.1}); break;
    case "Wal": tone(ac,110,0,1.6,{to:180,vol:.18,att:.3}); tone(ac,220,0,1.6,{to:300,vol:.05,att:.3}); break;
    default: notes(ac,["E5","G5"],.12,{type:"triangle"});
  }
}
function sfx(kind,arg){
  const ac=audio(); if(!ac) return;
  switch(kind){
    case "buy": tone(ac,988,0,.09,{type:"square",vol:.07}); tone(ac,1319,.08,.3,{type:"square",vol:.07}); break;
    case "human": notes(ac,["C5","E5","G5","C6"],.1,{type:"triangle",len:.3}); break;
    case "animal": animalSound(ac,arg); break;
    case "birth": notes(ac,["C6","E6","G6","C7"],.14,{len:.6,vol:.1}); break;
    case "postcard": tone(ac,N.A5,0,.6,{vol:.15}); tone(ac,N.E5,.22,.8,{vol:.15}); noise(ac,0,.15,{type:"highpass",freq:4000,vol:.04}); break;
    case "project": notes(ac,["C5","E5","G5"],.12,{type:"square",vol:.06,len:.2}); [N.C5,N.E5,N.G5,N.C6].forEach(f=>tone(ac,f,.38,1.1,{type:"triangle",vol:.08})); break;
    case "sick": tone(ac,300,0,.35,{to:620,vol:.12,att:.2}); noise(ac,.38,.25,{freq:2500,q:.7,vol:.22}); break;
    case "warn": notes(ac,["E4","C4","E4","C4"],.22,{type:"triangle",len:.2,vol:.13}); break;
    case "left": notes(ac,["G4","E4","D4","C4"],.3,{len:.5,vol:.13}); break;
    case "return": notes(ac,["C4","E4","G4","C5","E5"],.11,{type:"triangle",len:.35}); break;
    case "conflict": tone(ac,220,0,.4,{type:"sawtooth",vol:.06}); tone(ac,233,0,.4,{type:"sawtooth",vol:.06}); tone(ac,196,.42,.35,{type:"sawtooth",vol:.06}); break;
    case "resolve": notes(ac,["F4","A4","C5"],.08,{len:.6,vol:.1}); break;
    case "thud": tone(ac,140,0,.4,{to:70,vol:.2}); break;
    case "love": notes(ac,["E6","C6"],.16,{len:.25,vol:.1}); notes(ac,["E6","G6"],.16,{len:.35,vol:.08}); break;
    case "sparkle": ["C6","E6","G6","C7","G6"].forEach((n,i)=>tone(ac,N[n],i*.06,.25,{vol:.07})); break;
    case "aurora": [N.C5,N.G5,N.E6].forEach((f,i)=>tone(ac,f,i*.2,2,{vol:.05,att:.6,vib:3})); break;
    case "birds": [0,.15,.35,.45,.7].forEach(t=>tone(ac,2400+Math.random()*800,t,.1,{to:3200,vol:.06})); break;
    case "horn": tone(ac,147,0,.9,{type:"sawtooth",vol:.07,att:.08}); tone(ac,220,0,.9,{type:"triangle",vol:.06,att:.08}); break;
    case "fest": notes(ac,["G4","C5","E5","G5","E5","G5","C6"],.09,{type:"square",vol:.05,len:.18}); noise(ac,.65,.4,{type:"highpass",freq:5000,vol:.05}); break;
    case "goodday": notes(ac,["G5","C6"],.14,{len:.5,vol:.1}); break;
    case "badday": [0,.2,.45].forEach(t=>noise(ac,t,.3,{type:"lowpass",freq:900,vol:.06})); notes(ac,["E4","C4"],.25,{len:.5,vol:.08}); break;
    case "farewell": notes(ac,["C5","G4","E4","C4"],.45,{len:1,vol:.09}); break;
    case "boat": tone(ac,165,0,.8,{type:"sawtooth",vol:.06,att:.06}); noise(ac,.6,.6,{type:"lowpass",freq:700,vol:.12}); break;
  }
}
function soundFor(ev){
  try{
    const r=ev.id?S.residents.find(x=>x.id===ev.id):null;
    const map={arrival:r&&r.kind==="tier"?["animal",r.art]:["human"],birth:["birth"],postcard:["postcard"],project:["project"],sick:["sick"],warn:["warn"],left:["left"],
      return:["return"],reunion:["return"],conflict:["conflict"],conflictResult:[ev.ok?"resolve":"thud"],love:["love"],strandgut:["sparkle"],wish:["sparkle"],gift:["sparkle"],
      kapsel:["sparkle"],fest:["fest"],farewell:["farewell"],boat:["boat"],welcome:["return"],
      visitor:[ev.kind==="aurora"?"aurora":ev.kind==="birds"?"birds":"horn"],day:[ev.min<=S.budget?"goodday":"badday"]};
    const m=map[ev.type]; if(m) sfx(m[0],m[1]);
  }catch(e){}
}
function showPending(){
  if($("#modalRoot").innerHTML) return;
  const ev=S.pending.shift(); if(!ev){return}
  soundFor(ev);
  save();
  if(ev.type==="arrival"||ev.type==="birth"||ev.type==="rename") return nameSheet(ev);
  const scene=`<div class="anim">${animScene(ev)}</div>`;
  if(ev.type==="day"){
    const good=ev.min<=S.budget, diff=Math.abs(S.budget-ev.min);
    const eq=equivTop(good?ev.saved:diff);
    return sheet(`${scene}<p class="label" style="color:${good?"var(--lime)":"var(--coral)"}">Tagesbilanz · ${nice(ev.day)}</p>
      <div class="row between"><h2>${good?"Gut gemacht!":"Heute war viel Handy"}</h2><span class="countup num" id="cu" style="font-size:28px;color:${ev.after>=ev.before?"var(--lime)":"var(--coral)"}">${ev.before} %</span></div>
      <p class="muted">${hm(ev.min)} Bildschirmzeit, ${good?hm(diff)+" unter":hm(diff)+" über"} deinem Budget.</p>
      <p><b style="color:var(--lilac)">+${ev.pts||0} Punkte</b> <span class="small muted">für den Laden</span>${ev.sunny?` · <span class="small" style="color:var(--amber)">Sonnenschein hat geholfen</span>`:""}</p>
      ${ev.repaired?`<p style="color:var(--lime)">Reparatur geschafft: +${ev.repaired} % vom schlechten Tag zurückgeholt.</p>`:""}
      ${ev.dreamt?`<p style="color:var(--lilac)">+15 Traumpunkte vom Gute-Nacht-Ritual.</p>`:""}
      ${ev.monsters&&ev.monsters.length?`<p style="color:#C8A8FF">${ev.monsters.map(id=>{const a=S.apps.find(x=>x.id===id);return a?monName(a,false):""}).join(", ")} vor der Insel aufgetaucht.</p>`:""}
      ${good&&ev.saved?`<p>Gegenüber früher hast du heute <b>${hm(ev.saved)}</b> gewonnen. Das reicht für ${esc(eqText(eq))}.</p>`:""}
      ${!good&&eq.length?`<p>Die Zeit über dem Budget hätte gereicht für ${esc(eqText(eq))}. Morgen ist ein neuer Tag.</p>`:""}
      <button class="btn" data-ok>Weiter</button>`,()=>countUp($("#cu"),ev.before,ev.after));
  }
  if(ev.type==="conflict"){
    const c=S.conflict; if(!c||c.state!=="neu") return showPending();
    const a=S.residents.find(r=>r.id===c.a), b=S.residents.find(r=>r.id===c.b);
    const canPay=S.points>=60;
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      <div class="anim">${base(`<g class="shake fb">${figure(a,214,134)}</g><g class="shake fb" style="animation-delay:.3s">${figure(b,250,134)}</g><g class="pop fb" style="animation-delay:.4s"><path d="M228 92l4 -10 4 8 6 -9 -2 12" stroke="#FFB86B" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`,S.glueck<40)}</div>
      <p class="label" style="color:var(--amber)">Streit auf der Insel</p>
      <h2>${esc(a.name)} gegen ${esc(b.name)}</h2>
      <p>${esc(c.text)}</p>
      <p class="small muted">${esc(a.name)}: ${esc(jobName(a.job))}, ${esc(traitName(a.trait))} · ${esc(b.name)}: ${esc(jobName(b.job))}, ${esc(traitName(b.trait))}</p>
      <button class="btn" data-c="abend">Handyfreier Klärungsabend</button>
      <p class="small muted" style="margin-top:-6px">Klappt, wenn du morgen im Budget bleibst. Sonst wird es schlimmer.</p>
      <button class="btn secondary" data-c="kuchen" ${canPay?"":"disabled"}>Kuchen spendieren · 60 Punkte</button>
      <button class="btn ghost" data-c="egal">Sollen sie das selbst klären</button>
    </div></div>`;
    document.querySelectorAll("[data-c]").forEach(btn=>btn.onclick=()=>{resolveConflict(btn.dataset.c);closeModal();render();showPending()});
    $("[data-c=abend]").focus();
    return;
  }
  if(ev.type==="conflictResult"){
    const a=S.residents.find(r=>r.id===ev.a), b=S.residents.find(r=>r.id===ev.b);
    return sheet(`<div class="anim">${base(ev.ok?`<g class="bob">${figure(a,224,134)}</g><g class="bob" style="animation-delay:.4s">${figure(b,240,134)}</g>`+hearts(232,100):`${figure(a,200,134)}${figure(b,262,134)}`,!ev.ok)}</div>
      <p class="label" style="color:${ev.ok?"var(--lime)":"var(--coral)"}">Klärungsabend</p><h2>${ev.ok?esc(a.name)+" und "+esc(b.name)+" vertragen sich wieder":"Der Abend ist ausgefallen"}</h2>
      <p class="muted">${ev.ok?"Ohne Handys am Lagerplatz haben sie endlich miteinander geredet.":"Zu viel Bildschirmzeit, keine Zeit zum Reden. Die beiden gehen sich jetzt aus dem Weg."}</p><button class="btn" data-ok>Weiter</button>`);
  }
  if(ev.type==="love"){
    const a=S.residents.find(r=>r.id===ev.a), b=S.residents.find(r=>r.id===ev.b);
    return sheet(`<div class="anim">${base(`<g class="bob">${figure(a,226,134)}</g><g class="bob" style="animation-delay:.3s">${figure(b,242,134)}</g>`+hearts(234,104),false)}</div>
      <p class="label" style="color:var(--coral)">Verliebt</p><h2>${esc(a.name)} und ${esc(b.name)} sind ein Paar</h2>
      <p class="muted">${esc(jobName(a.job))} trifft ${esc(jobName(b.job))}. Vielleicht gibt es bald Nachwuchs.</p><button class="btn" data-ok>Wie schön</button>`);
  }
  if(ev.type==="strandgut"){
    const f=FINDS.find(x=>x.id===ev.find);
    const fresh=S.finds.filter(x=>x.id===f.id).length===1;
    return sheet(`<div class="anim">${base(`<g class="sail-in" style="animation-duration:2s"><g class="wave fb"><g transform="translate(130 150) scale(1.6)">${findSvg(f.id)}</g></g></g><g class="pop fb" style="animation-delay:2s">${hearts(130,110)}</g>`,false)}</div>
      <p class="label" style="color:var(--amber)">Strandgut${fresh?" · neu in der Sammlung!":""}</p><h2>${esc(f.n)} angespült</h2>
      ${ev.msg?`<p style="font-family:'Caveat',cursive;font-size:22px;line-height:1.2">${esc(ev.msg)}</p>`:""}
      <p class="muted">${f.pts?"+"+f.pts+" Punkte. ":""}${f.mat?"+"+f.mat+" Minuten Baumaterial. ":""}${f.glueck?"+"+f.glueck+" % Glück. ":""}Je früher das Handy abends weg ist, desto mehr bringt das Meer.</p>
      <button class="btn" data-ok>Einsammeln</button>`);
  }
  if(ev.type==="visitor"){
    if(ev.kind==="aurora") return sheet(`<div class="anim">${base(`<g class="glow" style="animation-duration:4s"><path d="M0 50q60-40 120-10t120-20 120 10v-30q-60-20-120 0t-120 10-120-10z" fill="#5BF0A4" opacity=".7"/><path d="M0 70q80-30 160 0t200-20v-14q-80 10-180-12t-180 20z" fill="#B6A4FF" opacity=".6"/></g>`,false)}</div>
      <p class="label" style="color:#5BF0A4">Seltener Besuch</p><h2>Polarlicht über der Insel</h2><p class="muted">7 Tage am Stück im Budget. Das gibt es nur selten zu sehen. Die nächsten Nächte leuchtet der Himmel grün.</p><button class="btn" data-ok>Staunen</button>`);
    if(ev.kind==="birds") return sheet(`<div class="anim">${base(`<g class="sail-in" style="animation-duration:3s">${[0,1,2,3,4,5].map(i=>`<path d="M${120+i*18} ${50+Math.abs(i-2.5)*10}q6-6 12 0q6-6 12 0" stroke="#F3F1EA" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join("")}</g>`,false)}</div>
      <p class="label" style="color:var(--lime)">Seltener Besuch</p><h2>Zugvögel rasten auf deiner Insel</h2><p class="muted">Sie bleiben zwei Tage und bringen gute Laune mit: +3 % Glück.</p><button class="btn" data-ok>Hallo, Vögel!</button>`);
    return sheet(`<div class="anim">${base(`<g class="sail-in"><g class="wave fb"><path d="M60 140h86l-12 16H72z" fill="#8A5A3B"/><path d="M104 140V92l30 44z" fill="#FFD27A"/><path d="M104 100h20M104 112h24M104 124h28" stroke="#FF9C7A" stroke-width="4"/><path d="M100 140V100l-24 36z" fill="#F3F1EA"/></g></g>`,false)}</div>
      <p class="label" style="color:var(--amber)">Seltener Besuch</p><h2>Ein Händlerschiff legt an</h2><p class="muted">Es hat Dinge dabei, die es sonst nirgends gibt: ${S.trader?S.trader.items.map(itemName).join(" und "):""}. Es bleibt nur 2 Tage.</p><button class="btn" data-ok>Später im Laden ansehen</button>`);
  }
  if(ev.type==="wish"){
    const r=S.residents.find(x=>x.id===ev.rid);
    return sheet(`<div class="anim">${base(`<g class="bob">${figure(r,232,134)}</g>`+hearts(232,100)+confetti(),false)}</div><p class="label" style="color:var(--lime)">Wunsch erfüllt</p><h2>${esc(r.name)} strahlt!</h2><p class="muted">${esc(itemName(ev.item))} steht jetzt auf der Insel. ${esc(r.name)} bedankt sich mit +3 Punkten jeden Tag.</p><button class="btn" data-ok>Gern geschehen</button>`);
  }
  if(ev.type==="reunion"){
    const pt=S.residents.find(x=>x.id===ev.pet), o=S.residents.find(x=>x.id===ev.owner);
    if(!pt||!o) return showPending();
    return sheet(`<div class="anim">${base(`<g class="sail-in" style="animation-duration:1.4s">${figure(pt,200,134)}</g>${figure(o,232,134)}`+hearts(216,100),false)}</div><p class="label" style="color:var(--lime)">Wiedersehen</p><h2>${esc(pt.name)} hat ${esc(o.name)} wieder</h2><p class="muted">${esc(SOUND[pt.art]||"")} Jeden Abend hat ${esc(pt.name)} am Steg gewartet. Jetzt ist das Warten vorbei.</p><button class="btn" data-ok>Wie schön</button>`);
  }
  if(ev.type==="fest"){
    return sheet(`<div class="anim">${base(`<g transform="translate(240 134) scale(1.2)">${itemSvg("feuer")}</g>`+here().filter(r=>r.kind==="mensch").slice(0,5).map((r,i)=>`<g class="bob" style="animation-delay:${i*.2}s">${figure(r,200+i*16+(i>1?24:0),136)}</g>`).join("")+`${[0,1,2,3,4,5].map(i=>`<g class="glow" style="animation-delay:${i*.3}s"><circle cx="${190+i*22}" cy="${80+(i%2)*8}" r="4" fill="#FFD27A"/></g>`).join("")}`+confetti(),false)}</div>
      <p class="label" style="color:var(--amber)">Inselfest</p><h2>Die Insel feiert dich</h2><p class="muted">${ev.good} von 7 Tagen im Budget. Laternen, Lagerfeuer und Musik: +5 % Glück und +30 Punkte.</p><button class="btn" data-ok>Mitfeiern</button>`);
  }
  if(ev.type==="kapsel"){const c=S.capsules.find(x=>x.id===ev.id);if(c) return capsuleSheet(c,true);return showPending()}
  if(ev.type==="boat"){
    const crew=ev.crew?S.residents.find(x=>x.id===ev.crew):null;
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      <div class="anim">${base(boat(crew?[crew]:[],"sail-in"),false)}</div>
      <p class="label" style="color:var(--lilac)">Das Boot ist zurück</p><h2>${ev.dur} Minuten Fokus</h2>
      <p class="muted">${ev.left?"Du hast die App zwischendurch verlassen. ":""}Ehrlich gefragt: Hast du in der Zeit andere Apps benutzt?</p>
      <button class="btn" id="boatYes">Nein, Handy lag weg</button>
      <button class="btn ghost" id="boatNo">Doch, kurz</button></div></div>`;
    $("#boatYes").onclick=()=>{boatHonest(true,ev.dur,ev.crew);closeModal();render();showPending()};
    $("#boatNo").onclick=()=>{boatHonest(false,ev.dur,ev.crew);closeModal();render();showPending()};
    return;
  }
  if(ev.type==="welcome"){
    const g=ev.guard?S.residents.find(x=>x.id===ev.guard):null;
    return sheet(`<div class="anim">${base(here().slice(0,4).map((r,i)=>`<g class="bob">${figure(r,214+i*14,134)}</g>`).join("")+confetti(),false)}</div><p class="label" style="color:var(--lime)">Willkommen zurück</p><h2>Alles noch da</h2><p class="muted">${ev.days} Tage Urlaub. ${g?esc(g.name)+" hat gut auf die Insel aufgepasst.":"Die Insel hat auf dich gewartet."}</p><button class="btn" data-ok>Weiter geht's</button>`);
  }
  if(ev.type==="gift"){
    return sheet(`<div class="anim">${base(`<g class="pop fb"><rect x="214" y="104" width="30" height="24" rx="3" fill="#FF9C7A"/><path d="M229 104v24M214 114h30" stroke="#FFD27A" stroke-width="4"/></g>`+hearts(229,90),false)}</div><p class="label" style="color:var(--coral)">Geschenk</p><h2>Post von ${esc(ev.from)}</h2><p class="muted">${esc(ev.what)} ist mit dem Schiff angekommen. +${ev.pts} Punkte.</p><button class="btn" data-ok>Danke!</button>`);
  }
  if(ev.type==="sick"){
    const r=S.residents.find(x=>x.id===ev.rid); if(!r||!r.sick) return showPending();
    return sheet(`<div class="anim">${base(`<g transform="translate(232 134) scale(1.6)">${figure(r,0,0)}</g>`,true)}</div><p class="label" style="color:var(--coral)">Krank</p><h2>${esc(r.name)} hat ${esc(r.sick.kind)}</h2>
      <p class="muted">Bei so wenig Inselglück erwischt es leichter jemanden. ${esc(r.name)} liegt im Bett${r.job?" und kann als "+esc(jobName(r.job))+" gerade nicht arbeiten":""}. Gute Tage, die Inselärzt:in oder Kräutertee aus dem Laden helfen.</p>
      ${S.tea?`<button class="btn" id="sickTea">Kräutertee geben (Vorrat ${S.tea})</button>`:""}<button class="btn ${S.tea?"secondary":""}" data-ok>Gute Besserung</button>`,()=>{const t=$("#sickTea");if(t)t.onclick=()=>{giveTea(r.id);closeModal();render();showPending()}});
  }
  if(ev.type==="farewell"){
    const r=S.residents.find(x=>x.id===ev.rid); if(!r) return showPending();
    const fam=here().filter(x=>x.kind==="mensch").slice(0,4);
    return sheet(`<div class="anim">${base(`<g transform="translate(250 134) scale(1.1)">${itemSvg("feuer")}</g>`+fam.map((x,i)=>figure(x,206+i*14+(i>1?40:0),136)).join("")+[0,1,2].map(i=>`<g class="heart" style="animation-duration:5s;animation-delay:${i*1.4}s"><rect x="${244+i*8}" y="${100-i*6}" width="6" height="8" rx="2" fill="#FFD27A"/></g>`).join(""),false)}</div>
      <p class="label" style="color:var(--lilac)">Abschied</p><h2>${esc(r.name)} hat sich verabschiedet</h2>
      <p class="muted">Nach einem langen Leben auf der Insel ist ${esc(r.name)} friedlich eingeschlafen. Am Lagerfeuer erzählen alle Geschichten${r.job?" aus der Zeit als "+esc(jobName(r.job)):""}. Das hat nichts mit deiner Bildschirmzeit zu tun, so ist einfach der Lauf der Dinge.</p>
      <button class="btn" data-ok>Erinnerungsbaum pflanzen</button>`);
  }
  if(ev.type==="warn"){
    const g=idsTo(ev.ids);
    return sheet(`${scene}<p class="label" style="color:var(--amber)">Wegzug droht</p><h2>${esc(groupName(g))} ${vb(g,"packt","packen")} die Koffer</h2><p class="muted">Das Inselglück liegt seit 3 Tagen unter 40 %. Bring es in den nächsten 2 Tagen wieder darüber, dann ${vb(g,"bleibt "+esc(g[0].name),"bleiben alle")}.</p><button class="btn" data-ok>Ich kümmere mich drum</button>`);
  }
  if(ev.type==="left"){
    const g=idsTo(ev.ids);
    S.pending.unshift({type:"postcard",ids:ev.ids});
    return sheet(`${scene}<p class="label" style="color:var(--coral)">Abschied</p><h2>${esc(groupName(g))} ${vb(g,"zieht","ziehen")} weg</h2><p class="muted">Das Boot legt ab Richtung Möweninsel. Ganz weg ${vb(g,"ist "+esc(g[0].name),"sind sie")} aber nicht.</p><button class="btn" data-ok>Hinterherwinken</button>`);
  }
  if(ev.type==="postcard"){
    const card=makeCard(idsTo(ev.ids),ev.hint); save();
    const fresh=S.postcards.filter(c=>c.motif===card.motif).length===1;
    return sheet(`<p class="label" style="color:var(--lilac)">Post ist da${fresh?" · neues Motiv!":""}</p>${postcardHtml(card)}<p class="small muted">Album: ${new Set(S.postcards.map(c=>c.motif)).size} von ${MOTIFS.length} Motiven gesammelt</p><button class="btn" data-ok>Ins Album legen</button>`);
  }
  if(ev.type==="return"){
    const g=idsTo(ev.ids);
    return sheet(`${scene}<p class="label" style="color:var(--lime)">Wieder da</p><h2>${esc(nameList(g.map(r=>r.name)))} ${g.length>1?"sind":"ist"} zurück!</h2><p class="muted">5 gute Tage haben sich bis zur Möweninsel herumgesprochen.</p><button class="btn" data-ok>Willkommen zurück</button>`);
  }
  if(ev.type==="project"){
    const p=PROJECTS.find(x=>x.id===ev.id);
    return sheet(`${scene}<p class="label" style="color:var(--lime)">Großprojekt fertig</p><h2>${esc(p.name)} gebaut!</h2><p class="muted">${esc(p.text)}.</p><button class="btn" data-ok>Zur Insel</button>`);
  }
  showPending();
}
function sheet(html,after){
  $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  const ok=$("#modalRoot [data-ok]"); if(ok){ok.focus();ok.onclick=()=>{closeModal();render();showPending()}}
  if(after) after();
}
function nameSheet(ev){
  const r=S.residents.find(x=>x.id===ev.id); if(!r) return showPending();
  let head="", text="";
  if(ev.type==="arrival"){
    const partner=ev.partner?S.residents.find(x=>x.id===ev.partner):null;
    head=r.kind==="mensch"?"Jemand Neues zieht ein":isSea(r)?"Ein "+r.art+" ist dem Leuchtturm gefolgt":"Neu auf der Insel: "+(["Katze","Ziege","Robbe"].includes(r.art)?"eine ":"ein ")+r.art;
    text=(r.owner?"Gehört ab jetzt zu "+((S.residents.find(x=>x.id===r.owner)||{}).name||"")+". ":"")+(r.kind==="mensch"?"Arbeitet als "+jobName(r.job)+", "+traitName(r.trait)+". ":"")+"Deine Insel war mehrere Tage glücklich. Das hat sich herumgesprochen."+(partner?" Und: "+partner.name+" ist nicht mehr allein.":"");
  } else if(ev.type==="birth"){
    const ps=ev.parents.map(id=>S.residents.find(x=>x.id===id)).filter(Boolean);
    head="Nachwuchs bei "+ps.map(p=>p.name).join(" & ")+"!";
    text=r.kind==="mensch"?"Die Familie wächst, weil sich alle auf der Insel wohlfühlen.":"Ein kleines "+r.art+" ist da.";
  } else { head=r.name+" bearbeiten"; text="Ändere Namen und Aussehen."; }
  const list=r.kind==="mensch"?HUMAN_NAMES:ANIMAL_NAMES;
  const draft=r.kind==="mensch"?lookIdx(r):{fur:animalVar(r)};
  sheet(`${ev.type==="rename"?"":`<div class="anim">${animScene(ev)}</div>`}<p class="label" style="color:var(--lime)">${ev.type==="rename"?"Name und Aussehen":ev.type==="birth"?"Nachwuchs":"Neue Bewohner"}</p>
    <h2>${esc(head)}</h2><p class="muted">${esc(text)}</p>
    <label class="field" for="nameIn">Wie soll ${r.kind==="mensch"?"die Person":"das Tier"} heißen?</label>
    <div class="row"><input id="nameIn" type="text" maxlength="20" value="${esc(r.name)}"><button class="iconbtn" id="dice" aria-label="Zufälligen Namen würfeln"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A4FF" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="#B6A4FF"/><circle cx="15" cy="15" r="1.3" fill="#B6A4FF"/><circle cx="15" cy="9" r="1.3" fill="#B6A4FF"/><circle cx="9" cy="15" r="1.3" fill="#B6A4FF"/></svg></button></div>
    ${lookEditor(r,draft)}
    <button class="btn" id="nameOk">${ev.type==="rename"?"Speichern":"Willkommen heißen"}</button>`);
  const inp=$("#nameIn");
  $("#dice").onclick=()=>{inp.value=freeName(list,S.residents.map(x=>x.name))};
  bindLookEditor(r,draft);
  $("#nameOk").onclick=()=>{
    const n=inp.value.trim()||r.name; const old=r.name; r.name=n.slice(0,20);
    if(r.kind==="mensch") r.look=Object.assign({},draft); else if((FUR[r.art]||[]).length>1) r.fur=draft.fur;
    if(ev.type==="arrival"){log(r.name+(r.kind==="tier"?" ("+r.art+")":"")+" ist auf die Insel gezogen.","good");
      const ow=r.owner?S.residents.find(x=>x.id===r.owner):null;
      chron([r.id],r.name+(r.kind==="tier"?" ("+r.art+(ow?", gehört zu "+ow.name:"")+")":" ("+jobName(r.job)+")")+" ist eingezogen.")}
    if(ev.type==="birth"){log(r.name+" ist geboren. Willkommen!","good");chron([r.id].concat(r.parents||[]),r.name+" ist geboren.")}
    if(ev.type==="rename") toast(old!==r.name?old+" heißt jetzt "+r.name:"Gespeichert");
    save(); closeModal(); render(); showPending();
  };
  inp.focus(); inp.select();
}
/* Aussehen wählen: kleine Auswahl mit Live-Vorschau */
function lookPreview(r,draft){
  const tmp=Object.assign({},r,{sick:null});
  if(r.kind==="mensch") tmp.look=draft; else tmp.fur=draft.fur;
  return `<svg width="72" height="78" viewBox="${r.kind==="mensch"?"-12 -25 24 26":"-16 -22 32 25"}" aria-hidden="true">${figure(tmp,0,0)}</svg>`;
}
function lookEditor(r,d){
  const row=(label,key,list,sel)=>`<div class="sw-row" role="radiogroup" aria-label="${label}"><span class="small muted">${label}</span>${list.map((c,i)=>`<button type="button" class="sw${i===sel?" on":""}" data-look="${key}" data-v="${i}" style="background:${c}" aria-label="${label} ${i+1}" aria-pressed="${i===sel}"></button>`).join("")}</div>`;
  if(r.kind==="mensch"){
    const styles=`<div class="sw-row" role="radiogroup" aria-label="Frisur"><span class="small muted">Frisur</span>${STYLE_NAMES.map((n,i)=>{const hs=hairSvg(i,i===5?"#B6A4FF":"#4A3222");
      return `<button type="button" class="sw sw-ic${i===d.style?" on":""}" data-look="style" data-v="${i}" aria-label="${n}" aria-pressed="${i===d.style}"><svg width="24" height="24" viewBox="-7.5 -24 15 15" aria-hidden="true">${hs.back}<circle cx="0" cy="-16" r="5" fill="#E8B48F"/>${hs.front}</svg></button>`}).join("")}</div>`;
    return `<div class="field"><span>Aussehen</span><div class="look"><div class="look-prev" id="lookPrev">${lookPreview(r,d)}</div><div class="look-opts">
      ${row("Haut","skin",SKIN,d.skin)}${styles}${row("Haare","hair",HAIR,d.hair)}${row("Shirt","shirt",SHIRT,d.shirt)}</div></div></div>`;
  }
  const n=(FUR[r.art]||[]).length; if(n<2) return "";
  return `<div class="field"><span>Fellfarbe</span><div class="sw-row" role="radiogroup" aria-label="Fellfarbe">${Array.from({length:n},(_,i)=>`<button type="button" class="sw sw-ic sw-big${i===d.fur?" on":""}" data-look="fur" data-v="${i}" aria-label="Fellfarbe ${i+1}" aria-pressed="${i===d.fur}"><svg width="38" height="30" viewBox="${r.art==="Wal"?"-24 -20 48 26":"-16 -22 32 24"}" aria-hidden="true">${animalSvg(r.art,i)}</svg></button>`).join("")}</div></div>`;
}
function bindLookEditor(r,draft){
  document.querySelectorAll("#modalRoot [data-look]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.look; draft[k]=+b.dataset.v;
    document.querySelectorAll(`#modalRoot [data-look="${k}"]`).forEach(x=>{const on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)});
    const pv=$("#lookPrev"); if(pv) pv.innerHTML=lookPreview(r,draft);
  });
}
function capsuleSheet(c,fresh){
  const text="Meine OffLand-Insel im "+c.title+": "+c.lines.join(" ");
  sheet(`<div class="postcard" style="background:#26233D;color:var(--ink)"><div style="padding:18px;display:flex;flex-direction:column;gap:8px">
      <p class="label" style="color:var(--lilac)">Zeitkapsel</p><h2>${esc(c.title)}</h2>
      ${c.lines.map(l=>`<p>${esc(l)}</p>`).join("")}
      <div class="bar"><i style="width:${c.total?c.good/c.total*100:0}%"></i></div><p class="small muted">${c.good} von ${c.total} Tagen im Budget</p></div></div>
    <button class="btn secondary" id="capCopy">Text kopieren zum Teilen</button>
    <p class="small muted" id="capTxt" style="user-select:all">${esc(text)}</p>
    <button class="btn" data-ok>${fresh?"In die Sammlung":"Schließen"}</button>`);
  $("#capCopy").onclick=()=>{try{navigator.clipboard.writeText(text).then(()=>toast("Kopiert"),()=>toast("Bitte den Text unten markieren und kopieren"))}catch(e){toast("Bitte den Text unten markieren und kopieren")}};
}
function visitSheet(fid){
  const f=(FRIENDS||[]).find(x=>x.id===fid); if(!f) return;
  const name=NAMES[fid]||"Eine Insel";
  sheet(`<p class="label" style="color:var(--lilac)">Zu Besuch</p><h2>${esc(name)}s Insel</h2>
    <div class="anim">${sceneFor(f.sum)}</div>
    <p class="muted">${(f.sum.residents||[]).filter(r=>r.status==="da").length} Bewohner · Inselglück ${f.sum.glueck} % · ${(f.sum.built||[]).length} Großprojekte</p>
    <p style="font-weight:700">Etwas dalassen</p>
    <div class="row"><button class="btn secondary grow" data-gift="Fische|20" ${S.points>=20?"":"disabled"}>Fische · 20</button><button class="btn secondary grow" data-gift="Blumen|40" ${S.points>=40?"":"disabled"}>Blumen · 40</button></div>
    <button class="btn" data-ok>Zurück nach Hause segeln</button>`);
  document.querySelectorAll("[data-gift]").forEach(b=>b.onclick=()=>{const [w,p]=b.dataset.gift.split("|");sendGift(fid,w,+p);closeModal()});
}
function exportSave(){
  const blob=new Blob([JSON.stringify(S)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="offland-"+today()+".json";
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast("Sicherung heruntergeladen");
}
function importSave(file){
  const rd=new FileReader();
  rd.onload=()=>{try{const st=JSON.parse(rd.result);if(!st||st.v!==1||!Array.isArray(st.residents)) throw 0;
    S=migrate(st);tab="heute";save();closeModal();render();toast("Sicherung geladen")}catch(e){toast("Diese Datei ist keine gültige Sicherung.")}};
  rd.readAsText(file);
}
function confirmReset(){
  sheet(`<h2>Spielstand zurücksetzen?</h2><p class="muted">Deine Insel, alle Bewohner und eingetragenen Tage werden gelöscht. Das lässt sich nicht rückgängig machen.</p>
  <div class="row"><button class="btn secondary grow" id="noR">Abbrechen</button><button class="btn grow" id="yesR" style="background:var(--coral)">Zurücksetzen</button></div>`);
  $("#noR").onclick=closeModal;
  $("#yesR").onclick=()=>{S=migrate(newGame());tab="heute";save();closeModal();render()};
}

/* ---------- Konten: lokale Profile mit Startbildschirm ---------- */
const PROF_KEY="offline-insel-profile", SESSION_KEY="offline-insel-sitzung";
const AVATARS=["Ziege","Katze","Hund","Huhn","Schaf","Hase","Esel","Robbe","Delfin","Meerschweinchen"];
const AV_BG={Ziege:"#22301F",Katze:"#2A2418",Hund:"#2A2418",Huhn:"#3A2220",Schaf:"#26233D",Hase:"#2A2418",Esel:"#26233D",Robbe:"#1F2A3A",Delfin:"#1F2A3A",Meerschweinchen:"#3A2220"};
let ACC=null;
const profKey=id=>"offline-insel-v1:"+id;
function profiles(){try{return JSON.parse(localStorage.getItem(PROF_KEY))||[]}catch(e){return []}}
function storeProfiles(list){try{localStorage.setItem(PROF_KEY,JSON.stringify(list))}catch(e){}}
function updateProfile(id,patch){const list=profiles(),p=list.find(x=>x.id===id);if(!p)return null;Object.assign(p,patch);storeProfiles(list);if(ACC&&ACC.id===id)ACC=p;return p}
function peek(id){try{return JSON.parse(localStorage.getItem(profKey(id)))}catch(e){return null}}
function avatarSvg(art,size){return `<span class="avatar" style="background:${AV_BG[art]||"#26233D"};width:${size}px;height:${size}px;border-radius:${size/2}px"><svg width="${Math.round(size*.8)}" height="${Math.round(size*.8)}" viewBox="-16 -22 32 24" aria-hidden="true">${animalSvg(art)}</svg></span>`}
async function hashPin(pin,salt){
  const t=salt+":"+pin;
  try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,"0")).join("")}
  catch(e){let h=5381;for(const c of t)h=((h<<5)+h+c.charCodeAt(0))|0;return "d"+(h>>>0).toString(16)}
}
const validPin=v=>/^\d{4}$/.test(v);
function modal(html){$("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`}
const pinField=(id,label)=>`<label class="field" for="${id}">${label}<input id="${id}" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="4 Ziffern"></label>`;

/* Spielstand aus der Version ohne Konten in ein erstes Konto übernehmen */
function migrateOldSave(){
  if(profiles().length) return;
  let old=null; try{old=localStorage.getItem(OLD_LS)}catch(e){}
  if(!old) return;
  const id=uid();
  try{localStorage.setItem(profKey(id),old);localStorage.removeItem(OLD_LS)}catch(e){return}
  storeProfiles([{id,name:"Meine Insel",avatar:"Ziege",salt:uid(),pin:null,created:Date.now()}]);
}

function login(p){
  ACC=p; LS=profKey(p.id);
  try{sessionStorage.setItem(SESSION_KEY,p.id)}catch(e){}
  updateProfile(p.id,{last:Date.now()});
  const st=lsGet(); S=migrate(st&&st.v===1?st:newGame()); tab="heute";
  document.body.classList.remove("start"); $("#start").innerHTML="";
  closeModal(); render(); window.scrollTo(0,0); showPending();
}
function logout(){
  if(ACC) lsSet();
  ACC=null; LS=null; S=migrate(newGame());
  try{sessionStorage.removeItem(SESSION_KEY)}catch(e){}
  showStart();
}
function tryLogin(p){p.pin?pinPrompt(p,()=>login(p)):login(p)}

function showStart(){
  document.body.classList.add("start"); closeModal(); window.scrollTo(0,0); renderFocus();
  const list=profiles().sort((a,b)=>(b.last||0)-(a.last||0));
  const hero=base(`<g class="bob">${figure({kind:"mensch",name:"Mia"},226,134)}</g><g class="bob" style="animation-delay:.5s">${figure({kind:"tier",art:"Ziege",name:"x"},250,136)}</g><g class="drift"><path d="M60 60q6-6 12 0q6-6 12 0M96 76q5-5 10 0q5-5 10 0" stroke="#F3F1EA" stroke-width="2" fill="none" stroke-linecap="round"/></g>`,false);
  const chev=`<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;
  const lock=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A4A6BD" stroke-width="2" stroke-linecap="round" aria-label="mit PIN"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  $("#start").innerHTML=`<div class="start-wrap">
    <div class="start-hero">${hero}</div>
    <div style="display:flex;flex-direction:column;gap:6px"><h1 class="start-title">Off<span>Land</span></h1><p class="tagline">Grow your world beyond the screen.</p><p class="muted">Je weniger Bildschirmzeit, desto glücklicher werden deine Bewohner und desto mehr wächst deine Insel.</p></div>
    ${list.length?`<div class="card"><p class="label">Wer spielt?</p>${list.map(p=>{const st=peek(p.id);const info=st&&st.setup?`${st.dayCount} ${st.dayCount===1?"Tag":"Tage"} · Glück ${st.glueck} %`:"Insel noch nicht gestartet";
        return `<button class="profile" data-login="${p.id}">${avatarSvg(p.avatar,48)}<span class="grow"><b>${esc(p.name)}</b><span class="small muted">${info}</span></span>${p.pin?lock:""}${chev}</button>`}).join("")}</div>
      <button class="btn secondary" id="newAcc">Neues Konto anlegen</button>`
    :`<div class="card"><p class="label">So funktioniert's</p><ul class="steps"><li>Trag abends deine Bildschirmzeit ein.</li><li>Bleibst du im Budget, wird deine Insel glücklicher und wächst.</li><li>Zu viel Handy bringt Wolken, Streit und App-Monster.</li></ul></div>
      <button class="btn" id="newAcc">Konto anlegen</button>`}
    <p class="small muted" style="text-align:center">Alle Daten bleiben auf diesem Gerät.</p>
  </div>`;
  document.querySelectorAll("[data-login]").forEach(b=>b.onclick=()=>{const p=profiles().find(x=>x.id===b.dataset.login);if(p)tryLogin(p)});
  $("#newAcc").onclick=showCreate;
}

function accFields(p){
  return `<label class="field" for="accName">Name<input id="accName" type="text" maxlength="20" autocomplete="nickname" value="${p?esc(p.name):""}" placeholder="z. B. Mia"></label>
  <div class="field"><span>Avatar</span><div class="av-grid" role="radiogroup" aria-label="Avatar">${AVATARS.map((a,i)=>`<label class="av-opt"><input type="radio" name="accAv" value="${a}" ${(p?p.avatar===a:i===0)?"checked":""}><span>${avatarSvg(a,48)}</span><span class="sr">${a}</span></label>`).join("")}</div></div>`;
}
const readAcc=()=>({name:$("#accName").value.trim().slice(0,20),avatar:(document.querySelector("[name=accAv]:checked")||{}).value||AVATARS[0]});

function showCreate(){
  const first=!profiles().length;
  $("#start").innerHTML=`<div class="start-wrap">
    <div class="card" style="gap:14px"><p class="label" style="color:var(--lime)">${first?"Willkommen":"Neues Konto"}</p><h2>Konto anlegen</h2>
      ${accFields(null)}
      ${pinField("accPin","PIN (freiwillig)")}
      <p class="small muted" style="margin-top:-6px">Mit PIN kann niemand anderes auf diesem Gerät deine Insel öffnen. Merk sie dir gut, sie lässt sich nicht zurücksetzen.</p>
      <p class="err" id="accErr" role="alert"></p>
      <button class="btn" id="accCreate">Konto anlegen</button>
      <button class="btn ghost" id="accBack">Zurück</button>
    </div></div>`;
  window.scrollTo(0,0); $("#accName").focus();
  $("#accBack").onclick=showStart;
  $("#accCreate").onclick=async()=>{
    const {name,avatar}=readAcc(), pin=$("#accPin").value;
    if(!name) return $("#accErr").textContent="Bitte gib einen Namen ein.";
    if(pin&&!validPin(pin)) return $("#accErr").textContent="Die PIN muss aus genau 4 Ziffern bestehen.";
    const p={id:uid(),name,avatar,salt:uid(),pin:null,created:Date.now()};
    if(pin) p.pin=await hashPin(pin,p.salt);
    const list=profiles(); list.push(p); storeProfiles(list);
    login(p); toast("Willkommen, "+name+"!");
  };
}

function pinPrompt(p,onOk){
  modal(`<div class="row">${avatarSvg(p.avatar,48)}<div class="grow"><p class="label">PIN eingeben</p><h2>${esc(p.name)}</h2></div></div>
    <input id="pinIn" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN">
    <p class="err" id="pinErr" role="alert"></p>
    <div class="row"><button class="btn secondary grow" id="pinNo">Abbrechen</button><button class="btn grow" id="pinOk">Öffnen</button></div>`);
  const inp=$("#pinIn"); inp.focus();
  const go=async()=>{if(await hashPin(inp.value,p.salt)===p.pin){closeModal();onOk()}else{$("#pinErr").textContent="Falsche PIN. Versuch es noch mal.";inp.value="";inp.focus()}};
  $("#pinOk").onclick=go; inp.onkeydown=e=>{if(e.key==="Enter")go()}; $("#pinNo").onclick=closeModal;
}

function accountSheet(){
  if(!ACC) return;
  modal(`<div class="row">${avatarSvg(ACC.avatar,56)}<div class="grow"><p class="label">Konto</p><h2>${esc(ACC.name)}</h2><p class="small muted">${ACC.pin?"Mit PIN geschützt":"Ohne PIN"} · seit ${new Date(ACC.created).toLocaleDateString("de-DE")}</p></div></div>
    <button class="btn secondary" id="accSettings">⚙︎ Einstellungen</button>
    <button class="btn secondary" id="accEdit">Name und Avatar ändern</button>
    <button class="btn secondary" id="accPinBtn">${ACC.pin?"PIN ändern oder entfernen":"PIN festlegen"}</button>
    <button class="btn secondary" id="accOut">Abmelden und Konto wechseln</button>
    <button class="btn ghost danger" id="accDel">Konto löschen</button>
    <button class="btn" id="accClose">Schließen</button>`);
  $("#accSettings").onclick=settingsSheet; $("#accEdit").onclick=editSheet; $("#accPinBtn").onclick=pinSheet;
  $("#accOut").onclick=()=>{toast("Abgemeldet");logout()};
  $("#accDel").onclick=deleteSheet; $("#accClose").onclick=closeModal;
  $("#accClose").focus();
}
function settingsSheet(){
  modal(`<div class="row between"><div><p class="label">Konto · ${esc(ACC?ACC.name:"")}</p><h2>Einstellungen</h2></div><button class="iconbtn" id="setClose" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F3F1EA" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    ${settingsHtml()}
    <button class="btn secondary" id="setBack">Zurück zum Konto</button>
    <button class="btn" id="setDone">Fertig</button>`);
  bind();
  const done=()=>{closeModal();render();showPending()};
  $("#setClose").onclick=done; $("#setDone").onclick=done; $("#setBack").onclick=()=>{render();accountSheet()};
}
function editSheet(){
  modal(`<p class="label">Konto</p><h2>Name und Avatar</h2>${accFields(ACC)}<p class="err" id="accErr" role="alert"></p>
    <div class="row"><button class="btn secondary grow" id="edNo">Abbrechen</button><button class="btn grow" id="edOk">Speichern</button></div>`);
  $("#edNo").onclick=accountSheet;
  $("#edOk").onclick=()=>{const {name,avatar}=readAcc();if(!name)return $("#accErr").textContent="Bitte gib einen Namen ein.";
    updateProfile(ACC.id,{name,avatar});closeModal();render();toast("Gespeichert")};
}
function pinSheet(){
  const has=!!ACC.pin;
  modal(`<p class="label">Konto</p><h2>${has?"PIN ändern":"PIN festlegen"}</h2>
    ${has?pinField("pinOld","Aktuelle PIN"):""}${pinField("pinNew","Neue PIN")}${pinField("pinRep","Neue PIN wiederholen")}
    <p class="err" id="pinErr" role="alert"></p>
    <button class="btn" id="pinSave">PIN speichern</button>
    ${has?`<button class="btn ghost danger" id="pinDel">PIN entfernen</button>`:""}
    <button class="btn secondary" id="pinNo">Abbrechen</button>`);
  const err=t=>$("#pinErr").textContent=t;
  const oldOk=async()=>!has||await hashPin($("#pinOld").value,ACC.salt)===ACC.pin;
  $("#pinNo").onclick=accountSheet;
  $("#pinSave").onclick=async()=>{
    if(!await oldOk()) return err("Die aktuelle PIN stimmt nicht.");
    const n=$("#pinNew").value; if(!validPin(n)) return err("Die neue PIN muss aus genau 4 Ziffern bestehen.");
    if(n!==$("#pinRep").value) return err("Die beiden neuen PINs sind nicht gleich.");
    updateProfile(ACC.id,{pin:await hashPin(n,ACC.salt)}); closeModal(); render(); toast("PIN gespeichert");
  };
  if(has) $("#pinDel").onclick=async()=>{if(!await oldOk())return err("Gib zuerst deine aktuelle PIN ein.");updateProfile(ACC.id,{pin:null});closeModal();render();toast("PIN entfernt")};
}
function deleteSheet(){
  modal(`<p class="label" style="color:var(--coral)">Konto löschen</p><h2>„${esc(ACC.name)}“ wirklich löschen?</h2>
    <p class="muted">Deine Insel mit allen Bewohnern, eingetragenen Tagen, Postkarten und Punkten wird von diesem Gerät gelöscht. Das lässt sich nicht rückgängig machen.</p>
    <button class="btn secondary" id="delBackup">Vorher Sicherung herunterladen</button>
    ${ACC.pin?pinField("delPin","Zur Bestätigung deine PIN"):""}
    <label class="check" for="delSure"><input type="checkbox" id="delSure"> Ja, ich will mein Konto endgültig löschen</label>
    <p class="err" id="delErr" role="alert"></p>
    <div class="row"><button class="btn secondary grow" id="delNo">Abbrechen</button><button class="btn grow" id="delYes" style="background:var(--coral)" disabled>Löschen</button></div>`);
  const sure=$("#delSure"), yes=$("#delYes");
  sure.onchange=()=>{yes.disabled=!sure.checked};
  $("#delBackup").onclick=exportSave; $("#delNo").onclick=accountSheet;
  yes.onclick=async()=>{
    if(ACC.pin&&await hashPin($("#delPin").value,ACC.salt)!==ACC.pin) return $("#delErr").textContent="Die PIN stimmt nicht.";
    const id=ACC.id;
    try{localStorage.removeItem(profKey(id))}catch(e){}
    storeProfiles(profiles().filter(x=>x.id!==id));
    ACC=null; LS=null; logout(); toast("Konto gelöscht");
  };
}

$("#accBtn").onclick=accountSheet;

function boot(){
  migrateOldSave();
  let sid=null; try{sid=sessionStorage.getItem(SESSION_KEY)}catch(e){}
  const p=sid&&profiles().find(x=>x.id===sid);
  if(p) login(p); else showStart();
  initStore();
}

boot();
})();

/* Offline-Unterstützung */
if("serviceWorker" in navigator&&location.protocol!=="file:"){
  navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).catch(()=>{});
  // Neue Version übernommen: einmal neu laden, damit sie sofort sichtbar ist
  let reloaded=false;
  if(navigator.serviceWorker.controller) navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!reloaded){reloaded=true;location.reload()}});
}
