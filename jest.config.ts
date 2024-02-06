import type { Config } from "@jest/types";

type TestIsolationKeyForFunction = "getValuable";
type TestIsolationKey =
  | TestIsolationKeyForFunction
  | "videoController"
  | "videoRepository"
  | "videoAuthorization";
const testIsolation: Record<
  TestIsolationKey,
  Pick<Config.InitialOptions, "collectCoverageFrom" | "testMatch">
> = {
  videoController: {
    collectCoverageFrom: [
      `<rootDir>/src/modules/video/controller/video.controller.ts`,
    ],
    testMatch: [
      `<rootDir>/src/modules/video/controller/video.controller.test.ts`,
    ],
  },
  videoRepository: {
    collectCoverageFrom: [
      `<rootDir>/src/modules/video/repository/video.repository.ts`,
    ],
    testMatch: [
      `<rootDir>/src/modules/video/repository/video.repository.test.ts`,
    ],
  },
  videoAuthorization: {
    collectCoverageFrom: [`<rootDir>/src/modules/video/**/*.ts`],
    testMatch: [`<rootDir>/src/modules/video/authorization/**/*.test.ts`],
  },
  getValuable: {
    collectCoverageFrom: [`<rootDir>/src/common/functions/getValuable.ts`],
    testMatch: [`<rootDir>/src/common/functions/getValuable.test.ts`],
  },
};

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  ...testIsolation.videoRepository,
};

export default config;
