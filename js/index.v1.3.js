var curAbility;

function OnAbilityChange(){
	var index = $("#ability_template").val()
	
	if(index!= null && index >= 0) {
		curAbility = abilityList[index];
		
		if(jobList != null){
			UpdateChanges();
		}
	}
}

function UpdateChanges(){
	var userInput = {
		ability: curAbility,
		ignoreLoreOption: $("#ignore_lore").is(":checked"),
		showElementsOption: $("#display_element").is(":checked"),
		isMaxRetribution: $("#max_retribution").is(":checked"),
		isMaxReckoning: $("#max_reckoning").is(":checked"),
		isCrossCounter: $("#cross_counter").is(":checked"),
		dmgSortType: parseInt($("input[name='dmg_type']:checked").val())
	};
	
	if(jobList != null){
		$('#ability_img').attr('src', "img/supreme/"+curAbility["ImageName"]);
		$("input[name='atk_display']").val(curAbility["Attack"]);
		$("input[name='break_power_display']").val(curAbility["BreakPower"]);
		ProcessRanking(userInput);
	}
	else {
		alert("Error in loading job list. Please refresh the page and try again");
	}
}

function ProcessRanking(userInput){	
	resultList = [];

	// compute dmg for each job first
	for(i = 0; i < jobList.length; i++){
		var resultEntry = {
			job: jobList[i],
			unbrokenWeaknessDmg: ComputeDmg(userInput, jobList[i], false, true),
			unbrokenNeutralDmg: ComputeDmg(userInput, jobList[i], false, false),
			brokenWeaknessDmg: ComputeDmg(userInput, jobList[i], true, true),
			brokenNeutralDmg: ComputeDmg(userInput, jobList[i], true, false)
		};
		
		if(!(resultEntry.unbrokenWeaknessDmg == 0
			&& resultEntry.unbrokenNeutralDmg == 0
			&& resultEntry.brokenWeaknessDmg == 0
			&& resultEntry.brokenNeutralDmg == 0))
		{
			resultList.push(resultEntry);
		}
	}
	
	DisplayResult(resultList, userInput);
}

function compareUnbrokenWeakness(a, b){
	if(a.unbrokenWeaknessDmg < b.unbrokenWeaknessDmg){
		return 1;
	}
	else if(a.unbrokenWeaknessDmg > b.unbrokenWeaknessDmg){
		return -1;
	}
	else{
		return 0;
	}	
}

function compareUnbrokenNeutralDmg(a, b){
	if(a.unbrokenNeutralDmg < b.unbrokenNeutralDmg){
		return 1;
	}
	else if(a.unbrokenNeutralDmg > b.unbrokenNeutralDmg){
		return -1;
	}
	else{
		return 0;
	}	
}

function compareBrokenWeaknessDmg(a, b){
	if(a.brokenWeaknessDmg < b.brokenWeaknessDmg){
		return 1;
	}
	else if(a.brokenWeaknessDmg > b.brokenWeaknessDmg){
		return -1;
	}
	else{
		return 0;
	}	
}

function compareBrokenNeutralDmg(a, b){
	if(a.brokenNeutralDmg < b.brokenNeutralDmg){
		return 1;
	}
	else if(a.brokenNeutralDmg > b.brokenNeutralDmg){
		return -1;
	}
	else{
		return 0;
	}	
}

function DisplayResult(resultList, userInput){
	var compareFn = [compareUnbrokenNeutralDmg, compareUnbrokenWeakness, compareBrokenNeutralDmg, compareBrokenWeaknessDmg];
	var dmgSortTypeName = ["Unbroken Neutral", "Unbroken Weakness", "Broken Neutral", "Broken Weakness"];
	var elemIcon = ["elem_fire.png", "elem_water.png", "elem_wind.png", "elem_earth.png", "elem_light.png", "elem_dark.png"];
	var orbSetLabels = ["OrbSet1_1", "OrbSet1_2", "OrbSet1_3", "OrbSet2_1", "OrbSet2_2", "OrbSet2_3"];
	var dmgSortType = userInput.dmgSortType;
	
	resultList = resultList.sort(compareFn[dmgSortType]);
	
	$("#result_list").empty();
	
	for(i=0; i < resultList.length; i++){
		displayDmg = 0;
		switch(dmgSortType){
			case 0:
				displayDmg = numberWithCommas(resultList[i].unbrokenNeutralDmg);
				break;
			case 1:
				displayDmg = numberWithCommas(resultList[i].unbrokenWeaknessDmg);
				break;
			case 2:
				displayDmg = numberWithCommas(resultList[i].brokenNeutralDmg);
				break;
			case 3:
				displayDmg = numberWithCommas(resultList[i].brokenWeaknessDmg);
				break;
		}
		
		
		resultHTML = "<div class=\"list-group-item list-group-item-action flex-column align-items-start\">";
		
		// Damage Label
		resultHTML += "<div class=\"text-center dmg-label\">";
		resultHTML += "<h4 class=\"mb-n1\">" + displayDmg + "</h4>";
		resultHTML += "<small>"+dmgSortTypeName[dmgSortType]+"</small>";
		
		resultHTML += "</div><div class=\"d-flex flex-wrap align-items-start\">"
		
		// Ranking label
		resultHTML += "<h4 class=\"mr-2 rank-label\">#"+ (i+1) + "</h4>";
		
		// Job Image label
		resultHTML += "<img class=\"mr-2 mb-1 job-img\" src=\"img/job/" + resultList[i].job["ImageName"] +"\" width=\"70px\">";
		
		// Job Name and Orbs usage
		resultHTML += "<div><h5 class=\"mb-1\">" +  resultList[i].job["Job Name"] + "</h5>";
			
		// 1 = fire, 2 = water, 3 = wind, 4 = earth, 5 = light, 6 = dark
		// F, W, A, E, L, D
		resultHTML += "<p>";
		for(j=0; j < orbSetLabels.length; j++){
			if(j == 3){
				resultHTML += " / "
			}
			switch(resultList[i].job[orbSetLabels[j]]){
				case "F":
					resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[0] + "\">"
					break;
				case "W":
					resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[1] + "\">"
					break;
				case "A":
					resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[2] + "\">"
					break;
				case "E":
					resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[3] + "\">"
					break;
				case "L":
					resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[4] + "\">"
					break;
				case "D":
					resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[5] + "\">"
					break;
				default:
			}
		}
		
		if(resultHTML.slice(-3) === " / "){
			resultHTML = resultHTML.substr(0, resultHTML.length-3);
		}
		resultHTML += "</p></div></div>";		
		
		resultHTML += "<div class=\"d-flex flex-wrap\">";
		dmgDivider = "<div class=\"mr-2\"> | </div>";
		resultHTML += "<div class=\"mr-2 perk-label font-weight-bold\">Total: </div>";
		
		// Mag/Atk
		if(userInput.ability["Type"] !== "Monk"){  // true = magic, false = atk
			additional_mag = 0;
			if(userInput.isMaxReckoning && resultList[i].job["Reckoning"]==1){
				additional_mag += 2400;
			}		
			
			mag_mod = 1;
			if(userInput.isCrossCounter && resultList[i].job["Cross Counter"] != ""){		
				mag_mod += (parseInt2(resultList[i].job["Cross Counter"])/100);
			}
		
			//Mag: (1 + magic_stat/100) * (1 + magic_mod/100) * (1 + stat_mod/100) + additional_magic/100		
			mag = ( ((parseInt2(resultList[i].job["Magic"])) * mag_mod) + additional_mag);
			
			resultHTML += "<div class=\"mr-2 perk-label\">Magic +" + numberWithCommas(mag) + "%</div>";
		}
		else{
			additional_atk = 0;
			if(userInput.isMaxRetribution && resultList[i].job["Retribution"]==1){
				additional_atk += 2400;
			}
			
			atk_mod = 1;
			if(userInput.isCrossCounter && resultList[i].job["Cross Counter"] != ""){		
				atk_mod += (parseInt2(resultList[i].job["Cross Counter"])/100);
			}
			
			//Atk: (1 + attack_stat/100) * (1 + attack_mod/100) * (1 + stat_mod/100) + additional_attack/100
			atk = ( ((parseInt2(resultList[i].job["Attack"])) * atk_mod ) + additional_atk);
			
			resultHTML += "<div class=\"mr-2 perk-label\">Atk +"+ numberWithCommas(atk) + "%</div>";
		}
		
		// EE
		switch(userInput.ability["Elem"]){
		// 1 = fire, 2 = water, 3 = wind, 4 = earth, 5 = light, 6 = dark
		case 1:
			ee = parseInt2(resultList[i].job["Fire_EE"]) + userInput.ability["ElementEnhance"];
			break;
		case 2:
			ee = parseInt2(resultList[i].job["Water_EE"]) + userInput.ability["ElementEnhance"];
			break;
		case 3:
			ee = parseInt2(resultList[i].job["Wind_EE"]) + userInput.ability["ElementEnhance"];
			break;
		case 4:
			ee = parseInt2(resultList[i].job["Earth_EE"]) + userInput.ability["ElementEnhance"];
			break;
		case 5:
			ee = parseInt2(resultList[i].job["Light_EE"]) + userInput.ability["ElementEnhance"];
			break;
		case 6:
			ee = parseInt2(resultList[i].job["Dark_EE"])+ userInput.ability["ElementEnhance"];
			break;
		}
		if(ee >0){
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Element Enhance +" + numberWithCommas(ee) + "%</div>";
		}
		
		// Ability Chain
		abilityChain = parseInt2(resultList[i].job["Ability Chain"]) + userInput.ability["AbilityChain"];
		if(abilityChain > 0){
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Ability Chain +" + numberWithCommas(abilityChain) + "%</div>";
		}
	
		// Attuned Chain
		attunedChain = userInput.ability["AttunedChain"];
		if(attunedChain > 0){
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Attuned Chain +" + numberWithCommas(attunedChain) + "%</div>";
		}
		
		// Critical
		crit = parseInt2(resultList[i].job["Improved Crits"]) + userInput.ability["ImprovedCrit"];
		if(crit > 0){
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Improved Crit +" + numberWithCommas(crit) + "%</div>";
		}
		
		// Broken
		if(dmgSortType == 2 || dmgSortType == 3){
			painfulBreak = parseInt2(resultList[i].job["Painful Break"]) + userInput.ability["PainfulBreak"];
			if(painfulBreak > 0){
				resultHTML += dmgDivider;
				resultHTML += "<div class=\"mr-2 perk-label\">Painful Break +" + numberWithCommas(painfulBreak) + "%</div>";
			}
		}
		
		if(dmgSortType == 1 || dmgSortType == 3){
			exploitWeakness = parseInt2(resultList[i].job["Exploit Weakness"]) + userInput.ability["ExploitWeakness"];
			if(exploitWeakness > 0){
				resultHTML += dmgDivider;
				resultHTML += "<div class=\"mr-2 perk-label\">Exploit Weakness +" + numberWithCommas(exploitWeakness) + "%</div>";
			}
			
		}

		ravage = parseInt2(resultList[i].job["Ravage"]) + userInput.ability["Ravage"];
		if(ravage > 0){
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Ravage +" + numberWithCommas(ravage) + "%</div>";
		}
		
		supremeEffect = parseInt2(userInput.ability["SupremeEffect"])
		if (supremeEffect > 0){
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Supreme Effect +" + numberWithCommas(supremeEffect) + "%</div>";
		}
		

		resultHTML += "</div>";
		
		
		resultHTML += "</div>";	
		
		$("#result_list").append(resultHTML);
	}	
	
	
}

$(document).ready(function() {
	GetJob(OnAbilityChange);
	GetAbility(OnAbilityChange);
	
	$("#ability_template").change(function(){
		OnAbilityChange();
	});

	$("#ignore_lore").change(function(){
		UpdateChanges();
	});
	
	$("#display_element").change(function(){
		UpdateChanges();
	});
	
	$("#max_retribution").change(function(){
		UpdateChanges();
	});
	
	$("#max_reckoning").change(function(){
		UpdateChanges();
	});
	
	$("#cross_counter").change(function(){
		UpdateChanges();
	});
	
	$("#sort_input").change(function(){
		UpdateChanges();
	});
});