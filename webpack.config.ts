import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';

import ModuleLogger from './plugins/moduleLogger';

const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        root: './src/pages/root.tsx',
        root2: './src/pages/root2.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new ModuleLogger({
            templatePath: path.resolve(__dirname, './src'),
            pathToSave: path.resolve(__dirname, './unused.json'),
            excludes: [path.resolve(__dirname, './src/index.html')],
        }),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer"),
            "stream": false,
        },
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'crypto-browserify': path.resolve(__dirname, 'uuid-new'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                use: 'ts-loader',
                exclude: ['/node_modules/'],
            },
        ],
    },
    optimization: {
        concatenateModules: true,
        splitChunks: {
            minChunks: 2,
            chunks: 'all',
            minSize: 0,
        },
    },
};

export default config;
