const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'source-map',
    mode: 'development',

    entry: [
        'ts/index.ts',
    ],

    output: {
        filename: 'app.js',
        publicPath: 'dist/',
        path: path.resolve(__dirname, 'dist'),
    },

    devServer: {
        port: 3000,
        historyApiFallback: {
            index: 'index.html',
        },
        contentBase: 'dist/',
        inline: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        publicPath: '/'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: ['src', 'node_modules'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {loader: 'babel-loader'},
                    {loader: 'ts-loader', options: {}}
                ],
                include: path.resolve('src')},
            {
                test: /\.styl$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'stylus-loader'}
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loaders: ['file-loader'],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.(woff2|woff)$/, loaders: ['file-loader'],
            },
            {
                test: /\.json$/,
                loaders: ['json-loader']},
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            }
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CopyWebpackPlugin([
                {from: 'src/static'}
            ],
        ),
    ],
};