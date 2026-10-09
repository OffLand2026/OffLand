/* OffLand – Spiellogik */
(function(){
"use strict";

/* ---------- Daten ---------- */
const HUMAN_NAMES=["Mia","Jonte","Frieda","Hannes","Ole","Lotta","Ida","Ben","Nele","Piet","Greta","Malte","Smilla","Fiete","Hanna","Jasper","Merle","Henrik","Juna","Til"];
const ANIMAL_NAMES=["Lotte","Bruno","Krümel","Gerda","Paula","Socke","Wolke","Kalle","Möhre","Pünktchen","Flocke","Bommel","Strubbel","Rosi","Kuno"];
const LAND=["Ziege","Huhn","Schaf","Esel","Katze","Hund","Meerschweinchen","Hase","Robbe"];
const SEA=["Delfin","Wal"];
const FAR_ANIMALS=["Papagei","Elch","Kamel","Eisbär"];
/* Geschlecht der Tierarten für „ein kleiner Hund“, „eine kleine Katze“, „ein kleines Schaf“ */
const GENUS={Ziege:"f",Katze:"f",Robbe:"f",Huhn:"n",Schaf:"n",Meerschweinchen:"n",Kamel:"n",Esel:"m",Hund:"m",Hase:"m",Delfin:"m",Wal:"m",Papagei:"m",Elch:"m",Eisbär:"m"};
function artikel(art,gross,klein){const g=GENUS[art]||"n";let a=g==="f"?"eine":"ein";if(klein)a+=g==="f"?" kleine":g==="m"?" kleiner":" kleines";return gross?a[0].toUpperCase()+a.slice(1):a}
const PLURAL={Papagei:"Papageien",Elch:"Elche",Kamel:"Kamele",Eisbär:"Eisbären",Ziege:"Ziegen",Huhn:"Hühner",Schaf:"Schafe",Esel:"Esel",Katze:"Katzen",Hund:"Hunde",Meerschweinchen:"Meerschweinchen",Hase:"Hasen",Robbe:"Robben",Delfin:"Delfine",Wal:"Wale"};
const SOUND={Papagei:"Krah! Hallo!",Elch:"Mööööh!",Kamel:"Brrrmpf!",Eisbär:"Grrrumm!",Ziege:"Mäh!",Huhn:"Gack-gack!",Schaf:"Bäh!",Esel:"I-ah!",Katze:"Miau!",Hund:"Wuff!",Meerschweinchen:"Quiek!",Hase:"Schnupper-schnupper!",Robbe:"Ö-ö-ö!",Delfin:"Kliek-kliek!",Wal:"Wuuuuh!"};
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
  {id:"leuchtturm",name:"Leuchtturm",hours:5,text:"Die Insel leuchtet nachts, +1 Platz für Bewohner"},
  {id:"bruecke",name:"Brücke zur Nachbarinsel",hours:6,text:"Eine zweite Insel kommt dazu, +2 Plätze"},
  {id:"schiff",name:"Schiff",hours:7,text:"Hannes und Co. können fischen, +1 Platz"},
  {id:"windmuehle",name:"Windmühle",hours:8,text:"Brot für alle, +2 Plätze"},
  {id:"insel3",name:"Dritte Insel",hours:10,text:"Noch mehr Platz, +2 Plätze"},
  {id:"baumhaus",name:"Baumhaus",hours:9,text:"Ein Versteck in den Baumkronen, +1 Platz"},
  {id:"floss",name:"Floß",hours:10,text:"Fokus-Bootsfahrten bringen doppelt so viele Fische"},
  {id:"festzelt",name:"Festzelt",hours:12,text:"Inselfeste schon ab 4 guten Tagen pro Woche, +20 Punkte extra"},
  {id:"strandhaus",name:"Strandhaus",hours:14,text:"Wohnen direkt am Meer, +2 Plätze"},
  {id:"beachclub",name:"Beachclub",hours:17,text:"+10 Punkte und +1 % Glück an jedem Tag im Budget, +1 Platz"}
];
/* Weltreise: Sind alle Großprojekte einer Welt fertig, wird die nächste Insel entdeckt
   und die ganze Inselgemeinschaft kann umziehen. Bewohner, Gegenstände und Plätze reisen mit. */
const WORLDS=[
  {id:"heimat",name:"Heimatinseln",isle2:"bruecke",isle3:"insel3",text:"Hier hat alles angefangen: Leuchtturm, Windmühle und die erste Hütte.",projects:PROJECTS},
  {id:"tropen",name:"Tropeninsel",isle2:"t_haengebruecke",isle3:"t_vulkan",animals:["Papagei"],text:"Türkises Wasser, Palmen, Pfahlhütten und bunte Papageien.",
    theme:{sky:"#7FD4F0",sea:"#1FA2B8",sand:"#F5E1A4",grass:"#6CC46A",leaf:"#3FA35A",tree:"palme",hut:"pfahl",bridge:"#C9A26A",horizon:"tropen"},
    projects:[
      {id:"t_bambus",name:"Bambushütten",hours:10,cap:2,text:"Luftige Hütten aus Bambus, +2 Plätze"},
      {id:"t_haengebruecke",name:"Hängebrücke",hours:11,cap:2,text:"Eine Hängebrücke zur Nachbarinsel, +2 Plätze"},
      {id:"t_riff",name:"Korallenriff-Steg",hours:12,cap:1,sea:true,text:"Ein Steg über das bunte Riff, +1 Platz"},
      {id:"t_wasserfall",name:"Wasserfall",hours:14,cap:1,text:"+1 % Glück an jedem guten Tag, +1 Platz"},
      {id:"t_vulkan",name:"Vulkaninsel",hours:15,cap:3,text:"Eine dritte Insel mit schlafendem Vulkan, +3 Plätze"},
      {id:"t_mango",name:"Mangoplantage",hours:18,cap:2,text:"+10 Punkte an jedem Tag im Budget, +2 Plätze"}]},
  {id:"fjord",name:"Fjordinseln",isle2:"f_bruecke",isle3:"f_schaere",animals:["Elch"],text:"Rote Holzhäuser, dunkle Tannen und Berge im hohen Norden.",
    theme:{sky:"#BFD7EA",sea:"#2E5A7A",sand:"#B9B4A8",grass:"#7FA86A",leaf:"#2F6B45",tree:"tanne",hut:"stuga",bridge:"#7A5038",horizon:"berge"},
    projects:[
      {id:"f_stugor",name:"Rote Holzhäuser",hours:12,cap:2,text:"Gemütliche Stugor für alle, +2 Plätze"},
      {id:"f_bruecke",name:"Fjordbrücke",hours:14,cap:2,text:"Eine Brücke über den Fjord, +2 Plätze"},
      {id:"f_sauna",name:"Sauna am See",hours:15,cap:1,text:"Weniger Streit auf der Insel, +1 Platz"},
      {id:"f_wikinger",name:"Wikingerschiff",hours:16,cap:2,sea:true,text:"Fokus-Bootsfahrten bringen 20 % mehr Punkte, +2 Plätze"},
      {id:"f_schaere",name:"Schäreninsel",hours:18,cap:3,text:"Eine dritte Insel aus rundem Fels, +3 Plätze"},
      {id:"f_nordlicht",name:"Nordlicht-Turm",hours:20,cap:2,text:"Polarlicht schon nach 5 Tagen im Budget, +2 Plätze"}]},
  {id:"oase",name:"Wüsteninsel",isle2:"o_karawane",isle3:"o_duene",animals:["Kamel"],text:"Goldene Dünen, eine grüne Oase und Kamele in der Hitze.",
    theme:{sky:"#F7D9A0",sea:"#3FB8B0",sand:"#EBC27A",grass:"#C9A35A",leaf:"#6E8B3D",tree:"kaktus",hut:"lehm",bridge:"#B07A55",horizon:"duenen"},
    projects:[
      {id:"o_lehm",name:"Lehmhäuser",hours:15,cap:2,text:"Kühle Häuser aus Lehm, +2 Plätze"},
      {id:"o_karawane",name:"Karawanenweg",hours:16,cap:2,text:"Ein Weg zur Nachbarinsel, +2 Plätze"},
      {id:"o_brunnen",name:"Oasenbrunnen",hours:18,cap:1,text:"Wer wegziehen will, wartet 1 Tag länger, +1 Platz"},
      {id:"o_markt",name:"Basar",hours:19,cap:2,text:"Alles im Laden 10 % billiger, +2 Plätze"},
      {id:"o_duene",name:"Düneninsel",hours:20,cap:3,text:"Eine dritte Insel aus Sand, +3 Plätze"},
      {id:"o_sternzelt",name:"Sternenzelt",hours:22,cap:2,text:"+1 % Glück an jedem guten Tag, +2 Plätze"}]},
  {id:"alaska",name:"Eisinseln",isle2:"a_eisbruecke",isle3:"a_scholle",animals:["Eisbär"],text:"Iglus, Schnee, Eisschollen und Polarlichter am Ende der Welt.",
    theme:{sky:"#A9CDE8",sea:"#4F84AE",sand:"#F3F6F8",grass:"#D3E3EE",leaf:"#3E6B5A",tree:"schneetanne",hut:"iglu",bridge:"#BFE0F5",horizon:"eis"},
    projects:[
      {id:"a_iglus",name:"Iglu-Dorf",hours:18,cap:3,text:"Warme Iglus für alle, +3 Plätze"},
      {id:"a_eisbruecke",name:"Eisbrücke",hours:19,cap:2,text:"Eine Brücke aus Eis zur Nachbarinsel, +2 Plätze"},
      {id:"a_schlitten",name:"Hundeschlitten-Station",hours:20,cap:2,text:"+5 Punkte an jedem Tag im Budget, +2 Plätze"},
      {id:"a_eisfischen",name:"Eisfischer-Hütte",hours:21,cap:1,sea:true,text:"Doppelt so viele Fische bei Fokus-Bootsfahrten, +1 Platz"},
      {id:"a_scholle",name:"Große Eisscholle",hours:22,cap:3,text:"Eine dritte Insel aus Eis, +3 Plätze"},
      {id:"a_polarwarte",name:"Polarlicht-Warte",hours:25,cap:2,text:"+2 % Glück an jedem guten Tag, +2 Plätze"}]}
];
const curWorld=()=>WORLDS[S.world||0];
const curProjects=()=>curWorld().projects;
const projById=id=>WORLDS.flatMap(w=>w.projects).find(p=>p.id===id);
const worldAnimals=()=>WORLDS.slice(1,(S.world||0)+1).flatMap(w=>w.animals||[]);

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
  {id:"haengematte",n:"Hängematte",cost:250,cat:"nutzen",fx:"+5 Punkte für jeden Tag im Budget."},
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
  {id:"teich",n:"Ententeich",cost:320,cat:"deko",fx:"Zwei Enten ziehen mit ein."},
  /* Tropeninsel */
  {id:"t_kanu",world:"tropen",like:"angel",n:"Auslegerkanu",cost:220,cat:"nutzen",fx:"Fokus-Bootsfahrten bringen 20 % mehr Punkte."},
  {id:"t_kokos",world:"tropen",like:"garten",n:"Kokosnuss-Stand",cost:260,cat:"nutzen",fx:"+5 Punkte an jedem Tag im Budget."},
  {id:"t_haengematte",world:"tropen",like:"haengematte",n:"Palmen-Hängematte",cost:300,cat:"nutzen",fx:"+5 Punkte für jeden Tag im Budget."},
  {id:"t_orchidee",world:"tropen",like:"blumen",n:"Orchideenbeet",cost:300,cat:"nutzen",fx:"+1 % Glück an jedem guten Tag."},
  {id:"t_tiki",world:"tropen",like:"feuer",n:"Tiki-Fackeln",cost:420,cat:"nutzen",fx:"Weniger Streit auf der Insel."},
  {id:"t_huette",world:"tropen",like:"stall",n:"Gästehütte",cost:480,cat:"nutzen",fx:"+3 Plätze für neue Bewohner."},
  {id:"t_surf",world:"tropen",n:"Surfbretter",cost:120,cat:"deko",fx:"Für die nächste große Welle."},
  {id:"t_flamingo",world:"tropen",n:"Flamingos",cost:180,cat:"deko",fx:"Stehen elegant auf einem Bein."},
  /* Fjordinseln */
  {id:"f_kanu",world:"fjord",like:"angel",n:"Kanu am Steg",cost:260,cat:"nutzen",fx:"Fokus-Bootsfahrten bringen 20 % mehr Punkte."},
  {id:"f_schaukel",world:"fjord",like:"schaukel",n:"Baumschaukel",cost:280,cat:"nutzen",fx:"+1 % Glück an guten Tagen, wenn Kinder auf der Insel sind."},
  {id:"f_beeren",world:"fjord",like:"garten",n:"Beerensträucher",cost:300,cat:"nutzen",fx:"+5 Punkte an jedem Tag im Budget."},
  {id:"f_feuerschale",world:"fjord",like:"feuer",n:"Feuerschale",cost:480,cat:"nutzen",fx:"Weniger Streit auf der Insel."},
  {id:"f_scheune",world:"fjord",like:"stall",n:"Holzscheune",cost:560,cat:"nutzen",fx:"+3 Plätze für neue Bewohner."},
  {id:"f_moos",world:"fjord",n:"Moos und Pilze",cost:100,cat:"deko",fx:"Wächst ganz von allein."},
  {id:"f_wimpel",world:"fjord",n:"Wimpelkette",cost:120,cat:"deko",fx:"Rot, weiß, blau im Wind."},
  {id:"f_runen",world:"fjord",n:"Runenstein",cost:160,cat:"deko",fx:"Erzählt eine sehr alte Geschichte."},
  /* Wüsteninsel */
  {id:"o_teppich",world:"oase",like:"picknick",n:"Teppich mit Kissen",cost:220,cat:"nutzen",fx:"Freundschaften wachsen noch schneller."},
  {id:"o_dattel",world:"oase",like:"garten",n:"Dattelpalme",cost:340,cat:"nutzen",fx:"+5 Punkte an jedem Tag im Budget."},
  {id:"o_tee",world:"oase",like:"haengematte",n:"Teestand",cost:400,cat:"nutzen",fx:"+5 Punkte für jeden Tag im Budget."},
  {id:"o_wasser",world:"oase",like:"brunnen",n:"Wasserstelle",cost:480,cat:"nutzen",fx:"Wer wegziehen will, wartet 1 Tag länger."},
  {id:"o_zelt",world:"oase",like:"stall",n:"Gästezelt",cost:640,cat:"nutzen",fx:"+3 Plätze für neue Bewohner."},
  {id:"o_kaktus",world:"oase",n:"Kaktusgarten",cost:160,cat:"deko",fx:"Blüht einmal im Jahr, dann aber richtig."},
  {id:"o_laternen",world:"oase",n:"Orientlaternen",cost:260,cat:"deko",fx:"Bunte Lichter in der Wüstennacht."},
  /* Eisinseln */
  {id:"a_eisloch",world:"alaska",like:"angel",n:"Eisangelloch",cost:360,cat:"nutzen",fx:"Fokus-Bootsfahrten bringen 20 % mehr Punkte."},
  {id:"a_kakao",world:"alaska",like:"haengematte",n:"Kakao-Stand",cost:460,cat:"nutzen",fx:"+5 Punkte für jeden Tag im Budget."},
  {id:"a_feuerkorb",world:"alaska",like:"feuer",n:"Feuerkorb",cost:600,cat:"nutzen",fx:"Weniger Streit auf der Insel."},
  {id:"a_eisbahn",world:"alaska",like:"spielplatz",n:"Eisbahn",cost:700,cat:"nutzen",fx:"Familien bekommen öfter Nachwuchs."},
  {id:"a_huskys",world:"alaska",like:"stall",n:"Huskyhütte",cost:720,cat:"nutzen",fx:"+3 Plätze für neue Bewohner."},
  {id:"a_schneemann",world:"alaska",n:"Schneemann",cost:160,cat:"deko",fx:"Trägt einen roten Schal."},
  {id:"a_laternen",world:"alaska",n:"Schneelaternen",cost:220,cat:"deko",fx:"Leuchten warm im Schnee."},
  {id:"a_eisskulptur",world:"alaska",n:"Eisskulptur",cost:260,cat:"deko",fx:"Ein Eisbär aus Eis."}
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
/* Vorhaben für die gewonnene Zeit: am Abend für morgen wählen, am nächsten Abend nachfragen */
const PLANS=[
  {id:"spaziergang",n:"Spaziergang",pp:"einen Spaziergang gemacht",min:30,ic:'<circle cx="13" cy="4" r="2"/><path d="M9 21l2-6 3 3v3M7 12l3-3 4 1 3 3M11 15l-1-6"/>'},
  {id:"lesen",n:"Lesen",pp:"gelesen",min:30,ic:'<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>'},
  {id:"sport",n:"Sport",pp:"Sport gemacht",min:45,ic:'<path d="M5 19h4l2-4 3 2 1 4M10 8l3-1 2 3 3 1M13 7l-2 5"/><circle cx="15" cy="4" r="2"/>'},
  {id:"kochen",n:"Selbst kochen",pp:"selbst gekocht",min:45,ic:'<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM2 11h2M20 11h2M9 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4"/>'},
  {id:"freunde",n:"Freund:innen treffen",pp:"Freund:innen getroffen",min:90,ic:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-4 3-6 6-6s6 2 6 6M12 20c0-4 2-6 4-6s6 2 6 6"/>'},
  {id:"rad",n:"Radtour",pp:"eine Radtour gemacht",min:60,ic:'<circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l4-7h6l2 7M10 9l2 7h6M14 5h3"/>'},
  {id:"spiel",n:"Brettspiel",pp:"ein Brettspiel gespielt",min:60,ic:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="15" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/>'},
  {id:"anruf",n:"Jemanden anrufen",pp:"jemanden angerufen",min:20,ic:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'},
  {id:"musik",n:"Musik machen",pp:"Musik gemacht",min:20,ic:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'},
  {id:"malen",n:"Hobby",pp:"Zeit fürs Hobby gehabt",min:45,ic:'<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/>'},
  {id:"lernen",n:"Lernen",pp:"gelernt",min:45,ic:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>'},
  {id:"haushalt",n:"Haushalt",pp:"den Haushalt erledigt",min:30,ic:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'},
  {id:"familie",n:"Familienzeit",pp:"Zeit mit der Familie verbracht",min:60,ic:'<circle cx="7" cy="6" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="12" cy="12" r="2"/><path d="M3 21v-5a4 4 0 0 1 8 0M13 21v-5a4 4 0 0 1 8 0M9.5 21v-3a2.5 2.5 0 0 1 5 0v3"/>'}
];
const planIcon=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p.ic}</svg>`;
const PETS=["Hund","Katze","Meerschweinchen","Hase"];
/* Gegenstände gehören zu der Inselwelt, in der sie gekauft wurden. Beim Umzug bleiben sie dort. */
/* Sonder-Deko: nicht im Laden, nur als Gewinn (Duell) oder Fund (Schatztruhe) */
const SPECIAL=[
  {id:"pokal",n:"Siegerpokal",fx:"Gewonnen im Duell gegen die Handyzeit."},
  {id:"siegerbanner",n:"Siegerbanner",fx:"Dein zweiter Duell-Sieg."},
  {id:"goldanker",n:"Goldener Anker",fx:"Dein dritter Duell-Sieg."},
  {id:"truhe",n:"Schatztruhe",fx:"Am Strand gefunden."}
];
const DUEL_PRIZES=["pokal","siegerbanner","goldanker"];
const itemDef=id=>SHOP.find(x=>x.id===id)||RARE.find(x=>x.id===id)||SPECIAL.find(x=>x.id===id);
function chestSvg(open,anim){
  const body=`<ellipse cx="0" cy="0" rx="13.5" ry="2" fill="#14151F" opacity=".25"/>
    <rect x="-11" y="-12" width="22" height="12" rx="1.6" fill="#9A6235"/><path d="M-11 -8h22M-11 -4h22" stroke="#7A4A26" stroke-width=".6"/>
    <rect x="-8.6" y="-12" width="2.6" height="12" fill="#E0A93C"/><rect x="6" y="-12" width="2.6" height="12" fill="#E0A93C"/>
    <rect x="-11.6" y="-1.8" width="23.2" height="1.8" rx=".6" fill="#C88A2E"/><rect x="-11.6" y="-12.6" width="23.2" height="1.6" rx=".6" fill="#C88A2E"/>
    <rect x="-2.2" y="-10.4" width="4.4" height="5" rx="1" fill="#FFD27A" stroke="#C88A2E" stroke-width=".5"/><circle cx="0" cy="-8.4" r=".75" fill="#6E4022"/><path d="M0 -8v1.4" stroke="#6E4022" stroke-width=".6"/>`;
  const loot=`<path d="M-10.4 -12.4q3.6-5.4 10.4-5.6q6.8.2 10.4 5.6z" fill="#FFD27A"/>
    ${[[-6,-14.6],[-2.4,-16.4],[1.8,-16.6],[5.6,-14.8],[-0.4,-14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5" fill="#FFE7A3" stroke="#E0A93C" stroke-width=".45"/>`).join("")}
    <path d="M-5 -15.6l1.6-2 1.6 2-1.6 1.6z" fill="#E5484D"/><path d="M3 -16.6l1.4-1.8 1.4 1.8-1.4 1.4z" fill="#5BC0A8"/>`;
  const lidOpen=`<path d="M-11 -12.6l1-8.4q10-3.6 20 0l1 8.4z" fill="#6E4022"/><path d="M-10 -21q10-3.6 20 0" stroke="#C88A2E" stroke-width="1.4" fill="none"/>`;
  const lidShut=`<path d="M-11.6 -12.4v-3q0-6.6 11.6-6.6t11.6 6.6v3z" fill="#A86A38"/><path d="M-8.6 -12.4v-5.6q0-2.6 1.6-3.4M8.6 -12.4v-5.6q0-2.6-1.6-3.4" stroke="#E0A93C" stroke-width="2.6" fill="none"/><path d="M-11.6 -12.6h23.2" stroke="#C88A2E" stroke-width="1.6"/>`;
  if(!anim) return (open?lidOpen+loot:lidShut)+body+(open?`<g class="firefly" style="animation-duration:2s"><path d="M9 -22l.8 1.6 1.6.8-1.6.8-.8 1.6-.8-1.6-1.6-.8 1.6-.8z" fill="#FFE7A3"/></g><g class="firefly" style="animation-duration:2.6s;animation-delay:.8s"><circle cx="-8" cy="-20" r=".9" fill="#FFE7A3"/></g>`:"");
  // Animation: Truhe wackelt, Deckel springt auf, Schatz leuchtet, Münzen fliegen heraus
  return `<g class="chest-shake">${lidOpen.replace("<path",'<path class="chest-in"')}<g class="chest-in">${loot}</g>${body}<g class="lid-fly">${lidShut}</g></g>
    <circle class="chest-glow" cx="0" cy="-16" r="14" fill="#FFD27A"/>
    ${[[-9,-30,0],[0,-36,.15],[9,-31,.3],[-4,-40,.45],[6,-42,.6]].map(([x,y,d])=>`<g class="coin-up" style="animation-delay:${2.1+d}s"><circle cx="${x}" cy="${y}" r="2.2" fill="#FFE7A3" stroke="#E0A93C" stroke-width=".7"/></g>`).join("")}`;
}
function grantItem(id){if(S.items.includes(id)) return false; S.items.push(id); S.itemW=S.itemW||{}; S.itemW[id]=curWorldId(); return true}
function itemHome(id){const d=itemDef(id); if(d&&d.world) return d.world; if(d&&SHOP.includes(d)) return "heimat"; return (S.itemW&&S.itemW[id])||"heimat"}
const curWorldId=()=>(typeof WORLDS!=="undefined"?WORLDS[S.world||0].id:"heimat");
const hereItems=()=>S.items.filter(id=>itemHome(id)===curWorldId());
const shopHere=it=>it.cat==="vorrat"||(it.world||"heimat")===curWorldId();
const owns=id=>hereItems().some(x=>x===id||(itemDef(x)||{}).like===id);
const adults=()=>here().filter(r=>r.kind==="mensch"&&r.job);
const jobOn=id=>adults().some(r=>r.job===id&&!r.retired&&!r.sick);
const jobName=id=>(JOBS.find(j=>j.id===id)||{}).n||"";
const traitName=id=>(TRAITS.find(t=>t.id===id)||{}).n||"";
const price=it=>Math.round(it.cost*(jobOn("tischler")?0.9:1)*(has("o_markt")?0.9:1));
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
  {n:"5-km-Läufe",d:"à 45 min",min:45,ic:'<path d="M5 19h4l2-4 3 2 1 4M10 8l3-1 2 3 3 1M13 7l-2 5"/><circle cx="15" cy="4" r="2"/>'},
  {n:"selbst gekochte Abendessen",d:"à 45 min",min:45,ic:'<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM2 11h2M20 11h2M9 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4"/>'},
  {n:"Yoga-Einheiten",d:"à 30 min",min:30,ic:'<circle cx="12" cy="4" r="2"/><path d="M12 7v6M5 10l7 3 7-3M7 21l5-8 5 8"/>'},
  {n:"Kinofilme",d:"à 90 min",min:90,ic:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M8 6l2 4M13 6l2 4"/>'},
  {n:"Treffen mit Freund:innen",d:"à 2 h",min:120,ic:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-4 3-6 6-6s6 2 6 6M12 20c0-4 2-6 4-6s6 2 6 6"/>'},
  {n:"ganze Bücher",d:"à 8 h (250 Seiten)",min:480,ic:'<path d="M5 4h4v16H5zM10 4h4v16h-4zM15 5l4-1 3 15-4 1z"/>'},
  {n:"Nächte Schlaf",d:"à 8 h",min:480,ic:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'},
  {n:"Marathons",d:"à 4,5 h (42 km)",min:270,ic:'<path d="M8 2l4 7 4-7"/><circle cx="12" cy="15" r="6"/><path d="M12 12v6M10.5 13.2L12 12"/>'},
  {n:"Flüge nach New York",d:"à 9 h",min:540,ic:'<path d="M3 15l7-2.5V6a2 2 0 0 1 4 0v6.5l7 2.5v2l-7-1.5V19l2 1.5V22l-4-1-4 1v-1.5l2-1.5v-3.5L3 17z"/>'},
  {n:"Reisen zum Mond",d:"à 76 h, so lange wie Apollo 11",min:4560,ic:'<path d="M12 2c3 2.4 5 6 5 10l-2 4H9l-2-4c0-4 2-7.6 5-10z"/><circle cx="12" cy="9" r="2"/><path d="M9 16l-3 3v-4M15 16l3 3v-4M10.5 20h3"/>'}
];
const actIcon=a=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a.ic}</svg>`;
function equivTop(min){
  const fits=ACTS.filter(a=>min>=a.min).sort((a,b)=>b.min-a.min);
  if(!fits.length) return [];
  const pickd=[fits[0],fits[Math.floor(fits.length/2)],fits[fits.length-1]];
  return [...new Set(pickd)].map(a=>({a,c:Math.floor(min/a.min)}));
}
const SING={"Spaziergänge":"Spaziergang","Buchkapitel":"Buchkapitel","Sprachlektionen":"Sprachlektion","5-km-Läufe":"5-km-Lauf","selbst gekochte Abendessen":"selbst gekochtes Abendessen","Yoga-Einheiten":"Yoga-Einheit","Kinofilme":"Kinofilm","Treffen mit Freund:innen":"Treffen mit Freund:innen","ganze Bücher":"ganzes Buch","Nächte Schlaf":"Nacht Schlaf","Marathons":"Marathon","Flüge nach New York":"Flug nach New York","Reisen zum Mond":"Reise zum Mond"};
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
/* ---------- Erste Woche: Funktionen nach und nach freischalten ---------- */
const FEATURES=[
  {id:"laden",day:1,name:"Inselladen",text:"Gib deine Punkte im Tab Bauen für Deko und Nützliches aus.",tab:"projekt",ic:'<path d="M4 9h16l-1 11H5zM8 9V7a4 4 0 0 1 8 0v2"/>'},
  {id:"boot",day:0,name:"Fokus-Bootsfahrt",text:"Deine Fokuszeit zum Lernen oder für Aufgaben: Leg das Handy weg, ein Bewohner fährt solange fischen und bringt Punkte mit.",tab:"heute",ic:'<path d="M3 16h18l-3 4H6zM12 16V4l6 10"/>'},
  {id:"nacht",day:2,name:"Gute-Nacht-Ritual",text:"Schick die Insel abends schlafen und leg das Handy weg. Morgen gibt es Traumpunkte.",tab:"heute",ic:'<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>'},
  {id:"zeit",day:2,name:"Zeit-Statistik",text:"Im Tab Zeit siehst du, wie viel Handyzeit du schon gespart hast und was du damit gemacht hast.",tab:"zeit",ic:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'},
  {id:"monster",day:3,name:"App-Monster",text:"Trag beim Tagesabschluss die Zeit pro App ein. Wer ein Limit sprengt, lockt ein Monster an.",tab:"heute",ic:'<circle cx="12" cy="11" r="7"/><circle cx="9.5" cy="10" r="1"/><circle cx="14.5" cy="10" r="1"/>'},
  {id:"freunde",day:3,name:"Freunde und Ranglisten",text:"Lade Freund:innen ein, vergleicht euch jede Woche und bekommt einmalig zusammen einen Monat Plus.",tab:"freunde",ic:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8 20h8"/>'},
  {id:"album",day:4,name:"Album",text:"Postkarten, Strandgut, Zeitkapseln und dein Inseltagebuch.",tab:"verlauf",ic:'<path d="M4 5h7v15H4zM13 5h7v15h-7z"/>'},
  {id:"reise",day:5,name:"Weltreise",text:"Die Karte im Tab Bauen zeigt, welche Inselwelten auf euch warten.",tab:"projekt",ic:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16"/>'}
];
const TAB_FEATURE={zeit:"zeit",freunde:"freunde",verlauf:"album"};
function feature(id){
  if(S.allFeatures) return true;
  const f=FEATURES.find(x=>x.id===id); if(!f) return true;
  if(id==="freunde"&&(S.buddies.length||(S.online&&S.online.on)||S.family||(typeof pendingInvite==="function"&&(pendingInvite()||famInvite())))) return true;
  if(id==="reise"&&(S.found||S.world)) return true;
  return S.dayCount>=f.day;
}
const nextFeature=()=>S.allFeatures?null:FEATURES.find(f=>!feature(f.id));
function unlockCheck(){
  if(S.allFeatures) return;
  const ids=FEATURES.filter(f=>f.day===S.dayCount).map(f=>f.id);
  if(ids.length) S.pending.push({type:"unlock",ids});
  if(S.dayCount>=Math.max(...FEATURES.map(f=>f.day))) S.allFeatures=true;
}
const featIcon=(f,size)=>`<span style="width:${size}px;height:${size}px;border-radius:${size/2}px;background:#26233D;color:var(--lime);display:flex;align-items:center;justify-content:center;flex:none"><svg width="${size*.55}" height="${size*.55}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${f.ic}</svg></span>`;

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
      {id:p1,name:h1,kind:"mensch",art:"Mensch",pair:p2,status:"da",ret:0,born:0,phone:true},
      {id:p2,name:h2,kind:"mensch",art:"Mensch",pair:p1,status:"da",ret:0,born:0,phone:true},
      {id:z1,name:a1,kind:"tier",art:"Ziege",pair:z2,status:"da",ret:0,born:0},
      {id:z2,name:a2,kind:"tier",art:"Ziege",pair:z1,status:"da",ret:0,born:0}
    ],
    warn:null, pending:[], days:[], feed:[], postcards:[], testmode:false,
    points:0, items:[], sun:0, rel:{}, conflict:null, arrC:0, birthC:0, allFeatures:false, chapter:0
  };
}
function migrate(st){
  if(!st.postcards)st.postcards=[];
  if(st.points==null)st.points=0; if(!st.items)st.items=[]; if(!st.sun)st.sun=0;
  if(!st.rel)st.rel={}; if(st.conflict===undefined)st.conflict=null;
  if(!st.arrC)st.arrC=0; if(!st.birthC)st.birthC=0;
  const D={apps:DEFAULT_APPS.map(x=>Object.assign({},x)),monsters:[],budgetStreak:0,aurora:0,birds:0,trader:null,wish:null,chronicle:[],finds:[],capsules:[],night:null,boat:null,focusLog:[],alarm:true,activities:{},actTotals:{},path:0,repair:null,vacation:null,builtLog:[],lastMonth:null,fish:0,focusMin:0,tea:0,memorials:[],natDeath:true,sound:true,world:0,found:0,code:null,plus:null,buddies:[],invitedBy:null,online:{on:false,pub:false,pid:null},tickets:[],backup:{on:false,code:null,at:null},family:null,plan:null,planLog:[],weekReady:null,storySeen:false,chapter:null,fests:0,freed:0,duelOff:null,jokerWk:null,lastSurprise:0,surprises:[],duel:null,duelLog:[],lineLog:[]};
  if(st.plusFriend===undefined) st.plusFriend=(st.buddies||[]).length?"alt":null;   // Plus-Monat fürs Einladen gibt es nur einmal
  if(st.allFeatures===undefined) st.allFeatures=(st.dayCount||0)>=1;          // wer schon gespielt hat, behält alles
  for(const k in D){ if(st[k]===undefined) st[k]=D[k]; }
  const prevS=S; S=st;
  if(!st.ownersSet){                                                      // ältere Spielstände: jedem Landtier eine Bezugsperson geben
    const ad=st.residents.filter(r=>r.kind==="mensch"&&r.status==="da"&&(r.job||!r.parents));
    st.residents.forEach(r=>{if(r.kind==="tier"&&!SEA.includes(r.art)&&!r.owner&&ad.length){const m=r.pair&&st.residents.find(x=>x.id===r.pair);r.owner=(m&&m.owner)||ad[hsh(r.id)%ad.length].id}});
    st.ownersSet=true;
  }
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
/* Haustiere wohnen bei ihren Menschen im Haus und brauchen keinen eigenen Inselplatz (höchstens eins pro zwei Erwachsene) */
const isPet=r=>r.kind==="tier"&&PETS.includes(r.art);
const occupied=()=>here().filter(r=>!isPet(r)).length;
const petRoom=()=>here().filter(isPet).length<Math.ceil(adults().length/2);
function capacity(){
  let c=6+(owns("stall")?3:0);
  for(const b of S.built){const p=projById(b);c+=p&&p.cap!=null?p.cap:({leuchtturm:1,bruecke:2,schiff:1,windmuehle:2,insel3:2,baumhaus:1,strandhaus:2,beachclub:1}[b]||0)}
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
  const full=occupied()>=capacity();
  if(full&&!petRoom()) {log("Jemand wollte einziehen, aber es ist kein Platz frei. Ein Großprojekt schafft neuen Platz.","info");return}
  const humans=here().filter(r=>r.kind==="mensch").length, animals=here().length-humans;
  const isHuman=!full&&humans<=animals;
  const used=S.residents.map(r=>r.name);
  if(isHuman){
    const single=here().find(r=>r.kind==="mensch"&&!r.pair);
    const r={id:uid(),name:freeName(HUMAN_NAMES,used),kind:"mensch",art:"Mensch",pair:null,status:"da",ret:0,born:S.dayCount,job:pickJob(),trait:pick(TRAITS).id,phone:Math.random()<1/3};   // jeder Dritte bringt sein Handy vom Festland mit
    if(single&&Math.random()<.5){r.pair=single.id;single.pair=r.id;r.pairSince=single.pairSince=S.dayCount}
    else{const pal=adults().filter(x=>x.id!==r.id); if(pal.length) addRel(r.id,pick(pal).id,25)}
    S.residents.push(r); S.pending.push({type:"arrival",id:r.id,partner:single?single.id:null});
  } else {
    let pool=LAND.concat(worldAnimals()).concat(has("leuchtturm")?SEA:[]).concat(jobOn("waerter")?SEA:[]);
    if(full) pool=pool.filter(a=>PETS.includes(a));                 // Insel voll: nur ein Haustier kann noch bei jemandem einziehen
    else if(!petRoom()) pool=pool.filter(a=>!PETS.includes(a));
    const present=new Set(here().map(x=>x.art));
    const fresh=pool.filter(a=>!present.has(a));
    // Arten, die noch nie auf der Insel waren, kommen zuerst: so wird die Sammlung auch wirklich voll
    const seenArt=new Set(S.residents.filter(x=>x.kind==="tier").map(x=>x.art)), unseen=pool.filter(a=>!seenArt.has(a));
    const art=pick(unseen.length?unseen:fresh.length?fresh:pool);
    const mate=here().find(x=>x.kind==="tier"&&x.art===art&&!x.pair);
    const r={id:uid(),name:freeName(ANIMAL_NAMES,used),kind:"tier",art,pair:null,status:"da",ret:0,born:S.dayCount};
    if(!SEA.includes(art)&&adults().length) r.owner=(mate&&mate.owner)||pick(adults()).id;
    S.residents.push(r);
    if(mate){r.pair=mate.id;mate.pair=r.id; S.pending.push({type:"arrival",id:r.id,partner:mate.id})}
    else if(PETS.includes(art)?petRoom():occupied()<capacity()){
      used.push(r.name);
      const r2={id:uid(),name:freeName(ANIMAL_NAMES,used),kind:"tier",art,pair:r.id,status:"da",ret:0,born:S.dayCount,owner:r.owner};
      r.pair=r2.id; S.residents.push(r2);
      S.pending.push({type:"arrival",id:r.id,partner:null},{type:"arrival",id:r2.id,partner:r.id});
    } else S.pending.push({type:"arrival",id:r.id,partner:null});
  }
}
function birth(){
  // Tiere bekommen nur Nachwuchs, solange es höchstens 4 ihrer Art gibt: sonst füllen Ziegen und Hühner alle Plätze und neue Arten kommen nie
  const pairs=here().filter(r=>r.pair&&S.residents.find(x=>x.id===r.pair&&x.status==="da")&&(r.kind==="mensch"||here().filter(x=>x.art===r.art).length<4)&&(isPet(r)?petRoom():occupied()<capacity()));
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

/* ---------- Paare: Beziehungsqualität, Krisen, Trennung, Hochzeit ---------- */
const couples=()=>here().filter(r=>r.kind==="mensch"&&r.pair&&r.id<r.pair).map(a=>[a,S.residents.find(x=>x.id===a.pair)]).filter(([a,b])=>b&&b.status==="da");
const kidsOf=(...ids)=>S.residents.filter(k=>k.parents&&k.status!=="verstorben"&&ids.every(id=>k.parents.includes(id)));
function breakup(a,b){
  a.pair=null;b.pair=null;a.married=b.married=false;
  a.ex=(a.ex||[]).concat(b.id);b.ex=(b.ex||[]).concat(a.id);
  S.rel[rk(a.id,b.id)]=-10; S.glueck=clamp(S.glueck-4,0,100);
  const kids=kidsOf(a.id,b.id).filter(k=>k.status==="da"), pets=here().filter(p=>p.kind==="tier"&&(p.owner===a.id||p.owner===b.id));
  log(a.name+" und "+b.name+" haben sich getrennt."+(kids.length?" "+nameList(kids.map(k=>k.name))+" "+vb(kids,"lebt","leben")+" jetzt abwechselnd bei beiden.":""),"bad");
  chron([a.id,b.id],a.name+" und "+b.name+" haben sich getrennt.");
  S.pending.push({type:"breakup",a:a.id,b:b.id,kids:kids.map(k=>k.id),pets:pets.map(p=>p.id)});
}
function coupleDay(good){
  couples().forEach(([a,b])=>{
    let d=good?2:-4;
    if(good&&(a.trait==="gesellig"||b.trait==="gesellig")) d+=1;
    if(good&&owns("picknick")) d+=1;
    if(a.sick||b.sick) d=Math.min(d,0);
    addRel(a.id,b.id,d);
  });
  // laufende Krise auflösen
  if(S.crisis){
    const c=S.crisis, a=S.residents.find(r=>r.id===c.a), b=S.residents.find(r=>r.id===c.b); S.crisis=null;
    if(!a||!b||a.pair!==b.id||c.day===S.lastDay) return;
    const ok=c.state==="abend"?good:Math.random()<(good?.55:.2);
    if(ok){addRel(a.id,b.id,c.state==="abend"?45:25);S.glueck=clamp(S.glueck+(c.state==="abend"?3:1),0,100);
      log(a.name+" und "+b.name+" haben sich wieder zusammengerauft.","good");S.pending.push({type:"crisisResult",a:a.id,b:b.id,ok:true,abend:c.state==="abend"})}
    else{addRel(a.id,b.id,-25);
      if(relOf(a.id,b.id)<=-35) breakup(a,b);
      else{log("Bei "+a.name+" und "+b.name+" kriselt es weiter.","bad");S.pending.push({type:"crisisResult",a:a.id,b:b.id,ok:false})}}
    return;
  }
  // neue Krise, wenn es einem Paar lange schlecht geht
  const bad=couples().find(([a,b])=>relOf(a.id,b.id)<=-15);
  if(bad&&!S.conflict&&Math.random()<.6){
    S.crisis={a:bad[0].id,b:bad[1].id,state:"neu",day:S.lastDay};
    log("Krise bei "+bad[0].name+" und "+bad[1].name+".","bad");
    S.pending.push({type:"crisis"});
    return;
  }
  // Hochzeit für lange, sehr glückliche Paare
  if(good){
    const c=couples().find(([a,b])=>!a.married&&relOf(a.id,b.id)>=70&&S.dayCount-(a.pairSince||0)>=14);
    if(c&&Math.random()<.18){const [a,b]=c;a.married=b.married=true;S.glueck=clamp(S.glueck+5,0,100);S.points+=40;
      log(a.name+" und "+b.name+" haben geheiratet! +5 % Glück, +40 Punkte.","good");chron([a.id,b.id],"Hochzeit: "+a.name+" und "+b.name+".");
      S.pending.push({type:"wedding",a:a.id,b:b.id})}
  }
}

/* ---------- Wünsche der Bewohner ----------
   Abwechselnde Arten, viele davon direkt an weniger Handyzeit gekoppelt. Belohnung und
   Fortschritt sind sichtbar, wer einen erfüllten Wunsch hat, strahlt eine Woche lang. */
const WISH_IC={item:'<path d="M4 9h16l-1 11H5zM8 9V7a4 4 0 0 1 8 0v2"/>',streak:'<path d="M12 3c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 2 3 3 3 0-3-1-5 0-7z"/>',
  glueck:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',frei:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M4 4l16 16"/>',boot:'<path d="M3 16h18l-3 4H6zM12 16V4l6 10"/>',nacht:'<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',unter:'<circle cx="12" cy="13" r="7"/><path d="M12 13V9M12 3v2"/>'};
function makeWish(){
  const cand=here().filter(r=>r.kind==="mensch"&&r.status==="da"&&!r.sick&&!((r.happyUntil||0)>S.dayCount)&&(r.job||S.dayCount-(r.born||0)>=3));
  if(!cand.length) return;
  const r=pick(cand), items=SHOP.filter(it=>!it.consumable&&shopHere(it)&&!owns(it.id));
  const opts=["streak","unter"];
  opts.push("plan","plan");
  if(S.glueck<85) opts.push("glueck");
  if(here().some(x=>x.kind==="mensch"&&x.phone)) opts.push("frei","frei");
  if(feature("boot")) opts.push("boot");
  if(feature("nacht")) opts.push("nacht");
  // Gegenstände machen etwa jeden dritten Wunsch aus
  if(feature("laden")&&items.length) for(let i=Math.round(opts.length/2);i>0;i--) opts.push("item");
  const type=pick(opts), w={rid:r.id,type,start:S.dayCount,until:S.dayCount+5,have:0,need:1};
  if(type==="item"){const it=pick(items);w.item=it.id;w.pts=30;w.gl=6;w.until=S.dayCount+999}
  if(type==="streak"){w.need=2+Math.floor(Math.random()*3);w.pts=20*w.need;w.gl=5;w.until=S.dayCount+w.need+3}
  if(type==="plan"){w.plan=pick(PLANS).id;w.pts=30;w.gl=4;w.until=S.dayCount+4}
  if(type==="glueck"){w.need=Math.min(95,Math.ceil((S.glueck+10)/5)*5);w.pts=40;w.gl=3;w.until=S.dayCount+6}
  if(type==="frei"){w.pts=35;w.gl=4;w.until=S.dayCount+5}
  if(type==="boot"){w.need=pick([30,45]);w.pts=w.need;w.gl=4}
  if(type==="nacht"){w.pts=25;w.gl=3;w.until=S.dayCount+3}
  if(type==="unter"){w.need=Math.max(30,Math.round((S.budget-30)/15)*15);w.pts=50;w.gl=6}
  S.wish=w; log(r.name+" hat einen Wunsch: "+wishText(w)+".","info");
}
function wishText(w){
  switch(w.type||"item"){
    case "streak": return w.need+" Tage am Stück im Budget";
    case "plan": return "Vorhaben: "+((PLANS.find(x=>x.id===w.plan)||{}).n||"etwas Schönes");
    case "glueck": return "Inselglück auf "+w.need+" %";
    case "frei": return "jemanden vom Handy wegholen";
    case "boot": return "eine Fokus-Bootsfahrt von mindestens "+w.need+" Minuten";
    case "nacht": return "das Gute-Nacht-Ritual mit der ganzen Insel";
    case "unter": return "ein Tag unter "+hm(w.need)+" Bildschirmzeit";
    default: return itemName(w.item);
  }
}
function wishTalk(w){
  switch(w.type||"item"){
    case "streak": return `Schaffst du ${w.need} gute Tage hintereinander? Dann backe ich für alle!`;
    case "plan": {const p=PLANS.find(x=>x.id===w.plan); return p?`Du hast lange nicht mehr ${p.pp}, oder? Mach das bald mal, ich mach mit!`:"Machst du bald mal was Schönes ohne Handy?"}
    case "glueck": return `Wenn das Inselglück auf ${w.need} % steigt, mach ich ein Picknick für alle!`;
    case "frei": return "Die am Handy fehlen mir. Ein guter Tag, und einer legt es bestimmt weg.";
    case "boot": return `Nimmst du mich mit aufs Boot? ${w.need} Minuten nur Wellen und Fische.`;
    case "nacht": return "Gehen wir heute alle früh schlafen? Ohne Handy, nur Sterne.";
    case "unter": return `Ich wette, du schaffst einen Tag unter ${hm(w.need)}!`;
    default: return `Ich träume von: ${itemName(w.item)}. Vielleicht ja bald?`;
  }
}
function wishCard(w,r){
  const type=w.type||"item", left=(w.until||0)-S.dayCount, prog=type==="streak"?w.have/w.need:0;
  const how={item:"Im Laden kaufen",streak:"Jeden Abend im Budget bleiben",plan:"Nach dem Tagesabschluss als Vorhaben wählen und umsetzen",glueck:"Gute Tage machen die Insel glücklicher",frei:"Bleib im Budget, dann legt jemand das Handy weg",boot:"Eine Fokus-Bootsfahrt von mindestens "+w.need+" min schaffen",nacht:"Abends auf „Gute Nacht, Insel“ tippen",unter:"Beim nächsten Tag unter "+hm(w.need)+" bleiben"}[type];
  return `<div class="card" style="border:1.5px solid var(--lilac)"><div class="row" style="align-items:flex-start">
    <div class="badge" style="background:#26233D;color:var(--lilac);width:52px;height:52px">${type==="item"?`<svg width="38" height="32" viewBox="-20 -34 40 38" aria-hidden="true">${itemSvg(w.item)}</svg>`:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${type==="plan"?(PLANS.find(x=>x.id===w.plan)||{}).ic||"":WISH_IC[type]||""}</svg>`}</div>
    <div class="grow"><div class="row between"><p class="label" style="color:var(--lilac)">Wunsch von ${esc(r.name)}</p>${type!=="item"&&left>=0?`<span class="small muted">${left===0?"letzter Tag":"noch "+left+(left===1?" Tag":" Tage")}</span>`:""}</div>
      <p><b>${esc(wishText(w))}</b></p><p class="small muted">${esc(how)}</p>
      ${type==="streak"?`<div class="bar" style="margin-top:6px"><i style="width:${prog*100}%;background:var(--lilac)"></i></div><p class="small muted">${w.have} von ${w.need} Tagen</p>`:""}
      <p class="small" style="margin-top:4px"><span class="chip" style="color:var(--amber)">+${w.pts||30} Punkte</span> <span class="chip good">+${w.gl||6} % Glück</span></p>
      ${type==="item"?`<button class="btn secondary" id="wishShop" style="margin-top:8px">Zum Laden</button>`:""}</div></div></div>`;
}
function fulfillWish(){
  const w=S.wish; if(!w) return; const r=S.residents.find(x=>x.id===w.rid); S.wish=null; S.lastWishEnd=S.dayCount;
  if(!r) return;
  const pts=w.pts||30, gl=w.gl||6;
  r.happyUntil=S.dayCount+7; S.points+=pts; S.glueck=clamp(S.glueck+gl,0,100);
  S.wishCount=(S.wishCount||0)+1; stat("wunsch_"+(w.type||"item"));
  log(r.name+"s Wunsch ist erfüllt: "+wishText(w)+". +"+pts+" Punkte, +"+gl+" % Glück.","good");
  chron([r.id],r.name+"s Wunsch ist erfüllt: "+wishText(w)+".");
  S.pending.push({type:"wish",rid:r.id,item:w.type==="item"||!w.type?w.item:null,text:(w.type==="item"||!w.type?itemName(w.item)+" steht jetzt auf der Insel.":"Geschafft: "+wishText(w)+"."),pts,gl});
}
function wishCheck(){
  const w=S.wish; if(!w) return;
  const r=S.residents.find(x=>x.id===w.rid&&x.status==="da");
  const stale=(!w.type||w.type==="item")&&(!itemDef(w.item)||!shopHere(itemDef(w.item))||owns(w.item));
  if(!r||stale||w.type==="quests"){S.wish=null;S.lastWishEnd=S.dayCount;return}
  if(w.type&&w.type!=="item"&&S.dayCount>w.until){log(r.name+"s Wunsch ist diesmal nicht wahr geworden. Bestimmt bald ein neuer!","info");S.wish=null;S.lastWishEnd=S.dayCount}
}
function wishProgress(min,quests,diff){
  const w=S.wish; if(!w||!w.type||w.type==="item"||S.dayCount<=w.start) return;
  if(w.type==="streak"){w.have=diff>=0?w.have+1:0; if(w.have>=w.need) fulfillWish()}
  else if(w.type==="glueck"){if(S.glueck>=w.need) fulfillWish()}
  else if(w.type==="unter"){if(min<=w.need) fulfillWish()}
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
  coupleDay(good);
  // Kinder werden erwachsen und bekommen einen Beruf
  here().filter(r=>r.kind==="mensch"&&r.parents&&!r.job).forEach(r=>{
    if(S.dayCount-(r.born||0)>=(jobOn("lehrer")?6:10)){r.job=pickJob();log(r.name+" ist erwachsen geworden und arbeitet jetzt als "+jobName(r.job)+".","good");chron([r.id],r.name+" ist erwachsen und wird "+jobName(r.job)+".");S.pending.push({type:"grownup",id:r.id})}
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
      if(a.id<b.id&&relOf(a.id,b.id)>=40&&Math.random()<.35&&!a.pair&&!b.pair&&!(a.ex||[]).includes(b.id)){
        a.pair=b.id;b.pair=a.id;a.pairSince=b.pairSince=S.dayCount;S.pending.push({type:"love",a:a.id,b:b.id});
        log(a.name+" und "+b.name+" haben sich verliebt!","good");
        chron([a.id,b.id],a.name+" und "+b.name+" haben sich verliebt.");
      }}}
  }
  // Neuer Streit
  if(!S.conflict&&ad.length>=2){
    let p=0.14+(S.glueck<80?0.1:0)+(S.glueck<40?0.1:0)-(owns("feuer")?0.08:0)-(has("f_sauna")?0.05:0);
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
const allItems=()=>SHOP.concat(RARE,SPECIAL);
const itemName=id=>(allItems().find(x=>x.id===id)||{}).n||id;
function extras(day,diff,quests,dreamt){
  const good=diff>=0;
  healthAndAge(day,good);
  // Haustiere vermissen ihre Besitzer:innen
  here().forEach(r=>{if(r.owner){const o=S.residents.find(x=>x.id===r.owner);r.sad=!!(o&&o.status==="weg")}});
  // Lebensgeschichten: Rente, Berufswechsel
  adults().forEach(r=>{
    const age=S.dayCount-(r.born||0);
    if(!r.retired&&age>=(r.parents?150:90)){r.retired=true;r.retiredAt=S.dayCount;log(r.name+" geht in Rente und erzählt jetzt Geschichten am Strand.","info");chron([r.id],r.name+" ist in Rente gegangen.");S.pending.push({type:"retire",id:r.id})}
    else if(!r.retired&&S.dayCount-(S.lastJobChange||0)>=10&&Math.random()<0.03){S.lastJobChange=S.dayCount;const old=r.job,nj=pickJob();if(nj!==old){r.job=nj;log(r.name+" wechselt den Beruf: "+jobName(old)+" → "+jobName(nj)+".","info");chron([r.id],r.name+" arbeitet jetzt als "+jobName(nj)+" statt als "+jobName(old)+".")}}
  });
  // Geburtstag: alle 30 Inseltage feiert jemand (höchstens ein Fest pro Tag)
  const bday=here().find(r=>r.kind==="mensch"&&!r.sick&&S.dayCount-(r.born||0)>0&&(S.dayCount-(r.born||0))%30===0);
  if(bday){const n=(S.dayCount-(bday.born||0))/30;S.points+=15;S.glueck=clamp(S.glueck+3,0,100);bday.happyUntil=Math.max(bday.happyUntil||0,S.dayCount+1);
    log(bday.name+" feiert den "+n+". Inselgeburtstag! +15 Punkte, +3 % Glück.","good");chron([bday.id],bday.name+" hat den "+n+". Inselgeburtstag gefeiert.");S.pending.push({type:"birthday",id:bday.id,n})}
  // Wünsche
  wishCheck();
  if(!S.wish&&S.dayCount-(S.lastWishEnd||0)>=1&&Math.random()<.65) makeWish();
  // Strandgut
  const chance=.35+(dreamt?.2:0)+(owns("teleskop")?.15:0);
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
  if(good&&S.budgetStreak>0&&S.budgetStreak%(has("f_nordlicht")?5:7)===0){
    S.aurora=owns("sternwarte")?4:3; S.pending.push({type:"visitor",kind:"aurora"}); log("Polarlicht über der Insel! 7 Tage am Stück im Budget.","good"); chron([],"Polarlicht nach "+S.budgetStreak+" Tagen im Budget.");
  } else if(good&&S.glueck>=60&&!S.birds&&Math.random()<(owns("vogelhaus")?.2:.1)){
    S.birds=2; S.glueck=clamp(S.glueck+3,0,100); S.pending.push({type:"visitor",kind:"birds"}); log("Ein Schwarm Zugvögel rastet auf der Insel. +3 % Glück.","good");
  } else if(!S.trader&&Math.random()<.12){
    const offer=RARE.filter(x=>!owns(x.id));
    if(offer.length){S.trader={until:addDays(day,2),items:shuffle(offer).slice(0,2).map(x=>x.id)};S.pending.push({type:"visitor",kind:"trader"});log("Ein Händlerschiff hat angelegt. Es bleibt 2 Tage.","info")}
  }
  // Seltene Überraschung an guten Tagen (unvorhersehbar, höchstens alle 3 Tage)
  if(good&&S.dayCount-(S.lastSurprise||0)>=3&&!S.pending.some(e=>e.type==="visitor")&&Math.random()<.25) surprise(day);
  // Inselfest nach einer guten Woche
  if(S.dayCount%7===0){
    const g=S.days.slice(-7).filter(d=>d.min<=S.budget).length;
    if(g>=(has("festzelt")?4:5)){S.fests=(S.fests||0)+1;const fp=has("festzelt")?50:30;S.glueck=clamp(S.glueck+5,0,100);S.points+=fp;S.pending.push({type:"fest",good:g});log("Inselfest! "+g+" von 7 Tagen im Budget. +5 % Glück, +"+fp+" Punkte.","good");chron([],"Inselfest nach "+g+" guten Tagen.")}
  }
  // Monats-Zeitkapsel
  const mon=day.slice(0,7);
  if(S.lastMonth&&S.lastMonth!==mon){const cap=makeCapsule(S.lastMonth);S.capsules.push(cap);S.pending.push({type:"kapsel",id:cap.id})}
  S.lastMonth=mon;
  shareProgress();
}
const SURPRISES=[{k:"truhe",w:4},{k:"schildkroete",w:3},{k:"sternschnuppe",w:3},{k:"gluehwuermchen",w:3}];
function surprise(day){
  const k=wpickF(SURPRISES).k, ev={type:"surprise",kind:k}; stat("ueberraschung");
  S.lastSurprise=S.dayCount;
  if(k==="truhe"){
    const roll=Math.random();
    if(!S.items.includes("truhe")){grantItem("truhe");ev.item="truhe";ev.pts=30;S.points+=30}
    else if(roll<.45){ev.pts=40+Math.floor(Math.random()*7)*10;S.points+=ev.pts}
    else if(roll<.75){ev.sun=2;S.sun+=2}
    else {ev.tea=1;ev.pts=30;S.tea++;S.points+=30}
    log("Überraschung: Eine Schatztruhe ist am Strand angespült worden!","good"); chron([],"Eine Schatztruhe wurde am Strand gefunden.");
  } else if(k==="schildkroete"){
    ev.pts=20; S.points+=20; S.glueck=clamp(S.glueck+4,0,100);
    log("Überraschung: Eine Meeresschildkröte hat am Strand Eier gelegt. +4 % Glück, +20 Punkte.","good"); chron([],"Eine Meeresschildkröte hat am Strand Eier gelegt.");
  } else if(k==="sternschnuppe"){
    ev.mat=120; S.material+=120;
    log("Überraschung: Sternschnuppenregen! Alle haben sich etwas gewünscht. +2 h Baumaterial.","good"); chron([],"Sternschnuppenregen über der Insel.");
  } else {
    S.glueck=clamp(S.glueck+3,0,100); here().forEach(r=>{if(r.kind==="mensch") r.happyUntil=Math.max(r.happyUntil||0,S.dayCount+1)});
    log("Überraschung: Glühwürmchen-Nacht! Alle sitzen draußen und staunen. +3 % Glück.","good"); chron([],"Glühwürmchen-Nacht auf der Insel.");
  }
  S.surprises.push({k,day}); if(S.surprises.length>100) S.surprises.shift();
  S.pending.push(ev);
}
function surpriseSheet(ev){
  const ppl=here().filter(r=>r.kind==="mensch").slice(0,3);
  const watch=ppl.map((r,i)=>`<g class="bob" style="animation-delay:${i*.3}s">${figure(r,200+i*14,134)}</g>`).join("");
  let art="",head="",text="",gain="";
  if(ev.kind==="truhe"){
    art=`<g class="pop fb" style="animation-delay:.3s"><g transform="translate(262 150) scale(1.7)">${chestSvg(true,true)}</g></g>`;
    head="Eine Schatztruhe am Strand!"; text="Über Nacht angespült. Alle sind neugierig, was drin ist …";
    gain=[ev.item?"<b style=\"color:var(--amber)\">Schatztruhe</b> als Deko für deine Insel":"",ev.pts?`<b style="color:var(--lilac)">+${ev.pts} Punkte</b>`:"",ev.sun?`<b style="color:var(--amber)">${ev.sun}× Sonnenschein</b>`:"",ev.tea?`<b style="color:var(--lime)">1 Kräutertee</b>`:""].filter(Boolean).join(" · ");
  } else if(ev.kind==="schildkroete"){
    art=`<g class="sail-in"><g transform="translate(266 150) scale(.8)"><ellipse cx="0" cy="0" rx="18" ry="11" fill="#5FA864"/><path d="M-10 -4h20M-6 -9l-3 9M6 -9l3 9" stroke="#3E7A44" stroke-width="1.4"/><circle cx="22" cy="-2" r="5" fill="#7FC57A"/><circle cx="24" cy="-3" r="1" fill="#14151F"/><ellipse cx="-14" cy="9" rx="5" ry="2.4" fill="#7FC57A"/><ellipse cx="12" cy="9" rx="5" ry="2.4" fill="#7FC57A"/></g></g>
      <g class="pop fb" style="animation-delay:2.6s">${[0,1,2].map(i=>`<ellipse cx="${238+i*7}" cy="153" rx="3" ry="4" fill="#F3F1EA"/>`).join("")}</g>`;
    head="Besuch von einer Meeresschildkröte"; text="Sie hat am Strand Eier gelegt. Ein gutes Zeichen: Hier ist es ruhig und sicher.";
    gain=`<b style="color:var(--lime)">+4 % Glück</b> · <b style="color:var(--lilac)">+20 Punkte</b>`;
  } else if(ev.kind==="sternschnuppe"){
    art=[0,1,2,3].map(i=>`<g class="shoot" style="animation-delay:${i*.7}s"><path d="M${60+i*50} ${20+i*8}l-34 18" stroke="#F3F1EA" stroke-width="2" stroke-linecap="round" opacity=".8"/><circle cx="${60+i*50}" cy="${20+i*8}" r="2.4" fill="#FFE7A3"/></g>`).join("");
    head="Sternschnuppenregen!"; text="Die ganze Insel hat sich etwas gewünscht, und alle packen beim nächsten Projekt mit an.";
    gain=`<b style="color:var(--lilac)">+2 h Baumaterial</b>`;
  } else {
    art=Array.from({length:14},(_,i)=>`<circle class="glow firefly" style="animation-delay:${(i*.29)%2}s" cx="${40+(i*53)%300}" cy="${50+(i*37)%90}" r="2" fill="#E8FF8A"/>`).join("");
    head="Glühwürmchen-Nacht"; text="Heute Abend leuchtet die ganze Insel. Alle sitzen draußen und staunen, ganz ohne Bildschirm.";
    gain=`<b style="color:var(--lime)">+3 % Glück</b>`;
  }
  sheet(`<div class="anim">${base(watch+art,false)}</div>
    <p class="label" style="color:var(--amber)">Überraschung</p><h2>${head}</h2><p class="muted">${text}</p><p>${gain}</p>
    <button class="btn" data-ok>Toll!</button>`);
}
function monthName(m){const [y,mo]=m.split("-").map(Number);return new Date(y,mo-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"})}
function makeCapsule(m){
  const ds=S.days.filter(d=>d.day.startsWith(m));
  const saved=ds.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0);
  const good=ds.filter(d=>d.min<=S.budget).length;
  const ch=S.chronicle.filter(c=>c.day&&c.day.startsWith(m));
  const moved=ch.filter(c=>/eingezogen/.test(c.text)).length, born=ch.filter(c=>/geboren/.test(c.text)).length;
  const built=S.builtLog.filter(b=>b.day.startsWith(m)).map(b=>(projById(b.id)||{}).name);
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
/* Vorhaben: gewonnene Zeit für etwas Echtes nutzen */
function planOpts(){return PLANS}   // immer alle Vorhaben zur Auswahl
function planAskSheet(ev){
  if(ev.day!==S.lastDay) return showPending();
  const forDay=addDays(ev.day,1), cur=S.plan&&S.plan.day===forDay?S.plan.id:null;
  const wishPl=S.wish&&S.wish.type==="plan"?S.wish.plan:null, wr=wishPl&&S.residents.find(x=>x.id===S.wish.rid);
  sheet(`<p class="label" style="color:var(--lime)">Vorhaben für morgen · freiwillig</p>
    <h2>${ev.good?"Was machst du morgen mit der gewonnenen Zeit?":"Was machst du morgen statt Handy?"}</h2>
    <div class="plan-opts">${planOpts().map(p=>`<button type="button" class="plan-opt${p.id===cur?" on":""}" data-plan="${p.id}" aria-pressed="${p.id===cur}">${planIcon(p)}<span>${esc(p.n)}</span>${wishPl===p.id?`<em class="plan-wish">Wunsch</em>`:""}</button>`).join("")}
      <button type="button" class="plan-opt" data-plan="" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"/></svg><span>Entscheide ich spontan</span></button></div>
    ${wr?`<p class="small" style="color:var(--lilac)">${esc(wr.name)} wünscht sich: ${esc((PLANS.find(x=>x.id===wishPl)||{}).n||"")}</p>`:""}
    <p class="small muted" id="planNote">${cur?"Vorgemerkt für morgen.":"Morgen Abend fragt die Insel nach. Geschafft: +20 Punkte, +2 % Glück, und ein Bewohner macht mit."}</p>
    <button class="btn" data-ok id="planGo">${cur?"Vormerken":"Weiter"}</button>`);
  bindPlanPick(ev);
  $("#planGo").addEventListener("click",()=>stat(S.plan&&S.plan.day===forDay?"vorhaben_gewaehlt":"vorhaben_ohne"));
}
function bindPlanPick(ev){
  const forDay=addDays(ev.day,1);
  document.querySelectorAll("#modalRoot [data-plan]").forEach(b=>b.onclick=()=>{
    const free=!b.dataset.plan, off=!free&&S.plan&&S.plan.day===forDay&&S.plan.id===b.dataset.plan;
    S.plan=free||off?null:{id:b.dataset.plan,day:forDay};
    document.querySelectorAll("#modalRoot [data-plan]").forEach(x=>{const on=!off&&x===b;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)});
    const p=PLANS.find(x=>x.id===b.dataset.plan), n=$("#planNote");
    if(n) n.textContent=free?"Kein festes Vorhaben, ganz spontan. Auch gut!":off?"Kein Vorhaben gewählt.":"Vorgemerkt: "+p.n+" für morgen. Morgen Abend fragt die Insel nach.";
    const g=$("#planGo"); if(g) g.textContent=free||off?"Weiter":"Vormerken";
    save();
  });
}
function planResult(ok,id,day){
  const p=PLANS.find(x=>x.id===id); if(!p) return null;
  S.planLog.push({day,id,ok}); if(S.planLog.length>300) S.planLog.shift(); stat(ok?"vorhaben_ok":"vorhaben_nein");
  if(!ok){log("Vorhaben „"+p.n+"“ hat diesmal nicht geklappt. Morgen ist ein neuer Versuch.","info"); return null}
  S.points+=20; S.glueck=clamp(S.glueck+2,0,100); S.actTotals[id]=(S.actTotals[id]||0)+1;
  if(S.wish&&S.wish.type==="plan"&&S.wish.plan===id) fulfillWish();
  const ad=adults(), r=ad.length?pick(ad):null;
  if(r){r.planWith={id,dc:S.dayCount}; chron([r.id],r.name+" hat heute auch "+p.pp+", genau wie du.")}
  log("Echtes Leben: "+p.pp.charAt(0).toUpperCase()+p.pp.slice(1)+". +20 Punkte, +2 % Glück.","good");
  return r;
}
function planDoneSheet(p,r){
  const bub=`<g class="pop fb" style="animation-delay:.5s"><circle cx="250" cy="84" r="16" fill="#26233D" stroke="#C8F169" stroke-width="2"/><g transform="translate(240 74) scale(.84)" fill="none" stroke="#C8F169" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p.ic}</g></g>`;
  sheet(`<div class="anim">${base((r?`<g class="bob">${figure(r,236,134)}</g>`:"")+bub+confetti(),false)}</div>
    <p class="label" style="color:var(--lime)">Vorhaben geschafft</p><h2>${esc(p.pp.charAt(0).toUpperCase()+p.pp.slice(1))}!</h2>
    <p class="muted">Genau dafür ist die gewonnene Zeit da.${r?" "+esc(r.name)+" hat es dir gleich nachgemacht.":""}</p>
    <p><b style="color:var(--lilac)">+20 Punkte</b> · <b style="color:var(--lime)">+2 % Glück</b></p>
    <button class="btn" data-ok>Schön</button>`);
}
function planCard(){
  const pl=S.plan; if(!pl||pl.res||pl.day>today()) return "";   // morgen steht nur kurz in der Hauptkarte
  const p=PLANS.find(x=>x.id===pl.id); if(!p) return "";
  const now=pl.day<=today();
  return `<div class="card plan-card"><p class="label" style="color:var(--lime)">Dein Vorhaben</p>
    <div class="row"><span class="plan-ic">${planIcon(p)}</span><div class="grow"><p><b>${now?"Heute":"Morgen"}: ${esc(p.n)}</b></p><p class="small muted">${now?"Geschafft? Dann gibt es +20 Punkte und +2 % Glück.":"Die gewonnene Zeit von heute wartet schon darauf."}</p></div></div>
    ${now?`<button class="btn secondary" id="planDone">Geschafft</button>`:""}</div>`;
}
/* Wochenrückblick „Deine Inselwoche“ */
function weekData(wk){
  const ds=S.days.filter(d=>isoWeek(d.day)===wk); if(!ds.length) return null;
  const first=ds[0].day, mon=addDays(first,-((parse(first).getDay()+6)%7)), pwk=isoWeek(addDays(mon,-1));
  const pds=S.days.filter(d=>isoWeek(d.day)===pwk);
  const sum=a=>a.reduce((x,d)=>x+d.min,0);
  const best=ds.reduce((a,d)=>d.min<a.min?d:a,ds[0]);
  const inWk=d=>d&&d>=mon&&d<=addDays(mon,6);
  return {wk,mon,ds,good:ds.filter(d=>d.min<=S.budget).length,saved:ds.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0),
    best,avg:sum(ds)/ds.length,pavg:pds.length?sum(pds)/pds.length:null,pts:ds.reduce((a,d)=>a+(d.pts||0),0),
    events:S.chronicle.filter(c=>inWk(c.day)).map(c=>c.text).slice(-4),
    plans:S.planLog.filter(x=>x.ok&&inWk(x.day)).length,
    focus:(S.focusLog||[]).filter(f=>inWk(f.day)).reduce((a,f)=>a+f.min,0)};
}
function weekBars(w){
  const W=280,H=96, days=Array.from({length:7},(_,i)=>addDays(w.mon,i)), max=Math.max(S.budget*1.4,...w.ds.map(d=>d.min)), bw=28;
  const y=v=>H-v/max*H;
  return `<svg viewBox="0 0 ${W} ${H+18}" style="width:100%;height:auto" role="img" aria-label="Bildschirmzeit pro Tag">${days.map((dd,i)=>{const d=w.ds.find(x=>x.day===dd), x=10+i*39;
    return (d?`<rect x="${x}" y="${y(d.min)}" width="${bw}" height="${H-y(d.min)}" rx="6" fill="${d.min<=S.budget?"#C8F169":"#FF9C7A"}"/>`:`<rect x="${x}" y="${H-4}" width="${bw}" height="4" rx="2" fill="#3A3D58"/>`)
      +`<text x="${x+bw/2}" y="${H+14}" text-anchor="middle" font-size="11" fill="#9EA3B8" font-family="Manrope, sans-serif">${["Mo","Di","Mi","Do","Fr","Sa","So"][i]}</text>`}).join("")}
    <path d="M4 ${y(S.budget)}H${W-4}" stroke="#B6A4FF" stroke-width="1.5" stroke-dasharray="5 4"/></svg>`;
}
function weekSheet(wk){
  stat("rueckblick");
  const w=weekData(wk); if(!w) return showPending();
  const eq=equivTop(w.saved), kw=+wk.split("-W")[1], end=addDays(w.mon,6);
  const sameM=parse(w.mon).getMonth()===parse(end).getMonth(), range=(sameM?parse(w.mon).getDate()+".":parse(w.mon).toLocaleDateString("de-DE",{day:"numeric",month:"short"}))+" – "+parse(end).toLocaleDateString("de-DE",{day:"numeric",month:sameM?"long":"short"});
  const dAvg=w.pavg==null?null:Math.round(w.pavg-w.avg);
  const wd=parse(w.best.day).toLocaleDateString("de-DE",{weekday:"long"});
  const shareTxt="Meine OffLand-Woche: "+w.good+" von "+w.ds.length+" Tagen im Budget"+(w.saved?", "+hm(w.saved)+" weniger am Handy":"")+". 🌴";
  const slides=[
    `<p class="label" style="color:var(--lime)">Deine Inselwoche · KW ${kw}</p><p class="small muted">${range}</p>
     <p class="big num" style="color:var(--lime)">${w.saved?"+"+hm(w.saved):"0 min"}</p>
     <p>${w.saved?"weniger am Handy als in deinem alten Schnitt.":"Diese Woche lag noch über deinem alten Schnitt. Die nächste wird besser!"}</p>
     ${eq.length?`<p class="muted">Das reicht für ${esc(eqText(eq))}.</p>`:""}`,
    `<p class="label">Tage im Budget</p><p class="big num">${w.good} <span style="font-size:20px" class="muted">von ${w.ds.length}</span></p>${weekBars(w)}
     <p class="small muted">Die gestrichelte Linie ist dein Budget von ${hm(S.budget)}.</p>`,
    `<p class="label">Dein bester Tag</p><p class="big num" style="color:var(--lime);text-transform:capitalize">${esc(wd)}</p><p>Nur <b>${hm(w.best.min)}</b> am Handy.</p>
     <p class="label" style="margin-top:10px">Im Vergleich zur Vorwoche</p>
     <p>${dAvg==null?"Das ist deine erste Woche. Ab nächster Woche siehst du hier den Vergleich.":dAvg>0?`Im Schnitt <b style="color:var(--lime)">${hm(dAvg)} weniger</b> pro Tag als letzte Woche.`:dAvg<0?`Im Schnitt <b style="color:var(--coral)">${hm(-dAvg)} mehr</b> pro Tag als letzte Woche. Nächste Woche holst du das wieder rein.`:"Genau so viel wie letzte Woche."}</p>`,
    `<p class="label">Auf deiner Insel</p>
     <div class="wr-facts"><div><b class="num" style="color:var(--lilac)">+${w.pts}</b><span class="small muted">Punkte</span></div><div><b class="num" style="color:var(--lime)">${S.glueck} %</b><span class="small muted">Inselglück</span></div>
     <div><b class="num">${w.plans}</b><span class="small muted">${w.plans===1?"Vorhaben":"Vorhaben"} geschafft</span></div><div><b class="num">${hm(w.focus)}</b><span class="small muted">Fokuszeit</span></div></div>
     ${w.events.length?`<ul class="wr-ev">${w.events.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>`:`<p class="small muted">Eine ruhige Woche auf der Insel.</p>`}`,
    `<p class="label" style="color:var(--lime)">Teil deine Woche</p><div class="wr-share"><p class="small muted">KW ${kw}</p><p class="big num" style="color:var(--lime)">${w.good}/${w.ds.length}</p><p>Tage im Budget${w.saved?`, <b>${hm(w.saved)}</b> weniger am Handy`:""}</p></div>
     <button class="btn secondary" id="wrShare">Teilen</button>`];
  sheet(`<div class="wr" id="wr">${slides.map(x=>`<section class="wr-s">${x}</section>`).join("")}</div>
    <div class="wr-dots" aria-hidden="true">${slides.map((_,i)=>`<i${i?"":" class=\"on\""}></i>`).join("")}</div>
    <div class="row"><button class="btn ghost grow" id="wrClose">Schließen</button><button class="btn grow" id="wrNext">Weiter</button></div>`);
  const box=$("#wr"), dots=[...document.querySelectorAll(".wr-dots i")], idx=()=>Math.round(box.scrollLeft/box.clientWidth);
  const upd=()=>{const i=idx();dots.forEach((d,k)=>d.classList.toggle("on",k===i));$("#wrNext").textContent=i>=slides.length-1?"Fertig":"Weiter"};
  box.onscroll=upd;
  const done=()=>{closeModal();render();showPending()};
  $("#wrNext").onclick=()=>{const i=idx(); if(i>=slides.length-1) return done(); box.scrollTo({left:(i+1)*box.clientWidth,behavior:"smooth"})};
  $("#wrClose").onclick=done;
  $("#wrShare").onclick=()=>shareText(shareTxt,inviteLink());
}
/* Fokuszeit: Wochenzeile auf der Karte und Statistik im Tab Zeit */
function focusWeek(){const wk=isoWeek(today());return (S.focusLog||[]).filter(f=>isoWeek(f.day)===wk)}
function focusWeekLine(){const w=focusWeek(); if(!w.length) return "";
  return `<p class="small" style="color:var(--lime);font-weight:700">Diese Woche: ${hm(w.reduce((a,f)=>a+f.min,0))} Fokuszeit${w.some(f=>f.done)?" · "+w.filter(f=>f.done).length+" Vorhaben geschafft":""}</p>`}
function focusStatsCard(){
  const log=S.focusLog||[]; if(!log.length) return S.focusMin?`<div class="card"><p class="label">Fokuszeit</p><p class="num" style="font-size:26px;font-weight:800">${hm(S.focusMin)}</p><p class="small muted">Insgesamt mit der Fokus-Bootsfahrt. Wähl beim nächsten Mal, wofür du sie nutzt, dann siehst du hier, wie viel du gelernt und geschafft hast.</p></div>`:"";
  const w=focusWeek(), sumBy=l=>FOCUS_CATS.map(([id,n])=>[n,l.filter(f=>f.cat===id).reduce((a,f)=>a+f.min,0)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
  const all=sumBy(log), max=Math.max(1,...all.map(x=>x[1]));
  return `<div class="card"><div class="row between"><p class="label">Fokuszeit</p><span class="small muted">insgesamt ${hm(S.focusMin)}</span></div>
    <div class="row between"><span>Diese Woche</span><b class="num" style="color:var(--lime)">${hm(w.reduce((a,f)=>a+f.min,0))}</b></div>
    ${all.map(([n,m])=>`<div><div class="row between small"><span>${n}</span><b class="num">${hm(m)}</b></div><div class="bar"><i style="width:${m/max*100}%"></i></div></div>`).join("")}
    ${log.some(f=>f.task)?`<p class="small" style="font-weight:700;margin-top:4px">Zuletzt</p>${log.filter(f=>f.task).slice(0,5).map(f=>`<div class="row between small"><span>${f.done?"✓ ":""}${esc(f.task)}</span><span class="muted">${f.min} min · ${dayLabel(f.day)}</span></div>`).join("")}`:""}
  </div>`;
}
/* Fokuszeit: wofür die Bootsfahrt genutzt wird */
const FOCUS_CATS=[["lernen","Lernen","lernst"],["aufgaben","Aufgaben erledigen","erledigst Aufgaben"],["lesen","Lesen","liest"],["kreativ","Kreativ sein","bist kreativ"],["sport","Sport","machst Sport"],["haushalt","Haushalt","kümmerst dich um den Haushalt"],["ruhe","Abschalten","schaltest ab"]];
const focusCat=id=>FOCUS_CATS.find(c=>c[0]===id)||FOCUS_CATS[0];
const FOCUS_TIPS=["Leg das Handy außer Reichweite, am besten in einen anderen Raum.","Schalte Mitteilungen aus oder stell das Handy auf Nicht stören.","Stell dir vorher Wasser und alles, was du brauchst, bereit.","Nimm dir eine konkrete Sache vor, nicht „alles ein bisschen“.","Nach der Fahrt kurz aufstehen und strecken, dann die nächste."];
let focusDraft={cat:null,task:"",dur:25};
function focusSheet(dur){
  const last=(S.focusLog||[])[0];
  focusDraft={cat:focusDraft.cat||(last&&last.cat)||"lernen",task:"",dur:dur||focusDraft.dur||25};
  const tip=FOCUS_TIPS[Math.floor(Math.random()*FOCUS_TIPS.length)];
  const draw=()=>{
    const d=focusDraft;
    modal(`<p class="label" style="color:var(--lime)">Fokus-Bootsfahrt</p><h2>Wofür nutzt du die Zeit?</h2>
      <div class="sw-row" role="radiogroup" aria-label="Wofür" style="flex-wrap:wrap;gap:8px">${FOCUS_CATS.map(([id,n])=>`<button type="button" class="chip ${d.cat===id?"good":""}" style="padding:10px 14px;font-size:14px;border:1.5px solid ${d.cat===id?"var(--lime)":"var(--line)"};background:${d.cat===id?"#26331F":"transparent"};color:var(--ink)" data-fcat="${id}" aria-pressed="${d.cat===id}">${n}</button>`).join("")}</div>
      <label class="field" for="fTask">Was genau? <span class="muted" style="font-weight:500">(freiwillig)</span><input id="fTask" type="text" maxlength="60" value="${esc(d.task)}" placeholder="${d.cat==="lernen"?"z. B. Vokabeln Kapitel 3":d.cat==="aufgaben"?"z. B. Bewerbung fertig schreiben":d.cat==="lesen"?"z. B. 30 Seiten im Buch":"z. B. eine Sache, die du schaffen willst"}"></label>
      <p class="small" style="font-weight:700;margin-bottom:-4px">Wie lange?</p>
      <div class="row" style="flex-wrap:wrap">${[15,25,45,60,90].map(m=>`<button type="button" class="btn ${d.dur===m?"":"secondary"}" style="flex:1 1 52px;padding:0" data-fdur="${m}">${m} min</button>`).join("")}</div>
      <p class="small muted">${d.dur<=15?"Kurz und knackig, gut zum Reinkommen.":d.dur===25?"25 Minuten sind ein klassischer Fokus-Block. Danach 5 Minuten Pause.":d.dur===45?"Ein langer Block, gut für Lernstoff oder eine größere Aufgabe.":"Lange Fahrt: Plan eine kurze Pause zur Hälfte ein, aber ohne Handy."} Tipp: ${tip}</p>
      <button class="btn" id="fGo">Losfahren</button><button class="btn ghost" id="fNo">Abbrechen</button>`);
    document.querySelectorAll("[data-fcat]").forEach(b=>b.onclick=()=>{focusDraft.task=$("#fTask").value;focusDraft.cat=b.dataset.fcat;draw()});
    document.querySelectorAll("[data-fdur]").forEach(b=>b.onclick=()=>{focusDraft.task=$("#fTask").value;focusDraft.dur=+b.dataset.fdur;draw()});
    $("#fNo").onclick=closeModal;
    $("#fGo").onclick=()=>{const t=$("#fTask").value.trim().slice(0,60);closeModal();startBoat(focusDraft.dur,focusDraft.cat,t)};
  };
  draw();
}
/* Wecker am Ende der Fokusfahrt: in der App ein Klingelton, in der iPhone-App zusätzlich
   eine Mitteilung mit Ton, die auch bei gesperrtem Handy kommt */
const FA=(()=>{try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.registerPlugin?C.registerPlugin("FocusAlarm"):null}catch(e){return null}})();
function alarmSchedule(b){
  if(!FA||S.alarm===false) return;
  const sec=Math.max(1,Math.round((b.start+b.dur*60000-Date.now())/1000));
  FA.schedule({seconds:sec,title:"Das Boot ist zurück",body:b.dur+" Minuten Fokus"+(b.task?" für „"+b.task+"“":"")+" sind um. Komm zurück auf deine Insel!"}).catch(()=>{});
}
function alarmCancel(){if(FA) FA.cancel().catch(()=>{})}
function ringAlarm(){
  if(S.alarm===false) return;
  const keep=S.sound; S.sound=true; const ac=audio(); S.sound=keep;
  if(ac) for(let r=0;r<3;r++){const t=r*1.1;[1047,1319,1568,2093].forEach((f,i)=>tone(ac,f,t+i*.12,.35,{type:"triangle",vol:.16}))}
  try{if(navigator.vibrate) navigator.vibrate([300,150,300,150,300])}catch(e){}
}
function startBoat(dur,cat,task){
  const crew=adults().find(r=>r.job==="fischer")||pick(adults())||null;
  stat("boot"); S.boat={start:Date.now(),dur,crew:crew?crew.id:null,left:0,cat:cat||"ruhe",task:task||""}; save();
  if(S.alarm!==false){const keep=S.sound;S.sound=true;audio();S.sound=keep}   // Ton jetzt freischalten, solange getippt wurde
  alarmSchedule(S.boat);
  const el=document.documentElement;
  if(el.requestFullscreen&&!document.fullscreenElement) el.requestFullscreen().catch(()=>{});
  render();
}
function boatLeft(){if(!S.boat)return 0;return Math.max(0,S.boat.start+S.boat.dur*60000-Date.now())}
function finishBoat(){
  if(!S.boat) return;
  const b=S.boat; S.boat=null;
  const late=Date.now()-(b.start+b.dur*60000)>5000;          // in der iPhone-App hat dann schon die Mitteilung geklingelt
  if(!document.hidden&&!(FA&&late)) ringAlarm();
  alarmCancel();
  S.pending.push({type:"boat",dur:b.dur,crew:b.crew,left:b.left||0,cat:b.cat||null,task:b.task||""});
  save(); render(); showPending();
}
function boatHonest(ok,dur,crewId,cat,task,done){
  if(ok){
    S.focusLog=[{day:today(),at:Date.now(),cat:cat||"ruhe",task:task||"",min:dur,done:!!done}].concat(S.focusLog||[]).slice(0,300);
    if(done){S.points+=Math.round(dur/5);S.glueck=clamp(S.glueck+2,0,100)}const fish=Math.max(1,Math.round(dur/10))*(has("floss")?2:1)*(has("a_eisfischen")?2:1), pts=Math.round(dur*(owns("angel")?1.2:1)*(has("f_wikinger")?1.2:1));S.fish+=fish;S.points+=pts;S.material+=dur;S.focusMin+=dur;
    log("Fokus-Bootsfahrt: "+dur+" Minuten "+(cat?focusCat(cat)[1]:"ohne Handy")+(task?" ("+task+")":"")+". "+fish+" Fische, +"+(pts+(done?Math.round(dur/5):0))+" Punkte"+(done?", Vorhaben geschafft!":"."),"good");
    if(S.wish&&S.wish.type==="boot"&&dur>=S.wish.need) fulfillWish()}
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
      <p class="label" style="color:#F3F1EA;opacity:.8">${S.boat.cat?esc(focusCat(S.boat.cat)[1]):"Fokus-Bootsfahrt"} · ${S.boat.dur} min</p>
      <p class="focus-time num" id="boatTime" aria-live="off">--:--</p>
      ${S.boat.task?`<p class="focus-msg" style="font-weight:800;font-size:19px">${esc(S.boat.task)}</p>`:""}
      <p class="focus-msg">${S.boat.cat&&S.boat.cat!=="ruhe"?"Du "+focusCat(S.boat.cat)[2]+", "+(crew?esc(crew.name)+" fischt solange.":"das Boot fischt solange."):(crew?esc(crew.name)+" ist draußen beim Fischen.":"Das Boot ist draußen.")} Leg das Handy weg, bis das Boot zurück ist.</p>
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
    $("#stopYes").onclick=()=>{S.boat=null;alarmCancel();log("Bootsfahrt abgebrochen.","info");save();closeModal();render()};
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
function goodNight(){stat("nacht");S.night={after:S.lastDay,at:Date.now()};log("Gute Nacht, Insel. Das Handy ruht bis morgen.","info");
  if(S.wish&&S.wish.type==="nacht"){fulfillWish();save();render();showPending();return}
  save();render();toast("Gute Nacht! Morgen gibt es Traumpunkte.")}
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
  if(r.planWith&&S.dayCount-r.planWith.dc<=1){const p=PLANS.find(x=>x.id===r.planWith.id); if(p) return ["Ich hab heute auch "+p.pp+", genau wie du. Das war richtig schön!"]}
  if(r.phone) return ["Hm? Ja. Gleich. Nur noch ein Video.","Ich scroll nur kurz. Seit drei Stunden.","Hast du was gesagt? Ich hatte Kopfhörer drin. Glaub ich.","Draußen? Ich seh das Meer doch. Auf meinem Hintergrundbild."];
  if(r.sick) return [`Hatschi! Ich hab ${r.sick.kind} und lieg heute flach.`,"Ein Kräutertee wäre jetzt schön …","Wenn die Insel wieder fröhlicher ist, geht's mir bestimmt bald besser."];
  const lost=S.memorials.find(m=>{const d=S.residents.find(x=>x.id===m.rid);return d&&(r.widowOf===m.rid||(r.parents||[]).includes(m.rid)||(d.parents||[]).includes(r.id))});
  if(lost) L.push(`Ich denke oft an ${lost.name}. Am Erinnerungsbaum ist es so schön ruhig.`);
  if(!r.job) {L.push("Spielst du heute mit uns? Aber ohne Handy!","Ich will später "+pick(JOBS).n+" werden!");return L}
  if(S.wish&&S.wish.rid===r.id) L.push(wishTalk(S.wish));
  if(r.retired) L.push(pick(["Früher, als hier noch keine Hütte stand, saßen wir abends nur am Wasser. Ganz ohne Bildschirme.","Ich erzähl euch vom Winter, in dem der Strom ausfiel und alle zusammen Karten gespielt haben.","In meinem Alter weiß man: Die Zeit am Handy holt keiner zurück."]));
  if(S.monsters.length){const a=S.apps.find(x=>x.id===S.monsters[0]);if(a) L.push(`Hast du ${monName(a)} gesehen? Die hat alle Fische verscheucht!`)}
  if(S.conflict&&(S.conflict.a===r.id||S.conflict.b===r.id)){const o=S.residents.find(x=>x.id===(S.conflict.a===r.id?S.conflict.b:S.conflict.a));if(o) L.push(`Mit ${o.name} rede ich gerade nicht.`)}
  if(S.repair) L.push("Wenn du heute im Budget bleibst, wird alles wieder gut.");
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
  const priority=ppl.filter(r=>(r.planWith&&S.dayCount-r.planWith.dc<=1)||r.sad||(S.wish&&S.wish.rid===r.id)||(S.conflict&&(S.conflict.a===r.id||S.conflict.b===r.id)));
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
  appMin=appMin||{}; ENTRY_OPEN=false;
  const day=nextDay();
  const diff=S.budget-min;
  const prevLast=S.lastDay;
  // Vorhaben für diesen Tag: abends nachfragen (vor der Tagesbilanz); verpasste verfallen ohne Strafe
  if(S.plan&&S.plan.day<=day){ if(S.plan.day===day&&!S.plan.res) S.pending.push({type:"plan",id:S.plan.id,day}); S.plan=null; }
  // App-Monster: Apps über ihrem eigenen Limit
  const monsters=S.apps.filter(a=>(appMin[a.id]||0)>a.limit).map(a=>a.id);
  let delta, sunny=false;
  if(diff>=0){
    delta=6+Math.min(6,Math.floor(diff/15));
    if(jobOn("musiker")) delta+=1;
    if(owns("blumen")) delta+=(jobOn("gaertner")?2:1)+(owns("bienen")?1:0);
    if(owns("schaukel")&&here().some(r=>r.kind==="mensch"&&r.parents&&!r.job)) delta+=1;
    if(has("beachclub")) delta+=1;
    if(has("t_wasserfall")) delta+=1; if(has("o_sternzelt")) delta+=1; if(has("a_polarwarte")) delta+=2;
    if(owns("glocke")) delta+=2;
  } else {
    delta=-(8+Math.min(12,Math.floor(-diff/15)));
    if(S.sun>0){S.sun--;delta=Math.round(delta/2);sunny=true}
    if(owns("regenbogen")) delta+=2;
  }
  if(diff>=0) delta+=3;
  delta-=Math.min(4,monsters.length*2);
  // Schlechten Tag reparieren
  let repaired=0;
  if(S.repair){ if(diff>=0){repaired=S.repair.amount;delta+=repaired} S.repair=null; }
  const before=S.glueck;
  S.glueck=clamp(S.glueck+delta,0,100);
  if(diff<0) S.repair={amount:Math.max(2,Math.round((before-S.glueck)/2))};
  const saved=Math.max(0,S.baseline-min);
  S.material+=saved;
  // Punkte: jede Minute unter Budget, Berufe
  let pts=Math.round(Math.max(0,Math.min(240,diff))/3);
  if(diff>=0){ pts+=10; if(owns("haengematte")) pts+=5; if(jobOn("fischer")&&!monsters.length) pts+=5; if(jobOn("baecker")) pts+=5; if(owns("garten")) pts+=5; if(has("beachclub")) pts+=10; if(has("t_mango")) pts+=10; if(has("a_schlitten")) pts+=5; }
  pts+=here().filter(r=>r.wishDone||(r.happyUntil||0)>S.dayCount).length*3;
  // Gute-Nacht-Ritual vom Vorabend
  const dreamt=!!(S.night&&S.night.after===prevLast&&prevLast);
  if(dreamt) pts+=15;
  if(plusActive()) pts=Math.round(pts*1.1);
  S.points+=pts;
  S.monsters=monsters;
  S.days.push({day,min,quests,glueck:S.glueck,sunny,pts,apps:appMin,monsters,by:MY_ID||null});
  statsActive(); stat("tag"); stat(diff>=0?"tag_gut":"tag_schlecht"); if([1,3,7,14,30,60,100].includes(S.days.length)) stat("tage_"+S.days.length);
  S.lastDay=day; S.dayCount++;
  unlockCheck();
  // Joker: einmal pro Woche bricht ein schlechter Tag die Serie nicht
  // Joker möglich? Dann fragt die Insel gleich nach (vor der Tagesbilanz)
  if(diff<0&&S.budgetStreak>=1&&S.jokerWk!==isoWeek(day)) S.pending.push({type:"jokerAsk",streak:S.budgetStreak,wk:isoWeek(day),day});
  S.budgetStreak=diff>=0?S.budgetStreak+1:0;
  if(diff>=0) buddyProgress();
  wishProgress(min,quests,diff);
  setTimeout(netSync,800); setTimeout(()=>backupNow(true),1500); setTimeout(famSync,1100);

  log((diff>=0?"Im Budget: ":"Über dem Budget: ")+hm(min)+" Bildschirmzeit. Inselglück "+before+" → "+S.glueck+" %, +"+pts+" Punkte.", diff>=0?"good":"bad");
  if(sunny) log("Dein Sonnenschein hat die Wolken vertrieben. Der Tag hat nur halb so viel Glück gekostet.","info");
  if(repaired) log("Reparatur geschafft: "+repaired+" % Glück vom schlechten Tag zurückgeholt.","good");
  if(dreamt) log("Gute-Nacht-Ritual: +15 Traumpunkte.","good");
  monsters.forEach(id=>{const a=S.apps.find(x=>x.id===id);const n=monName(a);log(n.charAt(0).toUpperCase()+n.slice(1)+" ist aufgetaucht: "+a.name+" lag über "+hm(a.limit)+".","bad")});
  let freed=null, hooked=null;
  const onPhone=here().filter(r=>r.kind==="mensch"&&r.phone);
  if(diff>=0&&onPhone.length){freed=pick(onPhone);freed.phone=false;S.freed=(S.freed||0)+1;log(freed.name+" hat das Handy weggelegt und redet wieder mit allen.","good");chron([freed.id],freed.name+" hat das Handy weggelegt.");if(S.wish&&S.wish.type==="frei") fulfillWish()}
  else if(diff<0){const c=here().filter(r=>r.kind==="mensch"&&!r.phone&&stage(r)!=="baby");if(c.length&&Math.random()<.5){hooked=pick(c);hooked.phone=true;log(hooked.name+" hängt wieder am Handy.","bad")}}
  if(!S.testmode) S.pending.push({type:"day",day,min,before,after:S.glueck,saved,pts,sunny,repaired,dreamt,monsters,joker:0,freed:freed&&freed.name,hooked:hooked&&hooked.name});
  if(!S.testmode) S.pending.push({type:"planAsk",day,good:diff>=0});
  if(!S.testmode&&parse(day).getDay()===0&&S.days.filter(d=>isoWeek(d.day)===isoWeek(day)).length>=2){S.pending.push({type:"week",wk:isoWeek(day)});S.weekReady={wk:isoWeek(day),until:addDays(day,3)}}

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
  if(S.unhappyStreak>=3&&!S.warn){
    // Mindestens eine Person bleibt immer, damit die Insel nie ganz leer wird
    const humans=here().filter(r=>r.kind==="mensch").length;
    const cands=here().filter(r=>familyOf(r).filter(x=>x.kind==="mensch").length<humans); if(cands.length){
      const g=familyOf(pick(cands));
      S.warn={ids:g.map(x=>x.id),deadline:addDays(day,2+(jobOn("aerztin")?1:0)+(owns("brunnen")?1:0)+(has("o_brunnen")?1:0))};
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
    S.unhappyStreak=0;   // nach 3 weiteren unglücklichen Tagen packt die nächste Familie (vorher kam nach dem ersten Wegzug keiner mehr)
  }
  // Rückkehr
  const gone=S.residents.filter(r=>r.status==="weg");
  if(gone.length&&S.glueck>=60){
    gone.forEach(r=>r.ret++);
    const hint=gone.filter(r=>r.ret===3);
    if(hint.length) S.pending.push({type:"postcard",ids:hint.map(x=>x.id),hint:true});
    const back=gone.filter(r=>r.ret>=5);
    if(back.length&&occupied()+back.filter(r=>!isPet(r)).length<=capacity()){
      back.forEach(r=>{r.status="da";r.ret=0});
      log(nameList(back.map(r=>r.name))+vb(back," ist zurückgekommen!"," sind zurückgekommen!"),"good");
      chron(back.map(r=>r.id),nameList(back.map(r=>r.name))+vb(back," ist von der Möweninsel zurückgekehrt."," sind von der Möweninsel zurückgekehrt."));
      S.pending.push({type:"return",ids:back.map(x=>x.id)});
      const ids=new Set(back.map(r=>r.id));
      here().filter(pt=>pt.owner&&ids.has(pt.owner)&&pt.kind==="tier").forEach(pt=>S.pending.push({type:"reunion",pet:pt.id,owner:pt.owner}));
    }
  }

  // Projekt
  const p=curProjects()[S.projectIdx];
  if(p&&S.material>=p.hours*60){
    S.material-=p.hours*60; S.built.push(p.id); stat("projekt"); S.projectIdx++; S.builtLog.push({id:p.id,day});
    chron([],"Großprojekt fertig: "+p.name+".");
    log("Großprojekt fertig: "+p.name+". "+p.text+".","good");
    S.pending.push({type:"project",id:p.id});
  }
  checkDiscovery();
  chapterCheck();
  if(netConfigured()&&statsDev().consent===undefined&&!S.pending.some(e=>e.type==="statsAsk")) S.pending.push({type:"statsAsk"});
  save(); render(); showPending();
}
/* Neue Insel entdeckt, sobald alle Großprojekte der aktuellen Welt stehen */
function checkDiscovery(){
  const w=S.world||0;
  if(w+1>=WORLDS.length||(S.found||0)>w) return;
  if(!curProjects().every(x=>S.built.includes(x.id))) return;
  S.found=w+1; const nw=WORLDS[S.found];
  log("Neue Insel entdeckt: "+nw.name+"! Im Tab Bauen könnt ihr aufbrechen.","good");
  chron([],"Am Horizont wurde eine neue Insel entdeckt: "+nw.name+".");
  S.pending.push({type:"discovery",world:S.found});
}
function travel(){
  if(!((S.found||0)>(S.world||0))) return;
  const from=curWorld(); S.world=(S.world||0)+1; S.projectIdx=0; islandView=0; stat("welt_"+S.world);
  if(S.wish&&(!S.wish.type||S.wish.type==="item")){S.wish=null;S.lastWishEnd=S.dayCount}
  const W=curWorld(); S.points+=100;
  log("Die ganze Inselgemeinschaft ist von "+from.name+" nach "+W.name+" gezogen. +100 Punkte Umzugsgeld.","good");
  chron(here().map(r=>r.id),"Umzug: "+from.name+" → "+W.name+".");
  S.pending.unshift({type:"travel",to:S.world});
  save(); closeModal(); tab="heute"; render(); window.scrollTo(0,0); showPending();
}

/* ---------- Weltkarte mit Reiseroute ---------- */
const MAP_POS=[[46,122],[108,160],[172,56],[236,136],[302,46]];
function worldIcon(i,locked){
  if(locked) return `<circle r="15" fill="#3A3D58"/><text y="5" text-anchor="middle" font-size="15" font-weight="800" fill="#A4A6BD" font-family="Bricolage Grotesque, sans-serif">?</text>`;
  const W=WORLDS[i], T=W.theme||{sand:"#E9D7A6",grass:"#7FC57A",leaf:"#4E9A58"};
  let deco="";
  switch(W.id){
    case "heimat": deco=`<rect x="-5" y="-6" width="3" height="6" fill="#8A5A3B"/><circle cx="-3.5" cy="-9" r="5" fill="#4E9A58"/><path d="M2 -1v-5l4-3 4 3v5z" fill="#F3F1EA"/>`; break;
    case "tropen": deco=`<path d="M0 0q1-7 3-12" stroke="#A0703F" stroke-width="1.6" fill="none"/><path d="M3 -12q-5-2-8 1M3 -12q5-3 8 1M3 -12q-2-5-6-5M3 -12q3-5 7-4" stroke="#3FA35A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; break;
    case "fjord": deco=`<path d="M-6 0l4-11 4 11z" fill="#2F6B45"/><path d="M2 -1v-5l3-3 3 3v5z" fill="#B8442E"/>`; break;
    case "oase": deco=`<path d="M-2 0v-12M-2 -7h-3v-3M-2 -5h3v-4" stroke="#6E8B3D" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M4 -1v-4a3 3 0 0 1 6 0v4z" fill="#D9A86A"/>`; break;
    case "alaska": deco=`<path d="M-7 -1a6 6 0 0 1 12 0z" fill="#F3F6F8" stroke="#A4C4DE" stroke-width=".8"/><path d="M2 -12l3-6 3 6z" fill="#3E6B5A"/><path d="M3 -14l2-4 2 4z" fill="#F3F6F8"/>`; break;
  }
  return `<ellipse cx="0" cy="4" rx="16" ry="5" fill="${T.sand}"/><path d="M-13 4c2-7 7-10 13-10s11 3 13 10z" fill="${T.grass}"/><g transform="translate(0 3)">${deco}</g>`;
}
function worldMapSvg(){
  const w=S.world||0, found=Math.max(S.found||0,w);
  let s=`<svg viewBox="0 0 340 190" class="worldmap" role="img" aria-label="Weltkarte: ${WORLDS.map(x=>x.name).join(", ")}"><defs><linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E5C8A"/><stop offset="1" stop-color="#1E3F6E"/></linearGradient></defs><rect width="340" height="190" rx="16" fill="url(#mapSea)"/>`;
  s+=`<g stroke="#5B7FB0" stroke-width="1" fill="none" opacity=".5">${[30,70,110,150].map(y=>`<path d="M10 ${y}q20-4 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0"/>`).join("")}</g>`;
  for(let i=0;i<MAP_POS.length-1;i++){
    const [x1,y1]=MAP_POS[i],[x2,y2]=MAP_POS[i+1], mx=(x1+x2)/2+(i%2?18:-18), my=(y1+y2)/2+(i%2?-10:10), done=i<w;
    s+=`<path d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${done?"#C8F169":"#F3F1EA"}" stroke-width="${done?3:2}" stroke-dasharray="${done?"0":"5 6"}" opacity="${done?1:i<found?.7:.35}" stroke-linecap="round"/>`;
  }
  WORLDS.forEach((W,i)=>{
    const [x,y]=MAP_POS[i], locked=i>found;
    s+=`<g transform="translate(${x} ${y})">${i===w?`<g class="glow" style="animation-duration:2s"><circle r="22" fill="#C8F169" opacity=".35"/></g>`:""}${worldIcon(i,locked)}
      ${i<w?`<g transform="translate(13 -12)"><circle r="6" fill="#C8F169"/><path d="M-2.6 0l1.8 1.8 3.4-3.6" stroke="#14151F" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`:""}
      <text y="${y>150?-20:26}" text-anchor="middle" font-size="10" font-weight="700" fill="${locked?"#A4A6BD":"#F3F1EA"}" font-family="Manrope, sans-serif">${locked?"???":esc(W.name)}</text></g>`;
  });
  const [sx,sy]=MAP_POS[w];
  s+=`<g transform="translate(${sx-24} ${sy+2})"><g class="bob" style="animation-duration:2s"><path d="M-8 0h16l-3 4h-10z" fill="#FF9C7A"/><path d="M0 0v-11l6 9z" fill="#F3F1EA"/></g></g>`;
  return s+"</svg>";
}
function viewReise(){
  const w=S.world||0, W=curWorld(), next=WORLDS[w+1], built=curProjects().filter(x=>S.built.includes(x.id)).length;
  return `<div class="card"><div class="row between"><p class="label">Weltreise</p><span class="small muted">Welt ${w+1} von ${WORLDS.length}</span></div>
    ${worldMapSvg()}
    <p><b>${esc(W.name)}</b> · <span class="muted">${esc(W.text)}</span></p>
    ${(S.found||0)>w?`<p class="small" style="color:var(--lime);font-weight:700">Neue Insel entdeckt: ${esc(next.name)}!</p><button class="btn" id="travelBtn">Nach ${esc(next.name)} aufbrechen</button><p class="small muted" style="margin-top:-4px">Alle Bewohner und Tiere kommen mit. Gegenstände aus dem Laden bleiben hier, auf der neuen Insel gibt es passende neue.</p>`
      :next?`<div class="bar"><i style="width:${built/curProjects().length*100}%;background:var(--amber)"></i></div><p class="small muted">${built} von ${curProjects().length} Großprojekten hier gebaut. Sind alle fertig, wird eine neue Insel am Horizont entdeckt.</p>`
      :`<p class="small" style="color:var(--lime);font-weight:700">Ihr habt das Ende der Welt erreicht. Was für eine Reise!</p>`}
  </div>`;
}


/* ---------- Insel-Szene ---------- */
/* Aussehen: aus der ID abgeleitet, damit jede:r immer gleich aussieht */
function hsh(t){let h=2166136261;for(const c of String(t||""))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
const SKIN=["#F3D2B8","#E8B48F","#D9A27E","#B07A55","#8A5A3B","#6B4430"];
// Neue Farben nur hinten anhängen: die Zufallsauswahl nutzt die alten Längen, damit Bewohner ihr Aussehen behalten
const HAIR=["#2B2118","#4A3222","#7A4A2A","#B8743A","#E0B867","#C8442E","#1E1E28","#9EA3B8","#E07AB8","#5B8CD6","#5BC0A8"];
const SHIRT=["#B6A4FF","#C8F169","#FFB86B","#5B8CD6","#FF9C7A","#5BC0A8","#E07AB8","#F3F1EA","#E5484D","#3A3D58","#FFD27A","#8A5A3B","#2F7A5A","#9B6BD6","#14151F","#9CC8EE"];
const PANTS=["#3A3D58","#2F4A6E","#5A4636","#4A5A3A"];
function hairSvg(style,c){
  switch(style){
    case 0: return {back:"",front:`<path d="M-5.3 -16.6a5.3 5.5 0 0 1 10.6 0q-2.6-2.2-5.3-1.6t-5.3 1.6z" fill="${c}"/>`};
    case 1: return {back:`<path d="M-5.8 -16.5a5.8 6 0 0 1 11.6 0v7.2q-1.2 .9-2.4 0v-5h-6.8v5q-1.2 .9-2.4 0z" fill="${c}"/>`,front:`<path d="M-5.4 -16.2a5.4 5.6 0 0 1 10.8 0q-3-2.6-6.4-1.2-2.4 1-4.4 1.2z" fill="${c}"/>`};
    case 2: return {back:`<circle cx="0" cy="-22.2" r="2.6" fill="${c}"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-2.6-10.6 0z" fill="${c}"/>`};
    case 3: return {back:`<path d="M4 -18q4.4 1 3.6 6.6q-2.2-1.6-2.4-4.6z" fill="${c}"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-2.6-10.6 0z" fill="${c}"/>`};
    case 4: return {back:"",front:`<g fill="${c}"><circle cx="-4.2" cy="-18.6" r="2.5"/><circle cx="-1.4" cy="-20.6" r="2.6"/><circle cx="1.8" cy="-20.6" r="2.6"/><circle cx="4.4" cy="-18.4" r="2.4"/><circle cx="-5.4" cy="-16.2" r="1.7"/><circle cx="5.5" cy="-16" r="1.7"/></g>`};
    case 5: return {back:"",front:`<path d="M-5.6 -17.2a5.6 4.6 0 0 1 11.2 0z" fill="${c}"/><path d="M-5.6 -17.4h8.8q2.4 0 3.6 1.2h-12.4z" fill="${c}" opacity=".85"/>`};
    case 6: return {back:"",front:`<path d="M-5 -17.6a5 4 0 0 1 10 0q-5-1.2-10 0z" fill="${c}"/>`};
    case 7: return {back:`<path d="M3.2 -21q5.4-1.4 5.2 4.6q-.4 3.6-2.2 5.4q.2-4.6-1.6-6.8z" fill="${c}"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-2.6-10.6 0z" fill="${c}"/><circle cx="4.2" cy="-20.4" r="1" fill="#E5484D"/>`};
    case 8: return {back:`<path d="M-6 -16.6a6 6.2 0 0 1 12 0v4.6q-1.6.6-2.6-.4v-3.6h-6.8v3.6q-1 1-2.6.4z" fill="${c}"/>`,front:`<path d="M-5.6 -16.4a5.6 5.4 0 0 1 11.2 0q-2.8-.4-5.6-2.2q-2.8 1.8-5.6 2.2z" fill="${c}"/>`};
    case 9: return {back:"",front:`<path d="M-1.6 -20.4q-1.4-3.6 1.6-5.6q3 2 1.6 5.6z" fill="${c}"/><path d="M-5 -17.6a5 4 0 0 1 10 0q-5-1-10 0z" fill="${c}" opacity=".45"/>`};
    case 10: return {back:"",front:`<path d="M-3 -19.8q1.6-.8 3.2-.4" stroke="#FFFFFF" stroke-width=".7" fill="none" opacity=".35" stroke-linecap="round"/>`};
    case 11: return {back:`<g stroke="${c}" stroke-width="2.3" stroke-linecap="round" fill="none"><path d="M-4.4 -16.4q-2.4 1.4-2.2 6.4"/><path d="M4.4 -16.4q2.4 1.4 2.2 6.4"/></g><path d="M-6.9 -13.6l1.2.5M-6.8 -11.6l1.2.4M6.9 -13.6l-1.2.5M6.8 -11.6l-1.2.4" stroke="#14151F" stroke-width=".35" opacity=".25"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-2.6-1.6-5.3-1.6t-5.3 1.6z" fill="${c}"/><circle cx="-6.5" cy="-10.6" r=".95" fill="#E07AB8"/><circle cx="6.5" cy="-10.6" r=".95" fill="#E07AB8"/>`};
    case 12: return {back:"",front:`<path d="M-5.4 -16.2a5.4 5.6 0 0 1 10.8 0q-1.6-.6-3.4-2.6q-3 2.2-7.4 2.6z" fill="${c}"/>`};
    default: return {back:"",front:`<path d="M-5 -17.6a5 4 0 0 1 10 0q-5-1.2-10 0z" fill="${c}"/>`};
  }
}
const STYLE_NAMES=["Kurz","Lang","Dutt","Zopf","Locken","Mütze","Stoppeln","Pferdeschwanz","Bob","Iro","Glatze","Zwei Zöpfe","Seitenscheitel"];
/* Extras: Schal, Brille, Sonnenbrille, Bommelmütze, Kappe, Blume, Stirnband */
const ACC_NAMES=["Nichts","Schal","Brille","Sonnenbrille","Bommelmütze","Kappe","Blume","Stirnband"];
/* Mehrere Extras auf einmal: gespeichert als Liste (früher eine einzelne Zahl).
   Brillen schließen sich gegenseitig aus, ebenso alles, was oben auf dem Kopf sitzt. */
const ACC_GROUPS=[[2,3],[4,5,7]];
function accList(a){return (Array.isArray(a)?a:a?[a]:[]).map(Number).filter((v,i,l)=>v>0&&v<ACC_NAMES.length&&l.indexOf(v)===i).sort((x,y)=>x-y).slice(0,ACC_NAMES.length-1)}
function accToggle(a,v){
  if(!v) return [];
  const cur=accList(a); if(cur.includes(v)) return cur.filter(x=>x!==v);
  const g=ACC_GROUPS.find(g=>g.includes(v)); return accList(cur.filter(x=>!(g&&g.includes(x))).concat(v));
}
function accSvg(a,c){
  if(Array.isArray(a)){const p=accList(a).map(x=>accSvg(x,c)); return {body:p.map(x=>x.body).join(""),head:p.map(x=>x.head).join("")}}
  switch(a){
    case 1: return {body:`<path d="M-4.8 -11.8q4.8 2.4 9.6 0l.5 2.1q-5.3 2.6-10.6 0z" fill="${c}"/><path d="M2.2 -10.2l1.8 5.4h-2.6z" fill="${c}"/>`,head:""};
    case 2: return {body:"",head:`<g fill="none" stroke="${c}" stroke-width=".65"><circle cx="-1.9" cy="-15.6" r="1.55"/><circle cx="1.9" cy="-15.6" r="1.55"/><path d="M-.35 -15.7h.7M-3.45 -15.8l-1.5-.4M3.45 -15.8l1.5-.4"/></g>`};
    case 3: return {body:"",head:`<g fill="#14151F" stroke="${c}" stroke-width=".5"><rect x="-3.7" y="-16.8" width="3.1" height="2.2" rx=".9"/><rect x=".6" y="-16.8" width="3.1" height="2.2" rx=".9"/></g><path d="M-.6 -16h1.2M-3.7 -16.2l-1.3-.3M3.7 -16.2l1.3-.3" stroke="${c}" stroke-width=".55"/><path d="M-3 -16.2l.8-.4M1.3 -16.2l.8-.4" stroke="#F3F1EA" stroke-width=".35" opacity=".6"/>`};
    case 4: return {body:"",head:`<path d="M-5.4 -17.4a5.4 5.2 0 0 1 10.8 0z" fill="${c}"/><rect x="-5.9" y="-18.6" width="11.8" height="2.6" rx="1.3" fill="#F3F1EA" opacity=".9"/><circle cx="0" cy="-22.9" r="1.9" fill="#F3F1EA"/>`};
    case 5: return {body:"",head:`<path d="M-5.3 -17.3a5.3 4.8 0 0 1 10.6 0z" fill="${c}"/><path d="M-1.2 -17.6h8.6q.7 1.3-.6 1.5h-8z" fill="${c}"/><circle cx="0" cy="-21.9" r=".6" fill="#14151F" opacity=".4"/>`};
    case 6: return {body:"",head:`<g transform="translate(3.9 -20)">${[0,72,144,216,288].map(d=>`<circle cx="${(1.3*Math.cos(d*Math.PI/180)).toFixed(2)}" cy="${(1.3*Math.sin(d*Math.PI/180)).toFixed(2)}" r="1.05" fill="${c}"/>`).join("")}<circle r=".75" fill="#FFD27A"/></g>`};
    case 7: return {body:"",head:`<path d="M-5.2 -18.4q5.2-2.2 10.4 0v1.8q-5.2-2-10.4 0z" fill="${c}"/>`};
    default: return {body:"",head:""};
  }
}
function lookIdx(r){
  const h=hsh(r.id||r.name), o=r.look||{};
  const pickI=(k,v)=>o[k]!=null?o[k]:v;
  const a=(h>>>18)%14;     // etwa die Hälfte trägt von sich aus ein Extra
  return {skin:pickI("skin",h%SKIN.length),hair:pickI("hair",(h>>>3)%7),style:pickI("style",(h>>>6)%7),shirt:pickI("shirt",(h>>>9)%8),
    acc:pickI("acc",o.skin!=null?0:(a<7?0:a-6)),accC:pickI("accC",(h>>>22)%SHIRT.length)};
}
function looks(r){
  const h=hsh(r.id||r.name), i=lookIdx(r);
  return {skin:SKIN[i.skin],hair:r.retired?"#D9D6CE":HAIR[i.hair]||HAIR[0],style:i.style,
    shirt:SHIRT[i.shirt]||SHIRT[0],pants:PANTS[(h>>>12)%PANTS.length],cap:SHIRT[(h>>>15)%8],acc:accList(i.acc),accC:SHIRT[i.accC]||SHIRT[0]};
}
/* Lebensphase für die Figur: Baby, Kind, erwachsen, Rente */
function stage(r){
  if(r.retired) return "alt";
  if(r.parents&&!r.job){const age=typeof S!=="undefined"&&S?S.dayCount-(r.born||0):5;return age<3?"baby":"kind"}
  return "erw";
}
function figure(r,x,y){
  if(r.kind==="mensch"){
    const L=looks(r), st=stage(r), kid=st==="baby"?0.6:st==="kind"?0.74:1;
    const hair0=hairSvg(L.style,L.style===5?L.cap:L.hair), acc=accSvg(L.acc,L.accC);
    // Mit Mütze oder Kappe: keine Haare über der Krempe (Locken, Dutt, Iro lappen sonst heraus)
    const hat=L.acc.includes(4)||L.acc.includes(5), hcl=hat?`<clipPath id="hatclip"><rect x="-20" y="-17.6" width="40" height="40"/></clipPath>`:"";
    const hair=hat?{back:hcl+(hair0.back&&L.style===2?`<g clip-path="url(#hatclip)">${hair0.back}</g>`:hair0.back),front:hair0.front?`<g clip-path="url(#hatclip)">${hair0.front}</g>`:""}:hair0;
    if(r.sick) return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)} (krank: ${esc(r.sick.kind)})</title><rect x="-9" y="-6" width="18" height="6" rx="2" fill="#8A5A3B"/><rect x="-8" y="-9" width="16" height="5" rx="2" fill="#9CC8EE"/><circle cx="-6" cy="-10" r="4" fill="${L.skin}"/><path d="M-9.6 -11a4 4 0 0 1 6.6-2.6" stroke="${L.hair}" stroke-width="2" fill="none"/><path d="M-7.4 -10.4h1.2M-5 -10.4h1.2" stroke="#14151F" stroke-width=".6"/><circle cx="-8" cy="-9" r="1" fill="#E5484D" opacity=".7"/><text x="2" y="-12" font-size="6" fill="#F3F1EA" font-family="Manrope, sans-serif">z</text></g>`;
    const sad=typeof S!=="undefined"&&S.glueck<40;
    if(st==="baby") return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)} (Baby)</title>
      <ellipse cx="0" cy="-5" rx="5.6" ry="5.4" fill="${L.shirt}"/><path d="M-3.4 -1v1.4M3.4 -1v1.4" stroke="${L.skin}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="0" cy="-14" r="5.4" fill="${L.skin}"/><path d="M-1 -19.2q1-2.4 2.6-1.6q-1.6.2-1.4 1.8" stroke="${L.hair}" stroke-width="1" fill="none" stroke-linecap="round"/>
      <circle cx="-1.9" cy="-14" r=".75" fill="#14151F"/><circle cx="1.9" cy="-14" r=".75" fill="#14151F"/><circle cx="-3.4" cy="-12.4" r="1.1" fill="#FF9C7A" opacity=".4"/><circle cx="3.4" cy="-12.4" r="1.1" fill="#FF9C7A" opacity=".4"/>
      <circle cx="0" cy="-11.4" r="1.4" fill="#9CC8EE"/><circle cx="0" cy="-11.4" r=".6" fill="#F3F1EA"/></g>`;
    const mouth=sad?`<path d="M-1.4 -12.6q1.4-1 2.8 0" stroke="#5A3A2A" stroke-width=".7" fill="none" stroke-linecap="round"/>`:`<path d="M-1.6 -13.3q1.6 1.3 3.2 0" stroke="#5A3A2A" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)}</title>
      <path d="M-2.4 -3.4v3.2M2.4 -3.4v3.2" stroke="${L.pants}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-6 -2.6c0-6 2.4-8.6 6-8.6s6 2.6 6 8.6z" fill="${L.shirt}"/>${acc.body}
      ${st==="kind"?`<g transform="translate(0 -12) scale(1.18) translate(0 12)">`:""}${hair.back}<circle cx="0" cy="-16" r="5" fill="${L.skin}"/>${hair.front}
      <circle cx="-1.8" cy="-15.6" r=".75" fill="#14151F"/><circle cx="1.8" cy="-15.6" r=".75" fill="#14151F"/>
      <circle cx="-3.2" cy="-13.8" r="1" fill="#FF9C7A" opacity=".35"/><circle cx="3.2" cy="-13.8" r="1" fill="#FF9C7A" opacity=".35"/>${mouth}${acc.head}
      ${r.retired?`<path d="M-3.6 -16.4h2.6M1 -16.4h2.6M-1 -16.4h2" stroke="#3A3D58" stroke-width=".5" fill="none"/><circle cx="-1.8" cy="-16" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/><circle cx="1.8" cy="-16" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/>`:""}${st==="kind"?"</g>":""}
      ${st==="alt"?`<path d="M7.4 0v-9.4q0-1.8-1.8-1.8" stroke="#8A5A3B" stroke-width="1.1" fill="none" stroke-linecap="round"/>`:""}${r.phone?PHONE_FIG:""}</g>`;
  }
  const s=(r.parents?0.7:1)*(r.art==="Wal"?1.6:["Elch","Kamel","Eisbär"].includes(r.art)?1.1:1);
  return `<g transform="translate(${x} ${y}) scale(${s})"><title>${esc(r.name)} (${esc(r.art)})</title>${animalSvg(r.art,animalVar(r))}</g>`;
}
/* ---------- Geschichte: Mr. Bay (Bürgermeister) und Lucifer (Inselkatze) ---------- */
const PHONE_FIG=`<circle cx="0" cy="-14.6" r="6.4" fill="#7FB6FF" opacity=".22"/><path d="M-3 -7.6q3 1.6 6 0" stroke="#F0C2A0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9"/><rect x="-1.9" y="-11.2" width="3.8" height="5.8" rx=".9" fill="#2B3350"/><rect x="-1.4" y="-10.6" width="2.8" height="4.4" rx=".5" fill="#9CC8EE"/>`;
function baySvg(anim){
  // Mr. Bay: weißes Hemd mit offenem Kragen, dunkelblaues Sakko mit goldenem Bürgermeister-Anstecker, Locken, kleiner Schnurrbart, schiefes Grinsen
  return `<path d="M-2.4 -3.4v3.4M2.4 -3.4v3.4" stroke="#2C3550" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-6.6 -2.4c0-6.8 2.8-9.4 6.6-9.4s6.6 2.6 6.6 9.4z" fill="#2C3550"/>
    <path d="M-2.7 -11.6L0 -4.2L2.7 -11.6z" fill="#F7F5EF"/><path d="M-1.2 -11.4L0 -9.7L1.2 -11.4" stroke="#D9D4C6" stroke-width=".6" fill="none"/>
    <path d="M-2.7 -11.5L-4 -5.6M2.7 -11.5L4 -5.6" stroke="#47557A" stroke-width=".8"/>
    <circle cx="4.1" cy="-8.2" r=".95" fill="#FFD27A" stroke="#E0A93C" stroke-width=".3"/>
    <circle cx="0" cy="-16" r="5.1" fill="#F0C2A0"/>
    <g fill="#6B4226"><circle cx="-3.6" cy="-18.6" r="2.3"/><circle cx="-1" cy="-20.3" r="2.4"/><circle cx="2" cy="-20.2" r="2.4"/><circle cx="4.2" cy="-18.3" r="2.1"/><path d="M-5.3 -16.4a5.3 5 0 0 1 10.6 0q-5.3-1.4-10.6 0z"/></g>
    <g${anim?' class="blink"':""}><circle cx="-1.8" cy="-15.7" r=".75" fill="#14151F"/><circle cx="1.8" cy="-15.7" r=".75" fill="#14151F"/></g>
    ${anim?`<g class="bay-wave"><path d="M5.4 -9.6L9.2 -15.4" stroke="#2C3550" stroke-width="2.3" stroke-linecap="round"/><circle cx="9.6" cy="-16.3" r="1.3" fill="#F0C2A0"/></g>`:""}
    <circle cx="-3.3" cy="-13.9" r="1" fill="#FF9C7A" opacity=".4"/><circle cx="3.3" cy="-13.9" r="1" fill="#FF9C7A" opacity=".4"/>
    <path d="M-1.9 -13.6q.95-.7 1.9-.15q.95-.55 1.9.15q-.95.35-1.9 0q-.95.35-1.9 0z" fill="#6B4226"/><path d="M-1.1 -12.3q1.3.8 2.6-.6" stroke="#5A3A2A" stroke-width=".65" fill="none" stroke-linecap="round"/>`;
}
function lucSvg(anim){
  return `<path${anim?' class="luc-tail"':""} d="M5.6 -1.4q6.4-.6 5.2-7.2" stroke="#1E1F2B" stroke-width="2.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-5.2" rx="6" ry="5.6" fill="#1E1F2B"/>
    <path d="M-2.7 -9.2q2.7 2 5.4 0q-.5 5.8-2.7 7.8q-2.2-2-2.7-7.8z" fill="#F3F1EA"/>
    <ellipse cx="-2.5" cy="-.7" rx="1.7" ry="1.05" fill="#F3F1EA"/><ellipse cx="2.5" cy="-.7" rx="1.7" ry="1.05" fill="#F3F1EA"/>
    <g${anim?' class="luc-ear"':""}><path d="M-4.3 -15.2l-.7-4.8 3.6 2.5z" fill="#1E1F2B"/></g><path d="M4.3 -15.2l.7-4.8-3.6 2.5z" fill="#1E1F2B"/><path d="M-3.9 -16.2l-.3-2.4 1.6 1.2zM3.9 -16.2l.3-2.4-1.6 1.2z" fill="#E07AB8" opacity=".7"/>
    <circle cx="0" cy="-13" r="4.7" fill="#1E1F2B"/>
    <path d="M-2.3 -11.5q2.3-2.8 4.6 0q-.4 2.1-2.3 2.3q-1.9-.2-2.3-2.3z" fill="#F3F1EA"/>
    <g${anim?' class="blink" style="animation-delay:1.7s"':""}><ellipse cx="-1.8" cy="-13.7" rx="1.05" ry="1.25" fill="#C8F169"/><ellipse cx="1.8" cy="-13.7" rx="1.05" ry="1.25" fill="#C8F169"/>
    <path d="M-1.8 -14.6v1.8M1.8 -14.6v1.8" stroke="#14151F" stroke-width=".55" stroke-linecap="round"/></g>
    <path d="M-.5 -11.9h1l-.5.6z" fill="#E07AB8"/>
    <path d="M-1.4 -11.2l-3.4-.5M-1.4 -10.7l-3.2.5M1.4 -11.2l3.4-.5M1.4 -10.7l3.2.5" stroke="#F3F1EA" stroke-width=".28" opacity=".8"/>`;
}
const bayPic=(s)=>`<svg width="${s}" height="${s}" viewBox="-8.5 -22.5 17 17" aria-hidden="true">${baySvg()}</svg>`;
const lucPic=(s)=>`<svg width="${s}" height="${s}" viewBox="-8 -20.5 16 16" aria-hidden="true">${lucSvg()}</svg>`;
function saysHtml(who,text){
  const bay=who==="bay";
  return `<div class="says ${bay?"bay":"luc"}"><span class="says-pic">${bay?bayPic(46):lucPic(46)}</span><div class="says-bub"><b>${bay?"Mr. Bay":"Lucifer"}</b><p>${esc(text)}</p></div></div>`;
}
/* Was Mr. Bay zu großen Momenten sagt (moderner Humor, nie vorwurfsvoll) */
/* Sprüche ohne Wiederholung: zuletzt benutzte werden übersprungen */
function freshLine(list){
  const seen=S.lineLog||(S.lineLog=[]), keys=list.map(t=>hsh(t)%1e6);
  let pool=list.filter((t,i)=>!seen.includes(keys[i])); if(!pool.length) pool=list;
  const t=pool[Math.floor(Math.random()*pool.length)];
  seen.push(hsh(t)%1e6); if(seen.length>60) seen.splice(0,seen.length-60);
  return t;
}
function bayLine(ev){
  const r=ev.id&&S.residents.find(x=>x.id===ev.id), nm=r?r.name:"";
  const L={
    project:["Okay. Ich bin ganz ruhig. Das ist nur Staub im Auge. Sehr viel Staub.","Ich hab gewusst, dass wir das schaffen. Also, ich hab's sehr fest gehofft.","Das kommt in meine Story. Mit Filter. Und Feuerwerk-Emoji.",
      "Ich hab extra ein Band zum Durchschneiden besorgt. Die Schere hat Lucifer. Wir verhandeln noch.","Gebaut aus lauter Minuten, die nicht ins Handy geflossen sind. Das ist mehr als Architektur. Das ist Kunst.",
      "Ich würde ja eine Rede halten, aber ich bin zu gerührt. Und ich hab sie zu Hause vergessen.","Wenn mich jemand fragt, was du die letzten Tage gemacht hast: Das hier. Genau das.",
      "Ich hab schon ein Foto gemacht. Und noch eins. Okay, siebzehn.","Offiziell eröffnet! Es gibt Kuchen. Inoffiziell hab ich den schon probiert."],
    discovery:["Kurzes Update: Wir expandieren. Klingt nach Start-up, ist aber eine Insel.","Neue Insel?! Ich hab nicht mal eine Packliste. Egal, Abenteuer!",
      "Ich hab das auf keiner Karte gefunden. Also ist das jetzt unsere. So funktioniert das doch, oder?","Land in Sicht! Ich wollte das schon immer mal rufen. Land in Sicht! Okay, einmal reicht.",
      "Neues Terrain. Ich nenne es vorläufig ‚Mr.-Bay-Bucht‘. Abstimmung folgt. Ich bin für ja."],
    arrival:["Ein neues Gesicht! Ich tu jetzt ganz lässig. Ganz. Lässig.","Siehst du? Es spricht sich rum. Ganz ohne Hashtag.",
      "Willkommen, "+nm+"! Die Hängematte links ist meine. Die rechte auch. Kleiner Scherz. Halber Scherz.","Ich hab "+nm+" gerade die Insel gezeigt. Hat zwei Minuten gedauert. Wir sind gemütlich hier.",
      "Neue Leute! Ich hab sofort eine Begrüßungsrede gehalten. "+nm+" war sehr höflich und hat nur einmal gegähnt.","Hab "+nm+" gefragt, warum OffLand. Antwort: ‚Hier redet man noch miteinander.‘ Ich musste kurz weg.",
      "Noch jemand, der lieber in den Himmel guckt als auf einen Bildschirm. Ich mag "+nm+" jetzt schon.","Einwohnerzahl plus eins. Ich hab's in mein Büchlein geschrieben. Mit Herzchen.",
      nm+" ist da! Lucifer hat schon gefaucht. Das heißt bei ihr: Herzlich willkommen.","Wir sind wieder ein paar mehr. Ich hab das Gefühl, die Insel atmet auf."],
    arrivalPhone:[nm+" ist neu, nett und hat … ein Handy. Wir arbeiten dran.",nm+" hat das Handy vom Festland mitgebracht. Ein paar gute Tage, und das liegt in der Schublade.",
      nm+" hat beim Aussteigen auf den Bildschirm geschaut statt aufs Meer. Das Meer war beleidigt. Ich auch ein bisschen.",nm+" hat gefragt, wie das WLAN-Passwort ist. Ich hab gesagt: ‚Sonnenuntergang‘. Stimmt nicht, aber es hilft.",
      "Ich hab "+nm+" zur Begrüßung gewunken. "+nm+" hat zurück … gescrollt. Wird schon.",nm+" ist da, mit Handy in der Hand. Das kennen wir. Und wir wissen auch, wie die Geschichte weitergeht."],
    arrivalAnimal:["Ein neues Tier! Ich hab mich vorgestellt. Es hat mich ignoriert. Wir verstehen uns.","Willkommen, "+nm+"! Bitte nicht in meine Blumen. Oder doch, sind eh nur Unkraut.",
      nm+" ist da. Lucifer tut, als wär's ihr egal. Sie guckt aber schon seit zehn Minuten.","Noch ein Mitbewohner. Zahlt keine Miete, ist aber trotzdem gern gesehen.",
      "Tiere kommen nur, wo es ruhig ist. Das ist das schönste Kompliment für OffLand.",nm+" hat sich direkt in die Sonne gelegt. Kluges Tier. Hat das Prinzip verstanden."],
    birth:["Nachwuchs! Ich fühl mich offiziell wie ein Onkel.","Die Insel wächst. Und mein Herz gleich mit.","Ein Baby! Ich hab schon ein Lätzchen mit Insel-Logo bestellt. Wir haben kein Logo. Jetzt schon.",
      "Willkommen, "+nm+". Das Erste, was du hier siehst, ist der Himmel. Kein Bildschirm. So soll das sein.","Ich hab vor Freude die Glocke geläutet. Wir haben keine Glocke. Ich hab mit einem Topf geläutet.",
      "Kleiner Mensch, große Neuigkeit. OffLand hat Zukunft."],
    return:["Sie sind zurück! Ich hab extra den Steg gefegt. Zweimal.","Willkommen zurück! Wir haben euch vermisst. Ich besonders.",
      "Ich hab dein Zimmer so gelassen, wie es war. Okay, Lucifer hat drin geschlafen. Aber sonst alles gleich.","Zurück auf OffLand! Ich tu jetzt so, als hätt ich nicht jeden Tag am Steg gewartet.",
      "Ich wusste, dass du zurückkommst. Ich hab sogar gewettet. Gegen Lucifer. Sie schuldet mir einen Fisch."],
    warn:["Das ist gerade nicht gut. Aber auch nicht vorbei. Zwei gute Tage, und wir drehen das.","Kein Drama. Okay, ein kleines. Aber wir kriegen das hin.",
      "Die Stimmung wackelt. Ich hab Tee gekocht. Tee hilft. Gute Tage helfen mehr.","Ich bin nicht enttäuscht. Ich bin … motiviert für uns beide. Morgen packen wir das.",
      "Ich hab schon schlimmere Wochen gesehen. Damals, als alle am Handy waren. Und schau, wo wir jetzt sind."],
    left:["Das tut weh. Aber jeder Abschied ist auch ein Grund für ein Wiedersehen.","Ich winke so lange, bis das Boot weg ist. Dann winke ich noch ein bisschen.",
      "Ich lass das Licht im Haus an. Falls jemand den Weg zurück sucht.","Weg ist nicht für immer. Auf OffLand schon gar nicht. Gute Tage bringen sie zurück."],
    fest:["Ein Inselfest! Wie früher. Ich hab ein Mikro und keine Angst, es zu benutzen.","Alle draußen, alle zusammen. Genau dafür mach ich diesen Job.",
      "Ich hab DJ gespielt. Drei Lieder, alle von 1987. Niemand hat sich beschwert. Alle haben getanzt.","Lichterketten an, Handys aus. Das ist mein Lieblingsgeräusch: Leute, die lachen.",
      "Ich hab eine Polonaise gestartet. Lucifer war vorne. Hat sie nicht freiwillig gemacht."],
    birthday:["Alles Gute! Ich hab gesungen. Lucifer hat den Raum verlassen. Verdient.","Kuchen am Strand. Das ist Kultur.",
      "Happy Birthday, "+nm+"! Ein Jahr älter, und keinen Tag davon im Feed verbracht. Okay, ein paar. Aber trotzdem!","Ich hab Kerzen besorgt. Der Wind hat sie ausgepustet. Zählt trotzdem als Wunsch.",
      "Geburtstag auf OffLand heißt: Alle kommen, keiner guckt aufs Handy, und ich halte eine zu lange Rede."]
  };
  let k=ev.type;
  if(k==="arrival"){if(!r) return null; k=r.kind==="tier"?"arrivalAnimal":r.phone?"arrivalPhone":"arrival"}
  if(k==="birthday"&&!nm) L.birthday=L.birthday.slice(0,2).concat(L.birthday.slice(3));
  return L[k]?freshLine(L[k]):null;
}
/* Lucifer: ein Spruch pro Tag im Inselgeflüster, frech, aber lieb */
function lucLine(){
  const last=S.days[S.days.length-1], good=last&&last.min<=S.budget, n=S.budgetStreak, seed=S.dayCount;
  const pickL=a=>a[hsh("luc"+seed+a[0])%a.length];
  if(!last) return "Ich bin Lucifer. Ich war vor dir hier und bleibe auch nach dir. Trag heute Abend einfach deinen Tag ein, dann reden wir.";
  if(S.jokerWk===isoWeek(today())&&!good) return pickL(["Joker eingesetzt? Mutig. Ich hätte ihn aufgehoben. Aber ich bin auch eine Katze.","Joker weg, Serie da. Ich hab nichts gesehen. Ich seh nie was. Außer alles."]);
  if(S.glueck<40) return pickL(["Die Stimmung ist im Keller. Ich war da unten, da gibt's nicht mal Fisch. Lass uns hochgehen.","Mr. Bay macht sich Sorgen. Ich nicht. Ich weiß, dass du das kannst. Sag's ihm nicht.",
    "Die Leute gucken traurig. Ich guck immer so, bei mir ist das Stil. Bei denen nicht. Mach was.","Ein guter Tag, und hier strahlen wieder alle. Ich strahle nicht. Ich schnurre. Ist dasselbe.",
    "Ich hab mich extra auf den sonnigsten Platz gelegt, um die Stimmung zu heben. Jetzt bist du dran."]);
  if(n>=3) return pickL([n+" Tage am Stück. Ich bin fast beeindruckt. Fast.","Mr. Bay hat vor Freude geweint. Schon wieder. Mach weiter, ich brauch die Unterhaltung.","Die Leute reden wieder miteinander. Ich hör zu. Besser als jede Serie.",
    n+" gute Tage. Ich hab dir eine Maus hingelegt. Also, symbolisch. Also, es war eine echte. Gern geschehen.","Du bist auf einer Serie. Ich auch: Ich schlafe seit "+n+" Tagen durch. Wir sind ein gutes Team.",
    "So viel Ruhe auf der Insel. Ich hab heute einen Schmetterling gefangen. Und wieder losgelassen. Bin entspannt.","Weiter so. Ich sag das nur einmal. Okay, ich sag's morgen wieder.",
    "Mr. Bay hat ein Plakat mit deinem Namen gemalt. Ich hab draufgeschlafen. Es ist jetzt noch schöner."]);
  if(!good) return pickL(["Wieder im Handy versunken? Ich hab mich vorsorglich auf deinen Bildschirm gelegt.","Gestern war … ein Tag. Heute wird besser. Also bei dir. Ich schlaf.","Ich sag nichts. Ich guck nur. Sehr intensiv.","Ich wusste doch, dass du das nicht schaffst. War ein Witz. Morgen zeigst du's mir.",
    "Ich bin eine Katze. Ich fall immer auf die Pfoten. Du auch, du brauchst nur einen Tag mehr dafür.","Zu viel Handy gestern? Passiert. Mir passiert dauernd zu viel Schlaf. Wir urteilen hier nicht.",
    "Ich hab gestern zehn Stunden aufs Meer geschaut. Empfehlenswert. Heute du?","Das Handy ist wie ein Wollknäuel. Erst spannend, dann hängst du drin fest. Glaub mir, ich weiß das.",
    "Mr. Bay hat gestern nur dreimal geseufzt. Er glaubt an dich. Ich auch. Leiser."]);
  return pickL(["Siehst du? Geht doch. Ich wusste es. Ich hab's nur nicht gesagt.","Guter Tag gestern. Ich hab zur Feier nur 14 Stunden geschlafen.","Ich hab schon drei Bürgermeister überlebt. Mr. Bay ist mein Lieblingsbürgermeister. Sag ihm das nicht.",
    "Gestern im Budget. Ich hab vor Stolz meinen Schwanz geputzt. Zweimal.","Ein guter Tag ist wie ein Sonnenfleck auf dem Boden. Leg dich rein. Genieß es.",
    "Ich hab mitgezählt, wie oft du gestern aufs Handy geschaut hast. Hab bei drei aufgehört. Zu wenig für mich, gut für dich.",
    "Mr. Bay hat gestern gepfiffen. Falsch, aber glücklich. Das warst du.","Ich bin nicht verschmust. Aber wenn du so weitermachst, setz ich mich vielleicht neben dich. Vielleicht.",
    "Du hast gestern was Echtes gemacht. Ich auch: Ich hab einen Vogel angeschaut. Wir sind beide gewachsen."]);
}
/* Intro: Mr. Bay erzählt, wie OffLand früher war */
function storyIsle(mood,vb){
  const c={past:["#F2D3A0","#6FA6C8","#E9D7A6","#8CCB7A"],grey:["#8E93A6","#4F5B73","#B9B2A0","#7E9277"],now:["#86BFE6","#3A6FA8","#E9D7A6","#7FC57A"]}[mood];
  return {c,open:`<svg viewBox="${vb||"0 0 360 200"}" aria-hidden="true"><rect width="360" height="200" fill="${c[0]}"/>${mood==="grey"?`<g fill="#A3A7B8" opacity=".8"><ellipse cx="80" cy="40" rx="40" ry="12"/><ellipse cx="250" cy="30" rx="50" ry="13"/></g>`:`<circle cx="300" cy="44" r="18" fill="#FFE7A3"/>`}
    <rect y="132" width="360" height="68" fill="${c[1]}"/><ellipse cx="200" cy="140" rx="120" ry="17" fill="${c[2]}"/><path d="M96 138c12-38 58-52 104-52s92 14 104 52z" fill="${c[3]}"/>
    <path d="M250 128v-22l18-13 18 13v22z" fill="#F3F1EA"/><path d="M246 108l22-17 22 17" fill="none" stroke="#FF9C7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="262" y="114" width="12" height="14" rx="2" fill="#B6A4FF"/>`};
}
const phoneIn=(x,y)=>`<g transform="translate(${x} ${y})"><circle cx="0" cy="-15" r="7" fill="#7FB6FF" opacity=".28"/><rect x="-1.8" y="-10.6" width="3.6" height="5.6" rx=".9" fill="#2B3350"/><rect x="-1.3" y="-10" width="2.6" height="4.2" rx=".5" fill="#9CC8EE"/></g>`;
function partyArt(){
  const col=["#FF9C7A","#FFD27A","#C8F169","#B6A4FF","#5BC0A8"];
  const garland=(x1,x2,y,sag)=>{const n=9;let h=`<path d="M${x1} ${y}q${(x2-x1)/2} ${sag} ${x2-x1} 0" stroke="#5A3A2A" stroke-width=".6" fill="none"/>`;
    for(let i=1;i<n;i++){const t=i/n,x=x1+(x2-x1)*t,yy=y+sag*2*t*(1-t);h+=`<circle class="glow" style="animation-delay:${(i*.27)%2}s" cx="${x}" cy="${yy+1.4}" r="1.5" fill="${col[i%5]}"/>`}return h};
  const ppl=[{id:"p1",kind:"mensch",name:"A",look:{skin:1,hair:3,style:7,shirt:4,acc:[6],accC:0}},{id:"p2",kind:"mensch",name:"B",look:{skin:3,hair:0,style:4,shirt:1,acc:[],accC:2}},{id:"p3",kind:"mensch",name:"C",look:{skin:0,hair:5,style:11,shirt:7,acc:[],accC:0}},{id:"p4",kind:"mensch",name:"D",look:{skin:2,hair:1,style:0,shirt:2,acc:[5],accC:3}},{id:"p5",kind:"mensch",name:"E",look:{skin:4,hair:2,style:8,shirt:9,acc:[],accC:0}}];
  const an=[{id:"a1",kind:"tier",art:"Ziege",name:"Z"},{id:"a2",kind:"tier",art:"Huhn",name:"H"},{id:"a3",kind:"tier",art:"Hund",name:"D"}];
  return `<g transform="translate(206 128) scale(.95)">${projectSvg("festzelt")}</g>`+garland(110,200,98,10)+garland(200,300,96,12)+
    `<g transform="translate(140 148) scale(1.1)">${itemSvg("sandburg")}</g><g transform="translate(180 146) scale(.9)">${itemSvg("feuer")}</g>`+
    ppl.map((r,i)=>`<g class="bob" style="animation-delay:${i*.25}s;animation-duration:${1.2+i%2*.4}s">${figure(r,[160,196,236,262,288][i],[140,142,141,138,140][i])}</g>`).join("")+
    an.map((r,i)=>figure(r,[118,214,306][i],[142,147,146][i])).join("")+
    confetti()+`<g transform="translate(0 70)">${confetti()}</g>`;
}
/* Kapitel: die bisherigen Meilensteine als Geschichte von OffLand */
const humansHere=()=>here().filter(r=>r.kind==="mensch").length;
const CHAPTERS=[
  {n:"Das stille Dorf",goal:"Hol den ersten Bewohner vom Handy weg: bleib einen Tag im Budget.",ok:()=>(S.freed||0)>=1||!here().some(r=>r.phone),
    prog:()=>"",bay:"Das Handy liegt! Einfach so! Ich hab's gesehen. Ich hab Zeugen.",luc:"Einer weniger. Bleiben noch … ach, mach einfach weiter so."},
  {n:"Erste Gespräche",goal:"Alle legen das Handy weg.",ok:()=>!here().some(r=>r.kind==="mensch"&&r.phone),
    prog:()=>{const n=here().filter(r=>r.kind==="mensch"&&r.phone).length;return n?"Noch "+n+(n===1?" Bewohner":" Bewohner")+" am Handy":""},bay:"Sie reden wieder miteinander. Über Wetter, über Fische, über mich. Hauptsache reden!",luc:"Ich hab heute zum ersten Mal seit Jahren jemanden lachen gehört. War nicht ich."},
  {n:"Licht am Horizont",goal:"Bau das erste Großprojekt.",ok:()=>S.built.length>=1,
    prog:()=>{const p=curProjects()[S.projectIdx];return p?Math.floor(S.material/60)+" von "+p.hours+" h Baumaterial":""},bay:"Das erste Großprojekt seit Jahren. Ich hab eine Rede vorbereitet. Drei Seiten. Keine Sorge, ich les nur die erste.",luc:"Schön. Sehr schön. Wo ist mein Fisch?"},
  {n:"Neue Gesichter",goal:"Bring OffLand auf 4 Menschen.",ok:()=>humansHere()>=4,
    prog:()=>humansHere()+" von 4 Menschen",bay:"Es spricht sich rum: Auf OffLand ist wieder was los. Ich hab's übrigens nicht gepostet. Das war Mund zu Mund.",luc:"Mehr Leute, mehr Schoß zum Draufliegen. Ich bin dafür."},
  {n:"Das erste Fest",goal:"Feier ein Inselfest: 5 von 7 Tagen im Budget.",ok:()=>(S.fests||0)>=1,
    prog:()=>{const g=S.days.slice(-7).filter(d=>d.min<=S.budget).length;return g+" von 5 guten Tagen in den letzten 7"},bay:"Lichterketten, Lagerfeuer, alle draußen. Genau so hab ich es in Erinnerung. Nur mit besserer Musik.",luc:"Ich hab getanzt. Niemand hat's gesehen. Niemand wird es je erfahren."},
  {n:"Die Brücke",goal:"Bau die Brücke zur Nachbarinsel.",ok:()=>S.built.includes(WORLDS[0].isle2)||(S.world||0)>0,
    prog:()=>{const p=PROJECTS.find(x=>x.id===WORLDS[0].isle2);return p&&!S.built.includes(p.id)?"Großprojekt „"+p.name+"“":""},bay:"Die Brücke steht wieder. Wie damals. Ich geh jetzt jeden Tag einmal drüber. Nur weil ich kann.",luc:"Eine Brücke. Für Leute ohne Pfoten, die nicht springen können. Süß."},
  {n:"OffLand lebt",goal:"Bau alle Großprojekte der Heimatinseln.",ok:()=>(S.world||0)>0||PROJECTS.every(p=>S.built.includes(p.id)),
    prog:()=>PROJECTS.filter(p=>S.built.includes(p.id)).length+" von "+PROJECTS.length+" Großprojekten",bay:"OffLand lebt. Ich hab's nicht allein geschafft. Ich hab's mit dir geschafft. Und jetzt ist da draußen noch mehr Meer.",luc:"Du hast das wirklich durchgezogen. Ich bin … stolz. Erzähl's niemandem."}
];
/* Fortsetzung auf den weiteren Welten: je Welt Ankunft, ein Höhepunkt, Abschluss */
const WORLD_STORY=[null,
  {mid:"t_riff",ch:[
    ["Sonne, Sand und Sonnenbrand","Reise zur Tropeninsel.","Ich hab Sonnencreme vergessen. Und meine Sonnenbrille. Ich bin trotzdem sehr glücklich.","Sand. Überall Sand. Ich hasse es. Ich bleib trotzdem."],
    ["Das Papageien-Problem","Bau den Korallenriff-Steg.","Die Papageien pfeifen Klingeltöne nach. Alle greifen nach dem Handy. Wir trainieren das um, auf Vogelgezwitscher.","Ein Papagei hat „Neue Nachricht“ gesagt. Ich hab ihn sehr lange angeschaut. Er sagt das jetzt nicht mehr."],
    ["Surfen statt Scrollen","Bau alle Großprojekte der Tropeninsel.","Ich stand heute zum ersten Mal auf dem Surfbrett. Drei Sekunden. Beste drei Sekunden meines Lebens.","Ich hab zugeschaut. Von ganz weit weg. Im Trockenen."]]},
  {mid:"f_sauna",ch:[
    ["Ab in den Norden","Reise zu den Fjordinseln.","Es ist kalt. Sehr kalt. Ich hab drei Pullis an und einen Plan.","Ich hab mich auf den warmen Ofen gelegt. Ich steh frühestens im Frühling wieder auf."],
    ["Saunaabend","Bau die Sauna am See.","In der Sauna gibt's kein WLAN. Und weißt du was? Keiner hat's vermisst.","Ich war nicht drin. Ich bin eine Katze, kein Brötchen."],
    ["Unter dem Polarlicht","Bau alle Großprojekte der Fjordinseln.","Alle standen draußen und haben nach oben geschaut. Nicht aufs Handy. Nach oben.","Das grüne Licht da oben ist fast so schön wie meine Augen. Fast."]]},
  {mid:"o_karawane",ch:[
    ["Heißer Neustart","Reise zur Wüsteninsel.","Erst Schnee, jetzt Wüste. Mein Kleiderschrank ist komplett überfordert.","Endlich warm. Weckt mich, wenn irgendwas mit Fisch passiert."],
    ["Die Karawane bringt Post","Bau den Karawanenweg.","Post von Leuten, die früher auf OffLand gewohnt haben. Sie fragen, ob sie zurückkommen dürfen. Ich hab geweint. Auf einem Kamel.","Ein Kamel hat mich angespuckt. Ich hab's verdient. Wir sind jetzt Freunde."],
    ["Nacht unter Sternen","Bau alle Großprojekte der Wüsteninsel.","Keine Lichter, keine Bildschirme. Nur Sterne. Mehr, als ich zählen kann. Hab's trotzdem versucht.","Er hat bis 412 gezählt. Dann ist er eingeschlafen. Ich hab weitergezählt."]]},
  {mid:"a_schlitten",ch:[
    ["Ins ewige Eis","Reise zu den Eisinseln.","Ich hab gelesen, hier gibt's monatelang Nacht. Perfekt. Mehr Zeit für Gespräche am Feuer.","Ich trag jetzt einen Schal. Kein Wort darüber."],
    ["Hundeschlitten","Bau die Hundeschlitten-Station.","Zwölf Hunde, ein Schlitten, null Handyempfang. Der beste Ausflug der Inselgeschichte.","Zwölf Hunde. Ich hab mit allen geredet. Klar gemacht, wer hier die Chefin ist."],
    ["Ganz OffLand","Bau alle Großprojekte der Eisinseln.","Weißt du noch, wie still es am Anfang war? Hör mal hin. So klingt OffLand jetzt. Danke.","Ich hab schon vier Bürgermeister überlebt. Aber mit dir war's am schönsten. Sag's niemandem."]]}
];
WORLD_STORY.forEach((ws,w)=>{if(!ws) return; const W=WORLDS[w]; if(!W) return; const all=()=>(S.world||0)>w||W.projects.every(p=>S.built.includes(p.id));
  const mid=W.projects.find(p=>p.id===ws.mid);
  [[()=>(S.world||0)>=w,()=>""],[()=>S.built.includes(ws.mid)||all(),()=>mid&&!S.built.includes(mid.id)&&(S.world||0)===w?"Großprojekt „"+mid.name+"“":""],
   [all,()=>(S.world||0)===w?W.projects.filter(p=>S.built.includes(p.id)).length+" von "+W.projects.length+" Großprojekten":""]].forEach(([ok,prog],k)=>{
    const t=ws.ch[k]; CHAPTERS.push({n:t[0],goal:t[1],ok,prog,bay:t[2],luc:t[3],world:w,k});
  });
});
function worldPhoto(w,k){
  const th=WORLDS[w].theme, kids=[0,1,2].map(i=>({id:"w"+w+i,name:"x",kind:"mensch",look:{skin:(i+w)%6,hair:(i*2+w)%7,style:[1,4,11][i],shirt:(i*3+w)%10,acc:[],accC:0}}));
  return `<svg viewBox="40 60 280 140" aria-hidden="true"><rect x="0" y="0" width="360" height="200" fill="${th.sky}"/>${horizonSvg(th.horizon,true)}
    <rect y="140" width="360" height="60" fill="${th.sea}"/><ellipse cx="180" cy="150" rx="130" ry="18" fill="${th.sand}"/><path d="M70 148c12-36 60-50 110-50s98 14 110 50z" fill="${th.grass}"/>
    ${treeSvg(th.tree,96,104,th.leaf)}${treeSvg(th.tree,262,104,th.leaf)}
    ${k===0?boat(kids.slice(0,2),""):kids.map((r,i)=>`<g class="bob" style="animation-delay:${i*.3}s">${figure(r,206+i*16,144)}</g>`).join("")}
    <g transform="translate(150 146) scale(1.15)">${baySvg()}</g><g transform="translate(178 147)">${lucSvg()}</g>${k===2?confetti():""}</svg>`;
}
function chapterCheck(silent){
  if(S.chapter==null){S.chapter=0; if(S.dayCount>0) silent=true}            // ältere Spielstände: erledigte Kapitel still nachholen
  while(S.chapter<CHAPTERS.length&&CHAPTERS[S.chapter].ok()){
    const n=S.chapter; S.chapter++; if(!silent) stat("kapitel_"+(n+1));
    chron([],"Kapitel "+(n+1)+" geschafft: "+CHAPTERS[n].n+".");
    if(!silent) S.pending.push({type:"chapter",n});
  }
}
function damalsArt(n){
  const a=storyIsle("past","96 70 236 118"), g=(x,y,i)=>figure({id:"d"+n+i,name:"x",kind:"mensch",look:{skin:i%5,hair:(i*3)%7,style:[0,1,7,4,11,8][i%6],shirt:i*2%10,acc:[],accC:0}},x,y);
  const lt=`<g transform="translate(150 132)"><path d="M-8 0h16l-3-40h-10z" fill="#F3F1EA"/><path d="M-7 -12h14M-6 -24h12" stroke="#FF9C7A" stroke-width="4"/><rect x="-6" y="-48" width="12" height="9" rx="2" fill="#FFD27A"/><path d="M-6 -44L-70 -60v28z" fill="#FFE7A3" opacity=".5"/></g>`;
  const art=[`<g transform="translate(200 146) scale(.9)">${itemSvg("feuer")}</g>`+g(178,140,0)+g(222,140,1),
    `<g transform="translate(200 146)">${itemSvg("bank")}</g>`+g(190,140,2)+g(210,140,3)+hearts(200,112),
    lt+g(180,140,4),
    boat([{id:"bx",kind:"mensch",name:"x"},{id:"by",kind:"mensch",name:"y"}],"")+g(200,140,5)+g(220,140,0),
    partyArt(),
    `<path d="M96 140q24-26 48 0" fill="none" stroke="#8A5A3B" stroke-width="4" stroke-linecap="round"/>`+g(120,124,1)+g(200,140,2),
    partyArt()][n]||"";
  return a.open+art+`</svg>`;
}
function chapterSheet(n,fresh){
  const c=CHAPTERS[n], next=CHAPTERS[n+1];
  sheet(`<p class="label" style="color:var(--amber)">Kapitel ${n+1}${fresh?" geschafft":""}</p><h2>${esc(c.n)}</h2>
    <div class="dh"><figure><div class="anim story-art past">${c.world?worldPhoto(c.world,c.k):damalsArt(n)}</div><figcaption>${c.world?"Reisefoto":"Damals"}</figcaption></figure>
      <figure><div class="anim story-art">${scene()}</div><figcaption>Heute</figcaption></figure></div>
    ${saysHtml("bay",c.bay)}${saysHtml("luc",c.luc)}
    ${fresh&&next?`<p class="small muted">Weiter geht's mit Kapitel ${n+2}: <b style="color:var(--ink)">${esc(next.n)}</b>. ${esc(next.goal)}</p>`:""}
    ${fresh&&!next?`<p class="small muted">Das war die ganze Geschichte von OffLand. Danke, dass du dabei warst.</p>`:""}
    <button class="btn" data-ok>${fresh?"Ins Album kleben":"Schließen"}</button>`);
  if(fresh) sfx("chapter"); speak([["bay",c.bay],["luc",c.luc]],fresh?1:.1);
}
function viewBayAlbum(){
  if(S.chapter==null) return "";
  const done=Math.min(S.chapter,CHAPTERS.length), last=done-1, c=CHAPTERS[Math.max(0,last)];
  return `<button class="card bay-cover" id="bayAlbum"><div class="row between"><p class="label">Mr. Bays Album</p><span class="small muted num">${done} / ${CHAPTERS.length} Kapitel</span></div>
    <div class="bay-stack">${done?`<div class="story-art past">${c.world?worldPhoto(c.world,c.k):damalsArt(last)}</div>`:`<div class="lock">?</div>`}</div>
    <p class="row between"><span class="small muted">${done?`Zuletzt: <b style="color:var(--ink)">${esc(c.n)}</b>`:"Noch leer. Das erste Foto kommt bald."}</span><span class="bay-open">Durchblättern ›</span></p></button>`;
}
function bayAlbumSheet(){
  stat("album");
  const done=Math.min(S.chapter,CHAPTERS.length), next=CHAPTERS[done];
  const slides=CHAPTERS.slice(0,done).map((c,i)=>`<p class="label" style="color:var(--amber)">Kapitel ${i+1}</p><h2>${esc(c.n)}</h2>
      <figure class="bay-photo"><div class="story-art past">${c.world?worldPhoto(c.world,c.k):damalsArt(i)}</div><figcaption>${c.world?"Reisefoto":"Damals"}</figcaption></figure>
      ${saysHtml("bay",c.bay)}${saysHtml("luc",c.luc)}`);
  slides.push(next?`<p class="label">Als Nächstes</p><h2>Kapitel ${done+1}: ${esc(next.n)}</h2>
      <figure class="bay-photo"><div class="bay-empty">?</div><figcaption>Hier kommt das nächste Foto rein</figcaption></figure>
      <p class="muted">${esc(next.goal)}</p>${saysHtml("bay","Ich hab schon den Kleber bereitgelegt. Kein Druck. Ein bisschen Druck.")}`
    :`<p class="label" style="color:var(--lime)">Album voll</p><h2>Alle ${CHAPTERS.length} Kapitel</h2><p class="muted">Die ganze Geschichte von OffLand ist erzählt. Mr. Bay ist sehr stolz.</p>${saysHtml("luc","Ich hab mich auf jedes Foto draufgesetzt. Das ist ein Kompliment.")}`);
  sheet(`<div class="wr" id="wr">${slides.map(x=>`<section class="wr-s">${x}</section>`).join("")}</div>
    <p class="small muted num" style="text-align:center" id="wrPos">1 / ${slides.length}</p>
    <div class="row"><button class="btn ghost grow" id="wrClose">Schließen</button><button class="btn grow" id="wrNext">Weiter</button></div>`);
  const box=$("#wr"), idx=()=>Math.round(box.scrollLeft/box.clientWidth);
  const upd=()=>{const i=idx();$("#wrPos").textContent=`${i+1} / ${slides.length}`;$("#wrNext").textContent=i>=slides.length-1?"Fertig":"Weiter"};
  box.onscroll=upd; upd();
  $("#wrNext").onclick=()=>{const i=idx(); if(i>=slides.length-1) return closeModal(); box.scrollTo({left:(i+1)*box.clientWidth,behavior:"smooth"})};
  $("#wrClose").onclick=closeModal;
}
function storySlides(existing){
  const kids=here().filter(r=>r.kind==="mensch").slice(0,3);
  const ppl=(xs,y,ph)=>kids.slice(0,xs.length).map((r,i)=>`<g class="bob" style="animation-delay:${i*.3}s">${figure(Object.assign({},r,{sick:null}),xs[i],y)}</g>${ph?phoneIn(xs[i],y):""}`).join("");
  const Z="96 70 236 118", a=storyIsle("past",Z), a2=storyIsle("past"), b=storyIsle("grey",Z), b2=storyIsle("grey","40 40 300 160"), n=storyIsle("now",Z);
  return [
    {who:"bay",mood:"past",art:a.open+partyArt()+`</svg>`,
      t:existing?"Hi! Ich bin Mr. Bay, Bürgermeister von OffLand. Ich hab mich noch gar nicht richtig vorgestellt, sorry. Kurze Zeitreise: Hier war mal richtig was los. Sandburgen, Lagerfeuer, Feste bis nach Mitternacht.":"Willkommen auf OffLand! Ich bin Mr. Bay, der Bürgermeister. Kurze Zeitreise: Hier war mal richtig was los. Sandburgen, Lagerfeuer, Feste bis nach Mitternacht."},
    {who:"bay",mood:"past",art:a2.open+`<ellipse cx="38" cy="150" rx="40" ry="10" fill="${a.c[2]}"/><path d="M8 148c6-18 28-24 42-24s22 8 26 24z" fill="${a.c[3]}"/><path d="M70 140q24-26 48 0" fill="none" stroke="#8A5A3B" stroke-width="4" stroke-linecap="round"/><path d="M80 134v8M94 126v14M108 134v8" stroke="#8A5A3B" stroke-width="2"/>`+ppl([94,40,150],127)+hearts(150,100)+`</svg>`,
      t:"Wir haben sogar eine Brücke zur Nachbarinsel gebaut. Die Möwen kamen extra zum Feiern vorbei. Ehrlich."},
    {who:"bay",mood:"grey",art:b.open+ppl([170,195,220],136,true)+`</svg>`,
      t:"Dann kamen die Bildschirme. Erst einer. Dann alle. Plötzlich war es sehr still hier."},
    {who:"bay",mood:"grey",art:b2.open+boat(kids.slice(0,2),"sail-out")+ppl([205,0,0].slice(0,1),136,true)+`</svg>`,
      t:"Die meisten sind weggezogen. Wer noch da ist, redet mehr mit dem Handy als mit mir. Und ich bin wirklich unterhaltsam."},
    {who:"both",mood:"now",art:n.open+`<g transform="translate(170 138) scale(2.1)"><g class="bob">${baySvg()}</g></g><g transform="translate(212 140) scale(1.9)"><g class="pop fb" style="animation-delay:.4s">${lucSvg()}</g></g></svg>`,
      t:""}
  ];
}
function storySheet(existing){
  const sl=storySlides(existing);
  sheet(`<div class="wr" id="wr">${sl.map((x,i)=>`<section class="wr-s story-s">
      <div class="anim story-art ${x.mood}">${x.art}</div>
      ${x.who==="both"?saysHtml("luc","Er erzählt das jedem. Aber du siehst aus, als hättest du was drauf.")+saysHtml("bay","Hilfst du mir, OffLand zurückzuholen? Weniger Handy, mehr Leben. Für die Insel und für dich."):saysHtml("bay",x.t)}
    </section>`).join("")}</div>
    <div class="wr-dots" aria-hidden="true">${sl.map((_,i)=>`<i${i?"":' class="on"'}></i>`).join("")}</div>
    <div class="row"><button class="btn ghost grow" id="storySkip" data-ok>Überspringen</button><button class="btn grow" id="storyNext">Weiter</button></div>`);
  const box=$("#wr"), dots=[...document.querySelectorAll(".wr-dots i")], idx=()=>Math.round(box.scrollLeft/box.clientWidth), last=sl.length-1;
  const upd=()=>{const i=idx();dots.forEach((d,k)=>d.classList.toggle("on",k===i));$("#storyNext").textContent=i>=last?(existing?"Bin dabei!":"Los geht's!"):"Weiter";$("#storySkip").style.visibility=i>=last?"hidden":"visible"};
  let said=-1; const talk=()=>{const i=idx(); if(i===said) return; said=i; const x=sl[i];
    speak(x.who==="both"?[["luc",""],["bay","Hilfst du mir, OffLand zurückzuholen? Weniger Handy, mehr Leben."]]:[["bay",x.t]],i===0?1.2:.1)};
  box.onscroll=()=>{upd(); clearTimeout(box._t); box._t=setTimeout(talk,180)};
  sfx("story"); talk();
  const done=()=>{S.storySeen=true;save();closeModal();render();showPending()};
  $("#storyNext").onclick=()=>{const i=idx(); if(i>=last){stat("intro_ende");return done()} box.scrollTo({left:(i+1)*box.clientWidth,behavior:"smooth"})};
  $("#storySkip").onclick=()=>{stat("intro_skip");done()};
}

/* Bildausschnitt, in dem ein Tier ganz zu sehen ist (Wal und Delfin sind breiter als die anderen) */
const ART_BOX={Wal:[-16.4,-21.3,21.6,5.6],Delfin:[-17.2,-19.4,23.2,2.6],Ziege:[-12.2,-21,12,1],Huhn:[-11.4,-16,11,1.2],Schaf:[-11.9,-13.9,10.3,1.5],Esel:[-15,-23,12.5,1],
  Katze:[-9,-16.6,11.5,0],Hund:[-12.7,-15.5,11.2,0.4],Meerschweinchen:[-10.1,-10.8,8,0.2],Hase:[-8.7,-20,9.4,0],Robbe:[-10,-13,14,1],Papagei:[-8,-21,11,1],Elch:[-18,-31,12,0],Kamel:[-15.6,-26.2,13,0],Eisbär:[-16.6,-17.6,12,0]};
function artVB(a,ratio){
  if(!ART_BOX[a]||!SEA.includes(a)) return ["Elch","Kamel"].includes(a)?"-20 -33 40 35":"-16 -22 32 24";
  const [x0,y0,x1,y1]=ART_BOX[a], cx=(x0+x1)/2, cy=(y0+y1)/2, w=Math.max(x1-x0,(y1-y0)*ratio)+2, h=w/ratio;
  return [cx-w/2,cy-h/2,w,h].map(v=>+v.toFixed(1)).join(" ");
}
function figVB(r){
  if(r.kind==="mensch"||!ART_BOX[r.art]) return "-13 -24 26 27";
  const s=(r.parents?0.7:1)*(r.art==="Wal"?1.6:["Elch","Kamel","Eisbär"].includes(r.art)?1.1:1), [x0,y0,x1,y1]=ART_BOX[r.art];
  const cx=(x0+x1)/2*s, cy=(y0+y1)/2*s, d=Math.max(Math.max(x1-x0,y1-y0)+4,26)*s;   // Kreis: etwas Rand rundum, kleine Tiere nicht riesig
  return [cx-d/2,cy-d/2,d,d].map(v=>+v.toFixed(1)).join(" ");
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
  Delfin:[{},{"#7C9CC4":"#9EA3B8","#5F82B0":"#7C7F99"},{"#7C9CC4":"#5F7FB8","#5F82B0":"#3E5C8A"}],
  Wal:[{},{"#2C4770":"#2A2F45"},{"#2C4770":"#5F6680"}],
  Papagei:[{},{"#E5484D":"#5B8CD6","#FFD27A":"#C8F169"},{"#E5484D":"#4FB06A","#FFD27A":"#FFB86B"}],
  Elch:[{},{"#7A5038":"#5A3A2A","#A0703F":"#7A5038"},{"#7A5038":"#9A6A48","#A0703F":"#C2925E"}],
  Kamel:[{},{"#D9A86A":"#C98A52"},{"#D9A86A":"#E9D2A6"}],
  "Eisbär":[{},{"#F3F1EA":"#E9E2C8"}]
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
  case "Delfin": return `<path d="M15.4 -5.8q3.4-4 7.4-3.6q-2.4 1.8-2.8 3.8q.8 1.8 3.2 3.4q-4 .4-7.8-3.6z" fill="#5F82B0"/><path d="M-0.6 -12.6q1.8-5.2 6.8-6.8q-1.4 3.4.6 7.6z" fill="#5F82B0"/><path d="M-17.2 -6.2q1.4-1.4 4.4-1.6q1.6-4.6 8-5.6q9-1.4 15.6 3.4q3.6 2.6 6.2 4.2l-.2 1.4q-3.8-.4-7.2 1q-6.6 3.6-14.8 3q-5.8-.4-8.4-3.4q-2.6-.6-3.6-2.6z" fill="#7C9CC4"/><path d="M-13.8 -3.8q6.2 3.4 14.6 2.4q5-.6 8.6-2.6q-4.2 3.8-11.6 4.2q-7.2.2-11.6-4z" fill="#C8D6EA"/><path d="M-4.6 -3.6q.4 4-3.6 6q4.8-.2 6.4-5.2z" fill="#5F82B0"/><path d="M-16.8 -5.4q2.8 1.4 5.8.2" stroke="#3E5C8A" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="M-4 -12.2q1.2-.6 2.2-.2" stroke="#C8D6EA" stroke-width=".6" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="-9.4" cy="-8.4" r="1.25" fill="#14151F"/><circle cx="-9" cy="-8.8" r=".42" fill="#F3F1EA"/>`;
  case "Wal": return `<path d="M12.6 -5.6q3.6-4.8 8.6-4.6q-2.8 2-3.2 4.4q.8 2.4 3.6 4.2q-5.2.4-9-4z" fill="#2C4770"/><path d="M-16.4 -4.6q-.4-7.8 9.6-9.6q11-1.8 18.2 4.2q2.6 2.2 4.2 4.6l-.4 1.2q-4.6 0-7.6 1.4q-6.2 2.8-15.4 2.6q-8.2-.2-8.6-4.4z" fill="#2C4770"/><path d="M-15.6 -3.2q8.6 4.6 20 2q-5.4 3.2-12.4 3q-5.8-.2-7.6-5z" fill="#9CB4D4"/><path d="M-14.4 -8.6q3.6-5 11.4-5.4q8.6-.4 14.6 4.8" stroke="#7FA2D0" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".85"/><path d="M-11 -.6l.6 1.6M-7.6 .2l.4 1.6M-4.2.4l.2 1.4M-.8.2v1.2" stroke="#2C4770" stroke-width=".5" stroke-linecap="round" opacity=".7"/><path d="M-5.2 -1.4q1.8 4.6-3 7q5.6-.4 6.6-6.4z" fill="#1C3052"/><path d="M-15.8 -4.4q3.6 1.6 8 .8" stroke="#18284A" stroke-width=".7" fill="none" stroke-linecap="round"/>${E(-10.4,-6.6)}<circle cx="-10.05" cy="-6.95" r=".35" fill="#F3F1EA"/><path d="M-6 -14q-.6-3.6-3.4-5.2M-6 -14q.6-3.6 3.4-5.2M-6 -14v-5.2" stroke="#C8E2F5" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="-9.6" cy="-19.8" r=".9" fill="#C8E2F5"/><circle cx="-2.4" cy="-19.8" r=".9" fill="#C8E2F5"/><circle cx="-6" cy="-20.4" r=".9" fill="#C8E2F5"/>`;
  case "Papagei": return `<path d="M-1 -10v4" stroke="#8A5A3B" stroke-width="1.4"/><path d="M-6 -4h12" stroke="#8A5A3B" stroke-width="2" stroke-linecap="round"/><path d="M2 -10l9 10-3 1-8-8z" fill="#5B8CD6"/><ellipse cx="0" cy="-11" rx="4.4" ry="6" fill="#E5484D"/><path d="M1 -13q5 2 5 8l-4-2z" fill="#FFD27A"/><circle cx="-2" cy="-17.4" r="3.6" fill="#E5484D"/><circle cx="-3" cy="-18" r="1.4" fill="#F3F1EA"/>${E(-3,-18)}<path d="M-5.6 -18q-2.6 .4-2.4 3.4q1.6-.6 2.6-1.6z" fill="#3A3D58"/>`;
  case "Elch": return `<path d="M-4 -9v9M-1 -9v9M6 -9v9M9 -9v9" stroke="#5A3A2A" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="3" cy="-12" rx="9" ry="5.4" fill="#7A5038"/><path d="M-4 -14l-5-5" stroke="#7A5038" stroke-width="4.6" stroke-linecap="round"/><path d="M-11 -20q-5 0-6 4q1 2 4 1l4-1z" fill="#7A5038"/><path d="M-9 -22q-3-5-1-9M-9 -22q-6-1-9-5M-7 -22q1-5 5-7M-7 -22q4-2 7-1" stroke="#A0703F" stroke-width="1.8" fill="none" stroke-linecap="round"/>${E(-11,-19.6)}<circle cx="-16" cy="-16.4" r=".7" fill="#3A2A20"/>`;
  case "Kamel": return `<path d="M-4 -10v10M-1 -10v10M6 -10v10M9 -10v10" stroke="#B8844E" stroke-width="2" stroke-linecap="round"/><ellipse cx="3" cy="-12" rx="9" ry="4.6" fill="#D9A86A"/><path d="M-2 -15q3-7 6 0M4 -15q3-7 6 0" fill="#D9A86A"/><path d="M-5 -13q-4-2-5-9" stroke="#D9A86A" stroke-width="3.4" fill="none" stroke-linecap="round"/><ellipse cx="-12" cy="-22.4" rx="3.6" ry="2.4" fill="#D9A86A"/><path d="M-10 -24.6l1-1.6" stroke="#B8844E" stroke-width="1.2"/>${E(-12,-23)}<path d="M-15.2 -21.4h1.6" stroke="#8A5A3B" stroke-width=".6"/><path d="M12 -13q2 3 0 6" stroke="#B8844E" stroke-width="1" fill="none"/>`;
  case "Eisbär": return `<path d="M-6 -7v7M-2 -7v7M6 -7v7M10 -7v7" stroke="#F3F1EA" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="2" cy="-9" rx="10" ry="6" fill="#F3F1EA"/><path d="M-8 -10q-6-1-8 3q2 2 6 1z" fill="#F3F1EA"/><circle cx="-8" cy="-12" r="4.2" fill="#F3F1EA"/><circle cx="-7" cy="-16" r="1.6" fill="#F3F1EA" stroke="#D9D4C6" stroke-width=".5"/><circle cx="-15.6" cy="-7.6" r="1" fill="#14151F"/>${E(-10.6,-12)}<path d="M-4 -4q6 2 12 0" stroke="#D9D4C6" stroke-width="1" fill="none"/>`;
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
/* ---------- Grafiken der Welten ---------- */
function treeSvg(type,tx,ty,leaf){
  switch(type){
    case "palme": return palmSvg(tx-2,ty+26,1.15,leaf);
    case "tanne": return `<rect x="${tx-2.5}" y="${ty+16}" width="5" height="10" fill="#6B4430"/><path d="M${tx} ${ty-26}l-10 16h5l-9 13h6l-9 13h34l-9-13h6l-9-13h5z" fill="${leaf}"/>`;
    case "schneetanne": return `<rect x="${tx-2.5}" y="${ty+16}" width="5" height="10" fill="#6B4430"/><path d="M${tx} ${ty-26}l-10 16h5l-9 13h6l-9 13h34l-9-13h6l-9-13h5z" fill="${leaf}"/><path d="M${tx} ${ty-26}l-5 8h10zM${tx-9} ${ty-8}q9 4 18 0l-3-3h-12zM${tx-13} ${ty+5}q13 5 26 0l-3-3h-20z" fill="#F3F6F8"/>`;
    case "kaktus": return `<g fill="#6E9B4A" stroke="#557A38" stroke-width="1"><rect x="${tx-5}" y="${ty-16}" width="10" height="42" rx="5"/><path d="M${tx-5} ${ty+6}h-6a4 4 0 0 1-4-4v-12a3 3 0 0 1 6 0v9h4z"/><path d="M${tx+5} ${ty}h6a4 4 0 0 0 4-4v-10a3 3 0 0 0-6 0v7h-4z"/></g><circle cx="${tx}" cy="${ty-17}" r="2.4" fill="#E07AB8"/>`;
    default: return `<rect x="${tx-3}" y="${ty}" width="6" height="26" rx="2" fill="#8A5A3B"/><circle cx="${tx}" cy="${ty-6}" r="15" fill="${leaf}"/>`;
  }
}
function hutSvg(type,cx,night,sleep){
  const win=sleep?"#3A3D58":night?"#FFD27A":"#9CC8EE";
  switch(type){
    case "pfahl": return `<path d="M${cx+34} 160v-10M${cx+50} 160v-10M${cx+66} 160v-10" stroke="#8A5A3B" stroke-width="3"/><rect x="${cx+30}" y="150" width="40" height="3" fill="#A0703F"/><rect x="${cx+33}" y="132" width="34" height="18" fill="#D9B86A"/><path d="M${cx+36} 132v18M${cx+42} 132v18M${cx+58} 132v18M${cx+64} 132v18" stroke="#B8944E" stroke-width="1"/><path d="M${cx+26} 134l24-18 24 18z" fill="#C9A26A"/><path d="M${cx+28} 134l22-16 22 16" stroke="#A0803E" stroke-width="2" fill="none"/><rect x="${cx+45}" y="138" width="10" height="12" rx="1" fill="#7A5038"/><rect x="${cx+58}" y="137" width="6" height="6" fill="${win}"/>`;
    case "stuga": return `<rect x="${cx+30}" y="134" width="40" height="26" fill="#B8442E"/><path d="M${cx+30} 134h40M${cx+30} 160h40M${cx+30} 134v26M${cx+70} 134v26" stroke="#F3F1EA" stroke-width="2"/><path d="M${cx+26} 136l24-17 24 17z" fill="#3A3D58"/><rect x="${cx+45}" y="144" width="10" height="16" fill="#F3F1EA"/><rect x="${cx+47}" y="146" width="6" height="14" fill="#2F4A6E"/><rect x="${cx+57}" y="140" width="9" height="8" fill="${win}" stroke="#F3F1EA" stroke-width="1.6"/><rect x="${cx+34}" y="140" width="8" height="8" fill="${win}" stroke="#F3F1EA" stroke-width="1.6"/>`;
    case "lehm": return `<rect x="${cx+30}" y="136" width="40" height="24" rx="3" fill="#D9A86A"/><path d="M${cx+38} 136a12 12 0 0 1 24 0z" fill="#E8BE84"/><circle cx="${cx+50}" cy="122" r="2" fill="#C9A35A"/><path d="M${cx+44} 160v-12a6 6 0 0 1 12 0v12z" fill="#7A5038"/><rect x="${cx+60}" y="142" width="6" height="6" rx="3" fill="${win}"/><rect x="${cx+34}" y="142" width="6" height="6" rx="3" fill="${win}"/><path d="M${cx+30} 140h-3M${cx+30} 152h-3M${cx+70} 146h3" stroke="#A0703F" stroke-width="2"/>`;
    case "iglu": return `<path d="M${cx+28} 160a22 22 0 0 1 44 0z" fill="#F3F6F8"/><path d="M${cx+30} 152h40M${cx+33} 145h34M${cx+39} 139h22M${cx+40} 160v-8M${cx+52} 152v-7M${cx+60} 160v-8M${cx+46} 145v-6M${cx+56} 145v-6" stroke="#B9D3E6" stroke-width="1"/><path d="M${cx+38} 160v-6a8 8 0 0 1 16 0v6z" fill="#E6EEF3" stroke="#B9D3E6" stroke-width="1"/><path d="M${cx+42} 160v-4a4 4 0 0 1 8 0v4z" fill="${night||sleep?"#3A3D58":"#2F4A6E"}"/><g class="glow" style="animation-duration:3s"><circle cx="${cx+46}" cy="158" r="6" fill="${sleep?"transparent":"#FFD27A"}" opacity="${night&&!sleep?.6:0}"/></g>`;
  }
  return "";
}
function horizonSvg(type,small,night){
  const dim=night?' opacity=".55"':"";
  const y=small?132:170;
  switch(type){
    case "berge": return `<g${dim}><path d="M0 ${y} L34 ${y-48} L62 ${y-20} L104 ${y-66} L150 ${y-14} L196 ${y-58} L240 ${y-18} L290 ${y-54} L330 ${y-22} L360 ${y-40} V${y}Z" fill="#7C8FA3"/><path d="M34 ${y-48}l-8 12 8-3 7 4zM104 ${y-66}l-10 15 10-4 9 5zM196 ${y-58}l-9 13 9-3 8 4zM290 ${y-54}l-9 13 9-3 8 4z" fill="#F3F6F8"/></g>`;
    case "eis": return `<g${dim}><path d="M0 ${y} L40 ${y-40} L80 ${y-12} L130 ${y-56} L180 ${y-10} L232 ${y-46} L280 ${y-14} L330 ${y-50} L360 ${y-28} V${y}Z" fill="#E6EEF3"/><path d="M40 ${y-40}l-12 18M130 ${y-56}l-14 22M232 ${y-46}l-12 20M330 ${y-50}l-12 20" stroke="#B9D3E6" stroke-width="3"/></g>`;
    case "duenen": return `<g${dim}><path d="M0 ${y} q40-34 90-10 t100-14 100 6 70-8 V${y}Z" fill="#E3B266"/><path d="M0 ${y} q60-20 130-4 t120-6 110 2 V${y}Z" fill="#D9A55A"/></g>`;
    case "tropen": return `<g${dim}><ellipse cx="60" cy="${y}" rx="36" ry="7" fill="#5FB070"/><path d="M58 ${y-6}q1-8 3-12M61 ${y-18}q-6-1-9 2M61 ${y-18}q6-2 9 2" stroke="#3F8A52" stroke-width="1.6" fill="none"/><path d="M300 ${y} l22-34 22 34z" fill="#7C6A5A"/><path d="M314 ${y-22}l8-12 8 12z" fill="#5A4636"/></g>`;
  }
  return "";
}
/* Palme mit Wedeln, die sich am Stamm wiegen (SMIL: Drehpunkt exakt an der Krone) */
function palmSvg(x,y,k,leaf){
  const top=[x+5*k,y-27*k], fr=[[-160,1],[-125,.9],[-60,.95],[-20,1],[25,.8],[155,.85]];
  const rot=(a,d,t)=>`<animateTransform attributeName="transform" type="rotate" values="${a-d};${a+d};${a-d}" dur="${t}s" repeatCount="indefinite"/>`;
  let s=`<path d="M${x} ${y}q${2*k} ${-14*k} ${5*k} ${-27*k}" stroke="#9A6A3E" stroke-width="${3.6*k}" fill="none" stroke-linecap="round"/>`;
  for(let i=1;i<5;i++){const t=i/5, px=x+2*k*2*t*(1-t)+5*k*t*t;s+=`<path d="M${px-1.6*k} ${y-27*k*t}h${3.2*k}" stroke="#7A5038" stroke-width="${.8*k}"/>`}
  s+=`<g transform="translate(${top[0]} ${top[1]})">`;
  fr.forEach(([a,l],i)=>{s+=`<g transform="rotate(${a})">${rot(a,4,3.4+i*.35)}<path d="M0 0q${7*k*l} ${-6*k} ${17*k*l} ${2*k}q${-9*k*l} ${-1*k} ${-17*k*l} ${-2*k}z" fill="${leaf}"/><path d="M0 0q${7*k*l} ${-4.6*k} ${16*k*l} ${1.6*k}" stroke="#2F6B3F" stroke-width="${.5*k}" fill="none" opacity=".6"/></g>`});
  return s+`<circle cx="${-1.4*k}" cy="${1.6*k}" r="${1.9*k}" fill="#7A5038"/><circle cx="${1.6*k}" cy="${2*k}" r="${1.9*k}" fill="#8A5A3B"/></g>`;
}
/* Hängebrücke zwischen Haupt- und Nachbarinsel */
function bridgeSvg(wood){
  const a=[221,170], b=[252,165], m=[(a[0]+b[0])/2,(a[1]+b[1])/2+5];
  const deck=t=>{const u=1-t;return [u*u*a[0]+2*u*t*m[0]+t*t*b[0], u*u*a[1]+2*u*t*m[1]+t*t*b[1]]};
  let s=`<g><path d="M${a[0]} ${a[1]}Q${m[0]} ${m[1]} ${b[0]} ${b[1]}" stroke="#6B4430" stroke-width="2.4" fill="none"/>`;
  for(let i=0;i<=8;i++){const [x,y]=deck(i/8);s+=`<path d="M${x-1.3} ${y-1.6}l2.6 0 0 3.2-2.6 0z" fill="${wood}" stroke="#6B4430" stroke-width=".4"/>`}
  const rail=(dy,amp)=>`<path d="M${a[0]} ${a[1]-dy}Q${m[0]} ${m[1]-dy+3} ${b[0]} ${b[1]-dy}" stroke="#C9B48A" stroke-width=".9" fill="none"><animate attributeName="d" values="M${a[0]} ${a[1]-dy}Q${m[0]} ${m[1]-dy+3} ${b[0]} ${b[1]-dy};M${a[0]} ${a[1]-dy}Q${m[0]} ${m[1]-dy+3+amp} ${b[0]} ${b[1]-dy};M${a[0]} ${a[1]-dy}Q${m[0]} ${m[1]-dy+3} ${b[0]} ${b[1]-dy}" dur="4s" repeatCount="indefinite"/></path>`;
  s+=rail(8,1.2)+rail(5,.8);
  for(let i=1;i<8;i+=2){const [x,y]=deck(i/8);s+=`<path d="M${x} ${y-1}v${-5.5+Math.abs(i-4)*.3}" stroke="#C9B48A" stroke-width=".5"/>`}
  [a,b].forEach(([x,y])=>{s+=`<rect x="${x-1.3}" y="${y-10}" width="2.6" height="11" rx=".8" fill="#6B4430"/><circle cx="${x}" cy="${y-10}" r="1.4" fill="#8A5A3B"/>`});
  return s+`</g>`;
}
/* Delfin springt im Bogen aus dem Wasser */
function dolphinJump(r,x,y,i){
  const dur=4.6+(i%3)*.7, kt="0;0.45;0.85;1";
  return `<g transform="translate(${x} ${y})"><clipPath id="dclip${i}"><rect x="-40" y="-60" width="80" height="61"/></clipPath>
    <g clip-path="url(#dclip${i})"><g><animateMotion dur="${dur}s" begin="${-i*1.3}s" repeatCount="indefinite" path="M18 16Q0 -32 -18 16" keyPoints="0;0;1;1" keyTimes="${kt}" calcMode="linear"/>
      <g><animateTransform attributeName="transform" type="rotate" values="42;42;-42;-42" keyTimes="${kt}" dur="${dur}s" begin="${-i*1.3}s" repeatCount="indefinite"/>${figure(r,0,7)}</g></g></g>
    <path d="M-14 1q7-3 14 0t14 0" stroke="#5B7FB0" stroke-width="1.5" fill="none"/></g>`;
}
/* Erinnerungsbaum mit Licht und Namen */
function memorialSvg(m,leaf,type){
  const crown=type==="palme"?palmSvg(0,0,.8,leaf):type?treeSvg(type,0,-26,leaf):`<rect x="-2" y="-22" width="4" height="22" rx="1.5" fill="#8A5A3B"/><circle cx="0" cy="-27" r="10" fill="${leaf}"/><circle cx="-5" cy="-24" r="5" fill="${leaf}"/><circle cx="5" cy="-24" r="5" fill="${leaf}"/>`;
  return `<g><title>Erinnerungsbaum für ${esc(m.name)}</title>${crown}
    <g class="glow" style="animation-duration:3s"><circle cx="0" cy="-27" r="4" fill="#FFD27A" opacity=".55"/></g>
    <path d="M0 -29c-1.6-2-4.4-.6-3 1.6l3 2.6 3-2.6c1.4-2.2-1.4-3.6-3-1.6z" fill="#FF9C7A"/>
    <rect x="-9" y="1" width="18" height="6" rx="2" fill="#F3F1EA" opacity=".9"/><text y="5.6" text-anchor="middle" font-size="4.4" font-weight="800" fill="#3A3D58" font-family="Manrope, sans-serif">${esc((m.name||"").slice(0,9))}</text></g>`;
}

/* Bauwerke der neuen Welten: Position je nach freigeschalteten Inseln */
function worldStructs(W,cx,two,three){
  // Plätze: links auf der Hauptinsel, auf der Nachbarinsel hinter dem Brückenende, auf der dritten Insel
  const s0=[cx-70,174,1], i2a=two?[282,172,.9]:[cx+96,194,1], i2b=two?[330,160,.85]:[cx+62,190,1], i3=three?[292,216,.9]:[cx-68,196,1];
  const out=[], slots=three?[s0,i2a,i3,i2b]:[s0,i2a,i2b,i3];
  let k=0;
  W.projects.forEach(p=>{
    if(p.id===W.isle2||p.id===W.isle3) return;
    const q=p.sea?[74,222,.8]:slots[k++];
    // Wohnhäuser sind klein gezeichnet: größer, damit sie nicht kleiner als die Bewohner wirken
    const big={t_bambus:1.45,f_stugor:1.5,o_lehm:1.45,a_iglus:1.4}[p.id]||1;
    // Wohnhäuser stehen oben auf der Kuppel zwischen Baum und Haupthaus, damit unten am Strand Platz bleibt
    if(has(p.id)) out.push(big>1&&q===s0?{id:p.id,x:cx-8,y:130,sc:1.1*big/1.45,dome:true}:{id:p.id,x:q[0],y:q[1],sc:q[2]*big});
  });
  return out;
}

/* Gekaufte Gegenstände automatisch verteilen: Jeder Gegenstand nimmt den freien Platz,
   der am weitesten von den schon platzierten entfernt ist, und weicht Gebäuden und Bäumen aus. */
const ITEM_W={truhe:28,pokal:22,goldanker:26,siegerbanner:22,t_kanu:30,t_kokos:26,t_haengematte:30,t_orchidee:26,t_tiki:20,t_huette:32,t_surf:22,t_flamingo:22,f_kanu:30,f_schaukel:26,f_beeren:28,f_feuerschale:18,f_scheune:34,f_moos:24,f_wimpel:34,f_runen:14,o_teppich:34,o_dattel:28,o_tee:26,o_wasser:28,o_zelt:34,o_kaktus:26,o_laternen:16,a_eisloch:26,a_kakao:24,a_feuerkorb:16,a_eisbahn:38,a_huskys:44,a_schneemann:16,a_laternen:16,a_eisskulptur:18,teich:36,picknick:34,garten:32,sandburg:30,schaukel:30,spielplatz:28,haengematte:28,stall:28,blumen:28,palme:26,bank:26,feuer:22,brunnen:24,sternwarte:26,bienen:22,schirm:30,vogelhaus:20,zwerg:12,laternen:12,glocke:18,teleskop:28,muschelweg:34,regenbogen:34};
const ITEM_H={truhe:24,pokal:26,goldanker:28,siegerbanner:34,t_kokos:22,t_haengematte:28,t_tiki:26,t_huette:30,t_surf:28,t_flamingo:24,f_schaukel:36,f_scheune:28,f_wimpel:22,f_runen:22,o_dattel:36,o_tee:22,o_zelt:28,o_laternen:26,a_kakao:24,a_feuerkorb:28,a_huskys:16,a_schneemann:26,a_laternen:24,a_eisskulptur:16,palme:30,laternen:28,vogelhaus:30,schirm:26,glocke:28,sternwarte:30,schaukel:26,haengematte:20,spielplatz:22,stall:22,bienen:24,teleskop:24,feuer:24};
const FIXED_ITEMS={flagge:c=>[c.cx+50,122],lichter:c=>[c.cx+50,148],windspiel:c=>[c.cx+28,160],angel:c=>[c.cx+108,198]};
function layoutItems(cx,two,three,nTrees,extra,home){
  const out={}, S8=.8, ctx={cx};
  const blocks=[[cx+24,116,cx+76,162]].concat(extra||[]);                 // Hütte + Bauwerke der Welt
  if(home!==false){
  if(has("leuchtturm")) blocks.push([cx-73,74,cx-51,162]);
  if(has("windmuehle")) blocks.push([cx+76,118,cx+98,162]);
  if(has("baumhaus")) blocks.push([cx-118,118,cx-72,170]);
  if(hereItems().includes("laternen")) blocks.push([cx+86,146,cx+98,172]);
  for(let i=0;i<nTrees;i++){const tx=cx-40+i*22-(i%2)*6, ty=128+(i%2)*8;blocks.push([tx-6,ty-20,tx+6,ty+27])}
  if(has("festzelt")&&two) blocks.push([302,128,334,154]);
  if(has("strandhaus")&&two) blocks.push([246,142,278,170]);
  if(has("beachclub")&&three) blocks.push([272,196,310,218]);
  }
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
  // Erinnerungsbäume bekommen zuerst einen festen, gut sichtbaren Platz
  S.memorials.slice(-6).forEach((m,i)=>{const id="__mem"+i, w=20, h=34;
    const spot=pickSpot(w*.9,h*.9,true)||pickSpot(w*.75,h*.75,false); if(!spot) return;
    out[id]=[spot[0],spot[1],.9]; rects.push([spot[0]-w*.45,spot[1]-h*.9,spot[0]+w*.45,spot[1]]);});
  for(const id of hereItems()){
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
  const W=curWorld(), T=W.theme||{}, home=W.id==="heimat";
  const two=has(W.isle2), three=has(W.isle3);
  const lastD=S.days[S.days.length-1];
  const clouds=S.glueck<40||(lastD&&lastD.min>S.budget&&!lastD.sunny);
  const nTrees=1+Math.min(3,Math.floor(savedTotal()/600));
  const sk=skyNow(), sea=season(), sleep=sleeping();
  const night=sk.k==="nacht"||sleep;
  let s=`<svg viewBox="0 0 360 240" role="img" aria-label="Deine Insel mit ${here().length} Bewohnern, Inselglück ${S.glueck} Prozent">`;
  s+=`<rect width="360" height="240" fill="${clouds?"#2A2E40":night?"#1B2340":(!home&&sk.k==="tag")?T.sky:sk.sky}"/>`;
  // Polarlicht
  if(S.aurora>0&&night&&!clouds) s+=`<g class="glow" style="animation-duration:5s"><path d="M0 60q60-40 120-10t120-20 120 10v-30q-60-20-120 0t-120 10-120-10z" fill="#5BF0A4" opacity=".5"/><path d="M0 80q80-30 160 0t200-20v-14q-80 10-180-12t-180 20z" fill="#B6A4FF" opacity=".4"/></g>`;
  if(night&&!clouds){s+=`<g fill="#F3F1EA"><circle cx="30" cy="24" r="1.6"/><circle cx="110" cy="40" r="1.2"/><circle cx="200" cy="18" r="1.8"/><circle cx="300" cy="44" r="1.3"/><circle cx="250" cy="70" r="1"/></g><circle cx="320" cy="34" r="14" fill="#F3F1EA"/><circle cx="327" cy="29" r="13" fill="#1B2340"/>`}
  else if(sk.sun&&!clouds) s+=`<circle cx="${sk.sun[0]}" cy="${sk.sun[1]}" r="16" fill="${sk.sun[2]}"/>`;
  if(owns("regenbogen")&&!night) s+=`<g fill="none" stroke-width="5" opacity=".75"><path d="M40 170a140 120 0 0 1 280 0" stroke="#FF9C7A"/><path d="M46 170a134 114 0 0 1 268 0" stroke="#FFD27A"/><path d="M52 170a128 108 0 0 1 256 0" stroke="#C8F169"/><path d="M58 170a122 102 0 0 1 244 0" stroke="#7CB8E8"/><path d="M64 170a116 96 0 0 1 232 0" stroke="#B6A4FF"/></g>`;
  // Zugvögel
  if(S.birds>0) s+=`<g class="drift" style="animation-duration:5s">${[0,1,2,3,4].map(i=>`<path d="M${120+i*16} ${50+Math.abs(i-2)*8}q5-5 10 0q5-5 10 0" stroke="${night?"#F3F1EA":"#14151F"}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  if(!home) s+=horizonSvg(T.horizon,false,night||clouds);
  // Inselglück in Stufen: 0 karg, 1 normal, 2 blühend, 3 voller Leben
  const lvl=S.glueck<40?0:S.glueck<60?1:S.glueck<80?2:3, calm=clouds||night;
  // Tiefe: Nachbarinseln im Dunst hinter dem Meer (Heimat; andere Welten haben ihren eigenen Horizont)
  if(home) s+=`<g fill="${calm?"#2E4166":lvl?"#6E9FC6":"#8696A6"}" opacity=".55"><path d="M0 172c20-18 50-24 80-12l10 12z"/><path d="M290 172c18-14 44-18 70-8v8z"/></g>`;
  s+=`<rect y="170" width="360" height="70" fill="${clouds?"#26314A":night?"#24375A":home?sk.sea:T.sea}"/>`;
  let sand=clouds?"#BDB08C":"#E9D7A6", grass=clouds?"#5E8A5C":sea==="winter"?"#DDE6EE":sea==="herbst"?"#A9B86A":"#7FC57A";
  let leaf=clouds?"#4A7550":sea==="herbst"?"#E08A3C":sea==="winter"?"#5E8A6C":"#4E9A58";
  if(!home){sand=T.sand;grass=T.grass;leaf=T.leaf;if(clouds){sand="#BDB08C";grass="#7A8A70"}}
  if(home&&lvl===0&&sea!=="winter"){sand="#D6C9A4";grass="#B3A882";leaf="#9A8E7A"}   // karge Insel
  const cx=two?120:180;
  // Spiegelung und Glitzern im Wasser
  s+=`<ellipse cx="${cx}" cy="194" rx="100" ry="10" fill="${calm||!lvl?"#8FA0A8":"#9CD3C4"}" opacity="${calm?.12:lvl?.35:.2}"/>`;
  if(!clouds) s+=`<g stroke="#F3F1EA" stroke-linecap="round" stroke-width="1.6" opacity="${night?.35:lvl?.75:.3}">${[[40,190,14],[90,206,10],[250,200,16],[310,190,10],[150,222,12],[220,230,9],[60,228,8],[332,216,12]].slice(0,lvl?8:4).map(([x,y,w],i)=>`<path class="glow" style="animation-delay:${i*.3}s" d="M${x} ${y}h${w}"/>`).join("")}</g>`;
  s+=`<ellipse cx="${cx}" cy="176" rx="110" ry="20" fill="${sand}"/><path d="M${cx-96} 172c10-40 52-58 96-58s86 18 96 58z" fill="${grass}"/>`;
  // Blumenbogen oben auf der Kuppel: wächst mit dem Glück (hinter allem anderen gezeichnet)
  if(lvl>0&&sea!=="winter"&&(home||W.id==="tropen"||W.id==="fjord")){
    const fc=["#FF9C7A","#FFD27A","#B6A4FF","#FFB3C7","#F3F1EA"], pts=[];
    for(let i=0,px=cx-90;px<=cx+90;i++,px+=7){const top=172-58*Math.sqrt(Math.max(0,1-((px-cx)/96)**2)), y=top+(i%2?12:6); if(y<=166) pts.push([px+(i*13)%3-1,y,i])}
    pts.sort((a,b)=>Math.abs(a[0]-cx)-Math.abs(b[0]-cx)).slice(0,[0,6,14,99][lvl]).forEach(([x,y,i])=>{
      s+=`<g transform="translate(${x} ${y})"><path d="M0 0v-4" stroke="${leaf}" stroke-width="1"/><circle cy="-5" r="1.9" fill="${fc[i%5]}"/><circle cy="-5" r=".8" fill="#FFD27A"/></g>`});
  }
  // Weg aus Spaziergängen, Muschelweg
  if(S.path>0||owns("muschelweg")){const len=Math.min(160,20+S.path*14);s+=`<path d="M${cx-80} 168q${len/2} -10 ${len} -2" stroke="${owns("muschelweg")?"#F3F1EA":"#D9C38E"}" stroke-width="4" stroke-dasharray="${owns("muschelweg")?"2 5":"6 4"}" fill="none" stroke-linecap="round"/>`}
  if(home&&has("leuchtturm")){
    if(night&&!clouds) s+=`<path d="M${cx-62} 82L0 50v50z" fill="#FFD27A" opacity=".18"/>`;
    s+=`<path d="M${cx-70} 160h16l-3-72h-10z" fill="#F3F1EA"/><path d="M${cx-69} 146h14M${cx-68} 126h12M${cx-67} 106h10" stroke="#FF9C7A" stroke-width="5"/><rect x="${cx-68}" y="76" width="12" height="12" rx="2" fill="${night?"#FFD27A":"#E9E2C8"}"/>`;
  }
  // Wohnhäuser oben auf der Kuppel stehen hinter den Bäumen: zuerst zeichnen
  const ws=home?[]:worldStructs(W,cx,two,three);
  ws.filter(q=>q.dome).forEach(q=>{s+=`<g transform="translate(${q.x} ${q.y}) scale(${q.sc})">${projectSvg(q.id)}</g>`});
  for(let i=0;i<nTrees;i++){const tx=cx-40+i*22-(i%2)*6, ty=128+(i%2)*8;s+=treeSvg(home?"":T.tree,tx,ty,leaf);
    if(!home) continue;
    if(lvl===3&&sea!=="winter"&&!clouds) s+=`<g fill="#FF6B5A">${[[-7,-11],[6,-13],[0,-1],[10,-4],[-10,-2],[-1,-18]].map(([a,b])=>`<circle cx="${tx+a}" cy="${ty+b}" r="2"/>`).join("")}</g>`;
    if(sea==="fruehling"&&!clouds) s+=`<g fill="#FFB3C7"><circle cx="${tx-6}" cy="${ty-10}" r="2"/><circle cx="${tx+5}" cy="${ty-4}" r="2"/><circle cx="${tx+2}" cy="${ty-14}" r="2"/></g>`;
    if(sea==="winter") s+=`<path d="M${tx-14} ${ty-10}q14-14 28 0" stroke="#F3F1EA" stroke-width="4" fill="none" stroke-linecap="round"/>`;}
  const place=layoutItems(cx,two,three,nTrees,ws.map(q=>[q.x-26*q.sc,q.y-36*q.sc,q.x+26*q.sc,q.y]),home);
  // Gegenstände auf den Nebeninseln (x ≥ 244) erst nach diesen Inseln zeichnen, sonst verdecken die Inseln sie
  const memIds=S.memorials.slice(-6).map((m,i)=>"__mem"+i), mems=S.memorials.slice(-6);
  const drawItems=far=>hereItems().concat(memIds).filter(id=>place[id]&&(two&&place[id][0]>=244)===far).sort((a,b)=>place[a][1]-place[b][1]).forEach(id=>{const p=place[id];
    if(id.startsWith("__mem")){const m=mems[+id.slice(5)];s+=`<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})">${memorialSvg(m,leaf,home?"":T.tree)}</g>`;return}
    s+=`<g data-item="${id}" transform="translate(${p[0]} ${p[1]}) scale(${p[2]||.8})">${itemSvg(id)}</g>`});
  drawItems(false);
  if(hereItems().includes("laternen")) s+=`<g transform="translate(${cx+92} 170) scale(.8)">${itemSvg("laternen")}</g>`;
  if(S.sun>0&&!clouds&&!night) s+=`<g transform="translate(46 54) scale(.9)">${itemSvg("sonne")}</g>`;
  // Hütte (Licht aus, wenn alle schlafen)
  if(!home) s+=hutSvg(T.hut,cx,night,sleep);
  else s+=`<path d="M${cx+30} 160v-24l20-15 20 15v24z" fill="#F3F1EA"/><path d="M${cx+26} 138l24-18 24 18" fill="none" stroke="#FF9C7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="${cx+44}" y="144" width="11" height="16" rx="2" fill="#B6A4FF"/><rect x="${cx+57}" y="140" width="8" height="8" rx="1" fill="${sleep?"#3A3D58":night?"#FFD27A":"#9CC8EE"}"/>`;
  if(home&&sea==="winter") s+=`<path d="M${cx+26} 138l24-18 24 18" fill="none" stroke="#F3F1EA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(home&&has("windmuehle")) s+=`<path d="M${cx+82} 160h10l-1-30h-8z" fill="#F3F1EA"/><path d="M${cx+87} 130l-12-10M${cx+87} 130l12-10M${cx+87} 130l-9 12M${cx+87} 130l9 12" stroke="#FFB86B" stroke-width="3" stroke-linecap="round"/>`;
  if(home&&has("schiff")) s+=`<path d="M${two?160:260} 200h40l-7 10h-26z" fill="#FF9C7A"/><path d="M${two?180:280} 200v-22l12 18z" fill="#F3F1EA"/>`;
  if(two){
    s+=bridgeSvg(home?"#A0703F":T.bridge);
    s+=`<ellipse cx="300" cy="160" rx="56" ry="14" fill="${sand}"/><path d="M252 158c8-26 30-36 48-36s40 10 48 36z" fill="${grass}"/>`;
  }
  if(three){ s+=`<ellipse cx="300" cy="214" rx="40" ry="9" fill="${sand}"/><path d="M266 213c6-16 20-22 34-22s28 6 34 22z" fill="${grass}"/>`; }
  drawItems(true);
  // Neue Großprojekte
  const PPOS={baumhaus:[cx-40,196,.9],festzelt:two?[322,156,.95]:[cx+60,186,1],strandhaus:two?[282,172,.9]:[cx+96,194,1],beachclub:three?[292,216,.95]:two?[268,170,.95]:[cx-70,196,1],floss:[72,222,1]};
  ws.filter(q=>!q.dome).sort((a,b)=>a.y-b.y).forEach(q=>{s+=`<g transform="translate(${q.x} ${q.y}) scale(${q.sc})">${projectSvg(q.id)}</g>`});
  if(home) ["baumhaus","festzelt","beachclub","strandhaus","floss"].forEach(id=>{if(has(id)){const q=PPOS[id];s+=`<g transform="translate(${q[0]} ${q[1]}) scale(${q[2]})">${projectSvg(id)}</g>`}});
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
  // Tiere laufen neben ihrer Bezugsperson und bewegen sich im gleichen Takt
  const byId={}; placed.forEach(p=>{if(p.r.kind==="mensch")byId[p.r.id]=p});
  const follow={}; placed.forEach(p=>{if(p.r.kind==="tier"&&!p.still&&p.r.owner&&byId[p.r.owner]&&(follow[p.r.owner]||0)<2){const o=byId[p.r.owner], k=(follow[o.r.id]=(follow[o.r.id]||0)+1);
    p.x=o.x+(k===1?13:-13); p.y=o.y-1.2; p.follow=o.r.id}});
  placed.sort((a,b)=>a.y-b.y).forEach(({r,x,y,still,follow:fo},i)=>{
    const h=hsh(fo||r.id||r.name), idle=still||sleep||h%5===0;
    const wx=4+h%9, dur=7+(h>>>4)%8, del=-((h>>>8)%100)/10;
    s+=`<g transform="translate(${x} ${y})"><g class="${idle?"":"wander"}" style="--wx:${wx}px;animation-duration:${dur}s;animation-delay:${del}s"><g class="${sleep?"":"bob"}" style="animation-duration:${2.2+(h%9)/10}s;animation-delay:${-((h>>>3)%28)/10}s">${figure(r,0,0)}</g></g></g>`;
  });
  if(inside>0) s+=`<g transform="translate(${cx+50} 110)"><title>${inside} ${inside===1?"weitere Person ist":"weitere Bewohner sind"} gerade im Haus</title><rect x="-12" y="-8" width="24" height="13" rx="6.5" fill="#14151F" opacity=".78"/><text x="0" y="1.6" text-anchor="middle" font-size="8.5" font-weight="800" fill="#F3F1EA" font-family="Manrope, sans-serif">+${inside}</text></g>`;
  // Leben rund um die Insel, je nach Glück
  if(lvl>=2&&!calm){
    s+=[[cx-60,120],[cx+50,110],[cx-18,102]].map(([x,y],i)=>`<g class="flutter" style="animation-delay:${i*.7}s"><g transform="translate(${x} ${y})"><path d="M0 0l-4-3v6zM0 0l4-3v6z" fill="${["#B6A4FF","#F3F1EA","#FFB3C7"][i]}"/></g></g>`).join("");
    s+=`<g stroke="#2B3350" stroke-width="1.6" fill="none" stroke-linecap="round" class="drift" style="animation-duration:9s"><path d="M60 70q5-5 10 0q5-5 10 0"/><path d="M84 58q4-4 8 0q4-4 8 0"/></g>`;
    const fx=two?56:296;
    s+=`<g class="fishjump" transform="translate(${fx} 214)"><g class="fj-fish"><ellipse rx="5" ry="2.4" fill="#FF9C7A"/><path d="M4 0l4-3v6z" fill="#FF9C7A"/></g></g><g class="fj-ring" transform="translate(${fx+10} 215)" fill="none" stroke="#F3F1EA" stroke-width="1"><ellipse rx="5" ry="1.4"/><ellipse rx="9" ry="2.4" opacity=".5"/></g>`;
  }
  if(lvl===3&&!calm&&!S.trader&&!two) s+=`<g class="drift" style="animation-duration:14s"><g transform="translate(36 186) scale(.7)"><path d="M0 0h30l-5 7h-20z" fill="#B6A4FF"/><path d="M14 0v-24l12 22z" fill="#F3F1EA"/></g></g>`;
  // Tiefe: Büsche im Vordergrund an den Ecken
  if(home||W.id==="tropen"||W.id==="fjord"){
    const bc=night?"#1F3A2A":lvl?"#2F6B3E":"#55634F", gc=night?"#2C4F38":lvl?"#3F8A4E":"#6E7A5E";
    s+=`<g fill="${bc}">${[[-10,240,28],[30,248,20],[350,242,28],[384,234,24]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g><g stroke="${gc}" stroke-width="2.2" stroke-linecap="round" fill="none">${[[18,214],[28,210],[42,220],[318,216],[328,210],[340,218]].map(([x,y])=>`<path d="M${x} 240q-2-8 ${x%2?3:-3} -${240-y}"/>`).join("")}</g>`;
    if(lvl===3&&!night) s+=[[8,216,"#FFB3C7"],[38,226,"#FFD27A"],[330,222,"#F3F1EA"],[352,224,"#FF9C7A"]].map(([x,y,f])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${f}"/><circle cx="${x}" cy="${y}" r="1" fill="#FFD27A"/>`).join("");
  }
  // Meerestiere: freie Plätze im Wasser, nicht auf Floß, Schiff oder der dritten Insel
  const blocked=[];
  if((home&&has("floss"))||W.projects.some(p=>p.sea&&has(p.id))) blocked.push([50,98]);
  if(home&&has("schiff")) blocked.push(two?[154,206]:[254,306]);
  if(three) blocked.push([222,324]);
  const seaSlots=[[140,234],[322,228],[30,220],[126,236],[342,230],[200,232],[240,214],[290,232],[64,232],[28,226]], used=[];
  const free=(x,h)=>!blocked.some(([a,b])=>x+h>a&&x-h<b)&&!used.some(u=>Math.abs(u.x-x)<u.h+h-4)&&x-h>=-6&&x+h<=366;
  seaP.slice().sort((a,b)=>(b.art==="Wal")-(a.art==="Wal")).forEach((r,i)=>{
    const h=r.art==="Wal"?24:18, sl=seaSlots.find(([x])=>free(x,h))||seaSlots[i%seaSlots.length]; used.push({x:sl[0],h});
    if(r.art==="Delfin"){s+=dolphinJump(r,sl[0],sl[1],i);return}
    const sc=r.art==="Wal"?.75:1;   // im Bild etwas kleiner als in der Übersicht
    s+=`<g class="wave fb" style="animation-delay:${i*0.5}s"><g transform="translate(${sl[0]} ${sl[1]}) scale(${sc})">${figure(r,0,0)}</g></g><path d="M${sl[0]-14} ${sl[1]+1}q7 -3 14 0t14 0" stroke="#5B7FB0" stroke-width="1.5" fill="none"/>`});
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
  const sig=card.animal?`<svg width="44" height="30" viewBox="${SEA.includes(card.animal)?artVB(card.animal,44/30):"-22 -24 44 30"}" aria-hidden="true">${animalSvg(card.animal)}</svg>`:"";
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
  const p=curProjects()[S.projectIdx];
  const warn=S.warn?S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean):null;
  const wh=whispers();
  const wisher=S.wish?S.residents.find(r=>r.id===S.wish.rid):null;
  const canNight=feature("nacht")&&S.lastDay&&!sleeping()&&(S.testmode||S.lastDay===today())&&!(S.night&&S.night.after===S.lastDay);
  const mons=(S.monsters||[]).map(id=>S.apps.find(a=>a.id===id)).filter(Boolean);
  const guard=S.vacation&&S.vacation.guard?S.residents.find(r=>r.id===S.vacation.guard):null;
  const closeFirst=ok&&(new Date().getHours()>=17||S.testmode);
  const entry=ok&&(closeFirst||ENTRY_OPEN);
  const form=`<div id="closeCard" class="entry">
    ${S.repair?`<p class="small" style="color:var(--amber)">Reparatur möglich: Bleib heute im Budget, dann holst du ${S.repair.amount} % Glück zurück.</p>`:""}
    <p class="small muted" id="stNote">Trag die Bildschirmzeit für ${nd===today()?"heute":nice(nd)} aus deinen Handy-Einstellungen ein. Budget: ${hm(S.budget)}.</p>
    <div class="time">
      <label class="field" for="inH">Stunden<input id="inH" type="number" min="0" max="24" inputmode="numeric" value="${last?Math.floor(last.min/60):2}"></label>
      <label class="field" for="inM">Minuten<input id="inM" type="number" min="0" max="59" step="5" inputmode="numeric" value="${last?last.min%60:30}"></label>
    </div>
    <div class="goal-bar" id="liveBar" aria-hidden="true"><i></i><span class="goal-mark"></span></div>
    <p class="small" id="liveTxt" aria-live="polite" style="font-weight:700;margin-top:-4px"></p>
    ${feature("monster")?`<details><summary style="cursor:pointer;font-weight:700;min-height:44px;display:flex;align-items:center">Pro App eintragen (für die App-Monster)</summary>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:6px">${S.apps.map(a=>`<label class="field" for="app_${a.id}" style="font-size:13px">${esc(a.name)} <span class="muted" style="font-weight:500">Limit ${a.limit} min</span><input id="app_${a.id}" type="number" min="0" max="1440" inputmode="numeric" placeholder="Minuten"></label>`).join("")}</div>
    </details>`:""}
    <button class="btn" id="closeBtn">Tag abschließen</button></div>`;
  const [gl,glC]=[S.glueck+" %",mCls==="good"?"var(--lime)":mCls==="ok"?"var(--amber)":"var(--coral)"];
  return `
  <div class="scene-chips">
    <div class="cp"><i>Glück</i><b style="color:${glC}">${gl}</b></div>
    <div class="cp"><i>Bewohner</i><b>${occupied()}/${capacity()}</b></div>
    <div class="cp"><i>Punkte</i><b style="color:var(--lilac)">${S.points}</b></div>
  </div>
  ${S.vacation?`<div class="card" style="border:1.5px solid var(--lilac)"><p class="label" style="color:var(--lilac)">Urlaubsmodus</p><p>${guard?`<b>${esc(guard.name)}</b> hütet die Insel, bis du zurück bist.`:"Die Insel schläft, bis du zurück bist."} Das Glück sinkt in der Zeit nicht.</p><button class="btn secondary" id="vacOff">Ich bin zurück</button></div>`:""}
  ${heuteMain(ok,nd,entry?form:"")}
  ${warn?`<div class="card warn"><p class="label" style="color:var(--amber)">Wegzug droht</p><p><b>${esc(groupName(warn))}</b> ${vb(warn,"packt","packen")} die Koffer. Bring das Inselglück bis ${nice(S.warn.deadline)} über 40 %, dann ${vb(warn,"bleibt "+esc(warn[0].name),"bleiben alle")}.</p></div>`:""}
  ${planCard()}
  ${forYou(wisher)}
  ${mons.length?`<div class="card" style="border:1.5px solid #9B6BD6"><p class="label" style="color:#C8A8FF">App-Monster vor der Insel</p>${mons.map(a=>`<div class="row"><svg width="48" height="40" viewBox="-24 -34 48 40" aria-hidden="true">${monsterSvg(a.m)}</svg><p class="grow">${esc(monName(a,false))}: ${esc(a.name)} lag gestern über ${hm(a.limit)}.</p></div>`).join("")}<p class="small muted">Bleib heute bei diesen Apps unter dem Limit, dann tauchen sie wieder ab.</p></div>`:""}
  ${S.setup?`<div class="sec-h"><span>Inselgeflüster</span>${wh.length>1?`<button class="linkbtn" id="whMore">mehr ›</button>`:""}</div>
  <div class="card whisper">${whisperRow(null,lucLine())}${wh.slice(0,1).map(w=>whisperRow(w.r,w.t)).join("")}</div>`:""}
  ${feature("boot")||feature("nacht")?`<div class="sec-h"><span>Handy weg</span></div>
  <div class="tiles2">
    ${feature("boot")?`<div class="tile"><span class="tile-ic">⛵</span><b>Fokus-Bootsfahrt</b>${S.boat?`<span class="small muted">Das Boot ist draußen. Leg das Handy weg, bis es zurück ist.</span>`
      :`<span class="small muted">Handy weg, ein Bewohner fährt fischen.</span><div class="boat-row">${[15,25,45,60].map(m=>`<button class="mini" data-boat="${m}" ${adults().length?"":"disabled"}>${m}</button>`).join("")}</div>`}</div>`:""}
    ${feature("nacht")?`<div class="tile${canNight?"":" off"}"><span class="tile-ic">🌙</span><b>Gute Nacht, Insel</b>${canNight?`<span class="small muted">Handy weg, morgen +15 Traumpunkte.</span><button class="mini wide" id="nightBtn">Gute Nacht</button>`
      :`<span class="small muted">${sleeping()?"Die Insel schläft. Bis morgen!":"Geht nach dem Eintragen."}</span>`}</div>`
    // noch gesperrt: als gestrichelte Kachel zeigen, damit die Reihe von Anfang an vollständig ist
    :(()=>{const nf=FEATURES.find(x=>x.id==="nacht"), left=nf?nf.day-S.dayCount:0;
      return `<div class="tile dashed"><span class="tile-ic" style="opacity:.5">🌙</span><b>Gute Nacht, Insel</b><span class="small muted">Bald freigeschaltet · ${left<=1?"nach dem nächsten Tag":"in "+left+" Tagen"}</span></div>`})()}
  </div>`:""}
  ${friendsCard()}
  ${devMode()||S.testmode?`<div class="card">
    <div class="row between"><p class="label">Testmodus</p><label class="check" for="tm" style="min-height:auto"><input type="checkbox" id="tm" ${S.testmode?"checked":""}> an</label></div>
    <p class="small muted">Im Testmodus kannst du beliebig viele Tage nacheinander eintragen oder zufällig simulieren.</p>
    ${S.testmode?`<div class="row"><button class="btn secondary grow" id="simGood">Guter Tag</button><button class="btn secondary grow" id="simBad">Schlechter Tag</button></div>
    <button class="btn ghost" id="sim10">10 Tage gemischt</button>
    <button class="btn ghost" id="resetBtn">Spielstand zurücksetzen</button>`:""}
  </div>`:""}`;
}
let ENTRY_OPEN=false;
function ringSvg(pct,big,small,col){
  return `<svg class="ring" width="92" height="92" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" fill="none" stroke="#2C2F45" stroke-width="3.4"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="${col}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${Math.max(.02,Math.min(1,pct))*97.4} 97.4" transform="rotate(-90 18 18)"/><text x="18" y="17.6" text-anchor="middle" font-size="${String(big).length>4?6.2:7}" font-weight="800" fill="#F3F1EA" font-family="Manrope, sans-serif">${big}</text><text x="18" y="23.4" text-anchor="middle" font-size="3.6" fill="#A4A6BD" font-family="Manrope, sans-serif">${small}</text></svg>`;
}
/* Heute: Hauptkarte mit Ring (letzter eingetragener Tag) und Eintragen */
function heuteMain(ok,nd,form){
  const last=S.days[S.days.length-1], week=S.days.slice(-7), good=last&&last.min<=S.budget;
  const col=!last?"#C8F169":good?"#C8F169":"#FF9C7A", pct=last?Math.min(1,last.min/S.budget):0;
  const big=last?Math.floor(last.min/60)+":"+String(last.min%60).padStart(2,"0"):String(Math.round(S.budget/60*10)/10).replace(".",",")+" h";
  const ring=`<svg class="ring" width="92" height="92" viewBox="0 0 36 36" role="img" aria-label="${last?hm(last.min)+" von "+hm(S.budget):"Tagesziel "+hm(S.budget)}"><circle cx="18" cy="18" r="15.5" fill="none" stroke="#2C2F45" stroke-width="3.4"/>${last?`<circle cx="18" cy="18" r="15.5" fill="none" stroke="${col}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${Math.max(.02,pct)*97.4} 97.4" transform="rotate(-90 18 18)"/>`:""}<text x="18" y="17.6" text-anchor="middle" font-size="${big.length>4?6.2:7}" font-weight="800" fill="#F3F1EA" font-family="Manrope, sans-serif">${big}</text><text x="18" y="23.4" text-anchor="middle" font-size="3.6" fill="#A4A6BD" font-family="Manrope, sans-serif">${last?"von "+hm(S.budget):"pro Tag"}</text></svg>`;
  const pl=S.plan&&!S.plan.res&&S.plan.day>today()?PLANS.find(x=>x.id===S.plan.id):null;   // Vorhaben für heute hat eine eigene Karte
  const joker=last?(S.jokerWk===isoWeek(today())?"🃏 Joker genutzt":"🃏 Joker bereit"):"";
  const sub=[pl?"Vorhaben morgen: "+esc(pl.n):"",joker].filter(Boolean).join(" · ");
  const dots=week.length?`<div class="wk-dots" role="img" aria-label="${week.filter(d=>d.min<=S.budget).length} von ${week.length} Tagen im Ziel">${week.map(d=>`<span title="${nice(d.day)}: ${hm(d.min)}"><i style="background:${d.min<=S.budget?"var(--lime)":"var(--coral)"}"></i>${parse(d.day).toLocaleDateString("de-DE",{weekday:"narrow"})}</span>`).join("")}</div>`:"";
  return `<div class="card hmain">
    <div class="row" style="gap:14px;align-items:center">${ring}<div class="grow">
      <p class="label">${last?dayLabel(last.day):"Dein Tagesziel"}</p>
      <h3 class="hm-title" style="color:${last?col:"var(--ink)"}">${last?(good?hm(S.budget-last.min)+" unter dem Ziel":hm(last.min-S.budget)+" über dem Ziel"):hm(S.budget)+" Bildschirmzeit"}</h3>
      ${sub?`<p class="small muted">${sub}</p>`:last?"":`<p class="small muted">Trag abends ein, wie lange du am Handy warst.</p>`}
      ${S.budgetStreak>1?`<p class="small" style="color:var(--lime);font-weight:700">${S.budgetStreak} Tage in Folge im Ziel</p>`:""}
    </div></div>
    ${dots}
    ${form||(ok?`<button class="btn" id="goalGo">${nd===today()?"Tag eintragen":"Tag eintragen · "+nice(nd)}</button>`:S.vacation?"":`<p class="small" style="color:var(--lime);font-weight:700">Heute ist eingetragen. Bis morgen!</p>`)}
  </div>`;
}
/* Für dich: Kapitel, Wunsch, Wochenrückblick, Neues als Wischkarten */
function forYou(wisher){
  const it=[];
  if(S.chapter!=null&&S.setup){const c=CHAPTERS[S.chapter]; if(c){const pr=c.prog();
    it.push(`<div class="fy"><div class="row" style="gap:10px"><span class="says-pic" style="background:#2A2F45;width:38px;height:38px">${bayPic(34)}</span><div><p class="k" style="color:var(--amber)">Kapitel ${S.chapter+1}</p><b>${esc(c.n)}</b></div></div><p class="small muted">${esc(pr||c.goal)}</p></div>`)}}
  if(S.wish&&wisher){const w=S.wish, type=w.type||"item";
    it.push(`<div class="fy"><p class="k" style="color:var(--lilac)">Wunsch von ${esc(wisher.name)}</p><b>${esc(wishText(w))}</b><p class="small muted">+${w.pts||30} Punkte · +${w.gl||6} % Glück${type==="streak"?` · ${w.have}/${w.need} Tage`:""}</p>${type==="item"?`<button class="linkbtn" id="wishShop">Zum Laden ›</button>`:""}</div>`)}
  if(S.weekReady&&today()<=S.weekReady.until)
    it.push(`<div class="fy"><p class="k" style="color:var(--lime)">Neu</p><b>Inselwoche KW ${+S.weekReady.wk.split("-W")[1]}</b><button class="linkbtn" id="weekReadyBtn">Ansehen ›</button></div>`);
  const f=nextFeature(); if(f&&S.setup){const left=f.day-S.dayCount;
    it.push(`<div class="fy dashed"><p class="k" style="color:var(--muted)">Bald freigeschaltet</p><b>${esc(f.name)}</b><p class="small muted">${left<=1?"Nach dem nächsten Tag":"In "+left+" Tagen"}</p></div>`)}
  if(!it.length) return "";
  return `<div class="sec-h"><span>Für dich</span></div><div class="fy-row">${it.join("")}</div>`;
}
function whisperRow(r,t){
  const pic=r?`<div class="avatar" style="background:${r.kind==="mensch"?"#26233D":SEA.includes(r.art)?"#1F2A3A":"#22301F"}"><svg width="40" height="40" viewBox="${figVB(r)}" aria-hidden="true">${figure(r,0,0)}</svg></div>`:`<div class="avatar" style="background:#26233D">${lucPic(40)}</div>`;
  return `<div class="row" style="align-items:flex-start">${pic}<div class="grow bubble"><p class="small" style="font-weight:700;color:var(--lilac)">${r?esc(r.name)+(r.job?" · "+esc(jobName(r.job)):""):"Lucifer · Inselkatze"}</p><p>${esc(t)}</p></div></div>`;
}
function whisperSheet(){
  sheet(`<p class="label">Inselgeflüster</p><h2>Was heute erzählt wird</h2><div class="whisper" style="display:flex;flex-direction:column;gap:10px">${whisperRow(null,lucLine())}${whispers().map(w=>whisperRow(w.r,w.t)).join("")}</div><button class="btn" data-ok>Schließen</button>`);
}
/* Entwicklermodus: 7-mal auf die Versionszeile in den Einstellungen tippen (lokal immer an) */
const APP_VERSION="1.31";
function devMode(){try{return localStorage.getItem("offland-dev")==="1"||/^(localhost|127\.0\.0\.1)$/.test(location.hostname)}catch(e){return false}}
/* „Heute“, „Gestern“ oder Datum */
function dayLabel(d){return d===today()?"Heute":d===addDays(today(),-1)?"Gestern":nice(d)}
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
    owner?(r.sad?"vermisst "+owner.name+", wartet am Steg":"gehört zu "+owner.name):"", r.wishDone||(r.happyUntil||0)>S.dayCount?"strahlt (Wunsch erfüllt)":"",
    partner?(r.married?"verheiratet mit ":"Partner:in ")+partner.name:"",
    r.kind==="mensch"&&r.ex&&r.ex.length&&!partner?"getrennt von "+((S.residents.find(x=>x.id===r.ex[r.ex.length-1])||{}).name||""):"",
    r.kind==="mensch"&&partner?(()=>{const st=S.residents.filter(k=>k.status!=="verstorben"&&k.parents&&k.parents.includes(partner.id)&&!k.parents.includes(r.id));return st.length?"Stiefelternteil von "+nameList(st.map(k=>k.name)):""})():"",
    r.kind==="mensch"?(()=>{const pets=here().filter(p=>p.kind==="tier"&&p.owner===r.id);return pets.length?"Tiere: "+pets.map(p=>p.name).join(", "):""})():"",
    friend?"befreundet mit "+friend[0].name:"", foe?"zerstritten mit "+foe[0].name:"", parents.length?"Kind von "+parents.map(p=>p.name).join(" & "):"", r.status==="weg"?"Rückkehr "+r.ret+"/5 gute Tage":""].filter(Boolean).join(" · ");
  const bg=r.kind==="mensch"?"#26233D":SEA.includes(r.art)?"#1F2A3A":"#22301F";
  return `<div class="res"><div class="avatar" style="background:${bg}"><svg width="40" height="40" viewBox="${figVB(r)}" aria-hidden="true">${figure(r,0,0)}</svg></div>
    <div class="grow"><p><b>${esc(r.name)}</b></p><p class="small muted">${esc(sub||"Bewohner:in")}</p></div>
    <span class="chip ${mCls}">${mText}</span>
    ${r.sick&&S.tea>0?`<button class="iconbtn" style="width:44px;height:44px;background:#22301F" data-tea="${r.id}" aria-label="${esc(r.name)} Kräutertee geben"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8F169" stroke-width="2" stroke-linecap="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></svg></button>`:""}
    ${r.status==="da"?`<button class="iconbtn" style="width:44px;height:44px" data-rename="${r.id}" aria-label="${esc(r.name)} bearbeiten"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B6A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button>`:""}
  </div>`;
}
function viewBewohner(){
  const humans=S.residents.filter(r=>r.kind==="mensch"&&r.status!=="verstorben"), animals=S.residents.filter(r=>r.kind==="tier"&&r.status!=="verstorben");
  const H=here(), land=H.filter(r=>!isSea(r)), happy=H.filter(r=>!r.sick&&!r.sad&&!r.phone).length;
  const [mText,mCls]=mood(), glC=mCls==="good"?"var(--lime)":mCls==="ok"?"var(--amber)":"var(--coral)";
  // Bild: alle Bewohner auf einer Wiese
  const show=land.slice(0,10), gap=Math.min(36,320/Math.max(1,show.length));
  const strip=`<svg viewBox="0 0 360 200" role="img" aria-label="${H.length} Bewohner" style="width:100%;height:auto;display:block"><rect width="360" height="200" fill="#86BFE6"/><circle cx="312" cy="34" r="14" fill="#FFE7A3"/><path d="M-20 200c20-80 120-120 200-120s180 40 200 120z" fill="#7FC57A"/><path d="M-20 200c40-30 120-44 200-44s160 14 200 44z" fill="#6DB56A"/>${show.map((r,i)=>`<g transform="translate(${180-(show.length-1)*gap/2+i*gap} ${120+(i%2)*10}) scale(1.6)"><g class="bob" style="animation-delay:${(i*.3)%2}s">${figure(r,0,0)}</g></g>`).join("")}</svg>`;
  const wisher=S.wish?S.residents.find(r=>r.id===S.wish.rid&&r.status==="da"):null;
  const main=S.wish&&wisher?wishCard(S.wish,wisher)
    :`<div class="card"><div class="row" style="gap:14px;align-items:center">${ringSvg(S.glueck/100,S.glueck+" %","Inselglück",S.glueck>=40?"#C8F169":"#FF9C7A")}<div class="grow"><p class="label">Inselglück</p><h3 class="hm-title" style="color:${glC}">${mText}</h3><p class="small muted">Ab 80 % zieht alle 3 Tage jemand ein. Unter 40 % gibt es öfter Streit, nach 3 Tagen droht Wegzug.</p></div></div></div>`;
  const news=[];
  if(S.conflict){const a=S.residents.find(r=>r.id===S.conflict.a), b=S.residents.find(r=>r.id===S.conflict.b); if(a&&b) news.push(`<div class="fy"><p class="k" style="color:var(--coral)">Streit</p><b>${esc(a.name)} und ${esc(b.name)}</b><p class="small muted">Ein guter Tag hilft beim Versöhnen.</p></div>`)}
  H.filter(r=>r.sick).forEach(r=>news.push(`<div class="fy"><p class="k" style="color:var(--amber)">Krank</p><b>${esc(r.name)}</b><p class="small muted">${esc(r.sick.kind)}${S.tea?" · Kräutertee im Vorrat":""}</p></div>`));
  H.filter(r=>r.phone).slice(0,2).forEach(r=>news.push(`<div class="fy"><p class="k" style="color:var(--lilac)">Am Handy</p><b>${esc(r.name)}</b><p class="small muted">Ein Tag im Budget holt jemanden zurück.</p></div>`));
  if(S.warn){const w=S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean); if(w.length) news.push(`<div class="fy"><p class="k" style="color:var(--amber)">Wegzug droht</p><b>${esc(groupName(w))}</b><p class="small muted">Glück bis ${nice(S.warn.deadline)} über 40 %</p></div>`)}
  return `
  <div class="hero-card">${strip}</div>
  <div class="scene-chips">
    <div class="cp"><i>Menschen</i><b>${H.filter(r=>r.kind==="mensch").length}</b></div>
    <div class="cp"><i>Tiere</i><b>${H.filter(r=>r.kind!=="mensch").length}</b></div>
    <div class="cp"><i>Glück</i><b style="color:${glC}">${S.glueck} %</b></div>
  </div>
  ${main}
  ${news.length?`<div class="sec-h"><span>Gerade los</span></div><div class="fy-row">${news.join("")}</div>`:""}
  <div class="sec-h"><span>Menschen</span><span class="small muted" style="text-transform:none;letter-spacing:0">${occupied()}/${capacity()} Plätze</span></div>
  <div class="card">${humans.map(resRow).join("")||`<p class="muted">Noch niemand.</p>`}</div>
  <div class="sec-h"><span>Tiere</span></div>
  <div class="card">${animals.map(resRow).join("")||`<p class="muted">Noch keine Tiere.</p>`}</div>
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
  const tag=r=>`<span style="display:inline-flex;align-items:center;gap:4px;background:var(--ground);border-radius:999px;padding:3px 10px 3px 4px;font-size:13px;font-weight:700;${r.status!=="da"?"opacity:.5":""}" title="${r.status==="verstorben"?"in Erinnerung":""}"><svg width="22" height="22" viewBox="${figVB(r)}" aria-hidden="true">${figure(r,0,0)}</svg>${esc(r.name)}</span>`;
  return `<div class="card"><p class="label">Stammbaum</p>${fams.filter(f=>f.b||f.kids.length).map(f=>`<div style="display:flex;flex-direction:column;gap:6px;padding:6px 0;border-top:1px solid var(--card2)">
    <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${tag(f.a)}${f.b?`<span class="muted">${f.a.married?"💍":"♥"}</span>${tag(f.b)}`:""}${(()=>{const ex=(f.a.ex||[]).map(id=>S.residents.find(x=>x.id===id)).filter(Boolean);return ex.length?`<span class="small muted">· getrennt von</span>${ex.map(tag).join("")}`:""})()}</div>
    ${f.kids.length?`<div style="display:flex;flex-wrap:wrap;gap:6px;padding-left:18px;border-left:2px solid var(--line);margin-left:12px">${f.kids.map(tag).join("")}</div>`:""}</div>`).join("")||`<p class="small muted">Noch keine Familien. Paare entstehen durch Zuzug oder wenn sich zwei verlieben.</p>`}</div>`;
}
function viewChronik(){
  return feedCard("chron","Inselchronik",S.chronicle.slice().reverse().map(c=>({text:c.text,day:c.day,kind:"info"})),"Hier stehen die großen Momente deiner Bewohner.");
}
/* Tagebuch und Chronik: kompakt die neuesten Einträge, alles andere im Fenster nach Tagen */
const FEED_COL={good:"var(--lime)",bad:"var(--coral)",info:"var(--lilac)"};
const feedLi=f=>`<li><span class="dot" style="background:${FEED_COL[f.kind]||FEED_COL.info}"></span><div><p>${esc(f.text)}</p></div></li>`;
function dayHead(d){if(!d) return "Früher"; const t=today(); return d===t?"Heute":d===addDays(t,-1)?"Gestern":nice(d)}
function feedCard(key,title,items,empty){
  const top=items.slice(0,3);
  return `<div class="card feed"><div class="row between"><p class="label">${title}</p>${items.length?`<span class="small muted num">${items.length} Einträge</span>`:""}</div>
    <ul>${top.map(f=>`<li><span class="dot" style="background:${FEED_COL[f.kind]||FEED_COL.info}"></span><div><p>${esc(f.text)}</p>${f.day?`<p class="small muted">${dayHead(f.day)}</p>`:""}</div></li>`).join("")||`<li><p class="muted">${empty}</p></li>`}</ul>
    ${items.length>3?`<button class="btn secondary" data-feed="${key}">Alle anzeigen</button>`:""}</div>`;
}
function feedSheet(key){
  stat(key==="chron"?"chronik_alle":"tagebuch_alle");
  const all=key==="chron"?S.chronicle.slice().reverse().map(c=>({text:c.text,day:c.day,kind:"info"})):S.feed.slice();
  const title=key==="chron"?"Inselchronik":"Inseltagebuch";
  let filt="all", shown=30;
  const draw=()=>{
    const list=all.filter(f=>filt==="all"||f.kind===filt), groups=[];
    list.slice(0,shown).forEach(f=>{const g=groups[groups.length-1]; if(g&&g.day===f.day) g.items.push(f); else groups.push({day:f.day,items:[f]})});
    $("#feedBody").innerHTML=groups.map(g=>`<p class="feed-day">${dayHead(g.day)}</p><ul class="feed">${g.items.map(feedLi).join("")}</ul>`).join("")||`<p class="muted">Keine Einträge.</p>`
      +(list.length>shown?`<button class="btn ghost" id="feedMore">Ältere anzeigen</button>`:"");
    const m=$("#feedMore"); if(m) m.onclick=()=>{shown+=30;draw()};
    document.querySelectorAll("#modalRoot [data-ff]").forEach(b=>{b.classList.toggle("on",b.dataset.ff===filt);b.setAttribute("aria-pressed",b.dataset.ff===filt)});
  };
  sheet(`<p class="label">${title}</p><h2>${key==="chron"?"Die großen Momente":"Was auf der Insel passiert ist"}</h2>
    ${key==="chron"?"":`<div class="feed-filter">${[["all","Alles"],["good","Schönes"],["bad","Holpriges"],["info","Neuigkeiten"]].map(([k,n])=>`<button type="button" class="chip" data-ff="${k}">${n}</button>`).join("")}</div>`}
    <div id="feedBody" class="feed-body"></div><button class="btn" data-ok>Schließen</button>`);
  document.querySelectorAll("#modalRoot [data-ff]").forEach(b=>b.onclick=()=>{filt=b.dataset.ff;shown=30;draw()});
  draw();
}
function viewArten(){
  const seen=new Set(S.residents.filter(r=>r.kind==="tier").map(r=>r.art));
  const all=LAND.concat(SEA).concat(FAR_ANIMALS);
  return `<div class="card"><div class="row between"><p class="label">Tierarten entdeckt</p><span class="small muted num">${all.filter(a=>seen.has(a)).length} / ${all.length}</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${all.map(a=>{const ok=seen.has(a);
    return `<div style="background:var(--ground);border-radius:14px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;${ok?"":"opacity:.4"}">
      <svg width="48" height="34" viewBox="${artVB(a,48/34)}" aria-hidden="true">${ok?animalSvg(a):`<g opacity=".5" style="filter:brightness(0) invert(.45)">${animalSvg(a)}</g>`}</svg>
      <span style="font-size:${ok&&a.length>9?"9.5px":"11px"};letter-spacing:${ok&&a.length>9?"-.2px":"0"};font-weight:700;text-align:center;line-height:1.2;max-width:100%">${ok?(a==="Meerschweinchen"?"Meer&shy;schweinchen":a):"?"}</span></div>`}).join("")}</div>
  <p class="small muted">Delfine und Wale kommen erst, wenn der Leuchtturm steht. Papagei, Elch, Kamel und Eisbär leben nur in fernen Inselwelten.</p></div>`;
}
function viewAlbum(){
  const have=new Set(S.postcards.map(c=>c.motif));
  return `<div class="card"><div class="row between"><p class="label">Motive</p><span class="small muted num">${have.size} / ${MOTIFS.length} Motive</span></div>
  <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">${MOTIFS.map(m=>have.has(m.id)
    ?`<div style="border-radius:8px;overflow:hidden;border:2px solid #F3F1EA">${motifSvg(m,true)}</div>`
    :`<div style="border-radius:8px;border:1.5px dashed var(--line);aspect-ratio:350/120;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C7F99" stroke-width="2" stroke-linecap="round" aria-label="Noch nicht gesammelt"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></div>`).join("")}</div>
  </div>`;
}
function viewZeit(){
  const n=S.days.length;
  const saved=savedTotal();
  const over=S.days.reduce((a,d)=>a+Math.max(0,d.min-S.budget),0);
  const total=S.days.reduce((a,d)=>a+d.min,0);
  const avg=n?total/n:S.baseline;
  const yearOld=S.baseline*365/60/24, yearNow=avg*365/60/24;
  const week=S.days.slice(-7), prev=S.days.slice(-14,-7);
  const sum=a=>a.reduce((x,d)=>x+d.min,0);
  // Bild: gewonnene Zeit groß, daneben die letzten 7 Tage als Balken
  const max=Math.max(S.budget*1.4,...week.map(d=>d.min)), bh=72, y0=124;
  const bars=week.map((d,i)=>{const h=Math.max(4,d.min/max*bh), x=216+i*20;return `<rect x="${x}" y="${y0-h}" width="14" height="${h}" rx="4" fill="${d.min<=S.budget?"#C8F169":"#FF9C7A"}"><title>${nice(d.day)}: ${hm(d.min)}</title></rect>`}).join("");
  const hero=`<svg viewBox="0 0 360 200" role="img" aria-label="Gewonnene Zeit ${hm(saved)}" style="width:100%;height:auto;display:block"><defs><linearGradient id="zg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2F55"/><stop offset="1" stop-color="#1A1C2C"/></linearGradient></defs><rect width="360" height="200" fill="url(#zg)"/>
    <text x="20" y="40" font-family="Manrope, sans-serif" font-size="12" font-weight="700" fill="#A4A6BD" letter-spacing="1.2">GEWONNENE ZEIT</text>
    <text x="20" y="84" font-family="Bricolage Grotesque, Manrope, sans-serif" font-size="${hm(saved).length>9?32:40}" font-weight="800" fill="#C8F169">${hm(saved)}</text>
    <text x="20" y="104" font-family="Manrope, sans-serif" font-size="11.5" fill="#A4A6BD">in ${n} ${n===1?"Tag":"Tagen"}</text><text x="20" y="119" font-family="Manrope, sans-serif" font-size="11.5" fill="#A4A6BD">statt ${hm(S.baseline)} am Tag</text>
    ${bars}${week.length?`<path d="M210 ${y0-S.budget/max*bh}h144" stroke="#F3F1EA" stroke-dasharray="3 4" opacity=".5"/>`:""}</svg>`;
  const diff=prev.length?sum(prev)-sum(week):null, good=week.filter(d=>d.min<=S.budget).length;
  const eq=equivTop(saved), top=eq[0];
  const others=ACTS.filter(a=>saved>=a.min&&(!top||a!==top.a)).sort((a,b)=>b.min-a.min);
  const done=PLANS.map(p=>({p,c:(S.actTotals||{})[p.id]||0})).filter(x=>x.c).sort((a,b)=>b.c-a.c);
  return `
  <div class="hero-card" style="background:#1A1C2C">${hero}</div>
  <div class="scene-chips">
    <div class="cp"><i>Diese Woche</i><b style="color:${diff==null?"var(--ink)":diff>=0?"var(--lime)":"var(--coral)"}">${diff==null?hm(sum(week)):(diff>=0?"−":"+")+hm(Math.abs(diff))}</b></div>
    <div class="cp"><i>Im Ziel</i><b>${good} von ${week.length}</b></div>
    <div class="cp"><i>Serie</i><b style="color:var(--amber)">${S.budgetStreak} ${S.budgetStreak===1?"Tag":"Tage"}</b></div>
  </div>
  <div class="card"><div class="row" style="gap:14px;align-items:center"><span class="eq-big">${top?actIcon(top.a):actIcon(ACTS[0])}</span><div class="grow">
    <p class="label">${top?"Das sind schon":"Bald schon"}</p><h3 class="hm-title">${top?top.c+" "+esc(top.c===1?SING[top.a.n]||top.a.n:top.a.n):"Dein erster Spaziergang"}</h3>
    <p class="small muted">${top?"aus Zeit, die du nicht am Handy warst":"Jeder Tag unter deinem Schnitt zählt hier mit."}</p></div></div>
    ${top?`<button class="btn secondary" id="zeitShare">Teilen</button>`:""}</div>
  ${others.length?`<div class="sec-h"><span>Oder auch</span></div><div class="fy-row">${others.map(a=>{const c=Math.floor(saved/a.min);return `<div class="fy eqfy"><span class="eq-ic">${actIcon(a)}</span><b class="num" style="font:800 22px var(--display)">${c}</b><span class="small muted">${esc(c===1?SING[a.n]||a.n:a.n)}</span></div>`}).join("")}</div>`:""}
  ${done.length?`<div class="sec-h"><span>Was du gemacht hast</span></div><div class="card">${done.map(x=>`<div class="row" style="padding:6px 0"><span class="plan-ic">${planIcon(x.p)}</span><div class="grow"><p><b>${esc(x.p.n)}</b></p><p class="small muted">${x.c}× geschafft</p></div><span class="chip good">+${x.c*20} P</span></div>`).join("")}</div>`:""}
  ${S.lastDay?`<div class="card"><button class="rowbtn" id="weekBtn" data-wk="${isoWeek(S.lastDay)}"><span class="plan-ic" style="background:#26233D;color:var(--lilac)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg></span><span class="grow"><b>Wochenrückblick</b><span class="small muted">KW ${+isoWeek(S.lastDay).split("-W")[1]} ansehen</span></span><span class="muted">›</span></button></div>`:""}
  <div class="sec-h"><span>Rückblick</span></div>
  <div class="card">
    <div class="row between"><span>Über dem Budget verbracht</span><b class="num" style="color:var(--coral)">${hm(over)}</b></div>
    <p class="small muted">${over?"Das wären gewesen: "+esc(eqText(equivTop(over)))+".":"Bisher bist du immer im Budget geblieben."}</p>
  </div>
  <div class="card">
    <p class="label">Hochgerechnet aufs Jahr</p>
    <div class="row between"><span>Mit deinem alten Schnitt</span><b class="num" style="white-space:nowrap">${Math.round(yearOld)} Tage</b></div>
    <div class="bar"><i style="width:${Math.min(100,yearOld/120*100)}%;background:var(--coral)"></i></div>
    <div class="row between"><span>Mit deinem jetzigen Schnitt (${hm(avg)})</span><b class="num" style="white-space:nowrap">${Math.round(yearNow)} Tage</b></div>
    <div class="bar"><i style="width:${Math.min(100,yearNow/120*100)}%"></i></div>
    <p class="small muted">${yearOld>yearNow?"Du gewinnst so rund "+Math.round(yearOld-yearNow)+" ganze Tage pro Jahr zurück, rund um die Uhr gerechnet.":"Noch kein Unterschied. Jeder Tag im Budget verschiebt diese Zahl."}</p>
  </div>
  ${focusStatsCard()}
  <div class="card"><p class="label">App-Monster</p>
  ${S.apps.map(a=>{const ds=S.days.filter(d=>d.apps&&d.apps[a.id]!=null);const tot=ds.reduce((x,d)=>x+(d.apps[a.id]||0),0);const over=ds.filter(d=>d.apps[a.id]>a.limit).length;
    return `<div class="row" style="padding:6px 0;border-top:1px solid var(--card2)"><svg width="44" height="36" viewBox="-24 -34 48 40" aria-hidden="true" style="${over?"":"opacity:.35"}">${monsterSvg(a.m)}</svg><div class="grow"><p><b>${esc(a.name)}</b> <span class="small muted">· Limit ${a.limit} min</span></p><p class="small muted">${ds.length?`${hm(tot)} in ${ds.length} Tagen · ${over}× ${esc(monName(a,false))} aufgetaucht`:"Noch nicht eingetragen"}</p></div></div>`}).join("")}
  <p class="small muted">Trag beim Tagesabschluss die Minuten pro App ein, dann siehst du hier, welche App die meiste Zeit frisst.</p></div>
  <p class="small muted" style="padding:0 4px">Die Umrechnungen sind Faustwerte, zum Beispiel 30 Minuten für einen Spaziergang , 90 Minuten für einen Kinofilm oder 8 Stunden für ein Buch mit 250 Seiten.</p>`;
}
/* Händlerschiff: ganz oben im Tab Bauen, solange es da ist */
function traderCard(){
  if(!S.trader) return "";
  return `<div class="card" style="border:1.5px solid var(--amber)">
    <p class="label" style="color:var(--amber)">Händlerschiff · nur bis ${nice(S.trader.until)}</p>
    <p class="small muted">Seltene Dinge, die es sonst nirgends gibt. Danach legt das Schiff wieder ab.</p>
    ${S.trader.items.map(id=>{const it=RARE.find(x=>x.id===id);const own=owns(id),cost=price(it),can=S.points>=cost;
      return `<div class="row"><div class="badge" style="background:var(--card2)"><svg width="36" height="30" viewBox="-20 -34 40 38" aria-hidden="true">${itemSvg(id)}</svg></div><div class="grow"><p><b>${esc(it.n)}</b></p><p class="small muted">${esc(it.fx)}</p></div>${own?`<span class="chip good">gekauft</span>`:`<button class="btn ${can?"":"secondary"}" style="height:44px;font-size:14px;padding:0 14px" data-buy="${id}" ${can?"":"disabled"}>${cost}</button>`}</div>`}).join("")}
  </div>`;
}
function viewShop(){
  return `<div class="card"><div class="row between"><h2>Inselladen</h2><span class="chip" style="background:#26233D;color:var(--lilac)">${S.points} Punkte</span></div>
  <p class="small muted">Punkte gibt es für jede Minute unter deinem Budget und für jeden guten Tag. ${jobOn("tischler")?"Dank Tischler:in ist alles 10 % billiger.":""}</p>
  ${[["vorrat","Vorräte","Wird beim Kauf verbraucht"],["nutzen","Nützliches","Steht auf der Insel und hilft"],["deko","Deko","Macht die Insel schöner"]].map(([cat,title,sub])=>{
    const list=SHOP.filter(it=>it.cat===cat&&shopHere(it)), have=list.filter(it=>!it.consumable&&owns(it.id)).length;
    return `<div class="shop-head"><p class="label">${title}</p><span class="small muted">${cat==="vorrat"?sub:have+" von "+list.length+" auf der Insel"}</span></div>
    <div class="shop-grid">${list.slice().sort((a,b)=>(!a.consumable&&owns(a.id))-(!b.consumable&&owns(b.id))).map(it=>{
    const own=!it.consumable&&owns(it.id), cost=price(it), can=S.points>=cost, stock=it.id==="tee"?S.tea:it.id==="sonne"?S.sun:0;
    return `<div class="shop-item${own?" owned":""}">
      <div class="shop-pic"><svg width="70" height="56" viewBox="-20 -34 40 38" aria-hidden="true">${itemSvg(it.id)}</svg></div>
      <p style="font-weight:700">${esc(it.n)}${stock?` <span class="small muted">· Vorrat ${stock}</span>`:""}</p>
      <p class="small muted" style="flex:1">${esc(it.fx)}</p>
      ${own?`<span class="chip good" style="align-self:flex-start">auf der Insel</span>`:`<button class="btn ${can?"":"secondary"}" style="height:44px;font-size:14px" data-buy="${it.id}" ${can?"":"disabled"}>${cost} Punkte</button>`}
    </div>`}).join("")}</div>`}).join("")}
  </div>`;
}
function itemSvg(id){
  switch(id){
  /* Tropen */
  case "t_kanu": return `<path d="M-15 -2h30" stroke="#B07A55" stroke-width="2.6"/><path d="M-13 0v-2M-3 0v-2M7 0v-2" stroke="#8A5A3B" stroke-width="1.4"/><g class="bob" style="animation-duration:2.6s"><path d="M-14 -5q14 6 28 0l-3 3h-22z" fill="#C9763E"/><path d="M-8 -9h16M-6 -9v4M6 -9v4" stroke="#8A5A3B" stroke-width="1"/><path d="M-4 -12l9 6" stroke="#6B4430" stroke-width="1.2"/></g>`;
  case "t_kokos": return `<rect x="-11" y="-12" width="22" height="12" rx="1.5" fill="#C9A26A"/><path d="M-11 -8h22" stroke="#A0803E"/><path d="M-13 -12l3-8h20l3 8z" fill="#E5484D"/><path d="M-8 -20l-1 8M0 -20v8M8 -20l1 8" stroke="#F3F1EA" stroke-width="2"/><circle cx="-5" cy="-14" r="2.6" fill="#7A5038"/><circle cx="1" cy="-14" r="2.6" fill="#8A5A3B"/><circle cx="6" cy="-14" r="2.2" fill="#F3F1EA" stroke="#7A5038"/><g class="bob" style="animation-duration:2s"><path d="M8 -15l4-4" stroke="#FF9C7A" stroke-width="1"/></g>`;
  case "t_haengematte": return `<path d="M-14 0q1-12 4-22M14 0q-1-12-4-22" stroke="#9A6A3E" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="-10" cy="-23" r="5" fill="#3FA35A"/><circle cx="10" cy="-23" r="5" fill="#3FA35A"/><g class="swing" style="animation-duration:3s"><path d="M-12 -12q12 10 24 0" stroke="#FF9C7A" stroke-width="3" fill="none"/><path d="M-12 -12q12 7 24 0" stroke="#FFD27A" stroke-width="1" fill="none"/></g>`;
  case "t_orchidee": return `<rect x="-13" y="-4" width="26" height="4" rx="2" fill="#7A5038"/>${[-8,-1,6].map((x,i)=>`<g class="sway" style="animation-duration:${3+i*.4}s"><path d="M${x} -4q1-6 0-9" stroke="#3FA35A" stroke-width="1.2" fill="none"/><path d="M${x} -14l-3-2 3-1 3 1z" fill="${["#E07AB8","#B6A4FF","#F3F1EA"][i]}"/><circle cx="${x}" cy="-14.6" r="1" fill="#FFD27A"/></g>`).join("")}`;
  case "t_tiki": return `${[-6,6].map((x,i)=>`<path d="M${x} 0v-20" stroke="#8A5A3B" stroke-width="2.4"/><path d="M${x-1.6} -14h3.2M${x-1.6} -9h3.2" stroke="#6B4430"/><path d="M${x-2.4} -20h4.8l-1 -3h-2.8z" fill="#5A3A2A"/><g class="flick" style="animation-delay:${i*.3}s"><path d="M${x} -23c-2 0-3-2-1-5 0 1 1 1 1 1 0-2 1-3 2-4 0 2 1 3 1 4 0 2-1 4-3 4z" fill="#FFB86B"/></g>`).join("")}<g class="glow" style="animation-duration:1.6s"><circle cx="0" cy="-24" r="10" fill="#FFB86B" opacity=".18"/></g>`;
  case "t_huette": return `<path d="M-12 0v-6M12 0v-6" stroke="#8A5A3B" stroke-width="2"/><rect x="-13" y="-7" width="26" height="2" fill="#A0703F"/><rect x="-11" y="-19" width="22" height="12" fill="#D9B86A"/><path d="M-8 -19v12M-4 -19v12M4 -19v12M8 -19v12" stroke="#B8944E" stroke-width=".8"/><path d="M-16 -18l16-11 16 11z" fill="#C9A26A"/><rect x="-3" y="-15" width="6" height="8" fill="#7A5038"/>`;
  case "t_surf": return `${[[-6,"#FF9C7A",-8],[2,"#5B8CD6",4],[9,"#FFD27A",12]].map(([x,c,r])=>`<g transform="translate(${x} 0) rotate(${r})"><path d="M0 0c-3-8-3-18 0-26 3 8 3 18 0 26z" fill="${c}"/><path d="M0 -2v-22" stroke="#F3F1EA" stroke-width=".8"/></g>`).join("")}`;
  case "t_flamingo": return `${[[-6,0],[6,.6]].map(([x,d])=>`<g transform="translate(${x} 0)"><path d="M0 0v-9" stroke="#E07AB8" stroke-width="1"/><g class="bob" style="animation-duration:2.8s;animation-delay:${d}s"><ellipse cx="1" cy="-12" rx="4.6" ry="3" fill="#FF8FB8"/><path d="M-2 -13q-3-4 0-9q2-1 2 1" stroke="#FF8FB8" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M0 -21l-3 1.4 1 1z" fill="#3A3D58"/></g></g>`).join("")}`;
  /* Fjord */
  case "f_kanu": return `<path d="M-15 -2h30" stroke="#8A5A3B" stroke-width="2.6"/><path d="M-13 0v-2M-3 0v-2M7 0v-2" stroke="#6B4430" stroke-width="1.4"/><g class="bob" style="animation-duration:2.6s"><path d="M-14 -5q14 5 28 0q-14 4-28 0z" fill="#B8442E"/><path d="M-14 -5q14 3 28 0" stroke="#F3F1EA" stroke-width=".8" fill="none"/><path d="M-2 -11l6 7M4 -11l-6 7" stroke="#6B4430" stroke-width="1"/></g>`;
  case "f_schaukel": return `<path d="M-12 0q1-14 4-28" stroke="#6B4430" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-12 -18q14-4 22-2" stroke="#6B4430" stroke-width="2" fill="none"/><path d="M-14 -28l2-6 3 6 4-4 1 6z" fill="#2F6B45"/><circle cx="-10" cy="-30" r="7" fill="#2F6B45"/><g class="swing" style="animation-duration:2.4s"><path d="M3 -19v14M9 -19v14" stroke="#C9B48A" stroke-width=".8"/><rect x="1.6" y="-5.4" width="9" height="2" rx="1" fill="#B8442E"/></g>`;
  case "f_beeren": return `${[-8,3].map((x,i)=>`<g class="sway" style="animation-duration:${3.4+i*.4}s"><circle cx="${x}" cy="-6" r="6" fill="#2F6B45"/><circle cx="${x+4}" cy="-8" r="4.4" fill="#3E7D52"/>${[[-2,-7],[1,-4],[3,-9],[-3,-3],[5,-5]].map(([a,b],k)=>`<circle cx="${x+a}" cy="${b}" r="1.1" fill="${k%2?"#3A4FA8":"#E5484D"}"/>`).join("")}</g>`).join("")}`;
  case "f_feuerschale": return `<path d="M-8 0l2-4h12l2 4z" fill="#3A3D58"/><path d="M-9 -4h18l-2 -4h-14z" fill="#5A5D78"/><g class="flick"><path d="M0 -8c-5 0-6-5-3-9 0 2 2 2 2 2 0-5 3-7 4-10 0 5 3 6 3 10 0 4-2 7-6 7z" fill="#FFB86B"/><path d="M0 -8c-2 0-2-2-1-4 1 1 1 1 1 1 0-2 1-3 2-4 0 2 1 3 1 5 0 1-1 2-3 2z" fill="#FFD27A"/></g><g class="glow" style="animation-duration:1.4s"><circle cx="0" cy="-12" r="11" fill="#FFB86B" opacity=".22"/></g>`;
  case "f_scheune": return `<rect x="-14" y="-16" width="28" height="16" fill="#B8442E"/><path d="M-14 -16h28M-14 0h28M-14 -16v16M14 -16v16" stroke="#F3F1EA" stroke-width="1.4"/><path d="M-17 -15l17-11 17 11z" fill="#3A3D58"/><rect x="-5" y="-11" width="10" height="11" fill="#7A2E20"/><path d="M-5 -11l10 11M5 -11l-10 11" stroke="#F3F1EA" stroke-width="1"/><rect x="-2" y="-21" width="4" height="4" fill="#FFD27A" stroke="#F3F1EA" stroke-width=".8"/>`;
  case "f_moos": return `<ellipse cx="0" cy="-1.4" rx="12" ry="2.4" fill="#5F8A4A"/>${[[-6,"#E5484D"],[1,"#C98A52"],[7,"#E5484D"]].map(([x,c],i)=>`<g class="bob" style="animation-duration:${3+i*.5}s"><rect x="${x-.8}" y="-6" width="1.6" height="4" fill="#F3F1EA"/><path d="M${x-3.4} -6a3.4 3 0 0 1 6.8 0z" fill="${c}"/><circle cx="${x-1}" cy="-7" r=".6" fill="#F3F1EA"/></g>`).join("")}`;
  case "f_wimpel": return `<path d="M-16 0v-20M16 0v-20" stroke="#6B4430" stroke-width="1.6"/><path d="M-16 -18q16 8 32 0" stroke="#C9B48A" stroke-width=".7" fill="none"/>${[-11,-5,1,7,12].map((x,i)=>{const y=-18+((x+16)*(16-x))/32*.5;return `<g class="swing" style="animation-duration:${1.8+i*.2}s"><path d="M${x-2} ${y}h4l-2 4z" fill="${["#B8442E","#F3F1EA","#2F4A6E","#B8442E","#F3F1EA"][i]}"/></g>`}).join("")}`;
  case "f_runen": return `<path d="M-6 0q-1-12 2-20q4-3 7 0q3 8 2 20z" fill="#8F96A8"/><path d="M-2 -16l2 3 2-3M0 -13v6M-2 -5l4-2" stroke="#3A3D58" stroke-width="1" fill="none"/><path d="M-6 0q4-2 11 0" stroke="#5F8A4A" stroke-width="2" fill="none"/>`;
  /* Wüste */
  case "o_teppich": return `<path d="M-16 0l3-5h26l3 5z" fill="#B8442E"/><path d="M-12 -2.6h24" stroke="#FFD27A" stroke-width="1" stroke-dasharray="2 1.5"/><path d="M-15 0h-2M15 0h2" stroke="#FFD27A" stroke-width="1"/><ellipse cx="-7" cy="-6" rx="4" ry="2.4" fill="#5B8CD6"/><ellipse cx="6" cy="-6" rx="4" ry="2.4" fill="#4FB06A"/><path d="M-1 -5l1-3 1 3z" fill="#FFD27A"/>`;
  case "o_dattel": return `${palmSvg(0,0,1.1,"#6E8B3D")}<g fill="#B8743E"><circle cx="2" cy="-27" r="1.2"/><circle cx="4" cy="-26" r="1.2"/><circle cx="3" cy="-24.6" r="1.2"/><circle cx="7" cy="-27" r="1.2"/></g>`;
  case "o_tee": return `<rect x="-11" y="-10" width="22" height="10" rx="1.5" fill="#C98A52"/><path d="M-13 -10l2-6h22l2 6z" fill="#5B8CD6"/><path d="M-7 -16l-1 6M0 -16v6M7 -16l1 6" stroke="#FFD27A" stroke-width="1.6"/><path d="M-5 -10q0-4 3-4h1q2 0 2 2v2z" fill="#FFD27A"/><path d="M1 -12h2" stroke="#FFD27A"/><g fill="none" stroke="#F3F1EA" stroke-width=".8" stroke-linecap="round"><path class="steam" d="M-2 -15q-1-2 0-4t0-4"/></g><rect x="4" y="-13" width="3" height="3" rx=".8" fill="#E5484D"/>`;
  case "o_wasser": return `<ellipse cx="0" cy="-2" rx="13" ry="3.4" fill="#C9A35A"/><ellipse cx="0" cy="-2.4" rx="10" ry="2.4" fill="#3FB8B0"/><g class="glow" style="animation-duration:2s"><ellipse cx="-3" cy="-2.6" rx="3" ry=".6" fill="#F3F1EA" opacity=".6"/></g><path d="M9 -4q2-6 1-11" stroke="#6E8B3D" stroke-width="1.4" fill="none"/><path d="M10 -15q-4-1-6 1M10 -15q4-2 6 0" stroke="#6E8B3D" stroke-width="1.6" fill="none"/><ellipse cx="-9" cy="-7" rx="2.6" ry="3.4" fill="#C98A52"/><path d="M-10 -10.4h2" stroke="#8A5A3B"/>`;
  case "o_zelt": return `<path d="M-16 0l6-17h20l6 17z" fill="#E8D9B8"/><path d="M-10 -17l10-6 10 6" fill="#D9C38E"/><path d="M-10 -17v17M10 -17v17" stroke="#B8944E" stroke-width=".8"/><path d="M-4 0l1-9h6l1 9z" fill="#7A2E20"/><path d="M-16 -1h32" stroke="#B8442E" stroke-width="1.4" stroke-dasharray="3 2"/><g class="flagwave"><path d="M0 -23v-5l5 2z" fill="#E5484D"/></g>`;
  case "o_kaktus": return `<ellipse cx="0" cy="-1" rx="13" ry="2.4" fill="#D9A55A"/>${[[-7,1],[2,1.3],[9,.8]].map(([x,k])=>`<g transform="translate(${x} 0) scale(${k})"><rect x="-2.4" y="-12" width="4.8" height="12" rx="2.4" fill="#6E9B4A"/><path d="M-2.4 -5h-2.6v-4" stroke="#6E9B4A" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="0" cy="-12.6" r="1.4" fill="#E07AB8"/></g>`).join("")}`;
  case "o_laternen": return `<path d="M0 0v-24M-6 -22h12" stroke="#8A5A3B" stroke-width="1.4"/>${[[-5,"#E5484D",0],[5,"#5B8CD6",.5]].map(([x,c,d])=>`<g class="swing" style="animation-delay:${d}s"><path d="M${x} -22v3" stroke="#8A5A3B" stroke-width=".6"/><path d="M${x-2.6} -19q2.6-2 5.2 0l-.6 6q-2 1.4-4 0z" fill="${c}"/><g class="glow" style="animation-duration:2.4s"><circle cx="${x}" cy="-16" r="5" fill="${c}" opacity=".3"/></g></g>`).join("")}`;
  /* Alaska */
  case "a_eisloch": return `<ellipse cx="0" cy="-2" rx="13" ry="3.4" fill="#E6EEF3"/><ellipse cx="2" cy="-2" rx="5" ry="1.6" fill="#2F4A6E"/><path d="M-9 -2l9-14" stroke="#7A5038" stroke-width="1.2"/><path d="M0 -16q2 6 2 13" stroke="#F3F1EA" stroke-width=".5" fill="none"/><g class="bob" style="animation-duration:1.6s"><circle cx="2" cy="-3" r=".9" fill="#E5484D"/></g><rect x="-12" y="-6" width="5" height="4" rx="1" fill="#B8442E"/>`;
  case "a_kakao": return `<rect x="-10" y="-11" width="20" height="11" rx="1.5" fill="#8A5A3B"/><path d="M-12 -11l2-6h20l2 6z" fill="#E5484D"/><path d="M-12 -11q4 2 8 0t8 0 8 0" stroke="#F3F1EA" stroke-width="1.4" fill="none"/><rect x="-3" y="-15" width="6" height="5" rx="1" fill="#F3F1EA"/><path d="M3 -14q2 0 2 2t-2 2" stroke="#F3F1EA" fill="none" stroke-width=".8"/><g fill="none" stroke="#F3F1EA" stroke-width=".8" stroke-linecap="round"><path class="steam" d="M0 -16q-1-2 0-4t0-4"/><path class="steam" style="animation-delay:.7s" d="M-2 -16q-1-2 0-4t0-4"/></g>`;
  case "a_feuerkorb": return `<path d="M-4 0l2-6M4 0l-2-6M0 0v-6" stroke="#3A3D58" stroke-width="1.2"/><path d="M-7 -6h14l-2 -6h-10z" fill="#5A5D78" stroke="#3A3D58" stroke-width=".6"/><g class="flick"><path d="M0 -11c-5 0-6-5-3-9 0 2 2 2 2 2 0-5 3-7 4-10 0 5 3 6 3 10 0 4-2 7-6 7z" fill="#FFB86B"/></g><g class="glow" style="animation-duration:1.4s"><circle cx="0" cy="-16" r="11" fill="#FFB86B" opacity=".25"/></g>`;
  case "a_eisbahn": return `<ellipse cx="0" cy="-2" rx="18" ry="4" fill="#BFE0F5"/><ellipse cx="-4" cy="-2.6" rx="9" ry="1.4" fill="#F3F6F8" opacity=".7"/><path d="M-18 -2v-4M18 -2v-4M-18 -5q18 3 36 0" stroke="#B8442E" stroke-width="1" fill="none"/><g class="wander" style="--wx:10px;animation-duration:5s"><path d="M-2 -3h4" stroke="#3A3D58" stroke-width="1"/><path d="M0 -3v-5" stroke="#5B8CD6" stroke-width="2.4"/><circle cx="0" cy="-10" r="2" fill="#E8B48F"/><path d="M-2 -11a2 2 0 0 1 4 0z" fill="#E5484D"/></g>`;
  case "a_huskys": return `<path d="M-14 0a14 13 0 0 1 28 0z" fill="#8A5A3B"/><path d="M-14 0a14 13 0 0 1 28 0" stroke="#F3F6F8" stroke-width="2" fill="none"/><path d="M-4 0v-6a4 4 0 0 1 8 0v6z" fill="#3A2A20"/>${[[-20,0],[19,.4]].map(([x,d])=>`<g transform="translate(${x} 0)"><g class="bob" style="animation-duration:1.4s;animation-delay:${d}s"><ellipse cx="0" cy="-3.4" rx="4" ry="2.6" fill="#8F96A8"/><circle cx="${x<0?-3.4:3.4}" cy="-6" r="2.2" fill="#8F96A8"/><path d="M${x<0?-4.4:2.4} -8l1-2 1 2z" fill="#5F6680"/><ellipse cx="${x<0?-3.8:3.8}" cy="-5.4" rx="1.2" ry=".8" fill="#F3F1EA"/></g></g>`).join("")}`;
  case "a_schneemann": return `<circle cx="0" cy="-5" r="6" fill="#F3F6F8"/><circle cx="0" cy="-14" r="4.4" fill="#F3F6F8"/><circle cx="0" cy="-21" r="3.4" fill="#F3F6F8"/><path d="M-1 -21l-4 1 4 .6z" fill="#FF9C7A"/><circle cx="-1.2" cy="-22.2" r=".5" fill="#14151F"/><circle cx="1" cy="-22.2" r=".5" fill="#14151F"/><g class="flagwave"><path d="M-3.4 -18h7l2 5-2 .6-1-3.4h-6z" fill="#E5484D"/></g><path d="M-3 -24h6l-1-4h-4z" fill="#3A3D58"/><circle cx="0" cy="-12" r=".6" fill="#3A3D58"/><circle cx="0" cy="-15" r=".6" fill="#3A3D58"/>`;
  case "a_laternen": return `${[-5,5].map((x,i)=>`<path d="M${x} 0v-14" stroke="#5A5D78" stroke-width="1.2"/><rect x="${x-2.6}" y="-21" width="5.2" height="7" rx="1" fill="#FFD27A" stroke="#5A5D78" stroke-width=".6"/><path d="M${x-3.4} -21h6.8l-3.4-2.6z" fill="#F3F6F8"/><g class="glow" style="animation-duration:${2+i*.6}s"><circle cx="${x}" cy="-17" r="6" fill="#FFD27A" opacity=".3"/></g>`).join("")}`;
  case "a_eisskulptur": return `<rect x="-8" y="-3" width="16" height="3" fill="#BFE0F5"/><path d="M-6 -3c0-6 3-9 7-9 3 0 5 2 5 4 0 1-1 2-2 2 2 1 3 2 3 3z" fill="#D6ECFA" stroke="#9CC8EE" stroke-width=".6"/><circle cx="-5" cy="-12" r="3" fill="#D6ECFA" stroke="#9CC8EE" stroke-width=".6"/><g class="glow" style="animation-duration:2.6s"><path d="M3 -10l1 1M-4 -14l.6.6" stroke="#F3F1EA" stroke-width="1"/></g>`;
  case "sonne": return `<g class="spin" style="animation-duration:14s"><g stroke="#FFB86B" stroke-width="2" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<path d="M${(Math.cos(r)*11).toFixed(1)} ${(-15+Math.sin(r)*11).toFixed(1)}L${(Math.cos(r)*15).toFixed(1)} ${(-15+Math.sin(r)*15).toFixed(1)}"/>`}).join("")}</g></g><circle cx="0" cy="-15" r="8" fill="#FFD27A"/><circle cx="-2.6" cy="-16" r=".9" fill="#8A5A3B"/><circle cx="2.6" cy="-16" r=".9" fill="#8A5A3B"/><path d="M-2.6 -12.6q2.6 2 5.2 0" stroke="#8A5A3B" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  case "tee": return `<ellipse cx="0" cy="-1" rx="12" ry="2.6" fill="#A4A6BD"/><path d="M-8 -14h16v4a8 8 0 0 1-16 0z" fill="#F3F1EA"/><path d="M8 -12.5h2.4a3 3 0 0 1 0 6h-3" stroke="#F3F1EA" stroke-width="1.8" fill="none"/><ellipse cx="0" cy="-14" rx="8" ry="1.6" fill="#8FBF6A"/><path d="M-3 -9l2 2 4-4" stroke="#C8F169" stroke-width="1.2" fill="none" opacity=".7"/><g stroke="#F3F1EA" stroke-width="1.5" fill="none" stroke-linecap="round"><path class="steam" d="M-3 -17q-2.4-3 0-6t0-6"/><path class="steam" style="animation-delay:.8s" d="M3 -17q-2.4-3 0-6t0-6"/><path class="steam" style="animation-delay:1.6s" d="M0 -18q-2.4-3 0-6t0-6"/></g>`;
  case "klee": return `<g class="bob" style="animation-duration:2.4s"><path d="M0 -12q2 6 -1 12" stroke="#4E9A58" stroke-width="1.6" fill="none"/><g fill="#5FB86A"><circle cx="-4" cy="-16" r="4.4"/><circle cx="4" cy="-16" r="4.4"/><circle cx="-4" cy="-8.6" r="4.4"/><circle cx="4" cy="-8.6" r="4.4"/></g><g class="glow" style="animation-duration:1.8s"><path d="M10 -24l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FFD27A"/></g></g>`;
  case "blumen": return `<rect x="-13" y="-5" width="26" height="6" rx="2" fill="#8A5A3B"/><g class="sway" style="animation-duration:3.4s"><path d="M-8 -5v-6M-2 -5v-8M4 -5v-6M9 -5v-7" stroke="#5FA864" stroke-width="1.6"/><circle cx="-8" cy="-12" r="2.6" fill="#FF9C7A"/><circle cx="-2" cy="-14" r="2.6" fill="#FFD27A"/><circle cx="4" cy="-12" r="2.6" fill="#B6A4FF"/><circle cx="9" cy="-13" r="2.6" fill="#FF9C7A"/></g>`;
  case "palme": return palmSvg(0,0,1,"#4E9A58");
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
  case "pokal": return `<rect x="-7" y="-5" width="14" height="5" rx="1" fill="#8A5A3B"/><path d="M-2 -5v-4h4v4" fill="#E0A93C"/><path d="M-8 -22h16v3a8 8 0 0 1-16 0z" fill="#FFD27A" stroke="#E0A93C" stroke-width=".8"/><path d="M-8 -20h-3a4 4 0 0 0 4 5M8 -20h3a4 4 0 0 1-4 5" stroke="#FFD27A" stroke-width="1.4" fill="none"/><g class="firefly" style="animation-duration:1.8s"><path d="M10 -27l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FFE7A3"/></g>`;
  case "siegerbanner": return `<path d="M-8 0v-32" stroke="#A4A6BD" stroke-width="1.8" stroke-linecap="round"/><circle cx="-8" cy="-33" r="1.6" fill="#FFD27A"/><g class="flagwave"><path d="M-7 -31h18l-4 6 4 6h-18z" fill="#B6A4FF"/><path d="M-1 -27l1.5 3 3 .4-2.2 2 .6 3-2.9-1.5-2.9 1.5.6-3-2.2-2 3-.4z" fill="#FFD27A"/></g>`;
  case "goldanker": return `<ellipse cx="0" cy="-2" rx="12" ry="3" fill="#8F96A8"/><g stroke="#FFD27A" stroke-width="2.2" fill="none" stroke-linecap="round"><circle cx="0" cy="-24" r="2.6"/><path d="M0 -21.4v17M-5 -16h10M-9 -9q1 6 9 6q8 0 9-6"/></g><g class="firefly" style="animation-duration:2.2s"><circle cx="8" cy="-22" r="1.2" fill="#FFE7A3"/></g>`;
  case "truhe": return chestSvg(true);
  case "muschelweg": return `<path d="M-16 -4q16 -8 32 0" stroke="#D9C38E" stroke-width="5" fill="none" stroke-linecap="round"/><g fill="#F3F1EA">${[[-10,-6],[-2,-8],[6,-8],[13,-6]].map((c,i)=>`<g class="glow" style="animation-duration:2.6s;animation-delay:${i*.5}s"><circle cx="${c[0]}" cy="${c[1]}" r="2.4"/></g><circle cx="${c[0]}" cy="${c[1]}" r="2"/>`).join("")}</g>`;
  }
  return "";
}
function projectSvg(id){
  switch(id){
  /* Tropen */
  case "t_bambus": return `${[-14,10].map((x,i)=>`<g transform="translate(${x} 0)"><path d="M-9 0v-6M9 0v-6" stroke="#8A5A3B" stroke-width="2"/><rect x="-10" y="-20" width="20" height="14" fill="#D9B86A"/><path d="M-6 -20v14M0 -20v14M6 -20v14" stroke="#B8944E" stroke-width="1"/><path d="M-14 -19l14-12 14 12z" fill="#C9A26A"/><rect x="-3" y="-15" width="6" height="9" fill="#7A5038"/></g>`).join("")}`;
  case "t_riff": return `<path d="M-24 -3h40" stroke="#B07A55" stroke-width="3.4"/><path d="M-20 -3v7M-6 -3v7M8 -3v7" stroke="#8A5A3B" stroke-width="2"/><g class="sway" style="animation-duration:3s"><path d="M18 2q-2-8 2-12M22 2q1-7 5-9M26 2q0-6-3-10" stroke="#FF9C7A" stroke-width="2.4" fill="none" stroke-linecap="round"/></g><path d="M-30 2q-1-6 3-9q3 3 1 9z" fill="#E07AB8"/><g class="bob" style="animation-duration:1.8s"><path d="M-2 4q4-3 8 0q-4 3-8 0zM6 4l3-2v4z" fill="#FFD27A"/></g>`;
  case "t_wasserfall": return `<path d="M-22 0l6-34 14-6 16 6 8 34z" fill="#8F8478"/><path d="M-16 -34l8-5 10 3" stroke="#5FA864" stroke-width="5" fill="none" stroke-linecap="round"/><g class="glow" style="animation-duration:1.2s"><path d="M-4 -36q-2 18 0 34h8q2-16 0-34z" fill="#BFE6F5"/></g><path d="M-3 -36q-1 18 0 34M2 -36q1 18 0 34" stroke="#F3F1EA" stroke-width="1.2" opacity=".8"/><ellipse cx="0" cy="0" rx="14" ry="3" fill="#7CB8E8"/><g class="steam"><circle cx="-5" cy="-3" r="2" fill="#F3F1EA"/><circle cx="5" cy="-4" r="1.6" fill="#F3F1EA"/></g>`;
  case "t_mango": return `${[-14,0,14].map((x,i)=>`<g transform="translate(${x} 0)"><rect x="-1.6" y="-14" width="3.2" height="14" fill="#8A5A3B"/><g class="sway" style="animation-duration:${3+i*.4}s"><circle cx="0" cy="-19" r="8" fill="#3FA35A"/><circle cx="-3" cy="-17" r="1.8" fill="#FFB86B"/><circle cx="3" cy="-21" r="1.8" fill="#FF9C7A"/><circle cx="2" cy="-15" r="1.8" fill="#FFD27A"/></g></g>`).join("")}<rect x="16" y="-6" width="9" height="6" rx="1" fill="#B07A55"/>`;
  /* Fjord */
  case "f_stugor": return `${[-13,11].map(x=>`<g transform="translate(${x} 0)"><rect x="-10" y="-14" width="20" height="14" fill="#B8442E"/><path d="M-10 -14h20M-10 0h20M-10 -14v14M10 -14v14" stroke="#F3F1EA" stroke-width="1.4"/><path d="M-13 -13l13-9 13 9z" fill="#3A3D58"/><rect x="-3" y="-8" width="6" height="8" fill="#F3F1EA"/><rect x="4" y="-11" width="4" height="4" fill="#FFD27A"/></g>`).join("")}`;
  case "f_sauna": return `<rect x="-14" y="-16" width="28" height="16" fill="#8A5A3B"/><path d="M-14 -11h28M-14 -6h28" stroke="#6B4430" stroke-width="1"/><path d="M-17 -15l17-9 17 9z" fill="#5A4636"/><rect x="-4" y="-11" width="7" height="11" fill="#3A2A20"/><rect x="6" y="-12" width="5" height="4" fill="#FFD27A"/><path d="M8 -24v-6" stroke="#7C7F99" stroke-width="2.4"/><g stroke="#F3F1EA" stroke-width="1.6" fill="none" stroke-linecap="round"><path class="steam" d="M8 -31q-2-3 0-6t0-6"/><path class="steam" style="animation-delay:.9s" d="M8 -31q-2-3 0-6t0-6"/></g>`;
  case "f_wikinger": return `<g class="wave" style="animation-duration:3.4s"><path d="M-26 -6q26 12 52 0l-6 8h-40z" fill="#8A5A3B"/><path d="M-26 -6q-4-6 0-10M26 -6q4-6 0-10" stroke="#8A5A3B" stroke-width="3" fill="none" stroke-linecap="round"/>${[-16,-8,0,8,16].map((x,i)=>`<circle cx="${x}" cy="-4" r="3" fill="${["#E5484D","#FFD27A","#5B8CD6","#E5484D","#FFD27A"][i]}"/>`).join("")}<path d="M0 -6v-26" stroke="#6B4430" stroke-width="2"/><g class="sway" style="animation-duration:3s"><rect x="-11" y="-30" width="22" height="18" fill="#F3F1EA"/><path d="M-11 -26h22M-11 -20h22M-11 -14h22" stroke="#E5484D" stroke-width="2.4"/></g></g>`;
  case "f_nordlicht": return `<rect x="-6" y="-36" width="12" height="36" fill="#C9C6BE"/><path d="M-8 -36h16l-8-8z" fill="#3A3D58"/><rect x="-3" y="-30" width="6" height="6" fill="#FFD27A"/><g class="glow" style="animation-duration:3s"><path d="M-30 -44q15-10 30 0t30 0v-8q-15-8-30 0t-30 0z" fill="#5BF0A4" opacity=".7"/><path d="M-26 -52q13-8 26 0t26 0v-6q-13-6-26 0t-26 0z" fill="#B6A4FF" opacity=".6"/></g>`;
  /* Wüste */
  case "o_lehm": return `${[[-14,0,1],[8,-2,.85],[22,0,.7]].map(([x,y,k])=>`<g transform="translate(${x} ${y}) scale(${k})"><rect x="-10" y="-16" width="20" height="16" rx="2" fill="#D9A86A"/><path d="M-6 -16a6 6 0 0 1 12 0z" fill="#E8BE84"/><path d="M-3 0v-7a3 3 0 0 1 6 0v7z" fill="#7A5038"/><rect x="5" y="-12" width="3" height="3" rx="1.5" fill="#FFD27A"/></g>`).join("")}`;
  case "o_brunnen": return `<ellipse cx="0" cy="-2" rx="18" ry="5" fill="#3FB8B0"/><ellipse cx="-4" cy="-3" rx="8" ry="1.4" fill="#F3F1EA" opacity=".4"/><rect x="-8" y="-12" width="16" height="9" rx="2" fill="#C9A35A"/><path d="M-6 -12v-10M6 -12v-10M-9 -22h18" stroke="#8A5A3B" stroke-width="2"/><g class="swing" style="animation-duration:2.6s"><path d="M0 -22v6" stroke="#7C7F99" stroke-width="1"/><rect x="-2" y="-16" width="4" height="3.4" rx="1" fill="#8A5A3B"/></g><path d="M16 -2q1-14 4-24" stroke="#A0703F" stroke-width="3" fill="none"/><g class="sway" style="animation-duration:4s"><path d="M20 -26q-8-3-12 2M20 -26q8-4 12 2M20 -26q-3-7-9-7M20 -26q4-7 10-6" stroke="#6E8B3D" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
  case "o_markt": return `${[-14,4].map((x,i)=>`<g transform="translate(${x} 0)"><path d="M-8 0v-14M8 0v-14" stroke="#8A5A3B" stroke-width="1.6"/><g class="sway" style="animation-duration:${3+i}s"><path d="M-11 -14l3-6h16l3 6z" fill="${i?"#5B8CD6":"#E5484D"}"/><path d="M-5 -20l-1 6M1 -20v6M7 -20l1 6" stroke="#F3F1EA" stroke-width="2"/></g><rect x="-8" y="-7" width="16" height="4" fill="#B07A55"/><circle cx="-4" cy="-8" r="1.8" fill="#FFB86B"/><circle cx="0" cy="-8" r="1.8" fill="#E5484D"/><circle cx="4" cy="-8" r="1.8" fill="#C8F169"/></g>`).join("")}<g transform="translate(22 0)"><ellipse cx="0" cy="-5" rx="6" ry="5" fill="#C98A52"/><path d="M-3 -9q-2-5 1-7" stroke="#C98A52" stroke-width="2"/></g>`;
  case "o_sternzelt": return `<path d="M-24 0l8-18h32l8 18z" fill="#E8D9B8"/><path d="M-16 -18l16-8 16 8" fill="#D9C38E"/><path d="M-8 0l3-12h10l3 12z" fill="#5A3A2A"/><path d="M-16 -18v18M16 -18v18" stroke="#B8944E" stroke-width="1"/>${[[-20,-34],[-6,-40],[10,-36],[22,-28]].map(([x,y],i)=>`<g class="glow" style="animation-duration:${1.4+i*.3}s"><path d="M${x} ${y-3}l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FFD27A"/></g>`).join("")}`;
  /* Alaska */
  case "a_iglus": return `${[[-14,1],[12,.8]].map(([x,k])=>`<g transform="translate(${x} 0) scale(${k})"><path d="M-14 0a14 14 0 0 1 28 0z" fill="#F3F6F8"/><path d="M-13 -5h26M-11 -10h22M-6 -2v-3M2 -6v-4M6 -2v-3" stroke="#B9D3E6" stroke-width="1"/><path d="M-5 0v-4a5 5 0 0 1 10 0v4z" fill="#2F4A6E"/></g>`).join("")}`;
  case "a_schlitten": return `<rect x="-20" y="-16" width="16" height="16" fill="#8A5A3B"/><path d="M-23 -15l11-7 11 7z" fill="#F3F6F8"/><rect x="-14" y="-9" width="5" height="9" fill="#3A2A20"/><path d="M0 -2h18q4 0 5-4" stroke="#7A5038" stroke-width="1.6" fill="none"/><path d="M2 -6h14v4h-14z" fill="#E5484D"/><g class="bob" style="animation-duration:1s"><ellipse cx="26" cy="-6" rx="5" ry="3.4" fill="#C9C6BE"/><circle cx="31" cy="-9" r="2.6" fill="#C9C6BE"/><path d="M30 -12l1-3 1 3" fill="#3A3D58"/><path d="M23 -3v3M28 -3v3" stroke="#C9C6BE" stroke-width="1.6"/></g>`;
  case "a_eisfischen": return `<ellipse cx="0" cy="0" rx="26" ry="5" fill="#E6EEF3"/><ellipse cx="10" cy="0" rx="5" ry="1.6" fill="#2F4A6E"/><rect x="-18" y="-16" width="16" height="15" fill="#B8442E"/><path d="M-20 -15l10-6 10 6z" fill="#F3F6F8"/><rect x="-13" y="-9" width="5" height="8" fill="#3A2A20"/><path d="M2 -2l10-16" stroke="#7A5038" stroke-width="1.4"/><path d="M12 -18q2 8-2 18" stroke="#F3F1EA" stroke-width=".6" fill="none"/><g class="bob" style="animation-duration:1.6s"><path d="M14 -6q4-3 8 0q-4 3-8 0zM22 -6l3-2v4z" fill="#9CC8EE"/></g>`;
  case "a_polarwarte": return `<path d="M-8 0l3-30h10l3 30z" fill="#C9C6BE"/><path d="M-10 -30h20l-10-8z" fill="#2F4A6E"/><circle cx="0" cy="-24" r="3" fill="#FFD27A"/><g class="glow" style="animation-duration:3.4s"><path d="M-34 -42q17-12 34 0t34 0v-8q-17-10-34 0t-34 0z" fill="#5BF0A4" opacity=".75"/><path d="M-30 -52q15-9 30 0t30 0v-6q-15-8-30 0t-30 0z" fill="#E07AB8" opacity=".5"/></g>`;
  case "baumhaus": return `<rect x="-4" y="-34" width="8" height="34" fill="#8A5A3B"/><path d="M-4 -12l-8 6M4 -16l7 5" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round"/><g class="sway" style="animation-duration:5s"><circle cx="-10" cy="-44" r="14" fill="#4E9A58"/><circle cx="10" cy="-46" r="14" fill="#5FA864"/><circle cx="0" cy="-56" r="13" fill="#4E9A58"/></g><rect x="-12" y="-42" width="24" height="13" rx="1.5" fill="#B07A55"/><path d="M-15 -42l15-9 15 9z" fill="#FF9C7A"/><rect x="-3" y="-39" width="6" height="10" fill="#7A3A22"/><g class="glow" style="animation-duration:3s"><rect x="5" y="-39" width="4" height="4" fill="#FFD27A"/></g><path d="M-14 -29h28" stroke="#7A5038" stroke-width="2"/><path d="M10 -29l3 29M14 -29l3 29M10.6 -22h4M11.4 -15h4M12.2 -8h4" stroke="#D9C38E" stroke-width="1.2"/>`;
  case "floss": return `<g class="wave" style="animation-duration:3.2s"><g fill="#B07A55" stroke="#7A5038" stroke-width=".8">${[-18,-10,-2,6,14].map(x=>`<rect x="${x}" y="-6" width="7" height="6" rx="3"/>`).join("")}</g><path d="M-16 -4h34" stroke="#7A5038" stroke-width="1.2"/><path d="M0 -6v-30" stroke="#8A5A3B" stroke-width="2"/><g class="sway" style="animation-duration:3s"><path d="M1 -34q14 10 0 24z" fill="#F3F1EA"/></g><g class="flagwave"><path d="M0 -36h7l-2 2 2 2h-7z" fill="#C8F169"/></g><path d="M-14 -6v-6M-14 -12l-4 6" stroke="#7A5038" stroke-width="1"/></g>`;
  case "festzelt": return `<path d="M-22 0v-14l22-14 22 14v14z" fill="#F3F1EA"/>${[-16,-6,4,14].map(x=>`<path d="M${x} 0v-14l${x<0?3:-3} -${x<0?2:2}" stroke="#FF9C7A" stroke-width="5" fill="none"/>`).join("")}<path d="M-22 -14l22-14 22 14" fill="none" stroke="#E5484D" stroke-width="2.4" stroke-linejoin="round"/><path d="M-6 0v-10q6-5 12 0v10z" fill="#3A3D58"/><path d="M0 -28v-8" stroke="#A4A6BD" stroke-width="1.4"/><g class="flagwave"><path d="M0 -36h8l-2 2 2 2h-8z" fill="#FFD27A"/></g>${[-18,-10,-2,6,14].map((x,i)=>`<g class="glow" style="animation-duration:1.4s;animation-delay:${i*.25}s"><circle cx="${x+2}" cy="${-15+Math.abs(x+2)/6}" r="1.8" fill="${["#FFD27A","#C8F169","#B6A4FF","#FF9C7A","#5BC0A8"][i]}"/></g>`).join("")}`;
  case "strandhaus": return `<path d="M-18 0v-8M18 0v-8M0 0v-8" stroke="#8A5A3B" stroke-width="2.4"/><rect x="-22" y="-10" width="44" height="3" fill="#B07A55"/><rect x="-16" y="-28" width="32" height="18" fill="#7CB8E8"/><path d="M-16 -24h32M-16 -20h32M-16 -16h32M-16 -12h32" stroke="#5F9ED4" stroke-width=".8"/><path d="M-20 -28l20-12 20 12z" fill="#F3F1EA"/><rect x="-4" y="-22" width="8" height="12" fill="#F3F1EA"/><g class="glow" style="animation-duration:3s"><rect x="-13" y="-24" width="6" height="6" fill="#FFD27A"/></g><rect x="7" y="-24" width="6" height="6" fill="#F3F1EA"/><path d="M-22 -10v-5h4" stroke="#F3F1EA" stroke-width="1"/><g class="sway" style="animation-duration:3.6s"><path d="M19 -10l3-4M19 -10l4 0" stroke="#FFB86B" stroke-width="1.6"/></g>`;
  case "beachclub": return `<path d="M-20 0v-10h22v10z" fill="#B07A55"/><rect x="-21" y="-12" width="24" height="3" rx="1" fill="#7A5038"/><path d="M-22 -26l12-6 12 6z" fill="#5BC0A8"/><path d="M-18 -26v14M-2 -26v14" stroke="#8A5A3B" stroke-width="1.6"/><path d="M-16 -36q8-6 16 0" stroke="#3A3D58" stroke-width=".6" fill="none"/>${[-15,-11,-7,-3].map((x,i)=>`<g class="glow" style="animation-duration:1.5s;animation-delay:${i*.3}s"><circle cx="${x}" cy="${-34+Math.abs(x+9)/3}" r="1.6" fill="${["#FF9C7A","#FFD27A","#C8F169","#B6A4FF"][i]}"/></g>`).join("")}<g transform="translate(-14 -12)"><rect x="-1.4" y="-6" width="2.8" height="6" rx="1" fill="#E5484D" opacity=".85"/><path d="M0 -6l2-3" stroke="#C8F169" stroke-width=".8"/></g><g transform="translate(-6 -12)"><rect x="-1.4" y="-5" width="2.8" height="5" rx="1" fill="#FFB86B" opacity=".85"/></g><path d="M14 0l2-24" stroke="#7A5038" stroke-width="1.4"/><g class="sway" style="animation-duration:4s"><path d="M4 -22q12-12 26 2z" fill="#FFD27A"/><path d="M10 -26q2 4 2 6M20 -27q2 3 3 6" stroke="#FF9C7A" stroke-width="2.6" fill="none"/></g><path d="M8 0l4-6h8l4 6" stroke="#F3F1EA" stroke-width="1.4" fill="none"/>`;
  }
  return "";
}
let bauTab="laden";
function viewProjekt(){
  const tabs=[["laden","Laden"],["projekte","Projekte"]].concat(feature("reise")?[["reise","Weltreise"]]:[]);
  if(!tabs.some(t=>t[0]===bauTab)) bauTab="laden";
  const seg=`<div class="row" role="tablist" style="position:sticky;top:0;z-index:5;background:var(--ground);padding:8px 0;margin:-8px 0">${tabs.map(([id,n])=>`<button class="btn ${bauTab===id?"":"secondary"} grow" style="padding:0 6px" data-bau="${id}" role="tab" aria-selected="${bauTab===id}">${n}</button>`).join("")}</div>`;
  const top=bauHero()+traderCard();
  if(bauTab==="reise") return top+seg+viewReise();
  if(bauTab==="laden") return top+seg+(feature("laden")?viewShop():`<div class="card"><p class="label">Inselladen</p><p class="muted">Der Laden öffnet nach deinem ersten eingetragenen Tag. Dann kannst du Punkte für Deko und Nützliches ausgeben.</p></div>`);
  return top+seg+`<div class="card"><p class="label">${esc(curWorld().name)}</p><h2>Großprojekte</h2><p class="muted small">Ist ein Projekt fertig, startet sofort das nächste.</p>
  ${curProjects().map((p,i)=>{
    const done=S.built.includes(p.id), cur=i===S.projectIdx;
    const prog=cur?Math.min(100,S.material/(p.hours*60)*100):done?100:0;
    return `<div class="proj"><div class="badge" style="${done?"background:var(--lime);color:#14151F":cur?"background:var(--lilac);color:#14151F":""}">${i+1}</div>
    <div class="grow"><p><b>${p.name}</b> <span class="small muted">· ${p.hours} h</span></p><p class="small muted">${p.text}</p>
    ${cur?`<div class="bar" style="margin-top:6px"><i style="width:${prog}%;background:var(--lilac)"></i></div>`:""}</div>
    <span class="chip ${done?"good":cur?"ok":"gone"}">${done?"gebaut":cur?"läuft":"später"}</span></div>`}).join("")}
  </div>${viewGemeinsam()}`;
}
/* Bauen: Bild mit dem nächsten Großprojekt als Bauplatz, Chips und Material-Ring */
// Die Heimatinsel-Projekte malt renderScene direkt in die Szene, hier kleine Einzelbilder dafür
function bauSvg(id){
  switch(id){
  case "leuchtturm": return `<path d="M-8 0l3-34h10l3 34z" fill="#F3F1EA"/><path d="M-7.2 -9h14.4l-.6-7h-13.2zM-5.6 -27h11.2l-.5-6h-10.2z" fill="#FF9C7A"/><rect x="-6" y="-41" width="12" height="7" rx="1.5" fill="#3A3D58"/><g class="glow"><rect x="-4" y="-40" width="8" height="5" rx="1" fill="#FFD27A"/></g><path d="M-7 -41l7-6 7 6z" fill="#FF9C7A"/>`;
  case "bruecke": return `<path d="M-30 0q30-26 60 0" stroke="#A0703F" stroke-width="4" fill="none"/><path d="M-30 -2h60" stroke="#8A5A3B" stroke-width="3"/>${[-20,-10,0,10,20].map(x=>`<path d="M${x} -2v${-Math.round(13-x*x/60)}" stroke="#C9A26A" stroke-width="1.6"/>`).join("")}`;
  case "schiff": return `<g class="bob" style="animation-duration:2.8s"><path d="M-24 -6h48l-8 10h-32z" fill="#FF9C7A"/><path d="M0 -6v-34" stroke="#8A5A3B" stroke-width="2"/><path d="M2 -38l18 28h-18z" fill="#F3F1EA"/><path d="M-2 -34l-14 24h14z" fill="#E8E2D2"/><path d="M0 -40l7 3-7 3" fill="#B6A4FF"/></g>`;
  case "windmuehle": return `<path d="M-7 0l2-28h10l2 28z" fill="#F3F1EA"/><rect x="-3" y="-9" width="6" height="9" rx="2" fill="#8A5A3B"/><g class="spin"><path d="M0 -28l-16-13M0 -28l16-13M0 -28l-13 16M0 -28l13 16" stroke="#FFB86B" stroke-width="3.4" stroke-linecap="round"/></g><circle cx="0" cy="-28" r="2.4" fill="#8A5A3B"/>`;
  case "insel3": return `<ellipse cx="0" cy="-2" rx="30" ry="6" fill="#F0D9A0"/><path d="M-22 -3c6-12 14-16 22-16s16 4 22 16z" fill="#7FC57A"/><path d="M6 -16q2-12-2-22" stroke="#8A5A3B" stroke-width="2.4" fill="none"/><path d="M4 -38q-10-2-14 6M4 -38q10-3 14 5M4 -38q-2-8-10-10M4 -38q6-7 12-6" stroke="#3FA35A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  return projectSvg(id);
}
function bauHero(){
  const list=curProjects(), p=list[S.projectIdx], last=list[list.length-1];
  const show=p||last, need=p?p.hours*60:1, pct=p?Math.min(1,S.material/need):1;
  const mh=Math.floor(S.material/60), built=list.filter(x=>S.built.includes(x.id)).length;
  // noch nicht gebaut: blass mit Gerüst und Kran, fertig: in Farbe
  const scaff=p?`<g stroke="#C9A26A" stroke-width="2" opacity=".8"><path d="M116 128v-84M244 128v-84M110 64h140M110 98h140"/><path d="M116 98l30-34M244 98l-30-34" stroke-width="1.4"/></g><path d="M268 128v-100h-10m10 0h40" stroke="#FFD27A" stroke-width="3" fill="none"/><path d="M302 28v20" stroke="#A4A6BD" stroke-width="1.2"/><rect x="296" y="48" width="12" height="9" rx="1.5" fill="#8A5A3B"/>`:"";
  const hero=`<svg viewBox="0 0 360 200" role="img" aria-label="${p?"Bauplatz: "+esc(p.name):"Alle Großprojekte gebaut"}" style="width:100%;height:auto;display:block"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2F55"/><stop offset="1" stop-color="#6E6A9E"/></linearGradient></defs>
    <rect width="360" height="200" fill="url(#bg1)"/><circle cx="52" cy="40" r="14" fill="#FFE7A3" opacity=".9"/>
    <rect y="128" width="360" height="72" fill="#3B5C8C"/><path d="M0 140h360M0 154h360" stroke="#F3F1EA" stroke-width="1" opacity=".15" stroke-dasharray="14 18"/>
    <path d="M64 134q116-30 232 0z" fill="#E8CF94"/>
    ${scaff}<g transform="translate(180 128) scale(2.1)"${p?` opacity=".6" style="filter:grayscale(.6)"`:""}>${show?bauSvg(show.id):""}</g></svg>`;
  return `<div class="hero-card" style="background:#2B2F55">${hero}</div>
  <div class="scene-chips">
    <div class="cp"><i>Material</i><b>${p?mh+" / "+p.hours+" h":mh+" h"}</b></div>
    <div class="cp"><i>Gebaut</i><b style="color:var(--lime)">${built} von ${list.length}</b></div>
    <div class="cp"><i>Punkte</i><b style="color:var(--lilac)">${S.points}</b></div>
  </div>
  <div class="card"><div class="row" style="gap:14px;align-items:center">${ringSvg(pct,Math.round(pct*100)+" %",p?"Material":"fertig","#B6A4FF")}<div class="grow">
    <p class="label">${esc(curWorld().name)} · ${p?"Projekt "+(S.projectIdx+1):"alles gebaut"}</p><h3 class="hm-title">${esc(show?show.name:"")}</h3>
    <p class="small muted">${p?"Jede Minute unter deinem Schnitt wird Baumaterial."+(S.material<need?" Noch "+hm(need-S.material)+".":" Fertig mit dem nächsten Eintrag."):"Diese Welt ist fertig gebaut. Mit der Weltreise geht es weiter."}</p></div></div></div>`;
}
function viewGemeinsam(){
  if(!db||!MY_ID) return "";
  const GOAL=100*60;
  const jt=JOINT?JOINT.total:0;
  const canSail=has("schiff")||S.testmode;
  return `<div class="card"><p class="label">Gemeinsames Groẞprojekt</p><p><b>Brücke der Freundschaft</b></p>
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
  s+=`<line x1="0" x2="${W}" y1="${by}" y2="${by}" stroke="#7C7F99" stroke-dasharray="4 4"/>`;
  d.forEach((x,i)=>{const h=Math.max(2,x.min/max*H);s+=`<rect x="${i*bw+3}" y="${H-h}" width="${bw-6}" height="${h}" rx="4" fill="${x.min<=S.budget?"#C8F169":"#FF9C7A"}"><title>${nice(x.day)}: ${hm(x.min)}</title></rect><text x="${i*bw+bw/2}" y="${H+14}" text-anchor="middle" font-size="9" fill="#A4A6BD" font-family="Manrope, sans-serif">${parse(x.day).getDate()}.</text>`});
  s+=`<text x="4" y="${by-5}" font-size="10" font-weight="700" fill="#A4A6BD" stroke="#1E2030" stroke-width="3" paint-order="stroke" font-family="Manrope, sans-serif">Budget ${hm(S.budget)}</text>`;
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
  const bottles=S.finds.filter(f=>f.msg).reverse().filter((f,i,a)=>a.findIndex(x=>x.msg===f.msg)===i).slice(0,3);   // gleiche Botschaft nur einmal
  return `<div class="card"><div class="row between"><p class="label">Sammlung</p><span class="small muted num">${S.finds.length} ${S.finds.length===1?"Fund":"Funde"}</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${FINDS.map(f=>{const ok=have.has(f.id);const n=S.finds.filter(x=>x.id===f.id).length;
    return `<div style="background:var(--ground);border-radius:14px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;${ok?"":"opacity:.4"}"><svg width="40" height="30" viewBox="-16 -22 32 24" aria-hidden="true">${ok?findSvg(f.id):`<g style="filter:brightness(0) invert(.45)">${findSvg(f.id)}</g>`}</svg><span style="font-size:11px;font-weight:700;text-align:center;line-height:1.2">${ok?esc(f.n)+(n>1?" ×"+n:""):"?"}</span></div>`}).join("")}</div>
  ${bottles.length?`<p class="small" style="font-weight:700">Flaschenpost</p>${bottles.map(b=>`<p class="small" style="font-family:'Caveat',cursive;font-size:19px;line-height:1.2">${esc(b.msg)}</p>`).join("")}`:""}
  <p class="small muted">Je früher das Handy abends weg ist, desto mehr wird angespült.</p></div>`;
}
function viewKapseln(){
  const cs=S.capsules.slice().reverse();
  return `<div class="card">${cs.length?cs.map(c=>`<button data-kapsel="${c.id}" style="display:flex;flex-direction:column;gap:2px;text-align:left;border:none;border-radius:14px;background:var(--ground);color:var(--ink);padding:10px 12px;min-height:48px"><b>${esc(c.title)}</b><span class="small muted">${esc(c.lines[0])}</span></button>`).join("")
    :`<p class="small muted">Am Ende jedes Monats bekommst du hier eine Rückblick-Karte, die du teilen kannst.</p>`}</div>`;
}
function viewVerlauf(){
  const have=new Set(S.postcards.map(c=>c.motif)), found=new Set(S.finds.map(f=>f.id));
  const cards=S.postcards.slice().reverse();
  // Bild: die letzten drei Postkarten als Stapel, leere Plätze gestrichelt
  const slots=[0,1,2].map(i=>cards[i]?MOTIFS.find(x=>x.id===cards[i].motif)||MOTIFS[0]:null);
  const pos=[["8%","10%",-7],["44%","6%",5],["24%","30%",-2]];
  const hero=`<div class="album-hero" role="img" aria-label="${cards.length?"Deine letzten Postkarten":"Noch keine Postkarten"}">${slots.map((m,i)=>`<div class="ah-card${m?"":" empty"}" style="left:${pos[i][0]};top:${pos[i][1]};transform:rotate(${pos[i][2]}deg)">${m?motifSvg(m,true):"<span>?</span>"}</div>`).reverse().join("")}
    ${[...found].slice(0,2).map((id,i)=>`<svg class="ah-find" style="left:${i?"84%":"6%"};top:${i?"14%":"52%"}" width="46" height="34" viewBox="-16 -22 32 24" aria-hidden="true">${findSvg(id)}</svg>`).join("")}</div>`;
  return `<div class="hero-card" style="background:#2A2238">${hero}</div>
  <div class="scene-chips">
    <div class="cp"><i>Postkarten</i><b>${have.size} / ${MOTIFS.length}</b></div>
    <div class="cp"><i>Strandgut</i><b>${found.size} / ${FINDS.length}</b></div>
    <div class="cp"><i>Kapseln</i><b>${S.capsules.length}</b></div>
  </div>
  ${viewBayAlbum()}
  <div class="sec-h"><span>Postkarten</span><span class="num" style="text-transform:none;letter-spacing:0">${cards.length?cards.length+" "+(cards.length===1?"Karte":"Karten"):""}</span></div>
  ${cards.length?`<div class="fy-row">${cards.map(c=>{const m=MOTIFS.find(x=>x.id===c.motif)||MOTIFS[0];
    return `<button class="fy" data-card="${c.id}" style="border:none;text-align:left;color:var(--ink);font:inherit"><span style="border-radius:6px;overflow:hidden;border:2px solid #F3F1EA;display:block">${motifSvg(m,true)}</span><b>${esc(m.title)}</b><span class="small muted" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(c.text)}</span></button>`}).join("")}</div>`
    :`<div class="card"><p class="small muted">Noch keine Post. Wer wegzieht, schreibt dir. Jede Karte hat ein Motiv, das du sammeln kannst.</p></div>`}
  ${cards.length?viewAlbum():""}
  <div class="sec-h"><span>Strandgut</span></div>
  ${viewStrandgut()}
  <div class="sec-h"><span>Zeitkapseln</span></div>
  ${viewKapseln()}
  <div class="sec-h"><span>Tagebuch</span></div>
  <div class="card"><div class="row between"><p class="label">Letzte 14 Tage</p><span class="small muted">${S.days.length} Tage gespielt</span></div>${chart()||`<p class="muted">Noch keine Tage eingetragen.</p>`}</div>
  ${feedCard("feed","Inseltagebuch",S.feed,"Hier erscheint, was auf deiner Insel passiert.")}
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
    ${S.allFeatures?"":`<label class="check" for="allFeat"><input type="checkbox" id="allFeat"> Alle Funktionen sofort zeigen (statt nach und nach)</label>`}
    <label class="check" for="alarmToggle"><input type="checkbox" id="alarmToggle" ${S.alarm!==false?"checked":""}> Wecker-Ton, wenn die Fokus-Bootsfahrt geschafft ist</label>
    <label class="check" for="soundToggle"><input type="checkbox" id="soundToggle" ${S.sound!==false?"checked":""}> Töne und Geräusche</label>
  </div>
  ${netConfigured()?`<div class="card"><p class="label">Online: Freunde und Ranglisten</p>
    <label class="check" for="netToggle"><input type="checkbox" id="netToggle" ${netOn()?"checked":""}> Online sein (Name, Avatar und Wochen-Bildschirmzeit für Freund:innen sichtbar)</label>
    ${netOn()?`<label class="check" for="netPub"><input type="checkbox" id="netPub" ${S.online.pub?"checked":""}> Auch in der Rangliste für alle erscheinen</label>
    <p class="small muted">Ausschalten löscht alle Online-Daten dieses Kontos und trennt die Online-Freundschaften.</p>`:""}
  </div>`:""}
  ${stCard()}
  ${netConfigured()?backupCard():""}
  ${netConfigured()?`<div class="card"><p class="label">Anonyme Statistik</p>
    <label class="check" for="statsToggle"><input type="checkbox" id="statsToggle" ${statsDev().consent===true?"checked":""}> Anonym mitzählen, welche Funktionen genutzt werden</label>
    <p class="small muted">Nur Zähler wie „heute wurde ein Tag eingetragen“, ohne Namen, Bildschirmzeiten oder Kennung. Gilt für dieses Gerät.</p></div>`:""}
  <div class="card"><p class="label">Sicherung</p>
    <p class="small muted">Dein Spielstand liegt nur in diesem Browser. Lade ab und zu eine Sicherung herunter, um ihn auf ein anderes Gerät mitzunehmen.</p>
    <div class="row"><button class="btn secondary grow" id="exportBtn">Sichern</button><button class="btn secondary grow" id="importBtn">Laden</button></div>
    <input type="file" id="importFile" accept="application/json,.json" hidden>
  </div>
  ${netConfigured()?`<div class="card"><p class="label">Familieninsel</p>
    ${S.family?`<p>Du bist auf der Familieninsel <b>${esc(S.family.name)}</b>.</p>
      <label class="check" for="famShare"><input type="checkbox" id="famShare" ${S.family.share?"checked":""}> Meine Minuten für die Familie sichtbar machen (sonst nur „im Budget“ ja/nein)</label>
      <button class="btn ghost" id="famLeaveBtn">Familieninsel verlassen</button>`
    :`<p class="small muted">Gründe eine Familieninsel oder tritt einer bei: im Tab Freunde.</p>`}
  </div>`:""}
  <p class="small muted" id="verLine" style="text-align:center;padding:8px;user-select:none">OffLand · Version ${APP_VERSION}${devMode()?" · Entwicklermodus":""}</p>`;
}

/* ---------- Inselansicht: Gesamtbild oder einzelne Insel, per Wischen ---------- */
let islandView=0, vbAnim=null;
function islandViews(){
  const v=[{n:"Alle Inseln",vb:[0,0,360,240]}];
  const W=curWorld();
  if(!has(W.isle2)) return v;
  v.push({n:"Hauptinsel",vb:[0,62,246,164]});
  v.push({n:"Nachbarinsel",vb:[204,94,156,104]});
  if(has(W.isle3)) v.push({n:"Dritte Insel",vb:[234,156,126,84]});
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
  if(scenePaused){const sv=$("#scene > svg"); if(sv&&sv.pauseAnimations) sv.pauseAnimations()}
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
/* Animationen im Inselbild anhalten, solange es nicht zu sehen ist: spart Rechenzeit, das Scrollen ruckelt nicht */
let scenePaused=false;
(function(){
  if(!("IntersectionObserver" in window)) return;
  new IntersectionObserver(es=>{const vis=es[es.length-1].isIntersecting; scenePaused=!vis;
    const el=$("#scene"); el.classList.toggle("paused",!vis);
    const sv=$("#scene > svg"); if(sv&&sv.pauseAnimations){vis?sv.unpauseAnimations():sv.pauseAnimations()}
  }).observe($("#scene"));
})();
(function(){ // Wischen auf dem Inselbild
  const el=$("#scene"); let x0=null,y0=0;
  el.addEventListener("touchstart",e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  el.addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3) goView(islandView+(dx<0?1:-1))},{passive:true});
})();

/* ---------- Rendern ---------- */
function render(){
  // Im Tab Freunde steht die Familieninsel, dort die eigene Insel oben ausblenden
  $("#scene").hidden=["freunde","bewohner","zeit","projekt","verlauf"].includes(tab);
  renderScene();
  $("#streakChip").textContent=S.happyStreak>0?S.happyStreak+(S.happyStreak===1?" glücklicher Tag":" glückliche Tage"):S.dayCount+(S.dayCount===1?" Tag":" Tage")+" gespielt";
  $("#streakChip").className="chip "+(S.happyStreak>0?"good":"gone");
  $("#accBtn").innerHTML=ACC?avatarSvg(ACC.avatar,40):"";
  $("#title").textContent=!S.setup?"Deine Insel":tab==="heute"?(ACC?"Hallo "+ACC.name:"Deine Insel"):tab==="bewohner"?"Bewohner":tab==="zeit"?"Deine Zeit":tab==="projekt"?"Bauen":tab==="freunde"?"Freunde":tab==="verlauf"?"Album":"Deine Insel";
  $("#dateline").textContent="OffLand · "+new Date().toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"short"});
  if(TAB_FEATURE[tab]&&!feature(TAB_FEATURE[tab])) tab="heute";
  let nTabs=0;
  document.querySelectorAll("#tabs button").forEach(b=>{const show=!TAB_FEATURE[b.dataset.tab]||feature(TAB_FEATURE[b.dataset.tab]);b.hidden=!show;if(show)nTabs++;b.setAttribute("aria-current",b.dataset.tab===tab?"page":"false")});
  $("#tabs").style.gridTemplateColumns="repeat("+nTabs+",minmax(0,1fr))";
  const v=!S.setup?viewSetup():tab==="heute"?viewHeute():tab==="bewohner"?viewBewohner():tab==="zeit"?viewZeit():tab==="projekt"?viewProjekt():tab==="freunde"?viewFreunde():viewVerlauf();
  $("#view").innerHTML=`<div style="display:flex;flex-direction:column;gap:12px">${v}</div>`;
  bind();
  renderFocus();
  if(tab==="freunde"&&$("#rankBox")) fillRanks();
  if(tab==="freunde"&&$("#famBox")) fillFamily();
}
function bind(){
  const sb=$("#setBudget"), sa=$("#setBase");
  if(sb) sb.oninput=()=>{S.budget=+sb.value;$("#setBudgetOut").textContent=hm(S.budget)};
  if(sa) sa.oninput=()=>{S.baseline=+sa.value;$("#setBaseOut").textContent=hm(S.baseline)};
  if(sb) sb.onchange=save; if(sa) sa.onchange=save;
  const st=$("#startBtn"); if(st) st.onclick=()=>{S.setup=true;stat("insel_start");log("Deine Insel ist gegründet. "+nameList(here().map(r=>r.name))+" ziehen ein.","good");save();render();if(famInvite())famJoinSheet(famInvite())};
  const bo=$("#bkOn"); if(bo) bo.onclick=backupEnable;
  const wsb=$("#wishShop"); if(wsb) wsb.onclick=()=>{tab="projekt";bauTab="laden";render();window.scrollTo(0,0)};
  document.querySelectorAll("[data-bau]").forEach(b=>b.onclick=()=>{bauTab=b.dataset.bau;render();const t=$("[data-bau]");if(t&&t.getBoundingClientRect().top<0)t.scrollIntoView({block:"start"})});
  const stS=$("#stSetup"); if(stS) stS.onclick=stSetup;
  const stA=$("#stApps"); if(stA) stA.onclick=async()=>{try{await ST.pickApps()}catch(e){} await stStatus(); settingsSheet()};
  const stO=$("#stOff"); if(stO) stO.onclick=async()=>{try{await ST.stop()}catch(e){} S.autoTime=false; save(); await stStatus(); settingsSheet()};
  ["#inH","#inM"].forEach(id=>{const el=$(id); if(el) el.addEventListener("input",()=>{el.dataset.touched="1"})});
  if(ST&&$("#inH")) stFill();
  const bn=$("#bkNow"); if(bn) bn.onclick=async()=>{bn.disabled=true;bn.textContent="Sichere …";const ok=await backupNow(true);toast(ok?"Insel gesichert":"Sichern hat nicht geklappt");settingsSheet()};
  const bc=$("#bkCopy"); if(bc) bc.onclick=async()=>{try{await navigator.clipboard.writeText(S.backup.code);toast("Code kopiert")}catch(e){toast("Kopieren nicht möglich, bitte abschreiben")}};
  const bx=$("#bkOff"); if(bx) bx.onclick=async()=>{bx.disabled=true;await backupDelete();toast("Online-Backup gelöscht");settingsSheet()};
  const af=$("#allFeat"); if(af) af.onchange=()=>{if(af.checked){S.allFeatures=true;save();toast("Alle Funktionen sind jetzt sichtbar")}};
  const sh=$("#shareBtn"); if(sh) sh.onclick=shareSheet;
  const fb=$("#friendsBtn"); if(fb) fb.onclick=friendsSheet;
  const rb=$("#rankBtn"); if(rb) rb.onclick=rankSheet;
  const go=$("#goOnline"); if(go) go.onclick=()=>onlineConsent(()=>{closeModal();RANKC=null;tab="freunde";render()});
  document.querySelectorAll("[data-rk]").forEach(b=>b.onclick=()=>{rankTab=b.dataset.rk;render()});
  const ra=$("#rkAdd"); if(ra) ra.onclick=async()=>{ra.disabled=true;ra.textContent="Suche …";const e=await addFriend($("#rkCode").value,false);
    if(!document.body.contains(ra)) return;
    ra.disabled=false;ra.textContent="Hinzufügen";
    if(e) return $("#rkErr").textContent=e; sfx("project"); toast(LAST_PLUS?"Verbunden! Ein Monat Plus ist aktiv.":"Verbunden! Gemeinsames Ziel gestartet."); rankTab="freunde"; RANKC=null; render()};
  const on=$("#netToggle"); if(on) on.onchange=async()=>{if(on.checked){on.checked=false;onlineConsent(()=>{closeModal();render();toast("Du bist online!")})}else{on.disabled=true;await netDeleteAll();toast("Online-Daten gelöscht");render()}};
  const stt=$("#statsToggle"); if(stt) stt.onchange=()=>{statsSet(stt.checked);toast(stt.checked?"Danke fürs Mithelfen!":"Statistik aus")};
  const pb=$("#netPub"); if(pb) pb.onchange=()=>{S.online.pub=pb.checked;save();netSync()};
  const ia=$("#inviteAccept"); if(ia) ia.onclick=inviteSheet;
  const gg=$("#goalGo"); if(gg) gg.onclick=()=>{ENTRY_OPEN=true;render();const c=$("#closeCard");if(c)c.scrollIntoView({behavior:"smooth",block:"center"})};
  const wm=$("#whMore"); if(wm) wm.onclick=whisperSheet;
  ["#inH","#inM"].forEach(id=>{const el=$(id);if(el)el.oninput=liveUpdate}); liveUpdate();
  const cb=$("#closeBtn"); if(cb) cb.onclick=()=>{
    const h=+($("#inH").value||0), m=+($("#inM").value||0);
    const min=clamp(h*60+m,0,1440);
    const apps={}; S.apps.forEach(a=>{const el=$("#app_"+a.id);if(el&&el.value!=="")apps[a.id]=clamp(+el.value,0,1440)});
    closeDay(min,[],apps);
  };
  const tm=$("#tm"); if(tm) tm.onchange=()=>{S.testmode=tm.checked;save();render()};
  const simApps=bad=>{const o={};S.apps.forEach(a=>{o[a.id]=Math.round(a.limit*(bad?(0.6+Math.random()*1.2):(0.2+Math.random()*0.7)))});return o};
  const simDay=bad=>closeDay(Math.round(S.budget*(bad?(1.3+Math.random()*0.8):(0.4+Math.random()*0.5))/5)*5,[],simApps(bad));
  const g=$("#simGood"); if(g) g.onclick=()=>simDay(false);
  const b=$("#simBad"); if(b) b.onclick=()=>simDay(true);
  const s10=$("#sim10"); if(s10) s10.onclick=()=>{const keep=S.pending.length;for(let i=0;i<10;i++){if($("#modalRoot").innerHTML) break; simDay(Math.random()<.25)}};
  document.querySelectorAll("[data-boat]").forEach(x=>x.onclick=()=>focusSheet(+x.dataset.boat));
  document.querySelectorAll("[data-act]").forEach(x=>x.onclick=()=>doActivity(x.dataset.act));
  const nb=$("#nightBtn"); if(nb) nb.onclick=goodNight;
  const pdn=$("#planDone"); if(pdn) pdn.onclick=()=>{const pl=S.plan, p=pl&&PLANS.find(x=>x.id===pl.id); if(!p) return; pl.res=true; const r=planResult(true,pl.id,pl.day); save(); render(); planDoneSheet(p,r)};
  const wrb=$("#weekBtn"); if(wrb) wrb.onclick=()=>weekSheet(wrb.dataset.wk);
  const zs=$("#zeitShare"); if(zs) zs.onclick=()=>{const e=equivTop(savedTotal())[0]; shareText("Mit OffLand habe ich schon "+hm(savedTotal())+" Handyzeit zurückgewonnen"+(e?", das sind "+e.c+" "+(e.c===1?SING[e.a.n]||e.a.n:e.a.n):"")+".",inviteLink())};
  if($("#bayAlbum")) $("#bayAlbum").onclick=bayAlbumSheet;
  document.querySelectorAll("[data-feed]").forEach(b=>b.onclick=()=>feedSheet(b.dataset.feed));
  const wrr=$("#weekReadyBtn"); if(wrr) wrr.onclick=()=>weekSheet(S.weekReady.wk);
  const vo=$("#vacOff"); if(vo) vo.onclick=()=>setVacation(false);
  const dt=$("#deathToggle"); if(dt) dt.onchange=()=>{S.natDeath=dt.checked;save()};
  document.querySelectorAll("[data-tea]").forEach(x=>x.onclick=()=>giveTea(x.dataset.tea));
  const vt=$("#vacToggle"); if(vt) vt.onchange=()=>setVacation(vt.checked);
  const al=$("#alarmToggle"); if(al) al.onchange=()=>{S.alarm=al.checked;save();if(al.checked)ringAlarm()};
  const so=$("#soundToggle"); if(so) so.onchange=()=>{S.sound=so.checked;save();if(so.checked)sfx("return")};
  document.querySelectorAll("[data-lim]").forEach(x=>x.onchange=()=>{const a=S.apps.find(y=>y.id===x.dataset.lim);if(a){a.limit=clamp(+x.value||a.limit,5,600);save()}});
  const fsh=$("#famShare"); if(fsh) fsh.onchange=()=>{S.family.share=fsh.checked;save();famSync()};
  const flv=$("#famLeaveBtn"); if(flv) flv.onclick=async()=>{flv.disabled=true;await famLeave();toast("Familieninsel verlassen");settingsSheet()};
  const fnew=$("#famNew"); if(fnew) fnew.onclick=famCreateSheet;
  const fjoin=$("#famJoinBtn"); if(fjoin) fjoin.onclick=async()=>{const c=cleanCode($("#famCodeIn").value);if(c.length!==6)return $("#famErr").textContent="Ein Familien-Code hat 6 Zeichen.";famJoinSheet(c)};
  const finv=$("#famInvite"); if(finv) finv.onclick=()=>shareText("Komm auf unsere Familieninsel „"+S.family.name+"“ in OffLand! Code: "+S.family.code,APP_URL+"?familie="+S.family.code);
  document.querySelectorAll("[data-visit]").forEach(x=>x.onclick=()=>visitSheet(x.dataset.visit));
  document.querySelectorAll("[data-kapsel]").forEach(x=>x.onclick=()=>{const c=S.capsules.find(y=>y.id===x.dataset.kapsel);if(c) capsuleSheet(c)});
  const rs=$("#resetBtn"); if(rs) rs.onclick=confirmReset;
  const tb=$("#travelBtn"); if(tb) tb.onclick=travelSheet;
  const ex=$("#exportBtn"); if(ex) ex.onclick=exportSave;
  const im=$("#importBtn"), imf=$("#importFile"); if(im&&imf){im.onclick=()=>imf.click();imf.onchange=()=>{if(imf.files[0]) importSave(imf.files[0])}}
  document.querySelectorAll("[data-buy]").forEach(btn=>btn.onclick=()=>{
    const it=allItems().find(x=>x.id===btn.dataset.buy), cost=price(it); if(S.points<cost) return;
    S.points-=cost;
    if(it.consumable){if(it.id==="tee")S.tea++;else if(it.id==="klee")S.glueck=clamp(S.glueck+5,0,100);else S.sun++} else if(!owns(it.id)){ if(!S.items.includes(it.id)) S.items.push(it.id); if(!it.world&&RARE.includes(it)){S.itemW=S.itemW||{};S.itemW[it.id]=curWorldId()} }
    sfx("buy"); stat("kauf"); log("Gekauft: "+it.n+" für "+cost+" Punkte.","good"); toast(it.n+(it.consumable?" auf Vorrat":" steht jetzt auf deiner Insel"));
    if(S.wish&&(!S.wish.type||S.wish.type==="item")&&S.wish.item===it.id) fulfillWish();
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
    case "Papagei": [0,.16].forEach(t=>tone(ac,1600,t,.12,{to:2600,type:"sawtooth",vol:.05})); tone(ac,2200,.36,.2,{to:1400,type:"square",vol:.04}); break;
    case "Elch": tone(ac,180,0,1.1,{to:130,type:"sawtooth",vol:.07,att:.2}); tone(ac,90,0,1.1,{vol:.12,att:.2}); break;
    case "Kamel": tone(ac,240,0,.6,{to:160,type:"sawtooth",vol:.07,vib:10}); noise(ac,.55,.2,{freq:700,vol:.08}); break;
    case "Eisbär": tone(ac,140,0,.7,{to:90,type:"sawtooth",vol:.09,att:.08}); noise(ac,0,.6,{freq:400,q:.6,vol:.07}); break;
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
    case "chapter": notes(ac,["C5","E5","G5","C6"],.12,{type:"triangle",len:.35,vol:.1}); [N.E5,N.G5,N.C6].forEach(f=>tone(ac,f,.55,1.2,{vol:.05,att:.2})); break;
    case "story": notes(ac,["G4","C5","E5","G5","E5","C5","D5","G5"],.13,{type:"triangle",len:.25,vol:.08}); noise(ac,1.1,.3,{type:"highpass",freq:5000,vol:.03}); break;
    case "boat": tone(ac,165,0,.8,{type:"sawtooth",vol:.06,att:.06}); noise(ac,.6,.6,{type:"lowpass",freq:700,vol:.12}); break;
  }
}
/* Stimmen: Mr. Bay brabbelt (tief, freundlich), Lucifer miaut kurz */
function voice(ac,who,text,t0){
  if(who==="luc"){
    tone(ac,520,t0,.09,{to:760,type:"triangle",vol:.07});
    tone(ac,820,t0+.1,.42,{to:560,vol:.11,att:.05,vib:6}); tone(ac,820,t0+.1,.42,{to:560,type:"sawtooth",vol:.025,att:.05});
    return .6;
  }
  const words=String(text||"").split(/\s+/).filter(Boolean).length, n=Math.max(4,Math.min(13,Math.round(words*1.1)));
  const steps=[1,1.12,1.26,.89,1.19,1], base=200+(hsh(text)%40);
  for(let i=0;i<n;i++){const f=base*steps[(hsh(text+i))%steps.length]*(i===n-1?1.2:1);
    tone(ac,f,t0+i*.085,.075,{type:"triangle",vol:.09,att:.008}); tone(ac,f*2,t0+i*.085,.05,{vol:.025,att:.008})}
  return n*.085+.25;
}
function speak(seq,delay){
  const ac=audio(); if(!ac) return;
  let t=delay||0; seq.forEach(([who,text])=>{t+=voice(ac,who,text,t)+.15});
}
function soundFor(ev){
  try{
    const r=ev.id?S.residents.find(x=>x.id===ev.id):null;
    const map={arrival:r&&r.kind==="tier"?["animal",r.art]:["human"],birth:["birth"],postcard:["postcard"],project:["project"],sick:["sick"],warn:["warn"],left:["left"],
      return:["return"],reunion:["return"],conflict:["conflict"],conflictResult:[ev.ok?"resolve":"thud"],love:["love"],crisis:["conflict"],crisisResult:[ev.ok?"resolve":"thud"],breakup:["farewell"],wedding:["fest"],strandgut:["sparkle"],wish:["sparkle"],gift:["sparkle"],
      kapsel:["sparkle"],fest:["fest"],discovery:["aurora"],reply:["postcard"],unlock:["sparkle"],famgoal:["fest"],birthday:["fest"],grownup:["sparkle"],retire:["sparkle"],travel:["project"],farewell:["farewell"],boat:["boat"],welcome:["return"],
      visitor:[ev.kind==="aurora"?"aurora":ev.kind==="birds"?"birds":"horn"],surprise:["sparkle"],duelStart:["horn"],duelEnd:[ev.win?"fest":"sparkle"],day:[ev.min<=S.budget?"goodday":"badday"]};
    const m=map[ev.type]; if(m) sfx(m[0],m[1]);
  }catch(e){}
}
function showPending(){
  if($("#modalRoot").innerHTML) return;
  const ev=S.pending.shift(); if(!ev){return}
  CUR_EV=ev;
  soundFor(ev);
  save();
  if(ev.type==="arrival"||ev.type==="birth"||ev.type==="rename") return nameSheet(ev);
  const scene=`<div class="anim">${animScene(ev)}</div>`;
  if(ev.type==="plan"){
    const p=PLANS.find(x=>x.id===ev.id); if(!p) return showPending();
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      <div class="plan-big">${planIcon(p)}</div>
      <p class="label" style="color:var(--lime)">Dein Vorhaben</p><h2>Hast du heute ${esc(p.pp)}?</h2>
      <p class="muted">Das hattest du dir gestern mit deiner gewonnenen Zeit vorgenommen.</p>
      <button class="btn" id="plYes">Ja, geschafft!</button><button class="btn ghost" id="plNo">Diesmal nicht</button></div></div>`;
    $("#plYes").onclick=()=>{const r=planResult(true,ev.id,ev.day);save();planDoneSheet(p,r)};
    $("#plNo").onclick=()=>{planResult(false,ev.id,ev.day);save();closeModal();render();showPending()};
    return;
  }
  if(ev.type==="week") return weekSheet(ev.wk);
  if(ev.type==="planAsk") return planAskSheet(ev);
  if(ev.type==="chapter") return chapterSheet(ev.n,true);
  if(ev.type==="statsAsk"){CUR_EV=null; if(statsDev().consent!==undefined) return showPending(); return statsAskSheet()}
  if(ev.type==="jokerAsk"){
    if(S.jokerWk===ev.wk||S.lastDay!==ev.day) return showPending();
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      <div class="joker-big" aria-hidden="true">🃏</div>
      <p class="label" style="color:var(--amber)">Deine Serie ist in Gefahr</p><h2>Joker einsetzen?</h2>
      <p class="muted">Heute warst du über deinem Budget. Damit würde deine Serie von <b style="color:var(--ink)">${ev.streak} Tagen</b> reißen. Mit dem Joker bleibt sie bestehen.</p>
      <p class="small muted">Du hast einen Joker pro Woche. Setzt du ihn jetzt nicht ein, kannst du ihn bis Sonntag für einen anderen Tag aufheben.</p>
      <button class="btn" id="jkYes">Joker einsetzen</button><button class="btn ghost" id="jkNo">Aufheben</button></div></div>`;
    $("#jkYes").onclick=()=>{stat("joker_ja");S.jokerWk=ev.wk;S.budgetStreak=ev.streak;log("Joker eingesetzt: Deine Serie von "+ev.streak+" Tagen im Budget bleibt bestehen.","info");
      const d=S.pending.find(x=>x.type==="day"&&x.day===ev.day); if(d) d.joker=ev.streak;
      save();render();setTimeout(netSync,300);
      sheet(`<div class="joker-big flip" aria-hidden="true">🃏</div><p class="label" style="color:var(--amber)">Joker eingesetzt</p><h2>Deine Serie lebt!</h2><p class="muted">${ev.streak} Tage im Budget, und es geht weiter. Morgen ist ein neuer guter Tag.</p><button class="btn" data-ok>Weiter</button>`)};
    $("#jkNo").onclick=()=>{stat("joker_nein");closeModal();render();showPending()};
    return;
  }
  if(ev.type==="surprise") return surpriseSheet(ev);
  if(ev.type==="duelStart") return duelStartSheet(ev);
  if(ev.type==="duelEnd") return duelEndSheet(ev);
  if(ev.type==="day"){
    const good=ev.min<=S.budget, diff=Math.abs(S.budget-ev.min);
    const eq=equivTop(good?ev.saved:diff);
    return sheet(`${scene}<p class="label" style="color:${good?"var(--lime)":"var(--coral)"}">Tagesbilanz · ${nice(ev.day)}</p>
      <div class="row between"><h2>${good?"Gut gemacht!":"Heute war viel Handy"}</h2><span class="countup num" id="cu" style="font-size:28px;color:${ev.after>=ev.before?"var(--lime)":"var(--coral)"}">${ev.before} %</span></div>
      <p class="muted">${hm(ev.min)} Bildschirmzeit, ${good?hm(diff)+" unter":hm(diff)+" über"} deinem Budget.</p>
      <p><b style="color:var(--lilac)">+${ev.pts||0} Punkte</b> <span class="small muted">für den Laden</span>${ev.sunny?` · <span class="small" style="color:var(--amber)">Sonnenschein hat geholfen</span>`:""}</p>
      ${ev.freed?`<p class="phone-note good">📵 <b>${esc(ev.freed)}</b> hat das Handy weggelegt und redet wieder mit allen.</p>`:""}
      ${ev.hooked?`<p class="phone-note bad">📱 <b>${esc(ev.hooked)}</b> hängt wieder am Handy. Ein guter Tag holt ${esc(ev.hooked)} zurück.</p>`:""}
      ${ev.joker?`<div class="joker-note"><span class="joker-card" aria-hidden="true">🃏</span><p><b>Joker eingesetzt!</b> Deine Serie von ${ev.joker} Tagen im Budget bleibt bestehen. Den nächsten Joker gibt es ab Montag.</p></div>`:""}
      ${ev.repaired?`<p style="color:var(--lime)">Reparatur geschafft: +${ev.repaired} % vom schlechten Tag zurückgeholt.</p>`:""}
      ${ev.dreamt?`<p style="color:var(--lilac)">+15 Traumpunkte vom Gute-Nacht-Ritual.</p>`:""}
      ${ev.monsters&&ev.monsters.length?`<p style="color:#C8A8FF">${ev.monsters.map(id=>{const a=S.apps.find(x=>x.id===id);return a?monName(a,false):""}).join(", ")} vor der Insel aufgetaucht.</p>`:""}
      ${good&&ev.saved?`<p>Du warst heute <b>${hm(ev.saved)}</b> weniger am Handy als in deinem bisherigen Schnitt (${hm(S.baseline)} am Tag). Das reicht für ${esc(eqText(eq))}.</p>`:""}
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
  if(ev.type==="crisis"){
    const c=S.crisis; if(!c||c.state!=="neu") return showPending();
    const a=S.residents.find(r=>r.id===c.a), b=S.residents.find(r=>r.id===c.b); if(!a||!b) return showPending();
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      <div class="anim">${base(`<g>${figure(a,214,134)}</g><g>${figure(b,252,134)}</g><g class="pop fb" style="animation-delay:.4s"><path d="M233 98c-3-4-9-1-6 4l6 5 6-5c3-5-3-8-6-4z" fill="#FF9C7A"/><path d="M233 99l-2 4 3 2-2 4" stroke="#1B2340" stroke-width="1.6" fill="none"/></g>`,true)}</div>
      <p class="label" style="color:var(--coral)">Paarkrise</p><h2>${esc(a.name)} und ${esc(b.name)} streiten sich oft</h2>
      <p class="muted">Zu viel Handy, zu wenig Zeit füreinander. Wie hilfst du den beiden?</p>
      <button class="btn" data-cr="abend">Handyfreier Paarabend<br><span class="small" style="font-weight:500">klappt, wenn du morgen im Budget bleibst</span></button>
      <button class="btn secondary" data-cr="warten">Abwarten, sie regeln das selbst</button></div></div>`;
    document.querySelectorAll("[data-cr]").forEach(x=>x.onclick=()=>{S.crisis.state=x.dataset.cr;log(x.dataset.cr==="abend"?"Morgen gibt es einen handyfreien Paarabend für "+a.name+" und "+b.name+".":"Du lässt "+a.name+" und "+b.name+" Zeit.","info");save();closeModal();render();showPending()});
    return;
  }
  if(ev.type==="crisisResult"){
    const a=S.residents.find(r=>r.id===ev.a), b=S.residents.find(r=>r.id===ev.b); if(!a||!b) return showPending();
    return sheet(`<div class="anim">${base(`<g class="bob">${figure(a,226,134)}</g><g class="bob" style="animation-delay:.3s">${figure(b,242,134)}</g>`+(ev.ok?hearts(234,104):""),!ev.ok)}</div>
      <p class="label" style="color:${ev.ok?"var(--lime)":"var(--amber)"}">${ev.ok?"Versöhnt":"Es kriselt weiter"}</p><h2>${ev.ok?esc(a.name)+" und "+esc(b.name)+" halten zusammen":esc(a.name)+" und "+esc(b.name)+" reden kaum noch"}</h2>
      <p class="muted">${ev.ok?(ev.abend?"Der Abend ohne Handys hat gewirkt: Sie haben endlich wieder richtig miteinander geredet.":"Mit etwas Zeit haben die beiden wieder zueinander gefunden."):"Wenn es so weitergeht, trennen sich die beiden. Gute Tage helfen."}</p><button class="btn" data-ok>Weiter</button>`);
  }
  if(ev.type==="breakup"){
    const a=S.residents.find(r=>r.id===ev.a), b=S.residents.find(r=>r.id===ev.b); if(!a||!b) return showPending();
    const kids=(ev.kids||[]).map(id=>S.residents.find(r=>r.id===id)).filter(Boolean), pets=(ev.pets||[]).map(id=>S.residents.find(r=>r.id===id)).filter(Boolean);
    return sheet(`<div class="anim">${base(`<g>${figure(a,206,134)}</g><g>${figure(b,276,134)}</g>`+kids.slice(0,2).map((k,i)=>`<g class="bob">${figure(k,236+i*12,136)}</g>`).join(""),true)}</div>
      <p class="label" style="color:var(--coral)">Trennung</p><h2>${esc(a.name)} und ${esc(b.name)} gehen getrennte Wege</h2>
      <p class="muted">Beide bleiben auf der Insel, aber nicht mehr als Paar.${kids.length?" "+esc(nameList(kids.map(k=>k.name)))+" "+vb(kids,"lebt","leben")+" ab jetzt abwechselnd bei beiden.":""}${pets.length?" "+[...new Set(pets.map(p=>p.owner))].map(o=>{const ps=pets.filter(p=>p.owner===o);return esc(nameList(ps.map(p=>p.name)))+" "+vb(ps,"bleibt","bleiben")+" bei "+esc((S.residents.find(x=>x.id===o)||{}).name||"")}).join(", ")+".":""}</p>
      <p class="small muted">Vielleicht findet jemand von beiden irgendwann neues Glück.</p><button class="btn" data-ok>Okay</button>`);
  }
  if(ev.type==="wedding"){
    const a=S.residents.find(r=>r.id===ev.a), b=S.residents.find(r=>r.id===ev.b); if(!a||!b) return showPending();
    const guests=here().filter(r=>r.kind==="mensch"&&r.id!==a.id&&r.id!==b.id).slice(0,3);
    return sheet(`<div class="anim">${base(`<g transform="translate(234 96)"><path d="M-22 12q22-30 44 0" stroke="#F3F1EA" stroke-width="3" fill="none"/>${[-18,-9,0,9,18].map((x,i)=>`<circle cx="${x}" cy="${Math.abs(x)*.6-4}" r="2.6" fill="${["#FF9C7A","#FFD27A","#F3F1EA","#FFD27A","#FF9C7A"][i]}"/>`).join("")}</g><g class="bob">${figure(a,226,134)}</g><g class="bob" style="animation-delay:.3s">${figure(b,242,134)}</g>`+guests.map((g,i)=>figure(g,262+i*14,136)).join("")+hearts(234,90)+confetti(),false)}</div>
      <p class="label" style="color:var(--lime)">Hochzeit</p><h2>${esc(a.name)} und ${esc(b.name)} haben geheiratet!</h2>
      <p class="muted">Die ganze Insel feiert mit. +5 % Glück und +40 Punkte.</p><button class="btn" data-ok>Hoch sollen sie leben!</button>`);
  }
  if(ev.type==="love"){
    const a=S.residents.find(r=>r.id===ev.a), b=S.residents.find(r=>r.id===ev.b);
    const fresh=(a.ex&&a.ex.length)||a.widowOf||(b.ex&&b.ex.length)||b.widowOf;
    const stepKids=S.residents.filter(k=>k.status==="da"&&k.parents&&(k.parents.includes(a.id)!==k.parents.includes(b.id)));
    if(fresh) return sheet(`<div class="anim">${base(`<g class="bob">${figure(a,226,134)}</g><g class="bob" style="animation-delay:.3s">${figure(b,242,134)}</g>`+stepKids.slice(0,2).map((k,i)=>`<g class="bob" style="animation-delay:${.5+i*.2}s">${figure(k,262+i*12,136)}</g>`).join("")+hearts(234,104),false)}</div>
      <p class="label" style="color:var(--coral)">Neues Glück</p><h2>${esc(a.name)} und ${esc(b.name)} sind ein Paar</h2>
      <p class="muted">Nach allem, was war, haben die beiden wieder jemanden gefunden.${stepKids.length?" Mit "+esc(nameList(stepKids.map(k=>k.name)))+" wird daraus eine Patchworkfamilie.":""}</p><button class="btn" data-ok>Wie schön</button>`);
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
    const r=S.residents.find(x=>x.id===ev.rid); if(!r) return showPending();
    const pets=here().filter(p=>p.kind==="tier"&&p.owner===r.id).slice(0,1);
    return sheet(`<div class="anim">${base(`<g class="bob">${figure(r,232,134)}</g>`+pets.map(p=>`<g class="bob" style="animation-delay:.3s">${figure(p,250,136)}</g>`).join("")+(ev.item?`<g transform="translate(206 134) scale(.9)" class="pop fb">${itemSvg(ev.item)}</g>`:"")+hearts(232,100)+confetti(),false)}</div>
      <p class="label" style="color:var(--lime)">Wunsch erfüllt</p><h2>${esc(r.name)} strahlt!</h2>
      <p class="muted">${esc(ev.text||"")} ${esc(r.name)} bedankt sich: <b style="color:var(--ink)">+${ev.pts||0} Punkte und +${ev.gl||0} % Glück</b>, und eine Woche lang jeden Tag +3 Punkte extra.</p><button class="btn" data-ok>Gern geschehen</button>`);
  }
  if(ev.type==="reunion"){
    const pt=S.residents.find(x=>x.id===ev.pet), o=S.residents.find(x=>x.id===ev.owner);
    if(!pt||!o) return showPending();
    return sheet(`<div class="anim">${base(`<g class="sail-in" style="animation-duration:1.4s">${figure(pt,200,134)}</g>${figure(o,232,134)}`+hearts(216,100),false)}</div><p class="label" style="color:var(--lime)">Wiedersehen</p><h2>${esc(pt.name)} hat ${esc(o.name)} wieder</h2><p class="muted">${esc(SOUND[pt.art]||"")} Jeden Abend hat ${esc(pt.name)} am Steg gewartet. Jetzt ist das Warten vorbei.</p><button class="btn" data-ok>Wie schön</button>`);
  }
  if(ev.type==="birthday"||ev.type==="grownup"||ev.type==="retire"){
    const r=S.residents.find(x=>x.id===ev.id); if(!r) return showPending();
    const cake=`<g transform="translate(206 140)"><rect x="-14" y="-12" width="28" height="12" rx="3" fill="#F3F1EA"/><rect x="-14" y="-8" width="28" height="3" fill="#FF9C7A"/><rect x="-12" y="-20" width="24" height="8" rx="2" fill="#FFB3C7"/>${[-7,0,7].map(x=>`<rect x="${x-.8}" y="-27" width="1.6" height="7" fill="#B6A4FF"/><g class="glow"><path d="M${x} -31q-1.6 2 0 3.6q1.6-1.6 0-3.6z" fill="#FFD27A"/></g>`).join("")}</g>`;
    const fig=`<g class="bob"><g transform="translate(170 140) scale(1.6)">${figure(r,0,0)}</g></g>`;
    if(ev.type==="birthday") return sheet(`<div class="anim">${base(fig+cake+confetti(),false)}</div><p class="label" style="color:var(--lime)">Geburtstag</p><h2>${esc(r.name)} feiert den ${ev.n}. Inselgeburtstag!</h2>
      <p class="muted">Die ganze Insel singt. Es gibt Kuchen am Strand, +15 Punkte und +3 % Glück.</p><button class="btn" data-ok>Happy Birthday!</button>`);
    if(ev.type==="grownup") return sheet(`<div class="anim">${base(fig+hearts(170,96),false)}</div><p class="label" style="color:var(--lime)">Erwachsen</p><h2>${esc(r.name)} ist erwachsen!</h2>
      <p class="muted">Aus dem Kind ist ein:e ${esc(jobName(r.job))} geworden. ${r.parents?"Die Eltern sind mächtig stolz.":""}</p><button class="btn" data-ok>Herzlichen Glückwunsch</button>`);
    return sheet(`<div class="anim">${base(fig,false)}</div><p class="label" style="color:var(--lilac)">Ruhestand</p><h2>${esc(r.name)} geht in Rente</h2>
      <p class="muted">Nach vielen Jahren als ${esc(jobName(r.job))} gibt es jetzt Zeit für Spaziergänge mit dem Gehstock und Geschichten am Strand.</p><button class="btn" data-ok>Schönen Ruhestand!</button>`);
  }
  if(ev.type==="famgoal"){
    return sheet(`<div class="anim">${famScene(ev.members||[],ev.total||0,true)}</div><p class="label" style="color:var(--lime)">Familienziel geschafft</p><h2>Ihr habt es zusammen geschafft!</h2>
      <p class="muted">${ev.good} gute Tage diese Woche, Ziel war ${ev.target}. Jede:r in der Familie bekommt +50 Punkte und +5 % Glück.</p><button class="btn" data-ok>Feiern!</button>`);
  }
  if(ev.type==="unlock"){
    const fs=(ev.ids||[]).map(id=>FEATURES.find(f=>f.id===id)).filter(Boolean); if(!fs.length) return showPending();
    const go=fs[0].tab;
    return sheet(`<p class="label" style="color:var(--lime)">Neu freigeschaltet</p><h2>${fs.length>1?["","","Zwei","Drei","Vier"][fs.length]+" neue Sachen":esc(fs[0].name)}</h2>
      ${fs.map(f=>`<div class="row" style="align-items:flex-start">${featIcon(f,44)}<div class="grow"><p><b>${esc(f.name)}</b></p><p class="small muted">${esc(f.text)}</p></div></div>`).join("")}
      <button class="btn" id="unlGo">Ansehen</button><button class="btn ghost" data-ok>Später</button>`,
      ()=>{$("#unlGo").onclick=()=>{closeModal();tab=go;if(go==="projekt")bauTab=fs[0].id==="reise"?"reise":"laden";render();window.scrollTo(0,0);showPending()}});
  }
  if(ev.type==="reply"){
    const t=(S.tickets||[]).find(x=>x.id===ev.id); if(!t||!t.reply) return showPending();
    t.seen=true; save();
    return sheet(`<p class="label" style="color:var(--lime)">Post vom OffLand-Team</p><h2>Antwort auf deine Anfrage</h2>${ticketHtml(t)}<button class="btn" data-ok>Danke!</button>`);
  }
  if(ev.type==="buddy"){
    return sheet(`<div class="anim">${base(here().filter(r=>r.kind==="mensch").slice(0,4).map((r,i)=>`<g class="bob" style="animation-delay:${i*.2}s">${figure(r,214+i*18,134)}</g>`).join("")+hearts(250,96)+confetti(),false)}</div>
      <p class="label" style="color:var(--lime)">Gemeinsames Ziel geschafft</p><h2>${GOAL_DAYS} gute Tage mit ${esc(ev.code)}</h2>
      <p class="muted">Du hast deine Seite des gemeinsamen Ziels geschafft: +150 Punkte und +5 % Glück. Sag deiner Freundin oder deinem Freund Bescheid und teilt eure Inseln!</p>
      <button class="btn secondary" id="buddyShare">Insel teilen</button><button class="btn" data-ok>Super</button>`,()=>{const b=$("#buddyShare");if(b)b.onclick=shareSheet});
  }
  if(ev.type==="fest"){
    return sheet(`<div class="anim">${base(`<g transform="translate(240 134) scale(1.2)">${itemSvg("feuer")}</g>`+here().filter(r=>r.kind==="mensch").slice(0,5).map((r,i)=>`<g class="bob" style="animation-delay:${i*.2}s">${figure(r,200+i*16+(i>1?24:0),136)}</g>`).join("")+`${[0,1,2,3,4,5].map(i=>`<g class="glow" style="animation-delay:${i*.3}s"><circle cx="${190+i*22}" cy="${80+(i%2)*8}" r="4" fill="#FFD27A"/></g>`).join("")}`+confetti(),false)}</div>
      <p class="label" style="color:var(--amber)">Inselfest</p><h2>Die Insel feiert dich</h2><p class="muted">${ev.good} von 7 Tagen im Budget. Laternen, Lagerfeuer und Musik: +5 % Glück und +30 Punkte.</p><button class="btn" data-ok>Mitfeiern</button>`);
  }
  if(ev.type==="discovery"){
    const W=WORLDS[ev.world]; CUR_EV=null; if(!W) return showPending();
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      ${worldMapSvg()}
      <p class="label" style="color:var(--lime)">Neue Insel entdeckt</p><h2>${esc(W.name)}</h2>
      <p class="muted">${esc(W.text)} Dort warten neue Großprojekte, mehr Platz für Bewohner${W.animals?" und eine neue Tierart":""}.</p>
      ${saysHtml("bay",bayLine({type:"discovery",id:W.id}))}
      <button class="btn" id="discGo">Jetzt aufbrechen</button>
      <button class="btn ghost" id="discLater">Später, über Bauen → Weltreise</button></div></div>`;
    $("#discGo").onclick=travel; $("#discLater").onclick=()=>{closeModal();render();showPending()};
    return;
  }
  if(ev.type==="travel"){
    const W=WORLDS[ev.to]||curWorld(), T=W.theme||{};
    const g=here().filter(r=>r.kind==="mensch").slice(0,4);
    const pic=`<svg viewBox="0 0 360 200" aria-hidden="true"><rect width="360" height="200" fill="${T.sky||"#86BFE6"}"/>${horizonSvg(T.horizon,true)}<rect y="132" width="360" height="68" fill="${T.sea||"#3A6FA8"}"/>
      <ellipse cx="282" cy="138" rx="100" ry="16" fill="${T.sand||"#E9D7A6"}"/><path d="M192 136c10-34 52-48 90-48s80 14 90 48z" fill="${T.grass||"#7FC57A"}"/>
      ${treeSvg(T.tree,232,100,T.leaf||"#4E9A58")}${treeSvg(T.tree,330,102,T.leaf||"#4E9A58")}<g transform="translate(-6 -22)">${hutSvg(T.hut,250,false,false)}</g>
      ${boat(g,"sail-in")}${confetti()}</svg>`;
    return sheet(`<div class="anim">${pic}</div><p class="label" style="color:var(--lime)">Angekommen</p><h2>Willkommen: ${esc(W.name)}!</h2>
      <p class="muted">${esc(W.text)}</p>
      <p>Neue Großprojekte warten im Tab <b>Bauen</b>${W.animals?`, und bald zieht vielleicht ein <b>${esc(W.animals[0])}</b> ein`:""}. Als Umzugsgeld gibt es <b>+100 Punkte</b>.</p>
      <button class="btn" data-ok>Insel erkunden</button>`);
  }
  if(ev.type==="kapsel"){const c=S.capsules.find(x=>x.id===ev.id);if(c) return capsuleSheet(c,true);return showPending()}
  if(ev.type==="boat"){
    const crew=ev.crew?S.residents.find(x=>x.id===ev.crew):null;
    $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
      <div class="anim">${base(boat(crew?[crew]:[],"sail-in"),false)}</div>
      <p class="label" style="color:var(--lilac)">Das Boot ist zurück</p><h2>${ev.dur} Minuten Fokus${ev.cat?": "+esc(focusCat(ev.cat)[1]):""}</h2>
      ${ev.task?`<label class="check" for="boatDone" style="background:var(--ground);border-radius:14px;padding:10px 12px;align-items:flex-start"><input type="checkbox" id="boatDone"><span>Geschafft: <b>${esc(ev.task)}</b><br><span class="small muted">+${Math.round(ev.dur/5)} Punkte und +2 % Glück extra</span></span></label>`:""}
      <p class="muted">${ev.left?"Du hast die App zwischendurch verlassen. ":""}Ehrlich gefragt: Hast du in der Zeit andere Apps benutzt?</p>
      <button class="btn" id="boatYes">Nein, Handy lag weg</button>
      <button class="btn ghost" id="boatNo">Doch, kurz</button></div></div>`;
    const dn=()=>{const c=$("#boatDone");return !!(c&&c.checked)};
    $("#boatYes").onclick=()=>{boatHonest(true,ev.dur,ev.crew,ev.cat,ev.task,dn());closeModal();render();showPending()};
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
    const p=projById(ev.id);
    return sheet(`${scene}<p class="label" style="color:var(--lime)">Groẞprojekt fertig</p><h2>${esc(p.name)} gebaut!</h2><p class="muted">${esc(p.text)}.</p><button class="btn" data-ok>Zur Insel</button>`);
  }
  showPending();
}
let CUR_EV=null;
function sheet(html,after){
  $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  if(CUR_EV){const t=bayLine(CUR_EV); CUR_EV=null; const b=$("#modalRoot .sheet > .btn"); if(t&&b) b.insertAdjacentHTML("beforebegin",saysHtml("bay",t))}
  const ok=$("#modalRoot [data-ok]"); if(ok){ok.focus();ok.onclick=()=>{closeModal();render();showPending()}}
  if(after) after();
}
function nameSheet(ev){
  const r=S.residents.find(x=>x.id===ev.id); if(!r) return showPending();
  let head="", text="";
  if(ev.type==="arrival"){
    const partner=ev.partner?S.residents.find(x=>x.id===ev.partner):null;
    head=r.kind==="mensch"?"Jemand Neues zieht ein":isSea(r)?artikel(r.art,true)+" "+r.art+" ist dem Leuchtturm gefolgt":"Neu auf der Insel: "+artikel(r.art)+" "+r.art;
    text=(r.owner?"Gehört ab jetzt zu "+((S.residents.find(x=>x.id===r.owner)||{}).name||"")+". ":"")+(r.kind==="mensch"?"Arbeitet als "+jobName(r.job)+", "+traitName(r.trait)+". "+(r.phone?"Hat das Handy vom Festland mitgebracht. Ein guter Tag holt "+r.name+" davon weg. ":""):"")+"Deine Insel war mehrere Tage glücklich. Das hat sich herumgesprochen."+(partner?" Und: "+partner.name+" ist nicht mehr allein.":"");
  } else if(ev.type==="birth"){
    const ps=ev.parents.map(id=>S.residents.find(x=>x.id===id)).filter(Boolean);
    head="Nachwuchs bei "+ps.map(p=>p.name).join(" & ")+"!";
    text=r.kind==="mensch"?"Die Familie wächst, weil sich alle auf der Insel wohlfühlen.":artikel(r.art,true,true)+" "+r.art+" ist da.";
  } else { head=r.name+" bearbeiten"; text="Ändere Namen und Aussehen."; }
  const list=r.kind==="mensch"?HUMAN_NAMES:ANIMAL_NAMES;
  const draft=r.kind==="mensch"?lookIdx(r):{fur:animalVar(r)};
  sheet(`${ev.type==="rename"?"":`<div class="anim">${animScene(ev)}</div>`}<p class="label" style="color:var(--lime)">${ev.type==="rename"?"Name und Aussehen":ev.type==="birth"?"Nachwuchs":"Neue Bewohner"}</p>
    <h2>${esc(head)}</h2><p class="muted">${esc(text)}</p>
    <label class="field" for="nameIn">Wie soll ${r.kind==="mensch"?"die Person":"das Tier"} heißen?</label>
    <div class="row"><input id="nameIn" type="text" maxlength="20" value="${esc(r.name)}"><button class="iconbtn" id="dice" aria-label="Zufälligen Namen würfeln"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A4FF" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="#B6A4FF"/><circle cx="15" cy="15" r="1.3" fill="#B6A4FF"/><circle cx="15" cy="9" r="1.3" fill="#B6A4FF"/><circle cx="9" cy="15" r="1.3" fill="#B6A4FF"/></svg></button></div>
    ${lookEditor(r,draft)}
    ${r.kind==="tier"&&!isSea(r)&&adults().length?`<label class="field" for="ownSel">Gehört zu<select id="ownSel" style="height:52px;border:1.5px solid var(--line);border-radius:16px;background:var(--ground);color:var(--ink);font:700 17px var(--body);padding:0 12px">${adults().map(a=>`<option value="${a.id}" ${a.id===r.owner?"selected":""}>${esc(a.name)}</option>`).join("")}<option value="" ${r.owner?"":"selected"}>allen zusammen</option></select></label>`:""}
    <button class="btn" id="nameOk">${ev.type==="rename"?"Speichern":"Willkommen heißen"}</button>
    <button class="btn ghost" id="nameNo">${ev.type==="rename"?"Verwerfen":"Änderungen verwerfen"}</button>`);
  const inp=$("#nameIn");
  // Verwerfen: beim Bearbeiten ohne Speichern schließen, bei Ankunft und Nachwuchs auf den Anfang zurücksetzen
  $("#nameNo").onclick=()=>{if(ev.type==="rename"){closeModal();render()}else nameSheet(ev)};
  $("#dice").onclick=()=>{inp.value=freeName(list,S.residents.map(x=>x.name))};
  // Ankunftsbild oben gleich mit dem neuen Aussehen zeigen (ohne die Animation neu zu starten)
  bindLookEditor(r,draft,()=>{
    const a=$("#modalRoot .anim"); if(!a) return;
    const keep={look:r.look,fur:r.fur};
    if(r.kind==="mensch") r.look=Object.assign({},draft); else r.fur=draft.fur;
    a.innerHTML=animScene(ev); a.classList.add("skip");
    if(keep.look===undefined) delete r.look; else r.look=keep.look;
    if(keep.fur===undefined) delete r.fur; else r.fur=keep.fur;
  });
  $("#nameOk").onclick=()=>{
    const n=inp.value.trim()||r.name; const old=r.name; r.name=n.slice(0,20);
    if(r.kind==="mensch") r.look=Object.assign({},draft); else if((FUR[r.art]||[]).length>1) r.fur=draft.fur;
    const os=$("#ownSel"); if(os){const nv=os.value||null; if(nv!==(r.owner||null)){r.owner=nv; const mate=r.pair&&S.residents.find(x=>x.id===r.pair); if(mate&&!isSea(mate)) mate.owner=nv; r.sad=false}}
    if(ev.type==="arrival"){log(r.name+(r.kind==="tier"?" ("+r.art+")":"")+" ist auf die Insel gezogen.","good");
      const ow=r.owner?S.residents.find(x=>x.id===r.owner):null;
      chron([r.id],r.name+(r.kind==="tier"?" ("+r.art+(ow?", gehört zu "+ow.name:"")+")":" ("+jobName(r.job)+")")+" ist eingezogen.")}
    if(ev.type==="birth"){log(r.name+" ist geboren. Willkommen!","good");chron([r.id].concat(r.parents||[]),r.name+" ist geboren.")}
    if(ev.type==="rename") toast(old!==r.name?old+" heißt jetzt "+r.name:"Gespeichert");
    save(); closeModal(); render(); showPending();
  };
  inp.onfocus=()=>inp.select();
}
/* Aussehen wählen: kleine Auswahl mit Live-Vorschau */
function lookPreview(r,draft){
  const tmp=Object.assign({},r,{sick:null});
  if(r.kind==="mensch") tmp.look=draft; else tmp.fur=draft.fur;
  return `<svg width="72" height="78" viewBox="${r.kind==="mensch"?(stage(r)==="baby"?"-8.5 -15.5 17 17":"-12 -25 24 26"):SEA.includes(tmp.art)?figVB(tmp):"-16 -22 32 25"}" aria-hidden="true">${figure(tmp,0,0)}</svg>`;
}
function lookEditor(r,d){
  const row=(label,key,list,sel)=>`<div class="sw-row" role="radiogroup" aria-label="${label}"><span class="small muted">${label}</span>${list.map((c,i)=>`<button type="button" class="sw${i===sel?" on":""}" data-look="${key}" data-v="${i}" style="background:${c}" aria-label="${label} ${i+1}" aria-pressed="${i===sel}"></button>`).join("")}</div>`;
  if(r.kind==="mensch"){
    const baby=stage(r)==="baby";   // Babys haben keine Frisur und keine Extras, also nur zeigen, was man bei ihnen sieht
    const styles=`<div class="sw-row" role="radiogroup" aria-label="Frisur"><span class="small muted">Frisur</span>${STYLE_NAMES.map((n,i)=>{const hs=hairSvg(i,i===5?"#B6A4FF":"#4A3222");
      return `<button type="button" class="sw sw-ic${i===d.style?" on":""}" data-look="style" data-v="${i}" aria-label="${n}" aria-pressed="${i===d.style}"><svg width="24" height="24" viewBox="-7.5 -24 15 15" aria-hidden="true">${hs.back}<circle cx="0" cy="-16" r="5" fill="#E8B48F"/>${hs.front}</svg></button>`}).join("")}</div>`;
    const al=accList(d.acc), accOn=i=>i?al.includes(i):!al.length;
    const accs=`<div class="sw-row" role="group" aria-label="Extras"><span class="small muted">Extras (mehrere möglich)</span>${ACC_NAMES.map((n,i)=>{const a=accSvg(i,"#FF9C7A"),hs=hairSvg(0,"#4A3222");
      return `<button type="button" class="sw sw-ic${accOn(i)?" on":""}" data-look="acc" data-v="${i}" aria-label="${n}" aria-pressed="${accOn(i)}">${i===0?`<svg width="22" height="22" viewBox="-10 -10 20 20" aria-hidden="true"><circle r="7.5" fill="none" stroke="#9EA3B8" stroke-width="2"/><path d="M-5.3 5.3L5.3 -5.3" stroke="#9EA3B8" stroke-width="2" stroke-linecap="round"/></svg>`:`<svg width="24" height="24" viewBox="-7.5 -25 15 16" aria-hidden="true"><path d="M-6 -6c0-4 2.4-5.2 6-5.2s6 1.2 6 5.2z" fill="#5B8CD6"/>${a.body}${hs.back}<circle cx="0" cy="-16" r="5" fill="#E8B48F"/>${hs.front}${a.head}</svg>`}</button>`}).join("")}</div>`;
    return `<div class="field"><span>Aussehen</span><div class="look"><div class="look-prev" id="lookPrev">${lookPreview(r,d)}</div><div class="look-opts">
      ${baby?`${row("Haut","skin",SKIN,d.skin)}${row("Haare","hair",HAIR,d.hair)}${row("Strampler","shirt",SHIRT,d.shirt)}`:`${row("Haut","skin",SKIN,d.skin)}${styles}${row("Haare","hair",HAIR,d.hair)}${row("Shirt","shirt",SHIRT,d.shirt)}${accs}${row("Farbe der Extras","accC",SHIRT,d.accC)}`}</div></div></div>`;
  }
  const n=(FUR[r.art]||[]).length; if(n<2) return "";
  return `<div class="field"><span>Fellfarbe</span><div class="sw-row" role="radiogroup" aria-label="Fellfarbe">${Array.from({length:n},(_,i)=>`<button type="button" class="sw sw-ic sw-big${i===d.fur?" on":""}" data-look="fur" data-v="${i}" aria-label="Fellfarbe ${i+1}" aria-pressed="${i===d.fur}"><svg width="38" height="30" viewBox="${artVB(r.art,38/30)}" aria-hidden="true">${animalSvg(r.art,i)}</svg></button>`).join("")}</div></div>`;
}
function bindLookEditor(r,draft,onChange){
  document.querySelectorAll("#modalRoot [data-look]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.look, v=+b.dataset.v;
    if(k==="acc"){draft.acc=accToggle(draft.acc,v); const al=draft.acc;
      document.querySelectorAll('#modalRoot [data-look="acc"]').forEach(x=>{const i=+x.dataset.v, on=i?al.includes(i):!al.length;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)});
    } else {draft[k]=v;
      document.querySelectorAll(`#modalRoot [data-look="${k}"]`).forEach(x=>{const on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)});}
    const pv=$("#lookPrev"); if(pv) pv.innerHTML=lookPreview(r,draft);
    if(onChange) onChange();
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
function travelSheet(){
  const next=WORLDS[(S.world||0)+1]; if(!next||!((S.found||0)>(S.world||0))) return;
  modal(`${worldMapSvg()}<p class="label" style="color:var(--lime)">Weltreise</p><h2>Nach ${esc(next.name)} aufbrechen?</h2>
    <p class="muted">${esc(next.text)} Alle Bewohner und Tiere kommen mit. Gegenstände aus dem Laden bleiben hier, auf der neuen Insel gibt es passende neue. Die Großprojekte hier bleiben gebaut, auf der neuen Insel geht es mit neuen weiter.</p>
    <div class="row"><button class="btn secondary grow" id="trNo">Noch bleiben</button><button class="btn grow" id="trYes">Aufbrechen</button></div>`);
  $("#trNo").onclick=closeModal; $("#trYes").onclick=travel;
}
function confirmReset(){
  sheet(`<h2>Spielstand zurücksetzen?</h2><p class="muted">Deine Insel, alle Bewohner und eingetragenen Tage werden gelöscht. Das lässt sich nicht rückgängig machen.</p>
  <div class="row"><button class="btn secondary grow" id="noR">Abbrechen</button><button class="btn grow" id="yesR" style="background:var(--coral)">Zurücksetzen</button></div>`);
  $("#noR").onclick=closeModal;
  $("#yesR").onclick=()=>{S=migrate(newGame());tab="heute";save();closeModal();render()};
}

/* ---------- Freunde einladen, gemeinsame Ziele, OffLand Plus ----------
   Ohne Server: Einladungscode im Link, beide Seiten lösen den Code der anderen Person ein.
   "Plus" ist eine Vorschau und wird später mit Apple-Abo und Server echt geprüft. */
const APP_URL="https://offland2026.github.io/OffLand/";
const INVITE_KEY="offline-insel-einladung";
const GOAL_DAYS=7, PLUS_DAYS=30;
const CODE_ABC="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function myCode(){
  if(!S.code){S.code=Array.from({length:6},()=>CODE_ABC[Math.floor(Math.random()*CODE_ABC.length)]).join("");save()}
  return S.code;
}
const inviteLink=()=>APP_URL+"?einladung="+myCode();
const plusActive=()=>!!(S.plus&&S.plus.until>=today());
function grantPlus(days){S.plus={until:addDays(plusActive()?S.plus.until:today(),days)}}
/* Gratis-Monat fürs Einladen: einmal pro Konto und einmal pro Gerät */
const PLUS_DEV_KEY="offland-plus-freund";
function friendPlusFree(){
  if(S.plusFriend) return false;
  let d=null; try{d=localStorage.getItem(PLUS_DEV_KEY)}catch(e){}
  return !d||d===(ACC&&ACC.id);
}
let LAST_PLUS=false;
function friendPlus(){
  LAST_PLUS=friendPlusFree(); if(!LAST_PLUS) return false;
  S.plusFriend=today(); grantPlus(PLUS_DAYS);
  try{localStorage.setItem(PLUS_DEV_KEY,ACC?ACC.id:"1")}catch(e){}
  return true;
}
const plusOffer=(long)=>friendPlusFree()?(long?"einmalig einen Monat OffLand Plus und ":"einmalig einen Monat Plus und "):"";
const cleanCode=c=>String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
function pendingInvite(){
  let c=null; try{c=localStorage.getItem(INVITE_KEY)}catch(e){}
  c=cleanCode(c);
  if(!c||c.length!==6||c===S.code||S.invitedBy||(S.buddies||[]).some(b=>b.code===c)) return null;
  return c;
}
function clearInvite(){try{localStorage.removeItem(INVITE_KEY)}catch(e){}}
(function readInviteFromUrl(){
  try{
    const u=new URL(location.href), c=cleanCode(u.searchParams.get("einladung")), f=cleanCode(u.searchParams.get("familie"));
    if(c.length===6){localStorage.setItem(INVITE_KEY,c);u.searchParams.delete("einladung")}
    if(f.length===6){localStorage.setItem("offline-insel-familie-einladung",f);u.searchParams.delete("familie")}
    if(c.length===6||f.length===6) history.replaceState(null,"",u.pathname+u.search+u.hash);
  }catch(e){}
})();
function redeemCode(raw,invited){
  const c=cleanCode(raw);
  if(c.length!==6) return "Ein Code hat 6 Zeichen.";
  if(c===myCode()) return "Das ist dein eigener Code.";
  if(S.buddies.some(b=>b.code===c)) return "Mit diesem Code seid ihr schon verbunden.";
  if(S.buddies.length>=12) return "Du hast schon 12 gemeinsame Ziele.";
  S.buddies.push({code:c,since:today(),done:0,reward:false});
  if(invited) S.invitedBy=c;
  const got=friendPlus();
  log("Mit "+c+" verbunden: gemeinsames Ziel gestartet"+(got?" und "+PLUS_DAYS+" Tage OffLand Plus.":"."),"good");
  chron([],"Neue Freundschaft über die Insel hinaus: "+c+".");
  save(); return null;
}
function buddyProgress(){
  (S.buddies||[]).forEach(b=>{
    if(b.reward) return;
    b.done++;
    if(b.done>=GOAL_DAYS){b.reward=true;S.points+=150;S.glueck=clamp(S.glueck+5,0,100);
      log("Gemeinsames Ziel mit "+b.code+" geschafft: +150 Punkte, +5 % Glück.","good");S.pending.push({type:"buddy",code:b.code})}
  });
}
async function shareText(text,url){
  try{ if(navigator.share){await navigator.share({text,url});return true} }catch(e){if(e&&e.name==="AbortError")return true}
  try{await navigator.clipboard.writeText(text+" "+url);toast("Link kopiert");return true}catch(e){}
  return false;
}
function buddyRows(){
  return S.buddies.map(b=>`<div><div class="row between"><b class="${b.name?"":"num"}">${esc(b.name||b.code)}</b><span class="small ${b.reward?"":"muted"}" style="${b.reward?"color:var(--lime);font-weight:700":""}">${b.reward?"geschafft ✓":Math.min(b.done,GOAL_DAYS)+" / "+GOAL_DAYS+" gute Tage"}</span></div>
    <div class="bar"><i style="width:${Math.min(100,b.done/GOAL_DAYS*100)}%"></i></div></div>`).join("");
}
function friendsCard(){
  if(!S.setup) return "";
  const inv=pendingInvite();
  if(!inv) return "";
  return `<div class="card"${inv?' style="border:1.5px solid var(--lime)"':""}>
    <div class="row between"><p class="label">Gemeinsam</p>${plusActive()?`<span class="chip" style="color:var(--amber)">★ Plus</span>`:""}</div>
    ${inv?`<p><b>Du wurdest eingeladen!</b> Nimm die Einladung von <b class="num">${esc(inv)}</b> an: Ihr bekommt ${plusOffer(false)}ein gemeinsames Ziel.</p><button class="btn" id="inviteAccept">Einladung annehmen</button>`:""}
    ${S.buddies.length?`<p class="small muted">Gemeinsame Ziele: je ${GOAL_DAYS} Tage im Budget. Jede Seite zählt ihre eigenen Tage.</p>${buddyRows()}`
      :`<p class="small muted">Lade jemanden ein: Ihr bekommt ${plusOffer(true)}ein gemeinsames Ziel von ${GOAL_DAYS} guten Tagen.</p>`}
    <div class="row"><button class="btn secondary grow" id="shareBtn">Insel teilen</button><button class="btn secondary grow" id="friendsBtn">Freunde einladen</button></div>
    ${netConfigured()?`<button class="btn" id="rankBtn">Freunde und Ranglisten</button>`:""}
  </div>`;
}
function friendsSheet(){
  const code=myCode();
  modal(`<div class="row between"><div><p class="label" style="color:var(--lime)">Gemeinsam</p><h2>Freunde einladen</h2>${plusActive()?`<p class="small" style="color:var(--amber);font-weight:700">★ Plus bis ${nice(S.plus.until)}</p>`:""}</div></div>
    <p class="muted">${friendPlusFree()?`Wer eine Freundin oder einen Freund einlädt, bekommt mit ihr oder ihm zusammen <b style="color:var(--ink)">einmalig einen Monat OffLand Plus</b> gratis. Dazu startet`:`Deinen Gratis-Monat Plus hast du schon bekommen. Mit jeder Einladung startet aber`} ein gemeinsames Ziel: ${GOAL_DAYS} Tage im Budget, dann gibt es +150 Punkte.</p>
    <div style="background:var(--ground);border-radius:16px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:4px">
      <span class="small muted">Dein Code</span><b class="num" style="font-size:30px;letter-spacing:.18em">${code}</b></div>
    <button class="btn" id="frShare">Einladung schicken</button>
    <ol class="steps small muted" style="margin:0"><li>Schick den Link an deine Freundin oder deinen Freund.</li><li>Sie oder er öffnet den Link, legt ein Konto an und nimmt die Einladung an.</li>${netOn()?`<li>Seid ihr beide online, seid ihr sofort befreundet.</li>`:`<li>Dann schickt sie oder er dir den eigenen Code zurück. Den trägst du hier ein.</li>`}</ol>
    <label class="field" for="frCode">Code von Freund:in eintragen<input id="frCode" type="text" maxlength="7" autocomplete="off" autocapitalize="characters" placeholder="z. B. K7M2QX" style="text-transform:uppercase;letter-spacing:.12em"></label>
    <p class="err" id="frErr" role="alert"></p>
    <button class="btn secondary" id="frRedeem">Code einlösen</button>
    ${S.buddies.length?`<p class="label">Gemeinsame Ziele</p>${buddyRows()}`:""}
    <p class="small muted">OffLand Plus ist eine Vorschau: +10 % Punkte pro Tag und ein goldener Rahmen beim Teilen. Später läuft es über ein Abo im App Store.</p>
    ${netConfigured()?`<button class="btn secondary" id="frRank">Freunde und Ranglisten</button>`:""}
    <button class="btn ghost" id="frClose">Schließen</button>`);
  $("#frShare").onclick=()=>shareText("Spiel mit mir OffLand! Weniger Handy, mehr Insel. Mit meinem Code "+code+" bekommen wir ein gemeinsames Ziel, und wer noch kein Plus bekommen hat, einen Monat gratis.",inviteLink());
  $("#frRedeem").onclick=async()=>{const btn=$("#frRedeem");btn.disabled=true;const e=await addFriend($("#frCode").value,false);if(!document.body.contains(btn)) return;btn.disabled=false;if(e) return $("#frErr").textContent=e;toast(LAST_PLUS?"Verbunden! Ein Monat Plus ist aktiv.":"Verbunden! Gemeinsames Ziel gestartet.");sfx("project");friendsSheet()};
  const rk=$("#frRank"); if(rk) rk.onclick=rankSheet;
  $("#frClose").onclick=()=>{closeModal();render()};
}
function inviteSheet(){
  const c=pendingInvite(); if(!c) return;
  modal(`${base(hearts(250,96)+`<g class="bob">${figure(here().find(r=>r.kind==="mensch")||{kind:"mensch",name:"Mia"},236,134)}</g>`,false)}
    <p class="label" style="color:var(--lime)">Einladung</p><h2>Du wurdest eingeladen!</h2>
    <p class="muted">Code <b class="num" style="color:var(--ink)">${esc(c)}</b> lädt dich ein. Nimmst du an, bekommt ihr ${plusOffer(true)}ein gemeinsames Ziel: ${GOAL_DAYS} Tage im Budget.</p>
    <button class="btn" id="invYes">Annehmen</button><button class="btn ghost" id="invNo">Nicht jetzt</button>`);
  $("#invNo").onclick=()=>{closeModal();render()};
  $("#invYes").onclick=()=>{ if(netConfigured()&&!netOn()) onlineConsent(acceptInvite); else acceptInvite(); };
  async function acceptInvite(){
    const yb=$("#invYes"); if(yb) yb.disabled=true;
    const e=await addFriend(c,true); clearInvite(); sfx("project");
    if(e){toast(e);closeModal();render();return}
    if(netOn()){modal(`<p class="label" style="color:var(--lime)">Verbunden</p><h2>Ihr seid jetzt Freunde</h2><p class="muted">${LAST_PLUS?"Ein Monat Plus ist für dich aktiv. ":""}In den Ranglisten seht ihr, wer diese Woche weniger am Handy war.</p><button class="btn" id="invRk">Zu den Ranglisten</button><button class="btn ghost" id="invDone">Fertig</button>`);
      $("#invRk").onclick=rankSheet; $("#invDone").onclick=()=>{closeModal();render()}; return}
    modal(`<p class="label" style="color:var(--lime)">Verbunden</p><h2>${LAST_PLUS?"Ein Monat Plus ist aktiv":"Ihr seid verbunden"}</h2>
      <p class="muted">Damit auch ${esc(c)} verbunden ist, schick deinen Code zurück:</p>
      <div style="background:var(--ground);border-radius:16px;padding:14px;text-align:center"><b class="num" style="font-size:30px;letter-spacing:.18em">${myCode()}</b></div>
      <button class="btn" id="invBack">Code zurückschicken</button><button class="btn ghost" id="invDone">Fertig</button>`);
    $("#invBack").onclick=()=>shareText("Ich bin dabei! Mein OffLand-Code: "+myCode()+" (unter Freunde einladen → Code einlösen)",inviteLink());
    $("#invDone").onclick=()=>{closeModal();render()};
  }
}

/* ---------- Online: Freunde und Ranglisten (Firebase) ----------
   Nur aktiv, wenn js/online-config.js eine Firebase-Konfiguration enthält und
   die Person zugestimmt hat. Geteilt werden Name, Avatar, Inselwelt und die
   Bildschirmzeit der aktuellen Woche. Regeln: firestore.rules */
const FB_VER="10.14.1";
let NET=null, netBusy=null;
const netConfigured=()=>!!(window.OFFLAND_FAKE_NET||(window.OFFLAND_FIREBASE&&window.OFFLAND_FIREBASE.apiKey));
const netOn=()=>netConfigured()&&S.online&&S.online.on&&S.online.pid;
async function netInit(){
  if(NET) return NET;
  if(netBusy) return netBusy;
  netBusy=(async()=>{
    if(window.OFFLAND_FAKE_NET) return NET=window.OFFLAND_FAKE_NET;
    const b="https://www.gstatic.com/firebasejs/"+FB_VER+"/";
    const [A,U,F]=await Promise.all([import(b+"firebase-app.js"),import(b+"firebase-auth.js"),import(b+"firebase-firestore.js")]);
    const app=A.initializeApp(window.OFFLAND_FIREBASE), auth=U.getAuth(app), db=F.getFirestore(app);
    await auth.authStateReady(); if(!auth.currentUser) await U.signInAnonymously(auth);
    return NET={uid:auth.currentUser.uid,
      get:async p=>{const d=await F.getDoc(F.doc(db,p));return d.exists()?d.data():null},
      set:(p,v)=>F.setDoc(F.doc(db,p),v,{merge:true}),
      del:p=>F.deleteDoc(F.doc(db,p)),
      inc:(p,o)=>{const v={};for(const k in o)v[k]=F.increment(o[k]);return F.setDoc(F.doc(db,p),v,{merge:true})},
      list:async(p,o)=>{o=o||{};const c=F.collection(db,p);
        const q=o.where?F.query(c,F.where(o.where[0],"==",o.where[1]),F.limit(o.limit||50)):o.orderBy?F.query(c,F.orderBy(o.orderBy),F.limit(o.limit||50)):c;
        const r=await F.getDocs(q);return r.docs.map(d=>Object.assign({id:d.id},d.data()))},
      count:async(p,w)=>{const c=F.collection(db,p);return (await F.getCountFromServer(w?F.query(c,F.where(w[0],w[1],w[2])):c)).data().count}};
  })();
  try{return await netBusy}finally{netBusy=null}
}
const rid=()=>Array.from(crypto.getRandomValues(new Uint8Array(15)),x=>CODE_ABC[x%32]).join("");
function isoWeek(day){
  const d=new Date(day+"T12:00:00"); const t=new Date(d); t.setDate(d.getDate()+3-(d.getDay()+6)%7);
  const y=t.getFullYear(), w1=new Date(y,0,4);
  const w=1+Math.round(((t-w1)/864e5-3+(w1.getDay()+6)%7)/7);
  return y+"-W"+String(w).padStart(2,"0");
}
function weekStats(){
  const wk=isoWeek(today()), ds=S.days.filter(d=>isoWeek(d.day)===wk);
  const avg=ds.length?Math.round(ds.reduce((a,d)=>a+d.min,0)/ds.length):null;
  return {wk,days:ds.length,avg,good:ds.filter(d=>d.min<=S.budget).length};
}
const netName=()=>(ACC?ACC.name:"Insel").slice(0,20), netAv=()=>ACC?ACC.avatar:"Ziege";
/* ---------- Anonyme Nutzungsstatistik (nur mit Zustimmung) ----------
   Gilt pro Gerät, nicht pro Konto. Gesendet werden nur Zähler pro Tag (z. B. „tag_gut +1“) nach stats/JJJJ-MM-TT:
   keine Namen, keine Minuten, keine Kennungen. Bis zur Zustimmung bleibt die Warteschlange auf dem Gerät. */
const STATS_KEY="offland-stats";
function statsDev(){try{return JSON.parse(localStorage.getItem(STATS_KEY))||{}}catch(e){return {}}}
function statsPut(d){try{localStorage.setItem(STATS_KEY,JSON.stringify(d))}catch(e){}}
function stat(name,n){
  const d=statsDev(); if(d.consent===false) return;
  const q=d.q||(d.q={}); if(!(name in q)&&Object.keys(q).length>=80) return;
  q[name]=(q[name]||0)+(n||1); statsPut(d); statsFlushSoon();
}
const statsPlatform=()=>window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()?"ios":(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone?"pwa":"web";
function statsActive(){
  const d=statsDev(), t=today(); if(d.consent===false||d.active===t) return;
  if(!d.since) d.since=t; d.active=t; statsPut(d);
  const age=Math.round((parse(t)-parse(d.since))/864e5), b=age===0?"0":age===1?"1":age<4?"2_3":age<8?"4_7":age<15?"8_14":age<31?"15_30":"31";
  stat("aktiv"); stat("aktiv_"+statsPlatform()); stat("aktiv_t"+b);
}
let statsTimer=0;
function statsFlushSoon(){clearTimeout(statsTimer);statsTimer=setTimeout(statsFlush,4000)}
async function statsFlush(){
  const d=statsDev(); if(d.consent!==true||!netConfigured()||!d.q||!Object.keys(d.q).length) return;
  const q=d.q; d.q={}; statsPut(d);
  try{const N=await netInit(); if(!N.inc) throw 0; await N.inc("stats/"+today(),q)}
  catch(e){const d2=statsDev(); if(d2.consent!==true) return; d2.q=d2.q||{}; for(const k in q) d2.q[k]=(d2.q[k]||0)+q[k]; statsPut(d2)}
}
function statsSet(on){const d=statsDev(); d.consent=!!on; if(!on) d.q={}; statsPut(d); if(on){statsActive();statsFlushSoon()}}
function statsAskSheet(){
  sheet(`<p class="label" style="color:var(--lime)">Kurze Frage</p><h2>Hilfst du mit, OffLand besser zu machen?</h2>
    ${saysHtml("bay","Ich würde gern anonym mitzählen, was auf OffLand gut läuft und was nicht. Keine Namen, keine Bildschirmzeiten. Versprochen, ich bin nur neugierig.")}
    <p class="small muted">Gezählt wird nur, wie oft etwas passiert, zum Beispiel „heute wurde ein Tag eingetragen“ oder „ein Vorhaben wurde geschafft“. Nichts davon lässt sich dir zuordnen. Du kannst das jederzeit in den Einstellungen ändern.</p>
    <div class="row"><button class="btn secondary grow" id="stNo" data-ok>Lieber nicht</button><button class="btn grow" id="stYes" data-ok>Ja, gern</button></div>`);
  $("#stYes").onclick=()=>{statsSet(true);closeModal();render();showPending();toast("Danke! Mr. Bay freut sich.")};
  $("#stNo").onclick=()=>{statsSet(false);closeModal();render();showPending()};
}
/* Spielerprofil und Code anlegen bzw. zurückholen */
async function netEnsure(){
  const N=await netInit(); const o=S.online;
  if(o.pid){const me=await N.get("players/"+o.pid).catch(()=>null); if(me&&me.owner!==N.uid){o.pid=null}}   // anderes Gerät: neu anlegen
  if(!o.pid){o.pid=rid(); S.buddies.forEach(b=>{delete b.pid})}
  await N.set("players/"+o.pid,{owner:N.uid,name:netName(),avatar:netAv(),code:myCode(),world:curWorld().name,updated:Date.now()});
  for(let i=0;i<5;i++){
    const c=await N.get("codes/"+myCode()).catch(()=>null);
    if(c&&c.pid===o.pid) break;
    if(!c){try{await N.set("codes/"+myCode(),{pid:o.pid,owner:N.uid});break}catch(e){}}
    S.code=null; myCode();                                                                   // Code vergeben: neuen würfeln
  }
  await N.set("players/"+o.pid,{code:myCode()});
  save(); return N;
}
/* Wochenwerte veröffentlichen (Freunde immer, alle nur mit Zustimmung) */
async function netSync(){
  if(!netOn()) return;
  try{
    const N=await netInit(), o=S.online, w=weekStats();
    const row={owner:N.uid,name:netName(),avatar:netAv(),avg:w.avg,days:w.days,good:w.good,streak:S.budgetStreak,world:curWorld().name,updated:Date.now()};
    row.duel=S.duel&&S.duel.wk===w.wk?S.duel.vs:null;                              // merge-Schreiben: null löscht ein altes Duell
    row.duelOff=S.duelOff&&S.duelOff.wk===w.wk?S.duelOff.vs:null;                  // abgebrochen oder abgelehnt
    await N.set("players/"+o.pid,{owner:N.uid,name:row.name,avatar:row.avatar,world:row.world,updated:row.updated});
    await N.set("weeks/"+w.wk+"/ranks/"+o.pid,row);
    if(o.pub&&w.avg!=null&&w.days>=3){const pub=Object.assign({},row);delete pub.duel;delete pub.duelOff;await N.set("weeks/"+w.wk+"/public/"+o.pid,pub)}
    else await N.del("weeks/"+w.wk+"/public/"+o.pid).catch(()=>{});
    await netPullFriends();
    await duelCheck();
  }catch(e){}
}
/* neue Freund:innen (z. B. wer uns per Code hinzugefügt hat) übernehmen */
async function netPullFriends(){
  const N=await netInit(); const fr=await N.list("players/"+S.online.pid+"/friends");
  let changed=false;
  for(const f of fr){
    let b=S.buddies.find(x=>x.pid===f.id||(f.code&&x.code===f.code));
    if(!b){
      const p=await N.get("players/"+f.id).catch(()=>null); if(!p) continue;
      b={code:p.code||"?",since:today(),done:0,reward:false}; S.buddies.push(b); const got=friendPlus();
      log((p.name||"Jemand")+" hat dich als Freund:in hinzugefügt. Gemeinsames Ziel gestartet"+(got?", "+PLUS_DAYS+" Tage Plus.":"."),"good");
      toast((p.name||"Jemand")+" ist jetzt mit dir befreundet!"); changed=true;
      b.name=p.name;
    }
    if(b.pid!==f.id){b.pid=f.id;changed=true}
  }
  if(changed) save();
  return fr;
}
/* Freund:in per Code verbinden (beide Seiten) */
async function netConnect(code){
  const N=await netEnsure(); const c=await N.get("codes/"+code);
  if(!c) return {err:"Diesen Code gibt es nicht. Ist die andere Person schon online?"};
  if(c.pid===S.online.pid) return {err:"Das ist dein eigener Code."};
  const at=Date.now();
  await N.set("players/"+S.online.pid+"/friends/"+c.pid,{since:at,code});
  await N.set("players/"+c.pid+"/friends/"+S.online.pid,{since:at,code:myCode()});
  const p=await N.get("players/"+c.pid).catch(()=>null);
  return {pid:c.pid,name:p&&p.name};
}
/* Profil gehört einer alten Online-Kennung: neu anlegen und alle Freund:innen per Code wieder verbinden */
async function netRelink(){
  const N=await netInit(), o=S.online;
  const cur=o.pid?await N.get("players/"+o.pid).catch(()=>null):null;
  if(cur&&cur.owner===N.uid) return;
  o.pid=null; await netEnsure();
  for(const b of S.buddies||[]){
    if(!b.code||b.code==="?") continue;
    try{const r=await netConnect(b.code); if(r&&r.pid) b.pid=r.pid}catch(e){}
  }
  RANKC=null; save();
}
async function netRemove(pid){
  const N=await netInit();
  await N.del("players/"+S.online.pid+"/friends/"+pid).catch(()=>{});
  await N.del("players/"+pid+"/friends/"+S.online.pid).catch(()=>{});
}
/* Freund:in hinzufügen: online wenn möglich, sonst nur auf diesem Gerät */
async function addFriend(raw,invited){
  const c=cleanCode(raw);
  if(c.length!==6) return "Ein Code hat 6 Zeichen.";
  if(c===myCode()) return "Das ist dein eigener Code.";
  if(netOn()){
    let r; try{r=await netConnect(c)}catch(e){return "Keine Verbindung. Versuch es gleich noch mal."}
    if(r.err) return r.err;
    const known=S.buddies.find(b=>b.code===c||b.pid===r.pid);
    if(known){known.pid=r.pid;known.name=r.name;save();return null}
    const e=redeemCode(c,invited); if(e) return e;
    const b=S.buddies.find(x=>x.code===c); b.pid=r.pid; b.name=r.name; save(); netSync();
    return null;
  }
  return redeemCode(c,invited);
}
async function netDeleteAll(){
  const o=S.online; if(!o||!o.pid) return;
  try{
    const N=await netInit(), wk=isoWeek(today());
    const fr=await N.list("players/"+o.pid+"/friends").catch(()=>[]);
    for(const f of fr) await netRemove(f.id);
    await N.del("weeks/"+wk+"/ranks/"+o.pid).catch(()=>{}); await N.del("weeks/"+wk+"/public/"+o.pid).catch(()=>{});
    await N.del("codes/"+myCode()).catch(()=>{}); await N.del("players/"+o.pid).catch(()=>{});
  }catch(e){}
  S.online={on:false,pub:false,pid:null}; S.buddies.forEach(b=>{delete b.pid}); save();
}
function onlineConsent(after){
  modal(`<p class="label" style="color:var(--lime)">Online</p><h2>Freunde und Ranglisten</h2>
    <p class="muted">Damit Freund:innen dich finden und ihr euch vergleichen könnt, speichert OffLand ein paar Dinge online:</p>
    <ul class="steps small"><li>deinen Namen „${esc(netName())}“ und deinen Avatar</li><li>deinen Code und deine Inselwelt</li><li>deine Bildschirmzeit dieser Woche (Durchschnitt, gute Tage, Serie)</li></ul>
    <p class="small muted">Deine Insel, Bewohner und alle anderen Daten bleiben auf dem Gerät. Du kannst das jederzeit in den Einstellungen ausschalten und die Online-Daten löschen.</p>
    <label class="check" for="ocPub"><input type="checkbox" id="ocPub"> Auch in der Rangliste für alle erscheinen</label>
    <p class="err" id="ocErr" role="alert"></p>
    <button class="btn" id="ocYes">Einverstanden, online gehen</button><button class="btn ghost" id="ocNo">Lieber nicht</button>`);
  $("#ocNo").onclick=()=>{closeModal();render()};
  $("#ocYes").onclick=async()=>{
    const btn=$("#ocYes"); btn.disabled=true; btn.textContent="Verbinde …";
    S.online.on=true; S.online.pub=$("#ocPub").checked; stat("online_an");
    try{
      await netEnsure();
      for(const b of S.buddies.filter(x=>!x.pid)){try{const r=await netConnect(b.code);if(r.pid){b.pid=r.pid;b.name=r.name}}catch(e){}}
      save(); await netSync(); toast("Du bist online!"); after?after():rankSheet();
    }catch(e){S.online.on=false;save();btn.disabled=false;btn.textContent="Einverstanden, online gehen";$("#ocErr").textContent="Keine Verbindung zum Online-Speicher. Versuch es später noch mal."}
  };
}
let rankTab="freunde";
/* gleicher Schnitt = gleicher Platz (1, 2, 2, 4) */
function rankPlaces(list){const p=[];list.forEach((r,i)=>p.push(i&&r.avg===list[i-1].avg?p[i-1]:i+1));return p}
function rankRow(r,i,me){
  const v=r.avg==null?"noch kein Tag":hm(r.avg)+" / Tag";
  return `<div class="row" style="padding:8px 10px;border-radius:14px;${me?"background:#26233D;":""}">
    <b class="num" style="width:26px;color:${i===0?"var(--amber)":i===1?"#C9CBDD":i===2?"#E0A06A":"var(--muted)"}">${i+1}</b>${avatarSvg(r.avatar||"Ziege",36)}
    <span class="grow" style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.name||"?")}${me?" (du)":""}</b><span class="small muted">${r.good||0} gute ${r.good===1?"Tag":"Tage"} · ${esc(r.world||"")}</span></span>
    <b class="num small" style="text-align:right">${v}</b></div>`;
}
const byAvg=(a,b)=>(a.avg==null)-(b.avg==null)||(a.avg-b.avg)||((b.good||0)-(a.good||0));
function rankSheet(){closeModal();tab="freunde";render();window.scrollTo(0,0)}
const TROPHY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4v3h-4z"/></svg>';
/* Tab „Freunde“: Vorschau, Ranglisten, Freunde hinzufügen, gemeinsame Ziele */
function viewFreunde(){
  const inv=pendingInvite(), on=netConfigured()&&netOn();
  let h=(inv?friendsCardInvite(inv):"")+`<div class="hero-card" id="frHero" style="background:#1B2340">${frHeroSvg(null)}</div>
  ${on?`<div class="scene-chips">
    <div class="cp"><i>Platz</i><b id="chPl">–</b></div>
    <div class="cp"><i>Duell</i><b id="chDu">${!on?"–":S.duel&&S.duel.wk===isoWeek(today())?"läuft":"offen"}</b></div>
    <div class="cp"><i>Freunde</i><b id="chFr">…</b></div>
  </div>`:""}`;
  if(!on){
    h+=`<div class="card" style="align-items:center;text-align:center">
      <div style="width:64px;height:64px;border-radius:32px;background:#26233D;color:var(--amber);display:flex;align-items:center;justify-content:center"><span style="width:34px;height:34px;display:block">${TROPHY}</span></div>
      <h2>Freunde und Ranglisten</h2>
      <p class="muted">Vergleicht euch jede Woche: Wer war am wenigsten am Handy? Ladet euch gegenseitig ein, dann bekommt ihr ${plusOffer(false)}ein gemeinsames Ziel.</p>
      ${netConfigured()?`<button class="btn" id="goOnline" style="align-self:stretch">Mitmachen</button>`:`<p class="small muted">Ranglisten sind in dieser Version noch nicht verfügbar.</p>`}
    </div>`+(netConfigured()?duelTeaser("Dafür musst du oben bei Freunde und Ranglisten mitmachen."):"");
  } else {
    h+=`<div class="card" id="rankHero"><p class="label" style="color:var(--lime)">Diese Woche</p><p class="muted">Lade Rangliste …</p></div>
    <div id="duelBox">${duelTeaser("Lade Freund:innen …")}</div>
    <div class="sec-h"><span>Rangliste</span></div>
    <div class="card">
      <div class="row" role="tablist"><button class="btn ${rankTab==="freunde"?"":"secondary"} grow" data-rk="freunde" role="tab" aria-selected="${rankTab==="freunde"}">Freunde</button><button class="btn ${rankTab==="alle"?"":"secondary"} grow" data-rk="alle" role="tab" aria-selected="${rankTab==="alle"}">Alle</button></div>
      <div id="rankBox"><p class="small muted">Lade …</p></div>
    </div>`;
  }
  const fam=famCard();
  if(fam) h+=`<div class="sec-h"><span>Familie</span></div>`+fam;
  h+=`<div class="sec-h"><span>Freund:innen</span></div>
  <div class="card"><div class="row between"><p class="label">Gemeinsame Ziele</p>${plusActive()?`<span class="chip" style="color:var(--amber)">★ Plus bis ${nice(S.plus.until)}</span>`:""}</div>
    ${S.buddies.length?`<p class="small muted">Je ${GOAL_DAYS} Tage im Budget, dann gibt es +150 Punkte. Jede Seite zählt ihre eigenen Tage.</p>${buddyRows(true)}`
      :`<p class="small muted">Noch keine. Lade jemanden ein: Ihr bekommt ${plusOffer(true)}ein gemeinsames Ziel von ${GOAL_DAYS} guten Tagen.</p>`}
    <div class="row"><button class="btn secondary grow" id="shareBtn">Insel teilen</button><button class="btn grow" id="friendsBtn">Einladen</button></div>
  </div>`;
  if(on) h+=`<div class="card"><p class="label">Mit Code hinzufügen</p>
      <label class="field" for="rkCode">Code eingeben<input id="rkCode" type="text" maxlength="7" autocomplete="off" autocapitalize="characters" placeholder="z. B. K7M2QX" style="text-transform:uppercase;letter-spacing:.12em"></label>
      <p class="err" id="rkErr" role="alert"></p>
      <button class="btn secondary" id="rkAdd">Hinzufügen</button>
      <p class="small muted" style="text-align:center">Dein Code: <b class="num" style="color:var(--ink);letter-spacing:.1em">${myCode()}</b></p>
    </div>`;
  return h;
}
/* Freunde: Wettsegeln oben, wer im Schnitt weniger am Handy ist, segelt weiter vorne */
function frHeroSvg(list){
  const me={name:"Du",avatar:netAv(),me:true};
  list=(list&&list.length?list:[me]).slice(0,3);
  // Bild unten verdecken die Chips: alle Boote zwischen y 84 und 128, vorne liegt oben rechts
  const n=list.length, lane=n===1?[116]:n===2?[92,124]:[86,108,130];
  const boat=(r,i)=>{const x=n===1?150:246-i*(140/(n-1||1)), y=lane[i], sail=r.me?"#C8F169":["#B6A4FF","#FF9C7A","#9CC8EE"][i%3];
    return `<g transform="translate(${x} ${y})"><g class="bob" style="animation-duration:${2+i*.3}s;animation-delay:${i*.2}s">
      <path d="M-22 -2h44l-7 10h-30z" fill="#8A5A3B"/><path d="M0 -2V-40" stroke="#D9D4C6" stroke-width="1.8"/><path d="M2 -38q15 12 13 34h-13z" fill="${sail}"/><path d="M-2 -35q-12 10-12 31h12z" fill="#F3F1EA" opacity=".9"/>
      <g transform="translate(-9 -3) scale(.55)">${animalSvg(r.avatar||"Ziege",0)}</g>
      <path d="M-26 7q-10 2-20 0" stroke="#9CC8EE" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".6"/>
      <text x="26" y="2" font-size="10" font-weight="800" fill="${sail}" font-family="Manrope, sans-serif">${i===0&&n>1?"★ ":""}${esc(r.me?"Du":r.name||"?")}</text></g></g>`};
  return `<svg viewBox="0 0 360 200" role="img" aria-label="Wettsegeln mit deinen Freund:innen" style="width:100%;height:auto;display:block">
    <defs><linearGradient id="frSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A4A7A"/><stop offset="1" stop-color="#16294A"/></linearGradient></defs>
    <rect width="360" height="200" fill="#1B2340"/>${[[40,22],[96,40],[210,18],[300,34],[150,30]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="#F3F1EA" opacity=".7"/>`).join("")}
    <rect y="54" width="360" height="146" fill="url(#frSea)"/>
    <g stroke="#9CC8EE" fill="none" stroke-linecap="round" opacity=".3"><path class="wscroll" style="animation-duration:5s" d="${wavePath(84,2)}" stroke-width="1.4"/><path class="wscroll" style="animation-duration:3.8s" d="${wavePath(126,2.5)}" stroke-width="1.4"/></g>
    <g transform="translate(334 0)"><path d="M0 134V60" stroke="#F3F1EA" stroke-width="2"/><g class="flagwave">${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${1+c*6}" y="${60+r*5}" width="6" height="5" fill="${(r+c)%2?"#14151F":"#F3F1EA"}"/>`).join("")).join("")}</g></g>
    ${list.map(boat).join("")}</svg>`;
}
function friendsCardInvite(inv){
  return `<div class="card" style="border:1.5px solid var(--lime)"><p class="label" style="color:var(--lime)">Einladung</p>
    <p><b>Du wurdest eingeladen!</b> Nimm die Einladung von <b class="num">${esc(inv)}</b> an: Ihr bekommt ${plusOffer(false)}ein gemeinsames Ziel.</p><button class="btn" id="inviteAccept">Einladung annehmen</button></div>`;
}
/* Ranglisten laden (kurz zwischengespeichert, damit nicht jedes Neuzeichnen lädt) */
let RANKC=null;
async function loadRanks(force){
  const wk=isoWeek(today()), key=S.online.pid+wk; let me=S.online.pid;
  if(!force&&RANKC&&RANKC.key===key&&Date.now()-RANKC.at<60000&&(rankTab!=="alle"||RANKC.all)) return RANKC;
  await netSync(); let N=await netInit();
  let fr;
  try{fr=await N.list("players/"+S.online.pid+"/friends")}
  catch(e){
    if(!e||e.code!=="permission-denied") throw e;
    // Neue Online-Kennung auf diesem Gerät (anderes Gerät, App statt Browser, Backup): Profil neu anlegen und Freund:innen neu verbinden
    await netRelink(); await netSync(); N=await netInit();
    fr=await N.list("players/"+S.online.pid+"/friends");
  }
  me=S.online.pid;
  const friends=(await Promise.all([me].concat(fr.map(f=>f.id)).map(async id=>{
    const r=await N.get("weeks/"+wk+"/ranks/"+id).catch(()=>null);
    if(r) return Object.assign({id},r);
    const p=await N.get("players/"+id).catch(()=>null); return p?{id,name:p.name,avatar:p.avatar,world:p.world,avg:null,good:0,updated:p.updated||0}:null;
  }))).filter(Boolean)
    // dieselbe Person doppelt (altes Profil nach Gerätewechsel): nur den neueren Eintrag zeigen
    .sort((a,b)=>(b.id===me)-(a.id===me)||(b.updated||0)-(a.updated||0))
    .filter((r,i,arr)=>r.id===me||arr.findIndex(x=>x.id!==me&&x.name===r.name&&x.avatar===r.avatar)===i)
    .sort(byAvg);
  let all=RANKC&&RANKC.key===key&&!force?RANKC.all:null;
  let place=null,total=null;
  if(rankTab==="alle"||S.online.pub){
    all=(await N.list("weeks/"+wk+"/public",{orderBy:"avg",limit:100})).filter(r=>(r.days||0)>=3);
    // genauer Platz auch jenseits der ersten 100: zählen, wer im Schnitt weniger hatte
    const mine=friends.find(r=>r.id===me);
    if(N.count){
      total=await N.count("weeks/"+wk+"/public").catch(()=>null);
      if(mine&&all.some(r=>r.id===me)===false&&S.online.pub&&mine.avg!=null&&(mine.days||0)>=3) place=await N.count("weeks/"+wk+"/public",["avg","<",mine.avg]).then(n=>n+1).catch(()=>null);
    }
    if(place==null){const i=all.findIndex(r=>r.id===me); if(i>=0) place=rankPlaces(all)[i]}
    if(total==null) total=all.length;
  }
  return RANKC={key,at:Date.now(),friends,all,place,total,nFriends:fr.length};
}
async function fillRanks(force){
  const box=$("#rankBox"); if(!box) return;
  let R; try{R=await loadRanks(force)}catch(e){console.warn("Ranglisten:",e);if($("#rankBox")) $("#rankBox").innerHTML=`<p class="err">Keine Verbindung zum Online-Speicher. Versuch es später noch mal.</p><p class="small muted">Fehlercode: ${esc(String(e&&(e.code||e.message)||"unbekannt"))}</p><button class="btn secondary" id="rkRetry">Noch mal versuchen</button>`;const rr=$("#rkRetry");if(rr)rr.onclick=()=>{RANKC=null;$("#rankBox").innerHTML=`<p class="small muted">Lade …</p>`;fillRanks(true)};return}
  if(!$("#rankBox")||tab!=="freunde") return;                                  // inzwischen woanders
  const me=S.online.pid, fi=R.friends.findIndex(r=>r.id===me), mine=R.friends[fi]||{};
  const ai=R.all?R.all.findIndex(r=>r.id===me):-1, pl=R.all?rankPlaces(R.all):[];
  const pubHint=!S.online.pub?"":R.place!=null?`<p class="small"><b>Platz ${R.place.toLocaleString("de-DE")}</b> <span class="muted">von ${Math.max(R.total||0,R.place).toLocaleString("de-DE")} in der Rangliste für alle</span></p>`
    :mine.avg!=null&&(mine.days||0)<3?`<p class="small muted">Ab 3 eingetragenen Tagen diese Woche bist du in der Rangliste für alle dabei (noch ${3-(mine.days||0)}).</p>`:"";
  const simHint=S.testmode&&S.lastDay&&S.lastDay>today()?`<p class="small muted">Testmodus: Simulierte Tage liegen in der Zukunft und zählen nicht für die Ranglisten. Es zählen nur echte Tage dieser Woche.</p>`:"";
  // Duell: Herausforderung von jemandem annehmen, dann Rennen zeigen
  const wkNow=isoWeek(today());
  if(S.duel&&S.duel.wk===wkNow){const opp=R.friends.find(r=>r.id===S.duel.vs);
    if(opp&&opp.duelOff===me){const n=S.duel.name;S.duelOff={vs:S.duel.vs,wk:wkNow};S.duel=null;log(n+" hat das Duell abgebrochen.","info");save();toast(n+" hat das Duell abgebrochen");netSync()}}
  const ch=R.friends.find(r=>r.id!==me&&r.duel===me&&r.duelOff!==me&&!(S.duelOff&&S.duelOff.wk===wkNow&&S.duelOff.vs===r.id));
  if(ch&&!(S.duel&&S.duel.wk===wkNow)){S.duel={vs:ch.id,name:ch.name||"?",avatar:ch.avatar||"Ziege",wk:wkNow,by:"them"};log(S.duel.name+" hat dich zum Duell der Woche herausgefordert.","info");S.pending.push({type:"duelStart",name:S.duel.name,avatar:S.duel.avatar});save();netSync();showPending()}
  const db=$("#duelBox"); if(db){db.innerHTML=duelHtml(R); db.querySelectorAll("[data-duel]").forEach(b=>b.onclick=()=>{const r=R.friends.find(x=>x.id===b.dataset.duel); if(r){b.disabled=true;duelChallenge(r)}});
    const st=$("#duelStop"); if(st) st.onclick=duelCancelSheet}
  // Vorschau oben: Ring-Karte, Chips und Wettsegeln im Bild
  const nF=R.friends.length, ahead=fi>0?R.friends[fi-1]:null;
  const ring=R.nFriends?ringSvg((nF-fi)/nF,"#"+(fi+1),"von "+nF,fi===0?"#FFB86B":"#B6A4FF")
    :ringSvg(mine.avg!=null?Math.min(1,mine.avg/S.budget):0,mine.avg!=null?hm(mine.avg):"–","im Schnitt",mine.avg!=null&&mine.avg<=S.budget?"#C8F169":"#FF9C7A");
  $("#rankHero").innerHTML=`<div class="row" style="gap:14px;align-items:center">${ring}<div class="grow">
    <p class="label" style="color:var(--lime)">Diese Woche${R.nFriends?" · Freund:innen":""}</p>
    ${R.nFriends?`<h3 class="hm-title" style="color:${fi===0?"var(--amber)":"var(--ink)"}">${fi===0?"Du führst!":"Platz "+(fi+1)}</h3>
      <p class="small muted">${fi===0?"Niemand war diese Woche weniger am Handy.":ahead&&mine.avg!=null&&ahead.avg!=null?"Noch "+hm(mine.avg-ahead.avg+1)+" pro Tag weniger, dann überholst du "+esc(ahead.name||"?")+".":"Jeder Tag im Budget bringt dich nach vorne."}</p>`
    :`<h3 class="hm-title">${mine.avg!=null?"Dein Schnitt":"Noch kein Tag"}</h3><p class="small muted">${mine.avg!=null?"Lade Freund:innen ein, um euch zu vergleichen.":"Trag deinen ersten Tag ein, dann geht's los."}</p>`}
    </div></div>${pubHint}${simHint}`;
  const set=(id,t)=>{const e=$(id); if(e) e.textContent=t};
  set("#chPl",R.nFriends?(fi+1)+" von "+nF:R.place!=null?R.place.toLocaleString("de-DE"):"–");
  set("#chFr",String(R.nFriends));
  const dw=S.duel&&S.duel.wk===isoWeek(today())?S.duel:null, dOpp=dw?R.friends.find(r=>r.id===dw.vs):null;
  set("#chDu",!dw?"offen":dOpp&&dOpp.avg!=null&&mine.avg!=null?(mine.avg<dOpp.avg?"vorne":mine.avg>dOpp.avg?"hinten":"gleich"):"läuft");
  const fh=$("#frHero"); if(fh) fh.innerHTML=frHeroSvg(R.friends.map(r=>r.id===me?Object.assign({},r,{me:true,avatar:netAv()}):r));
  // Liste
  if(rankTab==="freunde"){
    box.innerHTML=(R.nFriends?"":`<p class="small muted">Noch keine Freund:innen online. Füg jemanden mit dem Code hinzu oder schick eine Einladung.</p>`)+
      `<div style="display:flex;flex-direction:column;gap:4px">${R.friends.map((r,i)=>rankRow(r,i,r.id===me)).join("")}</div>`+
      (R.nFriends?`<details><summary class="small muted" style="cursor:pointer;min-height:44px;display:flex;align-items:center">Freund:innen verwalten</summary>${R.friends.filter(r=>r.id!==me).map(r=>`<div class="row between"><span>${esc(r.name||"?")}</span><button class="btn ghost" style="width:auto;padding:0 12px" data-unfriend="${r.id}">Entfernen</button></div>`).join("")}</details>`:"");
  } else {
    const all=R.all||[];
    box.innerHTML=`<p class="small muted">Wer diese Woche im Schnitt am wenigsten am Handy war (ab 3 eingetragenen Tagen).</p>
      <div style="display:flex;flex-direction:column;gap:4px">${all.slice(0,50).map((r,i)=>rankRow(r,pl[i]-1,r.id===me)).join("")||`<p class="small muted">Noch niemand diese Woche.</p>`}</div>
      ${ai>=50?rankRow(all[ai],pl[ai]-1,true):ai<0&&R.place!=null&&R.place>50&&mine.avg!=null?`<p class="small muted" style="text-align:center">…</p>`+rankRow(mine,R.place-1,true):""}
      ${S.online.pub?"":`<p class="small muted">Du erscheinst hier nicht. Das kannst du in den Einstellungen ändern.</p>`}`;
  }
  document.querySelectorAll("[data-unfriend]").forEach(b=>b.onclick=async()=>{b.disabled=true;await netRemove(b.dataset.unfriend);S.buddies=S.buddies.filter(x=>x.pid!==b.dataset.unfriend);save();RANKC=null;render()});
}

/* ---------- Duell der Woche: wer ist im Schnitt weniger am Handy? ---------- */
const WEEKDAY=["So","Mo","Di","Mi","Do","Fr","Sa"];
async function duelCheck(){
  const d=S.duel; if(!d||d.wk>=isoWeek(today())||d.done) return;
  const N=await netInit();
  const [a,b]=await Promise.all([N.get("weeks/"+d.wk+"/ranks/"+S.online.pid).catch(()=>null),N.get("weeks/"+d.wk+"/ranks/"+d.vs).catch(()=>null)]);
  const my=a&&a.avg!=null?a.avg:null, their=b&&b.avg!=null?b.avg:null;
  const draw=my===their, win=!draw&&(their==null||(my!=null&&my<their));
  let item=null;
  if(win){item=DUEL_PRIZES.find(x=>!S.items.includes(x))||null; if(item) grantItem(item); else S.points+=150}
  else S.points+=draw?40:20;
  S.duelLog.push({wk:d.wk,vs:d.vs,name:d.name,win,draw,my,their}); if(S.duelLog.length>60) S.duelLog.shift();
  log(win?"Duell gegen "+d.name+" gewonnen!"+(item?" "+itemName(item)+" steht jetzt auf deiner Insel.":" +150 Punkte."):draw?"Duell gegen "+d.name+": Unentschieden. +40 Punkte.":"Duell gegen "+d.name+" knapp verloren. +20 Punkte fürs Mitmachen.",win?"good":"info");
  chron([],win?"Duell gegen "+d.name+" gewonnen.":draw?"Duell gegen "+d.name+" endete unentschieden.":"Duell gegen "+d.name+" verloren.");
  S.pending.push({type:"duelEnd",name:d.name,avatar:d.avatar,win,draw,my,their,item});
  S.duel=null; save(); render(); showPending();
}
function duelCancel(why){
  const d=S.duel; if(!d) return;
  S.duelOff={vs:d.vs,wk:d.wk}; S.duel=null;
  log(why==="ablehnen"?"Du hast die Herausforderung von "+d.name+" abgelehnt.":"Du hast das Duell gegen "+d.name+" abgebrochen.","info");
  save(); RANKC=null; render(); netSync().then(()=>{if(tab==="freunde") fillRanks(true)});
  toast(why==="ablehnen"?"Herausforderung abgelehnt":"Duell abgebrochen");
}
function duelCancelSheet(){
  const d=S.duel; if(!d) return;
  sheet(`<p class="label" style="color:var(--amber)">Duell der Woche</p><h2>Duell gegen ${esc(d.name)} abbrechen?</h2>
    <p class="muted">Niemand gewinnt eine Deko. ${esc(d.name)} sieht, dass du abgebrochen hast. Diese Woche könnt ihr euch nicht noch einmal herausfordern, ab Montag wieder.</p>
    <button class="btn" id="dcNo">Weiterspielen</button><button class="btn ghost" id="dcYes">Duell abbrechen</button>`);
  $("#dcNo").onclick=()=>{closeModal();render()};
  $("#dcYes").onclick=()=>{closeModal();duelCancel()};
}
function duelChallenge(r){
  stat("duell");
  S.duel={vs:r.id,name:r.name||"?",avatar:r.avatar||"Ziege",wk:isoWeek(today()),by:"me"};
  log("Du hast "+S.duel.name+" zum Duell der Woche herausgefordert.","info");
  save(); RANKC=null; toast("Duell gestartet!"); netSync().then(()=>fillRanks(true));
}
/* Wettsegeln: je weiter vorne, desto weniger Handyzeit im Schnitt. Die Handyzeit-Welle jagt beide. */
function duelRace(me,them){
  const wd=(new Date().getDay()+6)%7, p=(wd+1)/7, base=70+190*p;
  const known=me.avg!=null&&them.avg!=null, lead=known?them.avg-me.avg:0;
  const gap=known?Math.min(110,Math.abs(lead)/60*55):0;
  let xm=base, xt=base;
  if(known){if(lead>0) xt=base-gap; else if(lead<0) xm=base-gap}
  if(me.avg==null) xm=36; if(them.avg==null) xt=36;
  const boat=(r,x,y,sail,delay,lead)=>`<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" from="${30-x} 0" to="0 0" dur="1.8s" begin="${delay}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".2 .8 .2 1"/>
      <g class="bob" style="animation-duration:${lead?1.6:2.2}s">
      <path d="M-26 -2h52l-8 12h-36z" fill="#8A5A3B"/><path d="M-26 -2h52" stroke="#A0703F" stroke-width="2"/>
      <path d="M0 -2V-50" stroke="#D9D4C6" stroke-width="2"/><g class="sailflap"><path d="M2 -48q18 14 16 42h-16z" fill="${sail}"/></g><path d="M-2 -44q-14 12-14 38h14z" fill="#F3F1EA" opacity=".9"/>
      <g transform="translate(-10 -4) scale(.62)">${animalSvg(r.avatar||"Ziege",0)}</g>
      ${lead?`<g class="pop fb" style="animation-delay:2s"><path d="M0 -52l2 4 4 .5-3 3 .8 4.5-3.8-2-3.8 2 .8-4.5-3-3 4-.5z" fill="#FFD27A"/></g>`:""}
      <path class="wake" d="M-30 8q-10 2-22 0M-30 4q-8 2-16 0" stroke="#9CC8EE" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
      <text x="0" y="24" text-anchor="middle" font-size="10" font-weight="800" fill="${sail}" font-family="Manrope, sans-serif">${esc(r.name)}</text></g></g></g>`;
  const back=Math.max(10,Math.min(xm,xt)-78);
  return `<svg viewBox="0 0 340 220" class="duel-svg" role="img" aria-label="Wettsegeln: ${esc(me.name)} gegen ${esc(them.name)}">
    <defs><linearGradient id="dSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A4A7A"/><stop offset="1" stop-color="#16294A"/></linearGradient></defs>
    <rect width="340" height="220" rx="18" fill="#1B2340"/><rect y="40" width="340" height="180" fill="url(#dSea)"/>
    <g stroke="#9CC8EE" fill="none" stroke-linecap="round" opacity=".35"><path class="wscroll" style="animation-duration:5s" d="${wavePath(70,2)}" stroke-width="1.4"/><path class="wscroll" style="animation-duration:3.8s" d="${wavePath(130,2.5)}" stroke-width="1.6"/><path class="wscroll" style="animation-duration:4.4s" d="${wavePath(186,2)}" stroke-width="1.4"/></g>
    <g transform="translate(272 0)"><path d="M0 196V36" stroke="#F3F1EA" stroke-width="2"/><g class="flagwave">${[0,1,2,3].map(r=>[0,1,2].map(c=>`<rect x="${1+c*7}" y="${36+r*6}" width="7" height="6" fill="${(r+c)%2?"#14151F":"#F3F1EA"}"/>`).join("")).join("")}</g></g>
    <g transform="translate(${back} 140) scale(1.4)"><g class="chase">${monsterSvg("strudel")}</g></g>
    ${boat(them,xt,104,"#B6A4FF",.1,known&&lead<0)}
    ${boat(me,xm,170,"#C8F169",.3,known&&lead>0)}
    <text x="12" y="26" font-size="12" fill="#F3F1EA" font-family="Manrope, sans-serif" font-weight="800">${esc(them.name)}: ${them.avg!=null?hm(them.avg)+" / Tag":"noch nichts eingetragen"}</text>
    <text x="328" y="26" text-anchor="end" font-size="12" fill="#C8F169" font-family="Manrope, sans-serif" font-weight="800">Du: ${me.avg!=null?hm(me.avg)+" / Tag":"noch nichts"}</text>
</svg>`;
}
function duelTeaser(text,btn){
  return `<div class="card duel-card"><p class="label" style="color:var(--amber)">⚔️ Duell der Woche</p>
    <div class="duel-vs" style="justify-content:flex-start"><span>${avatarSvg(netAv(),48)}</span><b class="duel-x" style="font-size:24px">⚔️</b><span class="avatar" style="width:48px;height:48px;border-radius:24px;background:var(--card2);display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:var(--muted)">?</span></div>
    <p>Fordere eine:n Freund:in heraus: Wer diese Woche im Schnitt weniger am Handy ist, gewinnt eine <b>Deko für die Insel</b>. Ihr seht als Wettsegeln, wer vorne liegt.</p>
    <p class="small muted">${text}</p>${btn||""}</div>`;
}
function duelHtml(R){
  if(!R.nFriends) return duelTeaser("Füge zuerst jemanden mit dem Code unten hinzu oder schick eine Einladung. Dann kannst du hier herausfordern.");
  const me=S.online.pid, wk=isoWeek(today()), d=S.duel&&S.duel.wk===wk?S.duel:null;
  if(!d){
    const fr=R.friends.filter(r=>r.id!==me);
    return `<div class="card duel-card"><p class="label" style="color:var(--amber)">⚔️ Duell der Woche</p>
      <p>Fordere jemanden heraus: Wer diese Woche im Schnitt weniger am Handy ist, gewinnt eine <b>Deko für die Insel</b>.</p>
      <div style="display:flex;flex-direction:column;gap:6px">${fr.map(r=>{const off=(S.duelOff&&S.duelOff.wk===wk&&S.duelOff.vs===r.id)||r.duelOff===me;
        return `<div class="row">${avatarSvg(r.avatar||"Ziege",36)}<b class="grow">${esc(r.name||"?")}</b>${off?`<span class="small muted">ab Montag wieder</span>`:`<button class="btn secondary" style="width:auto;padding:0 14px;min-height:44px" data-duel="${esc(r.id)}">Herausfordern</button>`}</div>`}).join("")}</div>
      <p class="small muted">Das Duell läuft bis Sonntag. Auch wer verliert, bekommt Punkte fürs Mitmachen.</p></div>`;
  }
  const mine=R.friends.find(r=>r.id===me)||{}, opp=R.friends.find(r=>r.id===d.vs)||{name:d.name,avatar:d.avatar,avg:null};
  const A={name:"Du",avatar:netAv(),avg:mine.avg},B={name:opp.name||d.name,avatar:opp.avatar||d.avatar,avg:opp.avg};
  const known=A.avg!=null&&B.avg!=null, lead=known?B.avg-A.avg:0, left=6-(new Date().getDay()+6)%7;
  const msg=!known?(A.avg==null?"Trag heute deinen Tag ein, dann setzt dein Boot die Segel!":esc(B.name)+" hat diese Woche noch nichts eingetragen. Du segelst schon los!")
    :lead>0?`<b style="color:var(--lime)">Du liegst vorne!</b> ${hm(lead)} weniger pro Tag als ${esc(B.name)}.`
    :lead<0?`<b style="color:var(--coral)">${esc(B.name)} liegt ${hm(-lead)} vorne.</b> Ein guter Tag, und du holst auf!`:`<b>Gleichstand!</b> Jetzt zählt jeder Tag.`;
  return `<div class="card duel-card"><div class="row between"><p class="label" style="color:var(--amber)">⚔️ Duell gegen ${esc(B.name)}</p><span class="chip ok">${left?"noch "+left+(left===1?" Tag":" Tage"):"letzter Tag"}</span></div>
    ${duelRace(A,B)}<p>${msg}</p>
    <p class="small muted">Die Handyzeit-Welle jagt euch beide. Wer im Schnitt weniger am Handy ist, segelt vorne. Sieg am Sonntag: eine Deko für die Insel.</p>
    <button class="btn ghost" id="duelStop">Duell abbrechen</button></div>`;
}
function duelStartSheet(ev){
  sheet(`<div class="duel-vs"><span>${avatarSvg(ev.avatar||"Ziege",64)}</span><b class="duel-x">⚔️</b><span>${avatarSvg(netAv(),64)}</span></div>
    <p class="label" style="color:var(--amber)">Duell der Woche</p><h2>${esc(ev.name)} fordert dich heraus!</h2>
    <p class="muted">Wer diese Woche im Schnitt weniger am Handy ist, gewinnt eine Deko für die Insel. Den Stand siehst du im Tab Freunde.</p>
    <button class="btn" data-ok>Herausforderung annehmen</button><button class="btn ghost" id="duelNo">Ablehnen</button>`);
  $("#duelNo").onclick=()=>{closeModal();duelCancel("ablehnen");showPending()};
}
function duelEndSheet(ev){
  const it=ev.item?`<svg width="120" height="110" viewBox="-30 -42 60 50" aria-hidden="true" class="pop fb">${itemSvg(ev.item)}</svg>`:"";
  sheet(`<div class="anim">${base(here().filter(r=>r.kind==="mensch").slice(0,4).map((r,i)=>`<g class="bob" style="animation-delay:${i*.3}s">${figure(r,210+i*14,134)}</g>`).join("")+(ev.win?confetti():""),!ev.win&&!ev.draw)}</div>
    <p class="label" style="color:${ev.win?"var(--lime)":"var(--amber)"}">Duell vorbei</p>
    <h2>${ev.win?"Du hast gegen "+esc(ev.name)+" gewonnen!":ev.draw?"Unentschieden gegen "+esc(ev.name):esc(ev.name)+" hat knapp gewonnen"}</h2>
    <p class="muted">Du: ${ev.my!=null?hm(ev.my):"–"} pro Tag · ${esc(ev.name)}: ${ev.their!=null?hm(ev.their):"–"} pro Tag</p>
    ${it?`<div style="align-self:center">${it}</div><p><b style="color:var(--amber)">${esc(itemName(ev.item))}</b> steht jetzt auf deiner Insel.</p>`:ev.win?`<p><b style="color:var(--lilac)">+150 Punkte</b></p>`:`<p><b style="color:var(--lilac)">+${ev.draw?40:20} Punkte</b> fürs Mitmachen. Revanche nächste Woche?</p>`}
    <button class="btn" data-ok>Weiter</button>`);
}

/* ---------- Support: Meldungen landen in Firestore unter "support" ----------
   Nur Senden ist erlaubt, lesen kann man sie nur in der Firebase-Konsole. */
const SUPPORT_CATS=[["fehler","Fehler melden"],["idee","Idee oder Wunsch"],["frage","Frage"],["sonst","Sonstiges"]];
function supportInfo(){
  return {app:(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())?"ios":"web",
    ua:navigator.userAgent.slice(0,200),screen:innerWidth+"x"+innerHeight,lang:(navigator.language||"").slice(0,10),
    world:curWorld().name,days:S.dayCount,residents:here().length,budget:S.budget,online:!!netOn()};
}
function supportSheet(prefill){
  if(typeof prefill!=="string") prefill="fehler";
  const info=supportInfo();
  modal(`<p class="label" style="color:var(--lime)">Hilfe und Support</p><h2>Schreib uns</h2>
    <p class="muted">Etwas funktioniert nicht, du hast eine Idee oder eine Frage? Wir lesen jede Nachricht.</p>
    <div class="field"><span>Worum geht es?</span><div class="row" style="flex-wrap:wrap;gap:8px">${SUPPORT_CATS.map(([v,l],i)=>`<label class="check" style="min-height:40px;padding:0 12px;border-radius:20px;background:var(--ground)"><input type="radio" name="supCat" value="${v}" ${prefill===v?"checked":""}> ${l}</label>`).join("")}</div></div>
    <label class="field" for="supText">Deine Nachricht<textarea id="supText" rows="5" maxlength="2000" placeholder="Was ist passiert? Was hast du erwartet?" style="width:100%;border-radius:16px;padding:12px 14px;background:var(--ground);color:var(--ink);border:1.5px solid var(--line);font:500 16px var(--body);resize:vertical"></textarea></label>
    <label class="field" for="supMail">E-Mail für eine Antwort (freiwillig)<input id="supMail" type="email" maxlength="100" autocomplete="email" placeholder="name@beispiel.de"></label>
    <details><summary class="small muted" style="cursor:pointer;min-height:40px;display:flex;align-items:center">Diese technischen Infos werden mitgeschickt</summary>
      <p class="small muted">${info.app==="ios"?"iPhone-App":"Web-App"} · ${esc(info.screen)} · ${esc(info.lang)} · ${esc(info.world)} · ${info.days} Tage · ${info.residents} Bewohner · Budget ${hm(info.budget)} · Gerät: ${esc(info.ua)}</p></details>
    <p class="err" id="supErr" role="alert"></p>
    <button class="btn" id="supSend">Absenden</button>
    ${S.tickets.length?`<details id="supMine"><summary style="cursor:pointer;min-height:44px;display:flex;align-items:center;font-weight:700">Meine Anfragen (${S.tickets.length})</summary><div style="display:flex;flex-direction:column;gap:10px">${S.tickets.slice().reverse().map(ticketHtml).join("")}</div></details>`:""}
    <button class="btn ghost" id="supNo">Abbrechen</button>`);
  $("#supNo").onclick=()=>{closeModal();render()};
  const mine=$("#supMine"); if(mine) mine.ontoggle=()=>{if(mine.open) checkReplies(true)};
  $("#supSend").onclick=async()=>{
    const text=$("#supText").value.trim(), mail=$("#supMail").value.trim(), cat=(document.querySelector("[name=supCat]:checked")||{}).value||"sonst";
    if(text.length<5) return $("#supErr").textContent="Schreib bitte ein paar Worte mehr.";
    if(mail&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) return $("#supErr").textContent="Die E-Mail-Adresse sieht nicht richtig aus.";
    if(!netConfigured()) return $("#supErr").textContent="Support ist in dieser Version noch nicht verfügbar.";
    const btn=$("#supSend"); btn.disabled=true; btn.textContent="Sende …";
    try{
      const N=await netInit();
      const id=rid();
      await N.set("support/"+id,{owner:N.uid,cat,text:text.slice(0,2000),contact:mail.slice(0,100),name:netName(),info:supportInfo(),at:Date.now(),status:"neu"});
      S.tickets.push({id,at:Date.now(),cat,text:text.slice(0,140),reply:null,seen:false}); save();
      sfx("postcard");
      modal(`<p class="label" style="color:var(--lime)">Danke!</p><h2>Nachricht ist angekommen</h2><p class="muted">Unsere Antwort erscheint hier in der App${mail?" und kommt per E-Mail":""}. Du findest sie auch unter Hilfe und Support → Meine Anfragen.</p><button class="btn" id="supOk">Schließen</button>`);
      $("#supOk").onclick=()=>{closeModal();render()};
    }catch(e){
      if(!document.body.contains(btn)) return;
      btn.disabled=false; btn.textContent="Absenden"; $("#supErr").textContent="Senden hat nicht geklappt. Bist du online? Versuch es gleich noch mal.";
    }
  };
}

/* Antworten: im Support-Dokument das Feld "antwort" in der Firebase-Konsole ausfüllen */
function ticketHtml(t){
  const cat=(SUPPORT_CATS.find(c=>c[0]===t.cat)||["",""])[1];
  return `<div style="background:var(--ground);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:6px">
    <div class="row between"><span class="small muted">${esc(cat)} · ${new Date(t.at).toLocaleDateString("de-DE")}</span><span class="small" style="font-weight:700;color:${t.reply?"var(--lime)":"var(--muted)"}">${t.reply?"beantwortet":"offen"}</span></div>
    <p class="small">„${esc(t.text)}${t.text.length>=140?"…":""}“</p>
    ${t.reply?`<div style="border-left:3px solid var(--lime);padding-left:10px"><p class="small" style="font-weight:700;color:var(--lime)">OffLand-Team</p><p class="small" style="white-space:pre-wrap">${esc(t.reply)}</p></div>`:""}</div>`;
}
let replyCheck=0;
async function checkReplies(force){
  if(!netConfigured()||!S.setup||!(S.tickets||[]).length) return;           // nur wer selbst eine Anfrage geschickt hat
  if(!force&&Date.now()-replyCheck<10*60000) return; replyCheck=Date.now();
  let N; try{N=await netInit()}catch(e){return}
  // alle eigenen Anfragen dieses Geräts holen (findet auch ältere, die die App sich nicht gemerkt hat)
  let docs=null;
  try{docs=await N.list("support",{where:["owner",N.uid],limit:50})}catch(e){}
  if(!docs) docs=(await Promise.all(S.tickets.filter(t=>!t.reply).map(t=>N.get("support/"+t.id).then(d=>d&&Object.assign({id:t.id},d)).catch(()=>null)))).filter(Boolean);
  let got=0, added=0;
  for(const d of docs){
    let t=S.tickets.find(x=>x.id===d.id);
    if(!t){ if(d.name!==netName()) continue;                                     // gehört zu einem anderen Konto auf diesem Gerät
      t={id:d.id,at:d.at||Date.now(),cat:d.cat,text:String(d.text||"").slice(0,140),reply:null,seen:false}; S.tickets.push(t); added++; }
    const a=typeof d.antwort==="string"&&d.antwort.trim();
    if(a&&!t.reply){t.reply=a.slice(0,3000);t.replyAt=Date.now();S.pending.push({type:"reply",id:t.id});got++}
  }
  if(added&&!got) save();
  if(got){save();log("Das OffLand-Team hat auf deine Anfrage geantwortet.","good");showPending()}
}

/* ---------- Bildschirmzeit automatisch (nur iPhone-App) ----------
   Natives Plugin "ScreenTime" (ios/App/App/ScreenTimePlugin.swift). Apple liefert nur Schwellen:
   Die Monitor-Erweiterung merkt sich pro Tag die höchste erreichte 15-Minuten-Stufe. */
const ST=(()=>{try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.getPlatform()==="ios"&&C.registerPlugin?C.registerPlugin("ScreenTime"):null}catch(e){return null}})();
let stInfo=null;
async function stStatus(){if(!ST)return null;try{stInfo=await ST.status()}catch(e){stInfo={available:false}}return stInfo}
function stCard(){
  if(!ST) return "";
  const i=stInfo||{};
  const on=i.status==="approved"&&i.monitoring;
  return `<div class="card" id="stCard"><p class="label">Bildschirmzeit automatisch</p>
    ${on?`<p class="small muted">OffLand misst deine Bildschirmzeit in 15-Minuten-Schritten mit. Beim Eintragen ist die Zeit schon vorausgefüllt, du musst nur noch bestätigen.</p>
      <div class="row"><button class="btn secondary grow" id="stApps">Apps ändern</button><button class="btn ghost grow" id="stOff">Ausschalten</button></div>`
    :i.status==="denied"?`<p class="small muted">Du hast den Zugriff auf die Bildschirmzeit abgelehnt. Erlauben kannst du ihn in den iPhone-Einstellungen unter Bildschirmzeit.</p><button class="btn secondary" id="stSetup">Erneut versuchen</button>`
    :`<p class="small muted">Statt jeden Abend abzulesen, kann OffLand die Bildschirmzeit vom iPhone übernehmen. OffLand sieht dabei nicht, welche Apps du nutzt, sondern nur die Gesamtzeit in 15-Minuten-Schritten.</p>
      <button class="btn secondary" id="stSetup">Einrichten</button>`}
  </div>`;
}
async function stSetup(){
  try{
    await ST.authorize();
    const r=await ST.pickApps();
    if(r&&r.ok){S.autoTime=true;save();toast("Bildschirmzeit wird jetzt automatisch gemessen")}
  }catch(e){toast(String(e&&e.message||e).slice(0,120))}
  await stStatus(); settingsSheet();
}
/* Beim Eintragen: gemessene Zeit des einzutragenden Tages vorausfüllen */
async function stFill(){
  if(!ST||!$("#inH")) return;
  const i=stInfo||await stStatus(); if(!i||i.status!=="approved"||!i.monitoring) return;
  const day=nextDay(); let r; try{r=await ST.minutes({day})}catch(e){return}
  const h=$("#inH"), m=$("#inM"), note=$("#stNote"); if(!h||!r||!r.has) return;
  if(!h.dataset.touched&&!m.dataset.touched){h.value=Math.floor(r.minutes/60);m.value=r.minutes%60;liveUpdate()}
  if(note) note.innerHTML=`<b style="color:var(--lime)">Automatisch gemessen:</b> mindestens ${hm(r.minutes)}${day===today()?" bis jetzt":""}. Apple meldet die Zeit in 15-Minuten-Schritten, darum kann es bis zu 14 Minuten mehr gewesen sein.`;
}

/* ---------- Online-Backup: verschlüsselt, nur mit Wiederherstellungs-Code lesbar ----------
   Dokument-ID und Schlüssel werden aus dem Code abgeleitet. Ohne Code kann niemand das Backup
   finden oder lesen, auch nicht in der Firebase-Konsole. */
const fmtCode=c=>c.replace(/(.{4})(?=.)/g,"$1-");
const newBackupCode=()=>Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>CODE_ABC[x%32]).join("");
const cleanBackupCode=c=>String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12);
const b64=buf=>{const u=new Uint8Array(buf);let s="";for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)};
const unb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function backupKeys(code){
  const enc=new TextEncoder();
  const h=new Uint8Array(await crypto.subtle.digest("SHA-256",enc.encode("offland-backup-id:"+code)));
  const id=Array.from(h,x=>x.toString(16).padStart(2,"0")).join("").slice(0,40);
  const base=await crypto.subtle.importKey("raw",enc.encode(code),"PBKDF2",false,["deriveKey"]);
  const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt:enc.encode("offland-backup-v1"),iterations:100000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
  return {id,key};
}
async function pipeBytes(bytes,stream){return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer())}
async function backupNow(force){
  const b=S.backup; if(!b||!b.on||!b.code||!netConfigured()) return false;
  if(!force&&b.at&&Date.now()-b.at<30*60000) return true;
  try{
    const N=await netInit(), {id,key}=await backupKeys(b.code);
    b.at=Date.now();
    let bytes=new TextEncoder().encode(JSON.stringify({profile:ACC?{name:ACC.name,avatar:ACC.avatar}:null,state:S}));
    const gz=typeof CompressionStream==="function"; if(gz) bytes=await pipeBytes(bytes,new CompressionStream("gzip"));
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const data=b64(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,bytes));
    if(data.length>900000) throw new Error("zu groß");
    await N.set("backups/"+id,{v:1,gz,iv:b64(iv),data,at:b.at,size:data.length});
    save(); return true;
  }catch(e){return false}
}
async function backupLoad(code){
  const N=await netInit(), {id,key}=await backupKeys(code);
  const d=await N.get("backups/"+id);
  if(!d) return null;
  let bytes=new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(d.iv)},key,unb64(d.data)));
  if(d.gz) bytes=await pipeBytes(bytes,new DecompressionStream("gzip"));
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function backupDelete(){
  const b=S.backup; if(!b||!b.code) return;
  try{const N=await netInit(), {id}=await backupKeys(b.code); await N.del("backups/"+id)}catch(e){}
  S.backup={on:false,code:null,at:null}; save();
}
function backupCard(){
  const b=S.backup||{};
  if(!b.on) return `<div class="card"><p class="label">Online-Backup</p>
    <p class="small muted">Sichert deine Insel verschlüsselt online, damit sie bei einem neuen Handy nicht verloren geht. Du bekommst einen Wiederherstellungs-Code. Ohne ihn kann niemand das Backup öffnen, auch wir nicht.</p>
    <button class="btn secondary" id="bkOn">Backup einschalten</button></div>`;
  return `<div class="card"><p class="label">Online-Backup</p>
    <p class="small muted">Wird automatisch nach jedem Tag gesichert. ${b.at?"Zuletzt: "+new Date(b.at).toLocaleString("de-DE",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"Noch nicht gesichert."}</p>
    <div style="background:var(--ground);border-radius:16px;padding:12px;text-align:center"><span class="small muted">Dein Wiederherstellungs-Code</span><br><b class="num" style="font-size:22px;letter-spacing:.08em">${fmtCode(b.code)}</b></div>
    <p class="small" style="color:var(--amber)">Schreib dir den Code auf oder mach einen Screenshot. Ohne ihn lässt sich die Insel nicht zurückholen.</p>
    <div class="row"><button class="btn secondary grow" id="bkCopy">Code kopieren</button><button class="btn secondary grow" id="bkNow">Jetzt sichern</button></div>
    <button class="btn ghost" id="bkOff">Backup ausschalten und löschen</button></div>`;
}
async function backupEnable(){
  const btn=$("#bkOn"); if(btn){btn.disabled=true;btn.textContent="Richte ein …"}
  S.backup={on:true,code:newBackupCode(),at:null};
  const ok=await backupNow(true);
  if(!ok){S.backup={on:false,code:null,at:null};save();toast("Keine Verbindung. Versuch es später noch mal.");return settingsSheet()}
  modal(`<p class="label" style="color:var(--lime)">Online-Backup ist an</p><h2>Dein Wiederherstellungs-Code</h2>
    <div style="background:var(--ground);border-radius:16px;padding:16px;text-align:center"><b class="num" style="font-size:26px;letter-spacing:.08em">${fmtCode(S.backup.code)}</b></div>
    <p class="muted">Mit diesem Code holst du deine Insel auf jedes Handy zurück: Startbildschirm → „Insel aus Backup holen“.</p>
    <p class="small" style="color:var(--amber)">Bitte jetzt aufschreiben oder einen Screenshot machen. Wir können den Code nicht wiederherstellen.</p>
    <button class="btn secondary" id="bkCopy2">Code kopieren</button><button class="btn" id="bkDone">Hab ich notiert</button>`);
  $("#bkCopy2").onclick=async()=>{try{await navigator.clipboard.writeText(S.backup.code);toast("Code kopiert")}catch(e){toast("Bitte abschreiben")}};
  $("#bkDone").onclick=settingsSheet;
}
function restoreSheet(){
  modal(`<p class="label" style="color:var(--lime)">Backup</p><h2>Insel zurückholen</h2>
    <p class="muted">Gib deinen Wiederherstellungs-Code ein. Die Insel wird als eigenes Konto auf diesem Gerät angelegt.</p>
    <label class="field" for="rsCode">Wiederherstellungs-Code<input id="rsCode" type="text" maxlength="16" autocomplete="off" autocapitalize="characters" placeholder="XXXX-XXXX-XXXX" style="text-transform:uppercase;letter-spacing:.1em"></label>
    <p class="err" id="rsErr" role="alert"></p>
    <button class="btn" id="rsGo">Insel holen</button><button class="btn ghost" id="rsNo">Abbrechen</button>`);
  $("#rsNo").onclick=closeModal;
  $("#rsGo").onclick=async()=>{
    const code=cleanBackupCode($("#rsCode").value), btn=$("#rsGo");
    if(code.length!==12) return $("#rsErr").textContent="Der Code hat 12 Zeichen.";
    btn.disabled=true; btn.textContent="Hole Insel …";
    let bk=null; try{bk=await backupLoad(code)}catch(e){bk=false}
    if(!document.body.contains(btn)) return;
    btn.disabled=false; btn.textContent="Insel holen";
    if(bk===null) return $("#rsErr").textContent="Zu diesem Code gibt es kein Backup.";
    if(!bk||!bk.state||bk.state.v!==1) return $("#rsErr").textContent="Das Backup konnte nicht geöffnet werden. Stimmt der Code? Bist du online?";
    const pr=bk.profile||{}, list=profiles();
    let name=(pr.name||"Insel").slice(0,20); if(list.some(x=>x.name===name)) name=(name.slice(0,17)+" (2)");
    const p={id:uid(),name,avatar:pr.avatar||AVATARS[0],salt:uid(),pin:null,created:Date.now()};
    const st=bk.state; st.backup={on:true,code,at:Date.now()};
    try{localStorage.setItem(profKey(p.id),JSON.stringify(st))}catch(e){return $("#rsErr").textContent="Auf diesem Gerät ist nicht genug Speicher frei."}
    list.push(p); storeProfiles(list);
    login(p); toast("Willkommen zurück, "+name+"!");
  };
}

/* ---------- Familieninsel ----------
   Jede Person behält ihre Insel. Die Familieninsel wächst mit den guten Tagen aller.
   Firestore: families/{fid} (Name, Code), famcodes/{code}, families/{fid}/uids/{uid} (Mitgliedschaft
   je Gerät), families/{fid}/members/{mid} (Name, Avatar, gute Tage, letzte 14 Tage). */
const FAMINV_KEY="offline-insel-familie-einladung";
function famInvite(){let c=null;try{c=localStorage.getItem(FAMINV_KEY)}catch(e){} c=cleanCode(c); return c&&c.length===6&&!(S.family&&S.family.code===c)?c:null}
const FAM_PROJECTS=[
  {id:"feuer",n:"Lagerfeuer",need:5},{id:"bank",n:"Familienbank",need:12},{id:"garten",n:"Gemüsegarten",need:20},
  {id:"baumhaus",n:"Baumhaus",need:35},{id:"floss",n:"Bootssteg mit Floß",need:50},{id:"laternen",n:"Laternenweg",need:75},{id:"festzelt",n:"Festzelt",need:100}
];
let FAMC=null;
function famMine(){
  const f=S.family, since=f.joined||"0000", days={};
  S.days.slice(-14).forEach(d=>{days[d.day]=f.share?{g:d.min<=S.budget,m:d.min}:{g:d.min<=S.budget}});
  const mine=S.days.filter(d=>d.day>=since), good=mine.filter(d=>d.min<=S.budget).length;
  const saved=Math.round(mine.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0));   // Minuten weniger als der bisherige Schnitt
  const o={name:netName(),avatar:netAv(),joined:since,share:!!f.share,days,good,saved,streak:S.budgetStreak,updated:Date.now()};
  if(f.look) o.look=f.look;
  return o;
}
/* Doppelte Einträge derselben Person (z. B. nach Backup oder Gerätewechsel) nur einmal zeigen */
function famDedupe(members){
  const seen={};
  members.slice().sort((a,b)=>(b.updated||0)-(a.updated||0)).forEach(m=>{const k=(m.name||"")+"|"+(m.avatar||"");if(!seen[k]||m.id===S.family.mid&&seen[k].id!==S.family.mid)seen[k]=m});
  return members.filter(m=>Object.values(seen).includes(m));
}
async function famSync(){
  const f=S.family; if(!f||!netConfigured()) return null;
  try{
    const N=await netInit(), path=()=>"families/"+f.id+"/members/"+f.mid, mine=()=>Object.assign({owner:N.uid},famMine());
    // Regeln ohne Feld "saved" (noch nicht neu veröffentlicht): ohne speichern
    const put=async()=>{try{await N.set(path(),mine())}catch(e){const m=mine();if(!("saved" in m)&&!(m.look&&"acc" in m.look))throw e;
      delete m.saved; if(m.look){m.look=Object.assign({},m.look);delete m.look.acc;delete m.look.accC} await N.set(path(),m)}};
    try{await put()}catch(e){
      // Gerät hat eine neue Online-Kennung (Backup, anderes Gerät, Browserdaten gelöscht): neu anmelden
      const fam=await N.get("families/"+f.id);
      if(!fam){FAMC={at:Date.now(),gone:true};return "gone"}
      await N.set("families/"+f.id+"/uids/"+N.uid,{at:Date.now()}).catch(()=>{});
      try{await put()}catch(e2){f.mid=rid();save();await put()}
    }
    const members=famDedupe(await N.list("families/"+f.id+"/members"));
    FAMC={at:Date.now(),members};
    return members;
  }catch(e){console.warn("Familieninsel:",e);return null}
}
function famStats(members){
  const wk=isoWeek(today()), td=today();
  let week=0,total=0,todayGood=0,todayIn=0,saved=0;
  members.forEach(m=>{total+=m.good||0;saved+=m.saved||0;const d=m.days||{};
    Object.keys(d).forEach(k=>{if(isoWeek(k)===wk&&d[k].g)week++});
    if(d[td]){todayIn++;if(d[td].g)todayGood++}});
  const target=Math.max(4,members.length*4);
  return {wk,week,total,todayGood,todayIn,target,saved};
}
function famScene(members,total,party){
  const built=FAM_PROJECTS.filter(p=>total>=p.need);
  const pos={feuer:[180,138,.9],bank:[118,150,.9],garten:[248,152,.9],baumhaus:[92,146,.75],floss:[300,180,.7],laternen:[210,146,.9],festzelt:[268,140,.65]};
  let s=`<svg viewBox="0 0 360 200" aria-hidden="true"><rect width="360" height="200" fill="#86BFE6"/><circle cx="310" cy="36" r="14" fill="#FFE7A3"/>
    <rect y="150" width="360" height="50" fill="#3A6FA8"/><ellipse cx="180" cy="160" rx="150" ry="28" fill="#E9D7A6"/><path d="M60 152c14-44 70-62 120-62s106 18 120 62z" fill="#7FC57A"/>
    <rect x="58" y="112" width="6" height="26" rx="2" fill="#8A5A3B"/><circle cx="61" cy="106" r="14" fill="#4E9A58"/><rect x="292" y="114" width="6" height="24" rx="2" fill="#8A5A3B"/><circle cx="295" cy="108" r="13" fill="#4E9A58"/>`;
  built.slice().sort((a,b)=>pos[a.id][1]-pos[b.id][1]).forEach(p=>{const q=pos[p.id];const svg=["baumhaus","floss","festzelt"].includes(p.id)?projectSvg(p.id):itemSvg(p.id);s+=`<g transform="translate(${q[0]} ${q[1]}) scale(${q[2]})">${svg}</g>`});
  const n=Math.max(1,members.length), step=Math.min(34,200/n);
  members.slice(0,12).forEach((m,i)=>{const x=180-(n-1)*step/2+i*step, y=170+(i%2)*5;
    s+=`<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${i*.3}s">${figure({kind:"mensch",name:m.name,id:m.id||m.name,look:m.look||null},0,0)}</g>
      <text y="9" text-anchor="middle" font-size="6.5" font-weight="700" fill="#14151F" font-family="Manrope, sans-serif">${esc((m.name||"").slice(0,10))}</text></g>`});
  if(party) s+=hearts(180,90)+confetti();
  return s+"</svg>";
}
/* „Deine Familie“: näher an die Figuren heran, mit Steckbrief pro Person */
function famZoomSheet(members){
  const ms=members.slice(0,12), n=Math.max(1,ms.length), step=Math.min(34,200/n);
  const x0=180-(n-1)*step/2-24, w=(n-1)*step+48, h=Math.max(52,w*0.45), vb=`${x0} ${186-h} ${w} ${h}`;
  const big=famScene(ms,0,false).replace('viewBox="0 0 360 200"',`viewBox="${vb}"`);
  sheet(`<p class="label" style="color:var(--lime)">Familieninsel</p><h2>Deine Familie</h2>
    <div class="anim fam-big" style="border-radius:18px;overflow:hidden">${big}</div>
    <div class="fam-people">${ms.map(m=>{const d=(m.days||{})[today()], me=m.id===S.family.mid;
      return `<div class="fam-person${me?" me":""}"><svg width="64" height="70" viewBox="-13 -25 26 28" aria-hidden="true">${figure({kind:"mensch",name:m.name,id:m.id||m.name,look:m.look||null},0,0)}</svg>
        <div class="grow"><p><b>${esc(m.name||"?")}</b>${me?' <span class="small muted">(du)</span>':""}</p>
        <p class="small ${d&&d.g?"":"muted"}" style="${d&&d.g?"color:var(--lime);font-weight:700":""}">${d?(d.g?"heute im Budget":"heute drüber"):"heute noch offen"}${d&&d.m!=null?" · "+hm(d.m):""}</p>
        <p class="small muted">${m.good||0} gute ${m.good===1?"Tag":"Tage"} · ${m.saved!=null?hm(m.saved)+" gespart":"–"}</p></div></div>`}).join("")}</div>
    <button class="btn" data-ok>Schließen</button>`);
}
function famCard(){
  if(!netConfigured()) return "";
  if(!S.family) return `<div class="card"><p class="label">Familieninsel</p>
    <p class="muted">Spielt als Familie zusammen: Jede:r behält die eigene Insel, und eure gemeinsame Familieninsel wächst mit den guten Tagen aller.</p>
    <button class="btn" id="famNew">Familieninsel gründen</button>
    <div class="row"><input id="famCodeIn" type="text" maxlength="7" autocomplete="off" autocapitalize="characters" placeholder="Familien-Code" aria-label="Familien-Code" value="${famInvite()||""}" style="text-transform:uppercase;letter-spacing:.12em"><button class="btn secondary" id="famJoinBtn" style="width:auto;padding:0 18px;height:52px">Beitreten</button></div>
    <p class="err" id="famErr" role="alert"></p></div>`;
  return `<div class="card" id="famBox"><p class="label" style="color:var(--lime)">Familieninsel</p><h2>${esc(S.family.name)}</h2><p class="muted">Lade …</p></div>`;
}
async function fillFamily(){
  const box=$("#famBox"); if(!box||!S.family) return;
  let members=FAMC&&FAMC.members&&Date.now()-FAMC.at<60000?FAMC.members:await famSync();
  if(!$("#famBox")||tab!=="freunde") return;
  if(members==="gone"){$("#famBox").innerHTML=`<p class="label">Familieninsel</p><h2>${esc(S.family.name)}</h2><p class="muted">Diese Familieninsel gibt es nicht mehr. Du kannst eine neue gründen oder einer anderen beitreten.</p><button class="btn secondary" id="famGone">Verlassen</button>`;
    $("#famGone").onclick=async()=>{await famLeave();render()};return}
  if(!members){$("#famBox").innerHTML=`<p class="label">Familieninsel</p><h2>${esc(S.family.name)}</h2><p class="err">Keine Verbindung. Prüf dein Internet und versuch es noch mal.</p><button class="btn secondary" id="famRetry">Noch mal versuchen</button><button class="btn ghost" id="famQuit">Familieninsel verlassen</button>`;
    $("#famQuit").onclick=famLeaveSheet;
    $("#famRetry").onclick=()=>{FAMC=null;$("#famBox").innerHTML=`<p class="label">Familieninsel</p><h2>${esc(S.family.name)}</h2><p class="muted">Lade …</p>`;fillFamily()};return}
  const st=famStats(members), next=FAM_PROJECTS.find(p=>st.total<p.need);
  members.sort((a,b)=>(b.saved||0)-(a.saved||0)||(b.good||0)-(a.good||0));
  const ring=(n,t)=>{const r=15,c=2*Math.PI*r,f=t?n/t:0;return `<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="${r}" fill="none" stroke="var(--card2)" stroke-width="5"/><circle cx="20" cy="20" r="${r}" fill="none" stroke="var(--lime)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c*f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 20 20)"/></svg>`};
  $("#famBox").innerHTML=`<div class="row between"><div><p class="label" style="color:var(--lime)">Familieninsel</p><h2>${esc(S.family.name)}</h2></div><span class="chip" style="color:var(--ink);background:var(--card2)" title="Familien-Code">Code <b class="num" style="letter-spacing:.08em">${S.family.code}</b></span></div>
    <button type="button" class="anim fam-zoom" id="famZoom" aria-label="Deine Familie näher ansehen" style="border-radius:18px;overflow:hidden">${famScene(members,st.total,st.todayIn>0&&st.todayGood===members.length)}<span class="fam-zoom-hint">🔍 Deine Familie</span></button>
    <div class="fam-stats">
      <div class="fam-stat">${ring(st.todayGood,members.length)}<div><b class="num">${st.todayGood}/${members.length}</b><span class="small muted">heute im Budget</span></div></div>
      <div class="fam-stat"><div><b class="num" style="color:var(--lime)">${hm(st.saved)}</b><span class="small muted">gemeinsam gespart</span></div></div>
    </div>
    <div class="fam-sec"><div class="row between"><p class="label">Familienprojekt</p><span class="small muted num">${st.total} gute Tage</span></div>
      ${next?`<p><b>${esc(next.n)}</b> <span class="small muted">bei ${next.need} guten Tagen</span></p><div class="bar"><i style="width:${Math.min(100,st.total/next.need*100)}%"></i></div><p class="small muted">Noch ${next.need-st.total} ${next.need-st.total===1?"guter Tag":"gute Tage"} zusammen</p>`
        :`<p><b>Alle Familienprojekte sind gebaut!</b></p>`}</div>
    <div class="fam-sec"><p class="label">Mitglieder</p>
      ${members.map(m=>{const d=(m.days||{})[today()], me=m.id===S.family.mid;
        const chip=d?(d.g?`<span class="chip good">im Budget</span>`:`<span class="chip bad">drüber</span>`):`<span class="chip gone">offen</span>`;
        return `<div class="fam-row${me?" me":""}"><svg width="34" height="38" viewBox="-13 -25 26 28" aria-hidden="true">${figure({kind:"mensch",name:m.name,id:m.id||m.name,look:m.look||null},0,0)}</svg>
          <div class="grow" style="min-width:0"><p class="fam-name"><b>${esc(m.name||"?")}</b>${me?' <span class="small muted">(du)</span>':""}</p><p class="small muted">${m.good||0} gute ${m.good===1?"Tag":"Tage"} · ${m.saved!=null?hm(m.saved)+" gespart":"–"}</p></div>${chip}</div>`}).join("")}</div>
    <div class="row"><button class="btn secondary grow" id="famLook">Meine Figur</button><button class="btn secondary grow" id="famInvite">Einladen</button></div>
    <button class="btn ghost" id="famQuit">Familieninsel verlassen</button>`;
  const fl=$("#famLook"); if(fl) fl.onclick=famLookSheet;
  const fz=$("#famZoom"); if(fz) fz.onclick=()=>famZoomSheet(members);
  const fq=$("#famQuit"); if(fq) fq.onclick=famLeaveSheet;
  const fi=$("#famInvite"); if(fi) fi.onclick=()=>shareText("Komm auf unsere Familieninsel „"+S.family.name+"“ in OffLand! Code: "+S.family.code,APP_URL+"?familie="+S.family.code);
}
function famConsent(title,after){
  modal(`<p class="label" style="color:var(--lime)">Familieninsel</p><h2>${esc(title)}</h2>
    <p class="muted">Deine Familie sieht deinen Namen „${esc(netName())}“, deinen Avatar, wie viel Zeit du insgesamt gespart hast und an welchen Tagen du im Budget warst.</p>
    <label class="check" for="fcShare"><input type="checkbox" id="fcShare"> Auch meine Minuten zeigen</label>
    <p class="small muted">Deine eigene Insel bleibt unverändert. Verlassen kannst du die Familieninsel jederzeit, im Tab Freunde oder in den Einstellungen.</p>
    <p class="err" id="fcErr" role="alert"></p>
    <button class="btn" id="fcYes">Los geht's</button><button class="btn ghost" id="fcNo">Abbrechen</button>`);
  $("#fcNo").onclick=()=>{closeModal();render()};
  $("#fcYes").onclick=async()=>{const b=$("#fcYes");b.disabled=true;b.textContent="Verbinde …";
    const e=await after($("#fcShare").checked); if(e){b.disabled=false;b.textContent="Los geht's";return $("#fcErr").textContent=e}
    closeModal();FAMC=null;tab="freunde";render();window.scrollTo(0,0);sfx("project")};
}
function famCreateSheet(){
  modal(`<p class="label" style="color:var(--lime)">Familieninsel</p><h2>Familieninsel gründen</h2>
    <label class="field" for="fnName">Name eurer Insel<input id="fnName" type="text" maxlength="30" placeholder="z. B. Familie Sonnenschein"></label>
    <p class="err" id="fnErr" role="alert"></p><button class="btn" id="fnGo">Weiter</button><button class="btn ghost" id="fnNo">Abbrechen</button>`);
  $("#fnNo").onclick=closeModal;
  $("#fnGo").onclick=()=>{const name=$("#fnName").value.trim().slice(0,30); if(name.length<2) return $("#fnErr").textContent="Gib eurer Insel einen Namen.";
    famConsent("„"+name+"“ gründen",async share=>{
      try{const N=await netInit(), fid=rid();
        let code=null; for(let i=0;i<5&&!code;i++){const c=Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>CODE_ABC[x%32]).join(""); if(!(await N.get("famcodes/"+c).catch(()=>null))) code=c}
        if(!code) return "Bitte versuch es noch mal.";
        await N.set("families/"+fid,{name,code,at:Date.now(),owner:N.uid});
        await N.set("famcodes/"+code,{fam:fid,owner:N.uid});
        return await famJoinId(fid,name,code,share);
      }catch(e){return "Keine Verbindung. Versuch es später noch mal."}
    });
  };
}
/* Eigene Figur auf der Familieninsel: Haut, Frisur, Haare, Shirt */
function famLookSheet(){
  const f=S.family; if(!f) return;
  const me={kind:"mensch",name:netName(),id:f.mid,look:f.look||null}, draft=Object.assign({},lookIdx(me));
  modal(`<p class="label" style="color:var(--lime)">Familieninsel</p><h2>Deine Figur</h2>
    <p class="small muted">So sieht dich deine Familie auf der gemeinsamen Insel.</p>
    ${lookEditor(me,draft)}
    <div class="row"><button class="btn secondary grow" id="flNo">Abbrechen</button><button class="btn grow" id="flOk">Speichern</button></div>`);
  bindLookEditor(me,draft);
  $("#flNo").onclick=()=>{closeModal();render()};
  $("#flOk").onclick=async()=>{f.look={skin:draft.skin,hair:draft.hair,style:draft.style,shirt:draft.shirt,acc:accList(draft.acc),accC:draft.accC||0};save();
    const b=$("#flOk");b.disabled=true;b.textContent="Speichere …";await famSync();closeModal();render();toast("Figur gespeichert")};
}
async function famJoinId(fid,name,code,share){
  const N=await netInit(), mid=rid(); stat("familie");
  await N.set("families/"+fid+"/uids/"+N.uid,{at:Date.now()});
  S.family={id:fid,name,code,mid,share:!!share,joined:today(),claimed:{}};
  await N.set("families/"+fid+"/members/"+mid,Object.assign({owner:N.uid},famMine()));
  try{localStorage.removeItem(FAMINV_KEY)}catch(e){}
  log("Du bist jetzt auf der Familieninsel „"+name+"“.","good"); save();
  return null;
}
async function famJoinSheet(code){
  if(S.family) return toast("Du bist schon auf einer Familieninsel.");
  let fam=null, name="";
  try{const N=await netInit(); const c=await N.get("famcodes/"+code); if(c){fam=c.fam; const f=await N.get("families/"+fam); name=f&&f.name}}catch(e){return toast("Keine Verbindung. Versuch es später noch mal.")}
  if(!fam||!name){try{localStorage.removeItem(FAMINV_KEY)}catch(e){} const fe=$("#famErr"); if(fe) fe.textContent="Diesen Familien-Code gibt es nicht."; else toast("Diesen Familien-Code gibt es nicht."); return}
  const others=await (async()=>{try{const N=await netInit();return (await N.list("families/"+fam+"/members")).length}catch(e){return 0}})();
  if(others>=12) return toast("Diese Familieninsel ist voll (12 Personen).");
  famConsent("„"+name+"“ beitreten",async share=>{try{return await famJoinId(fam,name,code,share)}catch(e){return "Keine Verbindung. Versuch es später noch mal."}});
}
function famLeaveSheet(){
  const f=S.family; if(!f) return;
  sheet(`<p class="label" style="color:var(--lime)">Familieninsel</p><h2>„${esc(f.name)}“ verlassen?</h2>
    <p class="muted">Deine eigene Insel bleibt, wie sie ist. Du verschwindest von der Familieninsel, deine Familie sieht deine Tage nicht mehr. Mit dem Familien-Code <b class="num" style="color:var(--ink)">${esc(f.code||"")}</b> kannst du später wieder beitreten.</p>
    <button class="btn" id="flStay">Bleiben</button><button class="btn ghost" id="flGo">Verlassen</button>`);
  $("#flStay").onclick=()=>{closeModal();render()};
  $("#flGo").onclick=async()=>{const b=$("#flGo");b.disabled=true;b.textContent="Verlasse …";await famLeave();closeModal();render();toast("Familieninsel verlassen")};
}
async function famLeave(){
  const f=S.family; if(!f) return;
  try{const N=await netInit();
    await N.del("families/"+f.id+"/members/"+f.mid).catch(()=>{});
    const sameDevice=profiles().some(p=>p.id!==(ACC&&ACC.id)&&(()=>{const st=peek(p.id);return st&&st.family&&st.family.id===f.id})());
    if(!sameDevice) await N.del("families/"+f.id+"/uids/"+N.uid).catch(()=>{});
  }catch(e){}
  S.family=null; FAMC=null; save();
}

/* ---------- Insel teilen: Story-Bild 1080 × 1920 ---------- */
/* Was man mit der gesparten Zeit hätte schaffen können: immer das größte passende Beispiel */
const WOW=[
  [12000,n=>n>1?n+"-mal den ganzen Jakobsweg zu laufen":"den kompletten Jakobsweg zu laufen"],
  [6000,n=>n>1?n+" neue Sprachen bis zum ersten Gespräch zu lernen":"eine neue Sprache bis zum ersten Gespräch zu lernen"],
  [4200,n=>n>1?n+"-mal alle Harry-Potter-Bände zu lesen":"alle sieben Harry-Potter-Bände zu lesen"],
  [2160,n=>n>1?n+"-mal zu Fuß über die Alpen zu wandern":"zu Fuß über die Alpen zu wandern"],
  [1800,()=>"Gitarre zu lernen, bis die ersten 10 Songs sitzen"],
  [270,n=>n>1?n+" Marathons zu laufen":"einen ganzen Marathon zu laufen"],
  [120,()=>"einen Halbmarathon zu laufen"],
  [60,n=>n>1?n*10+" Kilometer zu joggen":"10 Kilometer zu joggen"],
  [30,()=>"einen Kuchen zu backen"],
  [0,()=>"einen Spaziergang in den Sonnenuntergang zu machen"]
];
function wowText(min){
  const [m,f]=WOW.find(w=>min>=w[0]);
  const n=m?Math.min(Math.floor(min/m),m>=270?9:1):1;
  return "Genug Zeit, um "+f(n)+"!";
}
function wrapText(c,t,max){
  const out=[]; let line="";
  for(const w of t.split(" ")){const tr=line?line+" "+w:w; if(c.measureText(tr).width>max&&line){out.push(line);line=w}else line=tr}
  return out.concat(line?[line]:[]);
}
function hoursText(m){return m%60===0?(m/60)+" "+(m===60?"Stunde":"Stunden"):hm(m)}
function shareStat(){
  const good=S.days.filter(d=>d.min<=S.budget).length;
  if(S.budgetStreak>=3) return {big:S.budgetStreak+" Tage",small:"in Folge unter "+hoursText(S.budget)+" Screentime"};
  if(good) return {big:good+(good===1?" Tag":" Tage"),small:"unter "+hoursText(S.budget)+" Screentime"};
  return {big:"Meine Insel",small:"wächst, wenn ich das Handy weglege"};
}
async function islandImage(){
  const Wd=1080,Ht=1920, cv=document.createElement("canvas"); cv.width=Wd; cv.height=Ht;
  const c=cv.getContext("2d"), plus=plusActive(), st=shareStat();
  try{await document.fonts.ready}catch(e){}
  const g=c.createLinearGradient(0,0,0,Ht); g.addColorStop(0,"#1B2340"); g.addColorStop(1,"#14151F"); c.fillStyle=g; c.fillRect(0,0,Wd,Ht);
  // Ausschnitt ohne leeren Himmel: Inseln größer im Bild
  const svg=scene().replace('<svg viewBox="0 0 360 240"','<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="593" viewBox="18 48 324 192"');
  const img=new Image(); img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
  await img.decode();
  const x=40,y=660,w=1000,h=593,r=56;
  c.save(); c.beginPath(); c.roundRect(x,y,w,h,r); c.clip(); c.drawImage(img,x,y,w,h); c.restore();
  if(plus){c.lineWidth=10;c.strokeStyle="#FFD27A";c.beginPath();c.roundRect(x,y,w,h,r);c.stroke()}
  c.textAlign="center"; c.fillStyle="#F3F1EA";
  c.font="800 96px 'Bricolage Grotesque', sans-serif"; c.textAlign="left";
  const w1=c.measureText("Off").width, w2=c.measureText("Land").width, lx=(Wd-w1-w2)/2;
  c.fillText("Off",lx,190); c.fillStyle="#C8F169"; c.fillText("Land",lx+w1,190); c.textAlign="center";
  c.fillStyle="#A4A6BD"; c.font="500 40px Manrope, sans-serif"; c.fillText("Grow your world beyond the screen.",Wd/2,256);
  c.fillStyle="#C8F169"; c.font="800 150px 'Bricolage Grotesque', sans-serif"; c.fillText(st.big,Wd/2,450);
  c.fillStyle="#F3F1EA"; let fs=52; do{c.font="700 "+fs+"px Manrope, sans-serif"}while(c.measureText(st.small).width>990&&--fs>30); c.fillText(st.small,Wd/2,530);
  c.fillStyle="#F3F1EA"; c.font="700 46px Manrope, sans-serif";
  c.fillText(curWorld().name+" · "+here().length+" Bewohner · Glück "+S.glueck+" %",Wd/2,1340);
  const saved=savedTotal();
  c.fillStyle="#A4A6BD"; c.font="500 42px Manrope, sans-serif"; c.fillText(saved>0?hm(saved)+" Screentime gespart":"Jede Minute offline zählt",Wd/2,1410);
  c.fillStyle="#FFD27A"; c.font="800 54px 'Bricolage Grotesque', sans-serif";
  wrapText(c,wowText(saved),940).slice(0,2).forEach((l,i)=>c.fillText(l,Wd/2,1490+i*64));
  c.fillStyle="#26233D"; c.beginPath(); c.roundRect(140,1660,800,150,75); c.fill();
  c.fillStyle="#F3F1EA"; c.font="700 44px Manrope, sans-serif"; c.fillText("Spiel mit: Code "+myCode(),Wd/2,1730);
  c.fillStyle="#A4A6BD"; c.font="500 34px Manrope, sans-serif"; c.fillText(APP_URL.replace(/^https:\/\//,"").replace(/\/$/,""),Wd/2,1780);
  if(plus){c.fillStyle="#FFD27A"; c.font="800 36px Manrope, sans-serif"; c.fillText("★ PLUS",Wd/2,1880)}
  return await new Promise(res=>cv.toBlob(res,"image/png"));
}
let shareUrl=null;
async function shareSheet(){
  modal(`<p class="label" style="color:var(--lime)">Insel teilen</p><h2>Dein Inselbild</h2><p class="muted">Bild wird gemalt …</p>`);
  let blob=null; try{blob=await islandImage()}catch(e){}
  if(!blob){modal(`<h2>Das hat nicht geklappt</h2><p class="muted">Das Bild konnte nicht erstellt werden.</p><button class="btn" id="shOk">OK</button>`);$("#shOk").onclick=closeModal;return}
  if(shareUrl) URL.revokeObjectURL(shareUrl); shareUrl=URL.createObjectURL(blob);
  const file=new File([blob],"offland-insel.png",{type:"image/png"});
  const canFile=!!(navigator.canShare&&navigator.canShare({files:[file]}));
  modal(`<p class="label" style="color:var(--lime)">Insel teilen</p><h2>Dein Inselbild</h2>
    <img src="${shareUrl}" alt="Inselbild zum Teilen" style="width:62%;align-self:center;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.4)">
    <p class="small muted">Perfekt für deine Story. ${canFile?"":"Lang drücken, um das Bild zu sichern, oder herunterladen."}</p>
    ${canFile?`<button class="btn" id="shGo">Teilen</button>`:`<a class="btn" id="shDl" href="${shareUrl}" download="offland-insel.png" style="text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center">Bild herunterladen</a>`}
    <button class="btn ghost" id="shClose">Schließen</button>`);
  if(canFile) $("#shGo").onclick=async()=>{try{await navigator.share({files:[file],text:"Meine Insel in OffLand. Spiel mit: "+inviteLink()})}catch(e){}};
  $("#shClose").onclick=closeModal;
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
function avatarSvg(art,size){return `<span class="avatar" style="background:${AV_BG[art]||"#26233D"};width:${size}px;height:${size}px;border-radius:${size/2}px"><svg width="${Math.round(size*.8)}" height="${Math.round(size*.8)}" viewBox="${SEA.includes(art)?artVB(art,32/24):"-16 -22 32 24"}" aria-hidden="true">${animalSvg(art)}</svg></span>`}
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
  const st=lsGet(); S=migrate(st&&st.v===1?st:newGame()); tab="heute"; if(S.setup) checkDiscovery();
  document.body.classList.remove("start"); $("#start").innerHTML="";
  closeModal(); render(); window.scrollTo(0,0);
  if(S.setup){chapterCheck(true);save()}
  statsActive(); statsFlushSoon();
  if(!S.storySeen) storySheet(!!S.setup); else showPending();
  if(S.setup&&pendingInvite()&&!$("#modalRoot").innerHTML) inviteSheet();
  if(S.setup&&famInvite()&&!S.family&&!$("#modalRoot").innerHTML) famJoinSheet(famInvite());
  if(S.family) setTimeout(famSync,1200);
  if(netOn()) netSync().then(()=>{if(tab==="heute"&&!$("#modalRoot").innerHTML)render()});
  setTimeout(()=>checkReplies(false),1500);
}
function logout(){
  if(ACC) lsSet();
  ACC=null; LS=null; S=migrate(newGame());
  try{sessionStorage.removeItem(SESSION_KEY)}catch(e){}
  showStart();
}
function tryLogin(p){p.pin?pinPrompt(p,()=>login(p)):login(p)}

/* Startbild: Mr. Bay winkt, Lucifer schwingt den Schwanz, beide unterhalten sich */
function startHero(){
  const col=["#FF9C7A","#FFD27A","#C8F169","#B6A4FF","#5BC0A8"];
  let lights=`<path d="M150 92q55 22 110 4" stroke="#5A3A2A" stroke-width=".8" fill="none"/>`;
  for(let i=1;i<10;i++){const t=i/10,x=150+110*t,y=(1-t)*(1-t)*92+2*t*(1-t)*114+t*t*96;lights+=`<circle class="glow" style="animation-delay:${(i*.31)%2}s" cx="${x}" cy="${y+1.6}" r="1.8" fill="${col[i%5]}"/>`}
  return `<svg viewBox="0 0 360 200" aria-hidden="true"><rect width="360" height="200" fill="#1B2340"/>
    <g fill="#F3F1EA">${[[30,24,1.6],[90,50,1.1],[150,18,1.5],[205,40,1.2],[330,30,1.4],[300,64,1],[60,80,1]].map(([x,y,r],i)=>`<circle class="glow" style="animation-delay:${i*.4}s" cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
    <circle cx="306" cy="38" r="13" fill="#FFE7A3"/><circle cx="312" cy="34" r="12" fill="#1B2340"/>
    <rect y="140" width="360" height="60" fill="#24375A"/><path d="M20 168h40M250 186h50M90 192h40" stroke="#3A5683" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="200" cy="148" rx="150" ry="18" fill="#E9D7A6"/><path d="M70 146c14-40 76-58 130-58s116 18 130 58z" fill="#7FC57A"/>
    <path d="M276 132v-24l18-14 18 14v24z" fill="#F3F1EA"/><path d="M272 110l22-17 22 17" fill="none" stroke="#FF9C7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="288" y="116" width="10" height="16" rx="2" fill="#B6A4FF"/>
    ${lights}
    <g transform="translate(180 150) scale(3)"><g class="bob">${baySvg(true)}</g></g>
    <g transform="translate(232 152) scale(2.5)"><g class="bob" style="animation-delay:.6s;animation-duration:3.4s">${lucSvg(true)}</g></g>
  </svg>`;
}
let START_TALK=null;
function startTalk(name){
  clearInterval(START_TALK);
  // Die beiden schicken dich eher raus, als dass sie dich festhalten: kurz eintragen, Handy weg
  const lines=name?[["bay","Hallo "+name+"! Kurz eintragen, dann Handy weg. So mögen wir das."],["luc","Mach's kurz. Draußen passiert mehr als hier."],["bay","Die Insel wächst, wenn du nicht hier bist. Klingt komisch, ist aber so."],["luc","Ich zähl mit, wie lange du bleibst. Je kürzer, desto stolzer bin ich."]]
    :[["bay","Willkommen auf OffLand! Ich bin Mr. Bay, der Bürgermeister."],["luc","Und ich bin Lucifer. Ich war zuerst hier."],["bay","Hier gewinnst du, wenn du weniger am Handy bist. Auch weniger hier."],["luc","Einmal am Abend vorbeischauen reicht. Den Rest des Tages verschlaf ich eh."],["bay","Den Rest macht das echte Leben. Wir freuen uns nur mit."],["luc","Ich mag Leute, die schnell wieder gehen. Nimm's nicht persönlich."]];
  let i=0;
  const show=()=>{const b=$("#startBub"); if(!b){clearInterval(START_TALK);return}
    const [who,t]=lines[i++%lines.length];
    b.className="start-bub "+who; b.innerHTML=`<b>${who==="bay"?"Mr. Bay":"Lucifer"}</b>${esc(t)}`;
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    if(typeof AC!=="undefined"&&AC&&AC.state==="running") speak([[who,t]])};
  show(); START_TALK=setInterval(show,3800);
}
function showStart(){
  document.body.classList.add("start"); closeModal(); window.scrollTo(0,0); renderFocus();
  const list=profiles().sort((a,b)=>(b.last||0)-(a.last||0));
  const hero=startHero();
  const chev=`<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;
  const lock=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A4A6BD" stroke-width="2" stroke-linecap="round" aria-label="mit PIN"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  const st=$("#start"); st.classList.toggle("sky",!!list.length);
  if(list.length) st.innerHTML=`<div class="start-sky">
    <div class="sky-top"><h1 class="start-title">Off<span>Land</span></h1><p class="tagline">Grow your world beyond the screen.</p></div>
    <div class="sky-band"><div class="start-hero sky-hero">${hero}<div class="start-bub" id="startBub" aria-live="polite"></div></div></div>
    <div class="sky-bottom"><div class="sky-inner">
      <div class="card sky-pick"><p class="label">Wer spielt?</p>${list.map(p=>{const st=peek(p.id);const info=st&&st.setup?`${st.dayCount} ${st.dayCount===1?"Tag":"Tage"} · Glück ${st.glueck} %`:"Insel noch nicht gestartet";
        return `<button class="profile" data-login="${p.id}">${avatarSvg(p.avatar,48)}<span class="grow"><b>${esc(p.name)}</b><span class="small muted">${info}</span></span>${p.pin?lock:""}${chev}</button>`}).join("")}</div>
      <button class="btn secondary" id="newAcc">+ Neue Insel</button>
      ${netConfigured()?`<button class="btn ghost" id="restoreBtn">Insel aus Backup holen</button>`:""}
      <p class="small muted" style="text-align:center">Alle Daten bleiben auf diesem Gerät, außer du schaltest Online-Funktionen oder die anonyme Statistik ein.</p>
    </div></div></div>`;
  else st.innerHTML=`<div class="start-wrap">
    <div class="start-hero">${hero}<div class="start-bub" id="startBub" aria-live="polite"></div></div>
    <div style="display:flex;flex-direction:column;gap:6px"><h1 class="start-title">Off<span>Land</span></h1><p class="tagline">Grow your world beyond the screen.</p><p class="muted">Je weniger Bildschirmzeit, desto glücklicher werden deine Bewohner und gemeinsam bringt ihr die Insel zum Blühen.</p></div>
    ${list.length?`<div class="card"><p class="label">Wer spielt?</p>${list.map(p=>{const st=peek(p.id);const info=st&&st.setup?`${st.dayCount} ${st.dayCount===1?"Tag":"Tage"} · Glück ${st.glueck} %`:"Insel noch nicht gestartet";
        return `<button class="profile" data-login="${p.id}">${avatarSvg(p.avatar,48)}<span class="grow"><b>${esc(p.name)}</b><span class="small muted">${info}</span></span>${p.pin?lock:""}${chev}</button>`}).join("")}</div>
      <button class="btn secondary" id="newAcc">Neues Konto anlegen</button>`
    :`<div class="card"><p class="label">So funktioniert's</p><ul class="steps"><li>Trag abends deine Bildschirmzeit ein.</li><li>Bleibst du im Budget, wird deine Insel glücklicher und wächst.</li><li>Zu viel Handy bringt Wolken, Streit und App-Monster.</li></ul></div>
      <button class="btn" id="newAcc">Konto anlegen</button>`}
    ${netConfigured()?`<button class="btn ghost" id="restoreBtn">Insel aus Backup holen</button>`:""}
    <p class="small muted" style="text-align:center">Alle Daten bleiben auf diesem Gerät, außer du schaltest Online-Funktionen oder die anonyme Statistik ein.</p>
  </div>`;
  document.querySelectorAll("[data-login]").forEach(b=>b.onclick=()=>{const p=profiles().find(x=>x.id===b.dataset.login);if(p)tryLogin(p)});
  $("#newAcc").onclick=showCreate;
  startTalk(list.length?list[0].name:null);
  const rb=$("#restoreBtn"); if(rb) rb.onclick=restoreSheet;
}

function accFields(p){
  return `<label class="field" for="accName">Name<input id="accName" type="text" maxlength="20" autocomplete="nickname" value="${p?esc(p.name):""}" placeholder="z. B. Mia"></label>
  <div class="field"><span>Avatar</span><div class="av-grid" role="radiogroup" aria-label="Avatar">${AVATARS.map((a,i)=>`<label class="av-opt"><input type="radio" name="accAv" value="${a}" ${(p?p.avatar===a:i===0)?"checked":""}><span>${avatarSvg(a,48)}</span><span class="sr">${a}</span></label>`).join("")}</div></div>`;
}
const readAcc=()=>({name:$("#accName").value.trim().slice(0,20),avatar:(document.querySelector("[name=accAv]:checked")||{}).value||AVATARS[0]});

function showCreate(){
  const first=!profiles().length; $("#start").classList.remove("sky");
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
    login(p); toast("Willkommen, "+name+"!"); stat("konto_neu");
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
    ${plusActive()?`<p class="small" style="color:var(--amber);font-weight:700">★ OffLand Plus bis ${nice(S.plus.until)}</p>`:""}
    <button class="btn secondary" id="accSettings">⚙︎ Einstellungen</button>
    <button class="btn secondary" id="accSupport">Hilfe und Support</button>
    <div class="row"><button class="btn secondary grow" id="accShare">Insel teilen</button><button class="btn secondary grow" id="accFriends">Freunde einladen</button></div>
    <button class="btn secondary" id="accEdit">Name und Avatar ändern</button>
    <button class="btn secondary" id="accPinBtn">${ACC.pin?"PIN ändern oder entfernen":"PIN festlegen"}</button>
    <button class="btn secondary" id="accOut">Abmelden und Konto wechseln</button>
    <button class="btn ghost danger" id="accDel">Konto löschen</button>
    <button class="btn" id="accClose">Schließen</button>`);
  $("#accSettings").onclick=settingsSheet; $("#accSupport").onclick=supportSheet; $("#accShare").onclick=shareSheet; $("#accFriends").onclick=friendsSheet; $("#accEdit").onclick=editSheet; $("#accPinBtn").onclick=pinSheet;
  $("#accOut").onclick=()=>{toast("Abgemeldet");logout()};
  $("#accDel").onclick=deleteSheet; $("#accClose").onclick=closeModal;
  $("#accClose").focus();
}
function settingsSheet(){
  if(ST&&!stInfo){stStatus().then(settingsSheet);return}
  modal(`<div class="row between"><div><p class="label">Konto · ${esc(ACC?ACC.name:"")}</p><h2>Einstellungen</h2></div><button class="iconbtn" id="setClose" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F3F1EA" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    ${settingsHtml()}
    <button class="btn secondary" id="setBack">Zurück zum Konto</button>
    <button class="btn" id="setDone">Fertig</button>`);
  bind();
  const done=()=>{closeModal();render();showPending()};
  $("#setClose").onclick=done; $("#setDone").onclick=done;
  let vt=0; const vl=$("#verLine"); if(vl) vl.onclick=()=>{if(++vt<7)return; vt=0; const on=localStorage.getItem("offland-dev")!=="1";
    try{on?localStorage.setItem("offland-dev","1"):localStorage.removeItem("offland-dev")}catch(e){}
    if(!on&&S.testmode){S.testmode=false;save()} toast(on?"Entwicklermodus an: Testmodus im Tab Heute":"Entwicklermodus aus"); settingsSheet()}; $("#setBack").onclick=()=>{render();accountSheet()};
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
    if(S.online&&S.online.pid){yes.disabled=true;yes.textContent="Lösche …";await netDeleteAll()}
    if(S.backup&&S.backup.on){yes.disabled=true;yes.textContent="Lösche …";await backupDelete()}
    if(S.family){yes.disabled=true;yes.textContent="Lösche …";await famLeave()}
    try{localStorage.removeItem(profKey(id))}catch(e){}
    storeProfiles(profiles().filter(x=>x.id!==id));
    ACC=null; LS=null; logout(); toast("Konto gelöscht");
  };
}

$("#accBtn").onclick=accountSheet;
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&ACC&&S.setup)checkReplies(false); if(document.hidden&&ACC&&S.setup)backupNow(false)});

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
