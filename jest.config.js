module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['./src'],
  testMatch: ['./**/*.spec.ts'],
  transform: {
    '^.+.tsx?$': 'ts-jest',
  },
};
