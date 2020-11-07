module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  setupFilesAfterEnv: ["jest-expect-message"],
  verbose: false
};