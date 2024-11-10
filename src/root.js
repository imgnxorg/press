import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import fetchWithProgress from "./fetch-with-progress.ts";
import { Field, Formik } from "formik";
import { Button, defaultTheme, Provider } from "@adobe/react-spectrum";

const Page = ({ children }) => {
    const imgnxFormProgressBar = useRef(null);
    const dbugContainer = useRef(null);
    const [calculatedTotal, setCalculatedTotal] = useState(0);
    const [message, setMessage] = useState("waiting...");
    const [object, setObject] = useState({ status: "waiting...", id: null });
    const [progress, setProgress] = useState({
        percentage: 0,
        loaded: 0,
        total: 0,
    });

    function closeDebugger() {
        dbugContainer.current.style.display = "none";
        localStorage.setItem("imgnx-dbug", "false");
    }
    function clearCache() {
        localStorage.removeItem("imgnx-dbug");
        window.location.reload();
    }
    return (
        <Provider theme={defaultTheme}>
            <div className="font-ubuntu font-base unselectable">
                <Formik
                    initialValues={{
                        users: 100,
                        devices: 6,
                        email: "test@dbug.net",
                        security: false,
                        compliance: false,
                    }}
                    validate={(values) => {
                        console.log("Validating", values);
                        const errors = {};
                        if (!values.email) {
                            errors.email = "Required";
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                values.email
                            )
                        ) {
                            errors.email = "Invalid email address";
                        }
                        if (Object.keys(errors).length > 0) {
                            console.warn("Errors", errors);
                        }
                        return errors;
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        console.log(
                            "Submitting",
                            JSON.stringify(values, null, 2)
                        );
                        let { message, object, progress } =
                            await fetchWithProgress(
                                "https://services.leadconnectorhq.com/hooks/RdKc5VGPLz5tjcaBWnyq/webhook-trigger/fa5e2fdf-8d2d-4f72-8f37-be8c38bb1521",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        checksum:
                                            "fa5e2fdf-8d2d-4f72-8f37-be8c38bb1521",
                                    },
                                    body: JSON.stringify({ ...values }),
                                }
                            );
                        setMessage(message);
                        setObject(await object.json());
                        setProgress(progress);
                        imgnxFormProgressBar.current.style.transform = `scaleX(${
                            progress.percentage / 100
                        })`;
                        setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => {
                        return (
                            <>
                                <div className="h-48"></div>
                                {process.env.NODE_ENV === "development" &&
                                    localStorage.getItem("imgnx-dbug") ===
                                        "false" && (
                                        <div className="fixed top-0 left-0 z-10 opacity-20 hover:opacity-100 transition-opacity">
                                            <pre className="text-[#00ffff] bg-black w-max p-4 rounded-br-xl shadow">
                                                Developer mode:
                                                <br />
                                                {JSON.stringify({
                                                    dbug: JSON.stringify(
                                                        localStorage.getItem(
                                                            "imgnx-dbug"
                                                        )
                                                    ),
                                                })}
                                            </pre>

                                            <button
                                                className="rounded-br-lg bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white px-6 py-0.5 shadow flex items-center gap-4"
                                                onClick={clearCache}
                                            >
                                                <span className="">
                                                    &#128260;
                                                </span>
                                                <span className="">
                                                    Force clear cache
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                <div
                                    className={`${
                                        process.env.NODE_ENV === "development"
                                            ? ""
                                            : ""
                                    } grid grid-cols-1 gap-8 xl:grid-cols-2  container mx-auto @container`}
                                >
                                    <>
                                        {process.env.NODE_ENV ===
                                            "development" &&
                                        localStorage.getItem("imgnx-dbug") !==
                                            "false" ? (
                                            <>
                                                <div
                                                    className="fixed top-0 right-0 rounded-none rounded-bl-xl text-white pb-9 bg-gradient-to-b from-cyan-950 to-cyan-500 via-cyan-800 via-95% opacity-80"
                                                    ref={dbugContainer}
                                                >
                                                    <div className="bg-black w-full">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                closeDebugger
                                                            }
                                                            tabIndex={-1}
                                                            className="rounded-br-2xl shadow-inner bg-neutral-700 hover:bg-neutral-800 active:bg-neutral-900 text-3xl flex items-center justify-center text-center w-max h-max px-3 border-double border-cyan-100 border-opacity-50 border-4"
                                                        >
                                                            <span className="flex items-center justify-center text-center rotate-90 text-white w-max h-max ml-0.5 mt-0.5">
                                                                ×
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <pre className="rounded-none border-y shadow-inner border-cyan-500 border-opacity-60 bg-neutral-900 top-1 relative px-2 py-4">
                                                        {JSON.stringify(
                                                            {
                                                                values,
                                                                object,
                                                                touched,
                                                                errors,
                                                                handleBlur,
                                                                isSubmitting,
                                                            },
                                                            null,
                                                            2
                                                        )}
                                                    </pre>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <form
                                            className="form prose mx-auto border my-4 rounded shadow-inner leading-snug"
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="pb-8 grid grid-cols-1 @xl:xl:grid-cols-2 gap-4 bg-gradient-to-b from-neutral-100 to-slate-100 p-6">
                                                <label className="m-1 border border-double ring-offset-transparent bg-transparent ring-1 ring-offset-2 ring-white border-zinc-50 p-4 relative block w-full shadow-xl bg-gradient-to-b from-zinc-100 to-zinc-200 rounded-xl mb-0 pb-0">
                                                    <div className="w-full relative rounded-t backdrop-blur-md">
                                                        <span className="absolute font-ubuntu-display z-10 px-5 py-0.5 border-b-4 border-r-4 border-outset rounded-br-md font-medium flex items-center bg-gray-50 bg-opacity-90 backdrop-blur-3xl shadow-inner border-zinc-300 rounded-tl text-sm">
                                                            Users:
                                                        </span>
                                                        <input
                                                            className="text-right font-sans focus:outline-sky-300 focus:outline-2 focus:ring-0 text-4xl relative h-max block border-zinc-300 border-inset border-4 pl-5 pr-5 w-full rounded-lg py-1 tracking-tighter max-w-full shadow-inner ml-auto"
                                                            name="users"
                                                            type="number"
                                                            min="0"
                                                            max="200"
                                                            step={10}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            value={values.users}
                                                        />
                                                        <span className="absolute z-10 bottom-0.5 left-2 text-lg font-mono">
                                                            {values.users >= 200
                                                                ? "MAX"
                                                                : ""}
                                                        </span>
                                                        <span className="absolute text-sm animate-pulse pointer-events-none top-1 right-2 text-gray-400">
                                                            ▲
                                                        </span>
                                                        <span className="absolute text-sm animate-pulse pointer-events-none bottom-1 right-2 text-gray-400">
                                                            ▼
                                                        </span>
                                                    </div>

                                                    <div className="relative w-full rounded-b h-5 flex items-end group">
                                                        <div className="absolute h-px border-zinc-300 border-2 rounded-full px-1 border-inset w-full" />
                                                        <input
                                                            className="relative -top-4 h-0 z-10 bg-black"
                                                            type="range"
                                                            name="users"
                                                            min="0"
                                                            max="200"
                                                            value={values.users}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </div>
                                                </label>
                                                <label className="m-1 border border-double ring-offset-transparent bg-transparent ring-1 ring-offset-2 ring-white border-zinc-50 p-4 relative block w-full shadow-xl bg-gradient-to-b from-zinc-100 to-zinc-200 rounded-xl mb-0">
                                                    <div className="w-full relative rounded-t backdrop-blur-md">
                                                        <span className="absolute z-10 px-5 py-0.5 border-b-4 border-r-4 border-outset rounded-br-md font-medium flex items-center bg-gray-50 bg-opacity-90 backdrop-blur-3xl shadow-inner border-zinc-300 rounded-tl text-sm">
                                                            Devices:
                                                        </span>
                                                        <input
                                                            className="text-right font-sans focus:outline-sky-300 focus:outline-2 focus:ring-0 text-4xl relative h-max block border-zinc-300 border-inset border-4 pl-5 pr-5 w-full rounded-lg py-1 tracking-tighter max-w-full shadow-inner ml-auto"
                                                            name="devices"
                                                            type="number"
                                                            min="1"
                                                            max="12"
                                                            value={
                                                                values.devices
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <span className="absolute z-10 bottom-0.5 left-2 text-lg font-mono">
                                                            {values.devices >=
                                                            12
                                                                ? "MAX"
                                                                : ""}
                                                        </span>
                                                        <span className="absolute text-sm animate-pulse pointer-events-none top-1 right-2 text-gray-400">
                                                            ▲
                                                        </span>
                                                        <span className="absolute text-sm animate-pulse pointer-events-none bottom-1 right-2 text-gray-400">
                                                            ▼
                                                        </span>
                                                    </div>
                                                    <div className="relative w-full rounded-b h-5 flex items-end group">
                                                        <div className="absolute h-px border-zinc-300 border-2 rounded-full px-1 border-inset w-full" />
                                                        <input
                                                            className="relative -top-4 h-0 z-10 bg-black"
                                                            type="range"
                                                            name="devices"
                                                            min="1"
                                                            max="12"
                                                            value={
                                                                values.devices
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="pb-8 grid grid-cols-1 gap-x-12 gap-y-6 px-6 bg-gradient-to-l from-transparent to-red-100 via-red-50">
                                                <h5
                                                    id="service-type"
                                                    className="font-semibold relative"
                                                >
                                                    <div className="absolute bg-gradient-to-r z-10 inset-0 h-full -ml-7 -skew-x-12 shadow from-red-200 to-transparent via-red-50 from-10% to-100%"></div>
                                                    <span className="relative z-20">
                                                        Service Type:
                                                    </span>
                                                </h5>
                                                <fieldset
                                                    role="group"
                                                    aria-labelledby="service-type"
                                                    className="flex flex-col gap-4 group"
                                                >
                                                    <label className="peer">
                                                        <Field
                                                            name="service"
                                                            type="radio"
                                                            required
                                                            value="dfy"
                                                            className="float-left mr-3 outline group-focus-within:outline-sky-300 invalid:outline-red-600"
                                                        />
                                                        <span className="block">
                                                            Basic IT Support
                                                        </span>
                                                    </label>
                                                    <label className="peer">
                                                        <Field
                                                            name="service"
                                                            type="radio"
                                                            required
                                                            value="msp"
                                                            className="float-left mr-3 outline group-focus-within:outline-sky-300 invalid:outline-red-600"
                                                        />
                                                        <span className="block">
                                                            Fully Managed IT
                                                            Service
                                                        </span>
                                                    </label>
                                                    <label className="peer">
                                                        <Field
                                                            name="service"
                                                            type="radio"
                                                            required
                                                            value="dwy"
                                                            className="float-left mr-3 outline group-focus-within:outline-sky-300 invalid:outline-red-600"
                                                            invalid="true"
                                                        />
                                                        <span className="block">
                                                            Support For Your IT
                                                            Team (Co-Managed)
                                                        </span>
                                                    </label>
                                                </fieldset>
                                            </div>
                                            <div className="pb-8 grid grid-cols-1 gap-x-12 gap-y-6 px-6 bg-gradient-to-l from-transparent to-yellow-100 via-yellow-50">
                                                <h5 className="font-semibold relative">
                                                    <div className="absolute bg-gradient-to-r z-10 inset-0 h-full -ml-7 -skew-x-12 shadow from-yellow-200 to-transparent via-yellow-50 from-10% to-100%"></div>
                                                    <span className="relative z-20">
                                                        Advanced IT Security
                                                        Tools:
                                                    </span>
                                                </h5>
                                                <div>
                                                    <label>
                                                        <Field
                                                            type="checkbox"
                                                            checked={
                                                                !!values.security
                                                            }
                                                            name="security"
                                                            className="float-left mr-3 outline focus:outline-sky-300 outline-yellow-600 invalid:outline-red-600"
                                                        />
                                                        <span className="block">
                                                            I need help with
                                                            Security.
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="pb-8 grid grid-cols-1 gap-x-12 gap-y-6 px-6 bg-gradient-to-l from-transparent to-blue-100 via-blue-50">
                                                <h5 className="font-semibold relative">
                                                    <div className="absolute bg-gradient-to-r z-10 inset-0 h-full -ml-7 -skew-x-12 shadow from-blue-200 to-transparent via-blue-50 from-10% to-100%"></div>
                                                    <span className="relative z-20">
                                                        Security &amp;
                                                        Compliance:
                                                    </span>
                                                </h5>
                                                <div>
                                                    <label>
                                                        <Field
                                                            type="checkbox"
                                                            checked={
                                                                !!values.compliance
                                                            }
                                                            name="compliance"
                                                            className="float-left mr-3 outline focus:outline-sky-300 current:outline-yellow-600 invalid:outline-red-600"
                                                        />
                                                        <span className="block">
                                                            I need help with IT
                                                            compliance for
                                                            Financial
                                                            Institutions, CMMC
                                                            or HIPAA.
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl relative p-6">
                                                <div className="relative min-h-4 flex items-center justify-center border overflow-visible grow rounded-lg">
                                                    <div
                                                        id="imgnx-form-progress-bar"
                                                        role="progressbar"
                                                        aria-valuenow={
                                                            progress.percentage
                                                        }
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                        ref={
                                                            imgnxFormProgressBar
                                                        }
                                                        className="absolute top-0 bottom-0 left-0 rounded-lg bg-neutral-700 transform-gpu w-full transition-transform duration-500 ease-in-out origin-left"
                                                        style={{
                                                            transform:
                                                                "scaleX(0)",
                                                        }}
                                                    ></div>
                                                    <div className="absolute w-full min-h-max text-center text-black font-medium text-2xl z-10">
                                                        <div className="capitalize animate-pulse flex items-center justify-center mix-blend-luminosity">
                                                            {message}
                                                            {progress.percentage >
                                                                0 &&
                                                                progress.percentage <
                                                                    100 &&
                                                                `${progress.percentage}%`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {message && (
                                                <div className="capitalize animate-pulse">
                                                    {message}
                                                </div>
                                            )}
                                            <Button
                                                staticColor="black"
                                                variant="accent"
                                            >
                                                Submit
                                            </Button>
                                        </form>
                                    </>

                                    <div className="form prose mx-auto border py-4 my-4 px-12 rounded shadow-inner space-y-8  w-full">
                                        <div className="grid grid-cols-1 gap-12"></div>
                                        <h2 className="text-4xl w-full">
                                            ${calculatedTotal}
                                        </h2>
                                        <div>
                                            <pre>
                                                users\n1\n10\n20\n30\n40\n50\n60\n70\n80\n90\n100\n\n$
                                                2,670 per month\n\nfor 20
                                                users\n\nAdvanced IT Security
                                                Tools\n\nI need help with
                                                security\n\nFully managed IT
                                                service includes:\nTier 1 help
                                                desk\nTier 2 support\nRemote
                                                monitoring\nIT strategy
                                                consulting\nBasic cybersecurity
                                                tools\nPre-Scheduled Change
                                                Management Time (8
                                                hours)\n\nAnnual\nQuarterly\nMonthly\nTwice
                                                Monthly\nWeekly\n\nCo-managed IT
                                                service includes:\nTier 1 help
                                                desk\nTier 2 support\nRemote
                                                monitoring\nIT strategy
                                                consulting\nBasic cybersecurity
                                                tools\nIT Security
                                                Compliance\n\nI need help with
                                                IT compliance for Financial
                                                Institutions, CMMC or
                                                HIPAA\n\nRadio box\n\nBasic IT
                                                Support\nFully Managed IT
                                                Service\nSupport For Your IT
                                                Team (Co-Managed)'
                                            </pre>
                                        </div>
                                    </div>
                                    {children}
                                </div>
                            </>
                        );
                    }}
                </Formik>
            </div>
        </Provider>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Page />);
