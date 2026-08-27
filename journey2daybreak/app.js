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
  {id:'joel',       name:'JOEL',       role:'Paladin',             hp:95, mp:0,   joinChapter:3,   portrait:'assets/portraits/joel.jpg'},
  {id:'aisyah',     name:'AISYAH',     role:'Rogue / Merchant',    hp:74, mp:0,   joinChapter:4,   portrait:'assets/portraits/aisyah.jpg'},
  {id:'eliz',       name:'ELIZ',       role:'Healer',              hp:65, mp:120, joinChapter:6,   portrait:'assets/portraits/eliz.jpg'},
  {id:'mezstorm',   name:'MEZSTORM',   role:'Storm Mage',          hp:75, mp:110, joinChapter:7,   portrait:'assets/portraits/mezstorm.jpg'},
  {id:'senedra',    name:'SENEDRA',    role:'Scout',               hp:70, mp:0,   joinChapter:11,  portrait:'assets/portraits/senedra.jpg'},
  {id:'zaki',       name:'ZAKI',       role:'Fighter',             hp:88, mp:0,   joinChapter:11,  portrait:'assets/portraits/zaki.jpg'},
  {id:'ser_aldric', name:'SER ALDRIC', role:'Knight',              hp:90, mp:0,   joinChapter:73,  portrait:'assets/portraits/ser_aldric.jpg'},
  {id:'sister_wren',name:'SISTER WREN',role:'Healer',              hp:72, mp:0,   joinChapter:74,  portrait:'assets/portraits/sister_wren.jpg'},
  {id:'soel',       name:'SOEL',       role:'Spiritual Familiar',  hp:50, mp:0,   joinChapter:0, joinLevel:10, portrait:'assets/portraits/soel.jpg'}
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
function addGold(amount){
  const active = getActiveParty().some(m=>m.id==='aisyah');
  const bonusPct = (active ? (affinityFor('aisyah').fx.goldPct || 0) : 0) + guildBonus('gold');
  const total = Math.round(amount * (1+bonusPct));
  STATE.gold += total;
  return total;
}
function addXp(amount){
  const total = Math.round(amount * (1+guildBonus('xp')));
  STATE.xp += total;
  return total;
}

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
  autoBattleMode: false,   // when on, San's own turns also auto-resolve — full hands-off fights
  musicMuted: false,
  battleSpellMenuOpen: false,
  shieldTurns: 0,        // multi-turn defense buff (Shield, Evasion Ward, Stoneskin, etc.) — reduces next N boss hits
  shieldPct: 0,
  hasteTurns: 0,         // multi-turn damage buff (Haste, Improved Haste, Guildbound Surge)
  hastePct: 0,
  timeStopTurns: 0,      // boss skips its counter-attack entirely for N turns
  markedBoss: false,     // Storm's Mark — guarantees San's next attack crits
  nervousCourageActive: false,
  discoveredAbilities: [],   // growth ability ids that have fired at least once
  growthUsedThisBattle: {},  // {abilityId: true} — once per encounter, reset on new boss
  guildRep: 0, guildRepBalance: 0, guildContracts: [], guildContractWeek: null,
  visionMachineLastDay: null, joelLetterCount: 0, lastVision: null,
  currentEncounter: null,  // {type:'regular'|'frontierBoss', ...} — null means "the next story boss"
  regularHp: {},            // {encounterKey: currentHp} for Zone/Frontier regular monsters
  defending: {},        // {memberId: true} — halves the boss's next hit on them, consumed on use
  partyStatus: {},      // {memberId: 'diseased'} — inflicted by some boss hits, blocks regen until cured
  equipped: {},          // {memberId: trophyItemId} — one trinket slot per member
  equippedTrophies: {},  // {memberId: fullTrophyObject} — kept alongside `equipped` for bonus lookup
  lastSeenAt: Date.now(),
  selectedZone: null,
  roundPosition: 0,   // how many party members have acted so far this round — boss attacks once the round completes, not once per action
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
      readChapters: STATE.readChapters, consumables: STATE.consumables, partyStatus: STATE.partyStatus,
      discoveredAbilities: STATE.discoveredAbilities, autoBattleMode: STATE.autoBattleMode, musicMuted: STATE.musicMuted,
      guildRep: STATE.guildRep, guildRepBalance: STATE.guildRepBalance, guildContracts: STATE.guildContracts,
      guildContractWeek: STATE.guildContractWeek, visionMachineLastDay: STATE.visionMachineLastDay,
      joelLetterCount: STATE.joelLetterCount, lastVision: STATE.lastVision,
      currentEncounter: STATE.currentEncounter, regularHp: STATE.regularHp,
      equipped: STATE.equipped, lastSeenAt: STATE.lastSeenAt, equippedTrophies: STATE.equippedTrophies,
      selectedZone: STATE.selectedZone, roundPosition: STATE.roundPosition
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
applyIdleGains();
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
  hp: c.id===8 ? 1400 : 1400 + Math.min(2500, (c.id-8)*45),
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
// ACTIVE ENCOUNTER — normalizes what's currently loaded in the Battle screen,
// whether that's the next story boss (default), a Frontier boss rematch, or
// a Zone regular monster. Lets battleScreen/battleAction/bossCounterAttack
// work against one shape regardless of source, instead of three separate
// code paths.
// ---------------------------------------------------------------------------
function activeEncounter(){
  if(STATE.currentEncounter){
    const enc = STATE.currentEncounter;
    if(enc.type==='regular'){
      const zone = ZONES.find(z=>z.id===enc.zoneId);
      if(!zone) { STATE.currentEncounter=null; return activeEncounter(); }
      const list = zone.id==='fraying_frontier' ? FRONTIER_REGULARS : zone.regulars;
      const e = list.find(x=>x.id===enc.monsterId);
      if(!e) { STATE.currentEncounter=null; return activeEncounter(); }
      return {id:enc.key, name:e.name, hp:e.hp, ac:12, art:null, phases:null, phaseArt:null,
        isRegular:true, xpReward:e.xp, goldReward:e.gold, zoneId:enc.zoneId, monsterId:enc.monsterId};
    }
    if(enc.type==='frontierBoss'){
      const b = bossFor(enc.bossId);
      if(!b) { STATE.currentEncounter=null; return activeEncounter(); }
      return Object.assign({}, b, {isFrontierBoss:true});
    }
  }
  const b = bossFor(currentBossId());
  if(!b) return null;
  return Object.assign({}, b, {isStoryBoss:true});
}
function activeEncounterHp(enc){
  if(!enc) return 0;
  if(enc.isRegular) return (STATE.regularHp[enc.id]!=null) ? STATE.regularHp[enc.id] : enc.hp;
  return bossHpFor(enc.id);
}
function setActiveEncounterHp(enc, val){
  if(enc.isRegular){ STATE.regularHp[enc.id] = Math.max(0,val); save(); }
  else setBossHp(enc.id, val);
}
function startRegularEncounter(zoneId, monsterId){
  const zone = ZONES.find(z=>z.id===zoneId);
  const list = zone.id==='fraying_frontier' ? FRONTIER_REGULARS : zone.regulars;
  const e = list.find(x=>x.id===monsterId);
  if(!e) return;
  const key = zoneId+'_'+monsterId;
  STATE.currentEncounter = {type:'regular', zoneId, monsterId, key};
  STATE.regularHp[key] = e.hp;
  STATE.combatLog = []; STATE.combatLogBossId = 'enc_'+key; STATE.roundPosition = 0;
  STATE.growthUsedThisBattle = {}; STATE.nervousCourageActive = false; STATE.markedBoss = false;
  STATE.turn = 0;
  save();
  go('Battle');
}
function startFrontierBossEncounter(){
  if(!STATE.frontierCurrentBoss) return;
  STATE.currentEncounter = {type:'frontierBoss', bossId: STATE.frontierCurrentBoss};
  STATE.combatLog = []; STATE.combatLogBossId = 'enc_fb_'+STATE.frontierCurrentBoss; STATE.roundPosition = 0;
  STATE.growthUsedThisBattle = {}; STATE.nervousCourageActive = false; STATE.markedBoss = false;
  STATE.turn = 0;
  save();
  go('Battle');
}
function endNonStoryEncounter(){
  STATE.currentEncounter = null;
  save();
}

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
  endTurn(boss, party);
}
function toggleBattleItemMenu(){ STATE.battleItemMenuOpen = !STATE.battleItemMenuOpen; go('Battle'); }
function toggleBattleSpellMenu(){ STATE.battleSpellMenuOpen = !STATE.battleSpellMenuOpen; go('Battle'); }
function castNamedSpell(index){ STATE.pendingSpellIndex = index; STATE.battleSpellMenuOpen = false; battleAction('SPELL'); }

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
    if(STATE.partyStatus[m.id]==='diseased') return; // no natural recovery while diseased
    const hp = STATE.partyHp[m.id] != null ? STATE.partyHp[m.id] : m.hp;
    const mp = STATE.partyMp[m.id] != null ? STATE.partyMp[m.id] : m.mp;
    if(hp > 0) STATE.partyHp[m.id] = Math.min(effectiveMaxHp(m), Math.round(hp + m.hp*rate));
    STATE.partyMp[m.id] = Math.min(effectiveMaxMp(m), Math.round(mp + m.mp*rate));
  });
}
// ---------------------------------------------------------------------------
// IDLE GAINS — confirmed this doesn't exist in your codex project either, so
// it's a new design rather than a port. Applied once per session start (not
// on the 30s tick, to avoid double-dipping while actively playing) — a
// "welcome back" catch-up for real time away, capped at 24h and scaled to
// level so it stays a small trickle rather than a way to skip content.
// ---------------------------------------------------------------------------
function applyIdleGains(){
  const now = Date.now();
  const minutesAway = Math.min(24*60, Math.max(0, (now - (STATE.lastSeenAt||now)) / 60000));
  STATE.lastSeenAt = now;
  if(minutesAway < 1) return;
  const lvl = level();
  const xpGain = Math.round(minutesAway * (1.5 + lvl*0.3));
  const goldGain = Math.round(minutesAway * (1 + lvl*0.15));
  if(xpGain<=0 && goldGain<=0) return;
  const xpAdded = addXp(xpGain);
  const goldAdded = addGold(goldGain);
  if(minutesAway >= 10){
    const hrs = Math.floor(minutesAway/60), mins = Math.round(minutesAway%60);
    const timeStr = hrs ? `${hrs}h ${mins}m` : `${mins}m`;
    setTimeout(()=>toast(`Welcome back — away ${timeStr} · +${xpAdded.toLocaleString()} XP · +${goldAdded.toLocaleString()}g`), 400);
  }
}

// ---------------------------------------------------------------------------
// CLASS KITS — real per-character spells/skills instead of a generic SPELL
// button. Also drives assisted-AI so a Storm Mage actually casts instead of
// always swinging a weapon it doesn't have. Eliz's Cure Disease unlocks at
// level 30, matching "high level" as requested.
// ---------------------------------------------------------------------------
const CLASS_KIT = {
  san:         {role:'caster',
    spells:[
      {name:"Magic Missile", icon:"\u2728", mp:10, levelReq:1, tier:1, desc:"A flurry of arcane darts that never miss.", dice:"1d8"},
      {name:"Chromatic Orb", icon:"\u26a1", mp:12, levelReq:2, tier:1, desc:"A sphere of shifting elemental energy.", dice:"1d10", status:{type:"shock",chance:0.15,turns:1}},
      {name:"Shield", icon:"\ud83d\udee1\ufe0f", mp:8, levelReq:4, tier:1, desc:"A wall of force deflects incoming blows.", buffType:"defense", buffVal:4, buffTurns:3},
      {name:"Melf's Acid Arrow", icon:"\ud83e\uddea", mp:14, levelReq:6, tier:1, desc:"A bolt of acid that keeps corroding.", dice:"1d10", status:{type:"poison",chance:0.35,dmg:3,turns:3}},
      {name:"Evasion Ward", icon:"\ud83d\udee1\ufe0f", mp:16, levelReq:7, tier:2, desc:"Illusory duplicates make you harder to pin down.", buffType:"defense", buffVal:6, buffTurns:3},
      {name:"Web of Frost", icon:"\u26a1", mp:18, levelReq:9, tier:2, desc:"Freezing strands ensnare the target.", dice:"1d12", status:{type:"shock",chance:0.25,turns:1}},
      {name:"Fireshield (Blue)", icon:"\ud83d\udee1\ufe0f", mp:15, levelReq:10, tier:2, desc:"+5 AC for 3 turns, chilling attackers.", buffType:"defense", buffVal:5, buffTurns:3},
      {name:"Vampiric Touch", icon:"\ud83e\uddea", mp:20, levelReq:12, tier:2, desc:"A withering grasp that drains vitality.", dice:"1d10", status:{type:"poison",chance:0.3,dmg:4,turns:3}},
      {name:"Fireball", icon:"\ud83d\udd25", mp:25, levelReq:13, tier:3, desc:"Classic D&D fireball.", dice:"2d6", status:{type:"burn",chance:0.3,dmg:3,turns:3}},
      {name:"Lightning Bolt", icon:"\u26a1", mp:30, levelReq:15, tier:3, desc:"A crackling bolt of lightning.", dice:"3d8", status:{type:"shock",chance:0.2,turns:1}},
      {name:"Haste", icon:"\ud83d\udca8", mp:22, levelReq:16, tier:3, desc:"Time quickens around you. Your strikes land harder and faster.", buffType:"haste", buffVal:6, buffTurns:3},
      {name:"Time Lag", icon:"\u26a1", mp:24, levelReq:18, tier:3, desc:"The target stumbles a half-second behind reality.", dice:"1d10", status:{type:"shock",chance:0.3,turns:1}},
      {name:"Stoneskin", icon:"\ud83d\udee1\ufe0f", mp:28, levelReq:19, tier:4, desc:"Flesh hardens to stone, shrugging off blows.", buffType:"defense", buffVal:10, buffTurns:4},
      {name:"Greater Evasion", icon:"\ud83d\udee1\ufe0f", mp:30, levelReq:21, tier:4, desc:"A deeper illusion \u2014 nearly untouchable.", buffType:"defense", buffVal:8, buffTurns:4},
      {name:"Ice Storm", icon:"\u26a1", mp:32, levelReq:22, tier:4, desc:"A driving hail of razor ice.", dice:"2d10", status:{type:"shock",chance:0.25,turns:1}},
      {name:"Mind Shatter", icon:"\ud83e\uddea", mp:30, levelReq:24, tier:4, desc:"A psychic assault that unravels the target's will.", dice:"2d8", status:{type:"poison",chance:0.4,dmg:4,turns:3}},
      {name:"Cone of Cold", icon:"\u26a1", mp:36, levelReq:25, tier:5, desc:"A blast of absolute cold.", dice:"3d8", status:{type:"shock",chance:0.3,turns:1}},
      {name:"Chaotic Surge", icon:"\ud83d\udd25", mp:38, levelReq:27, tier:5, desc:"Raw, unstable magic tears loose.", dice:"2d12", status:{type:"burn",chance:0.35,dmg:5,turns:3}},
      {name:"Sunfire", icon:"\ud83d\udd25", mp:40, levelReq:28, tier:5, desc:"A miniature sun erupts outward.", dice:"3d10", status:{type:"burn",chance:0.4,dmg:6,turns:3}},
      {name:"Mesmeric Hold", icon:"\u26a1", mp:34, levelReq:29, tier:5, desc:"The target is locked in place by force of mind.", dice:"2d10", status:{type:"shock",chance:0.4,turns:1}},
      {name:"Wondrous Recall", icon:"\ud83d\udd37", mp:10, levelReq:30, tier:6, desc:"Regain a used spell slot, drawing expended magic back into your mind.", buffType:"manaRestore", buffVal:30},
      {name:"Chain Lightning", icon:"\u26a1", mp:45, levelReq:31, tier:6, desc:"Lightning arcs from foe to foe.", dice:"4d8", status:{type:"shock",chance:0.3,turns:1}},
      {name:"Withering Fog", icon:"\ud83e\uddea", mp:42, levelReq:33, tier:6, desc:"A caustic mist that eats through armor and flesh alike.", dice:"3d10", status:{type:"poison",chance:0.5,dmg:8,turns:3}},
      {name:"Improved Haste", icon:"\ud83d\udca8", mp:35, levelReq:34, tier:6, desc:"Time bends further still.", buffType:"haste", buffVal:10, buffTurns:4},
      {name:"Finger of Death", icon:"\ud83e\uddea", mp:55, levelReq:35, tier:7, desc:"A single word that unmakes.", dice:"5d8", status:{type:"poison",chance:0.4,dmg:10,turns:3}},
      {name:"Spectral Blade", icon:"\u2728", mp:50, levelReq:37, tier:7, desc:"A conjured blade strikes with independent will.", dice:"4d10"},
      {name:"Prismatic Spray", icon:"\ud83d\udd25", mp:52, levelReq:38, tier:7, desc:"Seven rays of pure devastation.", dice:"4d12", status:{type:"burn",chance:0.4,dmg:8,turns:3}},
      {name:"Arcane Ward", icon:"\ud83d\udee1\ufe0f", mp:40, levelReq:39, tier:7, desc:"A standing ward of pre-cast protection.", buffType:"defense", buffVal:12, buffTurns:4},
      {name:"Incendiary Cloud", icon:"\ud83d\udd25", mp:60, levelReq:40, tier:8, desc:"A roiling cloud of superheated ash.", dice:"5d10", status:{type:"burn",chance:0.5,dmg:10,turns:3}},
      {name:"Sunburst", icon:"\ud83d\udd25", mp:65, levelReq:42, tier:8, desc:"Radiant fire scours the battlefield.", dice:"5d12", status:{type:"burn",chance:0.5,dmg:12,turns:3}},
      {name:"Horrid Wilting", icon:"\ud83e\uddea", mp:62, levelReq:43, tier:8, desc:"Moisture is torn from the target's very cells.", dice:"6d8", status:{type:"poison",chance:0.5,dmg:12,turns:3}},
      {name:"Planar Banish", icon:"\u26a1", mp:50, levelReq:44, tier:8, desc:"A rift briefly opens beneath the target's feet.", dice:"4d10", status:{type:"shock",chance:0.5,turns:1}},
      {name:"Black Blade of Disaster", icon:"\u2728", mp:70, levelReq:45, tier:9, desc:"A blade of pure entropy that unmakes what it touches.", dice:"6d10"},
      {name:"Meteor Swarm", icon:"\ud83d\udd25", mp:60, levelReq:47, tier:9, desc:"Ultimate destruction from the sky.", dice:"4d10", status:{type:"burn",chance:0.5,dmg:5,turns:3}},
      {name:"Wish Fulfilled", icon:"\ud83c\udf1f", mp:50, levelReq:48, tier:9, desc:"Reality bends briefly in your favor.", buffType:"fullRestore"},
      {name:"Time Stop", icon:"\u23f3", mp:80, levelReq:50, tier:9, desc:"The world freezes. You alone still move.", buffType:"timeStop"},
      {name:"Farseer's Reach", icon:"\u26a1", mp:85, levelReq:60, tier:10, desc:"Varel taught you this without meaning to \u2014 see the strike land before you throw it.", dice:"5d12", status:{type:"shock",chance:0.35,turns:1}},
      {name:"Guildbound Surge", icon:"\ud83d\udca8", mp:40, levelReq:90, tier:11, desc:"Something in you moves faster once you stop carrying everything alone.", buffType:"haste", buffVal:8, buffTurns:4},
      {name:"Muster's Call", icon:"\u26a1", mp:90, levelReq:120, tier:12, desc:"The line holds because everyone actually shows up. This is what showing up sounds like.", dice:"6d12", status:{type:"shock",chance:0.4,turns:1}},
      {name:"Kindled Resolve", icon:"\ud83d\udee1\ufe0f", mp:45, levelReq:150, tier:13, desc:"A small, steady flame that has survived worse than this.", buffType:"defense", buffVal:9, buffTurns:4},
      {name:"Threshold Whisper", icon:"\ud83d\udd37", mp:35, levelReq:180, tier:14, desc:"Something on the other side is already listening. You listen back.", buffType:"manaRestore", buffVal:35},
      {name:"Breach Strike", icon:"\ud83e\uddea", mp:100, levelReq:210, tier:15, desc:"The door opened once. This is what walked through with you.", dice:"7d12", status:{type:"poison",chance:0.4,dmg:6,turns:3}},
      {name:"Kaya Kaya", icon:"\ud83c\udf1f", mp:55, levelReq:240, tier:16, desc:"An old joke that stopped being a joke. Still means the same thing: I am glad you are here.", buffType:"fullRestore"},
      {name:"Steady Hand", icon:"\u26a1", mp:95, levelReq:260, tier:17, desc:"Line up the shot. Wait. Then wait a little longer than that.", dice:"6d14", status:{type:"shock",chance:0.45,turns:1}},
      {name:"What the Journey Kept", icon:"\u23f3", mp:110, levelReq:300, tier:18, desc:"Everyone who stayed, all the way to here. This is theirs too.", buffType:"timeStop"}
    ],
    skill:{name:"Daybreak Ward", icon:'🛡️', mp:10, effect:'ward'}},
  joel:        {role:'tank',   spell:null, skill:{name:"Guardian's Oath", icon:'⚔️', mp:0, effect:'taunt'}},
  aisyah:      {role:'melee',  spell:null, skill:{name:'Coup de Grace', icon:'💀', mp:0, mult:1.8}},
  eliz:        {role:'healer',
    spells:[
      {name:'Heal', icon:'💚', mp:10, healMult:1, levelReq:1, desc:'Restores HP to the lowest-HP ally.'},
      {name:'Well of Light', icon:'💧', mp:15, effect:'restoreMp', restoreAmt:40, levelReq:12, desc:"Restores MP to San specifically — Eliz's aura answers hers first."}
    ],
    skill:{name:'Resurrect', icon:'🌟', mp:35, effect:'revive'},
    highSkill:{name:'Cure Disease', icon:'🌿', mp:20, effect:'cleanse', levelReq:30}},
  mezstorm:    {role:'caster',
    spells:[
      {name:'Tempest Fury', icon:'🌀', mp:18, mult:1.7, levelReq:1, desc:'His core damage spell.'},
      {name:'Storm Share', icon:'🤝', mp:15, effect:'shareMp', restoreAmt:35, levelReq:12, desc:"Spends his own MP to restore an ally's."}
    ],
    skill:{name:'Thunderclap', icon:'🔊', mp:12, effect:'stun'}},
  senedra:     {role:'ranged', spell:null, skill:{name:"Hunter's Mark", icon:'🎯', mp:0, effect:'mark'}},
  zaki:        {role:'melee',  spell:null, skill:{name:'Power Strike', icon:'💥', mp:0, mult:1.5}},
  ser_aldric:  {role:'tank',   spell:null, skill:{name:'Holy Strike', icon:'✝️', mp:0, mult:1.4}},
  sister_wren: {role:'healer', spell:{name:'Blessing of Faith', icon:'🙏', mp:0, healMult:1.1}, skill:{name:'Purify', icon:'🌿', mp:0, effect:'cleanse'}},
  soel:        {role:'caster', spell:{name:"Nine Lives' Ward", icon:'🐾', mp:0, healMult:0.6}, skill:{name:'Lucky Pounce', icon:'✨', mp:0, mult:1.3}}
};
// ---------------------------------------------------------------------------
// AFFINITY BONUSES — real per-companion passive tiers ported from the codex
// project. Source game gates these behind a bond-point stat earned through
// story interactions we don't have (no dialogue-choice system here), so
// they're mapped onto player LEVEL instead — same substitution already used
// for San's spellbook and Eliz's Cure Disease. Only the highest unlocked
// tier applies (not cumulative), matching the source's own tier-replaces-tier
// design (each tier's description reads as a successor, not a stack).
// ---------------------------------------------------------------------------
const AFFINITY_TIERS = {
  aisyah:  [ {lv:40,n:'Quick Fingers',fx:{goldPct:0.10}}, {lv:70,n:'Treasure Sense',fx:{goldPct:0.15}}, {lv:100,n:"Dragon's Hoard",fx:{goldPct:0.25}}, {lv:150,n:'Silver Tongue',fx:{goldPct:0.20}}, {lv:200,n:'Golden Touch',fx:{goldPct:0.35}} ],
  senedra: [ {lv:40,n:'Eagle Eye',fx:{critPct:0.10}}, {lv:70,n:'Deadeye',fx:{critPct:0.15}}, {lv:100,n:"Storm's Arrow",fx:{critPct:0.25}}, {lv:150,n:"Hawk's Precision",fx:{critPct:0.20}}, {lv:200,n:'Perfect Shot',fx:{critPct:0.35}} ],
  zaki:    [ {lv:40,n:'Iron Discipline',fx:{def:3}}, {lv:70,n:'Battle Hardened',fx:{hpPct:0.15}}, {lv:100,n:'Immortal Wall',fx:{def:5,atk:3}}, {lv:150,n:'Unbroken Will',fx:{def:8,atk:5}}, {lv:200,n:'Legendary Blade',fx:{def:10,atk:8}} ]
};
function affinityFor(id){
  const tiers = AFFINITY_TIERS[id];
  if(!tiers) return {fx:{}, n:null};
  const lvl = level();
  const unlocked = tiers.filter(t=>lvl>=t.lv);
  return unlocked.length ? unlocked[unlocked.length-1] : {fx:{}, n:null};
}
const CRIT_BASE = 0.10; // everyone's baseline crit chance on a basic ATTACK
// ---------------------------------------------------------------------------
// GROWTH ABILITIES — one signature ability per companion, unlocked by level
// like everything else, but hidden from the UI (name/desc included) until it
// actually fires once in combat. Auto-triggers on its own condition rather
// than being player-selected. STATE.discoveredAbilities tracks what's been
// revealed; STATE.growthUsedThisBattle is a once-per-encounter flag, reset
// whenever a new boss fight starts.
// ---------------------------------------------------------------------------
const GROWTH_ABILITIES = {
  aisyah:  {id:'long_con', name:'The Long Con', levelReq:26, desc:"A perfect strike, and her hand is already in the enemy's pocket before they hit the ground. Landing a critical hit has a chance to skim bonus gold."},
  senedra: {id:'storms_mark', name:"Storm's Mark", levelReq:35, desc:"A critical hit marks the target. Her aim is good enough that San's next strike against a marked foe is guaranteed to land true."},
  zaki:    {id:'nervous_courage', name:'Nervous Courage', levelReq:15, desc:"When everyone else has fallen and it's just him and San left standing, the boy who checked his pack seventeen times finds he doesn't need to anymore. +6 ATK, +4 DEF for the rest of the fight."}
};
function kitFor(id){ return CLASS_KIT[id] || {role:'melee', spell:null, skill:null}; }
// D&D-style dice notation ("2d6") -> rolled sum. San's spellbook is ported
// straight from the real game's dice values, scaled so the whole 1d8->7d12
// range maps onto our damage economy (basic attack ~100, capstone ~1000+).
const DICE_SCALE = 26;
function rollDice(notation){
  const m = /^(\d+)d(\d+)$/.exec(notation);
  if(!m) return 0;
  const [,count,sides] = m.map(Number);
  let sum = 0;
  for(let i=0;i<count;i++) sum += 1+Math.floor(Math.random()*sides);
  return sum;
}
function encounterKey(){
  if(STATE.currentEncounter){
    const enc = STATE.currentEncounter;
    return enc.type==='regular' ? 'enc_'+enc.key : 'enc_fb_'+enc.bossId;
  }
  return currentBossId();
}
// ---------------------------------------------------------------------------
// BATTLE MUSIC — scoped to the Battle screen only, not app-wide, so it stays
// a deliberate moment rather than something you have to mute during regular
// use. Climax tracks for the story's true superbosses, a quieter/darker
// track for the personal antagonists (Robin, Jeff, the Ex-family wraiths),
// standard rotation for everything else. Autoplay only works after a real
// user gesture, which entering Battle always is (a tap), so this should
// play cleanly — the mute toggle covers browsers that are still stricter.
// ---------------------------------------------------------------------------
const CLIMAX_BOSS_IDS = new Set([20,41,94,95]);
const ANTAGONIST_BOSS_IDS = new Set([24,79,80,81,82,83,86,87]);
let battleAudioEl = null;
function pickBattleTrack(boss){
  if(!boss) return null;
  if(boss.isRegular){
    const n = (boss.id.charCodeAt(0) + boss.id.length) % 2;
    return `assets/audio/battle-standard-${n+1}.mp3`;
  }
  if(CLIMAX_BOSS_IDS.has(boss.id)) return 'assets/audio/battle-climax.mp3';
  if(ANTAGONIST_BOSS_IDS.has(boss.id)) return 'assets/audio/battle-antagonist.mp3';
  return `assets/audio/battle-standard-${(boss.id%2)+1}.mp3`;
}
function playBattleMusic(boss){
  const track = pickBattleTrack(boss);
  if(!track) return;
  if(battleAudioEl && battleAudioEl.dataset && battleAudioEl.dataset.track===track && !battleAudioEl.paused) return;
  if(battleAudioEl) battleAudioEl.pause();
  battleAudioEl = new Audio(track);
  battleAudioEl.dataset.track = track;
  battleAudioEl.loop = true;
  battleAudioEl.volume = 0.35;
  if(!STATE.musicMuted) battleAudioEl.play().catch(()=>{}); // autoplay-blocked errors are silently ignored — mute toggle covers it
}
function stopBattleMusic(){
  if(battleAudioEl){ battleAudioEl.pause(); battleAudioEl = null; }
}
function toggleMusicMute(){
  STATE.musicMuted = !STATE.musicMuted;
  save();
  if(STATE.musicMuted) stopBattleMusic();
  else { const boss = activeEncounter(); if(boss) playBattleMusic(boss); }
  go('Battle');
}
function ensureFreshBattleState(){
  if(STATE.combatLogBossId !== encounterKey()){
    STATE.combatLog = []; STATE.combatLogBossId = encounterKey(); STATE.roundPosition = 0;
    STATE.growthUsedThisBattle = {}; STATE.nervousCourageActive = false; STATE.markedBoss = false;
    playBattleMusic(activeEncounter());
  }
}
function logCombat(line){
  ensureFreshBattleState();
  STATE.combatLog.push(line);
  if(STATE.combatLog.length > 200) STATE.combatLog.shift();
}
// ---------------------------------------------------------------------------
// BOSS COUNTER-ATTACK — previously combat was one-directional (you hit the
// boss, it just sat there), which made healing spells, potions, DEFEND, and
// Temple's Resurrect all systems with nothing to actually respond to. Damage
// scales gently and caps out so it's meaningful without one-shotting anyone,
// since party max HP doesn't scale with level.
// ---------------------------------------------------------------------------
function bossAttackDamage(boss){
  return Math.round(10 + Math.min(35, (boss.id-8)*0.4));
}
// Higher-tier bosses have a real, if modest, chance to inflict disease
// alongside their hit — gives Cure Disease (Temple, Eliz's high-level skill)
// and Purify (Eliz/Wren's skill) something to actually do. Ramps in gently
// so early bosses (Bone Tyrant etc.) never inflict it.
function diseaseChance(boss){ return Math.min(0.25, Math.max(0, (boss.id-30)*0.004)); }
// Eliz (a guardian spirit) and Soel (a spiritual cat who regenerates from
// spirit flame) never actually fall — narratively unkillable. Damage still
// lands on them normally; it just can't take them below 1 HP.
const UNKILLABLE_IDS = new Set(['eliz','soel']);
function triggerCritGrowthAbility(actor){
  const lvl = level();
  if(actor.id==='aisyah' && lvl>=GROWTH_ABILITIES.aisyah.levelReq){
    const ability = GROWTH_ABILITIES.aisyah;
    if(!STATE.growthUsedThisBattle[ability.id] && Math.random() < 0.4){
      STATE.growthUsedThisBattle[ability.id] = true;
      const bonusGold = addGold(30 + Math.round(level()*0.8));
      if(!STATE.discoveredAbilities.includes(ability.id)){
        STATE.discoveredAbilities.push(ability.id);
        logCombat(`<span style="color:#e8c96a">✦ Growth ability discovered: ${ability.name}</span> — ${esc(ability.desc)}`);
      }
      logCombat(`Aisyah's hand is already in the enemy's pocket — ${bonusGold}g skimmed from the encounter.`);
    }
  }
  if(actor.id==='senedra' && lvl>=GROWTH_ABILITIES.senedra.levelReq){
    const ability = GROWTH_ABILITIES.senedra;
    if(!STATE.growthUsedThisBattle[ability.id]){
      STATE.growthUsedThisBattle[ability.id] = true;
      STATE.markedBoss = true;
      if(!STATE.discoveredAbilities.includes(ability.id)){
        STATE.discoveredAbilities.push(ability.id);
        logCombat(`<span style="color:#e8c96a">✦ Growth ability discovered: ${ability.name}</span> — ${esc(ability.desc)}`);
      }
      logCombat(`Senedra's shot marks the target — San's next strike is guaranteed to land true.`);
    }
  }
}
function checkNervousCourage(party){
  const ability = GROWTH_ABILITIES.zaki;
  if(level() < ability.levelReq || STATE.growthUsedThisBattle[ability.id]) return;
  // Eliz/Soel can't truly fall (floor at 1 HP), so they don't count toward
  // "who's still standing" — otherwise this condition would be practically
  // unreachable once they've joined, since they'd always read as alive.
  const fallable = party.filter(m => !UNKILLABLE_IDS.has(m.id));
  const aliveIds = fallable.filter(m=>{
    const hp = STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp;
    return hp>0;
  }).map(m=>m.id);
  if(aliveIds.length===2 && aliveIds.includes('san') && aliveIds.includes('zaki')){
    STATE.growthUsedThisBattle[ability.id] = true;
    STATE.nervousCourageActive = true;
    if(!STATE.discoveredAbilities.includes(ability.id)){
      STATE.discoveredAbilities.push(ability.id);
      logCombat(`<span style="color:#e8c96a">✦ Growth ability discovered: ${ability.name}</span> — ${esc(ability.desc)}`);
    }
    logCombat(`It's just Zaki and San left standing — he doesn't check his pack this time. +6 ATK, +4 DEF for the rest of the fight.`);
  }
}
// ---------------------------------------------------------------------------
// PERSONAL-ANTAGONIST TAUNTS — Robin C. (Ch.86) and Jeff (Ch.87) get their
// real taunt lines and defeat lines from the source game, since those carry
// real narrative weight for these two specifically. Not porting their exact
// HP/stats/mechanics (120k/115k HP, scripted turn-5 events) — wildly out of
// scale with this game's rebalanced curve, and disproportionate engineering
// for 2 of 49 bosses. Robin's "bound by fine print" flavor reuses the
// existing disease system instead of a new freeze mechanic.
// ---------------------------------------------------------------------------
const BOSS_TAUNTS = {
  86: { // Robin C.
    taunts: [
      "I can't break the retainer.",
      "Are you working, or are you on your phone?",
      "Everyone's replaceable. That's just how the firm works.",
      "You should be grateful for the opportunity, honestly.",
      "I don't recall approving overtime for complaining.",
      "This conversation isn't billable. Get back to it.",
      "I built this practice. You just worked in it.",
      "Loyalty is nice. It doesn't show up on a balance sheet.",
      "You'll thank me for this someday. Probably not today."
    ],
    diseaseFlavor: "bound by fine print",
    defeatLine: "Robin goes down mid-sentence, and the ledger San has been carrying since the old world finally closes. Nine years for a hundred dollars was never a fair trade — this one is."
  },
  87: { // Jeff, the SK Son-in-Law
    taunts: [
      "No more MC, or I'm not renewing your contract.",
      "Joel, your performance now is bad.",
      "Joel talked up during the meeting, is he stupid?",
      "Nothing to do? Go clean the forest.",
      "I'm the boss here. You will do as I say.",
      "Your stepfather ruined my reputation. I still want that public apology.",
      "The public apology is normal in Singapore."
    ],
    diseaseFlavor: null,
    defeatLine: "He goes down still talking, mid-sentence, the way men like him always do — certain right up until the certainty runs out. Joel does not say anything for a while afterward. He does not need to. His shoulders, for once, are perfectly still."
  }
};
function bossCounterAttack(boss){
  const hp = activeEncounterHp(boss);
  if(hp<=0) return; // boss just died to the player's action — no counter
  if(STATE.timeStopTurns > 0){
    STATE.timeStopTurns--;
    logCombat(`Time holds still — ${esc(boss.name)} cannot act.`);
    return;
  }
  const party = getActiveParty().filter(m=>{
    const h = STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp;
    return h>0;
  });
  if(!party.length) return; // whole party down — nothing left to hit
  const target = party[Math.floor(Math.random()*party.length)];
  let dmg = bossAttackDamage(boss);
  const t = trinketBonus(target.id);
  if(t && t.defPct) dmg = Math.round(dmg*(1-t.defPct));
  if(target.id==='zaki'){
    let defVal = affinityFor('zaki').fx.def || 0;
    if(STATE.nervousCourageActive) defVal += 4;
    dmg = Math.max(1, dmg - defVal);
  }
  if(STATE.shieldTurns > 0){ dmg = Math.round(dmg*(1-STATE.shieldPct)); STATE.shieldTurns--; }
  if(STATE.defending[target.id]){ dmg = Math.round(dmg*0.5); delete STATE.defending[target.id]; }
  const cur = STATE.partyHp[target.id]!=null?STATE.partyHp[target.id]:target.hp;
  const floor = UNKILLABLE_IDS.has(target.id) ? 1 : 0;
  const next = Math.max(floor, cur-dmg);
  STATE.partyHp[target.id] = next;
  let diseaseNote = '';
  if(next>0 && !STATE.partyStatus[target.id] && Math.random() < diseaseChance(boss)){
    STATE.partyStatus[target.id] = 'diseased';
    const bt = BOSS_TAUNTS[boss.id];
    const flavor = (bt && bt.diseaseFlavor) ? bt.diseaseFlavor : 'fallen ill';
    diseaseNote = ` <span style="color:#a8d98a">${esc(target.name)} is ${esc(flavor)}.</span>`;
  }
  const taunt = BOSS_TAUNTS[boss.id];
  const taunterLine = taunt && Math.random() < 0.5 ? `<div style="color:#c9a3a3;font-style:italic;margin-top:2px">"${esc(taunt.taunts[Math.floor(Math.random()*taunt.taunts.length)])}"</div>` : '';
  logCombat(`${esc(boss.name)} strikes ${esc(target.name)} for ${dmg} damage.${next===0?` <span style="color:#e08a8a">${esc(target.name)} has fallen.</span>`:diseaseNote}${taunterLine}`);
  checkNervousCourage(getActiveParty());
}
function advanceTurnSkippingFallen(party){
  let next = (STATE.turn+1)%Math.max(1,party.length);
  let checked = 0;
  while(checked < party.length){
    const m = party[next];
    const hp = m && (STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp);
    if(!m || hp>0) break;
    next = (next+1)%party.length;
    checked++;
  }
  STATE.turn = next;
}
// Call this whenever a party member's turn ends (attack, spell, skill,
// defend, or a potion). The boss only gets to counter-attack once every
// party member has gone, not once per individual action — previously it
// fired after every single action, so a full party meant the boss attacked
// 5-9 times before your own next turn came around, easily dropping several
// members in one round. One attack per round matches how a normal turn-based
// fight should feel.
function endTurn(boss, party){
  STATE.roundPosition++;
  if(STATE.roundPosition >= party.length){
    STATE.roundPosition = 0;
    bossCounterAttack(boss);
  }
  save();
  advanceTurnSkippingFallen(party);
  setTimeout(()=>go('Battle'),250);
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
// ---------------------------------------------------------------------------
// EQUIPMENT — one trinket slot per party member. Rather than inventing a
// whole gear system with separate weapon/armor/loot tables, boss trophies
// double as equippable trinkets: equip one for a modest passive bonus keyed
// to the same icon category already used for loot flavor, so a frost trophy
// makes you tankier and a fire trophy hits harder, etc. Equipping moves the
// trophy out of the general inventory (so it can't also be spent on
// crafting) — unequip to get it back.
// ---------------------------------------------------------------------------
const TRINKET_BONUS = {
  '💀':{dmgPct:0.08, label:'+8% damage'}, '🔥':{dmgPct:0.10, label:'+10% damage'},
  '❄️':{defPct:0.12, label:'-12% damage taken'}, '⚡':{spellPct:0.10, label:'+10% spell damage'},
  '🌑':{skillPct:0.10, label:'+10% skill damage'}, '🪞':{mpBonus:15, label:'+15 max MP'},
  '🌊':{hpBonus:15, label:'+15 max HP'}, '✨':{healPct:0.15, label:'+15% healing'},
  '🐉':{dmgPct:0.12, label:'+12% damage'}, '⚙️':{dmgPct:0.05, defPct:0.05, label:'+5% damage, -5% damage taken'},
  '🌌':{spellPct:0.12, label:'+12% spell damage'}, '👑':{dmgPct:0.10, label:'+10% damage'},
  '☀️':{dmgPct:0.10, defPct:0.10, label:'+10% damage, -10% damage taken'}, '🌗':{dmgPct:0.08, label:'+8% damage'}
};
function trinketBonus(memberId){
  const trophy = STATE.equippedTrophies[memberId];
  if(!trophy) return null;
  return TRINKET_BONUS[trophy.icon] || null;
}
function effectiveMaxHp(m){ const t=trinketBonus(m.id); return m.hp + (t&&t.hpBonus?t.hpBonus:0); }
function effectiveMaxMp(m){ const t=trinketBonus(m.id); return m.mp + (t&&t.mpBonus?t.mpBonus:0); }
function equipTrophy(memberId, invIndex){
  const item = STATE.inventory[invIndex];
  if(!item) return;
  unequipTrophy(memberId); // return whatever they had equipped before, if anything
  STATE.inventory.splice(invIndex,1);
  STATE.equipped[memberId] = item.id;
  if(!STATE.equippedTrophies) STATE.equippedTrophies = {};
  STATE.equippedTrophies[memberId] = item;
  save();
  toast(`${item.icon} ${item.name} equipped on ${ALL_PARTY.find(m=>m.id===memberId).name}`);
  go('Inventory');
}
function unequipTrophy(memberId){
  const trophy = STATE.equippedTrophies && STATE.equippedTrophies[memberId];
  if(trophy) STATE.inventory.push(trophy);
  delete STATE.equipped[memberId];
  if(STATE.equippedTrophies) delete STATE.equippedTrophies[memberId];
  save();
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
function go(name){if(name!=='Battle'){clearAutoActTimer();STATE.battleItemMenuOpen=false;stopBattleMusic();}document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.name===name));render(name);window.scrollTo({top:0,behavior:'smooth'})}

function render(name){refreshTopbar();document.querySelectorAll('.soel').forEach(e=>e.remove());let body='';if(name==='Dashboard')body=dashboard();if(name==='Journal')body=journalScreen();if(name==='Quests')body=questsScreen();if(name==='Party')body=partyScreen();if(name==='Spellbook')body=spellbookScreen();if(name==='Inventory')body=inventoryScreen();if(name==='Codex')body=codexScreen();if(name==='Battle')body=battleScreen();if(name==='Temple')body=templeScreen();if(name==='Frontier')body=frontierScreen();if(name==='Guild')body=guildScreen();main.innerHTML=topbar.outerHTML+body+`<div id="toast" class="toast"></div>`;if(name!=='Battle'){const soel=document.createElement('div');soel.className='soel';const soelUnlocked=level()>=10;soel.innerHTML=soelUnlocked?`<img src="${soelSrc}"><div class="lock" style="border-color:#68b58b"><b>SOEL</b><small>AWAKENED ✧<br/>In your active party</small></div>`:`<img src="${soelSrc}"><div class="lock"><b>SOEL</b><small>LOCKED<br/>Awakens at Level 10 🔒</small></div>`;document.querySelector('.app').appendChild(soel)}bind();if(name==='Battle'){const cl=document.getElementById('combatLog');if(cl)cl.scrollTop=cl.scrollHeight;}}

function bind(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>openChapter(Number(b.dataset.read)));
  document.querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>window.open(`reader.html?ch=${b.dataset.preview}`,'_blank'));
  document.querySelectorAll('[data-quest]').forEach(b=>b.onclick=()=>handleQuest(b.dataset.quest));
  document.querySelectorAll('[data-battle-action]').forEach(b=>b.onclick=()=>battleAction(b.dataset.battleAction));
  document.querySelectorAll('[data-journal-page]').forEach(b=>b.onclick=()=>{STATE.journalPage=Number(b.dataset.journalPage);go('Journal');});
}

function nextMilestones(){
  const candidates = [];
  if(level() < 10) candidates.push({icon:'🐾', label:'LEVEL 10', sub:'Soel awakens', dist: 10-level()});
  if(!frontierUnlocked()) candidates.push({icon:'🌌', label:`CHAPTER 20`, sub:'The Fraying Frontier opens', dist: 20-STATE.completed});
  if(!templeUnlocked()) candidates.push({icon:'⛪', label:`CHAPTER 74`, sub:"Sister Wren's Temple opens", dist: 74-STATE.completed});
  const nb = bossFor(currentBossId());
  if(nb && STATE.completed < nb.id) candidates.push({icon:'☠', label:`CHAPTER ${nb.id}`, sub:esc(nb.name), dist: nb.id-STATE.completed});
  candidates.sort((a,b)=>a.dist-b.dist);
  const top = candidates.slice(0,3);
  if(!top.length) top.push({icon:'✧', label:'JOURNEY', sub:'All known milestones reached'});
  return top.map(m=>`<div class="item"><div class="mini-ico">${m.icon}</div><div><b>${m.label}</b><small>${m.sub}</small></div></div>`).join('');
}
function dashboard(){
  const c = chapterData[Math.min(STATE.completed, chapterData.length-1)];
  const nextIsBoss = c && c.boss && STATE.completed < chapterData.length;
  const party = getActiveParty();
  return `<div class="objective"><div><div class="eyebrow">CURRENT OBJECTIVE</div><p>${nextIsBoss?`Face ${c.bossName||c.title} in Chapter ${c.id}.`:`Read Chapter ${c.id}: ${esc(c.title)}`}</p></div><button class="outline" data-go="Quests">◇ VIEW QUESTS</button></div><div class="hero"><img src="${c.thumb||chapterCover}" alt="Daybreak journey"><div class="hero-copy"><div class="hero-badge">CURRENT CHAPTER · ${STATE.completed+1} OF ${chapterData.length}</div><h2>CHAPTER ${c.id} · ${esc(c.title).toUpperCase()}</h2><p>${c.summary?esc(c.summary):'The story continues.'}</p></div></div><div class="grid2"><div class="card"><h3>CURRENT JOURNEY</h3><div class="journey"><div class="book"><img src="${c.thumb||chapterCover}" alt="chapter"></div><div><div class="chapter">Chapter ${c.id}</div><div style="font-family:Cinzel;font-size:17px;color:#c68cf3">${esc(c.title)}</div><div class="sub">${c.summary?esc(c.summary):(nextIsBoss?'Major encounter.':'Story archive chapter.')}</div></div></div><button class="cta" data-read="${c.id}">${nextIsBoss?'VIEW ENCOUNTER':'CONTINUE CHAPTER'} ›</button><div class="progressline"><div class="row"><span>JOURNAL PROGRESS</span><span>${STATE.completed} / ${chapterData.length}</span></div><div class="bar"><div class="fill" style="width:${STATE.completed/chapterData.length*100}%"></div></div></div></div><div class="card"><h3>TRAVELLING PARTY</h3><div class="party">${party.map(m=>`<div class="member"><div class="portrait"><img src="${m.portrait}" alt="${m.name}"></div><div class="name">${m.name}</div><div class="role">${m.role}</div><div class="lv">Lv. ${level()}</div></div>`).join('')}<button class="outline" data-go="Party">♟ VIEW PARTY</button></div></div></div><div class="lower"><div class="card milestones"><h3>NEXT MILESTONES</h3>${nextMilestones()}</div><div class="card"><h3>SEASON PROGRESS</h3><div class="sub">Story XP <b style="float:right;color:#eee">${STATE.xp.toLocaleString()}</b></div><div class="bar"><div class="fill" style="width:${Math.min(100,(STATE.xp-xpThreshold(level()-1))/Math.max(1,xpThreshold(level())-xpThreshold(level()-1))*100)}%"></div></div><div class="sub">Chapters Completed <b style="float:right;color:#eee">${STATE.completed} / ${chapterData.length}</b></div><div class="bar"><div class="fill" style="width:${STATE.completed/chapterData.length*100}%"></div></div></div><div class="card events"><h3>RECENT EVENTS</h3><div class="item"><div class="mini-ico">▤</div><div><b>Chapter ${Math.max(1,STATE.completed)} ${STATE.completed?'Completed':'Unlocked'}</b><small>${esc(chapterData[Math.max(0,STATE.completed-1)].title)}</small></div></div><div class="item"><div class="mini-ico">⚔</div><div><b>${bossFor(currentBossId())?bossFor(currentBossId()).name:'Bone Tyrant'}</b><small>${nextIsBoss?'Battle available':'Next major encounter'}</small></div></div></div></div><div class="quick"><div class="eyebrow" style="text-align:center">QUICK ACTIONS</div><div class="quick-grid"><button data-go="Journal">▤ JOURNAL</button><button data-go="Quests">⚑ QUESTS</button><button data-go="Inventory">♙ INVENTORY</button><button data-go="Spellbook">✧ SPELLBOOK</button><button data-go="Battle">⚔ BATTLE</button><button data-go="Temple">⛪ TEMPLE</button><button data-go="Frontier">🌌 FRONTIER</button></div></div>`;
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
        ? `<button class="small-btn primary" data-read="${c.id}">${done?'READ AGAIN ⚔':'READ CHAPTER ⚔'}</button>`
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
  const pagesHTML = c.pages.length
    ? c.pages.map(p=>`<img src="${p}" alt="${esc(c.title)} page">`).join('')
    : `<div style="padding:40px 20px;text-align:center;color:#8f7aa8;font-family:Cinzel;border:1px dashed #453a5c;border-radius:10px">📖 Comic artwork not yet drawn for this chapter — read the journal scenes below.</div>`;
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
  const gold = addGold(Math.round(goldReward(c)*0.4));
  const reward = addXp(xpForChapter(c));
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
    `<div class="party-list">${active.map(m=>{const curHp=STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp;const diseased=STATE.partyStatus[m.id]==='diseased';const fallen=curHp<=0;return `<article class="party-row"><div class="portrait large"><img src="${m.portrait}" alt="${m.name}"></div><h3>${m.name}${diseased?' 🤢':''}${fallen?' ⚰️':''}</h3><div class="role">${m.role}</div><div class="hp">Level ${level()} · ${curHp} / ${m.hp} HP${fallen?' · FALLEN':diseased?' · DISEASED':''}</div></article>`;}).join('')}</div>`+
    (locked.length?`<h3 style="font-family:Cinzel;color:#8f7aa8;margin:22px 0 10px;font-size:15px">NOT YET JOINED</h3><div class="party-list">${locked.map(m=>`<article class="party-row" style="opacity:.5"><div class="portrait large"><img src="${m.portrait}" alt="${m.name}"></div><h3>${m.name}</h3><div class="role">${m.role}</div><div class="hp">${m.joinLevel?`Awakens at Level ${m.joinLevel} (currently Lv.${level()})`:`Joins at Chapter ${m.joinChapter}`}</div></article>`).join('')}</div>`:''),
    navButton('Dashboard'));
}
function spellbookScreen(){
  const lvl = level();
  const rows = ALL_PARTY.filter(m=>STATE.completed >= m.joinChapter).map(m=>{
    const kit = kitFor(m.id);
    const entries = [];
    if(kit.spells){
      kit.spells.forEach(s=>{
        const unlocked = lvl >= s.levelReq;
        entries.push({name:s.name, icon:s.icon, mp:s.mp, note: unlocked?(s.desc||'Spell'):`Unlocks at Level ${s.levelReq} (currently Lv.${lvl})`, locked:!unlocked});
      });
    } else if(kit.spell) entries.push({name:kit.spell.name, icon:kit.spell.icon, mp:kit.spell.mp, note: kit.spell.healMult?'Restores HP to the lowest-HP ally':'Damaging spell'});
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

  const equippedList = Object.entries(STATE.equippedTrophies);
  const equipHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">💍 EQUIPMENT</h3><p class="lead" style="margin-bottom:10px">One trinket slot per party member — equip a trophy for a passive combat bonus.</p><div class="chapter-grid">${getActiveParty().map(m=>{const t=STATE.equippedTrophies[m.id];const bonus=t?TRINKET_BONUS[t.icon]:null;return `<article class="quest"><div class="mini-ico">${t?t.icon:'—'}</div><div><h3>${esc(m.name)}</h3><p>${t?`${esc(t.name)} · ${bonus?bonus.label:''}`:'No trinket equipped'}</p></div>${t?`<button class="small-btn" onclick="unequipTrophy('${m.id}');go('Inventory')">UNEQUIP</button>`:''}</article>`;}).join('')}</div>`;

  const trophies = STATE.inventory.length
    ? `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">BOSS TROPHIES</h3><p class="lead" style="margin-bottom:14px">Earned by defeating story bosses. Spend these on crafting, or equip on a party member above.</p><div class="chapter-grid">${STATE.inventory.map((item,i)=>{const bonus=TRINKET_BONUS[item.icon];return `<article class="quest"><div class="mini-ico">${item.icon}</div><div><h3>${esc(item.name)}</h3><p>${esc(item.desc)}${bonus?` · ${bonus.label}`:''}</p></div><select class="small-btn" onchange="equipTrophy(this.value,${i})" style="cursor:pointer"><option value="">Equip on…</option>${getActiveParty().map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join('')}</select></article>`;}).join('')}</div>`
    : `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">BOSS TROPHIES</h3><p class="lead">None yet — defeat a boss in Battle to earn your first trophy.</p>`;
  const supplies = `<h3 style="font-family:Cinzel;color:#8f7aa8;margin:22px 0 4px;font-size:15px">STARTING SUPPLIES</h3><div class="chapter-grid">${['Minor Healing Tonic','Aether Shard','Waystone Fragment','Tomb Key','Antique Coin'].map((x,i)=>`<article class="quest"><div class="mini-ico">${['✚','◆','◇','⚿','◈'][i]}</div><div><h3>${x}</h3><p>Carried by the travelling party.</p></div><b>x${i+1}</b></article>`).join('')}</div>`;
  return panel('Inventory','CARRIED ITEMS', potionsHTML+traderHTML+craftHTML+equipHTML+trophies+supplies, navButton('Dashboard'));
}
function codexScreen(){
  const defeated = BOSS_CHAPTERS.filter(b => STATE.completed >= b.id);
  const nextBoss = bossFor(currentBossId());
  const bossHTML = defeated.length
    ? `<div class="chapter-grid">${defeated.map(b=>{const c=chapterData.find(ch=>ch.id===b.id);return `<article class="quest"><div class="mini-ico">☠</div><div><h3>${esc(b.name)}</h3><p>Defeated in Chapter ${b.id}: ${esc(c.title)}.</p></div></article>`;}).join('')}${nextBoss?`<article class="quest" style="opacity:.5"><div class="mini-ico">?</div><div><h3>???</h3><p>An unencountered foe awaits in Chapter ${nextBoss.id}.</p></div></article>`:''}</div>`
    : `<p class="lead">No bosses encountered yet — the bestiary fills in as you defeat them in Battle.</p>`;

  const active = getActiveParty();
  const companionHTML = `<div class="chapter-grid">${active.map(m=>{const kit=kitFor(m.id);const move=kit.spell?kit.spell.name:kit.skill?kit.skill.name:'—';return `<article class="quest"><div class="mini-ico">${m.id==='soel'?'🐾':'♟'}</div><div><h3>${esc(m.name)}</h3><p>${esc(m.role)} · Signature: ${esc(move)}</p></div></article>`;}).join('')}</div>`;

  const worldHTML = `<div class="chapter-grid">${['Aethon','Daybreak','Tomb of Kings'].map((x,i)=>`<article class="quest"><div class="mini-ico">${['✦','☼','♜'][i]}</div><div><h3>${x}</h3><p>World entry revealed through the Season One story.</p></div></article>`).join('')}</div>`;

  return panel('Codex','WORLD & LORE',
    `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:18px">☠ BESTIARY · ${defeated.length}/${BOSS_CHAPTERS.length} ENCOUNTERED</h3>${bossHTML}`+
    `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">♟ COMPANIONS</h3>${companionHTML}`+
    `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">✦ WORLD</h3>${worldHTML}`,
    navButton('Dashboard'));
}

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
// ---------------------------------------------------------------------------
// EXPLORATION ZONES — using the actual zone names your story establishes via
// its own "Unlocks: zone →" banners (The Static Fields at Ch.61, The
// Unbroken Vale at Ch.72) rather than inventing new ones, plus early zones
// matching locations already named in Chapters 1-23. The Fraying Frontier
// stays the special postgame zone (Ch.20+) with the boss-rematch mechanic;
// the others are straightforward regular-encounter grinding spots.
// ---------------------------------------------------------------------------
const ZONES = [
  {id:'catacombs', name:'The Cursed Catacombs', icon:'⚰️', unlockChapter:1,
    regulars:[
      {id:'cat_wight', name:'Restless Wight', icon:'💀', hp:180, xp:60, gold:12, desc:'One of the Bone Tyrant\'s lesser dead.'},
      {id:'cat_swarm', name:'Grave Swarm', icon:'🦟', hp:140, xp:45, gold:9, desc:'Insects that never left when the tombs sealed.'},
      {id:'cat_warden', name:'Catacomb Warden', icon:'🗿', hp:260, xp:90, gold:18, desc:'Stone given purpose by something old.'}
    ]},
  {id:'frostspire', name:'Frostspire Ruins', icon:'🏔️', unlockChapter:9,
    regulars:[
      {id:'fs_wolf', name:'Frostspire Wolf', icon:'🐺', hp:320, xp:110, gold:22, desc:'Hunts in the shadow of the frozen crown.'},
      {id:'fs_wisp', name:'Rime Wisp', icon:'❄️', hp:260, xp:95, gold:18, desc:'Cold given just enough shape to move.'},
      {id:'fs_knight', name:'Frozen Sentinel', icon:'🧊', hp:420, xp:150, gold:30, desc:'Stood guard so long it forgot to stop.'}
    ]},
  {id:'ashfall', name:'Ashfall Market', icon:'🏚️', unlockChapter:23,
    regulars:[
      {id:'am_scavenger', name:'Market Scavenger', icon:'🥀', hp:380, xp:130, gold:35, desc:'Picks through what Ashfall Market left behind.'},
      {id:'am_debtor', name:'Restless Debtor', icon:'📜', hp:340, xp:120, gold:32, desc:'Still keeping ledgers no one will collect.'},
      {id:'am_broker', name:'Shadow Broker', icon:'🕴️', hp:520, xp:180, gold:48, desc:'Trades in things that were never for sale.'}
    ]},
  {id:'static_fields', name:'The Static Fields', icon:'📡', unlockChapter:61,
    regulars:[
      {id:'sf_signal', name:'Dead Signal', icon:'📶', hp:600, xp:220, gold:60, desc:'A transmission that never found its receiver.'},
      {id:'sf_drone', name:'Salvage Drone', icon:'🤖', hp:680, xp:250, gold:68, desc:'Still running the last order it was given.'},
      {id:'sf_storm', name:'Static Wraith', icon:'⚡', hp:760, xp:280, gold:76, desc:'Interference that learned to hold a shape.'}
    ]},
  {id:'unbroken_vale', name:'The Unbroken Vale', icon:'🌾', unlockChapter:72,
    regulars:[
      {id:'uv_warden', name:'Vale Warden', icon:'🌳', hp:820, xp:300, gold:82, desc:'What\'s left standing after everything else broke.'},
      {id:'uv_echo', name:'Wandering Echo', icon:'🪞', hp:760, xp:280, gold:76, desc:'A memory that kept walking after the story moved on.'},
      {id:'uv_keeper', name:'Threshold Keeper', icon:'🚪', hp:900, xp:330, gold:90, desc:'Minds the border the Vale was built to hold.'}
    ]},
  {id:'fraying_frontier', name:'The Fraying Frontier', icon:'🌌', unlockChapter:20, hasBossRematch:true,
    regulars: null // uses FRONTIER_REGULARS + the boss-rematch section below, kept as-is
  }
];
function zoneUnlocked(z){ return STATE.completed >= z.unlockChapter; }
function frontierUnlocked(){ return zoneUnlocked(ZONES.find(z=>z.id==='fraying_frontier')); }
function zoneScreenHTML(zone){
  if(zone.id==='fraying_frontier') return frontierZoneHTML();
  return `<div class="chapter-grid">${zone.regulars.map(e=>`<article class="quest"><div class="mini-ico">${e.icon}</div><div><h3>${esc(e.name)}</h3><p>${esc(e.desc)}</p><b>${e.hp} HP · ${e.xp} XP · ${e.gold}g</b></div><button class="small-btn primary" onclick="startRegularEncounter('${zone.id}','${e.id}')">FIGHT</button></article>`).join('')}</div>`;
}

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
function frontierZoneHTML(){
  const bossId = ensureFrontierBoss();
  const boss = bossId ? bossFor(bossId) : null;
  let html = `<p class="lead">High-level encounters roam here between the delayed return of bosses you've already faced. Regular fights and boss rematches grant XP and gold only — no loot duplication.</p>`;
  html += `<h3 style="font-family:Cinzel;color:#c99aff;margin:18px 0 4px;font-size:16px">⚔️ REGULAR ENCOUNTERS</h3><div class="chapter-grid">`;
  FRONTIER_REGULARS.forEach(e=>{
    html += `<article class="quest"><div class="mini-ico">${e.icon}</div><div><h3>${esc(e.name)}</h3><p>${esc(e.desc)}</p><b>${e.hp} HP · ${e.xp} XP · ${e.gold}g</b></div><button class="small-btn primary" onclick="startRegularEncounter('fraying_frontier','${e.id}')">FIGHT</button></article>`;
  });
  html += `</div>`;
  if(boss){
    html += `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:16px">👑 A BOSS HAS RETURNED</h3><div class="chapter-grid"><article class="quest"><div class="mini-ico">☠</div><div><h3>${esc(boss.name)}</h3><p>An earlier foe, drawn back through the Frontier.</p><b>${boss.hp.toLocaleString()} HP · ${bossReward(chapterData.find(c=>c.id===boss.id)).toLocaleString()} XP · ${goldReward(chapterData.find(c=>c.id===boss.id))}g</b></div><button class="small-btn primary" onclick="startFrontierBossEncounter()">FIGHT</button></article></div>`;
  } else {
    const remaining = Math.max(0, STATE.frontierBossCooldownUntil - Date.now());
    const mins = Math.ceil(remaining/60000);
    html += `<div class="locked-banner" style="margin-top:18px">🕰️ No boss present right now — the last one was defeated. Another will drift back through the Frontier in roughly ${mins} minute${mins===1?'':'s'}.</div>`;
  }
  return html;
}
// ---------------------------------------------------------------------------
// GUILD — real rank system ported from the codex project (10 tiers, lifetime
// reputation, genuine passive bonuses to gold/XP/crit). Guild Contracts are
// adapted rather than copied: the source's 27 contracts target a mix of
// generic isekai monsters and its own story bosses, most of which don't
// exist here — so contracts are generated from OUR actual boss list and
// Frontier regulars instead, refreshing weekly like the source, level-gated
// so early contracts don't show up once you've outgrown them.
// ---------------------------------------------------------------------------
const GUILD_RANKS = [
  {rank:1, name:'Guild Initiate', repReq:0, desc:'Joined the Guild. The Contract Board is open to you.'},
  {rank:2, name:'Guild Associate', repReq:150, desc:'+5% gold from every victory.', goldBonus:0.05},
  {rank:3, name:'Guild Adventurer', repReq:500, desc:'+5% XP from every victory.', xpBonus:0.05},
  {rank:4, name:'Guild Veteran', repReq:1200, desc:'Another +5% gold and +5% XP.', goldBonus:0.05, xpBonus:0.05},
  {rank:5, name:'Guild Champion', repReq:2500, desc:'+5% crit chance in combat.', critBonus:0.05},
  {rank:6, name:'Guildmaster', repReq:5000, desc:'Another +10% gold and +10% XP.', goldBonus:0.10, xpBonus:0.10},
  {rank:7, name:'Guild Legend', repReq:10000, desc:'The kind of reputation that outlasts the person who earned it. Another +10% gold.', goldBonus:0.10},
  {rank:8, name:'Guild Paragon', repReq:20000, desc:'Another +10% XP and +5% crit chance.', xpBonus:0.10, critBonus:0.05},
  {rank:9, name:'Guild Mythic', repReq:40000, desc:'Another +15% gold and +15% XP.', goldBonus:0.15, xpBonus:0.15},
  {rank:10, name:'Guild Eternal', repReq:75000, desc:'The Guild has nothing left to teach you. Another +5% crit chance.', critBonus:0.05}
];
function guildRankInfo(){
  const rep = STATE.guildRep || 0;
  let current = GUILD_RANKS[0], next = GUILD_RANKS[1] || null;
  for(let i=0;i<GUILD_RANKS.length;i++){
    if(rep >= GUILD_RANKS[i].repReq){ current = GUILD_RANKS[i]; next = GUILD_RANKS[i+1] || null; }
  }
  return {current, next};
}
function guildBonus(type){
  const {current} = guildRankInfo();
  let total = 0;
  for(const r of GUILD_RANKS){
    if((STATE.guildRep||0) >= r.repReq){
      if(type==='gold' && r.goldBonus) total += r.goldBonus;
      if(type==='xp' && r.xpBonus) total += r.xpBonus;
      if(type==='crit' && r.critBonus) total += r.critBonus;
    }
  }
  return total;
}
function addGuildRep(amount){
  STATE.guildRep = (STATE.guildRep||0) + amount;
  STATE.guildRepBalance = (STATE.guildRepBalance||0) + amount;
}
function guildWeekKey(){
  const d = new Date();
  const onejan = new Date(d.getFullYear(),0,1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
  return `${d.getFullYear()}-W${week}`;
}
function guildContractPool(){
  const pool = [];
  BOSS_CHAPTERS.forEach(b=>{
    pool.push({id:'gc_boss_'+b.id, type:'boss', target:b.id, name:'Contract: '+b.name,
      desc:`Defeat ${b.name} for the Guild.`, rw:{xp:bossReward(chapterData.find(c=>c.id===b.id))*2, gold:goldReward(chapterData.find(c=>c.id===b.id))*2, rep:80+b.id*4}});
  });
  FRONTIER_REGULARS.forEach(e=>{
    pool.push({id:'gc_kill_'+e.id, type:'frontier_kill', target:e.id, name:e.name+' Purge',
      desc:`Defeat 5 ${e.name} for the Guild.`, need:5, rw:{xp:e.xp*4, gold:e.gold*4, rep:60}});
  });
  return pool;
}
function refreshGuildContracts(){
  const wk = guildWeekKey();
  if(STATE.guildContractWeek === wk && STATE.guildContracts.length) return;
  const eligible = guildContractPool().filter(c=>{
    if(c.type==='boss') return STATE.completed >= c.target - 8; // roughly reachable soon or already
    return true;
  });
  const shuffled = eligible.map(c=>({...c,c:0,done:false})).sort(()=>Math.random()-0.5);
  STATE.guildContracts = shuffled.slice(0, Math.min(4, shuffled.length));
  STATE.guildContractWeek = wk;
  save();
}
function checkGuildContractProgress(type, target, amount){
  refreshGuildContracts();
  STATE.guildContracts.forEach(c=>{
    if(c.done || c.type!==type) return;
    if(type==='frontier_kill' && c.target!==target) return;
    if(type==='boss' && c.target!==target) return;
    c.c = Math.min(c.need||1, (c.c||0)+amount);
    if(c.c >= (c.need||1)){
      c.done = true;
      addXp(c.rw.xp);
      const goldAdded = addGold(c.rw.gold);
      addGuildRep(c.rw.rep);
      save();
      toast(`🏛️ Guild Contract complete: ${c.name} · +${c.rw.xp} XP · +${goldAdded}g · +${c.rw.rep} Rep`);
    }
  });
}
// ---------------------------------------------------------------------------
// VISION MACHINE — Varel Farseer's window. Ported faithfully, not adapted:
// the exact vignette text, cost, once-per-day limit, and Joel's letter
// mechanic from your own project, since this is your own established
// writing about San's real parents. Unlocks after Chapter 95 ("The First
// Vision"), where Varel and the machine are actually introduced.
// ---------------------------------------------------------------------------
const VISION_MACHINE_COST = 1000000;
const VISION_VIGNETTES = [
  "Your mother is in the kitchen, mid-afternoon light through the curtain, humming something you cannot quite place. She sets the kettle down and does not look toward the window. She has no reason to.",
  "Your father is asleep in the good chair, a blanket someone else must have draped over him, the television on low with the sound turned down further than it needs to be. He looks tired. He also looks, for now, at rest.",
  "Both your parents are on the porch, not talking, just sitting the way people do after decades of not needing to fill every silence. Your mother is peeling something into a bowl. Your father is watching her do it.",
  "Your mother is on the phone, laughing at something, one hand braced on the counter. You cannot hear who she is talking to. You decide, for tonight, that it does not matter — only that she is laughing.",
  "Your father is slower getting up from the chair than he used to be. He makes it anyway, unhurried, and pauses to steady himself against the doorframe for exactly as long as he needs to, then keeps going.",
  "Your mother is fussing over a pot that clearly does not need fussing over, the exact same way she always has, muttering at it under her breath like it might argue back.",
  "One of your cousins is there too, sitting across from your mother at the small table, the two of them going through something — bills, maybe, or nothing important at all. You cannot tell which, and for once it is a relief not to know.",
  "Your father is in the garden, crouched slower than he used to crouch, tending something green that is doing better than it has any right to. He straightens up, presses a hand to his back, and keeps going anyway.",
  "The house is quiet, mid-morning, nobody visibly in frame — just light through familiar windows, a ceiling fan turning, a kettle steaming on the stove that someone will come back for in a moment. Ordinary. Undramatic. Still standing.",
  "Your mother is folding laundry on the bed, the same unhurried rhythm she has always folded laundry in, and for just a moment she pauses, mid-fold, and looks toward the window — and you will never know if she felt anything at all, or if it was nothing, just a mother pausing in an ordinary afternoon.",
  "An old friend of your father's has stopped by — someone from the old sales days, still telling the same stories he always told, still making your father laugh at the parts he has heard a hundred times already. Some friendships, apparently, never needed an occasion.",
  "The window catches on someone you did not expect — Jeff's wife, though she does not carry that name anymore, laughing at something across a table with someone new. Someone who is actually looking at her children, not past them. She found out about all of it eventually, you learn, and it was not even the first time. She simply decided, finally, that she did not have to keep choosing him. Some doors, it turns out, were always hers to close."
];
const JOEL_LETTER_REPLIES = [
  "The window holds a moment longer than usual. Something comes back through with it this time — his mother's handwriting, familiar even distorted through whatever this is. \"I keep them all,\" it says. \"Every one. I do not need you to come home to know you are still my son.\"",
  "A reply, brief, unmistakably hers: \"Your daughter asked about you today. I told her the truth — that you are far away, and that you write, and that far away has never once meant gone.\"",
  "This time something answers: \"Stop apologizing in every letter. I forgave you before you ever thought to ask. A mother does not keep score the way you are afraid I do.\"",
  "Her handwriting again, shorter than usual: \"She drew you a picture today. I do not have a way to send it to you. I am keeping it anyway, for whenever that changes.\""
];
function isVisionMachineUnlocked(){ return STATE.completed >= 95; }
function canUseVisionMachine(){ return isVisionMachineUnlocked() && STATE.visionMachineLastDay !== todayKey() && STATE.gold >= VISION_MACHINE_COST; }
function useVisionMachine(){
  if(!isVisionMachineUnlocked()) return toast('🔮 The Vision Machine has not been built yet.');
  if(STATE.visionMachineLastDay === todayKey()) return toast('🔮 The window already opened once today. It needs to rest before it can hold that much again.');
  if(STATE.gold < VISION_MACHINE_COST) return toast('🔮 Varel: "It is not stubbornness. The frame genuinely needs that much to hold open. Come back when you have it."');
  STATE.gold -= VISION_MACHINE_COST;
  STATE.visionMachineLastDay = todayKey();
  STATE.joelLetterCount = (STATE.joelLetterCount||0) + 1;
  const vignette = VISION_VIGNETTES[Math.floor(Math.random()*VISION_VIGNETTES.length)];
  let logText = `👁️ ${vignette}\n\n✉️ Joel sends another letter through. "For my mother," he says, same as always.`;
  if(STATE.joelLetterCount >= 3 && Math.random() < 0.15){
    logText += `\n\n${JOEL_LETTER_REPLIES[Math.floor(Math.random()*JOEL_LETTER_REPLIES.length)]}`;
  }
  STATE.lastVision = logText;
  save();
  go('Guild');
}
function guildScreen(){
  refreshGuildContracts();
  const {current, next} = guildRankInfo();
  const rep = STATE.guildRep || 0;
  const rankHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:18px">🏛️ ${esc(current.name)}</h3><p class="lead" style="margin-bottom:6px">${esc(current.desc)}</p>${next?`<div class="bar"><div class="fill" style="width:${Math.min(100,(rep-current.repReq)/(next.repReq-current.repReq)*100)}%"></div></div><p class="lead" style="margin-top:6px">${rep.toLocaleString()} / ${next.repReq.toLocaleString()} Rep to ${esc(next.name)}</p>`:`<p class="lead">Max rank reached — ${rep.toLocaleString()} lifetime Reputation.</p>`}`;

  const contractsHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">📜 GUILD CONTRACTS · REFRESHES WEEKLY</h3><div class="chapter-grid">${STATE.guildContracts.map(c=>`<article class="quest ${c.done?'':'active'}"><div class="mini-ico">${c.type==='boss'?'☠':'⚔️'}</div><div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><b>${c.done?'COMPLETE ✓':`${c.c||0}/${c.need||1} · ${c.rw.xp} XP + ${c.rw.gold}g + ${c.rw.rep} Rep`}</b></div></article>`).join('')}</div>`;

  const vmUnlocked = isVisionMachineUnlocked();
  let vmHTML;
  if(!vmUnlocked){
    vmHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">🔮 THE VISION MACHINE</h3><p class="lead">Varel Farseer's window opens after Chapter 95. Keep reading.</p>`;
  } else {
    const can = canUseVisionMachine();
    vmHTML = `<h3 style="font-family:Cinzel;color:#c99aff;margin:22px 0 4px;font-size:18px">🔮 THE VISION MACHINE</h3><p class="lead" style="margin-bottom:10px">Varel's window into what's left behind. Costs ${VISION_MACHINE_COST.toLocaleString()}g, once per day.</p>${STATE.lastVision?`<div class="locked-banner" style="white-space:pre-line;margin-bottom:12px">${esc(STATE.lastVision)}</div>`:''}<button class="cta" onclick="useVisionMachine()" ${can?'':'disabled'}>${STATE.visionMachineLastDay===todayKey()?'ALREADY OPENED TODAY':`OPEN THE WINDOW · ${VISION_MACHINE_COST.toLocaleString()}g`}</button>`;
  }

  return panel('Guild Hall','GUILD & VISION', rankHTML+contractsHTML+vmHTML, navButton('Dashboard'));
}

function frontierScreen(){
  const unlocked = ZONES.filter(zoneUnlocked);
  if(!unlocked.length){
    return panel('Exploration Zones','MONSTER ZONES',
      `<p class="lead">Your first exploration zone (The Cursed Catacombs) opens at Chapter 1 — read on to unlock it.</p>`,
      navButton('Dashboard'));
  }
  if(!STATE.selectedZone || !unlocked.some(z=>z.id===STATE.selectedZone)){
    STATE.selectedZone = unlocked.slice().sort((a,b)=>b.unlockChapter-a.unlockChapter)[0].id; // truly most-advanced unlocked zone
  }
  const zone = ZONES.find(z=>z.id===STATE.selectedZone);
  const tabs = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">${ZONES.map(z=>{const u=zoneUnlocked(z);return `<button class="small-btn ${z.id===STATE.selectedZone?'primary':''}" ${u?`onclick="selectZone('${z.id}')"`:'disabled'} style="${u?'':'opacity:.4'}">${z.icon} ${esc(z.name)}${u?'':` · Ch.${z.unlockChapter}`}</button>`;}).join('')}</div>`;
  const body = tabs + zoneScreenHTML(zone) + bountyBoardHTML() + `<div class="locked-banner" style="margin-top:18px">Gold: <b style="color:#eee">${STATE.gold.toLocaleString()}</b></div>`;
  return panel(zone.name, 'EXPLORATION ZONE', body, navButton('Dashboard'));
}
function selectZone(id){ STATE.selectedZone = id; save(); go('Frontier'); }

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
      const xpAdded = addXp(b.rw.xp);
      const goldAdded = addGold(b.rw.gold);
      toast(`💰 Bounty complete: ${b.name} · +${xpAdded} XP · +${goldAdded}g`);
    }
  });
  save();
}
function bountyBoardHTML(){
  refreshBounties();
  return `<h3 style="font-family:Cinzel;color:#c99aff;margin:0 0 4px;font-size:16px">💰 BOUNTY BOARD</h3><p class="lead" style="margin-bottom:10px">Refreshes daily. Complete these alongside your normal progress for bonus XP and gold.</p><div class="chapter-grid">${STATE.bounties.map(b=>`<article class="quest ${b.done?'':'active'}"><div class="mini-ico">${b.icon}</div><div><h3>${esc(b.name)}</h3><p>${esc(b.desc)}</p><b>${b.done?'COMPLETE ✓':`${b.c}/${b.need} · ${b.rw.xp} XP + ${b.rw.gold}g`}</b></div></article>`).join('')}</div>`;
}


function battleScreen(){
  const boss = activeEncounter();
  if(!boss) return panel('Battle','MAJOR ENCOUNTER','<p class="lead">No boss encounter available yet.</p>', navButton('Dashboard'));
  const locked = boss.isStoryBoss && STATE.completed < boss.id-1;
  const notYetRead = boss.isStoryBoss && !locked && !STATE.readChapters.includes(boss.id);
  if(notYetRead){
    const c = chapterData.find(ch=>ch.id===boss.id);
    return panel('Battle','MAJOR ENCOUNTER',
      `<div class="locked-banner"><b>READ CHAPTER ${boss.id} FIRST</b><br>${esc(boss.name)}'s encounter follows the story in Chapter ${boss.id}: ${esc(c.title)}. Read it before entering battle.</div>`,
      `<button class="cta" data-read="${boss.id}">READ CHAPTER ${boss.id} ›</button> ` + navButton('Dashboard'));
  }
  const hp = activeEncounterHp(boss);
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

  html += `<div class="companion-ai-strip" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><span><strong>${STATE.autoBattleMode?'Auto-Battle is ON':'San is yours to control'}</strong> — set each companion below to Assisted (auto-acts) or Manual.</span><span style="display:flex;gap:8px"><button class="small-btn" onclick="toggleMusicMute()" title="Toggle battle music">${STATE.musicMuted?'🔇':'🔊'}</button><button class="small-btn ${STATE.autoBattleMode?'primary':''}" onclick="toggleAutoBattle()">${STATE.autoBattleMode?'🤖 AUTO-BATTLE: ON':'🎮 AUTO-BATTLE: OFF'}</button></span></div>`;

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
    html += `<div class="battle-member-name">${esc(m.name)}${UNKILLABLE_IDS.has(m.id)?' 🛡️':''}${STATE.partyStatus[m.id]==='diseased'?' 🤢':''}</div>`;
    html += `<div class="battle-member-role">${esc(m.role)}</div>`;
    html += `<div class="battle-hp-bar"><div class="battle-hp-fill" style="width:${hpPct}%"></div></div>`;
    html += `<div class="battle-hp-text">HP: ${mhp}/${m.hp}</div>`;
    if(m.mp>0){
      html += `<div class="battle-mp-bar"><div class="battle-mp-fill" style="width:${mpPct}%"></div></div>`;
      html += `<div class="battle-mp-text">MP: ${mmp}/${m.mp}</div>`;
    }
    if(mode) html += `<button class="small-btn" style="margin-top:4px;padding:3px 6px;font-size:9px" onclick="event.stopPropagation();toggleCompanionMode('${m.id}')">${mode==='assisted'?'🤖 ASSISTED':'🎮 MANUAL'}</button>`;
    else html += `<div style="margin-top:4px;font-size:9px;color:#c99aff">★ YOU CONTROL</div>`;
    html += `</div>`;
  });
  html += '</div>';

  const playerControlsThisTurn = !currentMember || (currentMember.id==='san' ? !STATE.autoBattleMode : (STATE.companionMode[currentMember.id]||'assisted')==='manual');
  html += '<div class="battle-actions">';
  if(playerControlsThisTurn){
    const actorKit = currentMember ? kitFor(currentMember.id) : kitFor('san');
    const level_ = level();
    const hasMultiSpells = Array.isArray(actorKit.spells);
    const unlockedSpells = hasMultiSpells ? actorKit.spells.filter(s=>level_>=s.levelReq) : [];
    const spellAvailable = hasMultiSpells ? unlockedSpells.length>0 : !!actorKit.spell;
    const skillAvailable = !!actorKit.skill;
    const highSkillReady = actorKit.highSkill && level_ >= actorKit.highSkill.levelReq;
    const potionCount = Object.values(STATE.consumables).reduce((a,b)=>a+b,0);
    const spellSub = hasMultiSpells
      ? (spellAvailable ? `${unlockedSpells.length} spell${unlockedSpells.length===1?'':'s'} known` : 'No spells known')
      : (spellAvailable ? actorKit.spell.name+(actorKit.spell.mp?` (${actorKit.spell.mp} MP)`:'') : 'No spells known');
    const spellIcon = hasMultiSpells ? '📖' : (spellAvailable?actorKit.spell.icon:'✨');
    const actions = [
      ['ATTACK','⚔️','Basic attack', true],
      ['SPELL', spellIcon, spellSub, spellAvailable],
      ['SKILL', highSkillReady?actorKit.highSkill.icon:(skillAvailable?actorKit.skill.icon:'🎯'), highSkillReady?actorKit.highSkill.name+(actorKit.highSkill.mp?` (${actorKit.highSkill.mp} MP)`:''):(skillAvailable?actorKit.skill.name+(actorKit.skill.mp?` (${actorKit.skill.mp} MP)`:''):'No skills known'), skillAvailable],
      ['ITEM','🧪', potionCount?`${potionCount} potion${potionCount===1?'':'s'} carried`:'No potions — visit the Trader', true],
      ['DEFEND','🛡️','Brace', true]
    ];
    actions.forEach(([a,icon,sub,enabled])=>{
      let onclick;
      if(a==='ITEM') onclick = `onclick="toggleBattleItemMenu()"`;
      else if(a==='SPELL' && hasMultiSpells) onclick = `onclick="toggleBattleSpellMenu()"`;
      else onclick = `data-battle-action="${a}"`;
      html += `<button class="battle-action-btn" ${onclick} ${hp<=0||locked||!enabled?'disabled':''}><span class="battle-action-icon">${icon}</span><span class="battle-action-label">${a}</span><span class="battle-action-sub">${sub}</span></button>`;
    });
    if(STATE.battleItemMenuOpen){
      const owned = Object.entries(STATE.consumables).filter(([,n])=>n>0);
      html += `<div class="chapter-grid" style="grid-column:1/-1;margin-top:8px">${owned.length ? owned.map(([id,n])=>{const p=POTION_CATALOG.find(x=>x.id===id);return `<article class="quest"><div class="mini-ico">${p.icon}</div><div><h3>${esc(p.name)} ×${n}</h3><p>${p.effect==='heal'?`+${p.value} HP`:`+${p.value} MP`}</p></div><button class="small-btn primary" onclick="usePotionInBattle('${id}')">USE</button></article>`;}).join('') : '<p class="lead">No potions carried — buy some from the Trader in Inventory.</p>'}</div>`;
    }
    if(STATE.battleSpellMenuOpen && hasMultiSpells){
      html += `<div class="chapter-grid" style="grid-column:1/-1;margin-top:8px">${actorKit.spells.map((s,i)=>{const unlocked=level_>=s.levelReq;return `<article class="quest" style="${unlocked?'':'opacity:.45'}"><div class="mini-ico">${s.icon}</div><div><h3>${esc(s.name)}${s.mp?` · ${s.mp} MP`:''}</h3><p>${esc(s.desc||'')}${unlocked?'':` · Unlocks at Level ${s.levelReq}`}</p></div><button class="small-btn primary" onclick="castNamedSpell(${i})" ${unlocked?'':'disabled'}>CAST</button></article>`;}).join('')}</div>`;
    }
  } else {
    const autoMsg = currentMember.id==='san' ? 'San is acting on Auto-Battle…' : `${esc(currentMember.name)} is acting on Assisted AI…`;
    html += `<div class="battle-note" style="grid-column:1/-1;text-align:center;padding:10px">${autoMsg}</div>`;
  }
  html += '</div>';

  const logLines = STATE.combatLog.length ? STATE.combatLog.map(l=>`<div>${l}</div>`).join('') : 'Battle ready. Select the active party member.';
  html += `<div class="eyebrow" style="margin-top:14px">COMBAT LOG</div><div class="combat-log" id="combatLog">${logLines}</div>`;

  html += '</div>'; // .battle-arena
  const backTarget = boss.isRegular || boss.isFrontierBoss ? 'Frontier' : 'Quests';
  html += `<div style="margin-top:12px"><button class="cta" data-go="${backTarget}">‹ BACK TO ${backTarget.toUpperCase()}</button></div></section>`;
  maybeAutoActCompanion();
  return html;
}
let autoActTimer = null;
function clearAutoActTimer(){ if(autoActTimer){ clearTimeout(autoActTimer); autoActTimer=null; } }
function toggleAutoBattle(){
  STATE.autoBattleMode = !STATE.autoBattleMode;
  save();
  toast(STATE.autoBattleMode ? '🤖 Auto-Battle on — San will act on her own too' : '🎮 Auto-Battle off — you control San again');
  go('Battle');
}
function toggleCompanionMode(id){
  STATE.companionMode[id] = (STATE.companionMode[id]||'assisted')==='assisted' ? 'manual' : 'assisted';
  save();
  go('Battle');
}
function chooseSanAutoAction(){
  const lvl = level();
  const sanMember = ALL_PARTY.find(m=>m.id==='san');
  const mp = STATE.partyMp['san']!=null?STATE.partyMp['san']:sanMember.mp;
  const spells = kitFor('san').spells.filter(s=>lvl>=s.levelReq && mp>=s.mp);
  // Prefer the strongest affordable damage spell (dice-based); fall back to
  // healing/utility only if the party actually needs it; otherwise ATTACK.
  const damageSpells = spells.filter(s=>s.dice).sort((a,b)=>b.mp-a.mp); // higher MP cost ~= stronger tier
  if(damageSpells.length && Math.random() < 0.75){
    STATE.pendingSpellIndex = kitFor('san').spells.indexOf(damageSpells[0]);
    return 'SPELL';
  }
  return 'ATTACK';
}
function maybeAutoActCompanion(){
  if(autoActTimer) return;
  const party = getActiveParty();
  const cur = party[STATE.turn];
  if(!cur) return;
  const curHp = STATE.partyHp[cur.id]!=null?STATE.partyHp[cur.id]:cur.hp;
  if(curHp<=0){
    const anyoneAlive = party.some(m=>(STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp)>0);
    if(!anyoneAlive) return; // full party down — nothing to advance to, stop here
    advanceTurnSkippingFallen(party);
    go('Battle');
    return;
  }
  if(cur.id==='san'){
    if(!STATE.autoBattleMode) return;
    const boss = activeEncounter();
    if(!boss) return;
    if(boss.isStoryBoss && STATE.completed < boss.id-1) return;
    if(activeEncounterHp(boss) <= 0) return;
    autoActTimer = setTimeout(()=>{
      autoActTimer = null;
      battleAction(chooseSanAutoAction());
    }, 700);
    return;
  }
  const mode = STATE.companionMode[cur.id] || 'assisted';
  if(mode !== 'assisted') return;
  const boss = activeEncounter();
  if(!boss) return;
  if(boss.isStoryBoss && STATE.completed < boss.id-1) return;
  const hp = activeEncounterHp(boss);
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
  const boss = activeEncounter();
  if(!boss) return;
  if(boss.isStoryBoss && STATE.completed < boss.id-1) return toast(`Complete previous chapters before this encounter`);
  ensureFreshBattleState();
  let hp = activeEncounterHp(boss);
  if(hp<=0) return;
  STATE.battleStarted=true;
  const party = getActiveParty();
  const actor = party[STATE.turn] || {name:'San', id:'san', hp:82, mp:100};
  const kit = kitFor(actor.id);
  const curMp = STATE.partyMp[actor.id] != null ? STATE.partyMp[actor.id] : actor.mp;
  const dmgTable = [120,105,110,95,90,85,80,60,60];
  const trinket = trinketBonus(actor.id) || {};
  const baseDmg = Math.round(dmgTable[STATE.turn % dmgTable.length] * (1+(trinket.dmgPct||0)) * (1+(STATE.hastePct||0)));

  function spendMp(amount){ STATE.partyMp[actor.id] = Math.max(0, curMp-amount); }
  function dealDamage(dmg, verb){
    hp = Math.max(0, hp-dmg);
    setActiveEncounterHp(boss, hp);
    logCombat(`${esc(actor.name)} ${verb} for ${dmg} damage.`);
  }

  if(a==='ATTACK'){
    let dmg = baseDmg;
    let critChance = CRIT_BASE + guildBonus('crit');
    if(actor.id==='senedra') critChance += (affinityFor('senedra').fx.critPct || 0);
    if(actor.id==='zaki'){
      const atkBonus = (affinityFor('zaki').fx.atk || 0) + (STATE.nervousCourageActive ? 6 : 0);
      dmg = Math.round(dmg * (1 + atkBonus/20));
    }
    let guaranteedCrit = false;
    if(actor.id==='san' && STATE.markedBoss){ guaranteedCrit = true; STATE.markedBoss = false; }
    const isCrit = guaranteedCrit || Math.random() < critChance;
    if(isCrit) dmg = Math.round(dmg * 2);
    dealDamage(dmg, isCrit ? (guaranteedCrit ? "strikes the marked foe true — a guaranteed critical" : 'lands a critical hit') : 'attacks');
    if(isCrit) triggerCritGrowthAbility(actor);
  } else if(a==='SPELL' && (kit.spell || kit.spells)){
    const chosenSpell = kit.spells ? kit.spells[STATE.pendingSpellIndex] : kit.spell;
    if(!chosenSpell){ dealDamage(baseDmg,'attacks'); }
    else if(curMp < chosenSpell.mp){ logCombat(`${esc(actor.name)} doesn't have enough MP for ${chosenSpell.name} — attacks instead.`); dealDamage(baseDmg,'attacks'); }
    else if(chosenSpell.healMult){
      spendMp(chosenSpell.mp);
      const healAmt = Math.round(60*chosenSpell.healMult*(1+(trinket.healPct||0)));
      const lowest = party.reduce((min,m)=>{ const h=STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp; const minH=STATE.partyHp[min.id]!=null?STATE.partyHp[min.id]:min.hp; return h/m.hp < minH/min.hp ? m : min; }, party[0]);
      STATE.partyHp[lowest.id] = Math.min(effectiveMaxHp(lowest), (STATE.partyHp[lowest.id]!=null?STATE.partyHp[lowest.id]:lowest.hp)+healAmt);
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)}, healing ${esc(lowest.name)} for ${healAmt} HP.`);
    } else if(chosenSpell.effect==='restoreMp'){
      spendMp(chosenSpell.mp);
      const target = party.find(m=>m.id==='san') || party[0];
      const curTargetMp = STATE.partyMp[target.id]!=null?STATE.partyMp[target.id]:target.mp;
      STATE.partyMp[target.id] = Math.min(effectiveMaxMp(target), curTargetMp+chosenSpell.restoreAmt);
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)}, restoring ${chosenSpell.restoreAmt} MP to ${esc(target.name)}.`);
    } else if(chosenSpell.effect==='shareMp'){
      const eligible = party.filter(m=>m.id!==actor.id && m.mp>0);
      if(curMp < chosenSpell.mp + 10 || !eligible.length){ logCombat(`${esc(actor.name)} doesn't have enough spare MP to share — attacks instead.`); dealDamage(baseDmg,'attacks'); }
      else {
        spendMp(chosenSpell.mp);
        const target = eligible.reduce((min,m)=>{ const mp=STATE.partyMp[m.id]!=null?STATE.partyMp[m.id]:m.mp; const minMp=STATE.partyMp[min.id]!=null?STATE.partyMp[min.id]:min.mp; return mp/m.mp < minMp/min.mp ? m : min; }, eligible[0]);
        const curTargetMp = STATE.partyMp[target.id]!=null?STATE.partyMp[target.id]:target.mp;
        STATE.partyMp[target.id] = Math.min(effectiveMaxMp(target), curTargetMp+chosenSpell.restoreAmt);
        logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)}, sharing ${chosenSpell.restoreAmt} MP with ${esc(target.name)}.`);
      }
    } else if(chosenSpell.effect==='shield'){
      spendMp(chosenSpell.mp);
      STATE.shieldTurns = 1; STATE.shieldPct = 0.5;
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)} — the party is shielded from the next hit.`);
    } else if(chosenSpell.buffType==='defense'){
      spendMp(chosenSpell.mp);
      STATE.shieldTurns = chosenSpell.buffTurns || 3;
      STATE.shieldPct = Math.min(0.6, (chosenSpell.buffVal||5)/20); // buffVal ~4-12 -> 20-60% reduction
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)} — damage reduced by ${Math.round(STATE.shieldPct*100)}% for ${STATE.shieldTurns} of the boss's turns.`);
    } else if(chosenSpell.buffType==='haste'){
      spendMp(chosenSpell.mp);
      STATE.hasteTurns = chosenSpell.buffTurns || 3;
      STATE.hastePct = Math.min(0.5, (chosenSpell.buffVal||6)/20);
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)} — attacks hit ${Math.round(STATE.hastePct*100)}% harder for ${STATE.hasteTurns} turns.`);
    } else if(chosenSpell.buffType==='manaRestore'){
      spendMp(chosenSpell.mp);
      const newMp = Math.min(effectiveMaxMp(actor), curMp-chosenSpell.mp+chosenSpell.buffVal);
      STATE.partyMp[actor.id] = newMp;
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)}, recovering ${chosenSpell.buffVal} MP.`);
    } else if(chosenSpell.buffType==='fullRestore'){
      spendMp(chosenSpell.mp);
      party.forEach(m=>{
        const curHp2 = STATE.partyHp[m.id]!=null?STATE.partyHp[m.id]:m.hp;
        if(curHp2>0) STATE.partyHp[m.id] = effectiveMaxHp(m);
        STATE.partyMp[m.id] = effectiveMaxMp(m);
      });
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)} — the whole party is fully restored.`);
    } else if(chosenSpell.buffType==='timeStop'){
      spendMp(chosenSpell.mp);
      STATE.timeStopTurns = 1;
      logCombat(`${esc(actor.name)} casts ${chosenSpell.icon} ${esc(chosenSpell.name)} — time itself stops. ${esc(boss.name)} will not act next turn.`);
    } else if(chosenSpell.dice){
      spendMp(chosenSpell.mp);
      const rolled = rollDice(chosenSpell.dice) * DICE_SCALE;
      const withBonus = Math.round(rolled * (1+(trinket.spellPct||0)) * (1+(STATE.hastePct||0)));
      dealDamage(withBonus, `casts ${chosenSpell.icon} ${esc(chosenSpell.name)} (${chosenSpell.dice})`);
      if(chosenSpell.status && Math.random() < chosenSpell.status.chance){
        const st = chosenSpell.status;
        if(st.dmg){
          const bonusDmg = st.dmg * DICE_SCALE;
          hp = Math.max(0, hp - bonusDmg);
          setActiveEncounterHp(boss, hp);
          logCombat(`${esc(boss.name)} is afflicted with ${st.type} for an extra ${bonusDmg} damage.`);
        } else {
          logCombat(`${esc(boss.name)} is ${st.type==='shock'?'stunned':st.type} by the spell.`);
        }
      }
    } else {
      spendMp(chosenSpell.mp);
      dealDamage(Math.round(baseDmg*chosenSpell.mult*(1+(trinket.spellPct||0))), `casts ${chosenSpell.icon} ${esc(chosenSpell.name)}`);
    }
  } else if(a==='SKILL' && kit.skill){
    const useHigh = kit.highSkill && level() >= kit.highSkill.levelReq;
    const chosenSkill = useHigh ? kit.highSkill : kit.skill;
    if(curMp < chosenSkill.mp){ logCombat(`${esc(actor.name)} doesn't have enough MP for ${chosenSkill.name} — attacks instead.`); dealDamage(baseDmg,'attacks'); }
    else if(chosenSkill.effect==='cleanse'){
      spendMp(chosenSkill.mp);
      const diseased = Object.keys(STATE.partyStatus).filter(id=>STATE.partyStatus[id]==='diseased');
      diseased.forEach(id=>delete STATE.partyStatus[id]);
      logCombat(diseased.length
        ? `${esc(actor.name)} uses ${chosenSkill.icon} ${esc(chosenSkill.name)}, curing ${diseased.length} afflicted part${diseased.length===1?'y member':'y members'}.`
        : `${esc(actor.name)} uses ${chosenSkill.icon} ${esc(chosenSkill.name)} — no one was afflicted.`);
    }
    else {
      spendMp(chosenSkill.mp);
      if(chosenSkill.mult) dealDamage(Math.round(baseDmg*chosenSkill.mult*(1+(trinket.skillPct||0))), `uses ${chosenSkill.icon} ${esc(chosenSkill.name)}`);
      else logCombat(`${esc(actor.name)} uses ${chosenSkill.icon} ${esc(chosenSkill.name)}.`);
    }
  } else if(a==='DEFEND'){
    STATE.defending[actor.id] = true;
    logCombat(`${esc(actor.name)} braces to defend — the next hit against them will be halved.`);
  } else if(a==='ITEM'){
    toggleBattleItemMenu();
    return;
  } else {
    dealDamage(baseDmg, 'attacks');
  }

  if(STATE.hasteTurns > 0 && a!=='ITEM'){ STATE.hasteTurns--; if(STATE.hasteTurns===0) STATE.hastePct = 0; }

  save();

  if(hp===0){
    if(boss.isRegular){
      logCombat(`<span style="color:#d5a1f4">${esc(boss.name)} defeated.</span>`);
      addXp(boss.xpReward);
      const goldAdded = addGold(boss.goldReward);
      checkBountyProgress('frontier_kill', boss.monsterId, 1);
      endNonStoryEncounter();
      save();
      toast(`${boss.name} defeated · +${boss.xpReward} XP · +${goldAdded}g`);
      setTimeout(()=>go('Frontier'), 600);
    } else if(boss.isFrontierBoss){
      logCombat(`<span style="color:#d5a1f4">${esc(boss.name)} defeated again.</span>`);
      const c = chapterData.find(ch=>ch.id===boss.id);
      const xpAdded = addXp(bossReward(c));
      const goldAdded = addGold(goldReward(c));
      STATE.frontierCurrentBoss = null;
      STATE.frontierBossCooldownUntil = Date.now() + (5+Math.random()*10)*60000;
      checkBountyProgress('frontier_boss', boss.name, 1);
      endNonStoryEncounter();
      save();
      toast(`${boss.name} defeated again · +${xpAdded} XP · +${goldAdded}g`);
      setTimeout(()=>go('Frontier'), 600);
    } else if(STATE.completed < boss.id){
      logCombat(`<span style="color:#d5a1f4">${esc(boss.name)} defeated. Chapter ${boss.id} complete.</span>`);
      if(BOSS_TAUNTS[boss.id]) logCombat(`<div style="margin-top:6px;color:#c9b8d8">${esc(BOSS_TAUNTS[boss.id].defeatLine)}</div>`);
      const c = chapterData.find(c=>c.id===boss.id);
      const gold = goldReward(c);
      addXp(bossReward(c));
      const goldAdded = addGold(gold);
      STATE.completed = boss.id;
      const loot = awardBossLoot(boss.id, boss.name);
      checkGuildContractProgress('boss', boss.id, 1);
      save();
      toast(loot ? `${boss.name} defeated! · ${loot.icon} ${loot.name} · +${goldAdded}g` : `${boss.name} defeated! +${goldAdded}g`);
      // Same pattern as a regular chapter completion: land back on the
      // Journal instead of parking on Battle, which would otherwise show a
      // static "read the next chapter first" message the player has to
      // click through manually if the next chapter is also a boss.
      setTimeout(()=>go('Journal'), 600);
    } else {
      logCombat(`<span style="color:#d5a1f4">${esc(boss.name)} defeated. Chapter ${boss.id} complete.</span>`);
      toast(`${boss.name} defeated!`);
      go('Battle');
    }
  } else {
    endTurn(boss, party);
  }
}

Array.from(document.querySelectorAll('#nav button')).forEach(b=>b.addEventListener('click',()=>go(b.dataset.name)));
go('Dashboard');

// Auto-save every 30s. Piggybacks on the same backup-then-verify save() used
// everywhere else, so the recovery slot stays fresh too — no separate logic.
setInterval(()=>{ applyRegen(); save(); }, 30000);
window.addEventListener('beforeunload', ()=>{ save(); });
