import { AUTO_ABILITY as AA, EXTRA_SKILL as ES, URL, ELEMENT, BUFF, UI_SETTING } from './const.js';
import { AbilityCard } from './ability-card.js';
import { Setting } from './settings.js';
import { Job } from './job.js';
import { getJSON, capitalize, numberWithCommas, parseInt2 } from './helper.js';
import { damageCalc } from './calculation.js';
import { Title } from './title.js';
import { Weapon } from './weapon.js';

var IS_GL = true;

var cards;
var jobs;
var weapons;

var curCard;
var curResultList;
var curSetting;
var curPaginationIndex;

async function loadAllCards(data) {
	cards = AbilityCard.loadAllCards(data.attack_uc);
	let _cards = [...cards];
	const elements = [ELEMENT.fire, ELEMENT.water, ELEMENT.wind, ELEMENT.earth, ELEMENT.light, ELEMENT.dark];

	_cards.forEach((c, idx) => c.idx = idx);

	for (let element of elements) {
		$('#ability_template').append($('<optgroup/>').attr('label', capitalize(element)));
		_cards.filter(c => c.element === element)
			.sort((a, b) => (a.name < b.name) ? -1 : 1)
			.forEach(c => {
				$('#ability_template')
					.find('optgroup')
					.last()
					.append($('<option>', { value: c.idx, text: `${c.name} [${capitalize(c.type)}]` }
					));
			});
	}
	
	return Promise.resolve();
}

async function loadAllJobs(data) {
  jobs = Job.loadAllJobs(data);
  return Promise.resolve();
}

async function loadAllWeapon(data){
	weapons = Weapon.loadAllWeapon(data);

	$("#wpn_list").empty();

	weapons = weapons.sort((a, b) => (a.order < b.order) ? -1 : 1);

	let resultHTML = "";

	for(let i=0; i<weapons.length; i++){
		let wpn = weapons[i];
		resultHTML += '<input type="checkbox" name="wpn_choice" id="wpn' + i +'" value="' + i + '" class="d-none" autocomplete="off" checked>';
		resultHTML += '<label data-toggle="tooltip" data-placement="top" data-html="true" data-original-title="' + wpn.getToolTips() + '" for="wpn' + i +'">';
		resultHTML += '<img src="img/weapon/' + wpn.img + '" class="img-check"></label>';
	}

	$("#wpn_list").append(resultHTML);

	return Promise.resolve();
}

function cleanUp() {
  $('#ability_template').empty();
}

function renderLoading() {
  $('#loading_div').removeClass('d-none');
  $('#loading_div').addClass('d-flex');
  $('#main_div').show();
  $('#main_div').addClass('d-none');
  $('#main_div').fadeToggle('slow');
}

function renderRanking() {
  $('#loading_div').addClass('d-none');
  $('#loading_div').removeClass('d-flex');
  $('#main_div').hide();
  $('#main_div').removeClass('d-none');
  $('#main_div').fadeToggle('slow');

  OnAbilityChange();
}

async function init() {
	try {
		cleanUp();
		renderLoading()
		const [cardsJSON, jobsJSON, wpnJSON] = await Promise.all([getJSON(IS_GL ? URL.GL_CARDS : URL.JP_CARDS), getJSON(URL.JOBS), getJSON(URL.WPN)]);
		await loadAllCards(cardsJSON);
		await loadAllJobs(jobsJSON);
		await loadAllWeapon(wpnJSON);

		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		})

		renderRanking()
		// console.dir(cards);
	} catch (e) {
		alert('error loading, please refresh the page');
		// TODO: render error page
		console.error(e);
	}
}

function OnAbilityChange() {
  var index = $('#ability_template').val();

  if (index != null && index >= 0) {
    curCard = cards[index];

    if (jobs != null) {
      UpdateChanges();
    }
  }
}

function GetSelectedWeapons(){
	let selectedWeapons = [];

	$("input:checkbox[name=wpn_choice]:checked").each(function(){
		selectedWeapons.push(weapons[$(this).val()]);
	});

	return selectedWeapons;
}

function UpdateChanges() {
  var curSetting = new Setting();
  var title = new Title();

  var validateFields = [
    "input[name='addition_mag']",
    "input[name='improved_crit']",
    "input[name='exploit_weakness']",
    "input[name='ee_power']",
    "input[name='attuned_chain']",
    "input[name='ability_chain']",
    "input[name='pb_power']",
    "input[name='ravage_power']",
	"input[name='multiply_atk']",
	"input[name='multiply_mag']",
    "input[name='addition_atk']"
  ];

  for (var i = 0; i < validateFields.length; i++) {
    if (!$(validateFields[i]).val()) {
      $(validateFields[i]).val(0);
    }
  }

  curSetting.additionalMagic = parseInt2($("input[name='addition_mag']").val());
  curSetting.additionalAttack = parseInt2($("input[name='addition_atk']").val());
  curSetting.crit_dmg_up = parseInt2($("input[name='improved_crit']").val());
  curSetting.break_dmg_up = parseInt2($("input[name='pb_power']").val());
  curSetting.weak_dmg_up = parseInt2($("input[name='exploit_weakness']").val());
  curSetting.ee = parseInt2($("input[name='ee_power']").val());
  curSetting.ability_chain = parseInt2($("input[name='ability_chain']").val());
  curSetting.attuned_chain = parseInt2($("input[name='attuned_chain']").val());
  curSetting.ravage = parseInt2($("input[name='ravage_power']").val());
  
  curSetting.setFractalAttack(parseInt2($("input[name='multiply_atk']").val()));
  curSetting.setFractalMagic(parseInt2($("input[name='multiply_mag']").val()));

  var dmgSortType = parseInt($("input[name='dmg_type']:checked").val());
  switch (dmgSortType) {
    case 0:
      // unbroken neutral dmg
      curSetting.isBroken = false;
      curSetting.isWeakness = false;
      break;
    case 1:
      // unbroken weakness dmg
      curSetting.isBroken = false;
      curSetting.isWeakness = true;
      break;
    case 2:
      // broken neutral dmg
      curSetting.isBroken = true;
      curSetting.isWeakness = false;
      break;
    case 3:
      // broken weakness dmg
      curSetting.isBroken = true;
      curSetting.isWeakness = true;
      break;
  }

  curSetting.ignoreLore = $('#ignore_lore').is(':checked');
  curSetting.ignoreElement = $('#ignore_element').is(':checked');
  curSetting.maxRetribution = $('#max_retribution').is(':checked');
  curSetting.maxReckoning = $('#max_reckoning').is(':checked');
  curSetting.maxCrossCounter = $('#cross_counter').is(':checked');
  curSetting.maxAbilityRising = $('#max_ability_rising').is(':checked');

  switch (parseInt($("input[name='buff_faith']:checked").val())) {
    case 0:
      curSetting.setFaith('');
      break;
    case 1:
      curSetting.setFaith(BUFF.faith);
      break;
    case 2:
      curSetting.setFaith(BUFF.faith_II);
      break;
  }

  switch (parseInt($("input[name='buff_brave']:checked").val())) {
    case 0:
      curSetting.setBrave('');
      break;
    case 1:
      curSetting.setBrave(BUFF.brave);
      break;
    case 2:
      curSetting.setBrave(BUFF.brave_II);
      break;
  }

  switch (parseInt($("input[name='buff_trance']:checked").val())) {
    case 0:
      curSetting.statMod = 1;
      break;
    case 1:
      curSetting.statMod = 1.3;
      break;
    case 2:
      curSetting.statMod = 1.45;
      break;
  }

  switch (parseInt($("input[name='buff_ee']:checked").val())) {
    case 1:
      curSetting.ee += 25;
      break;
    case 2:
      curSetting.ee += IS_GL ? 50 : 75;
      break;
  }

  if (jobs != null) {
    $('#ability_img').attr('src', 'img/supreme/' + curCard.img);
    $("input[name='atk_display']").val(curCard.attack);
    $("input[name='break_power_display']").val(curCard.break);
    ProcessRanking(curSetting, title);
  } else {
    alert('Error in loading job list. Please refresh the page and try again');
  }
}

function ProcessRanking(setting, title) {
	var resultList = [];
	let selectedWeapons = GetSelectedWeapons();

	// compute dmg for each job first
	for (let i = 0; i < jobs.length; i++) {
		if (IS_GL && !jobs[i].isReleaseGL) {
			continue;
		}

		let suitableWeapons = selectedWeapons.filter(c => c.jobClass === jobs[i].jobClass);

		if(suitableWeapons.length == 0){
			suitableWeapons.push(new Weapon());
		}

		for (let j = 0; j < suitableWeapons.length; j++){
			let resultEntry = {
				job: jobs[i],
				dmgResult: damageCalc(curCard, jobs[i], setting, title, suitableWeapons[j])
			};

			if (!(resultEntry.dmgResult.damage == 0)) {
				resultList.push(resultEntry);
			}
		}
	}
	resultList = resultList.sort(compareDmg);
	
	curResultList = resultList;
	curSetting = setting;
	curPaginationIndex = 0;
	
	DisplayResult();	
}

function compareDmg(a, b) {
  if (a.dmgResult.damage < b.dmgResult.damage) {
    return 1;
  } else if (a.dmgResult.damage > b.dmgResult.damage) {
    return -1;
  } else {
    return 0;
  }
}

function DisplayResult() {
	let dmgSortTypeName = ["Unbroken Neutral", "Unbroken Weakness", "Broken Neutral", "Broken Weakness"];
	let dmgSortType = parseInt($("input[name='dmg_type']:checked").val());
	let elemIcon = ["elem_fire.png", "elem_water.png", "elem_wind.png", "elem_earth.png", "elem_light.png", "elem_dark.png"];

	$("#result_list").empty();
	
	let startIndex = curPaginationIndex * UI_SETTING.max_entry_count;
	let remainingEntryCount = curResultList.length - startIndex;
	let endCount = (remainingEntryCount < UI_SETTING.max_entry_count) ? remainingEntryCount : UI_SETTING.max_entry_count;

	for (let i = startIndex; i < (startIndex + endCount); i++) {
		let job = curResultList[i].job;
		let dmgResult = curResultList[i].dmgResult;

		let displayDmg = numberWithCommas(dmgResult.damage);


		let resultHTML = "<div class=\"list-group-item list-group-item-action flex-column align-items-start\">";

		// Damage Label
		resultHTML += "<div class=\"text-center dmg-label\">";
		resultHTML += "<h4 class=\"mb-n1\">" + displayDmg + "</h4>";
		resultHTML += "<small>" + dmgSortTypeName[dmgSortType] + "</small>";

		resultHTML += "</div><div class=\"d-flex flex-wrap align-items-start\">"

		// Ranking label
		resultHTML += "<h4 class=\"mr-2 rank-label\">#" + (i + 1) + "</h4>";

		// Job Image label
		resultHTML += "<img class=\"mr-2 mb-1 job-img\" src=\"img/job/" + job.img + "\" width=\"70px\">";

		// Job Name and Orbs usage
		resultHTML += "<div><h5 class=\"mb-1\">" + job.name + "</h5>";


		// 1 = fire, 2 = water, 3 = wind, 4 = earth, 5 = light, 6 = dark
		// F, W, A, E, L, D
		resultHTML += "<p>";
		let orbset = [job.orbset1, job.orbset2];
		for (let i = 0; i < orbset.length; i++) {
			if (i >= 1 && orbset[i][0] !== ELEMENT.empty) {
				resultHTML += " / ";
			}
			for (let j = 0; j < orbset[i].length; j++) {
				switch (orbset[i][j]) {
					case ELEMENT.fire:
						resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[0] + "\">"
						break;
					case ELEMENT.water:
						resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[1] + "\">"
						break;
					case ELEMENT.wind:
						resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[2] + "\">"
						break;
					case ELEMENT.earth:
						resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[3] + "\">"
						break;
					case ELEMENT.light:
						resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[4] + "\">"
						break;
					case ELEMENT.dark:
						resultHTML += "<img class=\"icon-img\" src=\"img/" + elemIcon[5] + "\">"
						break;
				}
			}


		}
		resultHTML += "</p></div></div>";

		// Weapon DisplayResult
		if(dmgResult.weapon.name){
			resultHTML += '<div class="d-flex flex-wrap align-items-center">';
			resultHTML += '<div class="mr-2 perk-label font-weight-bold">Weapon: </div>'
			resultHTML += '<div class="mr-2 perk-label"><img src="img/weapon/'+ dmgResult.weapon.img +'"></div>';
			resultHTML += '<div class="mr-2 perk-label">'+ dmgResult.weapon.name +'</div>';
			resultHTML += '</div>';
		}

		resultHTML += "<div class=\"d-flex flex-wrap\">";
		let dmgDivider = "<div class=\"mr-2\"> | </div>";
		resultHTML += "<div class=\"mr-2 perk-label font-weight-bold\">Total: </div>";

		if (curCard.isMagicBased()) {
			resultHTML += "<div class=\"mr-2 perk-label\">Magic +" + numberWithCommas(dmgResult.dmgTerm) + "%</div>";
		}
		else {
			resultHTML += "<div class=\"mr-2 perk-label\">Atk +" + numberWithCommas(dmgResult.dmgTerm) + "%</div>";
		}

		if (dmgResult.eeTerm > 0) {
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Element Enhance +" + numberWithCommas(dmgResult.eeTerm) + "%</div>";
		}

		if (dmgResult.critTerm > 0) {
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Improved Crit +" + numberWithCommas(dmgResult.critTerm) + "%</div>";
		}

		if (dmgSortType == 2 || dmgSortType == 3) {
			if (dmgResult.brokenTerm > 0) {
				resultHTML += dmgDivider;
				resultHTML += "<div class=\"mr-2 perk-label\">Painful Break +" + numberWithCommas(dmgResult.brokenTerm) + "%</div>";
			}
		}

		if (dmgSortType == 1 || dmgSortType == 3) {
			if (dmgResult.weakTerm > 0) {
				resultHTML += dmgDivider;
				resultHTML += "<div class=\"mr-2 perk-label\">Exploit Weakness +" + numberWithCommas(dmgResult.weakTerm) + "%</div>";
			}
		}

		if (dmgResult.ravageTerm > 0) {
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Ravage +" + numberWithCommas(dmgResult.ravageTerm) + "%</div>";
		}

		if (dmgResult.ucTerm > 0) {
			resultHTML += dmgDivider;
			resultHTML += "<div class=\"mr-2 perk-label\">Damage up (Supreme Effect) +" + numberWithCommas(dmgResult.ucTerm) + "%</div>";
		}

		resultHTML += "</div></div>";

		$("#result_list").append(resultHTML);
	}
	
	// Pagination display
	$("#pagination").empty();
	let paginationCount = Math.ceil(curResultList.length / UI_SETTING.max_entry_count);
	let paginationHTML = '<nav aria-label="pagination"><ul class="pagination justify-content-center">';
	
	if(paginationCount > 1){
		for(var i = 0; i < paginationCount; i++){
			let itemClass = "page-item";
			if(curPaginationIndex == i){
				itemClass += " active"
			}
			paginationHTML += '<li class="' + itemClass + '"><a class="page-link" href="#">' + (i+1) + '</a></li>';
		}
		
		paginationHTML += '</ul></nav>';
		
		$("#pagination").append(paginationHTML);
		
		$('ul.pagination li a').on('click',function(e){
			e.preventDefault();
			var tag = $(this);
			curPaginationIndex = parseInt2(tag.text())-1;
			DisplayResult();
			$("html, body").animate({ scrollTop: $("#sort_input").offset().top - 20 }, "fast");
		});
	}
}

function WpnAllSelection(isChecked){
	$("input:checkbox[name=wpn_choice]").prop('checked', isChecked);
	UpdateChanges();
}

(async () => {

	debug.switchVersion = () => {
		IS_GL = !IS_GL;
		init();
	}

	$(document).ready(function () {
		if(window.location.search.substring(1).toLowerCase() === "jpn"){
			IS_GL = false;
			var serverToggle = $("#serverToggle").data('bs.toggle');
			serverToggle.off(true);
		}

		init();

		$("#ability_template").change(function () {
			OnAbilityChange();
		});

		$("#buff_input").change(function () {
			UpdateChanges();
		});

		$("#filter_input").change(function () {
			UpdateChanges();
		});

		$("#sort_input").change(function () {
			UpdateChanges();
		});

		$("#wpn_input").change(function () {
			UpdateChanges();
		});

		$("#setting_input").change(function () {
			UpdateChanges();
		});
		
		$("#wpn_select_all").click(function(){
			WpnAllSelection(true);
		});
		
		$("#wpn_unselect_all").click(function(){
			WpnAllSelection(false);
		});

		$('#serverToggle').change(function() {
			IS_GL = !IS_GL;
			init();
		})
	});
})();
