module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html',
        'jest'
    ],
    env: {
        'browser': true,
        'node': true,
        'jest': true
    },
    // add your custom rules here
    rules: {
        'brace-style': ['error', 'stroustrup'],
        'space-before-function-paren': ['error', 'never'],
        // Indent for tabs because spaces suck
        'indent': ['error', 4],
        // Semi colons always where they need to be
        'semi': [2,'always'],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
