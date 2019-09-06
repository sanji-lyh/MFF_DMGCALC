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
		isCrossCounter: $("#cross_counter").is(":checked")
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
	
	DisplayResult(resultList);
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
	if(a.unbrokenNeutralDmgDmg < b.unbrokenNeutralDmgDmg){
		return 1;
	}
	else if(a.unbrokenNeutralDmgDmg > b.unbrokenNeutralDmgDmg){
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

function DisplayResult(resultList){
	var compareFn = [compareUnbrokenNeutralDmg, compareUnbrokenWeakness, compareBrokenNeutralDmg, compareBrokenWeaknessDmg];
	var dmgSortTypeName = ["Unbroken Neutral", "Unbroken Weakness", "Broken Neutral", "Broken Weakness"];
	var dmgSortType = 0;
	
	
	
	resultList.sort(compareFn[dmgSortType]);
	console.log(resultList);
	
	$("#result_panel").append("")
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
});