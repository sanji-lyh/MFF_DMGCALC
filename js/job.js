import { ELEMENT } from './const.js';

class Job {
    constructor(options) {
		this.name = options.JobName || '';
		this.img = options.ImageName || "0.jpg";
		this.jobClass = options.Class;
		this.lore = options.Lore || '';
		
		this.isReleaseGL = options.IsReleaseGL || 0;
		
        // stats
        this.HP = options.HP;
        this.attack = options.Attack;
        this.magic = options.Magic;
        this.break = options.Break;
		
		this.orbset1 = options.OrbSet1 || [];
		this.orbset2 = options.OrbSet2 || [];

        // AA
		this.fire_ee = options.Fire_EE || 0;
        this.water_ee = options.Water_EE || 0;
        this.wind_ee = options.Wind_EE || 0;
        this.earth_ee = options.Earth_EE || 0;
        this.light_ee = options.Light_EE || 0;
        this.dark_ee = options.Dark_EE || 0;
		
		this.break_dmg_up = options["Painful Break"] || 0;
        this.crit_dmg_up = options["Improved Crits"] || 0;
        this.weak_dmg_up = options["Exploit Weakness"] || 0;
        this.ravage = options.Ravage || 0;
		
        this.attune_chain = options["Attuned Chain"] || 0;
        this.ability_chain = options["Ability Chain"] || 0;
        this.ability_rising = options["Ability Rising"] ||0;
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

    static loadAllJobs(jobsJSON) {
        return jobsJSON.map(x => new Job(x));
    }
}

export { Job }