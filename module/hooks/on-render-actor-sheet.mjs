import { getCoreSkills } from "../utils.mjs";
/**
 * 
 * @param {Application} app - Application instance being rendered
 * @param {JQuery} $html - The inner HTML of the document that will be displayed and may be modified
 * @param {Object} data - The object of data used when rendering the application
 */
export default function onRenderActorSheet(app, [html], data) {
  const condition = app.actor.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
  const skillsDiv = html.querySelector('[data-tab="progression"] .skills');
  if (!skillsDiv || !condition) return;

  const header = skillsDiv?.querySelector(".header");

  createHeaderButton(app, header)
  appendSkillAnchor(app, skillsDiv);
  appendSpecializationAnchor(app, skillsDiv);
}

function appendSkillAnchor(app, skillsDiv){
  const skillsItems = skillsDiv.querySelectorAll(".items .skill.item");
  for(const skillItem of skillsItems) {
    const actionsB = document.createElement("b");
    actionsB.className = "dhe2e-skill-actions";

    const actionAnchor = document.createElement("a");
    actionAnchor.className = "fa-solid fa-ellipsis-vertical";

    actionsB.appendChild(actionAnchor);
    skillItem.appendChild(actionsB);

    const skillKey = skillItem.querySelector("input.total")?.getAttribute("name").match(/^system\.skills\.([^.]+)\./)[1];


    ContextMenu.create(app, skillItem, 'b.dhe2e-skill-actions', [
      {
        name: "Edit Skill",
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        callback: () => {
          app.actor.editSkill({skillKey});
        },
      },
      {
        name: "Delete Skill",
        icon: '<i class="fa-solid fa-trash"></i>',
        callback: () => app.actor.update({
          [`system.skills.-=${skillKey}`]: null,
        }),
        condition: !getCoreSkills().generalSkill.has(skillKey)
      }
    ], {eventName: "click"});
  }

}

function createHeaderButton(app, header) {

  const bElement = document.createElement("b")
  bElement.className = "skill-action";

  const aElement = document.createElement("a");
  aElement.className = "create-skill fa-solid fa-ellipsis-vertical";

  bElement.appendChild(aElement);
  header.appendChild(bElement);

  ContextMenu.create(app, header, 'b.skill-action', [
    {
      name: "Create New Skill",
      icon: '<i class="fa-solid fa-plus"></i>',
      callback: () => { app.actor.createSkill()},
    },
    {
      name: "Create New Speciality",
      icon: '<i class="fa-solid fa-plus"></i>',
      callback: () => { console.log("click")},
    }
  ], {eventName: "click"});
}

function appendSpecializationAnchor(app, skillsDiv) {
  const skillsItems = skillsDiv.querySelectorAll(".items .speciality.item");

  for(const skillItem of skillsItems) {
    const actionsB = document.createElement("b");
    actionsB.className = "dhe2e-skill-actions";

    const actionAnchor = document.createElement("a");
    actionAnchor.className = "fa-solid fa-ellipsis-vertical";

    actionsB.appendChild(actionAnchor);
    skillItem.appendChild(actionsB);

    const match = skillItem.querySelector("input.total")?.getAttribute("name").match(/^system\.skills\.([^\.]+)\.specialities\.([^\.]+)/);
    const skillKey = match[1];
    const specializationKey = match[2];

    ContextMenu.create(app, skillItem, 'b.dhe2e-skill-actions', [
      {
        name: "Edit Skill",
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        callback: () => {
          app.actor.editSkill({skillKey, specializationKey});
        },
      },
      {
        name: "Delete Skill",
        icon: '<i class="fa-solid fa-trash"></i>',
        callback: () => app.actor.update({
          [`system.skills.${skillKey}.-=${specializationKey}`]: null,
        }),
        condition: !getCoreSkills().specialistSkills.get(skillKey)?.specialities[specializationKey],
      }
    ], {eventName: "click"});
  }
}