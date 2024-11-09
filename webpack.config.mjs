import path, { resolve, join } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: {
        cdn: [
            "./modules/react/umd/react.production.min.js",
            "./modules/react-dom/umd/react-dom.production.min.js",
        ],
        root: "./src/root.js",
    },
    output: {
        filename: "[name].js",
        path: resolve(__dirname, "dist"),
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
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: join(__dirname, "src/index.html"),
            title: "0Print",
        }),
    ],
    devServer: {
        static: {
            directory: join(__dirname, "dist"),
        },
        compress: true, // Enable gzip compression for everything served
        port: 3000, // Port to run the dev server on
        hot: true, // Enable Hot Module Replacement
        open: true, // Automatically open the browser
    },
};
