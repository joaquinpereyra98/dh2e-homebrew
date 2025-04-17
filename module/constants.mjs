const MODULE_CONST = {};

MODULE_CONST.MODULE_ID = "dh2e-homebrew";

MODULE_CONST.PATHS = {};
MODULE_CONST.PATHS.MODULE = `modules/${MODULE_CONST.MODULE_ID}`;
MODULE_CONST.PATHS.TEMPLATES = `${MODULE_CONST.PATHS.MODULE}/templates`;

/*------------------------------------------------------ */

MODULE_CONST.CONFIG_TYPES = {
  SKILL: "skill",
  SPECIALIST: "specialist",
}

/*------------------------------------------------------ */

/**
 * A system's skills schema.
 * 
 * @typedef {Object} SkillData
 * @property {string} label - The localization key or display label for the skill.
 * @property {string[]} characteristics - Characteristics associated with the skill (e.g., "WS", "Ag").
 * @property {number} advance - The skill's advancement level (e.g., -20 for untrained).
 * @property {boolean} isSpecialist - Always `false` for general skills.
 * @property {string[]} aptitudes - Aptitudes related to this skill (e.g., "Weapon Skill", "Defence").
 * @property {boolean} starter - Whether the skill is granted at character creation.
 * @property {number} cost - The XP cost to purchase or upgrade the skill.
 * @property {Object} specialities - Always an empty object for general skills.
 */

/** @type {SkillData} */
MODULE_CONST.defaultSkillData = {
  label: "New Skill",
  characteristics: ["WS"],
  advance: -20,
  isSpecialist: false,
  aptitudes: [],
  specialities: {},
  starter: false,
  cost: 0
}

/**
 * A general skill with no specializations.
 * 
 * @typedef {Object} GeneralSkill
 * @property {string} label - The display label or localization key.
 * @property {string[]} characteristics - Characteristics associated with this skill.
 * @property {number} advance - The skill's advancement level.
 * @property {boolean} isSpecialist - Always false for general skills.
 * @property {string[]} aptitudes - Relevant aptitudes for this skill.
 * @property {boolean} starter - Whether the skill is granted at character creation.
 * @property {number} cost - The XP cost to purchase or upgrade the skill.
 * @property {string} specialty - The specialist skill key that contains the skill if is a specialization.
 */

/**@type {GeneralSkill} */
MODULE_CONST.defaultGeneralSkill = {
  label: "New Skill",
  characteristics: ["WS"],
  advance: -20,
  isSpecialist: false,
  aptitudes: [],
  specialty: "",
  starter: false,
  cost: 0,
}

/**
 * A specialist skill that contains one or more specializations.
 * 
 * @typedef {Object} SpecialistSkill
 * @property {string} label - The display label or localization key.
 * @property {string[]} characteristics - Characteristics associated with this skill.
 * @property {number} advance - The base advancement level for the skill.
 * @property {boolean} isSpecialist - Always true for specialist skills.
 * @property {string[]} aptitudes - Relevant aptitudes for this skill.
 * @property {boolean} starter - Whether the skill is granted at character creation.
 * @property {number} cost - The XP cost to purchase or upgrade the skill.
 * @property {Object<string, Specialization>} specialities - A map of specializations keyed by ID.
 */

/**@type {SpecialistSkill} */
MODULE_CONST.defaultSpecialistSkill = {
  label: "New Specialty",
  characteristics: ["WS"],
  advance: -20,
  isSpecialist: true,
  aptitudes: [],
  starter: false,
  cost: 0,
  specialities: {},
}

/**
 * A single specialization within a specialist skill.
 * 
 * @typedef {Object} Specialization
 * @property {string} label - Display name or localization key of the specialization.
 * @property {number} advance - The advancement level specific to this specialization.
 * @property {boolean} starter - Whether this specialization is available at character start.
 * @property {number} cost - XP cost or similar for acquiring this specialization.
 */

/**@type {Specialization} */
MODULE_CONST.defaultSpecialization = {
  label: "New Specialization",
  advance: -20,
  starter: false,
  cost: 0,
}

Object.freeze(MODULE_CONST);

export default MODULE_CONST;