import MODULE_CONST from "./constants.mjs";

export function createWeaponRollData(actor, item) {
  const isMelee = item.class === "melee";
  const characteristic = isMelee ? actor.characteristics.weaponSkill : actor.characteristics.ballisticSkill;

  const rateOfFire = {
    burst: isMelee ? characteristic.bonus : item.rateOfFire.burst,
    full: isMelee ? characteristic.bonus : item.rateOfFire.full,
  }

  const weaponTraits = Object.entries({
    accurate: /(?<!in)Accurate/gi,
    razorSharp: /Razor.?-? *Sharp/gi,
    spray: /Spray/gi,
    skipAttackRoll: /Spray/gi,
    tearing: /Tearing/gi,
    storm: /Storm/gi,
    twinLinked: /Twin.?-? *Linked/gi,
    force: /Force/gi,
    inaccurate: /Inaccurate/gi,

    rfFace: /Vengeful.*\(\d\)/gi,
    proven: /Proven.*\(\d\)/gi,
    primitive: /Primitive.*\(\d\)/gi,
  }).reduce((acc, [key, regexp]) => {
    if (["rfFace", "proven", "primitive"].includes(key)) {
      const rfMatch = item.special.match(regexp);
      acc[key] = rfMatch ? parseInt(rfMatch[0].match(/\d+/)[0], 10) : undefined;
    } else {
      acc[key] = regexp.test(item.special);
    }
    return acc;
  }, {});

  const rollData = {
    ownerId: actor.id,
    name: item.name,
    itemName: item.name, // Seperately here because evasion may override it
    ownerId: actor.id,
    itemId: item.id,
    target: {
      base: characteristic.total + item.attack,
      modifier: 0,
      rangeMod: !isMelee ? 10 : 0,
    },
    weapon: {
      damageBonus: 0,
      damageType: item.damageType,
      isMelee: isMelee,
      isRange: !isMelee,
      clip: item.clip,
      rateOfFire: rateOfFire,
      range: !isMelee ? item.range : 0,
      damageFormula : {
        itemDamage: item.damage,
        attribute: isMelee ? "SB" : "",
        forceMod: weaponTraits.force ? "+PR" : ""
      },
      penetrationFormula: item.penetration + (weaponTraits.force ? "+PR" : ""),
      traits: weaponTraits,
      special: item.special
    },
    psy: {
      value: actor.psy.rating,
      display: false
    },
    attackType: {
      name: "standard",
      text: ""
    },
    flags: {
      isAttack: true
    }
  }

  return rollData
}

export async function prepareCombatRoll(rollData, actor) {  
  const { aimModes, attackTypeRanged, attackTypeMelee, ranges } = game.darkHeresy.config;

  if (rollData.weapon.isRanged && rollData.weapon.clip.value <= 0) {
    return await ChatMessage.create({
      user: game.user.id,
      content: await renderTemplate("systems/dark-heresy/template/chat/emptyMag.hbs", rollData),
      flags: {
        "dark-heresy.rollData": rollData
      }
    });
  }
  else {

    const characteristicOptions = [
      {
        value: "",
        label: "",
      },
      ...Object.values(actor.characteristics).map((value) => ({
        value: `${value.short}B`,
        label: value.label,
      })),
    ]

    const data = await Dialog.wait({
      title: rollData.name,
      content: await renderTemplate(`${MODULE_CONST.PATHS.TEMPLATES}/combat-dialog.hbs`, {...rollData, characteristicOptions}),
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("BUTTON.CANCEL"),
          callback: () => { }
        },
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("BUTTON.ROLL"),
          callback: ($html) => {
            const object = new FormDataExtended($html[0].querySelector('form')).object;
            return foundry.utils.expandObject(object);
          }
        }
      },
      default: "roll",
      close: () => null,
      rejectClose: false,
    }, {
      width: 200,
    });

    if (!data) return;

    data.aim = {
      isAiming: data.aim.val !== 0,
      text: game.i18n.localize(aimModes[data.aim.val]),
    };

    if (data.hasOwnProperty("attackType")) {
      const config = rollData.weapon.isRange ? attackTypeRanged : attackTypeMelee;
      data.attackType.text = game.i18n.localize(config[data.attackType.name]);
    }


    if (data.hasOwnProperty("range")) {
      data.rangeModText = game.i18n.localize(ranges[data.range]);
    }

    const {itemDamage, attribute} = data.weapon.damageFormula;
    data.weapon.damageFormula = `${itemDamage}${attribute !== "" ? `+${attribute}` : ""}${rollData.weapon.damageFormula.forceMod}`

    foundry.utils.mergeObject(rollData, data);
 
    rollData.flags.isDamageRoll = false;
    rollData.flags.isCombatRoll = true;

    if (rollData.weapon.traits.skipAttackRoll) {
        rollData.attackType.name = "standard";
    }

    game.darkHeresy.tests.combatRoll(rollData);
  }
}
