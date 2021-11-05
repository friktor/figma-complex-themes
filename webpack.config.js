const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = (env, argv) => ({
    devtool: argv.mode === "production" ? false : "inline-source-map",
    mode: argv.mode === "production" ? "production" : "development",

    context: path.resolve(__dirname, "src"),

    entry: {
        ui: "ui.tsx", // The entry point for your UI code
        code: "code.tsx", // The entry point for your plugin code
    },

    module: {
        rules: [
            { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },

            { test: /\.css$/, use: ["style-loader", "css-loader"] },

            { test: /\.s[ac]ss$/i, use: ["style-loader", "css-loader", "sass-loader"] },

            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: "url-loader?limit=100000" },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        plugins: [new TsconfigPathsPlugin()],
        alias: { // required in browser
            path: false,
            fs: false
        }
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        hashFunction: "xxhash64",
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./ui.html",
            filename: "ui.html",
            inlineSource: ".(js)$",
            chunks: ["ui"],
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js|css)$/]),
    ],
})
