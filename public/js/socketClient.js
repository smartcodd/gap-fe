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

socket.on("nuevoMsg", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#msg_container");
    var source_reciver = document.querySelector("#msg_receiver").innerHTML;
    var template = Handlebars.compile(source_reciver);
    container.innerHTML = container.innerHTML + template(data);
});

$(document).on('click', '.panel-footer button.btn-chat', function (e) {
    var $this = $(this);
    var listInput = $this.parents('.panel-footer').find('.chat_input');
    if (listInput.length > 0) {
        msgInput = listInput[0].value;
        var data = {
            msg: msgInput
        };
        var container = document.querySelector("#msg_container");
        var source_send = document.querySelector("#msg_sent").innerHTML;
        var template = Handlebars.compile(source_send);
        container.innerHTML = container.innerHTML + template(data);
        socket.emit("nuevoMsg", JSON.stringify(data));
        listInput[0].value = "";
    }
    return false;
});


