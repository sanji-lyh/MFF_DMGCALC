import { ELEMENT, CLASS, ELEMENT_SHORT } from './const.js';

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
	
		
		this.orbset1 = [];
		this.orbset2 = [];
		
		let orbset = [this.orbset1, this.orbset2];
		let optionOrbset = [options.OrbSet1, options.OrbSet2];
	
		for(let i=0; i < orbset.length; i++){			
			for(let j=0; j < optionOrbset[i].length; j++){
				switch(optionOrbset[i][j]){
					case ELEMENT_SHORT.fire:
						orbset[i].push(ELEMENT.fire);
						break;
					case ELEMENT_SHORT.water:
						orbset[i].push(ELEMENT.water);
						break;
					case ELEMENT_SHORT.wind:
						orbset[i].push(ELEMENT.wind);
						break;
					case ELEMENT_SHORT.earth:
						orbset[i].push(ELEMENT.earth);
						break;
					case ELEMENT_SHORT.light:
						orbset[i].push(ELEMENT.light);
						break;
					case ELEMENT_SHORT.dark:
						orbset[i].push(ELEMENT.dark);
						break;
					case ELEMENT_SHORT.empty:
						orbset[i].push(ELEMENT.empty);
						break;
				}
			}
		}

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
        this.discordant_chain = options["Discordant Chain"] || 0;
        
        this.skilled_duelist = options["Skilled Duelist"] || 0;
        this.prismatic_return = options["Prismatic Return"] || 0;
        
		this.reckoning = options["Reckoning"] || 0;
		this.retribution = options["Retribution"] || 0;
		this.cross_counter = options["Cross Counter"] || 0;
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
	
	checkLore(card) {
		let result = false;
		let typeFields, checkFields;
		checkFields = [this.jobClass.toLowerCase(), this.lore.toLowerCase()];
	
		switch(card.type){
			case CLASS.warrior:
				typeFields = [CLASS.warrior, CLASS.graff];
				break;
			case CLASS.mage:
				typeFields = [CLASS.mage, CLASS.meia];
				break;
			case CLASS.ranger:
				typeFields = [CLASS.ranger, CLASS.sarah];
				break;
			case CLASS.monk:
				typeFields = [CLASS.monk, CLASS.sophie];
				break;
		}
		
		for(let i=0; i < checkFields.length; i++){
			for(let j=0; j < typeFields.length; j++){
				if(checkFields[i].indexOf(typeFields[j]) !== -1){
					result = true;
				}
			}
		}
				
		return result;
	}
	
	checkElement(card) {
		let checkFields = [this.orbset1, this.orbset2];
		let result = false;
		
		for(let i=0; i < checkFields.length; i++){
			for(let j=0; j < checkFields[i].length; j++){
				if(card.element === checkFields[i][j]){
					result = true;
				}
			}
		}
		
		return result;
	}
}

export { Job }