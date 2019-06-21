module.exports = {
    extends: [
        'plugin:vue/recommended'
    ],
    parserOptions: {
        'parser': 'babel-eslint'
    },
    // add your custom rules here
    rules: {
        'vue/no-v-html': 0,
        'vue/require-default-prop': 0,
        "vue/max-attributes-per-line": ["error", {
            "singleline": 10,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        "vue/html-indent": ["error", 4, {
            "attribute": false,
            "baseIndent": 1,
            "closeBracket": 1,
            "alignAttributesVertically": false,
            "ignores": []
        }],
        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "never"
        }],
        // Ensure no space after keywords like if.
        'keyword-spacing': ["error", {
            "overrides": {
                "if": { "after": false },
                "for": { "after": false },
                "while": { "after": false }
            }
        }],
        // Use alternative brace style
        'brace-style': ['error', 'stroustrup'],
        // No spaces before parens
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
};
