const input = document.querySelector("#terminal-input");

const cursor = localStorage.getItem("cursor");
if(cursor){
    document.head.innerHTML += '<link id="cursor" rel="stylesheet" href="/assets/cursors/'+cursor+'/cursor.css" type="text/css"/>';
}
function setCursor(cursor){
    document.querySelector("#cursor")?.remove()
    if(localStorage.getItem("cursor")!=cursor){
        document.head.innerHTML += '<link id="cursor" rel="stylesheet" href="/assets/cursors/'+cursor+'/cursor.css" type="text/css"/>';
        localStorage.setItem("cursor",cursor);
    }else{
        localStorage.setItem("cursor","");
    }
}

input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const command = input.value;
        console.log(command);
        input.value = "";
        switch (command) {
            case "koyuki": {
                setCursor("koyuki"); break;
            }
            case "maya": {
                setCursor("maya"); break;
            }
            case "rusk": {
                setCursor("rusk"); break;
            }
            case "chipdisko" : {
                if(!confirm("Epylepsy warning, are you sure you want to continue?")){break;}
                var s = document.createElement("script")
                s.type = "module"
                s.src = "/assets/mod.js"
                document.body.appendChild(s);
                document.head.innerHTML += '<link rel="stylesheet" href="/assets/rainbow.css">';
                break;
            }
            case "shake" : {
                document.head.innerHTML += '<link rel="stylesheet" href="/assets/shake.css">';
                break;
            }
            case "marquee" : {
                document.body.innerHTML = "<marquee> "+document.body.innerHTML+ "</marquee>"
                break;
            }

        }
    }
})