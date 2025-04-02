const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        site: "./src/site.js",
        homeScreen: "./src/home-screen/js/HomeScreen.js",
        pacman: "./src/pacman/js/Game.js",
        spaceInvader: "./src/space-invader/js/Game.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/home-screen/html/home-screen.html",
            chunks: ["site", "homeScreen"],
        }),
        new HtmlWebpackPlugin({
            filename: "pacman.html",
            template: "./src/pacman/html/pacman.html",
            chunks: ["site", "pacman"],
        }),
        new HtmlWebpackPlugin({
            filename: "space-invader.html",
            template: "./src/space-invader/html/space-invader.html",
            chunks: ["site", "spaceInvader"],
        }),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: "assets", to: "assets" }],
        }),
    ],
    module: {
        rules: [
            { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"] },
            { test: /\.html?$/i, use: ["html-loader"] },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
                generator: { filename: "assets/images/[name][ext]" },
            },
            {
                test: /\.(mp3|wav|ogg)$/i,
                type: "asset/resource",
                generator: { filename: "assets/sounds/[name][ext]" },
            },
        ],
    },
    devServer: {
        static: { directory: path.join(__dirname, "dist") },
        compress: true,
        port: 8080,
        open: true,
        historyApiFallback: true,
        hot: false, // Disable Hot Module Replacement
        liveReload: false, // Disable automatic refresh on file changes
    },
    devtool: "source-map",
    mode: "development",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};