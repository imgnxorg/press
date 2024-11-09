import React from "react";
import "./globals.css";
import { createRoot } from "react-dom/client";

const Page = ({ children }) => {
    return (
        <>
            <form
                className="form prose max-w-md mx-auto"
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

root.render(<Page />);
