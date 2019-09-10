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
		
		// 1 = fire, 2 = water, 3 = wind, 4 = earth, 5 = light, 6 = dark
		var elem_text = ["Fire", "Water", "Wind", "Earth", "Light", "Dark"];
		
		
		for(i=1; i<=6; i++){
			$('#ability_template').append($('<optgroup/>').attr('label', elem_text[i-1]));
			
			for(j=(abilityList.length-1); j >= 0; j--){
				if(abilityList[j]["Elem"] == i) {
					$('#ability_template').find('optgroup').last().append($('<option>', {value:j, text:(abilityList[j]["AbilityName"]+" -- Atk: " + abilityList[j]["Attack"])}));
				}
			}
		}
		
		$('#ability_template').append($('<optgroup/>').attr('label', "Custom"));
		$('#ability_template').find('optgroup').last().append($('<option>', {value:-1, text:"Custom input ability"}));
		
		callback();
	});
}