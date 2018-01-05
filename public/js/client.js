var socket = io();
socket.on("new imagen", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#container");
    var source = document.querySelector("#image-template").innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML += template(data);
});
something = function () {
    console.log(".... 1 Emite e cleinte un msg.....")
    socket.emit("chat message", document.getElementById("chatm").value);
    return false;
}

socket.on("chat message", function (data) {
    console.log("...3 recibe los demas el msg " + data)
});
socket.on('message', function (data) { console.log(data) });
socket.on('connection', function (socket) {
    console.log('a user connected cli');
    socket.on('disconnect', function () {
        console.log('user disconnected cli');
    });
});

