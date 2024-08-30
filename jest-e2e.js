module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^app.module$': '<rootDir>/app.module',
    '^auth/(.*)$': '<rootDir>/auth/$1',
    '^users/(.*)$': '<rootDir>/users/$1',
    '^prisma/(.*)$': '<rootDir>/prisma/$1',
    '^movies/(.*)$': '<rootDir>/movies/$1',
  },
};
