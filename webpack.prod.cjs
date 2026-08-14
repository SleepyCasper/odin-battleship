const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map", // Better for debugging errors in production
	plugins: [new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"], // Extracts CSS into separate files
			},
		],
	},
});
