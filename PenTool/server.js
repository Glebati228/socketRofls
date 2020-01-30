const express = require("express");
const app = express();

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

app.get('/', function(req, res)
{
    res.render('index');   
})
server = app.listen(process.env.PORT || 3000, function()
{
    console.log("server is running...");
});

const io = require("socket.io")(server);
io.sockets.on("connection", function(socket)
{
    var name = (socket.id).toString().toUpperCase();
    socket.username = name;

    socket.on("change_username", function(data)
        {
            io.sockets.emit("changedName", { oldName : socket.username, newName : data.username});
            socket.username = data.username;
        });

    socket.on("send_text", (data) =>
    {
        io.sockets.emit("sended_text", {text : data.text, name: socket.username});
    });
    
    socket.broadcast.emit("userConnected", {name : name});
});
