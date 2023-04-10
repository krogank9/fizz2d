// vite.config.js
import hmrAcceptWithClassListPlugin from "./src/debugger/plugins/vite-plugin-hmr-accept-with-class-list";
import transformInsertDebugFunctionCode from "./src/debugger/plugins/vite-plugin-insert-debug-function-code";
import react from "@vitejs/plugin-react";

export default {
    plugins: [
        hmrAcceptWithClassListPlugin(),
        transformInsertDebugFunctionCode(),
        react()
    ],
    hmr: true
};
