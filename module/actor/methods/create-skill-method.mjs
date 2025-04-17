import MODULE_CONST from '../../constants.mjs';
import SkillConfig from '../apps/skill-config.mjs';
import { toCamelCase, generateKey } from "../../utils.mjs";

/**
 * @typedef {import('../../constants.mjs').SkillData} SkillData
 */


export default async function createSkill() {
  const { defaultSkillData, defaultHomebrewSkill, defaultSpecility } = MODULE_CONST;


  const skillConfig = new SkillConfig({
    actor: this,
    skillData: defaultHomebrewSkill,
    title: "Create New Skill",
    type: "skill",
  });
  await skillConfig.render({ force: true })
  const dataConfig = await skillConfig.dataPrepared;

  if(dataConfig === null)return;

  if (dataConfig.specialty) {
    const [skillKey, skillValue] = foundry.utils.duplicate(Object.entries(this.skills).find(([k, v]) => v.isSpecialist && k === dataConfig.specialty));
    const specilityData = foundry.utils.mergeObject(defaultSpecility, dataConfig, { insertKeys: false });

    const specilityKey = generateKey(toCamelCase(specilityData.label), Object.keys(skillValue.specialities));
    
    skillValue.specialities[specilityKey] = specilityData;
    
    return await this.update({
      [`system.skills.${skillKey}`]: skillValue,
    })

  } else {
    const skillData = foundry.utils.mergeObject(defaultSkillData, dataConfig, { insertKeys: false });
    const skillKey = generateKey(toCamelCase(skillData.label), Object.keys(this.skills));

    return await this.update({
      [`system.skills.${skillKey}`]: skillData,
    })
  }
}