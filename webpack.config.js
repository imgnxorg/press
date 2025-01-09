import path, { resolve, join } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { question } from "readline-sync";
import * as imgnx from "./imgnx_modules/imgnx/index.js";
import { argv, env } from "process";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let { WEBSITE, NODE_ENV } = env;

try {
    if (!WEBSITE) {
        const config = await imgnx.getConfig();
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
            await imgnx.setConfig({ website: WEBSITE });
        }
    }
    console.log("Loading:", WEBSITE);
    if (!NODE_ENV) {
        if (argv.includes("dev") || argv.includes("development")) {
            NODE_ENV = "development";
        } else if (argv.includes("prod") || argv.includes("production")) {
            NODE_ENV = "production";
        } else {
            // Hack: async, but because it prompts the user.
            NODE_ENV = question(`${chalk.green("NODE_ENV")} (prod/DEV):`);

            if (
                NODE_ENV.toLowerCase() === "dev" ||
                NODE_ENV.toLowerCase() === "development"
            ) {
                NODE_ENV = "development";
            } else if (
                NODE_ENV.toLowerCase() === "prod" ||
                NODE_ENV.toLowerCase() === "production"
            ) {
                NODE_ENV = "production";
            } else {
                console.log(chalk.yellow("Default"));
            }
        }
        if (!NODE_ENV) NODE_ENV = "development";
    }
    console.log("Environment:", NODE_ENV);
} catch (error) {
    throw error;
}

const webpack = {
    ignoreWarnings: [
        {
            message: /is-pseudo-class/,
        },
    ],
    entry: {
        /**
<<<<<<< HEAD
         * eg.
         * reactFromCdn: join(__dirname, "src/cdn/react.js"),
=======
         * You can also set externals here...
         * eg.
         * cdn: join(__dirname, "src/cdn/react.js"),
>>>>>>> d53b6d3fe6d7a817a2f4c8a64c3d9aae12772e13
         */
        root: join(__dirname, `src/websites/${WEBSITE}/root.tsx`),
    },
    output: {
        filename: "[name].js",
        path: resolve(__dirname, "dist"),
        publicPath: "",
        library: "imgnx",
        libraryTarget: "umd",
        globalObject: "this",
    },
    mode: NODE_ENV,
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
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
            template: join(__dirname, `public/index.html`),
            title: WEBSITE,
        }),
    ],
    devServer: {
        static: {
            directory: join(__dirname, "public"),
        },
        compress: true, // Enable gzip compression for everything served
        port: 3000, // Port to run the dev server on
        hot: true, // Enable Hot Module Replacement
        open: true, // Automatically open the browser,
        webSocketServer: "ws",
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: "all",
    //         minSize: 20000,
    //         maxSize: 244000,
    //         minChunks: 1,
    //         maxAsyncRequests: 30,
    //         maxInitialRequests: 30,
    //         automaticNameDelimiter: "~",
    //         cacheGroups: {
    //             defaultVendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -10,
    //                 reuseExistingChunk: true,
    //             },
    //             default: {
    //                 minChunks: 2,
    //                 priority: -20,
    //                 reuseExistingChunk: true,
    //             },
    //         },
    //     },
    // },
};

// console.log("webpack:", JSON.stringify(webpack, null, 2));
export default webpack;
