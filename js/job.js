import { ELEMENT } from './const.js';

class Job {
    constructor() {
        // stats
        this.HP = 0;
        this.attack = 0;
        this.magic = 0;
        this.break = 0;

        // AA
        this.break_dmg_up = 0;
        this.crit_dmg_up = 0;
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

    totalHP(setting) {
        // TODO
        return this.HP;
    }

    loadAllJobs(server) {
        /*
            function for loading all jobs before feeding to ranking functions
        */
        server = server || 'JP';
        // TODO
    }
}

