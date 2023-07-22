appendScript("https://unpkg.com/webamp").onload = () => {
    appendScript("https://unpkg.com/butterchurn"). onload = () => {
        appendScript("https://unpkg.com/butterchurn-presets").onload = () => {
            const app = document.createElement("div");
            app.style = "position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width:100%;height:100%;"
            app.id = "webamp";
            document.body.appendChild(app);
            const webamp = new Webamp({
                initialTracks: [
                    { "url": "/assets/songs/Andrea Baroni - Partially Offline.ogg"},
                    { "url": "/assets/songs/Aphex Twin - Rhubarb.ogg"},
                    { "url": "/assets/songs/Boards of Canada - Nothing is Real.ogg"},
                    { "url": "/assets/songs/Brookes Brothers - Not Just Yet.ogg"},
                    { "url": "/assets/songs/DJ Genericname - Dear You.ogg"},
                    { "url": "/assets/songs/DM DOKURO - Universal Collapse.ogg"},
                    { "url": "/assets/songs/Daft Punk - One More Time.ogg"},
                    { "url": "/assets/songs/Delta Heavy - Ghost.ogg"},
                    { "url": "/assets/songs/Demetori - 紅楼 〜 Eastern Dream.ogg"},
                    { "url": "/assets/songs/Dimitri From Paris - Neko Mimi Mode.ogg"},
                    { "url": "/assets/songs/Fearofdark - Rolling Down The Street, In My Katamari.ogg"},
                    { "url": "/assets/songs/Feint - Tower Of Heaven (You Are Slaves).ogg"},
                    { "url": "/assets/songs/Ghost - Lullaby.ogg"},
                    { "url": "/assets/songs/HOME - Dream Head.ogg"},
                    { "url": "/assets/songs/Joshua Morse - Stickerbush Symphony.ogg"},
                    { "url": "/assets/songs/Kikiyama - このまま、どこまでも〜ほうき飛行〜.ogg"},
                    { "url": "/assets/songs/LazerHawk - Cool Breeze.ogg"},
                    { "url": "/assets/songs/Michael Wyckoff - Bone Theme (Boneworks OST).ogg"},
                    { "url": "/assets/songs/PoP_X - Drogata Schifosa.ogg"},
                    { "url": "/assets/songs/PoP_X - Io Centro Con I Missili.ogg"},
                    { "url": "/assets/songs/PoP_X - Legoland.ogg"},
                    { "url": "/assets/songs/PoP_X - Paiazo.ogg"},
                    { "url": "/assets/songs/Rev ft. MAKI & R.Cena - Am I waiting on a Square Space [Swarce Museum].ogg"},
                    { "url": "/assets/songs/Scott Brown - Elysium Plus.ogg"},
                    { "url": "/assets/songs/Squarepusher - Beep Street.ogg"},
                    { "url": "/assets/songs/Windows96 - Rituals.ogg"},
                    { "url": "/assets/songs/kors k - smooooch.ogg"},
                    { "url": "/assets/songs/デ・ジ・キャラット - PARTY☆NIGHT-Hyper Parapara Version.ogg"},
                    { "url": "/assets/songs/化物語 - 素敵滅法.ogg"}
                    ],
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