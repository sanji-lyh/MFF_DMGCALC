import { URL, EXTRA_SKILL as ES } from './const.js';
import { getJSON } from './helper.js';

class AbilityCard {
    constructor(options) {
        this.attack = options.attack;
        this.break = options.break;
        this.name = options.name || '';
        this.extra_skill = options.extra_skill || [];
        this.auto_ability = options.auto_ability || {};
        this.mechanics = options.mechanics || {};
    }

    static loadAllCards() {
        // TODO
        return [];
    }

    isMagicBased() {
        return !this.extra_skill.includes(ES.mantra) && !this.extra_skill.includes(ES.taijutsu);
    }

    isAoE() {
        // TODO
        return true;
    }
}

export { AbilityCard }
