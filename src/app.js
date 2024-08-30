const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const path = require("path")
const { Server } = require("socket.io")
const handlebars = require("express-handlebars")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

//Configurar handlebars
app.engine("handlebars", handlebars.engine())
//Carpeta Views para vistas
app.set("views", __dirname + "/views")
//Usa handlebars para motor de plantillas
app.set("views engine", "handlebars")
//Usa los archivos dentro de la carpeta views
app.use(express.static(__dirname + "/views"))
//Usamos los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")))

//Ruta principal
app.get("/", (req, res)=>{
    res.render("index.hbs")
})

const users = {}

//Socket.io

io.on("connection", (socket)=>{
    console.log("un usario se ha conectado");
    socket.on("newUser",(username)=>{
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    //El usuario emite un mensaje
    socket.on("chatMessage", (message)=>{
        const username = users[socket.id]
        io.emit("message", { username, message })
    })

    socket.on("disconnect",()=>{
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("usersDisconnect", username)
    })

})

//Server
const PORT = 8080
server.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})