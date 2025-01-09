import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import Page from "./page";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

const children = (
    <imgnx>
        <Page>{<></>}</Page>
    </imgnx>
);

root.render(children);
