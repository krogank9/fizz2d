function hotReloadMethodsRecursively(obj, classList) {
    // Check if obj is an object
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    // Recursively loop through the object tree
    for (const [key, value] of Object.entries(obj)) {
        if (
            value &&
            value.constructor &&
            value.constructor.name &&
            classList.some((c) => c.name === value.constructor.name)
        ) {
            const C = classList.find((c) => c.name === value.constructor.name);

            console.log(`Found same name: ${C.name} - Reloading`);

            // Method 2: Inherit and create a new class
            function hotReloadMethods(obj, newClass) {
                // Get the prototype of the new class
                const newClassPrototype = newClass.prototype;

                // Get all the function names from the new class prototype
                const functionNames = Object.getOwnPropertyNames(
                    newClassPrototype
                ).filter(
                    (methodName) =>
                        typeof newClassPrototype[methodName] === "function" &&
                        methodName !== "constructor"
                );

                // Assign the new functions to the original object
                for (const functionName of functionNames) {
                    obj.__proto__[functionName] =
                        newClassPrototype[functionName];
                    console.log(`Reloading function: ${functionName}`);
                    //console.log(newClassPrototype[functionName]);
                }
                obj.__proto__.constructor = newClass;
            }
            hotReloadMethods(value, C);
        }
        hotReloadMethodsRecursively(obj[key], classList);
    }
}

export async function reloadModule(file, fileCode, state) {
    const cacheBuster = "?t=" + Date.now();
    const module = await import(file + cacheBuster /* @vite-ignore */);
    const exports = Object.keys(module).map((key) => module[key]);
    const classes = exports.filter((item) => {
        return (
            typeof item === "function" &&
            (item.toString().startsWith("class") ||
                item.toString().startsWith("function"))
        );
    });

    hotReloadMethodsRecursively({ state }, classes);
}
