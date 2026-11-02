// Jest configuration for TypeScript backend tests
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
};
