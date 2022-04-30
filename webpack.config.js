var path = require("path");
var webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

var PATHS = {
    entryPoint: path.resolve(__dirname, 'src/index.ts'),
    bundles: path.resolve(__dirname, '_bundles'),
}

var config = {
    mode: 'none',
    entry: {
        'bp2d': [PATHS.entryPoint],
        'bp2d.min': [PATHS.entryPoint]
    },
    output: {
        path: PATHS.bundles,
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'bp2d',
        umdNamedDefine: false
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                terserOptions: {
                    sourceMap: true
                }
            })
        ],
    },
    plugins: [],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {}
        }]
    }
}

module.exports = config;