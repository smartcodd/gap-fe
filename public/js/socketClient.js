var socket = io();
socket.on("new imagen", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#container");
    var source = document.querySelector("#image-template").innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML += template(data);
});
socket.on("updateChatStatus", function (data) {
    data = JSON.parse(data);
    console.log(data)
    var container = $(".btn_cone" + data._id);
    if (container) {
        var parent = container.parents('.sidebar-name');
        var source = document.querySelector("#user_connect").innerHTML;
        var template = Handlebars.compile(source);
        console.log(template(data))
        parent.innerHTML = template(data);
        console.log("processdo cron")
    }

});
socket.on("newclientconnect", function (data) {
    var divUser = $(".btn_cone" + data)
    if (divUser.hasClass('btn-default')) {
        divUser.removeClass('btn-default').addClass('btn-success');
    }
    var time = divUser.parents('.sidebar-name').find('.timeConeccted');
    if (time)
        time.css("display", "none");
});
socket.on("newclientdesconnect", function (dates) {
    dates = JSON.parse(dates);
    var divUser = $(".btn_cone" + dates.id)
    if (divUser.hasClass('btn-success')) {
        divUser.removeClass('btn-success').addClass('btn-default');
    }
    var time = divUser.parents('.sidebar-name').find('.timeConeccted');
    var timeDisconected = dates.date;
    if (time) {
        time.css("display", "default");
    }
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


