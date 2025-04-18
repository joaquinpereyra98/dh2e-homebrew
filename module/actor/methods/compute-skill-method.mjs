export default function _computeSkills() {
  for (const skill of Object.values(this.skills)) {
    const baseChar = this._findCharacteristic(skill.characteristics[0]);
    skill.total = baseChar.total + skill.advance;
    skill.advanceSkill = this._getAdvanceSkill(skill.advance);

    if (!skill.isSpecialist) continue;

    for (const speciality of Object.values(skill.specialities)) {
      const specChar = speciality.characteristics?.[0]
        ? this._findCharacteristic(speciality.characteristics[0])
        : baseChar;

      speciality.total = specChar.total + speciality.advance;
      speciality.isKnown = speciality.advance >= 0;
      speciality.advanceSpec = this._getAdvanceSkill(speciality.advance);
    }
  }
}
