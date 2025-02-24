import { io, Socket } from "socket.io-client"

var user: number = 0
var velocity: number[] = [0, 0]
var position: number[] = [0, 0]
var text: string = ""

const socket: Socket = io()

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

const input: HTMLInputElement = document.getElementById("input") as HTMLInputElement

function send() {
    socket.emit("send message", user, input.value)
    text = input.value
    input.value = ""
}

function localDraw() {
    position[0] += velocity[0]
    position[1] += velocity[1]
    socket.emit("move", user, velocity[0], velocity[1])
    ctx.clearRect(0, 0, 200, 200)
    ctx.fillStyle = "black"
    ctx.font = "15px Consolas"
    ctx.fillRect(position[0], position[1], 20, 20)
    ctx.fillText(text, position[0], position[0] - 10)
}

socket.on("draw", (entities) => {
    const keys: string[] = Object.keys(entities)
    localDraw()
    keys.forEach(function (item, index) {
        if (item != socket.id) {
            ctx.fillRect(entities[item][0], entities[item][1], 20, 20)
            ctx.fillText(entities[item][2], entities[item][0], entities[item][1] - 10)
        }
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

