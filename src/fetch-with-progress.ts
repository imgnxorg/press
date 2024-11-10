export type Progress = {
    percentage: number | null;
    loaded: number;
    total: number | null;
};

export default async function fetchWithProgress(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<{
    message: string;
    object: Response | null;
    progress: {
        percentage: number | null;
        loaded: number;
        total: number | null;
    };
}> {
    try {
        // Pre-checks for fetch
        precheck(input, init);
    } catch (error) {
        console.error("Pre-check failed:", error ? error.message : error);
        console.warn(
            `Fetch aborted. If you need this to work without 
throwing an error, please adjust the catch block at the top of 
the function.`
        );
        // Remove this to prevent the function from throwing an error
        throw error;
    } finally {
        console.log("Pre-check complete");
    }

    // Initialize variables
    let message = "fetching...",
        percentage = 0;

    // Step 1: Get the content length using a HEAD request
    const contentLength = await getContentLength(input.toString());

    if (!contentLength) {
        console.warn(
            `Could not retrieve \`Content-Length;\`. Progress tracking will 
not be available. Use \`loaded\` instead. If you need progress 
tracking, please ensure that the server supports HEAD requests.`
        );
        percentage = 100;
        message = "sent";
    }

    // Step 2: Proceed with the actual fetch request and track progress
    const response = await fetch(input, init);
    const total = contentLength; // This is the total size, if available
    let loaded = 0;

    if (!response.body) {
        percentage = 100;
        message = "error";
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const stream = new ReadableStream({
        start(controller) {
            function read() {
                reader
                    .read()
                    .then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            message = "done";
                            percentage = 100;
                            loaded = total;
                            return;
                        }

                        loaded += value.length;

                        // Progress calculation when Content-Length is available

                        let progress: Progress = {
                            percentage: null,
                            loaded: loaded,
                            total: total,
                        };

                        if (total) {
                            progress.percentage = (loaded / total) * 100;
                        }

                        message = `fetching: ${
                            progress.percentage !== null
                                ? progress.percentage.toFixed(2) + "%"
                                : loaded + "/? bytes"
                        }`;

                        controller.enqueue(value);
                        read();
                    })
                    .catch((error) => {
                        console.error("Stream error:", error);
                        controller.error(error);
                    });
            }
            read();
        },
    });

    const responseStream = new Response(stream);
    // Return the response stream
    // Usage: const { message, object, progress } = await fetchWithProgress(url);
    // And if it's not at 100%, you can use the message to show the progress. To get the next update,
    // you can call the function again. If the fetch is complete, the message will be "done". If there's an error,
    // the message will be "error". The object is the Response object. The progress object contains the percentage,
    // loaded bytes, and total bytes. If the total bytes are not available, the percentage will be null. You can use
    // the loaded bytes to show the progress in this case. If the total bytes are available, you can use the percentage
    // to show the progress. If you need to show the loaded bytes, you can use the loaded property. If you need to show
    // the total bytes, you can use the total property.
    return {
        message,
        object: responseStream.clone(),
        progress: { percentage, loaded, total },
    };
}

// Function to get Content-Length from a HEAD request
export async function getContentLength(url: string) {
    try {
        const headResponse = await fetch(url, { method: "HEAD" });
        const contentLength = headResponse.headers.get("Content-Length");
        return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
        console.error("Failed to get content length:", error);
        return null;
    }
}

function precheck(
    input: RequestInfo | URL,
    init?: RequestInit
): number | never {
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
