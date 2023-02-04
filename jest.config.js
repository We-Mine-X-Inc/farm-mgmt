const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { isVariableStatement } = require('typescript');
const { compilerOptions } = require('./tsconfig.json');

/**
 * Automatically configured enviornment variables can be found here:
 * https://jestjs.io/docs/environment-variables
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
};
