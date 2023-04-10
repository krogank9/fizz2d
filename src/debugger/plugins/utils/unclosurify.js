import babel from "@babel/core";

function isVarIdentifier(path) {
    const parentPath = path.parentPath;
    const parentNode = path.parent;

    // Exclude identifiers in function and class declarations
    if (path.isFunctionDeclaration() || path.isClassDeclaration()) return false;

    // Exclude left side of a variable declaration
    if (parentPath.isVariableDeclarator({ id: path.node })) return false;

    // Exclude properties of 'this' in MemberExpressions
    if (parentNode.type === "MemberExpression" && parentNode.object.type === "ThisExpression") return false;

    // Check if the identifier is part of a property chain
    if (parentNode.type === "MemberExpression" && parentNode.property === path.node) {
        const grandParentNode = parentPath.parent;
        if (grandParentNode.type !== "MemberExpression" || grandParentNode.object !== parentNode) {
            return false;
        }
    }

    return true;

    // if (
    //     parentNode.type === "AssignmentExpression" ||
    //     parentNode.type === "UpdateExpression" ||
    //     parentNode.type === "MemberExpression" ||
    //     parentNode.type === "CallExpression" ||
    //     parentNode.type === "VariableDeclarator" ||
    //     parentNode.type === "ExpressionStatement" ||
    //     parentNode.type === "BinaryExpression"
    // )
    //     return true;

    // return false;
}

//----------

function isTopLevelFunctionConstructor(functionPath) {
    // Just find top level function constructors
    const parentPath = functionPath.parentPath;
    if (!parentPath.isProgram()) return false;

    // Check if the function is a regular function, not an arrow function
    if (!functionPath.isFunctionDeclaration() && !functionPath.isFunctionExpression()) {
        return false;
    }

    let isConstructor = false;

    // Traverse the function body to check for 'this' assignments
    functionPath.traverse({
        AssignmentExpression(path) {
            const { left, operator } = path.node;

            // Check if the assignment is to a property of 'this'
            if (babel.types.isMemberExpression(left) && babel.types.isThisExpression(left.object) && operator === "=") {
                isConstructor = true;
                path.stop(); // Stop traversing as we found a 'this' assignment
            }
        },
    });

    return isConstructor;
}

function replaceFunctionConstructorClosureVars(functionPath) {
    // First pass: Replace variable references with their `this.__{var_name}` equivalents
    functionPath.traverse({
        Identifier(path) {
            if (isVarIdentifier(path)) {
                const varName = path.node.name;
                const binding = path.scope.getBinding(varName);

                if (binding && binding.scope === functionPath.scope) {
                    const thisVarName = `this.__${varName}`;
                    // Replace the variable reference with the corresponding `this.__{var_name}` expression
                    path.replaceWith(babel.types.identifier(thisVarName));
                }
            }
        },
    });

    // Second pass: Replace top level variable declarations with this.__varName assignments
    functionPath.traverse({
        VariableDeclaration(path) {
            if (path.scope === functionPath.scope) {
                path.node.declarations.forEach((declaration) => {
                    const varName = declaration.id.name;
                    const newVarName = `this.__${varName}`;

                    // Replace the declaration with an assignment expression
                    const assignmentExpression = babel.types.assignmentExpression(
                        "=",
                        babel.types.identifier(newVarName),
                        declaration.init || babel.types.identifier("undefined")
                    );
                    const expressionStatement = babel.types.expressionStatement(assignmentExpression);
                    path.insertBefore(expressionStatement);
                });
                path.remove();
            }
        },
    });
}

function replaceGlobalClosureVars(code, globalClosureVarPrefix) {
    const ast = babel.parse(code);

    const topLevelNonConstVars = new Map();

    // First traversal: Collect top-level non-const variable declarations and assignments
    babel.traverse(ast, {
        VariableDeclaration(path) {
            if (path.node.kind !== "const" && path.scope.block.type === "Program") {
                for (const declarator of path.node.declarations) {
                    topLevelNonConstVars.set(declarator.id.name, path);
                }
            }
        },
    });

    // Traversal: For all nodes in AST, if any refer to a node in globalsToReplace, prefix the variable name with "window.__globalClosures."
    // Incidentally, this will replace both the assignments (basically sees its identifier as a reference to itself) and the references to either type of globals.
    babel.traverse(ast, {
        Identifier(path) {
            if (isVarIdentifier(path)) {
                const nodePath = topLevelNonConstVars.get(path.node.name);
                const binding = path.scope.getBinding(path.node.name);
                const isImplicitGlobal = binding == null;
                if (nodePath && ((isImplicitGlobal && nodePath.scope.block.type === "Program") || (binding && nodePath.scope === binding.scope))) {
                    const newIdentifier = babel.types.identifier(`window.globalState.app.globalClosures.${globalClosureVarPrefix}_${path.node.name}`);

                    // Replace the current node with the new Identifier node
                    path.replaceWith(newIdentifier);
                }
            }
        },
    });

    // Update initial declarations of non-const variables
    for (const path of topLevelNonConstVars.values()) {
        path.node.declarations.forEach((declaration) => {
            const varName = declaration.id.name;
            const newVarName = `window.globalState.app.globalClosures.${globalClosureVarPrefix}_${varName}`;

            // Replace the declaration with an assignment expression
            const assignmentExpression = babel.types.assignmentExpression(
                "??=",
                babel.types.identifier(newVarName),
                declaration.init || babel.types.identifier("undefined")
            );
            const expressionStatement = babel.types.expressionStatement(assignmentExpression);
            path.insertBefore(expressionStatement);
        });
        path.remove();
    }

    const transformedCode = babel.transformFromAst(ast).code;
    return transformedCode;
}

function replaceFunctionConstructorClosures(code, globalVarFilePrefix) {
    const ast = babel.parse(code);

    // Traverse the AST and transform function constructors
    babel.traverse(ast, {
        FunctionDeclaration(path) {
            if (isTopLevelFunctionConstructor(path)) {
                replaceFunctionConstructorClosureVars(path, globalVarFilePrefix);
            }
        },
        FunctionExpression(path) {
            if (isTopLevelFunctionConstructor(path)) {
                replaceFunctionConstructorClosureVars(path, globalVarFilePrefix);
            }
        },
    });

    // Generate the transformed code from the modified AST
    const transformedCode = babel.transformFromAst(ast).code;
    return transformedCode;
}

export function unclosurify(code, fileName) {
    // Ensure 
    //const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
    const globalClosureVarPrefix = fileName.replace(/[^a-zA-Z0-9$_]/g, "");
    const globalVarsReplaced = replaceGlobalClosureVars(code, globalClosureVarPrefix);
    const functionConstructorsChanged = replaceFunctionConstructorClosures(globalVarsReplaced);

    return functionConstructorsChanged;
}
