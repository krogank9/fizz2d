// import babel from "@babel/parser";
// import traverse from "@babel/traverse";
// import * as t from "@babel/types";
// import generator from "@babel/generator";

// function insertDebugLogInFunction(code) {
//     const ast = babel.parse(code, {
//         sourceType: "module",
//         plugins: ["classProperties"],
//     });

//     traverse.default(ast, {
//         AssignmentExpression(path) {
//             if (
//                 t.isMemberExpression(path.node.left) &&
//                 t.isFunctionExpression(path.node.right)
//             ) {
//                 const functionBody = path.node.right.body.body;
//                 if (functionBody.length > 0) {
//                     const firstStatement = functionBody[0];
//                     const leadingComments = firstStatement.leadingComments;

//                     if (
//                         leadingComments &&
//                         leadingComments.some(
//                             (comment) =>
//                                 comment.type === "CommentLine" &&
//                                 comment.value.trim() === "debug"
//                         )
//                     ) {
//                         functionBody.unshift(
//                             t.expressionStatement(
//                                 t.callExpression(t.identifier("console.log"), [
//                                     t.stringLiteral("debug"),
//                                 ])
//                             )
//                         );
//                     }
//                 }
//             }
//         },
//     });

//     return generator.default(ast).code;
// }

import { unclosurify } from "./utils/unclosurify";
import { resolve, basename } from 'path';

export default function transformInsertDebugFunctionCode() {
    return {
        name: "insert-debug-function-code",
        transform(code, id) {
            const appFolderPath = resolve(process.cwd(), 'src', 'app');
            const fileInAppFolder = id.startsWith(appFolderPath);

            if (id.endsWith(".js") && fileInAppFolder) {
                const fileName = basename(id);
                const newCode = unclosurify(code, fileName);
                return { code: newCode, map: null };
            }
        },
    };
};