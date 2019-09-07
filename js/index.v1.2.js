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
			name: jobList[i]["Job Name"],
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
	
	if ($.fn.DataTable.isDataTable("#result_table")) {
	  $('#result_table').DataTable().clear().destroy();
	}
			
	for(i=0; i < resultList.length; i++){
		$("#result_table > tbody:last-child").append("<tr><td>" + resultList[i].name + "</td><td>" + numberWithCommas(resultList[i].unbrokenNeutralDmg) + "</td><td>" + numberWithCommas(resultList[i].unbrokenWeaknessDmg) + "</td><td>" + numberWithCommas(resultList[i].brokenNeutralDmg) + "</td><td>" + numberWithCommas(resultList[i].brokenWeaknessDmg)  + "</td>")
	}
	
	$('#result_table').DataTable( {
		"order": [[ 1, "desc" ]],
		"lengthMenu": [[25, 50, -1], [25, 50, "All"]],
		"searching": false,
		"lengthChange": false,
		columnDefs: [{targets: [ "_all" ], orderSequence: [ "desc", "desc", "asc" ]  }]
	} );
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
	
	$('#result_table').DataTable( {
		"order": [[ 1, "desc" ]],
		"searching": false,
		"lengthChange": false,
		"lengthMenu": [[25, 50, -1], [25, 50, "All"]]
	} );
});