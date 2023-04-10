import _ from "lodash";

import { diffObj, applyPatch, diffIsEmpty } from "./utils";

export default class ObjectHistory {
    constructor(obj) {
        this.undoHistory = [];
        this.redoHistory = [];
        this.obj = obj;
        this.objClone = _.cloneDeep(obj);
    }

    update() {
        let diffForwards = diffObj(this.objClone, this.obj);
        if (diffIsEmpty(diffForwards)) return false;
        let diffBackwards = diffObj(this.obj, this.objClone);

        this.objClone = applyPatch(this.objClone, diffForwards); // Set objClone to current obj's value so we can get next diff

        this.undoHistory.push(diffBackwards);
        this.redoHistory = [];

        return true;
    }

    undo() {
        let diffBackwards = this.undoHistory.pop();
        applyPatch(this.obj, diffBackwards);

        let diffForwards = diffObj(this.obj, this.objClone);
        this.objClone = applyPatch(this.objClone, diffBackwards); // Set objClone to current obj's value so we can get next diff

        this.redoHistory.push(diffForwards);
    }

    redo() {
        let diffForwards = this.redoHistory.pop();
        applyPatch(this.obj, diffForwards);

        let diffBackwards = diffObj(this.obj, this.objClone);
        this.objClone = applyPatch(this.objClone, diffForwards); // Set objClone to current obj's value so we can get next diff

        this.undoHistory.push(diffBackwards);
    }

    undoCount() {
        return this.undoHistory.length;
    }

    redoCount() {
        return this.redoHistory.length;
    }

    clearRedoHistory() {
        this.redoHistory = [];
    }
    
    clearUndoHistory() {
        this.undoHistory = [];
    }

    canUndo() {
        return this.undoHistory.length > 0;
    }

    canRedo() {
        return this.redoHistory.length > 0;
    }

    getSeekPos() {
        return -this.redoCount();
    }

    undoAll() {
        while (this.canUndo()) this.undo();
    }

    trySeekTo(seekPos) {
        let steps = seekPos - this.getSeekPos();
        while (steps > 0 && this.redoCount() > 0) {
            this.redo();
            steps--;
        }
        while (steps < 0 && this.undoCount() > 0) {
            this.undo();
            steps++;
        }
    }

    getMinSeekPos() {
        return -this.undoCount() - this.redoCount();
    }
}
