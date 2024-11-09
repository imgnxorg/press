import React from "react";
import "./globals.css";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

const Page = ({ children }) => {
    return (
        <>
            <form
                className="form prose mx-auto border p-4 rounded shadow"
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("submit");
                }}
            >
                <label>
                    <div>Users</div>
                    <input type="range" min="1" max="200" />
                </label>
                <label>
                    <div>Devices</div>
                    <input type="range" min="1" max="12" />
                </label>
            </form>
            {children}
        </>
    );
};

const root = createRoot(document.getElementById("root"));

root.render(
    <>
        <Page />
    </>
);
