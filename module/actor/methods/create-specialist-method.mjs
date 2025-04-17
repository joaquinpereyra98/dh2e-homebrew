import MODULE_CONST from "../../constants.mjs";
import SkillConfig from "../apps/skill-config.mjs";
import { generateKey, toCamelCase } from "../../utils.mjs";

export default async function createSpecialist() {
  const { defaultSkillData, defaultSpecialistSkill, CONFIG_TYPES } = MODULE_CONST;

  const dataConfig = await SkillConfig.create({
    actor: this,
    skillData: defaultSpecialistSkill,
    title: "Create New Specialty",
    type: CONFIG_TYPES.SPECIALIST,
  });

  const specialistData = foundry.utils.mergeObject(defaultSkillData, dataConfig, { insertKeys: false, inplace: false });
  const specialistKey = generateKey(toCamelCase(specialistData.label), Object.keys(this.skills));
  
  return await this.update({[`system.skills.${specialistKey}`]: specialistData});
}