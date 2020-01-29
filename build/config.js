'use strict'
const path = require('path')

module.exports = {
	dev: {
		assetsSubDirectory: '',
		assetsPublicPath: '/',
		cssSourceMap: true,
		/**
	     * Source Maps
	     */
	    devtool: 'cheap-module-eval-source-map',
	},

	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
	    assetsSubDirectory: '',
	    assetsPublicPath: './',
	    cssSourceMap: false
	}
}