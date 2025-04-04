import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pages = [
    { name: "index", scripts: ["./src/index.js", "./src/js/index/loadIndexPage.js"] },
    { name: "projectPage", scripts: ["./src/index.js", "./src/js/project/loadProjectPage.js"], template: "./src/html/project/projectPage.html" },
    { name: "gamePage", scripts: ["./src/index.js", "./src/js/game/main.js"], template: "./src/html/game/gamePage.html" }
];

const config = {
    devtool: "source-map",
    mode: "development",
    entry: pages.reduce((acc, page) => {
        acc[page.name] = page.scripts;
        return acc;
    }, {}),
    plugins: [
        ...pages.map(page => new HtmlWebpackPlugin({
            filename: page.name === "index" ? "index.html" : `${page.name}`,  // Ensure "index.html" exists
            template: page.template || `./src/html/${page.name}.html`,
            chunks: [page.name]
        })),
        new MiniCssExtractPlugin()
    ],
    resolve: {
        extensions: [".ts", ".js"],
        extensionAlias: { '.js': ['.js', '.ts'] }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.html?$/i,
                use: ['html-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: "asset"
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset"
            }
        ]
    },
    output: {
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8080,
        proxy: [
            {
                context: ['/assets'],
                target: 'http://localhost:8081',
                secure: false,
                changeOrigin: true,
            }
        ],
        historyApiFallback: true,
    }
};

export default config;