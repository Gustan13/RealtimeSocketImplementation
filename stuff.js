var user = 0
var velocity = [0, 0]

const socket = io()

const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");

const sendButton = document.getElementById("send")
const input = document.getElementById("input")

function send() {
    socket.emit("send message", user, input.value)
}

socket.on("draw", (entities) => {
    const keys = Object.keys(entities)
    // ctx.fillStyle = "white"
    ctx.clearRect(0, 0, 200, 200)
    socket.emit("move", user, velocity[0], velocity[1])
    console.log(velocity)
    ctx.fillStyle = "black"
    ctx.font = "15px Consolas"
    keys.forEach(function (item, index) {
        ctx.fillRect(entities[item][0], entities[item][1], 20, 20)
        ctx.fillText(entities[item][2], entities[item][0], entities[item][1] - 10)
    })
})

socket.on("connection", (id) => {
    user = id
})

function left() {
    velocity[0] = -1
}

function right() {
    velocity[0] = 1
}

function up() {
    velocity[1] = -1
}

function down() {
    velocity[1] = 1
}

document.onkeydown = (e) => {
    switch (e.code) {
        case "ArrowLeft":
            left()
            break;
        case "ArrowRight":
            right()
            break;
        case "ArrowUp":
            up()
            break;
        case "ArrowDown":
            down()
            break;
    }
}

document.onkeyup = (e) => {
    switch (e.code) {
        case "ArrowLeft":
            velocity[0] = 0
            break;
        case "ArrowRight":
            velocity[0] = 0
            break;
        case "ArrowUp":
            velocity[1] = 0
            break;
        case "ArrowDown":
            velocity[1] = 0
            break;
    }
}
