module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['backend', 'frontend', 'db', 'auth', 'api', 'map', 'analytics', 'ci', 'deps', 'repo'],
    ],
  },
};
