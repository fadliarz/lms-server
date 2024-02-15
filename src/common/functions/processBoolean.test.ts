import processBoolean from "./processBoolean";

describe("processBoolean", () => {
  it("", () => {
    const value = "true";
    const expected = true;

    const actual = processBoolean(value);

    expect(expected).toBe(actual);
  });

  it("", () => {
    const value = "tRuE";
    const expected = true;

    const actual = processBoolean(value);

    expect(expected).toBe(actual);
  });

  it("", () => {
    const value = "false";
    const expected = false;

    const actual = processBoolean(value);

    expect(expected).toBe(actual);
  });

  it("", () => {
    const value = "fAlsE";
    const expected = false;

    const actual = processBoolean(value);

    expect(expected).toBe(actual);
  });

  it("", () => {
    const value = "ranDomStriNg";
    const expected = false;

    const actual = processBoolean(value);

    expect(expected).toBe(actual);
  });

  it("", () => {
    const value = undefined;
    const expected = false;

    const actual = processBoolean(value);

    expect(expected).toBe(actual);
  });
});
