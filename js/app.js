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
  {id:"a_eisskulptur",world:"alaska",n:"Eisskulptur",cost:260,cat:"deko",fx:"Ein Eisbär aus Eis."},
  /* mehr Auswahl auf den neuen Inseln */
  {id:"t_bar",world:"tropen",like:"bank",n:"Strandbar",cost:180,cat:"nutzen",fx:"Bewohner verstehen sich jeden Tag ein bisschen besser."},
  {id:"t_papagei",world:"tropen",like:"vogelhaus",n:"Papageienstange",cost:200,cat:"nutzen",fx:"Zugvögel kommen doppelt so oft vorbei."},
  {id:"t_muschelweg",world:"tropen",n:"Muschelpfad",cost:140,cat:"deko",fx:"Knirscht leise unter den Füßen."},
  {id:"t_steg",world:"tropen",n:"Bambussteg",cost:240,cat:"deko",fx:"Bis ganz vorne ans türkise Wasser."},
  {id:"t_nest",world:"tropen",n:"Schildkrötennest",cost:220,cat:"deko",fx:"Bald schlüpfen hier die Kleinen."},
  {id:"t_lagune",world:"tropen",n:"Lagunenbecken",cost:340,cat:"deko",fx:"Warmes Wasser zum Füßebaumeln."},
  {id:"f_bank",world:"fjord",like:"bank",n:"Holzbank am Fjord",cost:220,cat:"nutzen",fx:"Bewohner verstehen sich jeden Tag ein bisschen besser."},
  {id:"f_sauna",world:"fjord",like:"picknick",n:"Sauna",cost:300,cat:"nutzen",fx:"Freundschaften wachsen noch schneller."},
  {id:"f_nistkasten",world:"fjord",like:"vogelhaus",n:"Nistkasten",cost:200,cat:"nutzen",fx:"Zugvögel kommen doppelt so oft vorbei."},
  {id:"f_heide",world:"fjord",like:"blumen",n:"Heidekraut",cost:300,cat:"nutzen",fx:"+1 % Glück an jedem guten Tag."},
  {id:"f_troll",world:"fjord",n:"Kleiner Troll",cost:140,cat:"deko",fx:"Guckt freundlich, meistens."},
  {id:"f_boot",world:"fjord",n:"Wikingerboot",cost:280,cat:"deko",fx:"Ein kleines Modell mit rot-weißem Segel."},
  {id:"o_kissen",world:"oase",like:"bank",n:"Kissenrunde",cost:240,cat:"nutzen",fx:"Bewohner verstehen sich jeden Tag ein bisschen besser."},
  {id:"o_taube",world:"oase",like:"vogelhaus",n:"Taubenturm",cost:260,cat:"nutzen",fx:"Zugvögel kommen doppelt so oft vorbei."},
  {id:"o_blumen",world:"oase",like:"blumen",n:"Wüstenblumen",cost:340,cat:"nutzen",fx:"+1 % Glück an jedem guten Tag."},
  {id:"o_spiel",world:"oase",like:"spielplatz",n:"Sandspielplatz",cost:560,cat:"nutzen",fx:"Familien bekommen öfter Nachwuchs."},
  {id:"o_sterne",world:"oase",like:"sternwarte",n:"Sternenzelt",cost:600,cat:"nutzen",fx:"Polarlichter bleiben einen Tag länger."},
  {id:"o_mosaik",world:"oase",n:"Mosaikbrunnen",cost:300,cat:"deko",fx:"Blaue Kacheln, plätscherndes Wasser."},
  {id:"o_sanduhr",world:"oase",n:"Große Sanduhr",cost:180,cat:"deko",fx:"Erinnert daran, wie schnell Zeit vergeht."},
  {id:"a_fellbank",world:"alaska",like:"bank",n:"Fellbank",cost:280,cat:"nutzen",fx:"Bewohner verstehen sich jeden Tag ein bisschen besser."},
  {id:"a_futterhaus",world:"alaska",like:"vogelhaus",n:"Futterhaus",cost:280,cat:"nutzen",fx:"Zugvögel kommen doppelt so oft vorbei."},
  {id:"a_rodel",world:"alaska",like:"schaukel",n:"Rodelhang",cost:380,cat:"nutzen",fx:"+1 % Glück an guten Tagen, wenn Kinder auf der Insel sind."},
  {id:"a_nordlicht",world:"alaska",like:"sternwarte",n:"Nordlichthütte",cost:640,cat:"nutzen",fx:"Polarlichter bleiben einen Tag länger."},
  {id:"a_iglu",world:"alaska",n:"Iglu",cost:360,cat:"deko",fx:"Drinnen ist es erstaunlich gemütlich."},
  {id:"a_robben",world:"alaska",n:"Robbenfelsen",cost:300,cat:"deko",fx:"Zwei Robben dösen in der Sonne."}
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
function itemHome(id){if(S.moved&&S.moved[id]) return S.moved[id]; const d=itemDef(id); if(d&&d.world) return d.world; if(d&&SHOP.includes(d)) return "heimat"; return (S.itemW&&S.itemW[id])||"heimat"}
const curWorldId=()=>(typeof WORLDS!=="undefined"?WORLDS[S.world||0].id:"heimat");
const hereItems=()=>S.items.filter(id=>itemHome(id)===curWorldId());
const shopHere=it=>it.cat==="vorrat"||(it.world||"heimat")===curWorldId();
const owns=id=>hereItems().some(x=>x===id||(itemDef(x)||{}).like===id);
const adults=()=>here().filter(r=>r.kind==="mensch"&&r.job);
const jobOn=id=>adults().some(r=>r.job===id&&!r.retired&&!r.sick);
const jobName=id=>(JOBS.find(j=>j.id===id)||{}).n||"";
const traitName=id=>(TRAITS.find(t=>t.id===id)||{}).n||"";
const worldPrice=it=>{if(!it||it.consumable||!it.world) return 1; const i=WORLDS.findIndex(w=>w.id===it.world); return 1+.1*Math.max(0,i)};   // Tropen ×1,1 … Eis ×1,4
const price=it=>Math.round(it.cost*worldPrice(it)*(jobOn("tischler")?0.9:1)*(has("o_markt")?0.9:1)/5)*5;
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
const LOC=window.OFFLAND_LOCALE||"de-DE", TR=window.OFFLAND_T||(s=>s);   // Sprache: siehe js/i18n.js
const langPref=()=>{try{return localStorage.getItem("offland-lang")}catch(e){return null}};
const nice=s=>parse(s).toLocaleDateString(LOC,{weekday:"short",day:"numeric",month:"short"});
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
  {id:"fest",day:6,name:"Monatsfest",text:"Jeden Monat ein neues Fest. Bleib an genug Tagen im Budget, dann feiert die Insel und du bekommst den Monatsstempel fürs Album.",tab:"heute",ic:'<path d="M5 21V5l7 4 7-4v16"/><path d="M5 13l7 4 7-4"/>'},
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
/* ---------- Gegen das Nachlassen: Monatsfest, Jubiläum, Comeback ---------- */
const MONTH_N=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const MFEST=[
  {n:"Neujahrsfeuer",e:"🎆",t:"Ein Feuerwerk über der Lagune für einen guten Start ins Jahr."},
  {n:"Karneval der Tiere",e:"🎭",t:"Alle Tiere verkleiden sich. Die Ziege geht als Ziege, wie jedes Jahr."},
  {n:"Frühlingserwachen",e:"🌱",t:"Die ersten Knospen. Alle pflanzen etwas Neues auf der Insel."},
  {n:"Blütenfest",e:"🌸",t:"Die ganze Insel blüht, und abends gibt es Blütentee am Strand."},
  {n:"Maifest",e:"🌼",t:"Ein Maibaum mit bunten Bändern und Tanz bis zum Sonnenuntergang."},
  {n:"Mittsommer",e:"☀️",t:"Der längste Tag des Jahres. Niemand will ins Bett."},
  {n:"Sandburgenfest",e:"🏖️",t:"Der große Sandburgen-Wettbewerb. Die Jury ist bestechlich (mit Muscheln)."},
  {n:"Sternschnuppennacht",e:"🌠",t:"Alle liegen am Strand und zählen Sternschnuppen."},
  {n:"Erntefest",e:"🍎",t:"Körbe voller Äpfel und ein langer Tisch für alle."},
  {n:"Kürbisfest",e:"🎃",t:"Geschnitzte Kürbisse leuchten am Steg. Ein bisschen gruselig, sehr gemütlich."},
  {n:"Laternenumzug",e:"🏮",t:"Mit Laternen einmal um die ganze Insel, und alle singen schief."},
  {n:"Lichterfest",e:"✨",t:"Lichterketten an jedem Haus und heißer Kakao für alle."}];
const curMonth=()=>today().slice(0,7);
const festOf=m=>MFEST[+m.slice(5,7)-1];
const festMonth=m=>MONTH_N[+m.slice(5,7)-1];
/* Ziel für den laufenden Monat, beim ersten Mal festgelegt: wer spät im Monat startet, braucht weniger Tage */
function festGoal(){
  const m=curMonth();
  if(!S.mfest||S.mfest.m!==m){const d=parse(today()), left=new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate()+1;
    S.mfest={m,need:Math.max(3,Math.min(12,Math.floor(left*.5))),done:false}}
  return S.mfest;
}
const festHave=m=>S.days.filter(d=>d.day.slice(0,7)===m&&d.min<=S.budget).length;
function festCheck(day){
  if(!feature("fest")||day.slice(0,7)!==curMonth()) return;
  const f=festGoal(); if(f.done||festHave(f.m)<f.need) return;
  f.done=true; (S.stamps=S.stamps||[]).push(f.m);
  S.points+=50; glAdd(5); stat("monatsfest");
  S.pending.push({type:"mfest",m:f.m}); log(festOf(f.m).n+"! Der Monatsstempel für "+festMonth(f.m)+" ist im Album.","good");
}
function festCard(){
  if(!feature("fest")||!S.setup) return "";
  const f=festGoal(), x=festOf(f.m), have=Math.min(f.need,festHave(f.m));
  return `<div class="fy"><p class="k" style="color:var(--amber)">${esc(festMonth(f.m))}: ${esc(x.n)}</p><b>${f.done?"Gefeiert! Stempel im Album":have+" / "+f.need+" Tage im Budget"}</b>
    ${f.done?`<p class="small muted">Nächsten Monat wartet ein neues Fest.</p>`:`<div class="bar" style="margin:6px 0 4px"><i style="width:${have/f.need*100}%;background:var(--amber)"></i></div><p class="small muted">Belohnung: Fest, +50 Punkte und Stempel ${x.e}</p>`}</div>`;
}
/* Jubiläum: an runden Tagen zeigt die Insel, was in der Zeit passiert ist */
const JUBI=[30,60,100,180,365];
function jubiCheck(){const n=S.days.length; if(JUBI.includes(n)){S.points+=n; S.pending.push({type:"jubi",n}); stat("jubilaeum_"+n)}}
/* Comeback: nach ein paar Tagen Pause freundlich empfangen, statt mit einem Berg zum Nachtragen */
function comebackCheck(){
  if(!S.setup||S.vacation||S.testmode||!S.lastDay||S.comeback===S.lastDay) return;
  const miss=Math.round((parse(today())-parse(S.lastDay))/864e5)-1; if(miss<3) return;
  S.comeback=S.lastDay; S.pending.unshift({type:"comeback",miss}); stat("comeback"); save();
}
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
      {id:p1,name:h1,kind:"mensch",art:"Mensch",pair:p2,status:"da",ret:0,born:0,phone:true,lv:1},
      {id:p2,name:h2,kind:"mensch",art:"Mensch",pair:p1,status:"da",ret:0,born:0,phone:true,lv:1},
      {id:z1,name:a1,kind:"tier",art:"Ziege",pair:z2,status:"da",ret:0,born:0},
      {id:z2,name:a2,kind:"tier",art:"Ziege",pair:z1,status:"da",ret:0,born:0}
    ],
    warn:null, pending:[], days:[], feed:[], postcards:[], testmode:false,
    points:0, items:[], sun:0, rel:{}, conflict:null, arrC:0, birthC:0, allFeatures:false, chapter:0
  };
}
function migrate(st){
  // Verwandlung Smombie → Mensch: alte Spielstände bekommen eine Stufe passend zum Inselglück
  (st.residents||[]).forEach(r=>{if(r.kind==="mensch"&&r.lv==null){const g=st.glueck||60;r.lv=r.phone?1:g>=80?4:g>=60?3:g>=40?2:1}});
  if(!st.postcards)st.postcards=[];
  if(st.points==null)st.points=0; if(!st.items)st.items=[]; if(!st.sun)st.sun=0;
  if(!st.rel)st.rel={}; if(st.conflict===undefined)st.conflict=null;
  if(!st.arrC)st.arrC=0; if(!st.birthC)st.birthC=0;
  const D={apps:DEFAULT_APPS.map(x=>Object.assign({},x)),monsters:[],budgetStreak:0,aurora:0,birds:0,trader:null,wish:null,chronicle:[],finds:[],capsules:[],night:null,boat:null,focusLog:[],alarm:true,activities:{},actTotals:{},path:0,repair:null,vacation:null,builtLog:[],lastMonth:null,fish:0,focusMin:0,tea:0,memorials:[],natDeath:true,sound:true,world:0,found:0,code:null,plus:null,buddies:[],invitedBy:null,online:{on:false,pub:false,pid:null},tickets:[],backup:{on:false,code:null,at:null},family:null,plan:null,planLog:[],weekReady:null,storySeen:false,chapter:null,fests:0,freed:0,duelOff:null,jokerWk:null,lastSurprise:0,surprises:[],duel:null,duelLog:[],lineLog:[],seenArts:[],umfrage:{},bilanz:{},guests:[]};
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
/* Verwandlung: 0 Smombie (am Handy) · 1 Schatten · 2 schaut auf · 3 fast zurück · 4 Mensch */
const LV_NAMES=["Smombie","Schatten","schaut auf","fast zurück","strahlt"];
// Höchste Stufe hängt am Inselglück: ganz Mensch (und Jubel) erst ab 80 %
function lvCap(){const g=typeof S!=="undefined"&&S?S.glueck:100;return g>=80?4:g>=60?3:g>=40?2:1}
function lvOf(r){
  if(!r||r.kind!=="mensch") return 4;
  if(r.phone) return 0;
  if(r.lvFull) return 4;   // Editor-Vorschau
  const st=stage(r), v=Math.min(r.lv==null?4:r.lv,lvCap());
  return st==="baby"?4:st==="kind"?Math.max(2,v):Math.max(1,Math.min(4,v));
}
function mood(){return S.glueck>=80?["aufblühend","good"]:S.glueck>=40?["zufrieden","ok"]:["unglücklich","bad"]}
function savedTotal(){return S.days.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0)}
function nextDay(){return S.lastDay?addDays(S.lastDay,1):today()}
function canClose(){return S.testmode||nextDay()<=today()}

/* ---------- Ereignisse ---------- */
function log(text,kind){S.feed.unshift({day:S.lastDay,text,kind:kind||"info"});S.feed=S.feed.slice(0,80)}

function arrival(){
  const full=occupied()>=capacity();
  // Insel voll und eine noch nie gesehene Art kann nicht einziehen: sie kommt zu Besuch und zählt für die Sammlung,
  // sonst bliebe die Sammlung für immer unvollständig
  if(full){
    const seen=new Set(S.residents.filter(x=>x.kind==="tier").map(x=>x.art).concat(S.seenArts||[]));
    const blocked=LAND.concat(worldAnimals()).concat(has("leuchtturm")?SEA:[]).filter(a=>!seen.has(a)&&!PETS.includes(a));
    if(blocked.length){const art=pick(blocked); (S.seenArts=S.seenArts||[]).push(art);
      log(artikel(art,true)+" "+art+" war zu Besuch. Für ein Zuhause war kein Platz, aber in der Sammlung ist die Art jetzt dabei.","good");
      chron([],artikel(art,true)+" "+art+" hat die Insel besucht.");
      S.guests=(S.guests||[]).concat({id:uid(),art,until:S.dayCount+2}).slice(-2); S.pending.push({type:"guest",art}); return}
  }
  if(full&&!petRoom()) {log("Jemand wollte einziehen, aber es ist kein Platz frei. Ein Großprojekt schafft neuen Platz.","info");return}
  const humans=here().filter(r=>r.kind==="mensch").length, animals=here().length-humans;
  const isHuman=!full&&humans<=animals;
  const used=S.residents.map(r=>r.name);
  if(isHuman){
    const single=here().find(r=>r.kind==="mensch"&&!r.pair);
    const r={id:uid(),name:freeName(HUMAN_NAMES,used),kind:"mensch",art:"Mensch",pair:null,status:"da",ret:0,born:S.dayCount,job:pickJob(),trait:pick(TRAITS).id,phone:Math.random()<1/3,lv:S.glueck>80?2:1};   // vom Festland kommen alle als Schatten, eine sehr glückliche Insel färbt schneller ab   // jeder Dritte bringt sein Handy vom Festland mit
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
    const seenArt=new Set(S.residents.filter(x=>x.kind==="tier").map(x=>x.art).concat(S.seenArts||[])), unseen=pool.filter(a=>!seenArt.has(a));
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
  const kid={id:uid(),name:freeName(a.kind==="mensch"?HUMAN_NAMES:ANIMAL_NAMES,used),kind:a.kind,art:a.art,pair:null,parents:[a.id,b.id],status:"da",ret:0,born:S.dayCount,lv:4};   // Inselkinder kennen kein Handy
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
  S.rel[rk(a.id,b.id)]=-10; glAdd(-(4));
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
    if(ok){addRel(a.id,b.id,c.state==="abend"?45:25);glAdd((c.state==="abend"?3:1));
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
    if(c&&Math.random()<.18){const [a,b]=c;a.married=b.married=true;glAdd(5);S.points+=40;
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
  r.happyUntil=S.dayCount+7; S.points+=pts; glAdd(gl);
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
      if(ok){addRel(a.id,b.id,35);glAdd(4);log(a.name+" und "+b.name+" haben sich am handyfreien Abend ausgesprochen und vertragen sich wieder.","good")}
      else{addRel(a.id,b.id,-25);glAdd(-(3));log("Der Klärungsabend ist ausgefallen. "+a.name+" und "+b.name+" reden nicht mehr miteinander.","bad")}
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
    else{addRel(a.id,b.id,-30);glAdd(-(3));log("Der Streit zwischen "+a.name+" und "+b.name+" schwelt weiter.","bad");escalate(a,b)}
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
  if(bday){const n=(S.dayCount-(bday.born||0))/30;S.points+=15;glAdd(3);bday.happyUntil=Math.max(bday.happyUntil||0,S.dayCount+1);
    log(bday.name+" feiert den "+n+". Inselgeburtstag! +15 Punkte, +3 % Glück.","good");chron([bday.id],bday.name+" hat den "+n+". Inselgeburtstag gefeiert.");S.pending.push({type:"birthday",id:bday.id,n})}
  // Wünsche
  wishCheck();
  if(!S.wish&&S.dayCount-(S.lastWishEnd||0)>=1&&Math.random()<.65) makeWish();
  // Strandgut
  const chance=.35+(dreamt?.2:0)+(owns("teleskop")?.15:0);
  if(Math.random()<chance){
    const f=wpickF(FINDS);
    if(f.pts) S.points+=f.pts; if(f.mat) S.material+=f.mat; if(f.glueck) glAdd(f.glueck);
    const msg=f.id==="flaschenpost"?pick(BOTTLE):null;
    S.finds.push({id:f.id,day,msg});
    S.pending.push({type:"strandgut",find:f.id,msg});
    log("Strandgut: "+f.n+" angespült.","good");
  }
  // Seltene Besucher
  if(S.aurora>0)S.aurora--; if(S.birds>0)S.birds--;
  if(S.trader&&day>=S.trader.until) S.trader=null;
  // Fanpost: alle 5 bis 7 guten Tage schreibt jemand von außen, was er Gutes über die Insel gehört hat
  if(good){S.fanC=(S.fanC||0)+1;
    if(S.dayCount>=4&&S.fanC>=5+Math.floor(Math.random()*3)&&here().some(r=>r.kind==="mensch")&&!S.pending.some(e=>e.type==="postcard"||e.type==="fanpost")){S.fanC=0;S.pending.push({type:"fanpost"})}}
  if(good&&S.budgetStreak>0&&S.budgetStreak%(has("f_nordlicht")?5:7)===0){
    S.aurora=owns("sternwarte")?4:3; S.pending.push({type:"visitor",kind:"aurora"}); log("Polarlicht über der Insel! 7 Tage am Stück im Budget.","good"); chron([],"Polarlicht nach "+S.budgetStreak+" Tagen im Budget.");
  } else if(good&&S.glueck>=60&&!S.birds&&Math.random()<(owns("vogelhaus")?.2:.1)){
    S.birds=2; glAdd(3); S.pending.push({type:"visitor",kind:"birds"}); log("Ein Schwarm Zugvögel rastet auf der Insel. +3 % Glück.","good");
  } else if(!S.trader&&Math.random()<.12){
    const offer=RARE.filter(x=>!owns(x.id));
    if(offer.length){S.trader={until:addDays(day,2),items:shuffle(offer).slice(0,2).map(x=>x.id)};S.pending.push({type:"visitor",kind:"trader"});log("Ein Händlerschiff hat angelegt. Es bleibt 2 Tage.","info")}
  }
  // Seltene Überraschung an guten Tagen (unvorhersehbar, höchstens alle 3 Tage)
  if(good&&S.dayCount-(S.lastSurprise||0)>=3&&!S.pending.some(e=>e.type==="visitor")&&Math.random()<.25) surprise(day);
  // Inselfest nach einer guten Woche
  if(S.dayCount%7===0){
    const g=S.days.slice(-7).filter(d=>d.min<=S.budget).length;
    if(g>=(has("festzelt")?4:5)){S.fests=(S.fests||0)+1;const fp=has("festzelt")?50:30;glAdd(5);S.points+=fp;S.pending.push({type:"fest",good:g});log("Inselfest! "+g+" von 7 Tagen im Budget. +5 % Glück, +"+fp+" Punkte.","good");chron([],"Inselfest nach "+g+" guten Tagen.")}
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
    ev.pts=20; S.points+=20; glAdd(4);
    log("Überraschung: Eine Meeresschildkröte hat am Strand Eier gelegt. +4 % Glück, +20 Punkte.","good"); chron([],"Eine Meeresschildkröte hat am Strand Eier gelegt.");
  } else if(k==="sternschnuppe"){
    ev.mat=120; S.material+=120;
    log("Überraschung: Sternschnuppenregen! Alle haben sich etwas gewünscht. +2 h Baumaterial.","good"); chron([],"Sternschnuppenregen über der Insel.");
  } else {
    glAdd(3); here().forEach(r=>{if(r.kind==="mensch") r.happyUntil=Math.max(r.happyUntil||0,S.dayCount+1)});
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
function monthName(m){const [y,mo]=m.split("-").map(Number);return new Date(y,mo-1,1).toLocaleDateString(LOC,{month:"long",year:"numeric"})}
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
  if(id==="spaziergang"){S.path++;glAdd(1)}
  if(id==="lesen"){glAdd(1)}
  if(id==="sport"){glAdd(2)}
  if(id==="kochen"){S.points+=15}
  if(id==="freunde"){const ad=adults();for(let i=0;i<3&&ad.length>1;i++){const x=pick(ad),y=pick(ad);if(x.id!==y.id)addRel(x.id,y.id,5)}glAdd(1)}
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
  S.points+=20; glAdd(2); S.actTotals[id]=(S.actTotals[id]||0)+1;
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
/* ---------- Erste Tage: Zeit-Bilanz nach 5 Tagen, Rückblick nach der ersten Woche ----------
   Kommen je einmal, genau wenn der 5. bzw. 7. Tag eingetragen ist. Zeigen, was die gewonnene Zeit wert ist. */
function bilanzCheck(){
  const b=S.bilanz||(S.bilanz={});
  for(const n of [5,7]) if(S.dayCount===n&&!b[n]){b[n]=today(); S.pending.push({type:"bilanz",n,day:S.lastDay})}
}
function bilanzSheet(ev){
  CUR_EV=null;
  const ds=S.days.filter(d=>!ev.day||d.day<=ev.day).slice(-ev.n), n=ds.length; if(!n) return showPending();
  stat("bilanz_"+ev.n);
  const sv=d=>Math.max(0,S.baseline-d.min), saved=ds.reduce((a,d)=>a+sv(d),0), avg=Math.round(ds.reduce((a,d)=>a+d.min,0)/n);
  const good=ds.filter(d=>d.min<=S.budget).length, year=Math.round(saved/n*365/1440);
  const hero=`<div><p class="small muted">In ${n} Tagen gewonnen</p><p class="bz-hero num">${saved?hm(saved):"0 min"}</p></div>`;
  if(ev.n===5){
    const pref=["Spaziergänge","Buchkapitel","Kinofilme","selbst gekochte Abendessen","Treffen mit Freund:innen","Nächte Schlaf","5-km-Läufe","ganze Bücher"];   // alltagsnah zuerst
    const four=ACTS.filter(a=>saved>=a.min).sort((a,b)=>(pref.indexOf(a.n)+1||99)-(pref.indexOf(b.n)+1||99)).slice(0,4);
    return sheet(`<p class="label" style="color:var(--lime)">Deine ersten 5 Tage</p><h2>${saved?"Schau mal, was du dir zurückgeholt hast":"Deine ersten 5 Tage auf OffLand"}</h2>
      ${hero}
      ${avg<S.baseline?`<div class="bz-delta"><span class="small muted">Pro Tag am Handy</span><span class="num"><s>${hm(S.baseline)}</s> → <b>${hm(avg)}</b></span></div>`:""}
      ${four.length?`<p class="small muted">Das hättest du damit machen können:</p>
      <div class="bz-cmp">${four.map(a=>`<div><span class="bz-ic">${actIcon(a)}</span><p><b class="num">${Math.floor(saved/a.min)}</b><span>${esc(Math.floor(saved/a.min)===1?SING[a.n]||a.n:a.n)}</span></p></div>`).join("")}</div>`:""}
      ${year>=1?`<div class="bz-year"><p class="small">Wenn du so weitermachst, holst du dir aufs Jahr</p><p><b>${year} ${year===1?"ganzen Tag":"ganze Tage"}</b> zurück.</p></div>`
        :`<p class="muted">${good} von ${n} Tagen warst du im Budget. Jeder Tag zählt, die Insel merkt sich alles.</p>`}
      ${saysHtml("bay",saved?"Ich hab das zweimal nachgerechnet. Das hast du ganz allein geschafft.":"Aller Anfang ist schwer. Morgen holen wir uns die erste Stunde zurück!")}
      <button class="btn" data-ok>Weiter so</button>`);
  }
  const mx=Math.max(1,...ds.map(sv)), best=ds.slice().sort((a,b)=>a.min-b.min)[0], from=ds[0].day;
  const moved=S.chronicle.filter(c=>c.day&&c.day>=from&&/eingezogen|geboren/.test(c.text)).length;
  sheet(`<p class="label" style="color:var(--lime)">Deine erste Woche</p><h2>${good>=4?"Was für eine Woche!":"Deine erste Woche ist geschafft"}</h2>
    ${hero}
    <div class="bz-bars" aria-hidden="true">${ds.map(d=>`<div><i class="${d.min>S.budget?"over":""}" style="height:${Math.max(8,Math.round(sv(d)/mx*100))}%"></i><span>${parse(d.day).toLocaleDateString("de-DE",{weekday:"short"}).slice(0,2)}</span></div>`).join("")}</div>
    <div class="bz-tiles"><div><b class="num">${good}/${n}</b><span>Tage im Budget</span></div><div><b class="num">${moved}</b><span>${moved===1?"neuer Bewohner":"neue Bewohner"}</span></div><div><b class="num">${hm(best.min)}</b><span>bester Tag</span></div></div>
    ${saysHtml("bay",good>=4?"Ich bin ehrlich beeindruckt. Und das ist erst der Anfang!":"Eine Woche durchgehalten, das schaffen die wenigsten. Die nächste wird noch besser.")}
    <button class="btn" data-ok>Weiter</button>`);
}
function weekSheet(wk){
  stat("rueckblick");
  const w=weekData(wk); if(!w) return showPending();
  const eq=equivTop(w.saved), kw=+wk.split("-W")[1], end=addDays(w.mon,6);
  const sameM=parse(w.mon).getMonth()===parse(end).getMonth(), range=(sameM?parse(w.mon).getDate()+".":parse(w.mon).toLocaleDateString(LOC,{day:"numeric",month:"short"}))+" – "+parse(end).toLocaleDateString(LOC,{day:"numeric",month:sameM?"long":"short"});
  const dAvg=w.pavg==null?null:Math.round(w.pavg-w.avg);
  const wd=parse(w.best.day).toLocaleDateString(LOC,{weekday:"long"});
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
  if(S.shield&&S.shield.mode==="focus"&&ST&&ST.shieldFocus) ST.shieldFocus({on:true}).catch(()=>{});
  const el=document.documentElement;
  if(el.requestFullscreen&&!document.fullscreenElement) el.requestFullscreen().catch(()=>{});
  render();
}
function boatLeft(){if(!S.boat)return 0;return Math.max(0,S.boat.start+S.boat.dur*60000-Date.now())}
function finishBoat(){
  if(!S.boat) return;
  const b=S.boat; S.boat=null;
  if(S.shield&&S.shield.mode==="focus"&&ST&&ST.shieldFocus) ST.shieldFocus({on:false}).catch(()=>{});
  const late=Date.now()-(b.start+b.dur*60000)>5000;          // in der iPhone-App hat dann schon die Mitteilung geklingelt
  if(!document.hidden&&!(FA&&late)) ringAlarm();
  alarmCancel();
  S.pending.push({type:"boat",dur:b.dur,crew:b.crew,left:b.left||0,cat:b.cat||null,task:b.task||""});
  save(); render(); showPending();
}
function boatHonest(ok,dur,crewId,cat,task,done){
  if(ok){
    S.focusLog=[{day:today(),at:Date.now(),cat:cat||"ruhe",task:task||"",min:dur,done:!!done}].concat(S.focusLog||[]).slice(0,300);
    if(done){S.points+=Math.round(dur/5);glAdd(2)}const fish=Math.max(1,Math.round(dur/10))*(has("floss")?2:1)*(has("a_eisfischen")?2:1), pts=Math.round(dur*(owns("angel")?1.2:1)*(has("f_wikinger")?1.2:1));S.fish+=fish;S.points+=pts;S.material+=dur;S.focusMin+=dur;
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
    $("#stopYes").onclick=()=>{S.boat=null;alarmCancel();if(S.shield&&S.shield.mode==="focus"&&ST&&ST.shieldFocus)ST.shieldFocus({on:false}).catch(()=>{});log("Bootsfahrt abgebrochen.","info");save();closeModal();render()};
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
function nightAsk(){
  sheet(`<p class="label" style="color:var(--lilac)">Gute Nacht, Insel</p><h2>Noch eine Inselminute, bevor das Handy schlafen geht?</h2>
    <p class="muted">Eine Minute Meeresrauschen hilft dem Kopf, zur Ruhe zu kommen. Danach schläft es sich oft leichter ein.</p>
    <button class="btn" id="ngCalm">Ja, eine Minute Meer</button><button class="btn ghost" id="ngNo" data-ok>Nein danke, gute Nacht</button>`);
  $("#ngCalm").onclick=()=>{closeModal();goodNight();calmMinute()};
  $("#ngNo").onclick=()=>{closeModal();goodNight();showPending()};
}
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

/* ---------- Glück: oben wird es zäh, und oben verliert man schneller ----------
   Gewinne zählen unter 50 % voll, bis 80 % zu 60 %, bis 90 % zu 35 %, darüber zu 20 %.
   Verluste ab 80 % wiegen 1,3-fach. So ist 100 % ein echtes Ziel, das man halten muss. */
function glGainRate(g){return g<50?1:g<80?.6:g<90?.35:.2}
function glAdd(n){
  let g=S.glueck;
  if(n>0){let rest=n; while(rest>0){const step=Math.min(1,rest); g+=step*glGainRate(g); rest-=step}}
  else if(n<0) g+=n*(g>=80?1.3:1);
  S.glueck=clamp(Math.round(g),0,100); return S.glueck;
}
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
  glAdd(delta);
  if(before>=95&&diff<S.budget*.25) glAdd(-1);   // ganz oben bleibt nur, wer richtig gute Tage hat
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
  statsActive(); stat("tag"); stat(diff>=0?"tag_gut":"tag_schlecht"); if([1,3,7,14,30,60,100].includes(S.days.length)) stat("tage_"+S.days.length); statsChange(min);
  festCheck(day); jubiCheck(); baseCheck();
  S.lastDay=day; S.dayCount++;
  S.guests=(S.guests||[]).filter(g=>g.until>S.dayCount);                  // Besuch bleibt zwei Tage
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
  else if(diff<0){const c=here().filter(r=>r.kind==="mensch"&&!r.phone&&stage(r)!=="baby"&&stage(r)!=="kind");if(c.length&&Math.random()<.5){hooked=pick(c);hooked.phone=true;hooked.lv=0;log(hooked.name+" hängt wieder am Handy.","bad")}}
  // Verwandlung: gute Tage bringen Farbe zurück, schlechte nehmen sie
  const back=[];
  here().filter(r=>r.kind==="mensch").forEach(r=>{const st=stage(r); if(st==="baby") return;
    const v=r.lv==null?4:r.lv, lo=st==="kind"?2:1;
    const cap=Math.max(lo,lvCap()), was=Math.min(v,cap);
    if(diff>=0){r.lv=Math.min(cap,was+1); if(was<4&&r.lv===4&&!r.phone){r.lvUp=S.dayCount;back.push(r.name)}}
    else r.lv=Math.max(lo,was-1);
  });
  if(back.length) log(nameList(back)+" "+(back.length>1?"sind":"ist")+" wieder ganz Mensch. Die Farbe ist zurück!","good");
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
  bilanzCheck();
  plusEndCheck();
  umfrageCheck();
  if(S.music===undefined&&S.sound!==false&&!S.pending.some(e=>e.type==="musicAsk")) S.pending.push({type:"musicAsk"});   // kommt gleich nach der Tagesbilanz
  if(netConfigured()&&statsDev().consent===undefined&&!S.pending.some(e=>e.type==="statsAsk")) S.pending.push({type:"statsAsk"});   // steht hinten an: kommt beim nächsten Öffnen mit der Freischaltung
  sortPending(); PEND_BUDGET=3;
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
/* Umzugskiste: bis zu zwei Lieblingsstücke ziehen mit auf die neue Insel */
const KISTE_MAX=2;
const kisteCost=id=>{const d=itemDef(id); return Math.max(50,Math.round((d?price(d):100)*.5/5)*5)};
function travel(picks){
  if(!((S.found||0)>(S.world||0))) return;
  picks=(Array.isArray(picks)?picks:[]).filter(id=>hereItems().includes(id)).slice(0,KISTE_MAX);
  const cost=picks.reduce((a,id)=>a+kisteCost(id),0); if(cost>S.points) picks=[];
  const toId=WORLDS[(S.world||0)+1].id;
  if(picks.length){S.points-=cost; S.moved=S.moved||{}; picks.forEach(id=>{S.moved[id]=toId}); stat("umzugskiste");
    log("Umzugskiste gepackt: "+nameList(picks.map(itemName))+" "+(picks.length>1?"kommen":"kommt")+" mit. −"+cost+" Punkte.","good")}
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
    ${(S.found||0)>w?`<p class="small" style="color:var(--lime);font-weight:700">Neue Insel entdeckt: ${esc(next.name)}!</p><button class="btn" id="travelBtn">Nach ${esc(next.name)} aufbrechen</button><p class="small muted" style="margin-top:-4px">Alle Bewohner und Tiere kommen mit. Gegenstände aus dem Laden bleiben hier, bis zu ${KISTE_MAX} Lieblingsstücke dürfen in der Umzugskiste mit.</p>`
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
    case 13: return {back:"",front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-2-.8-3-1.8q-3.2 1.4-7.6 1.8z" fill="${c}"/><path d="M-3.6 -20.2q1.4-4 6.6-3q-1.2 1.4-.4 3q-3-1.2-6.2 0z" fill="${c}"/>`};
    case 14: return {back:"",front:`<path d="M-5 -17.6a5 4 0 0 1 10 0q-5-1.2-10 0z" fill="${c}" opacity=".4"/><path d="M-4.8 -18.4q.4-4.2 5.4-4q4.8.4 5 4.6q-1.4-1.2-3-1.2q-3.8-.2-7.4.6z" fill="${c}"/>`};
    case 15: return {back:"",front:`<path d="M-5.2 -16.6l.3-3.2 1.3 1.1.8-3.2 1.5 1.7 1.3-2.8 1.3 2.8 1.5-1.7.8 3.2 1.3-1.1.3 3.2q-5.2-1.8-10.4 0z" fill="${c}"/>`};
    case 16: return {back:`<circle cx="0" cy="-22" r="2" fill="${c}"/>`,front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-1.8-10.6 0z" fill="${c}"/><path d="M-1.6 -20.6h3.2" stroke="${shadeC(c,.6)}" stroke-width=".6" stroke-linecap="round"/>`};
    case 17: return {back:"",front:`<path d="M-5.3 -16.4a5.3 5.5 0 0 1 10.6 0q-5.3-1.6-10.6 0z" fill="${c}"/><g fill="${c}"><ellipse cx="-3.6" cy="-20.4" rx="1.1" ry="1.7"/><ellipse cx="-1.2" cy="-21.6" rx="1.1" ry="1.8"/><ellipse cx="1.3" cy="-21.6" rx="1.1" ry="1.8"/><ellipse cx="3.7" cy="-20.3" rx="1.1" ry="1.7"/></g>`};
    case 18: return {back:`<path d="M-5.8 -16.5a5.8 6 0 0 1 11.6 0v4q-1.2.8-2.4 0v-2.4h-6.8v2.4q-1.2.8-2.4 0z" fill="${c}"/>`,front:`<path d="M-5.6 -15.6a5.6 5.8 0 0 1 11.2 0q-1.6-.4-3.2-2q-1.4-.8-2.4-2.4q-1 1.6-2.4 2.4q-1.6 1.6-3.2 2z" fill="${c}"/>`};
    default: return {back:"",front:`<path d="M-5 -17.6a5 4 0 0 1 10 0q-5-1.2-10 0z" fill="${c}"/>`};
  }
}
/* Bart (Farbe wie die Haare) und Muster auf dem Oberteil */
const BEARD_NAMES=["Kein Bart","Dreitagebart","Schnurrbart","Kinnbart","Vollbart"];
function beardSvg(b,c){
  const jaw=`M-4.9 -15.4q.2 5.6 4.9 5.6t4.9-5.6q-.9 1.6-2.2 1.9q-1.1-1.1-2.7-1.1t-2.7 1.1q-1.3-.3-2.2-1.9z`;
  return ["",`<path d="${jaw}" fill="${c}" opacity=".32"/>`,
    `<path d="M-2.5 -14.5q1.2-1.1 2.5-.5q1.3-.6 2.5.5q-1.3.6-2.5.1q-1.2.5-2.5-.1z" fill="${c}"/>`,
    `<path d="M-1.5 -12.6q1.5.6 3 0l-.5 1.9q-1 .8-2 0z" fill="${c}"/><path d="M-2.3 -14.4q1.1-.9 2.3-.4q1.2-.5 2.3.4q-1.2.4-2.3.1q-1.1.3-2.3-.1z" fill="${c}"/>`,
    `<path d="${jaw}" fill="${c}"/>`][b]||"";
}
const PAT_NAMES=["Uni","Streifen","Punkte","Karo","Blitz","Stern","Herz","Palme","Initiale","Welle"];
function patSvg(p,c,name){
  const v=parseInt(c.slice(1),16), light=((v>>16)*.3+(v>>8&255)*.59+(v&255)*.11)>150, k=light?shadeC(c,.62):"#F3F1EA", o=light?1:.75;
  switch(p){
    case 1: return `<g stroke="${k}" stroke-width="1.1" opacity="${o}"><path d="M-8 -10.4h16M-8 -7.4h16M-8 -4.4h16M-8 -1.4h16"/></g>`;
    case 2: return `<g fill="${k}" opacity="${o}">${[[-3.4,-9.6],[1.2,-10.4],[3.8,-6.6],[-1,-6],[-4.4,-3],[0.8,-2.4],[4.4,-1.6]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".75"/>`).join("")}</g>`;
    case 3: return `<g stroke="${k}" stroke-width=".7" opacity="${o*.8}"><path d="M-8 -9.6h16M-8 -6h16M-8 -2.4h16M-3.6 -14v14M0 -14v14M3.6 -14v14"/></g>`;
    case 4: return `<path d="M.8 -10.6l-3 4.4h2l-1.2 4.2 3.6-5h-2.1z" fill="${k}" opacity="${o}"/>`;
    case 5: return `<path d="M0 -10.2l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="${k}" opacity="${o}"/>`;
    case 6: return `<path d="M0 -3.8q-3.6-2.4-3.6-4.6q0-1.8 1.8-1.8q1.2 0 1.8 1.2q.6-1.2 1.8-1.2q1.8 0 1.8 1.8q0 2.2-3.6 4.6z" fill="${light?"#E5484D":"#FF8FB1"}"/>`;
    case 7: return `<g fill="${k}" opacity="${o}"><path d="M-.3 -2.2q.8-3.4 .2-6.6h.6q.8 3.2 0 6.6z"/><path d="M.2 -8.8q-2.4-1.2-4 .2q2.2-.2 4-.2zM.2 -8.8q2.4-1.4 4 0q-2.2-.2-4 0zM.2 -8.8q-1.6-2.2-3.4-1.8q1.8.6 3.4 1.8zM.2 -8.8q1.6-2.2 3.4-1.8q-1.8.6-3.4 1.8z"/></g>`;
    case 8: return `<text x="0" y="-3.6" text-anchor="middle" font-size="6.4" font-weight="800" font-family="Bricolage Grotesque, Manrope, sans-serif" fill="${k}" opacity="${o}">${esc(((name||"?").trim()[0]||"?").toUpperCase())}</text>`;
    case 9: return `<path d="M-8 -6.6q2-1.6 4 0t4 0 4 0 4 0M-8 -3.2q2-1.6 4 0t4 0 4 0 4 0" stroke="${k}" stroke-width="1" fill="none" opacity="${o}"/>`;
    default: return "";
  }
}
const STYLE_NAMES=["Kurz","Lang","Dutt","Zopf","Locken","Mütze","Stoppeln","Pferdeschwanz","Bob","Iro","Glatze","Zwei Zöpfe","Seitenscheitel","Tolle","Undercut","Spikes","Männerdutt","Twists","Surfer"];
/* Extras: Schal, Brille, Sonnenbrille, Bommelmütze, Kappe, Blume, Stirnband */
const ACC_NAMES=["Nichts","Schal","Brille","Sonnenbrille","Bommelmütze","Kappe","Blume","Stirnband","Krone","Goldbrille","Sternenreif"];   // ab 8: Plus-Looks
const TOP_NAMES=["Hoodie","Offene Jacke","Hemd","Bomberjacke"];
const shadeC=(c,f)=>{const v=parseInt(c.slice(1),16);return "#"+[v>>16,v>>8&255,v&255].map(x=>Math.round(x*f).toString(16).padStart(2,"0")).join("")};
/* Oberkörper der Erwachsenen: Grundform + Details je Oberteil (u = Verschiebung nach oben) */
function topSvg(t,c,u){
  const d=shadeC(c,.78);
  return `<path d="M-6 ${-2.6+u}c0-6 2.4-8.6 6-8.6s6 2.6 6 8.6z" fill="${c}"/>`+[
    `<path d="M-3 ${-5.6+u}h6l-.6 2.6h-4.8z" fill="${d}"/><path d="M-1 ${-11+u}v3.4M1 ${-11+u}v3.4" stroke="#F3F1EA" stroke-width=".45" stroke-linecap="round"/><path d="M-3.6 ${-11.2+u}q3.6 2.6 7.2 0" fill="none" stroke="${d}" stroke-width="1"/>`,
    `<path d="M-1.6 ${-11.2+u}v8.6h3.2v-8.6z" fill="#F3F1EA"/><path d="M-1.6 ${-11.2+u}l-1.4 8.6M1.6 ${-11.2+u}l1.4 8.6" stroke="${d}" stroke-width=".7"/>`,
    `<path d="M-2 ${-11.2+u}l2 1.6 2-1.6" fill="none" stroke="#F3F1EA" stroke-width=".8"/><circle cx="0" cy="${-7.6+u}" r=".4" fill="${d}"/><circle cx="0" cy="${-5.4+u}" r=".4" fill="${d}"/>`,
    `<path d="M-6 ${-3.4+u}h12" stroke="${d}" stroke-width="1.6"/><path d="M-.2 ${-11.2+u}v7.8" stroke="${d}" stroke-width=".5"/><path d="M-3 ${-11.2+u}q3 1.4 6 0" fill="none" stroke="${d}" stroke-width=".9"/>`][t%4];
}
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
    case 8: return {body:"",head:`<path d="M-4.3 -19.4l-.6-3.9 2 1.7 2.9-3 2.9 3 2-1.7-.6 3.9z" fill="#FFD27A" stroke="#E0A93C" stroke-width=".35" stroke-linejoin="round"/><circle cx="0" cy="-21.4" r=".6" fill="#E5484D"/><circle cx="-2.5" cy="-20.3" r=".4" fill="#5B8CD6"/><circle cx="2.5" cy="-20.3" r=".4" fill="#5BC0A8"/>`};
    case 9: return {body:"",head:`<g fill="#FFD27A" fill-opacity=".3" stroke="#E0A93C" stroke-width=".7"><circle cx="-1.9" cy="-15.6" r="1.6"/><circle cx="1.9" cy="-15.6" r="1.6"/></g><path d="M-.3 -15.7h.6M-3.5 -15.8l-1.5-.4M3.5 -15.8l1.5-.4" stroke="#E0A93C" stroke-width=".6"/><path d="M-2.7 -16.4l.7-.5M1.1 -16.4l.7-.5" stroke="#FFF6D8" stroke-width=".35" stroke-linecap="round"/>`};
    case 10: return {body:"",head:`<path d="M-5.3 -18.5q5.3-2.6 10.6 0" fill="none" stroke="#E0A93C" stroke-width=".7"/>${[[-3.4,-19.9,.9],[0,-21.4,1.15],[3.4,-19.9,.9]].map(([x,y,k])=>`<path transform="translate(${x} ${y}) scale(${k})" d="M0 -1.3l.38.85.92.1-.68.62.2.9L0 1.02l-.82.45.2-.9-.68-.62.92-.1z" fill="#FFD27A" stroke="#E0A93C" stroke-width=".18"/>`).join("")}`};
    default: return {body:"",head:""};
  }
}
function lookIdx(r){
  const h=hsh(r.id||r.name), o=r.look||{};
  const pickI=(k,v)=>o[k]!=null?o[k]:v;
  const a=(h>>>18)%14;     // etwa die Hälfte trägt von sich aus ein Extra
  return {skin:pickI("skin",h%SKIN.length),hair:pickI("hair",(h>>>3)%7),style:pickI("style",(h>>>6)%7),shirt:pickI("shirt",(h>>>9)%8),top:pickI("top",(h>>>26)%TOP_NAMES.length),eye:pickI("eye",(h>>>13)%5),beard:pickI("beard",0),pat:pickI("pat",(()=>{const q=(h>>>20)%18;return q<9?0:q-8})()),
    acc:pickI("acc",o.skin!=null?0:(a<7?0:a-6)),accC:pickI("accC",(h>>>22)%SHIRT.length)};
}
function looks(r){
  const h=hsh(r.id||r.name), i=lookIdx(r);
  return {skin:SKIN[i.skin],hair:r.retired?"#D9D6CE":HAIR[i.hair]||HAIR[0],style:i.style,
    shirt:SHIRT[i.shirt]||SHIRT[0],pants:PANTS[(h>>>12)%PANTS.length],cap:SHIRT[(h>>>15)%8],acc:accList(i.acc),accC:SHIRT[i.accC]||SHIRT[0],top:i.top%TOP_NAMES.length,beard:i.beard||0,pat:i.pat||0};
}
/* Lebensphase für die Figur: Baby, Kind, erwachsen, Rente */
function stage(r){
  if(r.retired) return "alt";
  if(r.parents&&!r.job){const age=typeof S!=="undefined"&&S?S.dayCount-(r.born||0):5;return age<3?"baby":"kind"}
  return "erw";
}
const tierScale=r=>(r.parents?0.7:1)*(r.art==="Wal"?1.6:["Elch","Kamel","Eisbär"].includes(r.art)?1.1:1);   // große Tiere werden größer gezeichnet
function figure(r,x,y){
  if(r.kind==="mensch"){
    const L=looks(r), st=stage(r), kid=st==="baby"?0.6:st==="kind"?0.74:1;
    const hair0=hairSvg(L.style,L.style===5?L.cap:L.hair), acc=accSvg(L.acc,L.accC);
    // Mit Mütze oder Kappe: keine Haare über der Krempe (Locken, Dutt, Iro lappen sonst heraus)
    const hat=L.acc.includes(4)||L.acc.includes(5), hcl=hat?`<clipPath id="hatclip"><rect x="-20" y="-17.6" width="40" height="40"/></clipPath>`:"";
    const hair=hat?{back:hcl+(hair0.back&&L.style===2?`<g clip-path="url(#hatclip)">${hair0.back}</g>`:hair0.back),front:hair0.front?`<g clip-path="url(#hatclip)">${hair0.front}</g>`:""}:hair0;
    if(r.sick) return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)} (krank: ${esc(r.sick.kind)})</title><rect x="-9" y="-6" width="18" height="6" rx="2" fill="#8A5A3B"/><rect x="-8" y="-9" width="16" height="5" rx="2" fill="#9CC8EE"/><circle cx="-6" cy="-10" r="4" fill="${L.skin}"/><path d="M-9.6 -11a4 4 0 0 1 6.6-2.6" stroke="${L.hair}" stroke-width="2" fill="none"/><path d="M-7.4 -10.4h1.2M-5 -10.4h1.2" stroke="#14151F" stroke-width=".6"/><circle cx="-8" cy="-9" r="1" fill="#E5484D" opacity=".7"/><text x="2" y="-12" font-size="6" fill="#F3F1EA" font-family="Manrope, sans-serif">z</text></g>`;
    const sad=typeof S!=="undefined"&&S.glueck<40, t=lvOf(r);
    if(st==="baby") return `<g transform="translate(${x} ${y}) scale(${kid})"><title>${esc(r.name)} (Baby)</title>
      <ellipse cx="0" cy="-5" rx="5.6" ry="5.4" fill="${L.shirt}"/><path d="M-3.4 -1v1.4M3.4 -1v1.4" stroke="${L.skin}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="0" cy="-14" r="5.4" fill="${L.skin}"/><path d="M-1 -19.2q1-2.4 2.6-1.6q-1.6.2-1.4 1.8" stroke="${L.hair}" stroke-width="1" fill="none" stroke-linecap="round"/>
      <circle cx="-1.9" cy="-14" r=".75" fill="#14151F"/><circle cx="1.9" cy="-14" r=".75" fill="#14151F"/><circle cx="-3.4" cy="-12.4" r="1.1" fill="#FF9C7A" opacity=".4"/><circle cx="3.4" cy="-12.4" r="1.1" fill="#FF9C7A" opacity=".4"/>
      <circle cx="0" cy="-11.4" r="1.4" fill="#9CC8EE"/><circle cx="0" cy="-11.4" r=".6" fill="#F3F1EA"/></g>`;
    const mouth=t<=2?`<path d="M-1.2 -13.1h2.4" stroke="#5A3A2A" stroke-width=".65" stroke-linecap="round"/>`:sad?`<path d="M-1.4 -12.6q1.4-1 2.8 0" stroke="#5A3A2A" stroke-width=".7" fill="none" stroke-linecap="round"/>`:`<path d="M-1.6 -13.3q1.6 1.3 3.2 0" stroke="#5A3A2A" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
    if(st!=="kind"){
      // Erwachsene im Stil "Schattenwesen × aufrichtender Zombie": Glockenkörper, kurze Beine, großer Kopf.
      // Je weiter weg vom Menschsein, desto gebückter, dunkler und schattiger.
      const alt=st==="alt", sd=shadeC(L.shirt,.82), brow=shadeC(alt?"#8A8780":L.hair,.7);
      const tilt=[7,4,2,0,0][t], lean=[18,11,5,1,0][t], drop=[3,2,1,0,0][t];
      const cheer=t===4&&(r.cheer||(typeof S!=="undefined"&&S&&S.glueck>=100&&!r.lvFull));   // Arme hoch nur bei 100 % Inselglück
      const hd=`translate(${(lean*.16).toFixed(2)} ${drop}) rotate(${lean} 0 -13) translate(0 -20) scale(1.24) translate(0 16)`;
      const body=`M-6.4 0q0-13 6.4-13.4q6.4.4 6.4 13.4z`;
      const arms=t===0?`<path d="M-5.4 -10q-1.6 3.4 2.6 4.6M5.4 -10q1.6 3.4-2.6 4.6" stroke="${sd}" stroke-width="2.2" fill="none" stroke-linecap="round"/><g transform="translate(0 -6.4) rotate(12)"><rect x="-2" y="-2.8" width="4" height="5.6" rx=".8" fill="#232637"/></g>`
        :cheer?`<path d="M-5.6 -10l-4.4-6M5.6 -10l4.4-6" stroke="${sd}" stroke-width="2.3" stroke-linecap="round"/><circle cx="-10.4" cy="-16.6" r="1.2" fill="${L.skin}"/><circle cx="10.4" cy="-16.6" r="1.2" fill="${L.skin}"/>`
        :`<path d="M-5.6 -10q-1.6 ${Math.max(1,4-t)} -1 ${Math.max(4,7-t)}M5.6 -10q1.6 ${Math.max(1,4-t)} 1 ${Math.max(4,7-t)}" stroke="${sd}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="-6.6" cy="${-10+Math.max(4,7-t)}" r="1.05" fill="${L.skin}"/><circle cx="6.6" cy="${-10+Math.max(4,7-t)}" r="1.05" fill="${L.skin}"/>`;
      const head=`${hair.back}<circle cx="0" cy="-16" r="5" fill="${L.skin}"/>${hair.front}`;
      const face=t<=2?(t===2?`<path d="M-1.2 -13.1h2.4" stroke="#2A1E1A" stroke-width=".5" stroke-linecap="round"/>`:"")
        :`<circle cx="-1.8" cy="-16.3" r=".7" fill="#14151F"/><circle cx="1.8" cy="-16.3" r=".7" fill="#14151F"/><circle cx="-1.55" cy="-16.55" r=".23" fill="#fff"/><circle cx="2.05" cy="-16.55" r=".23" fill="#fff"/>
          ${sad?`<path d="M-2.8 -18.4l1.5.5M2.8 -18.4l-1.5.5" stroke="${brow}" stroke-width=".5" stroke-linecap="round"/>`:`<path d="M-2.7 -18.1l1.5-.25M1.2 -18.35l1.5.25" stroke="${brow}" stroke-width=".5" stroke-linecap="round"/>`}
          <circle cx="-3.2" cy="-14" r=".9" fill="#FF9C7A" opacity=".5"/><circle cx="3.2" cy="-14" r=".9" fill="#FF9C7A" opacity=".5"/>
          ${sad?`<path d="M-1.3 -13.2q1.3-.9 2.6 0" stroke="#5A3A2A" stroke-width=".6" fill="none" stroke-linecap="round"/>`:`<path d="M-1.45 -14q1.45 ${cheer?1.6:1.1} 2.9 0" stroke="#5A3A2A" stroke-width=".6" fill="${cheer?"#7A2032":"none"}" stroke-linecap="round"/>`}`;
      // heller Umriss, damit man die Schatten auch im Dunkeln erkennt (wird mit der Farbe dünner)
      const rim=t<3?`<g class="lv-rim" style="--rw:${[.55,.55,.37][t]}px"><path d="${body}"/><g transform="${hd}">${hair.back}<circle cx="0" cy="-16" r="5"/>${hair.front}</g></g>`:"";
      const eyeC=LV_EYES[lookIdx(r).eye%LV_EYES.length];
      const glow=t===0?`<g transform="${hd}"><path d="M-2.9 -15.6h1.9M1 -15.6h1.9" stroke="#9CDCFF" stroke-width=".9" filter="url(#lvGlow)"/><ellipse cx="0" cy="-12.8" rx="5.2" ry="3.4" fill="#9CDCFF" opacity=".38" filter="url(#lvGlow)"/></g>
          <g transform="translate(0 -6.4) rotate(12)"><rect x="-1.4" y="-2.2" width="2.8" height="4" rx=".3" fill="#CFF3FF" filter="url(#lvGlow)"/></g>`
        :t===1?`<g transform="${hd}" filter="url(#lvGlow)"><path d="M-3.05 -16.3a1.15 1.15 0 0 0 2.3 0zM.75 -16.3a1.15 1.15 0 0 0 2.3 0z" fill="${eyeC}"/></g>`
        :t===2?`<g transform="${hd}"><g filter="url(#lvGlow)" opacity=".75"><circle cx="-1.9" cy="-16.4" r=".95" fill="${eyeC}"/><circle cx="1.9" cy="-16.4" r=".95" fill="${eyeC}"/></g><circle cx="-1.9" cy="-16.4" r=".48" fill="#14151F"/><circle cx="1.9" cy="-16.4" r=".48" fill="#14151F"/></g>`:"";
      return `<g transform="translate(${x} ${y})"><title>${esc(r.name)}${r.phone?" (am Handy)":t<4?` (${LV_NAMES[t]})`:""}</title><ellipse cx="0" cy=".4" rx="7" ry="1.2" fill="#000" opacity="${t<2?.3:.18}"/><g transform="rotate(${tilt})">${t<4?`<g filter="url(#lv${t})">`:""}
        ${alt?`<path d="M8.4 0v-8q0-1.8-1.8-1.8" stroke="#8A5A3B" stroke-width="1.1" fill="none" stroke-linecap="round"/>`:""}
        <path d="M-2.4 -1v1.6M2.4 -1v1.6" stroke="${L.pants}" stroke-width="2" stroke-linecap="round"/><path d="${body}" fill="${L.shirt}"/>${L.pat?`<g clip-path="url(#lvBody)">${patSvg(L.pat,L.shirt,r.name)}</g>`:""}<g transform="translate(0 -2.2)">${acc.body}</g>${arms}
        <g transform="${hd}">${head}${beardSvg(L.beard,L.hair)}${face}${acc.head}
          ${r.retired?`<path d="M-3.6 -16.4h2.6M1 -16.4h2.6M-1 -16.4h2" stroke="#3A3D58" stroke-width=".5" fill="none"/><circle cx="-1.8" cy="-16.3" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/><circle cx="1.8" cy="-16.3" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/>`:""}</g>${t<4?"</g>":""}${rim}${glow}</g>${cheer?LV_SPARK_BIG:""}</g>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${kid})"${t<4?` filter="url(#lv${t})"`:""}><title>${esc(r.name)}</title>
      <path d="M-2.4 -3.4v3.2M2.4 -3.4v3.2" stroke="${L.pants}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-6 -2.6c0-6 2.4-8.6 6-8.6s6 2.6 6 8.6z" fill="${L.shirt}"/>${acc.body}
      ${st==="kind"?`<g transform="translate(0 -12) scale(1.18) translate(0 12)">`:""}${hair.back}<circle cx="0" cy="-16" r="5" fill="${L.skin}"/>${hair.front}
      <circle cx="-1.8" cy="-15.6" r=".75" fill="#14151F"/><circle cx="1.8" cy="-15.6" r=".75" fill="#14151F"/>
      <circle cx="-3.2" cy="-13.8" r="1" fill="#FF9C7A" opacity=".35"/><circle cx="3.2" cy="-13.8" r="1" fill="#FF9C7A" opacity=".35"/>${mouth}${acc.head}
      ${r.retired?`<path d="M-3.6 -16.4h2.6M1 -16.4h2.6M-1 -16.4h2" stroke="#3A3D58" stroke-width=".5" fill="none"/><circle cx="-1.8" cy="-16" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/><circle cx="1.8" cy="-16" r="1.5" fill="none" stroke="#3A3D58" stroke-width=".5"/>`:""}${st==="kind"?"</g>":""}
      ${st==="alt"?`<path d="M7.4 0v-9.4q0-1.8-1.8-1.8" stroke="#8A5A3B" stroke-width="1.1" fill="none" stroke-linecap="round"/>`:""}${r.phone?PHONE_FIG:""}</g>`;
  }
  const s=tierScale(r);
  return `<g transform="translate(${x} ${y}) scale(${s})"><title>${esc(r.name)} (${esc(r.art)})</title>${animalSvg(r.art,animalVar(r))}${gearSvg(r.art,r.gear)}</g>`;
}
const LV_EYES=["#7FE8FF","#FFD45A","#B8F25A","#FF8FB1","#C9A6FF"];
const LV_SPARK_BIG=[[-9,-26],[9,-24],[-8,-6],[8.6,-31]].map(([x,y])=>`<path d="M${x} ${y-1.6}l.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5z" fill="#FFE680"/>`).join("");
const LV_SPARK=`<g fill="#FFD27A"><path d="M-7 -24l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"/><path d="M7.4 -21l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z"/><path d="M-8.2 -13l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3z" opacity=".8"/></g>`;
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
    ppl.map((r,i)=>`<g class="bob" style="animation-delay:${i*.25}s;animation-duration:${1.2+i%2*.4}s">${figure(Object.assign({},r,{lvFull:true,cheer:i%2===0,look:Object.assign({},r.look,{pat:[0,2,4,6,1][i%5]})}),[160,196,236,262,288][i],[140,142,141,138,140][i])}</g>`).join("")+
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
  // Damals-Fotos der Kapitel: alle in voller Farbe, verschiedene Typen, passend zum Kapiteltext
  const a=storyIsle("past","96 70 236 118");
  const L=[{skin:1,hair:4,style:18,shirt:5,pat:0},{skin:4,hair:0,style:11,shirt:6,pat:2},{skin:2,hair:2,style:16,shirt:12,pat:3,beard:4},{skin:5,hair:6,style:15,shirt:8,pat:1},
    {skin:0,hair:5,style:8,shirt:13,pat:0,acc:[6],accC:10},{skin:3,hair:1,style:13,shirt:3,pat:9,beard:1},{skin:1,hair:7,style:10,shirt:11,pat:3,beard:4,acc:[2]}];
  const NM=["Mo","Ida","Ben","Zoe","Lu","Tom","Opa"];
  const g=(x,y,i,cheer,sc)=>{const f=figure({id:"d"+n+i,name:NM[i],kind:"mensch",born:-999,lv:4,lvFull:true,cheer:!!cheer,look:Object.assign({acc:[],accC:0,eye:0,beard:0},L[i])},0,0);
    return `<g transform="translate(${x} ${y})${sc?` scale(${sc})`:""}"><g class="bob" style="animation-delay:${(i*.3)%1.2}s">${f}</g></g>`};
  const lt=(x)=>`<g transform="translate(${x} 132)"><path d="M-8 0h16l-3-40h-10z" fill="#F3F1EA"/><path d="M-7 -12h14M-6 -24h12" stroke="#FF9C7A" stroke-width="4"/><rect x="-6" y="-48" width="12" height="9" rx="2" fill="#FFD27A"/><path d="M-6 -44L-70 -60v28z" fill="#FFE9A8" opacity=".55"/></g>`;
  const phone=`<g transform="translate(176 141) rotate(-14)"><rect x="-3" y="-1.6" width="6" height="3.4" rx=".7" fill="#2B3350"/><rect x="-2.4" y="-1.1" width="4.8" height="2.4" rx=".4" fill="#5A6380"/></g><path d="M170 132l2 2M182 131l-2 2M176 129v2.4" stroke="#FFD27A" stroke-width=".9" stroke-linecap="round"/>`;
  const bub=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-8" y="-6" width="16" height="10" rx="4" fill="#F3F1EA"/><path d="M-3 4l-2 4 6-4z" fill="#F3F1EA"/><path d="M-4 -1h8M-4 1.6h5" stroke="#9EA3B8" stroke-width="1" stroke-linecap="round"/></g>`;
  const dock=`<g class="wave fb"><path d="M104 166h64l-10 12h-44z" fill="#FF9C7A"/><path d="M140 166v-36l24 32z" fill="#F3F1EA"/><path d="M136 166v-28l-18 26z" fill="#B6A4FF"/>${g(122,166,4,true,.85)}${g(150,166,5,true,.85)}</g>`;
  const bridge=`<path d="M96 140q24-26 48 0" fill="none" stroke="#8A5A3B" stroke-width="4" stroke-linecap="round"/><path d="M106 134v6M120 125v15M134 134v6" stroke="#8A5A3B" stroke-width="2"/>`;
  const art=[
    phone+g(194,140,0,true)+g(226,140,1),                                                                   // Das stille Dorf: das erste Handy liegt im Sand
    `<g transform="translate(200 146)">${itemSvg("bank")}</g>`+g(190,140,2)+g(212,140,3)+bub(176,100)+bub(226,98), // Erste Gespräche
    lt(150)+g(186,140,4,true)+g(210,140,6),                                                                 // Licht am Horizont: erstes Großprojekt
    dock+g(214,140,3,true)+g(238,140,2),                                                                    // Neue Gesichter: Boot legt an
    partyArt(),                                                                                              // Das erste Fest
    bridge+g(120,124,1,true)+g(200,140,2)+g(226,140,5,true),                                                // Die Brücke
    lt(116)+partyArt()+hearts(170,92)][n]||"";                                                              // OffLand lebt
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
  const ppl=(xs,y,ph)=>kids.slice(0,xs.length).map((r,i)=>`<g class="bob" style="animation-delay:${i*.3}s">${figure(Object.assign({},r,{sick:null},ph?{phone:true}:{phone:false,lvFull:true,cheer:i!==1}),xs[i],y)}</g>${ph?phoneIn(xs[i],y):""}`).join("");   // Damals bunt und fröhlich, später Smombies
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
  let said=-1; const talk=()=>{if(!box.isConnected) return; const i=idx(), x=sl[i]; if(i===said||!x) return; said=i;   // Fenster schon zu: kein Ton mehr
    speak(x.who==="both"?[["luc",""],["bay","Hilfst du mir, OffLand zurückzuholen? Weniger Handy, mehr Leben."]]:[["bay",x.t]],i===0?1.2:.1)};
  box.onscroll=()=>{if(!box.isConnected) return; upd(); clearTimeout(box._t); box._t=setTimeout(talk,180)};
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
  if(r.kind==="mensch") return stage(r)==="kind"||stage(r)==="baby"||r.sick?"-13 -24 26 27":"-13 -29.4 26 30";
  if(!ART_BOX[r.art]) return "-13 -24 26 27";
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
  if(r.fur!=null&&(r.fur<n||r.fur===99)) return r.fur;   // 99 = goldenes Fell (Plus)
  if(r.parents&&!depth&&h%3!==0){const p=S.residents.find(x=>x.id===r.parents[h%r.parents.length]);if(p&&p.art===r.art)return animalVar(p,1)}
  return h%n;
}
/* Tiere: Ursprung = Füße bzw. Wasserlinie, Blick nach links */
const furGold=art=>{const k=Object.keys((FUR[art]||[])[1]||{}), G=["#F4C752","#D9A43A","#B8862B"]; return Object.fromEntries(k.map((c,i)=>[c,G[Math.min(i,2)]]))};
function animalSvg(art,v){
  let out=animalShape(art);
  const map=v===99?furGold(art):(FUR[art]||[])[v||0];
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
/* Ausstattung der Tiere: Halsband und Brille. e = Auge (Brille), e2 = zweites Auge,
   n = Halsband als Strecke quer über den Hals, f = 1 wenn das Tier nach rechts schaut */
const GEAR={Huhn:{e:[-5.6,-11.6],n:[-4.6,-8.2,-2.4,-10.2]},Ziege:{e:[-9.6,-14.4],n:[-8.84,-10.3,-5.16,-13.1]},Schaf:{e:[-8.4,-9.2],n:[-6,-5.8,-5,-11.2]},
  Esel:{e:[-10.6,-15.6],n:[-9.55,-11.75,-5.65,-14.85]},Katze:{e:[-5.4,-10.6],e2:[-2.8,-10.6],n:[-3.8,-6,-0.6,-8.6]},Hund:{e:[-7,-12.6],n:[-4.8,-7.4,-2.2,-10.2]},
  Meerschweinchen:{e:[-7.4,-7.2],n:[-4.2,-3.4,-3.4,-9.4]},Hase:{e:[-5.8,-9.4],n:[-4.4,-5.6,-1.6,-7.8]},Robbe:{e:[3.6,-9.6],f:1},Delfin:{e:[-9.4,-8.4]},Wal:{e:[-10.4,-6.6]},
  Papagei:{e:[-3,-18],n:[-3.6,-14.4,3.4,-13.8]},Elch:{e:[-11,-19.6],n:[-8.84,-15.16,-5.16,-18.84]},Kamel:{e:[-12,-23],n:[-10.9,-16.9,-7.1,-18.1]},"Eisbär":{e:[-10.6,-12],n:[-4.9,-8,-3.9,-14]}};
const COLLAR_NAMES=["Ohne","Halsband","Glöckchen","Halstuch","Fliege","Goldkette"], SPECS_NAMES=["Ohne","Sonnenbrille","Pilotenbrille","Herzbrille","Sportbrille","Goldbrille"];   // jeweils das letzte: Plus
const hasCollar=art=>!!(GEAR[art]&&GEAR[art].n);
function gearSvg(art,g){
  const G=GEAR[art]; if(!G||!g) return "";
  let s="";
  const f=v=>(+v).toFixed(2);
  if(g.collar&&G.n){
    const [x1,y1,x2,y2]=G.n, c=SHIRT[g.cc||0]||SHIRT[0], mx=(x1+x2)/2, my=(y1+y2)/2, L=Math.hypot(x2-x1,y2-y1)||1, ux=(x2-x1)/L, uy=(y2-y1)/L;
    let nx=-uy, ny=ux; if(ny<0||(Math.abs(ny)<.3&&nx>0)){nx=-nx;ny=-ny}
    const P=(k,j=0)=>`${f(mx+nx*k+ux*j)} ${f(my+ny*k+uy*j)}`, C=k=>`cx="${f(mx+nx*k)}" cy="${f(my+ny*k)}"`;
    if(g.collar===5){s+=`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#E0A93C" stroke-width="1.2" stroke-linecap="round" stroke-dasharray=".6 .45"/><circle ${C(1.6)} r="1.15" fill="#FFD27A" stroke="#E0A93C" stroke-width=".3"/><path d="M${P(1.6,-.45)}L${P(1.6,.45)}" stroke="#E0A93C" stroke-width=".3"/>`;}
    else if(g.collar===3) s+=`<path d="M${x1} ${y1}L${x2} ${y2}L${P(2.8)}z" fill="${c}" stroke="${c}" stroke-width=".8" stroke-linejoin="round"/><circle ${C(1)} r=".35" fill="#F3F1EA" opacity=".8"/>`;
    else s+=`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
    if(g.collar===1) s+=`<circle ${C(.9)} r=".55" fill="#FFD27A"/>`;
    if(g.collar===2) s+=`<circle ${C(1.3)} r="1" fill="#FFD27A" stroke="#C9A35A" stroke-width=".3"/><circle ${C(1.7)} r=".25" fill="#8A5A3B"/>`;
    if(g.collar===4) s+=`<path d="M${P(.2)}L${P(1.2,-1.6)}L${P(-.8,-1.6)}zM${P(.2)}L${P(1.2,1.6)}L${P(-.8,1.6)}z" fill="${c}" stroke="${c}" stroke-width=".5" stroke-linejoin="round"/><circle ${C(.2)} r=".5" fill="${c}" stroke="#14151F" stroke-opacity=".3" stroke-width=".25"/>`;
  }
  if(g.specs){
    const back=G.f?-1:1, eyes=G.e2?[G.e,G.e2]:[G.e], ey=G.e[1];
    const outer=back>0?eyes.reduce((a,e)=>e[0]>a[0]?e:a):eyes.reduce((a,e)=>e[0]<a[0]?e:a);
    const armC=g.specs===2||g.specs===5?"#E0B04A":g.specs===3?"#C93E78":g.specs===4?"#8FB34F":"#14151F";
    const arm=`<path d="M${f(outer[0]+1.5*back)} ${f(outer[1]-.3)}L${f(outer[0]+3.6*back)} ${f(outer[1]-.9)}" stroke="${armC}" stroke-width=".45" stroke-linecap="round"/>`;
    const lens=([x,y])=>{switch(g.specs){
      case 2: return `<path d="M${f(x-1.7)} ${f(y-1)}h3.4q.2 2.4-1.7 2.6q-1.9-.2-1.7-2.6z" fill="#2C4770" stroke="#E0B04A" stroke-width=".35"/>`;
      case 3: return `<path d="M${f(x)} ${f(y+1.3)}l-1.6-1.6a.9 .9 0 0 1 1.6-1.1a.9 .9 0 0 1 1.6 1.1z" fill="#FF6FA8" stroke="#C93E78" stroke-width=".3"/>`;
      case 5: return `<circle cx="${f(x)}" cy="${f(y)}" r="1.6" fill="#FFD27A" fill-opacity=".4" stroke="#E0A93C" stroke-width=".45"/><path d="M${f(x-.8)} ${f(y-.6)}l.5-.35" stroke="#FFF6D8" stroke-width=".3" stroke-linecap="round"/>`;
      default: return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.65" ry="1.3" fill="#14151F" stroke="#3A3D58" stroke-width=".3"/><path d="M${f(x-.9)} ${f(y-.5)}l.6-.4" stroke="#F3F1EA" stroke-width=".35" stroke-linecap="round" opacity=".7"/>`;
    }};
    if(g.specs===4){const xs=eyes.map(e=>e[0]), a=Math.min(...xs)-1.9, w=Math.max(...xs)+1.9-a;
      s+=arm+`<path d="M${f(a)} ${f(ey-.9)}h${f(w)}v1.5q${f(-w/2)} 1 ${f(-w)} 0z" fill="#C8F169" stroke="#8FB34F" stroke-width=".3"/><path d="M${f(a+.5)} ${f(ey-.5)}h${f(w*.45)}" stroke="#F3F1EA" stroke-width=".3" opacity=".8"/>`;}
    else s+=arm+(eyes.length>1?`<path d="M${f(eyes[0][0]+1.5)} ${f(ey-.3)}H${f(eyes[1][0]-1.5)}" stroke="#14151F" stroke-width=".4"/>`:"")+eyes.map(lens).join("");
  }
  return s;
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
const ITEM_W={t_bar:30,t_papagei:18,t_muschelweg:30,t_steg:34,t_nest:30,t_lagune:36,f_bank:28,f_sauna:28,f_nistkasten:14,f_heide:28,f_troll:14,f_boot:32,o_kissen:32,o_taube:20,o_blumen:28,o_spiel:32,o_sterne:30,o_mosaik:26,o_sanduhr:12,a_fellbank:28,a_futterhaus:18,a_rodel:30,a_nordlicht:32,a_iglu:28,a_robben:32,truhe:28,pokal:22,goldanker:26,siegerbanner:22,t_kanu:30,t_kokos:26,t_haengematte:30,t_orchidee:26,t_tiki:20,t_huette:32,t_surf:22,t_flamingo:22,f_kanu:30,f_schaukel:26,f_beeren:28,f_feuerschale:18,f_scheune:34,f_moos:24,f_wimpel:34,f_runen:14,o_teppich:34,o_dattel:28,o_tee:26,o_wasser:28,o_zelt:34,o_kaktus:26,o_laternen:16,a_eisloch:26,a_kakao:24,a_feuerkorb:16,a_eisbahn:38,a_huskys:44,a_schneemann:16,a_laternen:16,a_eisskulptur:18,teich:36,picknick:34,garten:32,sandburg:30,schaukel:30,spielplatz:28,haengematte:28,stall:28,blumen:28,palme:26,bank:26,feuer:22,brunnen:24,sternwarte:26,bienen:22,schirm:30,vogelhaus:20,zwerg:12,laternen:12,glocke:18,teleskop:28,muschelweg:34,regenbogen:34};
const ITEM_H={t_bar:20,t_papagei:30,t_muschelweg:8,t_steg:16,t_nest:10,t_lagune:10,f_bank:12,f_sauna:28,f_nistkasten:28,f_heide:14,f_troll:18,f_boot:22,o_kissen:9,o_taube:30,o_blumen:14,o_spiel:18,o_sterne:20,o_mosaik:18,o_sanduhr:20,a_fellbank:10,a_futterhaus:24,a_rodel:14,a_nordlicht:26,a_iglu:14,a_robben:14,truhe:24,pokal:26,goldanker:28,siegerbanner:34,t_kokos:22,t_haengematte:28,t_tiki:26,t_huette:30,t_surf:28,t_flamingo:24,f_schaukel:36,f_scheune:28,f_wimpel:22,f_runen:22,o_dattel:36,o_tee:22,o_zelt:28,o_laternen:26,a_kakao:24,a_feuerkorb:28,a_huskys:16,a_schneemann:26,a_laternen:24,a_eisskulptur:16,palme:30,laternen:28,vogelhaus:30,schirm:26,glocke:28,sternwarte:30,schaukel:26,haengematte:20,spielplatz:22,stall:22,bienen:24,teleskop:24,feuer:24};
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
  const W=curWorld(), T=W.theme||{}, home=W.id==="heimat", lag=lagune();   // lag: Inselstil „Goldene Lagune“ (Plus)
  const two=has(W.isle2), three=has(W.isle3);
  const lastD=S.days[S.days.length-1];
  const clouds=S.glueck<40||(lastD&&lastD.min>S.budget&&!lastD.sunny);
  const nTrees=1+Math.min(3,Math.floor(savedTotal()/600));
  const sk=skyNow(), sea=season(), sleep=sleeping();
  const night=sk.k==="nacht"||sleep;
  let s=`<svg viewBox="0 0 360 240" role="img" aria-label="Deine Insel mit ${here().length} Bewohnern, Inselglück ${S.glueck} Prozent">`;
  s+=`<rect width="360" height="240" fill="${clouds?"#2A2E40":night?"#1B2340":lag?(sk.k==="tag"?"#F7C98E":"#F2A98A"):(!home&&sk.k==="tag")?T.sky:sk.sky}"/>`;
  // Himmel sitzt tiefer, weil die Gesamtansicht oben 44 abschneidet
  s+=`<g transform="translate(0 38)">`;
  // Polarlicht
  if(S.aurora>0&&night&&!clouds) s+=`<g class="glow" style="animation-duration:5s"><path d="M0 60q60-40 120-10t120-20 120 10v-30q-60-20-120 0t-120 10-120-10z" fill="#5BF0A4" opacity=".5"/><path d="M0 80q80-30 160 0t200-20v-14q-80 10-180-12t-180 20z" fill="#B6A4FF" opacity=".4"/></g>`;
  if(night&&!clouds){s+=`<g fill="#F3F1EA"><circle cx="30" cy="24" r="1.6"/><circle cx="110" cy="40" r="1.2"/><circle cx="200" cy="18" r="1.8"/><circle cx="300" cy="44" r="1.3"/><circle cx="250" cy="70" r="1"/></g><circle cx="286" cy="34" r="14" fill="#F3F1EA"/><circle cx="293" cy="29" r="13" fill="#1B2340"/>`}
  s+=`</g>`;
  // Sonne unter die abgeschnittene Kante und weg vom Pfeil rechts oben
  if(!(night&&!clouds)&&sk.sun&&!clouds) s+=`<circle cx="${sk.sun[0]>180?sk.sun[0]-34:sk.sun[0]+52}" cy="${Math.max(sk.sun[1],72)}" r="16" fill="${sk.sun[2]}"/>`;
  if(owns("regenbogen")&&!night) s+=`<g fill="none" stroke-width="5" opacity=".75"><path d="M40 170a140 120 0 0 1 280 0" stroke="#FF9C7A"/><path d="M46 170a134 114 0 0 1 268 0" stroke="#FFD27A"/><path d="M52 170a128 108 0 0 1 256 0" stroke="#C8F169"/><path d="M58 170a122 102 0 0 1 244 0" stroke="#7CB8E8"/><path d="M64 170a116 96 0 0 1 232 0" stroke="#B6A4FF"/></g>`;
  // Zugvögel
  if(S.birds>0) s+=`<g class="drift" style="animation-duration:5s">${[0,1,2,3,4].map(i=>`<path d="M${120+i*16} ${50+Math.abs(i-2)*8}q5-5 10 0q5-5 10 0" stroke="${night?"#F3F1EA":"#14151F"}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  if(!home) s+=horizonSvg(T.horizon,false,night||clouds);
  // Inselglück in Stufen: 0 karg, 1 normal, 2 blühend, 3 voller Leben
  const lvl=S.glueck<40?0:S.glueck<60?1:S.glueck<80?2:3, calm=clouds||night;
  // Tiefe: Nachbarinseln im Dunst hinter dem Meer (Heimat; andere Welten haben ihren eigenen Horizont)
  if(home) s+=`<g fill="${calm?"#2E4166":lvl?"#6E9FC6":"#8696A6"}" opacity=".55"><path d="M0 172c20-18 50-24 80-12l10 12z"/><path d="M290 172c18-14 44-18 70-8v8z"/></g>`;
  s+=`<rect y="170" width="360" height="120" fill="${clouds?"#26314A":night?(lag?"#1E5568":"#24375A"):lag?"#22B5BE":home?sk.sea:T.sea}"/>`;
  let sand=clouds?"#BDB08C":"#E9D7A6", grass=clouds?"#5E8A5C":sea==="winter"?"#DDE6EE":sea==="herbst"?"#A9B86A":"#7FC57A";
  let leaf=clouds?"#4A7550":sea==="herbst"?"#E08A3C":sea==="winter"?"#5E8A6C":"#4E9A58";
  if(!home){sand=T.sand;grass=T.grass;leaf=T.leaf;if(clouds){sand="#BDB08C";grass="#7A8A70"}}
  if(home&&lvl===0&&sea!=="winter"){sand="#D6C9A4";grass="#B3A882";leaf="#9A8E7A"}   // karge Insel
  if(lag&&!clouds){sand="#F2D27A";grass=sea==="winter"?"#E6EEDC":"#8ED16E";leaf="#3FA35A"}
  const cx=two?120:180;
  // Spiegelung und Glitzern im Wasser
  s+=`<ellipse cx="${cx}" cy="194" rx="100" ry="10" fill="${calm||!lvl?"#8FA0A8":"#9CD3C4"}" opacity="${calm?.12:lvl?.35:.2}"/>`;
  if(lag&&!clouds){   // Lagune: Flamingos im flachen Wasser und goldenes Glitzern
    s+=[[30,198,1],[54,206,-1]].map(([x,y,k])=>`<g transform="translate(${x} ${y}) scale(${k} 1)"><path d="M0 0v-9M2 0l-1-9" stroke="#E06A92" stroke-width=".9"/><ellipse cx="0" cy="-11" rx="4.2" ry="2.6" fill="#FF8FB1"/><path d="M3 -12q3-1 2-6t2-6" stroke="#FF8FB1" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="7" cy="-24" r="1.6" fill="#FF8FB1"/><path d="M8.4 -24l2.2 .9-.8 1z" fill="#2A2C3E"/></g>`).join("");
    s+=`<g fill="#FFD27A">${[[90,200],[250,214],[320,198],[180,226]].map(([x,y],i)=>`<path class="glow" style="animation-delay:${i*.4}s" d="M${x} ${y-3}l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>`).join("")}</g>`;
  }
  if(!clouds) s+=`<g stroke="${lag?"#FFE7A3":"#F3F1EA"}" stroke-linecap="round" stroke-width="1.6" opacity="${night?.35:lvl?.75:.3}">${[[40,190,14],[90,206,10],[250,200,16],[310,190,10],[150,222,12],[220,230,9],[60,228,8],[332,216,12]].slice(0,lvl?8:4).map(([x,y,w],i)=>`<path class="glow" style="animation-delay:${i*.3}s" d="M${x} ${y}h${w}"/>`).join("")}</g>`;
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
  if(home) guestNow().forEach((g,i)=>{const sea=SEA.includes(g.art), x=sea?[cx+136,cx-138][i]:[cx-104,cx+104][i], y=sea?214:192;
    s+=`<g data-guest="${g.id}" class="guest" transform="translate(${x} ${y})" role="button" aria-label="${esc(artikel(g.art,true)+" "+g.art)} ist zu Besuch"><title>${esc(artikel(g.art,true)+" "+g.art)} ist zu Besuch</title><g class="${sea?"wave":"bob"}">${figure(guestRes(g),0,0)}</g>
      <g transform="translate(0 -27)"><rect x="-17" y="-6.5" width="34" height="11" rx="5.5" fill="#FFB86B"/><text y="1.6" text-anchor="middle" font-size="7" font-weight="800" fill="#14151F" font-family="Manrope, sans-serif">Besuch</text></g></g>`});
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
  if(clouds) s+=`<g transform="translate(0 30)">${cloudsSvg()}</g>`;
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
/* Fanpost: Verwandte und Nachbarinseln schreiben, was sie Gutes über die Insel gehört haben.
   Aus Anrede, Inhalt und Gruß zusammengesetzt; freshLine sorgt dafür, dass sich Inhalte nicht schnell wiederholen */
/* Besuch bei voller Insel: anschauen, weiterziehen lassen oder gegen ein anderes Tier tauschen (mit Rückfrage) */
/* Besuch: zwei Tage am Strand sichtbar, Antippen öffnet wieder die Frage nach dem Tausch */
const guestNow=()=>(S.guests||[]).filter(g=>g.until>S.dayCount);
const guestRes=g=>({id:g.id,name:"Besuch",kind:"tier",art:g.art,status:"da"});
function guestDays(art){const g=guestNow().find(x=>x.art===art); return !g||g.until-S.dayCount>1?"bis übermorgen":"noch bis morgen"}
function bindGuests(){document.querySelectorAll("[data-guest]").forEach(b=>b.onclick=()=>{const g=guestNow().find(x=>x.id===b.dataset.guest); if(g&&!$("#modalRoot").innerHTML) guestSheet({type:"guest",art:g.art})})}
function guestSheet(ev){
  const cand=here().filter(r=>r.kind==="tier"&&!isPet(r)&&r.art!==ev.art).slice(0,8);   // nur Tiere, die einen Platz belegen
  const all=LAND.concat(SEA).concat(FAR_ANIMALS), seen=new Set(S.residents.filter(r=>r.kind==="tier").map(r=>r.art).concat(S.seenArts||[]));
  const er=GENUS[ev.art]==="f"?"sie":GENUS[ev.art]==="n"?"es":"er";
  sheet(`<div style="align-self:center" class="pop fb">${avatarSvg(ev.art,120)}</div>
    <p class="label" style="color:var(--lime)">Besuch</p><h2>${esc(artikel(ev.art,true))} ${esc(ev.art)} schaut vorbei!</h2>
    <p class="muted">Die Insel ist gerade voll. Für deine Sammlung zählt der Besuch schon: Tierart ${all.filter(a=>seen.has(a)).length} von ${all.length}.</p>
    ${cand.length?`<p style="font-weight:700">Soll ${er} bleiben? Dann zieht dafür ein anderes Tier zu Freunden auf die Möweninsel.</p>
    <div class="swap-row">${cand.map(r=>`<button type="button" class="swap" data-swap="${r.id}">${avatarSvg(r.art,40)}<span><b>${esc(r.name)}</b><small>${esc(r.art)}</small></span></button>`).join("")}</div>`:""}
    <p class="small muted">Sonst bleibt ${er} ${guestDays(ev.art)} zu Besuch am Strand. Antippen auf der Insel, um es dir anders zu überlegen.</p>
    <button class="btn${cand.length?" secondary":""}" data-ok>Nur zu Besuch</button>`,
    ()=>document.querySelectorAll("#modalRoot [data-swap]").forEach(b=>b.onclick=()=>guestConfirm(ev,b.dataset.swap)));
}
function guestConfirm(ev,id){
  const old=S.residents.find(r=>r.id===id); if(!old) return guestSheet(ev);
  const neu=artikel(ev.art)+" "+ev.art;
  $("#modalRoot").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true">
    <div class="row" style="justify-content:center;gap:18px;align-items:center">${avatarSvg(old.art,84)}<svg width="34" height="20" viewBox="0 0 34 20" aria-hidden="true"><path d="M2 10h26M20 3l8 7-8 7" fill="none" stroke="#A4A6BD" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${avatarSvg(ev.art,84)}</div>
    <p class="label" style="color:var(--amber)">Wirklich tauschen?</p>
    <h2>${esc(old.name)} zieht für ${esc(neu)} um</h2>
    <p class="muted">${esc(old.name)} (${esc(old.art)}) zieht zu Freunden auf die Möweninsel und kommt nicht zurück. Dafür bleibt ${esc(neu)} auf deiner Insel.</p>
    <button class="btn" id="swapYes">Ja, ${esc(old.name)} gehen lassen</button>
    <button class="btn ghost" id="swapNo">Zurück</button></div></div>`;
  $("#swapYes").onclick=()=>guestSwap(ev.art,id);
  $("#swapNo").onclick=()=>guestSheet(ev);
}
/* Besuch bleibt: ein anderes Tier zieht dafür zu Freunden auf die Möweninsel (kommt nicht zurück) */
function guestSwap(art,id){
  const old=S.residents.find(r=>r.id===id&&r.status==="da"); if(!old) return;
  old.status="umgezogen"; old.movedDay=S.lastDay;
  if(old.pair){const p=S.residents.find(x=>x.id===old.pair); if(p&&p.pair===old.id) p.pair=null; old.pair=null}
  const r={id:uid(),name:freeName(ANIMAL_NAMES,S.residents.map(x=>x.name)),kind:"tier",art,pair:null,status:"da",ret:0,born:S.dayCount};
  if(!SEA.includes(art)&&adults().length) r.owner=pick(adults()).id;
  S.residents.push(r); stat("besuch_bleibt"); S.guests=(S.guests||[]).filter(g=>g.art!==art);
  log(old.name+" ("+old.art+") ist zu Freunden auf die Möweninsel gezogen. Dafür bleibt "+artikel(art)+" "+art+" auf der Insel!","good");
  chron([old.id,r.id],old.name+" zog auf die Möweninsel, "+artikel(art)+" "+art+" ist geblieben.");
  S.pending.unshift({type:"arrival",id:r.id,partner:null});
  save(); closeModal(); render(); showPending();
}
function makeFanCard(){
  const fresh=(tag,list)=>{const seen=S.fanLog||(S.fanLog=[]); let idx=list.map((_,i)=>i).filter(i=>!seen.includes(tag+i)); if(!idx.length){S.fanLog=seen.filter(k=>!k.startsWith(tag));idx=list.map((_,i)=>i)}
    const i=pick(idx); S.fanLog.push(tag+i); if(S.fanLog.length>40) S.fanLog.shift(); return list[i]};
  const ppl=here().filter(r=>r.kind==="mensch"), r=pick(ppl), n=r.name, used=S.residents.map(x=>x.name);
  const rel=pick(["Oma","Opa","Tante","Onkel","Patentante","Patenonkel","Cousine","Cousin"]), m=["Opa","Onkel","Patenonkel","Cousin"].includes(rel);
  const der=m?"der":"die", eure=m?"Euer":"Eure", who=freeName(HUMAN_NAMES,used);
  const have=new Set(S.postcards.map(c=>c.motif)), freshM=MOTIFS.filter(x=>!have.has(x.id)), motif=pick(freshM.length?freshM:MOTIFS);
  const place={moewen:"von der Möweninsel",sonne:"aus dem Kliffdorf",berg:"aus dem Bergsee-Dorf",hafen:"aus der Hafenstadt",nacht:"aus dem Strandcamp",wal:"aus dem hohen Norden"}[motif.id]||"von der Nachbarinsel";   // mit Präposition
  const job=jobName(r.job), room=occupied()<capacity();
  const kind=wpickF([{k:"fam",w:45},{k:"nachbar",w:25},{k:"beruf",w:job?15:0},{k:"kommt",w:15}]).k;
  let t="", soon=false;
  if(kind==="fam"){
    const open=pick(["Liebe Insel!","Hallo zusammen!","Ihr Lieben,","Moin, liebe Inselleute!",`Hallo ${n}!`]);
    let me=open.includes(n)?`Hier ist ${der} ${rel}.`:`Hier schreibt ${der} ${rel} von ${n}.`; if(open.endsWith(",")) me=me[0].toLowerCase()+me.slice(1);
    const body=fresh("f",[
      `${n} schreibt mir, dass ihr abends zusammensitzt, statt aufs Handy zu schauen. Da wird mir ganz warm ums Herz.`,
      `Am Telefon hat ${n} mir neulich richtig zugehört, ganz ohne nebenbei zu tippen. Was macht ihr da bloß auf eurer Insel?`,
      `${n} hat mir einen echten Brief geschrieben. Mit der Hand! Er hängt jetzt an meinem Kühlschrank.`,
      `Ich habe ein Foto bekommen: ${n} am Steg, die Füße im Wasser, kein Handy weit und breit. Das hängt jetzt bei mir im Flur.`,
      `${n} hat mir vom Lagerfeuer und euren Geschichten erzählt. Darf ich mal mitkommen?`,
      `Früher hat ${n} beim Essen nur aufs Display geschaut. Jetzt erzählt ${n} mir von Möwen und Sternbildern.`,
      `Ich stricke gerade einen Schal für ${n}. Abends am Strand soll es bei euch ja frisch werden.`,
      `${n} hat mir am Telefon erklärt, wie man Steine übers Wasser hüpfen lässt. Ich übe noch.`,
      `Die ganze Familie redet von ${n}s Insel. Wir sind ehrlich gesagt ein bisschen neidisch.`,
      `${n} erzählt, dass das Schlafen bei euch endlich wieder klappt. Ihr macht da etwas richtig.`,
      `Ich habe ${n} ein Glas Marmelade geschickt. Teilt sie bitte mit allen auf der Insel.`,
      `Seit ${n} bei euch wohnt, ruft ${n} sonntags an und erzählt vom Meer statt von Videos. Das ist der schönste Anruf der Woche.`,
      `${n} hat mir ein Rezept vom Inselfest geschickt. Ich habe es gleich nachgekocht, die Nachbarn waren begeistert.`,
      `Neulich hat ${n} gefragt, wie es mir eigentlich geht. Einfach so. Ich musste mich kurz hinsetzen.`
    ]);
    const dein=open.includes(n)?(m?"Dein":"Deine"):eure;
    const close=pick([`Herzlich, ${dein} ${rel}`,`${dein} ${rel}`,`Bis bald! ${dein} ${rel}`,`Drückt alle von mir! ${dein} ${rel}`,`Viele Grüße vom Festland, ${dein} ${rel}`]);
    t=`${open} ${me} ${body} ${close}`;
  } else if(kind==="nachbar"){
    const body=fresh("n",[
      `Bei uns erzählt man sich von eurer Insel: Dort hören sich die Leute wirklich zu.`,
      `Unser Leuchtturmwärter sagt, bei euch brennt abends das Lagerfeuer länger als die Bildschirme. Respekt!`,
      `Wir haben gehört, ihr spielt abends Karten statt zu scrollen. Wir haben es ausprobiert und kommen nicht mehr davon los.`,
      `Eure Möwen haben uns verraten, dass ihr gerade richtig gute Tage habt. Weiter so!`,
      `Bei uns hängt jetzt ein Zettel am Hafen: „Macht es wie die Nachbarn.“ Damit seid ihr gemeint.`,
      `Ein Fischer hat uns von euch erzählt. So entspannte Leute hätte er lange nicht gesehen, meinte er.`,
      `Bei uns gibt es seit Neuestem einen Korb am Steg, in den alle ihr Handy legen. Die Idee haben wir von euch.`,
      `Wir feiern bald ein Fest und wollten fragen: Wie schafft ihr es, dass alle mitmachen und keiner aufs Handy schaut?`,
      `Ein Boot voller Leute von eurer Insel war bei uns. Sie haben die ganze Fahrt über geredet und gelacht. Das hat sich herumgesprochen.`
    ]);
    t=`${pick(["Moin "+place+"!","Grüße "+place+"!","Hallo, liebe Nachbarn!"])} ${body} ${pick([who+" und Familie","Eure Nachbarn "+place,who+" "+place])}`;
  } else if(kind==="beruf"){
    t=fresh("b",[
      `Ich habe gehört, ${n} arbeitet bei euch als ${job} und ist richtig gut darin. Sag liebe Grüße! ${who} ${place}`,
      `Von ${n} als ${job} schwärmen hier alle. Wenn ${n} mal Urlaub macht: Wir hätten ein Gästezimmer frei. ${who} ${place}`,
      `Unsere Kinder wollen jetzt alle ${job} werden, so wie ${n}. Danke für das Vorbild! ${who} und Familie`,
      `Man erzählt sich, dass ${n} als ${job} immer Zeit für ein Gespräch hat. Das ist selten geworden. ${who} ${place}`
    ]);
  } else {
    soon=room;
    t=room?fresh("k",[
      `Liebe Inselleute, wir haben so viel Gutes von euch gehört. Wir packen schon die Koffer und kommen bald vorbei! ${who} und Familie`,
      `${n} hat uns so von eurer Insel vorgeschwärmt, dass wir es selbst erleben wollen. Habt ihr noch einen Platz frei? Wir sind bald da! ${who}`,
      `Hier auf dem Festland ist alles so laut. Bei euch soll man wieder durchatmen können. Wir kommen! ${who} ${place}`
    ]):fresh("v",[
      `Liebe Inselleute, wir haben so viel Gutes von euch gehört. Sobald bei euch ein Platz frei wird, kommen wir vorbei! ${who} und Familie`,
      `Wir haben gehört, bei euch ist gerade alles voll. Kein Wunder bei dem, was man so hört! Wir warten gern auf einen freien Platz. ${who} ${place}`,
      `Eure Insel ist ausgebucht, sagt man. Wir drücken die Daumen, dass bald ein Platz frei wird. Wir hätten nämlich große Lust! ${who} und Familie`
    ]);
  }
  if(soon) S.arrC=Math.max(S.arrC||0,2);   // der nächste glückliche Tag bringt jemanden Neues
  const card={id:uid(),day:S.lastDay,motif:motif.id,text:t,animal:null,fan:true,soon};
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
/* Homescreen-Widget auf dem iPhone: Glück, Serie, Bewohner. Nur schicken, wenn sich etwas geändert hat. */
let WIDGET_LAST="";
function widgetSync(){
  if(!ST_NATIVE||!S||!S.setup) return;
  const h=here(), json=JSON.stringify({lang:window.OFFLAND_LANG||"de",budget:S.budget||180,name:TR(curWorld().name),glueck:Math.round(S.glueck),streak:S.budgetStreak||0,
    people:h.filter(r=>r.kind==="mensch").length,animals:h.filter(r=>r.kind!=="mensch").length,entered:S.lastDay||""});
  shieldSync();
  if(json===WIDGET_LAST) return; WIDGET_LAST=json;
  try{ST_NATIVE.widget({json}).catch(()=>{})}catch(e){}
}
let SETUP_AUTO=false;
function viewSetup(){
  return `<div class="card">
    <h2>Willkommen${ACC?", "+esc(ACC.name):""}!</h2>
    <p class="muted">Lege fest, wie viel Bildschirmzeit du dir pro Tag geben willst, und wie viel es bisher im Schnitt war.</p>
    <label class="field" for="setBudget">Tagesbudget: <span id="setBudgetOut" class="num">${hm(S.budget)}</span>
      <input id="setBudget" type="range" min="30" max="480" step="15" value="${S.budget}"></label>
    <div class="field"><span>Bisheriger Schnitt pro Tag</span>
      <div class="row fr-seg setup-seg" role="radiogroup" aria-label="Bisheriger Schnitt"><button type="button" class="${SETUP_AUTO?"":"on"}" data-basemode="hand" aria-pressed="${!SETUP_AUTO}">Selbst eingeben</button><button type="button" class="${SETUP_AUTO?"on":""}" data-basemode="auto" aria-pressed="${SETUP_AUTO}">Automatisch messen</button></div></div>
    ${SETUP_AUTO?`<p class="small muted">OffLand misst deine erste Woche mit${ST===ST_SIM?" (in der Web-Version als Simulation)":""}. Danach steht hier dein echter Schnitt. Bis dahin rechnen wir mit dieser Schätzung:</p>`
      :`<p class="small muted">Du findest ihn auf dem iPhone unter Einstellungen → Bildschirmzeit → „Alle Aktivitäten anzeigen“ (Tagesdurchschnitt), auf Android unter „Digital Wellbeing“.</p>`}
    <label class="field" for="setBase">${SETUP_AUTO?"Vorläufige Schätzung":"Bisheriger Schnitt"}: <span id="setBaseOut" class="num">${hm(S.baseline)}</span>
      <input id="setBase" type="range" min="30" max="600" step="15" value="${S.baseline}"></label>
    <button type="button" class="btn secondary" id="stAvg">📱 Tagesdurchschnitt vom ${ST===ST_SIM?"Handy":"iPhone"} anzeigen</button>
    <p class="small muted">Deine ersten Bewohner heißen ${here().map(r=>esc(r.name)).join(", ")}. Umbenennen kannst du sie unter „Bewohner“.</p>
    <button class="btn" id="startBtn">Insel starten</button>
  </div>`;
}
/* Erste Woche automatisch gemessen: danach wird der bisherige Schnitt auf den Messwert gesetzt */
function baseCheck(){
  const m=S.baseMeasure; if(!m||m.done) return;
  const ds=S.days.filter(d=>d.day>=m.since); if(ds.length<7) return;
  const avg=Math.round(ds.slice(0,7).reduce((a,d)=>a+d.min,0)/7/5)*5;
  m.done=true; m.old=S.baseline; S.baseline=Math.max(30,avg);
  S.pending.push({type:"baseline",old:m.old,avg:S.baseline}); stat("schnitt_gemessen");   // kommt gleich nach der Tagesbilanz (PEND_ORDER)
}
function viewHeute(){
  const [mText,mCls]=mood();
  const nd=nextDay(), ok=canClose()&&!S.vacation;
  const last=S.days[S.days.length-1];
  const p=curProjects()[S.projectIdx];
  const warn=S.warn?S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean):null;
  const wisher=S.wish?S.residents.find(r=>r.id===S.wish.rid):null;
  const canNight=feature("nacht")&&S.lastDay&&!sleeping()&&(S.testmode||S.lastDay===today())&&!(S.night&&S.night.after===S.lastDay);
  const mons=(S.monsters||[]).map(id=>S.apps.find(a=>a.id===id)).filter(Boolean);
  const guard=S.vacation&&S.vacation.guard?S.residents.find(r=>r.id===S.vacation.guard):null;
  const closeFirst=ok&&(new Date().getHours()>=17||S.testmode);
  const entry=ok&&(closeFirst||ENTRY_OPEN);
  const last0=S.days[S.days.length-1], v0=last0?last0.min:Math.min(S.budget,150), smax=entryMax();
  const form=`<div id="closeCard" class="entry2">
    <p class="label">${nd===today()?"Heute eintragen":"Eintragen · "+nice(nd)}</p>
    ${S.repair?`<p class="small" style="color:var(--amber)">Reparatur möglich: Bleib heute im Budget, dann holst du ${S.repair.amount} % Glück zurück.</p>`:""}
    <div class="tin" aria-label="Bildschirmzeit">
      <label for="inH" class="sr">Stunden</label><input id="inH" class="tin-n" type="number" min="0" max="24" inputmode="numeric" value="${Math.floor(v0/60)}"><span>h</span>
      <label for="inM" class="sr">Minuten</label><input id="inM" class="tin-n tin-m" type="number" min="0" max="59" step="5" inputmode="numeric" value="${String(v0%60).padStart(2,"0")}"><span>min</span></div>
    <p class="small muted" id="stNote">am Handy · Wert aus den Handy-Einstellungen</p>
    ${ST&&!S.autoTime&&!S.stNoLink?`<button class="st-link" id="stEntry">⚡ Automatisch messen lassen</button>`:""}
    <div class="tslide"><input id="inR" type="range" min="0" max="${smax}" step="5" value="${Math.min(v0,smax)}" aria-label="Bildschirmzeit einstellen">
      <span class="tgoal" style="left:${(S.budget/smax*100).toFixed(1)}%"><b>Ziel ${hm(S.budget)}</b></span></div>
    <div class="tticks">${[0,1,2,3].map(k=>`<span>${Math.round(smax*k/3/60)} h</span>`).join("")}</div>
    <p class="live-prev" id="liveTxt" aria-live="polite"></p>
    ${feature("monster")?`<details><summary style="cursor:pointer;font-weight:700;min-height:44px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px">oder pro App eintragen ›</summary>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:6px">${S.apps.map(a=>`<label class="field" for="app_${a.id}" style="font-size:13px">${esc(a.name)} <span class="muted" style="font-weight:500">Limit ${a.limit} min</span><input id="app_${a.id}" type="number" min="0" max="1440" inputmode="numeric" placeholder="Minuten"></label>`).join("")}</div>
    </details>`:""}
    <button class="btn big" id="closeBtn">Tag abschließen</button></div>`;
  const [gl,glC]=[S.glueck+" %",mCls==="good"?"var(--lime)":mCls==="ok"?"var(--amber)":"var(--coral)"];
  return `
  <div class="scene-chips glass">
    <div class="cp"><i>Glück</i><b style="color:${glC}">${gl}</b></div>
    <div class="cp"><i>Bewohner</i><b>${occupied()}/${capacity()}</b></div>
    <div class="cp"><i>Punkte</i><b style="color:var(--lilac)">${S.points}</b></div>
  </div>
  ${S.vacation?`<div class="card" style="border:1.5px solid var(--lilac)"><p class="label" style="color:var(--lilac)">Urlaubsmodus</p><p>${guard?`<b>${esc(guard.name)}</b> hütet die Insel, bis du zurück bist.`:"Die Insel schläft, bis du zurück bist."} Das Glück sinkt in der Zeit nicht.</p><button class="btn secondary" id="vacOff">Ich bin zurück</button></div>`:""}
  ${heuteMain(ok,nd,entry?form:"")}
  ${warn?`<div class="card warn"><p class="label" style="color:var(--amber)">Wegzug droht</p><p><b>${esc(groupName(warn))}</b> ${vb(warn,"packt","packen")} die Koffer. Bring das Inselglück bis ${nice(S.warn.deadline)} über 40 %, dann ${vb(warn,"bleibt "+esc(warn[0].name),"bleiben alle")}.</p></div>`:""}
  ${planCard()}
  ${actionCard(ok)}
  ${forYou(wisher)}
  ${mons.length?`<div class="card" style="border:1.5px solid #9B6BD6"><p class="label" style="color:#C8A8FF">App-Monster vor der Insel</p>${mons.map(a=>`<div class="row"><svg width="48" height="40" viewBox="-24 -34 48 40" aria-hidden="true">${monsterSvg(a.m)}</svg><p class="grow">${esc(monName(a,false))}: ${esc(a.name)} lag gestern über ${hm(a.limit)}.</p></div>`).join("")}<p class="small muted">Bleib heute bei diesen Apps unter dem Limit, dann tauchen sie wieder ab.</p></div>`:""}
  ${friendsCard()}
  ${S.setup?(()=>{const wh=whispers();return `<div class="sec-h"><span>Inselgeflüster</span>${wh.length>1?`<button class="linkbtn" id="whMore">mehr ›</button>`:""}</div>
  <div class="card whisper">${whisperRow(null,lucLine())}${wh.slice(0,1).map(w=>whisperRow(w.r,w.t)).join("")}</div>`})():""}`;
}
let ENTRY_OPEN=false, CU_KEY=null;
/* Nach dem Eintragen: große Zahl zählt hoch, Balken füllt sich (einmal pro Tag) */
function countUpMain(){
  const big=$(".hm-big[data-cu]"); if(!big) return;
  const key=S.lastDay+"|"+S.days.length; if(CU_KEY===key) return; const first=CU_KEY!==null; CU_KEY=key;
  if(!first) return;   // beim App-Start nicht, nur direkt nach dem Eintragen
  const to=+big.dataset.cu, reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches; if(reduce||!to) return;
  const bw=$(".hm-bar[data-w]"), bar=bw&&bw.querySelector("i"), w=bw?bw.dataset.w:0;
  if(bar){bar.style.transition="none";bar.style.width="0";requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition="width 1.1s cubic-bezier(.2,.8,.2,1)";bar.style.width=w+"%"}))}
  const t0=performance.now();(function step(t){const k=Math.min(1,(t-t0)/1100);big.textContent=hm(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step)})(t0);
}
function ringSvg(pct,big,small,col){
  return `<svg class="ring" width="92" height="92" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" fill="none" stroke="#2C2F45" stroke-width="3.4"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="${col}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${Math.max(.02,Math.min(1,pct))*97.4} 97.4" transform="rotate(-90 18 18)"/><text x="18" y="17.6" text-anchor="middle" font-size="${String(big).length>4?6.2:7}" font-weight="800" fill="#F3F1EA" font-family="Manrope, sans-serif">${big}</text><text x="18" y="23.4" text-anchor="middle" font-size="3.6" fill="#A4A6BD" font-family="Manrope, sans-serif">${small}</text></svg>`;
}
/* Heute: eine Hauptaktion je nach Tageszustand (eintragen → Fokus-Bootsfahrt → abends Gute Nacht) */
function actionCard(ok){
  if(!S.setup||S.vacation||S.boat) return "";
  const boot=feature("boot")&&adults().length, night=feature("nacht")&&S.lastDay&&!sleeping()&&(S.testmode||S.lastDay===today())&&!(S.night&&S.night.after===S.lastDay);
  const eve=new Date().getHours()>=20;
  const chip=(id,ic,t)=>`<button class="act-chip" id="${id}">${ic} ${t}</button>`;
  const calm=chip("calmBtn","🌊",S.calmDay===today()?"Inselminute ✓":"Inselminute");
  if(sleeping()) return `<div class="card act"><p class="act-sleep">🌙 Die Insel schläft. Bis morgen!</p><div class="act-row">${calm}</div></div>`;
  let main="", hint="", side=[];
  if(ok){ side=[boot?chip("boatGo","⛵","Fokus-Bootsfahrt"):"",calm] }   // vor dem Eintragen ist das Eintragen die Hauptsache
  else if(night&&(eve||!boot)){ main=`<button class="btn big" id="nightBtn">🌙 Gute Nacht, Insel</button>`; hint="Handy weglegen · morgen gibt es Traumpunkte"; side=[boot?chip("boatGo","⛵","Fokus-Bootsfahrt"):"",calm] }
  else if(boot){ main=`<button class="btn big" id="boatGo">⛵ Fokus-Bootsfahrt starten</button>`; hint="Handy weg · ein Bewohner fährt fischen"; side=[night?chip("nightBtn","🌙","Gute Nacht"):"",calm] }
  else side=[calm];
  return `<div class="card act">${main}${hint?`<p class="act-hint">${hint}</p>`:""}<div class="act-row">${side.join("")}</div></div>`;
}
function boatPick(){
  sheet(`<p class="label">Fokus-Bootsfahrt</p><h2>Wie lange legst du das Handy weg?</h2><p class="muted">Ein Bewohner fährt so lange fischen und bringt Punkte mit.</p>
    <div class="boat-pick">${[15,25,45,60].map(m=>`<button class="btn secondary" data-boat="${m}">${m} min</button>`).join("")}</div><button class="btn ghost" data-ok>Abbrechen</button>`,
    ()=>document.querySelectorAll("#modalRoot [data-boat]").forEach(x=>x.onclick=()=>{closeModal();focusSheet(+x.dataset.boat)}));
}
/* Heute: Hauptkarte (letzter eingetragener Tag) – große Zahl, schmaler Balken, Wochensäulen, Eintragen */
function heuteMain(ok,nd,form){
  if(form) return `<div class="card hmain">${form}</div>`;
  const last=S.days[S.days.length-1], week=S.days.slice(-7), good=last&&last.min<=S.budget;
  const col=!last||good?"var(--lime)":"var(--coral)", diff=last?Math.abs(S.budget-last.min):0;
  const pl=S.plan&&!S.plan.res&&S.plan.day>today()?PLANS.find(x=>x.id===S.plan.id):null;   // Vorhaben für heute hat eine eigene Karte
  const pills=[last&&last.pts>0&&last.day===S.lastDay?`<span class="hm-pill pts">+${last.pts} Punkte</span>`:"",S.budgetStreak>1?`<span class="hm-pill" title="${S.budgetStreak} Tage in Folge im Ziel">🔥 ${S.budgetStreak}</span>`:"",
    shieldStatsCache&&shieldStatsCache.day===today()&&shieldStatsCache.resisted>0?`<span class="hm-pill" title="Heute ${shieldStatsCache.resisted}× der Insel zuliebe eine App nicht geöffnet">🛡️ ${shieldStatsCache.resisted}</span>`:"",
    last?`<span class="hm-pill${S.jokerWk===isoWeek(today())?" off":""}" title="${S.jokerWk===isoWeek(today())?"Joker diese Woche genutzt":"Joker bereit"}">🃏</span>`:""].join("");
  // Balken: verbrauchte Zeit bis zum Budget (bei mehr: voll, Rest rot)
  const used=last?Math.min(1,last.min/S.budget):0;
  const bar=last?`<div class="hm-bar" data-w="${used*100}" role="img" aria-label="${hm(last.min)} von ${hm(S.budget)}"><i style="width:${used*100}%;background:${col}"></i></div>
    <div class="hm-scale"><span>${hm(last.min)} am Handy</span><span>Ziel ${hm(S.budget)}</span></div>`:"";
  // Wochensäulen: Höhe nach Minuten, gestrichelte Linie = Budget, letzter Tag hervorgehoben
  const PH=48, top=Math.max(S.budget*1.3,...week.map(d=>d.min)), hgt=m=>Math.max(5,PH*m/top);
  const cols=week.length>1?`<div class="hm-week" role="img" aria-label="${week.filter(d=>d.min<=S.budget).length} von ${week.length} Tagen im Ziel">
    <div class="hm-plot" style="height:${PH}px"><span class="hm-goal" style="bottom:${hgt(S.budget).toFixed(1)}px"></span>
      ${week.map((d,i)=>`<span class="hm-col${i===week.length-1?" now":""}" title="${nice(d.day)}: ${hm(d.min)}"><i style="height:${hgt(d.min).toFixed(1)}px;background:${d.min<=S.budget?"var(--lime)":"var(--coral)"}"></i></span>`).join("")}</div>
    <div class="hm-days">${week.map((d,i)=>`<b${i===week.length-1?' class="now"':""}>${parse(d.day).toLocaleDateString(LOC,{weekday:"narrow"})}</b>`).join("")}</div></div>`:"";
  const foot=form||(ok?`<button class="btn" id="goalGo">${nd===today()?"Tag eintragen":"Tag eintragen · "+nice(nd)}</button>`
    :S.vacation?"":`<p class="hm-done"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>Heute ist eingetragen. Bis morgen!</p>`);
  return `<div class="card hmain">
    <div class="hm-head"><p class="label">${last?dayLabel(last.day):"Dein Tagesziel"}</p>${pills?`<div class="hm-pills">${pills}</div>`:""}</div>
    <h3 class="hm-title">${last?`<span class="hm-big" style="color:${col}" data-cu="${diff}">${hm(diff)}</span><span class="hm-word">${good?"unter dem Ziel":"über dem Ziel"}</span>`
      :`<span class="hm-big">${hm(S.budget)}</span><span class="hm-word">Bildschirmzeit am Tag</span>`}</h3>
    ${last||form?"":`<p class="small muted">Trag abends ein, wie lange du am Handy warst.</p>`}
    ${pl?`<p class="small muted">Vorhaben morgen: ${esc(pl.n)}</p>`:""}
    ${bar}${cols}
    ${foot}
  </div>`;
}
/* Für dich: Kapitel, Wunsch, Wochenrückblick, Neues: zum Wischen nebeneinander */
function forYou(wisher){
  const it=[];
  if(S.chapter!=null&&S.setup){const c=CHAPTERS[S.chapter]; if(c){const pr=c.prog();
    it.push(`<div class="fy"><div class="row" style="gap:10px"><span class="says-pic" style="background:#2A2F45;width:38px;height:38px">${bayPic(34)}</span><div><p class="k" style="color:var(--amber)">Kapitel ${S.chapter+1}</p><b>${esc(c.n)}</b></div></div><p class="small muted">${esc(pr||c.goal)}</p></div>`)}}
  if(S.wish&&wisher){const w=S.wish, type=w.type||"item";
    it.push(`<div class="fy"><p class="k" style="color:var(--lilac)">Wunsch von ${esc(wisher.name)}</p><b>${esc(wishText(w))}</b><p class="small muted">+${w.pts||30} Punkte · +${w.gl||6} % Glück${type==="streak"?` · ${w.have}/${w.need} Tage`:""}</p>${type==="item"?`<button class="linkbtn" id="wishShop">Zum Laden ›</button>`:""}</div>`)}
  const fc=festCard(); if(fc) it.push(fc);
  if(S.weekReady&&today()<=S.weekReady.until)
    it.push(`<div class="fy"><p class="k" style="color:var(--lime)">Neu</p><b>Inselwoche KW ${+S.weekReady.wk.split("-W")[1]}</b><button class="linkbtn" id="weekReadyBtn">Ansehen ›</button></div>`);
  const f=nextFeature(); if(f&&S.setup){const left=f.day-S.dayCount;
    it.push(`<div class="fy dashed"><p class="k" style="color:var(--muted)">Bald freigeschaltet</p><b>${esc(f.name)}</b><p class="small muted">${left<=1?"Nach dem nächsten Tag":"In "+left+" Tagen"}</p></div>`)}
  if(!it.length) return "";
  // Wunsch und Fest zuerst, dann Kapitel & Co.; mehrere Karten wischt man seitlich durch
  const order=[...it.filter(x=>!/Kapitel|dashed/.test(x)),...it.filter(x=>/Kapitel|dashed/.test(x))];
  return `<div class="sec-h"><span>Für dich</span>${order.length>1?`<span class="small muted">${order.length} Karten · wischen</span>`:""}</div><div class="${order.length>1?"fy-row":"fy-one"}">${order.join("")}</div>`;
}
function whisperRow(r,t){
  const pic=r?`<div class="avatar" style="background:${r.kind==="mensch"?"#26233D":SEA.includes(r.art)?"#1F2A3A":"#22301F"}"><svg width="40" height="40" viewBox="${figVB(r)}" aria-hidden="true">${figure(r,0,0)}</svg></div>`:`<div class="avatar" style="background:#26233D">${lucPic(40)}</div>`;
  return `<div class="row" style="align-items:flex-start">${pic}<div class="grow bubble"><p class="small" style="font-weight:700;color:var(--lilac)">${r?esc(r.name)+(r.job?" · "+esc(jobName(r.job)):""):"Lucifer · Inselkatze"}</p><p>${esc(t)}</p></div></div>`;
}
function whisperSheet(){
  sheet(`<p class="label">Inselgeflüster</p><h2>Was heute erzählt wird</h2><div class="whisper" style="display:flex;flex-direction:column;gap:10px">${whisperRow(null,lucLine())}${whispers().map(w=>whisperRow(w.r,w.t)).join("")}</div><button class="btn" data-ok>Schließen</button>`);
}
/* Entwicklermodus: 7-mal auf die Versionszeile in den Einstellungen tippen (lokal immer an) */
const APP_VERSION="1.65";
function devMode(){try{return localStorage.getItem("offland-dev")==="1"||/^(localhost|127\.0\.0\.1)$/.test(location.hostname)}catch(e){return false}}
/* „Heute“, „Gestern“ oder Datum */
function dayLabel(d){return d===today()?"Heute":d===addDays(today(),-1)?"Gestern":nice(d)}
function entryMax(){return Math.min(720,Math.max(360,Math.ceil(S.budget*2/60)*60))}
function liveUpdate(){
  const h=$("#inH"), m=$("#inM"), r=$("#inR"), t=$("#liveTxt"); if(!h||!m) return;
  const min=clamp((+h.value||0)*60+(+m.value||0),0,1440), good=min<=S.budget, col=good?"var(--lime)":"var(--coral)";
  [h,m].forEach(x=>{if(x.classList.contains("tin-n")) x.style.width=(Math.max(1,String(x.value).length)*.56+.06)+"em"});   // Feld so breit wie die Zahl
  if(r){r.value=Math.min(min,+r.max); r.style.setProperty("--p",(Math.min(min,+r.max)/r.max*100)+"%"); r.style.setProperty("--c",col)}
  if(!t) return;
  t.classList.toggle("bad",!good);
  t.textContent=good?(S.budget-min>=5?"🌞 "+hm(S.budget-min)+" unter dem Ziel. Deine Insel wächst heute!":"🌤️ Genau im Ziel. Deine Insel freut sich!")
    :"☁️ "+hm(min-S.budget)+" über dem Ziel. Es wird bewölkt auf der Insel …";
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
    friend?"befreundet mit "+friend[0].name:"", foe?"zerstritten mit "+foe[0].name:"", parents.length?"Kind von "+parents.map(p=>p.name).join(" & "):"", r.status==="weg"?(r.ret>=5?"möchte zurück, wartet auf einen freien Platz":"Rückkehr "+r.ret+"/5 gute Tage"):""].filter(Boolean).join(" · ");
  const bg=r.kind==="mensch"?"#26233D":SEA.includes(r.art)?"#1F2A3A":"#22301F";
  return `<div class="res" data-q="${esc((r.name+" "+(r.kind==="mensch"?"":r.art)+" "+sub).toLowerCase())}"><div class="avatar" style="background:${bg}"><svg width="40" height="40" viewBox="${figVB(r)}" aria-hidden="true">${figure(r,0,0)}</svg></div>
    <div class="grow res-txt"><p class="res-name"><b>${esc(r.name)}</b><span class="chip sm ${mCls}">${mText}</span></p><p class="small muted res-sub">${esc(sub||"Bewohner:in")}</p></div>
    ${r.sick&&S.tea>0?`<button class="iconbtn" style="width:44px;height:44px;background:#22301F" data-tea="${r.id}" aria-label="${esc(r.name)} Kräutertee geben"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8F169" stroke-width="2" stroke-linecap="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></svg></button>`:""}
    ${r.status==="da"?`<button class="iconbtn" style="width:44px;height:44px" data-rename="${r.id}" aria-label="${esc(r.name)} bearbeiten"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B6A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button>`:""}
  </div>`;
}
/* Viele Bewohner: kompaktes Raster (ab 7 Menschen bzw. 7 Tieren), Antippen zeigt die ausführliche Zeile mit Bearbeiten und Kräutertee */
function resLabel(r){
  if(r.kind!=="mensch") return r.art;
  return r.job?(r.retired?"Rentner:in":jobName(r.job)):(S.dayCount-(r.born||0)>=3?"Schulkind":"Baby");
}
function resTile(r){
  const mensch=r.kind==="mensch", bg=mensch?"#26233D":SEA.includes(r.art)?"#1F2A3A":"#22301F";
  const flag=r.status!=="da"?"gone":r.sick?"bad":r.sad||r.phone?"warn":"";
  const q=(resRow(r).match(/data-q="([^"]*)"/)||[])[1]||"";   // gleiche Suchbegriffe wie die ausführliche Zeile
  const lbl=resLabel(r), note=r.sick?"krank":r.status==="weg"?"weg":r.phone&&mensch?"am Handy":r.sad?"traurig":mensch&&lvOf(r)<4?LV_NAMES[lvOf(r)]:"";
  return `<button type="button" class="ani-tile${flag?" "+flag:""}" data-rt="${r.id}" data-q="${q}" aria-label="${esc(r.name)}, ${esc(lbl)}${note?", "+note:""}">
    <span class="avatar" style="background:${bg}"><svg width="40" height="40" viewBox="${figVB(r)}" aria-hidden="true">${figure(r,0,0)}</svg></span>
    <b>${esc(r.name)}</b><span class="small muted">${esc(lbl)}${note?" · "+note:""}</span></button>`;
}
function resSheet(id){
  const r=S.residents.find(x=>x.id===id); if(!r) return;
  sheet(`<p class="label">${esc(resLabel(r))}</p><div class="card" style="padding:4px 12px">${resRow(r)}</div><button class="btn secondary" data-ok>Schließen</button>`,()=>{
    const row=$("#modalRoot .res-txt"); if(row) row.classList.add("open");
    document.querySelectorAll("#modalRoot [data-tea]").forEach(x=>x.onclick=()=>{closeModal();giveTea(x.dataset.tea)});
    document.querySelectorAll("#modalRoot [data-rename]").forEach(x=>x.onclick=()=>nameSheet({type:"rename",id:x.dataset.rename}));
  });
}
function viewBewohner(){
  const humans=S.residents.filter(r=>r.kind==="mensch"&&r.status!=="verstorben"), animals=S.residents.filter(r=>r.kind==="tier"&&r.status!=="verstorben"&&r.status!=="umgezogen");
  const H=here(), land=H.filter(r=>!isSea(r)), happy=H.filter(r=>!r.sick&&!r.sad&&!r.phone).length;
  const [mText,mCls]=mood(), glC=mCls==="good"?"var(--lime)":mCls==="ok"?"var(--amber)":"var(--coral)";
  // Bild: Dorfplatz am Abend, die Bewohner im Halbkreis ums Lagerfeuer, Tiere am Rand
  const ppl=land.filter(r=>r.kind==="mensch").slice(0,10), ani=[], n=ppl.length;
  land.filter(r=>r.kind!=="mensch").forEach(r=>{if(ani.length<4&&!ani.some(a=>a.art===r.art)) ani.push(r)});   // vier verschiedene Arten
  const aSlot=[[24,140],[336,140],[100,148],[262,148]], gst=guestNow().filter(g=>!SEA.includes(g.art)).slice(0,2);   // Besuch steht vorne am Rand
  const fig=(r,x,y,k)=>`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k})"><g class="bob" style="animation-delay:${Math.round(x)%7/5}s">${figure(r,0,0)}</g></g>`;
  const pos=ppl.map((r,i)=>{const a=Math.PI*(0.12+0.76*i/Math.max(1,n-1));return [n===1?150:180-Math.cos(a)*130,134-Math.sin(a)*18]});
  const order=pos.map((q,i)=>i).sort((a,b)=>pos[a][1]-pos[b][1]);
  const lights=[...Array(14)].map((_,i)=>`<circle class="lamp-tw" style="animation-delay:${(i*.13).toFixed(2)}s" cx="${40+i*20}" cy="${(42+Math.sin(i/13*Math.PI)*14).toFixed(1)}" r="2.6" fill="${["#FFD27A","#FF9C7A","#C8F169","#B6A4FF"][i%4]}"/>`).join("");
  const strip=`<svg viewBox="0 0 360 200" role="img" aria-label="${H.length} Bewohner am Lagerfeuer" style="width:100%;height:auto;display:block"><defs><linearGradient id="bwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2F6B"/><stop offset=".7" stop-color="#C46D7A"/><stop offset="1" stop-color="#F2A374"/></linearGradient><radialGradient id="bwGlow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>
    <rect width="360" height="200" fill="url(#bwSky)"/><circle cx="300" cy="30" r="1.4" fill="#fff"/><circle cx="60" cy="18" r="1.2" fill="#fff"/><circle cx="210" cy="14" r="1" fill="#fff"/>
    <rect y="96" width="360" height="104" fill="#3E4F86"/><path d="M-10 200c10-60 90-96 190-96s180 32 190 96z" fill="#5E7F4E"/><path d="M-10 200c30-40 110-62 190-62s160 22 190 62z" fill="#4E6E42"/>
    <path d="M40 38q140 32 280 0" stroke="#2A2340" stroke-width="1" fill="none"/>${lights}
    <circle cx="180" cy="128" r="80" fill="url(#bwGlow)"/>
    ${order.filter(i=>pos[i][1]<128).map(i=>fig(ppl[i],pos[i][0],pos[i][1],1.7)).join("")}
    <g transform="translate(180 136) scale(1.4)"><path d="M-12 4l24-6M-12 -2l24 6" stroke="#6B4430" stroke-width="3" stroke-linecap="round"/><g class="fire-fl"><path d="M0 -2c-8 0-10-8-4-16 0 4 3 5 3 5 0-6 3-9 5-11 0 5 4 8 4 13 0 6-3 9-8 9z" fill="#FF9C7A"/><path d="M0 -2c-4 0-5-4-2-8 1 2 2 2 2 2 0-3 2-4 3-5 0 3 2 4 2 6 0 3-2 5-5 5z" fill="#FFD27A"/></g></g>
    ${order.filter(i=>pos[i][1]>=128).map(i=>fig(ppl[i],pos[i][0],pos[i][1],1.8)).join("")}
    ${ani.slice(0,4-gst.length).map((r,i)=>fig(r,aSlot[i+gst.length][0],aSlot[i+gst.length][1],1.25)).join("")}
    ${gst.map((g,i)=>`<g data-guest="${g.id}" class="guest">${fig(guestRes(g),aSlot[i][0],aSlot[i][1],1.25)}<g transform="translate(${aSlot[i][0]+(i?-6:6)} ${aSlot[i][1]-36})"><rect x="-20" y="-7" width="40" height="13" rx="6.5" fill="#FFB86B"/><text y="2.4" text-anchor="middle" font-size="8.5" font-weight="800" fill="#14151F" font-family="Manrope, sans-serif">Besuch</text></g></g>`).join("")}</svg>`;
  const wisher=S.wish?S.residents.find(r=>r.id===S.wish.rid&&r.status==="da"):null;
  const main=S.wish&&wisher?wishCard(S.wish,wisher)
    :`<div class="card"><div class="row" style="gap:14px;align-items:center">${ringSvg(S.glueck/100,S.glueck+" %","Inselglück",S.glueck>=40?"#C8F169":"#FF9C7A")}<div class="grow"><p class="label">Inselglück</p><h3 class="hm-title" style="color:${glC}">${mText}</h3><p class="small muted">Ab 80 % zieht alle 3 Tage jemand ein. Unter 40 % gibt es öfter Streit, nach 3 Tagen droht Wegzug.</p></div></div></div>`;
  const news=[];
  if(S.conflict){const a=S.residents.find(r=>r.id===S.conflict.a), b=S.residents.find(r=>r.id===S.conflict.b); if(a&&b) news.push(`<div class="fy"><p class="k" style="color:var(--coral)">Streit</p><b>${esc(a.name)} und ${esc(b.name)}</b><p class="small muted">Ein guter Tag hilft beim Versöhnen.</p></div>`)}
  guestNow().forEach(g=>news.push(`<button type="button" class="fy" data-guest="${g.id}" style="text-align:left;border:0;color:inherit;font:inherit;cursor:pointer"><p class="k" style="color:var(--amber)">Zu Besuch</p><b>${esc(artikel(g.art,true)+" "+g.art)}</b><p class="small muted">${guestDays(g.art)==="bis übermorgen"?"Noch 2 Tage da.":"Noch bis morgen da."} Antippen zum Tauschen.</p></button>`));
  H.filter(r=>r.sick).forEach(r=>news.push(`<div class="fy"><p class="k" style="color:var(--amber)">Krank</p><b>${esc(r.name)}</b><p class="small muted">${esc(r.sick.kind)}${S.tea?" · Kräutertee im Vorrat":""}</p></div>`));
  H.filter(r=>r.phone).slice(0,2).forEach(r=>news.push(`<div class="fy"><p class="k" style="color:var(--lilac)">Am Handy</p><b>${esc(r.name)}</b><p class="small muted">Ein Tag im Budget holt jemanden zurück.</p></div>`));
  if(S.warn){const w=S.warn.ids.map(id=>S.residents.find(r=>r.id===id)).filter(Boolean); if(w.length) news.push(`<div class="fy"><p class="k" style="color:var(--amber)">Wegzug droht</p><b>${esc(groupName(w))}</b><p class="small muted">Glück bis ${nice(S.warn.deadline)} über 40 %</p></div>`)}
  return `
  <div class="hero-card">${strip}</div>
  <div class="scene-chips glass">
    <div class="cp"><i>Menschen</i><b>${H.filter(r=>r.kind==="mensch").length}</b></div>
    <div class="cp"><i>Tiere</i><b>${H.filter(r=>r.kind!=="mensch").length}</b></div>
    <div class="cp"><i>Glück</i><b style="color:${glC}">${S.glueck} %</b></div>
  </div>
  ${main}
  ${news.length?`<div class="sec-h"><span>Gerade los</span></div><div class="fy-row">${news.join("")}</div>`:""}
  ${humans.length+animals.length>10?`<input id="resSearch" class="res-search" type="search" placeholder="Bewohner suchen: Name, Tier, Beruf …" aria-label="Bewohner suchen" autocomplete="off">
  <p class="small muted" id="resNone" hidden style="padding:0 4px">Niemand gefunden.</p>`:""}
  <details class="res-sec" data-fold="m" ${(S.bwFold||{}).m?"":"open"}><summary class="sec-h"><span>Menschen <span class="num muted">${humans.length}</span></span><span class="small muted" style="text-transform:none;letter-spacing:0">${occupied()}/${capacity()} Plätze${humans.length>6?" · Antippen für Details":""}</span></summary>
  ${humans.length>6?`<div class="ani-grid">${humans.map(resTile).join("")}</div>`:`<div class="card">${humans.map(resRow).join("")||`<p class="muted">Noch niemand.</p>`}</div>`}</details>
  <details class="res-sec" data-fold="t" ${(S.bwFold||{}).t?"":"open"}><summary class="sec-h"><span>Tiere <span class="num muted">${animals.length}</span></span>${animals.length>6?`<span class="small muted" style="text-transform:none;letter-spacing:0">Antippen für Details</span>`:""}</summary>
  ${animals.length>6?`<div class="ani-grid">${animals.map(resTile).join("")}</div>`:`<div class="card">${animals.map(resRow).join("")||`<p class="muted">Noch keine Tiere.</p>`}</div>`}</details>
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
  const lived=new Set(S.residents.filter(r=>r.kind==="tier").map(r=>r.art)), seen=new Set([...lived].concat(S.seenArts||[]));
  const all=LAND.concat(SEA).concat(FAR_ANIMALS);
  return `<div class="card"><div class="row between"><p class="label">Tierarten entdeckt</p><span class="small muted num">${all.filter(a=>seen.has(a)).length} / ${all.length}</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${all.map(a=>{const ok=seen.has(a);
    return `<div style="background:var(--ground);border-radius:14px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;${ok?"":"opacity:.4"}">
      <svg width="48" height="34" viewBox="${artVB(a,48/34)}" aria-hidden="true">${ok?animalSvg(a):`<g opacity=".5" style="filter:brightness(0) invert(.45)">${animalSvg(a)}</g>`}</svg>
      <span style="font-size:${ok&&a.length>9?"9.5px":"11px"};letter-spacing:${ok&&a.length>9?"-.2px":"0"};font-weight:700;text-align:center;line-height:1.2;max-width:100%">${ok?(a==="Meerschweinchen"?"Meer&shy;schweinchen":a):"?"}</span>${ok&&!lived.has(a)?`<span style="font-size:10px;color:var(--lime);font-weight:700">zu Besuch</span>`:""}</div>`}).join("")}</div>
  <p class="small muted">Delfine und Wale kommen erst, wenn der Leuchtturm steht. Papagei, Elch, Kamel und Eisbär leben nur in fernen Inselwelten.</p></div>`;
}
/* Tab Zeit: gewonnene Zeit mit Wochenbalken, Inseljahr als Kalender, Umrechnungen als Sammelkarten */
let zeitPage=0, zeitSel=null;
const ZT_COL=["#B9A6FF","#C8F169","#FFB86B","#7FD4E8","#FF9C7A"];
function dayCol(d){return d.min<=S.budget*.75?"#C8F169":d.min<=S.budget?"#8FB34F":"#FF9C7A"}
function zeitCal(){
  const by={}; S.days.forEach(d=>by[d.day]=d);
  const end=S.lastDay&&S.lastDay>today()?S.lastDay:today(), wd=(parse(end).getDay()+6)%7;
  const mon=addDays(end,-wd-7*12-zeitPage*91), W=13, cw=22.6;
  const first=S.days.length?S.days[0].day:end;
  let cells="";
  for(let w=0;w<W;w++) for(let d=0;d<7;d++){
    const day=addDays(mon,w*7+d), x=S.days.length?by[day]:null, sel=x&&x.day===zeitSel;
    if(day>end){cells+=`<rect x="${20+w*cw}" y="${d*cw}" width="19" height="19" rx="6" fill="#1A1C2C"/>`;continue}
    cells+=x?`<rect x="${20+w*cw}" y="${d*cw}" width="19" height="19" rx="6" fill="${dayCol(x)}" data-zday="${day}" style="cursor:pointer"${sel?' stroke="#F3F1EA" stroke-width="2.5"':""}><title>${nice(day)}: ${hm(x.min)}</title></rect>`
      :`<rect x="${20+w*cw}" y="${d*cw}" width="19" height="19" rx="6" fill="#26283B"/>`;
  }
  const lbl=["Mo","","Mi","","Fr","","So"].map((l,d)=>l?`<text x="0" y="${d*cw+14}" font-family="Manrope, sans-serif" font-size="10" fill="#A4A6BD">${l}</text>`:"").join("");
  const m=s=>parse(s).toLocaleDateString(LOC,{month:"short"}).replace(".","");
  const lastCol=addDays(mon,W*7-1), range=m(mon)===m(lastCol>end?end:lastCol)?m(mon):m(mon)+" – "+m(lastCol>end?end:lastCol);
  const older=first<mon, newer=zeitPage>0;
  const sd=by[zeitSel]||S.days[S.days.length-1];
  const ev=sd?(S.feed||[]).find(f=>f.day===sd.day&&f.kind==="good"):null;
  return `<div class="sec-h zt-h"><span>Dein Inseljahr</span><span class="zt-nav"><button class="zt-arr" id="ztOld" aria-label="Frühere Wochen"${older?"":" disabled"}>‹</button>${range}<button class="zt-arr" id="ztNew" aria-label="Spätere Wochen"${newer?"":" disabled"}>›</button></span></div>
  <div class="card"><svg viewBox="0 0 316 160" style="width:100%;height:auto;display:block" id="ztCal" role="img" aria-label="Kalender der letzten Wochen">${lbl}${cells}</svg>
    <div class="row small muted" style="gap:12px;flex-wrap:wrap"><span><b style="color:#C8F169">■</b> weit drunter</span><span><b style="color:#8FB34F">■</b> im Ziel</span><span><b style="color:#FF9C7A">■</b> drüber</span></div>
    ${sd?`<div class="zt-day"><div class="row between"><p class="label" style="color:${dayCol(sd)===`#FF9C7A`?"var(--coral)":"var(--lime)"}">${nice(sd.day)}</p><span class="small muted">Ziel ${hm(S.budget)}${sd.pts?` · <b style="color:var(--lime)">+${sd.pts} P</b>`:""}</span></div>
      <p class="hm-title" style="font-size:24px">${hm(sd.min)}</p>${ev?`<p class="small muted">${esc(ev.text)}</p>`:""}</div>`:`<p class="small muted">Sobald du Tage einträgst, füllt sich hier dein Inseljahr.</p>`}
  </div>`;
}
function zeitBest(){
  if(S.days.length<7) return "";
  const avgBy=f=>{const g={};S.days.forEach(d=>{const k=f(d);(g[k]=g[k]||[]).push(d.min)});return Object.entries(g).filter(([,v])=>v.length>=2).map(([k,v])=>[k,v.reduce((a,b)=>a+b,0)/v.length]).sort((a,b)=>a[1]-b[1])[0]};
  const bm=avgBy(d=>d.day.slice(0,7)), bw=avgBy(d=>(parse(d.day).getDay()+6)%7);
  const WD=["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
  return `<div class="row zt-chips">${bm?`<div class="cp"><i>Bester Monat</i><b>${parse(bm[0]+"-01").toLocaleDateString(LOC,{month:"long"})}</b></div>`:""}${bw?`<div class="cp"><i>Bester Wochentag</i><b>${WD[bw[0]]}</b></div>`:""}</div>`;
}
function zeitCards(saved){
  const got=ACTS.filter(a=>saved>=a.min).sort((a,b)=>b.min-a.min), next=ACTS.filter(a=>saved<a.min).sort((a,b)=>a.min-b.min)[0];
  const cards=got.map((a,i)=>{const c=Math.floor(saved/a.min);return `<button class="zt-card" style="background:${ZT_COL[i%ZT_COL.length]}" data-zshare="${ACTS.indexOf(a)}" aria-label="${c} ${esc(c===1?SING[a.n]||a.n:a.n)} teilen"><span class="zt-top"><span class="zt-ic">${actIcon(a)}</span><span class="zt-sh">↗</span></span><span><b>${c}</b><span>${esc(c===1?SING[a.n]||a.n:a.n)}</span></span></button>`}).join("");
  const lock=next?`<div class="zt-card zt-lock"><span class="zt-top"><span class="zt-ic">${actIcon(next)}</span><span>🔒</span></span><span><span>noch ${hm(next.min-saved)}: ${esc(SING[next.n]||next.n)}</span></span></div>`:"";
  return `<div class="sec-h"><span>Deine Sammlung · ${got.length} von ${ACTS.length}</span></div><div class="fy-row">${cards}${lock}</div>`;
}
function zeitDid(){
  const it=[];
  const fl=(S.focusLog||[]).length; if(fl||S.focusMin) it.push(["⛵",fl||1,"Fokus"]);
  PLANS.map(p=>({p,c:(S.actTotals||{})[p.id]||0})).filter(x=>x.c).sort((a,b)=>b.c-a.c).forEach(x=>it.push([`<span class="plan-ic">${planIcon(x.p)}</span>`,x.c,x.p.n]));
  if(!it.length) return "";
  return `<div class="sec-h"><span>Was du daraus gemacht hast</span></div><div class="fy-row">${it.map(([e,c,n])=>`<div class="zt-did"><span class="zt-e">${e}</span><b>${c}×</b><i>${esc(n)}</i></div>`).join("")}</div>`;
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
  // Bild: gewonnene Zeit groß, daneben die letzten 7 Tage als Balken mit Wochentag
  const max=Math.max(S.budget*1.4,...week.map(d=>d.min)), bh=72, y0=124;
  const bars=week.map((d,i)=>{const h=Math.max(4,d.min/max*bh), x=216+i*20;return `<rect x="${x}" y="${y0-h}" width="14" height="${h}" rx="4" fill="${d.min<=S.budget?"#C8F169":"#FF9C7A"}"><title>${nice(d.day)}: ${hm(d.min)}</title></rect><text x="${x+7}" y="${y0+16}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="10" fill="#A4A6BD">${(LOC==="de-DE"?"SMDMDFS":"SMTWTFS")[parse(d.day).getDay()]}</text>`}).join("");
  const hero=`<svg viewBox="0 0 360 160" role="img" aria-label="Gewonnene Zeit ${hm(saved)}" style="width:100%;height:auto;display:block"><defs><linearGradient id="zg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#33406B"/><stop offset="1" stop-color="#1E2030"/></linearGradient></defs><rect width="360" height="160" fill="url(#zg)"/>
    <text x="20" y="40" font-family="Manrope, sans-serif" font-size="12" font-weight="700" fill="#A4A6BD" letter-spacing="1.2">GEWONNENE ZEIT</text>
    <text x="20" y="84" font-family="Bricolage Grotesque, Manrope, sans-serif" font-size="${hm(saved).length>9?28:40}" font-weight="800" fill="#C8F169">${hm(saved)}</text>
    <text x="20" y="106" font-family="Manrope, sans-serif" font-size="12" fill="#A4A6BD">in ${n} ${n===1?"Tag":"Tagen"}</text><text x="20" y="122" font-family="Manrope, sans-serif" font-size="12" fill="#A4A6BD">statt ${hm(S.baseline)} am Tag</text>
    ${bars}${week.length?`<path d="M210 ${y0-S.budget/max*bh}h144" stroke="#F3F1EA" stroke-dasharray="3 4" opacity=".5"/>`:""}</svg>`;
  const diff=prev.length?sum(prev)-sum(week):null, good=week.filter(d=>d.min<=S.budget).length;
  const apps=S.apps.map(a=>{const ds=S.days.filter(d=>d.apps&&d.apps[a.id]!=null);return {a,ds,tot:ds.reduce((x,d)=>x+(d.apps[a.id]||0),0),over:ds.filter(d=>d.apps[a.id]>a.limit).length}});
  const worst=apps.filter(x=>x.tot).sort((x,y)=>y.tot-x.tot)[0];
  const fc=focusStatsCard();
  return `
  <div class="hero-card zt-hero">${hero}</div>
  <div class="row zt-chips">
    <div class="cp"><i>Diese Woche</i><b style="color:${diff==null?"var(--ink)":diff>=0?"var(--lime)":"var(--coral)"}">${diff==null?hm(sum(week)):(diff>=0?"−":"+")+hm(Math.abs(diff))}</b></div>
    <div class="cp"><i>Im Ziel</i><b>${good} von ${week.length}</b></div>
    <div class="cp"><i>Serie</i><b style="color:var(--amber)">${S.budgetStreak} ${S.budgetStreak===1?"Tag":"Tage"}</b></div>
  </div>
  ${zeitDid()}
  ${zeitCal()}
  ${zeitBest()}
  ${zeitCards(saved)}
  ${S.lastDay?`<div class="card"><button class="rowbtn" id="weekBtn" data-wk="${isoWeek(S.lastDay)}"><span class="plan-ic" style="background:#26233D;color:var(--lilac)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg></span><span class="grow"><b>Wochenrückblick</b><span class="small muted">KW ${+isoWeek(S.lastDay).split("-W")[1]} ansehen</span></span><span class="muted">›</span></button></div>`:""}
  <div class="card">
    <p class="label">Hochgerechnet aufs Jahr</p>
    <div class="row between small"><span>Mit deinem alten Schnitt</span><b class="num" style="white-space:nowrap">${Math.round(yearOld)} Tage</b></div>
    <div class="bar"><i style="width:${Math.min(100,yearOld/120*100)}%;background:var(--coral)"></i></div>
    <div class="row between small"><span>Mit deinem jetzigen Schnitt (${hm(avg)})</span><b class="num" style="white-space:nowrap">${Math.round(yearNow)} Tage</b></div>
    <div class="bar"><i style="width:${Math.min(100,yearNow/120*100)}%"></i></div>
    <p class="small muted">${yearOld>yearNow?`Rund <b style="color:var(--lime)">${Math.round(yearOld-yearNow)} ganze Tage</b> pro Jahr zurück, rund um die Uhr gerechnet.`:"Noch kein Unterschied. Jeder Tag im Budget verschiebt diese Zahl."}</p>
    <p class="small muted">${over?`Über dem Budget verbracht: <b style="color:var(--coral)">${hm(over)}</b>. Das wären gewesen: ${esc(eqText(equivTop(over)))}.`:"Bisher bist du immer im Budget geblieben."}</p>
  </div>
  ${fc?`<details class="card zt-fold"><summary><span class="grow"><b>Fokuszeit</b><span class="small muted">insgesamt ${hm(S.focusMin||0)}</span></span><span class="muted zt-chev">›</span></summary>${fc}</details>`:""}
  <details class="card zt-fold"><summary><svg width="40" height="32" viewBox="-24 -34 48 40" aria-hidden="true">${monsterSvg((worst||apps[0]).a.m)}</svg><span class="grow"><b>App-Monster</b><span class="small muted">${worst?esc(worst.a.name)+" frisst am meisten: "+hm(worst.tot):"Noch keine Minuten pro App eingetragen"}</span></span><span class="muted zt-chev">›</span></summary>
  ${apps.map(({a,ds,tot,over})=>`<div class="row" style="padding:6px 0;border-top:1px solid var(--card2)"><svg width="44" height="36" viewBox="-24 -34 48 40" aria-hidden="true" style="${over?"":"opacity:.35"}">${monsterSvg(a.m)}</svg><div class="grow"><p><b>${esc(a.name)}</b> <span class="small muted">· Limit ${a.limit} min</span></p><p class="small muted">${ds.length?`${hm(tot)} in ${ds.length} Tagen · ${over}× ${esc(monName(a,false))} aufgetaucht`:"Noch nicht eingetragen"}</p></div></div>`).join("")}
  <p class="small muted">Trag beim Tagesabschluss die Minuten pro App ein, dann siehst du hier, welche App die meiste Zeit frisst.</p></details>
  <p class="small muted" style="padding:0 4px">Die Umrechnungen sind Faustwerte, zum Beispiel 30 Minuten für einen Spaziergang, 90 Minuten für einen Kinofilm oder 8 Stunden für ein Buch mit 250 Seiten.</p>`;
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
  case "t_bar": return `<rect x="-12" y="-10" width="24" height="10" fill="#C9A26A"/><path d="M-15 -10l3-8h24l3 8z" fill="#E9C46A"/><path d="M-12 -10h24" stroke="#B8902E" stroke-width="1.4"/><rect x="-9" y="-7" width="18" height="2" fill="#8A5A3B"/><circle cx="-5" cy="-11.6" r="1.4" fill="#FF9C7A"/><circle cx="4" cy="-11.6" r="1.4" fill="#FFD27A"/>`;
  case "t_papagei": return `<path d="M0 0v-20M-8 -18h16" stroke="#8A5A3B" stroke-width="2"/><g class="bob" style="animation-duration:2.4s"><ellipse cx="4" cy="-22" rx="3" ry="4" fill="#E5484D"/><circle cx="4" cy="-26.5" r="2.4" fill="#E5484D"/><path d="M6.2 -27l2.2 1-2.2 1.2z" fill="#FFD27A"/><path d="M3 -18.6l-1 5" stroke="#3FA35A" stroke-width="2"/><path d="M1.6 -22.5l-2 3" stroke="#5B8CD6" stroke-width="1.6"/></g>`;
  case "t_muschelweg": return `${[-12,-4,4,12].map((x,i)=>`<path d="M${x-3.4} 0q3.4-7 6.8 0z" fill="${["#FFD9C2","#FFB3C7","#F3F1EA","#FFD27A"][i]}"/><path d="M${x} -.2v-4M${x-1.6} -.2l.8-3.4M${x+1.6} -.2l-.8-3.4" stroke="#C9A26A" stroke-width=".5"/>`).join("")}`;
  case "t_steg": return `<path d="M-15 0v-6M15 0v-6M-5 0v-6M5 0v-6" stroke="#8A5A3B" stroke-width="1.8"/><rect x="-16" y="-8" width="32" height="2.6" rx="1" fill="#D9B26A"/><path d="M-11 -8v2.6M-6 -8v2.6M-1 -8v2.6M4 -8v2.6M9 -8v2.6" stroke="#B8902E" stroke-width=".6"/><path d="M-15 -8v-6M15 -8v-6" stroke="#8A5A3B" stroke-width="1.4"/><path d="M-15 -13q15 4 30 0" stroke="#C9A26A" stroke-width="1" fill="none"/>`;
  case "t_nest": return `<ellipse cx="-4" cy="-1.6" rx="9" ry="3" fill="#D9C08A"/><circle cx="-7" cy="-4" r="2" fill="#F3F1EA"/><circle cx="-3" cy="-4.4" r="2" fill="#F3F1EA"/><circle cx="-5" cy="-6.6" r="2" fill="#F3F1EA"/><g class="wander" style="--wx:4px;animation-duration:9s"><ellipse cx="9" cy="-2.6" rx="5" ry="3" fill="#3FA35A"/><path d="M6 -3.6h6M9 -5.4v4" stroke="#2E7D44" stroke-width=".6"/><circle cx="14.4" cy="-2.6" r="1.7" fill="#7FC57A"/></g>`;
  case "t_lagune": return `<ellipse cx="0" cy="-3" rx="17" ry="5" fill="#E9D7A6"/><ellipse cx="0" cy="-3" rx="14" ry="3.6" fill="#4FC3D9"/><path d="M-7 -3.4q3.5-1.6 7 0M2 -2.2q3-1.2 6 0" stroke="#F3F1EA" stroke-width=".8" fill="none" opacity=".8"/><circle cx="9" cy="-3.6" r="1.1" fill="#FF9C7A"/>`;
  case "f_bank": return `<rect x="-13" y="-6" width="26" height="3" rx="1.5" fill="#9A6A3E"/><path d="M-10 -3v3M10 -3v3" stroke="#7A5038" stroke-width="2.4"/><rect x="-13" y="-11" width="26" height="2.4" rx="1.2" fill="#9A6A3E"/><path d="M-12 -8.6v2.6M12 -8.6v2.6" stroke="#7A5038" stroke-width="1.6"/>`;
  case "f_sauna": return `<rect x="-11" y="-12" width="22" height="12" fill="#9A6A3E"/><path d="M-11 -8h22M-11 -4h22" stroke="#7A5038" stroke-width=".7"/><path d="M-13 -12l13-7 13 7z" fill="#6B4430"/><rect x="-3" y="-8" width="6" height="8" fill="#5A3A26"/><rect x="5" y="-20" width="3" height="5" fill="#5A3A26"/><g class="drift" style="animation-duration:4s"><circle cx="6.5" cy="-23" r="1.6" fill="#F3F1EA" opacity=".6"/><circle cx="8" cy="-26.4" r="2" fill="#F3F1EA" opacity=".4"/></g>`;
  case "f_nistkasten": return `<path d="M0 0v-14" stroke="#7A5038" stroke-width="2"/><rect x="-5" y="-22" width="10" height="9" fill="#C9A26A"/><path d="M-6.6 -21.4l6.6-5 6.6 5z" fill="#E5484D"/><circle cx="0" cy="-18" r="1.6" fill="#3A2A1E"/>`;
  case "f_heide": return `<rect x="-13" y="-3" width="26" height="3" rx="1.5" fill="#6B4430"/>${[-9,-4,1,6,10].map((x,i)=>`<g class="sway" style="animation-duration:${3+i*.3}s"><path d="M${x} -3q-1-4 0-7" stroke="#5E8A5C" stroke-width="1"/><circle cx="${x}" cy="-9.6" r="2.1" fill="${i%2?"#B6A4FF":"#D98BD0"}"/></g>`).join("")}`;
  case "f_troll": return `<ellipse cx="0" cy="-5" rx="6" ry="5" fill="#7FA36B"/><circle cx="0" cy="-12" r="4.6" fill="#8DB37A"/><circle cx="-1.6" cy="-12.6" r=".8" fill="#14151F"/><circle cx="1.6" cy="-12.6" r=".8" fill="#14151F"/><ellipse cx="0" cy="-10.4" rx="1.4" ry="1.8" fill="#6E9A5E"/><path d="M-2.4 -16q2.4-4.4 4.8 0" stroke="#C46D3A" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  case "f_boot": return `<path d="M-14 -6q14 9 28 0l-3 6h-22z" fill="#8A5A3B"/><path d="M-14 -6q-3-5 1-7M14 -6q3-5-1-7" stroke="#8A5A3B" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M0 -6v-15" stroke="#6B4430" stroke-width="1.4"/><rect x="-6" y="-19" width="12" height="9" fill="#F3F1EA"/><path d="M-6 -16h12M-6 -13h12" stroke="#E5484D" stroke-width="1.4"/>`;
  case "o_kissen": return `<ellipse cx="0" cy="-2" rx="15" ry="3.6" fill="#C46D3A"/><path d="M-12 -2h24" stroke="#FFD27A" stroke-width=".7" stroke-dasharray="2 2"/>${[[-9,"#E5484D"],[0,"#FFD27A"],[9,"#5B8CD6"]].map(([x,c])=>`<ellipse cx="${x}" cy="-5" rx="4.4" ry="3" fill="${c}"/>`).join("")}`;
  case "o_taube": return `<rect x="-5" y="-22" width="10" height="22" fill="#E3C9A0"/><path d="M-6.4 -22h12.8l-6.4-5.4z" fill="#C46D3A"/>${[-17,-11,-5].map(y=>`<circle cx="0" cy="${y}" r="1.4" fill="#5A3A26"/>`).join("")}<g class="bob" style="animation-duration:2.6s"><ellipse cx="7.4" cy="-25" rx="2.8" ry="1.8" fill="#F3F1EA"/><circle cx="9.6" cy="-26" r="1.2" fill="#F3F1EA"/></g>`;
  case "o_blumen": return `<rect x="-13" y="-3" width="26" height="3" rx="1.5" fill="#C9A26A"/>${[-8,0,8].map((x,i)=>`<path d="M${x} -3v-6" stroke="#5E8A5C" stroke-width="2.6" stroke-linecap="round"/><circle cx="${x}" cy="-10.4" r="2.3" fill="${["#FF6B9A","#FFD27A","#FF9C7A"][i]}"/>`).join("")}`;
  case "o_spiel": return `<rect x="-14" y="-4" width="14" height="4" fill="#C9A26A"/><rect x="-13" y="-3.4" width="12" height="2.6" fill="#F2D59A"/><path d="M4 0v-14h4v14M4 -5h4M4 -10h4" stroke="#9A6A3E" stroke-width="1.4" fill="none"/><path d="M8 -14q6 4 7 14" stroke="#FF9C7A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  case "o_sterne": return `<path d="M-14 0l14-16 14 16z" fill="#3B2F6B"/><path d="M-6 0l6-7 6 7z" fill="#14151F"/><path d="M0 -16v-3" stroke="#C46D3A" stroke-width="1.4"/>${[[-5,-9],[3,-11],[6,-5],[-8,-4]].map(([x,y],i)=>`<circle class="glow" style="animation-delay:${i*.4}s" cx="${x}" cy="${y}" r=".9" fill="#FFD27A"/>`).join("")}`;
  case "o_mosaik": return `<ellipse cx="0" cy="-3" rx="12" ry="3.6" fill="#2E6FB0"/><ellipse cx="0" cy="-4" rx="10" ry="2.4" fill="#7FD1E6"/><path d="M-10 -2h20" stroke="#F3F1EA" stroke-width=".6" stroke-dasharray="1.4 1.4"/><path d="M0 -4v-8" stroke="#E3C9A0" stroke-width="2"/><g class="bob" style="animation-duration:1.8s"><path d="M-3.4 -12.4q3.4-4 6.8 0" stroke="#7FD1E6" stroke-width="1.3" fill="none"/></g>`;
  case "o_sanduhr": return `<path d="M-5.4 0h10.8M-5.4 -19h10.8" stroke="#9A6A3E" stroke-width="2.2" stroke-linecap="round"/><path d="M-4 -18h8l-4 8.5zM-4 -1h8l-4-8.5z" fill="#BFE3F0" opacity=".6"/><path d="M-2.4 -1h4.8l-2.4-4z" fill="#E9C46A"/><path d="M-1.6 -15.6h3.2l-1.6 3z" fill="#E9C46A"/>`;
  case "a_fellbank": return `<rect x="-13" y="-6" width="26" height="3" rx="1.5" fill="#9A6A3E"/><path d="M-10 -3v3M10 -3v3" stroke="#7A5038" stroke-width="2.4"/><path d="M-12 -6q6-4 12 0q6-4 12 0" fill="#E3D8C8"/>`;
  case "a_futterhaus": return `<path d="M0 0v-12" stroke="#7A5038" stroke-width="2"/><rect x="-7" y="-17" width="14" height="5" fill="#C9A26A"/><path d="M-9 -17l9-6 9 6z" fill="#F3F1EA"/><g class="bob" style="animation-duration:2.2s"><circle cx="-3" cy="-19.6" r="1.7" fill="#E5484D"/><path d="M-1.6 -19.8l1.2.4-1.2.5z" fill="#FFB86B"/></g>`;
  case "a_rodel": return `<path d="M-15 0q8-13 18-8q6 3 12 8z" fill="#F3F1EA"/><rect x="2" y="-7" width="11" height="3" rx="1" fill="#E5484D"/><path d="M1 -3h13q2 0 2-2" stroke="#9A6A3E" stroke-width="1.2" fill="none"/>`;
  case "a_nordlicht": return `<path class="glow" d="M-15 -22q15-9 30 0" stroke="#5BF0A4" stroke-width="2.6" fill="none" opacity=".75"/><rect x="-9" y="-10" width="18" height="10" fill="#9A6A3E"/><path d="M-11 -10l11-6 11 6z" fill="#EAF2F8"/><rect x="-2.5" y="-7" width="5" height="7" fill="#5A3A26"/><rect x="4" y="-8" width="3" height="3" fill="#FFD27A"/>`;
  case "a_iglu": return `<path d="M-13 0a13 12 0 0 1 26 0z" fill="#EAF2F8"/><path d="M-12.6 -4h25.2M-10.6 -8h21.2M-6.6 -11h13.2M-5 -8v-3M5 -8v-3M-8 -4v-4M8 -4v-4M0 -4v-4" stroke="#B8CCDA" stroke-width=".7"/><path d="M-4.4 0a4.4 5.4 0 0 1 8.8 0z" fill="#3A4A66"/>`;
  case "a_robben": return `<path d="M-15 0q2-8 10-9q8 0 10 3q7 1 9 6z" fill="#8696A6"/><g class="bob" style="animation-duration:3s"><ellipse cx="1" cy="-9.6" rx="5.4" ry="2.6" fill="#B8C4CE"/><circle cx="6.4" cy="-11.4" r="2.1" fill="#B8C4CE"/><circle cx="7" cy="-11.8" r=".5" fill="#14151F"/></g><g class="bob" style="animation-duration:3.4s;animation-delay:.6s"><ellipse cx="-8" cy="-7.6" rx="4.6" ry="2.2" fill="#A3B1BC"/><circle cx="-12.4" cy="-9" r="1.8" fill="#A3B1BC"/></g>`;
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
/* Tab Album: Pinnwand mit dem Neuesten, Strandgut-Vitrine, Postkarten-Ständer, Inselpass */
function albumBoard(cards){
  const pins=[], recent=addDays(today(),-3);
  cards.slice(0,3).forEach(c=>pins.push({t:"card",c}));
  const bottle=S.finds.slice().reverse().find(f=>f.msg), find=S.finds.slice().reverse().find(f=>!f.msg), stamp=(S.stamps||[]).slice(-1)[0];
  if(!cards.length&&!S.finds.length&&!stamp) return `<div class="alb-board empty"><p>Noch ist die Pinnwand leer.<br>Postkarten, Strandgut und Fest-Stempel landen hier, sobald sie ankommen.</p></div>`;
  const P=[["4%","5%",-5],["52%","8%",6],["27%","34%",-2]];
  let h=pins.map((p,i)=>{const m=MOTIFS.find(x=>x.id===p.c.motif)||MOTIFS[0];
    return `<button type="button" class="alb-pin" data-card="${p.c.id}" style="left:${P[i][0]};top:${P[i][1]};transform:rotate(${P[i][2]}deg)" aria-label="Postkarte ${esc(m.title)}"><i class="alb-tack"></i>${motifSvg(m,true)}</button>`}).join("");
  if(bottle) h+=`<div class="alb-note" style="left:4%;top:62%"><b>Flaschenpost:</b> ${esc(bottle.msg)}</div>`;
  if(find){const f=FINDS.find(x=>x.id===find.id); h+=`<div class="alb-find" style="left:66%;top:60%"><svg width="58" height="44" viewBox="-16 -22 32 24" aria-hidden="true">${findSvg(find.id)}</svg>${find.day>=recent?`<span class="alb-new">NEU</span>`:""}<span class="sr">${esc(f?f.n:"")}</span></div>`}
  if(stamp){const x=MFEST[+stamp.slice(5)-1]; h+=`<div class="alb-stamp" style="left:48%;top:74%" title="${esc(x.n)}"><span>${x.e}</span><small>${TR(MONTH_N[+stamp.slice(5)-1]).slice(0,3).toUpperCase()}</small></div>`}
  return `<div class="alb-board" role="group" aria-label="Zuletzt angekommen">${h}<span class="alb-label">📌 Zuletzt angekommen</span></div>`;
}
function albumVitrine(){
  const have=new Set(S.finds.map(f=>f.id)), rows=[];
  for(let i=0;i<FINDS.length;i+=4) rows.push(FINDS.slice(i,i+4));
  const bottles=S.finds.filter(f=>f.msg).reverse().filter((f,i,a)=>a.findIndex(x=>x.msg===f.msg)===i).slice(0,3);
  return `<div class="sec-h"><span>Strandgut-Vitrine</span><span class="num" style="text-transform:none;letter-spacing:0;color:var(--lime)">${have.size} / ${FINDS.length}</span></div>
  <div class="card alb-vitrine">${rows.map(r=>`<div class="alb-shelf">${r.map(f=>{const ok=have.has(f.id), n=S.finds.filter(x=>x.id===f.id).length;
    return `<div class="alb-item${ok?"":" off"}" title="${ok?esc(f.n):"Noch nicht gefunden"}"><svg width="46" height="34" viewBox="-16 -22 32 24" aria-hidden="true">${ok?findSvg(f.id):`<g style="filter:brightness(0) opacity(.45)">${findSvg(f.id)}</g>`}</svg><span>${ok?esc(f.n)+(n>1?" ×"+n:""):"?"}</span></div>`}).join("")}</div>`).join("")}
    ${bottles.length?`<div class="alb-bottles">${bottles.map(b=>`<p>${esc(b.msg)}</p>`).join("")}</div>`:""}
    <p class="small" style="color:#E9D7A3">Je früher das Handy abends weg ist, desto mehr wird angespült.</p></div>`;
}
function albumStand(cards){
  const have=new Set(S.postcards.map(c=>c.motif)), miss=MOTIFS.length-have.size;
  return `<div class="sec-h"><span>Postkarten-Ständer</span><span class="num" style="text-transform:none;letter-spacing:0;color:var(--lime)">${have.size} / ${MOTIFS.length} Motive</span></div>
  <div class="card">${cards.length?`<div class="fy-row alb-cards">${cards.map((c,i)=>{const m=MOTIFS.find(x=>x.id===c.motif)||MOTIFS[0];
      return `<button class="alb-pc" data-card="${c.id}" style="transform:rotate(${[-3,2,-1,3,-2][i%5]}deg)" aria-label="${esc(m.title)}">${motifSvg(m,true)}${c.fan?`<i class="alb-fan">♥</i>`:""}</button>`}).join("")}</div>`
      :`<p class="small muted">Noch keine Post. Nach ein paar guten Tagen schreiben Verwandte und Nachbarinseln, was sie Gutes über deine Insel gehört haben.</p>`}
    ${miss?`<div class="alb-miss">${Array.from({length:Math.min(miss,8)},()=>`<span>?</span>`).join("")}</div><p class="small muted">${miss} ${miss===1?"Motiv fehlt":"Motive fehlen"} noch. Jede Karte hat ein Motiv zum Sammeln.</p>`:`<p class="small" style="color:var(--lime)">Alle Motive gesammelt!</p>`}</div>`;
}
function albumPass(){
  if(!feature("fest")) return "";
  const got=S.stamps||[], y=today().slice(0,4), cur=today().slice(0,7);
  const yr=MFEST.map((x,i)=>{const m=y+"-"+String(i+1).padStart(2,"0");return {m,x,ok:got.includes(m),now:m===cur,past:m<cur}});
  return `<div class="sec-h"><span>Inselpass ${y}</span><span class="num" style="text-transform:none;letter-spacing:0;color:var(--lime)">${yr.filter(z=>z.ok).length} ${yr.filter(z=>z.ok).length===1?"Stempel":"Stempel"}</span></div>
  <div class="card alb-pass"><div class="alb-stamps">${yr.map((z,i)=>`<div class="alb-st${z.ok?" ok":z.now?" now":z.past?" miss":""}" style="--c:${["#FFB86B","#B9A6FF","#C8F169","#7FD4E8","#FF9C7A"][i%5]};transform:rotate(${[-8,5,-3,7,-6,4][i%6]}deg)" title="${esc(z.x.n)}"><span>${z.ok?z.x.e:z.now?"…":""}</span><small>${TR(MONTH_N[i]).slice(0,3).toUpperCase()}</small></div>`).join("")}</div>
    <p class="small muted">Jeden Monat ein Fest-Stempel, wenn deine Insel ihr Monatsziel schafft.${got.length>yr.filter(z=>z.ok).length?` Insgesamt ${got.length} Stempel gesammelt.`:""}</p></div>`;
}
function kapselSheet(){
  const cs=S.capsules.slice().reverse();
  sheet(`<p class="label" style="color:var(--lilac)">Zeitkapseln</p><h2>Deine Monatsrückblicke</h2>
    ${cs.length?cs.map(c=>`<button class="rowbtn" data-kapsel="${c.id}" style="background:var(--ground);border-radius:14px;padding:10px 12px"><span class="grow"><b>${esc(c.title)}</b><span class="small muted" style="display:block">${c.good} von ${c.total} Tagen im Budget</span></span><span class="muted">›</span></button>`).join("")
      :`<p class="muted">Am Ende jedes Monats bekommst du hier eine Rückblick-Karte, die du teilen kannst.</p>`}
    <button class="btn" data-ok>Schließen</button>`);
  document.querySelectorAll("#modalRoot [data-kapsel]").forEach(x=>x.onclick=()=>{const c=S.capsules.find(y=>y.id===x.dataset.kapsel);if(c) capsuleSheet(c)});
}
function viewVerlauf(){
  const have=new Set(S.postcards.map(c=>c.motif)), found=new Set(S.finds.map(f=>f.id)), cards=S.postcards.slice().reverse();
  const done=S.chapter==null?0:Math.min(S.chapter,CHAPTERS.length);
  const row=(id,ic,title,sub,attr)=>`<button class="card rowbtn alb-row" ${attr||`id="${id}"`}><span class="alb-ric" aria-hidden="true">${ic}</span><span class="grow"><b>${title}</b><span class="small muted" style="display:block">${sub}</span></span><span class="muted">›</span></button>`;
  return `${albumBoard(cards)}
  <div class="row zt-chips">
    <div class="cp"><i>Postkarten</i><b>${have.size} / ${MOTIFS.length}</b></div>
    <div class="cp"><i>Strandgut</i><b>${found.size} / ${FINDS.length}</b></div>
    <div class="cp"><i>Stempel</i><b style="color:var(--amber)">${(S.stamps||[]).length}</b></div>
  </div>
  ${albumVitrine()}
  ${albumStand(cards)}
  ${albumPass()}
  ${S.chapter!=null?row("bayAlbum","🎩","Mr. Bays Album",`Die Geschichte von OffLand · ${done} / ${CHAPTERS.length} Kapitel`):""}
  ${row("kapselBtn","⏳","Zeitkapseln",S.capsules.length?S.capsules.length+(S.capsules.length===1?" Monatsrückblick":" Monatsrückblicke")+" zum Teilen":"Am Monatsende kommt der erste Rückblick")}
  ${row("","✍️","Inseltagebuch",S.feed.length?S.feed.length+(S.feed.length===1?" Eintrag · ":" Einträge · ")+esc(TR((S.feed[0]||{}).text||"")).slice(0,48)+((S.feed[0]||{}).text&&TR(S.feed[0].text).length>48?"…":""):"Hier erscheint, was auf deiner Insel passiert.",'data-feed="feed"')}
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
    <label class="check" for="musicToggle"><input type="checkbox" id="musicToggle" ${S.music===true?"checked":""}> Leise Inselmusik (klingt nach 3 Minuten aus)</label>
    <label class="field" for="langSel" style="margin-top:8px"><span data-noi18n>Sprache · Language</span><select id="langSel" data-noi18n>${[["","Automatisch · Auto"],["de","Deutsch"],["en","English"]].map(([v,n])=>`<option value="${v}"${(langPref()||"")===v?" selected":""}>${n}</option>`).join("")}</select></label>
  </div>
  ${netConfigured()?`<div class="card"><p class="label">Online: Freunde und Ranglisten</p>
    <label class="check" for="netToggle"><input type="checkbox" id="netToggle" ${netOn()?"checked":""}> Online sein (Name, Avatar und Wochen-Bildschirmzeit für Freund:innen sichtbar)</label>
    ${netOn()?`<label class="check" for="netPub"><input type="checkbox" id="netPub" ${S.online.pub?"checked":""}> Auch in der Rangliste für alle erscheinen</label>
    <p class="small muted">Ausschalten löscht alle Online-Daten dieses Kontos und trennt die Online-Freundschaften.</p>`:""}
  </div>`:""}
  ${plusCard()}
  ${stCard()}
  ${shieldCard()}
  ${netConfigured()?backupCard():""}
  ${netConfigured()?`<div class="card"><p class="label">Anonyme Statistik</p>
    <label class="check" for="statsToggle"><input type="checkbox" id="statsToggle" ${statsDev().consent===true?"checked":""}> Anonym mitzählen, welche Funktionen genutzt werden</label>
    <p class="small muted">Nur Zähler wie „heute wurde ein Tag eingetragen“, ohne Namen, Minuten oder Kennung; Bildschirmzeit nur als grobe Stufe. Gilt für dieses Gerät.</p></div>`:""}
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
  ${devMode()||S.testmode?`<div class="card">
    <div class="row between"><p class="label">Testmodus</p><label class="check" for="tm" style="min-height:auto"><input type="checkbox" id="tm" ${S.testmode?"checked":""}> an</label></div>
    <p class="small muted">Im Testmodus kannst du beliebig viele Tage nacheinander eintragen oder zufällig simulieren.</p>
    ${S.testmode?`<div class="row"><button class="btn secondary grow" id="simGood">Guter Tag</button><button class="btn secondary grow" id="simBad">Schlechter Tag</button></div>
    <button class="btn ghost" id="sim10">10 Tage gemischt</button>
    <button class="btn ghost" id="resetBtn">Spielstand zurücksetzen</button>`:""}
  </div>`:""}
  <p class="small muted" style="text-align:center"><a href="impressum/" style="color:inherit">Impressum</a> · <a href="datenschutz/" style="color:inherit">Datenschutz</a></p>
  <p class="small muted" id="verLine" style="text-align:center;padding:8px;user-select:none">OffLand · Version ${APP_VERSION}${devMode()?" · Entwicklermodus":""}</p>`;
}

/* ---------- Inselansicht: Gesamtbild oder einzelne Insel, per Wischen ---------- */
let islandView=0, vbAnim=null;
function islandViews(){
  const v=[{n:"Alle Inseln",vb:[0,44,360,240]}];   // etwas Himmel weg, mehr Meer: die Chips liegen dann auf dem Wasser statt auf der Insel
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
  bindGuests();
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
/* ---------- Testleiste: im Testmodus immer sichtbar, zeigt was ein simulierter Tag verändert ---------- */
let devLast=null;
function devSimDay(bad){
  const apps={};S.apps.forEach(a=>{apps[a.id]=Math.round(a.limit*(bad?(0.6+Math.random()*1.2):(0.2+Math.random()*0.7)))});
  const g0=S.glueck, before=new Map(S.residents.map(r=>[r.id,{lv:lvOf(r),phone:!!r.phone,status:r.status}]));
  closeDay(Math.round(S.budget*(bad?(1.3+Math.random()*0.8):(0.4+Math.random()*0.5))/5)*5,[],apps);
  const notes=[];
  S.residents.forEach(r=>{const b=before.get(r.id);
    if(!b){notes.push((r.parents?"👶 ":"🛶 ")+r.name+(r.parents?" geboren":" zieht ein"));return}
    if(b.status!=="weg"&&r.status==="weg") notes.push("👋 "+r.name+" ist weg");
    if(r.kind!=="mensch"||r.status==="weg") return;
    const t=lvOf(r);
    if(r.phone&&!b.phone) notes.push("📱 "+r.name+" hängt am Handy");
    else if(t!==b.lv) notes.push((t>b.lv?"⬆️ ":"⬇️ ")+r.name+": "+(t===4?"wieder Mensch ✨":LV_NAMES[t]));
  });
  devLast={bad,day:S.dayCount,g0,g1:S.glueck,notes};
}
function devBar(){
  let el=$("#devBar");
  if(!S.testmode||!S.setup){if(el) el.remove();return}
  if(!el){el=document.createElement("div");el.id="devBar";el.className="devbar";document.body.appendChild(el)}
  const L=devLast, d=L?L.g1-L.g0:0;
  el.innerHTML=`${L?`<div class="dev-res"><b>${L.bad?"🌧":"☀️"} Tag ${L.day}</b> · Glück ${L.g0} → <b class="${d>=0?"up":"down"}">${L.g1} %</b>${L.notes.length?`<span>${L.notes.slice(0,4).map(esc).join(" · ")}${L.notes.length>4?" · +"+(L.notes.length-4):""}</span>`:`<span class="muted">Sonst keine Veränderung</span>`}</div>`:`<div class="dev-res muted">Testmodus: Tage simulieren und zuschauen, was passiert</div>`}
    <div class="dev-btns"><button type="button" data-dev="good">☀️ Gut</button><button type="button" data-dev="bad">🌧 Schlecht</button><button type="button" data-dev="week">⏩ 7 Tage</button><button type="button" data-dev="off" aria-label="Testmodus aus">✕</button></div>`;
  el.querySelectorAll("[data-dev]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.dev;
    if(k==="off"){S.testmode=false;devLast=null;save();render();toast("Testmodus aus");return}
    if(k==="week"){let notes=[],g0=S.glueck;for(let i=0;i<7;i++){if($("#modalRoot").innerHTML) break; devSimDay(Math.random()<.3); notes=notes.concat(devLast.notes)} devLast.g0=g0; devLast.notes=notes; devLast.bad=devLast.g1<g0}
    else devSimDay(k==="bad");
    save(); render(); if(tab==="heute") window.scrollTo({top:0,behavior:"smooth"});
  });
}
function render(){
  widgetSync(); shieldRefresh();
  // Im Tab Freunde steht die Familieninsel, dort die eigene Insel oben ausblenden
  $("#scene").hidden=["freunde","bewohner","zeit","projekt","verlauf"].includes(tab);
  renderScene();
  $("#streakChip").textContent=S.happyStreak>0?"🔥 "+S.happyStreak+(S.happyStreak===1?" Tag":" Tage"):S.dayCount+(S.dayCount===1?" Tag":" Tage")+" gespielt";
  $("#streakChip").title=S.happyStreak>0?S.happyStreak+(S.happyStreak===1?" glücklicher Tag":" glückliche Tage")+" in Folge":"";
  $("#streakChip").className="chip "+(S.happyStreak>0?"good":"gone");
  $("#accBtn").innerHTML=ACC?avatarSvg(ACC.avatar,40):"";
  $("#title").textContent=!S.setup?"Deine Insel":tab==="heute"?(ACC?"Hallo "+ACC.name:"Deine Insel"):tab==="bewohner"?"Bewohner":tab==="zeit"?"Deine Zeit":tab==="projekt"?"Bauen":tab==="freunde"?"Freunde":tab==="verlauf"?"Album":"Deine Insel";
  $("#dateline").textContent="OffLand · "+new Date().toLocaleDateString(LOC,{weekday:"short",day:"numeric",month:"short"});
  const pb=plusBadge(); if(pb){$("#streakChip").textContent=pb;$("#streakChip").className="chip plus"}                // Plus-Woche: Abzeichen statt Tageszähler
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
  devBar();
}
function bind(){
  bindGuests();
  const sb=$("#setBudget"), sa=$("#setBase");
  if(sb) sb.oninput=()=>{S.budget=+sb.value;$("#setBudgetOut").textContent=hm(S.budget)};
  if(sa) sa.oninput=()=>{S.baseline=+sa.value;$("#setBaseOut").textContent=hm(S.baseline)};
  if(sb) sb.onchange=save; if(sa) sa.onchange=save;
  document.querySelectorAll("[data-basemode]").forEach(b=>b.onclick=()=>{SETUP_AUTO=b.dataset.basemode==="auto";render()});
  const sav=$("#stAvg"); if(sav) sav.onclick=async()=>{
    try{const i=await ST.status(); if(!i||i.status!=="approved") await ST.authorize(); await ST.showAverage(); await stStatus()}
    catch(e){toast("Ohne Zugriff auf die Bildschirmzeit geht das leider nicht. Den Wert findest du in den Einstellungen unter Bildschirmzeit.")}
    const b=$("#setBase"); if(b) b.focus();
  };
  const st=$("#startBtn"); if(st) st.onclick=async()=>{
    if(SETUP_AUTO&&!S.setup){
      let ok=false; try{await ST.authorize(); const r=await ST.pickApps(); ok=!!(r&&r.ok)}catch(e){}
      await stStatus();
      if(ok){S.autoTime=true; S.baseMeasure={since:today()}}
      else {S.stNoLink=true; toast("Kein Zugriff auf die Bildschirmzeit. Du kannst den Schnitt später in den Einstellungen anpassen.")}
    }
    S.setup=true;stat("insel_start");log("Deine Insel ist gegründet. "+nameList(here().map(r=>r.name))+" ziehen ein.","good");plusTrialStart();save();render();if(famInvite())famJoinSheet(famInvite());else showPending()};
  const bo=$("#bkOn"); if(bo) bo.onclick=backupEnable;
  const wsb=$("#wishShop"); if(wsb) wsb.onclick=()=>{tab="projekt";bauTab="laden";render();window.scrollTo(0,0)};
  document.querySelectorAll("[data-bau]").forEach(b=>b.onclick=()=>{bauTab=b.dataset.bau;render();const t=$("[data-bau]");if(t&&t.getBoundingClientRect().top<0)t.scrollIntoView({block:"start"})});
  const stS=$("#stSetup"); if(stS) stS.onclick=stSetup;
  const stE=$("#stEntry"); if(stE) stE.onclick=()=>stSetup(true);
  const stA=$("#stApps"); if(stA) stA.onclick=async()=>{try{await ST.pickApps()}catch(e){} await stStatus(); settingsSheet()};
  bindShieldCard();
  const stO=$("#stOff"); if(stO) stO.onclick=async()=>{try{await ST.stop()}catch(e){} S.autoTime=false; S.stNoLink=true; save(); await stStatus(); settingsSheet()};
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
  const ir=$("#inR"); if(ir) ir.oninput=()=>{const v=+ir.value, h=$("#inH"), m=$("#inM"); h.value=Math.floor(v/60); m.value=String(v%60).padStart(2,"0"); h.dataset.touched=m.dataset.touched="1"; liveUpdate()};
  const bg=$("#boatGo"); if(bg) bg.onclick=boatPick;
  countUpMain();
  const cb=$("#closeBtn"); if(cb) cb.onclick=()=>{
    const h=+($("#inH").value||0), m=+($("#inM").value||0);
    const min=clamp(h*60+m,0,1440);
    const apps={}; S.apps.forEach(a=>{const el=$("#app_"+a.id);if(el&&el.value!=="")apps[a.id]=clamp(+el.value,0,1440)});
    closeDay(min,[],apps);
  };
  const tm=$("#tm"); if(tm) tm.onchange=()=>{S.testmode=tm.checked;devLast=null;save();
    // Beim Einschalten direkt zur Insel, damit man sieht, was die Testleiste bewirkt
    if(S.testmode){closeModal();tab="heute";render();window.scrollTo(0,0);toast("Testmodus an: Leiste unten")} else {render();if(tm.closest("#modalRoot"))settingsSheet()}};
  const simDay=devSimDay;
  const g=$("#simGood"); if(g) g.onclick=()=>simDay(false);
  const b=$("#simBad"); if(b) b.onclick=()=>simDay(true);
  const s10=$("#sim10"); if(s10) s10.onclick=()=>{const keep=S.pending.length;for(let i=0;i<10;i++){if($("#modalRoot").innerHTML) break; simDay(Math.random()<.25)}};
  document.querySelectorAll("[data-boat]").forEach(x=>x.onclick=()=>focusSheet(+x.dataset.boat));
  document.querySelectorAll("[data-act]").forEach(x=>x.onclick=()=>doActivity(x.dataset.act));
  const nb=$("#nightBtn"); if(nb) nb.onclick=nightAsk;
  const pdn=$("#planDone"); if(pdn) pdn.onclick=()=>{const pl=S.plan, p=pl&&PLANS.find(x=>x.id===pl.id); if(!p) return; pl.res=true; const r=planResult(true,pl.id,pl.day); save(); render(); planDoneSheet(p,r)};
  const wrb=$("#weekBtn"); if(wrb) wrb.onclick=()=>weekSheet(wrb.dataset.wk);
  document.querySelectorAll("[data-zshare]").forEach(b=>b.onclick=()=>{const a=ACTS[+b.dataset.zshare], c=Math.floor(savedTotal()/a.min); shareText("Mit OffLand habe ich schon "+hm(savedTotal())+" Handyzeit zurückgewonnen, das sind "+c+" "+(c===1?SING[a.n]||a.n:a.n)+".",inviteLink())});
  const zc=$("#ztCal"); if(zc) zc.onclick=e=>{const d=e.target.closest("[data-zday]"); if(d){zeitSel=d.dataset.zday; render()}};
  const zo=$("#ztOld"); if(zo) zo.onclick=()=>{zeitPage++; render()};
  const zn=$("#ztNew"); if(zn) zn.onclick=()=>{zeitPage=Math.max(0,zeitPage-1); render()};
  if($("#bayAlbum")) $("#bayAlbum").onclick=bayAlbumSheet;
  const kb=$("#kapselBtn"); if(kb) kb.onclick=kapselSheet;
  document.querySelectorAll("[data-feed]").forEach(b=>b.onclick=()=>feedSheet(b.dataset.feed));
  const wrr=$("#weekReadyBtn"); if(wrr) wrr.onclick=()=>weekSheet(S.weekReady.wk);
  const vo=$("#vacOff"); if(vo) vo.onclick=()=>setVacation(false);
  const dt=$("#deathToggle"); if(dt) dt.onchange=()=>{S.natDeath=dt.checked;save()};
  document.querySelectorAll("[data-tea]").forEach(x=>x.onclick=()=>giveTea(x.dataset.tea));
  document.querySelectorAll(".res-txt").forEach(x=>x.onclick=()=>x.classList.toggle("open"));   // Bewohner-Zeile: alles zeigen
  document.querySelectorAll("[data-rt]").forEach(x=>x.onclick=()=>resSheet(x.dataset.rt));
  document.querySelectorAll("details.res-sec").forEach(d=>d.ontoggle=()=>{if(d.dataset.search) return; (S.bwFold=S.bwFold||{})[d.dataset.fold]=!d.open; save()});
  const rsq=$("#resSearch"); if(rsq) rsq.oninput=()=>{
    const q=rsq.value.trim().toLowerCase(); let hits=0;
    document.querySelectorAll("#view .res-sec [data-q]").forEach(el=>{const ok=!q||el.dataset.q.includes(q); el.hidden=!ok; if(ok) hits++});
    document.querySelectorAll("details.res-sec").forEach(d=>{d.dataset.search=1; if(q) d.open=true; else d.open=!(S.bwFold||{})[d.dataset.fold]; setTimeout(()=>delete d.dataset.search,0);
      d.hidden=!!q&&![...d.querySelectorAll("[data-q]")].some(el=>!el.hidden)});   // Abschnitte ohne Treffer ausblenden
    $("#resNone").hidden=!q||hits>0;
  };
  const vt=$("#vacToggle"); if(vt) vt.onchange=()=>setVacation(vt.checked);
  const al=$("#alarmToggle"); if(al) al.onchange=()=>{S.alarm=al.checked;save();if(al.checked)ringAlarm()};
  const so=$("#soundToggle"); if(so) so.onchange=()=>{S.sound=so.checked;save();if(so.checked)sfx("return");else MUSIC.stop(.5)};
  const ls=$("#langSel"); if(ls) ls.onchange=()=>{try{if(ls.value)localStorage.setItem("offland-lang",ls.value);else localStorage.removeItem("offland-lang")}catch(e){} location.reload()};
  const mu=$("#musicToggle"); if(mu) mu.onchange=()=>{S.music=mu.checked;save();if(mu.checked){musicDone=false;musicStart()}else MUSIC.stop(1)};
  const calmB=$("#calmBtn"); if(calmB) calmB.onclick=calmMinute;
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
    if(it.consumable){if(it.id==="tee")S.tea++;else if(it.id==="klee")glAdd(5);else S.sun++} else if(!owns(it.id)){ if(!S.items.includes(it.id)) S.items.push(it.id); if(!it.world&&RARE.includes(it)){S.itemW=S.itemW||{};S.itemW[it.id]=curWorldId()} }
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
    audioIdle();
    return AC;
  }catch(e){return null}
}
/* Tonausgabe schläft kurz nach dem letzten Geräusch wieder ein: Beim Wechsel in eine andere App spielt
   das iPhone sonst manchmal einen verzerrten Tonrest („Hupen“). Die nächste Berührung oder das nächste Geräusch weckt sie. */
let idleT=0;
function audioIdle(){clearTimeout(idleT); idleT=setTimeout(()=>{
  if(typeof MUSIC!=="undefined"&&(MUSIC.playing()||CALM)) return audioIdle();
  try{if(AC&&AC.state==="running") AC.suspend()}catch(e){}
},4500)}
// iOS/Safari geben Töne erst nach einer Berührung frei
["pointerdown","touchend","keydown"].forEach(t=>document.addEventListener(t,()=>{if(S&&S.sound!==false) audio()},{passive:true}));
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
/* ---------- Inselmusik: live erzeugt wie die Geräusche, leise, klingt nach 3 Minuten aus ----------
   Morgen (Holzklänge), Abend (sanftes E-Piano mit Knistern), Nacht (Spieluhr); dazu Meeresrauschen. */
const MUSIC=(()=>{
  const V={
    morgen:{bpm:92,lead:"marimba",comp:"stab",chords:[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]],bass:[48,45,41,43],
      scale:[64,67,69,72,74,76,79,81],density:.55,birds:true,wave:.22},
    abend:{bpm:62,lead:"soft",comp:"warm",chords:[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]],bass:[41,40,38,36],
      scale:[60,62,64,67,69,72,74,76],density:.3,crackle:true,wave:.34},
    nacht:{bpm:58,lead:"box",comp:"pad",chords:[[57,60,64,67],[53,57,60,64],[48,52,55,59],[55,59,62,64]],bass:[45,41,36,43],
      scale:[69,72,74,76,79,81,84,86],density:.3,wave:.5}
  };
  let ac=null,master,dry,wet,waveGain,waveBuf,waveSrc=null,crackleGain,cur=null,timer=0,step=0,nextT=0,motif=null,cycle=0,endT=0,stopT=0;
  const mtof=m=>440*Math.pow(2,(m-69)/12), rnd=Math.random;
  function setup(a){
    if(ac===a) return; ac=a;
    master=ac.createGain(); master.gain.value=0; master.connect(ac.destination);
    dry=ac.createGain(); dry.gain.value=.8; dry.connect(master);
    const len=ac.sampleRate*3, ir=ac.createBuffer(2,len,ac.sampleRate);                       // Hall: selbst erzeugte Raumantwort
    for(let c=0;c<2;c++){const d=ir.getChannelData(c); for(let i=0;i<len;i++) d[i]=(rnd()*2-1)*Math.pow(1-i/len,3.2)}
    const conv=ac.createConvolver(); conv.buffer=ir; wet=ac.createGain(); wet.gain.value=.38; wet.connect(conv); conv.connect(master);
    waveBuf=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate); const nd=waveBuf.getChannelData(0); let last=0;   // Meeresrauschen
    for(let i=0;i<nd.length;i++){last=(last+.02*(rnd()*2-1))/1.02; nd[i]=last*3.5}
    waveGain=ac.createGain(); waveGain.gain.value=0; waveGain.connect(master);
    crackleGain=ac.createGain(); crackleGain.gain.value=.5; crackleGain.connect(master);
  }
  const out=(g,send)=>{g.connect(dry); const s=ac.createGain(); s.gain.value=send; g.connect(s); s.connect(wet)};
  const env=(g,t,a,peak,dec)=>{g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(.0001,t+a+dec)};
  const osc=(type,f,t,stop,dest,det)=>{const o=ac.createOscillator(); o.type=type; o.frequency.value=f; if(det) o.detune.value=det; o.connect(dest); o.start(t); o.stop(stop); return o};
  const I={
    marimba(t,m,dur,v){const f=mtof(m), g=ac.createGain(); env(g,t,.004,.32*v,.9); out(g,.25); osc("sine",f,t,t+1.2,g);
      const g2=ac.createGain(); env(g2,t,.002,.08*v,.12); g2.connect(g); osc("sine",f*4,t,t+.3,g2)},
    soft(t,m,dur,v){const f=mtof(m), g=ac.createGain(), lp=ac.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=950; lp.Q.value=.3;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.2*v,t+.06); g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(2.2,dur*2.2));
      lp.connect(g); out(g,.55); const e=t+dur*2.4+2.5; osc("sine",f,t,e,lp,-4); osc("sine",f,t,e,lp,5); osc("triangle",f/2,t,e,lp)},
    hum(t,m,dur,v){const f=mtof(m), g=ac.createGain(), lp=ac.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=700;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.09*v,t+.08); g.gain.exponentialRampToValueAtTime(.0001,t+2); lp.connect(g); out(g,.5); osc("sine",f,t,t+2.2,lp)},
    box(t,m,dur,v){const f=mtof(m), g=ac.createGain(); env(g,t,.003,.2*v,1.9); out(g,.55); osc("sine",f,t,t+2.2,g);
      const g2=ac.createGain(); env(g2,t,.002,.05*v,.5); g2.connect(g); osc("sine",f*5.4,t,t+.7,g2)},
    bass(t,m,dur,v){const g=ac.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.3*v,t+.03); g.gain.setTargetAtTime(0,t+dur*.8,.25); out(g,.08); osc("sine",mtof(m),t,t+dur+1.5,g)},
    pad(t,notes,dur,v){const g=ac.createGain(), lp=ac.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=900;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.06*v,t+Math.min(1.2,dur*.35)); g.gain.linearRampToValueAtTime(0,t+dur+1.2); lp.connect(g); out(g,.6);
      notes.forEach(m=>{osc("triangle",mtof(m),t,t+dur+1.4,lp,-6); osc("triangle",mtof(m),t,t+dur+1.4,lp,6)})},
    bird(t){const g=ac.createGain(); env(g,t,.01,.035,.18); out(g,.5); const o=osc("sine",2600,t,t+.25,g);
      o.frequency.setValueAtTime(2600+rnd()*600,t); o.frequency.exponentialRampToValueAtTime(3800+rnd()*500,t+.08); o.frequency.exponentialRampToValueAtTime(3000,t+.16)},
    crackle(t){const len=Math.floor(ac.sampleRate*.012), b=ac.createBuffer(1,len,ac.sampleRate), d=b.getChannelData(0);
      for(let i=0;i<len;i++) d[i]=(rnd()*2-1)*Math.pow(1-i/len,2);
      const s=ac.createBufferSource(); s.buffer=b; const hp=ac.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=1500+rnd()*2500;
      const g=ac.createGain(); g.gain.value=.05+rnd()*.07; s.connect(hp); hp.connect(g); g.connect(crackleGain); s.start(t)}
  };
  // kurzes Motiv über zwei Takte, das sich über die vier Akkorde wiederholt und leicht verändert
  function newMotif(v){
    const st=[]; let deg=2+Math.floor(rnd()*3);
    for(let i=0;i<15;i++){const p=i%4===0?v.density+.25:i%2===0?v.density:v.density*.45;
      if(rnd()<p){deg=Math.max(0,Math.min(v.scale.length-1,deg+[-2,-1,-1,0,1,1,2][Math.floor(rnd()*7)])); st.push({i,deg})}}
    if(!st.length||st[0].i!==0) st.unshift({i:0,deg:2});
    return st.map((s,k)=>({i:s.i,deg:s.deg,len:(st[k+1]?st[k+1].i:16)-s.i}));
  }
  function pick(v,deg,chord,strong){let m=v.scale[deg]; if(strong){let b=m,bd=99; v.scale.forEach(s=>{if(chord.some(c=>(s-c)%12===0)){const d=Math.abs(s-m); if(d<bd){bd=d;b=s}}}); m=b} return m}
  function tick(){
    const v=V[cur], spb=60/v.bpm, e=spb/2;
    if(endT&&ac.currentTime>=endT){stop(8);return}
    if(nextT<ac.currentTime-.05){const skip=Math.ceil((ac.currentTime-nextT)/e); step+=skip; nextT+=skip*e}   // im Hintergrund verpasste Töne nicht alle auf einmal nachspielen
    while(nextT<ac.currentTime+.2){
      const bar=Math.floor(step/8), inBar=step%8, ci=Math.floor(bar/2)%4, chord=v.chords[ci], t=nextT, ph=step%16, rep=Math.floor((step%64)/16), sw=step%2?e*.12:0;
      if(step%64===0){cycle++; if(!motif||cycle%2===1||rnd()<.4) motif=newMotif(v)}
      motif.forEach(n=>{if(n.i===ph&&!(rep===3&&ph>=10)) I[v.lead](t+sw,pick(v,n.deg,chord,ph%4===0),n.len*e,.75+rnd()*.25)});
      if(rep===3&&ph===10) I[v.lead](t,v.chords[3][0]+12,e*6,.8);
      if(v.comp==="stab"){if(inBar%4===0) I.bass(t,v.bass[ci],spb*1.6,.9); if(inBar%4===2) chord.slice(0,3).forEach((c,k)=>I.marimba(t+k*.012,c,e,.38))}
      else if(v.comp==="warm"){if(step%16===0){I.pad(t,chord,spb*8,.8); I.bass(t,v.bass[ci],spb*7,.55)} if(inBar%2===0) I.hum(t,chord[[0,2,1,3][inBar/2]],spb,.75+rnd()*.2)}
      else {if(step%16===0){I.pad(t,chord,spb*8,1); I.bass(t,v.bass[ci],spb*7,.6)} if(inBar===4&&rnd()<.5) I.box(t,chord[Math.floor(rnd()*4)]+12,e*2,.35)}
      if(v.birds&&rnd()<.025){I.bird(t+rnd()*.3); if(rnd()<.6) I.bird(t+.22+rnd()*.1)}
      if(v.crackle){const n=rnd()<.5?1:rnd()<.3?2:0; for(let k=0;k<n;k++) I.crackle(t+rnd()*e)}
      nextT+=e; step++;
    }
  }
  function play(mood,o){
    o=o||{}; const a=audio(); if(!a) return false; setup(a);
    clearTimeout(stopT); clearInterval(timer);
    if(cur!==mood){step=0;cycle=0;motif=null} cur=mood;
    const t=ac.currentTime; nextT=t+.08; endT=o.minutes?t+o.minutes*60:0;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value,t); master.gain.linearRampToValueAtTime(o.vol||.32,t+(o.fadeIn||1.2));
    if(!waveSrc){   // Rauschen läuft nur, solange Musik spielt
      const ns=ac.createBufferSource(); ns.buffer=waveBuf; ns.loop=true;
      const lp=ac.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=650;
      const swell=ac.createGain(); swell.gain.value=.5; const lfo=ac.createOscillator(); lfo.frequency.value=1/9; const lg=ac.createGain(); lg.gain.value=.45;
      lfo.connect(lg); lg.connect(swell.gain); ns.connect(lp); lp.connect(swell); swell.connect(waveGain); ns.start(t); lfo.start(t); waveSrc=[ns,lfo];
    }
    // geplantes Ausblenden eines vorherigen stop() verwerfen, sonst dreht es das Rauschen kurz danach wieder auf 0
    waveGain.gain.cancelScheduledValues(t); waveGain.gain.setValueAtTime(waveGain.gain.value,t);
    waveGain.gain.setTargetAtTime(o.waves===false?0:V[mood].wave*(o.waveBoost||1),t,.8);
    timer=setInterval(tick,25); tick(); return true;
  }
  function stop(sec){
    if(!ac||!cur) return; const t=ac.currentTime; sec=sec==null?2:sec;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value,t); master.gain.linearRampToValueAtTime(0,t+sec);
    waveGain.gain.setTargetAtTime(0,t+sec*.8,.3);
    clearInterval(timer); clearTimeout(stopT); endT=0;   // keine neuen Töne mehr planen
    const ws=waveSrc; waveSrc=null; if(ws) ws.forEach(n=>{try{n.stop(t+sec+.3)}catch(e){}});
    stopT=setTimeout(()=>{cur=null},sec*1000+100);
  }
  // sofort still: beim Verlassen der App alles anhalten, damit das iPhone keine Tonreste verzerrt abspielt
  function halt(){clearInterval(timer); clearTimeout(stopT); endT=0; cur=null; const ws=waveSrc; waveSrc=null;
    if(ac){try{master.gain.cancelScheduledValues(0); master.gain.value=0}catch(e){} if(ws) ws.forEach(n=>{try{n.stop()}catch(e){}})}}
  return {play,stop,halt,playing:()=>cur,waveLevel:()=>waveGain?waveGain.gain.value:0};
})();
const moodNow=()=>{const h=new Date().getHours(); return h>=22||h<5?"nacht":h>=17?"abend":"morgen"};
/* Hintergrundmusik: nur wenn eingeschaltet, startet mit der ersten Berührung, klingt nach 3 Minuten aus */
let musicDone=false;
function musicStart(){if(S&&S.music===true&&S.sound!==false&&!musicDone&&!MUSIC.playing()&&!document.hidden&&!$(".calm")){if(MUSIC.play(moodNow(),{minutes:3})) musicDone=true}}
["pointerdown","touchend","keydown"].forEach(t=>document.addEventListener(t,musicStart,{passive:true}));
function audioSleep(){MUSIC.halt(); if(CALM) calmEnd(false); try{if(AC&&AC.state==="running") AC.suspend()}catch(e){}}   // Töne beim Verlassen sofort anhalten
document.addEventListener("visibilitychange",()=>{if(document.hidden) audioSleep(); else musicDone=false});
window.addEventListener("pagehide",audioSleep);

/* einmalige Frage nach der Musik, mit Hörprobe */
function musicAskSheet(){
  sheet(`<p class="label" style="color:var(--lilac)">Kurze Frage</p><h2>Magst du leise Inselmusik?</h2>
    ${saysHtml("bay","Ich hab da was vorbereitet: ein bisschen Musik für deine Besuche auf der Insel. Ganz leise, mit Meeresrauschen. Nach drei Minuten wird es wieder still.")}
    <button class="btn secondary" id="muTry">▶ Kurz reinhören</button>
    <p class="small muted">Du kannst das jederzeit in den Einstellungen ändern.</p>
    <div class="row"><button class="btn ghost grow" id="muNo" data-ok>Lieber ohne</button><button class="btn grow" id="muYes">Ja, gern</button></div>`);
  const t=$("#muTry");
  t.onclick=()=>{if(MUSIC.playing()){MUSIC.stop(1);t.textContent="▶ Kurz reinhören"}else if(MUSIC.play(moodNow(),{minutes:3,fadeIn:1.5})){musicDone=true;t.textContent="■ Anhalten"}};
  $("#muYes").onclick=()=>{S.music=true;save();stat("musik_ja");if(!MUSIC.playing()&&MUSIC.play(moodNow(),{minutes:3}))musicDone=true;closeModal();render();showPending();toast("Inselmusik ist an")};
  $("#muNo").onclick=()=>{S.music=false;save();stat("musik_nein");MUSIC.stop(1);closeModal();render();showPending()};
}
/* ---------- Inselminute: eine Minute runterkommen, Bildschirm dunkel, Meeresrauschen ---------- */
let CALM=null;
function calmMinute(){
  if(CALM) return;
  stat("inselminute_start");
  const keep=S.sound; S.sound=true; audio(); S.sound=keep;                         // hier immer mit Ton, die Minute ist freiwillig gestartet
  MUSIC.stop(.6);
  const el=document.createElement("div"); el.className="calm"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); el.setAttribute("aria-label","Inselminute");
  el.innerHTML=`<div class="calm-in">
    <p class="label" style="color:var(--lilac)">Inselminute</p>
    <h2>Kurz runterkommen von der ganzen Bildschirmzeit</h2>
    <p class="calm-txt">Nimm dir eine Minute, schließe die Augen und lass dich vom Meeresrauschen auf deine Insel bringen.</p>
    <div class="calm-orb" aria-hidden="true"><i></i></div>
    <p class="calm-breath" aria-live="polite">Einatmen …</p>
    <p class="calm-time num" id="calmTime">1:00</p>
    <button class="btn ghost" id="calmStop">Beenden</button></div>`;
  document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add("on"));
  calmSession(true);   // auch bei Lautlos-Schalter hörbar, wo das Gerät es erlaubt
  const keepS=S.sound; S.sound=true; MUSIC.play("nacht",{vol:.3,fadeIn:4,waveBoost:1.5}); S.sound=keepS;
  let lock=null; try{navigator.wakeLock&&navigator.wakeLock.request("screen").then(l=>{lock=l}).catch(()=>{})}catch(e){}
  const t0=Date.now(), br=el.querySelector(".calm-breath");
  CALM={el,lock:()=>lock,iv:setInterval(()=>{
    const s=Math.floor((Date.now()-t0)/1000), left=Math.max(0,60-s);
    $("#calmTime").textContent=Math.floor(left/60)+":"+String(left%60).padStart(2,"0");
    br.textContent=(s%10)<4?"Einatmen …":"Ausatmen …";
    if(left<=0) calmEnd(true);
  },250)};
  $("#calmStop").onclick=()=>calmEnd(false);
}
/* Inselminute ist bewusst gestartet: Ton wie bei einer Medien-App (Safari/iOS 17+: navigator.audioSession), danach zurück */
function calmSession(on){try{if(navigator.audioSession) navigator.audioSession.type=on?"playback":"auto"}catch(e){}}
function calmEnd(done){
  if(!CALM) return; const c=CALM; CALM=null; clearInterval(c.iv); MUSIC.stop(done?5:1.2); setTimeout(()=>{if(!CALM) calmSession(false)},(done?5:1.2)*1000+400);
  try{const l=c.lock(); if(l) l.release()}catch(e){}
  stat(done?"inselminute":"inselminute_abbruch");
  if(done){
    const first=S.calmDay!==today(); S.calmDay=today(); S.calmN=(S.calmN||0)+1;
    if(first) glAdd(1);
    save();
    c.el.querySelector(".calm-in").innerHTML=`<p class="label" style="color:var(--lilac)">Inselminute</p><h2>Schön, dass du da warst</h2>
      <p class="calm-txt">Eine Minute nur für dich. Die Insel ist auch ein bisschen ruhiger geworden${first?": +1 % Glück":""}.</p>
      ${S.music===undefined?`<label class="check" for="calmMusic"><input type="checkbox" id="calmMusic"> Leise Inselmusik auch beim Öffnen der App spielen</label>`:""}
      <button class="btn" id="calmOk">Zurück zur Insel</button>`;
    $("#calmOk").onclick=()=>{const m=$("#calmMusic"); if(m){S.music=m.checked; save()} c.el.classList.remove("on"); setTimeout(()=>{c.el.remove();render()},500)};
  } else {c.el.classList.remove("on"); setTimeout(()=>c.el.remove(),500)}
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
/* Fenster-Warteschlange: höchstens 3 am Stück, der Rest wartet bis zum nächsten Öffnen oder Eintragen.
   Vorhaben-Nachfrage, Joker und Tagesbilanz kommen immer und zuerst. */
let PEND_BUDGET=3;
const PEND_MUST=new Set(["plan","jokerAsk","day","comeback","baseline","plusStart"]);
const PEND_ORDER={plusStart:-2,comeback:-1,plan:0,jokerAsk:1,day:2,baseline:2.2,planAsk:3,bilanz:4,unlock:7,chapter:6,umfrage:8,statsAsk:9,musicAsk:2.5};
function sortPending(){const o=e=>PEND_ORDER[e.type]!=null?PEND_ORDER[e.type]:5; S.pending=S.pending.map((e,i)=>[e,i]).sort((a,b)=>o(a[0])-o(b[0])||a[1]-b[1]).map(x=>x[0])}
function showPending(){
  if($("#modalRoot").innerHTML) return;
  if(!S.pending.length){PEND_BUDGET=3;return}
  if(PEND_BUDGET<=0&&!PEND_MUST.has(S.pending[0].type)) return;   // Rest kommt beim nächsten Mal
  const ev=S.pending.shift(); PEND_BUDGET--; if(!S.pending.length) PEND_BUDGET=3;
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
  if(ev.type==="bilanz") return bilanzSheet(ev);
  if(ev.type==="plusStart") return plusStartSheet();
  if(ev.type==="plusEnd") return plusEndSheet();
  if(ev.type==="planAsk") return planAskSheet(ev);
  if(ev.type==="chapter") return chapterSheet(ev.n,true);
  if(ev.type==="umfrage") return umfrageSheet(ev);
  if(ev.type==="musicAsk"){CUR_EV=null; if(S.music!==undefined||S.sound===false) return showPending(); return musicAskSheet()}
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
      ()=>{$("#unlGo").onclick=()=>{closeModal();tab=go;if(go==="projekt")bauTab=fs[0].id==="reise"?"reise":"laden";PEND_BUDGET=0;render();window.scrollTo(0,0)}});   // in Ruhe ansehen, der Rest wartet
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
  if(ev.type==="mfest"){
    const x=festOf(ev.m);
    return sheet(`<div class="anim">${base(here().filter(r=>r.kind==="mensch").slice(0,5).map((r,i)=>`<g class="bob" style="animation-delay:${i*.2}s">${figure(r,196+i*16+(i>1?24:0),136)}</g>`).join("")+confetti(),false)}</div>
      <div class="mstamp big ok" aria-hidden="true"><span>${x.e}</span><small>${esc(festMonth(ev.m))}</small></div>
      <p class="label" style="color:var(--amber)">Monatsfest</p><h2>${esc(x.n)}</h2><p class="muted">${esc(x.t)}</p>
      <p class="small muted">+50 Punkte, +5 % Glück und der Stempel für ${esc(festMonth(ev.m))} ist jetzt in deinem Album.</p><button class="btn" data-ok>Mitfeiern</button>`);
  }
  if(ev.type==="baseline"){
    sheet(`<p class="label" style="color:var(--lime)">Erste Woche gemessen</p><h2>Dein Schnitt: ${hm(ev.avg)} pro Tag</h2>
      <p class="muted">So viel warst du in deiner ersten Woche mit OffLand im Schnitt am Handy. Geschätzt hattest du ${hm(ev.old)}. Ab jetzt rechnet OffLand mit dem gemessenen Wert.</p>
      <p class="small muted">Weil man in der ersten Woche oft schon bewusster aufs Handy schaut, kann der Wert etwas niedrig sein. Du kannst ihn anpassen.</p>
      <label class="field" for="baseAdj">Bisheriger Schnitt: <span id="baseAdjOut" class="num">${hm(S.baseline)}</span><input id="baseAdj" type="range" min="30" max="600" step="15" value="${S.baseline}"></label>
      <button class="btn" data-ok>Passt so</button>`);
    const ba=$("#baseAdj"); if(ba) ba.oninput=()=>{S.baseline=+ba.value;$("#baseAdjOut").textContent=hm(S.baseline);save()};
    return;
  }
  if(ev.type==="jubi"){
    const ds=S.days.slice(0,ev.n), good=ds.filter(d=>d.min<=S.budget).length, saved=ds.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0);
    const ppl=here().filter(r=>r.kind==="mensch").length, ani=here().filter(r=>r.kind!=="mensch").length;
    return sheet(`<div class="anim">${base(here().slice(0,5).map((r,i)=>`<g class="bob" style="animation-delay:${i*.2}s">${figure(r,196+i*16+(i>1?24:0),136)}</g>`).join("")+hearts(240,84)+confetti(),false)}</div>
      <p class="label" style="color:var(--lime)">Insel-Jubiläum</p><h2>${ev.n} Tage OffLand</h2>
      ${saysHtml("bay",ev.n>=365?"Ein ganzes Jahr! Ich hab eine Rede vorbereitet, aber ich fang lieber gleich an zu weinen.":"Weißt du noch, wie leer es hier am Anfang war? Schau dich mal um.")}
      <div class="jubi-grid"><div><b class="num">${good}</b><span>Tage im Budget</span></div><div><b class="num">${hm(saved)}</b><span>weniger am Handy</span></div><div><b class="num">${ppl}</b><span>Menschen</span></div><div><b class="num">${ani}</b><span>Tiere</span></div></div>
      <p class="small muted">Als Dankeschön: +${ev.n} Punkte.</p><button class="btn" data-ok>Weiter so</button>`);
  }
  if(ev.type==="comeback"){
    const y=addDays(today(),-1);
    return sheet(`<div class="anim">${base(here().slice(0,4).map((r,i)=>`<g class="bob">${figure(r,214+i*14,134)}</g>`).join("")+hearts(240,90),false)}</div>
      <p class="label" style="color:var(--lime)">Schön, dass du da bist</p><h2>Die Insel hat auf dich gewartet</h2>
      ${saysHtml("bay","Keine Sorge, hier ist niemand sauer. Pausen gehören dazu. Wollen wir einfach von heute an weitermachen?")}
      <p class="small muted">${ev.miss} Tage fehlen. Du kannst sie als Pause abhaken, ohne Punktabzug, oder sie wie gewohnt nachtragen. Als Willkommensgeschenk gibt es eine Sonne für den nächsten schwierigen Tag.</p>
      <button class="btn" id="cbSkip">Als Pause abhaken</button><button class="btn ghost" id="cbFill">Lieber nachtragen</button>`,()=>{
      const gift=()=>{S.sun=(S.sun||0)+1};
      $("#cbSkip").onclick=()=>{gift(); if(S.lastDay<y) S.lastDay=y; S.comeback=S.lastDay; stat("comeback_pause"); log("Pause von "+ev.miss+" Tagen abgehakt. Weiter geht's.","info"); save(); closeModal(); render(); showPending()};
      $("#cbFill").onclick=()=>{gift(); save(); closeModal(); render(); showPending()};
    });
  }
  if(ev.type==="fest"){
    return sheet(`<div class="anim">${base(`<g transform="translate(240 134) scale(1.2)">${itemSvg("feuer")}</g>`+here().filter(r=>r.kind==="mensch").slice(0,5).map((r,i)=>`<g class="bob" style="animation-delay:${i*.2}s">${figure(r,200+i*16+(i>1?24:0),136)}</g>`).join("")+`${[0,1,2,3,4,5].map(i=>`<g class="glow" style="animation-delay:${i*.3}s"><circle cx="${190+i*22}" cy="${80+(i%2)*8}" r="4" fill="#FFD27A"/></g>`).join("")}`+confetti(),false)}</div>
      <p class="label" style="color:var(--amber)">Inselfest</p><h2>Die Insel feiert dich</h2><p class="muted">${ev.good} von 7 Tagen im Budget. Laternen, Lagerfeuer und Musik: +5 % Glück und +30 Punkte.</p><button class="btn" data-ok>Mitfeiern</button>`);
  }
  if(ev.type==="guest") return guestSheet(ev);
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
  if(ev.type==="fanpost"){
    const card=makeFanCard(); S.glueck=Math.min(100,S.glueck+2); stat("fanpost");
    log("Fanpost: Jemand hat Gutes über die Insel gehört. +2 % Glück.","good"); save();
    const fresh=S.postcards.filter(c=>c.motif===card.motif).length===1;
    return sheet(`<p class="label" style="color:var(--lime)">Fanpost${fresh?" · neues Motiv!":""}</p>${postcardHtml(card)}<p class="small muted">Gute Tage sprechen sich herum: +2 % Glück${card.soon?". Bald zieht jemand Neues ein.":"."}</p><button class="btn" data-ok>Ins Album legen</button>`);
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
  const draft=r.kind==="mensch"?lookIdx(r):tierDraft(r);
  sheet(`${ev.type==="rename"?"":`<div class="anim">${animScene(ev)}</div>`}<p class="label" style="color:var(--lime)">${ev.type==="rename"?"Name und Aussehen":ev.type==="birth"?"Nachwuchs":"Neue Bewohner"}</p>
    <h2>${esc(head)}</h2><p class="muted">${esc(text)}</p>
    <label class="field" for="nameIn">Wie soll ${r.kind==="mensch"?"die Person":"das Tier"} heißen?</label>
    <div class="row"><input id="nameIn" type="text" maxlength="20" value="${esc(r.name)}"><button class="iconbtn" id="dice" aria-label="Zufälligen Namen würfeln"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A4FF" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="#B6A4FF"/><circle cx="15" cy="15" r="1.3" fill="#B6A4FF"/><circle cx="15" cy="9" r="1.3" fill="#B6A4FF"/><circle cx="9" cy="15" r="1.3" fill="#B6A4FF"/></svg></button></div>
    ${lookEditor(r,draft)}${r.kind==="mensch"&&lvOf(r)<4?`<p class="small muted lv-hint">✨ So sieht ${esc(r.name)} aus, wenn die Farbe ganz zurück ist. Gerade: <b>${LV_NAMES[lvOf(r)]}</b>. Gute Tage bringen sie zurück.</p>`:""}
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
    const keep={look:r.look,fur:r.fur,gear:r.gear};
    if(r.kind==="mensch") r.look=Object.assign({},draft); else {r.fur=draft.fur; r.gear=tierGear(draft)}
    a.innerHTML=animScene(ev); a.classList.add("skip");
    if(keep.look===undefined) delete r.look; else r.look=keep.look;
    if(keep.fur===undefined) delete r.fur; else r.fur=keep.fur;
    if(keep.gear===undefined) delete r.gear; else r.gear=keep.gear;
  });
  $("#nameOk").onclick=()=>{
    const n=inp.value.trim()||r.name; const old=r.name; r.name=n.slice(0,20);
    if(r.kind==="mensch") r.look=Object.assign({},draft); else {if((FUR[r.art]||[]).length>1) r.fur=draft.fur; const g=tierGear(draft); if(g) r.gear=g; else delete r.gear}
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
  const tmp=Object.assign({},r,{sick:null,phone:false,lv:4,lvUp:null,lvFull:true});   // im Editor sieht man immer, wie jemand ganz zurück aussieht
  if(r.kind==="mensch") tmp.look=draft; else {tmp.fur=draft.fur; tmp.gear=tierGear(draft)}
  const adult=r.kind==="mensch"&&stage(r)!=="baby"&&stage(r)!=="kind";
  const tier=r.kind!=="mensch", main=`<svg width="${tier?124:76}" height="${tier?104:adult?92:78}" viewBox="${r.kind==="mensch"?(stage(r)==="baby"?"-8.5 -15.5 17 17":stage(r)==="kind"?"-12 -25 24 26":"-13.5 -32.4 27 33.4"):tierVB(tmp.art,124/104,tierScale(tmp))}" aria-hidden="true">${figure(tmp,0,0)}</svg>`;
  if(!adult) return main;
  // Kleine Schatten-Vorschau: so leuchten die Augen, solange die Farbe noch fehlt
  const sh=Object.assign({},tmp,{lv:1,lvFull:false});
  return main+`<div class="look-shadow"><svg width="40" height="46" viewBox="-11 -31 24 32" aria-hidden="true">${figure(sh,0,0)}</svg><span>als Schatten</span></div>`;
}
let LOOK_PANE="looks";
/* Fertige Looks: komplette Stile als Startpunkt, danach in der Umkleide anpassen */
const LOOKS=[["Surfer",{skin:1,style:18,hair:4,shirt:5,pat:7,beard:0,acc:[]}],["Skaterin",{skin:4,style:5,hair:0,shirt:2,pat:4,beard:0,acc:[],accC:1}],["Opa Gerd",{skin:0,style:10,hair:7,beard:4,acc:[2],shirt:11,pat:3}],
  ["Büro",{skin:3,style:12,hair:0,shirt:7,pat:0,beard:0,acc:[2]}],["Hipster",{skin:2,style:16,hair:2,beard:4,shirt:12,pat:3,acc:[2]}],["Sporty",{skin:5,style:15,hair:6,shirt:8,pat:1,beard:0,acc:[7],accC:7}],
  ["Künstlerin",{skin:1,style:8,hair:8,shirt:13,pat:2,beard:0,acc:[6],accC:10}],["Rocker",{skin:3,style:9,hair:5,shirt:8,pat:4,beard:0,acc:[3]}],["Gärtnerin",{skin:4,style:11,hair:2,shirt:12,pat:6,beard:0,acc:[4],accC:4}],
  ["Fischer",{skin:2,style:6,hair:7,beard:4,shirt:3,pat:3,acc:[4],accC:8}],["Gamer",{skin:0,style:17,hair:1,shirt:13,pat:8,beard:0,acc:[2]}],["Festival",{skin:5,style:7,hair:10,shirt:6,pat:9,beard:0,acc:[3,6],accC:1}],
  ["Bücherwurm",{skin:0,style:2,hair:3,shirt:0,pat:5,beard:0,acc:[1,2],accC:8}],["Strandkind",{skin:4,style:4,hair:5,shirt:4,pat:7,beard:0,acc:[3]}],["Bergfex",{skin:1,style:14,hair:3,beard:1,shirt:12,pat:3,acc:[1],accC:8}],["DJ",{skin:5,style:3,hair:9,shirt:14,pat:9,beard:0,acc:[3]}]];
const UK_PANES=[["looks","✨","Looks"],["gesicht","🙂","Gesicht"],["haare","💇","Haare"],["bart","🧔","Bart"],["shirt","👕","Shirt"],["muster","🎨","Muster"],["extras","🕶️","Extras"],["augen","👁️","Augen"]];
function ukFig(r,d,ch,s){const t=Object.assign({},r,{sick:null,phone:false,lv:4,lvUp:null,lvFull:true,look:Object.assign({},d,ch)});
  return `<svg width="${s}" height="${Math.round(s*1.15)}" viewBox="-12.5 -31 25 32" aria-hidden="true">${figure(t,0,0)}</svg>`}
function umkleide(r,d){
  const kid=stage(r)==="kind", panes=UK_PANES.filter(p=>!kid||!["bart","muster","augen"].includes(p[0]));
  if(!panes.some(p=>p[0]===LOOK_PANE)) LOOK_PANE="looks";
  const sw=(label,key,list,sel)=>`<div class="sw-row" role="radiogroup" aria-label="${label}"><span class="small muted">${label}</span>${list.map((c,i)=>`<button type="button" class="sw${i===sel?" on":""}" data-look="${key}" data-v="${i}" style="background:${c}" aria-label="${label} ${i+1}" aria-pressed="${i===sel}"></button>`).join("")}</div>`;
  const tiles=(key,names,cur,ch)=>`<div class="uk-grid" role="radiogroup">${names.map((n,i)=>`<button type="button" class="uk-tile${i===cur?" on":""}" data-look="${key}" data-v="${i}" aria-label="${n}" aria-pressed="${i===cur}">${ukFig(r,d,ch(i),62)}</button>`).join("")}</div>`;
  const al=accList(d.acc);
  const body={
    looks:`<p class="uk-h">Fertige Looks <span>${LOOKS.length}</span></p><div class="uk-grid">${LOOKS.map(([n,l],i)=>`<button type="button" class="uk-tile lk" data-lookset="${i}" aria-label="Look ${n}">${ukFig(r,d,kid?Object.assign({},l,{beard:0}):l,62)}<span>${n}</span></button>`).join("")}</div>`,
    gesicht:sw("Hautfarbe","skin",SKIN,d.skin),
    haare:`<p class="uk-h">Frisur</p>${tiles("style",STYLE_NAMES,d.style,i=>({style:i}))}${sw("Haarfarbe","hair",HAIR,d.hair)}`,
    bart:`<p class="uk-h">Bart</p>${tiles("beard",BEARD_NAMES,(d.beard||0)%BEARD_NAMES.length,i=>({beard:i}))}`,
    shirt:sw(kid?"Shirt":"Oberteil","shirt",SHIRT,d.shirt),
    muster:`<p class="uk-h">Muster</p>${tiles("pat",PAT_NAMES,(d.pat||0)%PAT_NAMES.length,i=>({pat:i}))}`,
    extras:`<p class="uk-h">Extras <span>mehrere möglich</span></p><div class="uk-grid">${ACC_NAMES.map((n,i)=>{const on=i?al.includes(i):!al.length, pl=ACC_PLUS.has(i); if(pl&&!plusShown()) return "";return `<button type="button" class="uk-tile${on?" on":""}${pl?" uk-plus":""}" data-look="acc" data-v="${i}" aria-label="${n}${pl&&!plusActive()?" (Plus)":""}" aria-pressed="${on}">${ukFig(r,d,{acc:i?accToggle(al.filter(x=>x!==i),i):[]},62)}<span>${n}</span>${pl?`<i class="uk-star" aria-hidden="true">★</i>`:""}</button>`}).join("")}</div>${sw("Farbe der Extras","accC",SHIRT,d.accC)}`,
    augen:`${sw("Leuchtaugen (als Schatten)","eye",LV_EYES,(d.eye||0)%LV_EYES.length)}<p class="small muted">So leuchten die Augen, solange die Farbe noch fehlt. Unten links im Spiegel siehst du es.</p>`
  }[LOOK_PANE];
  return `<div class="uk"><div class="uk-rail" role="tablist">${panes.map(([k,e,n])=>`<button type="button" role="tab" class="uk-r${k===LOOK_PANE?" on":""}" data-pane="${k}" aria-selected="${k===LOOK_PANE}"><b aria-hidden="true">${e}</b><i>${n}</i></button>`).join("")}</div>
    <div class="uk-main"><div class="uk-mir"><div class="look-prev" id="lookPrev">${lookPreview(r,d)}</div><button type="button" class="uk-photo" data-photo aria-label="Aussehen aus Foto übernehmen">📷</button><button type="button" class="uk-dice" data-dice aria-label="Zufälliger Look">🎲</button></div>
    ${photoBanner(r,d)}<div class="uk-body">${body}</div></div></div>`;
}
/* Umkleide für Tiere: gleicher Aufbau wie bei Menschen (Leiste links, Spiegel, Kacheln) */
const TIER_LOOKS=[["Chillig",{specs:1,collar:3,cc:5}],["Rockstar",{specs:1,collar:1,cc:14}],["Verliebt",{specs:3,collar:2,cc:6}],["Schick",{specs:0,collar:4,cc:8}],
  ["Sportlich",{specs:4,collar:1,cc:1}],["Pilot",{specs:2,collar:3,cc:11}],["Klassisch",{specs:0,collar:2,cc:8}],["Strand",{specs:1,collar:3,cc:15}],["Natur",{specs:0,collar:0,cc:0}]];
const UK_TIER=[["looks","✨","Looks"],["fell","🎨","Fell"],["hals","🎀","Halsband"],["brille","🕶️","Brille"]];
/* Enger Ausschnitt ums Tier, damit Brille und Halsband gut zu sehen sind */
function tierVB(a,ratio,sc){const B=(ART_BOX[a]||[-12,-16,12,1]).map(v=>v*(sc||1)), cx=(B[0]+B[2])/2, cy=(B[1]+B[3])/2, w=Math.max(B[2]-B[0],(B[3]-B[1])*ratio)+3, h=w/ratio;
  return [cx-w/2,cy-h/2,w,h].map(v=>+v.toFixed(1)).join(" ")}
function ukTier(r,d,ch,s){const g=Object.assign({},d,ch), vb=tierVB(r.art,1/.85);
  return `<svg width="${s}" height="${Math.round(s*.85)}" viewBox="${vb}" aria-hidden="true">${animalSvg(r.art,g.fur||0)}${gearSvg(r.art,g)}</svg>`}
function umkleideTier(r,d){
  const nf=(FUR[r.art]||[{}]).length, col=hasCollar(r.art);
  const panes=UK_TIER.filter(p=>(p[0]!=="fell"||nf>1)&&(p[0]!=="hals"||col));
  if(!panes.some(p=>p[0]===LOOK_PANE)) LOOK_PANE="looks";
  const tiles=(key,names,cur,ch,val)=>`<div class="uk-grid" role="radiogroup">${names.map((n,i)=>{const v=val?val(i):i, pl=plusLook(r,key,v)&&!plusActive();
    return `<button type="button" class="uk-tile${i===cur?" on":""}${plusLook(r,key,v)?" uk-plus":""}" data-look="${key}" data-v="${v}" aria-label="${n}${pl?" (Plus)":""}" aria-pressed="${i===cur}">${ukTier(r,d,ch(i),62)}<span>${n}</span>${plusLook(r,key,v)?`<i class="uk-star" aria-hidden="true">★</i>`:""}</button>`}).join("")}</div>`;
  const sw=(label,key,list,sel)=>`<div class="sw-row" role="radiogroup" aria-label="${label}"><span class="small muted">${label}</span>${list.map((c,i)=>`<button type="button" class="sw${i===sel?" on":""}" data-look="${key}" data-v="${i}" style="background:${c}" aria-label="${label} ${i+1}" aria-pressed="${i===sel}"></button>`).join("")}</div>`;
  const body={
    looks:`<p class="uk-h">Fertige Looks <span>${TIER_LOOKS.length}</span></p><div class="uk-grid">${TIER_LOOKS.map(([n,l],i)=>`<button type="button" class="uk-tile lk" data-lookset="${i}" aria-label="Look ${n}">${ukTier(r,d,col?l:Object.assign({},l,{collar:0}),62)}<span>${n}</span></button>`).join("")}</div>`,
    fell:`<p class="uk-h">Fellfarbe</p>${tiles("fur",Array.from({length:nf},(_,i)=>"Farbe "+(i+1)).concat(plusShown()?["Gold"]:[]),d.fur===99?nf:d.fur||0,i=>({fur:i===nf?99:i}),i=>i===nf?99:i)}`,
    hals:`<p class="uk-h">Halsband</p>${tiles("collar",plusShown()?COLLAR_NAMES:COLLAR_NAMES.slice(0,COLLAR_FREE),d.collar||0,i=>({collar:i}))}${sw("Farbe","cc",SHIRT,d.cc||0)}`,
    brille:`<p class="uk-h">Brille</p>${tiles("specs",plusShown()?SPECS_NAMES:SPECS_NAMES.slice(0,SPECS_FREE),d.specs||0,i=>({specs:i}))}`
  }[LOOK_PANE];
  return `<div class="uk"><div class="uk-rail" role="tablist">${panes.map(([k,e,n])=>`<button type="button" role="tab" class="uk-r${k===LOOK_PANE?" on":""}" data-pane="${k}" aria-selected="${k===LOOK_PANE}"><b aria-hidden="true">${e}</b><i>${n}</i></button>`).join("")}</div>
    <div class="uk-main"><div class="uk-mir"><div class="look-prev" id="lookPrev">${lookPreview(r,d)}</div><button type="button" class="uk-photo" data-photo aria-label="Aussehen aus Foto übernehmen">📷</button><button type="button" class="uk-dice" data-dice aria-label="Zufälliger Look">🎲</button></div>
    ${photoBanner(r,d)}<div class="uk-body">${body}</div></div></div>`;
}
const tierDraft=r=>Object.assign({fur:animalVar(r),collar:0,cc:0,specs:0},r.gear||{});
function tierGear(d){const g={collar:d.collar||0,cc:d.cc||0,specs:d.specs||0};return g.collar||g.specs?g:null}
/* Aus Foto: Hautton, Haare, Bart, Brille, Oberteil oder Fellfarbe werden nur auf dem Gerät aus dem Bild gelesen.
   Das Foto wird nicht hochgeladen und nicht gespeichert, danach kann man im Editor alles anpassen. */
let PHOTO_RES=null;
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function rgbLab(c){const f=v=>{v/=255;return v>.04045?Math.pow((v+.055)/1.055,2.4):v/12.92}, [r,g,b]=c.map(f);
  const x=(r*.4124+g*.3576+b*.1805)/.95047, y=r*.2126+g*.7152+b*.0722, z=(r*.0193+g*.1192+b*.9505)/1.08883, q=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;
  return [116*q(y)-16,500*(q(x)-q(y)),200*(q(y)-q(z))]}
const labD=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const nearC=(c,list)=>{const l=rgbLab(c);let bi=0,bd=1e9;list.forEach((h,i)=>{const d=labD(l,rgbLab(hexRgb(h)));if(d<bd){bd=d;bi=i}});return bi};
const medC=a=>[0,1,2].map(k=>{const v=a.map(c=>c[k]).sort((x,y)=>x-y);return v[v.length>>1]});
/* Erkennung mit MediaPipe (läuft im Gerät): Bibliothek und Modelle werden beim ersten Mal geladen, das Foto bleibt lokal */
const MP_BASE="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21", MP_M="https://storage.googleapis.com/mediapipe-models/image_segmenter/";
const MP_MODEL={mensch:MP_M+"selfie_multiclass_256x256/float32/1/selfie_multiclass_256x256.tflite",tier:MP_M+"deeplab_v3/float32/1/deeplab_v3.tflite"};
let MP=null;
async function mpSegment(kind,cv){
  if(!MP){const V=await import(MP_BASE+"/vision_bundle.mjs"); MP={V,fs:await V.FilesetResolver.forVisionTasks(MP_BASE+"/wasm"),seg:{}}}
  if(!MP.seg[kind]) MP.seg[kind]=await MP.V.ImageSegmenter.createFromOptions(MP.fs,{baseOptions:{modelAssetPath:MP_MODEL[kind],delegate:"CPU"},runningMode:"IMAGE",outputCategoryMask:true,outputConfidenceMasks:false});
  const res=MP.seg[kind].segment(cv), m=res.categoryMask, out={w:m.width,h:m.height,a:m.getAsUint8Array().slice()};
  if(res.close) res.close(); return out;
}
async function photoPx(file){
  let src;
  try{src=await createImageBitmap(file,{imageOrientation:"from-image"})}catch(e){
    src=await new Promise((ok,no)=>{const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{URL.revokeObjectURL(u);ok(im)};im.onerror=no;im.src=u})}
  const k=Math.min(1,320/Math.max(src.width,src.height)), w=Math.max(1,Math.round(src.width*k)), h=Math.max(1,Math.round(src.height*k));
  const cv=document.createElement("canvas"); cv.width=w; cv.height=h; const cx=cv.getContext("2d"); cx.drawImage(src,0,0,w,h);
  const d=cx.getImageData(0,0,w,h).data.slice(); if(src.close) src.close();
  // Weißabgleich zur Hälfte: Lampenlicht macht Haut und Haare sonst zu orange
  const mean=[0,0,0]; for(let i=0;i<d.length;i+=4){mean[0]+=d[i];mean[1]+=d[i+1];mean[2]+=d[i+2]}
  const g=(mean[0]+mean[1]+mean[2])/3, gain=mean.map(m=>Math.max(.75,Math.min(1.45,1+(g/Math.max(1,m)-1)*.6)));
  for(let i=0;i<d.length;i+=4) for(let k=0;k<3;k++) d[i+k]=Math.min(255,d[i+k]*gain[k]);
  const at=(x,y)=>{x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));const i=(y*w+x)*4;return [d[i],d[i+1],d[i+2]]};
  return {w,h,at,cv};
}
/* Zusammenhängende Flächen einer Maske (4er-Nachbarschaft) */
function maskComps(w,h,fn){
  const seen=new Uint8Array(w*h), comps=[];
  for(let i=0;i<w*h;i++){ if(seen[i]||!fn(i%w,(i/w)|0)) continue;
    const st=[i], px=[]; seen[i]=1;
    while(st.length){const j=st.pop(); px.push(j); const x=j%w,y=(j/w)|0;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy; if(X<0||Y<0||X>=w||Y>=h) continue; const k=Y*w+X; if(!seen[k]&&fn(X,Y)){seen[k]=1;st.push(k)}}}
    comps.push(px)}
  return comps;
}
/* Mensch (Selfie-Modell: 1 Haare, 2 Körperhaut, 3 Gesichtshaut, 4 Kleidung, 5 Accessoires): größtes Gesicht nehmen, drumherum lesen */
function photoHuman(P,M){
  const {w,h,at}=P, cls=(x,y)=>M.a[Math.min(M.h-1,(y*M.h/h)|0)*M.w+Math.min(M.w-1,(x*M.w/w)|0)];
  let best=null,bs=0;
  for(const px of maskComps(w,h,(x,y)=>cls(x,y)===3)){ if(px.length<w*h*.004) continue;
    let sx=0; for(const j of px) sx+=j%w; const sc=px.length*(1.2-Math.abs(sx/px.length/w-.5)); if(sc>bs){bs=sc;best=px}}
  if(!best) return null;
  const xs=best.map(j=>j%w).sort((a,b)=>a-b), ys=best.map(j=>(j/w)|0).sort((a,b)=>a-b), q=(a,f)=>a[Math.min(a.length-1,Math.floor(a.length*f))];
  const L=q(xs,.02), R=q(xs,.98), top=q(ys,.01), bot=q(ys,.99), fw=Math.max(3,R-L), fh=Math.max(3,bot-top), fa=best.length;
  const pick=(x0,x1,y0,y1,c)=>{const o=[];for(let y=Math.max(0,y0|0);y<Math.min(h,y1);y++)for(let x=Math.max(0,x0|0);x<Math.min(w,x1);x++) if(cls(x,y)===c) o.push([x,y]);return o};
  const col=pts=>medC(pts.map(([x,y])=>at(x,y)));
  const res={};
  // Hautton nur bei ordentlichem Licht: in dunklen oder lampenbeleuchteten Fotos wirkt Haut viel dunkler, dann lieber selbst wählen lassen
  const sk=pick(L+fw*.2,R-fw*.2,top+fh*.2,top+fh*.8,3), skc=col(sk.length?sk:best.map(j=>[j%w,(j/w)|0]));
  res.skin=rgbLab(skc)[0]>=58?nearC(skc,SKIN):null;
  // Haare: Flächen, die das Gesicht berühren (bei Gruppenfotos nicht die Haare der Nachbarn)
  const near=(x,y)=>x>=L-fw*.25&&x<=R+fw*.25&&y>=top-fh*.45&&y<=bot;
  const hp=[]; for(const px of maskComps(w,h,(x,y)=>cls(x,y)===1)) if(px.some(j=>near(j%w,(j/w)|0))) for(const j of px){const x=j%w,y=(j/w)|0; if(x>L-fw*1.1&&x<R+fw*1.1&&y>top-fh*1.2&&y<bot+fh*2.6) hp.push([x,y])}
  // Frisur aus der Form der Haare: Länge, Pony oder Mittelscheitel, Dutt, Volumen. Dazu passende Alternativen zur Auswahl.
  if(hp.length<fa*.07){res.style=10; res.alt=[10,6,0,15]}
  else{res.hair=nearC(col(hp),HAIR);
    const side=(y0,y1)=>hp.filter(([x,y])=>y>y0&&y<=y1&&(x<L+fw*.15||x>R-fw*.15)).length;
    const low=side(bot+fh*.05,1e9), chin=side(bot-fh*.3,bot+fh*.05);
    const hTop=Math.min(...hp.map(p=>p[1])), topW=hp.filter(([x,y])=>y<hTop+fh*.15).map(p=>p[0]), tw=topW.length?Math.max(...topW)-Math.min(...topW):0;
    // Volumen nur, wenn die Haare auf beiden Seiten weit abstehen (bei Gruppenfotos liegen sonst die Haare der Nachbarin daneben)
    const midY=hp.filter(([x,y])=>y>top&&y<bot), ext=Math.min(L-Math.min(L,...midY.map(p=>p[0])),Math.max(R,...midY.map(p=>p[0]))-R);
    const bun=top-hTop>fh*.62&&tw<fw*.55, wide=ext>fw*.5;
    if(bun){res.style=2; res.alt=[2,16,7,3]}
    else if(low>fa*.18){res.style=wide?4:18; res.alt=[res.style,18,1,4,7,11]}
    else if(chin>fa*.1){res.style=8; res.alt=[8,1,18,4]}
    else{res.style=0; res.alt=[0,12,13,14]}
    res.alt=[...new Set(res.alt)].slice(0,4)}
  // Bart: Haar-Pixel mittig am Kinn (lange Haare liegen seitlich daneben)
  const brd=pick(L+fw*.3,R-fw*.3,top+fh*.74,bot+fh*.1,1).length/Math.max(1,fw*.4*fh*.36);
  const mus=pick(L+fw*.32,R-fw*.32,top+fh*.6,top+fh*.72,1).length/Math.max(1,fw*.36*fh*.12);
  res.beard=mus<.15?0:brd>.35?4:brd>.18?1:0;
  // Brille: Accessoire-Pixel auf Augenhöhe
  const gl=pick(L,R,top+fh*.22,top+fh*.6,5);
  if(gl.length>fw*fh*.38*.07) res.specs=rgbLab(col(gl))[0]<32&&gl.length>fw*fh*.38*.18?3:2; else res.specs=0;
  // Oberteil: Kleidung unter dem Kinn
  const sh=pick(L-fw*.4,R+fw*.4,bot+fh*.1,bot+fh*1.8,4);
  if(sh.length>fa*.25) res.shirt=nearC(col(sh),SHIRT);
  return res;
}
/* Tier (DeepLab: 3 Vogel, 8 Katze, 10 Kuh, 12 Hund, 13 Pferd, 17 Schaf): Hauptfarben des Tiers mit den Fellvarianten vergleichen */
function photoFur(P,M,art){
  const {w,h,at}=P, V=FUR[art]||[{}]; if(V.length<2) return null;
  const AN=[3,8,10,12,13,17], cls=(x,y)=>M.a[Math.min(M.h-1,(y*M.h/h)|0)*M.w+Math.min(M.w-1,(x*M.w/w)|0)];
  let px=[]; for(const c of maskComps(w,h,(x,y)=>AN.includes(cls(x,y)))) if(c.length>px.length) px=c;
  if(px.length<w*h*.03){ // nicht erkannt (z. B. Hase, Ziege): Bildmitte ohne Rand-Hintergrund
    const border=[];for(let x=0;x<w;x+=2)border.push(at(x,0),at(x,h-1));for(let y=0;y<h;y+=2)border.push(at(0,y),at(w-1,y));const bg=rgbLab(medC(border));
    px=[]; for(let y=Math.round(h*.2);y<h*.9;y++)for(let x=Math.round(w*.2);x<w*.8;x++) if(labD(rgbLab(at(x,y)),bg)>18) px.push(y*w+x);
    if(px.length<w*h*.05) return null}
  const L=px.filter((_,i)=>i%2===0).map(j=>rgbLab(at(j%w,(j/w)|0)));
  let cen=[L[0],L[L.length>>1],L[L.length-1]].map(c=>c.slice()), cnt=[0,0,0];
  for(let it=0;it<10;it++){const sum=cen.map(()=>[0,0,0]); cnt=[0,0,0];
    for(const p of L){let bi=0,bd=1e9; cen.forEach((c,i)=>{const d=labD(p,c);if(d<bd){bd=d;bi=i}}); cnt[bi]++; for(let k=0;k<3;k++) sum[bi][k]+=p[k]}
    cen=cen.map((c,i)=>cnt[i]?sum[i].map(v=>v/cnt[i]):c)}
  const ord=[0,1,2].sort((a,b)=>cnt[b]-cnt[a]), main=cen[ord[0]], sec=cen[ord[1]], keys=Object.keys(V.find(v=>Object.keys(v).length)||{});
  let bi=0,bd=1e9;
  V.forEach((v,i)=>{const cols=keys.map(k=>rgbLab(hexRgb(v[k]||k)));
    const d=Math.min(...cols.map(c=>labD(main,c)))+.35*Math.min(...cols.map(c=>labD(sec,c))); if(d<bd){bd=d;bi=i}});
  return {fur:bi};
}
async function photoLook(r,draft,file){
  let P,M; try{P=await photoPx(file)}catch(e){toast("Das Foto konnte nicht gelesen werden.");return false}
  try{M=await mpSegment(r.kind==="mensch"?"mensch":"tier",P.cv)}catch(e){console.warn("Foto-Erkennung:",e);toast("Für die Foto-Erkennung braucht OffLand beim ersten Mal kurz Internet.");return false}
  const prev=JSON.parse(JSON.stringify(draft)), chips=[]; let alt=[];
  if(r.kind!=="mensch"){const f=photoFur(P,M,r.art);
    if(!f){toast("Auf dem Foto war kein Tier gut zu erkennen. Am besten von nah und vor ruhigem Hintergrund.");return false}
    draft.fur=f.fur; chips.push(["Fellfarbe",null])}
  else{const f=photoHuman(P,M);
    if(!f){toast("Kein Gesicht gefunden. Am besten ein Foto von vorne bei gutem Licht.");return false}
    const kid=stage(r)==="kind";
    alt=f.alt||[];
    if(f.skin!=null){draft.skin=f.skin; chips.push(["Hautton",SKIN[f.skin]])} else {chips.push(["Hautton bitte selbst wählen",null]); LOOK_PANE="gesicht"}
    if(f.hair!=null){draft.hair=f.hair; chips.push(["Haarfarbe",HAIR[f.hair]])}
    if(f.style!=null){draft.style=f.style; chips.push([STYLE_NAMES[f.style],null])}
    if(!kid&&f.beard!=null){draft.beard=f.beard; if(f.beard) chips.push([BEARD_NAMES[f.beard],null])}
    const al=accList(draft.acc).filter(a=>a!==2&&a!==3); draft.acc=f.specs?accToggle(al,f.specs):al; if(f.specs) chips.push([ACC_NAMES[f.specs],null]);
    if(f.shirt!=null){draft.shirt=f.shirt; draft.pat=0; chips.push([kid?"Shirt":"Oberteil",SHIRT[f.shirt]])}}
  if(PHOTO_RES&&PHOTO_RES.url) URL.revokeObjectURL(PHOTO_RES.url);
  PHOTO_RES={id:r.id,url:URL.createObjectURL(file),chips,prev,alt};
  return true;
}
function photoBanner(r,d){
  if(!PHOTO_RES||PHOTO_RES.id!==r.id) return "";
  // Frisur-Vorschläge als Köpfe, damit man die Haare gut erkennt
  const head=i=>{const t=Object.assign({},r,{sick:null,phone:false,lv:4,lvUp:null,lvFull:true,look:Object.assign({},d,{style:i})});
    return `<svg width="40" height="40" viewBox="-10.5 -28 21 21" aria-hidden="true">${figure(t,0,0)}</svg>`};
  const alt=PHOTO_RES.alt&&PHOTO_RES.alt.length>1?`<div class="photo-alt" role="radiogroup" aria-label="Frisur aus dem Foto">${PHOTO_RES.alt.map(i=>`<button type="button" class="${i===d.style?"on":""}" data-look="style" data-v="${i}" aria-label="${STYLE_NAMES[i]}" aria-pressed="${i===d.style}">${head(i)}</button>`).join("")}</div>`:"";
  return `<div class="photo-res" role="status"><img src="${PHOTO_RES.url}" alt=""><div><b>Aus deinem Foto</b><span>${PHOTO_RES.chips.map(([n,c])=>`<i>${c?`<em style="background:${c}"></em>`:""}${esc(n)}</i>`).join("")}</span>${alt}<small>Passt was nicht? Einfach anpassen. Das Foto bleibt auf deinem Handy. <button type="button" class="photo-undo" data-photo-undo>Rückgängig</button></small></div></div>`;
}
function lookEditor(r,d){
  if(PHOTO_RES&&!$("#lookEd")){URL.revokeObjectURL(PHOTO_RES.url); PHOTO_RES=null}
  const row=(label,key,list,sel)=>`<div class="sw-row" role="radiogroup" aria-label="${label}"><span class="small muted">${label}</span>${list.map((c,i)=>`<button type="button" class="sw${i===sel?" on":""}" data-look="${key}" data-v="${i}" style="background:${c}" aria-label="${label} ${i+1}" aria-pressed="${i===sel}"></button>`).join("")}</div>`;
  if(r.kind==="mensch"){
    const baby=stage(r)==="baby";   // Babys haben keine Frisur und keine Extras, also nur zeigen, was man bei ihnen sieht
    const styles=`<div class="sw-row" role="radiogroup" aria-label="Frisur"><span class="small muted">Frisur</span>${STYLE_NAMES.map((n,i)=>{const hs=hairSvg(i,i===5?"#B6A4FF":"#4A3222");
      return `<button type="button" class="sw sw-ic${i===d.style?" on":""}" data-look="style" data-v="${i}" aria-label="${n}" aria-pressed="${i===d.style}"><svg width="24" height="24" viewBox="-7.5 -24 15 15" aria-hidden="true">${hs.back}<circle cx="0" cy="-16" r="5" fill="#E8B48F"/>${hs.front}</svg></button>`}).join("")}</div>`;
    const al=accList(d.acc), accOn=i=>i?al.includes(i):!al.length, tsel=(d.top==null?lookIdx(r).top:d.top)%TOP_NAMES.length;
    const pats=lookPatRow(r,d), beards=lookBeardRow(d);
    const accs=`<div class="sw-row" role="group" aria-label="Extras"><span class="small muted">Extras (mehrere möglich)</span>${ACC_NAMES.map((n,i)=>{const a=accSvg(i,"#FF9C7A"),hs=hairSvg(0,"#4A3222");
      return `<button type="button" class="sw sw-ic${accOn(i)?" on":""}" data-look="acc" data-v="${i}" aria-label="${n}" aria-pressed="${accOn(i)}">${i===0?`<svg width="22" height="22" viewBox="-10 -10 20 20" aria-hidden="true"><circle r="7.5" fill="none" stroke="#9EA3B8" stroke-width="2"/><path d="M-5.3 5.3L5.3 -5.3" stroke="#9EA3B8" stroke-width="2" stroke-linecap="round"/></svg>`:`<svg width="24" height="24" viewBox="-7.5 -25 15 16" aria-hidden="true"><path d="M-6 -6c0-4 2.4-5.2 6-5.2s6 1.2 6 5.2z" fill="#5B8CD6"/>${a.body}${hs.back}<circle cx="0" cy="-16" r="5" fill="#E8B48F"/>${hs.front}${a.head}</svg>`}</button>`}).join("")}</div>`;
    if(baby) return `<div class="field"><span>Aussehen</span><div class="look"><div class="look-prev" id="lookPrev">${lookPreview(r,d)}</div><div class="look-opts">${row("Haut","skin",SKIN,d.skin)}${row("Haare","hair",HAIR,d.hair)}${row("Strampler","shirt",SHIRT,d.shirt)}</div></div></div>`;
    return `<div class="field"><span>Aussehen</span><div id="lookEd">${umkleide(r,d)}</div></div>`;
  }
  return `<div class="field"><span>Aussehen</span><div id="lookEd">${umkleideTier(r,d)}</div></div>`;
}
function lookIc(i,on,k,n,inner,vb){return `<button type="button" class="sw sw-ic${on?" on":""}" data-look="${k}" data-v="${i}" aria-label="${n}" aria-pressed="${on}"><svg width="24" height="24" viewBox="${vb}" aria-hidden="true">${inner}</svg></button>`}
function lookPatRow(r,d){const c=SHIRT[d.shirt]||"#5B8CD6", sel=(d.pat||0)%PAT_NAMES.length;
  return `<div class="sw-row" role="radiogroup" aria-label="Muster" id="patRow"><span class="small muted">Muster</span>${PAT_NAMES.map((n,i)=>lookIc(i,i===sel,"pat",n,`<path d="M-6.4 0q0-13 6.4-13.4q6.4.4 6.4 13.4z" fill="${c}"/><g clip-path="url(#lvBody)">${patSvg(i,c,r.name)}</g>`,"-7.5 -14 15 14.5")).join("")}</div>`}
function lookBeardRow(d){const hc=HAIR[d.hair]||"#4A3222", sel=(d.beard||0)%BEARD_NAMES.length;
  return `<div class="sw-row" role="radiogroup" aria-label="Bart" id="beardRow"><span class="small muted">Bart</span>${BEARD_NAMES.map((n,i)=>lookIc(i,i===sel,"beard",n,`<circle cx="0" cy="-16" r="5" fill="${SKIN[d.skin]||"#E8B48F"}"/>${hairSvg(0,hc).front}${beardSvg(i,hc)}<circle cx="-1.8" cy="-16.3" r=".55" fill="#14151F"/><circle cx="1.8" cy="-16.3" r=".55" fill="#14151F"/>`,"-7 -23 14 14")).join("")}</div>`}
function bindLookEditor(r,draft,onChange){
  const ed=$("#lookEd");
  if(ed){
    const UK=r.kind==="mensch"?umkleide:umkleideTier;
    const redraw=()=>{const b=ed.querySelector(".uk-body"), y=b?b.scrollTop:0; ed.innerHTML=UK(r,draft); const nb=ed.querySelector(".uk-body"); if(nb) nb.scrollTop=y; if(onChange) onChange()};
    ed.onclick=e=>{const t=e.target.closest("button"); if(!t||!ed.contains(t)) return;
      if(t.dataset.pane){LOOK_PANE=t.dataset.pane; ed.innerHTML=UK(r,draft); return}
      if(t.dataset.photo!=null){const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*";
        inp.onchange=async()=>{const f=inp.files&&inp.files[0]; if(!f) return;
          t.textContent="⏳"; t.disabled=true; if(!MP||!MP.seg[r.kind==="mensch"?"mensch":"tier"]) toast("Foto wird angeschaut … beim ersten Mal dauert es ein paar Sekunden.");
          const ok=await photoLook(r,draft,f); if(ok&&r.kind!=="mensch"&&!hasCollar(r.art)) draft.collar=0; redraw()};
        inp.click(); return}
      if(t.dataset.photoUndo!=null){if(PHOTO_RES){for(const k of Object.keys(draft)) if(!(k in PHOTO_RES.prev)) delete draft[k]; Object.assign(draft,PHOTO_RES.prev); URL.revokeObjectURL(PHOTO_RES.url); PHOTO_RES=null} redraw(); return}
      if(r.kind!=="mensch"){
        if(t.dataset.lookset!=null) Object.assign(draft,TIER_LOOKS[+t.dataset.lookset][1]);
        else if(t.dataset.dice!=null){const R=n=>Math.floor(Math.random()*n); Object.assign(draft,{fur:R((FUR[r.art]||[{}]).length),collar:hasCollar(r.art)&&Math.random()<.7?1+R(COLLAR_FREE-1):0,cc:R(SHIRT.length),specs:Math.random()<.6?1+R(SPECS_FREE-1):0})}
        else if(t.dataset.look){if(plusLook(r,t.dataset.look,+t.dataset.v)&&!plusActive()) return plusPaywall("looks"); draft[t.dataset.look]=+t.dataset.v}
        else return;
        if(!hasCollar(r.art)) draft.collar=0;
        redraw(); return}
      if(t.dataset.lookset!=null){Object.assign(draft,JSON.parse(JSON.stringify(LOOKS[+t.dataset.lookset][1]))); if(stage(r)==="kind") draft.beard=0; redraw(); return}
      if(t.dataset.dice!=null){const R=n=>Math.floor(Math.random()*n), kid=stage(r)==="kind";
        Object.assign(draft,{skin:R(SKIN.length),hair:R(HAIR.length),style:R(STYLE_NAMES.length),shirt:R(SHIRT.length),pat:Math.random()<.4?0:R(PAT_NAMES.length),beard:kid||Math.random()<.6?0:R(BEARD_NAMES.length),acc:Math.random()<.5?[]:[1+R(7)],accC:R(SHIRT.length)}); redraw(); return}
      if(t.dataset.look){const k=t.dataset.look, v=+t.dataset.v; if(plusLook(r,k,v)&&!plusActive()&&!(k==="acc"&&accList(draft.acc).includes(v))) return plusPaywall("looks"); if(k==="acc") draft.acc=accToggle(draft.acc,v); else draft[k]=v; redraw()}
    };
    return;
  }
  document.querySelectorAll("#modalRoot [data-pane]").forEach(t=>t.onclick=()=>{LOOK_PANE=t.dataset.pane;
    document.querySelectorAll("#modalRoot [data-pane]").forEach(x=>{const on=x===t;x.classList.toggle("on",on);x.setAttribute("aria-selected",on)});
    document.querySelectorAll("#modalRoot [data-pane-box]").forEach(b=>b.hidden=b.dataset.paneBox!==LOOK_PANE)});
  document.querySelectorAll("#modalRoot [data-look]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.look, v=+b.dataset.v;
    if(k==="acc"){draft.acc=accToggle(draft.acc,v); const al=draft.acc;
      document.querySelectorAll('#modalRoot [data-look="acc"]').forEach(x=>{const i=+x.dataset.v, on=i?al.includes(i):!al.length;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)});
    } else {draft[k]=v;
      document.querySelectorAll(`#modalRoot [data-look="${k}"]`).forEach(x=>{const on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)});}
    const pv=$("#lookPrev"); if(pv) pv.innerHTML=lookPreview(r,draft);
    // Muster- und Bart-Knöpfe in der aktuellen Oberteil-, Haut- und Haarfarbe zeigen
    if(["shirt","skin","hair"].includes(k)){const pr=$("#patRow"),br=$("#beardRow"); if(pr) pr.outerHTML=lookPatRow(r,draft); if(br) br.outerHTML=lookBeardRow(draft); if(pr||br) bindLookEditor(r,draft,onChange)}
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
  const box=hereItems().filter(id=>itemDef(id)&&!itemDef(id).consumable);
  modal(`${worldMapSvg()}<p class="label" style="color:var(--lime)">Weltreise</p><h2>Nach ${esc(next.name)} aufbrechen?</h2>
    <p class="muted">${esc(next.text)} Alle Bewohner und Tiere kommen mit. Gegenstände aus dem Laden bleiben hier, auf der neuen Insel gibt es passende neue. Die Großprojekte hier bleiben gebaut, auf der neuen Insel geht es mit neuen weiter.</p>
    ${box.length?`<div class="kiste"><p class="label" style="color:var(--amber)">Umzugskiste</p><p class="small muted">Bis zu ${KISTE_MAX} Lieblingsstücke dürfen mit. Das Verpacken kostet die Hälfte vom Ladenpreis.</p>
      <div class="kiste-list">${box.map(id=>`<label class="kiste-it" for="kb_${id}"><input type="checkbox" id="kb_${id}" data-kiste="${id}"><svg viewBox="-18 -30 36 34" width="34" height="32" aria-hidden="true">${itemSvg(id)}</svg><span><b>${esc(itemName(id))}</b><small class="num">${kisteCost(id)} Punkte</small></span></label>`).join("")}</div>
      <p class="small" id="kisteSum" aria-live="polite"></p></div>`:""}
    <div class="row"><button class="btn secondary grow" id="trNo">Noch bleiben</button><button class="btn grow" id="trYes">Aufbrechen</button></div>`);
  const picked=()=>[...document.querySelectorAll("[data-kiste]:checked")].map(x=>x.dataset.kiste);
  const upd=()=>{const ids=picked(), sum=ids.reduce((a,id)=>a+kisteCost(id),0), el=$("#kisteSum");
    document.querySelectorAll("[data-kiste]").forEach(x=>{x.disabled=!x.checked&&ids.length>=KISTE_MAX});
    if(el) el.innerHTML=ids.length?`Kiste: <b class="num">${sum} Punkte</b> · du hast <b class="num">${S.points}</b>${sum>S.points?` · <span style="color:var(--coral)">nicht genug Punkte</span>`:""}`:`Du hast <b class="num">${S.points} Punkte</b>.`;
    $("#trYes").disabled=sum>S.points; $("#trYes").textContent=ids.length?"Mit Kiste aufbrechen":"Aufbrechen"};
  document.querySelectorAll("[data-kiste]").forEach(x=>x.onchange=upd); upd();
  $("#trNo").onclick=closeModal; $("#trYes").onclick=()=>travel(picked());
}
function confirmReset(){
  sheet(`<h2>Spielstand zurücksetzen?</h2><p class="muted">Deine Insel, alle Bewohner und eingetragenen Tage werden gelöscht. Das lässt sich nicht rückgängig machen.</p>
  <div class="row"><button class="btn secondary grow" id="noR">Abbrechen</button><button class="btn grow" id="yesR" style="background:var(--coral)">Zurücksetzen</button></div>`);
  $("#noR").onclick=closeModal;
  $("#yesR").onclick=()=>{S=migrate(newGame());tab="heute";save();closeModal();render()};
}

/* ---------- Freunde einladen, gemeinsame Ziele, OffLand Plus ----------
   Ohne Server: Einladungscode im Link, beide Seiten lösen den Code der anderen Person ein.
   Plus selbst: siehe Abschnitt „OffLand Plus“ unten (geschenkt oder als Abo über den App Store). */
const APP_URL="https://offlandapp.com/";
const INVITE_KEY="offline-insel-einladung";
const GOAL_DAYS=7, PLUS_DAYS=30;
const CODE_ABC="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function myCode(){
  if(!S.code){S.code=Array.from({length:6},()=>CODE_ABC[Math.floor(Math.random()*CODE_ABC.length)]).join("");save()}
  return S.code;
}
const inviteLink=()=>APP_URL+"?einladung="+myCode();
/* ---------- OffLand Plus ----------
   Plus gibt es auf drei Wegen: geschenkt (Plus-Woche zum Start, Monat fürs Einladen) in S.plus,
   oder als Abo über den App Store in S.plusSub (iPhone-App, ios/App/App/PlusStorePlugin.swift).
   Im Browser gibt es kein Abo; im Testmodus und in den Tests kauft eine Simulation. */
const plusGift=()=>!!(S.plus&&S.plus.until>=today());
const plusSubOn=()=>!!(S.plusSub&&S.plusSub.until>=today());
const plusActive=()=>plusGift()||plusSubOn();
const plusUntil=()=>[S.plus&&S.plus.until,S.plusSub&&S.plusSub.until].filter(Boolean).sort().pop()||today();
function grantPlus(days){S.plus={until:addDays(plusGift()?S.plus.until:today(),days)}}
/* Plus-Woche zum Start: neue Inseln bekommen 7 Tage Plus geschenkt, ohne Abo und ohne Zahlungsdaten */
const PLUS_TRIAL=7;
function plusTrialStart(){
  if(S.plus||S.plusTrial||!plusAvailable()) return;
  grantPlus(PLUS_TRIAL-1); S.plusTrial=today();                                    // heute zählt mit: 7 Tage inklusive heute
  S.pending.unshift({type:"plusStart"});
}
function plusBadge(){                                                                  // nur in der geschenkten Plus-Woche
  if(!plusGift()||!S.plusTrial||plusSubOn()) return "";
  const left=Math.round((parse(S.plus.until)-parse(today()))/864e5)+1;
  if(left>PLUS_TRIAL) return "";                                                     // Plus wurde inzwischen verlängert
  return "★ Plus · "+(left<=1?"letzter Tag":"noch "+left+" Tage");
}
/* Was Plus bringt: steht so in der Plus-Woche, im Ende-Fenster und auf der Paywall */
const PLUS_FEATS=[["🛡️","Insel-Schutz Pro","Eigene Zeitpläne: morgens, bei der Arbeit, nachts."],["🏝️","Goldene Lagune","Deine Insel in Gold und Türkis, mit Flamingos."],
  ["👑","Plus-Looks","Kronen, Goldbrillen, Goldketten und goldenes Fell."],["👨‍👩‍👧","Für die ganze Familie","Mit dem Familien-Abo bis zu 6 Personen."],["✨","+10 % Punkte jeden Tag","Und ein goldener Rahmen beim Teilen."]];
function plusStartSheet(){
  CUR_EV=null; stat("plus_start");
  sheet(`<p class="ps-gift" aria-hidden="true">🎁</p><p class="ps-star">★ OffLand Plus</p>
    <h2 style="text-align:center">Deine erste Woche geht aufs Haus</h2>
    <p class="muted" style="text-align:center">${PLUS_TRIAL} Tage lang ist alles freigeschaltet. Probier aus, was deine Insel kann.</p>
    <div class="ps-days" aria-hidden="true">${"<i></i>".repeat(PLUS_TRIAL)}</div>
    <div class="ps-feat">${PLUS_FEATS.filter(f=>f[1]!=="Für die ganze Familie").map(([i,t,sub])=>`<div><span class="ic" aria-hidden="true">${i}</span><p>${t}<small>${sub}</small></p></div>`).join("")}</div>
    <div class="ps-safe"><span aria-hidden="true">🔒</span><p class="small muted"><b style="color:var(--ink)">Kein Abo, keine Zahlungsdaten.</b> Nach ${PLUS_TRIAL} Tagen spielst du einfach kostenlos weiter. Deine Insel und alle Bewohner bleiben dir.</p></div>
    ${saysHtml("bay","Willkommen auf OffLand! Die erste Woche bekommst du von mir das volle Programm. Ich hab sogar extra die Möwen geputzt.")}
    <button class="btn ps-go" data-ok>Los geht's</button>`);
}
/* Ende der geschenkten Plus-Woche: einmal freundlich Bescheid geben */
function plusEndCheck(){
  if(!S.plusTrial||S.plusEndSeen||plusActive()||!S.plus||S.plus.until>=today()||!plusAvailable()) return;
  S.plusEndSeen=today(); S.pending.push({type:"plusEnd"});
}
function plusEndSheet(){
  CUR_EV=null; stat("plus_ende");
  sheet(`<p class="ps-gift" aria-hidden="true">👑</p><p class="ps-star">★ OffLand Plus</p>
    <h2 style="text-align:center">Deine Plus-Woche ist vorbei</h2>
    <p class="muted" style="text-align:center">Alles Wichtige bleibt gratis: deine Insel, alle Bewohner, das Fokus-Boot. Plus-Looks, die du vergeben hast, behalten deine Bewohner.</p>
    ${saysHtml("luc","Ich soll die Krone zurückgeben? Das besprechen wir noch.")}
    <button class="btn" id="peMore">Plus behalten</button><button class="btn ghost" data-ok>Ohne Plus weiterspielen</button>`);
  const b=$("#peMore"); if(b) b.onclick=()=>{closeModal(); plusPaywall("ende"); showPending()};
}

/* Abo-Produkte: IDs wie in App Store Connect (siehe docs/appstore.md). Preise kommen vom App Store, das hier ist nur der Ersatz. */
const PLUS_PLANS=[
  {plan:"year",id:"offland.plus.jahr",name:"Jährlich",price:"29,99 €",per:"pro Jahr",unit:"year",trial:7,tag:"BELIEBT · 2 MONATE GRATIS",value:29.99},
  {plan:"family",id:"offland.plus.familie",name:"Familie",price:"44,99 €",per:"pro Jahr",unit:"year",trial:7,family:true,value:44.99},
  {plan:"month",id:"offland.plus.monat",name:"Monatlich",price:"3,99 €",per:"pro Monat",unit:"month",trial:0,value:3.99}];
const PS_NATIVE=(()=>{try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.getPlatform()==="ios"&&C.registerPlugin?C.registerPlugin("PlusStore"):null}catch(e){return null}})();
const storeSimOn=()=>!PS_NATIVE&&(!!(S&&S.testmode)||!!navigator.webdriver||(()=>{try{return localStorage.getItem("offland-store-sim")==="1"}catch(e){return false}})());
const PS_SIM={
  async products(){return {products:PLUS_PLANS.map(p=>({id:p.id,price:p.price,value:p.value,unit:p.unit,count:1,trialDays:S.plusSubUsed?0:p.trial,family:!!p.family}))}},
  async purchase({id}){const p=PLUS_PLANS.find(x=>x.id===id); if(!p) throw new Error("Produkt fehlt");
    const trial=!S.plusSubUsed&&p.trial>0, until=addDays(today(),trial?p.trial:p.unit==="year"?365:30);
    S.plusSubSim={product:id,until,trial,family:!!p.family}; return Object.assign({result:"ok",active:true},S.plusSubSim)},
  async status(){const s=S.plusSubSim; return s&&s.until>=today()?Object.assign({active:true},s):{active:false}},
  async restore(){return this.status()},
  async manage(){S.plusSubSim=null; return {shown:true,cancelled:true}}
};
const plusStore=()=>PS_NATIVE||(storeSimOn()?PS_SIM:null);
/* Schalter: Plus (Plus-Woche, Paywall, Plus-Karte, gesperrte Plus-Teile) erscheint erst, wenn der App Store
   die Abos wirklich liefert. Bis dahin sieht niemand Plus, und es schaltet sich später ohne Update frei. */
let PLUS_LIVE=(()=>{try{return localStorage.getItem("offland-plus-live")==="1"}catch(e){return false}})();
function plusLiveSet(v){PLUS_LIVE=!!v; try{v?localStorage.setItem("offland-plus-live","1"):localStorage.removeItem("offland-plus-live")}catch(e){}}
const plusAvailable=()=>storeSimOn()||(!!PS_NATIVE&&PLUS_LIVE);
const plusShown=()=>plusAvailable()||plusActive();
function plusApply(e){
  if(e&&e.active){
    const until=e.until?String(e.until).slice(0,10):addDays(today(),30);
    S.plusSub={id:e.product,until,trial:!!e.trial,family:!!e.family,at:today()}; S.plusSubUsed=true;
  } else if(S.plusSub) S.plusSub=null;
  if(!plusActive()) plusLapse();
  save();
}
async function plusSync(){
  const st=plusStore(); if(!st) return;
  try{const r=await st.products({ids:PLUS_PLANS.map(p=>p.id)}); plusLiveSet(r&&r.products&&r.products.length)}catch(e){}
  try{plusApply(await st.status())}catch(e){}
}
if(PS_NATIVE){try{PS_NATIVE.addListener("change",e=>{if(!S) return; plusApply(e); render()})}catch(e){}}
/* Läuft Plus aus, schalten Plus-Funktionen leise zurück (Vergebenes behalten die Bewohner) */
function plusLapse(){
  if(S.isleStyle==="lagune") S.isleStyle=null;
  if(S.shield&&S.shield.mode==="plan"){S.shield.mode="evening"; try{if(ST&&ST.shieldSet) ST.shieldSet({mode:"evening",unlock:S.shield.unlock||5,wins:[]})}catch(e){}}
}
const PLUS_TERMS="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
/* Die Paywall: eigene Ebene über allem (auch über offenen Fenstern), Schließen ist immer sichtbar */
let PW_PRODUCTS=null;
async function plusPaywall(from){
  if($("#plusPw")||!plusAvailable()) return;
  stat("paywall_"+(from||"x"));
  const st=plusStore();
  if(st){try{const r=await st.products({ids:PLUS_PLANS.map(p=>p.id)}); if(r&&r.products&&r.products.length) PW_PRODUCTS=r.products}catch(e){}}   // jedes Mal neu: Probezeit gibt es nur einmal
  const plans=PLUS_PLANS.map(p=>{const q=(PW_PRODUCTS||[]).find(x=>x.id===p.id); return Object.assign({},p,q?{price:q.price,value:q.value,trial:q.trialDays||0,live:true}:{live:false})})
    .filter(p=>!PW_PRODUCTS||p.live);
  if(!plans.length) return toast("OffLand Plus ist gerade nicht erreichbar. Versuch es später noch mal.");
  const yr=plans.find(p=>p.plan==="year"), mo=plans.find(p=>p.plan==="month");
  if(yr&&mo){const fr=Math.floor(12-yr.value/mo.value); yr.tag=fr>=1?`BELIEBT · ${fr} ${fr===1?"MONAT":"MONATE"} GRATIS`:"BELIEBT"; if(/€/.test(yr.price)) yr.month=(yr.value/12).toLocaleString(LOC,{style:"currency",currency:"EUR"})}
  let cur=(plans.find(p=>p.plan==="year")||plans[0]).plan;
  const ds=S.days.slice(-14), saved=ds.reduce((a,d)=>a+Math.max(0,S.baseline-d.min),0), yearDays=ds.length?Math.round(saved/ds.length*365/1440):0;
  const lu=`<g transform="translate(196 173) scale(2.3)">${lucSvg(true)}<path d="M-3.2 -17.4l-.5-3.8 1.9 1.7 1.8-2.6 1.8 2.6 1.9-1.7-.5 3.8z" fill="#FFD27A" stroke="#E0A93C" stroke-width=".35"/></g>`;
  const hero=`<svg viewBox="0 0 360 208" aria-hidden="true"><defs><radialGradient id="pwGl" cx="50%" cy="60%" r="55%"><stop offset="0" stop-color="#FFD27A" stop-opacity=".35"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="180" cy="130" rx="190" ry="110" fill="url(#pwGl)"/>
    <g fill="#FFD27A"><path class="pw-spark" d="M58 46l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path class="pw-spark" style="animation-delay:.8s" d="M300 34l1.6 4.8 4.8 1.6-4.8 1.6-1.6 4.8-1.6-4.8-4.8-1.6 4.8-1.6z"/><path class="pw-spark" style="animation-delay:1.5s" d="M318 112l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/></g>
    <g class="pw-bob"><ellipse cx="180" cy="176" rx="132" ry="16" fill="#F2D27A"/><path d="M72 174c12-50 58-74 108-74s96 24 108 74z" fill="#8ED16E"/>
    <path d="M92 172c-2-30 2-52 10-68" fill="none" stroke="#8A5A3B" stroke-width="6" stroke-linecap="round"/><g fill="#4E9A58"><path d="M102 104c-20-8-38-2-48 8 16-4 30-2 48-8z"/><path d="M102 104c-4-18-22-28-38-26 14 6 26 14 38 26z"/><path d="M102 104c10-16 30-22 44-14-16 2-30 6-44 14z"/><path d="M102 104c18-4 34 6 38 20-12-10-26-14-38-20z"/></g>
    <rect x="244" y="96" width="18" height="72" rx="3" fill="#F3F1EA"/><rect x="244" y="112" width="18" height="8" fill="#FF9C7A"/><rect x="244" y="136" width="18" height="8" fill="#FF9C7A"/><rect x="240" y="86" width="26" height="12" rx="3" fill="#FFD27A"/><path d="M243 86l10-12 10 12z" fill="#F2A93B"/>
    <g transform="translate(150 172) scale(2.9)">${baySvg(true)}</g>${lu}</g>
    <g class="pw-bub"><rect x="206" y="8" width="112" height="54" rx="12" fill="#F3F1EA"/><path d="M216 60l-6 14 18-14z" fill="#F3F1EA"/><text x="216" y="24" font-family="Manrope, sans-serif" font-size="9" font-weight="800" fill="#7A5CC8">LUCIFER</text>
    <text x="216" y="39" font-family="Manrope, sans-serif" font-size="10.5" font-weight="700" fill="#14151F">Ich hab Plus.</text><text x="216" y="53" font-family="Manrope, sans-serif" font-size="10.5" font-weight="700" fill="#14151F">Daher die Krone.</text></g></svg>`;
  const planBtn=p=>`<button class="pw-plan" type="button" role="radio" aria-checked="${p.plan===cur}" data-pwplan="${p.plan}">${p.tag?`<span class="pw-tag">${p.tag}</span>`:""}<span class="pw-dot"></span>
    <span><b class="pw-nm">${p.name}</b><span class="pw-sub">${p.family?"bis 6 Personen · ":""}${p.trial?p.trial+" Tage gratis, dann "+(p.unit==="year"?"jährlich":"monatlich"):"ohne Probezeit"}</span></span>
    <span class="pw-pr"><b class="num">${p.price}</b><span>${p.per}${p.month?" · "+p.month+"/Monat":""}</span></span></button>`;
  const d=document.createElement("div"); d.className="pw"; d.id="plusPw"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true"); d.setAttribute("aria-label","OffLand Plus");
  d.innerHTML=`<div class="pw-scroll">
    <div class="pw-top"><button class="pw-x" type="button" id="pwClose" aria-label="Schließen">✕</button><button class="pw-restore" type="button" id="pwRestore">Käufe wiederherstellen</button></div>
    <div class="pw-hero">${hero}</div>
    <div class="pw-head"><span class="pw-badge">★ OffLand Plus</span><h2>Mach deine Insel <em>legendär.</em></h2><p>Mehr Insel, mehr Schutz, mehr Familie. Und jede Minute ohne Handy zählt ein bisschen mehr.</p></div>
    ${saved>=60?`<div class="pw-stat"><b class="num">${hm(saved)}</b><span>hast du in ${ds.length} ${ds.length===1?"Tag":"Tagen"} schon zurückgewonnen.${yearDays>=1?`<small>Weiter so ergibt das rund ${yearDays} ${yearDays===1?"Tag":"Tage"} im Jahr.</small>`:""}</span></div>`:""}
    <div class="pw-sec"><h3>Das bekommst du</h3><ul class="pw-feats">${PLUS_FEATS.map(([i,t,s])=>`<li><span class="pw-ic" aria-hidden="true">${i}</span><span><b>${t}</b><span>${s}</span></span></li>`).join("")}</ul></div>
    <div class="pw-sec"><h3>Gratis oder Plus</h3><table class="pw-cmp"><thead><tr><th></th><th>Gratis</th><th class="p">Plus</th></tr></thead><tbody>
      ${[["Insel, Bewohner, Tagesbilanz","✓","✓"],["Fokus-Boot und Inselminute","✓","✓"],["Insel-Schutz","Feste Zeiten","Eigene Zeitpläne"],["Goldene Lagune","–","✓"],["Plus-Looks","–","✓"],["Punkte pro Tag","100 %","110 %"]]
        .map(([a,b,c])=>`<tr><td>${a}</td><td class="${b==="✓"?"y":b==="–"?"n":""}">${b}</td><td class="y">${c}</td></tr>`).join("")}</tbody></table></div>
    <div class="pw-sec"><h3>Wähle deinen Plan</h3><div class="pw-plans" role="radiogroup" aria-label="Plan">${plans.map(planBtn).join("")}</div></div>
    <div class="pw-sec" id="pwTl"></div>
    <div class="pw-note"><span class="pw-av" aria-hidden="true">E&amp;F</span><p>„Wir sind Emily und Franziska. OffLand hat keine Werbung und deine Insel bleibt auf deinem Gerät. Plus hält die Insel am Leben.“<small>Gründerinnen von OffLand</small></p></div>
    ${!st?`<p class="pw-web">OffLand Plus kannst du in der iPhone-App abschließen. Es gilt dann für deine Insel auf diesem Konto.</p>`:""}
  </div>
  <div class="pw-bottom"><button class="pw-cta" type="button" id="pwBuy"></button><p class="pw-fine" id="pwFine"></p>
    <p class="pw-links"><a href="${PLUS_TERMS}" target="_blank" rel="noopener">Nutzungsbedingungen</a><a href="${APP_URL}datenschutz/" target="_blank" rel="noopener">Datenschutz</a></p></div>`;
  document.body.appendChild(d); document.body.classList.add("pw-open");
  const close=()=>{d.remove(); document.body.classList.remove("pw-open")};
  const upd=()=>{const p=plans.find(x=>x.plan===cur);
    d.querySelectorAll("[data-pwplan]").forEach(b=>b.setAttribute("aria-checked",String(b.dataset.pwplan===cur)));
    $("#pwBuy").textContent=!st?"Plus in der iPhone-App holen":p.trial?p.trial+" Tage gratis testen":"Plus holen · "+p.price+" "+p.per;
    $("#pwFine").innerHTML=p.trial?`Heute 0 €. Danach <b>${p.price} ${p.per}</b>${p.family?" für bis zu 6 Personen":""}. Jederzeit in den Einstellungen kündbar.`:`<b>${p.price} ${p.per}</b>, verlängert sich automatisch. Jederzeit kündbar.`;
    $("#pwTl").hidden=!p.trial;
    if(p.trial){const rem=Math.max(1,p.trial-2);
      $("#pwTl").innerHTML=`<h3>So läuft die Probezeit</h3><ol class="pw-tl"><li><span aria-hidden="true">🔓</span><p><b>Heute</b>Alles freigeschaltet. Du zahlst jetzt nichts.</p></li>
        <li><span aria-hidden="true">🔔</span><p><b>Tag ${rem}</b>Wir erinnern dich, dass die Probezeit bald endet.</p></li>
        <li><span aria-hidden="true">⭐</span><p><b>Tag ${p.trial}</b>Plus beginnt: ${p.price} ${p.per}. Vorher jederzeit kündbar.</p></li></ol>`}};
  upd();
  d.querySelectorAll("[data-pwplan]").forEach(b=>b.onclick=()=>{cur=b.dataset.pwplan; upd()});
  $("#pwClose").onclick=close;
  d.addEventListener("keydown",e=>{if(e.key==="Escape") close()});
  $("#pwRestore").onclick=async()=>{
    if(!st) return toast("Käufe lassen sich in der iPhone-App wiederherstellen.");
    try{const r=await st.restore(); plusApply(r); if(plusSubOn()){close(); render(); toast("★ Plus ist wieder aktiv.")} else toast("Es wurde kein aktives Abo gefunden.")}catch(e){toast("Wiederherstellen hat nicht geklappt. Versuch es später noch mal.")}
  };
  $("#pwBuy").onclick=async()=>{
    if(!st) return toast("Öffne OffLand auf dem iPhone, dort kannst du Plus abschließen.");
    const p=plans.find(x=>x.plan===cur), btn=$("#pwBuy"); btn.disabled=true; btn.textContent="Einen Moment …";
    try{
      const r=await st.purchase({id:p.id});
      if(r&&r.result==="ok"&&r.active){plusApply(r); stat("plus_kauf_"+p.plan); close(); render();
        if($("#modalRoot").innerHTML){toast("★ Willkommen bei Plus! Alles ist freigeschaltet."); if($("#plusCard")) settingsSheet()}   // offenes Fenster (Umkleide, Einstellungen) nicht wegnehmen
        else plusWelcome(p)}
      else if(r&&r.result==="pending"){toast("Der Kauf wartet noch auf eine Bestätigung."); close()}
      else upd();
    }catch(e){toast("Das hat nicht geklappt: "+String(e&&e.message||e).slice(0,80)); upd()}
    btn.disabled=false;
  };
  setTimeout(()=>{const x=$("#pwClose"); if(x) x.focus()},50);
}
function plusWelcome(p){
  sfx("project");
  sheet(`<p class="ps-gift" aria-hidden="true">👑</p><p class="ps-star">★ Willkommen bei Plus</p>
    <h2 style="text-align:center">Lucifer trägt jetzt Krone.</h2>
    <p class="muted" style="text-align:center">${S.plusSub&&S.plusSub.trial?`Deine Probezeit läuft bis ${nice(S.plusSub.until)}. Wir erinnern dich vorher.`:"Plus ist aktiv. Danke, dass du die Insel am Leben hältst!"}</p>
    <div class="ps-feat">${PLUS_FEATS.slice(0,3).map(([i,t,sub])=>`<div><span class="ic" aria-hidden="true">${i}</span><p>${t}<small>${sub}</small></p></div>`).join("")}</div>
    <button class="btn" data-ok>Zur Insel</button>`);
}
/* Plus-Karte in den Einstellungen */
function plusCard(){
  if(!plusShown()) return "";
  const on=plusActive(), sub=plusSubOn()?S.plusSub:null, st=plusStore();
  return `<div class="card plus-card" id="plusCard"><div class="row between"><p class="label" style="color:var(--amber)">★ OffLand Plus</p>${on?`<span class="chip plus">aktiv</span>`:""}</div>
    ${on?`<p class="small">${sub?(sub.trial?"Probezeit bis ":"Abo läuft bis ")+nice(sub.until)+(sub.family?" · Familie":""):"Geschenkt bis "+nice(plusUntil())}</p>
      <p class="small muted" style="margin-top:8px">Inselstil</p>
      <div class="row fr-seg" role="radiogroup" aria-label="Inselstil">${[["","Klassisch"],["lagune","Goldene Lagune"]].map(([k,n])=>`<button type="button" class="${(S.isleStyle||"")===k?"on":""}" data-isle="${k}" aria-pressed="${(S.isleStyle||"")===k}">${n}</button>`).join("")}</div>
      ${sub&&st?`<button class="btn ghost" id="plusManage" style="margin-top:8px">Abo verwalten oder kündigen</button>`:!sub&&plusAvailable()?`<button class="btn secondary" id="plusMore" style="margin-top:8px">Plus verlängern</button>`:""}`
    :`<p class="small muted">Insel-Schutz Pro, Goldene Lagune, Plus-Looks und mehr. Alles Wichtige bleibt gratis.</p>
      ${plusAvailable()?`<button class="btn secondary" id="plusMore" style="margin-top:6px">Plus ansehen</button>`:""}`}
  </div>`;
}
function bindPlusCard(){
  const m=$("#plusMore"); if(m) m.onclick=()=>plusPaywall("einstellungen");
  document.querySelectorAll("[data-isle]").forEach(b=>b.onclick=()=>{if(!plusActive()) return plusPaywall("lagune"); S.isleStyle=b.dataset.isle||null; save(); toast(S.isleStyle?"Goldene Lagune an":"Klassische Insel"); settingsSheet()});
  const g=$("#plusManage"); if(g) g.onclick=async()=>{const st=plusStore(); try{const r=await st.manage(); if(r&&r.cancelled){plusApply({active:false}); settingsSheet()} else setTimeout(plusSync,1500)}catch(e){}};
}
/* Plus-Looks: Extras 8–10 für Menschen, Goldkette und Goldbrille für Tiere, goldenes Fell */
const ACC_PLUS=new Set([8,9,10]), COLLAR_FREE=5, SPECS_FREE=5, FUR_GOLD=99;
function plusLook(r,k,v){
  if(r.kind==="mensch") return k==="acc"&&ACC_PLUS.has(v);
  return (k==="collar"&&v>=COLLAR_FREE)||(k==="specs"&&v>=SPECS_FREE)||(k==="fur"&&v===FUR_GOLD);
}
const lagune=()=>S.isleStyle==="lagune"&&plusActive();
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
    if(b.done>=GOAL_DAYS){b.reward=true;S.points+=150;glAdd(5);
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
  modal(`<div class="row between"><div><p class="label" style="color:var(--lime)">Gemeinsam</p><h2>Freunde einladen</h2>${plusActive()?`<p class="small" style="color:var(--amber);font-weight:700">★ Plus bis ${nice(plusUntil())}</p>`:""}</div></div>
    <p class="muted">${friendPlusFree()?`Wer eine Freundin oder einen Freund einlädt, bekommt mit ihr oder ihm zusammen <b style="color:var(--ink)">einmalig einen Monat OffLand Plus</b> gratis. Dazu startet`:`Deinen Gratis-Monat Plus hast du schon bekommen. Mit jeder Einladung startet aber`} ein gemeinsames Ziel: ${GOAL_DAYS} Tage im Budget, dann gibt es +150 Punkte.</p>
    <div style="background:var(--ground);border-radius:16px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:4px">
      <span class="small muted">Dein Code</span><b class="num" style="font-size:30px;letter-spacing:.18em">${code}</b></div>
    <button class="btn" id="frShare">Einladung schicken</button>
    <ol class="steps small muted" style="margin:0"><li>Schick den Link an deine Freundin oder deinen Freund.</li><li>Sie oder er öffnet den Link, legt ein Konto an und nimmt die Einladung an.</li>${netOn()?`<li>Seid ihr beide online, seid ihr sofort befreundet.</li>`:`<li>Dann schickt sie oder er dir den eigenen Code zurück. Den trägst du hier ein.</li>`}</ol>
    <label class="field" for="frCode">Code von Freund:in eintragen<input id="frCode" type="text" maxlength="7" autocomplete="off" autocapitalize="characters" placeholder="z. B. K7M2QX" style="text-transform:uppercase;letter-spacing:.12em"></label>
    <p class="err" id="frErr" role="alert"></p>
    <button class="btn secondary" id="frRedeem">Code einlösen</button>
    ${S.buddies.length?`<p class="label">Gemeinsame Ziele</p>${buddyRows()}`:""}
    <p class="small muted">${plusAvailable()?"OffLand Plus bringt Insel-Schutz Pro, die Goldene Lagune, Plus-Looks und +10 % Punkte am Tag. Den Monat gibt es geschenkt, danach gibt es Plus als Abo in der iPhone-App.":"OffLand Plus bringt +10 % Punkte am Tag und einen goldenen Rahmen beim Teilen."}</p>
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
    const app=A.initializeApp(window.OFFLAND_FIREBASE);
    if(window.offlandAppCheck) await window.offlandAppCheck(app,b);   // Schutz vor Missbrauch, nur wenn ein Schlüssel eingetragen ist
    const auth=U.getAuth(app), db=F.getFirestore(app);
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
   Gilt pro Gerät, nicht pro Konto. Gesendet werden nur Zähler pro Tag (z. B. „tag_gut +1“) nach stats/JJJJ-MM-TT_sN (N = 0–9, siehe statsFlush):
   keine Namen, keine Minuten, keine Kennungen (Bildschirmzeit nur als grobe Stufe, siehe statsChange). Bis zur Zustimmung bleibt die Warteschlange auf dem Gerät. */
const STATS_KEY="offland-stats";
const STATS_SHARDS=10;
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
/* Wirkt OffLand? Ab Tag 8 wird der Tag mit dem Schnitt der eigenen ersten Woche verglichen.
   Gezählt wird nur die Stufe (z. B. „bz_w3_m15“ = Woche 3, 15–30 % weniger), keine Minuten. */
function statsChange(min){
  const n=S.days.length; if(n<8) return;
  const base=S.days.slice(0,7).reduce((a,d)=>a+d.min,0)/7; if(base<15) return;
  const r=(base-min)/base, cls=r>=.5?"m50":r>=.3?"m30":r>=.15?"m15":r>=0?"m0":r>=-.15?"p15":"pp";
  const w=Math.ceil(n/7); stat("bz_"+(w<=4?"w"+w:w<=8?"w5_8":"w9")+"_"+cls);
}
let statsTimer=0;
function statsFlushSoon(){clearTimeout(statsTimer);statsTimer=setTimeout(statsFlush,4000)}
async function statsFlush(){
  const d=statsDev(); if(d.consent!==true||!netConfigured()||!d.q||!Object.keys(d.q).length) return;
  const q=d.q; d.q={}; statsPut(d);
  // Auf 10 Dokumente pro Tag verteilt: ein einzelnes Dokument verträgt nur etwa einen Schreibvorgang pro Sekunde
  try{const N=await netInit(); if(!N.inc) throw 0; await N.inc("stats/"+today()+"_s"+Math.floor(Math.random()*STATS_SHARDS),q)}
  catch(e){const d2=statsDev(); if(d2.consent!==true) return; d2.q=d2.q||{}; for(const k in q) d2.q[k]=(d2.q[k]||0)+q[k]; statsPut(d2)}
}
/* ---------- Fehlerberichte (nur mit Zustimmung zur Statistik) ----------
   Gesendet werden nur Fehlertext, Stelle im Code, App-Version und Plattform – keine Namen, keine Inseldaten.
   Gleiche Fehler landen im selben Dokument errors/<kennung> und werden gezählt. Fehler, durch die die App gar nicht
   startet, sammelt ein kleines Skript in index.html; sie werden beim nächsten erfolgreichen Start nachgereicht. */
const ERR_KEY="offland-errors";
const errSig=t=>{let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return "e"+(h>>>0).toString(36)};
const errClean=t=>String(t||"").split(location.origin).join("").replace(/\?v=[^\s:)]*/g,"");
function errReport(msg,src,stack){
  try{
    msg=errClean(msg||"Unbekannter Fehler").slice(0,300).trim(); src=errClean(src).slice(0,200); stack=errClean(stack).slice(0,1200);
    if(!msg||/ResizeObserver loop|^Script error\.?$/.test(msg)) return;          // harmlos bzw. ohne Inhalt (fremde Skripte)
    const q=JSON.parse(localStorage.getItem(ERR_KEY)||"[]"); if(q.length>=20) return;
    q.push({msg,src,stack,v:typeof APP_VERSION!=="undefined"?APP_VERSION:"?",p:statsPlatform(),at:Date.now()});
    localStorage.setItem(ERR_KEY,JSON.stringify(q)); errFlushSoon();
  }catch(e){}
}
let errTimer=0;
function errFlushSoon(){clearTimeout(errTimer);errTimer=setTimeout(errFlush,3000)}
async function errFlush(){
  let q; try{q=JSON.parse(localStorage.getItem(ERR_KEY)||"[]")}catch(e){q=[]}
  if(!q.length) return;
  const d=statsDev(); if(d.consent===false){try{localStorage.removeItem(ERR_KEY)}catch(e){} return}
  if(d.consent!==true||!netConfigured()) return;                                // wartet auf die Zustimmung
  try{localStorage.removeItem(ERR_KEY)}catch(e){}
  try{
    const N=await netInit(); if(!N.inc) return;
    const groups={}; q.forEach(e=>{const k=errSig(e.msg+"|"+e.src); (groups[k]=groups[k]||[]).push(e)});
    for(const k in groups){const g=groups[k], e=g[g.length-1], plat=["ios","pwa","web"].includes(e.p)?e.p:"web", inc={n:g.length}; inc["p_"+plat]=g.length;
      await N.inc("errors/"+k,inc);
      await N.set("errors/"+k,{msg:e.msg,src:e.src,stack:e.stack,v:String(e.v).slice(0,12),last:Date.now()});}
    stat("fehler",q.length);
    if(d.errDay!==today()){const d2=statsDev(); d2.errDay=today(); statsPut(d2); stat("fehler_geraet")}   // Gerätetage mit Fehler
  }catch(e){}
}
window.__offlandReady=true;                                                       // ab jetzt meldet die App selbst (siehe index.html)
window.addEventListener("error",e=>errReport(e.message,(e.filename||"")+(e.lineno?":"+e.lineno+":"+(e.colno||0):""),e.error&&e.error.stack));
window.addEventListener("unhandledrejection",e=>{const r=e.reason; errReport("Promise: "+((r&&r.message)||r),"",r&&r.stack)});
setTimeout(errFlush,4000);                                                         // Fehler vom letzten Start nachreichen
function statsSet(on){const d=statsDev(); d.consent=!!on; if(!on) d.q={}; statsPut(d); if(on){statsActive();statsFlushSoon()} errFlushSoon()}
function statsAskSheet(){
  sheet(`<p class="label" style="color:var(--lime)">Kurze Frage</p><h2>Hilfst du mit, OffLand besser zu machen?</h2>
    ${saysHtml("bay","Ich würde gern anonym mitzählen, was auf OffLand gut läuft und was nicht. Keine Namen, keine Minuten. Versprochen, ich bin nur neugierig.")}
    <p class="small muted">Gezählt wird nur, wie oft etwas passiert, zum Beispiel „heute wurde ein Tag eingetragen“ oder „heute 15–30 % weniger am Handy als in der ersten Woche“. Nichts davon lässt sich dir zuordnen. Du kannst das jederzeit in den Einstellungen ändern.</p>
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
    postsUpdate(); row.ev=S.posts.map(p=>Object.assign({},p));                         // Inselpost: eigene Meilensteine
    const co=S.cheerOut||{}; row.ch=Object.keys(co).filter(k=>co[k].d>=addDays(today(),-7)).slice(0,20).map(k=>({p:k,k:co[k].k,e:co[k].e,d:co[k].d}));
    await N.set("players/"+o.pid,{owner:N.uid,name:row.name,avatar:row.avatar,world:row.world,updated:row.updated});
    await N.set("weeks/"+w.wk+"/ranks/"+o.pid,row);
    if(o.pub&&w.avg!=null&&w.days>=3){const pub=Object.assign({},row);delete pub.duel;delete pub.duelOff;delete pub.ev;delete pub.ch;await N.set("weeks/"+w.wk+"/public/"+o.pid,pub)}
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
  const inv=pendingInvite(), on=netConfigured()&&netOn(), wk=isoWeek(today()), left=6-(new Date().getDay()+6)%7;
  const meRow={id:"me",name:"Du",avatar:netAv(),avg:weekStats().avg,me:true};
  let h=(inv?friendsCardInvite(inv):"")+(on?`<div class="fr-stories" id="frStories">${storiesHtml([meRow])}</div>`:"")+
  `<div class="card fr-reg"><div class="row between"><p class="label" style="color:#9CC8EE">Regatta · KW ${+wk.split("-W")[1]}</p><span class="small muted">${left?"noch "+left+(left===1?" Tag":" Tage"):"letzter Tag"}</span></div>
    <div id="frHero">${regattaSvg([meRow])}</div>
    ${on?`<div class="row fr-seg" role="tablist"><button class="${rankTab==="freunde"?"on":""}" data-rk="freunde" role="tab" aria-selected="${rankTab==="freunde"}">Freunde</button><button class="${rankTab==="alle"?"on":""}" data-rk="alle" role="tab" aria-selected="${rankTab==="alle"}">Alle</button></div><div id="rankHint"></div>`:""}
  </div>
  ${on?`<div class="row zt-chips">
    <div class="cp"><i>Dein Platz</i><b id="chPl" style="color:var(--lime)">–</b></div>
    <div class="cp"><i>Bis Platz 1</i><b id="chLead">–</b></div>
    <div class="cp"><i>Rückenwind</i><b style="color:var(--amber)">${S.budgetStreak} ${S.budgetStreak===1?"Tag":"Tage"}</b></div>
  </div>`:""}`;
  if(!on){
    h+=`<div class="card" style="align-items:center;text-align:center">
      <div style="width:64px;height:64px;border-radius:32px;background:#26233D;color:var(--amber);display:flex;align-items:center;justify-content:center"><span style="width:34px;height:34px;display:block">${TROPHY}</span></div>
      <h2>Freunde und Ranglisten</h2>
      <p class="muted">Segelt jede Woche gegeneinander: Wer am wenigsten am Handy war, liegt vorn. Ladet euch gegenseitig ein, dann bekommt ihr ${plusOffer(false)}ein gemeinsames Ziel.</p>
      ${netConfigured()?`<button class="btn" id="goOnline" style="align-self:stretch">Mitmachen</button>`:`<p class="small muted">Ranglisten sind in dieser Version noch nicht verfügbar.</p>`}
    </div>`+(netConfigured()?duelTeaser("Dafür musst du oben bei Freunde und Ranglisten mitmachen."):"");
  } else {
    h+=`<div id="duelBox">${duelTeaser("Lade Freund:innen …")}</div>
    <div class="sec-h"><span>Inselpost</span></div>
    <div id="postBox" class="fr-posts"><div class="card"><p class="small muted">Lade …</p></div></div>
    <details class="card zt-fold" id="rankFold"><summary><span class="grow"><b>Ganze Rangliste</b><span class="small muted">${rankTab==="alle"?"Alle diese Woche":"Deine Freund:innen"}</span></span><span class="muted zt-chev">›</span></summary>
      <div id="rankBox"><p class="small muted">Lade …</p></div></details>`;
  }
  const fam=famCard();
  if(fam) h+=`<div class="sec-h"><span>Familie</span></div>`+fam;
  h+=`<div class="sec-h"><span>Freund:innen</span></div>
  <div class="card"><div class="row between"><p class="label">Gemeinsame Ziele</p>${plusActive()?`<span class="chip" style="color:var(--amber)">★ Plus bis ${nice(plusUntil())}</span>`:""}</div>
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
/* Freunde oben als Kreise; grüner Ring = in den letzten 2 Tagen ist etwas passiert */
function storiesHtml(list){
  const fresh=r=>!r.me&&((r.ev||[]).some(p=>p.d>=addDays(today(),-2)));
  return list.map((r,i)=>`<button type="button" class="fr-st" data-story="${esc(r.id)}" aria-label="${esc(r.me?"Du":r.name||"?")}"><span class="fr-av${fresh(r)?" new":""}">${avatarSvg(r.avatar||"Ziege",50)}</span><span class="small">${esc(r.me?"Du":r.name||"?")}</span></button>`).join("")
    +`<button type="button" class="fr-st" id="frAdd" aria-label="Freund:in einladen"><span class="fr-av add">+</span><span class="small">Einladen</span></button>`;
}
/* Regatta: jede Person ein Boot auf eigener Bahn, wer im Schnitt weniger am Handy ist, liegt näher am Ziel */
function regattaSvg(list,places){
  list=list.slice(0,8); const n=Math.max(1,list.length), H=26+n*38;
  const av=list.filter(r=>r.avg!=null).map(r=>r.avg), lo=Math.min(...av), hi=Math.max(...av);
  const X=r=>r.avg==null?56:hi===lo?262:262-(r.avg-lo)/(hi-lo)*170;
  const boats=list.map((r,i)=>{const y=14+i*38, x=X(r), c=r.me?"#C8F169":"#F3F1EA", pl=places?places[i]:i+1;
    return `<text x="6" y="${y+24}" font-family="Bricolage Grotesque, Manrope, sans-serif" font-weight="800" font-size="13" fill="${r.me?"#C8F169":"#A4A6BD"}">${pl}</text>
    <path d="M22 ${y+27}h268" stroke="#F3F1EA" stroke-opacity=".12" stroke-dasharray="4 6"/>
    <g transform="translate(${x.toFixed(1)} ${y+20})"><g class="bob" style="animation-duration:${2+i%3*.3}s">
      <path d="M-15 0h30l-5 7h-20z" fill="#8A5A3B"/><path d="M0 0V-19" stroke="#D9D4C6" stroke-width="1.4"/><path d="M1.5 -18q10 8 9 18h-9z" fill="${c}"/><path d="M-1.5 -16q-8 7-8 16h8z" fill="#F3F1EA" opacity=".85"/>
      <g transform="translate(-30 2) scale(.62)">${animalSvg(r.avatar||"Ziege",0)}</g>
      <text x="14" y="-6" font-family="Manrope, sans-serif" font-weight="800" font-size="10" fill="${c}">${esc(r.me?"Du":r.name||"?")}</text>
      <text x="14" y="5" font-family="Manrope, sans-serif" font-weight="700" font-size="9" fill="${c}" opacity=".75">${r.avg!=null?hm(r.avg):"–"}</text></g></g>`}).join("");
  return `<svg viewBox="0 0 330 ${H}" role="img" aria-label="Regatta: wer diese Woche am wenigsten am Handy ist" style="width:100%;height:auto;display:block">
    <rect x="304" y="6" width="3" height="${H-12}" fill="#F3F1EA" opacity=".55"/><g class="flagwave" transform="translate(307 6)">${[0,1].map(r=>[0,1,2].map(c=>`<rect x="${c*5}" y="${r*5}" width="5" height="5" fill="${(r+c)%2?"#14151F":"#F3F1EA"}"/>`).join("")).join("")}</g>
    ${boats}</svg>`;
}
/* ---------- Inselpost: Meilensteine, die Freund:innen sehen, und Reaktionen darauf ----------
   Gespeichert im Wochen-Eintrag (weeks/…/ranks/…): ev = eigene Meilensteine, ch = eigene Reaktionen.
   Keine freien Texte: nur Art, Zahl bzw. Großprojekt und Datum. */
const POST_MILES=[3,5,7,10,14,21,30,50,75,100,150,200,365];
const postKey=p=>p.k+(p.n||"")+(p.it||"");
function postsUpdate(){
  const d=S.lastDay&&S.lastDay<=today()?S.lastDay:today(), P=(S.posts||[]).filter(p=>p.d>=addDays(today(),-14)&&p.d<=today());
  const add=p=>{if(!P.some(x=>postKey(x)===postKey(p))) P.push(p)};
  const m=POST_MILES.filter(x=>S.budgetStreak>=x).pop(); if(m) add({k:"serie",n:m,d});
  const b=(S.builtLog||[]).slice(-1)[0]; if(b&&b.day>=addDays(today(),-14)&&b.day<=today()) add({k:"bau",it:b.id,d:b.day});
  if(S.glueck>=100&&!P.some(x=>x.k==="glueck"&&x.d>=addDays(d,-6))) add({k:"glueck",d});
  P.sort((x,y)=>x.d<y.d?1:x.d>y.d?-1:0); S.posts=P.slice(0,6);
}
function postText(p){
  if(p.k==="serie") return `hat ${p.n} Tage Serie geschafft 🔥`;
  if(p.k==="bau"){const pr=projById(p.it); return `hat ${pr?"„"+pr.name+"“":"ein Großprojekt"} gebaut 🏗️`}
  if(p.k==="glueck") return "hat eine Insel mit 100 % Glück 🌞";
  return "war auf der Insel";
}
const POST_EMO=["👏","🌴"];
function postAgo(d){const n=Math.round((parse(today())-parse(d))/864e5);return n<=0?"heute":n===1?"gestern":"vor "+n+" Tagen"}
function postFeed(R){
  const me=S.online.pid, wk=isoWeek(today()), items=[], old=addDays(today(),-7);
  R.friends.forEach(r=>{
    if(r.id===me) return;
    (r.ev||[]).forEach(p=>{if(p&&p.d>=old&&p.d<=today()) items.push({t:"post",r,p,d:p.d})});
    (r.ch||[]).filter(c=>c&&c.p===me&&c.d>=old).slice(0,1).forEach(c=>items.push({t:"cheer",r,c,d:c.d}));
  });
  (S.frOver||[]).filter(o=>o.wk===wk).forEach(o=>{const r=R.friends.find(x=>x.id===o.id); if(r) items.push({t:"over",r,d:o.d})});
  if(S.duel&&S.duel.wk===wk&&S.duel.by==="them"&&S.duel.d){const r=R.friends.find(x=>x.id===S.duel.vs); if(r) items.push({t:"duel",r,d:S.duel.d})}
  items.sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0);
  return items.slice(0,8);
}
function postHtml(it,R){
  const r=it.r, me=S.online.pid, nm=esc(r.name||"?"), head=(txt,sub)=>`<div class="row">${avatarSvg(r.avatar||"Ziege",40)}<div class="grow" style="min-width:0"><p><b>${nm}</b> ${txt}</p><p class="small muted">${sub}</p></div></div>`;
  if(it.t==="post"){
    const k=postKey(it.p), mine=(S.cheerOut||{})[r.id], cnt=e=>R.friends.filter(x=>(x.ch||[]).some(c=>c&&c.p===r.id&&c.k===k&&c.e===e)).length;
    return `<div class="card fr-post">${head(postText(it.p),postAgo(it.d)+(r.avg!=null?" · Ø "+hm(r.avg)+" diese Woche":""))}
      <div class="row fr-react">${POST_EMO.map(e=>{const on=mine&&mine.k===k&&mine.e===e, n=cnt(e);return `<button type="button" class="fr-chip${on?" on":""}" data-cheer="${esc(r.id)}" data-k="${esc(k)}" data-e="${e}" aria-pressed="${!!on}">${e}${n?" "+n:""}</button>`}).join("")}
      <button type="button" class="fr-chip" data-story="${esc(r.id)}" style="margin-left:auto">Ansehen</button></div></div>`;
  }
  if(it.t==="cheer") return `<div class="card fr-post">${head(`feuert dich an ${esc(it.c.e)}`,postAgo(it.d))}</div>`;
  if(it.t==="over"){const dw=S.duel&&S.duel.wk===isoWeek(today()), off=(S.duelOff&&S.duelOff.wk===isoWeek(today())&&S.duelOff.vs===r.id)||r.duelOff===me;
    return `<div class="card fr-post">${head("hat dich überholt ⛵",postAgo(it.d)+(r.avg!=null?" · Ø "+hm(r.avg)+" diese Woche":""))}
      <div class="row fr-react">${!dw&&!off?`<button type="button" class="fr-chip" data-duel="${esc(r.id)}">⚔️ Revanche</button>`:""}<button type="button" class="fr-chip" data-cheer="${esc(r.id)}" data-k="over" data-e="👏" style="margin-left:auto">👏 Glückwunsch</button></div></div>`}
  if(it.t==="duel") return `<div class="card fr-post">${head("hat dich zum Duell herausgefordert ⚔️","Wer ist diese Woche weniger am Handy? Der Stand steht oben.")}</div>`;
  return "";
}
function cheer(pid,k,e){
  S.cheerOut=S.cheerOut||{}; const cur=S.cheerOut[pid];
  if(cur&&cur.k===k&&cur.e===e) delete S.cheerOut[pid]; else {S.cheerOut[pid]={k,e,d:today()}; toast(e==="🌴"?"Palme geschickt":"Angefeuert!"); stat("anfeuern")}
  save(); RANKC=null; netSync().then(()=>{if(tab==="freunde") fillRanks(true)});
}
function friendSheet(r){
  const wk=isoWeek(today()), me=S.online.pid, dw=S.duel&&S.duel.wk===wk, off=(S.duelOff&&S.duelOff.wk===wk&&S.duelOff.vs===r.id)||r.duelOff===me, self=r.id===me;
  const last=(r.ev||[])[0];
  sheet(`<div style="align-self:center">${avatarSvg(r.avatar||"Ziege",76)}</div><p class="label" style="color:var(--lime);text-align:center">${esc(r.world||"")}</p><h2 style="text-align:center">${esc(self?"Du":r.name||"?")}</h2>
    <div class="row zt-chips"><div class="cp"><i>Ø diese Woche</i><b>${r.avg!=null?hm(r.avg):"–"}</b></div><div class="cp"><i>Im Ziel</i><b>${r.good||0} von ${r.days||0}</b></div><div class="cp"><i>Serie</i><b style="color:var(--amber)">${r.streak||0}</b></div></div>
    ${last&&!self?`<p class="muted" style="text-align:center">Zuletzt: ${esc(r.name||"?")} ${postText(last)}</p>`:""}
    ${self?"":`<button class="btn" id="fsCheer">👏 Anfeuern</button>${!dw&&!off?`<button class="btn secondary" id="fsDuel">⚔️ Zum Duell herausfordern</button>`:""}`}
    <button class="btn ghost" data-ok>Schließen</button>`);
  const c=$("#fsCheer"); if(c) c.onclick=()=>{closeModal();cheer(r.id,last?postKey(last):"hi","👏")};
  const d=$("#fsDuel"); if(d) d.onclick=()=>{closeModal();duelChallenge(r)};
}
function bindFriendsUi(R){
  document.querySelectorAll("#frStories [data-story], #postBox [data-story]").forEach(b=>b.onclick=()=>{const r=R.friends.find(x=>x.id===b.dataset.story||(b.dataset.story==="me"&&x.id===S.online.pid)); if(r) friendSheet(r)});
  const fa=$("#frAdd"); if(fa) fa.onclick=friendsSheet;
  document.querySelectorAll("#postBox [data-cheer]").forEach(b=>b.onclick=()=>{b.disabled=true;cheer(b.dataset.cheer,b.dataset.k,b.dataset.e)});
  document.querySelectorAll("#postBox [data-duel]").forEach(b=>b.onclick=()=>{const r=R.friends.find(x=>x.id===b.dataset.duel); if(r){b.disabled=true;duelChallenge(r)}});
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
  const mine=friends.find(r=>r.id===me), pubPath="weeks/"+wk+"/public";
  // Die große Liste (bis 100 Einträge) nur laden, wenn „Alle“ gewählt ist. Den eigenen Platz holen zwei Zählabfragen,
  // die kosten pro 1000 Einträge nur einen Lesezugriff.
  if(rankTab==="alle"&&!all) all=(await N.list(pubPath,{orderBy:"avg",limit:100})).filter(r=>(r.days||0)>=3);
  if((rankTab==="alle"||S.online.pub)&&N.count){
    total=await N.count(pubPath).catch(()=>null);
    if(S.online.pub&&mine&&mine.avg!=null&&(mine.days||0)>=3) place=await N.count(pubPath,["avg","<",mine.avg]).then(n=>n+1).catch(()=>null);
  }
  if(place==null&&all){const i=all.findIndex(r=>r.id===me); if(i>=0) place=rankPlaces(all)[i]}
  if(total==null&&all) total=all.length;
  return RANKC={key,at:Date.now(),friends,all,place,total,nFriends:fr.length};
}
async function fillRanks(force){
  const box=$("#rankBox"); if(!box) return;
  let R; try{R=await loadRanks(force)}catch(e){console.warn("Ranglisten:",e);if($("#rankBox")) $("#rankBox").innerHTML=`<p class="err">Keine Verbindung zum Online-Speicher. Versuch es später noch mal.</p><p class="small muted">Fehlercode: ${esc(String(e&&(e.code||e.message)||"unbekannt"))}</p><button class="btn secondary" id="rkRetry">Noch mal versuchen</button>`;const rr=$("#rkRetry");if(rr)rr.onclick=()=>{RANKC=null;$("#rankBox").innerHTML=`<p class="small muted">Lade …</p>`;fillRanks(true)};return}
  if(!$("#rankBox")||tab!=="freunde") return;                                  // inzwischen woanders
  const me=S.online.pid, fi=R.friends.findIndex(r=>r.id===me), mine=R.friends[fi]||{};
  const ai=R.all?R.all.findIndex(r=>r.id===me):-1, pl=R.all?rankPlaces(R.all):[];
  const pubHint=!S.online.pub?"":R.place!=null?`<p class="small"><b>Platz ${R.place.toLocaleString(LOC)}</b> <span class="muted">von ${Math.max(R.total||0,R.place).toLocaleString(LOC)} in der Rangliste für alle</span></p>`
    :mine.avg!=null&&(mine.days||0)<3?`<p class="small muted">Ab 3 eingetragenen Tagen diese Woche bist du in der Rangliste für alle dabei (noch ${3-(mine.days||0)}).</p>`:"";
  const simHint=S.testmode&&S.lastDay&&S.lastDay>today()?`<p class="small muted">Testmodus: Simulierte Tage liegen in der Zukunft und zählen nicht für die Ranglisten. Es zählen nur echte Tage dieser Woche.</p>`:"";
  // Duell: Herausforderung von jemandem annehmen, dann Rennen zeigen
  const wkNow=isoWeek(today());
  if(S.duel&&S.duel.wk===wkNow){const opp=R.friends.find(r=>r.id===S.duel.vs);
    if(opp&&opp.duelOff===me){const n=S.duel.name;S.duelOff={vs:S.duel.vs,wk:wkNow};S.duel=null;log(n+" hat das Duell abgebrochen.","info");save();toast(n+" hat das Duell abgebrochen");netSync()}}
  const ch=R.friends.find(r=>r.id!==me&&r.duel===me&&r.duelOff!==me&&!(S.duelOff&&S.duelOff.wk===wkNow&&S.duelOff.vs===r.id));
  if(ch&&!(S.duel&&S.duel.wk===wkNow)){S.duel={vs:ch.id,name:ch.name||"?",avatar:ch.avatar||"Ziege",wk:wkNow,by:"them",d:today()};log(S.duel.name+" hat dich zum Duell der Woche herausgefordert.","info");S.pending.push({type:"duelStart",name:S.duel.name,avatar:S.duel.avatar});save();netSync();showPending()}
  const db=$("#duelBox"); if(db){db.innerHTML=duelHtml(R); db.querySelectorAll("[data-duel]").forEach(b=>b.onclick=()=>{const r=R.friends.find(x=>x.id===b.dataset.duel); if(r){b.disabled=true;duelChallenge(r)}});
    const st=$("#duelStop"); if(st) st.onclick=duelCancelSheet}
  // Überholt? Wer letztes Mal hinter mir lag und jetzt vorne ist, landet in der Inselpost
  const behind=R.friends.slice(fi+1).map(r=>r.id);
  if(fi>=0&&mine.avg!=null){
    if(S.frSeen&&S.frSeen.wk===wkNow) R.friends.slice(0,fi).filter(r=>S.frSeen.behind.includes(r.id)).forEach(r=>{
      S.frOver=(S.frOver||[]).filter(o=>o.wk===wkNow&&o.id!==r.id); S.frOver.unshift({id:r.id,wk:wkNow,d:today()})});
    S.frSeen={wk:wkNow,behind}; save();
  }
  // Oben: Kreise, Regatta, Chips
  const nF=R.friends.length, lead=R.friends[0];
  const st=$("#frStories"); if(st){st.innerHTML=storiesHtml(R.friends.map(r=>r.id===me?Object.assign({},r,{me:true,avatar:netAv()}):r).sort((a,b)=>(b.me?1:0)-(a.me?1:0)));bindFriendsUi(R)}
  let regList, regPl=null;
  if(rankTab==="alle"&&R.all){regList=R.all.slice(0,8); regPl=pl.slice(0,8); if(ai<0||ai>=8){regList=regList.slice(0,7).concat([mine]); regPl=regPl.slice(0,7).concat([R.place||"–"])}}
  else regList=R.friends;
  const fh=$("#frHero"); if(fh) fh.innerHTML=regattaSvg(regList.map(r=>r.id===me?Object.assign({},r,{me:true,avatar:netAv()}):r),regPl);
  const hint=$("#rankHint"); if(hint) hint.innerHTML=(rankTab==="freunde"&&!R.nFriends?`<p class="small muted">Noch allein auf dem Wasser. Lade jemanden ein, dann segelt ihr gegeneinander.</p>`:"")+pubHint+simHint;
  const set=(id,t)=>{const e=$(id); if(e) e.textContent=t};
  if(rankTab==="alle") set("#chPl",R.place!=null?R.place.toLocaleString(LOC)+" von "+Math.max(R.total||0,R.place).toLocaleString(LOC):"–");
  else set("#chPl",R.nFriends?(fi+1)+" von "+nF:"–");
  const top=rankTab==="alle"&&R.all&&R.all[0]?R.all[0]:lead;
  set("#chLead",!top||mine.avg==null||top.avg==null?"–":top.id===me||mine.avg<=top.avg?"Du führst":"−"+hm(mine.avg-top.avg));
  // Inselpost
  const pb=$("#postBox"); if(pb){const items=postFeed(R);
    pb.innerHTML=items.length?items.map(it=>postHtml(it,R)).join(""):`<div class="card"><p class="small muted">${R.nFriends?"Noch nichts los. Sobald deine Freund:innen eine Serie schaffen oder etwas bauen, steht es hier.":"Hier siehst du, was bei deinen Freund:innen passiert: Serien, neue Bauten und wer dich überholt hat."}</p></div>`;
    bindFriendsUi(R)}
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
    <div class="row duel-bar">${avatarSvg(A.avatar||"Ziege",40)}<div class="grow"><div class="duel-track"><i style="width:${known?(B.avg+A.avg?Math.round(B.avg/(A.avg+B.avg)*100):50):A.avg!=null?70:B.avg!=null?30:50}%"></i></div>
      <p class="small muted row between"><span>Du ${A.avg!=null?"Ø "+hm(A.avg):"–"}</span><span>${esc(B.name)} ${B.avg!=null?"Ø "+hm(B.avg):"–"}</span></p></div>${avatarSvg(B.avatar||"Ziege",40)}</div>
    <p>${msg}</p><p class="small muted">Sieg am Sonntag: eine Deko für die Insel. Auch wer verliert, bekommt Punkte fürs Mitmachen.</p>
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
    <div class="row between"><span class="small muted">${esc(cat)} · ${new Date(t.at).toLocaleDateString(LOC)}</span><span class="small" style="font-weight:700;color:${t.reply?"var(--lime)":"var(--muted)"}">${t.reply?"beantwortet":"offen"}</span></div>
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
    if(!t){ if(d.name!==netName()||(d.info&&d.info.umfrage)) continue;                                     // gehört zu einem anderen Konto auf diesem Gerät
      t={id:d.id,at:d.at||Date.now(),cat:d.cat,text:String(d.text||"").slice(0,140),reply:null,seen:false}; S.tickets.push(t); added++; }
    const a=typeof d.antwort==="string"&&d.antwort.trim();
    if(a&&!t.reply){t.reply=a.slice(0,3000);t.replyAt=Date.now();S.pending.push({type:"reply",id:t.id});got++}
  }
  if(added&&!got) save();
  if(got){save();log("Das OffLand-Team hat auf deine Anfrage geantwortet.","good");showPending()}
}

/* ---------- Testphase: drei kurze Umfragen (ab Tag 2, nach 7 und nach 21 eingetragenen Tagen) ----------
   Antworten gehen als Support-Meldung (Kategorie "sonst", info.umfrage und info.antworten) nach Firestore,
   dafür braucht es keine neue Regel. Für die Store-Version TESTPHASE auf false setzen. */
const TESTPHASE=true;
const UF_HZ=[["u2","unter 2 Std."],["2_4","2 bis 4 Std."],["4_6","4 bis 6 Std."],["6","über 6 Std."]];
const UMFRAGEN={
  start:{tag:2,title:"Kurze Frage zum Start",lead:"Damit wir später sehen, ob OffLand dir hilft. Dauert eine Minute.",q:[
    {id:"hz",t:"Wie lange warst du vor OffLand ungefähr täglich am Handy?",hint:"Steht in den Einstellungen unter Bildschirmzeit.",c:UF_HZ},
    {id:"lieber",t:"Was möchtest du lieber mit der Zeit machen?",x:1},
    {id:"apps",t:"Hast du schon andere Apps gegen Handyzeit probiert? Welche, und warum hast du aufgehört?",x:1}]},
  t7:{tag:7,title:"Eine Woche OffLand",lead:"Drei schnelle Fragen. Ehrliche Antworten helfen am meisten, auch Kritik.",q:[
    {id:"note",t:"Wie gefällt dir OffLand bisher?",c:[["1","😕"],["2","🙁"],["3","😐"],["4","🙂"],["5","😍"]]},
    {id:"schoen",t:"Was war bisher am schönsten?",x:1},
    {id:"nervt",t:"Was hat genervt oder war unklar?",x:1}]},
  t21:{tag:21,title:"Drei Wochen OffLand",lead:"Die letzte Umfrage, und die wichtigste. Danke, dass du so lange dabei bist!",q:[
    {id:"weg",t:"Wie enttäuscht wärst du, wenn es OffLand nicht mehr gäbe?",c:[["sehr","Sehr"],["etwas","Etwas"],["gar","Gar nicht"]]},
    {id:"hz",t:"Wie lange bist du jetzt ungefähr täglich am Handy?",c:UF_HZ},
    {id:"anders",t:"Hat OffLand dein Verhalten verändert? Wie?",x:1},
    {id:"motiv",t:"Was hat dich motiviert, wiederzukommen?",m:[["bewohner","Bewohner"],["tiere","Seltene Tiere"],["fanpost","Fanpost"],["bauen","Bauen"],["freunde","Freunde"],["zeit","Gewonnene Zeit"]]},
    {id:"fast",t:"Gab es einen Moment, an dem du fast aufgehört hättest? Warum?",x:1},
    {id:"empf",t:"Würdest du OffLand weiterempfehlen?",c:[["ja","Ja"],["vielleicht","Vielleicht"],["nein","Nein"]]},
    {id:"zahl",t:"Würdest du für OffLand zahlen?",c:[["abo","Als Abo"],["einmal","Einmalig"],["nein","Eher nicht"]]},
    {id:"betrag",t:"Wie viel ungefähr?",x:1,short:1}]}
};
/* nach dem Eintragen: fällige Umfrage anstellen; ältere, nie beantwortete gelten dann als verpasst */
function umfrageCheck(){
  if(!TESTPHASE||!netConfigured()) return;
  const u=S.umfrage||(S.umfrage={}), ks=Object.keys(UMFRAGEN).filter(k=>S.dayCount>=UMFRAGEN[k].tag);
  if(!ks.length||u.later===today()||S.pending.some(e=>e.type==="umfrage")) return;
  const k=ks[ks.length-1]; ks.slice(0,-1).forEach(x=>{if(!u[x]) u[x]="verpasst"});
  if(!u[k]) S.pending.push({type:"umfrage",k});
}
function umfrageSheet(ev){
  CUR_EV=null;
  const U=UMFRAGEN[ev.k], u=S.umfrage||(S.umfrage={}); if(!U||u[ev.k]) return showPending();
  const qh=q=>{
    const n="uf_"+q.id, head=`<span>${esc(q.t)}${q.hint?`<br><span class="small muted">${esc(q.hint)}</span>`:""}</span>`;
    if(q.c||q.m) return `<div class="field">${head}<div class="uf-chips${q.c&&q.c[0][1].length<3?" emo":""}">${(q.c||q.m).map(([v,l])=>`<label class="uf-chip"><input type="${q.c?"radio":"checkbox"}" name="${n}" value="${v}"><span>${esc(l)}</span></label>`).join("")}</div></div>`;
    return `<label class="field" for="${n}">${head}<textarea class="uf-text" id="${n}" rows="${q.short?1:3}" maxlength="400"></textarea></label>`;
  };
  modal(`<p class="label" style="color:var(--lime)">Testphase · Umfrage</p><h2>${esc(U.title)}</h2>
    <p class="muted">${esc(U.lead)} Alle Fragen sind freiwillig.</p>
    <div class="uf">${U.q.map(qh).join("")}</div>
    <p class="err" id="ufErr" role="alert"></p>
    <button class="btn" id="ufSend">Absenden</button>
    <div class="row"><button class="btn ghost grow" id="ufLater" data-ok>Später</button><button class="btn ghost grow" id="ufNo">Nein danke</button></div>`);
  const done=v=>{u[ev.k]=v; save(); closeModal(); render(); showPending()};
  $("#ufLater").onclick=()=>{u.later=today(); save(); closeModal(); render(); showPending()};
  $("#ufNo").onclick=()=>{stat("umfrage_nein"); done("nein")};
  $("#ufSend").onclick=async()=>{
    const a={}, lines=[];
    U.q.forEach(q=>{
      const n="uf_"+q.id;
      let v=q.x?$("#"+n).value.trim().slice(0,400):[...document.querySelectorAll(`[name=${n}]:checked`)].map(i=>i.value);
      if(q.c) v=v[0]||""; if(!v||!v.length) return;
      a[q.id]=v;
      const lab=q.x?v:(q.c||q.m).filter(o=>[].concat(v).includes(o[0])).map(o=>o[1]).join(", ");
      lines.push(q.t+"\n→ "+lab);
    });
    if(!lines.length) return $("#ufErr").textContent="Beantworte bitte mindestens eine Frage, oder tippe auf Nein danke.";
    const btn=$("#ufSend"); btn.disabled=true; btn.textContent="Sende …";
    try{
      const N=await netInit();
      await N.set("support/"+rid(),{owner:N.uid,cat:"sonst",text:("Umfrage: "+U.title+"\n\n"+lines.join("\n\n")).slice(0,2000),contact:"",name:netName(),
        info:Object.assign(supportInfo(),{umfrage:ev.k,antworten:a}),at:Date.now(),status:"neu"});
      u[ev.k]="ja"; stat("umfrage_"+ev.k); save(); sfx("postcard");
      modal(`<p class="label" style="color:var(--lime)">Danke!</p><h2>Antworten sind angekommen</h2>
        ${saysHtml("bay","Wunderbar, danke dir! Genau so wird OffLand jeden Tag ein bisschen besser.")}
        <button class="btn" id="ufOk" data-ok>Weiter</button>`);
      $("#ufOk").onclick=()=>{closeModal();render();showPending()};
    }catch(e){
      if(!document.body.contains(btn)) return;
      btn.disabled=false; btn.textContent="Absenden"; $("#ufErr").textContent="Senden hat nicht geklappt. Bist du online? Versuch es gleich noch mal.";
    }
  };
}

/* ---------- Bildschirmzeit automatisch (nur iPhone-App) ----------
   Natives Plugin "ScreenTime" (ios/App/App/ScreenTimePlugin.swift). Apple liefert nur Schwellen:
   Die Monitor-Erweiterung merkt sich pro Tag die höchste erreichte 15-Minuten-Stufe. */
const ST_NATIVE=(()=>{try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.getPlatform()==="ios"&&C.registerPlugin?C.registerPlugin("ScreenTime"):null}catch(e){return null}})();
/* Ohne iPhone-App: Simulation mit denselben Schritten wie das echte Plugin (Erlaubnis, Apps wählen,
   Minuten in 15-Minuten-Stufen). Die Werte sind ausgedacht, aber pro Tag immer gleich. */
function stSimAsk(html){
  return new Promise(res=>{
    const d=document.createElement("div"); d.className="modal st-sim"; d.style.zIndex="400";
    d.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(d);
    d.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{const v=b.dataset.st==="ok"?[...d.querySelectorAll("input:checked")].map(x=>x.value):null; d.remove(); res(v)});
  });
}
const ST_SIM={
  now(){const s=S.stSim||{};return {available:true,simulated:true,status:s.status||"notDetermined",monitoring:!!s.monitoring}},
  async status(){return ST_SIM.now()},
  async authorize(){
    const ok=await stSimAsk(`<p class="label">Simulation · so fragt das iPhone</p>
      <h2>„OffLand“ möchte auf Bildschirmzeit zugreifen</h2>
      <p class="small muted">Wenn du OffLand den Zugriff auf Bildschirmzeit gewährst, kann die App deine Aktivitätsdaten sehen, Inhalte einschränken und die Nutzung von Apps und Websites begrenzen.</p>
      <button class="btn" data-st="ok">Fortfahren</button><button class="btn ghost" data-st="no">Nicht erlauben</button>`);
    S.stSim=Object.assign(S.stSim||{},{status:ok?"approved":"denied"}); save();
    if(!ok) throw new Error("Bildschirmzeit wurde nicht erlaubt");
    return {status:"approved"};
  },
  async pickApps(){
    const cats=[["social","Soziale Netzwerke",1],["games","Spiele",1],["video","Unterhaltung",1],["web","Safari und Websites",1],["chat","Kommunikation",0],["other","Alle anderen Apps",0]];
    const sel=await stSimAsk(`<p class="label">Simulation · Auswahl wie auf dem iPhone</p>
      <h2>Welche Apps zählen?</h2>
      <p class="small muted">OffLand sieht später nicht, welche Apps du gewählt hast, nur die Gesamtzeit.</p>
      <div style="display:flex;flex-direction:column;gap:8px">${cats.map(([v,n,on])=>`<label class="field" style="flex-direction:row;align-items:center;gap:10px;min-height:44px"><input type="checkbox" value="${v}"${on?" checked":""}> ${n}</label>`).join("")}</div>
      <button class="btn" data-st="ok">Fertig</button><button class="btn ghost" data-st="no">Abbrechen</button>`);
    if(!sel||!sel.length) return {ok:false};
    S.stSim=Object.assign(S.stSim||{},{monitoring:true,apps:sel,since:S.stSim&&S.stSim.since||today()}); save();
    return {ok:true};
  },
  async minutes({day}){
    const s=S.stSim||{}; if(!s.monitoring) return {has:false,minutes:0};
    // typischer Wert: Schnitt der letzten Tage, sonst knapp unter dem Ausgangswert
    const recent=S.days.slice(-7).map(d=>d.min), base=recent.length?recent.reduce((a,b)=>a+b,0)/recent.length:Math.max(60,(S.baseline||S.budget||180)*.8);
    let h=0; for(const c of String(day)) h=(h*31+c.charCodeAt(0))>>>0;
    let m=base*(0.65+(h%70)/100)*(1+((s.apps||[]).length-4)*.06);
    if(day===today()){const n=new Date(), f=clamp((n.getHours()+n.getMinutes()/60-7)/16,0,1); m*=f}
    return {has:true,minutes:Math.max(0,Math.floor(m/15)*15)};
  },
  async stop(){S.stSim=Object.assign(S.stSim||{},{monitoring:false}); save()},
  async showAverage(){
    let h=0; for(const c of String(ACC?ACC.name:"Insel")) h=(h*31+c.charCodeAt(0))>>>0;
    const m=150+(h%30)*7;   // ausgedacht, aber für dieselbe Person immer gleich
    await stSimAsk(`<p class="label">Simulation · so zeigt es das iPhone</p><h2>Deine Bildschirmzeit</h2>
      <div style="text-align:center;padding:10px 0"><p class="small muted">Dein Tagesdurchschnitt der letzten 7 Tage</p><p style="font:800 40px var(--display)">${hm(Math.round(m/5)*5)}</p></div>
      <p class="small muted">Stell den Regler „Bisheriger Schnitt“ auf diesen Wert. Auf dem iPhone zeigt Apple die Zahl nur hier an, OffLand selbst bekommt sie nicht.</p>
      <button class="btn" data-st="ok">Fertig</button>`);
  }
};
const ST=ST_NATIVE||ST_SIM;
let stInfo=null;
async function stStatus(){if(!ST)return null;try{stInfo=await ST.status()}catch(e){stInfo={available:false}}return stInfo}
function stCard(){
  if(!ST) return "";
  const i=stInfo||{};
  const on=i.status==="approved"&&i.monitoring;
  return `<div class="card" id="stCard"><p class="label">Bildschirmzeit automatisch</p>
    ${i.simulated?`<p class="small" style="color:var(--amber)">In der Web-Version simuliert: Die Zeiten sind ausgedacht. In der iPhone-App kommen sie von Apple.</p>`:""}
    ${on?`<p class="small muted">OffLand misst deine Bildschirmzeit in 15-Minuten-Schritten mit. Beim Eintragen ist die Zeit schon vorausgefüllt, du musst nur noch bestätigen.</p>
      <div class="row"><button class="btn secondary grow" id="stApps">Apps ändern</button><button class="btn ghost grow" id="stOff">Ausschalten</button></div>`
    :i.status==="denied"?`<p class="small muted">Du hast den Zugriff auf die Bildschirmzeit abgelehnt. Erlauben kannst du ihn in den iPhone-Einstellungen unter Bildschirmzeit.</p><button class="btn secondary" id="stSetup">Erneut versuchen</button>`
    :`<p class="small muted">Statt jeden Abend abzulesen, kann OffLand die Bildschirmzeit vom iPhone übernehmen. OffLand sieht dabei nicht, welche Apps du nutzt, sondern nur die Gesamtzeit in 15-Minuten-Schritten.</p>
      <button class="btn secondary" id="stSetup">Einrichten</button>`}
  </div>`;
}
async function stSetup(fromEntry){
  try{
    await ST.authorize();
    const r=await ST.pickApps();
    if(r&&r.ok){S.autoTime=true;save();toast("Bildschirmzeit wird jetzt automatisch gemessen")}
    else if(fromEntry===true){S.stNoLink=true;save()}
  }catch(e){if(fromEntry===true){S.stNoLink=true;save()} toast(String(e&&e.message||e).slice(0,120))}
  await stStatus(); if(fromEntry===true) render(); else settingsSheet();
}
/* Beim Eintragen: gemessene Zeit des einzutragenden Tages vorausfüllen */
async function stFill(){
  if(!ST||!$("#inH")) return;
  const i=ST===ST_SIM?ST_SIM.now():stInfo||await stStatus(); if(!i||i.status!=="approved"||!i.monitoring) return;
  const day=nextDay(); let r; try{r=await ST.minutes({day})}catch(e){return}
  const h=$("#inH"), m=$("#inM"), note=$("#stNote"); if(!h||!r||!r.has) return;
  if(!h.dataset.touched&&!m.dataset.touched){h.value=Math.floor(r.minutes/60);m.value=r.minutes%60;liveUpdate()}
  if(note) note.innerHTML=`<b style="color:var(--lime)">Automatisch gemessen${i.simulated?" (Simulation)":""}:</b> mindestens ${hm(r.minutes)}${day===today()?" bis jetzt":""}. Apple meldet die Zeit in 15-Minuten-Schritten, darum kann es bis zu 14 Minuten mehr gewesen sein.`;
}

/* ---------- Insel-Schutz: beim Öffnen gewählter Apps steht erst die Insel in der Tür ----------
   iPhone-App: Apples Bildschirmzeit-Sperre („Shield“) mit eigenen Texten (ios/App/Shared/IslandShield.swift,
   Erweiterungen ShieldConfig und ShieldAction). In der Web-Version simuliert, mit einer Vorschau. */
const SHIELD_MODES=[["off","Aus"],["always","Immer"],["evening","Abends ab 21 Uhr"],["focus","Bei Fokus-Bootsfahrt"],["plan","Eigene Zeitpläne ★"]];
/* Insel-Schutz Pro (Plus): bis zu 4 eigene Zeitfenster, Minuten ab Mitternacht; Ende vor Anfang = über Mitternacht */
const SHIELD_PRESETS=[["Morgens",360,540],["Arbeit",540,1020],["Nachts",1320,420]];
const shWins=()=>(S.shield&&S.shield.wins)||[];
const hhmm=m=>String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const SHIELD_SIM_APPS=[["insta","Instagram",1],["tiktok","TikTok",1],["yt","YouTube",1],["snap","Snapchat",0],["safari","Safari",0],["games","Spiele",0]];
Object.assign(ST_SIM,{
  async shieldPick(){
    const cur=(S.shield&&S.shield.sim)||null;
    const sel=await stSimAsk(`<p class="label">Simulation · Auswahl wie auf dem iPhone</p><h2>Was bewacht die Insel?</h2>
      <p class="small muted">Wähl die Apps, bei denen du oft ohne nachzudenken landest. OffLand sieht nicht, welche Apps du wählst.</p>
      <div style="display:flex;flex-direction:column;gap:8px">${SHIELD_SIM_APPS.map(([v,n,on])=>`<label class="field" style="flex-direction:row;align-items:center;gap:10px;min-height:44px"><input type="checkbox" value="${v}"${(cur?cur.includes(v):on)?" checked":""}> ${n}</label>`).join("")}</div>
      <button class="btn" data-st="ok">Fertig</button><button class="btn ghost" data-st="no">Abbrechen</button>`);
    if(!sel) return {ok:false};
    S.shield=Object.assign(S.shield||{},{sim:sel}); save(); return {ok:true,count:sel.length};
  },
  async shieldSet({mode,unlock,wins}){S.shield=Object.assign(S.shield||{},{mode,unlock:unlock||(S.shield&&S.shield.unlock)||5},wins?{wins}:{}); save(); return {mode}},
  async shieldFocus(){return {}},
  async shieldInfo(){},
  async shieldStats({day}={}){const d=day||today(), t=(S.shield&&S.shield.simDay===d&&S.shield.simCnt)||{res:0,open:0};
    return {day:d,resisted:t.res,opened:t.open,mode:(S.shield&&S.shield.mode)||"off",unlock:(S.shield&&S.shield.unlock)||5,count:((S.shield&&S.shield.sim)||[]).length}}
});
function shieldSimCount(kind){const d=today(); S.shield=S.shield||{}; if(S.shield.simDay!==d){S.shield.simDay=d;S.shield.simCnt={res:0,open:0}} S.shield.simCnt[kind]++; save()}
let shieldStatsCache=null, shieldStatsAt=0;
async function shieldRefresh(force){
  if(!ST||!ST.shieldStats||!S.shield||!S.shield.mode||S.shield.mode==="off") return null;
  if(!force&&Date.now()-shieldStatsAt<60000) return shieldStatsCache;
  shieldStatsAt=Date.now();
  try{shieldStatsCache=await ST.shieldStats({})}catch(e){return null}
  // Belohnung: jedes Widerstehen +1 Punkt, höchstens 20 am Tag
  const st=shieldStatsCache; if(!st) return null;
  const aw=S.shield.award&&S.shield.award.day===st.day?S.shield.award:{day:st.day,n:0}, give=Math.min(20,st.resisted)-aw.n;
  if(give>0){aw.n+=give; S.shield.award=aw; S.points+=give; save(); toast(`🛡️ ${give}× widerstanden: +${give} Punkte`); render()}
  return st;
}
function shieldNames(){const a=adults().map(r=>r.name); return a.length?a:here().filter(r=>r.kind==="mensch").map(r=>r.name)}
/* Gleiche Texte wie im iPhone-Schutz (IslandShield.message), hier für die Vorschau */
function shieldMsg(res,open,app){
  const names=shieldNames(), tries=res+open, n=names.length?names[tries%names.length]:"Jemand auf deiner Insel", a=app||"Instagram";
  const T=[`${n} hat dir am Strand einen Platz freigehalten.`,`${n} fragt, ob du kurz zum Steg kommst.`,`Lucifer hat gesehen, dass du ${a} öffnen wolltest.`,
    `${n} baut gerade eine Sandburg. Hilfst du mit?`,"Auf deiner Insel geht gleich die Sonne unter.",`${n} wartet am Lagerfeuer auf dich.`];
  const title=T[tries%T.length];
  const sub=tries===0?"Kurz durchatmen. Deine Insel ist nur einen Tipp entfernt.":title.includes("Lucifer")?"Er sagt nichts. Er guckt nur.":`Du warst heute schon ${tries+1}× kurz davor. ${res}× hast du widerstanden.`;
  return {title,sub};
}
const SHIELD_ICON=`<svg viewBox="0 0 150 150" width="120" height="120" aria-hidden="true"><defs><clipPath id="shR"><rect width="150" height="150" rx="34"/></clipPath><linearGradient id="shSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B4A8E"/><stop offset="1" stop-color="#C77B8A"/></linearGradient></defs>
  <g clip-path="url(#shR)"><rect width="150" height="150" fill="url(#shSky)"/><circle cx="112" cy="40" r="15" fill="#FFB38A"/><rect y="98" width="150" height="52" fill="#2C4770"/><path d="M8 104 Q75 70 142 104z" fill="#E8D7A6"/><path d="M22 100 Q75 74 128 100" fill="#7FC57A"/>
  <rect x="34" y="62" width="9" height="30" fill="#F3F1EA"/><rect x="34" y="70" width="9" height="4" fill="#E5484D"/><path d="M32 62h13l-6.5-9z" fill="#E5484D"/>
  <g transform="translate(86 84)"><circle cy="-10" r="7" fill="#F3D2B8"/><path d="M-7 -12a7 7 0 0 1 14 0q-7-4-14 0z" fill="#4A3222"/><path d="M-7 4q0-10 7-10t7 10z" fill="#5BC0A8"/><path d="M7 -2 l8 -10" stroke="#F3D2B8" stroke-width="3" stroke-linecap="round"/></g>
  <g transform="translate(110 94)"><ellipse rx="7" ry="4" fill="#1E1F2B"/><circle cx="-5" cy="-3" r="3.4" fill="#1E1F2B"/><path d="M-8 -5l1-4 2 3zM-4 -6l2-4 .5 3.5z" fill="#1E1F2B"/></g></g></svg>`;
async function shieldPreview(){
  let st={resisted:0,opened:0}; try{if(ST.shieldStats) st=(await ST.shieldStats({}))||st}catch(e){}
  const m=shieldMsg(st.resisted||0,st.opened||0), mins=(S.shield&&S.shield.unlock)||5;
  const d=document.createElement("div"); d.className="shield-prev"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true");
  d.innerHTML=`<p class="shield-tag">Vorschau · so erscheint es beim Öffnen von Instagram</p>${SHIELD_ICON}<h2>${esc(m.title)}</h2><p>${esc(m.sub)}</p><div class="grow"></div>
    <button class="btn" data-sh="res">Zurück zur Insel</button><button class="shield-sec" data-sh="open">Trotzdem öffnen · ${mins} Min.</button>`;
  document.body.appendChild(d); d.querySelector("[data-sh=res]").focus();
  d.querySelectorAll("[data-sh]").forEach(b=>b.onclick=()=>{const k=b.dataset.sh; d.remove();
    if(ST===ST_SIM){shieldSimCount(k)}
    const names=shieldNames(), n=names.length?names[((st.resisted||0)+1)%names.length]:"Deine Insel";
    toast(k==="res"?`💛 ${n} freut sich!`:`Okay, ${mins} Minuten. ${n} wartet.`);
    if(ST===ST_SIM) shieldRefresh(true).then(()=>{if($("#shieldCard"))settingsSheet()});
  });
}
function shieldSync(){
  if(!ST_NATIVE||!S||!S.setup) return;
  const json=JSON.stringify({lang:window.OFFLAND_LANG||"de",names:shieldNames().slice(0,12),pet:"Lucifer"});
  if(json===shieldSync.last) return; shieldSync.last=json;
  try{ST_NATIVE.shieldInfo({json}).catch(()=>{})}catch(e){}
}
function shieldCard(){
  if(!ST||!ST.shieldPick) return "";
  const sh=S.shield||{}, mode=sh.mode||"off", st=shieldStatsCache, cnt=st?st.count:(sh.sim||[]).length, sim=ST===ST_SIM;
  const allowed=(sim?ST_SIM.now():stInfo||{}).status==="approved";
  return `<div class="card" id="shieldCard"><p class="label">Insel-Schutz</p>
    <p class="small muted">Öffnest du eine gewählte App, steht erst deine Insel in der Tür: Ein Bewohner wartet auf dich. Du kannst zurück zur Insel oder die App trotzdem kurz öffnen. Nichts wird verboten.</p>
    ${sim?`<p class="small" style="color:var(--amber)">In der Web-Version eine Vorschau. Richtig funktioniert der Insel-Schutz in der iPhone-App.</p>`:""}
    ${!allowed?`<button class="btn secondary" id="shAllow">Einrichten</button>`:`
    <div class="row between"><span class="small"><b>${cnt?cnt+(cnt===1?" App gewählt":" Apps gewählt"):"Noch keine Apps gewählt"}</b></span><button class="btn secondary" id="shPick" style="width:auto;padding:8px 14px">Apps wählen</button></div>
    <p class="small muted" style="margin-top:10px">Wann</p>
    <div class="row fr-seg shield-seg" role="radiogroup" aria-label="Wann der Insel-Schutz gilt">${SHIELD_MODES.filter(([k])=>k!=="plan"||plusShown()).map(([k,n])=>`<button type="button" class="${mode===k?"on":""}" data-shmode="${k}" aria-pressed="${mode===k}">${n}</button>`).join("")}</div>
    ${mode==="plan"?`<div class="sh-wins">${shWins().map(([a,b],i)=>`<div class="sh-win"><select data-shw="${i}" data-k="0" aria-label="Zeitplan ${i+1} von">${Array.from({length:48},(_,k)=>k*30).map(m=>`<option value="${m}"${m===a?" selected":""}>${hhmm(m)}</option>`).join("")}</select><span aria-hidden="true">–</span>
      <select data-shw="${i}" data-k="1" aria-label="Zeitplan ${i+1} bis">${Array.from({length:48},(_,k)=>k*30+30).map(m=>`<option value="${m}"${m===(b||1440)?" selected":""}>${m===1440?"24:00":hhmm(m)}</option>`).join("")}</select>
      <button type="button" class="iconbtn" data-shdel="${i}" aria-label="Zeitplan ${i+1} löschen">✕</button></div>`).join("")||`<p class="small muted">Noch kein Zeitplan.</p>`}
      ${shWins().length<4?`<div class="row" style="flex-wrap:wrap;gap:6px">${SHIELD_PRESETS.map(([n,a,b],i)=>`<button type="button" class="chip" data-shadd="${i}">+ ${n} ${hhmm(a)}–${b===1440?"24:00":hhmm(b)}</button>`).join("")}</div>`:""}</div>`:""}
    ${mode!=="off"?`<p class="small muted" style="margin-top:10px">„Trotzdem öffnen“ gibt frei für</p>
    <div class="row fr-seg" role="radiogroup" aria-label="Freigabe">${[1,5,15].map(m=>`<button type="button" class="${(sh.unlock||5)===m?"on":""}" data-shunlock="${m}" aria-pressed="${(sh.unlock||5)===m}">${m} min</button>`).join("")}</div>`:""}
    ${st&&(st.resisted||st.opened)?`<p class="small" style="margin-top:10px">Heute <b style="color:var(--lime)">${st.resisted}× widerstanden</b> · ${st.opened}× trotzdem geöffnet</p>`:""}
    <button class="btn ghost" id="shPrev" style="margin-top:10px">Vorschau ansehen</button>`}
  </div>`;
}
function bindShieldCard(){
  const re=()=>shieldRefresh(true).then(()=>settingsSheet());
  const a=$("#shAllow"); if(a) a.onclick=async()=>{try{await ST.authorize();await stStatus();const r=await ST.shieldPick();if(r&&r.ok&&(!S.shield||!S.shield.mode||S.shield.mode==="off")){S.shield=Object.assign(S.shield||{},{mode:"always"});await ST.shieldSet({mode:"always",unlock:S.shield.unlock||5})}save()}catch(e){toast(String(e&&e.message||e).slice(0,120))} re()};
  const p=$("#shPick"); if(p) p.onclick=async()=>{try{const r=await ST.shieldPick();if(r&&r.ok&&S.shield&&S.shield.mode&&S.shield.mode!=="off") await ST.shieldSet({mode:S.shield.mode,unlock:S.shield.unlock||5,wins:shWins()})}catch(e){} re()};
  document.querySelectorAll("[data-shmode]").forEach(b=>b.onclick=async()=>{const mode=b.dataset.shmode;
    if(mode==="plan"&&!plusActive()) return plusPaywall("schutz");
    S.shield=Object.assign(S.shield||{},{mode}); if(mode==="plan"&&!shWins().length) S.shield.wins=[[360,540],[1260,1440]]; save();
    try{await ST.shieldSet({mode,unlock:S.shield.unlock||5,wins:shWins()});if(mode==="focus") await ST.shieldFocus({on:!!S.boat})}catch(e){}
    toast(mode==="off"?"Insel-Schutz aus":"Insel-Schutz: "+SHIELD_MODES.find(x=>x[0]===mode)[1]); re()});
  document.querySelectorAll("[data-shunlock]").forEach(b=>b.onclick=async()=>{const unlock=+b.dataset.shunlock; S.shield=Object.assign(S.shield||{},{unlock}); save();
    try{await ST.shieldSet({mode:S.shield.mode||"off",unlock,wins:shWins()})}catch(e){} re()});
  const wset=async()=>{try{await ST.shieldSet({mode:"plan",unlock:S.shield.unlock||5,wins:shWins()})}catch(e){} save(); re()};
  document.querySelectorAll("[data-shw]").forEach(sel=>sel.onchange=()=>{const w=shWins()[+sel.dataset.shw]; if(!w) return; w[+sel.dataset.k]=+sel.value;
    if(((w[1]-w[0])+1440)%1440<30) w[1]=(w[0]+60)%1440||1440;   // mindestens 30 Minuten (Apple braucht 15)
    wset()});
  document.querySelectorAll("[data-shdel]").forEach(b=>b.onclick=()=>{S.shield.wins=shWins().filter((_,i)=>i!==+b.dataset.shdel); wset()});
  document.querySelectorAll("[data-shadd]").forEach(b=>b.onclick=()=>{const [,a,e]=SHIELD_PRESETS[+b.dataset.shadd]; S.shield.wins=shWins().concat([[a,e]]).slice(0,4); wset()});
  const v=$("#shPrev"); if(v) v.onclick=shieldPreview;
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
    <p class="small muted">Wird automatisch nach jedem Tag gesichert. ${b.at?"Zuletzt: "+new Date(b.at).toLocaleString(LOC,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"Noch nicht gesichert."}</p>
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
  $("#flOk").onclick=async()=>{f.look={skin:draft.skin,hair:draft.hair,style:draft.style,shirt:draft.shirt,acc:accList(draft.acc),accC:draft.accC||0,beard:draft.beard||0,pat:draft.pat||0,eye:draft.eye||0};save();
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
function wrapText(c,t,max){t=TR(t);
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
  statsActive(); statsFlushSoon(); comebackCheck(); if(S.setup) plusEndCheck();
  plusSync().then(()=>{if(!plusActive()&&(S.isleStyle||(S.shield&&S.shield.mode==="plan"))){plusLapse();save();render()}});
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
    <g transform="translate(180 150) scale(3)"><g class="st-pop"><g class="bob">${baySvg(true)}</g></g></g>
    <g transform="translate(232 152) scale(2.5)"><g class="st-pop st-pop2"><g class="bob" style="animation-delay:.6s;animation-duration:3.4s">${lucSvg(true)}</g></g></g>
    <g class="st-burst">${Array.from({length:10},(_,i)=>{const w=i/10*Math.PI*2;return `<circle cx="200" cy="120" r="${i%2?2.2:3}" fill="${["#C8F169","#B6A4FF","#FFD27A"][i%3]}" style="--dx:${Math.round(Math.cos(w)*90)}px;--dy:${Math.round(Math.sin(w)*55)}px"/>`}).join("")}</g>
  </svg>`;
}
let START_TALK=null;
function startTalk(name){
  clearInterval(START_TALK);
  // Die beiden schicken dich eher raus, als dass sie dich festhalten: kurz eintragen, Handy weg
  const lines=name?[["bay","Hallo "+name+"! Kurz eintragen, dann Handy weg. So mögen wir das."],["luc","Mach's kurz. Draußen passiert mehr als hier."],["bay","Die Insel wächst, wenn du nicht hier bist. Klingt komisch, ist aber so."],["luc","Ich zähl mit, wie lange du bleibst. Je kürzer, desto stolzer bin ich."]]
    :[["bay","Willkommen auf OffLand! Ich bin Mr. Bay, der Bürgermeister."],["luc","Und ich bin Lucifer. Ich war zuerst hier."],["bay","Hier gewinnst du, wenn du weniger am Handy bist. Das gilt auch für OffLand: Du musst nicht ständig reinschauen."],["luc","Einmal am Abend vorbeischauen reicht. Den Rest des Tages verschlaf ich eh."],["bay","Den Rest macht das echte Leben. Wir freuen uns nur mit."],["luc","Ich mag Leute, die schnell wieder gehen. Nimm's nicht persönlich."]];
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
      <p class="small muted" style="text-align:center"><a href="impressum/" style="color:inherit">Impressum</a> · <a href="datenschutz/" style="color:inherit">Datenschutz</a></p>
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
      <p class="small muted" style="text-align:center"><a href="impressum/" style="color:inherit">Impressum</a> · <a href="datenschutz/" style="color:inherit">Datenschutz</a></p>
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
  modal(`<div class="row">${avatarSvg(ACC.avatar,56)}<div class="grow"><p class="label">Konto</p><h2>${esc(ACC.name)}</h2><p class="small muted">${ACC.pin?"Mit PIN geschützt":"Ohne PIN"} · seit ${new Date(ACC.created).toLocaleDateString(LOC)}</p></div></div>
    ${plusActive()?`<p class="small" style="color:var(--amber);font-weight:700">★ OffLand Plus bis ${nice(plusUntil())}</p>`:""}
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
  if(ST===ST_SIM) stInfo=ST_SIM.now();
  if(ST&&!stInfo){stStatus().then(settingsSheet);return}
  modal(`<div class="row between"><div><p class="label">Konto · ${esc(ACC?ACC.name:"")}</p><h2>Einstellungen</h2></div><button class="iconbtn" id="setClose" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F3F1EA" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    ${settingsHtml()}
    <button class="btn secondary" id="setBack">Zurück zum Konto</button>
    <button class="btn" id="setDone">Fertig</button>`);
  bind();
  bindPlusCard();
  const done=()=>{closeModal();render();showPending()};
  $("#setClose").onclick=done; $("#setDone").onclick=done;
  let vt=0; const vl=$("#verLine"); if(vl) vl.onclick=()=>{if(++vt<7)return; vt=0; const on=localStorage.getItem("offland-dev")!=="1";
    try{on?localStorage.setItem("offland-dev","1"):localStorage.removeItem("offland-dev")}catch(e){}
    if(!on&&S.testmode){S.testmode=false;save()} toast(on?"Entwicklermodus an: Testmodus hier in den Einstellungen":"Entwicklermodus aus"); settingsSheet()}; $("#setBack").onclick=()=>{render();accountSheet()};
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
const DEL_WHY=[["unnoetig","Brauche ich nicht mehr"],["wirkt_nicht","Hilft mir nicht"],["aufwand","Zu viel Aufwand"],["neustart","Will neu anfangen"],["anderes","Anderes"]];
function deleteSheet(){
  modal(`<p class="label" style="color:var(--coral)">Konto löschen</p><h2>„${esc(ACC.name)}“ wirklich löschen?</h2>
    <p class="muted">Deine Insel mit allen Bewohnern, eingetragenen Tagen, Postkarten und Punkten wird von diesem Gerät gelöscht. Das lässt sich nicht rückgängig machen.</p>
    <button class="btn secondary" id="delBackup">Vorher Sicherung herunterladen</button>
    ${ACC.pin?pinField("delPin","Zur Bestätigung deine PIN"):""}
    <p class="small muted" style="margin-bottom:-4px">Magst du uns sagen, warum? (freiwillig, anonym)</p>
    <div class="del-why" role="radiogroup" aria-label="Grund">${DEL_WHY.map(([k,t])=>`<button type="button" class="chip" data-why="${k}" aria-pressed="false">${t}</button>`).join("")}</div>
    <label class="check" for="delSure"><input type="checkbox" id="delSure"> Ja, ich will mein Konto endgültig löschen</label>
    <p class="err" id="delErr" role="alert"></p>
    <div class="row"><button class="btn secondary grow" id="delNo">Abbrechen</button><button class="btn grow" id="delYes" style="background:var(--coral)" disabled>Löschen</button></div>`);
  const sure=$("#delSure"), yes=$("#delYes"); let why=null;
  document.querySelectorAll("#modalRoot [data-why]").forEach(b=>b.onclick=()=>{why=why===b.dataset.why?null:b.dataset.why;
    document.querySelectorAll("#modalRoot [data-why]").forEach(x=>{const on=x.dataset.why===why;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on)})});
  sure.onchange=()=>{yes.disabled=!sure.checked};
  $("#delBackup").onclick=exportSave; $("#delNo").onclick=accountSheet;
  yes.onclick=async()=>{
    if(ACC.pin&&await hashPin($("#delPin").value,ACC.salt)!==ACC.pin) return $("#delErr").textContent="Die PIN stimmt nicht.";
    const id=ACC.id;
    // Statistik: gelöschte Konten nach Spieldauer und freiwilligem Grund (nur Zähler, nichts Persönliches)
    const nd=(S.days||[]).length; stat("konto_geloescht"); stat("konto_geloescht_t"+(nd===0?"0":nd<7?"1_6":nd<30?"7_29":"30")); if(why) stat("konto_grund_"+why);
    yes.disabled=true; try{await statsFlush()}catch(e){}
    if(S.online&&S.online.pid){yes.disabled=true;yes.textContent="Lösche …";await netDeleteAll()}
    if(S.backup&&S.backup.on){yes.disabled=true;yes.textContent="Lösche …";await backupDelete()}
    if(S.family){yes.disabled=true;yes.textContent="Lösche …";await famLeave()}
    try{localStorage.removeItem(profKey(id))}catch(e){}
    storeProfiles(profiles().filter(x=>x.id!==id));
    ACC=null; LS=null; logout(); toast("Konto gelöscht");
  };
}

$("#accBtn").onclick=accountSheet;
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&ACC&&S.setup){PEND_BUDGET=3;comebackCheck();showPending();checkReplies(false)} if(document.hidden&&ACC&&S.setup)backupNow(false)});

/* ---------- Umzug auf die eigene Domain ----------
   Nach der Umstellung leitet die alte Adresse (github.io) auf die neue Domain um. Der Service Worker
   merkt das, lädt die App auf der alten Adresse noch einmal aus dem Speicher und hinterlegt das Ziel.
   Dann packt die App alle Konten und Inseln in die Adresse und öffnet die neue Domain, die sie dort auspackt. */
const UMZUG_CACHE="offland-umzug";
const umzugKey=k=>/^(offline-insel|offland-)/.test(k)&&k!=="offland-dev";
const b64u={enc:u8=>{let s="";for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},
  dec:t=>{const s=atob(t.replace(/-/g,"+").replace(/_/g,"/")),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}};
async function zipBytes(u8,dir){const S=dir?CompressionStream:DecompressionStream;return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new S("gzip"))).arrayBuffer())}
async function umzugPack(){
  const d={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); if(umzugKey(k)) d[k]=localStorage.getItem(k)}
  const raw=new TextEncoder().encode(JSON.stringify({v:1,at:Date.now(),d}));
  return window.CompressionStream?"z"+b64u.enc(await zipBytes(raw,true)):"p"+b64u.enc(raw);
}
async function umzugUnpack(t){
  const u=b64u.dec(t.slice(1)), raw=t[0]==="z"?await zipBytes(u,false):u;
  return JSON.parse(new TextDecoder().decode(raw));
}
// Neue Domain: mitgebrachte Inseln übernehmen. Vorhandenes wird nie überschrieben, Kontenlisten werden zusammengeführt.
let UMZUG_DONE=0;
async function umzugImport(){
  const m=location.hash.match(/^#umzug=([A-Za-z0-9_-]+)$/); if(!m) return;
  try{const pkg=await umzugUnpack(m[1]); const d=pkg&&pkg.d||{};
    for(const k in d){ if(!umzugKey(k)) continue;
      if(k===PROF_KEY){const have=profiles(), ids=new Set(have.map(x=>x.id)); let add=[]; try{add=JSON.parse(d[k])||[]}catch(e){} storeProfiles(have.concat(add.filter(x=>x&&!ids.has(x.id)))); UMZUG_DONE+=add.filter(x=>x&&!ids.has(x.id)).length; continue}
      if(localStorage.getItem(k)==null) localStorage.setItem(k,d[k]);
    }
    if(!UMZUG_DONE) UMZUG_DONE=-1;
  }catch(e){UMZUG_DONE=-2}
  history.replaceState(null,"",location.pathname+location.search);
}
// Alte Adresse: Hinweis mit einem Knopf, der alles mitnimmt
async function umzugCheck(){
  if(!("caches" in window)) return;
  let to=null; try{const r=await caches.match("offland-umzug-ziel",{cacheName:UMZUG_CACHE}); to=r&&await r.text()}catch(e){}
  if(!to) return; try{if(new URL(to).origin===location.origin) return}catch(e){return}
  const go=async()=>{let pkg="";try{pkg=await umzugPack()}catch(e){} location.href=to.split("#")[0]+(pkg?"#umzug="+pkg:"")};
  if(!profiles().length) return go();
  modal(`<p class="label" style="color:var(--lime)">Umzug</p><h2>OffLand ist umgezogen 🏝️</h2>
    <p class="muted">Ab jetzt findest du OffLand unter <b>${esc(new URL(to).host)}</b>. Nimm deine Inseln mit: ein Tipp, und alles ist drüben, mit allen Bewohnern, Tagen und Punkten.</p>
    <p class="small muted">Tipp: Hast du OffLand auf dem Home-Bildschirm, leg es danach von der neuen Adresse aus neu dort ab.</p>
    <button class="btn" id="umzugGo">Inseln mitnehmen</button>`);
  $("#umzugGo").onclick=async()=>{$("#umzugGo").disabled=true;$("#umzugGo").textContent="Packe Koffer …";await go()};
}

function boot(){
  migrateOldSave();
  let sid=null; try{sid=sessionStorage.getItem(SESSION_KEY)}catch(e){}
  const p=sid&&profiles().find(x=>x.id===sid);
  if(p) login(p); else showStart();
  initStore();
  if(UMZUG_DONE>0) toast(UMZUG_DONE===1?"Deine Insel ist umgezogen 🏝️":"Deine "+UMZUG_DONE+" Inseln sind umgezogen 🏝️");
  else if(UMZUG_DONE===-2) toast("Der Umzug hat nicht geklappt. Öffne bitte nochmal die alte Adresse.");
  umzugCheck();
}

umzugImport().then(boot,boot);
})();

/* Offline-Unterstützung */
if("serviceWorker" in navigator&&location.protocol!=="file:"){
  navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).catch(()=>{});
  // Neue Version übernommen: einmal neu laden, damit sie sofort sichtbar ist
  let reloaded=false;
  if(navigator.serviceWorker.controller) navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!reloaded){reloaded=true;location.reload()}});
}
