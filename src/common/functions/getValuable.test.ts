import getValuable from "./getValuable";

type SomeType = {
  name: string | null;
};

const someObject: SomeType = {
  name: "Fadli",
};

const someOtherObject: SomeType = {
  name: null,
};
describe("getValuable Test Suite", () => {
  it("shouldn't modify: no field with value null", () => {
    const actual = getValuable(someObject);
    const expected = {
      name: "Fadli",
    };

    expect(actual).toEqual(expected);
  });

  it("should change fields with value null to be undefined", () => {
    const actual = getValuable(someOtherObject);
    const expected = {
      name: undefined,
    };

    expect(actual).toEqual(expected);
  });

  it("shouldn't modify: no field with value null for array", () => {
    const actual = getValuable([someObject, someObject]);
    const expected = [
      {
        name: "Fadli",
      },
      {
        name: "Fadli",
      },
    ];

    expect(actual).toEqual(expected);
  });

  it("should change fields with value null to be undefined for array", () => {
    const actual = getValuable([someOtherObject, someOtherObject]);
    const expected = [
      {
        name: undefined,
      },
      {
        name: undefined,
      },
    ];

    expect(actual).toEqual(expected);
  });
});
