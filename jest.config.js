module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests/validacio/', '/app-nou/'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/components/**/*.vue', '<rootDir>/src/**/pages/**/*.vue'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
