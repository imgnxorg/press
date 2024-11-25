import {
    mkdirSync as fsMkdirSync,
    existsSync as fsExistsSync,
    copyFileSync,
} from "fs";
import path, { resolve } from "path";
import child_process from "child_process";
import chalk from "chalk";
import rl from "readline-sync";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { getConfig, setConfig } from "./imgn_modules/config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(child_process.exec);

const { question, close } = rl;

// Get flags and options from the command line.
let flags = process.argv.slice(2);
console.log(chalk.yellowBright(`${flags.length} Flags:`), flags);

// 1. Synchronous tasks

// If the src/websites directory does not exist, create it.
if (!fsExistsSync(resolve(__dirname, "src/websites"))) {
    fsMkdirSync(resolve(__dirname, "src/websites"));
}

// 2. Functions and hoistable variables

// Copy the template files to the src/websites/${website} directory, but only if they do not exist.
const cpTemplateFiles = () => {
    const templateFiles = [
        "globals.css",
        "index.development.html",
        "index.production.html",
        "page.tsx",
        "root.tsx",
    ];
    templateFiles.forEach((file) => {
        if (
            !fsExistsSync(resolve(__dirname, `src/websites/${website}/${file}`))
        ) {
            copyFileSync(
                resolve(__dirname, `src/template/${file}`),
                resolve(__dirname, `src/websites/${website}/${file}`)
            );
        }
    });
};

// If the website variable is not set, prompt the user for it.
const promptUserForWebsite = () => {
    return new Promise((resolve) => {
        question("Website: ", (answer) => {
            close();
            resolve(answer);
        });
    });
};

// 3. Asynchronous tasks
try {
    (async () => {
        // Known flags: -s, --serve, -b, --build, -p, --production, -d, --dev-server
        const knownFlags = [
            "--mode",
            "production",
            "development",
            "NODE_ENV",
            "-s",
            "--serve",
            "-b",
            "--build",
            "-p",
            "--production",
            "-d",
            "--dev-server",
        ];
        // Check for the --help flag.
        if (flags.includes("--help")) {
            console.log(
                chalk.green(
                    "Usage: imgnx [options]\n\nOptions:\n  -s, --serve\t\tStart the development server\n  -b, --build\t\tBuild the project\n  -p, --production\tBuild for production\n  -d, --dev-server\tStart the dev server"
                )
            );
            return 0;
        }

        // Check for invalid flags
        if (flags.some((flag) => !knownFlags.includes(flag))) {
            // This is imported in webpack, so you can't use that here.
            console.log(chalk.red("IMGNX Org.: Invalid flag."));
            return 1;
        }

        // 4. Main function
        console.log(chalk.green("Starting IMGNX..."));
        console.log(chalk.green("Flags and options:"), flags);
        console.log(chalk.green("Reading configuration..."));

        // Get the configuration from imgnx.json.
        let { WEBSITE } = process.env,
            config = await getConfig(),
            website = config.website || WEBSITE;

        // 5. Conditional tasks

        // If the WEBSITE environment variable is set, use it as the website.
        if (WEBSITE && !config.website) {
            console.log(`Using website from environment variable: ${WEBSITE}`);
            setConfig({ ...config, website: WEBSITE });
        }

        // If the website variable is not set, prompt the user for it.
        if (!WEBSITE && !config.website) {
            website = await promptUserForWebsite();
            // Write the website to imgnx.json.
            config = { ...config, website };
            // Not immutable, I know, but this is the CLI...
            setConfig(config);
        }

        console.log(chalk.green("Website:"), website);

        // If the src/websites/${website} directory does not exist, create it.
        if (!fsExistsSync(resolve(__dirname, `src/websites/${website}`))) {
            fsMkdirSync(resolve(__dirname, `src/websites/${website}`));

            // Copy the template files to the src/websites/${website} directory.
            cpTemplateFiles();
        }

        console.log("Flags?", !!flags);

        if (!!flags.length) {
            if (flags.includes("serve") || flags.includes("-s")) {
                console.log(chalk.green("Starting Webpack..."));
                await execAsync("npx webpack serve --config webpack.config.js");
            } else if (
                flags.includes("--build") ||
                flags.includes("-b") ||
                flags.includes("build")
            ) {
                console.log(chalk.green("Building..."));
                if (flags.includes("production") || flags.includes("-p")) {
                    console.log(chalk.green("Building for production..."));
                    await execAsync("webpack --mode production");
                } else if (
                    flags.includes("dev-server") ||
                    flags.includes("--dev-server") ||
                    flags.includes("-d")
                ) {
                    question("Start the dev server? (Y/n) ", (answer) => {});
                    console.log(chalk.green("Starting the dev server."));
                    if (
                        answer === "" ||
                        answer.toLowerCase() === "y" ||
                        answer.toLowerCase() !== "n"
                    ) {
                        await execAsync(
                            `WEBSITE=${website} webpack-dev-server --mode production --port 8000`
                        );
                    }
                }
            } else if (flags.includes("production") || flags.includes("-p")) {
                console.log(chalk.green("Building for production..."));
                await execAsync("webpack --mode production");
            } else if (
                flags.includes("dev-server") ||
                flags.includes("--dev-server") ||
                flags.includes("-d")
            ) {
                console.log(chalk.green("Starting the dev server."));

                await execAsync(
                    `WEBSITE=${website} webpack-dev-server --mode production --port 8000`
                )
                    .then(() => {
                        console.log(chalk.green("Dev server started."));
                    })
                    .catch((error) => {
                        console.error("Error starting dev server:", error);
                    });
            } else {
            }
        } else {
            console.log(chalk.green("No flags or options specified."));
            const startDevServer = question("Start the dev server? (Y/n) ");

            if (
                startDevServer === "" ||
                startDevServer.toLowerCase() === "y" ||
                startDevServer.toLowerCase() !== "n"
            ) {
                await execAsync(
                    `WEBSITE=${website} npx webpack-dev-server --mode production --port 8000`
                );

                console.log(chalk.green("Dev server started."));
            }
        }

        return 0;
    })();
} catch (error) {
    console.error("Error in IMGNX module:", error);
    throw error;
}

/**
 * Exports the getConfig and setConfig functions.
 * @module open-src-form-injector
 * @property {Function} getConfig - Retrieves the configuration.
 * @property {Function} setConfig - Sets the configuration.
 */
module.exports = { getConfig, setConfig };

// type getConfig = () => Promise<any>;
// type setConfig = (immutableState: any) => void;
