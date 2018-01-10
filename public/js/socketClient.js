var socket = io();
socket.on("new imagen", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#container");
    var source = document.querySelector("#image-template").innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML += template(data);
});
socket.on("greeting", function (data) {
    console.log("... lega msg " + data)
});
socket.on("login", function (data) {
    data = JSON.parse(data);
    if (socket.id == data.id_socket) {
        logi_id = data.id_;
        alert(logi_id)
    }
    console.log("... lega msg,,,,,,,,,,,,,,,,,,,,,,,, " + data)
});
socket.on("nuevoMsg", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#msg_container");
    var source_reciver = document.querySelector("#msg_receiver").innerHTML;
    var template = Handlebars.compile(source_reciver);
    container.innerHTML = container.innerHTML + template(data);
});


