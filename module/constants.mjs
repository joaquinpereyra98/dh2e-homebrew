const MODULE_CONST = {};

MODULE_CONST.MODULE_ID = "dh2e-homebrew";

MODULE_CONST.PATHS = {};
MODULE_CONST.PATHS.MODULE = `modules/${MODULE_CONST.MODULE_ID}`;
MODULE_CONST.PATHS.TEMPLATES = `${MODULE_CONST.PATHS.MODULE}/templates`;

/*------------------------------------------------------ */

/**
 * @typedef {Object} SkillData
 * @property {string} label
 * @property {string[]} characteristics
 * @property {number} advance
 * @property {boolean} isSpecialist
 * @property {Object.<string, any>} specialities
 * @property {string[]} aptitudes
 * @property {boolean} starter
 * @property {number} cost
 */

/** @type {SkillData} */
MODULE_CONST.defaultSkillData = {
  label: "New Skill",
  characteristics: ["WS"],
  advance: -20,
  isSpecialist: false,
  specialities: {},
  aptitudes: [],
  starter: false,
  cost: 0
}

/**
 * @typedef {Object} HomebrewSkillData
 * @property {string} label
 * @property {string} characteristics
 * @property {number} advance
 * @property {boolean} isSpecialist
 * @property {string[]} aptitudes
 */
/**@type {HomebrewSkillData} */
MODULE_CONST.defaultHomebrewSkill = {
  label: "New Skill",
  characteristics: ["WS"],
  advance: -20,
  isSpecialist: false,
  aptitudes: [],
  specialty: "",
}

/**
 * @typedef {Object} HomebrewSpecialistData
 * @property {string} label
 * @property {string} characteristics
 * @property {number} advance
 * @property {boolean} isSpecialist
 * @property {string[]} aptitudes
 */
/**@type {HomebrewSpecialistData} */
MODULE_CONST.defaultHomebrewSpecialist = {
  label: "New Specialty",
  characteristics: ["WS"],
  advance: -20,
  isSpecialist: true,
  aptitudes: [],
}

/**
 * @typedef {Object} HomebrewSpecilityData
 * @property {string} label
 * @property {number} advance
 * @property {boolean} starter
 * @property {number} cost
 */
/**@type {HomebrewSpecilityData} */
MODULE_CONST.defaultSpecility = {
  label: "Adepta Sororitas",
  advance: -20,
  starter: false,
  cost: 0
}

export default MODULE_CONST;