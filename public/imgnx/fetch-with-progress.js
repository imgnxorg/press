"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FetchWithProgress;
exports.getContentLength = getContentLength;
function FetchWithProgress(input, init) {
    return __awaiter(this, void 0, void 0, function () {
        var message, percentage, contentLength, response, total, loaded, reader, stream, responseStream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        // Pre-checks for fetch
                        precheck(input, init);
                    }
                    catch (error) {
                        console.error("Pre-check failed:", error ? error.message : error);
                        console.warn("Fetch aborted. If you need this to work without \nthrowing an error, please adjust the catch block at the top of \nthe function.");
                        // Remove this to prevent the function from throwing an error
                        throw error;
                    }
                    finally {
                        console.log("Pre-check complete");
                    }
                    message = "fetching...", percentage = 0;
                    return [4 /*yield*/, getContentLength(input.toString())];
                case 1:
                    contentLength = _a.sent();
                    if (!contentLength) {
                        console.warn("Could not retrieve `Content-Length;`. Progress tracking will \nnot be available. Use `loaded` instead. If you need progress \ntracking, please ensure that the server supports HEAD requests.");
                        percentage = 100;
                        message = "sent";
                    }
                    return [4 /*yield*/, fetch(input, init)];
                case 2:
                    response = _a.sent();
                    total = contentLength;
                    loaded = 0;
                    if (!response.body) {
                        percentage = 100;
                        message = "error";
                        throw new Error("Response body is null");
                    }
                    reader = response.body.getReader();
                    stream = new ReadableStream({
                        start: function (controller) {
                            function read() {
                                reader
                                    .read()
                                    .then(function (_a) {
                                    var done = _a.done, value = _a.value;
                                    if (done) {
                                        controller.close();
                                        message = "done";
                                        percentage = 100;
                                        loaded = total;
                                        return;
                                    }
                                    loaded += value.length;
                                    // Progress calculation when Content-Length is available
                                    var progress = {
                                        percentage: null,
                                        loaded: loaded,
                                        total: total,
                                    };
                                    if (total) {
                                        progress.percentage = (loaded / total) * 100;
                                    }
                                    message = "fetching: ".concat(progress.percentage !== null
                                        ? progress.percentage.toFixed(2) + "%"
                                        : loaded + "/? bytes");
                                    controller.enqueue(value);
                                    read();
                                })
                                    .catch(function (error) {
                                    console.error("Stream error:", error);
                                    controller.error(error);
                                });
                            }
                            read();
                        },
                    });
                    responseStream = new Response(stream);
                    // Return the response stream
                    // Usage: const { message, object, progress } = await FetchWithProgress(url);
                    // And if it's not at 100%, you can use the message to show the progress. To get the next update,
                    // you can call the function again. If the fetch is complete, the message will be "done". If there's an error,
                    // the message will be "error". The object is the Response object. The progress object contains the percentage,
                    // loaded bytes, and total bytes. If the total bytes are not available, the percentage will be null. You can use
                    // the loaded bytes to show the progress in this case. If the total bytes are available, you can use the percentage
                    // to show the progress. If you need to show the loaded bytes, you can use the loaded property. If you need to show
                    // the total bytes, you can use the total property.
                    return [2 /*return*/, {
                            message: message,
                            object: responseStream.clone(),
                            progress: { percentage: percentage, loaded: loaded, total: total },
                        }];
            }
        });
    });
}
// Function to get Content-Length from a HEAD request
function getContentLength(url) {
    return __awaiter(this, void 0, void 0, function () {
        var headResponse, contentLength, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(url, { method: "HEAD" })];
                case 1:
                    headResponse = _a.sent();
                    contentLength = headResponse.headers.get("Content-Length");
                    return [2 /*return*/, contentLength ? parseInt(contentLength, 10) : null];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to get content length:", error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function precheck(input, init) {
    // Check if fetch is available
    if (!window.fetch) {
        throw new Error("fetch is not available");
    }
    // Check if AbortController is available
    if (!window.AbortController) {
        throw new Error("AbortController is not available");
    }
    // Check if ReadableStream is available
    if (!window.ReadableStream) {
        throw new Error("ReadableStream is not available");
    }
    // Check if Response is available
    if (!window.Response) {
        throw new Error("Response is not available");
    }
    // Check if Request is available
    if (!window.Request) {
        throw new Error("Request is not available");
    }
    // Check if URL is available
    if (!window.URL) {
        throw new Error("URL is not available");
    }
    if (!input) {
        throw new Error("Input is required");
    }
    if (typeof input === "string" && !input.trim()) {
        throw new Error("Input is required");
    }
    if (typeof input === "object" && !input.toString().trim()) {
        throw new Error("Input is required");
    }
    if (typeof input === "object" && !input.toString().startsWith("http")) {
        throw new Error("Invalid URL provided");
    }
    if (typeof init === "object" && !init) {
        throw new Error("Invalid options provided: `init` object is empty");
    }
    return 0;
}
