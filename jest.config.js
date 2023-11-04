/** @type {import('jest').Config} */

/* eslint-disable no-undef */
module.exports = {
    roots: ["<rootDir>/src/", "<rootDir>/test/"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|\\.(test|spec))\\.[tj]sx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: ["src/**", "!**/node_modules/**"],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    }
}
