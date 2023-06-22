const input = document.querySelector("#terminal-input");
input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const command = input.value;
        console.log(command);
        input.value = "";
        switch (command) {
            case "koyuki": {
                document.querySelector("#cursor")?.remove()
                document.head.innerHTML += '<link id="cursor" rel="stylesheet" href="/assets/cursors/koyuki/cursor.css" type="text/css"/>'; break;
            }
            case "maya": {
                document.querySelector("#cursor")?.remove()
                document.head.innerHTML += '<link id="cursor" rel="stylesheet" href="/assets/cursors/maya/cursor.css" type="text/css"/>'; break;
            }
            case "rusk": {
                document.querySelector("#cursor")?.remove()
                document.head.innerHTML += '<link id="cursor" rel="stylesheet" href="/assets/cursors/rusk/cursor.css" type="text/css"/>'; break;
            }
        }
    }
})