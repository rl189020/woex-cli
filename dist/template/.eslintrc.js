module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    plugins: [
        'vue'
    ],
    extends: 'standard',
    rules: {
        'no-debugger': process.env.NODE_ENV === 'production' ? '2' : '0',
        'no-console': process.env.NODE_ENV === 'production' ? '2' : '0',
        'no-dupe-args': '2',
        'no-ex-assign': '2',

    }
}
