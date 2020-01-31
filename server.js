const express = require("express");
const app = express();
const fs = require('fs');

// var content = fs.readFileSync('./data/history.txt', 'utf8', function(err, contents)
// {
//     if(err)
//     {
//         throw err;
//     }

//     console.log(contents);
// })

// var data = JSON.parse(content);

var historyContainer = 
{
    "chat" : []
};

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

io.sockets.on('connect', function(socket)
{
    var content = fs.readFileSync('./data/history.txt', 'utf8', function(err, contents)
    {
        if(err) throw err;
    });

    if(content)
    {
        console.log("load chat");
        var data = JSON.parse(content);
        socket.emit('connected', data);
    }
});

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
        historyContainer.chat.push({name : socket.username, text : data.text});

        fs.writeFile('./data/history.txt', JSON.stringify(historyContainer), function(err, data)
        {
            if(err) throw err;
        });
        io.sockets.emit("sended_text", {text : data.text, name: socket.username});
    });
    
    socket.broadcast.emit("userConnected", {name : name});

    socket.on('disconnect', function()
    {

    });
});
