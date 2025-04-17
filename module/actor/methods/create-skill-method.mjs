import MODULE_CONST from '../../constants.mjs';
import SkillConfig from '../apps/skill-config.mjs';
import { toCamelCase, generateKey } from "../../utils.mjs";

/**
 * @typedef {import('../../constants.mjs').SkillData} SkillData
 */

/**
 * Opens a dialog to create a new skill or specialty and updates the actor.
 *
 * @this {Actor} The actor instance this skill will be added to.
 * @returns {Promise<Actor|null>} A promise that resolves to the updated actor document,
 *                                or `null` if the dialog was canceled or no data was returned.
 */
export default async function createSkill() {
  const { defaultSkillData, defaultGeneralSkill, defaultSpecialization, CONFIG_TYPES } = MODULE_CONST;

  const dataConfig = await SkillConfig.create({
    actor: this,
    skillData: defaultGeneralSkill,
    title: "Create New Skill",
    type: CONFIG_TYPES.SKILL,
  })

  if (!dataConfig) return null;

  if (dataConfig.specialty) {
    const parentSkill = foundry.utils.duplicate(this.skills[dataConfig.specialty])
    const specilityData = foundry.utils.mergeObject(defaultSpecialization, dataConfig, { insertKeys: false, inplace: false });

    const specilityKey = generateKey(toCamelCase(specilityData.label), Object.keys(parentSkill.specialities));

    parentSkill.specialities[specilityKey] = specilityData;

    return await this.update({
      [`system.skills.${dataConfig.specialty}`]: parentSkill,
    });
  } else {
    const skillData = foundry.utils.mergeObject(defaultSkillData, dataConfig, { insertKeys: false, inplace: false });
    const skillKey = generateKey(toCamelCase(skillData.label), Object.keys(this.skills));
    return await this.update({
      [`system.skills.${skillKey}`]: skillData,
    });
  }
}