import { ELEMENT } from './const.js';

// only contains titles with damage related stats for now

// const titles = {
//     attack: "attack",
//     break: "break",
//     magic: "magic",
//     critical: "critical",
//     break_dmg_up: "break damage up",
//     crit_dmg_up: "critical damage up",
//     weak_dmg_up: "weak damage up",
//     ravage: "ravage",
//     fire_ee: "enhance fire",
//     water_ee: "enhance water",
//     wind_ee: "enhance wind",
//     earth_ee: "enhance earth",
//     light_ee: "enhance light",
//     dark_ee: "enhance dark",
//     attune_chain: "attune chain",
//     ability_chain: "ability chain",
//     ability_rising: "ability rising"
// }

class Title {
    constructor() {
        this.HP = 0;
        this.attack = 0;
        this.break = 0;
        this.magic = 0;
        this.crit_dmg_up = 0;
        this.break_dmg_up = 0;
        this.weak_dmg_up = 0;
        this.ravage = 0;
        this.fire_ee = 0;
        this.water_ee = 0;
        this.wind_ee = 0;
        this.earth_ee = 0;
        this.light_ee = 0;
        this.dark_ee = 0;
        this.attune_chain = 0;
        this.ability_chain = 0;
        this.ability_rising = 0;
        this.ovepower = 0;
        this.taiman = 0;
    }

    getEE(element, isFirstHit=false) {
        let ee = 0;
        switch (element) {
            case ELEMENT.fire:
                ee = this.fire_ee;
                break;
            case ELEMENT.water:
                ee = this.water_ee;
                break;
            case ELEMENT.wind:
                ee = this.wind_ee;
                break;
            case ELEMENT.earth:
                ee = this.earth_ee;
                break;
            case ELEMENT.light:
                ee = this.light_ee;
                break;
            case ELEMENT.dark:
                ee = this.dark_ee;
                break;
            default:
                ee = 0;
        }
        
        if(!isFirstHit){
            return this.attune_chain + this.ability_chain + ee;
        }
        else{
            return ee;
        }
    }
}

export { Title };
