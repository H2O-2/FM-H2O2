const path = require('path');

const babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true
    }
};

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    babelLoader
                ]
            },
        ],
    },
    watch: true
};
