import { update, render } from "../app";

window.saveFunctionDebugHistory = function (fileName, functionName, lineNumber, vars, getDebugRenderState, {startFunction, endFunction}) {
    const { debuggerState } = window.globalState;
    debuggerState.functionDebugMode = true;
};

function functionDebugLoop() {
    const { app, debuggerState } = window.globalState;

    // Update the state based on the function debug history
    if (debuggerState.functionDebugSeekPos !== debuggerState.functionDebugHistory.getSeekPos()) {
        debuggerState.paused = true;
        debuggerState.functionDebugHistory.trySeekTo(debuggerState.functionDebugSeekPos);
        debuggerState.functionDebugSeekPos = debuggerState.functionDebugHistory.getSeekPos();
        debuggerState.functionDebugMinSeekPos = debuggerState.functionDebugHistory.getMinSeekPos();
    }

    // Render the updated state
    render(app.state, 0);
}

export function debugLoop() {
    const { app, debuggerState } = window.globalState;

    window.lastTime ||= 0;
    const deltaTime = performance.now() - window.lastTime;

    if (debuggerState.functionDebugMode) {
        functionDebugLoop();
    } else {
        if (debuggerState.seekPos !== debuggerState.history.getSeekPos()) {
            debuggerState.paused = true;
            debuggerState.history.trySeekTo(debuggerState.seekPos);
            debuggerState.seekPos = debuggerState.history.getSeekPos();
            debuggerState.minSeekPos = debuggerState.history.getMinSeekPos();
        }

        if (!debuggerState.paused) {
            update(app.state, deltaTime / 1000);
            debuggerState.history.update();
            debuggerState.seekPos = 0;
            debuggerState.minSeekPos = debuggerState.history.getMinSeekPos();
        }

        render(app.state);
    }

    requestAnimationFrame(debugLoop);
    window.lastTime = performance.now();
}
