import { ELEMENT, CLASS, ELEMENT_SHORT } from './const.js';

class Weapon {	
    constructor(options) {
		if(options){
			this.order = options["order"] || 0;
			
			this.name = options["Weapon Name"] || "";
			this.img = options["Image Name"] || "";
			
			this.jobClass = options.Class;
			
			// stats
			this.HP = options.HP || 0;
			this.attack = options.Attack || 0;
			this.magic = options.Magic || 0;
			this.break = options.Break || 0;
			
			this.attune_chain = options["Attuned Chain"] || 0;
			this.ability_chain = options["Ability Chain"] || 0;
			this.ability_rising = options["Ability Rising"] ||0;
			
			this.crit_dmg_up = options["Improved Crits"] || 0;
			this.weak_dmg_up = options["Exploit Weakness"] || 0;
			
			this.break_dmg_up = options["Painful Break"] || 0;		
			this.piercing_break = options["Piercing Break"] || 0;
			this.flash_break = options["Flash Break"] || 0;
			this.quick_break = options["Quick Break"] || 0;
			
			this.overpower = options.Overpower || 0;
			this.ravage = options.Ravage || 0
			
			this.ultimate_charge_abilities = options["Ultimate Charge Abilities"] || 0;
			this.extended_break = options["Extended Break"] || 0;
			this.boost_ultimate = options["Boost Ultimate"] || 0;
		}
		else{
			this.order = 0;
			
			this.name = "";
			this.img = "";

			this.HP = 0;
			this.attack = 0;
			this.magic = 0;
			this.break = 0;
			
			this.attune_chain = 0;
			this.ability_chain = 0;
			this.ability_rising = 0;
			
			this.crit_dmg_up = 0;
			this.weak_dmg_up = 0;
			
			this.break_dmg_up = 0;		
			this.piercing_break = 0;
			this.flash_break = 0;
			this.quick_break = 0;
			
			this.overpower = 0;
			this.ravage = 0
			
			this.ultimate_charge_abilities = 0;
			this.extended_break = 0;
			this.boost_ultimate = 0;
		}
    }

    static loadAllWeapon(wpnJSON) {
        return wpnJSON.map(x => new Weapon(x));
    }
	
	getToolTips(){
		let statsTitle = ["Attuned Chain", "Ability Chain", "Ability Rising", "Improved Crits",
							"Exploit Weakness", "Painful Break", "Piercing Break", "Flash Break",
							"Quick Break", "Overpower", "Ravage", "Ultimate Charge Abilities",
							"Extended Break", "Boost Ultimate"];
							
		let stats = [this.attune_chain, this.ability_chain, this.ability_rising, this.crit_dmg_up,
						this.weak_dmg_up, this.break_dmg_up, this.piercing_break, this.flash_break,
						this.quick_break, this.overpower, this.ravage, this.ultimate_charge_abilities,
						this.extended_break, this.boost_ultimate];
		let statsUnit = ["%", "%", "%", "%", "%", "%", "%", "%", "%", "%", "%", "", "", ""];
						
		
		let description = "";
		let enterSpace = "<br/>";
		for(let i=0; i<stats.length; i++){
			if(stats[i]){
				if(description){
					description += enterSpace;
				}
				description += statsTitle[i] + " +" + stats[i] + statsUnit[i];
			}				
		}
		
		description = "<b>" + this.name + "</b><br/>" + description;
		
		return description;
	}
	
	getEE(element){
		return this.attune_chain + this.ability_chain;
	}
}

export { Weapon }