import path, { resolve as _resolve, join as _join } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
    entry: "./src/root.js",
    output: {
        filename: "root.js",
        path: _resolve(__dirname, "dist"),
        publicPath: "",
        library: "imgnx",
        libraryTarget: "umd",
        globalObject: "this",
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: _join(__dirname, "src/index.html"),
            title: "0Print",
        }),
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    devServer: {
        static: {
            directory: _join(__dirname, "dist"),
        },
        compress: true, // Enable gzip compression for everything served
        port: 3000, // Port to run the dev server on
        hot: true, // Enable Hot Module Replacement
        open: true, // Automatically open the browser
    },
};
