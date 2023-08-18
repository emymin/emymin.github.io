const input = document.createElement("input");
input.type = "text";
input.id = "terminal-input";
input.maxLength = "100";
input.ariaLabel = "Terminal Prompt";
document.querySelector("#footer").appendChild(input);
//<input type="text" id="terminal-input" maxlength="100" aria-label="Terminal Prompt">
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

function appendScript(src,isModule){
    const s = document.createElement("script");
    if(isModule){
        s.type = "module";
    }
    s.src = src;
    document.body.appendChild(s);
    return s;
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
                appendScript("/assets/mod.js",true);
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
            case "winamp" : {
                appendScript("/assets/webamp.js");
                break;
            }

        }
    }
})