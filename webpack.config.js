const path = require('path');
var nodeExternals = require('webpack-node-externals');
require("webpack");
const {VueLoaderPlugin} = require('vue-loader');

const config = {
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
}

const serverConfig = {
    target: 'node',
    entry: {
        'server': ['./src/server.js'],
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    externalsPresets: {
        node: true // in order to ignore built-in modules like path, fs, etc.
    },
};

const clientConfig = {
    target: 'web',
    entry: {
        'index': ['./src/index.js'],
        'WaveFunctionCollapseUI': ['./src/WaveFunctionCollapseUI.js'],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    reactivityTransform: true
                }
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

module.exports = [
    Object.assign({}, config, serverConfig),
    Object.assign({}, config, clientConfig)
];
