module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2021,
        sourceType: 'module',
        extraFileExtensions: ['.cjs'],
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: ['plugin:@typescript-eslint/recommended', 'airbnb-typescript/base'],
    ignorePatterns: ['dist/', 'node_modules/', 'src/migrations/', 'src/**/*.js'],
    rules: {
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
        // 'class-methods-use-this': 'off',
        '@typescript-eslint/comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
            },
        ],
        // 'default-case': 'off',
        eqeqeq: 'off',
        // '@typescript-eslint/explicit-module-boundary-types': ['warn', { allowArgumentsExplicitlyTypedAsAny: true }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // 'func-names': 'off',
        'global-require': 'off',
        'implicit-arrow-linebreak': 'off', // for prettier to handle
        'import/extensions': 'off',
        'import/no-dynamic-require': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/indent': ['error', 4],
        // 'jsx-a11y/href-no-hash': 'off',
        // 'linebreak-style': 'off',
        'max-len': ['error', { code: 186, tabWidth: 4, ignoreComments: true }],
        'no-async-promise-executor': 'off',
        'no-await-in-loop': 'off',
        // 'no-bitwise': 'off',
        'no-cond-assign': 'off',
        'no-console': 'off',
        'no-continue': 'off',
        'no-control-regex': 'off',
        'no-eval': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-extend-native': 'off',
        // 'no-irregular-whitespace': 'off',
        // 'no-lonely-if': 'off',
        'no-mixed-operators': 'off',
        // 'no-multi-spaces': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'no-new': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-prototype-builtins': 'off',
        'no-restricted-syntax': 'off',
        'no-underscore-dangle': 'off',
        'no-useless-escape': 'off',
        // '@typescript-eslint/no-unused-vars': [
        //     'warn',
        //     { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
        // ],
        '@typescript-eslint/no-unused-vars': 'off',
        'object-curly-newline': ['warn', { minProperties: 5, multiline: true, consistent: true }],
        'prefer-destructuring': ['error', { array: false, object: true }],
        // 'quote-props': 'off',
    },
};
