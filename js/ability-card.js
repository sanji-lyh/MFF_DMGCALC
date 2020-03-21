import { URL, EXTRA_SKILL as ES, AUTO_ABILITY as AA, TARGET } from './const.js';
import { getJSON } from './helper.js';
import { ELEMENT } from './const.js';

class AbilityCard {
  // TODO: change string literals to constant
  constructor(options) {
    this.attack = options.attack;
    this.break = options.break;
    this.name = options.name || '';
    this.img = options["image name"] || "default.jpg";

    this.element = options.element;
    this.type = options.type;
    this.target = options.target || '';

    this.extra_skill = options["extra skill"] || [];
    this.auto_ability = options["auto ability"] || {};
    this.mechanics = options["mechanics"] || {};
  }

  static loadAllCards(cardsJSON) {
    return cardsJSON.map(x => new AbilityCard(x));
  }

  isMagicBased() {
    return !this.extra_skill.includes(ES.mantra) && !this.extra_skill.includes(ES.taijutsu);
  }

  isAoE() {
    return this.target == TARGET.aoe;
  }

  hasES(es) {
    return this.extra_skill.includes(es);
  }
  
  hasMentalAcuity() {
    return this.auto_ability[AA.mental_acuity] == 1;
  }
  
  getOverpower(){    
    return this.auto_ability[AA.overpower] || 0;
  }

  getEE(isFirstHit = false) {
    // EE from Auto Ability & mechanics
    let ee = 0;
    ee += this.auto_ability[`enhance ${this.element}`] || 0;
    if(!isFirstHit){
        ee += this.auto_ability[AA.attune_chain] || 0;
        ee += this.auto_ability[AA.ability_chain] || 0;

        ee += this.mechanics[AA.attune_chain] || 0;
        ee += this.mechanics[AA.ability_chain] || 0;
    }
    return ee;
  }

  getCritDmgUp() {
    // Improved Critical from Auto Ability & mechanics
    let impCrit = 0;
    impCrit += this.auto_ability[AA.crit_dmg_up] || 0;
    impCrit += this.mechanics[AA.crit_dmg_up] || 0;
    return impCrit;
  }

  getBreakDmgUp() {
    // Painful Break from Auto Ability & mechanics
    let painfulBreak = 0;
    painfulBreak += this.auto_ability[AA.break_dmg_up] || 0;
    painfulBreak += this.mechanics[AA.break_dmg_up] || 0;
    return painfulBreak;
  }

  getWeakDmgUp() {
    // Exploit Weakness from Auto Ability & mechanics
    let ew = 0;
    ew += this.auto_ability[AA.weak_dmg_up] || 0;
    ew += this.mechanics[AA.weak_dmg_up] || 0;
    return ew;
  }

  getRavage() {
    return this.auto_ability[AA.ravage] || 0;
  }
  
  getAbilityRising(){
    return this.auto_ability[AA.ability_rising] || 0;
  }

  // TODO: get stat up AA

  // TODO: get cards mechanics
}

export { AbilityCard }
