var user = 0
var velocity = [0, 0]
var position = [0, 0]
var text = ""

const socket = io()

const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")

const input = document.getElementById("input")

var localEntities = {}

function send() {
    socket.emit("send message", user, input.value)
    text = input.value
    input.value = ""
}

function localDraw() {
    ctx.clearRect(0, 0, 200, 200)

    position[0] += velocity[0]
    position[1] += velocity[1]
    ctx.fillStyle = "black"
    ctx.font = "15px Consolas"
    ctx.fillRect(position[0], position[1], 20, 20)
    ctx.fillText(text, position[0], position[1] - 10)

    const keys = Object.keys(localEntities)
    keys.forEach(function (item, index) {
        ctx.fillRect(localEntities[item][0], localEntities[item][1], 20, 20)
        ctx.fillText(localEntities[item][2], localEntities[item][0], localEntities[item][1] - 10)
    })
}

socket.on("draw", (entities) => {
    const keys = Object.keys(entities)

    socket.emit("move", user, position[0], position[1])
    keys.forEach((item, index) => {
        if (item == socket.id)
            return
        if (!(item in localEntities))
            localEntities[item] = [0, 0, ""]
        localEntities[item][0] = entities[item][0]
        localEntities[item][1] = entities[item][1]
        localEntities[item][2] = entities[item][2]
    })
    console.log(localEntities)
    // console.log(entities)

    const localKeys = Object.keys(localEntities)
    localKeys.forEach((item, index) => {
        if (item in entities)
            return
        delete localEntities[item]
    })
})

socket.on("connection", (id) => {
    user = id
})

const interval = setInterval(localDraw, 1)

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
    if (user == 0)
        return

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

