export const validateNumber = (value) => {
  if (value.length === 0) return false;
  const numericValue = Number(value);

  if (isNaN(numericValue) || numericValue <= 0) {
    console.error("Invalid input: Please provide a valid positive number.");
    return false;
  }

  return true;
};
