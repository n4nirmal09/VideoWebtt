

// Libraries
const path = require('path');
const config = require('./config');
const packageName = require('../package.json').name;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const SassLintPlugin = require('sass-lint-webpack');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

// Files
const utils = require('./utils')
const plugins = require('../postcss.config');

// Configuration
module.exports = env => {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            url: true,
            importLoaders: 2,
            minimize: true,
            sourceMap: env.NODE_ENV === 'production' ? config.build.sourceMap : config.dev.sourceMap,
            colormin: false
        }
    }



    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: env.NODE_ENV === 'production' ? config.build.sourceMap : config.dev.sourceMap
        }
    }

    const sassLoader = {
        loader: 'sass-loader',
        options: {
            sourceMap: env.NODE_ENV === 'production' ? config.build.sourceMap : config.dev.sourceMap
        }
    }

    const miniCssLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../'
        }
    }

    return {
        context: path.resolve(__dirname, '../src'),
        entry: {
            app: './app.js'
        },
        output: {
            path: config.build.assetsRoot,
            publicPath: env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
            filename: 'js/[name].[hash:7].bundle.js'
        },
        devServer: {
            contentBase: path.resolve(__dirname, '../src'),
        },
        devtool: config.dev.devtool,
        resolve: {
            extensions: ['.js'],
            alias: {
                source: path.resolve(__dirname, '../src'), // Relative path of src
                images: path.resolve(__dirname, '../src/images'), // Relative path of images
                fonts: path.resolve(__dirname, '../src/fonts'), // Relative path of fonts
                public: path.resolve(__dirname, '../public'), // Relative path for public
                svgSpritePath: path.resolve(__dirname, '../src/svg-sprites'), // Relative path for public
            }
        },

        /*
          Loaders with configurations
        */
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-object-assign']
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    use: [
                        env === 'development' ? 'style-loader' : miniCssLoader,
                        cssLoader,
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        env === 'development' ? 'style-loader' : miniCssLoader, // creates style nodes from JS strings
                        cssLoader, // translates CSS into CommonJS
                        postCssLoader,
                        sassLoader, // compiles Sass to CSS
                    ],
                },
                {
                    test: /\.pug$/,
                    use: [{
                        loader: 'pug-loader',
                        options: { pretty: true }
                    }]
                },
                {
                    test: /\.(png|jpe?g|gif|ico|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 3000,
                        name: 'images/[name].[hash:7].[ext]'
                    }
                },
                // {
                //     test: /\.svg$/,
                //     use: [{
                //             loader: 'svg-sprite-loader',
                //             options: {
                //                 //extract: true,
                //                 spriteFilename: 'images/icons.svg'
                //             }
                //         },
                //         'svgo-loader'
                //     ]
                // },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(mp4)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'videos/[name].[hash:7].[ext]'
                    }
                }
            ]
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // vendor chunk
                    vendor: {
                        filename: 'js/vendor.[hash:7].bundle.js',
                        // sync + async chunks
                        chunks: 'all',
                        // import file path containing node_modules
                        test: /node_modules/
                    }
                }
            }
        },

        plugins: [
            new CopyWebpackPlugin([{
                from: '../public',
                to: ''
            }]),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[hash:7].bundle.css',
                chunkFilename: '[id].css',
            }),

            /*
              Pages
            */

            // // Desktop page
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'views/index.pug',
                inject: true
            }),
            ...utils.pages(env),
            // new SpriteLoaderPlugin({
            //     plainSprite: true
            // }),
            new SassLintPlugin(),
            // new webpack.ProvidePlugin({
            //     $: 'jquery',
            //     jQuery: 'jquery',
            //     'window.$': 'jquery',
            //     'window.jQuery': 'jquery'
            // }),
            new WebpackNotifierPlugin({
                title: 'Your project'
            })
        ]
    }
};