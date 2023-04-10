// Hot reloading

import { reloadModule } from "./core/utils.js";

if (import.meta.hot) {
    let fileToReload = "";
    let fileToReloadCode = "";
    // This gets called first before .accept so we have to set a var for file to reload
    import.meta.hot.on("hmr-get-file", ({ fileName, fileCode }) => {
        if (fileName) {
            let appIndex = fileName.indexOf("app");
            if (appIndex >= 0) {
                fileToReload = `../../${fileName.slice(appIndex)}`;
                fileToReloadCode = fileCode;
            } else {
                fileToReload = "";
                fileToReloadCode = "";
            }
        }
    });
    import.meta.hot.accept(async () => {
        if (fileToReload) {
            await reloadModule(fileToReload, fileToReloadCode, window.globalState.app.state);
        }
    });
}

// Debug/game loop

import "./setup-global-state.js"; // Need to run this first to setup global vars for unclosurify
import { setupState } from "../app";
import Debugger from "./Debugger";
import renderDebuggerUI from "./ui/index.jsx";

if (!window.globalState.debugger) {
    window.globalState.app.state = setupState();
    window.globalState.debugger = new Debugger();
    renderDebuggerUI();
    requestAnimationFrame(() => window.globalState.debugger.loop());
}
