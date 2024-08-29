import { isLeapYear } from "./app.js";

test.each([
  [1820, true],
  [1960, true],
  [2020, true],
  [1814, false],
])("Year %i is divisible by 4 but not by 100", (year, expected) => {
  expect(isLeapYear(year)).toBe(expected);
});

// teste at error blir kastet
describe("A year is not supported.", () => {
  test.each([[-2020], [-1814]])(
    "isLeapYear throws an Error when input is %i",
    (year) => {
      expect(() => isLeapYear(year)).toThrow(Error);
    }
  );

  let x;
  let y = null;

  test.each([[x], [y]])(
    "isLeapYear throws an Error when input is null or undefined",
    (year) => {
      expect(() => isLeapYear(year)).toThrow(Error);
    }
  );
});
