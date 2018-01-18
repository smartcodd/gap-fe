var socket = io();
socket.on("new imagen", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#container");
    var source = document.querySelector("#image-template").innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML += template(data);
});
var redondearTiempo = function (tiempo, division) {
    var retorno = tiempo / division;
    retorno = retorno.toFixed(0);
    return retorno
}
socket.on("updateChatStatus", function (data) {
    data = JSON.parse(data);
    var container = $(".btn_cone" + data._id);
    if (container) {
        var parent = container.parents('.sidebar-name');
        var source = document.querySelector("#user_connect").innerHTML;
        var template = Handlebars.compile(source);
        var tiempoConectado = "";
        var tiempoSeg = redondearTiempo(data.tiempo_current, 1000);
        if (tiempoSeg < 60) {
            tiempoConectado = tiempoSeg + " seg";
        }
        else {
            var tiempoMinutos = redondearTiempo(tiempoSeg, 60);
            if (tiempoMinutos < 60) {
                tiempoConectado = tiempoMinutos + " min";
            }
            else {
                var tiempoHoras = redondearTiempo(tiempoMinutos, 60);
                if (tiempoHoras < 24) {
                    tiempoConectado = tiempoHoras + " h";
                }
                else {
                    var tiempoDias = redondearTiempo(tiempoHoras, 24);
                    if (tiempoDias < 7) {
                        tiempoConectado = tiempoDias + " d";
                    }
                    else {
                        var tiempoSemanas = redondearTiempo(tiempoDias, 7)
                        if (tiempoSemanas < 4) {
                            tiempoConectado = tiempoSemanas + " sem";
                        }
                        else {
                            var tiempoMeses = redondearTiempo(tiempoSemanas, 4);
                            if (tiempoMeses < 12) {
                                tiempoConectado = tiempoMeses + " meses";
                            }
                            else {
                                var tiempoAnios = redondearTiempo(tiempoSemanas, 12);
                                tiempoConectado = tiempoAnios + " años";
                            }
                        }
                    }
                }
            }
        }
        data.tiempo_current = tiempoConectado;
        parent.html(template(data));
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
socket.on("createChat", function (data) {
    data = JSON.parse(data);
    console.log(data)
    var classId = ".chat_" + data._id;
    var layoutChat = $(classId);
    if (layoutChat.length == 0) {
        var size = $(".chat-window:last-child").css("margin-left");
        if (size)
            size_total = parseInt(size) + 350;
        else
            size_total = 0;
        var container = document.querySelector("#container_gap");
        var source_reciver = document.querySelector("#chat_windows").innerHTML;
        var template = Handlebars.compile(source_reciver);
        container.innerHTML = container.innerHTML + template(data);
        var classId = ".chat_" + data._id;
        var chat = $(classId);
        chat.css("margin-left", size_total);
        chat.css("display", "");
        if (chat.hasClass('panel-collapsed')) {
            chat.removeClass('panel-collapsed');
            chat.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    
    } else {
        if (layoutChat.hasClass('panel-collapsed')) {
            layoutChat.removeClass('panel-collapsed');
            layoutChat.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    }
});
function register_popup(id) {
    socket.emit("openChat", id);

}

$(document).on('click', '.panel-footer button.btn-chat', function (e) {
    var $this = $(this);
    var listInput = $this.parents('.panel-footer').find('.chat_input');
    if (listInput.length > 0) {
        msgInput = listInput[0].value;
        var chat = $this.parents('.panel-default').find('.hidden-reg');
        var to = $this.parents('.panel-default').find('.target_to');
        var data = {
            msg: msgInput,
            amigo:chat[0].value,
            to:to[0].value
        };
        var container = $this.parents('.panel-default').find('.msg_container_base');
        var source_send = document.querySelector("#msg_sent").innerHTML;
        var template = Handlebars.compile(source_send);
        container.html(container.html() + template(data));
        socket.emit("nuevoMsg", JSON.stringify(data));
        listInput[0].value = "";
    }
    return false;
});



