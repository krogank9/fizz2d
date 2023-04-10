import { detailedDiff } from "deep-object-diff";

export function diffObj(from, to) {
    return detailedDiff(from, to);
}

export function applyPatch(obj, diff) {
    function handleAddedValue(key, value) {
        if (Array.isArray(value)) {
            obj[key] = value.map((element) =>
                applyPatch({}, { added: element })
            );
        } else if (typeof value === "object") {
            obj[key] = applyPatch(obj[key] || {}, { added: value });
        } else {
            obj[key] = value;
        }
    }

    function handleDeletedValue(key, value) {
        if (typeof value === "object") {
            obj[key] = applyPatch(obj[key] || {}, { deleted: value });
        } else {
            delete obj[key];
        }
    }

    function handleUpdatedValue(key, value) {
        if (Array.isArray(value)) {
            obj[key] = value.map((element) =>
                applyPatch({}, { added: element })
            );
        } else if (typeof value === "object") {
            obj[key] = applyPatch(obj[key] || {}, { added: value });
        } else {
            obj[key] = value;
        }
    }

    if (diff.added) {
        for (const key of Object.keys(diff.added)) {
            const value = diff.added[key];
            handleAddedValue(key, value);
        }
    }
    if (diff.deleted) {
        for (const key of Object.keys(diff.deleted)) {
            const value = diff.deleted[key];
            handleDeletedValue(key, value);
        }
    }
    if (diff.updated) {
        for (const key of Object.keys(diff.updated)) {
            const value = diff.updated[key];
            handleUpdatedValue(key, value);
        }
    }
    return obj;
}

export function diffIsEmpty(diff) {
    return !diff?.added && !diff?.deleted && !diff?.updated;
}