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
  {id:'sister_wren',name:'SISTER WREN',role:'Healer',              hp:72, mp:100, joinChapter:74,  portrait:'assets/portraits/sister_wren.jpg'},
  {id:'soel',       name:'SOEL',       role:'Spiritual Familiar',  hp:50, mp:80,  joinChapter:0, joinLevel:10, portrait:'assets/portraits/soel.jpg'}
];
// Soel unlocks by LEVEL, not story chapter — everyone else uses joinChapter.
function memberUnlocked(m){ return m.joinLevel ? level() >= m.joinLevel : STATE.completed >= m.joinChapter; }
function getActiveParty(){ return ALL_PARTY.filter(memberUnlocked); }
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
function goldReward(c){ return 50 + c.id * 8; }

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
  gold: 100,
  lastRegenAt: Date.now(),
  frontierBossCooldownUntil: 0,
  frontierCurrentBoss: null,
  bounties: [],
  bountyDay: null,
  chaptersReadToday: 0,
  chaptersReadDay: null,
  readChapters: [],   // chapter IDs actually opened via the reader — gates Battle
  consumables: {},     // {potionId: count}
  battleItemMenuOpen: false,
  journalPage: null
};

function getSavePayload(){
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: {
      completed: STATE.completed, xp: STATE.xp, bossHp: STATE.bossHp,
      partyHp: STATE.partyHp, partyMp: STATE.partyMp, inventory: STATE.inventory,
      companionMode: STATE.companionMode, gold: STATE.gold, lastRegenAt: STATE.lastRegenAt,
      frontierBossCooldownUntil: STATE.frontierBossCooldownUntil, frontierCurrentBoss: STATE.frontierCurrentBoss,
      bounties: STATE.bounties, bountyDay: STATE.bountyDay,
      chaptersReadToday: STATE.chaptersReadToday, chaptersReadDay: STATE.chaptersReadDay,
      readChapters: STATE.readChapters, consumables: STATE.consumables
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
      if (data && data.state) {
        Object.assign(STATE, data.state);
        backfillReadChapters();
        return true;
      }
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
    backfillReadChapters();
    save();
    return true;
  }
  return false;
}
// Existing saves predate STATE.readChapters — assume every chapter up through
// STATE.completed was legitimately reached, so this fix doesn't retroactively
// lock anyone out of a boss they've already progressed past.
function backfillReadChapters(){
  if(STATE.readChapters && STATE.readChapters.length) return;
  STATE.readChapters = [];
  for(let i=1;i<=STATE.completed;i++) STATE.readChapters.push(i);
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
applyRegen();
save();

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
// TRADER & CRAFTING — same potion values as your codex project (Health
// Potion: 30 HP, Mana Potion: 25 MP, Greater Health: 75 HP), and Aisyah gives
// the same 10% haggle discount when she's in the active party. Crafting is
// adapted rather than copied: the codex system uses gathered materials
// (Herb Bundle, Iron Ore, etc.) from monster drops we don't have here, so
// recipes use boss trophies instead — gives the trophies an actual purpose
// beyond decoration.
// ---------------------------------------------------------------------------
const POTION_CATALOG = [
  {id:'health_potion', name:'Health Potion', icon:'🧪', effect:'heal', value:30, price:20},
  {id:'mana_potion', name:'Mana Potion', icon:'🔵', effect:'mana', value:25, price:18},
  {id:'greater_health_potion', name:'Greater Health Potion', icon:'💊', effect:'heal', value:75, price:55}
];
const CRAFT_RECIPES = [
  {id:'craft_health', name:'Health Potion', icon:'🧪', trophyCost:1, goldCost:8, resultId:'health_potion', resultQty:2, desc:'2 boss trophies of any kind + gold → 2 Health Potions.', trophies:2},
  {id:'craft_greater', name:'Greater Health Potion', icon:'💊', trophyCost:1, goldCost:30, resultId:'greater_health_potion', resultQty:1, desc:'3 boss trophies + gold → 1 Greater Health Potion.', trophies:3}
];
function haggleMultiplier(){ return getActiveParty().some(m=>m.id==='aisyah') ? 0.9 : 1; }
function potionPrice(p){ return Math.max(1, Math.round(p.price * haggleMultiplier())); }
function buyPotion(id){
  const p = POTION_CATALOG.find(x=>x.id===id);
  if(!p) return;
  const cost = potionPrice(p);
  if(STATE.gold < cost) return toast('Not enough gold');
  STATE.gold -= cost;
  STATE.consumables[id] = (STATE.consumables[id]||0) + 1;
  save();
  toast(`${p.icon} ${p.name} purchased · -${cost}g`);
  go('Inventory');
}
function craftPotion(recipeId){
  const r = CRAFT_RECIPES.find(x=>x.id===recipeId);
  if(!r) return;
  if(STATE.inventory.length < r.trophies) return toast(`Need ${r.trophies} boss trophies`);
  if(STATE.gold < r.goldCost) return toast('Not enough gold');
  STATE.inventory.splice(0, r.trophies); // consume the oldest trophies
  STATE.gold -= r.goldCost;
  STATE.consumables[r.resultId] = (STATE.consumables[r.resultId]||0) + r.resultQty;
  save();
  toast(`Crafted ${r.resultQty}× ${r.name}`);
  go('Inventory');
}
function usePotionInBattle(id){
  const p = POTION_CATALOG.find(x=>x.id===id);
  if(!p || !STATE.consumables[id]) return;
  const boss = bossFor(currentBossId());
  if(!boss) return;
  const party = getActiveParty();
  const actor = party[STATE.turn] || party[0];
  STATE.consumables[id]--;
  STATE.battleItemMenuOpen = false;
  if(p.effect==='heal'){
    const cur = STATE.partyHp[actor.id]!=null?STATE.partyHp[actor.id]:actor.hp;
    STATE.partyHp[actor.id] = Math.min(actor.hp, cur+p.value);
    logCombat(`${esc(actor.name)} drinks a ${p.icon} ${p.name}, recovering ${p.value} HP.`);
  } else {
    const cur = STATE.partyMp[actor.id]!=null?STATE.partyMp[actor.id]:actor.mp;
    STATE.partyMp[actor.id] = Math.min(actor.mp, cur+p.value);
    logCombat(`${esc(actor.name)} drinks a ${p.icon} ${p.name}, recovering ${p.value} MP.`);
  }
  save();
  STATE.turn=(STATE.turn+1)%Math.max(1,party.length);
  setTimeout(()=>go('Battle'),250);
}
function toggleBattleItemMenu(){ STATE.battleItemMenuOpen = !STATE.battleItemMenuOpen; go('Battle'); }

// ---------------------------------------------------------------------------
// OUT-OF-COMBAT REGEN — didn't exist in the codex project either (checked),
// so this is a new addition rather than a port. 1.5% of max HP/MP per minute
// away from the app, capped at 24h of accumulated time so a month-old save
// doesn't come back at full health instantly. Runs both on load (catches up
// time away between sessions) and on the 30s autosave tick (small trickle
// while the app is open but not in Battle).
// ---------------------------------------------------------------------------
function applyRegen(){
  const now = Date.now();
  const minutesAway = Math.min(24*60, Math.max(0, (now - (STATE.lastRegenAt||now)) / 60000));
  STATE.lastRegenAt = now;
  if(minutesAway <= 0) return;
  const rate = 0.015 * minutesAway; // fraction of max HP/MP restored
  getActiveParty().forEach(m=>{
    const hp = STATE.partyHp[m.id] != null ? STATE.partyHp[m.id] : m.hp;
    const mp = STATE.partyMp[m.id] != null ? STATE.partyMp[m.id] : m.mp;
    if(hp > 0) STATE.partyHp[m.id] = Math.min(m.hp, Math.round(hp + m.hp*rate));
    STATE.partyMp[m.id] = Math.min(m.mp, Math.round(mp + m.mp*rate));
  });
}

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
  sister_wren: {role:'healer', spell:{name:'Blessing of Faith', icon:'🙏', mp:12, healMult:1.1}, skill:{name:'Purify', icon:'🌿', mp:15, effect:'cleanse'}},
  soel:        {role:'caster', spell:{name:"Nine Lives' Ward", icon:'🐾', mp:20, healMult:0.6}, skill:{name:'Lucky Pounce', icon:'✨', mp:8, mult:1.3}}
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
function refreshTopbar(){const stats=topbar.querySelectorAll('.stat');const lvl=level();const prev=xpThreshold(lvl-1),next=xpThreshold(lvl);if(stats[0])stats[0].querySelector('.big').textContent=lvl;if(stats[1]){stats[1].querySelector('.num').textContent=`${STATE.xp.toLocaleString()} / ${next.toLocaleString()}`;stats[1].querySelector('.fill').style.width=`${Math.min(100,(STATE.xp-prev)/Math.max(1,next-prev)*100)}%`;}if(stats[2]){const san=getActiveParty().find(m=>m.id==='san');const shp=san?(STATE.partyHp['san']!=null?STATE.partyHp['san']:san.hp):82;const smax=san?san.hp:82;stats[2].querySelector('.num').textContent=`${shp} / ${smax}`;const bar=stats[2].querySelector('.fill');if(bar)bar.style.width=`${Math.max(0,Math.min(100,shp/smax*100))}%`;}if(stats[3]){stats[3].querySelector('.num').textContent=STATE.gold.toLocaleString();}}
function go(name){if(name!=='Battle'){clearAutoActTimer();STATE.battleItemMenuOpen=false;}document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.name===name));render(name);window.scrollTo({top:0,behavior:'smooth'})}

function render(name){refreshTopbar();document.querySelectorAll('.soel').forEach(e=>e.remove());let body='';if(name==='Dashboard')body=dashboard();if(name==='Journal')body=journalScreen();if(name==='Quests')body=questsScreen();if(name==='Party')body=partyScreen();if(name==='Spellbook')body=spellbookScreen();if(name==='Inventory')body=inventoryScreen();if(name==='Codex')body=codexScreen();if(name==='Battle')body=battleScreen();if(name==='Temple')body=templeScreen();if(name==='Frontier')body=frontierScreen();main.innerHTML=topbar.outerHTML+body+`<div id="toast" class="toast"></div>`;if(name!=='Battle'){const soel=document.createElement('div');soel.className='soel';const soelUnlocked=level()>=10;soel.innerHTML=soelUnlocked?`<img src="${soelSrc}"><div class="lock" style="border-color:#68b58b"><b>SOEL</b><small>AWAKENED ✧<br/>In your active party</small></div>`:`<img src="${soelSrc}"><div class="lock"><b>SOEL</b><small>LOCKED<br/>Awakens at Level 10 🔒</small></div>`;document.querySelector('.app').appendChild(soel)}bind();if(name==='Battle'){const cl=document.getElementById('combatLog');if(cl)cl.scrollTop=cl.scrollHeight;}}

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
  if(!STATE.readChapters.includes(id)){ STATE.readChapters.push(id); save(); }
  main.innerHTML = topbar.outerHTML + readerHTML(c);
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  window.scrollTo({top:0,behavior:'smooth'});
}
function completeChapter(id){
  if(id!==STATE.completed+1){ if(id<=STATE.completed) return; return toast('Read chapters in sequence'); }
  const c = chapterData.find(ch=>ch.id===id);
  if(c.boss) return toast("Defeat this chapter's boss in Battle to complete it");
  const reward = xpForChapter(c);
  const gold = Math.round(goldReward(c)*0.4);
  STATE.xp += reward;
  STATE.gold += gold;
  STATE.completed = id;
  STATE.chaptersReadToday++;
  checkBountyProgress('read_chapters', null, 1);
  save();
  const joins = getRecentJoins();
  toast(`Chapter ${id} complete · +${reward} XP · +${gold}g${joins.length?` · ${joins.map(j=>j.name).join(' & ')} joined!`:''}`);
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
    `<article class="quest locked"><div class="mini-ico">🐾</div><div><h3>Awaken Soel</h3><p>Soel develops as a spiritual familiar before joining the active party.</p><b>LOCKED · LEVEL 10</b></div></article></div>`+
    bountyBoardHTML()+
    `<div class="flow"><div class="flow-step"><strong>ACCEPT QUEST</strong><p>Choose the current story objective.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>READ JOURNAL</strong><p>Experience the comic and scenes.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>COMPLETE CHAPTER</strong><p>Receive Story XP.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>LEVEL UP</strong><p>Progress toward the next gate.</p></div><div class="flow-arrow">›</div><div class="flow-step"><strong>BOSS ENCOUNTER</strong><p>Defeat this arc's boss.</p></div></div>`,
    navButton('Dashboard')+navButton('Journal'));
}
function handleQuest(arg){ if(arg==='battle') return go('Battle'); openChapter(Number(arg)); }

function partyScreen(){
  const active = getActiveParty();
  const locked = ALL_PARTY.filter(m=>!active.includes(m));
  return panel('Travelling Party','PARTY ROSTER',
    `<div class="party-list">${active.map(m=>`<article class="party-row"><div class="portrait large"><img src="${m.portrait}" alt="${m.name}"></div><h3>${m.name}</h3><div class="role">${m.role}</div><div class="hp">Level ${level()} · ${m.hp} / ${m.hp} HP</div></article>`).join('')}</div>`+
    (locked.length?`<h3 style="font-family:Cinzel;color:#8f7aa8;margin:22px 0 10px;font-size:15px">NOT YET JOINED</h3><div class="party-list">${locked.map(m=>`<article class="party-row" style="opacity:.5"><div class="portrait large"><img src="${m.portrait}" alt="${m.name}"></div><h3>${m.name}</h3><div class="role">${m.role}</div><div class="hp">${m.joinLevel?`Awakens at Level ${m.joinLevel} (currently Lv.${level()})`:`Joins at Chapter ${m.joinChapter}`}</div></article>`).join('')}</div>`:''),
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
  const potionsOwned = Object.entries(STATE.consumables).filter(([,n])=>n>0);
  const potionsHTML = potionsOwned.length
    ? `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:18px">🧪 POTIONS</h3><div class="chapter-grid">${potionsOwned.map(([id,n])=>{const p=POTION_CATALOG.find(x=>x.id===id);return `<article class="quest"><div class="mini-ico">${p.icon}</div><div><h3>${esc(p.name)}</h3><p>${p.effect==='heal'?`Restores ${p.value} HP`:`Restores ${p.value} MP`}</p></div><b>x${n}</b></article>`;}).join('')}</div>`
    : `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:18px">🧪 POTIONS</h3><p class="lead">None yet — buy some from the Trader below, or craft them from boss trophies.</p>`;

  const haggle = haggleMultiplier() < 1;
  const traderHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">🛒 TRADER</h3><p class="lead" style="margin-bottom:10px">${haggle?'Aisyah is haggling for you — 10% off.':'Aisyah isn\'t in your active party, so no haggle discount right now.'}</p><div class="chapter-grid">${POTION_CATALOG.map(p=>`<article class="quest"><div class="mini-ico">${p.icon}</div><div><h3>${esc(p.name)}</h3><p>${p.effect==='heal'?`Restores ${p.value} HP`:`Restores ${p.value} MP`}</p></div><button class="small-btn primary" onclick="buyPotion('${p.id}')" ${STATE.gold<potionPrice(p)?'disabled':''}>${potionPrice(p)}g</button></article>`).join('')}</div>`;

  const craftHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">⚒️ CRAFTING</h3><p class="lead" style="margin-bottom:10px">Turn boss trophies into potions. You have ${STATE.inventory.length} trophy${STATE.inventory.length===1?'':'ies'}.</p><div class="chapter-grid">${CRAFT_RECIPES.map(r=>`<article class="quest"><div class="mini-ico">${r.icon}</div><div><h3>${esc(r.name)} ×${r.resultQty}</h3><p>${esc(r.desc)}</p></div><button class="small-btn primary" onclick="craftPotion('${r.id}')" ${(STATE.inventory.length<r.trophies||STATE.gold<r.goldCost)?'disabled':''}>${r.trophies} trophies + ${r.goldCost}g</button></article>`).join('')}</div>`;

  const trophies = STATE.inventory.length
    ? `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">BOSS TROPHIES</h3><p class="lead" style="margin-bottom:14px">Earned by defeating story bosses. Spend these on crafting above.</p><div class="chapter-grid">${STATE.inventory.map(item=>`<article class="quest"><div class="mini-ico">${item.icon}</div><div><h3>${esc(item.name)}</h3><p>${esc(item.desc)}</p></div></article>`).join('')}</div>`
    : `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">BOSS TROPHIES</h3><p class="lead">None yet — defeat a boss in Battle to earn your first trophy.</p>`;
  const supplies = `<h3 style="font-family:Cinzel;color:#8f7aa8;margin:22px 0 4px;font-size:15px">STARTING SUPPLIES</h3><div class="chapter-grid">${['Minor Healing Tonic','Aether Shard','Waystone Fragment','Tomb Key','Antique Coin'].map((x,i)=>`<article class="quest"><div class="mini-ico">${['✚','◆','◇','⚿','◈'][i]}</div><div><h3>${x}</h3><p>Carried by the travelling party.</p></div><b>x${i+1}</b></article>`).join('')}</div>`;
  return panel('Inventory','CARRIED ITEMS', potionsHTML+traderHTML+craftHTML+trophies+supplies, navButton('Dashboard'));
}
function codexScreen(){return panel('Codex','WORLD & LORE',`<div class="chapter-grid">${['Aethon','Daybreak','Tomb of Kings','Bone Tyrant','Travelling Party','Spiritual Familiars'].map((x,i)=>`<article class="quest"><div class="mini-ico">${['✦','☼','♜','☠','♟','🐾'][i]}</div><div><h3>${x}</h3><p>World entry revealed through the Season One story.</p></div></article>`).join('')}</div>`,navButton('Dashboard'))}

// ---------------------------------------------------------------------------
// TEMPLE — Sister Wren's service, unlocked once she's joined (Chapter 74).
// Resurrect brings a fallen party member back at partial HP; Cure Disease
// clears any status ailment. Both cost gold, scaling gently with level so
// they don't trivialize deaths at high level but stay cheap early on.
// ---------------------------------------------------------------------------
function templeUnlocked(){ return STATE.completed >= 74; }
function resurrectCost(){ return 80 + level()*6; }
function cureDiseaseCost(){ return 40 + level()*3; }
function templeScreen(){
  if(!templeUnlocked()){
    return panel('Temple','SISTER WREN\'S SANCTUM',
      `<p class="lead">The Temple opens once Sister Wren has joined the party (Chapter 74). Keep reading the journal to unlock resurrection and disease-cure services here.</p>`,
      navButton('Dashboard'));
  }
  const party = getActiveParty();
  const fallen = party.filter(m => (STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp) <= 0);
  const rCost = resurrectCost(), cCost = cureDiseaseCost();
  const fallenHTML = fallen.length
    ? fallen.map(m=>`<article class="quest"><div class="mini-ico">🌟</div><div><h3>${esc(m.name)}</h3><p>Fallen in battle. Resurrect restores them to 40% HP.</p></div><button class="small-btn primary" onclick="templeResurrect('${m.id}')" ${STATE.gold<rCost?'disabled':''}>${rCost}g</button></article>`).join('')
    : `<article class="quest"><div class="mini-ico">✦</div><div><h3>No one has fallen</h3><p>Your party is standing. Resurrection isn't needed right now.</p></div></article>`;
  return panel('Temple','SISTER WREN\'S SANCTUM',
    `<p class="lead">Quiet, incense-lit, and always open to the party. Sister Wren's temple offers what the road can't.</p>
     <h3 style="font-family:Cinzel;color:#c99aff;margin:18px 0 4px;font-size:16px">🌟 RESURRECTION</h3>
     <div class="chapter-grid">${fallenHTML}</div>
     <h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:16px">🌿 CURE DISEASE</h3>
     <div class="chapter-grid"><article class="quest"><div class="mini-ico">🌿</div><div><h3>Cleanse the Party</h3><p>Removes any lingering status ailment from every active party member.</p></div><button class="small-btn primary" onclick="templeCureDisease()" ${STATE.gold<cCost?'disabled':''}>${cCost}g</button></article></div>
     <div class="locked-banner" style="margin-top:18px">Gold: <b style="color:#eee">${STATE.gold.toLocaleString()}</b> · Earned from boss victories and completed chapters.</div>`,
    navButton('Dashboard'));
}
function templeResurrect(id){
  const cost = resurrectCost();
  if(STATE.gold < cost) return toast('Not enough gold');
  const m = ALL_PARTY.find(p=>p.id===id);
  if(!m) return;
  STATE.gold -= cost;
  STATE.partyHp[id] = Math.round(m.hp * 0.4);
  save();
  toast(`${m.name} resurrected · -${cost}g`);
  go('Temple');
}
function templeCureDisease(){
  const cost = cureDiseaseCost();
  if(STATE.gold < cost) return toast('Not enough gold');
  STATE.gold -= cost;
  STATE.partyStatus = {};
  save();
  toast(`Party cleansed · -${cost}g`);
  go('Temple');
}

// ---------------------------------------------------------------------------
// THE FRAYING FRONTIER — repeatable post-story zone, matching the pattern
// from your codex project's "Unmapped Road" but using your own established
// name for it. Regular tiered encounters plus a rotating rematch against any
// boss you've already defeated (XP + gold only, no duplicate loot), with a
// randomized cooldown between boss appearances.
// ---------------------------------------------------------------------------
const FRONTIER_REGULARS = [
  {id:'frontier_wisp', name:'Fraying Wisp', icon:'✨', hp:420, xp:180, gold:40, desc:'A spark shaken loose from the edge of the story.'},
  {id:'frontier_hound', name:'Rift Hound', icon:'🐺', hp:560, xp:230, gold:55, desc:'Follows the seams between finished and unfinished chapters.'},
  {id:'frontier_sentinel', name:'Unwritten Sentinel', ico:'📖', icon:'📖', hp:760, xp:300, gold:75, desc:'Assembled from pages that haven\'t been drafted yet.'},
  {id:'frontier_wraith', name:'Threshold Wraith', icon:'🌫️', hp:960, xp:380, gold:95, desc:'Lingers exactly on the border of what\'s known.'}
];
function frontierUnlocked(){ return STATE.completed >= 20; } // past the Nexus Planarch
function frontierEligibleBosses(){ return BOSS_CHAPTERS.filter(b => STATE.completed >= b.id); }
function ensureFrontierBoss(){
  if(STATE.frontierCurrentBoss) return STATE.frontierCurrentBoss;
  if(Date.now() < STATE.frontierBossCooldownUntil) return null;
  const pool = frontierEligibleBosses();
  if(!pool.length) return null;
  const chosen = pool[Math.floor(Math.random()*pool.length)];
  STATE.frontierCurrentBoss = chosen.id;
  save();
  return chosen.id;
}
function frontierScreen(){
  if(!frontierUnlocked()){
    return panel('The Fraying Frontier','ENDLESS ZONE',
      `<p class="lead">The Frontier opens after Chapter 20 (the Nexus Planarch). Keep progressing the story to unlock repeatable encounters here.</p>`,
      navButton('Dashboard'));
  }
  const bossId = ensureFrontierBoss();
  const boss = bossId ? bossFor(bossId) : null;
  let html = bountyBoardHTML();
  html += `<p class="lead" style="margin-top:18px">High-level encounters roam here between the delayed return of bosses you've already faced. Regular fights and boss rematches grant XP and gold only — no loot duplication.</p>`;
  html += `<h3 style="font-family:Cinzel;color:#c99aff;margin:18px 0 4px;font-size:16px">⚔️ REGULAR ENCOUNTERS</h3><div class="chapter-grid">`;
  FRONTIER_REGULARS.forEach(e=>{
    html += `<article class="quest"><div class="mini-ico">${e.icon}</div><div><h3>${esc(e.name)}</h3><p>${esc(e.desc)}</p><b>${e.hp} HP · ${e.xp} XP · ${e.gold}g</b></div><button class="small-btn primary" onclick="fightFrontierRegular('${e.id}')">FIGHT</button></article>`;
  });
  html += `</div>`;
  if(boss){
    html += `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:16px">👑 A BOSS HAS RETURNED</h3><div class="chapter-grid"><article class="quest"><div class="mini-ico">☠</div><div><h3>${esc(boss.name)}</h3><p>An earlier foe, drawn back through the Frontier.</p><b>${boss.hp.toLocaleString()} HP · ${bossReward(chapterData.find(c=>c.id===boss.id)).toLocaleString()} XP · ${goldReward(chapterData.find(c=>c.id===boss.id))}g</b></div><button class="small-btn primary" onclick="fightFrontierBoss()">FIGHT</button></article></div>`;
  } else {
    const remaining = Math.max(0, STATE.frontierBossCooldownUntil - Date.now());
    const mins = Math.ceil(remaining/60000);
    html += `<div class="locked-banner" style="margin-top:18px">🕰️ No boss present right now — the last one was defeated. Another will drift back through the Frontier in roughly ${mins} minute${mins===1?'':'s'}.</div>`;
  }
  html += `<div class="locked-banner" style="margin-top:18px">Gold: <b style="color:#eee">${STATE.gold.toLocaleString()}</b></div>`;
  return panel('The Fraying Frontier','ENDLESS ZONE', html, navButton('Dashboard'));
}
function fightFrontierRegular(id){
  const e = FRONTIER_REGULARS.find(x=>x.id===id);
  if(!e) return;
  STATE.xp += e.xp;
  STATE.gold += e.gold;
  checkBountyProgress('frontier_kill', id, 1);
  save();
  toast(`${e.name} defeated · +${e.xp} XP · +${e.gold}g`);
  go('Frontier');
}
function fightFrontierBoss(){
  if(!STATE.frontierCurrentBoss) return;
  const boss = bossFor(STATE.frontierCurrentBoss);
  const c = chapterData.find(ch=>ch.id===boss.id);
  const xp = bossReward(c), gold = goldReward(c);
  STATE.xp += xp;
  STATE.gold += gold;
  STATE.frontierCurrentBoss = null;
  STATE.frontierBossCooldownUntil = Date.now() + (5+Math.random()*10)*60000; // 5-15 min
  checkBountyProgress('frontier_boss', boss.name, 1);
  save();
  toast(`${boss.name} defeated again · +${xp} XP · +${gold}g`);
  go('Frontier');
}

// ---------------------------------------------------------------------------
// BOUNTY BOARD — adapted from your codex project's bounty system, but
// re-fit to how Journey to Daybreak actually works: your story bosses are
// mostly one-time fights, not repeatable "kill 5 Goblins" filler, so bounties
// here draw from what IS repeatable (Frontier regulars, Frontier boss
// rematches) plus a reading-pace bounty for chapters completed today. Up to
// 3 active at once, refreshing once per real calendar day.
// ---------------------------------------------------------------------------
function todayKey(){ return new Date().toISOString().slice(0,10); }
function bountyPool(){
  const pool = [];
  FRONTIER_REGULARS.forEach(e=>{
    pool.push({id:'bounty_kill_'+e.id, type:'frontier_kill', target:e.id, need:3,
      name:`${e.name} Cull`, desc:`Defeat 3 ${e.name} in the Frontier.`, icon:e.icon,
      rw:{xp:e.xp*2, gold:e.gold*2}});
  });
  if(frontierUnlocked()){
    pool.push({id:'bounty_frontier_boss', type:'frontier_boss', target:null, need:1,
      name:'Rematch Bounty', desc:`Defeat whichever boss the Frontier has drawn back today.`, icon:'👑',
      rw:{xp:400, gold:150}});
  }
  pool.push({id:'bounty_read_1', type:'read_chapters', target:null, need:1,
    name:'A Page Today', desc:'Complete 1 chapter today.', icon:'📖', rw:{xp:150, gold:30}});
  pool.push({id:'bounty_read_3', type:'read_chapters', target:null, need:3,
    name:'Deep in the Journal', desc:'Complete 3 chapters today.', icon:'📚', rw:{xp:500, gold:100}});
  return pool;
}
function refreshBounties(){
  const today = todayKey();
  if(STATE.chaptersReadDay !== today){ STATE.chaptersReadToday = 0; STATE.chaptersReadDay = today; }
  if(STATE.bountyDay === today && STATE.bounties.length) return;
  const pool = bountyPool();
  const shuffled = pool.map(b=>({...b,c:0,done:false})).sort(()=>Math.random()-0.5);
  STATE.bounties = shuffled.slice(0, Math.min(3, shuffled.length));
  STATE.bountyDay = today;
  save();
}
function checkBountyProgress(type, target, amount){
  refreshBounties();
  STATE.bounties.forEach(b=>{
    if(b.done || b.type!==type) return;
    if(type==='frontier_kill' && b.target!==target) return;
    b.c = Math.min(b.need, b.c + amount);
    if(b.c >= b.need){
      b.done = true;
      STATE.xp += b.rw.xp;
      STATE.gold += b.rw.gold;
      toast(`💰 Bounty complete: ${b.name} · +${b.rw.xp} XP · +${b.rw.gold}g`);
    }
  });
  save();
}
function bountyBoardHTML(){
  refreshBounties();
  return `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:16px">💰 BOUNTY BOARD</h3><p class="lead" style="margin-bottom:10px">Refreshes daily. Complete these alongside your normal progress for bonus XP and gold.</p><div class="chapter-grid">${STATE.bounties.map(b=>`<article class="quest ${b.done?'':'active'}"><div class="mini-ico">${b.icon}</div><div><h3>${esc(b.name)}</h3><p>${esc(b.desc)}</p><b>${b.done?'COMPLETE ✓':`${b.c}/${b.need} · ${b.rw.xp} XP + ${b.rw.gold}g`}</b></div></article>`).join('')}</div>`;
}


function battleScreen(){
  const bossId = currentBossId();
  const boss = bossFor(bossId);
  if(!boss) return panel('Battle','MAJOR ENCOUNTER','<p class="lead">No boss encounter available yet.</p>', navButton('Dashboard'));
  const locked = STATE.completed < boss.id-1;
  const notYetRead = !locked && !STATE.readChapters.includes(boss.id);
  if(notYetRead){
    const c = chapterData.find(ch=>ch.id===boss.id);
    return panel('Battle','MAJOR ENCOUNTER',
      `<div class="locked-banner"><b>READ CHAPTER ${boss.id} FIRST</b><br>${esc(boss.name)}'s encounter follows the story in Chapter ${boss.id}: ${esc(c.title)}. Read it before entering battle.</div>`,
      `<button class="cta" data-read="${boss.id}">READ CHAPTER ${boss.id} ›</button> ` + navButton('Dashboard'));
  }
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
    const potionCount = Object.values(STATE.consumables).reduce((a,b)=>a+b,0);
    const actions = [
      ['ATTACK','⚔️','Basic attack', true],
      ['SPELL', spellAvailable?actorKit.spell.icon:'✨', spellAvailable?actorKit.spell.name+` (${actorKit.spell.mp} MP)`:'No spells known', spellAvailable],
      ['SKILL', highSkillReady?actorKit.highSkill.icon:(skillAvailable?actorKit.skill.icon:'🎯'), highSkillReady?actorKit.highSkill.name+` (${actorKit.highSkill.mp} MP)`:(skillAvailable?actorKit.skill.name+` (${actorKit.skill.mp} MP)`:'No skills known'), skillAvailable],
      ['ITEM','🧪', potionCount?`${potionCount} potion${potionCount===1?'':'s'} carried`:'No potions — visit the Trader', true],
      ['DEFEND','🛡️','Brace', true]
    ];
    actions.forEach(([a,icon,sub,enabled])=>{
      const onclick = a==='ITEM' ? `onclick="toggleBattleItemMenu()"` : `data-battle-action="${a}"`;
      html += `<button class="battle-action-btn" ${onclick} ${hp<=0||locked||!enabled?'disabled':''}><span class="battle-action-icon">${icon}</span><span class="battle-action-label">${a}</span><span class="battle-action-sub">${sub}</span></button>`;
    });
    if(STATE.battleItemMenuOpen){
      const owned = Object.entries(STATE.consumables).filter(([,n])=>n>0);
      html += `<div class="chapter-grid" style="grid-column:1/-1;margin-top:8px">${owned.length ? owned.map(([id,n])=>{const p=POTION_CATALOG.find(x=>x.id===id);return `<article class="quest"><div class="mini-ico">${p.icon}</div><div><h3>${esc(p.name)} ×${n}</h3><p>${p.effect==='heal'?`+${p.value} HP`:`+${p.value} MP`}</p></div><button class="small-btn primary" onclick="usePotionInBattle('${id}')">USE</button></article>`;}).join('') : '<p class="lead">No potions carried — buy some from the Trader in Inventory.</p>'}</div>`;
    }
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
    toggleBattleItemMenu();
    return;
  } else {
    dealDamage(baseDmg, 'attacks');
  }

  save();

  if(hp===0){
    logCombat(`<span style="color:#d5a1f4">${esc(boss.name)} defeated. Chapter ${boss.id} complete.</span>`);
    if(STATE.completed < boss.id){
      const c = chapterData.find(c=>c.id===boss.id);
      const gold = goldReward(c);
      STATE.xp += bossReward(c);
      STATE.gold += gold;
      STATE.completed = boss.id;
      const loot = awardBossLoot(boss.id, boss.name);
      save();
      toast(loot ? `${boss.name} defeated! · ${loot.icon} ${loot.name} · +${gold}g` : `${boss.name} defeated! +${gold}g`);
      // Same pattern as a regular chapter completion: land back on the
      // Journal instead of parking on Battle, which would otherwise show a
      // static "read the next chapter first" message the player has to
      // click through manually if the next chapter is also a boss.
      setTimeout(()=>go('Journal'), 600);
    } else {
      toast(`${boss.name} defeated!`);
      go('Battle');
    }
  } else {
    STATE.turn=(STATE.turn+1)%Math.max(1,party.length);
    setTimeout(()=>go('Battle'),250);
  }
}

Array.from(document.querySelectorAll('#nav button')).forEach(b=>b.addEventListener('click',()=>go(b.dataset.name)));
go('Dashboard');

// Auto-save every 30s. Piggybacks on the same backup-then-verify save() used
// everywhere else, so the recovery slot stays fresh too — no separate logic.
setInterval(()=>{ applyRegen(); save(); }, 30000);
window.addEventListener('beforeunload', ()=>{ save(); });
