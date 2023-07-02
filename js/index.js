import {
  DEFAULT,
  convertEfficiency,
  convertFlowRate,
  convertPower,
  convertPressure,
} from "./units.js";
import { validateNumber } from "./utils.js";

const computePumpPower = (flowRate, pressure, pumpEfficiency, unit) => {
  // Parameter validation
  if (
    typeof flowRate !== "number" ||
    typeof pressure !== "number" ||
    typeof pumpEfficiency !== "number"
  ) {
    console.error("Invalid input: All parameters must be numbers.");
    return undefined;
  }

  // Calculation
  const pumpPowerHP = (flowRate * pressure * 10) / 4500 / pumpEfficiency;
  return convertPower(unit, pumpPowerHP);
};

const computeMotorPower = (
  flowRate,
  pressure,
  pumpEfficiency,
  motorEfficiency,
  unit
) => {
  // Parameter validation
  if (
    typeof flowRate !== "number" ||
    typeof pressure !== "number" ||
    typeof pumpEfficiency !== "number" ||
    typeof motorEfficiency !== "number"
  ) {
    console.error("Invalid input: All parameters must be numbers.");
    return undefined;
  }

  // Calculation
  const pumpPower = computePumpPower(flowRate, pressure, pumpEfficiency, unit);
  if (pumpPower === undefined) {
    return undefined;
  }

  const motorPower = pumpPower / motorEfficiency;
  return convertPower(unit, motorPower);
};

function validateInputs(inputs) {
  let flag = false;
  const inputGroups = document.querySelectorAll(".input-group");
  inputs.forEach((input, idx) => {
    switch (input.name) {
      case "flowRate":
      case "pressure":
        if (!validateNumber(input.value)) {
          flag = true;
          inputGroups[idx].setAttribute("error", "true");
        } else {
          inputGroups[idx].setAttribute("error", "false");
        }
        break;
      case "efficiency":
        if (!validateNumber(input.value) || Number(input.value) > 100) {
          flag = true;
          inputGroups[idx].setAttribute("error", "true");
        } else {
          inputGroups[idx].setAttribute("error", "false");
        }
        break;
    }
  });
  return flag;
}

const updateChanges = () => {
  const valueInputs = document.querySelectorAll("input:not([disabled])");
  const unitInputs = document.querySelectorAll("select");

  const values = Array.from(valueInputs).reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]: Number(curr.value),
    }),
    {}
  );

  const units = Array.from(unitInputs).reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]: curr.value,
    }),
    {}
  );
  const pumpPowerInput = document.getElementById("pumpPower");
  const motorPowerInput = document.getElementById("motorPower");

  if (validateInputs(valueInputs)) {
    pumpPowerInput.value = "-";
    motorPowerInput.value = "-";
    return;
  }

  pumpPowerInput.value = computePumpPower(
    convertFlowRate(units["flowRate"], values["flowRate"]),
    convertPressure(units["pressure"], values["pressure"]),
    convertEfficiency(values["efficiency"]),
    units["pumpPower"]
  );

  motorPowerInput.value = computeMotorPower(
    convertFlowRate(units["flowRate"], values["flowRate"]),
    convertPressure(units["pressure"], values["pressure"]),
    convertEfficiency(values["efficiency"]),
    convertEfficiency(values["efficiency"]),
    units["motorPower"]
  );
};

const unitInputs = document.querySelectorAll("select");
for (const unitInput of unitInputs) {
  unitInput.value = DEFAULT[unitInput.name].unit;
  unitInput.addEventListener("change", updateChanges);
}

const userInputs = document.querySelectorAll("input:not([disabled])");
for (const userInput of userInputs) {
  userInput.value = DEFAULT[userInput.name].value;
  userInput.addEventListener("keyup", updateChanges);
  userInput.addEventListener("wheel", updateChanges);
}

updateChanges();
