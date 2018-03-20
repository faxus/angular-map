const webpack = require("webpack");
const path = require("path");

// Constant with our paths
const paths = {
	DIST: path.resolve(__dirname, "dist"),
	SRC: path.resolve(__dirname, "src")
};

module.exports = {
	devtool: "inline-source-map",

	resolve: {
		extensions: [".ts", ".js"]
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loaders: [
					{
						loader: "awesome-typescript-loader",
						options: { configFileName: path.join(__dirname, "tsconfig.json") }
					}, "angular2-template-loader"
				]
			},
			{
				test: /\.html$/,
				loader: "html-loader"

			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: "null-loader"
			},
			{
				test: /\.css$/,
				exclude: path.join(paths.SRC, "app"),
				loader: "null-loader"
			},
			{
				test: /\.css$/,
				include: path.join(paths.SRC, "app"),
				loader: "raw-loader"
			}
		]
	},

	plugins: [
		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/\@angular(\\|\/)core(\\|\/)esm5/,
			paths.SRC, // location of your src
			{} // a map of your routes
		)
	]
}