/**
 * 
 * @param {Application} app - Application instance being rendered
 * @param {JQuery} $html - The inner HTML of the document that will be displayed and may be modified
 * @param {Object} data - The object of data used when rendering the application
 */
export default function onRenderActorSheet(app, [html], data) {
  const skillsDiv = html.querySelector('[data-tab="progression"] .skills');
  const header = skillsDiv?.querySelector(".header");

  if (!header) return;
  const bElement = document.createElement("b")
  bElement.className = "skill-action";

  const createSkillAnchor = document.createElement("a");
  createSkillAnchor.className = "create-skill-anchor fa-solid fa-plus";

  bElement.appendChild(createSkillAnchor);
  header.appendChild(bElement);

  const skillsItems = skillsDiv?.querySelectorAll(".items .skill.item");
  for(const skillItem of skillsItems) {
    const contextMenuAnchor = document.createElement("a");
    contextMenuAnchor.className = "dhe2e-homebrew skill-context-menu fa-solid fa-ellipsis-vertical";
  
    skillItem.appendChild(contextMenuAnchor);
  }

}