
import webpack from 'webpack';
import yargs from 'yargs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config           from 'config';


export const options = yargs
    .alias('p', 'optimize-minimize')
    .alias('d', 'debug')
    .argv;


let baseConfig = {
    entry: undefined,

    output: undefined,

    externals: undefined,

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel',
                query: {
                    "presets": [
                        "es2015",
                        "react",
                        "stage-0"
                    ],
                    plugins: ["add-module-exports", "transform-decorators-legacy"],
                },
                exclude: /node_modules\/[^(@myfe)]/
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract("css?sourceMap")},
            {test: /\.less$/, loader: ExtractTextPlugin.extract("css?sourceMap!less?sourceMap")},
            {test: /\.json$/, loader: 'json'},
            {test: /\.jpe?g$|\.gif$|\.png|\.ico$/, loader: 'file?name=[name].[ext]'},
            {test: /\.eot$|\.ttf$|\.svg$|\.woff2?$/, loader: 'file?name=[name].[ext]'}
        ]
    },

    plugins: [
        new ExtractTextPlugin("[name]","[name].css",{
            allChunks: true
        })
    ]
};



export default baseConfig;