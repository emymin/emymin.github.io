appendScript("https://unpkg.com/webamp").onload = () => {
    appendScript("https://unpkg.com/butterchurn"). onload = () => {
        appendScript("https://unpkg.com/butterchurn-presets").onload = () => {
            const app = document.createElement("div");
            app.style = "position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width:100%;height:100%;"
            app.id = "webamp";
            document.body.appendChild(app);
            const webamp = new Webamp({
                initialTracks: [],
                __butterchurnOptions: {
                    importButterchurn: () => Promise.resolve(window.butterchurn),
                    getPresets: () => {
                        const presets = window.butterchurnPresets.getPresets();
                        return Object.keys(presets).map((name) => {
                            return {
                                name,
                                butterchurnPresetObject: presets[name]
                            };
                        });
                    },
                    butterchurnOpen: true
                },
                __initialWindowLayout: {
                    main: { position: { x: 0, y: 0 } },
                    equalizer: { position: { x: 0, y: 116 } },
                    playlist: { position: { x: 0, y: 232 }, size: [0, 4] },
                    milkdrop: { position: { x: 275, y: 0 }, size: [7, 12] }
                }
            });
            webamp.renderWhenReady(app);
        }
    }
}