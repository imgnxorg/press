import "./globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Page from "./page";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

const children = <Page>{<div className="children"></div>}</Page>;

root.render(children);
