export default {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/Test/__mocks__/fileMock.js', // Images
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Styles
    '^@/(.*)$': '<rootDir>/src/$1', // Optional alias
  },
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Small correction here (t|j -> tj)
  },
};


// import { Config } from 'jest';

// const config: Config = {
//   preset: 'ts-jest',
//   collectCoverage: true,
//   collectCoverageFrom: [
//     'src/**/*.{ts,tsx}',
//     '!src/**/*.test.{ts,tsx}',
//   ],
//   coverageThreshold: {
//     global: {
//       statements: 80,
//       branches: 75,
//       functions: 85,
//       lines: 80,
//     },
//   },
//   coverageReporters: ['text', 'html'],
//   testEnvironment: 'jsdom',
// };

// export default config;
