import processQuery from "./processQuery";

describe("processQuery", () => {
  it("", async () => {
    const query = {
      isGood: "true",
      isBad: "false",
    };
    const expected = {
      isGood: true,
      isBad: false,
    };

    const actual = processQuery(query);
    expect(expected).toEqual(actual);
  });

  it("", async () => {
    const query = {
      isGood: "TruE",
      isBad: "faLse",
    };
    const expected = {
      isGood: true,
      isBad: false,
    };

    const actual = processQuery<{ isGood: string; isBad?: string }>(query);
    expect(expected).toEqual(actual);
  });
});
