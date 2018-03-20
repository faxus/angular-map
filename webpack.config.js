const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// use ExtractText in Production env
const extractSass = new ExtractTextPlugin({
	filename: "styles.css",
	disable: process.env.NODE_ENV === "development"
});

// Constant with our paths
const paths = {
	DIST: path.resolve(__dirname, "dist"),
	SRC: path.resolve(__dirname, "src")
};

module.exports = {
	entry: path.join(paths.SRC, "main.ts"),
	output: {
		path: paths.DIST,
		filename: "[name].bundle.js"
	},
	devServer: {
		contentBase: path.SRC
	},
	resolve: {
		extensions: [".js", ".ts", ".html"],
		modules: ["src", "node_modules"]
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.html$/,
				use: "html-loader"
			},
			{
				test: /.ts$/,
				use: [
					{
						loader: "awesome-typescript-loader",
						options: { configFileName: path.join(__dirname, "tsconfig.json") }
					},
					"angular2-template-loader"
				]
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: ["css-loader", "sass-loader"],
					fallback: "style-loader"
				})
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {}
					}
				]
			},
			{
				enforce: "pre",
				test: /\.html/,
				exclude: /node_modules/,
				use: {
					loader: "htmlhint-loader",
					options: {
						configFile: "./.htmlhintrc"
					}
				}
			}
		]
	},
	plugins: [
		new webpack.ContextReplacementPlugin(
			/\@angular(\\|\/)core(\\|\/)esm5/,
			paths.SRC, // location of your src
			{} // a map of your routes
		),
		new HtmlWebPackPlugin({
			template: path.join(paths.SRC, "index.html")
		}),
		extractSass
	]
};