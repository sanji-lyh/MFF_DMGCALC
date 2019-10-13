import { AUTO_ABILITY as AA, EXTRA_SKILL as ES } from './const.js';
import { Title } from './title.js';
import { AbilityCard } from './ability-card.js';
import { Setting } from './settings.js';
import { Job } from './job.js';
import { Weapon } from './weapon.js';

/*
UC list for complete mechanics
    minwu: done
    nxd: done
    xezat: done
    duncan: done
    ub: done
    ragnarok: done
    yiazmat: done
    fusoya: done
    sin: done
    bfa: done
    sl: done
    floral: done
--- godo:
    baha-neo: done
    emperor: done
    eden: done
--- gilgamesh:
    faris: done
--- bhunivelze:
--- zeromus:
    griever: done
    rinoa: done
    raffaello: done
    demon: done
--- kelger:
    vegnagun: done
*/

/**
 * @param {AbilityCard} card
 * @param {Job} job
 * @param {Setting} setting
 * @param {Title} title
 * @param {Weapon} weapon
 */
function damageCalc(card, job, setting, title, weapon) {
  // TODO: take AA into account and titles
  // TODO: refactor card related terms to Card class

  let magicTerm = 100,
    attackTerm = 0,
    eeTerm = 100,
    critTerm = 100,
    brokenTerm = 100,
    weakTerm = 100,
    ravageTerm = 100,
    ucTerm = 100,
    barrierTerm = 100,
    defenseTerm = 100;

  title = title || new Title();
  setting = setting || new Setting();
  weapon = weapon || new Weapon();

  // magic / attack term
  magicTerm += job.magic + title.magic + weapon.magic;

  magicTerm *= setting.fractalMagicMod;

  let magicMod = setting.magicMod;
  if (card.hasES(ES.high_voltage)) {
    let enemyHP = setting.enemyHP;
    magicMod += (enemyHP / 100) * 1.5;
  }
  magicTerm *= magicMod;

  let statMod = setting.statMod;
  if (setting.maxCrossCounter && job.cross_counter) {
    statMod += job.cross_counter / 100;
  }
  magicTerm *= statMod;

  let risingMod = 175;
  if (setting.maxAbilityRising && (job.ability_rising || weapon.ability_rising)) {
    magicTerm *= risingMod / 100;
  }

  magicTerm += setting.additionalMagic;

  if (setting.maxReckoning && job.reckoning) {
    magicTerm += 2400;
  }

  // TODO: Godo, Bhunivelze
  
  attackTerm += job.attack + title.attack + weapon.attack;
	
  attackTerm *= setting.fractalAttackMod;
  attackTerm *= setting.attackMod;

  statMod = setting.statMod;
  if (setting.maxCrossCounter && job.cross_counter) {
    statMod += job.cross_counter / 100;
  }
  attackTerm *= statMod;

  risingMod = 175;
  if (setting.maxAbilityRising && (job.ability_rising || weapon.ability_rising)) {
    attackTerm *= risingMod / 100;
  }

  attackTerm += setting.additionalAttack;

  if (setting.maxRetribution && job.retribution) {
    attackTerm += 2400;
  }

  // TODO: Zeromus

  // Gilgamesh X 
  if(card.hasES(ES.legendary_blade_master)){
    magicTerm += attackTerm * 0.5;	
  }
  
  magicTerm /= 100;
  attackTerm /= 100;

  // ee term
  eeTerm += job.getEE(card.element);
  eeTerm += card.getEE();
  eeTerm += title.getEE(card.element);
  eeTerm += setting.getEE(card.element);
  eeTerm += weapon.getEE(card.element);  
  eeTerm += card.hasES(ES.element_drive_synergy) ? 600 : 0;
  eeTerm += card.hasES(ES.element_everyday) ? 600 : 0;
  eeTerm += card.hasES(ES.fortune) ? 500 : 0;
  eeTerm += card.hasES(ES.misfortune) ? 1050 : 0;
  eeTerm += card.hasES(ES.ultra_element_synergy) ? 400 : 0;
  eeTerm += card.hasES(ES.ultra_martial_combat) ? 300 : 0;
  if(setting.showDiscordantChain){
      eeTerm += job.discordant_chain;
  }
  
  // TODO: add from card's description
  eeTerm /= 100;

  // critical term
  critTerm += 50;
  critTerm += job.crit_dmg_up;
  critTerm += setting.crit_dmg_up;
  critTerm += weapon.crit_dmg_up;
  critTerm += card.getCritDmgUp();
  critTerm += card.hasES(ES.critical_rupture) ? 30 : 0;
  critTerm += card.hasES(ES.ultra_critical_damage_up) ? 500 : 0;
  critTerm += title.crit_dmg_up;
  // TODO: add from card's description
  critTerm /= 100;

  // broken term
  if (setting.isBroken) {
    brokenTerm += 100;
    brokenTerm += job.break_dmg_up;
    brokenTerm += setting.break_dmg_up;
    brokenTerm += weapon.break_dmg_up;
    brokenTerm += card.getBreakDmgUp();
    brokenTerm += card.hasES(ES.break_escalate) ? 15 : 0;
    brokenTerm += card.hasES(ES.ultra_break_escalate) ? 1000 : 0;
    brokenTerm += card.hasES(ES.enhance_combine) ? 160 : 0;
    brokenTerm += title.break_dmg_up;
    // TODO: add from card's description
  }
  brokenTerm /= 100;

  // weakness term
  if (setting.isWeakness) {
    weakTerm += 30;
    weakTerm += job.weak_dmg_up;
    weakTerm += weapon.weak_dmg_up;
    weakTerm += card.hasES(ES.break_enhance) && setting.isBroken ? 25 : 0;
    weakTerm += card.getWeakDmgUp();
    weakTerm += setting.weak_dmg_up;
    weakTerm += title.weak_dmg_up;
    // TODO: add from card's description
  }
  weakTerm /= 100;

  // ravage term
  if (card.isAoE()) {
    ravageTerm += job.ravage;
    ravageTerm += title.ravage;
    ravageTerm += setting.ravage;
    ravageTerm += weapon.ravage;
    ravageTerm += card.getRavage();
    ravageTerm += setting.isTaiman && card.hasES(ES.ultra_convergence) ? 100 : 0;
    // TODO: change number of casts from setting
    ravageTerm += card.hasES(ES.ultra_damage_escalate) ? 200 : 0;
    // TODO: change to take enemy's break gauge into account
    ravageTerm += card.hasES(ES.break_ruler) ? 120 : 0;
  }
  ravageTerm /= 100;

  // uc term
  // TODO: current HP
  ucTerm += card.hasES(ES.phantom_zone) ? 90 : 0;
  ucTerm += card.hasES(ES.generate_synergy) ? 150 : 0;
  ucTerm += !setting.isBroken && card.hasES(ES.enhance_combine) ? 160 : 0;
  if (card.hasES(ES.solitary_lion)) {
    let HP = job.totalHP(setting);
    ucTerm += Math.max(100, Math.floor(HP / 700));
  }
  ucTerm /= 100;

  // TODO: defense term and barrier term

  let damage = card.attack;
  damage *= card.isMagicBased() ? magicTerm : attackTerm;
  damage = damage * eeTerm * critTerm * brokenTerm * weakTerm * ravageTerm * ucTerm;

  // Check lore
  if (!setting.ignoreLore && !job.checkLore(card)) {
    damage = 0;
  }

  // Check element
  if (!setting.ignoreElement && !job.checkElement(card)) {
    damage = 0;
  }

  var result = {
    damage: damage,
    dmgTerm: card.isMagicBased() ? magicTerm * 100 - 100 : attackTerm * 100,
    eeTerm: eeTerm * 100 - 100,
    critTerm: critTerm * 100 - 150,
    brokenTerm: brokenTerm * 100 - 200,
    weakTerm: weakTerm * 100 - 130,
    ravageTerm: ravageTerm * 100 - 100,
    ucTerm: ucTerm * 100 - 100,
    weapon: weapon
  };

  return result;
}

export { damageCalc };
