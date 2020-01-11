import { AUTO_ABILITY as AA, EXTRA_SKILL as ES, CLASS } from './const.js';
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
    defenseTerm = 100,
    abilityRising = 0;
    
  let firstMagicTerm = 100,
    firstAttackTerm = 0,
    firstEeTerm = 100,
    firstRavageTerm = 100;
  
  let effectiveCC = 0;

  title = title || new Title();
  setting = setting || new Setting();
  weapon = weapon || new Weapon();

  // TODO: improve the overpower formula
  let overboost_mod = 0,
    overpower_mod = 1;
  switch(setting.overboost_lvl){
    case 0:
        overboost_mod = 0.34;
        break;
    case 32:
        overboost_mod = 1;
        break;
  }
  
  
  // (base job value + cp) * (base stat up + overpower) * fractal + weapon
  overpower_mod = ((setting.overpower + job.overpower + weapon.overpower) * overboost_mod)/100;  

  // magic / attack term
  magicTerm += (job.magic + setting.additionalMagic + title.magic ) * ( 1 + job.base_attributes/100 + overpower_mod);
  magicTerm *= 1 + setting.fractalMagicMod / 100;
  magicTerm += weapon.magic;
 
  let magicMod = setting.magicMod;
  if (card.hasES(ES.high_voltage)) {
    let enemyHP = setting.enemyHP;
    magicMod += (enemyHP / 100) * 1.5;
  }
  magicTerm *= magicMod;

  let statMod = setting.statMod;
  let firstStatMod;
  if (setting.maxCrossCounter && (job.cross_counter || setting.cross_counter)) {
    effectiveCC = (setting.cross_counter + job.cross_counter);
    statMod += effectiveCC / 100;
  }
  if (setting.showSkilledDuelist && job.skilled_duelist){
    statMod += job.skilled_duelist / 100;
  }
  firstStatMod = statMod;
  
  let risingMod = (setting.simulate_ability_rising);
  abilityRising = setting.ability_rising + job.ability_rising + weapon.ability_rising + card.getAbilityRising();
  if (setting.simulate_ability_rising > 0 && (setting.ability_rising || job.ability_rising || weapon.ability_rising || card.getAbilityRising())) {
    firstStatMod += abilityRising / 100;
    statMod += risingMod / 100;
  }
  
  firstMagicTerm = (magicTerm * firstStatMod);
  magicTerm = (magicTerm * statMod);

  if (setting.maxReckoning && job.reckoning) {
    magicTerm += 2400;
    firstMagicTerm += 2400;
  }

  // TODO: Godo, Bhunivelze
  attackTerm += (job.attack + setting.additionalAttack + title.attack) * ( 1 + job.base_attributes/100 + overpower_mod) ;
  if(weapon.attack_multiply > 0){
      attackTerm *= (1 + weapon.attack_multiply / 100);
  }
  attackTerm *= 1 + setting.fractalAttackMod / 100;
  attackTerm += weapon.attack;
  
  attackTerm *= setting.attackMod;

  statMod = setting.statMod;
  if (setting.maxCrossCounter && (job.cross_counter || setting.cross_counter)) {
    effectiveCC = (setting.cross_counter + job.cross_counter);
    statMod += effectiveCC / 100;
  }
  if (setting.showSkilledDuelist && job.skilled_duelist){
    statMod += job.skilled_duelist / 100;
  }
  firstStatMod = statMod;
  if (setting.simulate_ability_rising > 0 && (setting.ability_rising || job.ability_rising || weapon.ability_rising || card.getAbilityRising())) {
    firstStatMod += abilityRising / 100;
    statMod += risingMod / 100;
  }
  
  firstAttackTerm = attackTerm * firstStatMod;
  attackTerm = attackTerm * statMod;

  if (setting.maxRetribution && job.retribution) {
    attackTerm += 2400;
    firstAttackTerm += 2400;
  }

  // TODO: Zeromus

  // Gilgamesh X
  if(card.hasES(ES.legendary_blade_master)){
    magicTerm += attackTerm * 0.5;
    firstMagicTerm += firstAttackTerm * 0.5;
  }

  magicTerm /= 100;
  firstMagicTerm /= 100;
  attackTerm /= 100;
  firstAttackTerm /= 100;

  // ee term
  eeTerm += card.hasES(ES.element_drive_synergy) ? 600 : 0;
  eeTerm += card.hasES(ES.element_everyday) ? 600 : 0;
  eeTerm += card.hasES(ES.fortune) ? 500 : 0;
  eeTerm += card.hasES(ES.misfortune) ? 1050 : 0;
  eeTerm += card.hasES(ES.ultra_element_synergy) ? 400 : 0;
  eeTerm += card.hasES(ES.ultra_martial_combat) ? 300 : 0;
  
  firstEeTerm = eeTerm;
  
  firstEeTerm += job.getEE(card.element, true);
  firstEeTerm += card.getEE(true);
  firstEeTerm += title.getEE(card.element, true);
  firstEeTerm += setting.getEE(true);
  firstEeTerm += weapon.getEE(card.element,true);
  
  eeTerm += job.getEE(card.element);
  eeTerm += card.getEE();
  eeTerm += title.getEE(card.element);
  eeTerm += setting.getEE();
  eeTerm += weapon.getEE(card.element);
  if(setting.showDiscordantChain){
      eeTerm += job.discordant_chain;
      eeTerm -= job.attune_chain;
  }

  // TODO: add from card's description
  eeTerm /= 100;
  firstEeTerm /= 100;

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
    // TODO: change to take enemy's break gauge into account
    ravageTerm += card.hasES(ES.break_ruler) ? 120 : 0;
    firstRavageTerm = ravageTerm;
    // TODO: change number of casts from setting
    ravageTerm += card.hasES(ES.ultra_damage_escalate) ? 200 : 0;
  }
  ravageTerm /= 100;
  firstRavageTerm /= 100;

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
  let firstDamage = card.attack;
    
  // Mental Acuity
  if(card.isMagicBased() && setting.mentalAcuity && (job.jobClass.toLowerCase() === CLASS.monk || job.jobClass.toLowerCase() === CLASS.sophie)) {
      damage *= 3;
      firstDamage *= 3;
  }  
  
  damage *= card.isMagicBased() ? magicTerm : attackTerm;
  damage = damage * eeTerm * critTerm * brokenTerm * weakTerm * ravageTerm * ucTerm;
  
  firstDamage *= card.isMagicBased() ? firstMagicTerm : firstAttackTerm;
  firstDamage = firstDamage * firstEeTerm * critTerm * brokenTerm * weakTerm * firstRavageTerm * ucTerm;


  // S2 reduction
  if(setting.isS2Reduction){
    damage /= 10;
    firstDamage /= 10;
  }

  // Check lore && Check element
  if ((!setting.ignoreLore && !job.checkLore(card))
      || (!setting.ignoreElement && !job.checkElement(card))) {
    damage = 0;
    firstDamage = 0;
  }
 
  
  var result = {
    firstDamage: firstDamage,
    damage: damage,
    dmgTerm: card.isMagicBased() ? magicTerm * 100 - 100 : attackTerm * 100,
    eeTerm: eeTerm * 100 - 100,
    critTerm: critTerm * 100 - 150,
    brokenTerm: brokenTerm * 100 - 200,
    weakTerm: weakTerm * 100 - 130,
    ravageTerm: ravageTerm * 100 - 100,
    ucTerm: ucTerm * 100 - 100,
    weapon: weapon,
    ability_rising: abilityRising,
    simulate_ability_rising: setting.simulate_ability_rising,
    prismatic_return: weapon.prismatic_return + job.prismatic_return,
    cross_counter: effectiveCC
  };

  return result;
}

export { damageCalc };
