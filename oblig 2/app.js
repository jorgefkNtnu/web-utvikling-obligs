export function isLeapYear(year) {
  if (year === undefined || year === null)
    throw new Error("Invalid argument: year can not be undefined or null.");
  if (year < 0)
    throw new Error(
      "Invalid argument: year must be an integer equal to or larger than 0."
    );
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
