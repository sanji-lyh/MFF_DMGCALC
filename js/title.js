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
        this.HP;
        this.attack;
        this.break;
        this.magic;
        this.critical;
        this.break_dmg_up;
        this.weak_dmg_up;
        this.ravage;
        this.fire_ee;
        this.water_ee;
        this.wind_ee;
        this.earth_ee;
        this.light_ee;
        this.dark_ee;
        this.attune_chain;
        this.ability_chain;
        this.ability_rising;
        this.ovepower;
        this.taiman;
    }

    getEE(element) {
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
        return this.attune_chain + this.ability_chain + ee;
    }
}

export { Title };
