function standardizeUnits(unitObj, unit, value) {
  if (typeof unitObj != "object") {
    console.error("Given unitObj is not an object", unitObj);
    return undefined;
  }
  if (!unitObj.hasOwnProperty(unit)) {
    console.error("Invalid unit", unit);
    return undefined;
  }
  if (!Number.isFinite(value)) {
    console.error("Invalid Value", value);
    return undefined;
  }

  return unitObj[unit] * value;
}

const FlowRateUnits = {
  LPM: 1,
  GPM: 3.78541,
  LPH: 0.01667,
};

export function convertFlowRate(unit, value) {
  return standardizeUnits(FlowRateUnits, unit, value);
}

const PressureUnits = {
  "Kg/cm2": 1,
  PSI: 0.0703069,
  bar: 1.019716,
  MPa: 10.19716,
};

export function convertPressure(unit, value) {
  return standardizeUnits(PressureUnits, unit, value);
}

export function convertEfficiency(value) {
  if (!Number.isFinite(value)) {
    console.error("Invalid value", value);
    return undefined;
  }
  return value / 100.0;
}

const PowerUnits = {
  HP: 1,
  KW: 0.746,
};

export function convertPower(unit, value) {
  return standardizeUnits(PowerUnits, unit, value);
}

export const DEFAULT = {
  flowRate: { unit: "LPM", value: 10 },
  pressure: { unit: "Kg/cm2", value: 100 },
  efficiency: { value: 80 },
  motorPower: { unit: "HP" },
  pumpPower: { unit: "HP" },
};
