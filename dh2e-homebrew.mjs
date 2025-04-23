import * as hooks from './module/hooks/_module.mjs';
import * as actor from "./module/actor/_module.mjs";
import * as actorSheet from "./module/actor-sheet/_module.mjs";
import { createWeaponRollData, prepareCombatRoll } from "./module/scripts.mjs";

Hooks.on("init", () => {
  //Wrap new method
  for (const key in actor.methods) CONFIG.Actor.documentClass.prototype[key] = actor.methods[key];

  actorSheet.methods._prepareRollWeapon
  globalThis.dh2eHomebrew = {
    apps: actor.apps,
  };
});

Hooks.on("renderAcolyteSheet", hooks.onRenderActorSheet);

Hooks.on("ready", () => {
  for (const key in actorSheet.methods) CONFIG.Actor.sheetClasses.acolyte["dark-heresy.AcolyteSheet"].cls.prototype[key] = actorSheet.methods[key];
  for (const key in actorSheet.methods) CONFIG.Actor.sheetClasses.npc["dark-heresy.NpcSheet"].cls.prototype[key] = actorSheet.methods[key];

  game.macro.rollWeapon = function rollWeapon(actor, item) {
    const rollData = createWeaponRollData(actor, item);
    prepareCombatRoll(rollData, actor);
  };

  const originalGetter = Object.getOwnPropertyDescriptor(CONFIG.Actor.documentClass.prototype, "attributeBoni").get;
  Object.defineProperty(CONFIG.Actor.documentClass.prototype, "attributeBoni", {
    get: function () {
      const original = originalGetter.call(this);
      return original.sort((a, b) => b.regex.source.length - a.regex.source.length)
    }
  });
})