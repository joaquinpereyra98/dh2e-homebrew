import SkillConfig from '../apps/skill-config.mjs';
import MODULE_CONST from '../../constants.mjs';
import { generateKey, toCamelCase } from '../../utils.mjs';

export default async function editSkill({ skillKey, specializationKey }) {
  if (!this.skills.hasOwnProperty(skillKey)) {
    console.log(`Skill with key "${skillKey}" does not exist.`);
    return null;
  }

  if (specializationKey) return await _editSpecialization.call(this, skillKey, specializationKey);
  else return await _editGeneralSkill.call(this, skillKey);
}

/**
 * Opens a configuration dialog to edit a general skill. If the edited skill is converted into a specialty,
 * it moves the skill under the appropriate specialty path and removes the original general skill.
 * Otherwise, it simply updates the general skill in place.
 *
 * @async
 * @param {string} skillKey - The key of the general skill to edit (e.g., "trade", "lore").
 * @returns {Promise<Actor|null>} - Actor updated, or `null` if editing was canceled.
 */
async function _editGeneralSkill(skillKey) {
  const { CONFIG_TYPES, defaultSpecialization } = MODULE_CONST;

  const skill = foundry.utils.duplicate(this.skills[skillKey]);
  skill.key = skillKey;

  const editedSkill = await SkillConfig.create({
    actor: this,
    skillData: skill,
    title: `Edit ${game.i18n.localize(skill.label)} Skill`,
    type: CONFIG_TYPES.EDIT_SKILL
  });

  if (!editedSkill) return null;

  // General Skill -> Specialty
  if (editedSkill.specialty) {
    const targetSkill = foundry.utils.duplicate(this.skills[editedSkill.specialty]);
    const newSpec = foundry.utils.mergeObject(defaultSpecialization, editedSkill, { insertKeys: false, inplace: false });
    const newKey = generateKey(toCamelCase(newSpec.label), Object.keys(targetSkill.specialities));
    return this.update({
      [`system.skills.${editedSkill.specialty}.specialities.${newKey}`]: newSpec,
      [`system.skills.-=${skillKey}`]: null,
    });
  }

  //Just update General Skill
  return this.update({
    [`system.skills.${skillKey}`]: editedSkill,
  });

}

/**
 * Opens a configuration dialog to edit a specialization under a specified skill. Based on the user's changes,
 * the specialization may be updated in place, moved to a different skill, or promoted to a general skill.
 *
 * Behavior:
 * - If converted to a general skill, it is added to the root skill list and removed from its original parent.
 * - If moved to another skill, it is added under the new skill and removed from the original.
 * - Otherwise, the specialization is updated in place.
 *
 * @async
 * @param {string} skillKey - The key of the skill that currently contains the specialization.
 * @param {string} specializationKey - The key of the specialization to edit.
 * @returns {Promise<Actor|null>} - Actor updated, or `null` if the edit was canceled.
 */


async function _editSpecialization(skillKey, specializationKey) {
  const { CONFIG_TYPES, defaultGeneralSkill, defaultSpecialization } = MODULE_CONST;

  const skill = foundry.utils.duplicate(this.skills[skillKey]);

  const specialization = foundry.utils.duplicate(skill.specialities?.[specializationKey]);

  if (!specialization) {
    console.log(`Specialization "${specializationKey}" was not found in the skill "${game.i18n.localize(skill.label)}".`);
    return null;
  }

  const specializationData = foundry.utils.mergeObject(specialization, defaultSpecialization, { overwrite: false, inplace: false });
  specializationData.specialty = skillKey;
  specializationData.key = specializationKey;

  const editedSkill = await SkillConfig.create({
    actor: this,
    skillData: specializationData,
    title: `Edit ${game.i18n.localize(skill.label)} Skill`,
    type: CONFIG_TYPES.EDIT_SKILL
  });

  if (!editedSkill) return null;

  const isMoved = editedSkill.specialty && editedSkill.specialty !== skillKey;
  const isConvertedToGeneral = !editedSkill.specialty;

  // Specialization -> General
  if (isConvertedToGeneral) {
    const generalData = foundry.utils.mergeObject(defaultGeneralSkill, editedSkill, { insertKeys: false, inplace: false });
    const newKey = generateKey(toCamelCase(generalData.label), Object.keys(this.skills));

    return this.update({
      [`system.skills.${newKey}`]: generalData,
      [`system.skills.${skillKey}.specialities.-=${specializationKey}`]: null,
    });
  }

  // Specialization -> Specialization with differente parent skill
  if(isMoved) {
    const targetSkill = foundry.utils.duplicate(this.skills[editedSkill.specialty]);
    const newSpec = foundry.utils.mergeObject(defaultSpecialization, editedSkill, { insertKeys: false, inplace: false });
    const newKey = generateKey(toCamelCase(newSpec.label), Object.keys(targetSkill.specialities));

    return this.update({
      [`system.skills.${editedSkill.specialty}.specialities.${newKey}`]: newSpec,
      [`system.skills.${skillKey}.specialities.-=${specializationKey}`]: null,
    });

  }

  //Update Specialization in place
  const newSpec = foundry.utils.mergeObject(defaultSpecialization, editedSkill, { insertKeys: false, inplace: false });
  return this.update({
    [`system.skills.${skillKey}.specialities.${specializationKey}`]: newSpec,
  });

}
