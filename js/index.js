var curAbility;

function OnAbilityChange(){
	var index = $("#ability_template").val()
	
	if(index >= 0) {
		curAbility = abilityList[index];
	}
	
	if(jobList != null){
		UpdateChanges();
	}
}

function UpdateChanges(){
	var userInput = {
		ability: curAbility,
		ignoreLoreOption: $("#ignore_lore").is(":checked"),
		showElementsOption: $("#display_element").is(":checked")
	};
	
	if(jobList != null){
		$('#ability_img').attr('src', "img/supreme/"+curAbility["ImageName"]);
		$("input[name='atk_display']").val(curAbility["Attack"]);
		$("input[name='break_power_display']").val(curAbility["BreakPower"]);
		ProcessRanking(userInput, jobList);
	}
	else {
		alert("Error in loading job list. Please refresh the page and try again");
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
	
	$('#result_table').DataTable( {
		"order": [[ 1, "desc" ]],
		"searching": false,
		"lengthChange": false,
		"lengthMenu": [[25, 50, -1], [25, 50, "All"]]
	} );
});