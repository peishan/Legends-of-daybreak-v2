// ===========================================================================
// Legends of Daybreak — Journey to Daybreak (Journal Hub)
// v2: full 103-chapter progression, dynamic party roster, multi-boss battles.
// ===========================================================================
const main = document.querySelector('.main');
const nav = document.getElementById('nav');
const topbar = document.querySelector('.topbar');

const soelSrc = 'assets/portraits/soel.jpg';
const chapterCover = 'assets/hero/hero-ch1.jpg';

// ---------------------------------------------------------------------------
// PARTY — full roster with the chapter each member joins on. San is always
// active. Ser Aldric and Sister Wren are Season Two allies — join chapters
// are placeholders (999 = "not yet in Season One's range") until you tell me
// which chapter unlocks them.
// ---------------------------------------------------------------------------
const ALL_PARTY = [
  {id:'san',        name:'SAN',        role:'Sorcerer',            hp:82, mp:100, joinChapter:0,   portrait:'assets/portraits/san.jpg'},
  {id:'joel',       name:'JOEL',       role:'Paladin',             hp:95, mp:40,  joinChapter:3,   portrait:'assets/portraits/joel.jpg'},
  {id:'aisyah',     name:'AISYAH',     role:'Rogue / Merchant',    hp:74, mp:55,  joinChapter:4,   portrait:'assets/portraits/aisyah.jpg'},
  {id:'eliz',       name:'ELIZ',       role:'Healer',              hp:65, mp:120, joinChapter:6,   portrait:'assets/portraits/eliz.jpg'},
  {id:'mezstorm',   name:'MEZSTORM',   role:'Storm Mage',          hp:75, mp:110, joinChapter:7,   portrait:'assets/portraits/mezstorm.jpg'},
  {id:'senedra',    name:'SENEDRA',    role:'Scout',               hp:70, mp:55,  joinChapter:11,  portrait:'assets/portraits/senedra.jpg'},
  {id:'zaki',       name:'ZAKI',       role:'Fighter',             hp:88, mp:35,  joinChapter:11,  portrait:'assets/portraits/zaki.jpg'},
  {id:'ser_aldric', name:'SER ALDRIC', role:'Knight',              hp:90, mp:45,  joinChapter:73,  portrait:'assets/portraits/ser_aldric.jpg'},
  {id:'sister_wren',name:'SISTER WREN',role:'Healer',              hp:72, mp:100, joinChapter:74,  portrait:'assets/portraits/sister_wren.jpg'}
];
function getActiveParty(){ return ALL_PARTY.filter(m => STATE.completed >= m.joinChapter); }
function getRecentJoins(){ return ALL_PARTY.filter(m => m.joinChapter === STATE.completed && m.joinChapter > 0); }

// CHAPTERS comes from chapters-data.js. Full archive now drives progression —
// no more artificial split between "Season One" and "Story Archive".
const chapterData = CHAPTERS;

// ---------------------------------------------------------------------------
// XP / LEVEL — original design was a 20-level, +100/level triangular curve.
// Extended with the same formula (100 * n(n+1)/2) so it keeps climbing
// smoothly past level 20 as more chapters are added, instead of hard-capping.
// ---------------------------------------------------------------------------
// Same table your codex project uses for levels 1-19 (so early-game leveling
// feels identical across both apps), then the same tail formula beyond it
// instead of a pure formula the whole way — matches game.js's codexXPThreshold.
const XP_PER_LEVEL = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000];
function xpThreshold(lvl){
  if (lvl < XP_PER_LEVEL.length) return XP_PER_LEVEL[lvl] ?? 0;
  let xp = XP_PER_LEVEL[XP_PER_LEVEL.length-1];
  for (let l = XP_PER_LEVEL.length; l <= lvl; l++) xp += Math.round(900 + l*180);
  return xp;
}
function level(){ let l=1; while(xpThreshold(l) <= STATE.xp) l++; return l; }
function xpForChapter(c){
  if (c.reward) return c.reward;
  if (c.boss) return 0; // boss reward is granted on defeat, not on read
  return 800 + (c.id-8) * 120;
}
function bossReward(c){ return 1500 + c.id * 60; }

// ---------------------------------------------------------------------------
// SAVE / RECOVERY — consolidated single-key save (was 5 separate localStorage
// keys with no backup). Before every save, the previous save is copied to a
// recovery slot, the write is verified by reading it back, and export/import
// let the whole save leave/enter the browser as a JSON file.
// ---------------------------------------------------------------------------
const SAVE_KEY = 'daybreak_v7_save';
const RECOVERY_KEY = 'daybreak_v7_save_recovery';
const SAVE_VERSION = 1;

const STATE = {
  completed: 0,
  xp: 0,
  current: 0,
  battleStarted: false,
  turn: 0,
  bossHp: {},
  partyHp: {},
  partyMp: {},
  inventory: [],       // earned boss loot: {id, name, icon, desc, fromChapter, fromBoss}
  companionMode: {},   // {memberId: 'assisted'|'manual'} — San is always manual, not stored here
  combatLog: [],        // persists across re-renders instead of resetting to one line
  combatLogBossId: null,
  journalPage: null
};

function getSavePayload(){
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: {
      completed: STATE.completed, xp: STATE.xp, bossHp: STATE.bossHp,
      partyHp: STATE.partyHp, partyMp: STATE.partyMp, inventory: STATE.inventory,
      companionMode: STATE.companionMode
    }
  };
}
function save(){
  try {
    const prevRaw = localStorage.getItem(SAVE_KEY);
    if (prevRaw) localStorage.setItem(RECOVERY_KEY, prevRaw);
    const payload = JSON.stringify(getSavePayload());
    localStorage.setItem(SAVE_KEY, payload);
    if (localStorage.getItem(SAVE_KEY) !== payload) { console.warn('Save verification failed'); return false; }
    return true;
  } catch(e) { console.warn('Save failed:', e); return false; }
}
function loadGame(){
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.state) { Object.assign(STATE, data.state); return true; }
    }
  } catch(e) { console.warn('Save could not be read, checking legacy keys:', e); }
  // One-time migration from the old per-field keys, if present.
  const legacy = localStorage.getItem('daybreak_v7_completed');
  if (legacy !== null) {
    STATE.completed = Number(legacy) || 0;
    STATE.xp = Number(localStorage.getItem('daybreak_v7_xp') || 0);
    try { STATE.bossHp = JSON.parse(localStorage.getItem('daybreak_v7_bosshp') || '{}'); } catch(e) {}
    try { STATE.partyHp = JSON.parse(localStorage.getItem('daybreak_v7_partyhp') || '{}'); } catch(e) {}
    try { STATE.partyMp = JSON.parse(localStorage.getItem('daybreak_v7_partymp') || '{}'); } catch(e) {}
    save();
    return true;
  }
  return false;
}
function restoreRecoverySave(){
  const raw = localStorage.getItem(RECOVERY_KEY);
  if (!raw) return toast('No recovery save available');
  try {
    const data = JSON.parse(raw);
    if (!data || !data.state) throw new Error('invalid');
    Object.assign(STATE, data.state);
    save();
    toast('Recovery save restored');
    go('Dashboard');
  } catch(e) { toast('Recovery save could not be read'); }
}
function exportSave(){
  const payload = getSavePayload();
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'daybreak-save-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast('Save exported');
}
function importSave(event){
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !data.state) throw new Error('Not a Daybreak save');
      const prevRaw = localStorage.getItem(SAVE_KEY);
      if (prevRaw) localStorage.setItem(RECOVERY_KEY, prevRaw);
      Object.assign(STATE, data.state);
      save();
      toast('Save imported');
      go('Dashboard');
    } catch(e) { alert('That file could not be imported as a Daybreak save.'); }
    event.target.value = '';
  };
  reader.readAsText(file);
}
loadGame();

// ---------------------------------------------------------------------------
// BOSSES — Bone Tyrant has dedicated encounter art; the rest (extracted from
// in-comic "Unlocks: boss" banners) use a styled placeholder card until art
// exists. HP/AC scale gently with chapter position — reflavor freely.
// ---------------------------------------------------------------------------
const BONE_TYRANT_ART = 'assets/battle/bone-tyrant-wide.jpg';
// Multi-phase bosses (only the Nexus Planarch so far — 5 phases per the journal)
const BOSS_PHASES = {
  20: ['Arcane','Fire','Ice','Lightning','Void']
};
const BOSS_CHAPTERS = chapterData.filter(c=>c.boss).map(c => ({
  id: c.id,
  name: c.bossName || c.title,
  hp: c.id===8 ? 4800 : 4800 + (c.id-8)*260,
  ac: c.id===8 ? 18 : 16 + Math.min(10, Math.floor((c.id-8)/10)),
  art: c.bossArt || null,
  landscapeArt: c.bossArtLandscape || null,  // wide format — displayed below name/HP now
  phases: BOSS_PHASES[c.id] || null,
  phaseArt: c.bossPhaseArt || null
}));
function bossFor(chapterId){ return BOSS_CHAPTERS.find(b=>b.id===chapterId); }
function currentBossId(){
  // The next boss the player hasn't reached/cleared yet — the first boss
  // chapter that is at or beyond their current progress. (Previously this
  // used `<=`, which always matched Bone Tyrant first since 8<=anything;
  // every boss past Chapter 8 was unreachable through this lookup.)
  const next = BOSS_CHAPTERS.find(b => b.id >= STATE.completed+1);
  return next ? next.id : (BOSS_CHAPTERS.length ? BOSS_CHAPTERS[BOSS_CHAPTERS.length-1].id : null);
}
function bossHpFor(id){ const b=bossFor(id); if(!b) return 0; return (id in STATE.bossHp) ? STATE.bossHp[id] : b.hp; }
function setBossHp(id, val){ STATE.bossHp[id]=Math.max(0,val); save(); }

// ---------------------------------------------------------------------------
// CLASS KITS — real per-character spells/skills instead of a generic SPELL
// button. Also drives assisted-AI so a Storm Mage actually casts instead of
// always swinging a weapon it doesn't have. Eliz's Cure Disease unlocks at
// level 30, matching "high level" as requested.
// ---------------------------------------------------------------------------
const CLASS_KIT = {
  san:         {role:'caster', spell:{name:'Astral Lance', icon:'✨', mp:15, mult:1.6}, skill:{name:"Daybreak Ward", icon:'🛡️', mp:10, effect:'ward'}},
  joel:        {role:'tank',   spell:null, skill:{name:"Guardian's Oath", icon:'⚔️', mp:8, effect:'taunt'}},
  aisyah:      {role:'melee',  spell:null, skill:{name:'Coup de Grace', icon:'💀', mp:12, mult:1.8}},
  eliz:        {role:'healer', spell:{name:'Heal', icon:'💚', mp:10, healMult:1}, skill:{name:'Resurrect', icon:'🌟', mp:35, effect:'revive'},
                highSkill:{name:'Cure Disease', icon:'🌿', mp:20, effect:'cleanse', levelReq:30}},
  mezstorm:    {role:'caster', spell:{name:'Tempest Fury', icon:'🌀', mp:18, mult:1.7}, skill:{name:'Thunderclap', icon:'🔊', mp:12, effect:'stun'}},
  senedra:     {role:'ranged', spell:null, skill:{name:"Hunter's Mark", icon:'🎯', mp:8, effect:'mark'}},
  zaki:        {role:'melee',  spell:null, skill:{name:'Power Strike', icon:'💥', mp:10, mult:1.5}},
  ser_aldric:  {role:'tank',   spell:null, skill:{name:'Holy Strike', icon:'✝️', mp:10, mult:1.4}},
  sister_wren: {role:'healer', spell:{name:'Blessing of Faith', icon:'🙏', mp:12, healMult:1.1}, skill:{name:'Purify', icon:'🌿', mp:15, effect:'cleanse'}}
};
function kitFor(id){ return CLASS_KIT[id] || {role:'melee', spell:null, skill:null}; }
function logCombat(line){
  if(STATE.combatLogBossId !== currentBossId()){ STATE.combatLog = []; STATE.combatLogBossId = currentBossId(); }
  STATE.combatLog.push(line);
  if(STATE.combatLog.length > 200) STATE.combatLog.shift();
}
function chooseAutoAction(actor, party){
  const kit = kitFor(actor.id);
  if(kit.role === 'healer'){
    const hurt = party.some(m => {
      const hp = STATE.partyHp[m.id] != null ? STATE.partyHp[m.id] : m.hp;
      return hp > 0 && hp/m.hp < 0.5;
    });
    if(hurt && kit.spell) return 'SPELL';
    return 'ATTACK';
  }
  if(kit.role === 'caster' && kit.spell) return Math.random() < 0.7 ? 'SPELL' : 'ATTACK';
  if(kit.skill && Math.random() < 0.25) return 'SKILL';
  return 'ATTACK';
}

// ---------------------------------------------------------------------------
// BOSS LOOT — one themed trophy per boss, awarded once on defeat. Themed by
// the same fire/ice/storm/echo/etc. keyword matching used for the placeholder
// art, so a loot drop's flavor matches its card's color scheme.
// ---------------------------------------------------------------------------
const LOOT_THEMES = [
  [['bone','tyrant','undead','skeleton','wraith'], '💀', 'Bone Talisman'],
  [['rust','bound','foreman','forge'], '⚙️', 'Rusted Gear'],
  [['fire','ember','infernal','flame'], '🔥', 'Ember'],
  [['frost','ice','frozen','veil'], '❄️', 'Frost Shard'],
  [['storm','thunder','lightning','tempest','mezstorm'], '⚡', 'Storm Coil'],
  [['void','abyss','shadow','hollow','splinter'], '🌑', 'Void Fragment'],
  [['echo','mirror','tired version','familiar'], '🪞', 'Echo Shard'],
  [['tide','water','undertow','wave','leviathan'], '🌊', 'Tide Pearl'],
  [['light','vigil','prophet','wayfinder','guard','horizon'], '✨', 'Radiant Sigil'],
  [['dragon','elder'], '🐉', 'Dragon Scale'],
  [['architect','ledger','unity','relapse','question'], '⚙️', 'Cogwork Relic'],
  [['star','planarch','nexus','fracture','astral','devourer'], '🌌', 'Astral Splinter'],
  [['scavenger','foreman','king'], '👑', 'Warlord Token'],
  [['break','unmended','daybreak'], '☀️', 'Sunfire Core'],
  [['skarrowyn','split horizon'], '🌗', 'Horizon Shard']
];
function lootForBoss(bossName){
  const n = (bossName||'').toLowerCase();
  for (const [keywords, icon, itemBase] of LOOT_THEMES){
    if (keywords.some(k=>n.includes(k))) return {icon, itemBase};
  }
  return {icon:'⚔️', itemBase:'Trophy'};
}
function awardBossLoot(chapterId, bossName){
  if (STATE.inventory.some(i=>i.fromChapter===chapterId)) return null; // idempotent
  const {icon, itemBase} = lootForBoss(bossName);
  const item = {
    id: 'loot-ch'+chapterId, name: `${bossName}'s ${itemBase}`, icon,
    desc: `Taken from ${bossName}, Chapter ${chapterId}.`,
    fromChapter: chapterId, fromBoss: bossName
  };
  STATE.inventory.push(item);
  return item;
}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1800)}
function refreshTopbar(){const stats=topbar.querySelectorAll('.stat');const lvl=level();const prev=xpThreshold(lvl-1),next=xpThreshold(lvl);if(stats[0])stats[0].querySelector('.big').textContent=lvl;if(stats[1]){stats[1].querySelector('.num').textContent=`${STATE.xp.toLocaleString()} / ${next.toLocaleString()}`;stats[1].querySelector('.fill').style.width=`${Math.min(100,(STATE.xp-prev)/Math.max(1,next-prev)*100)}%`;}if(stats[2]){stats[2].querySelector('.num').textContent='82 / 82';}if(stats[3]){stats[3].querySelector('.num').textContent='64 / 100';}}
function go(name){if(name!=='Battle')clearAutoActTimer();document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.name===name));render(name);window.scrollTo({top:0,behavior:'smooth'})}

function render(name){refreshTopbar();document.querySelectorAll('.soel').forEach(e=>e.remove());let body='';if(name==='Dashboard')body=dashboard();if(name==='Journal')body=journalScreen();if(name==='Quests')body=questsScreen();if(name==='Party')body=partyScreen();if(name==='Spellbook')body=spellbookScreen();if(name==='Inventory')body=inventoryScreen();if(name==='Codex')body=codexScreen();if(name==='Battle')body=battleScreen();main.innerHTML=topbar.outerHTML+body+`<div id="toast" class="toast"></div>`;if(name!=='Battle'){const soel=document.createElement('div');soel.className='soel';soel.innerHTML=`<img src="${soelSrc}"><div class="lock"><b>SOEL</b><small>LOCKED<br/>Awakens at Level 10 🔒</small></div>`;document.querySelector('.app').appendChild(soel)}bind();if(name==='Battle'){const cl=document.getElementById('combatLog');if(cl)cl.scrollTop=cl.scrollHeight;}}

function bind(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>openChapter(Number(b.dataset.read)));
  document.querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>window.open(`reader.html?ch=${b.dataset.preview}`,'_blank'));
  document.querySelectorAll('[data-quest]').forEach(b=>b.onclick=()=>handleQuest(b.dataset.quest));
  document.querySelectorAll('[data-battle-action]').forEach(b=>b.onclick=()=>battleAction(b.dataset.battleAction));
  document.querySelectorAll('[data-journal-page]').forEach(b=>b.onclick=()=>{STATE.journalPage=Number(b.dataset.journalPage);go('Journal');});
}

function dashboard(){
  const c = chapterData[Math.min(STATE.completed, chapterData.length-1)];
  const nextIsBoss = c && c.boss && STATE.completed < chapterData.length;
  const party = getActiveParty();
  return `<div class="objective"><div><div class="eyebrow">CURRENT OBJECTIVE</div><p>${nextIsBoss?`Face ${c.bossName||c.title} in Chapter ${c.id}.`:`Read Chapter ${c.id}: ${esc(c.title)}`}</p></div><button class="outline" data-go="Quests">◇ VIEW QUESTS</button></div><div class="hero"><img src="${c.thumb||chapterCover}" alt="Daybreak journey"><div class="hero-copy"><div class="hero-badge">CURRENT CHAPTER · ${STATE.completed+1} OF ${chapterData.length}</div><h2>CHAPTER ${c.id} · ${esc(c.title).toUpperCase()}</h2><p>${c.summary?esc(c.summary):'The story continues.'}</p></div></div><div class="grid2"><div class="card"><h3>CURRENT JOURNEY</h3><div class="journey"><div class="book"><img src="${c.thumb||chapterCover}" alt="chapter"></div><div><div class="chapter">Chapter ${c.id}</div><div style="font-family:Cinzel;font-size:17px;color:#c68cf3">${esc(c.title)}</div><div class="sub">${c.summary?esc(c.summary):(nextIsBoss?'Major encounter.':'Story archive chapter.')}</div></div></div><button class="cta" data-read="${c.id}">${nextIsBoss?'VIEW ENCOUNTER':'CONTINUE CHAPTER'} ›</button><div class="progressline"><div class="row"><span>JOURNAL PROGRESS</span><span>${STATE.completed} / ${chapterData.length}</span></div><div class="bar"><div class="fill" style="width:${STATE.completed/chapterData.length*100}%"></div></div></div></div><div class="card"><h3>TRAVELLING PARTY</h3><div class="party">${party.map(m=>`<div class="member"><div class="portrait"><img src="${m.portrait}" alt="${m.name}"></div><div class="name">${m.name}</div><div class="role">${m.role}</div><div class="lv">Lv. ${level()}</div></div>`).join('')}<button class="outline" data-go="Party">♟ VIEW PARTY</button></div></div></div><div class="lower"><div class="card milestones"><h3>NEXT MILESTONES</h3><div class="item"><div class="mini-ico">🐾</div><div><b>LEVEL 10</b><small>Soel awakens</small></div></div><div class="item"><div class="mini-ico">☠</div><div><b>CHAPTER 8</b><small>Bone Tyrant</small></div></div><div class="item"><div class="mini-ico">✧</div><div><b>LEVEL 77</b><small>The True Test</small></div></div></div><div class="card"><h3>SEASON PROGRESS</h3><div class="sub">Story XP <b style="float:right;color:#eee">${STATE.xp.toLocaleString()}</b></div><div class="bar"><div class="fill" style="width:${Math.min(100,(STATE.xp-xpThreshold(level()-1))/Math.max(1,xpThreshold(level())-xpThreshold(level()-1))*100)}%"></div></div><div class="sub">Chapters Completed <b style="float:right;color:#eee">${STATE.completed} / ${chapterData.length}</b></div><div class="bar"><div class="fill" style="width:${STATE.completed/chapterData.length*100}%"></div></div></div><div class="card events"><h3>RECENT EVENTS</h3><div class="item"><div class="mini-ico">▤</div><div><b>Chapter ${Math.max(1,STATE.completed)} ${STATE.completed?'Completed':'Unlocked'}</b><small>${esc(chapterData[Math.max(0,STATE.completed-1)].title)}</small></div></div><div class="item"><div class="mini-ico">⚔</div><div><b>${bossFor(currentBossId())?bossFor(currentBossId()).name:'Bone Tyrant'}</b><small>${nextIsBoss?'Battle available':'Next major encounter'}</small></div></div></div></div><div class="quick"><div class="eyebrow" style="text-align:center">QUICK ACTIONS</div><div class="quick-grid"><button data-go="Journal">▤ JOURNAL</button><button data-go="Quests">⚑ QUESTS</button><button data-go="Inventory">♙ INVENTORY</button><button data-go="Spellbook">✧ SPELLBOOK</button><button data-go="Battle">⚔ BATTLE</button></div></div>`;
}

function panel(title,eyebrow,body,actions=''){return `<section class="screen-panel"><div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${body}${actions?`<div style="margin-top:14px">${actions}</div>`:''}</section>`}
function navButton(name){return `<button class="cta" data-go="${name}">${name==='Dashboard'?'‹ BACK TO DASHBOARD':`OPEN ${name.toUpperCase()} ›`}</button>`}

const PAGE_SIZE = 12;
function journalScreen(){
  const totalPages = Math.ceil(chapterData.length/PAGE_SIZE);
  const defaultPage = Math.floor(Math.min(STATE.completed, chapterData.length-1)/PAGE_SIZE);
  const page = STATE.journalPage===null ? defaultPage : STATE.journalPage;
  const pageChapters = chapterData.slice(page*PAGE_SIZE, page*PAGE_SIZE+PAGE_SIZE);
  const cards = pageChapters.map(c=>{
    const unlocked = c.id <= STATE.completed+1;
    const done = c.id <= STATE.completed;
    const isBoss = !!c.boss;
    let metaLabel = done ? 'COMPLETED · STORY XP' : unlocked ? (isBoss?'UNLOCKED · MAJOR ENCOUNTER':'UNLOCKED · READ CHAPTER') : 'LOCKED · COMPLETE PREVIOUS CHAPTER';
    let btn = !unlocked
      ? `<button class="small-btn" disabled>LOCKED</button>`
      : isBoss
        ? `<button class="small-btn primary" data-read="${c.id}">READ CHAPTER ⚔</button>`
        : `<button class="small-btn ${unlocked?'primary':''}" data-read="${c.id}">${done?'READ AGAIN':'READ CHAPTER'}</button>`;
    return `<article class="chapter-card ${unlocked?'':'locked'}"><div class="chapter-art"><img src="${c.thumb||chapterCover}" alt="${esc(c.title)} thumbnail"></div><div><div class="chapter-num">CHAPTER ${String(c.id).padStart(2,'0')}${c.pageCount>1?` · ${c.pageCount}p`:''}${isBoss?' · BOSS':''}</div><h3>${esc(c.title)}</h3><p>${c.summary?esc(c.summary):'Story archive chapter — comic pages only.'}</p><div class="chapter-meta">${metaLabel}</div></div>${btn}<button class="small-btn" data-preview="${c.id}" style="margin-top:6px">PREVIEW ↗</button></article>`;
  }).join('');
  const pager = `<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:18px;flex-wrap:wrap">${Array.from({length:totalPages},(_,i)=>`<button class="small-btn ${i===page?'primary':''}" data-journal-page="${i}">${i*PAGE_SIZE+1}–${Math.min(chapterData.length,i*PAGE_SIZE+PAGE_SIZE)}</button>`).join('')}</div>`;
  return panel('Journal', `SEASON ONE STORY · CHAPTER ${page*PAGE_SIZE+1}–${Math.min(chapterData.length,page*PAGE_SIZE+PAGE_SIZE)} OF ${chapterData.length}`,
    `<p class="lead">Read chapters in order to earn Story XP and advance the party. Boss chapters open straight into Battle. Titles past Chapter 15 are extracted from the comic automatically — rename anytime.</p><div class="chapter-grid">${cards}</div>${pager}`,
    navButton('Dashboard'));
}

function readerHTML(c){
  const done = c.id <= STATE.completed;
  const isBoss = !!c.boss;
  const pagesHTML = c.pages.map(p=>`<img src="${p}" alt="${esc(c.title)} page">`).join('');
  const scenesHTML = c.scenes && c.scenes.length ? `<h4 style="margin-top:14px">JOURNAL SCENES</h4>${c.scenes.map(s=>`<div class="scene"><div class="speaker">${esc(s[0])}</div><p>${esc(s[1])}</p></div>`).join('')}` : '';
  const completeBtn = isBoss
    ? `<button class="cta" onclick="go('Battle')">ENTER BATTLE ⚔</button>`
    : `<button class="cta" onclick="completeChapter(${c.id})" ${done?'disabled':''}>${done?'CHAPTER COMPLETED ✓':'COMPLETE CHAPTER'}</button>`;
  const nextBtn = c.id < chapterData.length
    ? `<button class="outline" style="width:100%" onclick="nextChapter(${c.id})">NEXT CHAPTER ›</button>`
    : `<button class="outline" style="width:100%" onclick="go('Journal')">BACK TO JOURNAL ›</button>`;
  return `<section class="reader"><div class="reader-top"><div><div class="eyebrow">CHAPTER ${String(c.id).padStart(2,'0')}${isBoss?' · MAJOR ENCOUNTER':''}</div><h3>${esc(c.title)}</h3><div class="sub">${c.summary?esc(c.summary):''}</div></div><div class="reader-controls"><button onclick="go('Journal')">← JOURNAL</button></div></div><div class="comic-stage">${pagesHTML}</div><div class="reader-foot"><div class="reader-box"><h4>CHAPTER SUMMARY</h4><p class="sub">${c.summary?esc(c.summary):'Story archive chapter.'}</p>${scenesHTML}</div><div class="reader-box"><h4>STORY REWARD</h4><p class="sub">${isBoss?'Defeat the boss to complete this chapter and receive its reward.':'Complete this chapter to receive Story XP and unlock the next.'}</p><div class="eyebrow">REWARD</div><p style="font-family:Cinzel;color:#eee">${isBoss?'BOSS ENCOUNTER UNLOCK':`${xpForChapter(c).toLocaleString()} STORY XP`}</p>${completeBtn}<div style="margin-top:12px">${nextBtn}</div></div></div></section>`;
}

function openChapter(id){
  const c = chapterData.find(ch=>ch.id===id);
  if(!c || id>STATE.completed+1) return toast('Complete the previous chapter first');
  STATE.current=id;
  main.innerHTML = topbar.outerHTML + readerHTML(c);
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  window.scrollTo({top:0,behavior:'smooth'});
}
function completeChapter(id){
  if(id!==STATE.completed+1){ if(id<=STATE.completed) return; return toast('Read chapters in sequence'); }
  const c = chapterData.find(ch=>ch.id===id);
  if(c.boss) return toast("Defeat this chapter's boss in Battle to complete it");
  const reward = xpForChapter(c);
  STATE.xp += reward;
  STATE.completed = id;
  save();
  const joins = getRecentJoins();
  toast(`Chapter ${id} complete · +${reward} XP${joins.length?` · ${joins.map(j=>j.name).join(' & ')} joined!`:''}`);
  setTimeout(()=>go('Journal'), 350);
}
function nextChapter(id){ if(id>=chapterData.length) return go('Journal'); openChapter(id+1); }

function questsScreen(){
  const c = chapterData[Math.min(STATE.completed, chapterData.length-1)];
  const isBoss = c && c.boss;
  const boss = bossFor(currentBossId());
  return panel('Quests','STORY OBJECTIVES',
    `<div class="quest-list"><article class="quest active"><div class="mini-ico">▤</div><div><h3>${isBoss?`${c.bossName||c.title} — Chapter ${c.id}`:`Read Chapter ${c.id}: ${esc(c.title)}`}</h3><p>${isBoss?"Read the chapter, then enter the battle to defeat this boss.":'Continue the journal progression. Completing the chapter grants Story XP and advances the party.'}</p><b>REWARD · ${isBoss?'BOSS CLEAR + STORY REWARD':`${xpForChapter(c).toLocaleString()} XP`}</b></div><button class="small-btn primary" data-quest="${c.id}">${isBoss?'READ CHAPTER':'OPEN JOURNAL'}</button></article>`+
    (boss?`<article class="quest"><div class="mini-ico">☠</div><div><h3>${boss.name}</h3><p>Chapter ${boss.id} · Major Encounter · AC ${boss.ac}.</p><b>${STATE.completed>=boss.id?'DEFEATED':STATE.completed>=boss.id-1?'READY · MAJOR ENCOUNTER':'LOCKED · CONTINUE THE JOURNAL'}</b></div><button class="small-btn" data-go="Battle">${STATE.completed>=boss.id-1?'BATTLE':'VIEW'}</button></article>`:'')+
    `<article class="quest locked"><div class="mini-ico">🐾</div><div><h3>Awaken Soel</h3><p>Soel develops as a spiritual familiar before joining the active party.</p><b>LOCKED · LEVEL 10</b></div></article></div><div class="flow"><div class="flow-step"><strong>ACCEPT QUEST</strong><p>Choose the current story objective.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>READ JOURNAL</strong><p>Experience the comic and scenes.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>COMPLETE CHAPTER</strong><p>Receive Story XP.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>LEVEL UP</strong><p>Progress toward the next gate.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>BOSS ENCOUNTER</strong><p>Defeat this arc's boss.</p></div></div>`,
    navButton('Dashboard')+navButton('Journal'));
}
function handleQuest(arg){ if(arg==='battle') return go('Battle'); openChapter(Number(arg)); }

function partyScreen(){
  const active = getActiveParty();
  const locked = ALL_PARTY.filter(m=>!active.includes(m));
  return panel('Travelling Party','PARTY ROSTER',
    `<div class="party-list">${active.map(m=>`<article class="party-row"><div class="portrait large"><img src="${m.portrait}" alt="${m.name}"></div><h3>${m.name}</h3><div class="role">${m.role}</div><div class="hp">Level ${level()} · ${m.hp} / ${m.hp} HP</div></article>`).join('')}</div>`+
    (locked.length?`<h3 style="font-family:Cinzel;color:#8f7aa8;margin:22px 0 10px;font-size:15px">NOT YET JOINED</h3><div class="party-list">${locked.map(m=>`<article class="party-row" style="opacity:.5"><div class="portrait large"><img src="${m.portrait}" alt="${m.name}"></div><h3>${m.name}</h3><div class="role">${m.role}</div><div class="hp">Joins at Chapter ${m.joinChapter}</div></article>`).join('')}</div>`:'')+
    `<div class="locked-banner">🐾 SOEL · SPIRITUAL FAMILIAR · LOCKED UNTIL LEVEL 10</div>`,
    navButton('Dashboard'));
}
function spellbookScreen(){
  const lvl = level();
  const rows = ALL_PARTY.filter(m=>STATE.completed >= m.joinChapter).map(m=>{
    const kit = kitFor(m.id);
    const entries = [];
    if(kit.spell) entries.push({name:kit.spell.name, icon:kit.spell.icon, mp:kit.spell.mp, note: kit.spell.healMult?'Restores HP to the lowest-HP ally':'Damaging spell'});
    if(kit.skill) entries.push({name:kit.skill.name, icon:kit.skill.icon, mp:kit.skill.mp, note: kit.skill.effect==='revive'?'Revives a fallen ally':kit.skill.effect==='cleanse'?'Removes debuffs':'Class skill'});
    if(kit.highSkill){
      const unlocked = lvl >= kit.highSkill.levelReq;
      entries.push({name:kit.highSkill.name, icon:kit.highSkill.icon, mp:kit.highSkill.mp, note: unlocked?'Cures disease/status ailments':`Unlocks at Level ${kit.highSkill.levelReq} (currently Lv.${lvl})`, locked:!unlocked});
    }
    if(!entries.length) entries.push({name:'—', icon:'⚔️', mp:0, note:'Physical attacker — no spells, relies on gear and Attack'});
    return `<h3 style="font-family:Cinzel;color:#c99aff;margin:18px 0 6px;font-size:16px">${esc(m.name)} · ${esc(m.role)}</h3><div class="chapter-grid">${entries.map(e=>`<article class="quest" style="${e.locked?'opacity:.5':''}"><div class="mini-ico">${e.icon}</div><div><h3>${esc(e.name)}</h3><p>${esc(e.note)}</p></div>${e.mp?`<b>${e.mp} MP</b>`:''}</article>`).join('')}</div>`;
  }).join('');
  return panel('Spellbook','PARTY SPELLS & TECHNIQUES', rows, navButton('Dashboard'));
}
function inventoryScreen(){
  const trophies = STATE.inventory.length
    ? `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:18px">BOSS TROPHIES</h3><p class="lead" style="margin-bottom:14px">Earned by defeating story bosses.</p><div class="chapter-grid">${STATE.inventory.map(item=>`<article class="quest"><div class="mini-ico">${item.icon}</div><div><h3>${esc(item.name)}</h3><p>${esc(item.desc)}</p></div></article>`).join('')}</div>`
    : `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:18px">BOSS TROPHIES</h3><p class="lead">None yet — defeat a boss in Battle to earn your first trophy.</p>`;
  const supplies = `<h3 style="font-family:Cinzel;color:#8f7aa8;margin:22px 0 4px;font-size:15px">STARTING SUPPLIES</h3><div class="chapter-grid">${['Minor Healing Tonic','Aether Shard','Waystone Fragment','Tomb Key','Antique Coin'].map((x,i)=>`<article class="quest"><div class="mini-ico">${['✚','◆','◇','⚿','◈'][i]}</div><div><h3>${x}</h3><p>Carried by the travelling party.</p></div><b>x${i+1}</b></article>`).join('')}</div>`;
  return panel('Inventory','CARRIED ITEMS', trophies+supplies, navButton('Dashboard'));
}
function codexScreen(){return panel('Codex','WORLD & LORE',`<div class="chapter-grid">${['Aethon','Daybreak','Tomb of Kings','Bone Tyrant','Travelling Party','Spiritual Familiars'].map((x,i)=>`<article class="quest"><div class="mini-ico">${['✦','☼','♜','☠','♟','🐾'][i]}</div><div><h3>${x}</h3><p>World entry revealed through the Season One story.</p></div></article>`).join('')}</div>`,navButton('Dashboard'))}

function battleScreen(){
  const bossId = currentBossId();
  const boss = bossFor(bossId);
  if(!boss) return panel('Battle','MAJOR ENCOUNTER','<p class="lead">No boss encounter available yet.</p>', navButton('Dashboard'));
  const locked = STATE.completed < boss.id-1;
  const hp = bossHpFor(boss.id);
  const hpPercent = Math.max(0, Math.min(100, hp/boss.hp*100));
  const party = getActiveParty();
  const currentMember = party[STATE.turn];
  const phaseIndex = boss.phases ? Math.min(boss.phases.length-1, Math.floor((1-hp/boss.hp) * boss.phases.length)) : null;
  const phaseLabel = boss.phases ? `Phase ${phaseIndex+1}: ${boss.phases[phaseIndex]}` : 'Encounter';
  const currentArt = (boss.phaseArt && phaseIndex!==null) ? boss.phaseArt[phaseIndex] : boss.art;

  const bossAvatar = currentArt
    ? safeImg(currentArt, boss.name)
    : `<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:1.8rem">☠</span>`;

  let html = '<section class="screen-panel"><div class="eyebrow">MAJOR ENCOUNTER · CHAPTER '+boss.id+'</div><h2>BATTLE</h2>';
  if(locked) html += `<div class="locked-banner" style="margin-bottom:12px"><b>${esc(boss.name).toUpperCase()} LOCKED</b><br>Complete Chapters 1–${boss.id-1} to enter this encounter.</div>`;

  html += '<div class="battle-arena">';
  html += '<div class="battle-v2-header"><div class="battle-v2-round">CHAPTER '+boss.id+'</div><div class="battle-v2-turn">'+
    (hp<=0 ? 'VICTORY' : currentMember ? esc(currentMember.name)+(currentMember.id==='san'?' — YOUR TURN':' — ACTING') : 'Battle')+'</div></div>';

  html += '<div class="battle-turn-order" aria-label="Turn order">';
  party.forEach((m,i)=>{
    const active = STATE.turn===i;
    html += `<div class="turn-chip ${active?'active':''}" title="${esc(m.name)}" onclick="selectTurn(${i})" style="cursor:pointer">${safeImg(m.portrait,m.name)}</div>`;
  });
  html += `<div class="turn-chip turn-chip-boss" title="${esc(boss.name)}">${bossAvatar}</div>`;
  html += '</div>';

  html += '<div class="boss-section v2-boss boss-landscape-layout">';
  html += `<div class="boss-name">${esc(boss.name).toUpperCase()}</div>`;
  html += `<div class="boss-phase">${hp<=0?'DEFEATED':phaseLabel}</div>`;
  html += `<div class="boss-hp-bar"><div class="boss-hp-fill" style="width:${hpPercent}%"></div><div class="boss-hp-text">${hp.toLocaleString()}/${boss.hp.toLocaleString()} HP</div></div>`;
  html += `<div style="font-size:.7rem;color:var(--parchment-dark, #aaa5b4)">AC ${boss.ac}${locked?' · Locked':''}</div>`;
  const landscapeSrc = boss.landscapeArt || currentArt;
  if(landscapeSrc) html += `<div class="boss-landscape-art">${safeImg(landscapeSrc, boss.name)}</div>`;
  html += '</div>';

  html += '<div class="companion-ai-strip"><span><strong>San</strong> is always yours to control — set each companion below to Assisted (auto-acts) or Manual.</span></div>';

  html += '<div class="party-battle-grid">';
  party.forEach((m,i)=>{
    const mhp = STATE.partyHp && STATE.partyHp[m.id] != null ? STATE.partyHp[m.id] : m.hp;
    const mmp = STATE.partyMp && STATE.partyMp[m.id] != null ? STATE.partyMp[m.id] : m.mp;
    const hpPct = Math.max(0,Math.min(100, mhp/m.hp*100));
    const mpPct = Math.max(0,Math.min(100, mmp/m.mp*100));
    const isCurrent = STATE.turn===i;
    const isDead = mhp<=0;
    const mode = m.id==='san' ? null : (STATE.companionMode[m.id] || 'assisted');
    html += `<div class="battle-member ${isCurrent?'active-turn':''} ${isDead?'dead':''}">`;
    html += `<div class="battle-member-avatar">${safeImg(m.portrait,m.name)}</div>`;
    html += `<div class="battle-member-name">${esc(m.name)}</div>`;
    html += `<div class="battle-member-role">${esc(m.role)}</div>`;
    html += `<div class="battle-hp-bar"><div class="battle-hp-fill" style="width:${hpPct}%"></div></div>`;
    html += `<div class="battle-hp-text">HP: ${mhp}/${m.hp}</div>`;
    html += `<div class="battle-mp-bar"><div class="battle-mp-fill" style="width:${mpPct}%"></div></div>`;
    html += `<div class="battle-mp-text">MP: ${mmp}/${m.mp}</div>`;
    if(mode) html += `<button class="small-btn" style="margin-top:4px;padding:3px 6px;font-size:9px" onclick="event.stopPropagation();toggleCompanionMode('${m.id}')">${mode==='assisted'?'🤖 ASSISTED':'🎮 MANUAL'}</button>`;
    else html += `<div style="margin-top:4px;font-size:9px;color:#c99aff">★ YOU CONTROL</div>`;
    html += `</div>`;
  });
  html += '</div>';

  const playerControlsThisTurn = !currentMember || currentMember.id==='san' || (STATE.companionMode[currentMember.id]||'assisted')==='manual';
  html += '<div class="battle-actions">';
  if(playerControlsThisTurn){
    const actorKit = currentMember ? kitFor(currentMember.id) : kitFor('san');
    const level_ = level();
    const spellAvailable = !!actorKit.spell;
    const skillAvailable = !!actorKit.skill;
    const highSkillReady = actorKit.highSkill && level_ >= actorKit.highSkill.levelReq;
    const actions = [
      ['ATTACK','⚔️','Basic attack', true],
      ['SPELL', spellAvailable?actorKit.spell.icon:'✨', spellAvailable?actorKit.spell.name+` (${actorKit.spell.mp} MP)`:'No spells known', spellAvailable],
      ['SKILL', highSkillReady?actorKit.highSkill.icon:(skillAvailable?actorKit.skill.icon:'🎯'), highSkillReady?actorKit.highSkill.name+` (${actorKit.highSkill.mp} MP)`:(skillAvailable?actorKit.skill.name+` (${actorKit.skill.mp} MP)`:'No skills known'), skillAvailable],
      ['ITEM','🧪','Use item', true],
      ['DEFEND','🛡️','Brace', true]
    ];
    actions.forEach(([a,icon,sub,enabled])=>{
      html += `<button class="battle-action-btn" data-battle-action="${a}" ${hp<=0||locked||!enabled?'disabled':''}><span class="battle-action-icon">${icon}</span><span class="battle-action-label">${a}</span><span class="battle-action-sub">${sub}</span></button>`;
    });
  } else {
    html += `<div class="battle-note" style="grid-column:1/-1;text-align:center;padding:10px">${esc(currentMember.name)} is acting on Assisted AI…</div>`;
  }
  html += '</div>';

  const logLines = STATE.combatLog.length ? STATE.combatLog.map(l=>`<div>${l}</div>`).join('') : 'Battle ready. Select the active party member.';
  html += `<div class="eyebrow" style="margin-top:14px">COMBAT LOG</div><div class="combat-log" id="combatLog">${logLines}</div>`;

  html += '</div>'; // .battle-arena
  html += '<div style="margin-top:12px"><button class="cta" data-go="Quests">‹ BACK TO QUESTS</button></div></section>';
  maybeAutoActCompanion();
  return html;
}
let autoActTimer = null;
function clearAutoActTimer(){ if(autoActTimer){ clearTimeout(autoActTimer); autoActTimer=null; } }
function toggleCompanionMode(id){
  STATE.companionMode[id] = (STATE.companionMode[id]||'assisted')==='assisted' ? 'manual' : 'assisted';
  save();
  go('Battle');
}
function maybeAutoActCompanion(){
  if(autoActTimer) return;
  const party = getActiveParty();
  const cur = party[STATE.turn];
  if(!cur || cur.id==='san') return;
  const mode = STATE.companionMode[cur.id] || 'assisted';
  if(mode !== 'assisted') return;
  const boss = bossFor(currentBossId());
  if(!boss) return;
  if(STATE.completed < boss.id-1) return;
  const hp = bossHpFor(boss.id);
  if(hp<=0) return;
  autoActTimer = setTimeout(()=>{
    autoActTimer = null;
    battleAction(chooseAutoAction(cur, getActiveParty()));
  }, 700);
}
function safeImg(src, alt){
  if(!src) return '';
  return `<img src="${src}" alt="${esc(alt)}" loading="lazy">`;
}
function selectTurn(i){STATE.turn=i;go('Battle');const p=getActiveParty()[i];if(p)toast(`${p.name}'s turn`)}
function battleAction(a){
  const bossId = currentBossId();
  const boss = bossFor(bossId);
  if(!boss) return;
  if(STATE.completed < boss.id-1) return toast(`Complete previous chapters before this encounter`);
  let hp = bossHpFor(boss.id);
  if(hp<=0) return;
  STATE.battleStarted=true;
  const party = getActiveParty();
  const actor = party[STATE.turn] || {name:'San', id:'san', hp:82, mp:100};
  const kit = kitFor(actor.id);
  const curMp = STATE.partyMp[actor.id] != null ? STATE.partyMp[actor.id] : actor.mp;
  const dmgTable = [120,105,110,95,90,85,80,60,60];
  const baseDmg = dmgTable[STATE.turn % dmgTable.length];

  function spendMp(amount){ STATE.partyMp[actor.id] = Math.max(0, curMp-amount); }
  function dealDamage(dmg, verb){
    hp = Math.max(0, hp-dmg);
    setBossHp(boss.id, hp);
    logCombat(`${esc(actor.name)} ${verb} for ${dmg} damage.`);
  }

  if(a==='ATTACK'){
    dealDamage(baseDmg, 'attacks');
  } else if(a==='SPELL' && kit.spell){
    if(curMp < kit.spell.mp){ logCombat(`${esc(actor.name)} doesn't have enough MP for ${kit.spell.name} — attacks instead.`); dealDamage(baseDmg,'attacks'); }
    else if(kit.spell.healMult){
      spendMp(kit.spell.mp);
      const healAmt = Math.round(60*kit.spell.healMult);
      const lowest = party.reduce((min,m)=>{ const h=STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp; const minH=STATE.partyHp[min.id]!=null?STATE.partyHp[min.id]:min.hp; return h/m.hp < minH/min.hp ? m : min; }, party[0]);
      STATE.partyHp[lowest.id] = Math.min(lowest.hp, (STATE.partyHp[lowest.id]!=null?STATE.partyHp[lowest.id]:lowest.hp)+healAmt);
      logCombat(`${esc(actor.name)} casts ${kit.spell.icon} ${esc(kit.spell.name)}, healing ${esc(lowest.name)} for ${healAmt} HP.`);
    } else {
      spendMp(kit.spell.mp);
      dealDamage(Math.round(baseDmg*kit.spell.mult), `casts ${kit.spell.icon} ${esc(kit.spell.name)}`);
    }
  } else if(a==='SKILL' && kit.skill){
    const useHigh = kit.highSkill && level() >= kit.highSkill.levelReq;
    const chosenSkill = useHigh ? kit.highSkill : kit.skill;
    if(curMp < chosenSkill.mp){ logCombat(`${esc(actor.name)} doesn't have enough MP for ${chosenSkill.name} — attacks instead.`); dealDamage(baseDmg,'attacks'); }
    else {
      spendMp(chosenSkill.mp);
      if(chosenSkill.mult) dealDamage(Math.round(baseDmg*chosenSkill.mult), `uses ${chosenSkill.icon} ${esc(chosenSkill.name)}`);
      else logCombat(`${esc(actor.name)} uses ${chosenSkill.icon} ${esc(chosenSkill.name)}.`);
    }
  } else if(a==='DEFEND'){
    logCombat(`${esc(actor.name)} braces to defend.`);
  } else if(a==='ITEM'){
    logCombat(`${esc(actor.name)} rummages for an item, but the pack is still empty.`);
  } else {
    dealDamage(baseDmg, 'attacks');
  }

  save();

  if(hp===0){
    logCombat(`<span style="color:#d5a1f4">${esc(boss.name)} defeated. Chapter ${boss.id} complete.</span>`);
    if(STATE.completed < boss.id){
      STATE.xp += bossReward(chapterData.find(c=>c.id===boss.id));
      STATE.completed = boss.id;
      const loot = awardBossLoot(boss.id, boss.name);
      save();
      toast(loot ? `${boss.name} defeated! · ${loot.icon} ${loot.name} obtained` : `${boss.name} defeated!`);
    } else {
      toast(`${boss.name} defeated!`);
    }
    go('Battle');
  } else {
    STATE.turn=(STATE.turn+1)%Math.max(1,party.length);
    setTimeout(()=>go('Battle'),250);
  }
}

Array.from(document.querySelectorAll('#nav button')).forEach(b=>b.addEventListener('click',()=>go(b.dataset.name)));
go('Dashboard');

// Auto-save every 30s. Piggybacks on the same backup-then-verify save() used
// everywhere else, so the recovery slot stays fresh too — no separate logic.
setInterval(()=>{ save(); }, 30000);
window.addEventListener('beforeunload', ()=>{ save(); });
