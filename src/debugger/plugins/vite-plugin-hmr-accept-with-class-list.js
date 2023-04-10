export default function hmrAcceptWithClassListPlugin() {
    return {
        name: "hmr-get-file",
        async handleHotUpdate({ file, modules, read, server }) {
            let code = await read();
            //console.log(code)
            server.ws.send({
                type: "custom",
                event: "hmr-get-file",
                data: {fileName: file, fileCode: code},
            });
            return modules;
        },
    };
}
