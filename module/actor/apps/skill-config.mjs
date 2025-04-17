import MODULE_CONST from "../../constants.mjs";

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
      handler: SkillConfig.#formHandler
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

  /* -------------------------------------------- */
  /*  Accessors                                   */
  /* -------------------------------------------- */

  get actor() {
    return this._actor;
  }

  get skillData() {
    return this._skillData;
  }

  get type() {
    return this._type;
  }


  /* -------------------------------------------- */
  /*  Form Handler                                */
  /* -------------------------------------------- */

  static #formHandler(event, form, formData) {
    const submitData = this.prepareSubmitData(formData);
    foundry.utils.mergeObject(this._skillData, submitData);
    this.render()
  }

  prepareSubmitData(formData) {
    const submitData = foundry.utils.expandObject(formData.object);
    if(!Array.isArray(submitData.characteristics)) submitData.characteristics = [submitData.characteristics]
    return submitData;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  _onRender(context, options) {
    super._onRender(context, options);
    const stringTagsElement = this.element.querySelector("string-tags");
    if(stringTagsElement) {
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
  }

  /** @override */
  async _prepareContext(_options = {}) {
    const context = {
      skillData: this.skillData,
    };

    switch (this.type) {
      case "skill":
        context.fields = await this._prepareSkillFields()
        break;

      default:
        break;
    }

    return context;
  }

  async __prepareCommonFields() {
    const labelFormGroup = fields.createFormGroup({
      input: fields.createTextInput({
        name: 'label',
        placeholder: "New Skill Name",
        value: this.skillData.label
      }),
      label: "Skill Name",
    }).outerHTML;

    const characteristicsFormGroup = fields.createFormGroup({
      input: fields.createSelectInput({
        name: 'characteristics',
        options: Object.values(this.actor.characteristics).map((value) => ({
          value: value.short,
          label: value.label,
          selected: value.sort === this.skillData.characteristics[0]
        })),
        localize: true,
      }),
      label: "Characteristics",
    }).outerHTML;

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

    const aptitudesFormGroup = fields.createFormGroup({
      input: elements.HTMLStringTagsElement.create({
        value: this.skillData.aptitudes,
        name: "aptitudes",
      }),
      label: "Aptitudes",
    }).outerHTML;

    return {
      labelFormGroup,
      characteristicsFormGroup,
      advanceFormGroup,
      aptitudesFormGroup,
    }
  }

  async _prepareSkillFields() {
    const specialitiesOptions = [
      {
        value: "",
        label: "",
        selected: !this.skillData.specialty
      },
      ...Object.entries(this.actor.skills)
        .filter(([, v]) => v.isSpecialist)
        .map(([k, v]) => ({
          value: k,
          label: v.label,
          selected: k === this.skillData.specialty
        })),
    ];

    const specialistFormGroup = fields.createFormGroup({
      input: fields.createSelectInput({
        name: 'specialty',
        options: specialitiesOptions,
        localize: true,
      }),
      label: "Speciality",
    }).outerHTML;



    return foundry.utils.mergeObject(
      await this.__prepareCommonFields(),
      {
        specialistFormGroup
      }
    )
  }


  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  static async confirm() {
    const formData = new FormDataExtended(this.element);
    const submitData = this.prepareSubmitData(formData);
    if(!submitData.label) delete submitData.label;
    this._resolvePrepared(submitData);
    await this.close();
  }

  static async cancel() {
    this._resolvePrepared(null);
    await this.close();
  }
}