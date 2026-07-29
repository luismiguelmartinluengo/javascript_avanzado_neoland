// @ts-check

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^classes\/(.*)': '<rootDir>/js/classes/$1.js',
    '^decorators\/(.*)': '<rootDir>/js/decorators/$1.js',
    '^utils\/(.*)': '<rootDir>/js/utils/$1.js',
    '^store\/(.*)': '<rootDir>/js/store/$1.js',
  }
}

export default config