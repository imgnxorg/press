import path, { resolve, join } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { question } from "readline-sync";
import * as indexJs from "./imgn_modules/config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Loading:", process.env.WEBSITE);

let { WEBSITE, NODE_ENV } = process.env;
try {
    if (!WEBSITE) {
        const config = await indexJs.getConfig();
        if (config.website) {
            WEBSITE = config.website;
        } else {
            WEBSITE = question("WEBSITE: (**.*.com) [no http(s)://]");

            if (WEBSITE.includes("http")) {
                WEBSITE = WEBSITE.split("://")[1];
            }
        }

        if (!WEBSITE) {
            throw new Error("WEBSITE is required.");
        } else {
            await indexJs.setConfig({ website: WEBSITE });
        }
    }
    if (!NODE_ENV) {
        NODE_ENV = question("NODE_ENV: (prod/dev)");
        if (NODE_ENV === "prod") NODE_ENV = "production";
        if (NODE_ENV === "dev") NODE_ENV = "development";
        if (!NODE_ENV) NODE_ENV = "development";
    }
} catch (error) {
    throw error;
}

const webpack = {
    entry: {
        /**
         * eg.
         * cdn: join(__dirname, "src/cdn/react.js"),
         */
        root: join(__dirname, `src/websites/${process.env.WEBSITE}/root.tsx`),
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
        // react: "React",
        // "react-dom": "ReactDOM",
        // bootstrap: "bootstrap",
        // tailwindcss: "tailwindcss",
        // lodash: {
        //     commonjs: "lodash",
        //     commonjs2: "lodash",
        //     amd: "lodash",
        //     root: "_", // for usage in browser as a global variable
        // },
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: join(
                __dirname,
                `src/websites/${process.env.WEBSITE}/index.${process.env.NODE_ENV}.html`
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

// console.log("webpack:", JSON.stringify(webpack, null, 2));
export default webpack;
