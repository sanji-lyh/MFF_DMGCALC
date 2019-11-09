/*

Settings is object containing buff / debuff / enemy's situation like 1 vs 1
or currenct state of character (HP), subdeck stats,
and other damage calculation related values

*/
import { BUFF } from './const.js';

class Setting {
  constructor() {
    this.magicMod = 1;
    this.attackMod = 1;
	
	this.fractalMagicMod = 1;
	this.fractalAttackMod = 1;
	
    this.statMod = 1;
    this.additionalMagic = 0;
    this.additionalAttack = 0;
    this.enemyHP = 100;
    this.playerHP = 100;
    this.enemyElement = null;
    this.overboost_lvl = 0;
    this.ability_rising = 0;

    this.isBroken = false;
    this.isWeakness = false;
    this.isTaiman = false;

    this.ignoreLore = false;
    this.ignoreElement = false;
    this.maxReckoning = false;
    this.maxRetribution = false;
    this.maxCrossCounter = false;
    this.maxAbilityRising = false;
    
    this.isS2Reduction = false;
    
    this.showDiscordantChain = false;
    this.showSkilledDuelist = false;

    this.crit_dmg_up = 0;
    this.break_dmg_up = 0;
    this.weak_dmg_up = 0;

    this.ee = 0;
    this.attuned_chain = 0;
    this.ability_chain = 0;
    this.ravage = 0;
    this.overpower = 0;
    
    this.faith = "";
    this.brave = "";
    this.trance = "";
    this.eeAtk = "";
    this.berserk = "";
  }

  // getter method
  getEE() {
    let ee = 0;
    ee += this.ee;
    ee += this.attuned_chain;
    ee += this.ability_chain;
    
    switch (this.eeAtk) {
      case BUFF.ee_atk:
        ee += 25;
        break;
      case BUFF.ee_atk_II:
        ee += 75;
        break;
      default:
        break;
    }
    
    switch (this.berserk) {
      case BUFF.berserk:
        ee += 50;
        break;
      case BUFF.berserk_II:
        ee += 75;
        break;
      default:
        break;
    }
    
    return ee;
  }

  getMagicMod() {
    return this.magicMod;
  }

  getAttackMod() {
    return this.attackMod;
  }

  isOppositeElement(element) {
    return true;
  }
 
  // setter method
  setFaith(f) {
    this.faith = f;
    switch (f) {
      case BUFF.faith:
        this.magicMod = 1.5;
        break;
      case BUFF.faith_II:
        this.magicMod = 1.75;
        break;
      default:
        this.magicMod = 1;
    }
  }

  setBrave(b) {
    this.brave = b;
    switch (b) {
      case BUFF.brave:
        this.attackMod = 2;
        break;
      case BUFF.brave_II:
        this.attackMod = 2.5;
        break;
      default:
        this.attackMod = 1;
    }
  }

  setTrance(t) {
    this.trance = t;
    switch (t) {
      case BUFF.trance:
        this.statMod = 1.3;
        break;
      case BUFF.trance_II:
        this.statMod = 1.45;
        break;
      default:
        this.statMod = 1;
    }
  }
  
  setEEAtk(e){
    this.eeAtk = e;
    
  }
  
  setBerserk(b){
    this.berserk = b;
  }
}

export { Setting };
