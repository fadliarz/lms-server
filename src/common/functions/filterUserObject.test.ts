import filterUserObject from "./filterUserObject";
import { UserModel } from "../../modules/user/user.type";

describe("filterUserObject Test Suites", () => {
  it("tc 1", () => {
    const user = {
      id: 1,
      password: "somePassword",
      accessToken: "someToken",
      refreshToken: ["someToken"],
    } as UserModel;

    const expected = {
      id: 1,
    };
    const actual = filterUserObject(user);

    expect(expected).toEqual(actual);
  });
});
