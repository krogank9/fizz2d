import React, { useState, useEffect } from 'react'

function createOrAddProxy(object, callback) {
    if (!object.__callbacks) {
        object.__callbacks = [callback];
        object = new Proxy(object, {
            set(target, property, value) {
                target[property] = value;
                object.__callbacks.forEach((callback) => callback(property, value));
                return true;
            },
        });
    } else {
        object.__callbacks.push(callback);
    }
    return object;
}

export function useGlobalStateProxy(globalVarName) {
    const getObjAt = (pos) => {
        let keys = globalVarName.split(".").slice(0, globalVarName.split(".").length + (pos + 1));
        //console.log(keys)
        let obj = keys.reduce((acc, cur) => acc[cur], window);
        return obj;
    };
    const getKeyAt = (pos) => globalVarName.split(".")[globalVarName.split(".").length + pos];

    let valKey = getKeyAt(-1);
    let objKey = getKeyAt(-2);
    let obj = getObjAt(-2);
    let parent = getObjAt(-3);

    // console.log(`Setting ${valKey} on window.${parentKey}.${objKey} to ${val}`)
    // console.log(val)
    // console.log(parent, objKey)

    const [value, setValue] = useState(obj[valKey]);

    useEffect(() => {
        // Update the global whenever component value changes
        obj[valKey] = value;
    }, [value]);

    useEffect(() => {
        parent[objKey] = createOrAddProxy(parent[objKey], (property, changedValue) => {
            if (property === valKey) {
                setValue(changedValue);
            }
        });
    }, []);
    return [value, setValue];
}
