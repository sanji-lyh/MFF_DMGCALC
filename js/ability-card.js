import { URL, EXTRA_SKILL as ES } from './const.js';
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
    // TODO
    return true;
  }

  hasES(es) {
    return this.extra_skill.includes(es);
  }

  getEE() {
    // EE from Auto Ability & mechanics
    let ee = 0;
    ee += this.auto_ability[`enhance ${this.element}`] || 0;
    ee += this.auto_ability['attune chain'] || 0;
    ee += this.auto_ability['ability chain'] || 0;

    ee += this.mechanics['attune chain'] || 0;
    ee += this.mechanics['ability chain'] || 0;
    return ee;
  }

  getCritDmgUp() {
    // Improved Critical from Auto Ability & mechanics
    let impCrit = 0;
    impCrit += this.auto_ability['critical damage up'] || 0;
    impCrit += this.mechanics['critical damage up'] || 0;
    return impCrit;
  }

  getBreakDmgUp() {
    // Painful Break from Auto Ability & mechanics
    let painfulBreak = 0;
    painfulBreak += this.auto_ability['break damage up'] || 0;
    painfulBreak += this.mechanics['break damage up'] || 0;
    return painfulBreak;
  }

  getRavage() {
    return this.auto_ability['ravage'] || 0;
  }

  // TODO: get stat up AA

  // TODO: get cards mechanics
}

export { AbilityCard }
