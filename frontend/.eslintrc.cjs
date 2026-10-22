// мой личный eslint
module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-standard',
    '@vue/eslint-config-typescript/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['unused-imports', 'import'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    'vue/no-setup-props-destructure': 'warn',
    'vue/no-dupe-keys': 'warn',
    'vue/no-v-html': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            from: ['./src'],
            message: "You can't use this in a library"
          }
        ]
      }
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx']
      },
      typescript: {
        project: '.'
      }
    }
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
