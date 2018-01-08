var socket = io();
var logi_id = "";
$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $(".chat-window:last-child").css("margin-left");
    if(size)
        size_total = parseInt(size) + 400;
    else
        size_total =  420;
    console.log(size_total);
    var clone = $("#chat_window_1").clone().appendTo(".container");
    clone.css("margin-left", size_total);
    if (clone.hasClass('panel-collapsed')) {
        clone.removeClass('panel-collapsed');
        clone.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $("#chat_window_1").remove();
});

socket.on("new imagen", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#container");
    var source = document.querySelector("#image-template").innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML += template(data);
});
sendMsg = function () {
    var data = {
        msg: document.getElementById("btn-input").value
    };
    var container = document.querySelector("#msg_container");
    var source_send = document.querySelector("#msg_sent").innerHTML;
    var template = Handlebars.compile(source_send);
    container.innerHTML = container.innerHTML + template(data);
    //console.log(socket.id)
    socket.emit("nuevoMsg", document.getElementById("btn-input").value);
    document.getElementById("btn-input").value = "";
    return false;
}
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


