export default function _computeCharacteristics() {
  let middle = Object.values(this.characteristics).length / 2;
  let i = 0;
  for (let characteristic of Object.values(this.characteristics)) {
    characteristic.total = characteristic.base + characteristic.advance;
    characteristic.bonus = Math.floor(characteristic.total / 10) + characteristic.unnatural;
    if (this.fatigue.value > characteristic.bonus) {
      characteristic.total = Math.ceil(characteristic.total / 2);
      characteristic.bonus = Math.floor(characteristic.total / 10) + characteristic.unnatural;
    }
    characteristic.isLeft = i < middle;
    characteristic.isRight = i >= middle;
    characteristic.advanceCharacteristic = this._getAdvanceCharacteristic(characteristic.advance);
    i++;
  }
  this.system.insanityBonus = Math.floor(this.insanity / 10);
  this.system.corruptionBonus = Math.floor(this.corruption / 10);
  this.psy.currentRating = this.psy.rating - this.psy.sustained;
  this.initiative.bonus = this.characteristics[this.initiative.characteristic].bonus;
}