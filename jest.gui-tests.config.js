module.exports = {  
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true,
  testPathPattern: './source-code/tests/gui-tests/**/*.test.ts'
}