
// PWA Install Prompt Handler
let deferredPrompt = null;
const installBtn = document.createElement('button');
installBtn.id = 'pwa-install-btn';
installBtn.style.cssText = 'position:fixed;bottom:80px;right:16px;z-index:1000;padding:12px 20px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;display:none;box-shadow:0 4px 12px #7c3aed40;';
installBtn.textContent = '⚔️ Install Daybreak';
document.body.appendChild(installBtn);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
  lg('📲 PWA install available! Tap the floating button to install.');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    lg('🎉 Daybreak installed! Welcome, San.');
    installBtn.style.display = 'none';
  }
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  installBtn.style.display = 'none';
  lg('✅ Daybreak is now installed on your device!');
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function(err) {
    console.log('SW registration failed:', err);
  });
}

const G = {

  state: 'menu',
  p: {
    name: 'San', cls: 'Sorcerer', lvl: 1, xp: 0, xpN: 100,
    hp: 80, mhp: 80, mp: 120, mmp: 120, gold: 50,
    stats: { str: 4, dex: 6, con: 5, int: 12, wis: 10, cha: 8 },
    skills: [
      // === TIER 1 (Lv 1-6) ===
      { n: 'Magic Missile', c: 10, dmg: '1d8', on: true, ul: 1, tier: 1, d: 'A flurry of arcane darts that never miss.', elem: 'arcane' },
      { n: 'Chromatic Orb', c: 12, dmg: '1d10', on: false, ul: 2, tier: 1, d: 'A sphere of shifting elemental energy.', elem: 'arcane', status: { type: 'shock', chance: 0.15, turns: 1 } },
      { n: 'Shield', c: 8, on: false, ul: 4, tier: 1, d: 'A wall of force deflects incoming blows.', buff: true, buffType: 'defense', buffVal: 4, buffTurns: 3, elem: 'arcane' },
      { n: "Melf's Acid Arrow", c: 14, dmg: '1d10', on: false, ul: 6, tier: 1, d: 'A bolt of acid that keeps corroding.', elem: 'poison', status: { type: 'poison', chance: 0.35, dmg: 3, turns: 3 } },

      // === TIER 2 (Lv 7-12) ===
      { n: 'Evasion Ward', c: 16, on: false, ul: 7, tier: 2, d: 'Illusory duplicates make you harder to pin down.', buff: true, buffType: 'defense', buffVal: 6, buffTurns: 3, elem: 'arcane' },
      { n: 'Web of Frost', c: 18, dmg: '1d12', on: false, ul: 9, tier: 2, d: 'Freezing strands ensnare the target.', elem: 'ice', status: { type: 'shock', chance: 0.25, turns: 1 } },
      { n: 'Fireshield (Blue)', c: 15, on: false, ul: 10, tier: 2, d: '+5 AC for 3 turns, chilling attackers.', buff: true, buffType: 'defense', buffVal: 5, buffTurns: 3, elem: 'ice' },
      { n: 'Vampiric Touch', c: 20, dmg: '1d10', on: false, ul: 12, tier: 2, d: 'A withering grasp that drains vitality.', elem: 'arcane', status: { type: 'poison', chance: 0.3, dmg: 4, turns: 3 } },

      // === TIER 3 (Lv 13-18) ===
      { n: 'Fireball', c: 25, dmg: '2d6', on: false, ul: 13, tier: 3, d: 'Classic D&D fireball.', elem: 'fire', status: { type: 'burn', chance: 0.3, dmg: 3, turns: 3 } },
      { n: 'Lightning Bolt', c: 30, dmg: '3d8', on: false, ul: 15, tier: 3, d: 'A crackling bolt of lightning.', elem: 'lightning', status: { type: 'shock', chance: 0.2, turns: 1 } },
      { n: 'Haste', c: 22, on: false, ul: 16, tier: 3, d: 'Time quickens around you. Your strikes land harder and faster.', buff: true, buffType: 'haste', buffVal: 6, buffTurns: 3, elem: 'arcane' },
      { n: 'Time Lag', c: 24, dmg: '1d10', on: false, ul: 18, tier: 3, d: 'The target stumbles a half-second behind reality.', elem: 'arcane', status: { type: 'shock', chance: 0.3, turns: 1 } },

      // === TIER 4 (Lv 19-24) ===
      { n: 'Stoneskin', c: 28, on: false, ul: 19, tier: 4, d: 'Flesh hardens to stone, shrugging off blows.', buff: true, buffType: 'defense', buffVal: 10, buffTurns: 4, elem: 'arcane' },
      { n: 'Greater Evasion', c: 30, on: false, ul: 21, tier: 4, d: 'A deeper illusion — nearly untouchable.', buff: true, buffType: 'defense', buffVal: 8, buffTurns: 4, elem: 'arcane' },
      { n: 'Ice Storm', c: 32, dmg: '2d10', on: false, ul: 22, tier: 4, d: 'A driving hail of razor ice.', elem: 'ice', status: { type: 'shock', chance: 0.25, turns: 1 } },
      { n: 'Mind Shatter', c: 30, dmg: '2d8', on: false, ul: 24, tier: 4, d: 'A psychic assault that unravels the target\'s will.', elem: 'arcane', status: { type: 'poison', chance: 0.4, dmg: 4, turns: 3 } },

      // === TIER 5 (Lv 25-29) ===
      { n: 'Cone of Cold', c: 36, dmg: '3d8', on: false, ul: 25, tier: 5, d: 'A blast of absolute cold.', elem: 'ice', status: { type: 'shock', chance: 0.3, turns: 1 } },
      { n: 'Chaotic Surge', c: 38, dmg: '2d12', on: false, ul: 27, tier: 5, d: 'Raw, unstable magic tears loose.', elem: 'arcane', status: { type: 'burn', chance: 0.35, dmg: 5, turns: 3 } },
      { n: 'Sunfire', c: 40, dmg: '3d10', on: false, ul: 28, tier: 5, d: 'A miniature sun erupts outward.', elem: 'fire', status: { type: 'burn', chance: 0.4, dmg: 6, turns: 3 } },
      { n: 'Mesmeric Hold', c: 34, dmg: '2d10', on: false, ul: 29, tier: 5, d: 'The target is locked in place by force of mind.', elem: 'arcane', status: { type: 'shock', chance: 0.4, turns: 1 } },

      // === TIER 6 (Lv 30-34) ===
      { n: 'Wondrous Recall', c: 10, on: false, ul: 30, tier: 6, d: 'Regain a used spell slot, drawing expended magic back into your mind.', buff: true, buffType: 'manaRestore', buffVal: 30, elem: 'arcane' },
      { n: 'Chain Lightning', c: 45, dmg: '4d8', on: false, ul: 31, tier: 6, d: 'Lightning arcs from foe to foe.', elem: 'lightning', status: { type: 'shock', chance: 0.3, turns: 1 } },
      { n: 'Withering Fog', c: 42, dmg: '3d10', on: false, ul: 33, tier: 6, d: 'A caustic mist that eats through armor and flesh alike.', elem: 'poison', status: { type: 'poison', chance: 0.5, dmg: 8, turns: 3 } },
      { n: 'Improved Haste', c: 35, on: false, ul: 34, tier: 6, d: 'Time bends further still.', buff: true, buffType: 'haste', buffVal: 10, buffTurns: 4, elem: 'arcane' },

      // === TIER 7 (Lv 35-39) ===
      { n: 'Finger of Death', c: 55, dmg: '5d8', on: false, ul: 35, tier: 7, d: 'A single word that unmakes.', elem: 'arcane', status: { type: 'poison', chance: 0.4, dmg: 10, turns: 3 } },
      { n: 'Spectral Blade', c: 50, dmg: '4d10', on: false, ul: 37, tier: 7, d: 'A conjured blade strikes with independent will.', elem: 'arcane' },
      { n: 'Prismatic Spray', c: 52, dmg: '4d12', on: false, ul: 38, tier: 7, d: 'Seven rays of pure devastation.', elem: 'arcane', status: { type: 'burn', chance: 0.4, dmg: 8, turns: 3 } },
      { n: 'Arcane Ward', c: 40, on: false, ul: 39, tier: 7, d: 'A standing ward of pre-cast protection.', buff: true, buffType: 'defense', buffVal: 12, buffTurns: 4, elem: 'arcane' },

      // === TIER 8 (Lv 40-44) ===
      { n: 'Incendiary Cloud', c: 60, dmg: '5d10', on: false, ul: 40, tier: 8, d: 'A roiling cloud of superheated ash.', elem: 'fire', status: { type: 'burn', chance: 0.5, dmg: 10, turns: 3 } },
      { n: 'Sunburst', c: 65, dmg: '5d12', on: false, ul: 42, tier: 8, d: 'Radiant fire scours the battlefield.', elem: 'fire', status: { type: 'burn', chance: 0.5, dmg: 12, turns: 3 } },
      { n: 'Horrid Wilting', c: 62, dmg: '6d8', on: false, ul: 43, tier: 8, d: 'Moisture is torn from the target\'s very cells.', elem: 'poison', status: { type: 'poison', chance: 0.5, dmg: 12, turns: 3 } },
      { n: 'Planar Banish', c: 50, dmg: '4d10', on: false, ul: 44, tier: 8, d: 'A rift briefly opens beneath the target\'s feet.', elem: 'arcane', status: { type: 'shock', chance: 0.5, turns: 1 } },

      // === TIER 9 (Lv 45-50) — CAPSTONE ===
      { n: 'Black Blade of Disaster', c: 70, dmg: '6d10', on: false, ul: 45, tier: 9, d: 'A blade of pure entropy that unmakes what it touches.', elem: 'arcane' },
      { n: 'Meteor Swarm', c: 60, dmg: '4d10', on: false, ul: 47, tier: 9, d: 'Ultimate destruction from the sky.', elem: 'fire', status: { type: 'burn', chance: 0.5, dmg: 5, turns: 3 } },
      { n: 'Wish Fulfilled', c: 50, on: false, ul: 48, tier: 9, d: 'Reality bends briefly in your favor.', buff: true, buffType: 'fullRestore', elem: 'arcane' },
      { n: 'Time Stop', c: 80, on: false, ul: 50, tier: 9, d: 'The world freezes. You alone still move.', buff: true, buffType: 'timeStop', elem: 'arcane' }
    ],
    eq: {
    weapon: { n: 'Apprentice Staff', slot: 'weapon', atk: 2, int: 1, r: 'common', ilvl: 1, d: 'A worn wooden staff crackling with faint arcane energy.' },
    armor: { n: 'Novice Robes', slot: 'armor', def: 2, int: 1, r: 'common', ilvl: 1, d: 'Threadbare robes stained with old spell components.' },
    head: null,
    hands: null,
    feet: null,
    ring1: null,
    ring2: null,
    amulet: null
  },
    inv: [
      { n: 'Health Potion', t: 'pot', eff: 'heal', v: 30, q: 3, r: 'common' },
      { n: 'Mana Potion', t: 'pot', eff: 'mana', v: 25, q: 2, r: 'common' },
      { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' },
      { n: 'Goblin Tooth', t: 'mat', q: 2, r: 'common' },
      { n: 'Iron Ore', t: 'mat', q: 3, r: 'common' },
      { n: 'Herb Bundle', t: 'mat', q: 4, r: 'common' }
    ],
    buffs: [], kills: 0, quests: 0, fstreak: 0, bossKills: 0, crafts: 0, survivedCritical: false
  },
  party: [
    { n: 'Joel', t: 'The Steadfast', r: 'Tank', hp: 120, mhp: 120, atk: 6, def: 8, spd: 4, on: true, d: 'Your partner and shield. Never lets you fight alone. A steadfast man from a Philippine village, second of four, breadwinner, stray-feeder, yours. He does not ask why you are here. He asks if you will let him stand beside you while you find out.', b: '+10% Max HP', col: '#7c3aed', affinityBonuses: [], gear: null, base: { mhp: 120, atk: 6, def: 8, spd: 4 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } },
    { n: 'Aisyah', t: 'Sisterblade', r: 'Rogue', hp: 70, mhp: 70, atk: 10, def: 4, spd: 9, on: true, d: 'Your sister, sharp-eyed and sharper-tongued. Your eldest sister, fifty-something in the old world, who taught you to trade before she taught you to fight. She taught you the trade routes of Brunei. Now she teaches you the dangerous paths of Aethon. Family is complicated. Family with knives is complicated and useful.', b: '+20% Gold found', col: '#059669', affinityBonuses: [], gear: null, base: { mhp: 70, atk: 10, def: 4, spd: 9 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } },
    { n: 'Mezstorm', t: 'Stormsinger', r: 'Mage', hp: 60, mhp: 60, atk: 12, def: 3, spd: 6, on: false, ul: 3, d: 'A wandering storm mage seeking purpose. He speaks to the storm. Sometimes, it answers. He was Mez once — your middle sister, estranged, hard, distant. The magic made a mistake. Rendered her male, like Edwin in the old tales. The memories are ghost-images now. Vague. Painful. Present.', b: '+15% Spell damage', col: '#0891b2', affinityBonuses: [], gear: null, base: { mhp: 60, atk: 12, def: 3, spd: 6 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } },
    { n: 'Eliz', t: 'Little Healer', r: 'Healer', hp: 65, mhp: 65, atk: 4, def: 5, spd: 5, on: false, ul: 4, d: 'A gentle soul with hands that mend wounds. She is your niece, Mez\'s daughter, autistic in the old world — which here means she experiences magic in textures and colors no one else can perceive. She cannot be reduced below 1 HP — a Guardian Spirit, the game calls it. You call it Eliz being Eliz. The girl who has always endured.', b: '+25% Healing potency. Guardian Spirit: Cannot be reduced below 1 HP.', col: '#db2777', passive: 'guardian_spirit', resurrect: { name: 'Breath of Life', cooldown: 0, maxCooldown: 5, healPct: 0.5, desc: 'Revives a fallen ally with 50% HP. 5-turn cooldown.' }, affinityBonuses: [], gear: null, base: { mhp: 65, atk: 4, def: 5, spd: 5 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } },
    { n: 'Senedra', t: 'Swift Scout', r: 'Ranger', hp: 75, mhp: 75, atk: 8, def: 5, spd: 10, on: false, ul: 6, d: 'An eagle-eyed tracker from the northern woods. She learned this from her mother. From Aisyah. She finds secret paths where others see only walls. She offers you pemmican and speaks of trade routes and dried goods. The real money is in dried goods. They travel. They last. They sell.', b: '+20% Crit chance', col: '#ca8a04', affinityBonuses: [], gear: null, base: { mhp: 75, atk: 8, def: 5, spd: 10 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } },
    { n: 'Zaki', t: 'Young Blade', r: 'Warrior', hp: 100, mhp: 100, atk: 9, def: 6, spd: 6, on: false, ul: 8, d: 'A hot-headed swordsman with a heart of gold. He is young. The firelight makes him look younger. He checks his pack seventeen times. Nervous, he admits. You tell him it is okay. You tell him checking is a kind of love. He wants to be brave like you. You do not feel brave. You feel tired. But you smile anyway.', b: '+15% Attack speed', col: '#dc2626', affinityBonuses: [], gear: null, base: { mhp: 100, atk: 9, def: 6, spd: 6 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } },
    { n: 'Soel', t: 'The Familiar', r: 'Support', hp: 55, mhp: 55, atk: 5, def: 4, spd: 8, on: false, ul: 10, d: 'Your loyal spirit cat companion. He came with the rain. He chose you. That is rare. That is everything. He is not merely a cat. He is a spirit. He is a choice made flesh. He is the space between San and Joel — the letters overlapping, the sounds merging. He cannot be killed — he reforms from spirit flame.', b: '+10% All stats · Spirit Cat (unkillable)', col: '#7c2d12', spiritCat: true, affinityBonuses: [], gear: null, base: { mhp: 55, atk: 5, def: 4, spd: 8 }, eq: { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null } }
  ],

  partySynergies: [
    { members: ['Joel', 'Aisyah'], name: 'Shield & Blade', desc: 'Childhood bond. +15% DEF for all.', bonus: { defPct: 0.15 }, icon: '🛡️🗡️' },
    { members: ['Joel', 'San'], name: 'Partners in Storm', desc: 'Unwavering trust. +10% Max HP for party.', bonus: { hpPct: 0.10 }, icon: '💜' },
    { members: ['Aisyah', 'San'], name: 'Sisterblade Bond', desc: 'Shared blood. +20% Gold from combat.', bonus: { goldPct: 0.20 }, icon: '💚' },
    { members: ['Mezstorm', 'Eliz'], name: 'Storm & Light', desc: 'Magic harmony. +10% spell damage, +15% healing.', bonus: { spellDmgPct: 0.10, healPct: 0.15 }, icon: '⚡💚' },
    { members: ['Senedra', 'Soel'], name: 'Scout & Familiar', desc: 'Keen senses. +25% crit chance, find secret loot.', bonus: { critPct: 0.25, secretLoot: true }, icon: '🏹🐱' },
    { members: ['Zaki', 'Joel'], name: 'Warrior Wall', desc: 'Two shields. +20% DEF, damage reduction.', bonus: { defPct: 0.20, dmgRed: 0.10 }, icon: '🛡️⚔️' },
    { members: ['Soel', 'San'], name: 'Familiar Bond', desc: 'Soul-linked. +5% all stats.', bonus: { allStatsPct: 0.05 }, icon: '🐱💜' },
    { members: ['Eliz', 'San'], name: "Healer's Grace", desc: "San's aura soothes. +20% healing potency.", bonus: { healPct: 0.20 }, icon: '💚💜' }
  ],

  affinityUnlocks: {
    Joel: [
      { th: 40, id: 'steadfast', n: 'Steadfast', d: '+10% Max HP', fx: { hpPct: 0.10 } },
      { th: 70, id: 'shield_oath', n: 'Shield Oath', d: 'Taunt chance rises to 70%', fx: { taunt: true } },
      { th: 100, id: 'unbreakable', n: 'Unbreakable', d: 'Auto-revive once per rest', fx: { revive: true } },
      { th: 150, id: 'guardians_resolve', n: "Guardian's Resolve", d: '+15% Max HP', fx: { hpPct: 0.15 } },
      { th: 200, id: 'eternal_shield', n: 'Eternal Shield', d: '+20% Max HP, +5 DEF', fx: { hpPct: 0.20, def: 5 } }
    ],
    Aisyah: [
      { th: 40, id: 'quick_fingers', n: 'Quick Fingers', d: '+10% Gold found', fx: { goldPct: 0.10 } },
      { th: 70, id: 'treasure_sense', n: 'Treasure Sense', d: '+15% Gold found', fx: { goldPct: 0.15 } },
      { th: 100, id: 'dragons_hoard', n: "Dragon's Hoard", d: '+25% Gold found', fx: { goldPct: 0.25 } },
      { th: 150, id: 'silver_tongue', n: 'Silver Tongue', d: '+20% Gold found', fx: { goldPct: 0.20 } },
      { th: 200, id: 'golden_touch', n: 'Golden Touch', d: '+35% Gold found', fx: { goldPct: 0.35 } }
    ],
    Mezstorm: [
      { th: 40, id: 'storm_focus', n: 'Storm Focus', d: '+10% Spell damage', fx: { spellDmgPct: 0.10 } },
      { th: 70, id: 'eye_of_storm', n: 'Eye of the Storm', d: '+15% Spell damage', fx: { spellDmgPct: 0.15 } },
      { th: 100, id: 'tempest_soul', n: 'Tempest Soul', d: '+25% Spell damage', fx: { spellDmgPct: 0.25 } },
      { th: 150, id: 'storm_lord', n: 'Storm Lord', d: '+20% Spell damage', fx: { spellDmgPct: 0.20 } },
      { th: 200, id: 'tempest_incarnate', n: 'Tempest Incarnate', d: '+35% Spell damage', fx: { spellDmgPct: 0.35 } }
    ],
    Eliz: [
      { th: 40, id: 'gentle_hands', n: 'Gentle Hands', d: '+10% Healing potency', fx: { healPct: 0.10 } },
      { th: 70, id: 'lightweaver', n: 'Lightweaver', d: '+15% Healing potency', fx: { healPct: 0.15 } },
      { th: 100, id: 'angelic_grace', n: 'Angelic Grace', d: '+25% Healing potency', fx: { healPct: 0.25 } },
      { th: 150, id: 'radiant_heart', n: 'Radiant Heart', d: '+20% Healing potency', fx: { healPct: 0.20 } },
      { th: 200, id: 'divine_grace', n: 'Divine Grace', d: '+35% Healing potency', fx: { healPct: 0.35 } }
    ],
    Senedra: [
      { th: 40, id: 'eagle_eye', n: 'Eagle Eye', d: '+10% Crit chance', fx: { critPct: 0.10 } },
      { th: 70, id: 'deadeye', n: 'Deadeye', d: '+15% Crit chance', fx: { critPct: 0.15 } },
      { th: 100, id: 'storms_arrow', n: "Storm's Arrow", d: '+25% Crit chance', fx: { critPct: 0.25 } },
      { th: 150, id: 'hawks_precision', n: "Hawk's Precision", d: '+20% Crit chance', fx: { critPct: 0.20 } },
      { th: 200, id: 'perfect_shot', n: 'Perfect Shot', d: '+35% Crit chance', fx: { critPct: 0.35 } }
    ],
    Zaki: [
      { th: 40, id: 'iron_discipline', n: 'Iron Discipline', d: '+3 DEF', fx: { def: 3 } },
      { th: 70, id: 'battle_hardened', n: 'Battle Hardened', d: '+15% Max HP', fx: { hpPct: 0.15 } },
      { th: 100, id: 'immortal_wall', n: 'Immortal Wall', d: '+5 DEF, +3 ATK', fx: { def: 5, atk: 3 } },
      { th: 150, id: 'unbroken_will', n: 'Unbroken Will', d: '+8 DEF, +5 ATK', fx: { def: 8, atk: 5 } },
      { th: 200, id: 'legendary_blade', n: 'Legendary Blade', d: '+10 DEF, +8 ATK', fx: { def: 10, atk: 8 } }
    ],
    Soel: [
      { th: 40, id: 'warm_presence', n: 'Warm Presence', d: '+10 HP, +2 DEF', fx: { hp: 10, def: 2 } },
      { th: 70, id: 'spirit_vigil', n: 'Spirit Vigil', d: '+3 ATK, +2 DEF', fx: { atk: 3, def: 2 } },
      { th: 100, id: 'nine_lives', n: 'Nine Lives', d: '+25% Max HP, +3 DEF', fx: { hpPct: 0.25, def: 3 } },
      { th: 150, id: 'ancient_spirit', n: 'Ancient Spirit', d: '+30% Max HP, +4 DEF', fx: { hpPct: 0.30, def: 4 } },
      { th: 200, id: 'eternal_familiar', n: 'Eternal Familiar', d: '+40% Max HP, +5 DEF, +5 ATK', fx: { hpPct: 0.40, def: 5, atk: 5 } }
    ]
  },

  // === HIDDEN GROWTH ABILITIES ===
  // One signature ACTIVE ability per party member, unlocked by player LEVEL (not affinity).
  // Unlike affinityUnlocks (passive % bonuses, visible once unlocked), these stay hidden from
  // the UI — name and description included — until the moment they first trigger in combat.
  // Discovery is permanent once it happens; the ability itself is usable once per rest.
  growthAbilities: {
    Zaki: { id: 'nervous_courage', n: 'Nervous Courage', unlockAt: 15,
      d: "When everyone else has fallen and it's just him and San left standing, the boy who checked his pack seventeen times finds he doesn't need to anymore. +6 ATK, +4 DEF for the rest of the fight." },
    Eliz: { id: 'space_between', n: 'The Space Between', unlockAt: 18,
      d: 'When her own strength gives out, Eliz finds one more reserve — a burst of light that steadies the whole party, once, when she needs it most herself.' },
    Joel: { id: 'last_stand', n: 'Last Stand', unlockAt: 22,
      d: 'The one time it would actually kill San, Joel is already there. He takes the blow instead. Once per rest.' },
    Aisyah: { id: 'long_con', n: 'The Long Con', unlockAt: 26,
      d: "A perfect strike, and her hand is already in the enemy's pocket before they hit the ground. Landing a critical hit has a chance to skim bonus gold from the encounter." },
    Mezstorm: { id: 'stormcallers_gambit', n: "Stormcaller's Gambit", unlockAt: 30,
      d: "When San's magic runs dangerously low, the storm sometimes answers anyway — the next spell costs nothing." },
    Senedra: { id: 'storms_mark', n: "Storm's Mark", unlockAt: 35,
      d: 'A critical hit marks the target. Her aim is good enough that San\'s next strike against a marked foe is guaranteed to land true.' },
    Soel: { id: 'the_choice', n: 'The Choice', unlockAt: 45,
      d: "When the whole party is on the edge at once — San included — Soel remembers why he chose all of you. Once per rest, everyone is pulled back from the brink together." }
  },
  discoveredAbilities: [], // ids from growthAbilities that have fired at least once
  growthAbilityUsed: {}, // per-rest cooldown flags, keyed by growthAbilities id

  secretAreas: {
    'Whispering Woods': {
      name: 'Moss-Covered Ruin',
      desc: 'Senedra spots crumbling stonework beneath the ivy. Something glints inside.',
      choices: [
        { id: 'careful', label: 'Search Carefully', risk: 'low', loot: { common: 0.7, uncommon: 0.25, rare: 0.05 } },
        { id: 'rush', label: 'Rush In', risk: 'high', loot: { common: 0.3, uncommon: 0.45, rare: 0.25 }, ambushChance: 0.35 }
      ],
      lootPool: [
        { n: 'Ancient Herb', t: 'mat', q: 1, r: 'common', weight: 3 },
        { n: 'Moss Agate', t: 'mat', q: 1, r: 'uncommon', weight: 2 },
        { n: "Dryad's Ring", slot: 'ring', int: 2, r: 'rare', weight: 1 }
      ]
    },
    'Ember Peak': {
      name: 'Forgotten Forge',
      desc: 'Senedra shields her eyes from the heat. An anvil stands in the lava glow, tools still warm.',
      choices: [
        { id: 'careful', label: 'Wait for Cooldown', risk: 'low', loot: { common: 0.4, uncommon: 0.4, rare: 0.2 } },
        { id: 'rush', label: 'Grab and Run', risk: 'high', loot: { common: 0.1, uncommon: 0.3, rare: 0.6 }, ambushChance: 0.45 }
      ],
      lootPool: [
        { n: 'Slag Metal', t: 'mat', q: 2, r: 'common', weight: 3 },
        { n: 'Ember Coal', t: 'mat', q: 1, r: 'uncommon', weight: 2 },
        { n: "Forge Master's Hammer", slot: 'weapon', atk: 12, r: 'rare', weight: 1 }
      ]
    },
    'Arcane Planar Tower': {
      name: 'The Fractured Observatory',
      desc: 'Senedra spots a balcony that should not exist — jutting into a starscape that is not your own. A telescope of bone and crystal points at something vast and watching.',
      choices: [
        { id: 'careful', label: 'Study the Telescope', risk: 'low', loot: { common: 0.3, uncommon: 0.4, rare: 0.3 } },
        { id: 'rush', label: 'Touch the Lens', risk: 'high', loot: { common: 0.1, uncommon: 0.2, rare: 0.7 }, ambushChance: 0.5 }
      ],
      lootPool: [
        { n: 'Chrono Sand', t: 'mat', q: 1, r: 'epic', weight: 2 },
        { n: 'Aether Shard', t: 'mat', q: 2, r: 'rare', weight: 3 },
        { n: 'Planar Lens', slot: 'amulet', int: 4, arcaneDmg: 4, r: 'epic', weight: 1 }
      ]
    }
  },

  skillTrees: {
    pyromancer: {
      name: 'Pyromancer',
      icon: '🔥',
      desc: 'Mastery of flame. Burn the world clean.',
      color: '#ef4444',
      tiers: [
        { level: 3, name: 'Inferno Touch', desc: 'Fireball cost -5 MP. Burn chance +20%.', effects: { fireballCostReduction: 5, burnChanceBonus: 0.20 } },
        { level: 5, name: 'Wildfire', desc: 'Fire spells have 25% chance to chain to adjacent enemy.', effects: { wildfireChance: 0.25, wildfireDmg: 0.5 } },
        { level: 8, name: 'Phoenix Rising', desc: 'When HP drops below 20%, auto-cast Meteor Swarm once per combat.', effects: { phoenixRising: true, phoenixHpThreshold: 0.20 } }
      ]
    },
    cryomancer: {
      name: 'Cryomancer',
      icon: '❄️',
      desc: 'Mastery of ice. Freeze time itself.',
      color: '#3b82f6',
      tiers: [
        { level: 3, name: 'Frozen Core', desc: 'Frost Shield duration +2 turns. +3 DEF while active.', effects: { frostShieldDuration: 2, frostShieldDefBonus: 3 } },
        { level: 5, name: 'Absolute Zero', desc: 'Ice spells have 30% chance to freeze enemy (skip 2 turns).', effects: { freezeChance: 0.30, freezeTurns: 2 } },
        { level: 8, name: 'Glacial Aegis', desc: 'When hit, 20% chance to auto-cast Frost Shield (free, once per 3 turns).', effects: { glacialAegisChance: 0.20, glacialAegisCooldown: 3 } }
      ]
    },
    stormcaller: {
      name: 'Stormcaller',
      icon: '⚡',
      desc: 'Mastery of lightning. Strike before they blink.',
      color: '#eab308',
      tiers: [
        { level: 3, name: 'Static Charge', desc: 'Lightning Strike cost -8 MP. Shock duration +1 turn.', effects: { lightningCostReduction: 8, shockDurationBonus: 1 } },
        { level: 5, name: 'Chain Lightning', desc: 'Lightning spells hit 2 enemies (50% dmg to second).', effects: { chainLightning: true, chainLightningDmg: 0.5 } },
        { level: 8, name: 'Thunderlord', desc: 'Crit chance +15%. Crits with lightning refund 50% MP.', effects: { thunderlordCritBonus: 0.15, thunderlordMpRefund: 0.5 } }
      ]
    }
  },

  miniStories: [
    {
      id: 'varn_merchant',
      name: 'Varn',
      title: 'Lost Merchant',
      icon: '🧳',
      zones: ['Whispering Woods', 'Cursed Catacombs'],
      chance: 0.12,
      dialogue: [
        { speaker: 'Varn', text: "A shivering merchant huddles by a dead campfire. 'Took a wrong turn at the crossroads. Name's Varn. You... you look like you've seen worse.'" }
      ],
      choices: [
        { label: 'Share your rations', cost: { item: 'Herb Bundle', qty: 1 }, reward: { affinity: 'Joel', amt: 20, xp: 15 }, response: "Varn's eyes soften. 'Not many would. Your friend there — the big one — he's lucky to have you.'" },
        { label: 'Trade for information', cost: { gold: 10 }, reward: { xp: 25, info: 'hazard_hint' }, response: "Varn leans close. 'The Catacombs? Stay near the walls. The dead don't like tight spaces.'" },
        { label: 'Keep moving', cost: {}, reward: {}, response: "Varn nods, unsurprised. 'Survival first. I'll remember your face.'" }
      ]
    },
    {
      id: 'mira_child',
      name: 'Mira',
      title: 'Lost Child',
      icon: '👧',
      zones: ['Whispering Woods', 'Cursed Catacombs'],
      chance: 0.15,
      dialogue: [
        { speaker: 'Mira', text: "A small girl sits on a mossy log, hugging a wooden doll. 'Mama said wait here. She went to find water. That was...' She counts on her fingers. '...a lot of sleeps ago.'" }
      ],
      choices: [
        { label: 'Give her your cloak', cost: {}, reward: { affinity: 'Aisyah', amt: 30, xp: 25 }, response: "Mira wraps the cloak around herself like armor. 'It smells like outside. Like before.' She hands you the doll. 'Keep Mr. Buttons safe. He's brave, but he gets scared.'" },
        { label: 'Escort her to safety', cost: {}, reward: { xp: 50, gold: 20, karma: 1 }, response: "You walk her to the forest edge. A search party finds you — tearful, grateful. The reward is small. The look on her mother's face is not." },
        { label: 'Ignore her', cost: {}, reward: { karma: -1 }, response: "You walk past. Mira doesn't call out. She's used to being invisible. Soel hisses at you from your pack. Even he knows better." }
      ]
    },
    {
      id: 'soel_ghost',
      name: '???',
      title: "The Familiar's Echo",
      icon: '🐱',
      zones: ['Frostspire Ruins', 'Starlight Spire'],
      chance: 0.05,
      reqParty: 'Soel',
      dialogue: [
        { speaker: '???', text: "The air shimmers. A cat that is not Soel — but looks like him, older, translucent — sits on a frost-covered throne. 'You took good care of him,' the echo says. 'Better than I expected. Better than I did.' The not-Soel blinks slowly. 'He chose you. That's rare. That's... everything.'" }
      ],
      choices: [
        { label: 'Ask who you are', cost: {}, reward: { xp: 60, affinity: 'Soel', amt: 40 }, response: "The echo fades, smiling. 'Someone who failed. Someone who hopes you won't. Tell him... tell him the warm spots were worth it. All of them.' The throne is empty. Soel purrs louder than usual for hours." },
        { label: 'Reach for him', cost: {}, reward: { item: { n: 'Starlight Tear', t: 'mat', q: 1, r: 'rare' }, xp: 40 }, response: "Your hand passes through, but something warm lingers. A single crystal tear falls into your palm. 'For the days when you forget why you fight,' the echo whispers. Then silence." },
        { label: 'Stay silent', cost: {}, reward: { xp: 30 }, response: "The echo nods, as if you answered perfectly. 'Good. He chose well. Silence is a kind of love too.' The frost melts where he sat. Soel jumps into your arms, trembling. You hold him until he stops." }
      ]
    },
    {
      id: 'planar_scholar',
      name: 'Kael',
      title: 'The Last Astronomer',
      icon: '🔭',
      zones: ['Arcane Planar Tower', 'Starlight Spire'],
      chance: 0.08,
      reqParty: 'Mezstorm',
      dialogue: [
        { speaker: 'Kael', text: "A gaunt figure hunches over a telescope pointed at nothing. 'The stars are wrong,' he whispers. 'They have been wrong since the tower rose.'" }
      ],
      choices: [
        { label: 'Share planar observations', cost: { item: 'Planar Essence', qty: 1 }, reward: { affinity: 'Mezstorm', amt: 25, xp: 80, item: { n: 'Chrono Sand', t: 'mat', q: 1, r: 'epic' } }, response: "Kael's eyes widen. 'You have been inside the rift. You have seen what I see.' He presses a vial of sand into your hand. 'Time is currency here. Spend it wisely.'" },
        { label: 'Ask about the Planarch', cost: {}, reward: { xp: 60, info: 'planarch_hint' }, response: "Kael laughs — a dry, broken sound. 'The Planarch is not a creature. It is a wound. A place where too many dimensions touched, and something woke up.'" },
        { label: 'Leave him to his stars', cost: {}, reward: {}, response: "Kael does not look up as you leave. 'They are all leaving,' he murmurs to the empty sky. 'Eventually, everyone leaves.'" }
      ]
    }
  ],

 
    cbt: { on: false, turn: 0, en: [], sk: 0, tg: 0, autoFlee: false, autoCombat: false },
  autoCombatHeartbeat: 0,

  zones: [
    { n: 'Whispering Woods', lv: 1, d: 'Mossy paths where goblins lurk.', en: ['Goblin','Wolf','Slime'], loot: ['Herb Bundle','Goblin Tooth','Health Potion'], xp: 15, dg: 'low' },
    { n: 'Cursed Catacombs', lv: 2, d: 'Ancient tombs filled with restless dead.', en: ['Skeleton','Zombie','Ghost'], loot: ['Iron Ore','Bone Shard','Mana Potion'], xp: 30, dg: 'medium' },
    { n: 'Crystal Caverns', lv: 3, d: 'Shimmering caves where crystal spiders weave.', en: ['Crystal Spider','Gem Golem','Shimmer Bat'], loot: ['Crystal Shard','Silk Thread','Gem Dust'], xp: 45, dg: 'medium' },
    { n: 'Ember Peak', lv: 4, d: 'Volcanic caves with fire elementals.', en: ['Fire Imp','Lava Slug','Ash Wraith'], loot: ['Fire Essence','Obsidian','Phoenix Feather'], xp: 60, dg: 'high' },
    { n: 'Stormhold', lv: 5, d: 'A crumbling fortress lashed by eternal lightning.', en: ['Storm Wraith','Lightning Hound','Thunder Knight'], loot: ['Storm Core','Conductive Wire','Static Orb'], xp: 80, dg: 'high' },
    { n: 'Frostspire Ruins', lv: 6, d: 'Frozen castle of a fallen ice lord.', en: ['Ice Elemental','Frost Wolf','Frozen Knight'], loot: ['Ice Crystal','Frost Gem','Glacial Staff'], xp: 100, dg: 'very high' },
    { n: 'Sunken Temple', lv: 7, d: 'An underwater ruin swallowed by the sea.', en: ['Drowned Sailor','Sea Serpent','Coral Golem'], loot: ['Pearl','Coral Branch','Aqua Pearl'], xp: 130, dg: 'very high' },
    { n: 'Abyssal Depths', lv: 8, d: 'The void between worlds. Only the brave enter.', en: ['Void Beast','Shadow Demon','Abyssal Horror'], loot: ['Void Essence','Dark Crystal','Abyssal Robe'], xp: 200, dg: 'extreme' },
    { n: "Dragon's Maw", lv: 9, d: 'The lair of an ancient dragon. Ash falls like snow.', en: ['Dragon Whelp','Ash Drake','Elder Wyrm'], loot: ['Dragon Scale','Wyrm Tooth','Ember Heart'], xp: 280, dg: 'extreme' },
    { n: 'Starlight Spire', lv: 10, d: 'A tower that touches the sky. The final challenge.', en: ['Star Sentinel','Celestial Knight','Astral Lord'], loot: ['Star Fragment','Celestial Dust','Astral Core'], xp: 400, dg: 'impossible' },
    { n: 'Arcane Planar Tower', lv: 11, d: 'A spire torn between dimensions. Reality frays here — gravity shifts, time stutters, and the walls breathe with planar magic.', en: ['Planar Wisp','Rift Stalker','Aether Golem','Chronomancer','Void Weaver','Planar Leviathan'], loot: ['Planar Essence','Aether Shard','Chrono Sand','Void Thread','Reality Anchor'], xp: 500, dg: 'impossible' },
    // PHASE 2: PLANAR REALMS (Lv 12-20)
    { n: 'The Shattered Veil', lv: 12, elem: 'arcane', d: 'Reality tears at the seams. Fragments of dead worlds float in crystalline silence.', en: ['Veil Wraith','Shardling','Echo Walker'], loot: ['Planar Essence','Aether Shard','Reality Fragment'], xp: 180, dg: 'impossible' },
    { n: 'Emberfall Dimension', lv: 13, elem: 'fire', d: 'A realm where gravity pulls downward into an infinite inferno. Ash rains upward.', en: ['Ember Drake','Ash Titan','Flame Serpent'], loot: ['Ember Core','Ash Crystal','Inferno Gem'], xp: 220, dg: 'impossible' },
    { n: 'Frostbound Eternity', lv: 14, elem: 'ice', d: "Time itself freezes here. Every snowflake contains a frozen moment of someone's death.", en: ['Frost Lich','Glacial Behemoth','Snow Revenant'], loot: ['Eternal Ice','Frozen Tear','Glacial Heart'], xp: 260, dg: 'impossible' },
    { n: "Stormcaller's Cradle", lv: 15, elem: 'lightning', d: "Lightning births new life in this storm-womb. Everything here crackles with potential.", en: ['Storm Titan','Lightning Wraith','Thunderborn'], loot: ['Storm Heart','Conductive Crystal','Thunder Pearl'], xp: 300, dg: 'impossible' },
    { n: 'The Void Between', lv: 16, elem: 'void', d: "The space between dimensions. Not empty — hungry. It remembers what you've lost.", en: ['Void Leviathan','Null Elemental','Hungering Maw'], loot: ['Void Essence','Null Shard','Hunger Crystal'], xp: 340, dg: 'impossible' },
    { n: 'Chronos Spire', lv: 17, elem: 'arcane', d: 'A tower where past, present, and future exist simultaneously. You fight yourself — or will.', en: ['Time Echo','Chronomancer Lord','Paradox Wraith'], loot: ['Chrono Sand','Time Shard','Paradox Gem'], xp: 380, dg: 'impossible' },
    { n: 'Aetherium Gardens', lv: 18, elem: 'arcane', d: 'Floating gardens of pure magic. The flowers sing. The water thinks. Beauty that kills.', en: ['Aether Bloom','Mana Leviathan','Crystal Serpent'], loot: ['Aether Nectar','Mana Bloom','Crystal Lotus'], xp: 420, dg: 'impossible' },
    { n: 'The Convergence', lv: 19, elem: 'arcane', d: 'All planar energies meet here. The air shimmers with conflicting resonances. Reality is thin.', en: ['Convergence Avatar','Planar Chimera','Resonance Horror'], loot: ['Convergence Shard','Planar Alloy','Resonance Crystal'], xp: 460, dg: 'impossible' },
    { n: 'The Nexus', lv: 20, elem: 'arcane', d: "The heart of all dimensions. The Planarch waits here — or what remains of it. Five phases. No mercy.", en: ['Nexus Guardian','Planar Titan','The Nexus Planarch'], loot: ['Nexus Core','Planar Crown','Reality Key'], xp: 500, dg: 'impossible' },

        // === EXPANSION: LV 21+ ZONES ===
    { n: 'The Fractured Veil', lv: 21, elem: 'arcane', d: 'Reality tears at the seams. Fragments of dead worlds float in crystalline silence.', en: ['Veil Wraith','Shardling','Echo Walker'], loot: ['Planar Essence','Aether Shard','Reality Fragment'], xp: 550, dg: 'impossible' },
        // === PHASE 1 EXPANSION: LV 22-23 ZONES ===
    { n: 'The Astral Maelstrom', lv: 22, elem: 'arcane', d: 'A storm of raw planar energy where dimensions collide and unravel. Reality here is a suggestion, not a rule.', en: ['Astral Construct','Void Hound','Phase Walker','Rift Rat'], loot: ['Astral Dust','Void Fragment','Planar Essence','Reality Anchor'], xp: 600, dg: 'impossible' },
        { n: 'Infernal Crucible', lv: 23, elem: 'fire', d: 'The forge where stars are born and die. Magma rivers flow upward into a sky of eternal flame.', en: ['Ember Wraith','Ash Phantom','Flame Serpent','Magma Titan'], loot: ['Inferno Gem','Ash Crystal','Ember Core','Phoenix Ash'], xp: 680, dg: 'impossible' },

    // === GAP FILLERS ===
    { n: 'Serpent\'s Coil', lv: 9, elem: 'poison', d: 'A labyrinth of venomous tunnels where basilisks breed. The air is thick with neurotoxin.', en: ['Basilisk','Venom Hound','Mire Serpent'], loot: ['Serpent Scale','Venom Sac','Basilisk Eye'], xp: 250, dg: 'extreme' },
    { n: 'The Fulcrum', lv: 15, elem: 'arcane', d: 'A floating nexus where all planar energies briefly stabilize before diverging again.', en: ['Fulcrum Warden','Stasis Construct','Planar Mote'], loot: ['Fulcrum Shard','Stasis Crystal','Planar Mote'], xp: 320, dg: 'impossible' },

    // === PHASE 3: LV 24-29 ===
    { n: 'The Scorched Vein', lv: 24, elem: 'fire', d: 'A canyon of molten glass where the earth bleeds magma. The heat warps reality itself.', en: ['Magma Serpent','Glass Wraith','Scorch Titan'], loot: ['Magma Core','Glass Shard','Scorched Ember'], xp: 520, dg: 'impossible' },
    { n: 'Tidal Abyss', lv: 25, elem: 'ice', d: 'An ocean trench frozen in time. Pressure crushes; the cold preserves everything, even screams.', en: ['Abyssal Leviathan Spawn','Frozen Kraken','Pressure Golem'], loot: ['Abyssal Pearl','Frozen Ink','Pressure Stone'], xp: 560, dg: 'impossible' },
    { n: 'The Shattered Crown', lv: 26, elem: 'lightning', d: 'The ruins of a sky-kingdom, shattered by hubris. Lightning still seeks the throne.', en: ['Storm Sovereign Remnant','Crown Wraith','Skyfall Construct'], loot: ['Crown Fragment','Sovereign Essence','Skyfall Ore'], xp: 600, dg: 'impossible' },
    { n: 'The Hollow Throne', lv: 27, elem: 'void', d: 'A palace built in the space between dimensions. The throne is empty. The throne is hungry.', en: ['Throne Keeper','Hollow Knight','Void Courtier'], loot: ['Throne Shard','Hollow Crown','Void Silk'], xp: 640, dg: 'impossible' },
    { n: 'The Final Spire', lv: 28, elem: 'arcane', d: 'The last tower before the apex of all realities. Gravity is optional. Time is a suggestion.', en: ['Spire Archon','Reality Weaver Elite','Chrono Guardian'], loot: ['Spire Keystone','Reality Thread','Chrono Crystal'], xp: 680, dg: 'impossible' },
    { n: 'The Apex', lv: 29, elem: 'arcane', d: 'The highest point in all dimensions. Beyond this, only the story remains. The final gate.', en: ['Apex Warden','Final Construct','The Gatekeeper'], loot: ['Apex Fragment','Final Key','Gate Stone'], xp: 720, dg: 'impossible' },

    // === ACT 1: THE SHATTERED NOW (LV 30-35) ===
    { n: 'The Breaking', lv: 30, elem: 'void', d: 'The instant the Nexus Planarch fell silent, something else woke up. Not a victory — a wound torn wide open. You and Joel feel young again, absurdly, terribly young, and then the world you knew is gone.', en: ['Fracture Wisp','Splinter Hound','Collapse Warden'], loot: ['Fracture Shard','Splinter Core','Collapse Dust'], xp: 780, dg: 'impossible' },
    { n: 'The Silent Ruin', lv: 31, elem: 'none', d: 'Aethon, or what is left of it. No birdsong. No market noise. Just wind through broken stone and the particular silence of a world that gave up waiting for you.', en: ['Ruin Stalker','Ash Scavenger','Broken Sentinel'], loot: ['Ruin Dust','Ash Cloth','Sentinel Core'], xp: 820, dg: 'impossible' },
    { n: 'Ashfall Market', lv: 32, elem: 'fire', d: "Aisyah's trade routes, looted bare. Ash falls like snow over stalls that once smelled of spice and gold. Someone is still trading here. You are not sure they are still people.", en: ['Market Looter','Ash Peddler','Burnt Enforcer'], loot: ['Scorched Coin','Peddler\'s Ledger','Enforcer Badge'], xp: 860, dg: 'impossible' },
    { n: 'The Drowned Ledger', lv: 33, elem: 'ice', d: 'A flooded counting-house where numbers that never balanced have taken shape and teeth. The water never recedes. Neither does the debt.', en: ['Ledger Wraith','Sunken Auditor','Debt Collector'], loot: ['Waterlogged Ledger','Auditor\'s Seal','Sunken Coinpurse'], xp: 900, dg: 'impossible' },
    { n: 'Rustbound Docks', lv: 34, elem: 'lightning', d: "Joel's overtime, given a place to live. Cranes that never stop moving, shifts that never end, a foreman who never clocks out. The machinery hums with exhaustion made electric.", en: ['Rust Automaton','Dockhand Wraith','Overtime Specter'], loot: ['Rusted Gear','Timecard Fragment','Overtime Chit'], xp: 940, dg: 'impossible' },
    { n: "The Widow's Watch", lv: 35, elem: 'arcane', d: 'A lighthouse on a coast that no longer exists, where someone has been watching for a letter that never came. You recognize the shape of the watcher before you recognize the grief.', en: ['Watching Echo','Silent Mourner','Grief Warden'], loot: ['Watcher\'s Lantern','Mourner\'s Veil','Unsent Letter'], xp: 1000, dg: 'impossible' },

    // === ACT 2: THE LONG SILENCE (LV 36-40) ===
    { n: 'Forgotten Pemmican Roads', lv: 36, elem: 'none', d: "Senedra's trade paths, walked by no one now. The waymarkers still stand. The dried goods still sell themselves to nobody, in stalls nobody tends, on a road that forgot it once led somewhere.", en: ['Road Wraith','Pack Beast Husk','Toll Ghost'], loot: ['Faded Waymarker', 'Dried Ration Tin', 'Tollkeeper\'s Ledger'], xp: 1060, dg: 'impossible' },
    { n: 'The Quiet Nursery', lv: 37, elem: 'void', d: 'A room built for a child who never got caught in time. The colors here are the ones Eliz always described — magic in textures no one else could perceive — except now there is no one left to perceive them at all.', en: ['Nursery Wraith','Uncaught Echo','Quiet Sentinel'], loot: ['Cracked Rattle', 'Unfinished Blanket', 'Guardian\'s Last Light'], xp: 1120, dg: 'impossible' },
    { n: 'Bladeless Barracks', lv: 38, elem: 'fire', d: 'Zaki trained here, once, checking his pack seventeen times. The barracks that stand now belong to someone harder, someone who stopped checking a long time ago and never told you why.', en: ['Burnt Recruit','Barracks Wraith','Hollow Drillmaster'], loot: ['Scorched Training Blade', 'Nervous Boy\'s Charm', 'Drillmaster\'s Whistle'], xp: 1180, dg: 'impossible' },
    { n: 'The Storm That Stayed', lv: 39, elem: 'lightning', d: 'Mezstorm\'s estrangement, given weather. A storm that never broke, never passed, never once let the sky remember what it looked like before the distance began.', en: ['Stormbound Wraith','Thunder Remnant','Static Husk'], loot: ['Frozen Lightning', 'Estranged Letter', 'Storm-Sealed Locket'], xp: 1240, dg: 'impossible' },
    { n: "Embercat's Grave", lv: 40, elem: 'fire', d: 'A place that should not exist — Soel reforms from spirit flame, always, everywhere. And yet here is a grave, and here is an ember guttering low, and here is proof that even the unkillable can be forgotten if enough time passes without anyone remembering to choose them.', en: ['Guttering Wisp','Fading Ember','Forgotten Familiar'], loot: ['Cooling Ember', 'Unraveled Collar', 'The Last Purr'], xp: 1300, dg: 'impossible' },
  ],

  // Zone hazards: environmental dangers that trigger during combat
  zoneHazards: {
    'Ember Peak': { name: 'Lava Vent', chance: 0.20, type: 'damage', dmg: 5, elem: 'fire', msg: 'A lava vent erupts beneath the party!', desc: '20% chance per turn: 5 fire damage to all' },
    'Stormhold': { name: 'Lightning Strike', chance: 0.10, type: 'damage', dmg: 8, elem: 'lightning', msg: 'Lightning forks from the storm clouds!', desc: '10% chance per turn: 8 lightning damage to random member' },
    'Frostspire Ruins': { name: 'Freezing Wind', chance: 0.15, type: 'freeze', turns: 1, msg: 'A bone-chilling wind sweeps through!', desc: '15% chance per turn: freeze a random member (skip next turn)' },
    'Abyssal Depths': { name: 'Void Corruption', chance: 0.05, type: 'mana_drain', drain: 3, msg: 'The void hungers...', desc: '5% chance per turn: drain 3 MP from all' },
    'Sunken Temple': { name: 'Drowning Pressure', chance: 0.12, type: 'damage', dmg: 4, elem: 'none', msg: 'The water pressure surges!', desc: '12% chance per turn: 4 damage to all (water pressure)' },
    'Arcane Planar Tower': { name: 'Reality Fracture', chance: 0.18, type: 'damage', dmg: 12, elem: 'arcane', msg: 'Reality tears open — raw planar energy surges through the battlefield!', desc: '18% chance per turn: 12 arcane damage to all (planar bleed)' },
    // PHASE 2 REALM HAZARDS
    'The Shattered Veil': { name: 'Memory Shard', chance: 0.15, type: 'damage', dmg: 6, elem: 'arcane', msg: 'A shard of dead memory cuts through the veil!', desc: '15% chance per turn: 10 arcane damage to all' },
    'Emberfall Dimension': { name: 'Updraft Ash', chance: 0.20, type: 'damage', dmg: 5, elem: 'fire', msg: 'Ash rains upward, burning from below!', desc: '20% chance per turn: 8 fire damage to all' },
    'Frostbound Eternity': { name: 'Frozen Moment', chance: 0.10, type: 'freeze', turns: 1, msg: 'Time freezes around you — a moment of death preserved!', desc: '12% chance per turn: freeze random member (skip turn)' },
    "Stormcaller's Cradle": { name: 'Birth Storm', chance: 0.15, type: 'damage', dmg: 8, elem: 'lightning', msg: 'Lightning births itself from nothing — strikes twice!', desc: '18% chance per turn: 14 lightning damage to random member' },
    'The Void Between': { name: 'Hunger Gaze', chance: 0.10, type: 'mana_drain', drain: 4, msg: 'The void remembers your name... and hungers for your magic.', desc: '10% chance per turn: drain 8 MP from all' },
    'Chronos Spire': { name: 'Time Echo', chance: 0.12, type: 'damage', dmg: 6, elem: 'arcane', msg: 'Your past self attacks your present!', desc: '15% chance per turn: 10 arcane damage (temporal paradox)' },
    'Aetherium Gardens': { name: 'Mana Bloom', chance: 0.10, type: 'mana_drain', drain: 3, msg: 'The flowers sing — and drink your magic.', desc: '12% chance per turn: drain 5 MP from all (mana bloom)' },
    'The Convergence': { name: 'Resonance Clash', chance: 0.18, type: 'damage', dmg: 10, elem: 'arcane', msg: 'Conflicting planar energies clash — everything shudders!', desc: '22% chance per turn: 16 arcane damage to all (resonance clash)' },
    'The Nexus': { name: 'Reality Collapse', chance: 0.20, type: 'damage', dmg: 12, elem: 'void', msg: 'The heart of dimensions buckles — reality itself tears!', desc: '25% chance per turn: 20 void damage to all (reality collapse)' },
        // === PHASE 1: LV 22-23 ZONE HAZARDS ===
    'The Astral Maelstrom': { name: 'Dimensional Shear', chance: 0.15, type: 'damage', dmg: 14, elem: 'arcane', msg: 'Reality shears apart — raw astral energy cuts through!', desc: '15% chance per turn: 14 arcane damage to all (dimensional shear)' },
    'Infernal Crucible': { name: 'Magma Vent', chance: 0.20, type: 'damage', dmg: 10, elem: 'fire', msg: 'A magma vent erupts beneath your feet!', desc: '20% chance per turn: 10 fire damage to all (magma vent)' },
        'Serpent\'s Coil': { name: 'Neurotoxin Cloud', chance: 0.15, type: 'damage', dmg: 6, elem: 'poison', msg: 'A cloud of neurotoxin rolls through the tunnels!', desc: '15% chance per turn: 6 poison damage to all' },
    'The Fulcrum': { name: 'Planar Surge', chance: 0.12, type: 'mana_drain', drain: 5, msg: 'The Fulcrum destabilizes, draining magic!', desc: '12% chance per turn: drain 5 MP from all (planar surge)' },
    'The Scorched Vein': { name: 'Magma Eruption', chance: 0.20, type: 'damage', dmg: 12, elem: 'fire', msg: 'Magma erupts from the glass canyon walls!', desc: '20% chance per turn: 12 fire damage to all' },
    'Tidal Abyss': { name: 'Crushing Pressure', chance: 0.15, type: 'damage', dmg: 8, elem: 'ice', msg: 'The abyss crushes everything in its depths!', desc: '15% chance per turn: 8 ice damage to all (pressure)' },
    'The Shattered Crown': { name: 'Lightning Crown', chance: 0.18, type: 'damage', dmg: 10, elem: 'lightning', msg: 'The crown calls lightning to punish intruders!', desc: '18% chance per turn: 10 lightning damage to random member' },
    'The Hollow Throne': { name: 'Void Hunger', chance: 0.10, type: 'mana_drain', drain: 6, msg: 'The throne hungers for your magic!', desc: '10% chance per turn: drain 6 MP from all (void hunger)' },
    'The Final Spire': { name: 'Reality Fracture', chance: 0.15, type: 'damage', dmg: 14, elem: 'arcane', msg: 'The spire fractures reality around you!', desc: '15% chance per turn: 14 arcane damage to all' },
    'The Apex': { name: 'Apex Radiance', chance: 0.12, type: 'damage', dmg: 16, elem: 'arcane', msg: 'The Apex radiates with unbearable power!', desc: '12% chance per turn: 16 arcane damage to all' },


  },

  exploreEvents: [
    { n: 'Abandoned Cache', d: 'You find a weathered chest half-buried in leaves.', type: 'loot', chance: 0.15, minLv: 1, 
      gold: 15, items: [{n:'Health Potion',t:'pot',eff:'heal',v:30,q:1,r:'common'}] },
    { n: 'Strange Shrine', d: 'An old shrine hums with faint magic.', type: 'blessing', chance: 0.08, minLv: 2, mp: 20 },
    { n: 'Falling Star', d: 'A star falls nearby, leaving something behind.', type: 'loot', chance: 0.05, minLv: 5,
      item: {n:'Star Fragment',t:'mat',q:1,r:'rare'} },
    { n: 'Planar Rift', d: 'A tear in reality pulses with raw energy. Something watches from the other side.', type: 'loot', chance: 0.10, minLv: 11,
      item: {n:'Planar Essence',t:'mat',q:1,r:'rare'}, gold: 40 },
    { n: 'Chrono Anomaly', d: 'Time flows backward in a small sphere. You glimpse your own future.', type: 'blessing', chance: 0.06, minLv: 12, mp: 40, xp: 50 },
    { n: 'Aether Cache', d: 'Crystallized aether forms a natural vault. The contents hum with power.', type: 'loot', chance: 0.08, minLv: 13,
      items: [{n:'Aether Shard',t:'mat',q:2,r:'rare'},{n:'Chrono Sand',t:'mat',q:1,r:'epic'}], gold: 80 },
      { n: 'Crystal Waterfall', d: 'A hidden grotto where moonwater cascades down luminescent stone. The mist tingles with raw mana.', type: 'blessing', chance: 0.12, minLv: 3, mp: 35, hp: 10, oncePerZone: true },
{ n: 'Planar Cascade', d: 'A waterfall that flows upward into a rift of pure aether. Drinking from it restores the mind.', type: 'blessing', chance: 0.08, minLv: 11, mp: 60, hp: 15, oncePerZone: true },

  ],
  recipes: [
    { n: 'Health Potion', m: { 'Herb Bundle': 2, 'Goblin Tooth': 1 }, res: { n: 'Health Potion', t: 'pot', eff: 'heal', v: 30, q: 1, r: 'common' }, d: 'Restores 30 HP' },
    { n: 'Mana Potion', m: { 'Herb Bundle': 1, 'Iron Ore': 1 }, res: { n: 'Mana Potion', t: 'pot', eff: 'mana', v: 25, q: 1, r: 'common' }, d: 'Restores 25 MP' },
    { n: 'Greater Health Potion', m: { 'Herb Bundle': 3, 'Bone Shard': 2, 'Iron Ore': 1 }, res: { n: 'Greater Health Potion', t: 'pot', eff: 'heal', v: 75, q: 1, r: 'uncommon' }, d: 'Restores 75 HP' },
    { n: 'Iron Sword', m: { 'Iron Ore': 4, 'Bone Shard': 1 }, res: { n: 'Iron Sword', slot: 'weapon', ilvl: 5, atk: 6, r: 'uncommon', d: 'A sturdy blade of forge-worked iron.' }, d: 'ATK +6' },
    { n: 'Reinforced Robes', m: { 'Iron Ore': 2, 'Herb Bundle': 3, 'Goblin Tooth': 2 }, res: { n: 'Reinforced Robes', slot: 'armor', ilvl: 5, def: 5, r: 'uncommon', d: 'Robes reinforced with iron thread.' }, d: 'DEF +5' },
    { n: 'Fire Staff', m: { 'Fire Essence': 2, 'Obsidian': 3, 'Iron Ore': 2 }, res: { n: 'Fire Staff', slot: 'weapon', ilvl: 10, atk: 10, fireDmg: 4, r: 'rare', d: 'A staff wreathed in captured flame.' }, d: 'ATK +10, Fire damage' },
    { n: 'Frost Ring', m: { 'Ice Crystal': 2, 'Frost Gem': 1, 'Iron Ore': 1 }, res: { n: 'Frost Ring', slot: 'ring', ilvl: 12, int: 3, r: 'rare', d: 'A ring that hums with contained frost.' }, d: 'INT +3, Frost spells cost -5 MP' },
    { n: 'Phoenix Feather', m: { 'Fire Essence': 3, 'Obsidian': 2, 'Gem Dust': 1 }, res: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' }, d: 'Revives fallen companion with 50% HP' },
    { n: 'Planar Potion', m: { 'Planar Essence': 2, 'Aether Shard': 1, 'Herb Bundle': 2 }, res: { n: 'Planar Potion', t: 'pot', eff: 'heal', v: 100, q: 1, r: 'rare' }, d: 'Restores 100 HP and grants planar resistance' },
    { n: 'Chrono Elixir', m: { 'Chrono Sand': 2, 'Planar Essence': 1, 'Mana Potion': 1 }, res: { n: 'Chrono Elixir', t: 'pot', eff: 'mana', v: 60, q: 1, r: 'epic' }, d: 'Restores 60 MP and resets one spell cooldown' },
    { n: 'Reality Anchor', m: { 'Planar Essence': 3, 'Void Thread': 2, 'Aether Shard': 2 }, res: { n: 'Reality Anchor', slot: 'amulet', ilvl: 20, q: 1, r: 'legendary', int: 5, wis: 3, voidRes: 0.25, arcaneDmg: 5, d: 'An amulet that anchors its wearer against the pull between worlds.' }, d: 'INT +5, WIS +3, +25% Void Resist, +5 Arcane DMG' },

    // === COMPANION SIGNATURE WEAPONS — one reliable craft per companion, mid loot tier ===
    { n: "Joel's Iron Kiteshield", m: { 'Iron Ore': 4, 'Bone Shard': 2 }, res: { n: 'Iron Kiteshield', slot: 'weapon', forCompanion: 'Joel', ilvl: 6, r: 'uncommon', atk: 3, def: 6, d: 'Shield for Joel.' }, d: 'ATK +3, DEF +6 (Joel only)' },
    { n: "Aisyah's Twin Fangs", m: { 'Iron Ore': 2, 'Goblin Tooth': 3 }, res: { n: 'Twin Fangs', slot: 'weapon', forCompanion: 'Aisyah', ilvl: 6, r: 'uncommon', atk: 6, spd: 4, d: 'Dagger for Aisyah.' }, d: 'ATK +6, SPD +4 (Aisyah only)' },
    { n: "Mezstorm's Storm-Touched Staff", m: { 'Iron Ore': 2, 'Herb Bundle': 2 }, res: { n: 'Storm-Touched Staff', slot: 'weapon', forCompanion: 'Mezstorm', ilvl: 6, r: 'uncommon', atk: 5, spd: 2, d: 'Staff for Mezstorm.' }, d: 'ATK +5, SPD +2 (Mezstorm only)' },
    { n: "Eliz's Gentle Mercy", m: { 'Herb Bundle': 3, 'Iron Ore': 1 }, res: { n: 'Gentle Mercy', slot: 'weapon', forCompanion: 'Eliz', ilvl: 6, r: 'uncommon', atk: 4, def: 3, d: 'Mace for Eliz.' }, d: 'ATK +4, DEF +3 (Eliz only)' },
    { n: "Senedra's Longbow of the Woods", m: { 'Iron Ore': 2, 'Herb Bundle': 2 }, res: { n: 'Longbow of the Woods', slot: 'weapon', forCompanion: 'Senedra', ilvl: 6, r: 'uncommon', atk: 6, spd: 3, d: 'Bow for Senedra.' }, d: 'ATK +6, SPD +3 (Senedra only)' },
    { n: "Zaki's Young Blade", m: { 'Iron Ore': 3, 'Bone Shard': 1 }, res: { n: 'Young Blade', slot: 'weapon', forCompanion: 'Zaki', ilvl: 6, r: 'uncommon', atk: 6, def: 2, d: 'Sword for Zaki.' }, d: 'ATK +6, DEF +2 (Zaki only)' },
    { n: "Soel's Warm Ember Charm", m: { 'Fire Essence': 1, 'Gem Dust': 1 }, res: { n: 'Warm Ember Charm', slot: 'weapon', forCompanion: 'Soel', ilvl: 6, r: 'uncommon', atk: 4, spd: 3, d: 'Charm for Soel.' }, d: 'ATK +4, SPD +3 (Soel only)' }
  ],
  quests: [
    { id: 1, n: 'First Steps', d: 'Defeat 3 monsters in Whispering Woods', t: 'kill', c: 0, need: 3, rw: { xp: 50, g: 20 }, done: false },
    { id: 2, n: 'Potion Brewer', d: 'Craft 2 potions', t: 'craft', c: 0, need: 2, rw: { xp: 30, g: 15 }, done: false },
    { id: 3, n: 'Focus Warrior', d: 'Complete any focus session (5–25 min)', t: 'focus', c: 0, need: 1, rw: { xp: 100, g: 50 }, done: false },
    { id: 4, n: "Joel's Shield Oath", d: 'Win 5 battles with Joel in your party', t: 'joel_battle', c: 0, need: 5, rw: { xp: 80, g: 40 }, done: false, chain: 'joel', reqQuest: null, reqParty: 'Joel' },
    { id: 5, n: "Aisyah's Hidden Blade", d: 'Defeat 3 Skeletons in the Catacombs with Aisyah', t: 'aisyah_kill', c: 0, need: 3, rw: { xp: 120, g: 60 }, done: false, chain: 'aisyah', reqQuest: 4, reqParty: 'Aisyah', hidden: true, revealed: false },
    { id: 6, n: 'Rest with Eliz', d: 'Rest 3 times with Eliz in your active party before time runs out', t: 'rest_with', c: 0, need: 3, rw: { xp: 60, g: 30 }, done: false, timed: true, timer: 180, timerMax: 180, reqParty: 'Eliz' },
    { id: 7, n: "Senedra's Scout Report", d: 'Explore 3 different zones with Senedra before time runs out', t: 'explore_with', c: 0, need: 3, rw: { xp: 90, g: 45 }, done: false, timed: true, timer: 240, timerMax: 240, reqParty: 'Senedra' },
    { id: 8, n: "Aisyah's Ledger", d: 'Defeat 10 enemies in any zone with Aisyah to recover her lost trading notes', t: 'aisyah_battle', c: 0, need: 10, rw: { xp: 150, g: 100 }, done: false, hidden: true, revealed: false, chain: 'aisyah', reqQuest: 4, reqParty: 'Aisyah' },
    { id: 9, n: 'Tower Ascent I: The Threshold', d: 'Reach Level 10 and enter the Arcane Planar Tower', t: 'reach_level', c: 0, need: 10, rw: { xp: 90, g: 85 }, done: false, chain: 'tower' },
    { id: 10, n: 'Tower Ascent II: Planar Warden', d: 'Defeat 5 Planar Wisps in the Arcane Planar Tower', t: 'kill_specific', target: 'Planar Wisp', c: 0, need: 5, rw: { xp: 400, g: 250 }, done: false, chain: 'tower', reqQuest: 9 },
    { id: 11, n: 'Tower Ascent III: Rift Sealer', d: 'Defeat 3 Rift Stalkers and 3 Void Weavers', t: 'kill_specific', target: 'Rift Stalker', c: 0, need: 3, rw: { xp: 500, g: 300 }, done: false, chain: 'tower', reqQuest: 10, hidden: true, revealed: false },
    { id: 12, n: 'Tower Ascent IV: Chronomancer Slayer', d: 'Defeat 3 Chronomancers', t: 'kill_specific', target: 'Chronomancer', c: 0, need: 3, rw: { xp: 150, g: 140 }, done: false, chain: 'tower', reqQuest: 11, hidden: true, revealed: false },
    { id: 13, n: 'Tower Ascent V: The Planarch', d: 'Defeat The Planarch and claim the Arcane Planar Tower', t: 'boss_specific', target: 'The Planarch', c: 0, need: 1, rw: { xp: 420, g: 1500 }, done: false, chain: 'tower', reqQuest: 12, hidden: true, revealed: false, stronghold: 'arcaneTower' },
        // === PHASE 1: LV 22-23 QUESTS ===
    { id: 14, n: 'Beyond the Veil I: The Maelstrom', d: 'Reach Level 22 and enter The Astral Maelstrom', t: 'reach_level', c: 0, need: 22, rw: { xp: 500, g: 600 }, done: false, chain: 'beyond_veil' },
    { id: 15, n: 'Beyond the Veil II: Reality Weaver', d: 'Defeat 5 Reality Weavers in The Astral Maelstrom', t: 'kill_specific', target: 'Reality Weaver', c: 0, need: 5, rw: { xp: 600, g: 400 }, done: false, chain: 'beyond_veil', reqQuest: 14 },
    { id: 16, n: 'Beyond the Veil III: The Devourer', d: 'Defeat The Astral Devourer', t: 'boss_specific', target: 'The Astral Devourer', c: 0, need: 1, rw: { xp: 800, g: 1200 }, done: false, chain: 'beyond_veil', reqQuest: 15, hidden: true, revealed: false },
    { id: 17, n: 'Into the Crucible', d: 'Reach Level 23 and enter the Infernal Crucible', t: 'reach_level', c: 0, need: 23, rw: { xp: 600, g: 700 }, done: false, chain: 'crucible' },
    { id: 18, n: 'Flame Purge', d: 'Defeat 5 Ember Wraiths in the Infernal Crucible', t: 'kill_specific', target: 'Ember Wraith', c: 0, need: 5, rw: { xp: 700, g: 500 }, done: false, chain: 'crucible', reqQuest: 17 },
    { id: 19, n: 'The Infernal Tyrant', d: 'Defeat The Infernal Tyrant', t: 'boss_specific', target: 'The Infernal Tyrant', c: 0, need: 1, rw: { xp: 1000, g: 1500 }, done: false, chain: 'crucible', reqQuest: 18, hidden: true, revealed: false },

    // === ACT 1: THE SHATTERED NOW (LV 30-35) ===
    { id: 20, n: 'The Breaking', d: 'Reach Level 30 and face whatever The Breaking has left behind', t: 'reach_level', c: 0, need: 30, rw: { xp: 1200, g: 1000 }, done: false, chain: 'shattered_now' },
    { id: 21, n: 'The Fracture', d: 'Defeat The Fracture in The Breaking', t: 'boss_specific', target: 'The Fracture', c: 0, need: 1, rw: { xp: 1600, g: 1900 }, done: false, chain: 'shattered_now', reqQuest: 20, hidden: true, revealed: false },
    { id: 22, n: 'The Last Guard', d: 'Defeat The Last Guard in The Silent Ruin', t: 'boss_specific', target: 'The Last Guard', c: 0, need: 1, rw: { xp: 1700, g: 2000 }, done: false, chain: 'shattered_now', reqQuest: 21, hidden: true, revealed: false },
    { id: 23, n: 'Scavenger King', d: 'Defeat the Scavenger King in Ashfall Market', t: 'boss_specific', target: 'Scavenger King', c: 0, need: 1, rw: { xp: 1800, g: 2100 }, done: false, chain: 'shattered_now', reqQuest: 22, hidden: true, revealed: false },
    { id: 24, n: 'The Drowned Ledger', d: 'Defeat the Debt Wraith in The Drowned Ledger', t: 'boss_specific', target: 'Debt Wraith', c: 0, need: 1, rw: { xp: 1900, g: 2200 }, done: false, chain: 'shattered_now', reqQuest: 23, hidden: true, revealed: false },
    { id: 25, n: 'Overtime', d: 'Defeat The Foreman at Rustbound Docks', t: 'boss_specific', target: 'The Foreman', c: 0, need: 1, rw: { xp: 2000, g: 2300 }, done: false, chain: 'shattered_now', reqQuest: 24, hidden: true, revealed: false },
    { id: 26, n: "The Widow's Watch", d: "Defeat the Echo of Joel and end Act One", t: 'boss_specific', target: 'Echo of Joel', c: 0, need: 1, rw: { xp: 2500, g: 3000 }, done: false, chain: 'shattered_now', reqQuest: 25, hidden: true, revealed: false },

    // === ACT 2: THE LONG SILENCE (LV 36-40) ===
    { id: 27, n: 'The Long Silence', d: 'Reach Level 36 and see how much further the world moved on without you', t: 'reach_level', c: 0, need: 36, rw: { xp: 2700, g: 2200 }, done: false, chain: 'long_silence', reqQuest: 26 },
    { id: 28, n: 'The Vanished Guide', d: 'Defeat The Vanished Guide on Forgotten Pemmican Roads', t: 'boss_specific', target: 'The Vanished Guide', c: 0, need: 1, rw: { xp: 3200, g: 3600 }, done: false, chain: 'long_silence', reqQuest: 27, hidden: true, revealed: false },
    { id: 29, n: 'The Quiet Nursery', d: 'Defeat Hollow Eliz in The Quiet Nursery', t: 'boss_specific', target: 'Hollow Eliz', c: 0, need: 1, rw: { xp: 3500, g: 3900 }, done: false, chain: 'long_silence', reqQuest: 28, hidden: true, revealed: false },
    { id: 30, n: 'Bladeless Barracks', d: 'Defeat Rustbound Zaki at the Bladeless Barracks', t: 'boss_specific', target: 'Rustbound Zaki', c: 0, need: 1, rw: { xp: 3800, g: 4200 }, done: false, chain: 'long_silence', reqQuest: 29, hidden: true, revealed: false },
    { id: 31, n: 'The Storm That Stayed', d: 'Defeat Mezstorm Unbound and quiet the storm', t: 'boss_specific', target: 'Mezstorm Unbound', c: 0, need: 1, rw: { xp: 4100, g: 4500 }, done: false, chain: 'long_silence', reqQuest: 30, hidden: true, revealed: false },
    { id: 32, n: "Embercat's Grave", d: 'Defeat The Fading Familiar and end Act Two', t: 'boss_specific', target: 'The Fading Familiar', c: 0, need: 1, rw: { xp: 5000, g: 5500 }, done: false, chain: 'long_silence', reqQuest: 31, hidden: true, revealed: false },

  ],

   bounties: [
    // === PHASE 1: EARLY GAME (Lv 1-9) ===
    { id: 'b1', n: 'Goblin Slayer', d: 'Defeat 5 Goblins', t: 'kill_specific', target: 'Goblin', c: 0, need: 5, rw: { xp: 40, g: 25 }, done: false, refreshDay: 0, minLv: 1 , maxLv: 13 },
    { id: 'b2', n: 'Bone Collector', d: 'Defeat 5 Skeletons', t: 'kill_specific', target: 'Skeleton', c: 0, need: 5, rw: { xp: 60, g: 35 }, done: false, refreshDay: 0, minLv: 2 , maxLv: 14 },
    { id: 'b3', n: 'Wolf Hunter', d: 'Defeat 3 Wolves', t: 'kill_specific', target: 'Wolf', c: 0, need: 3, rw: { xp: 30, g: 20 }, done: false, refreshDay: 0, minLv: 1 , maxLv: 13 },
    { id: 'b4', n: 'Ghost Buster', d: 'Defeat 3 Ghosts', t: 'kill_specific', target: 'Ghost', c: 0, need: 3, rw: { xp: 80, g: 50 }, done: false, refreshDay: 0, minLv: 2 , maxLv: 14 },
    { id: 'b5', n: 'Fire Purge', d: 'Defeat 4 Fire Imps', t: 'kill_specific', target: 'Fire Imp', c: 0, need: 4, rw: { xp: 100, g: 60 }, done: false, refreshDay: 0, minLv: 4 , maxLv: 16 },
    { id: 'b6', n: 'Crystal Breaker', d: 'Defeat 3 Crystal Spiders', t: 'kill_specific', target: 'Crystal Spider', c: 0, need: 3, rw: { xp: 70, g: 40 }, done: false, refreshDay: 0, minLv: 3 , maxLv: 15 },
    { id: 'b7', n: 'Storm Chaser', d: 'Defeat 3 Storm Wraiths', t: 'kill_specific', target: 'Storm Wraith', c: 0, need: 3, rw: { xp: 120, g: 75 }, done: false, refreshDay: 0, minLv: 5 , maxLv: 17 },
    { id: 'b8', n: 'Ice Breaker', d: 'Defeat 3 Ice Elementals', t: 'kill_specific', target: 'Ice Elemental', c: 0, need: 3, rw: { xp: 150, g: 90 }, done: false, refreshDay: 0, minLv: 6 , maxLv: 18 },
    { id: 'b9', n: 'Void Hunter', d: 'Defeat 2 Void Beasts', t: 'kill_specific', target: 'Void Beast', c: 0, need: 2, rw: { xp: 200, g: 120 }, done: false, refreshDay: 0, minLv: 8 , maxLv: 20 },
    { id: 'b10', n: 'Dragon Slayer', d: 'Defeat 1 Elder Wyrm', t: 'kill_specific', target: 'Elder Wyrm', c: 0, need: 1, rw: { xp: 500, g: 300 }, done: false, refreshDay: 0, minLv: 9 , maxLv: 21 },

    // === PHASE 2: ARCANE PLANAR TOWER (Lv 11-15) ===
    { id: 'b11', n: 'Planar Wisp Hunter', d: 'Defeat 5 Planar Wisps', t: 'kill_specific', target: 'Planar Wisp', c: 0, need: 5, rw: { xp: 250, g: 150 }, done: false, refreshDay: 0, minLv: 11 , maxLv: 23 },
    { id: 'b12', n: 'Rift Stalker Slayer', d: 'Defeat 3 Rift Stalkers', t: 'kill_specific', target: 'Rift Stalker', c: 0, need: 3, rw: { xp: 300, g: 180 }, done: false, refreshDay: 0, minLv: 11 , maxLv: 23 },
    { id: 'b13', n: 'Aether Golem Breaker', d: 'Defeat 3 Aether Golems', t: 'kill_specific', target: 'Aether Golem', c: 0, need: 3, rw: { xp: 350, g: 200 }, done: false, refreshDay: 0, minLv: 11 , maxLv: 23 },
    { id: 'b14', n: 'Chronomancer Nemesis', d: 'Defeat 3 Chronomancers', t: 'kill_specific', target: 'Chronomancer', c: 0, need: 3, rw: { xp: 400, g: 220 }, done: false, refreshDay: 0, minLv: 12 , maxLv: 24 },
    { id: 'b15', n: 'Void Weaver Hunter', d: 'Defeat 3 Void Weavers', t: 'kill_specific', target: 'Void Weaver', c: 0, need: 3, rw: { xp: 450, g: 250 }, done: false, refreshDay: 0, minLv: 13 , maxLv: 25 },
    { id: 'b16', n: 'Planar Leviathan Slayer', d: 'Defeat 2 Planar Leviathans', t: 'kill_specific', target: 'Planar Leviathan', c: 0, need: 2, rw: { xp: 550, g: 300 }, done: false, refreshDay: 0, minLv: 14 , maxLv: 26 },
    { id: 'b17', n: 'The Planarch', d: 'Defeat The Planarch', t: 'kill_specific', target: 'The Planarch', c: 0, need: 1, rw: { xp: 1000, g: 600 }, done: false, refreshDay: 0, minLv: 15 , maxLv: 27 },

    // === PHASE 3: PLANAR REALMS (Lv 16-20) ===
    { id: 'b18', n: 'Veil Wraith Hunter', d: 'Defeat 5 Veil Wraiths', t: 'kill_specific', target: 'Veil Wraith', c: 0, need: 5, rw: { xp: 400, g: 220 }, done: false, refreshDay: 0, minLv: 16 , maxLv: 28 },
    { id: 'b19', n: 'Shardling Slayer', d: 'Defeat 5 Shardlings', t: 'kill_specific', target: 'Shardling', c: 0, need: 5, rw: { xp: 420, g: 230 }, done: false, refreshDay: 0, minLv: 16 , maxLv: 28 },
    { id: 'b20', n: 'Ember Drake Hunter', d: 'Defeat 3 Ember Drakes', t: 'kill_specific', target: 'Ember Drake', c: 0, need: 3, rw: { xp: 480, g: 260 }, done: false, refreshDay: 0, minLv: 17 , maxLv: 29 },
    { id: 'b21', n: 'Ash Titan Slayer', d: 'Defeat 2 Ash Titans', t: 'kill_specific', target: 'Ash Titan', c: 0, need: 2, rw: { xp: 520, g: 280 }, done: false, refreshDay: 0, minLv: 17 , maxLv: 29 },
    { id: 'b22', n: 'Frost Lich Nemesis', d: 'Defeat 3 Frost Liches', t: 'kill_specific', target: 'Frost Lich', c: 0, need: 3, rw: { xp: 550, g: 300 }, done: false, refreshDay: 0, minLv: 18 , maxLv: 30 },
    { id: 'b23', n: 'Glacial Behemoth Hunter', d: 'Defeat 2 Glacial Behemoths', t: 'kill_specific', target: 'Glacial Behemoth', c: 0, need: 2, rw: { xp: 600, g: 330 }, done: false, refreshDay: 0, minLv: 18 , maxLv: 30 },
    { id: 'b24', n: 'The Nexus Planarch', d: 'Defeat The Nexus Planarch', t: 'kill_specific', target: 'The Nexus Planarch', c: 0, need: 1, rw: { xp: 2000, g: 1200 }, done: false, refreshDay: 0, minLv: 20 , maxLv: 32 },
        // === PHASE 1: LV 22-23 BOUNTIES ===
    { id: 'b25', n: 'Reality Weaver Hunter', d: 'Defeat 5 Reality Weavers', t: 'kill_specific', target: 'Reality Weaver', c: 0, need: 5, rw: { xp: 500, g: 300 }, done: false, refreshDay: 0, minLv: 22 , maxLv: 34 },
    { id: 'b26', n: 'Fracture Hound Slayer', d: 'Defeat 5 Fracture Hounds', t: 'kill_specific', target: 'Fracture Hound', c: 0, need: 5, rw: { xp: 520, g: 310 }, done: false, refreshDay: 0, minLv: 22 , maxLv: 34 },
    { id: 'b27', n: 'Astral Devourer', d: 'Defeat The Astral Devourer', t: 'kill_specific', target: 'The Astral Devourer', c: 0, need: 1, rw: { xp: 1200, g: 700 }, done: false, refreshDay: 0, minLv: 22 , maxLv: 34 },
    { id: 'b28', n: 'Ember Wraith Hunter', d: 'Defeat 5 Ember Wraiths', t: 'kill_specific', target: 'Ember Wraith', c: 0, need: 5, rw: { xp: 550, g: 330 }, done: false, refreshDay: 0, minLv: 23 , maxLv: 35 },
    { id: 'b29', n: 'Ash Phantom Slayer', d: 'Defeat 5 Ash Phantoms', t: 'kill_specific', target: 'Ash Phantom', c: 0, need: 5, rw: { xp: 570, g: 340 }, done: false, refreshDay: 0, minLv: 23 , maxLv: 35 },
    { id: 'b30', n: 'Infernal Tyrant', d: 'Defeat The Infernal Tyrant', t: 'kill_specific', target: 'The Infernal Tyrant', c: 0, need: 1, rw: { xp: 1400, g: 800 }, done: false, refreshDay: 0, minLv: 23 , maxLv: 35 },

    // === PHASE 3: LV 24-29 BOUNTIES ===
    { id: 'b31', n: 'Magma Serpent Hunter', d: 'Defeat 5 Magma Serpents', t: 'kill_specific', target: 'Magma Serpent', c: 0, need: 5, rw: { xp: 700, g: 400 }, done: false, refreshDay: 0, minLv: 24, maxLv: 36 },
    { id: 'b32', n: 'Scorch Titan Slayer', d: 'Defeat 3 Scorch Titans', t: 'kill_specific', target: 'Scorch Titan', c: 0, need: 3, rw: { xp: 780, g: 440 }, done: false, refreshDay: 0, minLv: 24, maxLv: 36 },
    { id: 'b33', n: 'Frozen Kraken Hunter', d: 'Defeat 3 Frozen Krakens', t: 'kill_specific', target: 'Frozen Kraken', c: 0, need: 3, rw: { xp: 850, g: 480 }, done: false, refreshDay: 0, minLv: 25, maxLv: 37 },
    { id: 'b34', n: 'Storm Sovereign Hunt', d: 'Defeat 3 Storm Sovereign Remnants', t: 'kill_specific', target: 'Storm Sovereign Remnant', c: 0, need: 3, rw: { xp: 920, g: 520 }, done: false, refreshDay: 0, minLv: 26, maxLv: 38 },
    { id: 'b35', n: 'Throne Keeper Purge', d: 'Defeat 3 Throne Keepers', t: 'kill_specific', target: 'Throne Keeper', c: 0, need: 3, rw: { xp: 1000, g: 570 }, done: false, refreshDay: 0, minLv: 27, maxLv: 39 },
    { id: 'b36', n: 'Spire Archon Hunter', d: 'Defeat 3 Spire Archons', t: 'kill_specific', target: 'Spire Archon', c: 0, need: 3, rw: { xp: 1100, g: 620 }, done: false, refreshDay: 0, minLv: 28, maxLv: 40 },
    { id: 'b37', n: 'Apex Warden Slayer', d: 'Defeat 3 Apex Wardens', t: 'kill_specific', target: 'Apex Warden', c: 0, need: 3, rw: { xp: 1200, g: 680 }, done: false, refreshDay: 0, minLv: 29, maxLv: 41 },

    // === ACT 1: THE SHATTERED NOW (LV 30-35) BOUNTIES ===
    { id: 'b38', n: 'Fracture Wisp Hunt', d: 'Defeat 5 Fracture Wisps', t: 'kill_specific', target: 'Fracture Wisp', c: 0, need: 5, rw: { xp: 1300, g: 750 }, done: false, refreshDay: 0, minLv: 30, maxLv: 42 },
    { id: 'b39', n: 'Ruin Stalker Purge', d: 'Defeat 5 Ruin Stalkers', t: 'kill_specific', target: 'Ruin Stalker', c: 0, need: 5, rw: { xp: 1400, g: 800 }, done: false, refreshDay: 0, minLv: 31, maxLv: 43 },
    { id: 'b40', n: 'Market Looter Sweep', d: 'Defeat 5 Market Looters', t: 'kill_specific', target: 'Market Looter', c: 0, need: 5, rw: { xp: 1500, g: 860 }, done: false, refreshDay: 0, minLv: 32, maxLv: 44 },
    { id: 'b41', n: 'Ledger Wraith Hunt', d: 'Defeat 4 Ledger Wraiths', t: 'kill_specific', target: 'Ledger Wraith', c: 0, need: 4, rw: { xp: 1600, g: 920 }, done: false, refreshDay: 0, minLv: 33, maxLv: 45 },
    { id: 'b42', n: 'Rust Automaton Scrap', d: 'Defeat 4 Rust Automatons', t: 'kill_specific', target: 'Rust Automaton', c: 0, need: 4, rw: { xp: 1700, g: 980 }, done: false, refreshDay: 0, minLv: 34, maxLv: 46 },
    { id: 'b43', n: 'Watching Echo Purge', d: 'Defeat 4 Watching Echoes', t: 'kill_specific', target: 'Watching Echo', c: 0, need: 4, rw: { xp: 1800, g: 1050 }, done: false, refreshDay: 0, minLv: 35, maxLv: 47 },

  ],


  achievements: [
    { id: 'first_blood', n: 'First Blood', d: 'Defeat your first monster', icon: '🩸', t: 'kills', need: 1, rw: { xp: 25, g: 10 }, done: false, secret: false },
    { id: 'seasoned_hunter', n: 'Seasoned Hunter', d: 'Defeat 50 monsters', icon: '⚔️', t: 'kills', need: 50, rw: { xp: 100, g: 50 }, done: false, secret: false },
    { id: 'monster_slayer', n: 'Monster Slayer', d: 'Defeat 100 monsters', icon: '💀', t: 'kills', need: 100, rw: { xp: 250, g: 100 }, done: false, secret: false },
    { id: 'first_boss', n: 'Boss Bane', d: 'Defeat your first boss', icon: '👑', t: 'boss', need: 1, rw: { xp: 200, g: 100 }, done: false, secret: false },
    { id: 'dragon_slayer', n: 'Dragon Slayer', d: 'Defeat the Elder Dragon', icon: '🐲', t: 'boss_specific', target: 'Elder Dragon', need: 1, rw: { xp: 1000, g: 500 }, done: false, secret: false },
    { id: 'novice', n: 'Novice Sorcerer', d: 'Reach Level 5', icon: '✨', t: 'level', need: 5, rw: { xp: 50, g: 25 }, done: false, secret: false },
    { id: 'adept', n: 'Adept Mage', d: 'Reach Level 10', icon: '🔮', t: 'level', need: 10, rw: { xp: 200, g: 100 }, done: false, secret: false },
    { id: 'archmage', n: 'Archmage', d: 'Reach Level 15', icon: '⭐', t: 'level', need: 15, rw: { xp: 500, g: 250 }, done: false, secret: false },
    { id: 'first_quest', n: 'Quest Beginner', d: 'Complete your first quest', icon: '📜', t: 'quests', need: 1, rw: { xp: 30, g: 15 }, done: false, secret: false },
    { id: 'quest_master', n: 'Quest Master', d: 'Complete 20 quests', icon: '🏆', t: 'quests', need: 20, rw: { xp: 300, g: 150 }, done: false, secret: false },
    { id: 'joel_bond', n: 'Shield Oath', d: 'Reach 70 affinity with Joel', icon: '💜', t: 'affinity', target: 'Joel', need: 70, rw: { xp: 100, g: 50 }, done: false, secret: false },
    { id: 'aisyah_bond', n: 'Sisterblade Bond', d: 'Reach 70 affinity with Aisyah', icon: '💚', t: 'affinity', target: 'Aisyah', need: 70, rw: { xp: 100, g: 50 }, done: false, secret: false },
    { id: 'soel_bond', n: 'Familiar Love', d: 'Reach max affinity with Soel', icon: '🐱', t: 'affinity', target: 'Soel', need: 100, rw: { xp: 200, g: 100 }, done: false, secret: false },
    { id: 'full_party', n: 'Full Circle', d: 'Unlock all 7 party members', icon: '👥', t: 'party', need: 7, rw: { xp: 300, g: 150 }, done: false, secret: false },
    { id: 'first_craft', n: 'Apprentice Crafter', d: 'Craft your first item', icon: '⚒️', t: 'craft', need: 1, rw: { xp: 25, g: 15 }, done: false, secret: false },
    { id: 'wealthy', n: 'Wealthy', d: 'Accumulate 500 gold', icon: '💰', t: 'gold', need: 500, rw: { xp: 100, g: 0 }, done: false, secret: false },
    { id: 'rich', n: 'Filthy Rich', d: 'Accumulate 2000 gold', icon: '💎', t: 'gold', need: 2000, rw: { xp: 300, g: 0 }, done: false, secret: false },
    { id: 'survivor', n: 'Survivor', d: 'Win a battle with 1 HP remaining', icon: '🩹', t: 'survivor', need: 1, rw: { xp: 75, g: 30 }, done: false, secret: false },
    { id: 'perfectionist', n: 'Perfectionist', d: 'Complete a 25-minute focus session', icon: '🧘', t: 'focus', need: 1, rw: { xp: 150, g: 75 }, done: false, secret: false },
    { id: 'secret_lover', n: 'Secret Admirer', d: 'Reach max affinity with a certain familiar...', icon: '❓', t: 'affinity', target: 'Soel', need: 100, rw: { xp: 500, g: 200 }, done: false, secret: true },
    { id: 'void_touched', n: 'Void Touched', d: 'Survive the deepest darkness', icon: '❓', t: 'boss_specific', target: 'Abyssal Horror', need: 1, rw: { xp: 500, g: 250 }, done: false, secret: true },
    { id: 'planar_pioneer', n: 'Planar Pioneer', d: 'Enter the Arcane Planar Tower', icon: '🌀', t: 'reach_level', need: 11, rw: { xp: 90, g: 85 }, done: false, secret: false },
    { id: 'rift_walker', n: 'Rift Walker', d: 'Defeat 20 enemies in the Arcane Planar Tower', icon: '🌌', t: 'kills', need: 20, rw: { xp: 500, g: 300 }, done: false, secret: false },
    { id: 'planarch_slayer', n: 'Planarch Slayer', d: 'Defeat The Planarch and claim the tower', icon: '👑', t: 'boss_specific', target: 'The Planarch', need: 1, rw: { xp: 420, g: 1500 }, done: false, secret: false },
    { id: 'planar_master', n: 'Planar Master', d: 'Reach Level 15', icon: '⭐', t: 'level', need: 15, rw: { xp: 1000, g: 600 }, done: false, secret: false },
        // === PHASE 1: LV 22-23 ACHIEVEMENTS ===
    { id: 'astral_walker', n: 'Astral Walker', d: 'Reach Level 22', icon: '🌌', t: 'level', need: 22, rw: { xp: 800, g: 500 }, done: false, secret: false },
    { id: 'infernal_heart', n: 'Infernal Heart', d: 'Reach Level 23', icon: '🔥', t: 'level', need: 23, rw: { xp: 900, g: 600 }, done: false, secret: false },
    { id: 'devourer_slayer', n: 'Devourer of Worlds', d: 'Defeat The Astral Devourer', icon: '🌑', t: 'boss_specific', target: 'The Astral Devourer', need: 1, rw: { xp: 1200, g: 800 }, done: false, secret: false },
    { id: 'tyrant_slayer', n: 'Tyrant Breaker', d: 'Defeat The Infernal Tyrant', icon: '⚔️', t: 'boss_specific', target: 'The Infernal Tyrant', need: 1, rw: { xp: 1400, g: 900 }, done: false, secret: false },
    { id: 'beyond_veil', n: 'Beyond the Veil', d: 'Complete the Beyond the Veil quest chain', icon: '🌀', t: 'quests', need: 3, rw: { xp: 1500, g: 1000 }, done: false, secret: false },
  ],

  storyline: [
    { id: 's1', n: 'The Awakening', d: 'Reach Level 3 and defeat your first boss', t: 'reach_level', c: 0, need: 3, rw: { xp: 200, g: 100 }, done: false, unlocked: true, chapter: 1 },
    { id: 's2', n: 'Echoes of the Past', d: 'Reach Level 5 and explore Stormhold', t: 'reach_level', c: 0, need: 5, rw: { xp: 350, g: 200 }, done: false, unlocked: false, chapter: 2 },
    { id: 's3', n: 'The Frozen Crown', d: 'Reach Level 7 and defeat the Frozen Knight', t: 'reach_level', c: 0, need: 7, rw: { xp: 500, g: 300 }, done: false, unlocked: false, chapter: 3 },
    { id: 's4', n: 'Into the Void', d: 'Reach Level 9 and survive the Abyssal Depths', t: 'reach_level', c: 0, need: 9, rw: { xp: 200, g: 180 }, done: false, unlocked: false, chapter: 4 },
    { id: 's5', n: 'Starlight Ascension', d: 'Reach Level 10 and conquer the Starlight Spire', t: 'reach_level', c: 0, need: 10, rw: { xp: 300, g: 250 }, done: false, unlocked: false, chapter: 5 },
    { id: 's6', n: 'Planar Convergence', d: 'Reach Level 12 and ascend the Arcane Planar Tower', t: 'reach_level', c: 0, need: 12, rw: { xp: 420, g: 1200 }, done: false, unlocked: false, chapter: 6 },
        // === PHASE 1: LV 22-23 STORYLINE ===
    { id: 's7', n: 'The Astral Threshold', d: 'Reach Level 22 and survive The Astral Maelstrom', t: 'reach_level', c: 0, need: 22, rw: { xp: 600, g: 1500 }, done: false, unlocked: false, chapter: 7 },
    { id: 's8', n: 'Heart of Fire', d: 'Reach Level 23 and conquer the Infernal Crucible', t: 'reach_level', c: 0, need: 23, rw: { xp: 700, g: 1800 }, done: false, unlocked: false, chapter: 8 },
    // === LEVELS 29-40: THE APEX THROUGH THE LONG SILENCE ===
    { id: 's9', n: 'The Final Gate', d: 'Reach Level 29 and stand at The Apex', t: 'reach_level', c: 0, need: 29, rw: { xp: 1200, g: 2200 }, done: false, unlocked: false, chapter: 9 },
    { id: 's10', n: 'The Breaking', d: 'Reach Level 30 and survive the wound left where the Planarch used to be', t: 'reach_level', c: 0, need: 30, rw: { xp: 1500, g: 2600 }, done: false, unlocked: false, chapter: 10 },
    { id: 's11', n: 'The Shattered Now', d: 'Reach Level 35 and end Act One at The Widow\'s Watch', t: 'reach_level', c: 0, need: 35, rw: { xp: 2200, g: 3400 }, done: false, unlocked: false, chapter: 11 },
    { id: 's12', n: 'The Long Silence', d: "Reach Level 40 and end Act Two at Embercat's Grave", t: 'reach_level', c: 0, need: 40, rw: { xp: 3000, g: 4500 }, done: false, unlocked: false, chapter: 12 },
  ],
  log: ['Welcome to Legends of Daybreak, San.'],

  soelBlessing: null,
  joelReviveUsed: false,
  affinity: {
    Joel: { val: 50, max: 100, lastInteract: Date.now(), decayRate: 0.05 },
    Aisyah: { val: 50, max: 100, lastInteract: Date.now(), decayRate: 0.05 },
    Mezstorm: { val: 30, max: 100, lastInteract: Date.now(), decayRate: 0.03 },
    Eliz: { val: 30, max: 100, lastInteract: Date.now(), decayRate: 0.03 },
    Senedra: { val: 20, max: 100, lastInteract: Date.now(), decayRate: 0.02 },
    Zaki: { val: 20, max: 100, lastInteract: Date.now(), decayRate: 0.02 },
    Soel: { val: 80, max: 100, lastInteract: Date.now(), decayRate: 0.08 }
  },

  soelCommentary: [
    { speaker: 'Soel', text: "Soel bats at the quest scroll. 'Boring. Where's the fish?'", trigger: 'quest_start' },
    { speaker: 'Soel', text: "Soel sits on the quest log. 'This one smells like trouble. Good.'", trigger: 'quest_start' },
    { speaker: 'Soel', text: "Soel yawns dramatically. 'Can we nap instead? The quest will wait.'", trigger: 'quest_view' },
    { speaker: 'Soel', text: "Soel's tail puffs up. 'That one. That quest. I don't like it.'", trigger: 'quest_view' },
    { speaker: 'Soel', text: "Soel knocks a potion off the table. 'Oops. Was that important?'", trigger: 'craft' },
    { speaker: 'Soel', text: "Soel watches you craft with intense focus. Then falls asleep.", trigger: 'craft' },
    { speaker: 'Soel', text: "Soel walks across your spellbook. 'This page is better blank.'", trigger: 'skills' },
    { speaker: 'Soel', text: "Soel purrs so loud you can't concentrate. 'Focus? Never heard of her.'", trigger: 'focus' },
    { speaker: 'Soel', text: "Soel curls up on the map. 'Here. We rest here. I decided.'", trigger: 'rest' },
    { speaker: 'Soel', text: "Soel stares at the campfire like it's a personal enemy. 'Too bright.'", trigger: 'rest' },
    { speaker: 'Soel', text: "Soel brings you a dead leaf. 'Gift. For the brave warrior.'", trigger: 'combat_win' },
    { speaker: 'Soel', text: "Soel licks his paw while you loot. 'Hurry up. I'm hungry.'", trigger: 'combat_win' },
    { speaker: 'Soel', text: "Soel hisses at an empty corner. 'There's something there. Trust me.'", trigger: 'explore' },
    { speaker: 'Soel', text: "Soel runs ahead, then back, then ahead again. 'This way! No, this way!'", trigger: 'explore' },
    { speaker: 'Soel', text: "Soel sits on Joel's head. 'Better view from up here.'", trigger: 'party' },
    { speaker: 'Soel', text: "Soel ignores Aisyah. Aisyah ignores him. Mutual respect.", trigger: 'party' }
  ],

  lastSoelComment: null,
  soelCommentCooldown: 0,

  npcs: [
    { n: 'Lewis', t: 'trader', title: 'Wandering Merchant', icon: '🧳', col: '#fbbf24', zone: 'Whispering Woods', zoneLv: 1,
      d: 'A shrewd merchant who appears in Whispering Woods. Sells rare herbs and curious trinkets.',
      stock: [
        { n: 'Mystic Herb', t: 'mat', q: 1, r: 'uncommon', price: 15 },
        { n: 'Silver Thread', t: 'mat', q: 1, r: 'rare', price: 30 },
        { n: 'Luck Charm', slot: 'amulet', q: 1, r: 'uncommon', price: 50, cha: 2 }
      ],
      unlocked: true, zone: 'Whispering Woods', zoneLv: 1, visitCount: 0 },
    { n: 'Ribald', t: 'trader', title: 'Adventurers Mart', icon: '', col: '#dc2626', zone: 'Cursed Catacombs', zoneLv: 2,
      d: 'A grizzled merchant who sets up shop in the darkest corners. His wares have seen blood.',
      stock: [
        { n: 'Flaming Longsword', slot: 'weapon', q: 1, r: 'rare', price: 120, atk: 8, fireDmg: 4 },
        { n: 'Cloak of Protection', slot: 'armor', q: 1, r: 'rare', price: 150, def: 4, wis: 2 },
        { n: 'Ring of Wizardry', slot: 'ring', q: 1, r: 'epic', price: 300, int: 4, mpRegen: 3 },
        { n: 'Rod of Resurrection', t: 'revive', q: 1, r: 'epic', price: 250, eff: 'revive', v: 75, d: 'A gleaming rod that channels divine energy to restore life. Revives fallen ally with 75% HP.' },
        { n: "Joel's Bulwark", slot: 'weapon', forCompanion: 'Joel', q: 1, r: 'rare', price: 80, atk: 0, def: 3, hp: 20, d: 'A heavy shield forged for The Steadfast. +3 DEF, +20 HP' },
        { n: "Aisyah's Twin Blades", slot: 'weapon', forCompanion: 'Aisyah', q: 1, r: 'rare', price: 80, atk: 3, def: 0, spd: 2, d: 'Matched daggers that sing in the dark. +3 ATK, +2 SPD' }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Larloch', t: 'trader', title: 'Vecna Artifacts', icon: '', col: '#7c2d12', zone: 'Abyssal Depths', zoneLv: 8,
      d: 'A skeletal figure wrapped in tattered robes. His wares whisper secrets that should stay buried.',
      stock: [
        { n: 'Robe of Vecna', slot: 'armor', q: 1, r: 'legendary', price: 800, def: 8, int: 5, voidDmg: 5 },
        { n: 'Vecnas Hand', slot: 'amulet', q: 1, r: 'epic', price: 500, str: 3, lifeSteal: 0.15 },
        { n: 'Eye of Vecna', slot: 'amulet', q: 1, r: 'epic', price: 500, wis: 4, voidRes: 0.25 },
        { n: "Soel's Spirit Bell", slot: 'weapon', forCompanion: 'Soel', q: 1, r: 'epic', price: 100, atk: 1, def: 1, spd: 2, d: 'A tiny bell only Soel can hear. +1 ATK, +1 DEF, +2 SPD, amplifies fortune' }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Deidre', t: 'trader', title: 'Exotic Wares', icon: '', col: '#0891b2', zone: 'Frostspire Ruins', zoneLv: 6,
      d: 'A frost-touched merchant with an eye for the extraordinary. Her breath does not fog in the cold.',
      stock: [
        { n: 'Frostbrand', slot: 'weapon', q: 1, r: 'rare', price: 200, atk: 10, iceDmg: 5 },
        { n: 'Icingdeath Scimitar', slot: 'weapon', q: 1, r: 'epic', price: 350, atk: 12, dex: 3, iceDmg: 4 },
        { n: 'Belt of Hill Giant Strength', slot: 'amulet', q: 1, r: 'rare', price: 250, str: 4, con: 2 },
        { n: "Eliz's Serenity Orb", slot: 'amulet', forCompanion: 'Eliz', q: 1, r: 'epic', price: 120, atk: 0, def: 2, hp: 15, d: 'A glowing orb that soothes the wounded. +2 DEF, +15 HP, enhances healing' },
        { n: "Zaki's Temper Band", slot: 'ring', forCompanion: 'Zaki', q: 1, r: 'rare', price: 75, atk: 3, def: 1, spd: 0, d: 'A red armband that fuels rage. +3 ATK, +1 DEF' }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Nym', t: 'trader', title: 'Targos Quartermaster', icon: '', col: '#16a34a', zone: 'Stormhold', zoneLv: 5,
      d: 'A gnomish quartermaster with a nose for quality gear. His prices are fair — his jokes are not.',
      stock: [
        { n: 'Gnome Hooked Hammer', slot: 'weapon', q: 1, r: 'uncommon', price: 80, atk: 6, str: 1 },
        { n: 'Leather Armor +1', slot: 'armor', q: 1, r: 'uncommon', price: 90, def: 4, dex: 1 },
        { n: 'Gnomish Goggles', slot: 'head', q: 1, r: 'rare', price: 120, int: 2, critChance: 0.05 },
        { n: "Mezstorm's Conduit", slot: 'amulet', forCompanion: 'Mezstorm', q: 1, r: 'rare', price: 90, atk: 2, def: 0, hp: 15, d: 'A crystal that channels storm energy. +2 ATK, +15 HP' },
        { n: "Senedra's Hawkeye Lens", slot: 'ring', forCompanion: 'Senedra', q: 1, r: 'rare', price: 85, atk: 2, def: 0, spd: 2, d: 'A spyglass that sees weakness. +2 ATK, +2 SPD' }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Jonathan', t: 'trader', title: 'The Gearsmith', icon: '⚙️', col: '#f97316', zone: 'Ember Peak', zoneLv: 4,
      d: 'A tinkerer who sets up shop near Ember Peak. Deals in mechanical parts and weapon upgrades.',
      stock: [
        { n: 'Gear Assembly', t: 'mat', q: 1, r: 'uncommon', price: 20 },
        { n: 'Reinforced Plate', t: 'mat', q: 1, r: 'rare', price: 35 },
        { n: 'Tinker Wrench', slot: 'weapon', q: 1, r: 'uncommon', price: 45, atk: 4 }
      ],
      unlocked: false, zone: 'Ember Peak', zoneLv: 4, visitCount: 0 },
    { n: 'Mimi', t: 'ally', title: 'The Whisperer', icon: '🦋', col: '#8b5cf6',
      d: 'A mysterious ally who communicates through dreams. Grants visions and cryptic advice.',
      ability: 'Dreamsight: Reveals hidden quest paths and secret loot locations.',
      unlocked: false, ul: 5, affinityReq: 40, reqMember: 'Mezstorm' },
    { n: 'Aisy', t: 'ally', title: 'The Shadow Walker', icon: '🌙', col: '#6366f1',
      d: 'A wandering spirit who aids those she deems worthy. Enhances stealth and evasion.',
      ability: 'Shadow Step: 20% chance to avoid enemy attacks entirely.',
      unlocked: false, ul: 7, affinityReq: 50, reqMember: 'Aisyah' },
    { n: 'Amad', t: 'trader', title: 'Brunei Food Merchant', icon: '🍜', col: '#16a34a', zone: 'Whispering Woods', zoneLv: 1,
      d: 'A warm-hearted vendor from Bandar Seri Begawan. Sells authentic Brunei comfort food and drinks. He will buy anything you have — drops, loot, used gear — at fair prices.',
      stock: [
        { n: 'Nasi Katok', t: 'food', eff: 'heal', v: 25, q: 1, r: 'common', price: 12, d: 'Bruneian rice with sambal and fried chicken. Restores 25 HP.' },
        { n: 'Nasi Lemak', t: 'food', eff: 'heal', v: 35, q: 1, r: 'common', price: 18, d: 'Coconut rice with anchovies, peanuts, egg and sambal. Restores 35 HP.' },
        { n: 'Salad', t: 'food', eff: 'heal', v: 20, q: 1, r: 'common', price: 10, d: 'Fresh greens with tangy dressing. Restores 20 HP.' },
        { n: 'Mee Goreng', t: 'food', eff: 'heal', v: 30, q: 1, r: 'common', price: 15, d: 'Stir-fried noodles with spice and soul. Restores 30 HP.' },
        { n: 'Cauli Rice', t: 'food', eff: 'heal', v: 40, q: 1, r: 'uncommon', price: 22, d: 'Low-carb cauliflower rice bowl. Restores 40 HP.' },
        { n: 'Teh Tarik', t: 'drink', eff: 'mana', v: 20, q: 1, r: 'common', price: 10, d: 'Pulled milk tea, sweet and creamy. Restores 20 MP.' },
        { n: 'Kopi O', t: 'drink', eff: 'mana', v: 30, q: 1, r: 'common', price: 14, d: 'Strong black coffee, Brunei style. Restores 30 MP.' },
        { n: 'Fresh Juice', t: 'drink', eff: 'mana', v: 25, q: 1, r: 'common', price: 12, d: 'Tropical fruit blend, freshly squeezed. Restores 25 MP.' }
      ],
      unlocked: true, visitCount: 0, buysAnything: true },
    { n: 'Vex', t: 'trader', title: 'Planar Curio Dealer', icon: '🌀', col: '#a855f7', zone: 'Arcane Planar Tower', zoneLv: 11,
      d: 'A being of indeterminate origin who trades in planar curiosities. Their wares shimmer with unstable energy.',
      stock: [
        { n: 'Planar Essence', t: 'mat', q: 1, r: 'rare', price: 45 },
        { n: 'Aether Shard', t: 'mat', q: 1, r: 'rare', price: 55 },
        { n: 'Chrono Sand', t: 'mat', q: 1, r: 'epic', price: 120 },
        { n: 'Void Thread', t: 'mat', q: 1, r: 'epic', price: 100 },
        { n: 'Planar Wand', slot: 'weapon', q: 1, r: 'epic', price: 450, atk: 16, int: 5, arcaneDmg: 6 },
        { n: 'Riftward Cloak', slot: 'armor', q: 1, r: 'rare', price: 280, def: 8, int: 3, voidRes: 0.15 }
      ],
      unlocked: false, visitCount: 0 },
          // === PHASE 1: LV 22 TRADER ===
    { n: 'Astrid', t: 'trader', title: 'Astral Merchant', icon: '✨', col: '#a855f7', zone: 'The Astral Maelstrom', zoneLv: 22,
      d: 'A being woven from starlight who trades in astral artifacts. Her voice echoes like a memory of something beautiful.',
      stock: [
        { n: 'Astral Dust', t: 'mat', q: 1, r: 'rare', price: 55 },
        { n: 'Void Fragment', t: 'mat', q: 1, r: 'rare', price: 65 },
        { n: 'Astral Wand', slot: 'weapon', q: 1, r: 'epic', price: 500, atk: 18, int: 6, arcaneDmg: 7 },
        { n: 'Voidweave Cloak', slot: 'armor', q: 1, r: 'epic', price: 320, def: 10, int: 4, voidRes: 0.20 },
        { n: 'Starlight Pendant', slot: 'amulet', q: 1, r: 'rare', price: 180, int: 5, mpRegen: 3 },
        { n: 'Planar Essence', t: 'mat', q: 1, r: 'rare', price: 50 }
      ],
      unlocked: false, visitCount: 0 },
          // === PHASE 3: LV 21-29 TRADERS ===
    { n: 'Kael', t: 'trader', title: 'The Last Astronomer', icon: '🔭', col: '#6366f1', zone: 'The Fractured Veil', zoneLv: 21,
      d: 'A gaunt figure hunched over a telescope pointed at nothing. He trades in starlight and secrets. His eyes have seen too many dimensions.',
      stock: [
        { n: 'Reality Fragment', t: 'mat', q: 1, r: 'rare', price: 60 },
        { n: 'Aether Shard', t: 'mat', q: 1, r: 'rare', price: 55 },
        { n: 'Chrono Sand', t: 'mat', q: 1, r: 'epic', price: 130 },
        { n: 'Veil Piercer', slot: 'weapon', q: 1, r: 'epic', price: 550, atk: 20, int: 7, arcaneDmg: 8 },
        { n: 'Starshroud Cloak', slot: 'armor', q: 1, r: 'epic', price: 350, def: 12, int: 5, arcaneRes: 0.25 },
        { n: 'Astronomer\'s Lens', slot: 'amulet', q: 1, r: 'rare', price: 200, int: 6, mpRegen: 4 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Ignis', t: 'trader', title: 'The Crucible Keeper', icon: '🔥', col: '#dc2626', zone: 'Infernal Crucible', zoneLv: 23,
      d: 'A being of living flame who tends the eternal forge. His wares are forged in the heart of a dying star. He speaks in embers.',
      stock: [
        { n: 'Inferno Gem', t: 'mat', q: 1, r: 'rare', price: 70 },
        { n: 'Ash Crystal', t: 'mat', q: 1, r: 'rare', price: 65 },
        { n: 'Ember Core', t: 'mat', q: 1, r: 'epic', price: 140 },
        { n: 'Phoenix Ash', t: 'mat', q: 1, r: 'epic', price: 150 },
        { n: 'Infernal Brand', slot: 'weapon', q: 1, r: 'epic', price: 600, atk: 22, str: 6, fireDmg: 10 },
        { n: 'Magmaforged Plate', slot: 'armor', q: 1, r: 'epic', price: 380, def: 14, con: 5, fireRes: 0.30 },
        { n: 'Cinder Ring', slot: 'ring', q: 1, r: 'rare', price: 220, str: 5, fireDmg: 5, hpRegen: 2 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Glacielle', t: 'trader', title: 'The Frozen Merchant', icon: '❄️', col: '#06b6d4', zone: 'The Scorched Vein', zoneLv: 24,
      d: 'An ice-witch who sells cold in a world of fire. Her breath frosts the air. Her prices are as sharp as her tongue.',
      stock: [
        { n: 'Magma Core', t: 'mat', q: 1, r: 'rare', price: 75 },
        { n: 'Glass Shard', t: 'mat', q: 1, r: 'uncommon', price: 40 },
        { n: 'Scorched Ember', t: 'mat', q: 1, r: 'rare', price: 70 },
        { n: 'Frostfire Blade', slot: 'weapon', q: 1, r: 'epic', price: 650, atk: 24, dex: 5, fireDmg: 6, iceDmg: 6 },
        { n: 'Thermal Ward', slot: 'armor', q: 1, r: 'epic', price: 400, def: 13, con: 4, fireRes: 0.20, iceRes: 0.20 },
        { n: 'Equilibrium Stone', slot: 'amulet', q: 1, r: 'rare', price: 250, int: 5, fireDmg: 3, iceDmg: 3 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Marinus', t: 'trader', title: 'The Drowned Trader', icon: '🌊', col: '#0891b2', zone: 'Tidal Abyss', zoneLv: 25,
      d: 'A spectral sailor who walks on the abyssal floor. His wares are waterlogged but powerful. He trades in pressure and pearls.',
      stock: [
        { n: 'Abyssal Pearl', t: 'mat', q: 1, r: 'rare', price: 80 },
        { n: 'Frozen Ink', t: 'mat', q: 1, r: 'rare', price: 75 },
        { n: 'Pressure Stone', t: 'mat', q: 1, r: 'epic', price: 160 },
        { n: 'Abyssal Trident', slot: 'weapon', q: 1, r: 'epic', price: 700, atk: 26, str: 5, iceDmg: 8 },
        { n: 'Kraken Scale Mail', slot: 'armor', q: 1, r: 'epic', price: 420, def: 15, con: 6, iceRes: 0.25 },
        { n: 'Depth Charge', slot: 'amulet', q: 1, r: 'rare', price: 280, wis: 5, iceDmg: 4, mpRegen: 3 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Fulgora', t: 'trader', title: 'The Storm Merchant', icon: '⚡', col: '#eab308', zone: 'The Shattered Crown', zoneLv: 26,
      d: 'A lightning-weaver who sells the storm\'s fury. Her hair crackles with static. Her shop is a Faraday cage of gold and thunder.',
      stock: [
        { n: 'Crown Fragment', t: 'mat', q: 1, r: 'rare', price: 85 },
        { n: 'Sovereign Essence', t: 'mat', q: 1, r: 'epic', price: 170 },
        { n: 'Skyfall Ore', t: 'mat', q: 1, r: 'rare', price: 80 },
        { n: 'Thunderlord Spear', slot: 'weapon', q: 1, r: 'legendary', price: 800, atk: 28, dex: 6, lightDmg: 12 },
        { n: 'Stormweave Robes', slot: 'armor', q: 1, r: 'epic', price: 450, def: 14, int: 6, lightRes: 0.30 },
        { n: 'Lightning Rod Band', slot: 'ring', q: 1, r: 'epic', price: 320, dex: 5, lightDmg: 6, critChance: 0.05 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Nullus', t: 'trader', title: 'The Void Broker', icon: '🌑', col: '#a855f7', zone: 'The Hollow Throne', zoneLv: 27,
      d: 'A faceless merchant who speaks from the shadows. His wares are memories of things that never existed. He takes payment in secrets.',
      stock: [
        { n: 'Throne Shard', t: 'mat', q: 1, r: 'epic', price: 180 },
        { n: 'Hollow Crown', t: 'mat', q: 1, r: 'epic', price: 190 },
        { n: 'Void Silk', t: 'mat', q: 1, r: 'rare', price: 90 },
        { n: 'Null Blade', slot: 'weapon', q: 1, r: 'legendary', price: 900, atk: 30, int: 7, voidDmg: 14 },
        { n: 'Voidshroud Mantle', slot: 'armor', q: 1, r: 'legendary', price: 500, def: 16, int: 6, voidRes: 0.35 },
        { n: 'Absorption Ring', slot: 'ring', q: 1, r: 'epic', price: 350, int: 6, voidDmg: 5, lifeSteal: 0.08 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'Chrona', t: 'trader', title: 'The Time Merchant', icon: '⏳', col: '#ec4899', zone: 'The Final Spire', zoneLv: 28,
      d: 'A merchant who exists in all moments at once. She sells futures and pasts. Her prices are paid in years, but she accepts gold too.',
      stock: [
        { n: 'Spire Keystone', t: 'mat', q: 1, r: 'epic', price: 200 },
        { n: 'Reality Thread', t: 'mat', q: 1, r: 'epic', price: 210 },
        { n: 'Chrono Crystal', t: 'mat', q: 1, r: 'legendary', price: 250 },
        { n: 'Paradox Edge', slot: 'weapon', q: 1, r: 'legendary', price: 1000, atk: 32, int: 8, arcaneDmg: 12, mpRegen: 3 },
        { n: 'Temporal Aegis', slot: 'armor', q: 1, r: 'legendary', price: 550, def: 18, wis: 7, arcaneRes: 0.30, hpRegen: 4 },
        { n: 'Infinity Loop', slot: 'ring', q: 1, r: 'legendary', price: 400, int: 7, wis: 4, arcaneDmg: 6, mpRegen: 4 }
      ],
      unlocked: false, visitCount: 0 },
    { n: 'The Arbiter', t: 'trader', title: 'Final Curio Dealer', icon: '👁️', col: '#f59e0b', zone: 'The Apex', zoneLv: 29,
      d: 'The last merchant in all realities. He has seen the end of everything. His wares are the remnants of completed worlds. He does not haggle.',
      stock: [
        { n: 'Apex Fragment', t: 'mat', q: 1, r: 'legendary', price: 300 },
        { n: 'Final Key', t: 'mat', q: 1, r: 'legendary', price: 350 },
        { n: 'Gate Stone', t: 'mat', q: 1, r: 'legendary', price: 400 },
        { n: 'Reality Sunderer', slot: 'weapon', q: 1, r: 'legendary', price: 1500, atk: 40, int: 10, arcaneDmg: 15, voidDmg: 10, critChance: 0.08 },
        { n: 'Apex Vestment', slot: 'armor', q: 1, r: 'legendary', price: 800, def: 22, int: 8, wis: 5, arcaneRes: 0.35, voidRes: 0.25, hpRegen: 5, mpRegen: 5 },
        { n: 'The Crown of Ends', slot: 'head', q: 1, r: 'legendary', price: 600, int: 10, wis: 6, arcaneDmg: 8, voidDmg: 6, lifeSteal: 0.10, mpRegen: 3 },
        { n: 'Planar Essence', t: 'mat', q: 3, r: 'rare', price: 55 }
      ],
      unlocked: false, visitCount: 0 },


  ],   
  bosses: [
    { n: 'Goblin King', zone: 'Whispering Woods', hp: 150, mhp: 150, atk: 12, def: 5, xp: 35, g: 35, 
      mechanic: 'rampage', rampageTurn: 3, rampageDmg: 25, desc: 'Enrages after 3 turns. All party members must attack.' },
    { n: 'Bone Tyrant', zone: 'Cursed Catacombs', hp: 250, mhp: 250, atk: 15, def: 8, xp: 60, g: 55,
      mechanic: 'resurrect', resurrectCount: 2, desc: 'Resurrects twice. Kill it 3 times.' },
    { n: 'Crystal Leviathan', zone: 'Crystal Caverns', hp: 300, mhp: 300, atk: 18, def: 10, xp: 90, g: 85,
      mechanic: 'phase', phases: 3, currentPhase: 1, phaseHp: 100, desc: 'Shifts phases every 100 HP. Changes weaknesses.' },
    { n: 'Ember Dragon', zone: 'Ember Peak', hp: 400, mhp: 400, atk: 22, def: 12, xp: 120, g: 110,
      mechanic: 'inferno', infernoTurn: 4, infernoDmg: 40, desc: 'Charges inferno for 4 turns. Interrupt or die.' },
    { n: 'Storm Tyrant', zone: 'Stormhold', hp: 500, mhp: 500, atk: 25, def: 15, xp: 150, g: 140,
      mechanic: 'lightning_rod', rodTurns: 3, desc: 'Lightning strikes weakest member every 3 turns.' },
    { n: 'Frost Queen', zone: 'Frostspire Ruins', hp: 600, mhp: 600, atk: 28, def: 18, xp: 200, g: 180,
      mechanic: 'freeze', freezeChance: 0.3, desc: '30% chance to freeze a party member each turn.' },
    { n: 'Abyssal Leviathan', zone: 'Abyssal Depths', hp: 1000, mhp: 1000, atk: 35, def: 20, xp: 300, g: 250,
      mechanic: 'devour', devourTurn: 5, desc: 'Devours a party member on turn 5 if not staggered by all attackers.' },
    { n: 'Elder Dragon', zone: "Dragon's Maw", hp: 1500, mhp: 1500, atk: 40, def: 25, xp: 460, g: 2000,
      mechanic: 'apocalypse', apocalypseTurn: 6, desc: 'Ultimate attack on turn 6. Must kill before then.' },
    { n: 'Starlord', zone: 'Starlight Spire', hp: 2500, mhp: 2500, atk: 50, def: 30, xp: 600, g: 500,
      mechanic: 'cosmic', cosmicPhase: 1, desc: 'The final boss. Shifts cosmic phases. Requires perfect coordination.' },
    { n: 'The Planarch', zone: 'Arcane Planar Tower', hp: 3000, mhp: 3000, atk: 55, def: 32, xp: 800, g: 600,
      mechanic: 'planar_shift', shiftTurn: 3, phases: 5, currentPhase: 1, desc: 'A being of pure planar energy. Every 3 turns, it shifts dimensions — changing weaknesses, spawning rifts, and warping the battlefield. Survive 5 planar shifts to win.' },
    { n: 'The Nexus Planarch', zone: 'The Nexus', hp: 2500, mhp: 2500, atk: 60, def: 35, xp: 1200, g: 800,
      mechanic: 'nexus_planarch', shiftTurn: 4, phases: 5, currentPhase: 1, desc: 'The true form of the Planarch at the heart of all dimensions. Each phase embodies a different planar element. Defeat all five to sever the rift forever.', nexus: true },
          { n: 'The Veilshaper', zone: 'The Fractured Veil', hp: 3500, mhp: 3500, atk: 65, def: 38, xp: 1500, g: 900,
      mechanic: 'reality_weave', weaveTurn: 3, desc: 'A being of pure fractured reality. Every 3 turns, it weaves a new dimension — summoning echoes of itself and shifting resistances.' },
        // === PHASE 1: LV 22-23 BOSSES ===
  { n: 'The Astral Devourer', zone: 'The Astral Maelstrom', hp: 4000, mhp: 4000, atk: 70, def: 40, xp: 1800, g: 1000,
    mechanic: 'astral_phase', shiftTurn: 3, phases: 4, currentPhase: 1, desc: 'A being that consumes dimensions. Shifts between astral phases, each more dangerous than the last.' },
  { n: 'The Infernal Tyrant', zone: 'Infernal Crucible', hp: 4500, mhp: 4500, atk: 75, def: 42, xp: 2000, g: 1100,
        mechanic: 'inferno_core', infernoTurn: 4, infernoDmg: 50, desc: 'The heart of the Crucible given form. Builds inferno energy for 4 turns — interrupt or be incinerated.' },

    // === GAP FILLER ===
    { n: 'The Drowned King', zone: 'Sunken Temple', hp: 1800, mhp: 1800, atk: 38, def: 22, xp: 350, g: 300,
      mechanic: 'drown', drownTurn: 4, desc: 'Floods the battlefield on turn 4. All must save or take massive damage.' },

    // === PHASE 3 BOSSES: LV 24-29 ===
    { n: 'The Scorched Tyrant', zone: 'The Scorched Vein', hp: 5500, mhp: 5500, atk: 80, def: 45, xp: 2200, g: 1200,
      mechanic: 'inferno_core', infernoTurn: 4, infernoDmg: 55, desc: 'The heart of the Vein given form. Builds inferno energy for 4 turns — interrupt or be incinerated.' },
    { n: 'The Tidal Leviathan', zone: 'Tidal Abyss', hp: 6000, mhp: 6000, atk: 85, def: 48, xp: 2400, g: 1300,
      mechanic: 'crush', crushTurn: 5, desc: 'Pressure builds each turn. On turn 5, unleashes crushing depth damage to all.' },
    { n: 'The Fallen Sovereign', zone: 'The Shattered Crown', hp: 6500, mhp: 6500, atk: 90, def: 50, xp: 2600, g: 1400,
      mechanic: 'lightning_rod', rodTurns: 3, desc: 'Lightning strikes weakest member every 3 turns. The crown demands tribute.' },
    { n: 'The Hollow King', zone: 'The Hollow Throne', hp: 7000, mhp: 7000, atk: 95, def: 52, xp: 2800, g: 1500,
      mechanic: 'devour', devourTurn: 5, desc: 'The throne devours a party member on turn 5 if not staggered by all attackers.' },
    { n: 'The Spire Architect', zone: 'The Final Spire', hp: 7500, mhp: 7500, atk: 100, def: 55, xp: 3000, g: 1600,
      mechanic: 'planar_shift', shiftTurn: 3, phases: 5, currentPhase: 1, desc: 'A being of pure spire energy. Every 3 turns, it shifts dimensions — changing weaknesses, spawning constructs, and warping the battlefield. Survive 5 planar shifts to win.' },
    { n: 'The Apex Arbiter', zone: 'The Apex', hp: 8000, mhp: 8000, atk: 105, def: 58, xp: 3200, g: 1700,
      mechanic: 'nexus_planarch', shiftTurn: 4, phases: 5, currentPhase: 1, desc: 'The final guardian of the Apex. Each phase embodies a different planar element. Defeat all five to ascend beyond.', nexus: true },

    // === ACT 1: THE SHATTERED NOW (LV 30-35) ===
    { n: 'The Fracture', zone: 'The Breaking', hp: 9000, mhp: 9000, atk: 112, def: 60, xp: 3500, g: 1850,
      mechanic: 'reality_weave', weaveTurn: 3, desc: 'The wound left where the Planarch used to be. Every 3 turns it weaves the battlefield into something new, refusing to let this reality settle.' },
    { n: 'The Last Guard', zone: 'The Silent Ruin', hp: 9600, mhp: 9600, atk: 116, def: 62, xp: 3700, g: 1950,
      mechanic: 'rampage', rampageTurn: 3, rampageDmg: 60, desc: "Still defending a city that's already gone. Enrages after 3 turns, refusing to stand down even now." },
    { n: 'Scavenger King', zone: 'Ashfall Market', hp: 10200, mhp: 10200, atk: 120, def: 64, xp: 3900, g: 2050,
      mechanic: 'resurrect', resurrectCount: 2, desc: 'Wearing looted armor from a dozen fallen traders. Resurrects twice, scavenging a new advantage each time.' },
    { n: 'Debt Wraith', zone: 'The Drowned Ledger', hp: 10800, mhp: 10800, atk: 124, def: 66, xp: 4100, g: 2150,
      mechanic: 'drown', drownTurn: 4, desc: 'The shape of an account that never balanced. Floods the battlefield every 4 turns — numbers that never add up, drowning everyone in them.' },
    { n: 'The Foreman', zone: 'Rustbound Docks', hp: 11400, mhp: 11400, atk: 128, def: 68, xp: 4300, g: 2250,
      mechanic: 'crush', crushTurn: 5, desc: 'Overtime and exhaustion given a supervisor\'s voice. Pressure builds every 5 turns until it crushes whoever is still standing.' },
    { n: 'Echo of Joel', zone: "The Widow's Watch", hp: 12000, mhp: 12000, atk: 132, def: 70, xp: 4500, g: 2350,
      mechanic: 'phase', phases: 3, currentPhase: 1, phaseHp: 4000, desc: 'A future where the letter was never sent. Shifts through three phases of grief — denial, anger, and the long quiet after — growing more dangerous with each.' },

    // === ACT 2: THE LONG SILENCE (LV 36-40) ===
    { n: 'The Vanished Guide', zone: 'Forgotten Pemmican Roads', hp: 12800, mhp: 12800, atk: 138, def: 74, xp: 4800, g: 2500,
      mechanic: 'phase', phases: 3, currentPhase: 1, phaseHp: 4266, desc: "A shape that appears at the edge of the road, then isn't there, then is. It has forgotten how to be found — or how to be followed." },
    { n: 'Hollow Eliz', zone: 'The Quiet Nursery', hp: 13600, mhp: 13600, atk: 144, def: 78, xp: 5200, g: 2700,
      mechanic: 'devour', devourTurn: 5, desc: 'A future where no one was there to catch her. The gentlest thing in this timeline, and the most dangerous, because gentleness with nothing left to protect turns into something else entirely.' },
    { n: 'Rustbound Zaki', zone: 'Bladeless Barracks', hp: 14400, mhp: 14400, atk: 150, def: 82, xp: 5600, g: 2900,
      mechanic: 'rampage', rampageTurn: 3, rampageDmg: 65, desc: 'The boy who checked his pack seventeen times, hardened into someone who stopped checking anything at all. Enrages after 3 turns — the fear never left, it just stopped showing.' },
    { n: 'Mezstorm Unbound', zone: 'The Storm That Stayed', hp: 15200, mhp: 15200, atk: 156, def: 86, xp: 6000, g: 3100,
      mechanic: 'lightning_rod', rodTurns: 3, desc: 'Estrangement given permanent weather. Lightning strikes the weakest member every 3 turns — the storm always finds the distance that hurts most.' },
    { n: 'The Fading Familiar', zone: "Embercat's Grave", hp: 16000, mhp: 16000, atk: 162, def: 90, xp: 6500, g: 3400,
      mechanic: 'resurrect', resurrectCount: 1, desc: 'Even spirit-flame gutters if no one remembers to tend it. Resurrects once more before the ember finally goes out — a warning about what forgetting costs, wearing a familiar shape.' },
  ],

  currentBoss: null,
  // Phase 2: Dimensional Instability
  riftCounter: 0,
  riftTriggerAt: 3 + Math.floor(Math.random() * 3), // 3-5 fights
  currentRift: null, // 'gravity', 'time', 'void'
  riftFightsRemaining: 0,
  // Phase 2: Talent System
  talents: [], // unlocked talent IDs
  talentPoints: 0,
  // Phase 2: Rune Socketing
  runes: [], // inventory of runes
  runeSocketOpen: null, // [itemIndex, slot] currently being socketed
  secretArea: { active: false, zone: null, choice: null, result: null },
  playerSpec: { path: null, tiers: [], respecCount: 0, lastRespec: 0 },
  currentMiniStory: null,
storyJournal: {
    unlocked: [],
    read: [],
    entries: [
      {
        id: 'journal_001',
        title: 'The Rain and the Kitten',
        chapter: 1,
        unlockType: 'level',
        unlockAt: 1,
        icon: '🌧️',
        summary: 'How Soel came to be, and how Joel found him.',
        scenes: [
          { speaker: 'Narrator', text: "It began with rain. The kind that falls for days in Brunei and turns the world soft and gray, that makes the kampong roads muddy and the air smell of wet earth." },
          { speaker: 'Joel', text: "\"She was starving,\" Joel says, though you do not remember asking. \"The mother cat. Skin and bones under the porch.\"" },
          { speaker: 'Joel', text: "\"I fed her. Every day. Did not plan to. Just... could not stop.\" His voice carries the weight of every stray he has ever fed, every broken thing he has ever fixed." },
          { speaker: 'Narrator', text: "Weeks later, the mother cat vanished. In her place: a cardboard box, sodden at the edges, filled with five damp bundles of fur. Kittens. Five of them, mewling, blind, impossibly small." },
          { speaker: 'Joel', text: "\"Gave three away. Kept one for the mother cat, in case she came back.\" He pauses, looking at something you cannot see. \"She did not.\"" },
          { speaker: 'Joel', text: "\"The last one... he would not stop staring at me. Like he had already decided.\" Joel smiles — rare, small, precious. \"I named him Soel.\"" },
          { speaker: 'Narrator', text: "Soel. A name that sounds like rain on a roof. Like something small and certain. Like the space between San and Joel — the letters overlapping, the sounds merging." },
          { speaker: 'Narrator', text: "Soel grew. Soel watched. Soel chose you, on the nights you visited Joel, climbing into your lap like he had been waiting for you specifically." },
          { speaker: 'Narrator', text: "Then came the dorm assignment. Joel and his friends, moved across the city. New building. New rules. No pets allowed." },
          { speaker: 'Joel', text: "\"Take him,\" Joel said, not looking at you. \"He already chose you anyway.\"" },
          { speaker: 'Narrator', text: "Soel rode home in your pack, purring like a motor. Like he had always known the way. Like he had always known you would need him." }
        ]
      },
      {
        id: 'journal_002',
        title: 'The Awakening',
        chapter: 2,
        unlockType: 'level',
        unlockAt: 5,
        icon: '✨',
        summary: 'Waking in Aethon. The mark. The two moons.',
        scenes: [
          { speaker: 'Narrator', text: "You wake in a field of silver grass. The sky is wrong — two moons, one bleeding red. A voice whispers your name. Not San. Something older." },
          { speaker: 'Narrator', text: "Your name is San. You are the youngest of three sisters, born in Brunei Darussalam, raised under the weight of family and duty and love that costs more than it should." },
          { speaker: 'Narrator', text: "You are a Sorcerer — or you will be, once you remember what that means. The mark on your wrist pulses with silver light, veins crawling upward like roots seeking sun." },
          { speaker: 'Soel', text: "A small cat curls at your feet, purring like he has always known you. His name is Soel. He came with the rain. He chose you. That is rare. That is everything." },
          { speaker: 'Narrator', text: "Your journey begins in the Whispering Woods. Survive. Grow. Find what was taken from you. And remember — in Aethon, as in Brunei, family is not a choice you make. It is a gravity you orbit." }
        ]
      },
      {
        id: 'journal_003',
        title: 'The First Bond',
        chapter: 3,
        unlockType: 'level',
        unlockAt: 8,
        icon: '🛡️',
        summary: 'Joel stands between you and everything that would harm you.',
        scenes: [
          { speaker: 'Joel', text: "\"You look like you need a shield,\" a voice says. Joel stands in the doorway, already armored, already certain. The steadfast man from a Philippine village, second of four, breadwinner, stray-feeder, yours." },
          { speaker: 'Joel', text: "\"I do not ask why you are here. I ask if you will let me stand beside you while you find out.\" He does not look at the mark on your wrist. He looks at your face. He always looks at your face." },
          { speaker: 'Narrator', text: "Joel joins your party. His shield is heavy. His loyalty is heavier. In this world, as in the last, he is The Steadfast — the one who stands between you and everything that would harm you." }
        ]
      },
      {
        id: 'journal_004',
        title: 'Sisterblade',
        chapter: 4,
        unlockType: 'level',
        unlockAt: 10,
        icon: '🗡️',
        summary: 'Aisyah steps from the shadows. Family with knives.',
        scenes: [
          { speaker: 'Aisyah', text: "\"Took you long enough,\" she says, stepping from the shadows. Her daggers glint like teeth. Your eldest sister, fifty-something in the old world, sharp-eyed and sharper-tongued, taught you to trade before she taught you to fight." },
          { speaker: 'Aisyah', text: "\"Mum asked me to check on you. I told her you were fine. Do not make me a liar.\" Her hands shake, just slightly. She has been looking for you. She always looks for you." },
          { speaker: 'Narrator', text: "Aisyah joins your party. Family is complicated. Family with knives is complicated and useful. She taught you the trade routes of Brunei. Now she teaches you the dangerous paths of Aethon." }
        ]
      },
            {
        id: 'journal_005',
        title: 'The Weight of Before',
        chapter: 5,
        unlockType: 'level',
        unlockAt: 12,
        icon: '🕯️',
        summary: 'San and Joel confront the children they left behind.',
        scenes: [
          { speaker: 'Narrator', text: "The campfire burns low. Joel sits across from you, sharpening his shield strap with methodical patience — the same patience he brings to everything, including you. Especially you." },
          { speaker: 'Joel', text: "\"Do you ever think about them?\" he asks, not looking up. You know who he means. You have always known." },
          { speaker: 'San', text: "You stare into the flames. \"Every day,\" you admit. \"The youngest was only one. He was learning to walk. I left before he learned my name.\"" },
          { speaker: 'Narrator', text: "The words hang in the air like smoke. You have never said this out loud. Not to Joel. Not to anyone. The shame has been a stone in your chest for years, growing heavier with each birthday you missed, each milestone you only heard about through strained silence." },
          { speaker: 'San', text: "\"Her grandmother fed him lies,\" you say, and your voice is steadier than you feel. \"About me. About my family. She made me feel small in my own home. And I was — I was so tired, Joel. I was drowning in a house that was never mine, in a life that was never mine. I didn't know I was autistic then. I just knew I was broken somehow, and I couldn't fix it fast enough for them.\"" },
                    { speaker: 'Joel', text: "\"My daughter,\" he says quietly. \"She is one year older than your eldest. She was born after we broke. Before that, I had already taken the job in Brunei. I didn't leave her mother — I left for work.\" He pauses, the fire catching the lines around his eyes. \"Her mother found someone new. Had another baby. I send money every month. My mother visits, gives it to her. Holds her. Tells her about me. I have never watched her first steps. Never heard her first word. I visit every two years, when my contract renews. It is not the same. It is never the same.\"" },
          { speaker: 'Narrator', text: "The fire pops. Sparks rise into a sky with two moons. You think of Brunei. You think of the small apartment where you tried to be a wife, a mother, a daughter-in-law, everything to everyone, until there was nothing left of you but exhaustion and the certainty that you were failing at all of it." },
          { speaker: 'San', text: "\"Mez left home young,\" you say, and the old grief surfaces, familiar as a scar. \"She was strong. She made money. She could give Mum and Dad things I never could. And I was — I was stuck. In the marriage. In my own head. In the fear that if I left, I would be proving them right. That I was never good enough.\"" },
          { speaker: 'San', text: "\"Mum fell into depression. Dad has cancer. And I was across the city, barely surviving myself, hating myself for not being the daughter they deserved. Mez was the good one. I was the one who disappeared.\"" },
          { speaker: 'Joel', text: "\"You did not disappear,\" Joel says, and his voice is firm, the way it gets when he is certain of something. \"You escaped. There is a difference. You were dying, San. I saw it. I see it still, sometimes, in the way you check your gold three times, in the way you flinch when voices get loud. You were not broken. You were surviving in a place that demanded you break yourself to fit.\"" },
          { speaker: 'Narrator', text: "You think of Soel, curled asleep in your pack. The kitten who came with the rain. The spirit who chose you when no one else did. He was the first thing that was yours, truly yours, in a life where everything had been borrowed or negotiated or endured." },
          { speaker: 'San', text: "\"Soel turned everything around,\" you whisper. \"He needed me. Just me. Not a wife. Not a daughter-in-law. Just — me. And then you found us. And you didn't ask me to be anything except what I already was.\"" },
          { speaker: 'Joel', text: "\"I was starving too,\" Joel admits. \"I fed stray cats because I could not feed my own child. I fixed things because I could not fix my own life. And then I found you, and Soel, and for the first time, I was not just the man who sends money and hopes. I was present. I was chosen. You chose me, San. Every day, you choose me.\"" },
          { speaker: 'Narrator', text: "You look at your hands. They are younger here. You noticed it weeks ago, dismissed it as a trick of the light, a quirk of Aethon's magic. But Joel's face is softer too, less lined, the weight of years lifted from his shoulders. You are not the people you were in Brunei. You are the people you might have been, if the world had been kinder." },
          { speaker: 'Narrator', text: "\"We are given a second chance,\" you say, and the realization settles into you like warmth, like breath after drowning. \"Not just to fight. Not just to survive. To — to be. To be young again. To choose differently. To love without the weight of what came before.\"" },
          { speaker: 'Joel', text: "Joel stands. He walks around the fire. He kneels before you, takes your hands in his — rough, calloused, steady. \"Then let us choose,\" he says. \"Let us be the people we were meant to be. Together. In whatever world will have us.\"" },
          { speaker: 'Narrator', text: "The moons drift behind a silver cloud. The fire burns down to embers. And in the quiet dark, you let yourself be held — not as San the breadwinner, not as San the runaway, not as San the failure. Just San. Just Joel. Just two people who found each other in the wreckage, and chose to build something whole." },
          { speaker: 'Narrator', text: "Soel purrs from his corner, eyes half-lidded, watching. He has always known. He chose you both, after all. And a spirit cat's choice is never wrong." }
        ]
      },
      {
        id: 'journal_006',
        title: "The Healer's Light",
        chapter: 6,
        unlockType: 'level',
        unlockAt: 14,
        icon: '💚',
        summary: 'Eliz presses her hands to yours. Magic in textures and colors.',
        scenes: [
          { speaker: 'Eliz', text: "\"Your aura is frayed,\" she whispers, pressing a cool hand to your forehead. You did not hear her approach. She moves like silence, like the space between heartbeats." },
          { speaker: 'Eliz', text: "\"I will mend what I can. But some wounds are not of the body.\" She is your niece, Mez's daughter, autistic in the old world — which here means she experiences magic in textures and colors no one else can perceive." },
          { speaker: 'Narrator', text: "Eliz joins your party. Her hands glow with gentle light. Her eyes hold older sorrows. She cannot be reduced below 1 HP — a Guardian Spirit, the game calls it. You call it Eliz being Eliz. The girl who has always endured." }
        ]
      },
      {
        id: 'journal_007',
        title: 'The Stormsinger',
        chapter: 7,
        unlockType: 'level',
        unlockAt: 16,
        icon: '⚡',
        summary: 'Mezstorm — the sister who became a stranger, then a stormsinger.',
        scenes: [
          { speaker: 'Mezstorm', text: "Lightning cracks the sky. A figure stands in the rain, hands sparking with static. \"The ley lines brought me to you,\" he says. A voice that is almost familiar. Almost." },
          { speaker: 'Mezstorm', text: "\"Something is wrong in Aethon. The magic itself is... afraid.\" He offers you strange tea. It tastes of copper and regret. You almost remember sharing a room with him, a childhood game, a mother's song." },
          { speaker: 'Narrator', text: "Mezstorm joins your party. He speaks to the storm. Sometimes, it answers. He was Mez once — your middle sister, estranged, hard, distant. The magic made a mistake. Rendered her male, like Edwin in the old tales. The memories are ghost-images now. Vague. Painful. Present." }
        ]
      },
      {
        id: 'journal_008',
        title: 'Shadows of the Past',
        chapter: 8,
        unlockType: 'boss',
        unlockAt: 'Bone Tyrant',
        icon: '💀',
        summary: 'The Cursed Catacombs whisper your name. The estrangement with Mez.',
        scenes: [
          { speaker: 'Narrator', text: "The Cursed Catacombs whisper your name. Not San — something older. Something buried. The estrangement with Mez, the wall you never learned to cross, the niece you loved in the abstract." },
          { speaker: 'Narrator', text: "The Bone Tyrant waits below. It has waited a very long time. It knows about sisters who became strangers. It knows about walls built from silence. It has been waiting for you specifically." }
        ]
      },
      {
        id: 'journal_009',
        title: 'The Frozen Crown',
        chapter: 9,
        unlockType: 'zone',
        unlockAt: 'Frostspire Ruins',
        icon: '❄️',
        summary: 'The Frost Queen learned to be hard. Like Mez. Like you.',
        scenes: [
          { speaker: 'Narrator', text: "Frostspire Ruins rise against the northern sky. The Frost Queen's castle was beautiful once, before the ice took her heart. Before she learned to be hard, to survive, to push away the warmth that might have saved her." },
          { speaker: 'Narrator', text: "They say she still dances in the great hall, alone, waiting for a partner who will never come. You think of Mez. You think of the sister you lost before you knew how to keep her. The ice is not her enemy. The ice is her choice." }
        ]
      },
      {
        id: 'journal_010',
        title: 'Into the Void',
        chapter: 10,
        unlockType: 'boss',
        unlockAt: 'Abyssal Leviathan',
        icon: '🌑',
        summary: 'The void between sisters. The silence where words should have been.',
        scenes: [
          { speaker: 'Narrator', text: "The Abyssal Depths do not belong to this world. They are a wound in reality, and something looks back from the other side. The void between sisters. The silence where words should have been." },
          { speaker: 'Narrator', text: "The Abyssal Leviathan devours light, memory, hope. It has swallowed cities. It would swallow you without noticing. But you are a breadwinner. You have been swallowed before. You know how to climb back out." }
        ]
      },
      {
        id: 'journal_011',
        title: 'Starlight Ascension',
        chapter: 11,
        unlockType: 'boss',
        unlockAt: 'Starlord',
        icon: '⭐',
        summary: 'The hardest truth: love is a decision, made daily.',
        scenes: [
          { speaker: 'Narrator', text: "The Starlight Spire touches the sky. At its peak, the Astral Lord waits — the final gatekeeper, the last question. You have come so far from Brunei. So far from the rain and the kitten and the porch where it all began." },
          { speaker: 'Narrator', text: "The hardest truth is always the last one. That love is not a feeling. It is a decision, made daily, made hourly, made in the space between I am tired and I will keep going anyway." },
          { speaker: 'Soel', text: "Soel rubs against your leg. \"We go together,\" his eyes seem to say. \"Always together.\" He chose you. In the rain. In the dorm. In the rift. In every world, in every form, he chooses you. That is rare. That is everything." }
        ]
      },
      {
        id: 'journal_012',
        title: 'Planar Convergence',
        chapter: 12,
        unlockType: 'boss',
        unlockAt: 'The Planarch',
        icon: '🌀',
        summary: 'The tower, the rift, and the choice to keep going.',
        scenes: [
          { speaker: 'Narrator', text: "The Arcane Planar Tower tears at the seams of reality. Gravity shifts. Time stutters. The walls breathe with planar magic. This is where the rift began — the tear that pulled you from Brunei, from the ordinary Tuesday, from the life you were still learning to live." },
          { speaker: 'Narrator', text: "The Planarch waits at the apex — a being of pure planar energy, shifting dimensions every three turns, warping the battlefield, spawning rifts. It is not evil. It is simply a wound, a place where too many dimensions touched and something woke up." },
          { speaker: 'Narrator', text: "You have survived the rain. You have survived the estrangement. You have survived being a breadwinner in a world that takes more than it gives. The Planarch is just another bill to pay. Another mouth to feed. Another reason to keep going." },
          { speaker: 'Mezstorm', text: "\"The stars are wrong,\" Mezstorm whispers, hands sparking. \"They have been wrong since the tower rose.\" He looks at you, and for a moment — just a moment — you see Mez in his eyes. Your sister. Your storm. Your almost." },
          { speaker: 'Joel', text: "\"Breakfast,\" Joel says, like nothing happened. Like you did not almost end the world in your sleep. He squeezes your shoulder. His hand is warm. It has always been warm." },
          { speaker: 'Narrator', text: "The sun rises over Aethon. Two moons fade. Soel purrs on your chest, kneading soft circles into your heart. The story continues. Not ended. Just paused. And somewhere, in a small village in the Philippines, a mother wakes. In Brunei, two parents check their phones. The gravity still pulls. The orbit still holds. You are still a breadwinner. You are still choosing love. You are still — always — San." }
        ],
      }
            ,
            
      {
        id: 'journal_013',
        title: 'The Astral Threshold',
        chapter: 13,
        unlockType: 'boss',
        unlockAt: 'The Astral Devourer',
        icon: '🌌',
        summary: 'Mezstorm confronts the Devourer, and the mistake of his transformation.',
        scenes: [
          { speaker: 'Narrator', text: "The Astral Maelstrom does not howl. It hums — a frequency that vibrates in your teeth, your bones, the hollow space behind your eyes. This is where dimensions go to die. This is where Mezstorm has led you, though he will not say why." },
          { speaker: 'Mezstorm', text: "\"It knows me,\" Mezstorm says, and his voice is not his own. It is older. It is hers. \"The Devourer. It eats the spaces between what we were and what we became. It will try to eat me first.\"" },
          { speaker: 'Narrator', text: "The Astral Devourer rises from the maelstrom — a shape that is not a shape, a mouth that is every mouth you have ever feared. It does not roar. It remembers. And it remembers Mez." },
          { speaker: 'Aisyah', text: "\"What does it want?\" Aisyah asks, daggers out, always practical, always ready to negotiate with the universe." },
          { speaker: 'Mezstorm', text: "\"It wants me to admit I was wrong,\" Mezstorm says, and lightning cracks around his fists. \"That I should have stayed Mez. That I should have been a better sister. A better daughter. That I should have come home before the magic made the choice for me.\"" },
          { speaker: 'Narrator', text: "The Devourer lunges. Not at the party. At Mezstorm specifically. At the crack in his identity where Mez used to live." },
          { speaker: 'Joel', text: "\"Shield wall!\" Joel roars, and his shield — that battered, faithful thing — catches the Devourer's first strike. The sound is not metal on flesh. It is two histories colliding. \"You do not face this alone, stormsinger. Not while I stand.\"" },
          { speaker: 'Narrator', text: "The fight is not clean. The Devourer shifts phases — Material, Astral, Void, Primordial — and each phase peels back another layer of Mezstorm's composure. By the third phase, he is weeping lightning. By the fourth, he is screaming in a voice that is almost Mez's." },
          { speaker: 'Mezstorm', text: "\"I was scared!\" he screams at the Devourer, at the maelstrom, at the sister he used to be. \"I was scared to come home! I was scared to see what I had become! I was scared that Mum would look at me and see a stranger! I was scared that San would hate me! I was scared that I had failed at being everything everyone needed and I could not face the proof!\"" },
          { speaker: 'Narrator', text: "The Devourer pauses. For one impossible moment, it seems to listen." },
          { speaker: 'Eliz', text: "\"Mum,\" Eliz whispers, and the word hangs in the astral wind like a bell. \"Mum. You are still Mum. Even like this. Even here. Even scared. I know scared. Scared is not the end. Scared is the beginning of brave.\"" },
          { speaker: 'Narrator', text: "Mezstorm looks at his daughter — the girl who sees magic in textures and colors, who cannot be reduced below 1 HP, who has endured more than anyone should have to. He looks at her and something breaks. Something heals." },
          { speaker: 'Mezstorm', text: "\"I am Mez,\" he says quietly. \"And I am Mezstorm. Both. Neither. Something new. Something that is still learning.\" He raises his hands. The lightning is not angry now. It is certain. \"I do not need your permission to exist, Devourer. I do not need anyone's.\"" },
          { speaker: 'Narrator', text: "The final strike is not a spell. It is a declaration. The Devourer dissolves into stardust and regret, and the maelstrom goes quiet." },
          { speaker: 'Soel', text: "Soel climbs onto Mezstorm's chest and kneads soft circles into his heart. The way he kneads into yours. The way he has always known where the hurt lives." },
          { speaker: 'Mezstorm', text: "\"Thank you,\" Mezstorm says to all of you, to none of you, to the sister he was and the stormsinger he is. \"Thank you for not giving up on me. Even when I had.\"" },
          { speaker: 'Narrator', text: "The Astral Maelstrom is still now. In the silence, you hear Brunei. You hear the rain. You hear a mother cat under a porch, starving, waiting for someone kind enough to feed her. You hear Soel, purring. You hear the sound of a family, scattered across worlds, slowly finding its way back to itself." }
        ]
      },
      {
        id: 'journal_014',
        title: 'Heart of Fire',
        chapter: 14,
        unlockType: 'boss',
        unlockAt: 'The Infernal Tyrant',
        icon: '🔥',
        summary: 'Joel faces the fire he has carried since Brunei — and chooses to write instead of send.',
        scenes: [
          { speaker: 'Narrator', text: "The Infernal Crucible is not a place. It is a memory made magma. It is every unsaid word, every unwritten letter, every wire transfer that was supposed to be enough and never was. Joel knows this before you do. You see it in the way his shoulders tighten, the way his shield drops an inch lower than it should." },
          { speaker: 'Joel', text: "\"It looks like my village,\" Joel says, and his voice is very small. \"The church. The road. The house where my mother still prays for me. It is all burning. It has always been burning. I just learned not to look.\"" },
          { speaker: 'Narrator', text: "The Infernal Tyrant rises from the magma — a shape of flame and obligation, of sacrifice without reward, of love measured in dollars sent and years lost. It speaks in the voice of every employer who promised Joel the world and gave him exhaustion. It speaks in the voice of the daughter he has never held." },
          { speaker: 'Infernal Tyrant', text: "\"You sent money,\" the Tyrant says, and the words are embers. \"You sent prayers. You sent your mother to do your loving for you. What kind of father are you? What kind of man?\"" },
          { speaker: 'Narrator', text: "Joel does not raise his shield. For the first time since you have known him, The Steadfast does not stand between you and harm. He stands alone, facing the fire he has carried across worlds." },
          { speaker: 'Joel', text: "\"I am the kind who tried,\" Joel says, and his voice does not shake. \"I am the kind who wakes at 4 AM for a job that does not care if I live or die. I am the kind who sends every dollar I can spare because it is the only way I know to say I am still here. I am still trying. I have not forgotten you. I will never forget you.\"" },
          { speaker: 'Narrator', text: "The Tyrant strikes. Joel does not dodge. He absorbs the blow — not with his shield, but with his history. The fire that should kill him instead passes through, and where it touches, it leaves something behind. Not burns. Words." },
          { speaker: 'Narrator', text: "Words written in flame across his armor, his skin, his heart. A letter, finally, after all these years. Dear anak, it begins. I am sorry I was not there. I am sorry I sent money instead of myself. I am sorry I let fear and distance become habits. I am sorry I let your mother's new family make me feel like I had no right to want more. I am sorry I stopped trying to be your father and settled for being your sender." },
          { speaker: 'Joel', text: "\"I will write to you,\" Joel says to the Tyrant, to the fire, to the daughter who cannot hear him. \"Not money. Words. Every week. Even if they are clumsy. Even if they are late. Even if your mother throws them away. I will write until you know my handwriting better than my mother's face. I will write until you believe I am real.\"" },
          { speaker: 'Narrator', text: "The Infernal Tyrant falters. It was built on silence, on absence, on the lie that sending is the same as being. Joel's words are a different fire — one that illuminates instead of destroys." },
          { speaker: 'San', text: "You step beside him. Your staff is raised, your spells ready, but you do not cast. Not yet. \"Together,\" you say. \"We face this together. Then we find paper. And a pen. And we start.\"" },
          { speaker: 'Narrator', text: "The final blow is not a spell. It is a promise, spoken in unison by a party that has become a family. The Tyrant dissolves into ash and the smell of ink, and the Crucible cools into something that might, one day, be a home." },
          { speaker: 'Soel', text: "Soel rubs against Joel's ankles, purring loud enough to echo. He has always known about the fire. He has always known Joel would learn to use it instead of fear it." },
          { speaker: 'Joel', text: "\"Thank you,\" Joel says to you, to the cat, to the daughter he will write to tomorrow. \"Thank you for letting me be more than a shield. Thank you for letting me be a person.\"" },
          { speaker: 'Narrator', text: "The magma hardens into stone. The fire becomes warmth. And somewhere, in a small village in the Philippines, a grandmother checks her phone for the message that does not come — not yet, but soon. A letter. In a handwriting her granddaughter will learn to recognize. In words that say: I am here. I have always been here. I am trying. I will keep trying. Until you believe me." }
        ]
      }
      ,
      {
        id: 'journal_015',
        title: 'The Shattered Veil',
        chapter: 15,
        unlockType: 'boss',
        unlockAt: 'The Veilshaper',
        icon: '💎',
        summary: 'Reality tears. Aisyah finds the trade route no one else could.',
        scenes: [
          { speaker: 'Narrator', text: 'The Shattered Veil is not a place you walk into. It is a place you fall through — the moment between waking and dreaming, between sending money home and wondering if it arrived, between being a sister and being a stranger.' },
          { speaker: 'Aisyah', text: '"This way," Aisyah says, and her voice is the same voice that taught you to count gold faster than you could blink. "The real money is in the paths no one else sees. The dangerous ones. The ones that last." She points to a tear in the air that should not exist. "There. That is where the Veilshaper waits."' },
          { speaker: 'Narrator', text: 'The Veilshaper is a being of pure fractured reality — every choice you did not make, every path you closed, every door you walked past. It wears your face. It wears Mez\'s face. It wears the face of the daughter you left before she learned your name.' },
          { speaker: 'Veilshaper', text: '"I am what you could have been," it says, and its voice is all of you at once. "The good daughter. The present sister. The mother who stayed. The wife who endured. I am your better self, and I am here to replace you."' },
          { speaker: 'San', text: 'You raise your staff. "You are my ghost," you say, and the words cost you nothing because you have paid for them already, every night, every wire transfer, every prayer sent into silence. "You are the weight I carry so I can keep moving. You do not get to replace me. You get to walk beside me, or you get to fall behind."' },
          { speaker: 'Narrator', text: 'The Veilshaper weaves a new dimension — summoning echoes, shifting resistances, becoming stronger with every phase. But Aisyah has already mapped its pattern. She always maps the pattern. That is what eldest sisters do.' },
          { speaker: 'Aisyah', text: '"Phase three," she calls out, daggers finding the seam between realities. "Now, San! Strike where the light bends!"' },
          { speaker: 'Narrator', text: 'You strike. The Veilshaper shatters into a thousand might-have-beens, and for one impossible moment, you see them all — the life where you stayed, the life where Mez came home, the life where Joel held his daughter, the life where none of you needed Aethon to become family. They are beautiful. They are not yours. You chose this path. You keep choosing it.' },
          { speaker: 'Aisyah', text: '"Good trade," Aisyah says, wiping her daggers. "High risk. High reward. Just like Mum taught us." She does not look at you when she says it, but her hand finds yours, briefly, the way it did when you were small and the world was large and she was already learning to make it smaller.' }
        ]
      },
      {
        id: 'journal_016',
        title: 'Frozen Choices',
        chapter: 16,
        unlockType: 'boss',
        unlockAt: 'Frost Queen',
        icon: '❄️',
        summary: 'The Frost Queen is what Mez would have become, if she had stayed frozen.',
        scenes: [
          { speaker: 'Narrator', text: 'Frostspire Ruins were beautiful once, before the ice took the Queen\'s heart. Before she learned to be hard, to survive, to push away the warmth that might have saved her. You recognize her. You have been her. You are still her, some nights, when the wire transfers feel like enough and the silence feels like safety.' },
          { speaker: 'Frost Queen', text: '"You think you are different," the Queen says, and her voice is the sound of every door Mez closed, every call she did not return, every Christmas she spent alone rather than face the family she feared she had failed. "You think love is a choice you make daily. It is not. Love is a weakness. Love is how they hurt you. Love is how you learn to need, and needing is how you die."' },
          { speaker: 'Mezstorm', text: '"I used to believe that," Mezstorm says, and his hands spark with something that is not lightning — it is memory, it is regret, it is the particular warmth of a sister who fed you when you were small. "I used to think needing made me small. I used to think distance made me safe. I used to think if I sent enough money, it would be the same as being there." He laughs, and the sound melts ice. "It is not the same. It is never the same. But it is still love. And love is still worth the risk."' },
          { speaker: 'Narrator', text: 'The Frost Queen falters. She has not been argued with in centuries. She has not been understood. She dances alone in the great hall, waiting for a partner who will never come — and Mezstorm, her mirror, her warning, her almost, steps forward.' },
          { speaker: 'Mezstorm', text: '"Dance with me," he says, and offers his hand. "Not because I am what you need. Because I am what you feared, and I am still here. Because I chose to thaw. Because San chose not to give up on me. Because Eliz —" his voice breaks, beautifully, finally, "— because Eliz still calls me Mum, even like this. Especially like this."' },
          { speaker: 'Narrator', text: 'The Frost Queen does not take his hand. But she stops dancing. She sits on her throne of ice, and for the first time in centuries, she watches someone else move. She watches Mezstorm dance with his daughter, with his sisters, with the family he almost lost and chose to find again. The ice does not melt. But it cracks. That is enough. That is everything.' }
        ]
      },
      {
        id: 'journal_017',
        title: 'The Void Between Sisters',
        chapter: 17,
        unlockType: 'boss',
        unlockAt: 'Abyssal Leviathan',
        icon: '🌑',
        summary: 'The void is the silence where words should have been.',
        scenes: [
          { speaker: 'Narrator', text: 'The Abyssal Depths do not belong to this world. They are a wound in reality, and something looks back from the other side. The void between sisters. The silence where words should have been. The years Mez and you did not speak, did not write, did not try.' },
          { speaker: 'Abyssal Leviathan', text: '"I am hungry," the Leviathan says, and its voice is the sound of every unspoken apology, every unsent letter, every wire transfer that arrived without words. "I am hungry for the love you withheld. I am hungry for the forgiveness you could not give. I am hungry for the family you let become strangers."' },
          { speaker: 'San', text: 'You step forward, though your legs shake. "I was hungry too," you say. "I was hungry for a sister who came home. I was hungry for someone to see me drowning and throw me a rope instead of a bank account. I was hungry for Mez to be Mez, not Mezstorm, not a stormsinger, not a myth. Just my sister. Just the middle child who was supposed to be my ally against Aisyah\'s bossiness."' },
          { speaker: 'Mezstorm', text: '"I was drowning too," Mezstorm says, and his lightning is dim here, in the void, but it is present. That is the point. It is present. "I was drowning in the person I thought I had to become to be worth loving. I was drowning in the money I made and the family I lost and the shame of needing both."' },
          { speaker: 'Narrator', text: 'The Leviathan devours light, memory, hope. It has swallowed cities. It would swallow you without noticing. But you are a breadwinner. You have been swallowed before. You know how to climb back out.' },
          { speaker: 'Joel', text: '"Together," Joel says, and his shield is not a weapon here — it is a promise. It is the same promise he makes every morning when he checks his phone for news from home, every month when he sends money he cannot spare, every night when he prays to a God he is not sure hears him. "We climb out together. Or we do not climb out at all."' },
          { speaker: 'Narrator', text: 'The Leviathan falls. Not to a single spell, not to a mighty blow, but to the accumulated weight of a family that chose, again and again, to keep choosing each other. The void does not close. But it becomes smaller. It becomes bearable. It becomes a scar instead of a wound.' }
        ]
      },
      {
        id: 'journal_018',
        title: 'The Last Letter',
        chapter: 18,
        unlockType: 'boss',
        unlockAt: 'Elder Dragon',
        icon: '🐲',
        summary: 'Joel writes the letter he should have written years ago.',
        scenes: [
          { speaker: 'Narrator', text: 'The Elder Dragon\'s lair is ash and bone and the particular silence of a man who has run out of things to say. Joel has not spoken since the Crucible. He has been writing. In his head, on scraps of parchment, in the dirt with a stick when he thinks no one is looking.' },
          { speaker: 'Joel', text: '"I need to send it," he says, not looking at you. "The letter. I need to send it before I lose the courage. Before the next contract, the next shift, the next excuse. Before I become the kind of man who sends money forever and calls it love."' },
          { speaker: 'Narrator', text: 'The Elder Dragon is not a monster. It is a wall — the wall between Joel and the person he wants to be, the wall between sending and being, the wall between "I am trying" and "I am here." It breathes fire that smells of diesel and overtime and the particular exhaustion of a body that works so others can rest.' },
          { speaker: 'Elder Dragon', text: '"You will fail," the Dragon says, and its voice is every supervisor who promised promotion and delivered more hours, every system that grinds good men into dust and calls it productivity. "You will send the letter. She will not write back. You will send another. She will grow up without you. You will die in a foreign bed and she will learn your name from a bank statement."' },
          { speaker: 'Joel', text: '"Maybe," Joel says, and he raises his shield — not to block, but to declare. "Maybe she will not write back. Maybe she will grow up without me. Maybe I will die in a foreign bed. But I will die having tried. I will die having written. I will die having been more than a number in her mother\'s account. I will die having been her father, even if only in words, even if only from far away, even if only —" his voice breaks, holds, heals, "— even if only she never knows how hard I tried."' },
          { speaker: 'Narrator', text: 'The Dragon falls. Not to fire, not to ice, but to the particular weapon that Joel has always had and never used: his words. His truth. His willingness to be seen failing rather than succeed in silence.' },
          { speaker: 'Soel', text: 'Soel brings Joel a leaf. It is charred at the edges, but intact. Joel tucks it into the envelope with the letter — the first letter, the real letter, the one that says I am here and I am sorry and I will keep writing until you believe me.' }
        ]
      },
      {
        id: 'journal_019',
        title: 'Starlight, Finally',
        chapter: 19,
        unlockType: 'boss',
        unlockAt: 'Starlord',
        icon: '⭐',
        summary: 'The hardest truth: you are enough. You have always been enough.',
        scenes: [
          { speaker: 'Narrator', text: 'The Starlight Spire touches the sky. At its peak, the Astral Lord waits — the final gatekeeper, the last question. You have come so far from Brunei. So far from the rain and the kitten and the porch where it all began. So far from the woman who thought she had to be everything to everyone, who thought her worth was measured in wire transfers and endured silences.' },
          { speaker: 'Astral Lord', text: '"What have you learned?" the Astral Lord asks, and its voice is not a voice — it is the accumulated weight of every night you cried in the bathroom so no one would hear, every time you checked your bank account and felt the familiar squeeze of not enough, every time you chose someone else\'s need over your own and called it love.' },
          { speaker: 'San', text: '"I have learned," you say, and your voice is steady because it has earned steadiness, "that I am not a bank account. I am not a wire transfer. I am not the sum of what I provide. I am San. I am the youngest of three sisters. I am the woman who left a marriage that was eating her alive. I am the woman who found a kitten in the rain and loved him enough to let him teach her how to be loved. I am the woman who found Joel, who found Aisyah, who found Mezstorm again, who is learning to know Eliz. I am enough. I have always been enough. I just needed to stop trying to prove it and start believing it."' },
          { speaker: 'Narrator', text: 'The Astral Lord does not attack. It smiles — if something made of starlight can smile — and steps aside. "Then pass," it says. "Not because you have won. Because you have stopped needing to win. Because you have chosen love over fear, presence over performance, being over doing. That is the only victory that matters."' },
          { speaker: 'Soel', text: 'Soel rubs against your leg. "We go together," his eyes say. "Always together." He chose you. In the rain. In the dorm. In the rift. In every world, in every form, he chooses you. That is rare. That is everything.' },
          { speaker: 'Narrator', text: 'The spire opens onto a view of Aethon that takes your breath away — not because it is beautiful, though it is, but because you are still here to see it. You, San. The breadwinner. The runaway. The survivor. The woman who learned, finally, that she was never broken. She was just surviving in a place that demanded she break herself to fit. And now she is free. Now she is home. Now she is — always, finally — enough.' }
        ]
      },
      {
        id: 'journal_020',
        title: 'The Planarch',
        chapter: 20,
        unlockType: 'boss',
        unlockAt: 'The Nexus Planarch',
        icon: '🌀',
        summary: 'The heart of all dimensions. The final choice. The beginning.',
        scenes: [
          { speaker: 'Narrator', text: 'The Nexus is not a place. It is a choice — the choice to keep going, to keep choosing, to keep loving even when the cost is everything you have. The Planarch waits here, or what remains of it. Five phases. No mercy. But also: no lies. No illusions. Only the truth you have spent twenty chapters learning to face.' },
          { speaker: 'The Nexus Planarch', text: '"I am the wound," the Planarch says, and its voice is every dimension that ever touched and woke something that should have slept. "I am the place where too many worlds pressed against each other and something broke. I am not evil. I am simply what happens when love is not enough, when distance is too great, when family becomes strangers and strangers become family and no one knows which is which anymore."' },
          { speaker: 'San', text: '"I know wounds," you say, and your staff is not a weapon now — it is a walking stick, it is a crutch, it is the thing that kept you upright when everything else fell apart. "I am a wound. Joel is a wound. Mezstorm is a wound. Aisyah is a wound. Eliz —" you look at your niece, at her gentle hands, at her impossible endurance, "— Eliz is the proof that wounds can heal. That wounds can become strength. That wounds can become love."' },
          { speaker: 'Narrator', text: 'Phase one: Arcane. The Planarch tests your mind, your memory, your ability to hold multiple truths at once. You hold them. You hold them all — the truth of Brunei and the truth of Aethon, the truth of who you were and who you are becoming, the truth that you can love your family and still need to leave them, the truth that leaving is not the same as abandoning.' },
          { speaker: 'Narrator', text: 'Phase two: Fire. The Planarch tests your passion, your anger, your willingness to burn for what matters. Joel steps forward. He has been burning his whole life — in the Crucible, in the Philippines, in every 4 AM shift, in every unsent letter. He knows fire. He is fire. And he has learned to use it instead of fear it.' },
          { speaker: 'Narrator', text: 'Phase three: Ice. The Planarch tests your stillness, your patience, your ability to endure. Mezstorm endures. He has endured being Mez, being Mezstorm, being neither, being both. He has endured the silence between sisters, the fear of coming home, the shame of needing to be needed. He endures. He thaws. He chooses to keep choosing.' },
          { speaker: 'Narrator', text: 'Phase four: Lightning. The Planarch tests your speed, your adaptability, your willingness to strike before you are ready. Aisyah strikes. She has always struck — in the market, in the shadows, in the spaces between what is said and what is meant. She strikes true. She strikes for family. She strikes because she has always known that the real money is in love, and love is the riskiest trade of all.' },
          { speaker: 'Narrator', text: 'Phase five: Void. The Planarch tests your emptiness, your ability to face the dark and not be consumed. Eliz faces it. Eliz, who sees magic in textures and colors no one else can perceive. Eliz, who cannot be reduced below 1 HP. Eliz, who has endured more than any child should and still offers her hands to heal. She faces the void. She does not blink. She is not empty. She is full — full of love, full of presence, full of the particular courage of simply being.' },
          { speaker: 'The Nexus Planarch', text: '"You have severed the rift," the Planarch says, and its voice is fading, becoming wind, becoming memory, becoming the space between heartbeats where love lives. "Not with power. Not with spells. With choice. With family. With the willingness to be wounded and keep walking. The dimensions will heal. The worlds will separate. And you —" it looks at each of you, finally, fully, "— you will remember. In Brunei. In the Philippines. In every world, in every form. You will remember that you chose each other. That is the only magic that matters."' },
          { speaker: 'Narrator', text: 'The Nexus collapses into light. Not destruction — birth. The rift closes. The worlds separate. And you stand in a field of silver grass, two moons overhead, Soel purring in your arms, Joel\'s hand in yours, Aisyah counting gold she does not need, Mezstorm humming a lullaby you almost remember, Eliz pressing her glowing hands to the earth as if to say: I am here. We are here. We are enough.' },
          { speaker: 'Joel', text: '"Breakfast?" Joel asks, like nothing happened. Like you did not just save the dimensions. Like he did not just face his fire and choose to write. Like you are not all standing at the end of one story and the beginning of another.' },
          { speaker: 'San', text: 'You smile. It is not a perfect smile. It is tired, and it is hopeful, and it is yours. "Breakfast," you agree. "And then we find out what comes next."' },
          { speaker: 'Narrator', text: 'The sun rises over Aethon. Two moons fade. Soel purrs, kneading soft circles into your heart. The story continues. Not ended. Just paused. And somewhere, in a small village in the Philippines, a mother wakes to a letter in a handwriting she does not recognize, holds it to her chest, and weeps. In Brunei, two parents check their phones and find a message that says: I am here. I am trying. I love you. The gravity still pulls. The orbit still holds. You are still a breadwinner. You are still choosing love. You are still — always, finally, enough — San.' }
        ]
      },
      {
        id: 'journal_021',
        title: 'The Breaking',
        chapter: 21,
        unlockType: 'boss',
        unlockAt: 'The Fracture',
        icon: '🌀',
        summary: 'The rift did not close cleanly. Something came loose. San and Joel wake up young.',
        scenes: [
          { speaker: 'Narrator', text: "The Nexus Planarch said the worlds would separate. It did not say how. There is a difference between an ending and a tear, and what happens next is a tear — reality does not close so much as flinch, and something that was holding two moons and every fractured plane together lets go all at once." },
          { speaker: 'San', text: '"Joel—" you start, and then you feel it: a pulling sensation under your skin, like years being pulled out through your fingertips. You look down at your hands. They are wrong. They are yours, but younger — the hands you had before Brunei asked so much of you, before every wire transfer aged you a little more than the calendar did.' },
          { speaker: 'Joel', text: '"San." Joel\'s voice cracks — not from fear, from recognition. He is looking at his own hands too. No callouses from the dorm work. No exhaustion lines. "We\'re — I feel like I did before the Crucible. Before any of it."' },
          { speaker: 'Narrator', text: "Some magic, unnamed and unasked-for, has reached backward and pulled youth from wherever youth goes when it is spent, and given it back to the two of you specifically — the breadwinner and the steadfast man, the two who gave the most and rested the least. It is not a gift. It does not feel like a gift yet. It feels like falling." },
          { speaker: 'Narrator', text: "And then the falling stops. Not gently — it simply stops, like a held breath, like a clock with its hands snapped off. You are young again, and you are staying that way. Whatever is happening to time in this place, it has decided you are finished changing." },
          { speaker: 'Soel', text: 'Soel does not fall. Soel does not shift. He was already outside of aging — spirit-flame, reformed, never quite bound to years the way flesh is. He climbs into your lap anyway, the way he always has, the only steady thing in a moment that has none.' },
          { speaker: 'Narrator', text: 'The world around you keeps moving, though. You can feel it — a wrongness in the air, like time is still running everywhere except inside your own chest. You do not know yet what that means for the others. You do not know yet what it means for you. But the ground beneath you is not the ground you stood on a moment ago, and the sky above is the color of something that has already ended.' }
        ]
      },
      {
        id: 'journal_022',
        title: 'What the Ruin Remembers',
        chapter: 22,
        unlockType: 'boss',
        unlockAt: 'The Last Guard',
        icon: '🏚️',
        summary: 'Aethon in ruins. San and Joel realize how much time has passed for everyone but them.',
        scenes: [
          { speaker: 'Narrator', text: 'The Whispering Woods are gone. Not burned, not razed — just old, in the particular way a place gets old when no one has walked its paths in a very long time. Roots have cracked the road you first woke up on. You do not know how long it has been. You only know your hands are still the hands of someone who has not aged a single day since the Breaking.' },
          { speaker: 'Joel', text: '"Something is still standing guard," Joel says, nodding toward a figure at the ruined gate — armor rusted, stance unwavering, defending a city that clearly stopped needing defending years ago. "He does not know it is already lost."' },
          { speaker: 'San', text: '"Neither did we, for a while," you say quietly, and Joel does not answer, because you are both thinking of every year you spent guarding a life that had already moved on without either of you fully noticing.' },
          { speaker: 'Narrator', text: 'The Last Guard does not recognize you. Whatever he remembers of the people who once passed through these woods, it is not you — not this young, not this untouched by the years he has spent alone at his post. You realize, fighting him, that you are not just fighting an enemy. You are fighting evidence. Proof that time did not wait.' }
        ]
      },
      {
        id: 'journal_023',
        title: "Aisyah's Ledger, Aisyah's Absence",
        chapter: 23,
        unlockType: 'boss',
        unlockAt: 'Scavenger King',
        icon: '🏮',
        summary: "The market Aisyah built is gone. Someone else rules it now.",
        scenes: [
          { speaker: 'Narrator', text: "Ashfall Market was Aisyah's — her routes, her prices, her particular genius for turning dried goods into something people would cross kingdoms for. What stands here now is looted down to the stalls' bones, ash settling over everything like snow that forgot how to melt." },
          { speaker: 'San', text: '"She would hate this," you say, and you mean it literally — Aisyah hated waste more than almost anything, hated seeing value go unrecognized. This place is nothing but unrecognized value, picked apart by someone who never learned to see what she saw.' },
          { speaker: 'Narrator', text: 'The Scavenger King wears armor stitched from a dozen fallen traders — not Aisyah\'s armor, you note, with a relief that surprises you in its intensity. Wherever she is, whenever she is, she is not here. That has to mean something. You choose to believe it means she is still out there, still counting gold twice, still teaching someone the trade routes.' },
          { speaker: 'Joel', text: '"We will find her," Joel says, and it is not a question, and you let yourself believe him, because believing him has never once been the wrong choice.' }
        ]
      },
      {
        id: 'journal_024',
        title: 'The Numbers That Never Balanced',
        chapter: 24,
        unlockType: 'boss',
        unlockAt: 'Debt Wraith',
        icon: '📖',
        summary: 'A flooded counting-house gives shape to every debt that was never really about money.',
        scenes: [
          { speaker: 'Narrator', text: 'The Drowned Ledger is not a place so much as a feeling given architecture — a counting-house permanently half-submerged, its books swollen and unreadable, its numbers somehow still audible under the water, murmuring like a tide.' },
          { speaker: 'San', text: 'You know this feeling. The particular arithmetic of being a breadwinner — how much sent home, how much kept, how much guilt attached to every dollar that stayed in your own pocket. You have run these numbers in your head more nights than you can count. Here, apparently, someone has finally given them a body.' },
          { speaker: 'Debt Wraith', text: '"You were never behind," the Wraith says, in a voice made of a hundred overlapping ledgers, and it is somehow crueler than an accusation would have been. "You were never ahead either. There is no ahead. There is only the counting."' },
          { speaker: 'San', text: '"There\'s more than the counting," you say, and you are not entirely sure you believe it yet — but you say it anyway, because Eliz believes it, because Joel believes it, because somewhere a family you have not spoken to in this form still loves you regardless of the math.' },
          { speaker: 'Narrator', text: 'The flood recedes an inch when the Wraith falls. Only an inch. But it is the first ground you have seen dry in this drowned place, and you choose to call that progress.' }
        ]
      },
      {
        id: 'journal_025',
        title: 'The Foreman Never Clocks Out',
        chapter: 25,
        unlockType: 'boss',
        unlockAt: 'The Foreman',
        icon: '⚙️',
        summary: "Joel's overtime given a place to live, a shift that never ends, a supervisor who never rests.",
        scenes: [
          { speaker: 'Narrator', text: "Rustbound Docks never stops moving. Cranes swing on schedules no one set. Machinery hums with the specific exhaustion of a body that works so others can rest — Joel's exhaustion, given cranes and gears and a foreman who has never once said the shift is over." },
          { speaker: 'Joel', text: '"I know this place," Joel says, and his voice has gone very quiet, very careful, the way it does when he is holding something he does not want to drop. "Not this place. This — feeling. I have lived in this feeling."' },
          { speaker: 'The Foreman', text: '"You will fail," the Foreman says, and Joel flinches, because you both recognize the shape of that sentence — it is the Elder Dragon\'s voice, the same threat, wearing a hard hat instead of scales. "You will send the letter. She will not write back."' },
          { speaker: 'Joel', text: '"I already sent it," Joel says, and for the first time, his voice does not shake. "Once. That was the hardest part. Everything after that is just — showing up. And I know how to show up."' },
          { speaker: 'Narrator', text: 'The Foreman builds pressure like it always has, like every overtime shift Joel has ever pulled — but this time, when it finally breaks, it breaks on a man who has already done the one thing this future was built to prevent. The letter is sent. Whatever this place is, it cannot undo that.' }
        ]
      },
      {
        id: 'journal_026',
        title: "The Widow's Watch",
        chapter: 26,
        unlockType: 'boss',
        unlockAt: 'Echo of Joel',
        icon: '🕯️',
        summary: 'A lighthouse where someone has been waiting for a letter that, in this timeline, never came.',
        scenes: [
          { speaker: 'Narrator', text: "The lighthouse should not exist — Aethon has no coast, has never had a coast — and yet here it is, standing over water that should not exist either, its light turning slowly over a sea of static and grey. Someone has been watching from its tower for a very long time." },
          { speaker: 'Narrator', text: 'The figure at the top is Joel. Not your Joel — an echo, a might-have-been, a version of him from whatever future never got the letter sent in time. He does not turn when you climb the stairs. He has learned not to hope when he hears footsteps.' },
          { speaker: 'Echo of Joel', text: '"She stopped writing back," the Echo says, still facing the water. "I do not blame her. I would have stopped too, eventually, if the silence went on long enough. I just — did not think it would be me who let it go quiet first."' },
          { speaker: 'Joel', text: 'Your Joel steps forward, and his voice is gentle in a way you have rarely heard it. "I am not going to let that happen. I already know how this feels — I have felt the edge of it. I sent the letter. I kept sending them. You do not have to be this."' },
          { speaker: 'Echo of Joel', text: '"Then why," the Echo asks, finally turning, and his face is Joel\'s face aged by grief instead of years, "am I still here?"' },
          { speaker: 'Narrator', text: 'The fight that follows is not really a fight — it is an argument given weapons, a man refusing to become the thing standing in front of him. Grief does not want an audience. It wants company. And your Joel, steadfast as ever, refuses to leave the Echo alone with it, even as sword meets sword.' },
          { speaker: 'Narrator', text: 'When the Echo finally falls, it does not vanish like the other bosses did. It settles — like static resolving into a clear signal — and for one unguarded moment, Joel and his Echo look at each other like two ends of the same unfinished sentence. Then the light of the tower goes out, and the future it was warning against goes with it. Act One is over. Whatever waits in the years further gone, you will face it having already refused to become this.' }
        ]
      }

      ,{
        id: 'journal_027',
        title: 'The Roads Senedra Walked',
        chapter: 27,
        unlockType: 'boss',
        unlockAt: 'The Vanished Guide',
        icon: '🥾',
        summary: "Senedra's trade routes, still standing. No one left to walk them.",
        scenes: [
          { speaker: 'Narrator', text: "The waymarkers are exactly where Senedra always said they'd be — she has a memory for paths the way Aisyah has one for numbers, precise and unshakeable. But the roads themselves have gone quiet in a way that has nothing to do with distance." },
          { speaker: 'Senedra', text: '"I know this stretch," Senedra says, crouching by a marker half-swallowed in dead grass. "I walked it with my mother. She taught me which roads people forget, and which roads forget people back. I did not think this one would forget me."' },
          { speaker: 'Narrator', text: 'A shape moves at the tree line — there, then gone, then there again, always at the edge of what you can be sure you saw. It is not hunting you. It seems, if anything, to be looking for someone else entirely, checking the same stretch of road over and over with the patience of something that has forgotten how to stop.' },
          { speaker: 'Senedra', text: '"A guide who lost their own way," Senedra says quietly. "I have had nightmares like that. Every scout does, eventually — the one where you lead everyone somewhere and cannot lead yourself back out again."' },
          { speaker: 'San', text: '"You always found the way back," you tell her, and you mean it as more than reassurance — you mean it as fact, as the thing you have watched her do a hundred times across a hundred zones.' },
          { speaker: 'Narrator', text: 'When the Vanished Guide finally stops flickering long enough to be struck true, it does not resist much. It seems, in the end, almost relieved to be found — the particular relief of something tired of being lost. Senedra marks the spot with her own waymarker before you leave. Just in case, she says. Just in case someone else needs the road to remember them too.' }
        ]
      }
      ,{
        id: 'journal_028',
        title: 'The Room That Waited',
        chapter: 28,
        unlockType: 'boss',
        unlockAt: 'Hollow Eliz',
        icon: '🕊️',
        summary: 'A nursery built for a future where Eliz was not there in time. Eliz is here now.',
        scenes: [
          { speaker: 'Narrator', text: "The nursery is soft in every way Eliz is soft — pastel, careful, built by someone who loved a child enough to prepare a room and not enough time to fill it. The colors shift when you look at them too long, the way Eliz always described her own perception of magic: textures, not just sight." },
          { speaker: 'Eliz', text: '"This place hurts to look at," Eliz says, and her voice has none of its usual gentle certainty. "Not because it is sad. Because I recognize it. This is what it would feel like if I was not fast enough. If my hands were not there when they needed to be."' },
          { speaker: 'Narrator', text: 'Something moves in the crib-shaped shadow at the room\'s center — not a monster exactly, more like the absence of the healer who should have been standing where Eliz now stands. It reaches for you with hands that almost remember how to heal, and almost is so much worse than not at all.' },
          { speaker: 'Eliz', text: '"I cannot be reduced below one hit point," Eliz says, stepping between you and it, and for the first time you hear real anger in her — quiet, focused, absolute. "That is not a mechanic. That is a promise. I do not break it. Not for this. Not for anything."' },
          { speaker: 'Narrator', text: 'She fights like she heals — precise, patient, refusing to let the Hollow version of herself convince either of you that gentleness and helplessness are the same thing. When it finally falls, Eliz does not look away. She watches it go, and something in her face settles, like a door quietly closing on a room she no longer needs to fear.' },
          { speaker: 'Eliz', text: '"I am here," she says, to the empty crib, to you, to no one and everyone. "I am always going to be here. That is the whole of what I am for."' }
        ]
      }
      ,{
        id: 'journal_029',
        title: 'The Boy Who Stopped Checking',
        chapter: 29,
        unlockType: 'boss',
        unlockAt: 'Rustbound Zaki',
        icon: '🗡️',
        summary: 'Zaki, hardened past the nervous boy who checked his pack seventeen times.',
        scenes: [
          { speaker: 'Narrator', text: 'The barracks are drilled into silence — rows of bunks with no one in them, a yard worn smooth by feet that marched here long enough to forget why. Zaki goes quiet the moment you cross the threshold, and quiet is not a thing Zaki does easily.' },
          { speaker: 'Zaki', text: '"I checked my pack because I was scared," Zaki says, not looking at you, looking instead at a rack of training blades gone dull with disuse. "Everyone thought it was nerves. It was not nerves. It was — I did not want to be the reason something went wrong. Checking was the only thing I could control."' },
          { speaker: 'Narrator', text: 'A figure drills alone in the yard, running the same forms over and over with mechanical precision, no hesitation, no checking anything at all. It moves like Zaki. It fights like the idea of Zaki with every soft edge sanded off.' },
          { speaker: 'Zaki', text: '"That is what happens if I let the fear win by pretending I do not have it," Zaki says, and his voice is steadier than you have ever heard it. "I do not want to stop checking. Checking is how I show I care. I would rather be the boy who checks seventeen times than whatever that is."' },
          { speaker: 'Narrator', text: 'He fights the Rustbound version of himself with something that looks almost like tenderness — not holding back, but never once losing the thing that makes him Zaki, the small constant worry that everyone around him makes it out fine. When it falls, he does not celebrate. He checks his own pack. Once. Just to be sure.' },
          { speaker: 'Zaki', text: '"Still here," he says, mostly to himself. "Still checking. Good."' }
        ]
      }
      ,{
        id: 'journal_030',
        title: 'The Storm That Never Broke',
        chapter: 30,
        unlockType: 'boss',
        unlockAt: 'Mezstorm Unbound',
        icon: '⛈️',
        summary: "Mezstorm's estrangement from family, given permanent weather.",
        scenes: [
          { speaker: 'Narrator', text: 'The storm here has been going for what feels like years — not building, not breaking, just holding, a held breath made of thunder. Mezstorm stops at its edge and does not move for a long moment.' },
          { speaker: 'Mezstorm', text: '"I know this storm," he says finally. "It is the one I have been carrying since I stopped being Mez and started being someone my own family struggles to recognize. It never got the chance to break. I never gave it the chance. Easier to keep the weather constant than to let it change into something I would have to face."' },
          { speaker: 'Narrator', text: "Lightning splits the sky and something answers, walking toward you with Mezstorm's exact bearing — a storm mage who never once tried to speak to the people he loved, who let distance calcify into permanent weather rather than risk the answer he was afraid of." },
          { speaker: 'Mezstorm', text: '"I have a sister who taught me to trade before I could walk properly," he says, and his voice cracks on the word sister, on the old name underneath the new one, both true, both his. "I have a sister who left home young and came back distant. I have a sister who is San, standing right here, who never once stopped choosing me even when the magic made everything strange between us."' },
          { speaker: 'Narrator', text: 'He fights the Unbound version of himself with the storm itself as his weapon — not suppressing it, but finally, finally directing it somewhere. The lightning that used to just happen around him starts, for the first time, to mean something.' },
          { speaker: 'Mezstorm', text: '"The storm can stay," he says, breathing hard, watching the Unbound echo dissolve into rain. "It just does not get to be the only thing I say anymore."' }
        ]
      }
      ,{
        id: 'journal_031',
        title: 'What the Ember Remembers',
        chapter: 31,
        unlockType: 'boss',
        unlockAt: 'The Fading Familiar',
        icon: '🔥',
        summary: 'Proof that even the unkillable can be forgotten, if no one remembers to choose them.',
        scenes: [
          { speaker: 'Narrator', text: "This place should not exist. Soel reforms from spirit flame — always, everywhere, an unkillable certainty woven through every version of every world you have visited. And yet here is a grave-shaped hollow, and here is an ember, guttering, small, and unmistakably his." },
          { speaker: 'Soel', text: 'Soel presses close against your leg, and for the first time since the rain, since the box under Joel\'s porch, since every choice he has ever made to be exactly where you needed him — he seems uncertain. His eyes stay fixed on the dying ember like he is looking at a photograph of himself.' },
          { speaker: 'Narrator', text: 'The Fading Familiar rises from the hollow, wearing Soel\'s shape the way smoke wears the shape of what it used to be — recognizable, and wrong, and going out a little more with every passing second. It does not attack so much as it simply exists at you, a warning shaped like a warm thing gone cold.' },
          { speaker: 'San', text: '"You are not going out," you say, and you are surprised by how fierce it comes out, how much of the whole journey lives in that one sentence. "You chose me in the rain. You chose Joel before that. I am not going to let a future where somebody forgot to choose you back replace the one where I never will."' },
          { speaker: 'Narrator', text: 'The fight is short, almost gentle — less a battle than a held hand, San\'s staff and Soel\'s claws working together to remind the guttering ember what it means to be chosen, over and over, in every world, in every form. When the Fading Familiar finally rejoins the true Soel, it does not feel like a kill. It feels like a promise kept.' },
          { speaker: 'Soel', text: 'Soel climbs into your lap, purring like nothing happened, like he has always known you would come. He chose you. That is rare. That is everything. And now, so does the part of him that almost forgot how.' }
        ]
      }





    ]
  },

  rest: {
    active: false,
    timer: null,
    tick: 0,
    maxTicks: 5,
    tickDuration: 1500,
    selectedSite: null,
    ambushPending: false,
    sites: [
      { id: 'ww_camp', name: 'Whispering Woods Camp', type: 'camp', zone: 'Whispering Woods', zoneLv: 1, desc: 'A quiet clearing beneath ancient oaks.', unlocked: true, icon: '🏕️', cost: 0 },
      { id: 'ww_tavern', name: 'The Sleeping Stag', type: 'tavern', zone: 'Whispering Woods', zoneLv: 1, desc: 'A rustic tavern at the forest edge. Warm beds, warm ale.', unlocked: false, icon: '🍺', cost: 5 },
      { id: 'cc_camp', name: 'Catacombs Hollow', type: 'camp', zone: 'Cursed Catacombs', zoneLv: 2, desc: 'A hidden alcove away from the restless dead.', unlocked: false, icon: '⛺', cost: 0 },
      { id: 'cc_tavern', name: 'The Bone Flute', type: 'tavern', zone: 'Cursed Catacombs', zoneLv: 2, desc: 'A morbidly cozy inn carved into tomb walls.', unlocked: false, icon: '🍺', cost: 8 },
      { id: 'ep_camp', name: 'Ember Peak Shelter', type: 'camp', zone: 'Ember Peak', zoneLv: 4, desc: 'A heat-shielded cave with volcanic warmth.', unlocked: false, icon: '⛺', cost: 0 },
      { id: 'ep_tavern', name: 'The Molten Mug', type: 'tavern', zone: 'Ember Peak', zoneLv: 4, desc: 'Fire-resistant stone tavern. The ale is warm, the beds are warm, everything is warm.', unlocked: false, icon: '🍺', cost: 12 },
      { id: 'fr_camp', name: 'Frostspire Shelter', type: 'camp', zone: 'Frostspire Ruins', zoneLv: 6, desc: 'A magically warded ice cave. Barely warm enough.', unlocked: false, icon: '⛺', cost: 0 },
      { id: 'fr_tavern', name: 'The Frozen Hearth', type: 'tavern', zone: 'Frostspire Ruins', zoneLv: 6, desc: 'A tavern that somehow keeps warm in the frozen wastes.', unlocked: false, icon: '🍺', cost: 15 },
      { id: 'ad_camp', name: 'Abyssal Refuge', type: 'camp', zone: 'Abyssal Depths', zoneLv: 8, desc: 'A pocket of reality that the void has not claimed... yet.', unlocked: false, icon: '⛺', cost: 0 },
      { id: 'ad_tavern', name: 'The Last Light', type: 'tavern', zone: 'Abyssal Depths', zoneLv: 8, desc: 'The final tavern before oblivion. Prices are steep.', unlocked: false, icon: '🍺', cost: 25 },
      { id: 'temple', name: 'Temple of Resurrection', type: 'temple', zone: 'Sanctuary', zoneLv: 1, desc: 'An ancient temple that restores fallen companions to life.', unlocked: true, icon: '⛪', cost: 50 },
      { id: 'apt_camp', name: 'Planar Anchor Camp', type: 'camp', zone: 'Arcane Planar Tower', zoneLv: 11, desc: 'A pocket of stable reality anchored by ancient runes. The walls still shimmer.', unlocked: false, icon: '⛺', cost: 0 },
      { id: 'apt_tavern', name: 'The Shifting Spire', type: 'tavern', zone: 'Arcane Planar Tower', zoneLv: 11, desc: 'A tavern that exists in multiple dimensions at once. The bartender may be a future version of yourself.', unlocked: false, icon: '🍺', cost: 30 },
          // === EXPANSION: LV 21+ REST SITES ===
    { id: 'fv_camp', name: 'Veil\'s Edge Camp', type: 'camp', zone: 'The Fractured Veil', zoneLv: 21, desc: 'A precarious camp at the edge of tearing reality. Tents flicker in and out of existence.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'fv_tavern', name: 'The Shattered Inn', type: 'tavern', zone: 'The Fractured Veil', zoneLv: 21, desc: 'A tavern that exists in multiple dimensions. The beer tastes different in each one.', unlocked: false, icon: '🍺', cost: 35 },
    // === PHASE 1: LV 22-23 REST SITES ===
    { id: 'am_camp', name: 'Astral Refuge', type: 'camp', zone: 'The Astral Maelstrom', zoneLv: 22, desc: 'A pocket of stable space in the maelstrom. The walls hum with harmonic resonance.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'am_tavern', name: 'The Wandering Star', type: 'tavern', zone: 'The Astral Maelstrom', zoneLv: 22, desc: 'A tavern built on a floating asteroid. The beer tastes like stardust and homesickness.', unlocked: false, icon: '🍺', cost: 40 },
    { id: 'ic_camp', name: 'Crucible Hollow', type: 'camp', zone: 'Infernal Crucible', zoneLv: 23, desc: 'A heat-shielded cave behind a magmafall. The air shimmers.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'ic_tavern', name: 'The Molten Chalice', type: 'tavern', zone: 'Infernal Crucible', zoneLv: 23, desc: 'Fireproof stone tavern. The ale is served in cooled obsidian mugs. Everything glows.', unlocked: false, icon: '🍺', cost: 45 },
        { id: 'ms_spring1', name: 'Ethereal Mana Spring', type: 'mana_spring', zone: 'Arcane Planar Tower', zoneLv: 11, desc: 'A natural spring of pure mana. The energy is overwhelming — you can only endure it briefly.', unlocked: false, icon: '💧', cost: 10, entryLimit: 3, entriesUsed: 0 },
    { id: 'ms_spring2', name: 'Astral Mana Spring', type: 'mana_spring', zone: 'The Astral Maelstrom', zoneLv: 22, desc: 'Liquid starlight pools in a crater of fallen meteors. Each sip rewires your magic.', unlocked: false, icon: '💧', cost: 15 },
        // === PHASE 3: LV 21-29 REST SITES ===
    { id: 'fv_camp2', name: 'Fractured Veil Hollow', type: 'camp', zone: 'The Fractured Veil', zoneLv: 21, desc: 'A pocket of stable reality within the tearing veil. The walls hum with harmonic dissonance.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'sv_camp', name: 'Scorched Veil Camp', type: 'camp', zone: 'The Scorched Vein', zoneLv: 24, desc: 'A heat-shielded overhang of glassy stone. The magma glows beneath like a second sun.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'sv_tavern', name: 'The Glass Flute', type: 'tavern', zone: 'The Scorched Vein', zoneLv: 24, desc: 'A tavern carved from obsidian glass. The walls sing when the wind blows through the canyon.', unlocked: false, icon: '🍺', cost: 50 },
    { id: 'ta_camp', name: 'Abyssal Trench Camp', type: 'camp', zone: 'Tidal Abyss', zoneLv: 25, desc: 'A pressure-sealed bubble of air at the trench edge. The darkness beyond has no bottom.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'ta_tavern', name: 'The Drowned Lantern', type: 'tavern', zone: 'Tidal Abyss', zoneLv: 25, desc: 'A tavern built inside a sunken ship. The lanterns burn with captured bioluminescence.', unlocked: false, icon: '🍺', cost: 55 },
    { id: 'sc_camp', name: 'Crownfall Camp', type: 'camp', zone: 'The Shattered Crown', zoneLv: 26, desc: 'A camp at the base of the fallen sky-kingdom. Lightning scars the stone.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'sc_tavern', name: 'The Sovereign\'s Rest', type: 'tavern', zone: 'The Shattered Crown', zoneLv: 26, desc: 'A tavern built in the throne room of a dead king. The crown still hangs on the wall.', unlocked: false, icon: '🍺', cost: 60 },
    { id: 'ht_camp', name: 'Hollow Camp', type: 'camp', zone: 'The Hollow Throne', zoneLv: 27, desc: 'A camp in the antechamber of the empty throne. The silence is louder than thunder.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'ht_tavern', name: 'The Empty Chalice', type: 'tavern', zone: 'The Hollow Throne', zoneLv: 27, desc: 'A tavern where the cups fill themselves. No one knows who serves the drinks.', unlocked: false, icon: '🍺', cost: 65 },
    { id: 'fs_camp', name: 'Spire Base Camp', type: 'camp', zone: 'The Final Spire', zoneLv: 28, desc: 'The last camp before the impossible climb. Gravity is optional here.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'fs_tavern', name: 'The Penultimate Port', type: 'tavern', zone: 'The Final Spire', zoneLv: 28, desc: 'A tavern that exists in multiple timelines simultaneously. Your drink may arrive before you order it.', unlocked: false, icon: '🍺', cost: 70 },
    { id: 'ap_camp', name: 'Apex Threshold', type: 'camp', zone: 'The Apex', zoneLv: 29, desc: 'The final camp before the end of all things. The air tastes like completion.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'ap_tavern', name: 'The Last Door', type: 'tavern', zone: 'The Apex', zoneLv: 29, desc: 'A tavern at the edge of reality. The bartender knows your name before you speak it.', unlocked: false, icon: '🍺', cost: 80 },
    // === ACT 1: THE SHATTERED NOW (LV 30-35) REST SITES ===
    { id: 'tb_camp', name: 'The Breaking Point', type: 'camp', zone: 'The Breaking', zoneLv: 30, desc: 'A patch of ground that has not decided what reality it belongs to yet. It holds, for now.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'sr_camp', name: 'Ruin\'s Rest', type: 'camp', zone: 'The Silent Ruin', zoneLv: 31, desc: 'A collapsed archway that still, somehow, keeps the rain off.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'am2_camp', name: 'Ashfall Stall', type: 'camp', zone: 'Ashfall Market', zoneLv: 32, desc: 'An abandoned trading stall, canvas still intact. Aisyah would have haggled for it.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'dl_camp', name: 'The Dry Ledger Room', type: 'camp', zone: 'The Drowned Ledger', zoneLv: 33, desc: 'One room the flood never reached. The books here are still legible, and still wrong.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'rd_camp', name: 'Dockside Shelter', type: 'camp', zone: 'Rustbound Docks', zoneLv: 34, desc: 'A break room that no one ever gets to use. The kettle is somehow still warm.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'ww2_camp', name: "The Watcher's Landing", type: 'camp', zone: "The Widow's Watch", zoneLv: 35, desc: 'The base of the lighthouse. From here, you can see how far there still is to climb.', unlocked: false, icon: '⛺', cost: 0 },
    // === ACT 2: THE LONG SILENCE (LV 36-40) REST SITES ===
    { id: 'road_camp', name: 'Waymarker Rest', type: 'camp', zone: 'Forgotten Pemmican Roads', zoneLv: 36, desc: 'A stretch of road wide enough to make camp. The waymarker still points somewhere, if you trust it.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'nursery_camp', name: "The Doorway Outside", type: 'camp', zone: 'The Quiet Nursery', zoneLv: 37, desc: "The hall just outside the nursery door. You can't quite bring yourself to camp inside.", unlocked: false, icon: '⛺', cost: 0 },
    { id: 'barracks_camp', name: 'Old Drill Yard', type: 'camp', zone: 'Bladeless Barracks', zoneLv: 38, desc: 'A cleared patch where recruits used to run laps. The ground remembers footsteps that aren\'t yours.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'storm_camp', name: 'The Eye', type: 'camp', zone: 'The Storm That Stayed', zoneLv: 39, desc: 'A small pocket of calm at the center of a storm that never ends. It holds, for now.', unlocked: false, icon: '⛺', cost: 0 },
    { id: 'ember_camp', name: "The Last Warm Stone", type: 'camp', zone: "Embercat's Grave", zoneLv: 40, desc: 'A single stone that still holds heat, long after everything around it went cold.', unlocked: false, icon: '⛺', cost: 0 },
    // Phase 3 mana springs
    { id: 'ms_spring3', name: 'Infernal Mana Spring', type: 'mana_spring', zone: 'Infernal Crucible', zoneLv: 23, desc: 'A spring of liquid flame that burns cold. Each sip sears the mind with forbidden knowledge.', unlocked: false, icon: '💧', cost: 20 },
    { id: 'ms_spring4', name: 'Abyssal Mana Spring', type: 'mana_spring', zone: 'Tidal Abyss', zoneLv: 25, desc: 'Dark water that glows with inner light. Drinking it feels like drowning in stars.', unlocked: false, icon: '💧', cost: 25 },
    { id: 'ms_spring5', name: 'Crown Mana Spring', type: 'mana_spring', zone: 'The Shattered Crown', zoneLv: 26, desc: 'Lightning-charged rain pools in the crown\'s hollow. Each drop crackles with sovereign power.', unlocked: false, icon: '💧', cost: 30 },
    { id: 'ms_spring6', name: 'Void Mana Spring', type: 'mana_spring', zone: 'The Hollow Throne', zoneLv: 27, desc: 'A spring that flows upward into darkness. The water tastes like forgetting.', unlocked: false, icon: '💧', cost: 35 },
    { id: 'ms_spring7', name: 'Fractured Mana Spring', type: 'mana_spring', zone: 'The Breaking', zoneLv: 30, desc: 'A spring that exists in two places at once. Drinking from it feels like remembering something that hasn\'t happened yet.', unlocked: false, icon: '💧', cost: 40 },

    ]
  },
  
    currentJournalEntry: null,
    
      // === ENDLESS GRIND ROOM ===
  endlessGrind: {
    active: false,
    wave: 0,
    totalKills: 0,
    totalXp: 0,
    totalGold: 0,
    sessionStart: null,
    autoNext: true,
    maxZoneLevel: 1,
    difficulty: 'normal', // normal, hard, nightmare
    difficultyMult: { normal: 1.0, hard: 1.5, nightmare: 2.5 }
  },
  grindChampionship: {
    bestWave: 0,
    claimedTiers: [] // ids of GRIND_TIERS already claimed
  },
  // === RAID MODE ===
  // Sequential boss gauntlets, mixing bosses across eras, escalating difficulty.
  // No full heal between stages — only what the party's own kit can restore.
  raid: {
    active: false,
    raidId: null,
    stageIndex: 0,
    sessionStart: null
  },
  raidProgress: {
    cleared: [] // ids of RAIDS fully cleared at least once
  },
  strongholds: {}, // claimed strongholds, keyed by STRONGHOLDS id — set true once claimed
  strongholdTasks: [], // populated from STRONGHOLDS[id].tasks once a stronghold is claimed
  strongholdStipendDay: -1, // last gameDay a stronghold stipend was collected
  manaSpringUses: { day: 0, count: 0 },


    questCollapsed: {},
    combatStatsExpanded: false, // collapsed by default to keep the combat screen compact



  banter: {
    solo: [
      { speaker: 'San', text: "The fire crackles. You stare into it, thinking of Joel, of the porch where he found the mother cat, of the dorm where he had to say goodbye." },
      { speaker: 'San', text: "A moth circles the flame. You let it live. Joel would have fed it. Joel feeds everything." },
      { speaker: 'San', text: "You sharpen your staff by firelight. The rhythm soothes you. It reminds you of counting gold with Aisyah, faster than you can blink." },
      { speaker: 'San', text: "The woods are quiet. Too quiet. Like the silence between you and Mez, the wall neither of you knows how to climb." },
      { speaker: 'San', text: "You count your gold twice. Old habits. Aisyah taught you that. Numbers don't lie. People do. But some people don't." },
      { speaker: 'San', text: "A shooting star. You don't make a wish — you've learned better. Wishes don't send money home. Work does." },
      { speaker: 'San', text: "You check your phone out of habit. No signal in Aethon. But Mum and Dad are still there, still orbiting, still needing. The gravity pulls even across worlds." },
      { speaker: 'San', text: "You touch the mark on your wrist. It pulses. A key, Mezstorm said. A key to what? Maybe a key back. Maybe a key forward. Maybe just a key to understanding why you keep choosing the harder path." }
    ],
    joel: [
      { speaker: 'Joel', text: "Joel tosses you a dried fruit. 'Eat. You're no use to anyone faint.' He says it gruffly, but he checked your pack three times to make sure you had enough." },
      { speaker: 'Joel', text: "'Remember when we thought goblins were scary?' Joel laughs, nursing a bruise. You remember when you thought bills were scary. You were younger then." },
      { speaker: 'Joel', text: "Joel checks his shield for the third time. 'Habit,' he mutters. You know the habit. You check your bank account the same way. The same fear. The same hope." },
      { speaker: 'Joel', text: "'Your sister asked about you,' Joel says to the fire. You don't reply. Aisyah always asks. That's what eldest sisters do." },
      { speaker: 'Joel', text: "Joel hums an old tune. You almost recognize it — a song from his village, from the Philippines, from the small church where his mother still prays for him." },
      { speaker: 'Joel', text: "'You're burning the rations,' Joel notes. You pull the stick back. He takes it from you, turns it, hands it back. Fixed. He always fixes things." },
      { speaker: 'Joel', text: "'Soel is watching the fire again,' Joel says, smiling. 'He used to do that in my dorm. Before...' He doesn't finish. He doesn't need to." },
      { speaker: 'Joel', text: "Joel's hand finds yours in the dark. Not a grand gesture. Just... present. Steadfast. The way he has always been. The way he will always be." }
    ],
    aisyah: [
      { speaker: 'Aisyah', text: "Aisyah appears from the shadows with berries. 'You're welcome.' She found them the way she finds everything — by knowing where to look, who to ask, what the market price should be." },
      { speaker: 'Aisyah', text: "'Stop fidgeting,' Aisyah sighs. 'The fire won't attack you.' But she checks your bandages anyway, the way she checked your homework, your clothes, your life choices." },
      { speaker: 'Aisyah', text: "She's cleaning her daggers. The steel catches the light like teeth. She taught you that steel is a tool, not a threat. You are still learning the difference." },
      { speaker: 'Aisyah', text: "'Joel snores,' Aisyah whispers. 'Loudly. Just so you know.' She says it like a warning. She says it like she's giving you something precious." },
      { speaker: 'Aisyah', text: "Aisyah stares at the stars. 'Brunei's sky was never this clear.' You don't ask if she misses it. You know the answer. You miss it too." },
      { speaker: 'Aisyah', text: "'You fight like Mum,' she says suddenly. Then: 'That's not a compliment.' But she's smiling. Almost." },
      { speaker: 'Aisyah', text: "Aisyah counts gold by firelight, faster than you can blink. 'Numbers don't lie,' she says. 'People do. But some people... don't.' She looks at you when she says it." },
      { speaker: 'Aisyah', text: "She unfolds a worn map marked with trade routes. 'This path,' she taps, 'is where the real money flows. Dangerous. Worth it.' She taught you this. In Brunei. In Aethon. Always." },
      { speaker: 'Aisyah', text: "'I once traded a single ruby for three weeks of safe passage,' she says, not bragging. Just fact. 'The trick is knowing what the other person needs more than gold.'" },
      { speaker: 'Aisyah', text: "Aisyah sharpens a second dagger. 'First rule of the road: trust no one. Second rule: find someone worth breaking the first rule for.' She looks at Joel. She looks at you. She doesn't say anything else." },
      { speaker: 'Aisyah', text: "'Senedra asked about you today,' Aisyah says quietly. 'She wants to learn the trade routes. I told her to ask you.' She pauses. 'Family business should stay in the family.'" },
      { speaker: 'Aisyah', text: "Aisyah checks her pack twice, then a third time. 'Old habit,' she mutters. You know the habit. You share it. Breadwinners always check. We always worry. We always keep going." }
    ],
    mezstorm: [
      { speaker: 'Mezstorm', text: "Mezstorm's hands spark with static. 'Sorry. Nervous habit.' You wonder if Mez had nervous habits too. You wonder if you would recognize them." },
      { speaker: 'Mezstorm', text: "'The ley lines here are... wrong,' Mezstorm mutters, drawing in dirt. 'They have been wrong since the tower rose.' You wonder if he means the tower, or if he means since the rift. Since the mistake." },
      { speaker: 'Mezstorm', text: "He offers you a strange tea. It tastes of copper and regret. You drink it anyway. Some offerings, you do not refuse." },
      { speaker: 'Mezstorm', text: "'I knew a sorcerer in the east who'd laugh at your form,' he says. 'Rude of him.' You almost laugh. Mez used to say things like that. Sharp. Deflecting. Protecting." },
      { speaker: 'Mezstorm', text: "Mezstorm watches the fire like it's speaking to him. Maybe it is. Maybe the fire remembers things he doesn't. Maybe it remembers her." },
      { speaker: 'Mezstorm', text: "'Do you ever feel like you're forgetting something important?' he asks suddenly. You feel it every day. You feel it right now." },
      { speaker: 'Mezstorm', text: "He hums a tune under his breath. You almost recognize it. A lullaby? A prayer? Something from before? The melody catches in your throat like a fishbone." },
      { speaker: 'Mezstorm', text: "'The storm chose me,' he says, not looking at you. 'I didn't ask for it. But it doesn't care what you ask for.' You know. You know so well." }
    ],
    eliz: [
      { speaker: 'Eliz', text: "Eliz presses a cool cloth to your forehead without asking. 'Fever.' She always knows. She knew in Brunei. She knows in Aethon." },
      { speaker: 'Eliz', text: "'Your aura is frayed,' she says gently. 'Rest now. I mean it.' Her hands glow. Not metaphorically. Actually glow. Autism, in this world, is a frequency. She hears magic the way others hear music." },
      { speaker: 'Eliz', text: "She hums while sorting herbs. The sound makes your shoulders drop. You wish you had known her better, before. You are learning to know her now." },
      { speaker: 'Eliz', text: "'Joel hides his wounds,' Eliz confides. 'Check on him. Please.' She sees things others don't. She sees the things between people. The frayed auras. The unspoken hurts." },
      { speaker: 'Eliz', text: "A firefly lands on her hand. She smiles like it's a gift. She smiles like everything is a gift. You wonder what the world looks like through her eyes. You wonder if it's more beautiful." },
      { speaker: 'Eliz', text: "'The void is loud,' she whispers, suddenly. 'Louder than the market. Louder than the mosque. But I can hear you through it. I can always hear you.'" },
      { speaker: 'Eliz', text: "She arranges your herbs in a pattern that makes no sense to you. 'Balance,' she says, though you didn't ask. 'Everything needs balance. Even sorcerers. Especially sorcerers.'" }
    ],
    senedra: [
      { speaker: 'Senedra', text: "Senedra returns from the treeline. 'Two wolves. Watching. Not hungry.' She strings her bow by feel, eyes never leaving the dark. She learned this from her mother. From Aisyah." },
      { speaker: 'Senedra', text: "'The north has harsher winters than this,' she says, almost fondly. You wonder if she means Aethon's north, or if she remembers something from before. From Brunei. From home." },
      { speaker: 'Senedra', text: "Senedra offers you pemmican. It tastes like survival. 'Mum taught me to make it,' she says. 'The real money is in dried goods. They travel. They last. They sell.'" },
      { speaker: 'Senedra', text: "'Your cat would hate these woods,' she says. You think of Soel. You think of the dorm. You think of Joel saying take him, not looking at you. 'He'd adapt,' you say. Senedra smiles. 'Like you?'" },
      { speaker: 'Senedra', text: "'I found a secret path,' she whispers, excited. 'Aisyah would know what to do with it. Trade routes, she calls them. I call them... possibilities.'" },
      { speaker: 'Senedra', text: "Senedra sharpens an arrowhead with methodical patience. 'Zaki rushes,' she says. 'I wait. Mum says both have value. I think she's right. I think she's usually right.'" }
    ],
    zaki: [
      { speaker: 'Zaki', text: "Zaki sharpens his sword too aggressively. Sparks fly. 'Sorry.' He is young. The firelight makes him look younger. You wonder if your parents looked at you this way, once." },
      { speaker: 'Zaki', text: "'I could take a goblin blindfolded,' he boasts. No one argues. Aisyah taught him confidence. She taught you caution. You are both still learning." },
      { speaker: 'Zaki', text: "'Why'd you pick sorcery?' Zaki asks. 'Seems... lonely.' You don't have an answer. You didn't pick it. It picked you. Like Soel picked you. Like Joel picked you. Some things, you don't choose." },
      { speaker: 'Zaki', text: "Zaki throws a pebble at a bat. It misses by a meter. 'Meant to do that.' He grins. You almost believe him. You want to believe him." },
      { speaker: 'Zaki', text: "'Mum says you're the bravest person she knows,' Zaki says suddenly. 'I think she's right. I think... I want to be brave like you.' You don't feel brave. You feel tired. But you smile anyway." },
      { speaker: 'Zaki', text: "Zaki checks his pack seventeen times. 'Nervous,' he admits. You tell him it's okay. You tell him checking is a kind of love. You don't tell him you check your bank account the same way." }
    ],
    soel: [
      { speaker: 'Soel', text: "Soel curls in your lap, purring like a motor. The warmth seeps in. It reminds you of the dorm, of Joel's small room, of the nights you sat together while the rain fell." },
      { speaker: 'Soel', text: "He bats at a moth, misses, pretends he didn't care. He has always been like this. Proud. Stubborn. Choosing you again and again, even when you don't deserve it." },
      { speaker: 'Soel', text: "Soel's ears twitch. He stares at nothing. You trust his instincts. He knew the rift was coming. He knew the dorm was ending. He always knows." },
      { speaker: 'Soel', text: "He brings you a leaf. It's the thought that counts. He brought Joel leaves too, once. In the dorm. Before the goodbye. Some things don't change across worlds." },
      { speaker: 'Soel', text: "Soel kneads your robe. Tiny claws, enormous love. He is not merely a cat. He is a spirit. He is a choice made flesh. He is the space between San and Joel, made purring." },
      { speaker: 'Soel', text: "Soel hisses at an empty corner. 'There's something there,' his eyes say. 'Trust me.' You do. You always do. He has never been wrong." },
      { speaker: 'Soel', text: "Soel jumps onto Joel's head. 'Better view from up here,' he seems to say. Joel doesn't complain. Joel never complains. He just adjusts his shield and keeps walking." }
    ],
    tavern: [
      { speaker: 'Barkeep', text: "The barkeep slides you watered ale. 'On the house, mage.' You wonder if he knows you're from Brunei. You wonder if anyone here knows where that is." },
      { speaker: 'Bard', text: "A bard sings of the Frostspire. You know the ending. Everyone dies. You wonder if he knows that the Frost Queen is just a woman who learned to be hard. Like Mez. Like you." },
      { speaker: 'San', text: "The fire here is warm, the floor sticky, the company loud. It reminds you of the night market in Gadong. It reminds you of home. It almost reminds you enough." },
      { speaker: 'San', text: "Someone recognizes your staff. You leave before questions. You are not ready to explain Brunei. You are not ready to explain the rain. You are not ready to explain Soel." },
      { speaker: 'Merchant', text: "A merchant offers to buy your goblin teeth. 'For research,' he claims. You think of Aisyah, who would have haggled him down to half. You miss her, even when she's right beside you." },
      { speaker: 'San', text: "The tavern cat is fatter than Soel. You send him a mental apology. Soel ignores you. He is practicing his dignity. He has always had dignity. Even in a cardboard box. Even in a dorm. Even here." },
      { speaker: 'Amad', text: "Amad appears from the kitchen with nasi katok. 'For you, San. From home.' He doesn't charge. He never charges for tastes of home. You eat. You almost cry. You don't. Breadwinners don't cry in taverns." }
    ],
    tense: [
      { speaker: 'San', text: "The fire flickers. The wind shifts. Something's wrong. You think of the rift. You think of the ordinary Tuesday. You think of how quickly ordinary becomes gone." },
      { speaker: 'Soel', text: "Soel's hackles rise. The woods go silent. He knew the rift was coming. He knows this too. You trust him. You reach for your staff." },
      { speaker: 'San', text: "A twig snaps. Not deer. Too heavy. You think of Joel's village, of the stories he told about things in the jungle. You think some stories are true in every world." },
      { speaker: 'San', text: "The temperature drops. Not natural. You think of Mez. You think of storms. You think of the sister who became a stranger who became a stormsinger. You wonder if she feels this too." },
      { speaker: 'San', text: "You smell sulfur. Or rot. Or both. You think of the bills you didn't pay. The electricity you didn't top up. The life you left unfinished. You hope Mum and Dad are okay. You hope. You always hope." }
    ]
  },

  currentDialogue: null,
  ambushWarning: null,
  bestiary: {},
  story: { active: true, chapter: 0, scene: 0, shown: false },
  storyChapters: [
    { title: 'The Rain and the Kitten', unlockLevel: 1, scenes: [
      { speaker: 'Narrator', text: 'It began with rain. The kind that falls for days in Brunei and turns the world soft and gray, that makes the kampong roads muddy and the air smell of wet earth.' },
      { speaker: 'Joel', text: '"She was starving," Joel says, though you do not remember asking. "The mother cat. Skin and bones under the porch."' },
      { speaker: 'Joel', text: '"I fed her. Every day. Did not plan to. Just... could not stop." His voice carries the weight of every stray he has ever fed, every broken thing he has ever fixed.' },
      { speaker: 'Narrator', text: 'Weeks later, the mother cat vanished. In her place: a cardboard box, sodden at the edges, filled with five damp bundles of fur. Kittens. Five of them, mewling, blind, impossibly small.' },
      { speaker: 'Joel', text: '"Gave three away. Kept one for the mother cat, in case she came back." He pauses, looking at something you cannot see. "She did not."' },
      { speaker: 'Joel', text: '"The last one... he would not stop staring at me. Like he had already decided." Joel smiles — rare, small, precious. "I named him Soel."' },
      { speaker: 'Narrator', text: 'Soel. A name that sounds like rain on a roof. Like something small and certain. Like the space between San and Joel — the letters overlapping, the sounds merging.' },
      { speaker: 'Narrator', text: 'Soel grew. Soel watched. Soel chose you, on the nights you visited Joel, climbing into your lap like he had been waiting for you specifically.' },
      { speaker: 'Narrator', text: 'Then came the dorm assignment. Joel and his friends, moved across the city. New building. New rules. No pets allowed.' },
      { speaker: 'Joel', text: '"Take him," Joel said, not looking at you. "He already chose you anyway."' },
      { speaker: 'Narrator', text: 'Soel rode home in your pack, purring like a motor. Like he had always known the way. Like he had always known you would need him.' }
    ]},
    { title: 'The Awakening', unlockLevel: 18, scenes: [
      { speaker: 'Narrator', text: 'You wake in a field of silver grass. The sky is wrong — two moons, one bleeding red. A voice whispers your name. Not San. Something older.' },
      { speaker: 'Narrator', text: 'Your name is San. You are the youngest of three sisters, born in Brunei Darussalam, raised under the weight of family and duty and love that costs more than it should.' },
      { speaker: 'Narrator', text: 'You are a Sorcerer — or you will be, once you remember what that means. The mark on your wrist pulses with silver light, veins crawling upward like roots seeking sun.' },
      { speaker: 'Soel', text: 'A small cat curls at your feet, purring like he has always known you. His name is Soel. He came with the rain. He chose you. That is rare. That is everything.' },
      { speaker: 'Narrator', text: 'Your journey begins in the Whispering Woods. Survive. Grow. Find what was taken from you. And remember — in Aethon, as in Brunei, family is not a choice you make. It is a gravity you orbit.' }
    ]},
    { title: 'The First Bond', unlockLevel: 19, scenes: [
      { speaker: 'Joel', text: '"You look like you need a shield," a voice says. Joel stands in the doorway, already armored, already certain. The steadfast man from a Philippine village, second of four, breadwinner, stray-feeder, yours.' },
      { speaker: 'Joel', text: '"I do not ask why you are here. I ask if you will let me stand beside you while you find out." He does not look at the mark on your wrist. He looks at your face. He always looks at your face.' },
      { speaker: 'Narrator', text: 'Joel joins your party. His shield is heavy. His loyalty is heavier. In this world, as in the last, he is The Steadfast — the one who stands between you and everything that would harm you.' }
    ]},
    { title: 'Sisterblade', unlockLevel: 20, scenes: [
      { speaker: 'Aisyah', text: '"Took you long enough," she says, stepping from the shadows. Her daggers glint like teeth. Your eldest sister, fifty-something in the old world, sharp-eyed and sharper-tongued, taught you to trade before she taught you to fight.' },
      { speaker: 'Aisyah', text: '"Mum asked me to check on you. I told her you were fine. Do not make me a liar." Her hands shake, just slightly. She has been looking for you. She always looks for you.' },
      { speaker: 'Narrator', text: 'Aisyah joins your party. Family is complicated. Family with knives is complicated and useful. She taught you the trade routes of Brunei. Now she teaches you the dangerous paths of Aethon.' }
    ]},
    { title: "The Healer's Light", unlockLevel: 21, scenes: [
      { speaker: 'Eliz', text: '"Your aura is frayed," she whispers, pressing a cool hand to your forehead. You did not hear her approach. She moves like silence, like the space between heartbeats.' },
      { speaker: 'Eliz', text: '"I will mend what I can. But some wounds are not of the body." She is your niece, Mez\'s daughter, autistic in the old world — which here means she experiences magic in textures and colors no one else can perceive.' },
      { speaker: 'Narrator', text: 'Eliz joins your party. Her hands glow with gentle light. Her eyes hold older sorrows. She cannot be reduced below 1 HP — a Guardian Spirit, the game calls it. You call it Eliz being Eliz. The girl who has always endured.' }
    ]},
    { title: 'The Stormsinger', unlockLevel: 22, scenes: [
      { speaker: 'Mezstorm', text: 'Lightning cracks the sky. A figure stands in the rain, hands sparking with static. "The ley lines brought me to you," he says. A voice that is almost familiar. Almost.' },
      { speaker: 'Mezstorm', text: '"Something is wrong in Aethon. The magic itself is... afraid." He offers you strange tea. It tastes of copper and regret. You almost remember sharing a room with him, a childhood game, a mother\'s song.' },
      { speaker: 'Narrator', text: 'Mezstorm joins your party. He speaks to the storm. Sometimes, it answers. He was Mez once — your middle sister, estranged, hard, distant. The magic made a mistake. Rendered her male, like Edwin in the old tales. The memories are ghost-images now. Vague. Painful. Present.' }
    ]},
    { title: 'Shadows of the Past', unlockLevel: 23, scenes: [
      { speaker: 'Narrator', text: 'The Cursed Catacombs whisper your name. Not San — something older. Something buried. The estrangement with Mez, the wall you never learned to cross, the niece you loved in the abstract.' },
      { speaker: 'Narrator', text: 'The Bone Tyrant waits below. It has waited a very long time. It knows about sisters who became strangers. It knows about walls built from silence. It has been waiting for you specifically.' }
    ]},
    { title: 'The Frozen Crown', unlockLevel: 24, scenes: [
      { speaker: 'Narrator', text: 'Frostspire Ruins rise against the northern sky. The Frost Queen\'s castle was beautiful once, before the ice took her heart. Before she learned to be hard, to survive, to push away the warmth that might have saved her.' },
      { speaker: 'Narrator', text: 'They say she still dances in the great hall, alone, waiting for a partner who will never come. You think of Mez. You think of the sister you lost before you knew how to keep her. The ice is not her enemy. The ice is her choice.' }
    ]},
    { title: 'Into the Void', unlockLevel: 25, scenes: [
      { speaker: 'Narrator', text: 'The Abyssal Depths do not belong to this world. They are a wound in reality, and something looks back from the other side. The void between sisters. The silence where words should have been.' },
      { speaker: 'Narrator', text: 'The Abyssal Leviathan devours light, memory, hope. It has swallowed cities. It would swallow you without noticing. But you are a breadwinner. You have been swallowed before. You know how to climb back out.' }
    ]},
    { title: 'Starlight Ascension', unlockLevel: 26, scenes: [
      { speaker: 'Narrator', text: 'The Starlight Spire touches the sky. At its peak, the Astral Lord waits — the final gatekeeper, the last question. You have come so far from Brunei. So far from the rain and the kitten and the porch where it all began.' },
      { speaker: 'Narrator', text: 'The hardest truth is always the last one. That love is not a feeling. It is a decision, made daily, made hourly, made in the space between I am tired and I will keep going anyway.' },
      { speaker: 'Soel', text: 'Soel rubs against your leg. "We go together," his eyes seem to say. "Always together." He chose you. In the rain. In the dorm. In the rift. In every world, in every form, he chooses you. That is rare. That is everything.' }
    ]},
    { title: 'Planar Convergence', unlockLevel: 27, scenes: [
      { speaker: 'Narrator', text: 'The Arcane Planar Tower tears at the seams of reality. Gravity shifts. Time stutters. The walls breathe with planar magic. This is where the rift began — the tear that pulled you from Brunei, from the ordinary Tuesday, from the life you were still learning to live.' },
      { speaker: 'Narrator', text: 'The Planarch waits at the apex — a being of pure planar energy, shifting dimensions every three turns, warping the battlefield, spawning rifts. It is not evil. It is simply a wound, a place where too many dimensions touched and something woke up.' },
      { speaker: 'Narrator', text: 'You have survived the rain. You have survived the estrangement. You have survived being a breadwinner in a world that takes more than it gives. The Planarch is just another bill to pay. Another mouth to feed. Another reason to keep going.' },
      { speaker: 'Mezstorm', text: '"The stars are wrong," Mezstorm whispers, hands sparking. "They have been wrong since the tower rose." He looks at you, and for a moment — just a moment — you see Mez in his eyes. Your sister. Your storm. Your almost.' },
      { speaker: 'Joel', text: '"Breakfast," Joel says, like nothing happened. Like you did not almost end the world in your sleep. He squeezes your shoulder. His hand is warm. It has always been warm.' },
      { speaker: 'Narrator', text: 'The sun rises over Aethon. Two moons fade. Soel purrs on your chest, kneading soft circles into your heart. The story continues. Not ended. Just paused. And somewhere, in a small village in the Philippines, a mother wakes. In Brunei, two parents check their phones. The gravity still pulls. The orbit still holds. You are still a breadwinner. You are still choosing love. You are still — always — San.' }
    ]}
    
  ],
  
};

// ============================================================
// D&D DICE ROLL SYSTEM

// ============================================================
// EQUIPMENT & LOOT SYSTEM
// ============================================================

const EQUIPMENT_SLOTS = {
  weapon: { name: 'Weapon', icon: '⚔️', stat: 'atk', desc: 'Main hand' },
  armor:  { name: 'Armor',  icon: '🛡️', stat: 'def', desc: 'Body' },
  head:   { name: 'Head',   icon: '🎓', stat: 'def', desc: 'Helm/Hat' },
  hands:  { name: 'Hands',  icon: '🧤', stat: 'atk', desc: 'Gloves' },
  feet:   { name: 'Feet',   icon: '👢', stat: 'def', desc: 'Boots' },
  ring:   { name: 'Ring',   icon: '💍', stat: null,  desc: 'Finger' },
  ring1:  { name: 'Ring',   icon: '💍', stat: null,  desc: 'Finger' },
  ring2:  { name: 'Ring',   icon: '💍', stat: null,  desc: 'Finger' },
  amulet: { name: 'Amulet', icon: '📿', stat: null,  desc: 'Neck' }
};

const ITEM_RARITY = {
  common:    { color: '#9ca3af', name: 'Common',    mult: 1.0,  prefixChance: 0 },
  uncommon:  { color: '#22c55e', name: 'Uncommon',  mult: 1.2,  prefixChance: 0.3 },
  rare:      { color: '#3b82f6', name: 'Rare',      mult: 1.5,  prefixChance: 0.6 },
  epic:      { color: '#a855f7', name: 'Epic',      mult: 2.0,  prefixChance: 0.8 },
  legendary: { color: '#f59e0b', name: 'Legendary', mult: 3.0,  prefixChance: 1.0 }
};

const ITEM_PREFIXES = {
  // Stat boost prefixes
  'Sharp':      { stat: 'atk', val: 2, desc: '+2 ATK' },
  'Reinforced': { stat: 'def', val: 2, desc: '+2 DEF' },
  'Arcane':     { stat: 'int', val: 2, desc: '+2 INT' },
  'Wise':       { stat: 'wis', val: 2, desc: '+2 WIS' },
  'Swift':      { stat: 'dex', val: 2, desc: '+2 DEX' },
  'Sturdy':     { stat: 'con', val: 2, desc: '+2 CON' },
  'Charming':   { stat: 'cha', val: 2, desc: '+2 CHA' },
  'Strong':     { stat: 'str', val: 2, desc: '+2 STR' },
  // Special prefixes
  'Flaming':    { stat: 'fireDmg', val: 3, desc: '+3 Fire DMG' },
  'Frozen':     { stat: 'iceDmg', val: 3, desc: '+3 Ice DMG' },
  'Shocking':   { stat: 'lightDmg', val: 3, desc: '+3 Lightning DMG' },
  'Vampiric':   { stat: 'lifeSteal', val: 0.1, desc: '10% Life Steal' },
  'Lucky':      { stat: 'critChance', val: 0.05, desc: '+5% Crit' },
  'Brisk':      { stat: 'mpRegen', val: 2, desc: '+2 MP/turn' },
};

const ITEM_SUFFIXES = {
  'of Power':      { stat: 'atk', val: 3, desc: '+3 ATK' },
  'of Warding':    { stat: 'def', val: 3, desc: '+3 DEF' },
  'of the Mind':   { stat: 'int', val: 3, desc: '+3 INT' },
  'of the Body':   { stat: 'con', val: 3, desc: '+3 CON' },
  'of Speed':      { stat: 'dex', val: 3, desc: '+3 DEX' },
  'of Will':       { stat: 'wis', val: 3, desc: '+3 WIS' },
  'of Charms':     { stat: 'cha', val: 3, desc: '+3 CHA' },
  'of Might':      { stat: 'str', val: 3, desc: '+3 STR' },
  'of Flames':     { stat: 'fireRes', val: 0.2, desc: '+20% Fire Resist' },
  'of Frost':      { stat: 'iceRes', val: 0.2, desc: '+20% Ice Resist' },
  'of Storms':     { stat: 'lightRes', val: 0.2, desc: '+20% Lightning Resist' },
  'of the Void':   { stat: 'voidRes', val: 0.2, desc: '+20% Void Resist' },
  'of the Arcane': { stat: 'arcaneRes', val: 0.2, desc: '+20% Arcane Resist' },
  'of Healing':    { stat: 'hpRegen', val: 3, desc: '+3 HP/turn' },
  'of Mana':       { stat: 'mpRegen', val: 3, desc: '+3 MP/turn' },
  'of Fortune':    { stat: 'goldFind', val: 0.15, desc: '+15% Gold Find' },
};

// Base item templates by slot and level range
const LOOT_TABLES = {
  weapon: [
    { n: 'Worn Dagger',       ilvl: 1,  atk: 2, dex: 1 },
    { n: 'Apprentice Staff',  ilvl: 1,  atk: 2, int: 1 },
    { n: 'Iron Sword',        ilvl: 2,  atk: 4, str: 1 },
    { n: 'Crystal Wand',      ilvl: 3,  atk: 5, int: 2 },
    { n: 'Steel Longsword',   ilvl: 4,  atk: 7, str: 2 },
    { n: 'Flamebrand',        ilvl: 5,  atk: 9, int: 2, fireDmg: 2 },
    { n: 'Frostbite Blade',   ilvl: 6,  atk: 10, dex: 2, iceDmg: 3 },
    { n: 'Stormcaller Staff', ilvl: 7,  atk: 12, int: 3, lightDmg: 3 },
    { n: 'Void Reaver',       ilvl: 8,  atk: 15, str: 3, voidDmg: 4 },
    { n: 'Dragonfang',        ilvl: 9,  atk: 18, str: 4, fireDmg: 5 },
    { n: 'Starlight Blade',   ilvl: 10, atk: 22, int: 5, lightDmg: 6 },
    // Phase 2: Planar Weapons (Lv 11-20)
    { n: 'Planar Edge',       ilvl: 11, atk: 26, int: 6, arcaneDmg: 6 },
    { n: 'Emberfall Scythe',  ilvl: 12, atk: 30, str: 5, fireDmg: 8 },
    { n: 'Glacial Greatsword',ilvl: 13, atk: 34, str: 6, iceDmg: 9 },
    { n: 'Thunderlord Spear', ilvl: 14, atk: 38, dex: 5, lightDmg: 10 },
    { n: 'Voidrender',        ilvl: 15, atk: 42, int: 7, voidDmg: 12 },
    { n: 'Chronoblade',       ilvl: 16, atk: 46, int: 8, arcaneDmg: 10, mpRegen: 2 },
    { n: 'Aetherium Halberd', ilvl: 17, atk: 50, wis: 6, arcaneDmg: 11, hpRegen: 2 },
    { n: 'Convergence Blade', ilvl: 18, atk: 55, int: 9, arcaneDmg: 13, voidDmg: 5 },
    { n: 'Nexus Cleaver',     ilvl: 19, atk: 60, str: 7, voidDmg: 14, lifeSteal: 0.08 },
    { n: 'Reality Sunderer',  ilvl: 20, atk: 70, int: 10, arcaneDmg: 15, voidDmg: 8, mpRegen: 3 },
        // === PHASE 1: ilvl 21-22 WEAPONS ===
    { n: 'Astral Edge',       ilvl: 21, atk: 78, int: 11, arcaneDmg: 12, voidDmg: 6, mpRegen: 2 },
    { n: 'Infernal Reaver',   ilvl: 22, atk: 86, str: 9, fireDmg: 14, critChance: 0.04 },

  ],
  armor: [
    { n: 'Tattered Cloth',    ilvl: 1,  def: 1 },
    { n: 'Novice Robes',      ilvl: 1,  def: 2, int: 1 },
    { n: 'Leather Vest',      ilvl: 2,  def: 3, dex: 1 },
    { n: 'Chain Shirt',       ilvl: 3,  def: 4, con: 1 },
    { n: 'Scale Mail',        ilvl: 4,  def: 6, str: 1 },
    { n: 'Enchanted Robes',   ilvl: 5,  def: 5, int: 3, mpRegen: 1 },
    { n: 'Frostweave Cloak',  ilvl: 6,  def: 7, int: 2, iceRes: 0.15 },
    { n: 'Thunder Plate',     ilvl: 7,  def: 9, con: 2, lightRes: 0.15 },
    { n: 'Abyssal Mail',      ilvl: 8,  def: 11, str: 2, voidRes: 0.2 },
    { n: 'Dragonscale Armor', ilvl: 9,  def: 13, con: 3, fireRes: 0.2 },
    { n: 'Celestial Vestment',ilvl: 10, def: 15, wis: 4, hpRegen: 3 },
    // Phase 2: Planar Armor (Lv 11-20)
    { n: 'Planar Robes',      ilvl: 11, def: 17, int: 5, arcaneRes: 0.15, mpRegen: 2 },
    { n: 'Emberfall Plate',   ilvl: 12, def: 19, con: 4, fireRes: 0.25, hpRegen: 2 },
    { n: 'Glacial Aegis',    ilvl: 13, def: 21, wis: 5, iceRes: 0.25, mpRegen: 2 },
    { n: 'Stormweave Mail',   ilvl: 14, def: 23, dex: 4, lightRes: 0.25, hpRegen: 3 },
    { n: 'Voidshroud',        ilvl: 15, def: 25, int: 6, voidRes: 0.3, mpRegen: 3 },
    { n: 'Chronos Vest',      ilvl: 16, def: 27, wis: 6, arcaneRes: 0.2, hpRegen: 3 },
    { n: 'Aetherium Plate',   ilvl: 17, def: 29, con: 5, arcaneRes: 0.25, mpRegen: 3 },
    { n: 'Convergence Mail',  ilvl: 18, def: 32, str: 4, voidRes: 0.2, fireRes: 0.2, iceRes: 0.2 },
    { n: 'Nexus Ward',        ilvl: 19, def: 35, con: 6, arcaneRes: 0.3, voidRes: 0.2, hpRegen: 4 },
    { n: 'Reality Anchor',    ilvl: 20, def: 40, int: 8, wis: 4, arcaneRes: 0.35, voidRes: 0.25, hpRegen: 5, mpRegen: 4 },
        // === PHASE 1: ilvl 21-22 ARMOR ===
    { n: 'Astral Vestment',   ilvl: 21, def: 44, int: 9, wis: 5, arcaneRes: 0.30, voidRes: 0.20, hpRegen: 4, mpRegen: 4 },
    { n: 'Infernal Plate',    ilvl: 22, def: 48, con: 6, str: 4, fireRes: 0.30, hpRegen: 5, mpRegen: 2 },

  ],
  head: [
    { n: 'Cloth Hood',        ilvl: 1,  def: 1, wis: 1 },
    { n: 'Leather Cap',       ilvl: 2,  def: 2, dex: 1 },
    { n: 'Iron Helm',         ilvl: 3,  def: 3, str: 1 },
    { n: 'Scholars Hat',      ilvl: 4,  def: 2, int: 2 },
    { n: 'Crown of Thought',  ilvl: 6,  def: 4, int: 3, mpRegen: 1 },
    { n: 'Dragon Helm',       ilvl: 8,  def: 6, con: 2, fireRes: 0.1 },
    // Phase 2: Planar Headgear (Lv 11-20)
    { n: 'Planar Crown',      ilvl: 11, def: 8, int: 4, arcaneRes: 0.1, mpRegen: 2 },
    { n: 'Emberfall Helm',    ilvl: 12, def: 9, str: 3, fireRes: 0.15, hpRegen: 1 },
    { n: 'Glacial Diadem',    ilvl: 13, def: 10, wis: 4, iceRes: 0.15, mpRegen: 2 },
    { n: 'Stormcaller Hood',  ilvl: 14, def: 11, int: 5, lightRes: 0.15, mpRegen: 2 },
    { n: 'Voidmask',          ilvl: 15, def: 12, int: 5, voidRes: 0.2, mpRegen: 3 },
    { n: 'Chronos Circlet',   ilvl: 16, def: 13, wis: 5, arcaneRes: 0.15, hpRegen: 2 },
    { n: 'Aetherium Crown',   ilvl: 17, def: 14, int: 6, arcaneRes: 0.2, mpRegen: 3 },
    { n: 'Convergence Helm',  ilvl: 18, def: 15, con: 4, arcaneRes: 0.15, voidRes: 0.15 },
    { n: 'Nexus Visage',      ilvl: 19, def: 17, int: 7, arcaneRes: 0.25, voidRes: 0.15, mpRegen: 3 },
    { n: 'Reality Crown',     ilvl: 20, def: 20, int: 8, wis: 4, arcaneRes: 0.3, voidRes: 0.2, mpRegen: 4 },
        // === PHASE 1: ilvl 21-22 HEAD ===
    { n: 'Astral Crown',      ilvl: 21, def: 22, int: 9, wis: 5, arcaneRes: 0.25, voidRes: 0.15, mpRegen: 4 },
    { n: 'Infernal Helm',     ilvl: 22, def: 24, str: 5, con: 4, fireRes: 0.25, hpRegen: 2 },

  ],
  hands: [
    { n: 'Cloth Wraps',       ilvl: 1,  def: 1, dex: 1 },
    { n: 'Leather Gloves',    ilvl: 2,  def: 1, atk: 1 },
    { n: 'Iron Gauntlets',    ilvl: 3,  def: 2, str: 1 },
    { n: 'Spellweaver Gloves',ilvl: 5,  def: 2, int: 2, mpRegen: 1 },
    { n: 'Void Grips',        ilvl: 7,  def: 3, atk: 2, voidDmg: 2 },
    // Phase 2: Planar Gloves (Lv 11-20)
    { n: 'Planar Wraps',      ilvl: 11, def: 4, int: 3, arcaneDmg: 2, mpRegen: 1 },
    { n: 'Emberfall Gauntlets',ilvl: 12, def: 5, str: 3, fireDmg: 3, atk: 2 },
    { n: 'Glacial Grips',     ilvl: 13, def: 5, dex: 3, iceDmg: 3, atk: 2 },
    { n: 'Stormtouch Gloves', ilvl: 14, def: 6, int: 4, lightDmg: 4, mpRegen: 2 },
    { n: 'Void Claws',        ilvl: 15, def: 6, atk: 4, voidDmg: 5, critChance: 0.03 },
    { n: 'Chronos Wraps',     ilvl: 16, def: 7, int: 4, arcaneDmg: 4, mpRegen: 2 },
    { n: 'Aetherium Grips',   ilvl: 17, def: 7, wis: 3, arcaneDmg: 5, hpRegen: 1 },
    { n: 'Convergence Fists', ilvl: 18, def: 8, str: 3, atk: 3, fireDmg: 2, iceDmg: 2 },
    { n: 'Nexus Grasp',       ilvl: 19, def: 9, int: 5, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Reality Gauntlets', ilvl: 20, def: 10, int: 6, atk: 4, arcaneDmg: 7, voidDmg: 4, critChance: 0.05 },
        // === PHASE 1: ilvl 21-22 HANDS ===
    { n: 'Astral Wraps',      ilvl: 21, def: 11, int: 7, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Infernal Gauntlets',ilvl: 22, def: 12, str: 5, fireDmg: 6, atk: 3, critChance: 0.04 },

  ],
  feet: [
    { n: 'Worn Boots',        ilvl: 1,  def: 1, con: 1 },
    { n: 'Swift Boots',       ilvl: 2,  def: 1, dex: 2 },
    { n: 'Iron Greaves',      ilvl: 3,  def: 2, str: 1 },
    { n: 'Arcane Slippers',   ilvl: 4,  def: 1, int: 2 },
    { n: 'Winged Boots',      ilvl: 6,  def: 2, dex: 3 },
    { n: 'Void Walkers',      ilvl: 8,  def: 3, dex: 2, voidRes: 0.1 },
    // Phase 2: Planar Boots (Lv 11-20)
    { n: 'Planar Treads',     ilvl: 11, def: 4, dex: 3, arcaneRes: 0.1, mpRegen: 1 },
    { n: 'Emberfall Boots',   ilvl: 12, def: 4, con: 3, fireRes: 0.15, hpRegen: 1 },
    { n: 'Glacial Striders',  ilvl: 13, def: 5, dex: 4, iceRes: 0.15, mpRegen: 1 },
    { n: 'Stormleapers',      ilvl: 14, def: 5, dex: 4, lightRes: 0.15, hpRegen: 2 },
    { n: 'Void Striders',     ilvl: 15, def: 6, dex: 4, voidRes: 0.2, mpRegen: 2 },
    { n: 'Chronos Boots',     ilvl: 16, def: 6, wis: 3, arcaneRes: 0.1, hpRegen: 2 },
    { n: 'Aetherium Walkers', ilvl: 17, def: 7, dex: 5, arcaneRes: 0.15, mpRegen: 2 },
    { n: 'Convergence Treads',ilvl: 18, def: 7, con: 3, arcaneRes: 0.1, voidRes: 0.1, hpRegen: 2 },
    { n: 'Nexus Striders',    ilvl: 19, def: 8, dex: 5, arcaneRes: 0.2, voidRes: 0.15, mpRegen: 2 },
    { n: 'Reality Walkers',   ilvl: 20, def: 10, dex: 6, con: 3, arcaneRes: 0.25, voidRes: 0.2, hpRegen: 3, mpRegen: 3 },
        // === PHASE 1: ilvl 21-22 FEET ===
    { n: 'Astral Treads',     ilvl: 21, def: 11, dex: 7, con: 3, arcaneRes: 0.20, voidRes: 0.15, mpRegen: 2 },
    { n: 'Infernal Boots',    ilvl: 22, def: 12, dex: 6, con: 4, fireRes: 0.20, hpRegen: 2 },
  ],
  ring: [
    { n: 'Copper Ring',       ilvl: 1,  con: 1 },
    { n: 'Silver Band',       ilvl: 2,  wis: 1 },
    { n: 'Gold Signet',       ilvl: 3,  cha: 2 },
    { n: 'Ruby Ring',         ilvl: 4,  str: 2 },
    { n: 'Sapphire Ring',     ilvl: 5,  int: 2, mpRegen: 1 },
    { n: 'Emerald Ring',      ilvl: 6,  dex: 2, critChance: 0.03 },
    { n: 'Void Band',         ilvl: 8,  int: 3, voidDmg: 2 },
    // Phase 2: Planar Rings (Lv 11-20)
    { n: 'Planar Band',       ilvl: 11, int: 4, arcaneDmg: 2, mpRegen: 1 },
    { n: 'Emberfall Signet',  ilvl: 12, str: 3, fireDmg: 3, hpRegen: 1 },
    { n: 'Glacial Loop',      ilvl: 13, wis: 3, iceDmg: 3, mpRegen: 1 },
    { n: 'Storm Ring',        ilvl: 14, dex: 3, lightDmg: 4, critChance: 0.04 },
    { n: 'Void Seal',         ilvl: 15, int: 5, voidDmg: 5, voidRes: 0.1 },
    { n: 'Chronos Band',      ilvl: 16, wis: 4, arcaneDmg: 4, mpRegen: 2 },
    { n: 'Aetherium Ring',    ilvl: 17, int: 5, arcaneDmg: 5, hpRegen: 2 },
    { n: 'Convergence Loop',  ilvl: 18, con: 3, arcaneDmg: 3, voidDmg: 3, hpRegen: 1 },
    { n: 'Nexus Band',        ilvl: 19, int: 6, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Reality Seal',      ilvl: 20, int: 7, wis: 3, arcaneDmg: 7, voidDmg: 4, hpRegen: 3, mpRegen: 3 },
        // === PHASE 1: ilvl 21-22 RING ===
    { n: 'Astral Band',       ilvl: 21, int: 8, wis: 4, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Infernal Signet',   ilvl: 22, str: 6, fireDmg: 7, fireRes: 0.10, hpRegen: 2 },

  ],
  amulet: [
    { n: 'String Charm',      ilvl: 1,  wis: 1 },
    { n: 'Silver Pendant',    ilvl: 2,  con: 1 },
    { n: 'Crystal Amulet',    ilvl: 3,  int: 2 },
    { n: 'Dragon Tooth',      ilvl: 5,  str: 2, fireRes: 0.1 },
    { n: 'Starlight Pendant', ilvl: 7,  wis: 3, hpRegen: 2 },
    { n: 'Abyssal Locket',    ilvl: 9,  int: 4, voidDmg: 3 },
    // Phase 2: Planar Amulets (Lv 11-20)
    { n: 'Planar Pendant',    ilvl: 11, int: 5, arcaneDmg: 3, mpRegen: 1 },
    { n: 'Emberfall Charm',   ilvl: 12, str: 4, fireDmg: 4, fireRes: 0.1 },
    { n: 'Glacial Talisman',  ilvl: 13, wis: 4, iceDmg: 4, iceRes: 0.1 },
    { n: 'Storm Amulet',      ilvl: 14, dex: 4, lightDmg: 5, lightRes: 0.1 },
    { n: 'Void Locket',       ilvl: 15, int: 6, voidDmg: 6, voidRes: 0.15 },
    { n: 'Chronos Pendant',   ilvl: 16, wis: 5, arcaneDmg: 5, hpRegen: 2 },
    { n: 'Aetherium Charm',   ilvl: 17, int: 6, arcaneDmg: 6, mpRegen: 2 },
    { n: 'Convergence Amulet',ilvl: 18, con: 4, arcaneDmg: 4, voidDmg: 4, hpRegen: 2 },
    { n: 'Nexus Pendant',     ilvl: 19, int: 7, arcaneDmg: 7, voidDmg: 4, mpRegen: 3 },
    { n: 'Reality Anchor',    ilvl: 20, int: 8, wis: 5, arcaneDmg: 8, voidDmg: 5, hpRegen: 4, mpRegen: 4, lifeSteal: 0.05 },
        // === PHASE 1: ilvl 21-22 AMULET ===
    { n: 'Astral Pendant',    ilvl: 21, int: 9, wis: 5, arcaneDmg: 7, voidDmg: 4, mpRegen: 3 },
    { n: 'Infernal Charm',    ilvl: 22, str: 7, fireDmg: 8, fireRes: 0.15, hpRegen: 3 },
  ]
};

function rollRarity(zoneLevel, luckBonus = 0) {
  const roll = Math.random() + luckBonus;
  const tier = Math.min(zoneLevel, 10);
  if (roll > 0.995 - (tier * 0.005)) return 'legendary';
  if (roll > 0.95 - (tier * 0.01))  return 'epic';
  if (roll > 0.80 - (tier * 0.015)) return 'rare';
  if (roll > 0.50 - (tier * 0.02))  return 'uncommon';
  return 'common';
}

function generateItem(slot, zoneLevel, forceRarity) {
  const table = LOOT_TABLES[slot === 'ring1' || slot === 'ring2' ? 'ring' : slot];
  if (!table) return null;

  // Find appropriate base item by ilvl
  const candidates = table.filter(i => i.ilvl <= zoneLevel + 2);
  const base = candidates.length > 0 
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : table[0];

  const rarity = forceRarity || rollRarity(zoneLevel);
  const rarityData = ITEM_RARITY[rarity];

  const item = {
    n: base.n,
    slot: slot,
    r: rarity,
    ilvl: base.ilvl,
    d: base.d || 'A piece of adventuring gear.',
    ...base
  };

  // Apply rarity multiplier to core stats
  if (item.atk) item.atk = Math.floor(item.atk * rarityData.mult);
  if (item.def) item.def = Math.floor(item.def * rarityData.mult);

  // Roll for prefix
  if (Math.random() < rarityData.prefixChance) {
    const prefixes = Object.keys(ITEM_PREFIXES);
    const pName = prefixes[Math.floor(Math.random() * prefixes.length)];
    const pData = ITEM_PREFIXES[pName];
    item.prefix = pName;
    item.prefixData = pData;
    item.n = pName + ' ' + item.n;
    item[pData.stat] = (item[pData.stat] || 0) + pData.val;
  }

  // Roll for suffix
  if (Math.random() < rarityData.prefixChance * 0.7) {
    const suffixes = Object.keys(ITEM_SUFFIXES);
    const sName = suffixes[Math.floor(Math.random() * suffixes.length)];
    const sData = ITEM_SUFFIXES[sName];
    item.suffix = sName;
    item.suffixData = sData;
    item.n = item.n + ' ' + sName;
    item[sData.stat] = (item[sData.stat] || 0) + sData.val;
  }

  // Calculate sell value
  item.value = Math.floor((base.ilvl * 5 + (rarityData.mult * 10)) * (1 + Math.random() * 0.5));

  // Add sockets for Lv 20+ gear (Phase 2)
  const socketCount = getSocketCount(base.ilvl);
  if (socketCount > 0) {
    item.sockets = new Array(socketCount).fill(null);
    item.d += ' [' + socketCount + ' socket' + (socketCount > 1 ? 's' : '') + ']';
  }

  return item;
}

function getEquippedStats() {
  const stats = { atk: 0, def: 0, str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
                  fireDmg: 0, iceDmg: 0, lightDmg: 0, voidDmg: 0, arcaneDmg: 0,
                  fireRes: 0, iceRes: 0, lightRes: 0, voidRes: 0, arcaneRes: 0,
                  lifeSteal: 0, critChance: 0, mpRegen: 0, hpRegen: 0, goldFind: 0 };

  for (let slot in G.p.eq) {
    const item = G.p.eq[slot];
    if (!item) continue;
    for (let key in stats) {
      if (item[key]) stats[key] += item[key];
      if (item.socketStats && item.socketStats[key]) stats[key] += item.socketStats[key];
    }
  }
  return stats;
}

function getTotalAC() {
  const eqStats = getEquippedStats();
  const dexMod = DICE.abilityMod(G.p.stats.dex + eqStats.dex);
  let baseAC = 10 + dexMod;
  if (G.p.eq.armor) {
    baseAC = 10 + Math.min(dexMod, 2) + (G.p.eq.armor.def || 0);
  }
  baseAC += eqStats.def;
  const shieldBonus = G.p.buffs.reduce((s, b) => s + (b.def || 0), 0);
  return baseAC + shieldBonus;
}

function getPlayerAtkBuff() {
  return G.p.buffs.reduce((s, b) => s + (b.atk || 0), 0);
}

// Migrates a single inventory item from the old t:'wep'/'arm'/'acc'/'pgear' schema to the
// modern slot-based one. Applied to every item on load so gear acquired before this
// session's fixes (sitting unequipped in inventory) doesn't stay permanently broken.
const LEGACY_ACC_SLOT_MAP = {
  "Dryad's Ring": 'ring', 'Planar Lens': 'amulet', 'Luck Charm': 'amulet', 'Ring of Wizardry': 'ring',
  'Vecnas Hand': 'amulet', 'Eye of Vecna': 'amulet', 'Belt of Hill Giant Strength': 'amulet',
  'Gnomish Goggles': 'head', 'Starlight Pendant': 'amulet', "Astronomer's Lens": 'amulet',
  'Cinder Ring': 'ring', 'Equilibrium Stone': 'amulet', 'Depth Charge': 'amulet',
  'Lightning Rod Band': 'ring', 'Absorption Ring': 'ring', 'Infinity Loop': 'ring', 'The Crown of Ends': 'head'
};
const LEGACY_PGEAR_SLOT_MAP = {
  "Joel's Bulwark": 'weapon', "Aisyah's Twin Blades": 'weapon', "Soel's Spirit Bell": 'weapon',
  "Eliz's Serenity Orb": 'amulet', "Zaki's Temper Band": 'ring', "Mezstorm's Conduit": 'amulet',
  "Senedra's Hawkeye Lens": 'ring'
};
function migrateLegacyItem(item) {
  if (!item || item.slot) return item; // already modern, or not an equip item at all
  if (item.t === 'wep') { item.slot = 'weapon'; delete item.t; }
  else if (item.t === 'arm') { item.slot = 'armor'; delete item.t; }
  else if (item.t === 'acc') { item.slot = LEGACY_ACC_SLOT_MAP[item.n] || 'amulet'; delete item.t; }
  else if (item.t === 'pgear') {
    item.slot = LEGACY_PGEAR_SLOT_MAP[item.n] || 'weapon';
    if (item.for) { item.forCompanion = item.for; delete item.for; }
    if (item.mp) { item.hp = (item.hp || 0) + item.mp; delete item.mp; } // companions have no MP stat
    delete item.t;
  }
  return item;
}

function equipItem(invIndex) {
  const item = G.p.inv[invIndex];
  if (!item || !item.slot) return;

  const slot = item.slot;
  const slotKey = slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : slot;

  // Unequip current
  const old = G.p.eq[slotKey];
  if (old) {
    addI(old);
    lg('Unequipped: ' + old.n);
  }

  // Equip new
  G.p.eq[slotKey] = { ...item };
  G.p.inv.splice(invIndex, 1);
  lg('Equipped: ' + item.n + ' (' + ITEM_RARITY[item.r].name + ')');

  // Recalculate derived stats
  const eqStats = getEquippedStats();
  G.p.mhp = 80 + (G.p.lvl - 1) * 10 + (eqStats.con * 2);
  G.p.mmp = 120 + (G.p.lvl - 1) * 15 + (eqStats.int * 2);
  G.p.hp = Math.min(G.p.hp, G.p.mhp);
  G.p.mp = Math.min(G.p.mp, G.p.mmp);
 checkDailyQuests('cast_spells', 1); 
  render();
}

function unequipItem(slot) {
  const item = G.p.eq[slot];
  if (!item) return;
  addI({ ...item });
  lg('Unequipped: ' + item.n);
  G.p.eq[slot] = null;

  // Recalculate
  const eqStats = getEquippedStats();
  G.p.mhp = 80 + (G.p.lvl - 1) * 10 + (eqStats.con * 2);
  G.p.mmp = 120 + (G.p.lvl - 1) * 15 + (eqStats.int * 2);
  G.p.hp = Math.min(G.p.hp, G.p.mhp);
  G.p.mp = Math.min(G.p.mp, G.p.mmp);

  render();
}

// === COMPANION EQUIPMENT: full 8-slot parity with San, role-restricted weapon/armor ===
// Each companion can only equip weapons/armor matching their combat role — a shield only
// fits Joel, a bow only fits Senedra, etc. The other 5 slots (head/hands/feet/rings/amulet)
// are unrestricted, same as San's.
const COMPANION_GEAR_ROLES = {
  Joel: { weaponType: 'shield', weaponLabel: 'Shield', armorType: 'heavy', armorLabel: 'Heavy Armor' },
  Aisyah: { weaponType: 'dagger', weaponLabel: 'Dagger', armorType: 'light', armorLabel: 'Light Armor' },
  Mezstorm: { weaponType: 'staff', weaponLabel: 'Staff', armorType: 'robe', armorLabel: 'Robes' },
  Eliz: { weaponType: 'mace', weaponLabel: 'Mace', armorType: 'robe', armorLabel: 'Robes' },
  Senedra: { weaponType: 'bow', weaponLabel: 'Bow', armorType: 'light', armorLabel: 'Light Armor' },
  Zaki: { weaponType: 'sword', weaponLabel: 'Sword', armorType: 'heavy', armorLabel: 'Heavy Armor' },
  // Soel is a spirit cat, not a humanoid warrior — no helmet/gloves/boots/second ring.
  // He gets 4 slots total instead of 8, all uniquely flavored: Charm, Ward, Collar, Blessing.
  Soel: { weaponType: 'charm', weaponLabel: 'Charm', armorType: 'fur', armorLabel: 'Warded Fur',
    hiddenSlots: ['head', 'hands', 'feet', 'ring2'],
    slotLabelOverrides: { amulet: 'Collar', ring1: 'Blessing' } }
};

const COMPANION_WEAPON_TABLES = {
  shield:  [ { n: 'Wooden Buckler', ilvl: 1, atk: 2, def: 3 }, { n: 'Iron Kiteshield', ilvl: 6, atk: 3, def: 6 }, { n: 'Bulwark of the Steadfast', ilvl: 14, atk: 5, def: 11 }, { n: 'Stormguard Aegis', ilvl: 22, atk: 7, def: 17 }, { n: "Unbreakable Vow", ilvl: 30, atk: 10, def: 25 } ],
  dagger:  [ { n: 'Rusty Dagger', ilvl: 1, atk: 3, spd: 2 }, { n: 'Twin Fangs', ilvl: 6, atk: 6, spd: 4 }, { n: "Sisterblade's Edge", ilvl: 14, atk: 11, spd: 6 }, { n: 'Shadowbite Kris', ilvl: 22, atk: 16, spd: 9 }, { n: "Ledger's Reckoning", ilvl: 30, atk: 22, spd: 12 } ],
  staff:   [ { n: 'Bent Branch', ilvl: 1, atk: 2, spd: 1 }, { n: 'Storm-Touched Staff', ilvl: 6, atk: 5, spd: 2 }, { n: "Stormsinger's Rod", ilvl: 14, atk: 9, spd: 4 }, { n: 'Tempest Conduit', ilvl: 22, atk: 14, spd: 6 }, { n: "Eye of the Storm", ilvl: 30, atk: 19, spd: 8 } ],
  mace:    [ { n: 'Padded Club', ilvl: 1, atk: 2, def: 1 }, { n: 'Gentle Mercy', ilvl: 6, atk: 4, def: 3 }, { n: "Healer's Resolve", ilvl: 14, atk: 7, def: 5 }, { n: 'Lightweaver Rod', ilvl: 22, atk: 11, def: 8 }, { n: 'Breath of Life Incarnate', ilvl: 30, atk: 15, def: 12 } ],
  bow:     [ { n: 'Hunting Bow', ilvl: 1, atk: 3, spd: 2 }, { n: 'Longbow of the Woods', ilvl: 6, atk: 6, spd: 3 }, { n: "Scout's Recurve", ilvl: 14, atk: 11, spd: 5 }, { n: "Storm's Arrow", ilvl: 22, atk: 16, spd: 7 }, { n: 'Eagle-Eye Longbow', ilvl: 30, atk: 22, spd: 10 } ],
  sword:   [ { n: 'Practice Sword', ilvl: 1, atk: 3, def: 1 }, { n: 'Young Blade', ilvl: 6, atk: 6, def: 2 }, { n: 'Iron Discipline', ilvl: 14, atk: 11, def: 4 }, { n: 'Battle-Hardened Edge', ilvl: 22, atk: 16, def: 6 }, { n: 'Immortal Wall Blade', ilvl: 30, atk: 22, def: 9 } ],
  charm:   [ { n: "Kitten's Bell", ilvl: 1, atk: 2, spd: 2 }, { n: 'Warm Ember Charm', ilvl: 6, atk: 4, spd: 3 }, { n: 'Spirit Vigil Talisman', ilvl: 14, atk: 7, spd: 5 }, { n: "Nine Lives' Blessing", ilvl: 22, atk: 10, spd: 7 }, { n: 'The Choice, Made Flesh', ilvl: 30, atk: 14, spd: 10 } ]
};

const COMPANION_ARMOR_TABLES = {
  heavy: [ { n: 'Dented Plate', ilvl: 1, def: 3 }, { n: 'Iron Cuirass', ilvl: 6, def: 6 }, { n: "Steadfast's Bulwark", ilvl: 14, def: 11 }, { n: 'Warden Plate', ilvl: 22, def: 17 }, { n: 'Aegis of the Unbroken', ilvl: 30, def: 24 } ],
  light: [ { n: 'Worn Leathers', ilvl: 1, def: 2, spd: 1 }, { n: 'Scout Leathers', ilvl: 6, def: 4, spd: 2 }, { n: "Sisterblade's Wraps", ilvl: 14, def: 8, spd: 3 }, { n: 'Shadowstep Leathers', ilvl: 22, def: 12, spd: 5 }, { n: "Eagle-Eye's Cloak", ilvl: 30, def: 17, spd: 7 } ],
  robe:  [ { n: 'Frayed Robes', ilvl: 1, def: 1, atk: 1 }, { n: 'Storm-Touched Robes', ilvl: 6, def: 3, atk: 2 }, { n: "Lightweaver's Vestment", ilvl: 14, def: 6, atk: 4 }, { n: 'Tempest Silk', ilvl: 22, def: 9, atk: 6 }, { n: 'Robes of the Eye of the Storm', ilvl: 30, def: 13, atk: 9 } ],
  fur:   [ { n: 'Matted Fur Ward', ilvl: 1, def: 2, spd: 1 }, { n: 'Warm Fur Guard', ilvl: 6, def: 4, spd: 2 }, { n: 'Spirit-Flame Coat', ilvl: 14, def: 7, spd: 3 }, { n: 'Nine Lives Pelt', ilvl: 22, def: 11, spd: 5 }, { n: 'Coat of the Familiar Eternal', ilvl: 30, def: 15, spd: 7 } ]
};

// Shared across every companion — jewelry/misc slots aren't role-restricted
const COMPANION_MISC_TABLE = {
  head:   [ { n: 'Traveler\'s Hood', ilvl: 1, def: 1 }, { n: 'Bronze Circlet', ilvl: 8, def: 3, atk: 1 }, { n: 'Warden\'s Helm', ilvl: 18, def: 6, atk: 2 }, { n: 'Crown of the Faithful', ilvl: 28, def: 9, atk: 4 } ],
  hands:  [ { n: 'Worn Gloves', ilvl: 1, atk: 1 }, { n: 'Reinforced Gauntlets', ilvl: 8, atk: 2, def: 1 }, { n: 'Gripbound Wraps', ilvl: 18, atk: 4, def: 2 }, { n: 'Gauntlets of the Chosen', ilvl: 28, atk: 6, def: 3 } ],
  feet:   [ { n: 'Worn Boots', ilvl: 1, spd: 1 }, { n: 'Swift Boots', ilvl: 8, spd: 2, def: 1 }, { n: 'Boots of the Long Road', ilvl: 18, spd: 4, def: 2 }, { n: 'Windrunner Greaves', ilvl: 28, spd: 6, def: 3 } ],
  ring:   [ { n: 'Copper Band', ilvl: 1, atk: 1 }, { n: 'Silver Loop', ilvl: 8, atk: 2, def: 1 }, { n: 'Ring of Quiet Resolve', ilvl: 18, atk: 3, def: 2 }, { n: 'Band of Unbroken Bonds', ilvl: 28, atk: 5, def: 3 } ],
  amulet: [ { n: 'Wooden Pendant', ilvl: 1, def: 1, atk: 1 }, { n: 'Bronze Locket', ilvl: 8, def: 2, atk: 2 }, { n: 'Amulet of Kinship', ilvl: 18, def: 4, atk: 3 }, { n: 'Heartward Talisman', ilvl: 28, def: 6, atk: 5 } ]
};

// Soel-exclusive — used instead of COMPANION_MISC_TABLE.amulet/ring for his Collar and
// Blessing slots, since a spirit cat's jewelry shouldn't look like San's or a warrior's.
const SOEL_SPECIAL_TABLE = {
  amulet: [ // displayed as "Collar"
    { n: 'Frayed Ribbon Collar', ilvl: 1, def: 1, atk: 1 },
    { n: "Rain-Kept Collar", ilvl: 8, def: 2, atk: 2 },
    { n: "Bell of the Chosen", ilvl: 18, def: 4, atk: 3 },
    { n: "Collar of the Space Between", ilvl: 28, def: 6, atk: 5 }
  ],
  ring: [ // displayed as "Blessing", occupies ring1 only (no second slot for Soel)
    { n: 'Warm Rain Blessing', ilvl: 1, atk: 1, spd: 1 },
    { n: "Porch-Light Blessing", ilvl: 8, atk: 2, spd: 2 },
    { n: "Blessing of the First Choice", ilvl: 18, atk: 3, spd: 3 },
    { n: 'Eternal Blessing', ilvl: 28, atk: 5, spd: 5 }
  ]
};

function getCompanionRole(memberName) {
  return COMPANION_GEAR_ROLES[memberName] || null;
}

// Generates a companion-appropriate item for the given slot. For weapon/armor, pulls from
// that companion's role-restricted pool; for the other 5 slots, pulls from the shared pool.
function generateCompanionItem(memberName, slot, zoneLevel, forceRarity) {
  const role = getCompanionRole(memberName);
  if (!role) return null;
  if (role.hiddenSlots && role.hiddenSlots.includes(slot)) return null; // this companion doesn't use this slot at all

  let table, tag;
  if (slot === 'weapon') { table = COMPANION_WEAPON_TABLES[role.weaponType]; tag = role.weaponType; }
  else if (slot === 'armor') { table = COMPANION_ARMOR_TABLES[role.armorType]; tag = role.armorType; }
  else if (memberName === 'Soel' && (slot === 'amulet' || slot === 'ring')) { table = SOEL_SPECIAL_TABLE[slot]; }
  else { table = COMPANION_MISC_TABLE[slot]; }
  if (!table) return null;

  const candidates = table.filter(i => i.ilvl <= zoneLevel + 3);
  const base = candidates.length > 0 ? candidates[candidates.length - 1] : table[0];
  const rarity = forceRarity || rollRarity(zoneLevel);
  const rarityData = ITEM_RARITY[rarity];

  const slotLabel = (role.slotLabelOverrides && role.slotLabelOverrides[slot]) || (slot === 'weapon' ? role.weaponLabel : slot === 'armor' ? role.armorLabel : '');
  const item = { n: base.n, slot: slot, forCompanion: memberName, r: rarity, ilvl: base.ilvl, d: (slotLabel ? slotLabel + ' for ' : 'For ') + memberName + '.' };
  if (base.atk) item.atk = Math.floor(base.atk * rarityData.mult);
  if (base.def) item.def = Math.floor(base.def * rarityData.mult);
  if (base.spd) item.spd = Math.max(1, Math.floor(base.spd * rarityData.mult));
  if (base.hp) item.hp = Math.floor(base.hp * rarityData.mult);
  return item;
}

// Recomputes a companion's effective atk/def/spd/mhp from their immutable base stats plus
// whatever's currently in all 8 equipment slots. Called after every equip/unequip so combat
// code can keep reading member.atk/def/spd/mhp directly without ever double-counting gear.
function recalcPartyMember(member) {
  if (!member.base) member.base = { mhp: member.mhp, atk: member.atk, def: member.def, spd: member.spd };
  const bonus = { atk: 0, def: 0, spd: 0, hp: 0 };
  for (let slot in member.eq) {
    const it = member.eq[slot];
    if (!it) continue;
    if (it.atk) bonus.atk += it.atk;
    if (it.def) bonus.def += it.def;
    if (it.spd) bonus.spd += it.spd;
    if (it.hp) bonus.hp += it.hp;
  }
  member.atk = member.base.atk + bonus.atk;
  member.def = member.base.def + bonus.def;
  member.spd = member.base.spd + bonus.spd;
  member.mhp = Math.max(1, member.base.mhp + bonus.hp);
  member.hp = Math.min(member.hp, member.mhp);
  // Keep the legacy .gear field as a display-only aggregate for any older UI reading it
  member.gear = (bonus.atk || bonus.def || bonus.spd || bonus.hp) ? { n: 'Equipped Gear', atk: bonus.atk, def: bonus.def, spd: bonus.spd, hp: bonus.hp } : null;
}

function equipPartyGearSlot(memberName, slot, invIndex) {
  const member = G.party.find(p => p.n === memberName);
  if (!member) return;
  const item = G.p.inv[invIndex];
  if (!item || item.slot !== slot) return;
  if (item.forCompanion !== memberName) {
    lg('❌ ' + item.n + ' is not fitted for ' + memberName + '!');
    return;
  }
  const resolvedSlot = slot === 'ring' ? (member.eq.ring1 ? 'ring2' : 'ring1') : slot;
  if (member.eq[resolvedSlot]) {
    addI({ ...member.eq[resolvedSlot] });
    lg('📦 Unequipped ' + member.eq[resolvedSlot].n + ' from ' + member.n + '.');
  }
  member.eq[resolvedSlot] = { ...item };
  G.p.inv.splice(invIndex, 1);
  recalcPartyMember(member);
  lg('⚔️ Equipped ' + item.n + ' on ' + member.n + '!');
  render();
}

function unequipPartyGearSlot(memberName, slot) {
  const member = G.party.find(p => p.n === memberName);
  if (!member || !member.eq[slot]) return;
  const item = member.eq[slot];
  addI({ ...item });
  lg('📦 Unequipped ' + item.n + ' from ' + member.n + '.');
  member.eq[slot] = null;
  recalcPartyMember(member);
  render();
}


function addLootFromCombat(zoneName) {
  const zone = G.zones.find(z => z.n === zoneName);
  if (!zone) return;

  const slots = ['weapon', 'armor', 'head', 'hands', 'feet', 'ring', 'amulet'];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const item = generateItem(slot, zone.lv);

  if (item) {
    addI(item);
    lg('🎁 Loot: ' + item.n + ' (' + ITEM_RARITY[item.r].name + ')!');
  }

  // Companion gear: separate, smaller chance so it doesn't crowd out San's own drops
  const activeCompanions = G.party.filter(p => p.on);
  if (activeCompanions.length > 0 && Math.random() < 0.3) {
    const companion = activeCompanions[Math.floor(Math.random() * activeCompanions.length)];
    const companionRole = getCompanionRole(companion.n);
    const hidden = (companionRole && companionRole.hiddenSlots) || [];
    const cSlots = ['weapon', 'armor', 'head', 'hands', 'feet', 'ring', 'amulet'].filter(s => !hidden.includes(s));
    const cSlot = cSlots[Math.floor(Math.random() * cSlots.length)];
    const cItem = generateCompanionItem(companion.n, cSlot, zone.lv);
    if (cItem) {
      addI(cItem);
      lg('🎁 Loot for ' + companion.n + ': ' + cItem.n + ' (' + ITEM_RARITY[cItem.r].name + ')!');
    }
  }
}

// ============================================================



// === Spell slot helpers ===
function getSpellSlotKey(sk){
  const tier = Number(sk?.slotTier || 1);
  return 't' + Math.min(5, Math.max(1, tier));
}
function getSpellCostLabel(sk){
  const tier = Number(sk?.slotTier || 1);
  const cost = Math.max(1, Number(sk?.slotCost || 1));
  const ord = tier === 1 ? '1st'
             : tier === 2 ? '2nd'
             : tier === 3 ? '3rd'
             : tier + 'th';
  return ord + '-level spell slot x' + cost;
}
function canCastSkill(sk){
  if (!sk) return false;
  const key = getSpellSlotKey(sk);
  const cost = Math.max(1, Number(sk?.slotCost || 1));
  return Number(G.p.spellSlots?.[key] || 0) >= cost;
}
function spendSpellCost(sk){
  if (!sk) return false;
  const key = getSpellSlotKey(sk);
  const cost = Math.max(1, Number(sk?.slotCost || 1));
  if (Number(G.p.spellSlots?.[key] || 0) < cost) return false;
  G.p.spellSlots[key] -= cost;
  return true;
}

const DICE = {
  d(sides) { return Math.floor(Math.random() * sides) + 1; },
  
  roll(count, sides) {
    let sum = 0;
    for (let i = 0; i < count; i++) sum += this.d(sides);
    return sum;
  },
  
  parse(expr) {
    const match = expr.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/);
    if (!match) return { total: 0, rolls: [] };
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? (match[3] === '+' ? 1 : -1) * parseInt(match[4]) : 0;
    const rolls = [];
    for (let i = 0; i < count; i++) rolls.push(this.d(sides));
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    return { total, rolls, modifier, expr };
  },
  
  d20(type = 'normal') {
    if (type === 'advantage') {
      const r1 = this.d(20), r2 = this.d(20);
      return { 
        roll: Math.max(r1, r2), 
        rolls: [r1, r2], 
        type,
        nat20: r1 === 20 || r2 === 20,
        nat1: r1 === 1 && r2 === 1
      };
    }
    if (type === 'disadvantage') {
      const r1 = this.d(20), r2 = this.d(20);
      return { 
        roll: Math.min(r1, r2), 
        rolls: [r1, r2], 
        type,
        nat20: r1 === 20 && r2 === 20,
        nat1: r1 === 1 || r2 === 1
      };
    }
    const r = this.d(20);
    return { roll: r, rolls: [r], type, nat20: r === 20, nat1: r === 1 };
  },
  
  proficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2;
  },
  
  abilityMod(score) {
    return Math.floor((score - 10) / 2);
  },
  
  attackRoll({ attackerLevel = 1, abilityScore = 10, proficiency = false, bonus = 0, targetAC = 10, advantage = 'normal' }) {
    const d20Result = this.d20(advantage);
    const profBonus = proficiency ? this.proficiencyBonus(attackerLevel) : 0;
    const abilityBonus = this.abilityMod(abilityScore);
    const total = d20Result.roll + profBonus + abilityBonus + bonus;
    
    const isCrit = d20Result.nat20;
    const isFumble = d20Result.nat1 && !d20Result.nat20;
    
    let hit = false;
    if (isCrit) hit = true;
    else if (isFumble) hit = false;
    else hit = total >= targetAC;
    
    const margin = total - targetAC;
    
    return {
      d20: d20Result,
      profBonus,
      abilityBonus,
      bonus,
      total,
      targetAC,
      hit,
      isCrit,
      isFumble,
      margin,
      breakdown: `d20(${d20Result.roll}) + PROF(${profBonus}) + MOD(${abilityBonus >= 0 ? '+' : ''}${abilityBonus})${bonus ? ' + BONUS(' + bonus + ')' : ''} = ${total}`
    };
  },
  
  damageRoll({ diceExpr = '1d6', abilityScore = 10, isCrit = false, bonus = 0 }) {
    let parsed = this.parse(diceExpr);
    
    if (isCrit) {
      const match = diceExpr.match(/^(\d+)d(\d+)/);
      if (match) {
        const doubledExpr = diceExpr.replace(/^(\d+)/, m => parseInt(m) * 2);
        parsed = this.parse(doubledExpr);
      }
    }
    
    const abilityBonus = this.abilityMod(abilityScore);
    let total = parsed.total + abilityBonus + bonus;
    
    return {
      rolls: parsed.rolls,
      total: Math.max(0, total),
      isCrit,
      abilityBonus,
      bonus,
      breakdown: `${diceExpr}${isCrit ? ' (doubled)' : ''} = [${parsed.rolls.join(', ')}] + ${abilityBonus >= 0 ? '+' : ''}${abilityBonus}${bonus ? ' + ' + bonus : ''} = ${Math.max(0, total)}`
    };
  },
  
  savingThrow({ abilityScore = 10, proficiency = false, level = 1, bonus = 0, dc = 10, advantage = 'normal' }) {
    const d20Result = this.d20(advantage);
    const profBonus = proficiency ? this.proficiencyBonus(level) : 0;
    const abilityBonus = this.abilityMod(abilityScore);
    const total = d20Result.roll + profBonus + abilityBonus + bonus;
    
    const success = d20Result.nat20 || (!d20Result.nat1 && total >= dc);
    const margin = total - dc;
    
    return {
      d20: d20Result,
      profBonus,
      abilityBonus,
      total,
      dc,
      success,
      margin,
      breakdown: `d20(${d20Result.roll}) + PROF(${profBonus}) + MOD(${abilityBonus >= 0 ? '+' : ''}${abilityBonus}) = ${total} vs DC ${dc}`
    };
  },
  
  deathSave() {
    const roll = this.d(20);
    if (roll === 20) return { roll, result: 'revive', hp: 1, flavor: "⚡ A surge of will! You cling to life with 1 HP!" };
    if (roll === 1) return { roll, result: 'double_fail', failures: 2, flavor: "💀 The darkness deepens... two steps closer to oblivion." };
    if (roll >= 10) return { roll, result: 'success', flavor: `🩹 You hold on... (${roll})` };
    return { roll, result: 'fail', flavor: `🕳️ The void pulls... (${roll})` };
  }
};

window.DICE = DICE;

// ============================================================
// DYNAMIC ENEMY SCALING SYSTEM
// ============================================================

const ENEMY_TEMPLATES = {
  // Brute: High HP, low ATK
  brute:     { hpMult: 1.4, atkMult: 0.8, defMult: 1.2, xpMult: 1.0, gMult: 1.0 },
  // Striker: Low HP, high ATK  
  striker:   { hpMult: 0.8, atkMult: 1.4, defMult: 0.7, xpMult: 1.1, gMult: 1.1 },
  // Tank: High HP/DEF, low ATK
  tank:      { hpMult: 1.6, atkMult: 0.6, defMult: 1.4, xpMult: 1.0, gMult: 0.9 },
  // Balanced: Average everything
  balanced:  { hpMult: 1.0, atkMult: 1.0, defMult: 1.0, xpMult: 1.0, gMult: 1.0 },
  // Elite: Above average
  elite:     { hpMult: 1.3, atkMult: 1.2, defMult: 1.1, xpMult: 1.3, gMult: 1.3 },
};

function generateEnemyStats(zoneLevel, templateKey, elem) {
  const tpl = ENEMY_TEMPLATES[templateKey] || ENEMY_TEMPLATES.balanced;
  
  // Base scaling formula
  const base = {
    hp: 15 + (zoneLevel * 12),
    atk: 3 + (zoneLevel * 1.8),
    def: 1 + Math.floor(zoneLevel * 1.2),
    xp: 8 + (zoneLevel * 10),
    g: 2 + (zoneLevel * 6)
  };
  
  return {
    hp: Math.floor(base.hp * tpl.hpMult),
    mhp: Math.floor(base.hp * tpl.hpMult),
    atk: Math.floor(base.atk * tpl.atkMult),
    def: Math.floor(base.def * tpl.defMult),
    xp: Math.floor(base.xp * tpl.xpMult),
    g: Math.floor(base.g * tpl.gMult),
    elem: elem || 'none'
  };
}

// Enemy type registry for dynamic lookup
const ENEMY_REGISTRY = {
  // Lv 1-10 (existing - keep hardcoded for compatibility)
  'Goblin': null, 'Wolf': null, 'Slime': null,
  'Skeleton': null, 'Zombie': null, 'Ghost': null,
  'Fire Imp': null, 'Lava Slug': null, 'Ash Wraith': null,
  'Crystal Spider': null, 'Gem Golem': null, 'Shimmer Bat': null,
  'Storm Wraith': null, 'Lightning Hound': null, 'Thunder Knight': null,
  'Ice Elemental': null, 'Frost Wolf': null, 'Frozen Knight': null,
  'Void Beast': null, 'Shadow Demon': null, 'Abyssal Horror': null,
  'Drowned Sailor': null, 'Sea Serpent': null, 'Coral Golem': null,
  'Dragon Whelp': null, 'Ash Drake': null, 'Elder Wyrm': null,
  'Star Sentinel': null, 'Celestial Knight': null, 'Astral Lord': null,
  
  // Lv 11-20 (existing - keep hardcoded)
  'Planar Wisp': null, 'Rift Stalker': null, 'Aether Golem': null,
  'Chronomancer': null, 'Void Weaver': null, 'Planar Leviathan': null,
  'Veil Wraith': null, 'Shardling': null, 'Echo Walker': null,
  'Ember Drake': null, 'Ash Titan': null, 'Flame Serpent': null,
  'Frost Lich': null, 'Glacial Behemoth': null, 'Snow Revenant': null,
  'Storm Titan': null, 'Lightning Wraith': null, 'Thunderborn': null,
  'Void Leviathan': null, 'Null Elemental': null, 'Hungering Maw': null,
  'Time Echo': null, 'Chronomancer Lord': null, 'Paradox Wraith': null,
  'Aether Bloom': null, 'Mana Leviathan': null, 'Crystal Serpent': null,
  'Convergence Avatar': null, 'Planar Chimera': null, 'Resonance Horror': null,
  'Nexus Guardian': null, 'Planar Titan': null,
  
  // Lv 21+ (NEW - use dynamic scaling!)
  'Reality Weaver': { template: 'elite', elem: 'arcane', zoneLv: 21 },
  'Fracture Hound': { template: 'striker', elem: 'arcane', zoneLv: 21 },
  'Dimensional Drifter': { template: 'balanced', elem: 'void', zoneLv: 22 },
  'Chrono-Rat': { template: 'striker', elem: 'arcane', zoneLv: 22 },
  'Ember Wraith': { template: 'brute', elem: 'fire', zoneLv: 23 },
  'Ash Phantom': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Glacial Shade': { template: 'tank', elem: 'ice', zoneLv: 24 },
  'Frost Revenant': { template: 'balanced', elem: 'ice', zoneLv: 24 },
    // === PHASE 1: LV 22 NEW ENEMIES ===
  'Astral Construct': { template: 'elite', elem: 'arcane', zoneLv: 22 },
  'Void Hound': { template: 'striker', elem: 'void', zoneLv: 22 },
  'Phase Walker': { template: 'balanced', elem: 'arcane', zoneLv: 22 },
  'Rift Rat': { template: 'striker', elem: 'void', zoneLv: 22 },
      // === PHASE 1: LV 23 NEW ENEMIES (Lv 22 enemies already exist) ===
    'Ember Wraith': { template: 'brute', elem: 'fire', zoneLv: 23 },
  'Ash Phantom': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Flame Serpent': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Magma Titan': { template: 'tank', elem: 'fire', zoneLv: 23 },

  // === GAP FILLERS ===
  'Basilisk': { template: 'striker', elem: 'poison', zoneLv: 9 },
  'Venom Hound': { template: 'striker', elem: 'poison', zoneLv: 9 },
  'Mire Serpent': { template: 'balanced', elem: 'poison', zoneLv: 9 },
  'Fulcrum Warden': { template: 'tank', elem: 'arcane', zoneLv: 15 },
  'Stasis Construct': { template: 'balanced', elem: 'arcane', zoneLv: 15 },
  'Planar Mote': { template: 'striker', elem: 'arcane', zoneLv: 15 },

  // === PHASE 3: LV 24-29 ===
  'Magma Serpent': { template: 'striker', elem: 'fire', zoneLv: 24 },
  'Glass Wraith': { template: 'striker', elem: 'fire', zoneLv: 24 },
  'Scorch Titan': { template: 'tank', elem: 'fire', zoneLv: 24 },
  'Abyssal Leviathan Spawn': { template: 'brute', elem: 'ice', zoneLv: 25 },
  'Frozen Kraken': { template: 'elite', elem: 'ice', zoneLv: 25 },
  'Pressure Golem': { template: 'tank', elem: 'ice', zoneLv: 25 },
  'Storm Sovereign Remnant': { template: 'elite', elem: 'lightning', zoneLv: 26 },
  'Crown Wraith': { template: 'striker', elem: 'lightning', zoneLv: 26 },
  'Skyfall Construct': { template: 'balanced', elem: 'lightning', zoneLv: 26 },
  'Throne Keeper': { template: 'tank', elem: 'void', zoneLv: 27 },
  'Hollow Knight': { template: 'striker', elem: 'void', zoneLv: 27 },
  'Void Courtier': { template: 'balanced', elem: 'void', zoneLv: 27 },
  'Spire Archon': { template: 'elite', elem: 'arcane', zoneLv: 28 },
  'Reality Weaver Elite': { template: 'striker', elem: 'arcane', zoneLv: 28 },
  'Chrono Guardian': { template: 'tank', elem: 'arcane', zoneLv: 28 },
  'Apex Warden': { template: 'elite', elem: 'arcane', zoneLv: 29 },
  'Final Construct': { template: 'tank', elem: 'arcane', zoneLv: 29 },
  'The Gatekeeper': { template: 'elite', elem: 'arcane', zoneLv: 29 },

  // === ACT 1: THE SHATTERED NOW (LV 30-35) ===
  'Fracture Wisp': { template: 'striker', elem: 'void', zoneLv: 30 },
  'Splinter Hound': { template: 'striker', elem: 'void', zoneLv: 30 },
  'Collapse Warden': { template: 'tank', elem: 'void', zoneLv: 30 },
  'Ruin Stalker': { template: 'balanced', elem: 'none', zoneLv: 31 },
  'Ash Scavenger': { template: 'striker', elem: 'none', zoneLv: 31 },
  'Broken Sentinel': { template: 'tank', elem: 'none', zoneLv: 31 },
  'Market Looter': { template: 'striker', elem: 'fire', zoneLv: 32 },
  'Ash Peddler': { template: 'balanced', elem: 'fire', zoneLv: 32 },
  'Burnt Enforcer': { template: 'tank', elem: 'fire', zoneLv: 32 },
  'Ledger Wraith': { template: 'striker', elem: 'ice', zoneLv: 33 },
  'Sunken Auditor': { template: 'balanced', elem: 'ice', zoneLv: 33 },
  'Debt Collector': { template: 'tank', elem: 'ice', zoneLv: 33 },
  'Rust Automaton': { template: 'tank', elem: 'lightning', zoneLv: 34 },
  'Dockhand Wraith': { template: 'striker', elem: 'lightning', zoneLv: 34 },
  'Overtime Specter': { template: 'balanced', elem: 'lightning', zoneLv: 34 },
  'Watching Echo': { template: 'balanced', elem: 'arcane', zoneLv: 35 },
  'Silent Mourner': { template: 'striker', elem: 'arcane', zoneLv: 35 },
  'Grief Warden': { template: 'tank', elem: 'arcane', zoneLv: 35 },

  // === ACT 2: THE LONG SILENCE (LV 36-40) ===
  'Road Wraith': { template: 'striker', elem: 'none', zoneLv: 36 },
  'Pack Beast Husk': { template: 'tank', elem: 'none', zoneLv: 36 },
  'Toll Ghost': { template: 'balanced', elem: 'none', zoneLv: 36 },
  'Nursery Wraith': { template: 'balanced', elem: 'void', zoneLv: 37 },
  'Uncaught Echo': { template: 'striker', elem: 'void', zoneLv: 37 },
  'Quiet Sentinel': { template: 'tank', elem: 'void', zoneLv: 37 },
  'Burnt Recruit': { template: 'striker', elem: 'fire', zoneLv: 38 },
  'Barracks Wraith': { template: 'balanced', elem: 'fire', zoneLv: 38 },
  'Hollow Drillmaster': { template: 'tank', elem: 'fire', zoneLv: 38 },
  'Stormbound Wraith': { template: 'striker', elem: 'lightning', zoneLv: 39 },
  'Thunder Remnant': { template: 'balanced', elem: 'lightning', zoneLv: 39 },
  'Static Husk': { template: 'tank', elem: 'lightning', zoneLv: 39 },
  'Guttering Wisp': { template: 'striker', elem: 'fire', zoneLv: 40 },
  'Fading Ember': { template: 'balanced', elem: 'fire', zoneLv: 40 },
  'Forgotten Familiar': { template: 'tank', elem: 'fire', zoneLv: 40 },
};


function getDynamicEnemyStats(name) {
  const reg = ENEMY_REGISTRY[name];
  if (!reg) return null; // null = use hardcoded stats (existing enemies)
  const stats = generateEnemyStats(reg.zoneLv, reg.template, reg.elem);
  return { ...stats, n: name };
}

// ============================================================
// PLANAR RESONANCE SYSTEM (Phase 2)
// ============================================================

const PLANAR_ELEMENTS = ['fire', 'ice', 'lightning', 'void', 'arcane'];

function getZoneElement(zoneName) {
  const zone = G.zones.find(z => z.n === zoneName);
  return zone ? zone.elem : 'arcane';
}

function getGearElement() {
  const weapon = G.p.eq.weapon;
  if (!weapon) return 'arcane';
  if (weapon.fireDmg > 0) return 'fire';
  if (weapon.iceDmg > 0) return 'ice';
  if (weapon.lightDmg > 0 || weapon.lightningDmg > 0) return 'lightning';
  if (weapon.voidDmg > 0) return 'void';
  if (weapon.arcaneDmg > 0) return 'arcane';

  const armor = G.p.eq.armor;
  if (armor) {
    if (armor.fireRes > 0) return 'fire';
    if (armor.iceRes > 0) return 'ice';
    if (armor.lightRes > 0) return 'lightning';
    if (armor.voidRes > 0) return 'void';
    if (armor.arcaneRes > 0) return 'arcane';
  }
  return 'arcane';
}

function getResonanceMultiplier(zoneName) {
  const zoneElem = getZoneElement(zoneName);
  const gearElem = getGearElement();
  if (!zoneElem || zoneElem === 'none') return 1;
  if (gearElem === zoneElem) return 1.25 * getTalentMultiplier('resonance');
  if (gearElem !== zoneElem && PLANAR_ELEMENTS.includes(gearElem)) return 0.75 + (getTalentMultiplier('resonance') - 1);
  return 1;
}

function getResonanceStatus(zoneName) {
  const zoneElem = getZoneElement(zoneName);
  const gearElem = getGearElement();
  if (!zoneElem || zoneElem === 'none') return { status: 'neutral', text: 'No resonance', color: '#9ca3af', icon: '✦' };
  if (gearElem === zoneElem) return { status: 'matched', text: gearElem.toUpperCase() + ' RESONANCE (+25% DMG)', color: '#22c55e', icon: '⚡' };
  return { status: 'mismatched', text: gearElem.toUpperCase() + ' vs ' + zoneElem.toUpperCase() + ' (-25% DMG)', color: '#ef4444', icon: '⚠️' };
}


// === STAGE 3: ZONE-BASED TEMPORARY BUFFS ===
const ZONE_BUFFS = {
  'Ember Peak': { name: 'Fire Attunement', fireRes: 0.15, atk: 2, desc: 'The heat fuels your rage' },
  'Frostspire Ruins': { name: 'Ice Attunement', iceRes: 0.15, def: 2, desc: 'The cold hardens your resolve' },
  'Arcane Planar Tower': { name: 'Planar Attunement', arcaneDmg: 3, desc: 'Reality bends to your will' },
  'Stormhold': { name: 'Storm Attunement', lightRes: 0.15, spd: 1, desc: 'Lightning courses through you' },
  'Abyssal Depths': { name: 'Void Attunement', voidRes: 0.15, desc: 'You embrace the darkness' },
  "Dragon's Maw": { name: 'Dragon Scales', fireRes: 0.1, def: 1, desc: 'Ash settles on your skin like armor' }
};

function applyZoneBuffs(zoneName) {
  clearZoneBuffs();
  const buff = ZONE_BUFFS[zoneName];
  if(!buff) return;
  for(let p of G.party) {
    if(!p.on) continue;
    p.zoneBuff = { ...buff, zone: zoneName };
    if(buff.atk) p.atk += buff.atk;
    if(buff.def) p.def += buff.def;
    if(buff.spd) p.spd += buff.spd;
    const statBonuses = [];
    if(buff.atk) statBonuses.push('ATK+' + buff.atk);
    if(buff.def) statBonuses.push('DEF+' + buff.def);
    if(buff.spd) statBonuses.push('SPD+' + buff.spd);
    if(buff.arcaneDmg) statBonuses.push('Arcane+' + buff.arcaneDmg);
    if(buff.fireRes) statBonuses.push('FireRes+' + Math.floor(buff.fireRes*100) + '%');
    if(buff.iceRes) statBonuses.push('IceRes+' + Math.floor(buff.iceRes*100) + '%');
    if(buff.lightRes) statBonuses.push('LightRes+' + Math.floor(buff.lightRes*100) + '%');
    if(buff.voidRes) statBonuses.push('VoidRes+' + Math.floor(buff.voidRes*100) + '%');
    lg('🌟 ' + p.n + ' feels ' + buff.name + ': ' + statBonuses.join(' ') + ' — ' + buff.desc);
  }
}

function clearZoneBuffs() {
  for(let p of G.party) { 
    if(p.zoneBuff) {
      const buff = p.zoneBuff;
      if(buff.atk) p.atk -= buff.atk;
      if(buff.def) p.def -= buff.def;
      if(buff.spd) p.spd -= buff.spd;
      delete p.zoneBuff;
    }
  }
}

function applyPlanarResonance(damage, zoneName) {
  const mult = getResonanceMultiplier(zoneName);
  if (mult > 1) lg('🌌 PLANAR RESONANCE MATCHED! +' + Math.floor((mult - 1) * 100) + '% damage!');
  else if (mult < 1) lg('🌌 PLANAR RESONANCE MISMATCHED! -' + Math.floor((1 - mult) * 100) + '% damage...');
  return Math.floor(damage * mult);
}

const WEATHER = {
  'clear': { name: 'Clear Skies', desc: 'Normal conditions.', mods: {} },
  'rain': { name: 'Heavy Rain', desc: 'Lightning +20%, Fire -10%.', mods: { lightningDmg: 1.2, fireDmg: 0.9 } },
  'fog': { name: 'Thick Fog', desc: 'Accuracy reduced for all.', mods: { hitChance: 0.85 } },
  'scorching': { name: 'Scorching Heat', desc: 'Fire +15%. MP drains slowly.', mods: { fireDmg: 1.15, mpDrain: 2 } },
  'starfall': { name: 'Starfall', desc: 'Arcane +15%. Meteors may strike.', mods: { arcaneDmg: 1.15, meteorChance: 0.1 } }
};

function rollWeather() {
  const roll = Math.random();
  if (roll < 0.5) G.currentWeather = 'clear';
  else if (roll < 0.7) G.currentWeather = 'rain';
  else if (roll < 0.8) G.currentWeather = 'fog';
  else if (roll < 0.9) G.currentWeather = 'scorching';
  else G.currentWeather = 'starfall';
  
  const w = WEATHER[G.currentWeather];
  if (G.currentWeather !== 'clear') {
    lg('🌦️ Weather: ' + w.name + ' — ' + w.desc);
  }
}

function applyWeatherDamage(damage, elem) {
  if (!G.currentWeather || G.currentWeather === 'clear') return damage;
  const mods = WEATHER[G.currentWeather].mods;
  if (elem && mods[elem + 'Dmg']) {
    const newDmg = Math.floor(damage * mods[elem + 'Dmg']);
    if (mods[elem + 'Dmg'] > 1) lg('🌦️ Weather boost! +' + Math.floor((mods[elem + 'Dmg'] - 1) * 100) + '% ' + elem + ' damage');
    return newDmg;
  }
  return damage;
}

function applyWeatherCombat() {
  if (!G.currentWeather || G.currentWeather === 'clear') return;
  const mods = WEATHER[G.currentWeather].mods;
  
  if (mods.mpDrain && G.cbt.turn % 3 === 0) {
    G.p.mp = Math.max(0, G.p.mp - mods.mpDrain);
    lg('☀️ The heat drains ' + mods.mpDrain + ' MP!');
  }
  
  if (mods.meteorChance && Math.random() < mods.meteorChance) {
    const alive = G.cbt.en.filter(e => e.hp > 0);
    if (alive.length > 0) {
      const target = alive[Math.floor(Math.random() * alive.length)];
      const dmg = Math.floor(G.p.stats.int * 1.5);
      target.hp -= dmg;
      lg('☄️ A star falls, striking ' + target.n + ' for ' + dmg + '!');
      if (target.hp <= 0) { target.hp = 0; lg('💀 ' + target.n + ' is crushed!'); }
    }
  }
}

// ============================================================


// --- Backward compatibility ---
function rd(sides) { return DICE.d(sides); }
function rdc(count, sides) { return DICE.roll(count, sides); }
function r20() { return DICE.d20('normal').roll; }

function pd(ds, bonus) {
  if (!ds) return bonus || 0;
  const parsed = DICE.parse(ds);
  if (parsed.total === 0 && parsed.rolls.length === 0) return bonus || 0;
  return parsed.total + (bonus || 0);
}







// ============================================================
// STAGE 1: PARTY TRINKET SHOP
// ============================================================

const TRINKET_SHOP = [
  { n: 'Iron Shield',      atk: 0, def: 3, hp: 20, r: 'common',    price: 30 },
  { n: 'Lucky Charm',      atk: 1, def: 1, hp: 10, r: 'common',    price: 25 },
  { n: "Warrior's Band",   atk: 3, def: 0, hp: 15, r: 'uncommon',  price: 60 },
  { n: 'Guardian Pendant', atk: 0, def: 5, hp: 30, r: 'uncommon',  price: 80 },
  { n: 'Storm Crystal',    atk: 4, def: 2, hp: 10, r: 'rare',      price: 150 },
  { n: 'Phoenix Ember',    atk: 2, def: 2, hp: 50, r: 'rare',      price: 200 },
  { n: 'Void Shard',       atk: 6, def: 0, hp: 20, r: 'epic',      price: 400 },
  { n: 'Celestial Seal',   atk: 3, def: 4, hp: 40, r: 'epic',      price: 500 }
];

function buyTrinket(index) {
  const t = TRINKET_SHOP[index];
  if (!t) return;
  
  // Add haggle for trinkets too
  const aisyah = G.party.find(p => p.on && p.n === 'Aisyah' && p.hp > 0);
  const finalPrice = aisyah ? Math.floor(t.price * 0.9) : t.price;
  
  if (G.p.gold < finalPrice) { lg('Need ' + finalPrice + 'G'); return; }
  
  G.p.gold -= finalPrice;
  const item = {
    n: t.n, slot: 'amulet', q: 1, r: t.r,
    atk: t.atk || 0, def: t.def || 0, hp: t.hp || 0,
    d: '+' + (t.atk || 0) + ' ATK, +' + (t.def || 0) + ' DEF, +' + (t.hp || 0) + ' HP'
  };
  addI(item);
  lg('🎁 Bought ' + t.n + ' for ' + finalPrice + 'G!' + (aisyah ? ' (Aisyah haggled 10% off!)' : ''));
  render();
}

function initPartyGearBonus() {
  if (!G || !G.party) return;
  for (let p of G.party) {
    if (!p.gearBonus) p.gearBonus = { atk: 0, def: 0, hp: 0, mp: 0, spd: 0 };
  }
}

function checkAchievements() {
  let newUnlocks = 0;
  for (let ach of G.achievements) {
    if (ach.done) continue;
    if (ach.secret && !ach.revealed) continue;

    let earned = false;
    switch (ach.t) {
      case 'kills':
        if (G.p.kills >= ach.need) earned = true;
        break;
      case 'boss':
        if ((G.p.bossKills || 0) >= ach.need) earned = true;
        break;
      case 'boss_specific':
        if (G.bestiary[ach.target] && G.bestiary[ach.target].kills >= ach.need) earned = true;
        break;
      case 'level':
        if (G.p.lvl >= ach.need) earned = true;
        break;
      case 'quests':
        if (G.p.quests >= ach.need) earned = true;
        break;
      case 'affinity':
        if (G.affinity[ach.target] && G.affinity[ach.target].val >= ach.need) earned = true;
        break;
      case 'party':
        const unlockedCount = G.party.filter(p => p.on || p.hp > 0).length;
        if (unlockedCount >= ach.need) earned = true;
        break;
      case 'craft':
        if ((G.p.crafts || 0) >= ach.need) earned = true;
        break;
      case 'gold':
        if (G.p.gold >= ach.need) earned = true;
        break;
      case 'survivor':
        if (G.p.survivedCritical || false) earned = true;
        break;
      case 'focus':
        if (G.p.fstreak >= ach.need) earned = true;
        break;
    }

    if (earned) {
      ach.done = true;
      G.p.xp += ach.rw.xp;
      G.p.gold += ach.rw.g;
      lg('🏆 ACHIEVEMENT UNLOCKED: ' + ach.n + '! ' + ach.icon);
      if (ach.secret) {
        lg('   ' + ach.d);
        ach.revealed = true;
      }
      lvlup();
      newUnlocks++;
    }
  }
  return newUnlocks;
}

function revealSecretAchievements() {
  for (let ach of G.achievements) {
    if (ach.secret && !ach.revealed && !ach.done) {
      if (ach.t === 'affinity' && G.affinity[ach.target] && G.affinity[ach.target].val >= ach.need * 0.5) {
        ach.revealed = true;
        lg('🔓 Secret achievement hint unlocked...');
      }
      if (ach.t === 'boss_specific' && G.p.lvl >= 8) {
        ach.revealed = true;
        lg('🔓 Secret achievement hint unlocked...');
      }
    }
  }
}

function checkAffinityUnlocks(name) {
  const aff = G.affinity[name];
  const defs = G.affinityUnlocks[name];
  if (!aff || !defs) return;
  const member = G.party.find(p => p.n === name);
  if (!member) return;
  member.affinityBonuses = member.affinityBonuses || [];
  for (let u of defs) {
    if (aff.val >= u.th && !member.affinityBonuses.includes(u.id)) {
      member.affinityBonuses.push(u.id);
      applyAffinityUnlockFx(member, u);
      lg('🌟 Affinity ' + u.th + ': ' + name + ' unlocks "' + u.n + '" — ' + u.d + '!');
    }
  }
}

function hasAffinityUnlock(name, id) {
  const m = G.party.find(p => p.n === name);
  return !!(m && m.affinityBonuses && m.affinityBonuses.includes(id));
}

// With affinity uncapped, the bar shows progress toward the next unclaimed tier rather
// than a fixed max. Once every tier is claimed, it just shows full.
function getAffinityBarPct(name) {
  const aff = G.affinity[name];
  const defs = G.affinityUnlocks[name];
  if (!aff || !defs || defs.length === 0) return 0;
  const nextTier = defs.find(u => aff.val < u.th);
  if (!nextTier) return 100;
  const prevTier = [...defs].reverse().find(u => aff.val >= u.th);
  const prevTh = prevTier ? prevTier.th : 0;
  return Math.min(100, Math.max(0, ((aff.val - prevTh) / (nextTier.th - prevTh)) * 100));
}

// A growth ability is "ready" when: the player's level meets its threshold, the member
// is active and alive, and it hasn't already fired once since the last rest.
function isGrowthAbilityReady(name) {
  const def = G.growthAbilities[name];
  if (!def) return false;
  if (G.p.lvl < def.unlockAt) return false;
  const member = G.party.find(p => p.n === name);
  if (!member || !member.on || member.hp <= 0) return false;
  if (G.growthAbilityUsed[def.id]) return false;
  return true;
}

// Call the moment an ability actually fires. Marks it used-this-rest, and on the very
// first trigger ever, reveals its name/description to the log and unlocks it in the
// Party screen — before that, its existence is a complete surprise.
function triggerGrowthAbility(name) {
  const def = G.growthAbilities[name];
  if (!def) return;
  G.growthAbilityUsed[def.id] = true;
  if (!G.discoveredAbilities.includes(def.id)) {
    G.discoveredAbilities.push(def.id);
    lg('✨ HIDDEN ABILITY DISCOVERED: ' + name + ' — ' + def.n + '!');
    lg('   "' + def.d + '"');
  } else {
    lg('✨ ' + name + ' unleashes ' + def.n + '!');
  }
}

// Zaki's Nervous Courage isn't a one-shot resource like the others — it's a live
// condition (last one standing beside San) that can hold or lapse turn to turn, so it's
// checked fresh every time rather than gated by the once-per-rest growthAbilityUsed flag.
function checkZakiCourage() {
  const def = G.growthAbilities.Zaki;
  if (G.p.lvl < def.unlockAt) return false;
  const zaki = G.party.find(p => p.n === 'Zaki');
  if (!zaki || !zaki.on || zaki.hp <= 0) return false;
  if (G.p.hp <= 0) return false;
  const othersStanding = G.party.some(p => p.on && p.n !== 'Zaki' && p.hp > 0);
  if (othersStanding) return false;
  if (!G.discoveredAbilities.includes(def.id)) {
    G.discoveredAbilities.push(def.id);
    lg('✨ HIDDEN ABILITY DISCOVERED: Zaki — ' + def.n + '!');
    lg('   "' + def.d + '"');
  }
  return true;
}

function getAffinityUnlockBonus(type) {
  let bonus = 0;
  for (let m of G.party) {
    if (!m.affinityBonuses) continue;
    for (let id of m.affinityBonuses) {
      const def = (G.affinityUnlocks[m.n] || []).find(u => u.id === id);
      if (def && def.fx[type]) bonus += def.fx[type];
    }
  }
  return bonus;
}

function applyAffinityUnlockFx(member, u) {
  const fx = u.fx;
  if (!member.base) member.base = { mhp: member.mhp, atk: member.atk, def: member.def, spd: member.spd };
  if (fx.hpPct) { member.base.mhp += Math.floor(member.base.mhp * fx.hpPct); }
  if (fx.hp) { member.base.mhp += fx.hp; }
  if (fx.atk) member.base.atk += fx.atk;
  if (fx.def) member.base.def += fx.def;
  if (typeof recalcPartyMember === 'function') recalcPartyMember(member);
}

function updateAffinity(partyMemberName, amount) {
  if (!G.affinity[partyMemberName]) return;
  G.affinity[partyMemberName].val = Math.max(0, G.affinity[partyMemberName].val + amount);
  G.affinity[partyMemberName].lastInteract = Date.now();
  if (amount > 0) {
    lg('💕 Affinity with ' + partyMemberName + ' +' + amount + ' (' + G.affinity[partyMemberName].val + ')');
  }
  checkAffinityUnlocks(partyMemberName);
  checkAchievements();
  revealSecretAchievements();
  checkAffinityDecay();
}

function checkAffinityDecay() {
  const now = Date.now();
  for (let name in G.affinity) {
    const aff = G.affinity[name];
    const hoursSince = (now - aff.lastInteract) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      const decay = Math.floor(hoursSince / 24) * aff.decayRate * 10;
      aff.val = Math.max(0, aff.val - decay);
      if (decay > 0) {
        lg('💔 ' + name + ' feels neglected. Affinity -' + Math.floor(decay) + ' (' + aff.val + ')');
      }
      aff.lastInteract = now;
    }
  }
}

function getAffinityColor(val) {
  if (val >= 70) return 'affinity-high';
  if (val >= 40) return 'affinity-mid';
  return 'affinity-low';
}

function updateTimedQuests() {
  for (let q of G.quests) {
    if (q.timed && !q.done && !q.expired && q.timer > 0) {
      q.timer--;
      if (q.timer <= 0) {
        q.expired = true;
        lg('⏰ Quest expired: ' + q.n + '!');
      }
    }
  }
}

function getTimerStatus(q) {
  if (!q.timed || q.done || q.expired) return null;
  const pct = (q.timer / q.timerMax) * 100;
  if (q.timer <= 0) return { cls: 'timer-expired', label: 'EXPIRED', pct: 0 };
  if (pct < 25) return { cls: 'timer-urgent', label: q.timer + ' ticks left', pct: pct };
  return { cls: 'timer-ok', label: q.timer + ' ticks left', pct: pct };
}

function triggerSoelCommentary(triggerType) {
  if (!G.party[6].on) return;
  if (G.soelCommentCooldown > 0) { G.soelCommentCooldown--; return; }
  if (Math.random() > 0.35) return;
  const relevant = G.soelCommentary.filter(c => c.trigger === triggerType);
  if (relevant.length === 0) return;
  const comment = relevant[Math.floor(Math.random() * relevant.length)];
  G.lastSoelComment = comment;
  G.soelCommentCooldown = 3;
  lg('🐱 Soel: ' + comment.text);
}

 function checkSoelFortune() {
  const soel = G.party.find(p => p.on && p.n === 'Soel');
  if (!soel || soel.hp <= 0) return;
  if (!G.soelFortuneCooldown) G.soelFortuneCooldown = 0;
  G.soelFortuneCooldown++;
  if (G.soelFortuneCooldown < 3) return;
  G.soelFortuneCooldown = 0;
  if (Math.random() > 0.25) return;
  
  const finds = [
    { type: 'g', amount: 15 + Math.floor(Math.random() * 25), msg: 'Soel paws at a loose stone. ' },
    { type: 'mat', item: 'Astral Dust', q: 1, msg: 'Soel bats at a shimmering dust mote. Astral Dust!' },
    { type: 'mat', item: 'Void Fragment', q: 1, msg: 'Soel hisses at a tear in reality. A Void Fragment falls out!' },
    { type: 'mat', item: 'Planar Essence', q: 1, msg: 'Soel chases an invisible spark. It solidifies into Planar Essence!' },
    { type: 'mat', item: 'Ember Shard', q: 1, msg: 'Soel recoils from a warm pebble. It\'s an Ember Shard!' }
  ];
  const find = finds[Math.floor(Math.random() * finds.length)];
  
  if (find.type === 'g') {
    G.p.gold += find.amount;
    lg('🐱 ' + find.msg + find.amount + 'G found!');
  } else {
    addI({ n: find.item, t: 'mat', q: find.q, r: 'common' });
    lg('🐱 ' + find.msg);
  }
}

function checkNPCUnlocks() {
  for (let npc of G.npcs) {
    if (npc.t === 'trader' && !npc.unlocked && G.p.lvl >= npc.zoneLv) {
      npc.unlocked = true;
      lg('🧳 New trader unlocked: ' + npc.n + ' at ' + npc.zone + '!');
    }
    if (npc.t === 'ally' && !npc.unlocked && npc.reqMember) {
      if (G.affinity[npc.reqMember] && G.affinity[npc.reqMember].val >= npc.affinityReq) {
        npc.unlocked = true;
        lg('🌟 ' + npc.n + ' ' + npc.title + ' has joined as an ally!');
      }
    }
  }
}

function buyFromNPC(npcName, itemIdx) {
  const npc = G.npcs.find(n => n.n === npcName);
  if (!npc || !npc.unlocked || npc.t !== 'trader') return;
  
  const item = npc.stock[itemIdx];
  if (!item) return;
  
  // === AISYAH'S HAGGLE ===
  const aisyah = G.party.find(p => p.on && p.n === 'Aisyah' && p.hp > 0);
  const finalPrice = aisyah ? Math.floor(item.price * 0.9) : item.price;
  
  if (G.p.gold < finalPrice) {
    lg('❌ Not enough gold! ' + item.n + ' costs ' + finalPrice + 'G.');
    return;
  }
  
  G.p.gold -= finalPrice;

  // Equip items now carry .slot directly; only pot/food/drink/revive/mat still use .t
  const boughtItem = { 
    n: item.n, 
    t: item.t, 
    slot: item.slot || undefined,
    forCompanion: item.forCompanion || undefined,
    q: item.q || 1, 
    r: item.r,
    ilvl: item.ilvl || 1,
    d: item.d || 'A purchased item.'
  };
  // Copy all stat properties
  const statProps = ['atk', 'def', 'spd', 'hp', 'str', 'dex', 'con', 'int', 'wis', 'cha', 
                     'fireDmg', 'iceDmg', 'lightDmg', 'voidDmg',
                     'fireRes', 'iceRes', 'lightRes', 'voidRes',
                     'lifeSteal', 'critChance', 'mpRegen', 'hpRegen', 'goldFind'];
  for (let prop of statProps) {
    if (item[prop] !== undefined) boughtItem[prop] = item[prop];
  }
  // Copy effect properties for consumables (food/drink/pot)
  if (item.eff !== undefined) boughtItem.eff = item.eff;
  if (item.v !== undefined) boughtItem.v = item.v;
  addI(boughtItem);
  npc.visitCount++;
  lg('🧳 Bought ' + item.n + ' from ' + npc.n + ' for ' + finalPrice + 'G!' + (aisyah ? ' (Aisyah haggled 10% off!)' : ''));

  if (npc.visitCount === 1) {
    lg('   ' + npc.n + ': "Pleasure doing business, mage."');
  }
  render();
}

function sellToAmad(invIndex) {
  const npc = G.npcs.find(n => n.n === 'Amad');
  if (!npc || !npc.unlocked || npc.t !== 'trader') return;
  const item = G.p.inv[invIndex];
  if (!item) return;

  // Calculate sell value: 50% of item value, or base price for materials
  let sellPrice = 0;
  if (item.value) {
    sellPrice = Math.floor(item.value * 0.5);
  } else if (item.t === 'mat') {
    sellPrice = Math.floor((item.ilvl || 1) * 3 + 2);
  } else if (item.t === 'pot' || item.t === 'food' || item.t === 'drink') {
    sellPrice = Math.floor((item.v || 10) * 0.3);
  } else {
    sellPrice = Math.floor((item.ilvl || 1) * 4);
  }
  sellPrice = Math.max(1, sellPrice);

  G.p.gold += sellPrice;
  G.p.inv.splice(invIndex, 1);

  const flavorLines = [
    'Amad inspects the ' + item.n + '. "Ah, this has seen some adventure. I will take it."',
    '"Hmm, a bit worn, but I know a collector who wants this," says Amad.',
    'Amad weighs the ' + item.n + ' in his hand. "Fair trade, friend."',
    '"My cousin in Gadong would pay good money for this," Amad grins.',
    'Amad tucks the ' + item.n + ' under his counter. "Terima kasih!"'
  ];
  const flavor = flavorLines[Math.floor(Math.random() * flavorLines.length)];

  lg('💰 Sold ' + item.n + ' to Amad for ' + sellPrice + 'G!');
  lg('   ' + flavor);
  render();
}

// ============================================================
// GAME TIME & DAILY SYSTEM
// ============================================================

function getRealDay() {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
}

function checkDayAdvance() {
  const realToday = getRealDay();
  
  // First time ever playing
  if (G.lastRealDay === 0) {
    G.lastRealDay = realToday;
    G.gameDay = 1;
    G.lastLoginDay = 1;
    G.loginStreak = 1;
    G.loginClaimed = false;
    generateDailyQuests();
    G.manaSpringUses.day = G.gameDay;
    G.manaSpringUses.count = 0;
    saveGame();
    return;
  }
  
  // Same real day — no advance
  if (realToday === G.lastRealDay) return;
  
  // New real day detected — advance game day
  const daysPassed = realToday - G.lastRealDay;
  G.lastRealDay = realToday;
  G.gameDay += daysPassed;
  
  // Handle streak
  if (daysPassed === 1) {
    // Consecutive day
    G.loginStreak = (G.loginStreak || 0) + 1;
    lg('📅 New day! Login streak: ' + G.loginStreak);
  } else {
    // Missed one or more days
    G.loginStreak = 1;
    lg('📅 New day! Streak reset (missed ' + (daysPassed - 1) + ' day' + (daysPassed > 2 ? 's' : '') + ').');
  }
  
  G.lastLoginDay = G.gameDay;
  G.loginClaimed = false;
  generateDailyQuests();
  saveGame();
}

function claimDailyLoginReward() {
  if (G.loginClaimed) {
    lg('🎁 Already claimed today! Come back tomorrow.');
    return;
  }
  
  const streak = G.loginStreak || 1;
  const rewards = [
    { day: 1, g: 50, xp: 25 },
    { day: 2, mp: 30, xp: 35 },
    { day: 3, hp: 50, xp: 45 },
    { day: 4, g: 100, xp: 60 },
    { day: 5, g: 150, xp: 80 },
    { day: 6, mp: 50, xp: 100 },
    { day: 7, g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];
  
  const reward = rewards[Math.min(streak - 1, 6)];
  
  if (reward.g) G.p.gold += reward.g;
  if (reward.xp) G.p.xp += reward.xp;
  if (reward.hp) G.p.hp = Math.min(G.p.mhp, G.p.hp + reward.hp);
  if (reward.mp) G.p.mp = Math.min(G.p.mmp, G.p.mp + reward.mp);
  if (reward.item) addI({ ...reward.item });
  
  G.loginClaimed = true;
  saveGame();
  
  const rewardMsg = [];
  if (reward.g) rewardMsg.push('+' + reward.g + 'G');
  if (reward.xp) rewardMsg.push('+' + reward.xp + 'XP');
  if (reward.hp) rewardMsg.push('+' + reward.hp + 'HP');
  if (reward.mp) rewardMsg.push('+' + reward.mp + 'MP');
  if (reward.item) rewardMsg.push(reward.item.n);
  
  lg('🎁 Day ' + streak + ' reward claimed! ' + rewardMsg.join(', '));
  lvlup();
  render();
}

function generateDailyQuests() {
  // Only regenerate if it's a new game day
  if (G.dailyQuestSeed === G.gameDay && G.dailyQuests && G.dailyQuests.length > 0) {
    return; // Already have quests for today
  }
  
  G.dailyQuestSeed = G.gameDay;
  G.dailyQuests = [];
  const pool = [...DAILY_QUESTS];
  
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const template = pool.splice(idx, 1)[0];
    G.dailyQuests.push({
      id: template.id, n: template.n, d: template.d, t: template.t,
      c: 0, need: template.need, rw: template.rw, done: false
    });
  }
  lg('📋 New daily quests available for Day ' + G.gameDay + '!');
}

function checkDailyQuests(type, amount) {
  amount = amount || 1;
  if (!G.dailyQuests || G.dailyQuests.length === 0) return;
  for (let q of G.dailyQuests) {
    if (q.done) continue;
    if (q.t === type || (type === 'kill_specific' && q.t === 'kill')) {
      q.c += amount;
      if (q.c >= q.need) {
        q.done = true;
        G.p.xp += q.rw.xp;
        G.p.gold += q.rw.g;
        lg('📋 Daily quest complete: ' + q.n + '! +' + q.rw.xp + 'XP +' + q.rw.g + 'G');
        lvlup();
      }
    }
  }
  saveGame();
}

function refreshBounties() {
  refreshStrongholdTasks();
  const today = G.gameDay;
  let refreshed = false;

  const eligible = G.bounties.filter(b => {
    if (!b.done || b.refreshDay === today) return false;
    const minLv = b.minLv || 1;
    const maxLv = b.maxLv || 99;
    return G.p.lvl >= minLv && G.p.lvl <= maxLv;
  }).sort((a, b) => Math.abs((a.minLv || 1) - G.p.lvl) - Math.abs((b.minLv || 1) - G.p.lvl));

  if (eligible.length === 0) {
    const fallback = G.bounties.filter(b => {
      if (!b.done || b.refreshDay === today) return false;
      return (b.minLv || 1) <= G.p.lvl;
    }).sort((a, b) => (b.minLv || 1) - (a.minLv || 1));
    
    const toRefresh = fallback.slice(0, 3);
    for (let b of toRefresh) {
      b.done = false;
      b.c = 0;
      b.refreshDay = today;
      refreshed = true;
    }
  } else {
    const toRefresh = eligible.slice(0, 3);
    for (let b of toRefresh) {
      b.done = false;
      b.c = 0;
      b.refreshDay = today;
      refreshed = true;
    }
  }

  if (refreshed) {
    lg('📋 New bounties available for Day ' + today + '!');
  }
}


function checkJournalLevelUnlocks() {
  for (let entry of G.storyJournal.entries) {
    if (entry.unlockType === 'level' && G.p.lvl >= entry.unlockAt && !G.storyJournal.unlocked.includes(entry.id)) {
      G.storyJournal.unlocked.push(entry.id);
      lg('📖 Journal unlocked: ' + entry.title + '!');
    }
  }
}

function checkStoryline() {
  for (let s of G.storyline) {
    if (s.done) continue;
    if (!s.unlocked) {
      // Check if previous chapter is done
      const prev = G.storyline.find(ch => ch.chapter === s.chapter - 1);
      if (!prev || prev.done) {
        s.unlocked = true;
        lg('📖 Storyline unlocked: Chapter ' + s.chapter + ' - ' + s.n + '!');
      }
    }
    if (s.unlocked && G.p.lvl >= s.need) {
      s.c = s.need;
      s.done = true;
      G.p.xp += s.rw.xp;
      G.p.gold += s.rw.g;
      G.p.quests++;
      lg('📖 Storyline complete: ' + s.n + '! +' + s.rw.xp + 'XP +' + s.rw.g + 'G');
      lvlup();
    }
  }
}

function checkBountyKill(enemyName) {
  for (let b of G.bounties) {
    if (b.done) continue;
    if (b.t === 'kill_specific' && enemyName === b.target) {
      b.c++;
      if (b.c >= b.need) {
        b.done = true;
        b.refreshDay = G.gameDay;
        G.p.xp += b.rw.xp;
        G.p.gold += b.rw.g;
        G.p.quests++;
        lg('💰 Bounty complete: ' + b.n + '! +' + b.rw.xp + 'XP +' + b.rw.g + 'G');
        lvlup();
      }
    }
  }
  for (let t of G.strongholdTasks) {
    if (t.done) continue;
    if (t.t === 'kill_specific' && enemyName === t.target) {
      t.c++;
      if (t.c >= t.need) {
        t.done = true;
        t.refreshDay = G.gameDay;
        G.p.xp += t.rw.xp;
        G.p.gold += t.rw.g;
        lg('🏰 Stronghold task complete: ' + t.n + '! +' + t.rw.xp + 'XP +' + t.rw.g + 'G');
        lvlup();
      }
    }
  }
}

function getWeaknessMultiplier(spellElem, enemyElem) {
  if (!spellElem || !enemyElem || enemyElem === 'none') return 1;
  // Fire beats Ice, Ice beats Fire
  const elemMult = getTalentMultiplier('elemWeak');
  if (spellElem === 'fire' && enemyElem === 'ice') return 1.5 * elemMult;
  if (spellElem === 'ice' && enemyElem === 'fire') return 1.5 * elemMult;
  // Lightning beats Void
  if (spellElem === 'lightning' && enemyElem === 'void') return 1.5;
  // Arcane beats Void
  if (spellElem === 'arcane' && enemyElem === 'void') return 1.3;
  // Arcane is strong vs arcane (unstable planar energy)
  if (spellElem === 'arcane' && enemyElem === 'arcane') return 1.4;
  // Void consumes arcane
  if (spellElem === 'void' && enemyElem === 'arcane') return 1.3;
  // Same element = reduced damage
  if (spellElem === enemyElem) return 0.5;
  return 1;
}


function getActiveSynergies() {
  const active = G.party.filter(p => p.on && p.hp > 0).map(p => p.n);
  active.push('San');
  const synergies = [];
  for (let syn of G.partySynergies) {
    const allPresent = syn.members.every(m => active.includes(m));
    if (allPresent) synergies.push(syn);
  }
  return synergies;
}

function getSynergyBonus(type) {
  const synergies = getActiveSynergies();
  let bonus = 0;
  for (let syn of synergies) {
    if (syn.bonus[type]) bonus += syn.bonus[type];
  }
  return bonus;
}

function getSynergyDesc() {
  const synergies = getActiveSynergies();
  if (synergies.length === 0) return null;
  return synergies.map(s => s.icon + ' ' + s.name).join(' · ');
}

function applySynergyDamage(dmg, type) {
  const spellBonus = getSynergyBonus('spellDmgPct') + getAffinityUnlockBonus('spellDmgPct');
  if (type === 'spell' && spellBonus > 0) {
    dmg = Math.floor(dmg * (1 + spellBonus));
  }
  return dmg;
}

function applySynergyDefense(dmg) {
  const dmgRed = getSynergyBonus('dmgRed');
  if (dmgRed > 0) {
    dmg = Math.floor(dmg * (1 - dmgRed));
  }
  return Math.max(1, dmg);
}

function getSynergyCritBonus() {
  return getSynergyBonus('critPct') + getAffinityUnlockBonus('critPct');
}

function getSynergyGoldBonus() {
  return getSynergyBonus('goldPct') + getAffinityUnlockBonus('goldPct');
}

function getSynergyHealBonus() {
  return getSynergyBonus('healPct') + getAffinityUnlockBonus('healPct');
}

function getTotalCritChance() {
  // Base 5% + 2% per DEX point + proficiency scaling + synergy bonuses
  const baseCrit = 0.05;
  const dexBonus = G.p.stats.dex * 0.02;
  const profBonus = DICE.proficiencyBonus(G.p.lvl) * 0.01; // +1% per proficiency point
  const synergyBonus = getSynergyCritBonus();
  return Math.min(0.75, baseCrit + dexBonus + profBonus + synergyBonus);
}

function isImmune(enemyName, spellElem) {
  if (!spellElem) return false;
  const fireMobs = ['Fire Imp', 'Lava Slug', 'Ash Wraith'];
  const iceMobs = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'];
  if (spellElem === 'fire' && fireMobs.includes(enemyName)) return true;
  if (spellElem === 'ice' && iceMobs.includes(enemyName)) return true;
  return false;
}



/* ========== THEME SYSTEM ========== */
const DAILY_QUESTS = [
  { id: 'dq1', n: 'Arcane Practice', d: 'Cast 5 spells in combat', t: 'cast_spells', need: 5, rw: { xp: 40, g: 20 } },
  { id: 'dq2', n: 'Monster Hunter', d: 'Defeat 3 monsters', t: 'kill', need: 3, rw: { xp: 35, g: 15 } },
  { id: 'dq3', n: 'Potion Brewer', d: 'Craft 2 potions', t: 'craft', need: 2, rw: { xp: 30, g: 15 } },
  { id: 'dq4', n: 'Explorer', d: 'Explore 2 different zones', t: 'explore', need: 2, rw: { xp: 45, g: 25 } },
  { id: 'dq5', n: 'Rest & Recover', d: 'Rest once at any campsite', t: 'rest', need: 1, rw: { xp: 25, g: 10 } },
  { id: 'dq6', n: 'Gold Hoarder', d: 'Earn 50 gold from any source', t: 'earn_gold', need: 50, rw: { xp: 50, g: 30 } },
  { id: 'dq7', n: 'Skill Master', d: 'Use focus mode once', t: 'focus', need: 1, rw: { xp: 60, g: 35 } },
  { id: 'dq8', n: 'Party Bond', d: 'Win a battle with a full party', t: 'full_party_battle', need: 1, rw: { xp: 40, g: 20 } }
];

const THEME_KEY = 'ldb_theme';

// === GRIND ROOM CHAMPIONSHIP TIERS ===
// Ranks unlock permanently based on the highest wave ever reached in the Grind Room (best-of, across all sessions).
// Each tier grants a one-time reward AND a permanent stacking gold/XP bonus applied to all future grind waves.
const GRIND_TIERS = [
  { id: 'bronze',    name: 'Bronze League',     waveReq: 10,  icon: '🥉', rw: { gold: 200,  xp: 150  }, bonusPct: 0.02 },
  { id: 'silver',    name: 'Silver League',     waveReq: 25,  icon: '🥈', rw: { gold: 500,  xp: 400  }, bonusPct: 0.04 },
  { id: 'gold',      name: 'Gold League',       waveReq: 50,  icon: '🥇', rw: { gold: 1200, xp: 900  }, bonusPct: 0.06 },
  { id: 'platinum',  name: 'Platinum League',   waveReq: 75,  icon: '🏆', rw: { gold: 2200, xp: 1600 }, bonusPct: 0.08 },
  { id: 'diamond',   name: 'Diamond League',    waveReq: 100, icon: '💎', rw: { gold: 4000, xp: 3000 }, bonusPct: 0.10 },
  { id: 'master',    name: 'Master League',     waveReq: 130, icon: '🔱', rw: { gold: 6500, xp: 4800 }, bonusPct: 0.12 },
  { id: 'grandmaster', name: 'Grandmaster League', waveReq: 160, icon: '⚔️', rw: { gold: 9500, xp: 7000 }, bonusPct: 0.14 },
  { id: 'champion',  name: 'Champion League',   waveReq: 200, icon: '👑', rw: { gold: 15000, xp: 12000 }, bonusPct: 0.18 }
];

// === RAID MODE ===
// Sequential boss gauntlets. Bosses keep their full HP pool each stage; only a partial
// heal/mana restore happens between fights (not a full rest) — the party's own kit is
// what carries them through, not attrition-proof grinding.
// === STRONGHOLDS ===
// Some quest chains promise claiming a location (e.g. "Defeat The Planarch and claim
// the Arcane Planar Tower") — this makes that promise mechanical, not just flavor text.
// Claiming permanently unlocks and frees the location's rest sites, grants a daily
// stipend for resting there, and unlocks a small set of stronghold-only tasks —
// distinct from the regular bounty rotation, always available once claimed.
const STRONGHOLDS = {
  arcaneTower: {
    name: 'Arcane Planar Tower',
    icon: '🗼',
    restSiteIds: ['apt_camp', 'apt_tavern'],
    desc: 'The tower answers to you now. Its camp and tavern are yours — free, and always open — whenever you need them.',
    stipend: { xp: 40, gold: 60 },
    tasks: [
      { id: 'st_tower_upkeep', n: 'Tower Upkeep', d: "Defeat 3 Planar Wisps to keep the tower's wards charged", t: 'kill_specific', target: 'Planar Wisp', c: 0, need: 3, rw: { xp: 90, g: 70 }, done: false, refreshDay: -1 },
      { id: 'st_tower_rift_ward', n: 'Rift Ward', d: "Defeat 2 Rift Stalkers threatening the tower's seal", t: 'kill_specific', target: 'Rift Stalker', c: 0, need: 2, rw: { xp: 110, g: 85 }, done: false, refreshDay: -1 }
    ]
  }
};

function claimStronghold(id) {
  const def = STRONGHOLDS[id];
  if (!def) return;
  const alreadyClaimed = G.strongholds[id];
  G.strongholds[id] = true;
  for (let siteId of def.restSiteIds) {
    const site = G.rest.sites.find(s => s.id === siteId);
    if (site) {
      site.unlocked = true;
      site.cost = 0;
      site.stronghold = true;
    }
  }
  if (def.tasks) {
    for (let task of def.tasks) {
      if (!G.strongholdTasks.find(t => t.id === task.id)) {
        G.strongholdTasks.push({ ...task, strongholdId: id });
      }
    }
  }
  if (!alreadyClaimed) {
    lg('🏰 STRONGHOLD CLAIMED: ' + def.icon + ' ' + def.name + '!');
    lg('   ' + def.desc);
  }
}

// Stronghold tasks refresh daily, unconditionally — unlike bounties they don't rotate
// by level, since there are only ever a couple per stronghold and all stay relevant.
function refreshStrongholdTasks() {
  const today = G.gameDay;
  for (let task of G.strongholdTasks) {
    if (task.done && task.refreshDay !== today) {
      task.done = false;
      task.c = 0;
      task.refreshDay = today;
    }
  }
}

const RAID_STAGE_RECOVERY_PCT = 0.20;

const RAIDS = [
  { id: 'trial_of_fangs', name: 'Trial of Fangs', unlockLevel: 15, icon: '🐺',
    stages: [
      { type: 'elite', zoneLv: 8, enemies: ['Void Beast', 'Shadow Demon'] },
      { type: 'boss', name: 'Goblin King' },
      { type: 'elite', zoneLv: 10, enemies: ['Star Sentinel', 'Celestial Knight'] },
      { type: 'boss', name: 'Bone Tyrant' },
      { type: 'elite', zoneLv: 12, enemies: ['Planar Wisp', 'Rift Stalker'] },
      { type: 'boss', name: 'Crystal Leviathan' }
    ],
    rw: { xp: 1400, gold: 1100 },
    desc: 'Three early tyrants, guarded by elite packs between each fight. No longer a first test — a real gauntlet.' },
  { id: 'elemental_gauntlet', name: 'The Elemental Gauntlet', unlockLevel: 22, icon: '🌪️',
    stages: [
      { type: 'elite', zoneLv: 18, enemies: ['Aether Bloom', 'Mana Leviathan'] },
      { type: 'boss', name: 'Ember Dragon' },
      { type: 'elite', zoneLv: 19, enemies: ['Convergence Avatar', 'Planar Chimera'] },
      { type: 'boss', name: 'Storm Tyrant' },
      { type: 'elite', zoneLv: 20, enemies: ['Nexus Guardian', 'Planar Titan'] },
      { type: 'boss', name: 'Frost Queen' },
      { type: 'elite', zoneLv: 21, enemies: ['Veil Wraith', 'Shardling'] },
      { type: 'boss', name: 'Abyssal Leviathan' }
    ],
    rw: { xp: 3400, gold: 2600 },
    desc: 'Fire, storm, frost, and depth — four elements, four trials, elite packs guarding every threshold between them.' },
  { id: 'dragons_reckoning', name: "Dragon's Reckoning", unlockLevel: 28, icon: '🐲',
    stages: [
      { type: 'elite', zoneLv: 23, enemies: ['Ember Wraith', 'Ash Phantom'] },
      { type: 'boss', name: 'Elder Dragon' },
      { type: 'elite', zoneLv: 25, enemies: ['Frozen Kraken', 'Pressure Golem'] },
      { type: 'boss', name: 'Starlord' },
      { type: 'elite', zoneLv: 27, enemies: ['Throne Keeper', 'Hollow Knight'] },
      { type: 'boss', name: 'The Planarch' }
    ],
    rw: { xp: 5800, gold: 4500 },
    desc: "The Elder Dragon's threat, the Astral Lord's judgment, and the Planarch's truth — three of the hardest lessons the old world taught you, with elite guardians standing between each." },
  { id: 'planar_convergence', name: 'The Planar Convergence', unlockLevel: 32, icon: '🌌',
    stages: [
      { type: 'elite', zoneLv: 28, enemies: ['Spire Archon', 'Reality Weaver Elite'] },
      { type: 'boss', name: 'The Nexus Planarch' },
      { type: 'elite', zoneLv: 29, enemies: ['Apex Warden', 'Final Construct'] },
      { type: 'boss', name: 'The Veilshaper' },
      { type: 'elite', zoneLv: 30, enemies: ['Fracture Wisp', 'Collapse Warden'] },
      { type: 'boss', name: 'The Astral Devourer' },
      { type: 'elite', zoneLv: 31, enemies: ['Ruin Stalker', 'Broken Sentinel'] },
      { type: 'boss', name: 'The Infernal Tyrant' }
    ],
    rw: { xp: 9800, gold: 7600 },
    desc: 'The dimensional guardians that led to the Breaking, faced together for the first time — with the elite remnants of that collapse guarding every step between them.' },
  { id: 'fractured_passage', name: 'The Fractured Passage', unlockLevel: 36, icon: '🌀',
    stages: [
      { type: 'elite', zoneLv: 32, enemies: ['Market Looter', 'Burnt Enforcer'] },
      { type: 'boss', name: 'The Apex Arbiter' },
      { type: 'elite', zoneLv: 33, enemies: ['Ledger Wraith', 'Debt Collector'] },
      { type: 'boss', name: 'The Fracture' },
      { type: 'elite', zoneLv: 34, enemies: ['Rust Automaton', 'Dockhand Wraith'] },
      { type: 'boss', name: 'The Last Guard' }
    ],
    rw: { xp: 14000, gold: 11000 },
    desc: 'The last guardian of the old world, then the wound that broke it, then the first thing you meet on the other side — the crossing itself, as a gauntlet, guarded the whole way.' },
  { id: 'shattered_now_raid', name: 'The Shattered Now', unlockLevel: 40, icon: '🕯️',
    stages: [
      { type: 'elite', zoneLv: 35, enemies: ['Watching Echo', 'Silent Mourner'] },
      { type: 'boss', name: 'Scavenger King' },
      { type: 'elite', zoneLv: 36, enemies: ['Road Wraith', 'Pack Beast Husk'] },
      { type: 'boss', name: 'Debt Wraith' },
      { type: 'elite', zoneLv: 37, enemies: ['Nursery Wraith', 'Uncaught Echo'] },
      { type: 'boss', name: 'The Foreman' },
      { type: 'elite', zoneLv: 38, enemies: ['Burnt Recruit', 'Barracks Wraith'] },
      { type: 'boss', name: 'Echo of Joel' }
    ],
    rw: { xp: 22000, gold: 17500 },
    desc: "Aisyah's market, the flooded ledger, the docks, and the lighthouse — the whole shattered future, end to end, with elite remnants of that future guarding every threshold." }
];

// Raid bosses hit harder than their solo zone-encounter versions — a raid should feel
// like a real escalation, not the same fight you've already had elsewhere.
const RAID_BOSS_BUFF = { hpMult: 1.35, atkMult: 1.25, defMult: 1.15 };

// Generates an elite trash-wave enemy, reusing the existing 'elite' stat template and
// pulling elemental typing from ENEMY_REGISTRY when the name is already registered there,
// so it stays visually/thematically consistent with how that enemy looks everywhere else.
function generateRaidEliteEnemy(name, zoneLv) {
  const reg = ENEMY_REGISTRY[name];
  const elem = reg && reg.elem ? reg.elem : 'arcane';
  const stats = generateEnemyStats(zoneLv, 'elite', elem);
  return { ...stats, n: name, id: 0, status: [] };
}

function getRaidById(id) {
  return RAIDS.find(r => r.id === id);
}

function isRaidUnlocked(raid) {
  return G.p.lvl >= raid.unlockLevel;
}

function enterRaid(raidId) {
  const raid = getRaidById(raidId);
  if (!raid) return;
  if (!isRaidUnlocked(raid)) {
    lg('🔒 ' + raid.name + ' unlocks at Level ' + raid.unlockLevel + '.');
    return;
  }
  G.raid.active = true;
  G.raid.raidId = raidId;
  G.raid.stageIndex = 0;
  G.raid.sessionStart = Date.now();
  lg('🌀 Entering ' + raid.name + '! ' + raid.stages.length + ' stages stand between you and the reward.');
  startRaidStage();
}

function startRaidStage() {
  const raid = getRaidById(G.raid.raidId);
  if (!raid) return;
  const stage = raid.stages[G.raid.stageIndex];
  if (!stage) {
    lg('⚠️ Raid data error: no stage at index ' + G.raid.stageIndex + '. Ending raid.');
    exitRaid();
    return;
  }

  G.cbt.on = true;
  G.cbt.turn = 0;
  G.cbt.en = [];
  G.state = 'combat';

  if (stage.type === 'boss') {
    const bossDef = G.bosses.find(b => b.n === stage.name);
    if (!bossDef) {
      lg('⚠️ Raid data error: boss "' + stage.name + '" not found. Ending raid.');
      exitRaid();
      return;
    }
    G.currentBoss = JSON.parse(JSON.stringify(bossDef));
    G.currentBoss.id = 99;
    // Raid bosses hit harder than their solo zone-encounter versions
    G.currentBoss.hp = Math.floor(G.currentBoss.hp * RAID_BOSS_BUFF.hpMult);
    G.currentBoss.mhp = G.currentBoss.hp;
    G.currentBoss.atk = Math.floor(G.currentBoss.atk * RAID_BOSS_BUFF.atkMult);
    G.currentBoss.def = Math.floor(G.currentBoss.def * RAID_BOSS_BUFF.defMult);
    G.cbt.en.push(G.currentBoss);
    lg('⚔️ Stage ' + (G.raid.stageIndex + 1) + '/' + raid.stages.length + ': ' + stage.name + ' appears — hardened for the raid!');
    lg('   ' + bossDef.desc);
  } else {
    G.currentBoss = null;
    for (let i = 0; i < stage.enemies.length; i++) {
      const e = generateRaidEliteEnemy(stage.enemies[i], stage.zoneLv);
      e.id = i;
      G.cbt.en.push(e);
    }
    lg('⚔️ Stage ' + (G.raid.stageIndex + 1) + '/' + raid.stages.length + ': an elite pack blocks the way — ' + stage.enemies.join(' & ') + '!');
  }
  render();
}

function handleRaidVictory() {
  const raid = getRaidById(G.raid.raidId);
  if (!raid) { exitRaid(); return; }
  const stage = raid.stages[G.raid.stageIndex];

  const txp = G.cbt.en.reduce((s, e) => s + e.xp, 0);
  const tg2 = G.cbt.en.reduce((s, e) => s + e.g, 0);
  G.p.xp += txp;
  G.p.gold += tg2;
  if (stage && stage.type === 'boss') G.p.bossKills = (G.p.bossKills || 0) + 1;
  checkAchievements();
  const clearedName = stage && stage.type === 'boss' ? stage.name : 'the elite pack';
  lg('🎉 ' + clearedName + ' defeated! +' + txp + ' XP, +' + tg2 + 'G');

  G.raid.stageIndex++;
  G.currentBoss = null;
  G.cbt.autoCombat = false;
  G.cbt.on = false;

  if (G.raid.stageIndex >= raid.stages.length) {
    handleRaidClear(raid);
    return;
  }

  // Partial recovery between stages — not a full rest, just enough to keep going.
  G.p.hp = Math.min(G.p.mhp, G.p.hp + Math.floor(G.p.mhp * RAID_STAGE_RECOVERY_PCT));
  G.p.mp = Math.min(G.p.mmp, G.p.mp + Math.floor(G.p.mmp * RAID_STAGE_RECOVERY_PCT));
  for (let p of G.party) {
    if (p.on && p.hp > 0) p.hp = Math.min(p.mhp, p.hp + Math.floor(p.mhp * RAID_STAGE_RECOVERY_PCT));
  }
  lg('💨 A brief respite — the party recovers ' + Math.round(RAID_STAGE_RECOVERY_PCT * 100) + '% before the next stage.');
  G.state = 'raid_room';
  render();
}

function handleRaidClear(raid) {
  const firstClear = !G.raidProgress.cleared.includes(raid.id);
  if (firstClear) {
    G.raidProgress.cleared.push(raid.id);
    G.p.xp += raid.rw.xp;
    G.p.gold += raid.rw.gold;
    lg('🏆 RAID CLEARED: ' + raid.name + '! First-clear reward: +' + raid.rw.xp + ' XP, +' + raid.rw.gold + 'G!');
  } else {
    const repeatXp = Math.floor(raid.rw.xp * 0.25);
    const repeatGold = Math.floor(raid.rw.gold * 0.25);
    G.p.xp += repeatXp;
    G.p.gold += repeatGold;
    lg('🏆 RAID CLEARED AGAIN: ' + raid.name + '! +' + repeatXp + ' XP, +' + repeatGold + 'G.');
  }
  G.raid.active = false;
  G.raid.raidId = null;
  G.raid.stageIndex = 0;
  G.state = 'menu';
  render();
}

function exitRaid() {
  lg('🚪 Left ' + (getRaidById(G.raid.raidId)?.name || 'the raid') + '. No progress is saved mid-raid — you\'ll restart from stage 1 next time.');
  G.raid.active = false;
  G.raid.raidId = null;
  G.raid.stageIndex = 0;
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  G.state = 'menu';
  render();
}


function getGrindTierIndex(wave) {
  let idx = -1;
  for (let i = 0; i < GRIND_TIERS.length; i++) {
    if (wave >= GRIND_TIERS[i].waveReq) idx = i;
  }
  return idx; // -1 = Unranked
}

function getGrindTierBonus() {
  const idx = getGrindTierIndex(G.grindChampionship.bestWave);
  return idx >= 0 ? GRIND_TIERS[idx].bonusPct : 0;
}

// Checks the just-completed wave against the championship ladder, awards any newly-earned
// one-time tier rewards, and raises the all-time best wave record.
function checkGrindTierRewards() {
  const gc = G.grindChampionship;
  const wave = G.endlessGrind.wave;
  if (wave > gc.bestWave) gc.bestWave = wave;

  for (let tier of GRIND_TIERS) {
    if (wave >= tier.waveReq && !gc.claimedTiers.includes(tier.id)) {
      gc.claimedTiers.push(tier.id);
      G.p.gold += tier.rw.gold;
      G.p.xp += tier.rw.xp;
      lg('🏅 CHAMPIONSHIP PROMOTION! You reached ' + tier.icon + ' ' + tier.name + '!');
      lg('   Reward: +' + tier.rw.gold + 'G, +' + tier.rw.xp + ' XP, and a permanent +' + Math.round(tier.bonusPct * 100) + '% grind bonus!');
      checkAchievements();
    }
  }
}




// ============================================================
// TALENT SYSTEM (Phase 2)
// ============================================================

const TALENTS = [
  { id: 'spellweaver', name: 'Spellweaver', icon: '🔮', lv: 16, desc: '-10% MP costs for all spells', effect: { mpCostRed: 0.10 } },
  { id: 'arcane_battery', name: 'Arcane Battery', icon: '🔋', lv: 18, desc: '+20 starting MP (permanent)', effect: { mpBonus: 20 } },
  { id: 'second_wind', name: 'Second Wind', icon: '💨', lv: 20, desc: 'Auto-heal 25% HP once per combat when below 10% HP', effect: { secondWind: true } },
  { id: 'planar_attunement', name: 'Planar Attunement', icon: '🌌', lv: 22, desc: '+10% Planar Resonance bonus (35% match / +15% mismatch)', effect: { resonanceBonus: 0.10 } },
  { id: 'rift_walker', name: 'Rift Walker', icon: '🌀', lv: 24, desc: 'Dimensional Instability triggers 1 fight sooner', effect: { riftReduce: 1 } },
  { id: 'elemental_mastery', name: 'Elemental Mastery', icon: '🔥', lv: 26, desc: '+15% elemental weakness damage', effect: { elemWeakBonus: 0.15 } },
  { id: 'void_resistance', name: 'Void Resistance', icon: '🛡️', lv: 28, desc: '-50% Void Bleed HP drain', effect: { voidRed: 0.50 } },
  { id: 'ascension', name: 'Ascension', icon: '⭐', lv: 30, desc: 'All stats +3. Something greater awaits...', effect: { allStats: 3 } }
];

function getTalentEffect(id) {
  return G.talents.includes(id);
}

function getTalentMultiplier(type) {
  let mult = 1;
  if (type === 'mpCost' && getTalentEffect('spellweaver')) mult -= 0.10;
  if (type === 'resonance' && getTalentEffect('planar_attunement')) mult += 0.10;
  if (type === 'elemWeak' && getTalentEffect('elemental_mastery')) mult += 0.15;
  if (type === 'voidDrain' && getTalentEffect('void_resistance')) mult -= 0.50;
  return mult;
}

function checkTalentUnlocks() {
  for (let t of TALENTS) {
    if (G.p.lvl >= t.lv && !G.talents.includes(t.id)) {
      G.talents.push(t.id);
      // Apply permanent effects immediately
      if (t.effect.mpBonus) { G.p.mmp += t.effect.mpBonus; G.p.mp = Math.min(G.p.mmp, G.p.mp + t.effect.mpBonus); }
      if (t.effect.allStats) { for (let k in G.p.stats) G.p.stats[k] += t.effect.allStats; }
      lg('🌟 TALENT UNLOCKED: ' + t.icon + ' ' + t.name + ' (Lv.' + t.lv + ')!');
      lg('   ' + t.desc);
    }
  }
}

function checkSecondWind() {
  if (!getTalentEffect('second_wind')) return false;
  if (G.p.hp / G.p.mhp < 0.10) {
    const heal = Math.floor(G.p.mhp * 0.25);
    G.p.hp = Math.min(G.p.mhp, G.p.hp + heal);
    lg('💨 SECOND WIND! San heals ' + heal + ' HP!');
    return true;
  }
  return false;
}

// ============================================================


// ============================================================
// RUNE SOCKETING SYSTEM (Phase 2)
// ============================================================

const RUNE_TYPES = {
  power:    { name: 'Rune of Power',    icon: '⚔️', stat: 'atk', val: 5, r: 'common', color: '#ef4444' },
  mind:     { name: 'Rune of Mind',     icon: '🔮', stat: 'int', val: 3, r: 'common', color: '#3b82f6' },
  phoenix:  { name: 'Rune of Phoenix',  icon: '🔥', stat: 'fireDmg', val: 3, r: 'uncommon', color: '#f97316', pct: 0.10 },
  frost:    { name: 'Rune of Frost',    icon: '❄️', stat: 'iceDmg', val: 3, r: 'uncommon', color: '#06b6d4', pct: 0.10 },
  storm:    { name: 'Rune of Storm',    icon: '⚡', stat: 'lightDmg', val: 3, r: 'uncommon', color: '#eab308', pct: 0.10 },
  void:     { name: 'Rune of Void',     icon: '🌑', stat: 'voidDmg', val: 4, r: 'rare', color: '#a855f7', pct: 0.15 },
  arcane:   { name: 'Rune of Arcane',   icon: '✨', stat: 'arcaneDmg', val: 4, r: 'rare', color: '#8b5cf6', pct: 0.15 },
  life:     { name: 'Rune of Life',     icon: '💚', stat: 'hpRegen', val: 3, r: 'common', color: '#22c55e' },
  mana:     { name: 'Rune of Mana',     icon: '💧', stat: 'mpRegen', val: 2, r: 'common', color: '#6366f1' }
};

function getSocketCount(ilvl) {
  if (ilvl >= 20) return 3;
  if (ilvl >= 15) return 2;
  if (ilvl >= 10) return 1;
  return 0;
}

function generateRune(zoneLevel) {
  const keys = Object.keys(RUNE_TYPES);
  // Higher zones = better rune chances
  const roll = Math.random() + (zoneLevel * 0.02);
  let pool = keys;
  if (roll > 0.7) pool = keys.filter(k => RUNE_TYPES[k].r !== 'common');
  if (roll > 0.9) pool = keys.filter(k => RUNE_TYPES[k].r === 'rare');
  if (pool.length === 0) pool = keys;
  const type = pool[Math.floor(Math.random() * pool.length)];
  const rune = RUNE_TYPES[type];
  return { type: type, ...rune, id: Date.now() + Math.random() };
}

function addRuneLoot(zoneName) {
  const zone = G.zones.find(z => z.n === zoneName);
  if (!zone || zone.lv < 10) return; // Runes only from Lv 10+ zones
  if (Math.random() < 0.3) { // 30% drop chance
    const rune = generateRune(zone.lv);
    G.runes.push(rune);
    lg('💎 Rune dropped: ' + rune.icon + ' ' + rune.name + '!');
  }
}

// Rune combine modal state
G.runeCombineModal = { open: false, selected: [] };

function openCombineModal() {
  G.runeCombineModal = { open: true, selected: [] };
  render();
}

function closeCombineModal() {
  G.runeCombineModal = { open: false, selected: [] };
  render();
}

function toggleCombineRune(runeIndex) {
  const idx = G.runeCombineModal.selected.indexOf(runeIndex);
  if (idx > -1) {
    G.runeCombineModal.selected.splice(idx, 1);
  } else {
    if (G.runeCombineModal.selected.length >= 3) {
      lg('❌ Max 3 runes selected!');
      return;
    }
    G.runeCombineModal.selected.push(runeIndex);
  }
  render();
}

function getCombinePreview() {
  const selected = G.runeCombineModal.selected.map(i => G.runes[i]).filter(r => r);
  if (selected.length !== 3) return null;
  const types = [...new Set(selected.map(r => r.type))];
  if (types.length !== 1) return { error: 'All 3 must be same type!' };
  const base = RUNE_TYPES[types[0]];
  const upgradeRarity = base.r === 'common' ? 'uncommon' : base.r === 'uncommon' ? 'rare' : 'epic';
  const mult = base.r === 'common' ? 1.5 : 2;
  return {
    name: base.name + ' +',
    icon: base.icon,
    stat: base.stat,
    val: Math.floor(base.val * mult),
    r: upgradeRarity,
    color: base.color,
    pct: base.pct ? Math.min(0.30, base.pct * mult) : null
  };
}

function doCombineRunes() {
  const preview = getCombinePreview();
  if (!preview || preview.error) {
    lg(preview?.error || '❌ Select 3 matching runes!');
    return;
  }
  const selected = [...G.runeCombineModal.selected].sort((a,b) => b-a);
  for (let i of selected) G.runes.splice(i, 1);
  G.runes.push({
    type: preview.name.replace(' +','').toLowerCase().replace('rune of ',''),
    ...preview,
    id: Date.now() + Math.random()
  });
  lg('✨ Combined into ' + preview.icon + ' ' + preview.name + ' (' + preview.r + ')!');
  closeCombineModal();
}

// Legacy wrapper
function combineRunes(runeIndices) {
  openCombineModal();
}

// Rune socketing modal state
G.runeSocketModal = { open: false, itemIndex: null, slotIndex: null };

function openSocketModal(itemIndex, slotIndex) {
  const item = G.p.inv[itemIndex];
  if (!item || !item.sockets || item.sockets[slotIndex]) return;
  if (G.runes.length === 0) { lg('❌ No runes available!'); return; }
  G.runeSocketModal = { open: true, itemIndex, slotIndex };
  render();
}

function closeSocketModal() {
  G.runeSocketModal = { open: false, itemIndex: null, slotIndex: null };
  render();
}

function confirmSocketRune(runeIndex) {
  const { itemIndex, slotIndex } = G.runeSocketModal;
  const item = G.p.inv[itemIndex];
  const rune = G.runes[runeIndex];
  if (!item || !rune || item.sockets[slotIndex]) return;

  item.sockets[slotIndex] = rune;
  G.runes.splice(runeIndex, 1);
  lg('💎 Socketed ' + rune.icon + ' ' + rune.name + ' into ' + item.n + '!');

  // Apply rune stats to item
  if (!item.socketStats) item.socketStats = {};
  item.socketStats[rune.stat] = (item.socketStats[rune.stat] || 0) + rune.val;
  if (rune.pct) {
    const pctKey = rune.stat + 'Pct';
    item.socketStats[pctKey] = (item.socketStats[pctKey] || 0) + rune.pct;
  }

  closeSocketModal();
}

// Legacy wrapper for backward compat
function socketRune(itemIndex, slot, runeIndex) {
  openSocketModal(itemIndex, slot);
}

function unsocketRune(itemIndex, slot) {
  const item = G.p.inv[itemIndex];
  if (!item || !item.sockets || !item.sockets[slot]) return;
  const rune = item.sockets[slot];
  G.runes.push(rune);
  item.sockets[slot] = null;

  // Recalculate socket stats
  item.socketStats = {};
  for (let s of item.sockets) {
    if (s) {
      item.socketStats[s.stat] = (item.socketStats[s.stat] || 0) + s.val;
      if (s.pct) {
        const pctKey = s.stat + 'Pct';
        item.socketStats[pctKey] = (item.socketStats[pctKey] || 0) + s.pct;
      }
    }
  }
  lg('💎 Removed ' + rune.icon + ' ' + rune.name + ' from ' + item.n + '!');
}

function getItemSocketDisplay(item) {
  if (!item.sockets) return '';
  let h = '<div style="display:flex;gap:4px;margin-top:4px;">';
  for (let i = 0; i < item.sockets.length; i++) {
    const s = item.sockets[i];
    h += '<div style="width:20px;height:20px;border-radius:50%;border:2px solid ' + (s ? s.color : 'var(--disabled)') + ';background:' + (s ? s.color + '40' : 'transparent') + ';display:flex;align-items:center;justify-content:center;font-size:10px;">' + (s ? s.icon : '○') + '</div>';
  }
  h += '</div>';
  return h;
}

// ============================================================

// ============================================================
// DIMENSIONAL INSTABILITY SYSTEM (Phase 2)
// ============================================================

const RIFT_EVENTS = {
  gravity: {
    name: 'Gravity Reversal',
    icon: '🔄',
    desc: 'SPD↔ATK swapped for all combatants!',
    color: '#a855f7',
    apply() {
      // Swap ATK and SPD for player stats
      const tmpAtk = G.p.stats.str;
      G.p.stats.str = G.p.stats.dex;
      G.p.stats.dex = tmpAtk;
      // Swap for all active party members
      for (let p of G.party) {
        if (p.on) {
          const tmp = p.atk; p.atk = p.spd; p.spd = tmp;
        }
      }
      // Swap for all enemies
      for (let e of G.cbt.en) {
        const tmp = e.atk; e.atk = e.def; e.def = tmp;
      }
      lg('🌌 RIFT EVENT: Gravity Reversal! SPD↔ATK swapped!');
    },
    remove() {
      // Swap back
      const tmpAtk = G.p.stats.str;
      G.p.stats.str = G.p.stats.dex;
      G.p.stats.dex = tmpAtk;
      for (let p of G.party) {
        if (p.on) {
          const tmp = p.atk; p.atk = p.spd; p.spd = tmp;
        }
      }
      for (let e of G.cbt.en) {
        const tmp = e.atk; e.atk = e.def; e.def = tmp;
      }
      lg('🌌 Gravity normalizes... stats restored.');
    }
  },
  time: {
    name: 'Time Dilation',
    icon: '⏳',
    desc: 'Cooldowns doubled, but damage doubled!',
    color: '#eab308',
    dmgMult: 2.0,
    mpMult: 2.0,
    apply() {
      lg('🌌 RIFT EVENT: Time Dilation! DMG ×2, MP costs ×2!');
    },
    remove() {
      lg('🌌 Time flows normally again...');
    }
  },
  void: {
    name: 'Void Bleed',
    icon: '🌑',
    desc: 'Lose 2% HP/turn, but +30% damage!',
    color: '#ef4444',
    hpDrain: 0.02,
    dmgMult: 1.3,
    apply() {
      lg('🌌 RIFT EVENT: Void Bleed! -2% HP/turn, DMG +30%!');
    },
    remove() {
      lg('🌌 The void recedes... bleeding stops.');
    }
  }
};

function checkDimensionalInstability() {
  if (G.currentRift) {
    G.riftFightsRemaining--;
    if (G.riftFightsRemaining <= 0) {
      RIFT_EVENTS[G.currentRift].remove();
      G.currentRift = null;
    }
    return;
  }
  G.riftCounter++;
  if (G.riftCounter >= G.riftTriggerAt) {
    G.riftCounter = 0;
    const riftRed = getTalentEffect('rift_walker') ? 1 : 0;
    G.riftTriggerAt = Math.max(2, 3 + Math.floor(Math.random() * 3) - riftRed);
    const keys = Object.keys(RIFT_EVENTS);
    G.currentRift = keys[Math.floor(Math.random() * keys.length)];
    G.riftFightsRemaining = 2 + Math.floor(Math.random() * 2); // lasts 2-3 fights
    RIFT_EVENTS[G.currentRift].apply();
  }
}

function getRiftMultiplier() {
  if (!G.currentRift) return 1;
  return RIFT_EVENTS[G.currentRift].dmgMult || 1;
}

function applyVoidBleed() {
  if (G.currentRift !== 'void') return;
  const drain = RIFT_EVENTS.void.hpDrain * getTalentMultiplier('voidDrain');
  const hpLoss = Math.max(1, Math.floor(G.p.mhp * drain));
  G.p.hp = Math.max(1, G.p.hp - hpLoss);
  lg('🌑 Void Bleed: San loses ' + hpLoss + ' HP!');
  for (let p of G.party) {
    if (p.on && p.hp > 0) {
      const pLoss = Math.max(1, Math.floor(p.mhp * drain));
      p.hp = Math.max(1, p.hp - pLoss);
      lg('🌑 Void Bleed: ' + p.n + ' loses ' + pLoss + ' HP!');
    }
  }
}

function getRiftStatus() {
  if (!G.currentRift) return null;
  const rift = RIFT_EVENTS[G.currentRift];
  return {
    name: rift.name,
    icon: rift.icon,
    desc: rift.desc,
    color: rift.color,
    fightsLeft: G.riftFightsRemaining
  };
}

// ============================================================

// ============================================================
// NEW COMBAT FUNCTIONS (D&D Style)
// ============================================================

function getPlayerAC() {
  return getTotalAC();
}

function getEnemyAC(enemy) {
  return 10 + Math.floor((enemy.def || 0) / 2);
}

function getAttackAdvantage(attacker, target, isSpell = false) {
  let advantage = 'normal';
  let reasons = [];
  
  if (attacker === G.p && G.p.buffs.some(b => b.n === 'True Strike')) {
    advantage = 'advantage';
    reasons.push('True Strike');
  }
  
  if (isSpell && G.party.some(p => p.on && p.n === 'Senedra')) {
    if (Math.random() < 0.15) {
      advantage = 'advantage';
      reasons.push("Senedra's scouting");
    }
  }
  
  if (G.p.buffs.some(b => b.n === 'Blinded')) {
    advantage = 'disadvantage';
    reasons.push('Blinded');
  }
  
  if (target && target.n && target.n.includes('Frost') && Math.random() < 0.1) {
    if (advantage === 'normal') {
      advantage = 'disadvantage';
      reasons.push('Freezing fingers');
    }
  }
  
  return { advantage, reasons };
}

function getDamageFlavor(damage, isCrit) {
  if (isCrit) {
    if (damage >= 30) return '💥 DEVASTATING CRITICAL!';
    if (damage >= 20) return '💥 MASSIVE CRITICAL!';
    return '💥 CRITICAL!';
  }
  if (damage >= 25) return '💀 OBLITERATING!';
  if (damage >= 15) return '🔥 CRUSHING!';
  if (damage >= 10) return '⚔️ Solid hit!';
  if (damage >= 5) return '🎯 Good hit.';
  return '💨 Glancing blow.';
}

function trackBestiary(enemy) {
  if (!G.bestiary[enemy.n]) {
    G.bestiary[enemy.n] = {
      kills: 0,
      firstSeen: Date.now(),
      elem: enemy.elem || 'none',
      mhp: enemy.mhp,
      atk: enemy.atk,
      def: enemy.def
    };
  }
  G.bestiary[enemy.n].kills++;
  G.bestiary[enemy.n].lastSeen = Date.now();
}

function doPhysicalAttack(target) {
  const advInfo = getAttackAdvantage(G.p, target, false);
  const eqStats = getEquippedStats();
  const hasteBonus = getPlayerAtkBuff();
  const attackResult = DICE.attackRoll({
    attackerLevel: G.p.lvl,
    abilityScore: G.p.stats.str + eqStats.str,
    proficiency: false,
    bonus: Math.floor((G.p.eq.weapon?.atk || 0) / 2) + eqStats.atk + hasteBonus,
    targetAC: getEnemyAC(target),
    advantage: advInfo.advantage
  });
  
  lg('🎲 Staff Swing: ' + attackResult.d20.roll + ' vs AC ' + attackResult.targetAC + ' = ' + (attackResult.hit ? 'HIT' : 'MISS'));
  
  if (!attackResult.hit) {
    if (attackResult.isFumble) lg('   💀 CRITICAL MISS! You stumble wildly!');
    else if (attackResult.margin >= -2) lg('   ❌ Close! The enemy deflects at the last moment.');
    else lg('   ❌ Solid defense. You\'ll need a better angle.');
    return false;
  }
  
  const damageResult = DICE.damageRoll({
    diceExpr: '1d4',
    abilityScore: G.p.stats.str,
    isCrit: attackResult.isCrit,
    bonus: (G.p.eq.weapon ? Math.floor(G.p.eq.weapon.atk / 2) : 0) + hasteBonus
  });
  
  let finalDamage = Math.max(1, damageResult.total - Math.floor((target.def || 0) / 2));
  target.hp -= finalDamage;
  
  const dmgFlavor = getDamageFlavor(finalDamage, attackResult.isCrit);
  lg(dmgFlavor + ' Staff swing hits ' + target.n + ' for ' + finalDamage + '!');
  
  if (attackResult.isCrit) {
    lg('   🎲 ' + damageResult.breakdown);
  }
  
  if (target.hp <= 0) {
    target.hp = 0;
    lg('💀 ' + target.n + ' falls to your staff!');
    checkBountyKill(target.n);
    trackBestiary(target);
  }
  
  return true;
}


function doElizResurrect(member) {
  // Check if Eliz has resurrect ability and it's off cooldown
  if (!member.resurrect) return false;
  if (member.resurrect.cooldown > 0) {
    member.resurrect.cooldown--;
    return false;
  }

  // Find dead party members (excluding Eliz herself)
  const deadMembers = G.party.filter(p => p.on && p.hp <= 0 && p.n !== 'Eliz');
  if (deadMembers.length === 0) return false;

  // Prioritize: San (player) first, then others
  let target = deadMembers.find(p => p.n === 'San');
  if (!target) target = deadMembers[0];

  // Perform resurrection
  const healAmount = Math.floor(target.mhp * member.resurrect.healPct);
  target.hp = Math.max(1, healAmount);
  member.resurrect.cooldown = member.resurrect.maxCooldown;

  lg('💚 ' + member.n + ' casts ' + member.resurrect.name + '!');
  lg('✨ ' + (target.n === 'San' ? 'You' : target.n) + ' are revived with ' + target.hp + ' HP!');

  return true;
}
function doElizPassiveHeal(eliz) {
  // Initialize cooldown tracking if not present
  if (eliz.passiveHealCooldown === undefined) {
    eliz.passiveHealCooldown = 0;
  }
  
  // Check if passive is ready (every 3 turns)
  if (eliz.passiveHealCooldown > 0) {
    eliz.passiveHealCooldown--;
    return false;
  }
  
  // Gather all living allies
  const allies = [{n: 'San', hp: G.p.hp, mhp: G.p.mhp, mp: G.p.mp, mmp: G.p.mmp, isPlayer: true}];
  for (let p of G.party) {
    if (p.on && p.hp > 0 && p.n !== 'Eliz') {
      allies.push({n: p.n, hp: p.hp, mhp: p.mhp, isPlayer: false, ref: p});
    }
  }
  
  // Find wounded allies (below 85% HP)
  const wounded = allies.filter(a => (a.hp / a.mhp) < 0.85);
  const sanNeedsMp = (G.p.mp / G.p.mmp) < 0.40;
  
  // No one needs anything → skip
  if (wounded.length === 0 && !sanNeedsMp) return false;
  
  const synergyBonus = getSynergyHealBonus();
  let didSomething = false;
  
  // === HP HEAL: ALL WOUNDED ALLIES ===
  if (wounded.length > 0) {
    for (let ally of wounded) {
      let healBase = Math.floor(ally.mhp * 0.10); // 10% per ally (reduced from 15% for balance)
      let healAmount = Math.floor(healBase * (1 + synergyBonus));
      
      if (ally.isPlayer) {
        const oldHp = G.p.hp;
        G.p.hp = Math.min(G.p.mhp, G.p.hp + healAmount);
        if (G.p.hp > oldHp) didSomething = true;
      } else {
        const oldHp = ally.ref.hp;
        ally.ref.hp = Math.min(ally.ref.mhp, ally.ref.hp + healAmount);
        if (ally.ref.hp > oldHp) didSomething = true;
      }
    }
    if (didSomething) {
      lg('💚 Eliz channels Gentle Pulse! All wounded allies regain HP.');
    }
  }
  
  // === MP RESTORE: SAN ONLY ===
  if (sanNeedsMp) {
    let mpBase = Math.floor(G.p.mmp * 0.12);
    let mpAmount = Math.floor(mpBase * (1 + synergyBonus));
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + mpAmount);
    if (G.p.mp > oldMp) {
      lg('💧 Eliz weaves mana threads! You restore ' + (G.p.mp - oldMp) + ' MP.');
      didSomething = true;
    }
  }
  
  if (!didSomething) return false;
  
  eliz.passiveHealCooldown = 3;
  updateAffinity('Eliz', 1);
  return true;
}
function doPartyAttack(member) {
  // === ELIZ PASSIVE HEAL CHECK ===
  if (member.n === 'Eliz' && member.hp > 0) {
    // Priority 1: Resurrection (existing)
    if (doElizResurrect(member)) return;
    // Priority 2: Passive heal (new)
    if (doElizPassiveHeal(member)) return;
  }
  // === END ELIZ PASSIVE HEAL ===
  
  const aliveEnemies = G.cbt.en.filter(e => e.hp > 0);
  if (aliveEnemies.length === 0) return;
  
  const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
  // member.atk/spd already include equipped gear bonuses via recalcPartyMember()
  const zakiCourageBonus = (member.n === 'Zaki' && checkZakiCourage()) ? 6 : 0;
  const effectiveAtk = member.atk + zakiCourageBonus;
  const effectiveSpd = member.spd;
  const abilityScore = member.r === 'Rogue' || member.r === 'Ranger' 
    ? effectiveSpd * 2 : effectiveAtk * 2;
  
  const attackResult = DICE.attackRoll({
    attackerLevel: G.p.lvl,
    abilityScore: abilityScore,
    proficiency: true,
    bonus: 0,
    targetAC: getEnemyAC(target),
    advantage: 'normal'
  });
  
  if (!attackResult.hit) {
    lg('❌ ' + member.n + ' misses ' + target.n + ' (' + attackResult.d20.roll + ')');
    return;
  }
  
  const damageResult = DICE.damageRoll({
    diceExpr: '1d6',
    abilityScore: abilityScore,
    isCrit: attackResult.isCrit
  });
  
  let finalDamage = Math.max(1, damageResult.total - Math.floor((target.def || 0) / 3));
  target.hp -= finalDamage;
  
  const critTag = attackResult.isCrit ? ' 💥CRIT' : '';
  lg('⚔️ ' + member.n + ' hits ' + target.n + ' for ' + finalDamage + critTag);
  
  if (target.hp <= 0) {
    target.hp = 0;
    lg('💀 ' + target.n + ' falls!');
    checkBountyKill(target.n);
    trackBestiary(target);
  }
}

function doEnemyAttack(enemy) {
  if (enemy.hp <= 0) return;
  
  if (enemy.status && enemy.status.length > 0) {
    for (let s of enemy.status) {
      if (s.type === 'burn' && s.dmg) {
        enemy.hp -= s.dmg;
        lg('🔥 ' + enemy.n + ' takes ' + s.dmg + ' burn damage!');
      }
      if (s.type === 'poison' && s.dmg) {
        enemy.hp -= s.dmg;
        lg('☠️ ' + enemy.n + ' takes ' + s.dmg + ' poison damage!');
      }
      if (s.type === 'shock') {
        lg('⚡ ' + enemy.n + ' is shocked and skips this turn!');
      }
      s.turns--;
    }
    enemy.status = enemy.status.filter(s => s.turns > 0);
    
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      lg('💀 ' + enemy.n + ' falls to status damage!');
      checkBountyKill(enemy.n);
      trackBestiary(enemy);
      return;
    }
    if (enemy.status.find(s => s.type === 'shock')) return;
  }
  
  let target = G.p;
  if (Math.random() > 0.5) {
    const activeParty = G.party.filter(p => p.on && p.hp > 0);
    if (activeParty.length > 0) {
      target = activeParty[Math.floor(Math.random() * activeParty.length)];
    }
  }

    // Tank Taunt: Joel intercepts attacks on allies (70% with Shield Oath)
  const joel = G.party.find(p => p.on && p.n === 'Joel' && p.hp > 0 && p.r === 'Tank');
  const joelTaunt = hasAffinityUnlock('Joel', 'shield_oath') ? 0.70 : 0.40;
  if (joel && target !== joel && Math.random() < joelTaunt) {
    lg('🛡️ Joel taunts ' + enemy.n + '! The attack is drawn to his shield!');
    target = joel;
  }
  
  // === JOEL'S SHIELD WALL ===
  if (target === G.p && G.p.hp / G.p.mhp <= 0.30 && joel && joel.hp > 0) {
    if (!G.joelShieldCooldown) G.joelShieldCooldown = 0;
    if (G.joelShieldCooldown <= 0 && Math.random() < 0.40) {
      G.joelShieldCooldown = 5;
      lg('🛡️ SHIELD WALL! Joel dives in front of San!');
      target = joel;
    }
  }
  if (G.joelShieldCooldown > 0) G.joelShieldCooldown--;
    
  // target.def already includes equipped gear bonuses via recalcPartyMember()
  const targetAC = target === G.p ? getPlayerAC() : 10 + Math.floor(((target.def || 0) + getBlessDef(target)) / 2);
  const attackResult = DICE.attackRoll({
    attackerLevel: G.zones.find(z => z.en.includes(enemy.n))?.lv || 1,
    abilityScore: enemy.atk * 2,
    proficiency: true,
    bonus: 0,
    targetAC: targetAC,
    advantage: 'normal'
  });
  
  if (!attackResult.hit) {
    lg('❌ ' + enemy.n + ' misses ' + (target.n || 'you') + '!');
    return;
  }
  
  const damageResult = DICE.damageRoll({
    diceExpr: '1d6',
    abilityScore: enemy.atk * 2,
    isCrit: attackResult.isCrit
  });
  
    let finalDamage = damageResult.total;
  const zakiCourageDef = (target !== G.p && target.n === 'Zaki' && checkZakiCourage()) ? 4 : 0;
  const targetDef = target === G.p 
    ? (G.p.eq.armor ? G.p.eq.armor.def : 0) + G.p.buffs.reduce((s, b) => s + (b.def || 0), 0)
    : (target.def || 0) + getBlessDef(target) + zakiCourageDef;

  finalDamage = Math.max(1, finalDamage - Math.floor(targetDef / 2));
  finalDamage = applySynergyDefense(finalDamage);

  // Joel's Last Stand: if this hit would actually kill San, and Joel is ready, he takes
  // it instead. Checked before damage lands so San is never even reduced below 1.
  if (target === G.p && (G.p.hp - finalDamage) <= 0 && isGrowthAbilityReady('Joel')) {
    const joelMember = G.party.find(p => p.n === 'Joel');
    triggerGrowthAbility('Joel');
    lg('🛡️ Joel throws himself in front of the killing blow!');
    joelMember.hp = Math.max(1, joelMember.hp - finalDamage);
    return;
  }
  
  target.hp -= finalDamage;
  
  const critTag = attackResult.isCrit ? ' 💥CRIT' : '';
  lg('🗡️ ' + enemy.n + ' hits ' + (target.n || 'you') + ' for ' + finalDamage + critTag);

  // Eliz's The Space Between: when her own strength gives out mid-fight, she finds one
  // more reserve — a party-wide relief burst, triggered by crossing critical HP herself.
  if (target !== G.p && target.n === 'Eliz' && target.hp > 0 && (target.hp / target.mhp) <= 0.3 && isGrowthAbilityReady('Eliz')) {
    triggerGrowthAbility('Eliz');
    const healAmt = Math.floor(G.p.mhp * 0.15);
    G.p.hp = Math.min(G.p.mhp, G.p.hp + healAmt);
    for (let p of G.party) {
      if (p.on && p.hp > 0) p.hp = Math.min(p.mhp, p.hp + Math.floor(p.mhp * 0.15));
    }
    lg('   A light steadies the whole party, even as she herself is barely standing.');
  }
  
  if (target.hp <= 0) {
    if (target !== G.p && target.passive === 'guardian_spirit') {
      target.hp = 1;
      lg('✨ ' + target.n + "'s Guardian Spirit shines! She endures at 1 HP!");
    } else if (target !== G.p && target.n === 'Soel') {
      target.hp = 1;
      lg('🔥 Soel flickers like a spirit flame! He cannot be killed — he reforms at 1 HP!');
    } else if (target !== G.p && target.n === 'Joel' && hasAffinityUnlock('Joel', 'unbreakable') && !G.joelReviveUsed) {
      G.joelReviveUsed = true;
      target.hp = Math.floor(target.mhp * 0.5);
      lg('💜 UNBREAKABLE! Joel refuses to fall — he rises again at ' + target.hp + ' HP! (Once per rest)');
    } else {
      target.hp = 0;
      lg('💀 ' + (target.n || 'You') + ' fall unconscious!');
    }
  }
}

function handleBossMechanics() {
  for (let e of G.cbt.en) {
    if (e.hp <= 0 || !e.mechanic) continue;
    
    G.cbt.turn = G.cbt.turn || 0;
    
    switch (e.mechanic) {
      case 'rampage':
        if (G.cbt.turn >= e.rampageTurn) {
          lg('🔥 ' + e.n + ' ENRAGES! All party members take ' + e.rampageDmg + ' damage!');
          G.p.hp = Math.max(1, G.p.hp - e.rampageDmg);
          for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - e.rampageDmg); }
        }
        break;
      case 'resurrect':
        if (e.hp <= 0 && e.resurrectCount > 0) {
          e.resurrectCount--;
          e.hp = Math.floor(e.mhp * 0.5);
          lg('💀 ' + e.n + ' RESURRECTS! HP restored to ' + e.hp + '! (' + e.resurrectCount + ' lives left)');
        }
        break;
      case 'phase':
        const phaseThreshold = e.mhp - (e.currentPhase * e.phaseHp);
        if (e.hp <= phaseThreshold && e.currentPhase < e.phases) {
          e.currentPhase++;
          lg('💎 ' + e.n + ' shifts to PHASE ' + e.currentPhase + '! Defenses change!');
          e.def += 3;
          e.atk += 2;
        }
        break;
      case 'inferno':
        if (G.cbt.turn >= e.infernoTurn) {
          lg('🔥 ' + e.n + ' unleashes INFERNO! Party takes ' + e.infernoDmg + ' damage!');
          G.p.hp = Math.max(1, G.p.hp - e.infernoDmg);
          for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - e.infernoDmg); }
        }
        break;
      case 'lightning_rod':
        if (G.cbt.turn > 0 && G.cbt.turn % e.rodTurns === 0) {
          const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
          const weakest = targets.reduce((a, b) => (a.hp / (a.mhp || a.hp)) < (b.hp / (b.mhp || b.hp)) ? a : b);
          const rodDmg = Math.floor(e.atk * 1.5);
          weakest.hp = Math.max(1, weakest.hp - rodDmg);
          lg('⚡ Lightning strikes ' + (weakest.n || 'you') + ' for ' + rodDmg + '!');
        }
        break;
      case 'freeze':
        if (Math.random() < e.freezeChance) {
          const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
          const target = targets[Math.floor(Math.random() * targets.length)];
          target.frozen = true;
          lg('❄️ ' + e.n + ' freezes ' + (target.n || 'you') + '! Skip next turn!');
        }
        break;
      case 'devour':
        if (G.cbt.turn >= e.devourTurn) {
          const targets = G.party.filter(p => p.on && p.hp > 0);
          if (targets.length > 0) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            const saveResult = DICE.savingThrow({
              abilityScore: victim.spd * 2,
              proficiency: false,
              level: G.p.lvl,
              dc: 15
            });
            lg('🌑 ' + e.n + ' attempts to DEVOUR ' + victim.n + '!');
            lg('   ' + victim.n + ' rolls ' + saveResult.d20.roll + ' vs DC ' + saveResult.dc + ' = ' + (saveResult.success ? 'SAVED!' : 'FAILED!'));
            
            if (!saveResult.success) {
    if (victim.passive === 'guardian_spirit') {
        victim.hp = 1;
        lg('✨ ' + victim.n + "'s Guardian Spirit shines! She endures the devouring!");
    } else if (victim.n === 'Soel') {
        victim.hp = 1;
        lg('🔥 Soel flickers like a spirit flame! He reforms from the devour!');
    } else {
        victim.hp = 0;
        lg('💀 ' + victim.n + ' has been devoured!');
    }

            } else {
              lg('✨ ' + victim.n + ' narrowly escapes the maw!');
            }
          }
        }
        break;
      case 'apocalypse':
        if (G.cbt.turn >= e.apocalypseTurn) {
          lg('💥 ' + e.n + ' uses APOCALYPSE! Total party wipe!');
          G.p.hp = 1;
          for (let p of G.party) {
            if (!p.on) continue;
            if (p.passive === 'guardian_spirit') {
              p.hp = 1;
              lg('✨ ' + p.n + "'s Guardian Spirit endures the apocalypse!");
            } else if (p.n === 'Soel') {
              p.hp = 1;
              lg('🔥 Soel flickers through the apocalypse — unkillable!');
            } else {
              p.hp = 0;
            }
          }
        }
        break;
      case 'planar_shift':
        if (G.cbt.turn > 0 && G.cbt.turn % e.shiftTurn === 0 && e.currentPhase < e.phases) {
          e.currentPhase++;
          const phases = ['Arcane', 'Void', 'Temporal', 'Aether', 'Primordial'];
          const phaseName = phases[e.currentPhase - 1] || 'Unknown';
          lg('🌌 ' + e.n + ' shifts to the ' + phaseName + ' DIMENSION! Phase ' + e.currentPhase + '/' + e.phases);
          if (e.currentPhase === 2) {
            lg('   🌑 Void tendrils reach for your mind...');
            G.p.mp = Math.max(0, G.p.mp - 15);
            for (let p of G.party) { if (p.on) p.mp = Math.max(0, p.mp - 10); }
            lg('   💧 Party loses MP to the void!');
          } else if (e.currentPhase === 3) {
            const healAmt = Math.floor(e.mhp * 0.1);
            e.hp = Math.min(e.mhp, e.hp + healAmt);
            lg('   ⏳ Time rewinds! ' + e.n + ' regains ' + healAmt + ' HP!');
          } else if (e.currentPhase === 4) {
            e.atk += 5;
            lg('   ✨ Aether surges! ' + e.n + ' attack rises to ' + e.atk + '!');
          } else if (e.currentPhase === 5) {
            lg('   🔥 PRIMORDIAL ERUPTION! Raw planar energy tears through reality!');
            const primordialDmg = 25;
            G.p.hp = Math.max(1, G.p.hp - primordialDmg);
            for (let p of G.party) { 
              if (p.on) {
                if (p.passive === 'guardian_spirit') {
                  p.hp = Math.max(1, p.hp - primordialDmg);
                  if (p.hp === 1) lg('✨ ' + p.n + "'s Guardian Spirit endures the planar storm!");
                } else if (p.n === 'Soel') {
                  p.hp = 1;
                  lg('🔥 Soel flickers through the planar tear — unkillable!');
                } else {
                  p.hp = Math.max(0, p.hp - primordialDmg);
                }
              }
            }
            lg('   💥 All take ' + primordialDmg + ' primordial damage!');
          }
          if (e.currentPhase < e.phases) {
            const riftMinion = { n: 'Planar Rift', hp: 80, mhp: 80, atk: 15, def: 5, xp: 50, g: 30, elem: 'arcane', id: G.cbt.en.length, status: [] };
            G.cbt.en.push(riftMinion);
            lg('   🌀 A Planar Rift opens! A minion emerges!');
          }
        }
        break;
      case 'nexus_planarch':
        if (G.cbt.turn > 0 && G.cbt.turn % e.shiftTurn === 0 && e.currentPhase < e.phases) {
          e.currentPhase++;
          e.atk += 8;
          e.def += 5;
          const nexusPhases = ['ARCANE', 'FIRE', 'ICE', 'LIGHTNING', 'VOID'];
          const phaseName = nexusPhases[e.currentPhase - 1] || 'UNKNOWN';
          const phaseElem = ['arcane', 'fire', 'ice', 'lightning', 'void'][e.currentPhase - 1] || 'arcane';
          e.elem = phaseElem;
          lg('🌌 ═══════════════════════════════════════');
          lg('🌌 THE NEXUS PLANARCH SHIFTS TO ' + phaseName + '!');
          lg('🌌 ═══════════════════════════════════════');
          lg('   Phase ' + e.currentPhase + '/5 | ATK: ' + e.atk + ' | DEF: ' + e.def + ' | Element: ' + phaseElem.toUpperCase());

          // Phase-specific mechanics
          if (e.currentPhase === 2) { // FIRE
            lg('   🔥 INFERNO AURA: All take 15 fire damage!');
            const fireDmg = 15;
            G.p.hp = Math.max(1, G.p.hp - fireDmg);
            for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - fireDmg); }
            lg('   The dimension burns...');
          } else if (e.currentPhase === 3) { // ICE
            lg('   ❄️ GLACIAL PRISON: Freezing a random target!');
            const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
            const victim = targets[Math.floor(Math.random() * targets.length)];
            victim.frozen = true;
            lg('   ' + (victim.n || victim.name) + ' is frozen solid! Skip next turn!');
          } else if (e.currentPhase === 4) { // LIGHTNING
            lg('   ⚡ CHAIN LIGHTNING: Striking two targets!');
            const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
            if (targets.length > 0) {
              const t1 = targets[Math.floor(Math.random() * targets.length)];
              let t2 = targets[Math.floor(Math.random() * targets.length)];
              while (targets.length > 1 && t2 === t1) t2 = targets[Math.floor(Math.random() * targets.length)];
              const lightningDmg = 20;
              t1.hp = Math.max(1, t1.hp - lightningDmg);
              t2.hp = Math.max(1, t2.hp - lightningDmg);
              lg('   ⚡ ' + (t1.n || t1.name) + ' and ' + (t2.n || t2.name) + ' take ' + lightningDmg + ' lightning damage!');
            }
          } else if (e.currentPhase === 5) { // VOID
            lg('   🌑 REALITY COLLAPSE: The void hungers for everything!');
            const voidDmg = 30;
            G.p.hp = Math.max(1, G.p.hp - voidDmg);
            for (let p of G.party) {
              if (p.on) {
                if (p.passive === 'guardian_spirit') {
                  p.hp = Math.max(1, p.hp - voidDmg);
                  if (p.hp === 1) lg('✨ ' + p.n + "'s Guardian Spirit holds against the void!");
                } else if (p.n === 'Soel') {
                  p.hp = 1;
                  lg('🔥 Soel phases through the collapse — unkillable!');
                } else {
                  p.hp = Math.max(1, p.hp - voidDmg);
                }
              }
            }
            lg('   💥 All take ' + voidDmg + ' void damage! The end approaches...');
          }

          // Spawn Nexus minion every phase shift
          const minionNames = ['Nexus Shard', 'Planar Construct', 'Reality Fragment', 'Dimensional Echo', 'Void Remnant'];
          const minionHp = [120, 150, 180, 220, 280];
          const minionAtk = [18, 22, 26, 30, 35];
          const idx = Math.min(e.currentPhase - 1, 4);
          const minion = {
            n: minionNames[idx],
            hp: minionHp[idx], mhp: minionHp[idx],
            atk: minionAtk[idx], def: 8 + (idx * 3),
            xp: 100 + (idx * 50), g: 80 + (idx * 40),
            elem: phaseElem,
            id: G.cbt.en.length,
            status: []
          };
          G.cbt.en.push(minion);
          lg('   🌀 ' + minion.n + ' manifests! (' + minion.hp + ' HP)');

          // Victory check on final phase death
          if (e.currentPhase === 5) {
            lg('   🌑 THE PLANARCH HAS REVEALED ITS TRUE FORM!');
            lg('   Survive the void. End the rift. Choose your reality.');
          }
        }
        break;
              case 'reality_weave':
        if (G.cbt.turn > 0 && G.cbt.turn % e.weaveTurn === 0) {
          e.currentPhase++;
          lg('🌌 ' + e.n + ' weaves a new dimension! Phase ' + e.currentPhase + '!');
          // Summon an echo (clone)
          const echo = {
            n: 'Veil Echo',
            hp: 400, mhp: 400, atk: 20, def: 10,
            xp: 100, g: 50, elem: 'arcane',
            id: G.cbt.en.length, status: []
          };
          G.cbt.en.push(echo);
          lg('   👤 A Veil Echo manifests!');
          // Shift resistances
          e.atk += 3;
          e.def += 2;
          lg('   ⚡ ' + e.n + ' grows stronger! ATK: ' + e.atk + ' DEF: ' + e.def);
        }
        break;
      // === PHASE 1: LV 22-23 BOSS MECHANICS ===
      case 'astral_phase':
        if (G.cbt.turn > 0 && G.cbt.turn % e.shiftTurn === 0 && e.currentPhase < e.phases) {
          e.currentPhase++;
          const astralPhases = ['MATERIAL', 'ASTRAL', 'VOID', 'PRIMORDIAL'];
          const phaseName = astralPhases[e.currentPhase - 1] || 'UNKNOWN';
          lg('🌌 ' + e.n + ' shifts to the ' + phaseName + ' PHASE! Phase ' + e.currentPhase + '/' + e.phases);
          if (e.currentPhase === 2) {
            e.atk += 5; e.def += 3;
            lg('   ✨ Astral surge! ATK +' + 5 + ', DEF +' + 3);
          } else if (e.currentPhase === 3) {
            lg('   🌑 Void tendrils drain party MP!');
            G.p.mp = Math.max(0, G.p.mp - 20);
            for (let p of G.party) { if (p.on) p.mp = Math.max(0, p.mp - 15); }
          } else if (e.currentPhase === 4) {
            lg('   🔥 PRIMORDIAL ERUPTION! All take 30 damage!');
            G.p.hp = Math.max(1, G.p.hp - 30);
            for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - 30); }
          }
          if (e.currentPhase < e.phases) {
            const riftMinion = { n: 'Astral Echo', hp: 100, mhp: 100, atk: 18, def: 6, xp: 60, g: 40, elem: 'arcane', id: G.cbt.en.length, status: [] };
            G.cbt.en.push(riftMinion);
            lg('   🌀 An Astral Echo manifests!');
          }
        }
        break;
      case 'inferno_core':
        if (G.cbt.turn >= e.infernoTurn) {
          lg('🔥 ' + e.n + ' unleashes INFERNO CORE! Party takes ' + e.infernoDmg + ' fire damage!');
          G.p.hp = Math.max(1, G.p.hp - e.infernoDmg);
          for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - e.infernoDmg); }
        }
        // Heat aura: 10% chance per turn to burn a random target
        if (Math.random() < 0.10) {
          const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
          const victim = targets[Math.floor(Math.random() * targets.length)];
          if (!victim.status) victim.status = [];
          victim.status.push({ type: 'burn', dmg: 8, turns: 3, chance: 1.0 });
          lg('   🔥 ' + (victim.n || 'You') + ' is ignited by the Infernal Tyrant\'s aura!');
        }
        break;

      case 'drown':
        if (G.cbt.turn >= e.drownTurn) {
          lg('🌊 ' + e.n + ' FLOODS the battlefield! All must save or take crushing damage!');
          const drownDmg = Math.floor((e.atk || 30) * 0.9);
          const drownTargets = [G.p, ...G.party.filter(p => p.on)];
          for (let t of drownTargets) {
            const saveResult = DICE.savingThrow({ abilityScore: (t.spd || G.p.stats.dex) * 2, proficiency: false, level: G.p.lvl, dc: 14 });
            if (saveResult.success) { lg('   ' + (t.n || 'You') + ' surfaces in time — no damage!'); continue; }
            if (t !== G.p && t.passive === 'guardian_spirit') {
              t.hp = 1;
              lg('   ✨ ' + t.n + "'s Guardian Spirit keeps her afloat!");
            } else if (t !== G.p && t.n === 'Soel') {
              t.hp = 1;
              lg('   🔥 Soel flickers above the flood — unkillable!');
            } else {
              t.hp = Math.max(1, t.hp - drownDmg);
              lg('   ' + (t.n || 'You') + ' is dragged under for ' + drownDmg + ' damage!');
            }
          }
          e.drownTurn = G.cbt.turn + 4; // floods again every 4 turns
        }
        break;

      case 'crush':
        e.crushStacks = (e.crushStacks || 0) + 1;
        if (G.cbt.turn >= e.crushTurn) {
          const crushDmg = Math.floor((e.atk || 40) * (1 + e.crushStacks * 0.05));
          lg('🌑 ' + e.n + ' unleashes CRUSHING DEPTH! Pressure has been building since turn ' + (e.crushTurn - 5) + '...');
          G.p.hp = Math.max(1, G.p.hp - crushDmg);
          for (let p of G.party) {
            if (!p.on) continue;
            if (p.passive === 'guardian_spirit') { p.hp = 1; lg('   ✨ ' + p.n + "'s Guardian Spirit endures the pressure!"); }
            else if (p.n === 'Soel') { p.hp = 1; lg('   🔥 Soel flickers through the crush — unkillable!'); }
            else p.hp = Math.max(1, p.hp - crushDmg);
          }
          e.crushTurn = G.cbt.turn + 5;
        }
        break;

      case 'cosmic':
        if (G.cbt.turn > 0 && G.cbt.turn % (e.cosmicShiftTurns || 4) === 0 && e.cosmicPhase < 4) {
          e.cosmicPhase++;
          const cosmicNames = ['', 'STARFALL', 'VOID SURGE', 'NOVA HEART', 'SUPERNOVA'];
          lg('⭐ ' + e.n + ' ascends to COSMIC PHASE ' + e.cosmicPhase + ': ' + cosmicNames[e.cosmicPhase] + '!');
          e.atk += 6; e.def += 4;
          const cosmicDmg = 10 * e.cosmicPhase;
          G.p.hp = Math.max(1, G.p.hp - cosmicDmg);
          for (let p of G.party) {
            if (!p.on) continue;
            if (p.passive === 'guardian_spirit') { p.hp = 1; lg('   ✨ ' + p.n + "'s Guardian Spirit shields her from the cosmos!"); }
            else if (p.n === 'Soel') { p.hp = 1; lg('   🔥 Soel flickers through the cosmic surge — unkillable!'); }
            else p.hp = Math.max(1, p.hp - cosmicDmg);
          }
          lg('   💥 All take ' + cosmicDmg + ' cosmic damage!');
        }
        break;

    }
  }        
}

function handleZoneHazards() {
  if (!G.cbt.on || G.cbt.en.length === 0 || !G.cbt.en.some(e => e.hp > 0)) return;
  
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (!zone || !G.zoneHazards[zone.n]) return;
  
  const hazard = G.zoneHazards[zone.n];
  if (Math.random() >= hazard.chance) return;
  
  lg('🌋 HAZARD: ' + hazard.msg);
  
  switch (hazard.type) {
    case 'damage':
      const saveResult = DICE.savingThrow({
        abilityScore: G.p.stats.con,
        proficiency: false,
        level: G.p.lvl,
        dc: 12
      });
      
      let hazardDmg = hazard.dmg;
      if (saveResult.success) {
        hazardDmg = Math.floor(hazardDmg / 2);
        lg('   🛡️ You dive for cover! Half damage!');
      }
      
      G.p.hp = Math.max(1, G.p.hp - hazardDmg);
      lg('   🔥 ' + G.p.name + ' takes ' + hazardDmg + ' ' + hazard.elem + ' damage!');
      
      for (let p of G.party) {
        if (p.on && p.hp > 0) {
          const partySave = DICE.savingThrow({
            abilityScore: p.con || 10,
            proficiency: false,
            level: G.p.lvl,
            dc: 12
          });
          let partyDmg = hazard.dmg;
          if (partySave.success) partyDmg = Math.floor(partyDmg / 2);
          p.hp = Math.max(1, p.hp - partyDmg);
          lg('   🔥 ' + p.n + ' takes ' + partyDmg + ' ' + hazard.elem + ' damage!');
        }
      }
      break;
    case 'freeze':
      const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
      const target = targets[Math.floor(Math.random() * targets.length)];
      target.frozen = true;
      lg('   ❄️ ' + (target.n || target.name) + ' is frozen by the ' + hazard.name + '! Skip next turn!');
      break;
    case 'mana_drain':
      G.p.mp = Math.max(0, G.p.mp - hazard.drain);
      lg('   🌑 ' + G.p.name + ' loses ' + hazard.drain + ' MP to void corruption!');
      break;
  }
}

function finishPlayerTurn() {
  // Reduce Eliz's resurrect cooldown each turn
  const eliz = G.party.find(p => p.on && p.n === 'Eliz');
  if (eliz && eliz.resurrect && eliz.resurrect.cooldown > 0) {
    eliz.resurrect.cooldown--;
  }

  for (let p of G.party) {
    if (p.on && p.hp > 0) doPartyAttack(p);
  }
  
  eturn();
  
  if (G.p.hp <= 1 && G.p.hp > 0) {
    G.cbt.autoFlee = true;
  }

  // Soel's The Choice: if the whole party — San included — is on the brink at once,
  // and no one has fallen yet, he pulls everyone back together. Once per rest.
  if (G.p.hp > 0 && isGrowthAbilityReady('Soel')) {
    const criticalThreshold = 0.2;
    const sanCritical = (G.p.hp / G.p.mhp) <= criticalThreshold;
    const activeMembers = G.party.filter(p => p.on);
    const allCritical = sanCritical && activeMembers.length > 0 &&
      activeMembers.every(p => p.hp > 0 && (p.hp / p.mhp) <= criticalThreshold);
    if (allCritical) {
      triggerGrowthAbility('Soel');
      G.p.hp = Math.floor(G.p.mhp * 0.5);
      for (let p of activeMembers) { p.hp = Math.floor(p.mhp * 0.5); }
      lg('🔥 Soel remembers why he chose you all — the whole party is pulled back from the brink, together!');
    }
  }
  
  if (G.cbt.en.every(e => e.hp <= 0)) {
    handleVictory();
    return;
  }
  
  if (G.p.hp <= 0) {
    handleDefeat();
    return;
  }
  
  G.cbt.turn++;
  render();
}

function handleVictory() {
  clearZoneBuffs(); // STAGE 3: Clear zone buffs on victory

  const txp = G.cbt.en.reduce((s, e) => s + e.xp, 0);
  let tg2 = G.cbt.en.reduce((s, e) => s + e.g, 0);
  
  if (G.party[1].on) tg2 = Math.floor(tg2 * 1.2);
  const goldBonus = getSynergyGoldBonus();
  if (goldBonus > 0) {
    tg2 = Math.floor(tg2 * (1 + goldBonus));
    lg('💰 Synergy bonus: +' + Math.floor(goldBonus * 100) + '% gold!');
  }
  
  G.p.xp += txp;
  G.p.gold += tg2;
   checkDailyQuests('earn_gold', tg2); 
  G.p.kills += G.cbt.en.length;
   checkDailyQuests('kill', G.cbt.en.length); 
    if (G.party.filter(p => p.on).length >= 3) checkDailyQuests('full_party_battle', 1); 
  if (G.currentBoss) { G.p.bossKills = (G.p.bossKills || 0) + 1; }
    // Check boss-based journal unlocks
  for (let entry of G.storyJournal.entries) {
    if (entry.unlockType === 'boss' && G.currentBoss && G.currentBoss.n === entry.unlockAt && !G.storyJournal.unlocked.includes(entry.id)) {
      G.storyJournal.unlocked.push(entry.id);
      lg('📖 Journal unlocked: ' + entry.title + '!');
    }
  }
  if (G.currentBoss && G.currentBoss.n === 'The Planarch') {
    lg('🏆 You have conquered the Arcane Planar Tower!');
    lg('   The spire bends to your will. Planar energy surges through your veins.');
    claimStronghold('arcaneTower'); // guaranteed on defeat, independent of any quest-chain state
  }
  if (G.p.hp === 1) { G.p.survivedCritical = true; }
  checkAchievements();
  
  lg('🎉 VICTORY! +' + txp + ' XP, +' + tg2 + ' Gold!');
  triggerSoelCommentary('combat_win');
  
  const aisyahQuest = G.quests.find(q => q.t === 'aisyah_battle' && !q.done);
  if (aisyahQuest && G.party.find(p => p.on && p.n === 'Aisyah')) {
    aisyahQuest.c += G.cbt.en.length;
    if (aisyahQuest.c >= aisyahQuest.need) checkQ();
  }
  checkJournalLevelUnlocks();
  
  const joelQuest = G.quests.find(q => q.t === 'joel_battle' && !q.done);
  if (joelQuest && G.party.find(p => p.on && p.n === 'Joel')) {
    joelQuest.c += G.cbt.en.length;
    if (joelQuest.c >= joelQuest.need) checkQ();
  }

  // Update kill_specific and boss_specific quest counters
  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t === 'kill_specific') {
      const killedInThisFight = G.cbt.en.filter(e => e.hp <= 0 && e.n === q.target).length;
      if (killedInThisFight > 0) {
        q.c += killedInThisFight;
        lg('📜 ' + q.n + ': ' + q.c + '/' + q.need + ' ' + q.target + ' defeated');
        if (q.c >= q.need) checkQ();
      }
    }
    if (q.t === 'boss_specific' && G.currentBoss && G.currentBoss.n === q.target) {
      q.c++;
      lg('📜 ' + q.n + ': ' + q.c + '/' + q.need + ' ' + q.target + ' defeated');
      if (q.c >= q.need) checkQ();
    }
  }

  // Update reach_level quest counters (in case level was gained)
  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t === 'reach_level' && G.p.lvl >= q.need) {
      q.c = q.need;
      checkQ();
    }
  }

  for (let p of G.party) {
    if (p.on && p.hp > 0) updateAffinity(p.n, 1);
  }
  
  const z = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (z) {
    // Old material loot
    const l = z.loot[Math.floor(Math.random() * z.loot.length)];
    addI({ n: l, t: 'mat', q: 1, r: 'common' });
    lg('🎁 Found: ' + l);

    // New equipment loot (50% chance)
    if (Math.random() < 0.5) {
      addLootFromCombat(z.n);
    }
    
    addRuneLoot(z.n); // Phase 2: Rune drops

    const campSite = G.rest.sites.find(s => s.zone === z.n && s.type === 'camp');
    const tavernSite = G.rest.sites.find(s => s.zone === z.n && s.type === 'tavern');
    if (campSite && !campSite.unlocked) {
      campSite.unlocked = true;
      lg('🏕️ Campsite discovered in ' + z.n + '!');
    }
    if (tavernSite && !tavernSite.unlocked && G.p.lvl >= tavernSite.zoneLv) {
      tavernSite.unlocked = true;
      lg('🍺 Tavern discovered: ' + tavernSite.name + '!');
    }
  }
  
  lvlup();
  checkQ();
  
  G.currentBoss = null;
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  G.state = 'explore';
  render();
}

function handleDefeat() {
  clearZoneBuffs(); // STAGE 3: Clear zone buffs on defeat

  if (checkSecondWind()) { render(); return; }
  lg('💀 You have fallen! Rolling death saves...');
  
  let successes = 0;
  let failures = 0;
  
  while (successes < 3 && failures < 3) {
    const deathResult = DICE.deathSave();
    lg('   ' + deathResult.flavor);
    
    if (deathResult.result === 'revive') {
      G.p.hp = 1;
      lg('⚡ MIRACLE! You spring back to life with 1 HP!');
      G.cbt.on = false;
      G.state = 'menu';
      render();
      return;
    }
    
    if (deathResult.result === 'success') successes++;
    else if (deathResult.result === 'fail') failures++;
    else if (deathResult.result === 'double_fail') failures += 2;
  }
  
  if (failures >= 3) {
    lg('💀 The darkness claims you...');
    lg('   (You retreat with 1 HP. Rest to recover.)');
  } else {
    lg('🩹 You stabilize at 1 HP, unconscious but alive.');
  }
  
  G.p.hp = 1;
  for (let p of G.party) {
    if (p.hp <= 0) {
      p.hp = 1;
      p.on = true;
    }
  }
  
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  G.state = 'menu';
  render();
}

function pa(si, ti) {
  const isBasicAttack = si === -1;
  const sk = isBasicAttack 
    ? { n: 'Staff Swing', c: 0, dmg: '1d4', elem: 'none', buff: false } 
    : G.p.skills[si];
  const tg = G.cbt.en[ti];
  
  if (!tg || tg.hp <= 0) return;
  
  const riftMpMult = (G.currentRift === 'time') ? 2 : 1;
  const talentMpMult = getTalentMultiplier('mpCost');
  let actualCost = Math.floor(sk.c * riftMpMult * talentMpMult);

  // Mezstorm's Stormcaller's Gambit: when San's MP is critically low, the storm
  // sometimes answers anyway — the spell costs nothing this cast.
  if (actualCost > 0 && G.p.mp <= Math.floor(G.p.mmp * 0.2) && isGrowthAbilityReady('Mezstorm') && Math.random() < 0.35) {
    triggerGrowthAbility('Mezstorm');
    lg('⚡ The storm answers without being asked — the spell costs nothing!');
    actualCost = 0;
  }

  if (G.p.mp < actualCost) {
    lg('💨 Not enough MP! San swings their staff instead!');
    doPhysicalAttack(tg);
    finishPlayerTurn();
    return;
  }
  
  G.p.mp -= actualCost;
  
  if (sk.buff) {
    switch (sk.buffType) {
      case 'defense':
        G.p.buffs.push({ n: sk.n, t: sk.buffTurns || 3, def: sk.buffVal || 4 });
        lg('🛡️ ' + sk.n + '! AC +' + (sk.buffVal || 4) + ' for ' + (sk.buffTurns || 3) + ' turns.');
        break;
      case 'haste':
        G.p.buffs.push({ n: sk.n, t: sk.buffTurns || 3, atk: sk.buffVal || 5 });
        lg('⚡ ' + sk.n + '! ATK +' + (sk.buffVal || 5) + ' for ' + (sk.buffTurns || 3) + ' turns.');
        break;
      case 'manaRestore':
        G.p.mp = Math.min(G.p.mmp, G.p.mp + (sk.buffVal || 20));
        lg('💧 ' + sk.n + '! Restored ' + (sk.buffVal || 20) + ' MP.');
        break;
      case 'fullRestore':
        G.p.hp = G.p.mhp;
        G.p.mp = G.p.mmp;
        lg('✨ ' + sk.n + '! Fully restored HP and MP.');
        break;
      case 'timeStop':
        for (let e of G.cbt.en) {
          if (e.hp <= 0) continue;
          e.status = e.status || [];
          if (!e.status.find(s => s.type === 'shock')) {
            e.status.push({ type: 'shock', turns: 1, chance: 1.0 });
          }
        }
        lg('⏳ TIME STOP! The world freezes — every foe loses their next turn!');
        break;
      default:
        lg('✨ ' + sk.n + ' shimmers, but nothing happens. (unconfigured buff)');
    }
    finishPlayerTurn();
    return;
  }
  
  if (isImmune(tg.n, sk.elem)) {
    lg('🛡️ ' + sk.n + ' has no effect — ' + tg.n + ' is immune to ' + sk.elem + '!');
    finishPlayerTurn();
    return;
  }
  
  const advInfo = getAttackAdvantage(G.p, tg, true);
  const eqStats2 = getEquippedStats();
  const senedraBonus = G.party.some(p => p.on && p.n === 'Senedra' && p.hp > 0) ? 2 : 0;
  const hasteBonus = getPlayerAtkBuff();
  const attackResult = DICE.attackRoll({
    attackerLevel: G.p.lvl,
    abilityScore: G.p.stats.int + eqStats2.int,
    proficiency: true,
    bonus: Math.floor((G.p.eq.weapon?.atk || 0) / 2) + eqStats2.atk + senedraBonus + hasteBonus,
    targetAC: getEnemyAC(tg),
    advantage: advInfo.advantage
  });
  
  lg('🎲 ' + sk.n + ': ' + attackResult.d20.roll + ' vs AC ' + attackResult.targetAC + ' = ' + (attackResult.hit ? 'HIT' : 'MISS'));
  
  if (advInfo.reasons.length > 0) {
    lg('   (' + advInfo.reasons.join(', ') + ')');
  }
  
  if (attackResult.isCrit) lg('   💥 CRITICAL HIT! The gods guide your hand!');
  else if (attackResult.isFumble) lg('   💀 CRITICAL MISS! Disaster!');
  else if (!attackResult.hit) {
    if (attackResult.margin >= -2) lg('   ❌ Close! The enemy deflects at the last moment.');
    else lg('   ❌ Solid defense. You\'ll need a better angle.');
  }
  
  if (!attackResult.hit) {
    finishPlayerTurn();
    return;
  }
  
  const weakMult = getWeaknessMultiplier(sk.elem, tg.elem);
  let isCrit = attackResult.isCrit;
  
  const synergyCritBonus = getSynergyCritBonus();
  if (!isCrit && Math.random() < synergyCritBonus) {
    isCrit = true;
    lg('✨ Synergy critical! ' + sk.n + ' strikes true!');
  }

  // Senedra's Storm's Mark: consume an existing mark on this target for a guaranteed crit.
  let senedraMarkConsumed = false;
  if (tg.senedraMarked) {
    senedraMarkConsumed = true;
    isCrit = true;
    tg.senedraMarked = false;
    lg("🎯 Senedra's mark strikes true — guaranteed critical!");
  }
  
  const soelBonus = G.party.some(p => p.on && p.n === 'Soel' && p.hp > 0) ? 1.10 : 1.0;
  const damageResult = DICE.damageRoll({
    diceExpr: sk.dmg,
    abilityScore: G.p.stats.int,
    isCrit: isCrit,
    bonus: (G.p.eq.weapon ? G.p.eq.weapon.atk : 0) + hasteBonus
  });
  
    let finalDamage = Math.floor(damageResult.total * soelBonus);

  // Senedra's Storm's Mark: a natural crit (not one from consuming a prior mark) has a
  // chance to mark the target — San's next hit against it is guaranteed to crit too.
  if (isCrit && !senedraMarkConsumed && isGrowthAbilityReady('Senedra')) {
    triggerGrowthAbility('Senedra');
    tg.senedraMarked = true;
    lg('🎯 Senedra marks ' + tg.n + ' — the next strike against it cannot miss its mark!');
  }

  // Aisyah's The Long Con: a critical hit is also an opening for her hand to find a
  // pocket. Chance to skim bonus gold straight off a crit.
  if (isCrit && isGrowthAbilityReady('Aisyah') && Math.random() < 0.4) {
    triggerGrowthAbility('Aisyah');
    const skimmed = Math.floor((tg.g || 10) * 0.5) + 10;
    G.p.gold += skimmed;
    lg('💰 Aisyah\'s hand is already in the enemy\'s pocket — +' + skimmed + 'G!');
  }
  
  // Apply weather damage modifiers
  finalDamage = applyWeatherDamage(finalDamage, sk.elem);

  if (soelBonus > 1) {
    lg('🐱 Soel\'s fortune smiles! +10% damage!');
  }

  // Mezstorm Storm Surge: +15% spell damage
  const mezstorm = G.party.find(p => p.on && p.n === 'Mezstorm' && p.hp > 0);
  if (mezstorm) {
    finalDamage = Math.floor(finalDamage * 1.15);
    lg('⚡ Mezstorm channels the storm! +15% spell damage!');
  }

  if (weakMult > 1) {
    finalDamage = Math.floor(finalDamage * weakMult);
    lg('⚡ ' + sk.elem + ' is super effective! ×' + weakMult);
  } else if (weakMult < 1) {
    finalDamage = Math.floor(finalDamage * weakMult);
    lg('⬇️ ' + sk.elem + ' is resisted! ×' + weakMult);
  }
  
    // Apply Planar Resonance (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    finalDamage = applyPlanarResonance(finalDamage, zone.n);
  }
  
  // Apply Dimensional Instability damage multiplier
  const riftDmgMult = getRiftMultiplier();
  if (riftDmgMult > 1) {
    finalDamage = Math.floor(finalDamage * riftDmgMult);
    lg('🌌 Rift surge! Damage ×' + riftDmgMult + '!');
  }
  finalDamage = applySynergyDamage(finalDamage, 'spell');
  finalDamage = Math.max(1, finalDamage);
  tg.hp -= finalDamage;
  
  const dmgFlavor = getDamageFlavor(finalDamage, isCrit);
  lg(dmgFlavor + ' ' + sk.n + ' deals ' + finalDamage + ' to ' + tg.n + '!');
  
  if (isCrit) {
    lg('   🎲 ' + damageResult.breakdown);
  }
  
  if (sk.status && tg.hp > 0) {
    const statusRoll = Math.random();
    if (statusRoll < sk.status.chance) {
      const existing = tg.status.find(s => s.type === sk.status.type);
      if (!existing) {
        tg.status.push({ ...sk.status, turns: sk.status.turns });
        lg('🔥 ' + tg.n + ' is ' + sk.status.type + 'ed!');
      }
    }
  }
  
  if (tg.hp <= 0) {
    tg.hp = 0;
    lg('💀 ' + tg.n + ' is defeated!');
    checkBountyKill(tg.n);
    trackBestiary(tg);
  }
  
  finishPlayerTurn();
}

function eturn() {
  // Mezstorm Arcane Conduit: +3 MP/turn for San
  const mezstorm = G.party.find(p => p.on && p.n === 'Mezstorm' && p.hp > 0);
    // Mana Spring Blessing: +20% MP regen
  const msBuff = G.p.buffs.find(b => b.n === 'Mana Spring Blessing');
  if (msBuff && msBuff.t > 0) {
    const bonusMp = Math.max(1, Math.floor(G.p.mmp * msBuff.mpRegenPct));
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + bonusMp);
    if (G.p.mp > oldMp) lg('💧 Mana Spring Blessing restores ' + (G.p.mp - oldMp) + ' bonus MP!');
  }
  if (mezstorm) {
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + 3);
    if (G.p.mp > oldMp) lg('⚡ Mezstorm shares arcane energy. +' + (G.p.mp - oldMp) + ' MP.');
  }
  // Soel's Spirit Warmth: 5% HP regen to all allies
  const soel = G.party.find(p => p.on && p.n === 'Soel' && p.hp > 0);
  if (soel) {
    const regen = Math.max(1, Math.floor(G.p.mhp * 0.05));
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + regen);
    if (G.p.hp > oldHp) lg('🐱 Soel purrs warmly. San +' + (G.p.hp - oldHp) + ' HP.');
    for (let p of G.party) {
      if (p.on && p.hp > 0 && p.n !== 'Soel') {
        const pRegen = Math.max(1, Math.floor(p.mhp * 0.05));
        const pOld = p.hp;
        p.hp = Math.min(p.mhp, p.hp + pRegen);
        if (p.hp > pOld) lg('🐱 Soel curls around ' + p.n + '. +' + (p.hp - pOld) + ' HP.');
      }
    }
  }
    applyVoidBleed(); // Phase 2: Void Bleed damage
  applyWeatherCombat(); // Weather system

  for (let e of G.cbt.en) {
    doEnemyAttack(e);
  }
  
  handleBossMechanics();
  handleZoneHazards();
  
  for (let b of G.p.buffs) b.t--;
  G.p.buffs = G.p.buffs.filter(b => b.t > 0);
  
  for (let p of G.party) { if (p.frozen) p.frozen = false; }
  if (G.p.frozen) G.p.frozen = false;
}

function getBestSkill() {
  const available = G.p.skills.filter(s => s.on && G.p.mp >= s.c && !s.buff);
  if (available.length === 0) return null;
  available.sort((a, b) => {
    const dmgA = DICE.parse(a.dmg).total || 0;
    const dmgB = DICE.parse(b.dmg).total || 0;
    return dmgB - dmgA;
  });
  return available[0];
}

function getWeakestEnemy() {
  const alive = G.cbt.en.filter(e => e.hp > 0);
  if (alive.length === 0) return null;
  alive.sort((a, b) => a.hp - b.hp);
  return alive[0];
}

function getEnemyIndex(enemy) {
  return G.cbt.en.findIndex(e => e === enemy);
}

function doAutoCombatTick() {
  if (!G.cbt.on || !G.cbt.autoCombat) return;
  
  G.autoCombatHeartbeat = Date.now();

  try {
    if (G.cbt.en.every(e => e.hp <= 0)) {
      G.cbt.autoCombat = false;
      G.autoCombatHeartbeat = 0;
      return;
    }
    
    if (G.p.hp <= 1) {
      G.cbt.autoCombat = false;
      G.cbt.autoFlee = true;
      G.autoCombatHeartbeat = 0;
      lg('🤖 Auto-combat: HP critical! Forcing retreat...');
      return;
    }
    
    const skill = getBestSkill();
    if (!skill) {
      const manaPot = G.p.inv.find(i => i.t === 'pot' && i.eff === 'mana');
      if (manaPot && G.p.mp < 20) {
        const idx = G.p.inv.indexOf(manaPot);
        useI(idx);
        lg('🤖 Auto-combat: Used Mana Potion!');
        setTimeout(doAutoCombatTick, 800);
        return;
      }
      
      lg('🤖 Auto-combat: No MP for attacks. Passing turn...');
      for (let p of G.party) {
        if (p.on && p.hp > 0) doPartyAttack(p);
      }
      
      if (G.cbt.en.every(e => e.hp <= 0)) { handleVictory(); return; }
      if (G.p.hp <= 0) { handleDefeat(); return; }
      
      G.cbt.turn++;
      render();
      setTimeout(doAutoCombatTick, 1000);
      return;
    }
    
    const target = getWeakestEnemy();
    if (!target) { G.cbt.autoCombat = false; G.autoCombatHeartbeat = 0; return; }
    
    const skillIdx = G.p.skills.indexOf(skill);
    const targetIdx = getEnemyIndex(target);
    G.cbt.sk = skillIdx;
    G.cbt.tg = targetIdx;
    
    lg('🤖 Auto-combat: ' + skill.n + ' → ' + target.n);
    pa(skillIdx, targetIdx);
    
    if (!G.cbt.on) { G.cbt.autoCombat = false; G.autoCombatHeartbeat = 0; return; }
    setTimeout(doAutoCombatTick, 1200);

  } catch (err) {
    // A boss mechanic or combat function threw mid-tick. Without this catch, the
    // exception happens *before* the setTimeout above runs, so the chain would
    // die silently and never recover on its own — this is what caused auto-combat
    // to freeze on harder fights until manually toggled off/on.
    console.error('Auto-combat tick error:', err);
    lg('🤖 Auto-combat: Recovered from an error mid-turn. Continuing...');
    if (G.cbt.on && G.cbt.autoCombat) {
      setTimeout(doAutoCombatTick, 1200);
    } else {
      G.autoCombatHeartbeat = 0;
    }
  }
}

// Independent watchdog — lives outside the tick chain itself, so it can restart
// auto-combat even if doAutoCombatTick's own setTimeout chain has fully died.
// Runs continuously at low cost; only acts when auto-combat should be running
// but hasn't ticked in a while.
setInterval(() => {
  if (!G.cbt.on || !G.cbt.autoCombat) return;
  const stale = G.autoCombatHeartbeat && (Date.now() - G.autoCombatHeartbeat > 4000);
  if (stale) {
    lg('🤖 Auto-combat: Watchdog detected a stalled loop. Restarting...');
    doAutoCombatTick();
  }
}, 2000);

function toggleAutoCombat() {
  if (!G.cbt.on) return;
  G.cbt.autoCombat = !G.cbt.autoCombat;
  if (G.cbt.autoCombat) {
    G.autoCombatHeartbeat = Date.now();
    lg('🤖 Auto-combat ENABLED!');
    doAutoCombatTick();
  } else {
    G.autoCombatHeartbeat = 0;
    lg('🤖 Auto-combat DISABLED. Manual control restored.');
  }
  render();
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  lg(next === 'light' ? '☀️ Switched to Light theme' : '🌙 Switched to Dark theme');
}

// Initialize theme immediately
initTheme();

let restTimer = null;

/* ========== IDLE SYSTEM ========== */
// Passive offline progression system
// Earns XP, gold, and materials while the game is closed

const IDLE_CONFIG = {
  maxOfflineHours: 8,           // Cap offline gains at 8 hours
  xpPerHour: 50,                // Base XP per hour
  goldPerHour: 15,              // Base gold per hour
  matChancePerHour: 0.3,        // 30% chance per hour to find a material
  matPool: [
    { n: 'Herb Bundle', t: 'mat', q: 1, r: 'common' },
    { n: 'Goblin Tooth', t: 'mat', q: 1, r: 'common' },
    { n: 'Iron Ore', t: 'mat', q: 1, r: 'common' },
    { n: 'Bone Shard', t: 'mat', q: 1, r: 'common' },
    { n: 'Crystal Shard', t: 'mat', q: 1, r: 'common' },
    { n: 'Fire Essence', t: 'mat', q: 1, r: 'uncommon' },
    { n: 'Ice Crystal', t: 'mat', q: 1, r: 'uncommon' },
    { n: 'Planar Essence', t: 'mat', q: 1, r: 'rare' },
    { n: 'Aether Shard', t: 'mat', q: 1, r: 'rare' },
    { n: 'Chrono Sand', t: 'mat', q: 1, r: 'epic' }
  ],
  zoneBonus: {
    'Whispering Woods': { xpMult: 1.0, goldMult: 1.0, mats: ['Herb Bundle','Goblin Tooth'] },
    'Cursed Catacombs': { xpMult: 1.2, goldMult: 1.1, mats: ['Bone Shard','Iron Ore'] },
    'Crystal Caverns': { xpMult: 1.4, goldMult: 1.2, mats: ['Crystal Shard','Gem Dust'] },
    'Ember Peak': { xpMult: 1.6, goldMult: 1.4, mats: ['Fire Essence','Obsidian'] },
    'Stormhold': { xpMult: 1.8, goldMult: 1.5, mats: ['Storm Core','Conductive Wire'] },
    'Frostspire Ruins': { xpMult: 2.0, goldMult: 1.7, mats: ['Ice Crystal','Frost Gem'] },
    'Sunken Temple': { xpMult: 2.2, goldMult: 1.9, mats: ['Pearl','Coral Branch'] },
    'Abyssal Depths': { xpMult: 2.5, goldMult: 2.2, mats: ['Void Essence','Dark Crystal'] },
    "Dragon's Maw": { xpMult: 3.0, goldMult: 2.5, mats: ['Dragon Scale','Wyrm Tooth'] },
    'Starlight Spire': { xpMult: 3.5, goldMult: 3.0, mats: ['Star Fragment','Celestial Dust'] },
    'Arcane Planar Tower': { xpMult: 4.0, goldMult: 3.5, mats: ['Planar Essence','Aether Shard','Chrono Sand'] }
  }
};

function getIdleZone() {
  // Determine the highest zone the player has unlocked based on level
  const unlockedZones = G.zones.filter(z => G.p.lvl >= z.lv);
  if (unlockedZones.length === 0) return G.zones[0];
  return unlockedZones[unlockedZones.length - 1];
}

function calculateIdleGains(offlineMinutes) {
  const hours = Math.min(offlineMinutes / 60, IDLE_CONFIG.maxOfflineHours);
  const zone = getIdleZone();
  const bonus = IDLE_CONFIG.zoneBonus[zone.n] || { xpMult: 1.0, goldMult: 1.0, mats: [] };

  // Scale with level
  const levelMult = 1 + (G.p.lvl * 0.1);

  const gains = {
    xp: Math.floor(IDLE_CONFIG.xpPerHour * hours * bonus.xpMult * levelMult),
    gold: Math.floor(IDLE_CONFIG.goldPerHour * hours * bonus.goldMult * levelMult),
    materials: [],
    hours: Math.floor(hours * 10) / 10, // Round to 1 decimal
    zone: zone.n
  };

  // Roll for materials
  const matRolls = Math.floor(hours);
  for (let i = 0; i < matRolls; i++) {
    if (Math.random() < IDLE_CONFIG.matChancePerHour) {
      const pool = bonus.mats.length > 0 ? bonus.mats : IDLE_CONFIG.matPool.map(m => m.n);
      const matName = pool[Math.floor(Math.random() * pool.length)];
      const matDef = IDLE_CONFIG.matPool.find(m => m.n === matName) || IDLE_CONFIG.matPool[0];
      gains.materials.push({ ...matDef });
    }
  }

  return gains;
}

function showIdleModal(gains) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'idle-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 14, 23, 0.92); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.4s ease;
  `;

  const matList = gains.materials.length > 0 
    ? gains.materials.map(m => `<span style="color:#a78bfa;">💎 ${m.n}</span>`).join('<br>')
    : '<span style="color:var(--disabled);">No materials found this time.</span>';

  modal.innerHTML = `
    <div style="
      background: var(--nav-bg); border: 2px solid #7c3aed; border-radius: 20px;
      padding: 28px; max-width: 360px; width: 100%; text-align: center;
      box-shadow: 0 0 40px #7c3aed40;
    ">
      <div style="font-size: 48px; margin-bottom: 8px;">💤</div>
      <div style="font-family: Cinzel, serif; font-size: 20px; font-weight: 700; color: #a78bfa; margin-bottom: 4px;">
        While You Were Away
      </div>
      <div style="font-size: 12px; color: #9ca3af; margin-bottom: 20px;">
        ${gains.hours} hour${gains.hours !== 1 ? 's' : ''} · ${gains.zone}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div style="background: var(--bg-hover); border-radius: 12px; padding: 14px;">
          <div style="font-size: 24px; font-weight: 700; color: #eab308;">+${gains.xp}</div>
          <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">XP</div>
        </div>
        <div style="background: var(--bg-hover); border-radius: 12px; padding: 14px;">
          <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">+${gains.gold}</div>
          <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">Gold</div>
        </div>
      </div>

      <div style="background: var(--bg-hover); border-radius: 12px; padding: 14px; margin-bottom: 20px; text-align: left;">
        <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 8px;">Materials Found</div>
        <div style="font-size: 13px; line-height: 1.8;">${matList}</div>
      </div>

      <button id="idle-claim" style="
        width: 100%; padding: 14px; border-radius: 12px; border: none;
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        color: white; font-size: 15px; font-weight: 700; cursor: pointer;
      ">Claim Rewards</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('idle-claim').addEventListener('click', () => {
    // Apply gains
    G.p.xp += gains.xp;
    G.p.gold += gains.gold;
    for (let mat of gains.materials) {
      addI({ ...mat });
    }

    lg('💤 Idle gains claimed: +' + gains.xp + ' XP, +' + gains.gold + 'G' + 
       (gains.materials.length > 0 ? ', ' + gains.materials.length + ' materials' : ''));

    lvlup();
    document.body.removeChild(modal);
    render();
  });
}

function checkIdleGains() {
  const lastActive = localStorage.getItem('ldb_last_active');
  if (!lastActive) return false;

  const now = Date.now();
  const last = parseInt(lastActive);
  const diffMinutes = Math.floor((now - last) / (1000 * 60));

  // Only show if away for at least 5 minutes
  if (diffMinutes < 5) return false;

  const gains = calculateIdleGains(diffMinutes);

  // Only show modal if there are meaningful gains
  if (gains.xp > 0 || gains.gold > 0 || gains.materials.length > 0) {
    showIdleModal(gains);
    return true;
  }

  return false;
}

function updateLastActive() {
  localStorage.setItem('ldb_last_active', Date.now().toString());
}

// Update last active time periodically
setInterval(updateLastActive, 60000); // Every minute
// Also update on page hide/show
window.addEventListener('beforeunload', function(e) {
  updateLastActive();
  if (G && (G.cbt?.on || G.rest?.active)) {
    e.preventDefault();
    e.returnValue = 'You are in combat or resting. Leave anyway?';
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    updateLastActive();
  } else {
    // Check for idle gains when returning
    setTimeout(checkIdleGains, 500);
  }
});


function getDeadParty() {
  return G.party.filter(p => p.hp <= 0);
}

function reviveMember(name) {
  const member = G.party.find(p => p.n === name);
  if(!member || member.hp > 0) return;
  if(G.p.gold < 50) { lg('❌ Need 50G to revive!'); return; }
  G.p.gold -= 50;
  member.hp = Math.floor(member.mhp * 0.5);
  member.on = true;
  lg('⛪ ' + member.n + ' revived! HP: ' + member.hp + '/' + member.mhp);
  render();
}

function hasHealer() {
  return G.party.some(p => p.on && p.r === 'Healer' && p.hp > 0);
}

function getBlessDef(t) {
  return (G.soelBlessing && t && t.n === G.soelBlessing.target) ? (G.soelBlessing.def || 0) : 0;
}

function soelBless(name) {
  if (G.soelBlessing) return;
  const m = G.party.find(p => p.n === name && p.on);
  if (!m) return;
  G.soelBlessing = { target: name, def: 10 };
  lg('🐱 Soel blesses ' + name + ' (+10 DEF until next rest).');
  render();
}

function getHealerName() {
  const h = G.party.find(p => p.on && p.r === 'Healer' && p.hp > 0);
  return h ? h.n : null;
}

function unlockRestSites() {
  let newly = false;
  for (let site of G.rest.sites) {
    if (!site.unlocked && G.p.lvl >= site.zoneLv) {
      site.unlocked = true;
      lg('🏕️ New rest site unlocked: ' + site.name + ' (' + site.zone + ')');
      newly = true;
    }
  }
  return newly;
}

function pickBanter(type, tense) {
  const pool = [];
  if (tense) {
    pool.push(...G.banter.tense);
  } else if (type === 'tavern' && Math.random() < 0.4) {
    pool.push(...G.banter.tavern);
  }
  const active = G.party.filter(p => p.on);
  if (active.length === 0 && !tense) {
    pool.push(...G.banter.solo);
  } else if (!tense) {
    for (let p of active) {
      const key = p.n.toLowerCase();
      if (G.banter[key]) pool.push(...G.banter[key]);
    }
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function showDialogue(dialogue) {
  if (!dialogue) return;
  G.currentDialogue = dialogue;
  lg('💬 ' + dialogue.speaker + ': ' + dialogue.text);
}

function showAmbushWarning(dialogue) {
  if (!dialogue) return;
  G.ambushWarning = dialogue;
  lg('⚠️ ' + dialogue.text);
}

function doRestTick() {
  const healAmt = Math.ceil(G.p.mhp / G.rest.maxTicks);
  const manaAmt = Math.ceil(G.p.mmp / G.rest.maxTicks);
  G.p.hp = Math.min(G.p.mhp, G.p.hp + healAmt);
  G.p.mp = Math.min(G.p.mmp, G.p.mp + manaAmt);
  for (let p of G.party) {
    if (p.on) {
      p.hp = Math.min(p.mhp, p.hp + Math.ceil(p.mhp / G.rest.maxTicks));
    }
  }
  const line = pickBanter(G.rest.selectedSite.type, false);
  if (line) showDialogue(line);
  render();
}

function startRest(siteId) {
  if (G.rest.active) return;
  const site = G.rest.sites.find(s => s.id === siteId);
  if (!site || !site.unlocked) {
    lg('That rest site is not available yet.');
    return;
  }
  
  // === MANA SPRING: No healer required ===
    if (site.type === 'mana_spring') {
    if (G.manaSpringUses.day !== G.gameDay) {
      G.manaSpringUses.day = G.gameDay;
      G.manaSpringUses.count = 0;
    }
    if (G.manaSpringUses.count >= 8) {
      lg('💧 You have reached your daily mana spring limit (8/day).');
      return;
    }
    if (G.p.gold < site.cost) {
      lg('❌ Not enough gold! ' + site.name + ' costs ' + site.cost + 'G.');
      return;
    }
    G.manaSpringUses.count++;
    const remaining = 8 - G.manaSpringUses.count;

    G.p.gold -= site.cost;
    
    // Full MP restore
    G.p.mp = G.p.mmp;
    for (let p of G.party) { if (p.on) p.mp = p.mmp || p.mhp; }
    
    // Bonus buff for 3 combats
    G.p.buffs.push({ n: 'Mana Spring Blessing', t: 3, mpRegenPct: 0.20 });
    
    // Small HP heal
    const hpHeal = Math.floor(G.p.mhp * 0.3);
    G.p.hp = Math.min(G.p.mhp, G.p.hp + hpHeal);
    for (let p of G.party) { if (p.on) p.hp = Math.min(p.mhp, p.hp + Math.floor(p.mhp * 0.3)); }
    
    lg('💧 You bathe in ' + site.name + '. MP fully restored! (' + remaining + ' uses left)');
    lg('✨ Mana Spring Blessing: +20% MP regen for 3 combats.');
    render();
    return;
  }
  
  // === TEMPLE: No healer required, instant service (pay and heal, no ticking ritual) ===
  if (site.type === 'temple') {
    if (G.p.gold < site.cost) {
      lg('❌ Not enough gold! Temple costs ' + site.cost + 'G.');
      return;
    }
    G.p.gold -= site.cost;
    G.rest.selectedSite = site;
    G.currentDialogue = null;
    G.potionMenu = false;
    G.ambushWarning = null;
    if (G.soelBlessing) {
      lg("🐱 Soel's blessing fades as you enter the temple.");
      G.soelBlessing = null;
    }
    if (G.joelReviveUsed) {
      G.joelReviveUsed = false;
      lg('💜 Joel steadies his shield. Unbreakable is ready again.');
    }
    G.growthAbilityUsed = {};

    lg('⛪ You step into the Temple of Resurrection...');
    G.p.hp = G.p.mhp;
    G.p.mp = G.p.mmp;
    for (let p of G.party) {
      if (p.on) p.hp = p.mhp;
    }
    G.p.buffs = G.p.buffs.filter(b => b.t > 0);
    lg('✨ The temple\'s light washes over you. Fully healed, fully restored.');
    for (let p of G.party) { if (p.on) updateAffinity(p.n, 2); }

    // Stronghold daily stipend, same as the regular rest path
    if (site.stronghold && G.strongholdStipendDay !== G.gameDay) {
      const strongholdId = Object.keys(STRONGHOLDS).find(id => STRONGHOLDS[id].restSiteIds.includes(site.id));
      const def = strongholdId ? STRONGHOLDS[strongholdId] : null;
      if (def && def.stipend) {
        G.strongholdStipendDay = G.gameDay;
        G.p.xp += def.stipend.xp;
        G.p.gold += def.stipend.gold;
        lg('🏰 The tower provides for you: +' + def.stipend.xp + ' XP, +' + def.stipend.gold + 'G.');
      }
    }

    G.rest.active = false;
    G.rest.selectedSite = null;
    G.rest.tick = 0;
    G.rest.ambushPending = false;
    render();
    return;
  }
  
  // === CAMP / TAVERN: Healer required ===
  if (!hasHealer()) {
    lg('❌ No healer in active party! You need a healer to rest safely.');
    return;
  }
  
  if (site.cost && G.p.gold < site.cost) {
    lg('❌ Not enough gold! ' + site.name + ' costs ' + site.cost + 'G.');
    return;
  }
  if (site.cost) {
    G.p.gold -= site.cost;
    lg('💰 Paid ' + site.cost + 'G for ' + site.name + '.');
  }
  G.rest.active = true;
  G.rest.selectedSite = site;
  G.rest.tick = 0;
  G.rest.ambushPending = false;
  G.currentDialogue = null;
  G.potionMenu = false;
  G.ambushWarning = null;
  if (G.soelBlessing) {
    lg("🐱 Soel's blessing on " + G.soelBlessing.target + " fades as the party makes camp.");
    G.soelBlessing = null;
  }
  if (G.joelReviveUsed) {
    G.joelReviveUsed = false;
    lg('💜 Joel steadies his shield. Unbreakable is ready again.');
  }
  G.growthAbilityUsed = {};
  const healerName = getHealerName();
  lg('💤 ' + healerName + ' begins the rest ritual at ' + site.name + '...');
  lg('🔥 Campfire lit. 5 ticks to full recovery.');
  doRestTick();
  G.rest.tick = 1;
  render();
  restTimer = setInterval(() => {
    if (!G.rest.active) {
      clearInterval(restTimer);
      restTimer = null;
      return;
    }
    const ambushChance = G.rest.selectedSite.type === 'tavern' ? 0.05 : 0.15;
    if (Math.random() < ambushChance && G.rest.tick < G.rest.maxTicks) {
      const tenseLine = pickBanter(G.rest.selectedSite.type, true);
      showAmbushWarning(tenseLine);
      clearInterval(restTimer);
      restTimer = null;
      G.rest.active = false;
      checkDailyQuests('rest', 1);
      G.rest.ambushPending = true;
      setTimeout(() => {
        G.rest.ambushPending = false;
        G.currentDialogue = null;
        G.ambushWarning = null;
        const zi = G.zones.findIndex(z => z.n === G.rest.selectedSite.zone);
        sc(zi >= 0 ? zi : 0);
        G.rest.selectedSite = null;
        G.rest.tick = 0;
      }, 1500);
      return;
    }
    doRestTick();
    G.rest.tick++;
    if (G.rest.tick >= G.rest.maxTicks) {
      clearInterval(restTimer);
      restTimer = null;
      completeRest();
    }
  }, G.rest.tickDuration);
}


function completeRest() {
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
  const healerName = getHealerName();
  G.p.hp = G.p.mhp;
  G.p.mp = G.p.mmp;
  for (let p of G.party) {
    if (p.on) p.hp = p.mhp;
  }
  G.p.buffs = G.p.buffs.filter(b => b.t > 0);
  G.currentDialogue = null;
  G.ambushWarning = null;
  const siteName = G.rest.selectedSite ? G.rest.selectedSite.name : 'camp';
  lg('✨ Rest complete at ' + siteName + '!');
  lg('💚 ' + healerName + ' has restored everyone to full health.');

  // Stronghold daily stipend — once per day, resting at a claimed stronghold site
  if (G.rest.selectedSite && G.rest.selectedSite.stronghold && G.strongholdStipendDay !== G.gameDay) {
    const strongholdId = Object.keys(STRONGHOLDS).find(id =>
      STRONGHOLDS[id].restSiteIds.includes(G.rest.selectedSite.id));
    const def = strongholdId ? STRONGHOLDS[strongholdId] : null;
    if (def && def.stipend) {
      G.strongholdStipendDay = G.gameDay;
      G.p.xp += def.stipend.xp;
      G.p.gold += def.stipend.gold;
      lg('🏰 The tower provides for you: +' + def.stipend.xp + ' XP, +' + def.stipend.gold + 'G.');
    }
  }
  // Affinity gain for resting together
  for (let p of G.party) { if (p.on) updateAffinity(p.n, 2); }
  // Track rest_with quest progress
  for(let q of G.quests){
    if(!q.done && !q.expired && q.t==='rest_with' && G.party.find(p=>p.on && p.n===q.reqParty)){
      q.c++;
      if(q.c>=q.need){
        q.done=true;
        G.p.xp+=q.rw.xp;
        G.p.gold+=q.rw.g;
        G.p.quests++;
        lg('Quest: '+q.n+'! +'+q.rw.xp+'XP +'+q.rw.g+'G');
        lvlup();
      }
    }
  }
  G.rest.active = false;
  G.rest.selectedSite = null;
  G.rest.tick = 0;
  G.rest.ambushPending = false;
  render();
}

function cancelRest() {
  if (!G.rest.active) return;
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
  const pct = G.rest.tick / G.rest.maxTicks;
  const hpRestore = Math.floor(G.p.mhp * pct * 0.5);
  const mpRestore = Math.floor(G.p.mmp * pct * 0.5);
  G.p.hp = Math.min(G.p.mhp, G.p.hp + hpRestore);
  G.p.mp = Math.min(G.p.mmp, G.p.mp + mpRestore);
  for (let p of G.party) {
    if (p.on) {
      p.hp = Math.min(p.mhp, p.hp + Math.floor(p.mhp * pct * 0.5));
    }
  }
  G.currentDialogue = null;
  G.ambushWarning = null;
  lg('⛔ Rest interrupted! Only partial recovery (' + Math.floor(pct * 100) + '%).');
  G.rest.active = false;
  G.rest.selectedSite = null;
  G.rest.tick = 0;
  G.rest.ambushPending = false;
  render();
}

function doExploreEvent() {
  // Filter: respect oncePerZone (track visited waterfalls per zone)
  if (!G.visitedWaterfalls) G.visitedWaterfalls = {};
  
  const possible = G.exploreEvents.filter(e => {
    if (Math.random() >= e.chance) return false;
    if (G.p.lvl < e.minLv) return false;
    if (e.oncePerZone && G.visitedWaterfalls[e.n + '_' + G.currentZone]) return false;
    return true;
  });
  
  if (possible.length === 0) return false;
  const evt = possible[Math.floor(Math.random() * possible.length)];
  
  lg('📖 EVENT: ' + evt.n + '!');
  lg('   ' + evt.d);
  
  // Mark as visited if oncePerZone
  if (evt.oncePerZone) {
    G.visitedWaterfalls[evt.n + '_' + G.currentZone] = true;
  }
  
  if (evt.gold) { G.p.gold += evt.gold; lg('💰 +' + evt.gold + 'G'); }
  if (evt.mp) { 
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + evt.mp); 
    const gained = G.p.mp - oldMp;
    if (gained > 0) lg('💧 +' + gained + ' MP from the falling waters!');
  }
  if (evt.hp) { 
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + evt.hp); 
    const gained = G.p.hp - oldHp;
    if (gained > 0) lg('💚 +' + gained + ' HP from the soothing mist!');
  }
  if (evt.item) { addI({...evt.item}); lg('🎁 Found: ' + evt.item.n); }
  if (evt.items) { for(let it of evt.items) { addI({...it}); lg('🎁 Found: ' + it.n); } }
  
  // Eliz reacts to waterfalls if in party
  if (G.party.some(p => p.on && p.n === 'Eliz')) {
    lg('💚 Eliz cups the water in her hands. "It sings," she whispers.');
  }
  
  return true;
}


// SECRET AREAS
function canDiscoverSecret(zoneName) {
  const hasSenedra = G.party.some(p => p.on && p.n === 'Senedra');
  if (!hasSenedra) return false;
  const active = G.party.filter(p => p.on && p.hp > 0).map(p => p.n);
  active.push('San');
  if (!active.includes('Soel')) return false;
  if (!G.secretAreas[zoneName]) return false;
  return true;
}

function discoverSecret(zoneName) {
  const area = G.secretAreas[zoneName];
  if (!area) return false;
  G.secretArea.active = true;
  G.secretArea.zone = zoneName;
  G.secretArea.choice = null;
  G.secretArea.result = null;
  G.state = 'secret';
  lg('🔍 SECRET AREA: ' + area.name + '!');
  lg('   ' + area.desc);
  render();
  return true;
}

function rollSecretLoot(zoneName, choiceId) {
  const area = G.secretAreas[zoneName];
  const choice = area.choices.find(c => c.id === choiceId);
  if (!choice) return null;
  const roll = Math.random();
  let rarity = 'common';
  if (roll < choice.loot.rare) rarity = 'rare';
  else if (roll < choice.loot.rare + choice.loot.uncommon) rarity = 'uncommon';
  const pool = area.lootPool.filter(l => l.r === rarity);
  if (pool.length === 0) return null;
  const totalWeight = pool.reduce((s, l) => s + (l.weight || 1), 0);
  let wRoll = Math.random() * totalWeight;
  for (let item of pool) {
    wRoll -= (item.weight || 1);
    if (wRoll <= 0) return { ...item, q: item.q || 1 };
  }
  return pool[0];
}

function makeSecretChoice(choiceId) {
  if (!G.secretArea.active) return;
  const story = G.secretArea;
  const area = G.secretAreas[story.zone];
  const choice = area.choices.find(c => c.id === choiceId);
  if (!choice) return;
  story.choice = choiceId;
  if (choice.ambushChance && Math.random() < choice.ambushChance) {
    story.result = 'ambush';
    lg('💥 Ambush! Enemies swarm from the shadows!');
    story.active = false;
    G.state = 'combat';
    render();
    return;
  }
  const loot = rollSecretLoot(story.zone, choiceId);
  story.result = loot ? 'loot' : 'empty';
  if (loot) {
    addI({ ...loot });
    lg('🎁 Found: ' + loot.n + ' (' + loot.r + ')!');
  } else {
    lg('📦 Empty...');
  }
  G.p.xp += 10;
  lg('✨ +10 XP');
  lvlup();
  render();
}

function closeSecretArea() {
  G.secretArea.active = false;
  G.secretArea.zone = null;
  G.secretArea.choice = null;
  G.secretArea.result = null;
  G.state = 'explore';
  render();
}


// SKILL TREES
function hasSpecEffect(name) {
  if (!G.playerSpec.path) return false;
  for (let tierIdx of G.playerSpec.tiers) {
    const tier = G.skillTrees[G.playerSpec.path].tiers[tierIdx];
    if (tier && tier.effects && tier.effects[name] !== undefined) return true;
  }
  return false;
}

function getSpecEffect(name) {
  if (!G.playerSpec.path) return 0;
  let total = 0;
  for (let tierIdx of G.playerSpec.tiers) {
    const tier = G.skillTrees[G.playerSpec.path].tiers[tierIdx];
    if (tier && tier.effects && tier.effects[name] !== undefined) {
      total += tier.effects[name];
    }
  }
  return total;
}

function canUnlockTier(tierIdx) {
  const path = G.skillTrees[G.playerSpec.path];
  if (!path) return false;
  const tier = path.tiers[tierIdx];
  if (!tier) return false;
  if (G.playerSpec.tiers.includes(tierIdx)) return false;
  if (G.p.lvl < tier.level) return false;
  if (tierIdx > 0 && !G.playerSpec.tiers.includes(tierIdx - 1)) return false;
  return true;
}

function unlockSpecTier(tierIdx) {
  if (!canUnlockTier(tierIdx)) return false;
  G.playerSpec.tiers.push(tierIdx);
  const path = G.skillTrees[G.playerSpec.path];
  const tier = path.tiers[tierIdx];
  lg('🔥 ' + path.icon + ' UNLOCKED: ' + tier.name + '!');
  lg('   ' + tier.desc);
  applySpecEffects();
  render();
  return true;
}

function chooseSpecPath(pathKey) {
  if (G.playerSpec.path) return false;
  if (!G.skillTrees[pathKey]) return false;
  G.playerSpec.path = pathKey;
  G.playerSpec.tiers = [];
  const path = G.skillTrees[pathKey];
  lg('🌳 SPECIALIZATION: ' + path.icon + ' ' + path.name + '!');
  lg('   ' + path.desc);
  render();
  return true;
}

function respecPath() {
  if (!G.playerSpec.path) return false;
  const cost = 50 + (G.playerSpec.respecCount * 50);
  if (G.p.gold < cost) { lg('❌ Need ' + cost + 'G to respec!'); return false; }
  G.p.gold -= cost;
  G.playerSpec.respecCount++;
  G.playerSpec.path = null;
  G.playerSpec.tiers = [];
  const fb = G.p.skills.find(s => s.n === 'Fireball'); if (fb) fb.c = 25;
  const ms = G.p.skills.find(s => s.n === 'Meteor Swarm'); if (ms) ms.c = 60;
  const ls = G.p.skills.find(s => s.n === 'Lightning Strike'); if (ls) ls.c = 35;
  lg('🔄 Respec complete! Cost: ' + cost + 'G');
  render();
  return true;
}

function applySpecEffects() {
  if (!G.playerSpec.path) return;
  const fb = G.p.skills.find(s => s.n === 'Fireball'); if (fb) fb.c = 25;
  const ms = G.p.skills.find(s => s.n === 'Meteor Swarm'); if (ms) ms.c = 60;
  const ls = G.p.skills.find(s => s.n === 'Lightning Strike'); if (ls) ls.c = 35;
  for (let tierIdx of G.playerSpec.tiers) {
    const tier = G.skillTrees[G.playerSpec.path].tiers[tierIdx];
    if (!tier || !tier.effects) continue;
    const eff = tier.effects;
    if (eff.fireballCostReduction && fb) fb.c = Math.max(5, 25 - eff.fireballCostReduction);
    if (eff.fireballCostReduction && ms) ms.c = Math.max(15, 60 - eff.fireballCostReduction);
    if (eff.lightningCostReduction && ls) ls.c = Math.max(10, 35 - eff.lightningCostReduction);
  }
}


// MINI-STORIES
function checkMiniStory(zoneName) {
  const seenCount = Object.keys(G.currentMiniStory?.completed || {}).length || 0;
  const adjustedChance = Math.max(0.02, 0.10 - (seenCount * 0.02));
  if (Math.random() > adjustedChance) return false;
  const eligible = G.miniStories.filter(story => {
    if (!story.zones.includes(zoneName)) return false;
    if (story.reqParty && !G.party.some(p => p.on && p.n === story.reqParty)) return false;
    if (G.currentMiniStory && G.currentMiniStory.completed && G.currentMiniStory.completed[story.id]) return false;
    return true;
  });
  if (eligible.length === 0) return false;
  const story = eligible[Math.floor(Math.random() * eligible.length)];
  G.currentMiniStory = { ...story, choice: null, result: null, completed: G.currentMiniStory?.completed || {} };
  G.state = 'ministory';
  lg('🗣️ ENCOUNTER: ' + story.name + ' — ' + story.title);
  render();
  return true;
}

function makeMiniStoryChoice(choiceIdx) {
  if (!G.currentMiniStory) return;
  const story = G.currentMiniStory;
  const choice = story.choices[choiceIdx];
  if (!choice) return;
  story.choice = choiceIdx;
  if (choice.req && !G.party.some(p => p.on && p.n === choice.req)) {
    lg('❌ Requires ' + choice.req + ' in party!'); return;
  }
  if (choice.cost) {
    if (choice.cost.gold && G.p.gold < choice.cost.gold) { lg('❌ Need ' + choice.cost.gold + 'G'); return; }
    if (choice.cost.item) {
      const item = G.p.inv.find(i => i.n === choice.cost.item);
      if (!item || item.q < (choice.cost.qty || 1)) { lg('❌ Missing: ' + choice.cost.item); return; }
    }
  }
  if (choice.cost) {
    if (choice.cost.gold) { G.p.gold -= choice.cost.gold; lg('💰 -' + choice.cost.gold + 'G'); }
    if (choice.cost.item) {
      const item = G.p.inv.find(i => i.n === choice.cost.item);
      if (item) { item.q -= (choice.cost.qty || 1); if (item.q <= 0) G.p.inv.splice(G.p.inv.indexOf(item), 1); }
    }
  }
  if (choice.reward) {
    if (choice.reward.xp) { G.p.xp += choice.reward.xp; lg('✨ +' + choice.reward.xp + ' XP'); }
    if (choice.reward.gold) { G.p.gold += choice.reward.gold; lg('💰 +' + choice.reward.gold + 'G'); }
    if (choice.reward.affinity) { updateAffinity(choice.reward.affinity, choice.reward.amt); }
    if (choice.reward.item) { addI({ ...choice.reward.item }); lg('🎁 +' + choice.reward.item.q + ' ' + choice.reward.item.n); }
  }
  if (choice.response) lg('   ' + choice.response);
  story.completed[story.id] = true;
  story.result = 'done';
  lvlup();
  render();
}

function closeMiniStory() {
  G.currentMiniStory = null;
  G.state = 'explore';
  render();
}


// ============================================================
// ENDLESS GRIND ROOM
// ============================================================

function enterGrindRoom() {
  G.endlessGrind.active = true;
  G.endlessGrind.wave = 0;
  G.endlessGrind.totalKills = 0;
  G.endlessGrind.totalXp = 0;
  G.endlessGrind.totalGold = 0;
  G.endlessGrind.sessionStart = Date.now();
  G.endlessGrind.maxZoneLevel = Math.max(1, G.p.lvl);
  G.state = 'grind_room';
  lg('🌀 Entered the Endless Grind Room!');
  lg('   Battles will auto-chain. Survive as long as you can.');
  startGrindWave();
  render();
}

function exitGrindRoom() {
  const elapsed = Math.floor((Date.now() - (G.endlessGrind.sessionStart || Date.now())) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  lg('🌀 Left the Grind Room.');
  lg('   Session: ' + mins + 'm ' + secs + 's | Waves: ' + G.endlessGrind.wave + ' | Kills: ' + G.endlessGrind.totalKills);
  lg('   Total XP: ' + G.endlessGrind.totalXp + ' | Total Gold: ' + G.endlessGrind.totalGold);
  G.endlessGrind.active = false;
  G.cbt.on = false;
  G.cbt.autoCombat = false;
  G.state = 'menu';
  render();
}

function leaveAndResetGrind() {
  // Fully reset grind state
  G.endlessGrind.active = false;
  G.endlessGrind.wave = 0;
  G.endlessGrind.totalKills = 0;
  G.endlessGrind.totalXp = 0;
  G.endlessGrind.totalGold = 0;
  G.endlessGrind.sessionStart = null;
  G.endlessGrind.autoNext = true;
  G.cbt.on = false;
  G.cbt.autoCombat = false;
  G.state = 'menu';
  lg('🚪 Left the Grind Room. Progress reset — you can start fresh with new settings.');
  render();
}

function startGrindWave() {
    // Allow starting wave even when active is false (between waves)
  
  G.endlessGrind.wave++;
  G.cbt.on = true;
  G.cbt.turn = 0;
  G.cbt.en = [];
  G.state = 'combat';
  G.currentBoss = null;
  
  const wave = G.endlessGrind.wave;
  const playerLv = G.p.lvl;
  const diffMult = G.endlessGrind.difficultyMult[G.endlessGrind.difficulty] || 1.0;
  const maxZoneLv = Math.min(playerLv, Math.floor(wave / 3) + 1);
  const eligibleZones = G.zones.filter(z => z.lv <= maxZoneLv);
  const zone = eligibleZones[Math.floor(Math.random() * eligibleZones.length)] || G.zones[0];
  const baseCount = Math.floor(Math.random() * 2) + 1 + Math.floor(wave / 5);
  const enemyCount = Math.min(baseCount, 5);
  
  rollWeather();
  applyZoneBuffs(zone.n);
  checkDimensionalInstability();
  
  for (let i = 0; i < enemyCount; i++) {
    const enemyName = zone.en[Math.floor(Math.random() * zone.en.length)];
    let e = { n: enemyName, hp: 0, mhp: 0, atk: 0, def: 0, xp: 0, g: 0, elem: 'none', id: i, status: [] };
    
    const dynamicStats = getDynamicEnemyStats(enemyName);
    if (dynamicStats) {
      e = { ...e, ...dynamicStats };
    } else {
      const waveScale = 1 + (wave - 1) * 0.08;
      if (enemyName == 'Goblin') e = { ...e, hp: 25, mhp: 25, atk: 5, def: 2, xp: 12, g: 5, elem: 'none' };
      else if (enemyName == 'Wolf') e = { ...e, hp: 20, mhp: 20, atk: 7, def: 1, xp: 10, g: 3 };
      else if (enemyName == 'Slime') e = { ...e, hp: 15, mhp: 15, atk: 3, def: 3, xp: 8, g: 2 };
      else if (enemyName == 'Skeleton') e = { ...e, hp: 39, mhp: 39, atk: 6, def: 3, xp: 20, g: 14, elem: 'none' };
      else if (enemyName == 'Zombie') e = { ...e, hp: 44, mhp: 44, atk: 4, def: 4, xp: 20, g: 12, elem: 'none' };
      else if (enemyName == 'Ghost') e = { ...e, hp: 25, mhp: 25, atk: 8, def: 2, xp: 22, g: 15, elem: 'none' };
      else if (enemyName == 'Crystal Spider') e = { ...e, hp: 30, mhp: 30, atk: 10, def: 3, xp: 24, g: 17, elem: 'none' };
      else if (enemyName == 'Gem Golem') e = { ...e, hp: 60, mhp: 60, atk: 5, def: 6, xp: 20, g: 15, elem: 'none' };
      else if (enemyName == 'Shimmer Bat') e = { ...e, hp: 51, mhp: 51, atk: 8, def: 4, xp: 20, g: 14, elem: 'none' };
      else if (enemyName == 'Fire Imp') e = { ...e, hp: 34, mhp: 34, atk: 12, def: 3, xp: 26, g: 19, elem: 'fire' };
      else if (enemyName == 'Lava Slug') e = { ...e, hp: 61, mhp: 61, atk: 5, def: 5, xp: 24, g: 17, elem: 'fire' };
      else if (enemyName == 'Ash Wraith') e = { ...e, hp: 51, mhp: 51, atk: 8, def: 4, xp: 24, g: 14, elem: 'fire' };
      else if (enemyName == 'Storm Wraith') e = { ...e, hp: 63, mhp: 63, atk: 10, def: 6, xp: 28, g: 21, elem: 'lightning' };
      else if (enemyName == 'Lightning Hound') e = { ...e, hp: 36, mhp: 36, atk: 17, def: 3, xp: 30, g: 23, elem: 'lightning' };
      else if (enemyName == 'Thunder Knight') e = { ...e, hp: 58, mhp: 58, atk: 13, def: 5, xp: 36, g: 23, elem: 'lightning' };
      else if (enemyName == 'Ice Elemental') e = { ...e, hp: 82, mhp: 82, atk: 7, def: 8, xp: 28, g: 21, elem: 'ice' };
      else if (enemyName == 'Frost Wolf') e = { ...e, hp: 46, mhp: 46, atk: 18, def: 4, xp: 33, g: 25, elem: 'ice' };
      else if (enemyName == 'Frozen Knight') e = { ...e, hp: 74, mhp: 74, atk: 14, def: 6, xp: 39, g: 25, elem: 'ice' };
      else if (enemyName == 'Drowned Sailor') e = { ...e, hp: 75, mhp: 75, atk: 12, def: 7, xp: 32, g: 26, elem: 'none' };
      else if (enemyName == 'Sea Serpent') e = { ...e, hp: 42, mhp: 42, atk: 21, def: 4, xp: 35, g: 29, elem: 'none' };
      else if (enemyName == 'Coral Golem') e = { ...e, hp: 90, mhp: 90, atk: 9, def: 9, xp: 32, g: 23, elem: 'none' };
      else if (enemyName == 'Void Beast') e = { ...e, hp: 48, mhp: 48, atk: 24, def: 5, xp: 39, g: 31, elem: 'void' };
      else if (enemyName == 'Shadow Demon') e = { ...e, hp: 87, mhp: 87, atk: 13, def: 7, xp: 36, g: 26, elem: 'void' };
      else if (enemyName == 'Abyssal Horror') e = { ...e, hp: 70, mhp: 70, atk: 16, def: 7, xp: 46, g: 33, elem: 'void' };
      else if (enemyName == 'Dragon Whelp') e = { ...e, hp: 99, mhp: 99, atk: 14, def: 8, xp: 40, g: 30, elem: 'fire' };
      else if (enemyName == 'Ash Drake') e = { ...e, hp: 55, mhp: 55, atk: 25, def: 5, xp: 44, g: 35, elem: 'fire' };
      else if (enemyName == 'Elder Wyrm') e = { ...e, hp: 89, mhp: 89, atk: 19, def: 7, xp: 52, g: 35, elem: 'fire' };
      else if (enemyName == 'Star Sentinel') e = { ...e, hp: 111, mhp: 111, atk: 15, def: 9, xp: 44, g: 32, elem: 'arcane' };
      else if (enemyName == 'Celestial Knight') e = { ...e, hp: 100, mhp: 100, atk: 21, def: 8, xp: 57, g: 39, elem: 'arcane' };
      else if (enemyName == 'Astral Lord') e = { ...e, hp: 100, mhp: 100, atk: 21, def: 8, xp: 57, g: 39, elem: 'arcane' };
      else if (enemyName == 'Planar Wisp') e = { ...e, hp: 123, mhp: 123, atk: 16, def: 10, xp: 48, g: 34, elem: 'arcane' };
      else if (enemyName == 'Rift Stalker') e = { ...e, hp: 68, mhp: 68, atk: 28, def: 6, xp: 53, g: 38, elem: 'arcane' };
      else if (enemyName == 'Aether Golem') e = { ...e, hp: 148, mhp: 148, atk: 10, def: 12, xp: 48, g: 31, elem: 'arcane' };
      else if (enemyName == 'Chronomancer') e = { ...e, hp: 119, mhp: 119, atk: 20, def: 9, xp: 62, g: 40, elem: 'arcane' };
      else if (enemyName == 'Void Weaver') e = { ...e, hp: 68, mhp: 68, atk: 28, def: 6, xp: 53, g: 38, elem: 'void' };
      else if (enemyName == 'Planar Leviathan') e = { ...e, hp: 119, mhp: 119, atk: 20, def: 9, xp: 62, g: 40, elem: 'arcane' };
      else if (enemyName == 'Veil Wraith') e = { ...e, hp: 135, mhp: 135, atk: 18, def: 11, xp: 52, g: 36, elem: 'arcane' };
      else if (enemyName == 'Shardling') e = { ...e, hp: 75, mhp: 75, atk: 31, def: 7, xp: 57, g: 40, elem: 'arcane' };
      else if (enemyName == 'Echo Walker') e = { ...e, hp: 135, mhp: 135, atk: 18, def: 11, xp: 52, g: 36, elem: 'arcane' };
      else if (enemyName == 'Ember Drake') e = { ...e, hp: 82, mhp: 82, atk: 34, def: 7, xp: 62, g: 44, elem: 'fire' };
      else if (enemyName == 'Ash Titan') e = { ...e, hp: 185, mhp: 185, atk: 11, def: 14, xp: 56, g: 38, elem: 'fire' };
      else if (enemyName == 'Flame Serpent') e = { ...e, hp: 123, mhp: 123, atk: 19, def: 10, xp: 56, g: 36, elem: 'fire' };
      else if (enemyName == 'Frost Lich') e = { ...e, hp: 148, mhp: 148, atk: 23, def: 10, xp: 72, g: 46, elem: 'ice' };
      else if (enemyName == 'Glacial Behemoth') e = { ...e, hp: 205, mhp: 205, atk: 11, def: 15, xp: 62, g: 40, elem: 'ice' };
      else if (enemyName == 'Snow Revenant') e = { ...e, hp: 147, mhp: 147, atk: 19, def: 11, xp: 62, g: 40, elem: 'ice' };
      else if (enemyName == 'Storm Titan') e = { ...e, hp: 216, mhp: 216, atk: 13, def: 16, xp: 68, g: 44, elem: 'lightning' };
      else if (enemyName == 'Lightning Wraith') e = { ...e, hp: 96, mhp: 96, atk: 37, def: 8, xp: 75, g: 50, elem: 'lightning' };
      else if (enemyName == 'Thunderborn') e = { ...e, hp: 156, mhp: 156, atk: 24, def: 11, xp: 78, g: 50, elem: 'lightning' };
      else if (enemyName == 'Void Leviathan') e = { ...e, hp: 172, mhp: 172, atk: 26, def: 12, xp: 83, g: 54, elem: 'void' };
      else if (enemyName == 'Null Elemental') e = { ...e, hp: 123, mhp: 123, atk: 19, def: 11, xp: 64, g: 44, elem: 'void' };
      else if (enemyName == 'Hungering Maw') e = { ...e, hp: 222, mhp: 222, atk: 13, def: 16, xp: 68, g: 40, elem: 'void' };
      else if (enemyName == 'Time Echo') e = { ...e, hp: 135, mhp: 135, atk: 21, def: 12, xp: 68, g: 46, elem: 'arcane' };
      else if (enemyName == 'Chronomancer Lord') e = { ...e, hp: 174, mhp: 174, atk: 26, def: 12, xp: 88, g: 56, elem: 'arcane' };
      else if (enemyName == 'Paradox Wraith') e = { ...e, hp: 107, mhp: 107, atk: 41, def: 9, xp: 77, g: 52, elem: 'arcane' };
      else if (enemyName == 'Aether Bloom') e = { ...e, hp: 147, mhp: 147, atk: 22, def: 12, xp: 72, g: 48, elem: 'arcane' };
      else if (enemyName == 'Mana Leviathan') e = { ...e, hp: 240, mhp: 240, atk: 14, def: 17, xp: 72, g: 44, elem: 'arcane' };
      else if (enemyName == 'Crystal Serpent') e = { ...e, hp: 117, mhp: 117, atk: 43, def: 9, xp: 81, g: 54, elem: 'arcane' };
      else if (enemyName == 'Convergence Avatar') e = { ...e, hp: 196, mhp: 196, atk: 29, def: 13, xp: 94, g: 60, elem: 'arcane' };
      else if (enemyName == 'Planar Chimera') e = { ...e, hp: 159, mhp: 159, atk: 22, def: 13, xp: 76, g: 50, elem: 'arcane' };
      else if (enemyName == 'Resonance Horror') e = { ...e, hp: 126, mhp: 126, atk: 46, def: 10, xp: 85, g: 56, elem: 'arcane' };
      else if (enemyName == 'Nexus Guardian') e = { ...e, hp: 264, mhp: 264, atk: 15, def: 18, xp: 80, g: 48, elem: 'arcane' };
      else if (enemyName == 'Planar Titan') e = { ...e, hp: 214, mhp: 214, atk: 31, def: 14, xp: 100, g: 64, elem: 'arcane' };
      else if (enemyName == 'Astral Construct') e = { ...e, hp: 140, mhp: 140, atk: 22, def: 10, xp: 55, g: 38, elem: 'arcane' };
      else if (enemyName == 'Void Hound') e = { ...e, hp: 85, mhp: 85, atk: 32, def: 6, xp: 58, g: 42, elem: 'void' };
      else if (enemyName == 'Phase Walker') e = { ...e, hp: 110, mhp: 110, atk: 24, def: 9, xp: 52, g: 36, elem: 'arcane' };
      else if (enemyName == 'Rift Rat') e = { ...e, hp: 60, mhp: 60, atk: 28, def: 4, xp: 45, g: 30, elem: 'void' };
      else if (enemyName == 'Ash Phantom') e = { ...e, hp: 95, mhp: 95, atk: 30, def: 7, xp: 55, g: 38, elem: 'fire' };
      else if (enemyName == 'Magma Titan') e = { ...e, hp: 200, mhp: 200, atk: 14, def: 15, xp: 60, g: 42, elem: 'fire' };
      else e = { ...e, hp: 30, mhp: 30, atk: 6, def: 2, xp: 12, g: 5, elem: 'none' };
      
      e.hp = Math.floor(e.hp * waveScale * diffMult);
      e.mhp = e.hp;
      e.atk = Math.floor(e.atk * waveScale * diffMult);
      e.def = Math.floor(e.def * waveScale);
      e.xp = Math.floor(e.xp * waveScale);
      e.g = Math.floor(e.g * waveScale);
    }
    
    G.cbt.en.push(e);
  }
  
  if (wave % 10 === 0 && wave > 0) {
    const bossPool = G.bosses.filter(b => {
      const zone = G.zones.find(z => z.n === b.zone);
      return zone && zone.lv <= maxZoneLv;
    });
    if (bossPool.length > 0) {
      const boss = JSON.parse(JSON.stringify(bossPool[Math.floor(Math.random() * bossPool.length)]));
      boss.id = 99;
      boss.hp = Math.floor(boss.hp * diffMult * (1 + (wave / 50)));
      boss.mhp = boss.hp;
      boss.atk = Math.floor(boss.atk * diffMult * (1 + (wave / 50)));
      G.currentBoss = boss;
      G.cbt.en.push(boss);
      lg('⚠️ BOSS WAVE ' + wave + ': ' + boss.n + ' appears!');
    }
  }
  
  lg('🌀 Wave ' + wave + ': ' + enemyCount + ' enemies from ' + zone.n + '!');
  G.cbt.sk = 0;
  G.cbt.tg = 0;
  
  if (G.endlessGrind.autoNext && !G.cbt.autoCombat) {
    G.cbt.autoCombat = true;
    G.autoCombatHeartbeat = Date.now();
    setTimeout(doAutoCombatTick, 500);
  }
  
  triggerSoelCommentary('explore');
  checkSoelFortune();
  render();
}

function handleGrindVictory() {
  clearZoneBuffs();
  let txp = G.cbt.en.reduce((s, e) => s + e.xp, 0);
  let tg2 = G.cbt.en.reduce((s, e) => s + e.g, 0);
  const goldBonus = getSynergyGoldBonus();
  if (goldBonus > 0) tg2 = Math.floor(tg2 * (1 + goldBonus));

  // Permanent Championship tier bonus (earned by best-ever wave reached)
  const tierBonus = getGrindTierBonus();
  if (tierBonus > 0) {
    txp = Math.floor(txp * (1 + tierBonus));
    tg2 = Math.floor(tg2 * (1 + tierBonus));
  }
  
  G.p.xp += txp;
  G.p.gold += tg2;
  checkDailyQuests('earn_gold', tg2);
  G.p.kills += G.cbt.en.length;
  checkDailyQuests('kill', G.cbt.en.length);
  if (G.party.filter(p => p.on).length >= 3) checkDailyQuests('full_party_battle', 1);
  
  G.endlessGrind.totalKills += G.cbt.en.length;
  G.endlessGrind.totalXp += txp;
  G.endlessGrind.totalGold += tg2;
  
  if (G.currentBoss) G.p.bossKills = (G.p.bossKills || 0) + 1;
  if (G.p.hp === 1) G.p.survivedCritical = true;
  checkAchievements();
  checkGrindTierRewards();
  
  lg('🎉 Wave ' + G.endlessGrind.wave + ' cleared! +' + txp + ' XP, +' + tg2 + 'G');
  lvlup();
  checkQ();
  
  const z = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (z) {
    const l = z.loot[Math.floor(Math.random() * z.loot.length)];
    addI({ n: l, t: 'mat', q: 1, r: 'common' });
    if (Math.random() < 0.5) addLootFromCombat(z.n);
    addRuneLoot(z.n);
  }
  
  for (let p of G.party) { if (p.on && p.hp > 0) updateAffinity(p.n, 1); }
  
  const aisyahQuest = G.quests.find(q => q.t === 'aisyah_battle' && !q.done);
  if (aisyahQuest && G.party.find(p => p.on && p.n === 'Aisyah')) {
    aisyahQuest.c += G.cbt.en.length;
    if (aisyahQuest.c >= aisyahQuest.need) checkQ();
  }
  
  const joelQuest = G.quests.find(q => q.t === 'joel_battle' && !q.done);
  if (joelQuest && G.party.find(p => p.on && p.n === 'Joel')) {
    joelQuest.c += G.cbt.en.length;
    if (joelQuest.c >= joelQuest.need) checkQ();
  }
  
  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t === 'kill_specific') {
      const killedInThisFight = G.cbt.en.filter(e => e.hp <= 0 && e.n === q.target).length;
      if (killedInThisFight > 0) {
        q.c += killedInThisFight;
        if (q.c >= q.need) checkQ();
      }
    }
    if (q.t === 'boss_specific' && G.currentBoss && G.currentBoss.n === q.target) {
      q.c++;
      if (q.c >= q.need) checkQ();
    }
  }
  
  G.currentBoss = null;
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  
  if (G.endlessGrind.autoNext) {
    lg('⏳ Next wave incoming...');
    setTimeout(() => {
      if (G.endlessGrind.active) startGrindWave();
    }, 1500);
  } else {
    G.state = 'grind_room';
  }
  
  render();
}

function toggleGrindDifficulty() {
  const diffs = ['normal', 'hard', 'nightmare'];
  const idx = diffs.indexOf(G.endlessGrind.difficulty);
  G.endlessGrind.difficulty = diffs[(idx + 1) % diffs.length];
  lg('🌀 Difficulty: ' + G.endlessGrind.difficulty.toUpperCase() + ' (×' + G.endlessGrind.difficultyMult[G.endlessGrind.difficulty] + ')');
  render();
}

function toggleAutoNext() {
  G.endlessGrind.autoNext = !G.endlessGrind.autoNext;
  lg('🌀 Auto-next wave: ' + (G.endlessGrind.autoNext ? 'ON' : 'OFF'));
  render();
}

const _originalHandleVictory = handleVictory;
handleVictory = function() {
  if (G.endlessGrind.active) handleGrindVictory();
  else _originalHandleVictory();
};

const _originalHandleDefeat = handleDefeat;
handleDefeat = function() {
  if (G.endlessGrind.active) {
    if (checkSecondWind()) { render(); return; }
    lg('💀 GRIND ROOM DEFEAT! You fell at wave ' + G.endlessGrind.wave + '!');
    lg('   Final: ' + G.endlessGrind.totalKills + ' kills | ' + G.endlessGrind.totalXp + ' XP | ' + G.endlessGrind.totalGold + 'G');
    G.p.hp = 1;
    for (let p of G.party) { if (p.hp <= 0) { p.hp = 1; p.on = true; } }
    G.cbt.autoCombat = false;
    G.cbt.on = false;
    G.endlessGrind.active = false;
    G.state = 'menu';
    render();
  } else {
    _originalHandleDefeat();
  }
};

const _originalHandleVictoryForRaid = handleVictory;
handleVictory = function() {
  if (G.raid.active) handleRaidVictory();
  else _originalHandleVictoryForRaid();
};

const _originalHandleDefeatForRaid = handleDefeat;
handleDefeat = function() {
  if (G.raid.active) {
    if (checkSecondWind()) { render(); return; }
    const raid = getRaidById(G.raid.raidId);
    lg('💀 RAID FAILED at stage ' + (G.raid.stageIndex + 1) + '/' + (raid ? raid.stages.length : '?') + ' of ' + (raid ? raid.name : 'the raid') + '.');
    lg('   No progress carries over — the gauntlet resets from stage 1 next attempt.');
    G.p.hp = 1;
    for (let p of G.party) { if (p.hp <= 0) { p.hp = 1; p.on = true; } }
    G.cbt.autoCombat = false;
    G.cbt.on = false;
    G.raid.active = false;
    G.raid.raidId = null;
    G.raid.stageIndex = 0;
    G.state = 'menu';
    render();
  } else {
    _originalHandleDefeatForRaid();
  }
};

function sc(zi) {
  const z=G.zones[zi];
  // 30% chance for explore event before combat
  if(Math.random() < 0.3 && doExploreEvent()) {
    G.state='explore';
    render();
    return;
  }
  checkNPCUnlocks();
  if (Math.random() < 0.15 && canDiscoverSecret(z.n)) {
    if (discoverSecret(z.n)) return;
  }
  if (checkMiniStory(z.n)) return;
    // Check zone-based journal unlocks
  for (let entry of G.storyJournal.entries) {
    if (entry.unlockType === 'zone' && z.n === entry.unlockAt && !G.storyJournal.unlocked.includes(entry.id)) {
      G.storyJournal.unlocked.push(entry.id);
      lg('📖 Journal unlocked: ' + entry.title + '!');
    }
  }
  G.cbt.on=true; G.cbt.turn=0; G.cbt.en=[]; G.state='combat';
    checkDimensionalInstability(); // Phase 2: Dimensional Instability
  
  // === WEATHER SYSTEM ===
  rollWeather();
  
  applyZoneBuffs(z.n); // STAGE 3: Apply zone buffs
  
  // Boss fight: only when player is 2+ levels above zone minimum
  const bossChance = Math.random();
  let isBoss = false;
  if (bossChance < 0.08 && G.p.lvl >= z.lv + 2) {
    const boss = G.bosses.find(b => b.zone === z.n);
    if (boss) {
      isBoss = true;
      G.currentBoss = JSON.parse(JSON.stringify(boss));
      G.currentBoss.id = 99;
      G.cbt.en.push(G.currentBoss);
      lg('⚠️ BOSS APPEARS: ' + boss.n + '!');
      lg('   ' + boss.desc);
    }
  }

  if (!isBoss) {
    const ec=Math.floor(Math.random()*2)+1+Math.floor(z.lv/3);
    for(let i=0;i<ec;i++){
      const t=z.en[Math.floor(Math.random()*z.en.length)];
    let e={n:t,hp:0,mhp:0,atk:0,def:0,xp:0,g:0};
        // Check dynamic scaling first (Lv 21+ enemies)
    const dynamicStats = getDynamicEnemyStats(t);
    if (dynamicStats) {
      e = { ...e, ...dynamicStats };
    }
    // Existing hardcoded enemies (Lv 1-20)
    else if(t=='Goblin')e={...e,hp:25,mhp:25,atk:5,def:2,xp:12,g:5,elem:'none'};
    else if(t=='Wolf')e={...e,hp:20,mhp:20,atk:7,def:1,xp:10,g:3};
    else if(t=='Slime')e={...e,hp:15,mhp:15,atk:3,def:3,xp:8,g:2};
        else if(t=='Skeleton')e={...e,hp:39,mhp:39,atk:6,def:3,xp:20,g:14,elem:'none'};
    else if(t=='Zombie')e={...e,hp:44,mhp:44,atk:4,def:4,xp:20,g:12,elem:'none'};
    else if(t=='Ghost')e={...e,hp:25,mhp:25,atk:8,def:2,xp:22,g:15,elem:'none'};
    else if(t=='Crystal Spider')e={...e,hp:30,mhp:30,atk:10,def:3,xp:24,g:17,elem:'none'};
    else if(t=='Gem Golem')e={...e,hp:60,mhp:60,atk:5,def:6,xp:20,g:15,elem:'none'};
    else if(t=='Shimmer Bat')e={...e,hp:51,mhp:51,atk:8,def:4,xp:20,g:14,elem:'none'};
    else if(t=='Fire Imp')e={...e,hp:34,mhp:34,atk:12,def:3,xp:26,g:19,elem:'fire'};
    else if(t=='Lava Slug')e={...e,hp:61,mhp:61,atk:5,def:5,xp:24,g:17,elem:'fire'};
    else if(t=='Ash Wraith')e={...e,hp:51,mhp:51,atk:8,def:4,xp:24,g:14,elem:'fire'};
    else if(t=='Storm Wraith')e={...e,hp:63,mhp:63,atk:10,def:6,xp:28,g:21,elem:'lightning'};
    else if(t=='Lightning Hound')e={...e,hp:36,mhp:36,atk:17,def:3,xp:30,g:23,elem:'lightning'};
    else if(t=='Thunder Knight')e={...e,hp:58,mhp:58,atk:13,def:5,xp:36,g:23,elem:'lightning'};
    else if(t=='Ice Elemental')e={...e,hp:82,mhp:82,atk:7,def:8,xp:28,g:21,elem:'ice'};
    else if(t=='Frost Wolf')e={...e,hp:46,mhp:46,atk:18,def:4,xp:33,g:25,elem:'ice'};
    else if(t=='Frozen Knight')e={...e,hp:74,mhp:74,atk:14,def:6,xp:39,g:25,elem:'ice'};
    else if(t=='Drowned Sailor')e={...e,hp:75,mhp:75,atk:12,def:7,xp:32,g:26,elem:'none'};
    else if(t=='Sea Serpent')e={...e,hp:42,mhp:42,atk:21,def:4,xp:35,g:29,elem:'none'};
    else if(t=='Coral Golem')e={...e,hp:90,mhp:90,atk:9,def:9,xp:32,g:23,elem:'none'};
    else if(t=='Void Beast')e={...e,hp:48,mhp:48,atk:24,def:5,xp:39,g:31,elem:'void'};
    else if(t=='Shadow Demon')e={...e,hp:87,mhp:87,atk:13,def:7,xp:36,g:26,elem:'void'};
    else if(t=='Abyssal Horror')e={...e,hp:70,mhp:70,atk:16,def:7,xp:46,g:33,elem:'void'};
    else if(t=='Dragon Whelp')e={...e,hp:99,mhp:99,atk:14,def:8,xp:40,g:30,elem:'fire'};
    else if(t=='Ash Drake')e={...e,hp:55,mhp:55,atk:25,def:5,xp:44,g:35,elem:'fire'};
    else if(t=='Elder Wyrm')e={...e,hp:89,mhp:89,atk:19,def:7,xp:52,g:35,elem:'fire'};
    else if(t=='Star Sentinel')e={...e,hp:111,mhp:111,atk:15,def:9,xp:44,g:32,elem:'arcane'};
    else if(t=='Celestial Knight')e={...e,hp:100,mhp:100,atk:21,def:8,xp:57,g:39,elem:'arcane'};
    else if(t=='Astral Lord')e={...e,hp:100,mhp:100,atk:21,def:8,xp:57,g:39,elem:'arcane'};
    else if(t=='Planar Wisp')e={...e,hp:123,mhp:123,atk:16,def:10,xp:48,g:34,elem:'arcane'};
    else if(t=='Rift Stalker')e={...e,hp:68,mhp:68,atk:28,def:6,xp:53,g:38,elem:'arcane'};
    else if(t=='Aether Golem')e={...e,hp:148,mhp:148,atk:10,def:12,xp:48,g:31,elem:'arcane'};
    else if(t=='Chronomancer')e={...e,hp:119,mhp:119,atk:20,def:9,xp:62,g:40,elem:'arcane'};
    else if(t=='Void Weaver')e={...e,hp:68,mhp:68,atk:28,def:6,xp:53,g:38,elem:'void'};
    else if(t=='Planar Leviathan')e={...e,hp:119,mhp:119,atk:20,def:9,xp:62,g:40,elem:'arcane'};
    else if(t=='Veil Wraith')e={...e,hp:135,mhp:135,atk:18,def:11,xp:52,g:36,elem:'arcane'};
    else if(t=='Shardling')e={...e,hp:75,mhp:75,atk:31,def:7,xp:57,g:40,elem:'arcane'};
    else if(t=='Echo Walker')e={...e,hp:135,mhp:135,atk:18,def:11,xp:52,g:36,elem:'arcane'};
    else if(t=='Ember Drake')e={...e,hp:82,mhp:82,atk:34,def:7,xp:62,g:44,elem:'fire'};
    else if(t=='Ash Titan')e={...e,hp:185,mhp:185,atk:11,def:14,xp:56,g:38,elem:'fire'};
    else if(t=='Flame Serpent')e={...e,hp:123,mhp:123,atk:19,def:10,xp:56,g:36,elem:'fire'};
    else if(t=='Frost Lich')e={...e,hp:148,mhp:148,atk:23,def:10,xp:72,g:46,elem:'ice'};
    else if(t=='Glacial Behemoth')e={...e,hp:205,mhp:205,atk:11,def:15,xp:62,g:40,elem:'ice'};
    else if(t=='Snow Revenant')e={...e,hp:147,mhp:147,atk:19,def:11,xp:62,g:40,elem:'ice'};
    else if(t=='Storm Titan')e={...e,hp:216,mhp:216,atk:13,def:16,xp:68,g:44,elem:'lightning'};
    else if(t=='Lightning Wraith')e={...e,hp:96,mhp:96,atk:37,def:8,xp:75,g:50,elem:'lightning'};
    else if(t=='Thunderborn')e={...e,hp:156,mhp:156,atk:24,def:11,xp:78,g:50,elem:'lightning'};
    else if(t=='Void Leviathan')e={...e,hp:172,mhp:172,atk:26,def:12,xp:83,g:54,elem:'void'};
    else if(t=='Null Elemental')e={...e,hp:123,mhp:123,atk:19,def:11,xp:64,g:44,elem:'void'};
    else if(t=='Hungering Maw')e={...e,hp:222,mhp:222,atk:13,def:16,xp:68,g:40,elem:'void'};
    else if(t=='Time Echo')e={...e,hp:135,mhp:135,atk:21,def:12,xp:68,g:46,elem:'arcane'};
    else if(t=='Chronomancer Lord')e={...e,hp:174,mhp:174,atk:26,def:12,xp:88,g:56,elem:'arcane'};
    else if(t=='Paradox Wraith')e={...e,hp:107,mhp:107,atk:41,def:9,xp:77,g:52,elem:'arcane'};
    else if(t=='Aether Bloom')e={...e,hp:147,mhp:147,atk:22,def:12,xp:72,g:48,elem:'arcane'};
    else if(t=='Mana Leviathan')e={...e,hp:240,mhp:240,atk:14,def:17,xp:72,g:44,elem:'arcane'};
    else if(t=='Crystal Serpent')e={...e,hp:117,mhp:117,atk:43,def:9,xp:81,g:54,elem:'arcane'};
    else if(t=='Convergence Avatar')e={...e,hp:196,mhp:196,atk:29,def:13,xp:94,g:60,elem:'arcane'};
    else if(t=='Planar Chimera')e={...e,hp:159,mhp:159,atk:22,def:13,xp:76,g:50,elem:'arcane'};
    else if(t=='Resonance Horror')e={...e,hp:126,mhp:126,atk:46,def:10,xp:85,g:56,elem:'arcane'};
    else if(t=='Nexus Guardian')e={...e,hp:264,mhp:264,atk:15,def:18,xp:80,g:48,elem:'arcane'};
    else if(t=='Planar Titan')e={...e,hp:214,mhp:214,atk:31,def:14,xp:100,g:64,elem:'arcane'};
    else if(t=='The Nexus Planarch')e={...e,hp:1200,mhp:1200,atk:35,def:22,xp:5000,g:4000,elem:'arcane',mechanic:'nexus_planarch',shiftTurn:4,phases:5,currentPhase:1,desc:'The true form of the Planarch at the heart of all dimensions. Each phase embodies a different planar element. Defeat all five to sever the rift forever.',nexus:true};
    // === EXPANSION: LV 21+ ENEMIES (now handled by dynamic scaling above) ===
 
      e.id=i; e.status=[]; G.cbt.en.push(e);
    }
    lg('Entered '+z.n+'! '+ec+' enemies appear!');
  }
    triggerSoelCommentary('explore');
  
  // === SOEL'S FORTUNE ===
  checkSoelFortune();
  
  // Track explore_with quest progress
  for(let q of G.quests){
    if(!q.done && !q.expired && q.t==='explore_with' && G.party.find(p=>p.on && p.n===q.reqParty)){
      q.c++;
      if(q.c>=q.need){
        q.done=true;
        G.p.xp+=q.rw.xp;
        G.p.gold+=q.rw.g;
        G.p.quests++;
        lg('Quest: '+q.n+'! +'+q.rw.xp+'XP +'+q.rw.g+'G');
        lvlup();
      }
    }
  }
  G.cbt.sk=0; G.cbt.tg=0; checkQ(); render();
}


// AUTO-COMBAT SYSTEM
function lvlup(){
  while(G.p.xp>=G.p.xpN){
    G.p.xp-=G.p.xpN; G.p.lvl++;
    // SOFTENED CURVE: 1.5x until Lv 15, then 1.35x for healthier late-game pacing
    if(G.p.lvl < 15){
      G.p.xpN=Math.floor(G.p.xpN*1.5);
    } else {
      G.p.xpN=Math.floor(G.p.xpN*1.35);
    }
    G.p.mhp+=10; G.p.mmp+=15; G.p.hp=G.p.mhp; G.p.mp=G.p.mmp;
    G.p.stats.int+=2; G.p.stats.con+=1;
    lg('LEVEL UP! Now Level '+G.p.lvl+'!');

    // === STAGE 2: PARTY AUTO STAT GROWTH ===
    for(let p of G.party){
      if(p.on || p.ul <= G.p.lvl){
        const oldMhp = p.mhp, oldAtk = p.atk, oldDef = p.def;
        p.mhp += 8; 
        p.hp = Math.min(p.mhp, p.hp + 8);
        p.atk += 1; 
        p.def += 1;
        // Only log for active members to avoid spam
        if(p.on){
          lg('📈 ' + p.n + ' grows with you! HP ' + oldMhp + '→' + p.mhp + ' ATK ' + oldAtk + '→' + p.atk + ' DEF ' + oldDef + '→' + p.def);
        }
      }
    }

    for(let s of G.p.skills){if(!s.on&&s.ul<=G.p.lvl){s.on=true;lg('Learned: '+s.n+'!');}}
    for(let p of G.party){if(!p.on&&p.ul<=G.p.lvl){p.on=true;p.hp=p.mhp;lg(p.n+' '+p.t+' joins!');}}
    checkAchievements();
    checkTalentUnlocks();
    unlockRestSites();
    checkNPCUnlocks();
    checkStoryline();
    checkJournalLevelUnlocks();
    checkStoryUnlock();
    checkQ();
  }
}
function checkQ(){
  for(let q of G.quests){
    if(q.done)continue;
    if(q.hidden && !q.revealed)continue;
    if(q.t=='kill'&&G.p.kills>=q.c+q.need)q.c=q.need;
    if(q.t=='reach_level'&&G.p.lvl>=q.need)q.c=q.need;
    if(q.t=='kill_specific'&&q.c>=q.need)q.c=q.need;
    if(q.t=='boss_specific'&&q.c>=q.need)q.c=q.need;
    if(q.t=='aisyah_battle'&&q.c>=q.need)q.c=q.need;
    if(q.t=='joel_battle'&&q.c>=q.need)q.c=q.need;
    if(q.c>=q.need){q.done=true;G.p.xp+=q.rw.xp;G.p.gold+=q.rw.g;G.p.quests++;lg('Quest: '+q.n+'! +'+q.rw.xp+'XP +'+q.rw.g+'G');if(q.stronghold)claimStronghold(q.stronghold);checkQuestChains();checkAchievements();lvlup();}
  }
}

function checkQuestChains(){
  for(let q of G.quests){
    if(q.hidden && !q.revealed && q.reqQuest){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      if(req && req.done){
        q.revealed=true;
        q.hidden=false;
        lg('🔓 Hidden quest unlocked: '+q.n+'!');
        lg('   '+q.d);
      }
    }
  }
}

function addI(it){
  const ex=G.p.inv.find(i=>i.n==it.n&&i.t==it.t);
  if(ex)ex.q+=it.q||1;
  else G.p.inv.push({...it,q:it.q||1});
}

function useI(ix){
  const it=G.p.inv[ix];
  if(!it)return;
  if(it.t=='pot' || it.t=='food' || it.t=='drink'){
    if(it.eff=='heal'){G.p.hp=Math.min(G.p.mhp,G.p.hp+it.v);lg('🍽️ Enjoyed '+it.n+'. +'+it.v+' HP.');}
    else if(it.eff=='mana'){G.p.mp=Math.min(G.p.mmp,G.p.mp+it.v);lg('🥤 Sipped '+it.n+'. +'+it.v+' MP.');}
    it.q--; if(it.q<=0)G.p.inv.splice(ix,1);
    render();
  } else if(it.t=='revive'){
    const dead=getDeadParty();
    if(dead.length===0){lg('❌ No fallen companions to revive!');return;}
    const target=dead[0];
    target.hp=Math.floor(target.mhp*(it.v/100));
    target.on=true;
    lg('🔥 '+it.n+' burns with sacred flame!');
    lg('✨ '+target.n+' revived with '+target.hp+' HP!');
    it.q--; if(it.q<=0)G.p.inv.splice(ix,1);
    render();
  }
}

function craft(ri){
  const r=G.recipes[ri];
  for(let [mn,mq] of Object.entries(r.m)){
    const iv=G.p.inv.find(x=>x.n==mn);
    if(!iv||iv.q<mq){lg('Missing mats for '+r.n);return;}
  }
  for(let [mn,mq] of Object.entries(r.m)){
    const iv=G.p.inv.find(x=>x.n==mn);
    iv.q-=mq; if(iv.q<=0){const ix=G.p.inv.indexOf(iv);G.p.inv.splice(ix,1);}
  }
  addI({...r.res}); lg('Crafted: '+r.n+'!');
  G.p.crafts = (G.p.crafts || 0) + 1;
   checkDailyQuests('craft', 1); 
  checkAchievements();
  const pq=G.quests.find(q=>q.t=='craft');
  if(pq&&!pq.done){pq.c++;checkQ();}
  render();
}

function eqI(ix){
  // Legacy equip - redirect to new system
  equipItem(ix);
}

let ft=null;
function sf(minutes){
  const validMinutes = [5, 10, 15, 20, 25].includes(minutes) ? minutes : 25;
  G.state='focus'; G.fs=Date.now(); G.fd=validMinutes*60*1000; G.focusDuration = validMinutes;
  triggerSoelCommentary('focus');
  lg('Focus started! ' + validMinutes + ' min...'); render();
  ft=setInterval(()=>{
    const el=Date.now()-G.fs, rm=G.fd-el;
    if(G.state!='focus'){clearInterval(ft);return;}
    if(rm<=0){
      clearInterval(ft);
      const baseXp = G.focusDuration * 4;
      const baseGold = G.focusDuration * 2;
      G.p.fstreak++;  checkDailyQuests('focus', 1); 
      G.p.xp+=baseXp; G.p.gold+=baseGold;
      const fq=G.quests.find(q=>q.t=='focus');
      if(fq&&!fq.done){fq.c++;checkQ();}
      lg('Focus complete! +' + baseXp + 'XP +' + baseGold + 'G Streak:'+G.p.fstreak);
      checkAchievements();
      lvlup(); G.state='menu'; render();
    }else{
      const el2=document.getElementById('ft');
      if(el2){const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);el2.textContent=m+':'+s.toString().padStart(2,'0');}
    }
  },1000);
}

function cf(){if(ft)clearInterval(ft);setS('menu');lg('Focus cancelled.');render();}

function lg(msg){
  G.log.push(msg); if(G.log.length>50)G.log.shift();
  const el=document.getElementById('log');
  if(el){el.innerHTML=G.log.map(m=>'<div class="le">'+m+'</div>').join('');el.scrollTop=el.scrollHeight;}
}

function setS(s){
  if (s === 'quest') triggerSoelCommentary('quest_view');
  if (s === 'craft') triggerSoelCommentary('craft');
  if (s === 'skills') triggerSoelCommentary('skills');
  if (s === 'rest') triggerSoelCommentary('rest');
  if (s === 'party') triggerSoelCommentary('party');
  G.state=s;render();
}
function flee(){
  if(G.currentBoss){
    if(Math.random()>0.3){
      lg('🏃 Escaped from ' + G.currentBoss.n + '!');
      lg('💀 Penalty: Party loses 25% HP from retreat!');
      G.p.hp = Math.max(1, Math.floor(G.p.hp * 0.75));
      for(let p of G.party){ if(p.on) p.hp = Math.max(1, Math.floor(p.hp * 0.75)); }
      G.currentBoss=null; G.cbt.on=false; G.state='explore';
    }else{
      lg('Flee failed! ' + G.currentBoss.n + ' blocks your path!');
      eturn();
    }
  }else{
    if(Math.random()>0.5){lg('Fled!');G.currentBoss=null;G.cbt.on=false;G.state='explore';}
    else{lg('Flee failed!');eturn();}
  }
  render();
}

function rc(c){return c=='common'?'#9ca3af':c=='uncommon'?'#22c55e':c=='rare'?'#3b82f6':'#a855f7';}
function getSpeakerColor(speaker) {
  if (speaker === 'San') return '#7c3aed';
  if (speaker === 'Narrator') return null;
  const member = G.party.find(p => p.n === speaker);
  if (member) return member.col;
  // Bosses/echoes speaking in journal scenes (e.g. Elder Dragon, Echo of Joel) fall
  // back to a neutral dim tone rather than a made-up color.
  return null;
}

// === ENEMY ICONS: geometric SVG silhouettes, replacing emoji ===
// Rather than hand-map every enemy name (impossible to keep up with new content),
// enemies are classified into archetypes by keyword, each with one simple geometric
// silhouette. Icons use currentColor so they inherit the enemy's elemental tint.
const ENEMY_ICON_SVGS = {
  beast: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="4,20 8,8 12,14 16,6 20,20"/></svg>',
  dragon: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 20,10 15,10 19,20 12,15 5,20 9,10 4,10"/></svg>',
  undead: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="10" r="8"/><rect x="7" y="8" width="3" height="4" fill="var(--bg-card)"/><rect x="14" y="8" width="3" height="4" fill="var(--bg-card)"/><polygon points="4,17 6,21 8,17 10,21 12,17 14,21 16,17 18,21 20,17 20,14 4,14"/></svg>',
  construct: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16"/><rect x="9" y="9" width="6" height="6" fill="var(--bg-card)"/></svg>',
  arachnid: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/><line x1="12" y1="12" x2="2" y2="4"/><line x1="12" y1="12" x2="2" y2="12"/><line x1="12" y1="12" x2="2" y2="20"/><line x1="12" y1="12" x2="22" y2="4"/><line x1="12" y1="12" x2="22" y2="12"/><line x1="12" y1="12" x2="22" y2="20"/></svg>',
  serpent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M3,6 Q9,3 12,9 Q15,15 21,12"/></svg>',
  flying: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,10 2,4 6,12 2,20 12,14"/><polygon points="12,10 22,4 18,12 22,20 12,14"/></svg>',
  knight: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2 L20,6 L20,12 Q20,19 12,22 Q4,19 4,12 L4,6 Z"/></svg>',
  elemental: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,3 Q19,8 18,15 Q17,21 12,21 Q7,21 6,15 Q5,8 12,3 Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2,12 Q12,3 22,12 Q12,21 2,12 Z"/><circle cx="12" cy="12" r="4" fill="var(--bg-card)"/><circle cx="12" cy="12" r="2"/></svg>',
  default: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12"/></svg>'
};

function getEnemyArchetype(name) {
  const n = name.toLowerCase();
  if (/wolf|hound|dog/.test(n)) return 'beast';
  if (/dragon|drake|wyrm/.test(n)) return 'dragon';
  if (/skeleton|zombie|bone|undead|lich|revenant|wraith|phantom|specter|ghost|echo|shade/.test(n)) return 'undead';
  if (/golem|construct|automaton|titan|guardian|sentinel/.test(n)) return 'construct';
  if (/spider|arachnid/.test(n)) return 'arachnid';
  if (/serpent|snake/.test(n)) return 'serpent';
  if (/bat\b|wisp|drifter|fairy|mote/.test(n)) return 'flying';
  if (/goblin|knight|guard\b|warden|king|lord|tyrant|foreman|keeper|collector|enforcer|peddler|looter|scavenger|watcher|mourner|auditor|sailor/.test(n)) return 'knight';
  if (/imp|slime|elemental|beast|horror|demon|hollow|stalker|weaver|leviathan|kraken|behemoth/.test(n)) return 'elemental';
  if (/planarch|devourer|astral|nexus|void|reality|fragment|rift|dimensional|chronomancer|arbiter|architect|fracture/.test(n)) return 'eye';
  return 'default';
}

const ARCHETYPE_EMOJI = {
  beast: '🐺', dragon: '🐲', undead: '💀', construct: '🤖', arachnid: '🕷️',
  serpent: '🐍', flying: '🦇', knight: '⚔️', elemental: '🔥', eye: '👁️', default: '👾'
};
function ee(n){
  const archetype = getEnemyArchetype(n);
  return ARCHETYPE_EMOJI[archetype] || ARCHETYPE_EMOJI.default;
}

function re(r){const m={'Tank':'🛡️','Rogue':'🗡️','Mage':'🔮','Healer':'💚','Ranger':'🏹','Warrior':'⚔️','Support':'🍀'};return m[r]||'👤';}
function ie(i){if(i.t=='pot')return i.eff=='heal'?'🧪':'💧';if(i.t=='food')return'🍽️';if(i.t=='drink')return'🥤';if(i.t=='revive')return'🔥';if(i.t=='wep')return'⚔️';if(i.t=='arm')return'🛡️';if(i.t=='acc')return'💍';if(i.t=='mat')return'💎';return'📦';}

const SAVE_KEY = 'ldb_save_v5';

// === CONTENT MIGRATION ===
const CONTENT_VERSION = 4;
// =========================


function saveGame() {
    const saveData = {
    contentVersion: CONTENT_VERSION,
    lastSaveTime: Date.now(),
    lastLoginDay: G.lastLoginDay || -1,
    loginStreak: G.loginStreak || 0,
    loginClaimed: G.loginClaimed || false,
    gameDay: G.gameDay || 0,
    lastRealDay: G.lastRealDay || 0,
    dailyQuests: G.dailyQuests || [],
    dailyQuestSeed: G.dailyQuestSeed || 0,
    player: {
      name: G.p.name, cls: G.p.cls, lvl: G.p.lvl, xp: G.p.xp, xpN: G.p.xpN,
      hp: G.p.hp, mhp: G.p.mhp, mp: G.p.mp, mmp: G.p.mmp, gold: G.p.gold,
      stats: G.p.stats,
      skills: G.p.skills.map(s => ({ n: s.n, c: s.c, dmg: s.dmg, on: s.on, ul: s.ul, d: s.d, buff: s.buff, elem: s.elem })),
      equipment: G.p.eq,
      inventory: G.p.inv,
      buffs: G.p.buffs,
      kills: G.p.kills, quests: G.p.quests, fstreak: G.p.fstreak,
      storyJournal: { unlocked: G.storyJournal.unlocked, read: G.storyJournal.read },

      // Add these inside the saveData object, alongside other fields:
    


    },
    party: G.party.map(p => ({ n: p.n, t: p.t, r: p.r, hp: p.hp, mhp: p.mhp, atk: p.atk, def: p.def, spd: p.spd, on: p.on, ul: p.ul, d: p.d, b: p.b, col: p.col, affinityBonuses: p.affinityBonuses, gear: p.gear, base: p.base, eq: p.eq })),
    quests: G.quests.map(q => ({ id: q.id, n: q.n, d: q.d, t: q.t, c: q.c, need: q.need, rw: q.rw, done: q.done })),
        bounties: G.bounties.map(b => ({ id: b.id, c: b.c, done: b.done, refreshDay: b.refreshDay })),
    questCollapsed: G.questCollapsed || {},
        rest: {
      sites: G.rest.sites.map(s => ({ 
        id: s.id, 
        unlocked: s.unlocked,
        entryLimit: s.entryLimit,
        entriesUsed: s.entriesUsed || 0
      }))
    },

    log: G.log,
    affinity: G.affinity,
    soelBlessing: G.soelBlessing,
    joelReviveUsed: G.joelReviveUsed,
    achievements: G.achievements.map(a => ({ id: a.id, done: a.done, revealed: a.revealed })),
    bestiary: G.bestiary,
    partySynergies: G.partySynergies,
    autoCombat: G.cbt.autoCombat,
    state: G.state,
    potionMenu: G.potionMenu,
        soelFortuneCooldown: G.soelFortuneCooldown || 0,
    joelShieldCooldown: G.joelShieldCooldown || 0,
    currentWeather: G.currentWeather || 'clear',
    
    // Phase 2 data
    talents: G.talents,
    runes: G.runes,
    riftCounter: G.riftCounter,
    currentRift: G.currentRift,
    riftFightsRemaining: G.riftFightsRemaining,
    riftTriggerAt: G.riftTriggerAt,
        runeSocketModal: G.runeSocketModal,
    runeCombineModal: G.runeCombineModal,
    dailyQuests: G.dailyQuests,
    storyline: G.storyline.map(s => ({ id: s.id, done: s.done, unlocked: s.unlocked, c: s.c })),
    dailyQuestSeed: G.dailyQuestSeed,
    grindChampionship: G.grindChampionship,
    story: G.story,
    discoveredAbilities: G.discoveredAbilities,
    growthAbilityUsed: G.growthAbilityUsed,
    raidProgress: G.raidProgress,
    strongholdTasks: G.strongholdTasks,
    strongholdStipendDay: G.strongholdStipendDay,
    strongholds: G.strongholds
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    lg('Game saved!');
    return true;
  } catch(e) {
    lg('Save failed: ' + e.message);
    return false;
  }
}

// === CONTENT MIGRATION ===
function migrateContent(data) {
  const fromVersion = data.contentVersion || 0;
  if (fromVersion >= CONTENT_VERSION) return data;
  
  lg('🔄 Migrating save from content v' + fromVersion + ' to v' + CONTENT_VERSION + '...');
  
  function mergeByKey(target, source, keyFn) {
    const existing = new Set(target.map(keyFn));
    for (let item of source) {
      if (!existing.has(keyFn(item))) {
        target.push(item);
        lg('  + Added: ' + keyFn(item));
      }
    }
  }
  
  if (!data.zones) data.zones = [];
  mergeByKey(data.zones, G.zones, z => z.n);
  
  if (!data.npcs) data.npcs = [];
  mergeByKey(data.npcs, G.npcs, n => n.n);
  
  if (!data.rest) data.rest = {};
  if (!data.rest.sites) data.rest.sites = [];
  mergeByKey(data.rest.sites, G.rest.sites, s => s.id);
  
  if (!data.bounties) data.bounties = [];
  mergeByKey(data.bounties, G.bounties, b => b.id);
  
  if (!data.achievements) data.achievements = [];
  mergeByKey(data.achievements, G.achievements, a => a.id);
  
  if (!data.storyline) data.storyline = [];
  mergeByKey(data.storyline, G.storyline, s => s.id);
  
  if (!data.storyJournal) data.storyJournal = {};
  if (!data.storyJournal.entries) data.storyJournal.entries = [];
  if (!data.storyJournal.unlocked) data.storyJournal.unlocked = [];
  mergeByKey(data.storyJournal.entries, G.storyJournal.entries, j => j.id);
  
  if (!data.zoneHazards) data.zoneHazards = {};
  for (let zoneName in G.zoneHazards) {
    if (!data.zoneHazards[zoneName]) {
      data.zoneHazards[zoneName] = G.zoneHazards[zoneName];
      lg('  + Hazard: ' + zoneName);
    }
  }
  
  if (!data.bosses) data.bosses = [];
  mergeByKey(data.bosses, G.bosses, b => b.n);
  
  if (!data.quests) data.quests = [];
  mergeByKey(data.quests, G.quests, q => q.id);
  
  if (!data.exploreEvents) data.exploreEvents = [];
  mergeByKey(data.exploreEvents, G.exploreEvents, e => e.n);
  
  if (!data.recipes) data.recipes = [];
  mergeByKey(data.recipes, G.recipes, r => r.n);
  
  data.contentVersion = CONTENT_VERSION;
  lg('✅ Migration complete! Save upgraded to content v' + CONTENT_VERSION);
  return data;
}
// =========================


function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    // Phase 2 migration: try v4 if v5 not found
    let data = null;
    if (!raw) {
      const v4raw = localStorage.getItem('ldb_save_v4');
      if (v4raw) {
        data = JSON.parse(v4raw);
        data._migrated = true;
        lg('💾 Migrated save from v4 to v5');
      } else {
        return false;
      }
    } else {
      data = JSON.parse(raw);
    }

    // Phase 2: Initialize missing fields
    if (!data.player) return false;
    if (!data.player.talents) data.player.talents = [];
    if (!data.player.runes) data.player.runes = [];
    if (data.player.riftCounter === undefined) data.player.riftCounter = 0;
    if (data.player.currentRift === undefined) data.player.currentRift = null;
    if (data.player.riftFightsRemaining === undefined) data.player.riftFightsRemaining = 0;
    if (data.player.riftTriggerAt === undefined) data.player.riftTriggerAt = 3 + Math.floor(Math.random() * 3);

    // Migrate old equipment: add sockets to Lv 10+ items
    function migrateItemSockets(item) {
      if (!item || item.sockets) return;
      const ilvl = item.ilvl || 1;
      if (ilvl >= 10) {
        const count = ilvl >= 20 ? 3 : ilvl >= 15 ? 2 : 1;
        item.sockets = new Array(count).fill(null);
      }
    }
    if (data.player.equipment) {
      for (let slot in data.player.equipment) {
        migrateItemSockets(data.player.equipment[slot]);
      }
    }
    if (data.player.inventory) {
      for (let item of data.player.inventory) {
        migrateItemSockets(item);
      }
    }

    // OFFLINE REGEN: Calculate HP/MP recovery based on time away
    if (data.lastSaveTime) {
      const now = Date.now();
      const minutesAway = Math.floor((now - data.lastSaveTime) / (1000 * 60));
      if (minutesAway > 0) {
        const hpRegen = Math.min(minutesAway, data.player.mhp); // 1 HP per minute, cap at max
        const mpRegen = Math.min(minutesAway, data.player.mmp); // 1 MP per minute, cap at max
        data.player.hp = Math.min(data.player.mhp, data.player.hp + hpRegen);
        data.player.mp = Math.min(data.player.mmp, data.player.mp + mpRegen);
        if (hpRegen > 0 || mpRegen > 0) {
          lg('💤 While you were away (' + minutesAway + ' min): +' + hpRegen + ' HP, +' + mpRegen + ' MP');
        }
      }
    }

    // Apply migrated Phase 2 data
    G.talents = data.player.talents || [];
    G.runes = data.player.runes || [];
    G.riftCounter = data.player.riftCounter || 0;
    G.currentRift = data.player.currentRift || null;
    G.riftFightsRemaining = data.player.riftFightsRemaining || 0;
    G.riftTriggerAt = data.player.riftTriggerAt || (3 + Math.floor(Math.random() * 3));
    G.runeSocketModal = data.player.runeSocketModal || { open: false, itemIndex: null, slotIndex: null };
    G.runeCombineModal = data.player.runeCombineModal || { open: false, selected: [] };
    G.grindChampionship = data.grindChampionship || { bestWave: 0, claimedTiers: [] };
    if (data.story) {
      G.story = data.story;
    } else {
      // Legacy save from before G.story was persisted: don't replay every chapter
      // the player is already past — assume anything unlockable at their current
      // level has already been seen, and only show what's genuinely new.
      let caughtUpChapter = 0;
      while (G.storyChapters[caughtUpChapter] && (!G.storyChapters[caughtUpChapter].unlockLevel || G.storyChapters[caughtUpChapter].unlockLevel <= data.player.lvl)) {
        caughtUpChapter++;
      }
      G.story = { active: true, chapter: caughtUpChapter, scene: 0, shown: true };
    }
    G.discoveredAbilities = data.discoveredAbilities || [];
    G.growthAbilityUsed = data.growthAbilityUsed || {};
    G.raidProgress = data.raidProgress || { cleared: [] };
    G.strongholds = data.strongholds || {};
    G.strongholdTasks = data.strongholdTasks || [];
    G.strongholdStipendDay = data.strongholdStipendDay !== undefined ? data.strongholdStipendDay : -1;

    G.p.lvl = data.player.lvl;
    G.p.xp = data.player.xp;
    G.p.xpN = data.player.xpN;
    G.p.hp = data.player.hp;
    G.p.mhp = data.player.mhp;
    G.p.mp = data.player.mp;
    G.p.mmp = data.player.mmp;
    G.p.gold = data.player.gold;
    G.p.stats = data.player.stats;
    G.p.inv = (data.player.inventory || []).map(migrateLegacyItem);
    G.p.buffs = data.player.buffs || [];
    G.p.kills = data.player.kills;
    G.p.quests = data.player.quests;
    G.p.fstreak = data.player.fstreak;
          // Load journal progress
    if (data.player.storyJournal) {
      G.storyJournal.unlocked = data.player.storyJournal.unlocked || [];
      G.storyJournal.read = data.player.storyJournal.read || [];
    }
    // Catch up any level-gated entries that should already be unlocked but were
    // missed (e.g. by the old bug where this only checked inside an unrelated
    // quest condition). Safe to run every load — it only ever adds, never removes.
    checkJournalLevelUnlocks();
    
    // MIGRATION: Unlock journal entries based on existing progress
    // Runs if journal data is missing or empty (old saves or fresh installs)
    const hasJournalData = data.player.storyJournal && 
                           data.player.storyJournal.unlocked && 
                           data.player.storyJournal.unlocked.length > 0;
    if (!hasJournalData) {
      for (let entry of G.storyJournal.entries) {
        let shouldUnlock = false;
        if (entry.unlockType === 'level' && G.p.lvl >= entry.unlockAt) {
          shouldUnlock = true;
        } else if (entry.unlockType === 'boss') {
          // Check bestiary for boss kills
          if (G.bestiary[entry.unlockAt] && G.bestiary[entry.unlockAt].kills > 0) {
            shouldUnlock = true;
          }
        } else if (entry.unlockType === 'zone') {
          // Check if zone rest site is unlocked (means visited)
          const visited = G.rest.sites.find(s => s.zone === entry.unlockAt && s.unlocked);
          if (visited) shouldUnlock = true;
        }
        if (shouldUnlock && !G.storyJournal.unlocked.includes(entry.id)) {
          G.storyJournal.unlocked.push(entry.id);
          lg('📖 Journal unlocked (migration): ' + entry.title);
        }
      }
    }



    for (let s of G.p.skills) {
      const saved = data.player.skills.find(ss => ss.n === s.n);
      if (saved) s.on = saved.on;
    }

    // Migrate old equipment format to new
    const oldEq = data.player.equipment;
    if (oldEq.w || oldEq.a || oldEq.acc) {
      // Old format detected - migrate
      G.p.eq = {
        weapon: oldEq.w ? {...oldEq.w, slot: 'weapon'} : null,
        armor: oldEq.a ? {...oldEq.a, slot: 'armor'} : null,
        head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null
      };
    } else {
      G.p.eq = oldEq;
    };

        for (let p of G.party) {
      const saved = data.party.find(sp => sp.n === p.n);
      if (saved) {
        p.on = saved.on;
        p.affinityBonuses = saved.affinityBonuses || [];

        if (saved.base && saved.eq) {
          // Modern save format: restore directly
          p.base = saved.base;
          p.eq = saved.eq;
        } else {
          // Legacy save from before the 8-slot system: reconstruct base stats by
          // removing whatever the old single-trinket gear had added, then migrate
          // that trinket (if any) into the amulet slot so it stays equipped.
          const oldGear = saved.gear || null;
          p.base = {
            mhp: saved.mhp - (oldGear?.hp || 0),
            atk: saved.atk - (oldGear?.atk || 0),
            def: saved.def - (oldGear?.def || 0),
            spd: saved.spd - (oldGear?.spd || 0)
          };
          p.eq = { weapon: null, armor: null, head: null, hands: null, feet: null, ring1: null, ring2: null, amulet: null };
          if (oldGear && oldGear.n) {
            p.eq.amulet = { n: oldGear.n, slot: 'amulet', forCompanion: p.n, atk: oldGear.atk || 0, def: oldGear.def || 0, hp: oldGear.hp || 0, r: 'uncommon', d: oldGear.d || 'A trinket carried over from before.' };
            lg('🧝 ' + p.n + '\'s ' + oldGear.n + ' has been moved into their amulet slot.');
          }
        }
        // Sanitize equipped gear: anything sitting in a slot that isn't actually restricted
        // to this companion (e.g. San's own weapon equipped on Soel, from before this fix)
        // gets returned to inventory rather than silently kept.
        for (let slot in p.eq) {
          const eq = p.eq[slot];
          if (eq && eq.forCompanion !== p.n) {
            addI({ ...eq });
            lg('🧝 ' + eq.n + " wasn't actually fitted for " + p.n + ' — returned to your bag.');
            p.eq[slot] = null;
          }
        }
        recalcPartyMember(p);

        // Offline regen for party too
        if (data.lastSaveTime) {
          const now = Date.now();
          const minutesAway = Math.floor((now - data.lastSaveTime) / (1000 * 60));
          const hpRegen = Math.min(minutesAway, p.mhp);
          p.hp = Math.min(p.mhp, saved.hp + hpRegen);
        } else {
          p.hp = Math.min(p.mhp, saved.hp);
        }
      }
    }

        for (let q of G.quests) {
      const saved = data.quests.find(sq => sq.id === q.id);
      if (saved) {
        q.c = saved.c;
        q.done = saved.done;
      }
    }
    // Quest 'revealed'/'hidden' state was never saved, so every chained quest would
    // otherwise reset to its hardcoded default on load regardless of actual progress —
    // this recomputes reveals from the now-restored 'done' flags of prior quests in
    // each chain, fixing any quest chain that got permanently stuck (e.g. the Planarch
    // chain never revealing the final boss quest, or the stronghold never granting).
    checkQuestChains();
    // Catch up strongholds for quests completed before this system existed —
    // e.g. defeating The Planarch long ago should still grant the tower now.
    for (let q of G.quests) {
      if (q.done && q.stronghold) claimStronghold(q.stronghold);
    }
    // Restore bounties progress
    if (data.bounties) {
      for (let sb of data.bounties) {
        const lb = G.bounties.find(b => b.id === sb.id);
        if (lb) {
          lb.c = sb.c || 0;
          lb.done = sb.done || false;
          lb.refreshDay = sb.refreshDay || 0;
        }
      }
    }
    G.questCollapsed = data.questCollapsed || {};


            if (data.rest && data.rest.sites) {
      for (let s of G.rest.sites) {
        const saved = data.rest.sites.find(ss => ss.id === s.id);
        if (saved) {
          s.unlocked = saved.unlocked;
          if (saved.entryLimit !== undefined) s.entryLimit = saved.entryLimit;
          if (saved.entriesUsed !== undefined) s.entriesUsed = saved.entriesUsed;
        }
      }
    }
    // Unlock any new rest sites added since last save (for level already achieved)
    unlockRestSites();



    if (data.affinity) {
      for (let name in data.affinity) {
        if (G.affinity[name]) {
          G.affinity[name].val = data.affinity[name].val;
          G.affinity[name].lastInteract = data.affinity[name].lastInteract;
        }
      }
    }
    if (data.achievements) {
      for (let savedAch of data.achievements) {
        const ach = G.achievements.find(a => a.id === savedAch.id);
        if (ach) {
          ach.done = savedAch.done;
          ach.revealed = savedAch.revealed;
        }
      }
    }
    if (data.bestiary) {
      G.bestiary = data.bestiary;
    }
    if (data.affinity) {
      for (let name in data.affinity) {
        if (G.affinity[name]) {
          G.affinity[name].val = data.affinity[name].val;
          G.affinity[name].lastInteract = data.affinity[name].lastInteract;
        }
      }
    }
    if (data.achievements) {
      for (let savedAch of data.achievements) {
        const ach = G.achievements.find(a => a.id === savedAch.id);
        if (ach) {
          ach.done = savedAch.done;
          ach.revealed = savedAch.revealed;
        }
      }
    }
    if (data.bestiary) {
      G.bestiary = data.bestiary;
    }
    // Direct catch-up independent of quest state entirely: if the bestiary shows you've
    // actually defeated The Planarch before, grant the stronghold regardless of whether
    // the quest chain ever tracked it correctly.
    if (G.bestiary && G.bestiary['The Planarch'] && G.bestiary['The Planarch'].kills > 0) {
      claimStronghold('arcaneTower');
    }
    if (data.soelCommentCooldown !== undefined) {
      G.soelCommentCooldown = data.soelCommentCooldown;
    }
    if (data.npcs) {
      for (let n of G.npcs) {
        const saved = data.npcs.find(sn => sn.n === n.n);
        if (saved) {
          n.unlocked = saved.unlocked;
          n.visitCount = saved.visitCount || 0;
        }
      }
    }
    if (data.bounties) {
      for (let i = 0; i < G.bounties.length; i++) {
        if (data.bounties[i]) {
          G.bounties[i].c = data.bounties[i].c;
          G.bounties[i].done = data.bounties[i].done;
          G.bounties[i].refreshDay = data.bounties[i].refreshDay;
        }
      }
    }
        if (data.dailyQuests) {
      G.dailyQuests = data.dailyQuests;
    }
    if (data.dailyQuestSeed !== undefined) {
      G.dailyQuestSeed = data.dailyQuestSeed;
    }

    if (data.storyline) {
      for (let s of G.storyline) {
        const saved = data.storyline.find(ss => ss.id === s.id);
        if (saved) {
          s.done = saved.done;
          s.unlocked = saved.unlocked;
          if (saved.c !== undefined) s.c = saved.c;
        }
      }
    }
    if (data.currentBoss !== undefined) {
      G.currentBoss = data.currentBoss;
    }
    G.potionMenu = data.potionMenu || false;
    G.lastLoginDay = data.lastLoginDay || -1;
    G.loginStreak = data.loginStreak || 0;
    G.loginClaimed = data.loginClaimed || false;
    G.gameDay = data.gameDay || 0;
    G.lastRealDay = data.lastRealDay || 0;
    G.dailyQuests = data.dailyQuests || [];
    G.dailyQuestSeed = data.dailyQuestSeed || 0;

    G.soelFortuneCooldown = data.soelFortuneCooldown || 0;
G.joelShieldCooldown = data.joelShieldCooldown || 0;
G.currentWeather = data.currentWeather || 'clear';

    G.soelBlessing = data.soelBlessing || null;
    G.joelReviveUsed = data.joelReviveUsed || false;
    G.log = data.log || ['Welcome back to Legends of Daybreak, San.'];
    for (let name in G.affinity) checkAffinityUnlocks(name);
    for (let s of G.p.skills) { if (!s.on && s.ul <= G.p.lvl) s.on = true; }
        checkDayAdvance(); // Advance game day if real day changed, then generate quests


    lg('Game loaded!');
    return true;
  } catch(e) {
    console.error('Load failed:', e);
    return false;
  }
}

function resetGame() {
  if (confirm('Are you sure? ALL progress will be lost forever!')) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
}

function exportSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) { lg('No save data to export.'); return; }
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'legends-daybreak-save.json';
  a.click();
  URL.revokeObjectURL(url);
  lg('Save exported!');
}

function importSave() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        JSON.parse(ev.target.result);
        localStorage.setItem(SAVE_KEY, ev.target.result);
        loadGame();
        render();
        lg('Save imported!');
      } catch(err) {
        lg('Invalid save file!');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

setInterval(saveGame, 30000);
setInterval(updateTimedQuests, 60000);
setInterval(checkAffinityDecay, 60000);
setInterval(refreshBounties, 60000);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveGame();
});

function rNPC() {
  let h = '<div class="npc-view"><h2 class="st">🧳 Traders & Allies</h2>';

  // Traders section
  const traders = G.npcs.filter(n => n.t === 'trader');
  if (traders.length > 0) {
    h += '<div style="margin-bottom:20px;"><h3 style="font-size:14px;color:#fbbf24;margin-bottom:10px;">🧳 Wandering Traders</h3>';
    for (let npc of traders) {
      h += '<div class="npc-card ' + (npc.unlocked ? '' : 'locked') + '" style="border-color:' + (npc.unlocked ? '#fbbf24' : 'var(--border)') + ';">';
      h += '<div class="npc-ava" style="background:' + npc.col + '20;border-color:' + npc.col + '">' + npc.icon + '</div>';
      h += '<div class="npc-info">';
      h += '<div class="npc-name">' + npc.n + ' <span class="npc-type npc-type-trader">' + npc.title + '</span></div>';
      if (!npc.unlocked) {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">🔒 Unlocked at ' + npc.zone + ' (Lv.' + npc.zoneLv + ')</div>';
      } else {
        h += '<div class="npc-desc">' + npc.d + '</div>';
        h += '<div class="npc-stock">';
        for (let j = 0; j < npc.stock.length; j++) {
          const item = npc.stock[j];
          const icon = item.t === 'food' ? '🍽️' : item.t === 'drink' ? '🥤' : item.forCompanion ? '🧝' : (item.slot ? (EQUIPMENT_SLOTS[item.slot]?.icon || '⚔️') : '');
          h += '<span class="npc-item" style="color:' + rc(item.r) + ';">' + icon + ' ' + item.n + ' (' + item.price + 'G)</span>';
        }
        h += '</div>';
        h += '<div style="margin-top:8px;">';
        for (let j = 0; j < npc.stock.length; j++) {
          const item = npc.stock[j];
          const canAfford = G.p.gold >= item.price;
          h += '<button class="npc-buy ' + (canAfford ? 'ib-u' : 'ib-e') + '" data-npc="' + npc.n + '" data-item="' + j + '" style="margin-right:4px;">' + (canAfford ? 'Buy ' + item.n + ' (' + item.price + 'G)' : 'Need ' + item.price + 'G') + '</button>';
        }
        h += '</div>';
        // Amad's sell section
        if (npc.n === 'Amad' && npc.buysAnything) {
          const sellableItems = G.p.inv.filter(i => i.t !== 'revive'); // Can't sell revives
          if (sellableItems.length > 0) {
            h += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">';
            h += '<div style="font-size:12px;font-weight:600;color:#fbbf24;margin-bottom:8px;">💰 Sell to Amad (50% value)</div>';
            h += '<div style="display:flex;flex-direction:column;gap:6px;">';
            for (let j = 0; j < G.p.inv.length; j++) {
              const item = G.p.inv[j];
              if (item.t === 'revive') continue;
              let sellPrice = 0;
              if (item.value) sellPrice = Math.floor(item.value * 0.5);
              else if (item.t === 'mat') sellPrice = Math.floor((item.ilvl || 1) * 3 + 2);
              else if (item.t === 'pot' || item.t === 'food' || item.t === 'drink') sellPrice = Math.floor((item.v || 10) * 0.3);
              else sellPrice = Math.floor((item.ilvl || 1) * 4);
              sellPrice = Math.max(1, sellPrice);
              const itemIcon = ie(item);
              h += '<button class="amad-sell" data-index="' + j + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-hover);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span>' + itemIcon + ' ' + item.n + (item.q > 1 ? ' x' + item.q : '') + '</span>';
              h += '<span style="color:#fbbf24;">' + sellPrice + 'G</span>';
              h += '</button>';
            }
            h += '</div></div>';
          } else {
            h += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">';
            h += '<div style="font-size:11px;color:var(--text-dim);">💰 Your pack is empty — nothing to sell to Amad.</div>';
            h += '</div>';
          }
        }
      }
      h += '</div></div>';
    }
    h += '</div>';
  }

  // Allies section
  const allies = G.npcs.filter(n => n.t === 'ally');
  if (allies.length > 0) {
    h += '<div><h3 style="font-size:14px;color:#8b5cf6;margin-bottom:10px;">🌙 Allies</h3>';
    for (let npc of allies) {
      const aff = G.affinity[npc.reqMember];
      h += '<div class="npc-card ' + (npc.unlocked ? '' : 'locked') + '" style="border-color:' + (npc.unlocked ? '#8b5cf6' : 'var(--border)') + ';">';
      h += '<div class="npc-ava" style="background:' + npc.col + '20;border-color:' + npc.col + '">' + npc.icon + '</div>';
      h += '<div class="npc-info">';
      h += '<div class="npc-name">' + npc.n + ' <span class="npc-type npc-type-ally">' + npc.title + '</span></div>';
      if (!npc.unlocked) {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">🔒 Requires ' + npc.reqMember + ' affinity ' + npc.affinityReq + '+ (currently ' + (aff ? aff.val : 0) + ')</div>';
        if (aff) {
          h += '<div class="affinity-bar"><div class="affinity-fill ' + getAffinityColor(aff.val) + '" style="width:' + Math.min(100, (aff.val / npc.affinityReq * 100)) + '%"></div></div>';
          h += '<div class="affinity-label">' + (aff.val >= 70 ? '💕 Close' : aff.val >= 40 ? '💛 Friendly' : aff.val >= 20 ? '💔 Distant' : '💀 Strained') + ' (' + aff.val + '/' + npc.affinityReq + ')</div>';
        }
      } else {
        h += '<div class="npc-desc">' + npc.d + '</div>';
        h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">' + npc.ability + '</div>';
      }
      h += '</div></div>';
    }
    h += '</div>';
  }

  h += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:16px;">Traders unlock by zone level. Allies unlock through party affinity.</div>';
  // Trinket Shop
  h += '<div style="margin-top:20px;"><h3 style="font-size:14px;color:#a78bfa;margin-bottom:10px;">🎁 Trinket Shop</h3>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">Simple gear any party member can equip. Buy then equip from Party screen.</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">';
  for(let i=0;i<TRINKET_SHOP.length;i++){
    const t=TRINKET_SHOP[i];
    const canAfford=G.p.gold>=t.price;
    const color=t.r==='epic'?'#a855f7':t.r==='rare'?'#3b82f6':t.r==='uncommon'?'#22c55e':'#9ca3af';
    h+='<button class="trinket-buy-btn" data-tidx="'+i+'" style="padding:10px;border-radius:12px;border:1px solid '+(canAfford?color:'var(--disabled)')+';background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:'+(canAfford?'pointer':'not-allowed')+';opacity:'+(canAfford?'1':'0.5')+';text-align:left;">';
    h+='<div style="color:'+color+';font-weight:700;">'+t.n+'</div>';
    h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">ATK+'+t.atk+' DEF+'+t.def+' HP+'+t.hp+'</div>';
    h+='<div style="font-size:10px;color:'+(canAfford?'#f59e0b':'var(--danger)')+';margin-top:4px;">'+(canAfford?'💰 ':'🔒 ')+t.price+'G</div>';
    h+='</button>';
  }
  h += '</div></div>';

  h += '</div>';
  return h;
}

function showStory() {
  if(!G.story.active || G.story.shown) return;
  const chapter = G.storyChapters[G.story.chapter];
  if(!chapter) return;
  if(chapter.unlockLevel && G.p.lvl < chapter.unlockLevel) return;
  G.state = 'story';
  render();
}

function advanceStory() {
  const chapter = G.storyChapters[G.story.chapter];
  if(!chapter) { G.story.shown = true; setS('menu'); return; }
  G.story.scene++;
  if(G.story.scene >= chapter.scenes.length) {
    G.story.shown = true;
    G.story.chapter++;
    G.story.scene = 0;
    setS('menu');
  } else {
    render();
  }
}

function checkStoryUnlock() {
  if(G.story.shown) return;
  const nextChapter = G.storyChapters[G.story.chapter];
  if(!nextChapter) return;
  if(nextChapter.unlockLevel && G.p.lvl >= nextChapter.unlockLevel) {
    G.story.shown = false;
    G.story.scene = 0;
    showStory();
  }
}


function rAchievements() {
  let h = '<div class="achievements-view" style="padding:16px;">';
  h += '<h2 class="st">🏆 Achievements</h2>';

  const earned = G.achievements.filter(a => a.done);
  const total = G.achievements.length;
  const secret = G.achievements.filter(a => a.secret);
  const secretEarned = secret.filter(a => a.done);

  h += '<div style="text-align:center;margin-bottom:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  h += '<div style="font-size:36px;font-weight:700;color:var(--gold);">' + earned.length + '/' + total + '</div>';
  h += '<div style="font-size:12px;color:var(--text-dim);">Achievements Unlocked</div>';
  if (secret.length > 0) {
    h += '<div style="font-size:11px;color:var(--accent-light);margin-top:4px;">🔒 ' + secretEarned.length + '/' + secret.length + ' Secret</div>';
  }
  h += '</div>';

  h += '<div style="display:flex;flex-direction:column;gap:10px;">';
  for (let ach of G.achievements) {
    if (ach.secret && !ach.revealed && !ach.done) {
      h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;opacity:0.6;">';
      h += '<div style="font-size:28px;width:40px;text-align:center;">❓</div>';
      h += '<div style="flex:1;">';
      h += '<div style="font-weight:600;font-size:14px;color:var(--text-dim);">Secret Achievement</div>';
      h += '<div style="font-size:11px;color:var(--disabled);">Keep playing to discover...</div>';
      h += '</div></div>';
      continue;
    }

    const done = ach.done;
    h += '<div style="background:var(--bg-card);border:1px solid ' + (done ? 'var(--success)' : 'var(--border)') + ';border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;' + (done ? 'background:#22c55e10;' : '') + '">';
    h += '<div style="font-size:28px;width:40px;text-align:center;">' + (done ? ach.icon : '🔒') + '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-weight:600;font-size:14px;">' + (done ? '✅ ' : '') + ach.n + '</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">' + ach.d + '</div>';
    if (!done) {
      let progress = '';
      switch (ach.t) {
        case 'kills': progress = G.p.kills + '/' + ach.need; break;
        case 'boss': progress = (G.p.bossKills || 0) + '/' + ach.need; break;
        case 'level': progress = G.p.lvl + '/' + ach.need; break;
        case 'quests': progress = G.p.quests + '/' + ach.need; break;
        case 'affinity': progress = (G.affinity[ach.target] ? G.affinity[ach.target].val : 0) + '/' + ach.need; break;
        case 'gold': progress = G.p.gold + '/' + ach.need; break;
        case 'craft': progress = (G.p.crafts || 0) + '/' + ach.need; break;
        case 'focus': progress = G.p.fstreak + '/' + ach.need; break;
        default: progress = '???';
      }
      h += '<div style="font-size:11px;color:var(--accent-light);margin-top:4px;">' + progress + '</div>';
    } else {
      h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">+' + ach.rw.xp + ' XP, +' + ach.rw.g + 'G</div>';
    }
    h += '</div></div>';
  }
  h += '</div></div>';
  return h;
}

function render(){
  initPartyGearBonus();

  const a=document.getElementById('app'); if(!a)return;
  let h='';
  h+='<div class="hdr"><div class="hdr-l"><div class="pname">'+G.p.name+' <span class="cls">'+G.p.cls+'</span></div><div class="lvl">Lv.'+G.p.lvl+'</div></div>';
  h+='<div class="hdr-r"><div class="sb"><span class="si">HP</span><div class="bar"><div class="bf bf-hp" style="width:'+((G.p.hp/G.p.mhp)*100)+'%"></div></div><span class="bt">'+G.p.hp+'/'+G.p.mhp+'</span></div>';
  h+='<div class="sb"><span class="si">MP</span><div class="bar"><div class="bf bf-mp" style="width:'+((G.p.mp/G.p.mmp)*100)+'%"></div></div><span class="bt">'+G.p.mp+'/'+G.p.mmp+'</span></div>';
  h+='<div class="sb"><span class="si">XP</span><div class="bar"><div class="bf bf-xp" style="width:'+((G.p.xp/G.p.xpN)*100)+'%"></div></div><span class="bt">'+G.p.xp+'/'+G.p.xpN+'</span></div>';
  h+='<div class="gold">GOLD: '+G.p.gold+'</div></div></div>';
  if(G.p.buffs.length>0)h+='<div class="buffs">'+G.p.buffs.map(b=>'<span class="bp">'+b.n+' ('+b.t+')</span>').join('')+'</div>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0 && G.state === 'combat'){
    h += '<div class="buffs">' + activeSyns.map(s => '<span class="bp" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);">'+s.icon+' '+s.name+'</span>').join('') + '</div>';
  }
  h+='<div class="content">';
  if(G.state=='menu')h+=rMenu();
  else if(G.state=='achievements')h+=rAchievements();
  else if(G.state=='story')h+=rStory();
  else if(G.state=='bestiary')h+=rBestiary();
  else if(G.state=='explore')h+=rExp();
  else if(G.state=='combat')h+=rCbt();
  else if(G.state=='party')h+=rParty();
  else if(G.state=='skills')h+=rSkills();
  else if(G.state=='inventory')h+=rInv();
  else if(G.state=='craft')h+=rCraft();
  else if(G.state=='quest')h+=rQuest();
  else if(G.state=='focus')h+=rFocus();
  else if(G.state=='rest')h+=rRest();
  else if(G.state=='secret')h+=rSecret();
  else if(G.state=='skilltree')h+=rSkillTree();
  else if(G.state=='talents')h+=rTalents();
  else if(G.state=='runes')h+=rRunes();
  else if(G.state=='ministory')h+=rMiniStory();
  else if(G.state=='journal')h+=rJournal();
  else if(G.state=='journalentry')h+=rJournalEntry(G.currentJournalEntry);
  else if(G.state=='npc')h+=rNPC();
  else if(G.state=='grind_room')h+=rGrindRoom();
  else if(G.state=='raid_select')h+=rRaidSelect();
  else if(G.state=='raid_room')h+=rRaidRoom();

  h+='</div>';
  h+='<div class="log" id="log">'+G.log.map(m=>'<div class="le">'+m+'</div>').join('')+'</div>';
  h+='<div class="nav"><button class="nb '+(G.state=='menu'?'on':'')+'" data-t="home" data-a="menu">Home</button>';
  h+='<button class="nb '+(G.state=='explore'?'on':'')+'" data-t="exp" data-a="explore">Explore</button>';
  h+='<button class="nb '+(G.state=='party'?'on':'')+'" data-t="party" data-a="party">Party</button>';
  h+='<button class="nb '+(G.state=='quest'?'on':'')+'" data-t="quest" data-a="quest">Quests</button>';
  h+='<button class="nb '+(G.state=='craft'?'on':'')+'" data-t="craft" data-a="craft">Craft</button>';
  h+='<button class="nb '+(G.state=='inventory'?'on':'')+'" data-t="inv" data-a="inventory">Items</button>';
  h+='<button class="nb '+(G.state=='npc'?'on':'')+'" data-t="npc" data-a="npc">Traders</button></div>';
  a.innerHTML=h;
  attachEvents();
  const l=document.getElementById('log'); if(l)l.scrollTop=l.scrollHeight;
}

function attachEvents() {
  document.querySelectorAll('.card[data-a]').forEach(el=>{
        el.addEventListener('click',()=>{const a=el.getAttribute('data-a');if(a=='explore')setS('explore');else if(a=='party')setS('party');else if(a=='skills')setS('skills');else if(a=='craft')setS('craft');else if(a=='quest')setS('quest');else if(a=='inventory')setS('inventory');else if(a=='bestiary')setS('bestiary');else if(a=='achievements')setS('achievements');else if(a=='npc')setS('npc');else if(a=='focus')setS('focus');
  if(a=='rest')setS('rest');
    else if(a=='grind_room')setS('grind_room');
    else if(a=='raid_select')setS('raid_select');
    else if(a=='skilltree')setS('skilltree');
    else if(a=='talents')setS('talents');
    else if(a=='runes')setS('runes');
    else if(a=='journal')setS('journal');});
  });
 const btnClaimLogin = document.getElementById('btn-claim-login');
if (btnClaimLogin) {
  btnClaimLogin.addEventListener('click', claimDailyLoginReward);
}
 document.querySelectorAll('.story-view .abtn').forEach(el=>{
    el.addEventListener('click',advanceStory);
  });
  const btnSave=document.getElementById('btn-save');if(btnSave)btnSave.addEventListener('click',()=>{saveGame();});
  const btnExport=document.getElementById('btn-export');if(btnExport)btnExport.addEventListener('click',exportSave);
  const btnImport=document.getElementById('btn-import');if(btnImport)btnImport.addEventListener('click',importSave);
  const btnReset=document.getElementById('btn-reset');if(btnReset)btnReset.addEventListener('click',resetGame);
  document.querySelectorAll('.zcard:not(.locked)').forEach(el=>{
    el.addEventListener('click',()=>{const i=parseInt(el.getAttribute('data-i'));sc(i);});
  });
  document.querySelectorAll('.ecard:not(.dead)').forEach(el=>{
    el.addEventListener('click',()=>{G.cbt.tg=parseInt(el.getAttribute('data-i'));render();});
  });
  document.querySelectorAll('.sbtn:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{
      const raw = el.getAttribute('data-i');
      G.cbt.sk = raw === '-1' ? -1 : parseInt(raw);
      render();
    });
  });
  document.querySelectorAll('.skill-box:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{
      const raw = el.getAttribute('data-i');
      G.cbt.sk = raw === '-1' ? -1 : parseInt(raw);
      render();
    });
  });
  const abtn=document.querySelector('.abtn:not(.dis)');
  if(abtn){
    abtn.addEventListener('click',()=>{
      const siRaw=abtn.getAttribute('data-si');
      const si=siRaw==='-1'?-1:parseInt(siRaw);
      const ti=parseInt(abtn.getAttribute('data-ti'));
      pa(si,ti);
    });
  }
  const fbtn=document.querySelector('.fbtn');
  if(fbtn)fbtn.addEventListener('click',flee);
  document.querySelectorAll('.ib-u').forEach(el=>{
    el.addEventListener('click',(e)=>{e.stopPropagation();useI(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.ib-e').forEach(el=>{
    el.addEventListener('click',(e)=>{e.stopPropagation();equipItem(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.cb:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{craft(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.socket-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      const itemIdx=parseInt(el.getAttribute('data-ii'));
      const slot=parseInt(el.getAttribute('data-si'));
      openSocketModal(itemIdx, slot);
    });
  });
  document.querySelectorAll('.unsocket-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      unsocketRune(parseInt(el.getAttribute('data-ii')), parseInt(el.getAttribute('data-si')));
      render();
    });
  });
  const btnCombine=document.getElementById('btn-combine');
  if(btnCombine)btnCombine.addEventListener('click',()=>{
    openCombineModal();
  });
  // Rune socket modal events
  document.querySelectorAll('.rune-select-btn').forEach(el=>{
    el.addEventListener('click',()=>{
      confirmSocketRune(parseInt(el.getAttribute('data-ri')));
    });
  });
  document.querySelectorAll('.rune-modal-back').forEach(el=>{
    el.addEventListener('click',()=>{
      closeSocketModal();
      closeCombineModal();
    });
  });
  // Rune combine modal events
  document.querySelectorAll('.rune-combine-select').forEach(el=>{
    el.addEventListener('click',()=>{
      toggleCombineRune(parseInt(el.getAttribute('data-ri')));
    });
  });
  const btnConfirmCombine=document.getElementById('btn-confirm-combine');
  if(btnConfirmCombine)btnConfirmCombine.addEventListener('click',doCombineRunes);
  document.querySelectorAll('.nb').forEach(el=>{
    el.addEventListener('click',()=>{const a=el.getAttribute('data-a');setS(a);});
  });
  const cfb=document.querySelector('.cfb');
  document.querySelectorAll('.focus-session-btn').forEach(el=>{
    el.addEventListener('click',()=>{sf(parseInt(el.getAttribute('data-min')));});
  });
  if(cfb)cfb.addEventListener('click',cf);
  const btnAuto=document.getElementById('btn-auto');
  if(btnAuto)btnAuto.addEventListener('click',toggleAutoCombat);
  document.querySelectorAll('.secret-choice').forEach(el=>{
    el.addEventListener('click',()=>{ makeSecretChoice(el.getAttribute('data-choice')); render(); });
  });
  const btnCloseSecret=document.getElementById('btn-close-secret');
  if(btnCloseSecret)btnCloseSecret.addEventListener('click',closeSecretArea);
  document.querySelectorAll('.spec-card').forEach(el=>{
    el.addEventListener('click',()=>{ if(G.p.lvl>=3) { const spec=el.getAttribute('data-spec'); if(chooseSpecPath(spec)) render(); } });
  });
  document.querySelectorAll('.spec-unlock-btn').forEach(el=>{
    el.addEventListener('click',()=>{ const tier=parseInt(el.getAttribute('data-tier')); if(unlockSpecTier(tier)) render(); });
  });
  const btnRespec=document.getElementById('btn-respec');
  if(btnRespec)btnRespec.addEventListener('click',respecPath);
  document.querySelectorAll('.ministory-choice').forEach(el=>{
    el.addEventListener('click',()=>{ makeMiniStoryChoice(parseInt(el.getAttribute('data-choice'))); });
  });
  const btnCloseMini=document.getElementById('btn-close-ministory');
  if(btnCloseMini)btnCloseMini.addEventListener('click',closeMiniStory);

// Journal entry click handlers
document.querySelectorAll('.journal-card[data-jid]').forEach(el=>{
  el.addEventListener('click',()=>{
    const jid=el.getAttribute('data-jid');
    const entry=G.storyJournal.entries.find(e=>e.id===jid);
    if(entry&&G.storyJournal.unlocked.includes(jid)){
      G.currentJournalEntry=jid;
      setS('journalentry');
    }
  });
});
const btnBackJournal=document.getElementById('btn-back-journal');
if(btnBackJournal)btnBackJournal.addEventListener('click',()=>{ setS('journal'); });

  document.querySelectorAll('.rs-card:not(.locked):not(.active)').forEach(el=>{
    el.addEventListener('click',()=>{const id=el.getAttribute('data-id');startRest(id);});
  });
  document.querySelectorAll('.soel-bless-btn').forEach(el=>{
    el.addEventListener('click',()=>{soelBless(el.getAttribute('data-n'));});
  });
  const cancelRestBtn=document.getElementById('cancel-rest');
  if(cancelRestBtn)cancelRestBtn.addEventListener('click',cancelRest);
  document.querySelectorAll('.npc-buy').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      buyFromNPC(el.getAttribute('data-npc'),parseInt(el.getAttribute('data-item')));
    });
  });
  document.querySelectorAll('.amad-sell').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      sellToAmad(parseInt(el.getAttribute('data-index')));
    });
  });
  document.querySelectorAll('.tr-btn:not(.dis)').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      reviveMember(el.getAttribute('data-m'));
    });
  });
  document.querySelectorAll('.equip-pgear').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      equipPartyGearSlot(el.getAttribute('data-member'), el.getAttribute('data-slot'), parseInt(el.getAttribute('data-idx')));
    });
  // Stage 1: Trinket shop
  document.querySelectorAll('.trinket-buy-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      buyTrinket(parseInt(el.getAttribute('data-tidx')));
    });
  });

  });
  document.querySelectorAll('.unequip-pgear').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      unequipPartyGearSlot(el.getAttribute('data-member'), el.getAttribute('data-slot'));
    });
  });
}

function rSecret(){
  const area = G.secretAreas[G.secretArea.zone];
  if (!area) return '<div>Error</div>';
  let h = '<div style="padding:20px;text-align:center;">';
  h += '<h2 style="color:var(--accent-light);">🔍 ' + area.name + '</h2>';
  h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;">' + area.desc + '</div>';
  if (!G.secretArea.choice && G.secretArea.result !== 'done') {
    for (let choice of area.choices) {
      const isRisky = choice.risk === 'high';
      h += '<button class="secret-choice" data-choice="' + choice.id + '" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:14px;border-radius:14px;border:2px solid '+(isRisky?'var(--danger)':'var(--accent)')+';background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;">';
      h += choice.label + (isRisky ? ' ⚠️' : '') + '</button>';
    }
  } else if (G.secretArea.result === 'ambush') {
    h += '<div style="color:var(--danger);font-size:18px;margin:20px;">💥 Ambush!</div>';
    h += '<button class="abtn" onclick="render()">Fight!</button>';
  } else {
    h += '<div style="margin:20px;">' + (G.secretArea.result === 'loot' ? '🎁 Found something!' : '📦 Empty...') + '</div>';
    h += '<button class="abtn" id="btn-close-secret">Continue</button>';
  }
  h += '</div>';
  return h;
}

function rSkillTree(){
  let h = '<div style="padding:16px;">';
  h += '<h2 class="st">🌳 Skill Trees</h2>';
  if (!G.playerSpec.path) {
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;text-align:center;">Choose your specialization at Level 3.</div>';
    h += '<div style="display:flex;flex-direction:column;gap:12px;">';
    for (let [key, path] of Object.entries(G.skillTrees)) {
      const canChoose = G.p.lvl >= 3;
      h += '<div class="spec-card" data-spec="' + key + '" style="background:var(--bg-card);border:2px solid '+(canChoose?path.color:'var(--disabled)')+';border-radius:16px;padding:16px;cursor:'+(canChoose?'pointer':'not-allowed')+';opacity:'+(canChoose?'1':'0.5')+';">';
      h += '<span style="font-size:32px;">' + path.icon + '</span>';
      h += '<div style="font-size:16px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
      h += '<div style="font-size:11px;color:var(--text-dim);">' + path.desc + '</div>';
      for (let i = 0; i < path.tiers.length; i++) {
        const tier = path.tiers[i];
        h += '<div style="font-size:12px;padding:8px;background:var(--bg-hover);border-radius:8px;margin-top:8px;">';
        h += '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:'+path.color+'20;color:'+path.color+';">Lv.' + tier.level + '</span> ';
        h += '<b>' + tier.name + '</b> — ' + tier.desc + '</div>';
      }
      if (!canChoose) h += '<div style="margin-top:10px;font-size:11px;color:var(--danger);text-align:center;">🔒 Requires Level 3</div>';
      h += '</div>';
    }
    h += '</div>';
  } else {
    const path = G.skillTrees[G.playerSpec.path];
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<span style="font-size:48px;">' + path.icon + '</span>';
    h += '<div style="font-size:20px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
    h += '</div>';
    for (let i = 0; i < path.tiers.length; i++) {
      const tier = path.tiers[i];
      const unlocked = G.playerSpec.tiers.includes(i);
      const canUnlock = canUnlockTier(i);
      h += '<div style="background:var(--bg-card);border:2px solid '+(unlocked?path.color:canUnlock?path.color+'60':'var(--disabled)')+';border-radius:14px;padding:14px;margin-bottom:12px;">';
      h += '<div style="font-weight:700;color:'+(unlocked?path.color:'var(--text-dim)')+';">' + (unlocked?'✅':canUnlock?'🔓':'🔒') + ' ' + tier.name + '</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">' + tier.desc + '</div>';
      if (unlocked) h += '<div style="font-size:11px;color:var(--success);font-weight:600;">✨ ACTIVE</div>';
      else if (canUnlock) h += '<button class="spec-unlock-btn" data-tier="' + i + '" style="width:100%;padding:10px;border-radius:10px;border:none;background:'+path.color+';color:white;font-size:13px;font-weight:600;cursor:pointer;">Unlock ' + tier.name + '</button>';
      else if (G.p.lvl < tier.level) h += '<div style="font-size:11px;color:var(--danger);">🔒 Requires Level ' + tier.level + '</div>';
      else h += '<div style="font-size:11px;color:var(--text-dim);">🔒 Complete previous tier</div>';
      h += '</div>';
    }
    const respecCost = 50 + (G.playerSpec.respecCount * 50);
    const canRespec = G.p.gold >= respecCost;
    h += '<button id="btn-respec" style="width:100%;padding:10px;border-radius:10px;border:1px solid '+(canRespec?'var(--danger)':'var(--disabled)')+';background:transparent;color:'+(canRespec?'var(--danger)':'var(--disabled)')+';font-size:12px;font-weight:600;cursor:'+(canRespec?'pointer':'not-allowed')+';">🔄 Respec (' + respecCost + 'G)</button>';
  }
  h += '</div>';
  return h;
}

function rMiniStory(){
  const story = G.currentMiniStory;
  if (!story) return '<div>Error</div>';
  let h = '<div style="padding:20px;text-align:center;">';
  h += '<div style="font-size:48px;margin-bottom:12px;">' + story.icon + '</div>';
  h += '<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Random Encounter</div>';
  h += '<h2 style="font-family:Cinzel,serif;font-size:20px;margin-bottom:8px;">' + story.name + '</h2>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:20px;">' + story.title + '</div>';
  for (let line of story.dialogue) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:20px;text-align:left;">';
    h += '<div style="font-size:11px;color:var(--accent-light);font-weight:600;margin-bottom:6px;">' + line.speaker + '</div>';
    h += '<div style="font-size:14px;line-height:1.7;">' + line.text + '</div></div>';
  }
  if (!story.choice && story.result !== 'done') {
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto;">';
    for (let i = 0; i < story.choices.length; i++) {
      const ch = story.choices[i];
      let canChoose = true, reason = '';
      if (ch.req && !G.party.some(p => p.on && p.n === ch.req)) { canChoose = false; reason = 'Requires ' + ch.req; }
      if (ch.cost && ch.cost.gold && G.p.gold < ch.cost.gold) { canChoose = false; reason = 'Need ' + ch.cost.gold + 'G'; }
      if (ch.cost && ch.cost.item) { const item = G.p.inv.find(inv => inv.n === ch.cost.item); if (!item || item.q < (ch.cost.qty || 1)) { canChoose = false; reason = 'Need ' + (ch.cost.qty || 1) + ' ' + ch.cost.item; } }
      h += '<button class="ministory-choice" data-choice="' + i + '" style="padding:14px 18px;border-radius:14px;border:2px solid '+(canChoose?'var(--accent)':'var(--disabled)')+';background:'+(canChoose?'var(--bg-card)':'var(--nav-bg)')+';color:'+(canChoose?'var(--text)':'var(--disabled)')+';font-size:13px;font-weight:600;cursor:'+(canChoose?'pointer':'not-allowed')+';user-select:none;text-align:left;">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
      h += '<span>' + ch.label + '</span>';
      if (!canChoose) h += '<span style="font-size:10px;color:var(--danger);">🔒 ' + reason + '</span>';
      h += '</div>';
      if (ch.cost && (ch.cost.gold || ch.cost.item)) {
        h += '<div style="font-size:10px;color:var(--danger);margin-top:4px;">Cost: ';
        if (ch.cost.gold) h += ch.cost.gold + 'G ';
        if (ch.cost.item) h += (ch.cost.qty || 1) + '× ' + ch.cost.item;
        h += '</div>';
      }
      if (ch.reward) {
        h += '<div style="font-size:10px;color:var(--success);margin-top:4px;">Reward: ';
        const rewards = [];
        if (ch.reward.xp) rewards.push(ch.reward.xp + ' XP');
        if (ch.reward.gold) rewards.push(ch.reward.gold + 'G');
        if (ch.reward.affinity) rewards.push('+' + ch.reward.amt + ' ' + ch.reward.affinity + ' affinity');
        if (ch.reward.item) rewards.push(ch.reward.item.n);
        h += rewards.join(', ') + '</div>';
      }
      h += '</button>';
    }
    h += '</div>';
  } else if (story.result === 'done') {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:20px;margin:20px auto;max-width:400px;">';
    h += '<div style="font-size:24px;margin-bottom:8px;">✨</div>';
    h += '<div style="font-size:14px;color:var(--text-dim);line-height:1.6;">' + story.choices[story.choice].response + '</div></div>';
    h += '<button class="abtn" id="btn-close-ministory" style="max-width:200px;margin:0 auto;display:block;">Continue</button>';
  }
  h += '</div>';
  return h;
}
function rJournal(){
  let h='<div style="padding:16px;">';
  h+='<div class="st">📖 Journal</div>';
  
  const entries=G.storyJournal.entries;
  const unlocked=G.storyJournal.unlocked;
  const read=G.storyJournal.read;
  
  if(entries.length===0){
    h+='<div class="ei">No entries yet.</div>';
    h+='</div>';
    return h;
  }
  
  for(let entry of entries){
    const isUnlocked=unlocked.includes(entry.id);
    const isRead=read.includes(entry.id);
    const stripeColor = !isUnlocked ? 'var(--border)' : (isRead ? 'var(--success)' : 'var(--accent)');
    
    h+='<div class="journal-card '+(isUnlocked?'':'locked')+'" data-jid="'+entry.id+'" style="--e-journal:'+stripeColor+';margin-bottom:10px;">';
    h+='<div class="zh">';
    h+='<div class="zn">'+entry.icon+' '+entry.title+'</div>';
    h+='<div class="zl">Ch. '+entry.chapter+'</div>';
    h+='</div>';
    h+='<div class="zd">'+(isUnlocked?entry.summary:'???')+'</div>';
    
    if(isUnlocked){
      h+='<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">';
      h+='<span style="font-size:11px;color:'+(isRead?'var(--success)':'var(--accent-light)')+';">';
      h+=isRead?'✓ Read':'● Unread';
      h+='</span>';
      h+='</div>';
    }else{
      h+='<div style="font-size:11px;color:var(--disabled);margin-top:8px;">';
      if(entry.unlockType==='level'){
        h+='🔒 Unlock at Level '+entry.unlockAt;
      }else if(entry.unlockType==='boss'){
        h+='🔒 Defeat '+entry.unlockAt;
      }else if(entry.unlockType==='zone'){
        h+='🔒 Visit '+entry.unlockAt;
      }
      h+='</div>';
    }
    h+='</div>';
  }
  
  h+='</div>';
  return h;
}

function rJournalEntry(jid){
  const entry=G.storyJournal.entries.find(e=>e.id===jid);
  if(!entry)return'<div>Entry not found</div>';
  
  if(!G.storyJournal.read.includes(jid)){
    G.storyJournal.read.push(jid);
  }
  
  let h='<div style="padding:16px;max-width:500px;margin:0 auto;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">📖 Journal — Chapter '+entry.chapter+'</div>';
  h+='<h2 style="font-family:Cinzel,serif;font-size:22px;margin-bottom:4px;">'+entry.icon+' '+entry.title+'</h2>';
  h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:24px;">'+entry.summary+'</div>';
  
  h+='<div style="width:100%;height:4px;background:var(--timer-bg);border-radius:2px;margin-bottom:24px;">';
  h+='<div style="width:100%;height:100%;background:var(--accent);border-radius:2px;"></div></div>';
  
  for(let scene of entry.scenes){
    const speakerColor = getSpeakerColor(scene.speaker);
    const isDialogue = scene.speaker !== 'Narrator';
    const sceneClass = isDialogue ? 'journal-scene journal-scene-dialogue' : 'journal-scene journal-scene-narrator';
    const textClass = isDialogue ? 'journal-text journal-text-dialogue' : 'journal-text journal-text-narrator';
    const styleAttr = speakerColor ? ' style="--e-speaker:' + speakerColor + ';"' : '';
    h+='<div class="'+sceneClass+'"'+styleAttr+'>';
    if (isDialogue) {
      h+='<div class="journal-speaker">'+scene.speaker+'</div>';
    }
    h+='<div class="'+textClass+'">'+scene.text+'</div>';
    h+='</div>';
  }
  
  h+='<button class="fbtn" id="btn-back-journal" style="margin-top:8px;">← Back to Journal</button>';
  h+='</div>';
  return h;
}

function rStory(){
  const chapter = G.storyChapters[G.story.chapter];
  const scene = chapter.scenes[G.story.scene];
  let h='<div class="story-view" style="text-align:center;padding:20px;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;">Chapter '+(G.story.chapter+1)+': '+chapter.title+'</div>';
  h+='<div class="dialogue-box" style="margin-bottom:24px;">';
  h+='<div class="d-speaker">'+scene.speaker+'</div>';
  h+='<div class="d-text" style="font-size:15px;line-height:1.7;">'+scene.text+'</div>';
  h+='</div>';
  h+='<button class="abtn" style="max-width:200px;margin:0 auto;display:block;">Continue</button>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);">'+(G.story.scene+1)+' / '+chapter.scenes.length+'</div>';
  h+='</div>';
  return h;
}

function rBestiary(){
  let h='<div class="bestiary-view"><h2 class="st">📖 Bestiary</h2>';
  const entries = Object.entries(G.bestiary).sort((a,b)=>b[1].kills-a[1].kills);
  if(entries.length===0){
    h+='<div style="text-align:center;padding:40px;color:var(--text-dim);">No creatures catalogued yet.<br>Defeat enemies to fill the bestiary.</div>';
  }else{
    h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;">'+entries.length+' species discovered</div>';
    h+='<div class="zlist">';
    for(let [name,data] of entries){
      const elemIcon = data.elem==='fire'?'🔥':data.elem==='ice'?'❄️':data.elem==='lightning'?'⚡':data.elem==='void'?'🌑':'✦';
      h+='<div class="zcard" style="cursor:default;">';
      h+='<div class="zh"><span class="zn">'+ee(name)+' '+name+'</span><span class="zl">'+data.kills+' kills</span></div>';
      h+='<div style="display:flex;gap:12px;font-size:12px;color:var(--text-dim);margin-top:6px;">';
      h+='<span>HP: '+data.mhp+'</span><span>ATK: '+data.atk+'</span><span>DEF: '+data.def+'</span><span>'+elemIcon+' '+data.elem+'</span>';
      h+='</div>';
      h+='<div style="font-size:10px;color:var(--disabled);margin-top:4px;">First seen: '+new Date(data.firstSeen).toLocaleDateString()+'</div>';
      h+='</div>';
    }
    h+='</div>';
  }
  h+='</div>';
  return h;
}



function rRunes(){
  // If socket modal is open, render that instead
  if (G.runeSocketModal && G.runeSocketModal.open) {
    return rRuneSocketModal();
  }
  // If combine modal is open, render that instead
  if (G.runeCombineModal && G.runeCombineModal.open) {
    return rRuneCombineModal();
  }

  let h='<div style="padding:16px;"><h2 class="st">💎 Rune Socketing</h2>';

  // Rune inventory with better visual cards
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Rune Inventory ('+G.runes.length+')</div>';
  if(G.runes.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;margin-bottom:16px;">No runes yet. Defeat enemies in Lv 10+ zones to find them.</div>';
  }else{
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const rarityGlow = r.r==='rare'?'0 0 8px '+r.color+'40':r.r==='epic'?'0 0 12px '+r.color+'60':'';
      h+='<div class="rune-item" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:12px;padding:10px 8px;text-align:center;cursor:pointer;user-select:none;box-shadow:'+rarityGlow+';transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">';
      h+='<div style="font-size:24px;margin-bottom:4px;">'+r.icon+'</div>';
      h+='<div style="font-size:11px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">';
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;
      h+= statLabel + ' +' + r.val;
      if(r.pct) h+=' ('+Math.floor(r.pct*100)+'%)';
      h+='</div>';
      h+='<div style="font-size:9px;color:var(--disabled);margin-top:2px;text-transform:uppercase;">'+r.r+'</div>';
      h+='</div>';
    }
    h+='</div>';

    // Combine button — now opens modal
    h+='<button id="btn-combine" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--accent);background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;box-shadow:0 2px 8px var(--shadow-accent);transition:transform 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.transform=\'none\'">';
    h+='🔮 Combine Runes';
    h+='</button>';
  }

  // Socketable gear with stat preview
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Socketable Gear</div>';
  const socketable = G.p.inv.filter(it => it.sockets && it.sockets.length > 0);
  if(socketable.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;">No socketed gear. Lv 10+ items have sockets.</div>';
  }else{
    h+='<div style="display:flex;flex-direction:column;gap:10px;">';
    for(let i=0;i<G.p.inv.length;i++){
      const it=G.p.inv[i];
      if(!it.sockets) continue;

      // Calculate current socket stats
      let currentStats = [];
      if (it.socketStats) {
        for (let k in it.socketStats) {
          if (k.endsWith('Pct')) continue;
          const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
          currentStats.push(label + '+' + it.socketStats[k]);
        }
      }

      h+='<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;transition:border-color 0.2s;" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">';
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
      h+='<div style="font-weight:700;font-size:14px;color:'+rc(it.r)+';">'+it.n+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);background:var(--bg-hover);padding:2px 8px;border-radius:8px;">iLvl '+it.ilvl+'</div>';
      h+='</div>';

      // Socket display with better visuals
      h+='<div style="display:flex;gap:8px;margin-bottom:10px;">';
      for(let s=0;s<it.sockets.length;s++){
        const socket = it.sockets[s];
        if(socket){
          h+='<div style="flex:1;background:'+socket.color+'15;border:2px solid '+socket.color+';border-radius:10px;padding:8px;text-align:center;">';
          h+='<div style="font-size:20px;">'+socket.icon+'</div>';
          h+='<div style="font-size:9px;font-weight:600;color:'+socket.color+';">'+socket.name.replace('Rune of ','')+'</div>';
          h+='</div>';
        }else{
          h+='<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:10px;padding:8px;text-align:center;opacity:0.6;">';
          h+='<div style="font-size:20px;color:var(--disabled);">○</div>';
          h+='<div style="font-size:9px;color:var(--disabled);">Empty</div>';
          h+='</div>';
        }
      }
      h+='</div>';

      // Current socket stats summary
      if(currentStats.length > 0){
        h+='<div style="font-size:10px;color:var(--success);margin-bottom:8px;padding:6px 10px;background:#22c55e10;border-radius:8px;">✨ Socketed: '+currentStats.join(' · ')+'</div>';
      }

      // Socket action buttons
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      for(let s=0;s<it.sockets.length;s++){
        if(!it.sockets[s]){
          h+='<button class="socket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px dashed var(--accent);background:transparent;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">💎 Socket</button>';
        }else{
          h+='<button class="unsocket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px solid '+it.sockets[s].color+';background:'+it.sockets[s].color+'15;color:'+it.sockets[s].color+';font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">'+it.sockets[s].icon+' Remove</button>';
        }
      }
      h+='</div></div>';
    }
    h+='</div>';
  }

  h+='</div>';
  return h;
}

// NEW: Rune Socket Selection Modal
function rRuneSocketModal() {
  const { itemIndex, slotIndex } = G.runeSocketModal;
  const item = G.p.inv[itemIndex];
  if (!item) return '<div>Error</div>';

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">💎 Socket Rune</h2>';
  h += '</div>';

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;">';
  h += '<div style="font-weight:700;font-size:14px;color:'+rc(item.r)+';">'+item.n+'</div>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Slot '+(slotIndex+1)+' of '+item.sockets.length+'</div>';

  // Show current socket stats on this item
  let currentStats = [];
  if (item.socketStats) {
    for (let k in item.socketStats) {
      if (k.endsWith('Pct')) continue;
      const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
      currentStats.push(label + '+' + item.socketStats[k]);
    }
  }
  if(currentStats.length > 0){
    h += '<div style="font-size:10px;color:var(--success);margin-top:8px;">Current sockets: '+currentStats.join(' · ')+'</div>';
  }
  h += '</div>';

  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Choose a Rune ('+G.runes.length+' available)</div>';

  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes available!</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      // Calculate preview: what will this rune add?
      const currentVal = item.socketStats && item.socketStats[r.stat] ? item.socketStats[r.stat] : 0;
      const newVal = currentVal + r.val;

      h += '<button class="rune-select-btn" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:14px;padding:14px;text-align:left;cursor:pointer;transition:all 0.2s;">';
      h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      h += '<span style="font-size:28px;">'+r.icon+'</span>';
      h += '<div style="flex:1;">';
      h += '<div style="font-size:13px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h += '<div style="font-size:9px;color:var(--disabled);text-transform:uppercase;">'+r.r+'</div>';
      h += '</div>';
      h += '</div>';

      // Stat preview with before/after
      h += '<div style="background:var(--bg-hover);border-radius:8px;padding:8px 10px;margin-bottom:6px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">'+statLabel+'</div>';
      h += '<div style="display:flex;align-items:center;gap:6px;">';
      h += '<span style="font-size:11px;color:var(--text-dim);">'+currentVal+'</span>';
      h += '<span style="color:var(--success);font-size:12px;">→</span>';
      h += '<span style="font-size:14px;font-weight:700;color:'+r.color+';">'+newVal+'</span>';
      if(r.pct) h += '<span style="font-size:10px;color:var(--success);">(+'+Math.floor(r.pct*100)+'%)</span>';
      h += '</div></div>';

      h += '<div style="font-size:10px;color:var(--accent);text-align:center;font-weight:600;">Tap to Socket</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

// NEW: Rune Combine Modal
function rRuneCombineModal() {
  const selected = G.runeCombineModal.selected;
  const preview = getCombinePreview();

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">🔮 Combine Runes</h2>';
  h += '</div>';

  h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Select 3 runes of the same type to combine into a stronger version.</div>';

  // Selected runes display
  h += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  for(let i=0;i<3;i++){
    if(selected[i] !== undefined && G.runes[selected[i]]){
      const r = G.runes[selected[i]];
      h += '<div style="flex:1;background:'+r.color+'15;border:2px solid '+r.color+';border-radius:12px;padding:12px;text-align:center;">';
      h += '<div style="font-size:28px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+r.color+';">'+r.name+'</div>';
      h += '</div>';
    }else{
      h += '<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:12px;padding:12px;text-align:center;opacity:0.5;">';
      h += '<div style="font-size:28px;color:var(--disabled);">?</div>';
      h += '<div style="font-size:10px;color:var(--disabled);">Slot '+(i+1)+'</div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Preview result
  if(preview && !preview.error){
    h += '<div style="background:linear-gradient(135deg,#7c3aed15,#a78bfa15);border:2px solid var(--accent);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">';
    h += '<div style="font-size:11px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Result Preview</div>';
    h += '<div style="font-size:36px;margin-bottom:4px;">'+preview.icon+'</div>';
    h += '<div style="font-size:16px;font-weight:700;color:var(--accent-light);">'+preview.name+'</div>';
    h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">';
    const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[preview.stat] || preview.stat;
    h += statLabel + ' +' + preview.val;
    if(preview.pct) h += ' (+'+Math.floor(preview.pct*100)+'%)';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--gold);margin-top:4px;">'+preview.r.toUpperCase()+'</div>';
    h += '</div>';

    h += '<button id="btn-confirm-combine" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px var(--shadow-accent);">✨ Combine!</button>';
  }else if(preview && preview.error){
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--danger);font-size:13px;">'+preview.error+'</div>';
  }else{
    h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--text-dim);font-size:13px;">Select 3 matching runes to see the result</div>';
  }

  // Rune grid for selection
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin:16px 0 10px;">Your Runes</div>';
  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes to combine.</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const isSelected = selected.includes(i);
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      h += '<button class="rune-combine-select" data-ri="'+i+'" style="background:'+(isSelected?r.color+'30':'var(--bg-card)')+';border:2px solid '+(isSelected?r.color:'var(--border)')+';border-radius:12px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;">';
      if(isSelected){
        h += '<div style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">✓</div>';
      }
      h += '<div style="font-size:22px;margin-bottom:4px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+(isSelected?r.color:'var(--text)')+';">'+r.name.replace('Rune of ','')+'</div>';
      h += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">'+statLabel+'+'+r.val+'</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

// === REPLACE your rGrindRoom function with this ===

function rGrindChampionship() {
  const gc = G.grindChampionship;
  const curIdx = getGrindTierIndex(gc.bestWave);
  const curTier = curIdx >= 0 ? GRIND_TIERS[curIdx] : null;
  const nextTier = GRIND_TIERS[curIdx + 1] || null;

  let h = '<div class="panel panel-gold">';
  h += '<div class="panel-row">';
  h += '<div class="panel-title panel-title-gold">🏆 Grind Championship</div>';
  h += '<div class="btn-hint">Best Wave: <b>' + gc.bestWave + '</b></div>';
  h += '</div>';

  if (curTier) {
    h += '<div class="stat-block">';
    h += '<div class="stat-icon-lg">' + curTier.icon + '</div>';
    h += '<div class="stat-name">' + curTier.name + '</div>';
    h += '<div class="stat-sub stat-sub-accent">Permanent bonus: +' + Math.round(curTier.bonusPct * 100) + '% grind XP/Gold</div>';
    h += '</div>';
  } else {
    h += '<div class="stat-block">';
    h += '<div class="stat-name" style="color:var(--text-dim);">Unranked</div>';
    h += '<div class="stat-sub stat-sub-dim">Reach Wave ' + GRIND_TIERS[0].waveReq + ' to earn your first rank</div>';
    h += '</div>';
  }

  if (nextTier) {
    const prevReq = curTier ? curTier.waveReq : 0;
    const span = nextTier.waveReq - prevReq;
    const progressed = Math.max(0, gc.bestWave - prevReq);
    const pct = Math.min(100, Math.floor((progressed / span) * 100));
    h += '<div class="pbar-label">Next: ' + nextTier.icon + ' ' + nextTier.name + ' (Wave ' + nextTier.waveReq + ')</div>';
    h += '<div class="pbar"><div class="pbar-fill" style="width:' + pct + '%;"></div></div>';
  } else if (curTier) {
    h += '<div class="stat-sub stat-sub-gold" style="text-align:center;">👑 Max League Reached!</div>';
  }

  h += '<div class="icon-row">';
  for (let t of GRIND_TIERS) {
    const claimed = gc.claimedTiers.includes(t.id);
    h += '<span title="' + t.name + ' — Wave ' + t.waveReq + '" class="' + (claimed ? 'icon-earned' : 'icon-locked') + '">' + t.icon + '</span>';
  }
  h += '</div>';

  h += '</div>';
  return h;
}

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div class="pstat">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffClass = { normal: 'sel-normal', hard: 'sel-hard', nightmare: 'sel-nightmare' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span class="badge diff-btn ' + diffClass[g.difficulty] + '" style="display:inline-block;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // === CHAMPIONSHIP LADDER ===
  h += rGrindChampionship();
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div class="panel">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div class="panel-title panel-title-accent" style="margin-bottom:10px;">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div class="btn-hint" style="margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 35);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" class="tier-btn' + (isSel ? ' sel' : '') + '" title="' + (z ? z.n : '') + '">Lv.' + t + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div class="btn-hint" style="margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" class="diff-btn' + (isSel ? ' sel-' + d : '') + '">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div class="panel-title panel-title-accent" style="margin-bottom:10px;">Wave ' + g.wave + ' Complete!</div>';
      h += '<div class="btn-hint" style="margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" class="btn-outline-danger">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" class="btn-outline-ghost">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div class="panel panel-danger">';
    h += '<div class="btn-hint" style="margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" class="btn-stop">⏹ STOP GRIND</button>';
    h += '<div class="btn-hint">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div class="panel">';
    h += '<div class="panel-title panel-title-accent" style="margin-bottom:8px;">📊 This Session</div>';
    h += '<div class="grid2">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}

function rRaidSelect() {
  let h = '<div class="content">';
  h += '<div class="st" style="text-align:center;">⚔️ Raid Mode</div>';
  h += '<div class="btn-hint" style="text-align:center;margin-bottom:16px;">Boss gauntlets guarded by elite packs. Only ' + Math.round(RAID_STAGE_RECOVERY_PCT * 100) + '% recovery between stages, and raid bosses hit harder than their zone versions. No progress saved mid-raid.</div>';

  for (let raid of RAIDS) {
    const unlocked = isRaidUnlocked(raid);
    const cleared = G.raidProgress.cleared.includes(raid.id);
    const bossCount = raid.stages.filter(s => s.type === 'boss').length;
    const eliteCount = raid.stages.filter(s => s.type === 'elite').length;
    h += '<div class="panel' + (cleared ? ' panel-gold' : '') + '" style="' + (unlocked ? '' : 'opacity:0.55;') + '">';
    h += '<div class="panel-row">';
    h += '<div class="panel-title">' + raid.icon + ' ' + raid.name + (cleared ? ' <span style="color:var(--gold);">✓</span>' : '') + '</div>';
    h += '<div class="btn-hint">Lv.' + raid.unlockLevel + '</div>';
    h += '</div>';
    h += '<div class="btn-hint" style="margin-bottom:8px;">' + raid.desc + '</div>';
    h += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">';
    for (let stage of raid.stages) {
      if (stage.type === 'boss') {
        h += '<span class="badge" style="background:color-mix(in srgb, var(--danger) 15%, transparent);color:var(--danger);">👑 ' + stage.name + '</span>';
      } else {
        h += '<span class="badge" style="background:color-mix(in srgb, var(--el-void) 15%, transparent);color:var(--el-void);">⚔️ Elite Pack</span>';
      }
    }
    h += '</div>';
    if (unlocked) {
      h += '<button onclick="enterRaid(\'' + raid.id + '\')" class="abtn" style="width:100%;">' + (cleared ? 'Raid Again' : 'Begin Raid') + ' (' + bossCount + ' bosses, ' + eliteCount + ' elite packs)</button>';
    } else {
      h += '<div class="btn-hint" style="text-align:center;">🔒 Unlocks at Level ' + raid.unlockLevel + '</div>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rRaidRoom() {
  const raid = getRaidById(G.raid.raidId);
  if (!raid) return '<div class="content"><div class="st">No active raid.</div></div>';
  const nextStage = raid.stages[G.raid.stageIndex];

  let h = '<div class="content">';
  h += '<div class="st" style="text-align:center;">' + raid.icon + ' ' + raid.name + '</div>';

  h += '<div class="panel">';
  h += '<div class="panel-title panel-title-accent" style="margin-bottom:8px;">Stage ' + (G.raid.stageIndex + 1) + ' of ' + raid.stages.length + '</div>';
  h += '<div class="pbar" style="margin-bottom:10px;"><div class="pbar-fill" style="width:' + Math.floor((G.raid.stageIndex / raid.stages.length) * 100) + '%;"></div></div>';
  h += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;">';
  for (let i = 0; i < raid.stages.length; i++) {
    const s = raid.stages[i];
    const done = i < G.raid.stageIndex;
    const isNext = i === G.raid.stageIndex;
    const label = s.type === 'boss' ? '👑 ' + s.name : '⚔️ Elite';
    h += '<span class="badge" style="background:' + (done ? 'color-mix(in srgb, var(--success) 20%, transparent)' : isNext ? 'color-mix(in srgb, var(--gold) 20%, transparent)' : 'var(--bg-hover)') + ';color:' + (done ? 'var(--success)' : isNext ? 'var(--gold)' : 'var(--text-dim)') + ';">' + (done ? '✓ ' : '') + label + '</span>';
  }
  h += '</div>';
  const faceLabel = nextStage ? (nextStage.type === 'boss' ? nextStage.name : 'Elite Pack') : '...';
  h += '<button onclick="startRaidStage()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Face ' + faceLabel + '</button>';
  h += '<button onclick="exitRaid()" class="btn-outline-ghost">🚪 Abandon Raid</button>';
  h += '</div>';

  h += '</div>';
  return h;
}


function rMenu(){
  const primary=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'⚔️',l:'Raid Mode',d:'Boss gauntlets + elites',a:'raid_select'},
  ];
  const sections=[
    { title: '🧙 Character', items: [
      {i:'✨',l:'Skills',a:'skills'},
      {i:'🌳',l:'Skill Trees',a:'skilltree'},
      {i:'🌟',l:'Talents',a:'talents'},
      {i:'💎',l:'Runes',a:'runes'},
    ]},
    { title: '🎒 Manage', items: [
      {i:'🎒',l:'Inventory',a:'inventory'},
      {i:'⚒️',l:'Crafting',a:'craft'},
      {i:'🧳',l:'Traders',a:'npc'},
      {i:'📜',l:'Quests',a:'quest'},
    ]},
    { title: '📖 Progress', items: [
      {i:'📖',l:'Journal',a:'journal'},
      {i:'📖',l:'Bestiary',a:'bestiary'},
      {i:'🏆',l:'Achievements',a:'achievements'},
    ]},
    { title: '🕯️ Other', items: [
      {i:'🧘',l:'Focus',a:'focus'},
      {i:'💤',l:'Rest',a:'rest'},
    ]},
  ];

  let h='<div class="grid2">';
  for(let m of primary)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';

  for(let sec of sections){
    h+='<div class="menu-section-title">'+sec.title+'</div>';
    h+='<div class="menu-grid-compact">';
    for(let m of sec.items)h+='<div class="card card-compact" data-a="'+m.a+'"><div class="cicon-compact">'+m.i+'</div><div class="clabel-compact">'+m.l+'</div></div>';
    h+='</div>';
  }
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

// === ZONE ICONS: hand-picked flat icon per zone (only 37 zones, unlike 138 enemies,
// so each gets its own rather than an algorithmic archetype guess) ===
const ZONE_ICON_SVGS = {
  tree: '<svg viewBox="0 0 24 24"><path d="M12 2 C15 5 18 8 18 12 C18 16 15 18 12 18 C9 18 6 16 6 12 C6 8 9 5 12 2 Z" fill="#4a7a3a"/><path d="M12 7 C13.5 9 15 10.5 15 12.5 C15 14.5 13.5 15.5 12 15.5 C10.5 15.5 9 14.5 9 12.5 C9 10.5 10.5 9 12 7 Z" fill="#6ba852"/><rect x="10.7" y="16" width="2.6" height="5" fill="#6b4a2a"/></svg>',
  skull: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="7" fill="#d8d4c8"/><rect x="8" y="8" width="2.5" height="3.5" rx="1" fill="#2a2820"/><rect x="13.5" y="8" width="2.5" height="3.5" rx="1" fill="#2a2820"/><polygon points="5,15 7,19 9,15 11,19 13,15 15,19 17,15 19,19 19,16 5,16" fill="#d8d4c8"/></svg>',
  crystal: '<svg viewBox="0 0 24 24"><polygon points="12,2 18,9 15,21 9,21 6,9" fill="#7dd3e8"/><polygon points="12,2 18,9 12,11" fill="#a8e6f5"/><polygon points="12,2 6,9 12,11" fill="#5bb8ce"/></svg>',
  volcano: '<svg viewBox="0 0 24 24"><polygon points="4,20 10,6 14,6 20,20" fill="#4a3a35"/><polygon points="10,6 14,6 12,2" fill="#e0693a"/><path d="M12 3 C13 5 15 6 15 8 C15 9.5 13.5 10.5 12 10.5 C10.5 10.5 9 9.5 9 8 C9 6 11 5 12 3 Z" fill="#f5a84a"/></svg>',
  storm: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="9" rx="8" ry="5" fill="#6b7a8a"/><polygon points="13,10 9,16 12,16 10,21 16,13 13,13" fill="#eab308"/></svg>',
  snowflake: '<svg viewBox="0 0 24 24" fill="none" stroke="#a8dcf0" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="7" x2="20" y2="17"/><line x1="4" y1="17" x2="20" y2="7"/></svg>',
  wave: '<svg viewBox="0 0 24 24"><path d="M2 16 Q6 11 10 16 Q14 21 18 16 Q20 13.5 22 16 L22 22 L2 22 Z" fill="#3a7ca8"/><path d="M2 12 Q6 8 10 12 Q14 16 18 12 Q20 10 22 12" fill="none" stroke="#6bb0d8" stroke-width="1.5"/></svg>',
  void: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#2a1a3a"/><path d="M12 4 C16 6 18 9 18 12 C18 16 15 19 12 19" fill="none" stroke="#8b5cf6" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="#8b5cf6"/></svg>',
  dragon: '<svg viewBox="0 0 24 24"><polygon points="12,3 20,10 15,10 19,20 12,15 5,20 9,10 4,10" fill="#c0392b"/><circle cx="12" cy="10" r="1.4" fill="#f5d76e"/></svg>',
  serpent: '<svg viewBox="0 0 24 24" fill="none" stroke="#6a9a4a" stroke-width="3" stroke-linecap="round"><path d="M3,6 Q9,3 12,9 Q15,15 21,12"/></svg>',
  star: '<svg viewBox="0 0 24 24"><polygon points="12,2 14.5,9 22,9 16,13.5 18,21 12,16.5 6,21 8,13.5 2,9 9.5,9" fill="#f5d76e"/></svg>',
  tower: '<svg viewBox="0 0 24 24"><polygon points="12,2 17,7 15,7 15,20 9,20 9,7 7,7" fill="#8b7ab8"/><rect x="10" y="10" width="4" height="3" fill="#2a1a3a"/></svg>',
  shard: '<svg viewBox="0 0 24 24"><polygon points="12,2 20,9 14,22 10,22 4,9" fill="#a78bfa" opacity="0.9"/><polygon points="12,2 20,9 12,12" fill="#c4b5fd"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2 C14 6 17 9 17 13 C17 17.5 14.5 20 12 20 C9.5 20 7 17.5 7 13 C7 9 10 6 12 2 Z" fill="#e0693a"/><path d="M12 8 C13 10 14.5 11.5 14.5 13.5 C14.5 15.5 13.5 17 12 17 C10.5 17 9.5 15.5 9.5 13.5 C9.5 11.5 11 10 12 8 Z" fill="#f5a84a"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#4a4a6a"/><line x1="12" y1="12" x2="12" y2="6" stroke="#e8e6f0" stroke-width="1.6" stroke-linecap="round"/><line x1="12" y1="12" x2="16" y2="13.5" stroke="#e8e6f0" stroke-width="1.6" stroke-linecap="round"/></svg>',
  flower: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3" fill="#e879c9"/><circle cx="16.5" cy="10.5" r="3" fill="#f0a8de"/><circle cx="14.5" cy="15.5" r="3" fill="#e879c9"/><circle cx="9.5" cy="15.5" r="3" fill="#f0a8de"/><circle cx="7.5" cy="10.5" r="3" fill="#e879c9"/><circle cx="12" cy="12" r="2.3" fill="#f5d76e"/></svg>',
  portal: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="9" fill="none" stroke="#a78bfa" stroke-width="2.5"/><ellipse cx="12" cy="12" rx="4" ry="5" fill="#7c3aed" opacity="0.6"/></svg>',
  nexusswirl: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#2a1a3a"/><path d="M12 3 Q19 6 19 12 Q19 18 12 21 Q5 18 5 12 Q5 6 12 3" fill="none" stroke="#c4b5fd" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="#c4b5fd"/></svg>',
  cosmicswirl: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#1a1530"/><circle cx="8" cy="9" r="1" fill="#f5d76e"/><circle cx="16" cy="8" r="0.8" fill="#f5d76e"/><circle cx="15" cy="16" r="1.2" fill="#f5d76e"/><path d="M6 14 Q12 8 18 14" fill="none" stroke="#a78bfa" stroke-width="1.8"/></svg>',
  crown: '<svg viewBox="0 0 24 24"><polygon points="4,18 4,10 8,13 12,7 16,13 20,10 20,18" fill="#eab308"/><rect x="4" y="18" width="16" height="2.5" fill="#ca8a04"/></svg>',
  throne: '<svg viewBox="0 0 24 24"><rect x="7" y="10" width="10" height="9" fill="#5a4a6a"/><rect x="6" y="4" width="12" height="7" fill="#7a6a8a"/><rect x="9" y="19" width="2" height="2" fill="#3a2a4a"/><rect x="13" y="19" width="2" height="2" fill="#3a2a4a"/></svg>',
  peak: '<svg viewBox="0 0 24 24"><polygon points="12,3 20,20 4,20" fill="#8a8a9a"/><polygon points="12,3 15,9 9,9" fill="#e8e6f0"/></svg>',
  fracture: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#2a1a3a"/><path d="M12 3 L10 10 L14 11 L9 21 L13 12 L9 11 Z" fill="#8b5cf6"/></svg>',
  ruins: '<svg viewBox="0 0 24 24"><rect x="5" y="8" width="3" height="13" fill="#8a8577"/><rect x="10.5" y="4" width="3" height="17" fill="#a8a294"/><rect x="16" y="10" width="3" height="11" fill="#8a8577"/><rect x="3" y="21" width="18" height="1.5" fill="#6a655a"/></svg>',
  market: '<svg viewBox="0 0 24 24"><polygon points="3,9 21,9 19,4 5,4" fill="#c0392b"/><rect x="5" y="9" width="14" height="10" fill="#8a6a4a"/><rect x="10" y="13" width="4" height="6" fill="#4a3a2a"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 4 Q8 3 12 4.5 L12 20 Q8 18.5 4 19.5 Z" fill="#3a6a8a"/><path d="M20 4 Q16 3 12 4.5 L12 20 Q16 18.5 20 19.5 Z" fill="#4a7a9a"/></svg>',
  anchor: '<svg viewBox="0 0 24 24" fill="none" stroke="#7a8590" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="2" fill="#7a8590" stroke="none"/><line x1="12" y1="7" x2="12" y2="20"/><path d="M6 14 Q6 20 12 20 Q18 20 18 14"/><line x1="7" y1="10" x2="17" y2="10"/></svg>',
  lighthouse: '<svg viewBox="0 0 24 24"><polygon points="10,2 14,2 15,10 9,10" fill="#e8e6f0"/><polygon points="9,10 15,10 17,21 7,21" fill="#c0392b"/><rect x="8" y="14" width="8" height="2" fill="#e8e6f0"/><polygon points="9,2 15,2 13,-1 11,-1" fill="#f5d76e"/></svg>',
  default: '<svg viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill="#8a8a9a"/></svg>'
};

const ZONE_ICON_MAP = {
  'Whispering Woods': 'tree', 'Cursed Catacombs': 'skull', 'Crystal Caverns': 'crystal',
  'Ember Peak': 'volcano', 'Stormhold': 'storm', 'Frostspire Ruins': 'snowflake',
  'Sunken Temple': 'wave', 'Abyssal Depths': 'void', "Dragon's Maw": 'dragon',
  "Serpent's Coil": 'serpent', 'Starlight Spire': 'star', 'Arcane Planar Tower': 'tower',
  'The Shattered Veil': 'shard', 'Emberfall Dimension': 'flame', 'Frostbound Eternity': 'snowflake',
  "Stormcaller's Cradle": 'storm', 'The Fulcrum': 'portal', 'The Void Between': 'void',
  'Chronos Spire': 'clock', 'Aetherium Gardens': 'flower', 'The Convergence': 'portal',
  'The Nexus': 'nexusswirl', 'The Fractured Veil': 'shard', 'The Astral Maelstrom': 'cosmicswirl',
  'Infernal Crucible': 'flame', 'The Scorched Vein': 'volcano', 'Tidal Abyss': 'wave',
  'The Shattered Crown': 'crown', 'The Hollow Throne': 'throne', 'The Final Spire': 'star',
  'The Apex': 'peak', 'The Breaking': 'fracture', 'The Silent Ruin': 'ruins',
  'Ashfall Market': 'market', 'The Drowned Ledger': 'book', 'Rustbound Docks': 'anchor',
  "The Widow's Watch": 'lighthouse'
};

function getZoneIcon(zoneName) {
  const key = ZONE_ICON_MAP[zoneName] || 'default';
  return ZONE_ICON_SVGS[key] || ZONE_ICON_SVGS.default;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2>';
  h += rZoneMapView();
  h += '</div>';
  return h;
}

function rZoneMapView() {
  const spacingY = 110;
  const centerX = 150;
  const amplitude = 100;
  const height = G.zones.length * spacingY + 80;

  const points = G.zones.map((z, i) => ({
    x: Math.round(centerX + amplitude * Math.sin(i * 0.8)),
    y: 50 + i * spacingY
  }));

  let h = '<div style="position:relative;width:300px;max-width:100%;margin:0 auto;height:' + height + 'px;">';

  h += '<svg viewBox="0 0 300 ' + height + '" style="position:absolute;top:0;left:0;width:100%;height:100%;" preserveAspectRatio="none">';
  h += '<polyline points="' + points.map(p => p.x + ',' + p.y).join(' ') + '" fill="none" stroke="var(--border)" stroke-width="3" stroke-dasharray="6,6"/>';
  h += '</svg>';

  for (let i = 0; i < G.zones.length; i++) {
    const z = G.zones[i], lk = G.p.lvl < z.lv, p = points[i];
    const dc = z.dg=='low'?'var(--success)':z.dg=='medium'?'var(--gold)':z.dg=='high'?'var(--el-fire)':z.dg=='very high'?'var(--danger)':'var(--el-void)';
    const isBossZone = G.bosses.some(b => b.zone === z.n);
    h += '<div class="zcard map-node' + (lk ? ' locked' : '') + '" data-i="' + i + '" style="border-color:' + dc + ';background:radial-gradient(circle at 35% 30%, color-mix(in srgb, ' + dc + ' 20%, var(--bg-card)), var(--bg-card));left:' + p.x + 'px;top:' + p.y + 'px;" title="' + z.n + ' (Lv.' + z.lv + ')">';
    h += '<span class="map-node-icon">' + getZoneIcon(z.n) + '</span>';
    if (isBossZone) h += '<div class="map-node-boss">👑</div>';
    if (lk) h += '<div class="map-node-lock">🔒</div>';
    h += '</div>';
    h += '<div class="map-node-name" style="left:' + p.x + 'px;top:' + (p.y + 34) + 'px;">' + z.n + '</div>';
    h += '<div class="map-node-sub" style="left:' + p.x + 'px;top:' + (p.y + 46) + 'px;">' + (lk ? 'Lv.' + z.lv : 'Ready') + '</div>';
  }

  h += '</div>';
  return h;
}



function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';

  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  const playerAC = getPlayerAC();

  // === TOP: auto-combat + potion (icon buttons) + condensed indicator badges ===
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<div class="combat-top-actions">';
  h += '<button id="btn-auto" class="icon-btn" style="flex:1;border-color:' + (G.cbt.autoCombat ? 'var(--success)' : 'var(--border)') + ';background:' + (G.cbt.autoCombat ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'var(--bg-card)') + ';color:' + (G.cbt.autoCombat ? 'var(--success)' : 'var(--text-dim)') + ';font-size:12px;gap:6px;" title="' + (G.cbt.autoCombat ? 'Auto-Combat ON — tap to take control' : 'Let the AI fight for you') + '">🤖 ' + (G.cbt.autoCombat ? 'AUTO ON' : 'Auto') + '</button>';
  h += '<button onclick="togglePotionMenu()" class="icon-btn" style="flex:1;border-color:' + (usablePotions.length > 0 ? 'var(--success)' : 'var(--border)') + ';background:var(--bg-card);color:' + (usablePotions.length > 0 ? 'var(--success)' : 'var(--disabled)') + ';font-size:12px;gap:6px;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';" title="Potions">🧪 ' + usablePotions.length + '</button>';
  h += '</div>';

  // Potion menu (unchanged content, still opens below the compact buttons)
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--success);border-radius:12px;padding:10px;margin-bottom:10px;">';
    h += '<div style="font-size:11px;color:var(--success);margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      } else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>🔥 ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }

  // Condensed indicator badges — full text lives in the title attribute (tap-and-hold / hover), badge itself stays short
  const badges = [];
  const synDesc = getSynergyDesc();
  if (synDesc) badges.push({ icon: '✨', text: '', full: synDesc, color: 'var(--accent-light)' });
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    badges.push({ icon: resStatus.icon, text: resStatus.status === 'matched' ? 'Resonance +25%' : resStatus.status === 'mismatched' ? 'Resonance -25%' : 'Neutral', full: resStatus.text, color: resStatus.color });
  }
  const riftStatus = getRiftStatus();
  if (riftStatus) badges.push({ icon: riftStatus.icon, text: riftStatus.name, full: riftStatus.desc + ' (' + riftStatus.fightsLeft + ' left)', color: riftStatus.color });
  if (zone && G.zoneHazards[zone.n]) badges.push({ icon: '⚠️', text: G.zoneHazards[zone.n].name, full: G.zoneHazards[zone.n].desc, color: '#f59e0b' });
  if (G.currentBoss) badges.push({ icon: '🔥', text: 'Boss Ability', full: G.currentBoss.desc, color: 'var(--danger)' });

  if (badges.length > 0) {
    h += '<div class="combat-badges">';
    for (let b of badges) {
      h += '<span class="combat-badge" style="border-color:' + b.color + ';color:' + b.color + ';" title="' + b.full.replace(/"/g, '&quot;') + '">' + b.icon + (b.text ? ' ' + b.text : '') + '</span>';
    }
    h += '</div>';
  }

  // === PARTY STRIP: portraits + thin HP bars, no name text ===
  h += '<div class="party-strip">';
  h += '<div class="party-avatar" title="San ' + G.p.hp + '/' + G.p.mhp + ' HP · ' + G.p.mp + '/' + G.p.mmp + ' MP · AC ' + playerAC + '">';
  h += '<div class="party-avatar-circle" style="border-color:#7c3aed;">' + portraitImg('san', '#7c3aed30', 'S') + '</div>';
  h += '<div class="party-avatar-hp"><div class="party-avatar-hp-fill" style="width:' + Math.max(0, (G.p.hp/G.p.mhp)*100) + '%;background:var(--hp);"></div></div>';
  h += '<div class="party-avatar-hp"><div class="party-avatar-hp-fill" style="width:' + Math.max(0, (G.p.mp/G.p.mmp)*100) + '%;background:var(--mp);"></div></div>';
  h += '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="party-avatar" title="' + p.n + ' ' + p.hp + '/' + p.mhp + ' HP">';
      h += '<div class="party-avatar-circle" style="border-color:' + p.col + ';">' + portraitImg(p.n.toLowerCase(), p.col + '30', p.n[0]) + '</div>';
      h += '<div class="party-avatar-hp"><div class="party-avatar-hp-fill" style="width:' + Math.max(0, (p.hp/p.mhp)*100) + '%;background:' + (p.hp <= 0 ? 'var(--disabled)' : 'var(--hp)') + ';"></div></div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // === ENEMIES: single row, compact cards, emoji icons ===
  h += '<div class="erow erow-compact">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const isBoss = e.mechanic ? true : false;
    const elemVar = e.elem && e.elem !== 'none' ? 'var(--el-' + e.elem + ')' : 'transparent';
    const hpPct = e.hp / e.mhp;
    const lowHp = !d && hpPct <= 0.3;

    h += '<div class="ecard ecard-compact ' + (d ? 'dead' : '') + ' ' + s + (isBoss ? ' boss' : '') + '" data-i="' + i + '" style="--e-elem:' + elemVar + ';" title="' + e.n + (isBoss ? ' (Boss)' : '') + '">';
    h += '<div class="eicon eicon-compact">' + (d ? '💀' : ee(e.n)) + (isBoss && !d ? ' 👑' : '') + '</div>';
    h += '<div class="ename ename-compact">' + e.n + '</div>';
    h += (d ? '<div class="dt">DEAD</div>' : '<div class="hps' + (lowHp ? ' low' : '') + '"><div class="bf bf-hp" style="width:' + (hpPct * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>');
    h += '</div>';
  }
  h += '</div>';

  // === SKILLS: compact icon grid ===
  const ls = G.p.skills.filter(s => s.on);
  const isBasicSel = G.cbt.sk === -1 && !G.cbt.autoCombat;
  h += '<div class="skills"><div class="skill-grid">';

  h += '<div class="skill-box' + (isBasicSel ? ' sel' : '') + (G.cbt.autoCombat ? ' dis' : '') + '" data-i="-1" title="Staff Swing — 0 MP · 1d4 + STR">';
  h += '<div class="skill-box-icon">🪄</div><div class="skill-box-name">Staff</div><div class="skill-box-cost">0MP</div>';
  h += '</div>';

  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function' ? getSpellCostLabel(s) : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat;
    const highTier = Number(s.slotTier || 1) >= 4;
    h += '<div class="skill-box' + (sel ? ' sel' : '') + (!u ? ' dis' : '') + (highTier ? ' elite' : '') + '" data-i="' + i + '" title="' + s.n + ' — ' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' + s.d.replace(/"/g, '&quot;') + '">';
    h += '<div class="skill-box-icon">' + (s.buff ? '🛡️' : '⚡') + '</div><div class="skill-box-name">' + s.n + '</div><div class="skill-box-cost">' + costLabel + '</div>';
    h += '</div>';
  }
  h += '</div>';

  // One-line description of the currently selected skill only (not repeated per box)
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  if (!G.cbt.autoCombat) {
    const selDesc = isBasic ? 'Swing your staff when your spell slots are spent.' : (sk ? sk.d : '');
    if (selDesc) h += '<div class="skill-selected-desc">' + selDesc + '</div>';
  }
  h += '</div>';

  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);

  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';

  // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }

  // === ADVANCED STATS: collapsed by default, least essential info ===
  const eqStats = getEquippedStats();
  const statsOpen = G.combatStatsExpanded;
  h += '<div style="margin-top:14px;">';
  h += '<div onclick="toggleCombatStats()" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 12px;background:var(--bg-hover);border-radius:10px;border:1px solid var(--border);user-select:none;">';
  h += '<span style="font-size:11px;transition:transform 0.2s;display:inline-block;' + (statsOpen ? 'transform:rotate(90deg);' : '') + '">▶</span>';
  h += '<span style="font-size:12px;color:var(--text-dim);">📊 Combat Stats & Rules</span>';
  h += '</div>';
  if (statsOpen) {
    h += '<div class="combat-hud" style="margin-top:8px;">';
    h += '<div class="combat-hud-stat"><div class="combat-hud-label">AC</div><div class="combat-hud-value" style="color:var(--accent-light);">' + playerAC + (eqStats.def > 0 ? '<span class="combat-hud-bonus"> +' + eqStats.def + '</span>' : '') + '</div></div>';
    h += '<div class="combat-hud-stat"><div class="combat-hud-label">Prof</div><div class="combat-hud-value" style="color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</div></div>';
    h += '<div class="combat-hud-stat"><div class="combat-hud-label">Atk</div><div class="combat-hud-value" style="color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</div></div>';
    h += '<div class="combat-hud-stat"><div class="combat-hud-label">Crit</div><div class="combat-hud-value" style="color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%' + (eqStats.critChance > 0 ? '<span class="combat-hud-bonus"> +' + Math.floor(eqStats.critChance*100) + '</span>' : '') + '</div></div>';
    h += '</div>';
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:8px;">';
    h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
    h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
    h += '• Natural 20 = Critical Hit (double dice) · Natural 1 = Critical Miss<br>';
    h += '• Advantage: Roll 2d20, keep higher<br>';
    h += '• INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
    h += '</div></div>';
  }
  h += '</div>';

  h += '</div></div>';
  return h;
}

// Renders a portrait <img> that falls back to a letter-initial circle if the
// portraits/ folder isn't present alongside the game files (e.g. code shared
// without the images) — never shows a broken-image icon.
function portraitImg(fileName, fallbackBg, letter) {
  return '<img src="portraits/' + fileName + '.jpg" class="party-avatar-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
    '<span class="party-avatar-fallback" style="display:none;background:' + fallbackBg + ';">' + letter + '</span>';
}

function toggleCombatStats() {
  G.combatStatsExpanded = !G.combatStatsExpanded;
  render();
}


function rGrowthAbilityBadge(memberName) {
  const def = G.growthAbilities[memberName];
  if (!def || !G.discoveredAbilities.includes(def.id)) return '';
  return '<div style="margin-top:6px;padding:8px 10px;background:color-mix(in srgb, var(--gold) 12%, transparent);border:1px solid var(--gold);border-radius:8px;">' +
    '<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:0.05em;">✨ ' + def.n + '</div>' +
    '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">' + def.d + '</div></div>';
}

function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'">'+(p.on?portraitImg(p.n.toLowerCase(), p.col+'30', p.n[0]):'<span style="font-size:20px">🔒</span>')+(p.on?'<span class="pava-role-badge" title="'+p.r+'">'+re(p.r)+'</span>':'')+'</div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+getAffinityBarPct(p.n)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+rGrowthAbilityBadge(p.n)+'</div></div>';
    // === COMPANION EQUIPMENT (8 slots for most, reduced for Soel — see hiddenSlots) ===
    if(p.on || p.ul <= G.p.lvl){
      const role = getCompanionRole(p.n);
      const hiddenSlots = (role && role.hiddenSlots) || [];
      const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'].filter(s => !hiddenSlots.includes(s));
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment' + (role ? ' <span style="color:var(--text-dim);font-weight:400;">(' + role.weaponLabel + ' · ' + role.armorLabel + ')</span>' : '') + '</div>';
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      for (let slot of slotOrder) {
        const invSlotKey = (slot === 'ring1' || slot === 'ring2') ? 'ring' : slot;
        const overrideLabel = role && role.slotLabelOverrides && role.slotLabelOverrides[slot];
        const label = overrideLabel || (slot === 'weapon' && role ? role.weaponLabel : slot === 'armor' && role ? role.armorLabel : (EQUIPMENT_SLOTS[slot] ? EQUIPMENT_SLOTS[slot].name : slot));
        const icon = EQUIPMENT_SLOTS[slot] ? EQUIPMENT_SLOTS[slot].icon : '❔';
        const equipped = p.eq ? p.eq[slot] : null;
        h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:6px 8px;">';
        h += '<div style="font-size:9px;color:var(--text-dim);">' + icon + ' ' + label + '</div>';
        if (equipped) {
          const rarityColor = equipped.r ? (equipped.r==='epic'||equipped.r==='legendary'?'#a855f7':equipped.r==='rare'?'#3b82f6':equipped.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
          const statBits = [];
          if (equipped.atk) statBits.push('+' + equipped.atk + 'ATK');
          if (equipped.def) statBits.push('+' + equipped.def + 'DEF');
          if (equipped.spd) statBits.push('+' + equipped.spd + 'SPD');
          if (equipped.hp) statBits.push('+' + equipped.hp + 'HP');
          h += '<div style="font-size:11px;font-weight:600;color:' + rarityColor + ';margin:2px 0;">' + equipped.n + '</div>';
          h += '<div style="font-size:9px;color:var(--text-dim);margin-bottom:4px;">' + statBits.join(' ') + '</div>';
          h += '<button class="unequip-pgear" data-member="' + p.n + '" data-slot="' + slot + '" style="width:100%;padding:3px;border-radius:6px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:9px;font-weight:600;cursor:pointer;">Unequip</button>';
        } else {
          const candidates = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.slot === invSlotKey && x.it.forCompanion === p.n);
          if (candidates.length > 0) {
            h += '<div style="display:flex;flex-direction:column;gap:2px;margin-top:2px;">';
            for (let c of candidates.slice(0, 3)) {
              const rc2 = c.it.r ? (c.it.r==='epic'||c.it.r==='legendary'?'#a855f7':c.it.r==='rare'?'#3b82f6':c.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-slot="' + invSlotKey + '" data-idx="' + c.idx + '" style="padding:3px 5px;border-radius:6px;border:1px solid var(--accent);background:var(--bg-hover);color:' + rc2 + ';font-size:9px;font-weight:600;cursor:pointer;text-align:left;">' + c.it.n + '</button>';
            }
            h += '</div>';
          } else {
            h += '<div style="font-size:9px;color:var(--disabled);margin-top:2px;">Empty</div>';
          }
        }
        h += '</div>';
      }
      h += '</div></div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  const learnedCount = G.p.skills.filter(s => s.on).length;
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2>';
  h += '<div style="text-align:center;font-size:11px;color:var(--text-dim);margin-bottom:12px;">' + learnedCount + ' / ' + G.p.skills.length + ' spells learned</div>';
  h += '<div class="sklist">';

  const maxTier = G.p.skills.reduce((m, s) => Math.max(m, s.tier || 1), 1);
  for (let t = 1; t <= maxTier; t++) {
    const tierSkills = G.p.skills.filter(s => (s.tier || 1) === t);
    if (tierSkills.length === 0) continue;
    const tierLearned = tierSkills.filter(s => s.on).length;
    const tierLocked = tierLearned === 0;
    h += '<div class="tier-header" style="font-size:12px;font-weight:700;color:' + (tierLocked ? 'var(--text-dim)' : 'var(--gold)') + ';margin:14px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--border);">';
    h += 'Tier ' + t + ' <span style="font-weight:400;color:var(--text-dim);">(' + tierLearned + '/' + tierSkills.length + ')</span></div>';
    for(let s of tierSkills){
      const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
      h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
    }
  }

  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const companionGearItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip && it.forCompanion) companionGearItems.push({item: it, index: i});
    else if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Companion gear section — informational only; equip/unequip happens on the Party screen
  if(companionGearItems.length > 0){
    h+='<div class="its"><h3>🧝 Companion Gear ('+companionGearItems.length+')</h3><div class="ig">';
    for(let ci of companionGearItems){
      const it = ci.item;
      const rarityColor = it.r ? (it.r==='epic'||it.r==='legendary'?'#a855f7':it.r==='rare'?'#3b82f6':it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
      h+='<div class="ic">';
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rarityColor+';">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--accent-light);margin-top:2px;">For '+it.forCompanion+'</div>';
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.spd) statLine.push('SPD+'+it.spd);
      if(it.hp) statLine.push('HP+'+it.hp);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);margin-top:4px;">Equip from the Party screen</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }

  // Stronghold Tasks section — only appears once a stronghold has been claimed
  if (G.strongholdTasks.length > 0) {
    const activeTasks = G.strongholdTasks.filter(t => !t.done);
    const doneTasks = G.strongholdTasks.filter(t => t.done);
    h+='<h2 class="st" style="margin-top:20px;">🏰 Stronghold Tasks</h2>';
    if (activeTasks.length > 0) {
      h+='<div class="qlist">';
      for (let t of activeTasks) {
        const pc = Math.min(100, (t.c / t.need) * 100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+t.n+'</span><span class="qr">'+t.rw.xp+' XP | '+t.rw.g+' G</span></div>';
        h+='<div class="qd">'+t.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+t.c+'/'+t.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneTasks.length > 0) {
      h+='<div class="qlist" style="margin-top:8px;">';
      for (let t of doneTasks) {
        h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+t.n+'</span><span class="qr" style="color:var(--success);">✓ (resets tomorrow)</span></div></div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + (site.stronghold ? ' <span style="color:var(--gold);">🏰</span>' : '') + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      if (site.stronghold) {
        h2 += '<div style="font-size:10px;color:var(--gold);font-weight:600;margin-bottom:4px;">🏰 YOUR STRONGHOLD — free, always open</div>';
      }
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

document.addEventListener('DOMContentLoaded', function() {
  const hasSave = loadGame();
  if (!hasSave) {
    lg('Welcome to Legends of Daybreak, San.');
    lg('Tap Adventure to start your journey!');
    showStory();
      checkDailyLogin();

  }
  // Check for idle gains on load
    setTimeout(() => {
      if (!checkIdleGains()) {
        render();
      }
    }, 300);
});


// === MID-BATTLE POTION SYSTEM ===
function togglePotionMenu() {
  G.potionMenu = !G.potionMenu;
  render();
}

function usePotionInCombat(invIndex) {
  const it = G.p.inv[invIndex];
  if (!it) return;

  // Handle revive items (Phoenix Feather, Rod of Resurrection, etc.)
  if (it.t === 'revive') {
    const deadMembers = getDeadParty();
    if (deadMembers.length === 0) {
      lg('❌ No fallen allies to revive!');
      G.potionMenu = false;
      render();
      return;
    }

    // Prioritize: San (player) first, then party members
    let target = deadMembers.find(p => p.n === 'San');
    if (!target) target = deadMembers[0];

    // Use item's v value for revive percentage (50% for Phoenix Feather, 75% for Rod of Resurrection)
    const revivePct = it.v || 50;
    const healAmount = Math.floor(target.mhp * (revivePct / 100));
    target.hp = Math.max(1, healAmount);
    target.on = true;

    lg('🔥 ' + it.n + ' radiates with sacred light!');
    lg('✨ ' + (target.n === 'San' ? 'You' : target.n) + ' are revived with ' + target.hp + ' HP (' + revivePct + '%)!');

    it.q--;
    if (it.q <= 0) {
      G.p.inv.splice(invIndex, 1);
    }

    G.potionMenu = false;
    render();
    return;
  }

  // Regular potions only
  if (it.t !== 'pot' && it.t !== 'food' && it.t !== 'drink') return;

  if (it.eff === 'heal') {
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + it.v);
    const healed = G.p.hp - oldHp;
    lg('🧪 Used ' + it.n + '! +' + healed + ' HP (' + G.p.hp + '/' + G.p.mhp + ')');
  } else if (it.eff === 'mana') {
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + it.v);
    const restored = G.p.mp - oldMp;
    lg('💧 Used ' + it.n + '! +' + restored + ' MP (' + G.p.mp + '/' + G.p.mmp + ')');
  }

  it.q--;
  if (it.q <= 0) {
    G.p.inv.splice(invIndex, 1);
  }

  G.potionMenu = false;
  render();
}

function getCombatPotions() {
  return G.p.inv.filter(it => 
    (it.t === 'pot' || it.t === 'food' || it.t === 'drink') &&
    (it.eff === 'heal' || it.eff === 'mana') ||
    it.t === 'revive'
  );
}
