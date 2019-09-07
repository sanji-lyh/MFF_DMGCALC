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
			userInput: userInput,
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
	
	DisplayResult(resultList, userInput.dmgSortType);
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

function DisplayResult(resultList, dmgSortType=0){
	var compareFn = [compareUnbrokenNeutralDmg, compareUnbrokenWeakness, compareBrokenNeutralDmg, compareBrokenWeaknessDmg];
	var dmgSortTypeName = ["Unbroken Neutral", "Unbroken Weakness", "Broken Neutral", "Broken Weakness"];
	var elemIcon = ["elem_fire.png", "elem_water.png", "elem_wind.png", "elem_earth.png", "elem_light.png", "elem_dark.png"];
	var orbSetLabels = ["OrbSet1_1", "OrbSet1_2", "OrbSet1_3", "OrbSet2_1", "OrbSet2_2", "OrbSet2_3"];
	
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
		
		
		resultHTML += "</p></div>";		
		resultHTML += "</div></div>";	
		
		$("#result_list").append(resultHTML);
		
		
		// <p class="mb-1">Magic +200%</p>
		// <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
	    // <small class="text-muted">Donec id elit non mi porta.</small>
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