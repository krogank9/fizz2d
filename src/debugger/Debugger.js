import { update, render } from "../app";
const stepApp = update;

import ObjectHistory from "./rewind/ObjectHistory";
import FunctionDebugger from "./FunctionDebugger";

export default class Debugger {
    seekPos = 0;
    minSeekPos = 0;
    paused = false;
    history = new ObjectHistory(window.globalState.app);
    app = window.globalState.app;
    functionDebugger = new FunctionDebugger();
    lastTime = performance.now();

    updateSeekPos() {
        // Clamp seekPos to valid ranges
        this.seekPos = Math.min(0, Math.max(this.minSeekPos, this.seekPos));

        if (this.seekPos !== this.history.getSeekPos()) {
            // If user scrolls to another frame, clear function debug history for current frame in preparation to re calculate it
            this.functionDebugger.stopFunctionDebugging();

            this.paused = true;
            this.history.trySeekTo(this.seekPos);
            this.seekPos = this.history.getSeekPos();
        }
    }

    runAppStep(deltaTime) {
        stepApp(this.app.state, deltaTime / 1000);
        this.history.update();
        this.seekPos = 0;
        this.minSeekPos = this.history.getMinSeekPos();
    }

    loop() {
        const deltaTime = performance.now() - this.lastTime;

        this.updateSeekPos();

        if (!this.paused) {
            //this.functionDebugger.stopFunctionDebugging();
            this.runAppStep(deltaTime);
        }
        
        //this.functionDebugger.functionDebugLoop(this.paused, () => stepApp(this.app.state, deltaTime / 1000));

        render(this.app.state, this.functionDebugger.getDebugRenderState());
        requestAnimationFrame(() => this.loop());
        this.lastTime = performance.now();
    }
}
