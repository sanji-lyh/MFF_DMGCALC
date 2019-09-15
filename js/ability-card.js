import { URL, EXTRA_SKILL as ES } from './const.js';
import { getJSON } from './helper.js';
import { ELEMENT } from './const.js';

class AbilityCard {
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
}

export { AbilityCard }
