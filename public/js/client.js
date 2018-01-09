var socket = io();
var logi_id = "";
$(document).on('click', '.panel-heading span.icon_minim', function (e) {

    var $this = $(this);
    console.log($this)
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
    var nodeMini = $this.parents('.panel').find('.icon_minim');
    if (nodeMini.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        nodeMini.removeClass('panel-collapsed');
        nodeMini.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $(".chat-window:last-child").css("margin-left");
    if (size)
        size_total = parseInt(size) + 400;
    else
        size_total = 420;
    var clone = $("#chat_window_base").clone();
    clone.appendTo("#container_gap");
    clone.css("margin-left", size_total);
    clone.css("display", "");
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
$(document).on('click', '.panel-footer button.btn-chat', function (e) {
    var $this = $(this);
    var listInput = $this.parents('.panel-footer').find('.chat_input');
    if (listInput.length > 0) {
        msgInput = listInput[0].value;
        var user_id = document.getElementById("hiddenSecret").value;
        var data = {
            msg: msgInput,
            user_id: user_id
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


