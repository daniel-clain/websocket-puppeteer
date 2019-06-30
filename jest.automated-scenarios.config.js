module.exports = {  
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true,
  testMatch: ["<rootDir>/source-code/automated-scenarios/*.test.ts"],
  setupFilesAfterEnv: ['<rootDir>/source-code/automated-scenarios/jest-timeout.js']
}