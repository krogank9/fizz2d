import ObjectHistory from "./rewind/ObjectHistory";

// Calls to this function are inserted into debugged functions via the babel plugin
window.saveFunctionDebugHistory = function (fileName, lineNumber, vars, getDebugRenderState, { startOfFunction = false, endOfFunction = false }) {
    const { functionDebugger } = window.globalState.debugger;
    functionDebugger.curFile = fileName;
    functionDebugger.curLine = lineNumber;
    functionDebugger.curVars = vars;
    functionDebugger.curDebugRenderFunc = getDebugRenderState;
    functionDebugger.curLineContext = { startOfFunction, endOfFunction };
    functionDebugger.updateHistory();
};

export default class FunctionDebugger {
    debugerRenderState = {};
    isDebugging = false;
    seekPos = 0;
    minSeekPos = 0;

    curFile = null;
    curLine = null;
    curLineContext = { startOfFunction: false, endFunction: false };
    curVars = {};
    curDebugRenderFunc = null;
    historyObj = {
        app: window.globalState.app,
        curFile: this.curFile,
        curLine: this.curLine,
        curLineContext: this.curLineContext,
        curVars: this.curVars,
        curDebugRenderFunc: this.curDebugRenderFunc,
    };
    functionDebugHistory = new ObjectHistory(this.historyObj);

    updateHistory() {
        this.historyObj.curFile = this.curFile;
        this.historyObj.curLine = this.curLine;
        this.historyObj.curLineContext = this.curLineContext;
        this.historyObj.curVars = this.curVars;
        this.historyObj.curDebugRenderFunc = this.curDebugRenderFunc;

        this.functionDebugHistory.update();
    }

    resetHistory() {
        this.curFile = null;
        this.curLine = null;
        this.curLineContext = { startOfFunction: false, endFunction: false };
        this.curVars = {};
        this.curDebugRenderFunc = null;
        this.updateHistory();
        this.functionDebugHistory.clearUndoHistory();
        this.functionDebugHistory.clearRedoHistory();
    }

    updateSeekPos() {
        if (this.seekPos !== this.functionDebugHistory.getSeekPos()) {
            this.functionDebugHistory.trySeekTo(this.seekPos);
            this.seekPos = this.functionDebugHistory.getSeekPos();
            this.minSeekPos = this.functionDebugHistory.getMinSeekPos();
        }
    }

    stopFunctionDebugging() {
        this.functionDebugHistory.undoAll();
        this.functionDebugHistory.clearRedoHistory();
        this.updateSeekPos();
    }

    getDebugRenderState() {
        if (this.curDebugRenderFunc) return this.curDebugRenderFunc(this.curVars);
        else return null;
    }

    hasNewFunctionsToDebug() {
        // This function needs to determine if there are any new functions to debug since the last check,
        // or maybe if "the current list of functions' debug history has been accumulated via our runAppStep call below" - if not we need to return true
        // We could maybe just keep a counter for every time we hot reload a module. Store the value of the counter whenever our last debug accum was and if it's not equal, we need to re accum.
        // We would also need to reset the counter every time stopFunctionDebugging is called I guess, because we also need to re-run every new frame
    }

    functionDebugLoop(paused, runAppStep) {
        // If necessary, run 1 app step to accumulate debug history to seek through
        if (paused && this.hasNewFunctionsToDebug()) {
            // Step back to the current frame's state
            this.functionDebugHistory.undoAll();
            this.functionDebugHistory.clearRedoHistory();
            this.resetHistory();
            // Run app step to accumulate debug history
            runAppStep();
            // Undo app step & go back to beginning
            this.functionDebugHistory.undoAll();
            this.seekPos = this.functionDebugHistory.getSeekPos();
            this.minSeekPos = this.functionDebugHistory.getMinSeekPos();
        }

        // After we have accumulated debug history, and if we are actively debugging a function,
        // give the user the ability to scroll through global and individual function state
        this.updateSeekPos();
    }
}
