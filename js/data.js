var jobList;
var abilityList;

function GetJob(callback){
	$.getJSON('./data/job.json', function(data) {         
		jobList = data;
		
		callback();
	});
}

function GetAbility(callback){
	$.getJSON('./data/ability.json', function(data) {         
		abilityList = data;
		
		for(i=(abilityList.length-1); i >= 0; i--){
			$('#ability_template').append($('<option>', {value:i, text:(abilityList[i]["AbilityName"]+" -- Atk: " + abilityList[i]["Attack"])}));
		}
		
		callback();
	});
}