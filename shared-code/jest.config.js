/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest-setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/**/*.ts"
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "ctp",
    "lib/import",
    "lib/export",
    "lib/index.ts",
    "lib/runner.ts",
  ],
  coverageDirectory: "<rootDir>/coverage/"
};
