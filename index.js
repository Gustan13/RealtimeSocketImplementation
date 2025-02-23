const express = require("express")
const { createServer } = require("node:http")
const { join } = require("node:path")
const { Server } = require("socket.io")

const app = express()
const server = createServer(app)
const io = new Server(server)

var entities = {}

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "/index.html"))
})
app.use("/", express.static(join(__dirname, ".")))

io.on("connection", (socket) => {
    socket.emit("connection", socket.id)
    entities[socket.id] = [0, 0, ""]
    console.log("user has connected")
    console.log(entities)
    socket.on("disconnect", () => {
        delete entities[socket.id]
        console.log(entities)
        console.log("user disconnected")
    })
    socket.on("move", (id, x, y) => {
        entities[id][0] += x
        if (entities[id][0] > 200) {
            entities[id][0] = -20
        } else if (entities[id][0] < -20) {
            entities[id][0] = 200
        }

        entities[id][1] += y
        if (entities[id][1] > 200) {
            entities[id][1] = -20
        } else if (entities[id][1] < -20) {
            entities[id][1] = 200
        }
    })
    socket.on("send message", (id, msg) => {
        entities[id][2] = msg
    })
})

function update() {
    io.emit("draw", (entities))
}

const interval = setInterval(update, 20)

server.listen(3000, () => {
    console.log("server running at http://localhost:3000")
})