import path, { resolve, join } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("args:", process.argv);
const args = process.argv;
args.map((arg) => {
    if (arg.includes("WEBSITE")) {
        process.env.WEBSITE = arg.split("=")[1];
    }
    if (arg.includes("NODE_ENV")) {
        process.env.NODE_ENV = arg.split("=")[1];
    }
});

const webpack = {
    entry: {
        // cdn: [
        //     "src/imgn_modules/react/umd/react.production.min.js",
        //     "src/imgn_modules/react-dom/umd/react-dom.production.min.js",
        // ],
        root: join(__dirname, `src/${process.env.WEBSITE}/root.js`),
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
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",

        lodash: {
            commonjs: "lodash",
            commonjs2: "lodash",
            amd: "lodash",
            root: "_", // for usage in browser as a global variable
        },
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: join(
                __dirname,
                `src/${process.env.WEBSITE}/index.${process.env.NODE_ENV}.html`
            ),
            title: "0Print",
        }),
    ],
    devServer: {
        static: {
            directory: join(__dirname, "dist"),
        },
        compress: true, // Enable gzip compression for everything served
        port: 3030, // Port to run the dev server on
        hot: true, // Enable Hot Module Replacement
        open: true, // Automatically open the browser,
        webSocketServer: "ws",
    },
};

console.log("webpack:", JSON.stringify(webpack, null, 2));
export default webpack;
