import * as hooks from './module/hooks/_module.mjs';
import * as actor from "./module/actor/_module.mjs";

Hooks.on("init", () =>{
  //Wrap new method
  for (const key in actor.methods) CONFIG.Actor.documentClass.prototype[key] = actor.methods[key];
  
  globalThis.dh2eHomebrew = {
    apps: actor.apps,
  };
});
Hooks.on("renderAcolyteSheet", hooks.onRenderActorSheet);