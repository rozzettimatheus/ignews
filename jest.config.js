module.exports = {
  testIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: {
    // transpile ts code before executing
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: 'jsdom' // qual ambiente está sendo executado pro jest otimizar para a dom, criar uma representacao da dom no js
} 