import * as hooks from './module/hooks/_module.mjs';
import * as actor from "./module/actor/_module.mjs";

Hooks.on("init", () =>{
  CONFIG.Actor.documentClass.prototype.createSkill = actor.methods.createSkill;
  globalThis.dh2eHomebrew = {
    apps: actor.apps,
  };
});
Hooks.on("renderAcolyteSheet", hooks.onRenderActorSheet);