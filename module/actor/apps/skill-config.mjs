import MODULE_CONST from "../../constants.mjs";
import { getCoreSkills } from "../../utils.mjs";

/**
 * @typedef {import('../../constants.mjs').SkillData} SkillData
 * @typedef {import('../../constants.mjs').GeneralSkill} GeneralSkill
 * @typedef {import('../../constants.mjs').SpecialistSkill} SpecialistSkill
 */

const { fields, elements, api } = foundry.applications;

export default class SkillConfig extends api.HandlebarsApplicationMixin(api.ApplicationV2) {
  constructor(options) {
    foundry.utils.setProperty(options, "window.title", options.title ?? "");
    super(options);
    this._actor = options.actor;
    this._skillData = options.skillData;
    this._type = options.type;

    let resolver;

    this.dataPrepared = new Promise(resolve => {
      resolver = resolve;
    });
    this._resolvePrepared = resolver;
  }
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    tag: 'form',
    classes: [MODULE_CONST.MODULE_ID, "skill-config "],
    form: {
      closeOnSubmit: false,
      submitOnChange: true,
      handler: SkillConfig._formHandler
    },
    position: {
      width: 400,
      height: "auto"
    },
    window: {
      frame: true,
      minimizable: false,
      icon: "fa-solid fa-flask-gear"
    },
    actions: {
      confirm: SkillConfig.confirm,
      cancel: SkillConfig.cancel,
    },
  }

  /** @override */
  static PARTS = {
    form: {
      template: `${MODULE_CONST.PATHS.TEMPLATES}/skill-config/form.hbs`,
    }
  }

  /**
   * 
   * @param {Object} options 
   * @returns {Promise <GeneralSkill|SpecialistSkill>}
   */
  static async create(options) {
    const app = new SkillConfig(options);
    await app.render({ force: true });
    return await app.dataPrepared;
  }

  /* -------------------------------------------- */
  /*  Accessors                                   */
  /* -------------------------------------------- */

  /**
   * @type {foundry.documents.BaseActor}
   * @private
   */
  _actor;

  get actor() {
    return this._actor;
  }

  /**
   * @type {SkillData}
   * @private
   */
  _skillData;

  get skillData() {
    return this._skillData;
  }

  /**
  * @type {String}
  * @private
  */
  _type;

  get type() {
    return this._type;
  }

  get isSpecialty() {
    return !!this.skillData.specialty
  }

  get isSpecialist() {
    return this.type === MODULE_CONST.CONFIG_TYPES.SPECIALIST;
  }

  get isSkill() {
    return this.type === MODULE_CONST.CONFIG_TYPES.SKILL;
  }

  get isCoreSkill() {
    if (!this.skillData.key) return false;
    if (this.isSpecialty) {
      return !!getCoreSkills().specialistSkills.get(this.skillData.specialty)?.specialities[this.skillData.key];
    } else {
      return !!getCoreSkills().generalSkill.has(this.skillData.key);
    }
  }
  /* -------------------------------------------- */
  /*  Form Handler                                */
  /* -------------------------------------------- */

  static _formHandler(_, __, formData) {
    const submitData = this.prepareSubmitData(formData);
    foundry.utils.mergeObject(this._skillData, submitData);
  }

  prepareSubmitData(formData) {
    const submitData = foundry.utils.expandObject(formData.object);
    if (!Array.isArray(submitData.characteristics)) submitData.characteristics = [submitData.characteristics];
    return submitData;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  _onRender(context, options) {
    super._onRender(context, options);
    const stringTagsElement = this.element.querySelector("string-tags");
    if (stringTagsElement) {
      const addTagButton = stringTagsElement.querySelector(".icon.fa-solid.fa-tag");
      if (addTagButton) {
        addTagButton.classList.replace("fa-tag", "fa-plus");
        addTagButton.setAttribute("data-tooltip", "Add Aptitude");
        addTagButton.setAttribute("aria-label", "Add Aptitude");
      }

      const removeAnchors = stringTagsElement.querySelectorAll(".tags .tag a");
      removeAnchors.forEach(anchor => {
        anchor.setAttribute("data-tooltip", "Remove Aptitude");
        anchor.setAttribute("aria-label", "Remove Aptitude");
      });
    }
    const specialityElement = this.element.querySelector('select[name="specialty"]');
    specialityElement?.addEventListener("change", (event) => {
      const value = event.target.value;
      const tags = this.element.querySelector("string-tags");
      if(tags) {
        tags.disabled = !!value;
        if(!!value) tags?.setAttribute("data-tooltip", "Specialties cannot have their own aptitudes");
        else tags.removeAttribute("data-tooltip");
      }
    });    
  }

  /** @override */
  async _prepareContext(_options = {}) {
    const context = {
      skillData: this.skillData,
    };

    switch (this.type) {
      case MODULE_CONST.CONFIG_TYPES.SKILL:
        context.fields = this._prepareSkillFields();
        context.buttonLabel = "Create Skill";
        break;
      case MODULE_CONST.CONFIG_TYPES.SPECIALIST:
        context.fields = this._prepareCommonFields();
        context.buttonLabel = "Create Specialist";
        break;
      case MODULE_CONST.CONFIG_TYPES.EDIT_SKILL:
        context.fields = this._prepareSkillFields();
        context.buttonLabel = "Update Skill";
        break;

      case MODULE_CONST.CONFIG_TYPES.EDIT_SPECIALIST:
        context.fields = this._prepareCommonFields();
        context.buttonLabel = "Update Specialist";
        break;
    }

    return context;
  }

  _prepareCommonFields() {
    const labelFormGroup = fields.createFormGroup({
      input: fields.createTextInput({
        name: 'label',
        placeholder: `New ${this.isSkill ? "Skill" : "Specialist"} Name`,
        value: game.i18n.localize(this.skillData.label),
      }),
      label: `${this.isSkill ? "Skill" : "Specialist"} Name`,
    }).outerHTML;

    const characteristicsFormGroup = fields.createFormGroup({
      input: fields.createSelectInput({
        name: 'characteristics',
        options: [
          {
            value: this.isSpecialty ? "" : undefined,
            label: this.isSpecialty ? "Parent Characteristics" : "",
            selected: !!this.skillData.characteristics[0]
          },
          ...Object.values(this.actor.characteristics).map((value) => ({
            value: value.short,
            label: value.label,
            selected: value.short === this.skillData.characteristics[0]
          })),
        ],
        localize: true,
      }),
      label: "Characteristics",
    }).outerHTML;

    const aptitudesFormGroup = fields.createFormGroup({
      input: elements.HTMLStringTagsElement.create({
        value: this.skillData.aptitudes,
        name: "aptitudes",
        disabled: this.isSpecialty,
        dataset: this.isSpecialty ? {
          tooltip: "Specialties cannot have their own aptitudes"
        } : {},
      }),
      label: "Aptitudes",
    }).outerHTML;

    return {
      labelFormGroup,
      characteristicsFormGroup,
      aptitudesFormGroup,
    }
  }

  _prepareSkillFields() {
    const isCoreSkill = this.isCoreSkill;

    const advanceFormGroup = fields.createFormGroup({
      input: fields.createSelectInput({
        name: 'advance',
        options: Object.entries(game.darkHeresy.config.advanceStagesSkills)
          .map(([value, label]) => ({
            value: Number(value),
            label,
            selected: Number(value) === this.skillData.advance
          }))
          .sort((a, b) => a.value - b.value),
        dataset: {
          dtype: "Number"
        },
        localize: true
      }),
      label: "Advance",
    }).outerHTML;

    const specialitiesOptions = [
      {
        value: "",
        label: "",
        selected: "" === this.skillData.specialty
      },
      ...Object.entries(this.actor.skills)
        .filter(([, v]) => v.isSpecialist)
        .map(([k, v]) => ({
          value: k,
          label: v.label,
          selected: k === this.skillData.specialty,
        })),
    ];

    const specialistFormGroup = fields.createFormGroup({
      input: fields.createSelectInput({
        name: 'specialty',
        options: specialitiesOptions,
        localize: true,
        disabled: isCoreSkill
      }),
      label: "Speciality",
    });

    if(isCoreSkill) specialistFormGroup.setAttribute("data-tooltip", "Editing specialities is not allowed on Core Skills.");

    return foundry.utils.mergeObject(
      this._prepareCommonFields({ type: "skill" }),
      {
        advanceFormGroup,
        specialistFormGroup: specialistFormGroup.outerHTML,
      }
    )
  }


  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  static async confirm() {
    const formData = new FormDataExtended(this.element);
    const submitData = foundry.utils.mergeObject(this.skillData, this.prepareSubmitData(formData), { inplace: false });;
    if (!submitData.label) delete submitData.label;
    this._resolvePrepared(submitData);
    await this.close();
  }

  static async cancel() {
    this._resolvePrepared(null);
    await this.close();
  }
}