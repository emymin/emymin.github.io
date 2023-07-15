const max_length = 60;
const first_line = document.getElementById("first");
const second_line = document.getElementById("second");
const socket = new WebSocket("ws://localhost:8080/");
var word_buffer = [];
var char_buffer = [];
var has_finished_buffer = false;

socket.onmessage = function (event) {
    var message = event.data;
    word_buffer = word_buffer.concat(message.split(" "))
};

function shift_line() {
    second_line.innerHTML = first_line.innerHTML;
    Array.from(second_line.children).forEach(
        element => element.classList = "received go-up"
    )
    first_line.innerHTML = "";
}

function add_character(character) {
    const p = document.createElement("p");
    p.classList = "received shake";
    if (character === "&nbsp;") {
        p.innerHTML = character;
    } else {
        p.textContent = character;
    }
    first_line.appendChild(p);
}

function draw_letters() {
    if (char_buffer.length == 0) {
        if (word_buffer.length == 0) { return; }

        char_buffer = word_buffer[0].split("");
        word_buffer.shift();

        if (has_finished_buffer) {
            shift_line();
            has_finished_buffer = false;
        }
    }

    const character = char_buffer[0];
    console.log(character);
    char_buffer.shift();
    add_character(character);

    if (char_buffer.length == 0) {
        add_character("&nbsp;");
        if (first_line.childElementCount > max_length) {
            shift_line();
        }
        if (word_buffer.length == 0) {
            has_finished_buffer = true;
            const first_scheduled_to_delete = Array.from(first_line.children);
            const second_scheduled_to_delete = Array.from(second_line.children);
            setTimeout(() => {
                first_scheduled_to_delete.forEach(element => first_line.removeChild(element));
                second_scheduled_to_delete.forEach(element => second_line.removeChild(element));
            }, 5000)
        }
    }
}

setInterval(draw_letters, 100);