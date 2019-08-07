import { AUTO_ABILITY as AA, EXTRA_SKILL as ES } from './const.js';
import { Setting } from './settings.js';

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

function damageCalc(card, job, title, setting) {
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

    setting = setting || new Setting();

    // magic / attack term
    if (card.isMagicBased()) {
        magicTerm += job.magic + title.magic;

        let magicMod = setting.magicMod;
        if (card.hasES(ES.high_voltage)) {
            let enemyHP = setting.enemyHP;
            magicMod += enemyHP / 100 * 1.5;
            magicTerm *= magicMod;
        }

        magicTerm *= setting.statMod;
        magicTerm += setting.additionalMagic

        // TODO: Gilgamesh, Godo, Bhunivelze

        magicTerm /= 100;
    } else {
        attackTerm += job.attack + title.attack;
        attackTerm *= setting.attackMod;
        attackTerm *= setting.statMod;
        attackTerm += setting.additionalAttack;

        // TODO: Zeromus

        attackTerm /= 100;
    }

    // ee term
    eeTerm += job.getEE(card.element);
    eeTerm += title.getEE(card.elemet);
    eeTerm += setting.getEE();
    eeTerm += card.hasES(ES.element_drive_synergy) ? 600 : 0;
    eeTerm += card.hasES(ES.element_everyday) ? 600 : 0;
    eeTerm += card.hasES(ES.fortune) ? 500 : 0;
    eeTerm += card.hasES(ES.misfortune) ? 1050 : 0;
    eeTerm += card.hasES(ES.ultra_element_synergy) ? 400 : 0;
    eeTerm += card.hasES(ES.ultra_martial_combat) ? 300 : 0;
    // TODO: add from card's description
    eeTerm /= 100;

    // critical term
    critTerm += 50;
    critTerm += job.crit_dmg_up;
    critTerm += card.hasES(ES.critical_rupture) ? 30 : 0;
    critTerm += card.hasES(ES.ultra_critical_damage_up) ? 500 : 0;
    critTerm += critTerm.crit_dmg_up;
    // TODO: add from card's description
    critTerm /= 100;

    // broken term
    if (setting.isBroken) {
        brokenTerm += 100;
        brokenTerm += job.break_dmg_up;
        brokenTerm += card.hasES(ES.break_escalate) ? 15 : 0;
        brokenTerm += card.hasES(ES.ultra_break_escalate) ? 1000 : 0;
        brokenTerm += card.hasES(ES.enhance_combine) ? 160 : 0;
        brokenTerm += title.break_dmg_up;
        // TODO: add from card's description
    }
    brokenTerm /= 100;

    // weakness term
    if (setting.isWeakness || setting.isOppositeElement(card.element)) {
        weakTerm += 30;
        weakTerm += job.weak_dmg_up;
        weakTerm += card.hasES(ES.break_enhance) ? 25 : 0;
        weakTerm += setting.weak_dmg_up;
        weakTerm += title.weak_dmg_up;
        // TODO: add from card's description
    }
    weakTerm /= 100;

    // ravage term
    if (card.isAoE()) {
        ravageTerm += job.ravage;
        ravageTerm += title.ravage;
        ravageTerm += (setting.isTaiman && card.hasES(ES.ultra_convergence)) ? 100 : 0;
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
    ucTerm += (!setting.isBroken && card.hasES(ES.enhance_combine)) ? 160 : 0;
    if (card.hasES(ES.solitary_lion)) {
        let HP = job.totalHP(setting);
        ucTerm += Math.max(100, Math.floor(HP / 700));
    }

    // TODO: defense term and barrier term


    let damage = card.attack;
    damage *= (card.isMagicBased()) ? magicTerm : attackTerm;
    damage = damage * eeTerm * critTerm * brokenTerm * weakTerm * ravageTerm * ucTerm;
    return damage;
}

export { damageCalc };