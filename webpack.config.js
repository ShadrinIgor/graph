'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require( 'webpack' );

module.exports = {
    entry: './source/app.js',
    output : {
        filename: "public/build.js"
    },

    watch: true,
/*    watcherOptions: {
        aggregateTimeout: 50
    },*/

    devtool: "source-map",

    module : {
        loaders : [{
            test: /\.js$/,
            exclude : /node_modules/,
            loader: 'babel-loader', // ?optional[]=runtime
            query: {
                presets : ['es2015']
                //optional: ['runtime']
            }
        }]
    }
};