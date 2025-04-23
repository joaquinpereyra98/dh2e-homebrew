import { createWeaponRollData, prepareCombatRoll } from "../../scripts.mjs";

export default async function _prepareRollWeapon(event) {
  event.preventDefault();
  const div = $(event.currentTarget).parents(".item");
  const weapon = this.actor.items.get(div.data("itemId"));

  await prepareCombatRoll(createWeaponRollData(this.actor, weapon), this.actor);
}


