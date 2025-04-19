import MODULE_CONST from "../../constants.mjs";
import SkillConfig from "../apps/skill-config.mjs";

export default async function editSpecialist(specialistKey) {
  const { CONFIG_TYPES, defaultSkillData } = MODULE_CONST;

  const specialist = this.skills[specialistKey];

  const dataConfig = await SkillConfig.create({
    actor: this,
    skillData: specialist,
    title: `Edit ${game.i18n.localize(specialist.label)} Specialty`,
    type: CONFIG_TYPES.EDIT_SPECIALIST,
  });

  const specialistData = foundry.utils.mergeObject(defaultSkillData, dataConfig, { insertKeys: false, inplace: false });
  return await this.update({[`system.skills.${specialistKey}`]: specialistData});
}