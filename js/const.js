// TODO: add complete list of AA and ES

const AUTO_ABILITY = {
  break_dmg_up: 'break damage up',
  crit_dmg_up: 'critical damage up',
  weak_dmg_up: 'weak damage up',
  ravage: 'ravage',
  fire_ee: 'enhance fire',
  water_ee: 'enhance water',
  wind_ee: 'enhance wind',
  earth_ee: 'enhance earth',
  light_ee: 'enhance light',
  dark_ee: 'enhance dark',
  attune_chain: 'attune chain',
  ability_chain: 'ability chain',
  ability_rising: 'ability rising'
};

const CLASS = {
  warrior: 'warrior',
  mage: 'mage',
  ranger: 'ranger',
  monk: 'monk',
  meia: 'meia',
  sarah: 'sarah',
  sophie: 'sophie',
  graff: 'graff'
};

const MP_ROLE = {
    attacker: 'Attacker',
    breaker: 'Breaker',
    defender: 'Defender',
    healer: 'Healer'
};

const STATS = {
  attack: 'attack',
  break: 'break',
  magic: 'magic',
  critical: 'critical'
};

const ELEMENT = {
  fire: 'fire',
  water: 'water',
  wind: 'wind',
  earth: 'earth',
  light: 'light',
  dark: 'dark',
  empty: ''
};

const ELEMENT_SHORT = {
  fire: 'F',
  water: 'W',
  wind: 'A',
  earth: 'E',
  light: 'L',
  dark: 'D',
  empty: ''
};

const EXTRA_SKILL = {
  all_range_attack: 'all range attack',
  attack_merge: 'attack merge',
  bad_luck: 'bad luck',
  break_enhance: 'break enhance',
  break_escalate: 'break escalate',
  break_killer: 'break killer',
  break_killer: 'break killer',
  break_ruler: 'break ruler',
  charge_attack: 'charge attack',
  critical_rupture: 'critical rupture',
  critical_sundering: 'critical sundering',
  critical_weakness: 'critical weakness',
  damage_limit_break: 'damage limit break',
  damage_limit_break_II: 'damage limit break II',
  dark_weapon: 'dark weapon',
  earth_weapon: 'earth weapon',
  element_drive_synergy: 'element drive synergy',
  element_everyday: 'element everyday',
  element_mirror: 'element mirror',
  element_return: 'element return',
  element_rise: 'element rise',
  element_synergy: 'element synergy',
  enhance_combine: 'enhance combine',
  flame_weapon: 'flame weapon',
  fortune: 'fortune',
  generate_synergy: 'generate synergy',
  high_voltage: 'high voltage',
  ice_weapon: 'ice weapon',
  legendary_blade_master: 'legendary blade master',
  life_element_rise: 'life element rise',
  light_weapon: 'light weapon',
  lucky_element: 'lucky element',
  magic_merge: 'magic merge',
  magical_merge: 'magical merge',
  mantra: 'mantra',
  martial_combat: 'martial combat',
  martial_flow: 'martial flow',
  misfortune: 'misfortune',
  overdrive: 'overdrive',
  phantom_zone: 'phantom zone',
  resist_breaker: 'resist breaker',
  risky_attacker: 'risky attacker',
  solitary_lion: 'solitary lion',
  taijutsu: 'taijutsu',
  ultra_break_escalate: 'ultra break escalate',
  ultra_convergence: 'ultra convergence',
  ultra_critical_damage_up: 'ultra critical damage up',
  ultra_damage_escalate: 'ultra damage escalate',
  ultra_defense_breaker: 'ultra defense breaker',
  ultra_element_synergy: 'ultra element synergy',
  ultra_martial_combat: 'ultra martial combat',
  ultra_resist_breaker: 'ultra resist breaker',
  vital_attacker: 'vital attacker',
  warring_triad: 'warring triad',
  weakness_boost: 'weakness boost',
  wind_weapon: 'wind weapon'
};

const TARGET = {
    single_target: "single target",
    aoe: "aoe"
};

const BUFF_VALUE = {
  faith: 0.5,
  faith_II: 0.75,
  brave: 1,
  brave_II: 1.5,
  boost: 1,
  boost_II: 1.5,
  trance: 0.3,
  trance_II: 0.45,
  berserk: 50,
  berserk_II: 75
};

const BUFF = {
  faith: 'faith',
  faith_II: 'faith II',
  brave: 'brave',
  brave_II: 'brave II',
  trance: 'trance',
  trance_II: 'trance II',
  berserk: 'berserk',
  berserk_II: 'berserk II',
  ee_atk: 'ee atk',
  ee_atk_II: 'ee atk II'
};

const URL = {
  JP_CARDS: 'https://script.google.com/macros/s/AKfycby5HVdcFyPDu9kLXT7pM_YhPjhyskSUqtm7suKcEUKJSHaiyslA/exec',
  GL_CARDS: 'https://script.google.com/macros/s/AKfycbz_7KPqyW9GNGIo76kYzrgS6Gl6shkhhr-OT1cdY5dc2KGL-MU/exec',
	JOBS: 'https://script.google.com/macros/s/AKfycbwE1E0a0k__mXgUqdj6oSjty9JoWI6JvCaosglgug/exec',
	WPN: 'https://script.google.com/macros/s/AKfycbw4qHH9SgcXEl5D5O-MuLp4IfjZCXz4_NfOn41VlA/exec'
};

const UI_SETTING = {
	max_entry_count: 50
}

export { AUTO_ABILITY, URL, EXTRA_SKILL, CLASS, STATS, ELEMENT, ELEMENT_SHORT, BUFF, BUFF_VALUE, UI_SETTING, TARGET, MP_ROLE};
