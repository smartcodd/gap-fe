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
    var $link = $(".chat_" + data._id);
    if ($link) {
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
        $link.html(template(data));
    }

});
socket.on("newclientconnect", function (data) {
    var $link = $(".chat_" + data);
    var $svgCont = $link.find("svg");
    $svgCont.attr('data-prefix', "fas");
    $svgCont.addClass('text-success');
    var $time = $link.find('.timeConeccted');
    $time.addClass('hide');
});
socket.on("newclientdesconnect", function (dates) {
    dates = JSON.parse(dates);
    var $link = $(".chat_" + dates.id);
    var $svgCont = $link.find("svg");
    $svgCont.attr('data-prefix', "far");
    $svgCont.removeClass('text-success');
    var $time = $link.find('.timeConeccted');
    var timeDisconected = dates.date;
    $time.removeClass('hide');
});

socket.on("nuevoMsg", function (data) {
    data = JSON.parse(data);
    var container = document.querySelector("#msg_container");
    var source_reciver = document.querySelector("#msg_receiver").innerHTML;
    var template = Handlebars.compile(source_reciver);
    container.innerHTML = container.innerHTML + template(data);
});
socket.on("filterSearchResult", function (data) {
    data = JSON.parse(data);
    var containerMsg = $('.result-users');
    var html = "";
    data.forEach(element => {
        var msg_template = document.querySelector("#filter_result").innerHTML;
        var template = Handlebars.compile(msg_template);
        html += template(element);
    });
    containerMsg.html(html);
});

socket.on("createChat", function (data) {
    data = JSON.parse(data);
    var classId = ".chat-" + data._id;
    var layoutChat = $(classId);
    if (layoutChat.length == 0) {
        var size = $(".chat:last-child").css("margin-left");
        if (size)
            size_total = parseInt(size) + 230;
        else
            size_total = 0;
        var container = document.querySelector("body");
        var source_reciver = document.querySelector("#chat_windows").innerHTML;
        var template = Handlebars.compile(source_reciver);
        container.innerHTML = container.innerHTML + template(data);


        var chat = $(".chat-" + data._id);
        var chatBody=$("#chat-body-"+data._id);
        var controlChat=chat.find(".chat-minus");
        chat.css("margin-left", size_total);
        if (!chatBody.hasClass('show')) {
            chatBody.addClass('show');
            controlChat.removeClass("fa-plus-square").addClass("fa-minus");
        }
        
        var html = "";
        data.msgs.forEach(element => {
            var msg_template = document.querySelector("#chat_msg").innerHTML;
            var template = Handlebars.compile(msg_template);
            html += template(element);
        });
        chatBody.html(html);
    } else {

        var chat=$(".chat-"+data._id);
        var chatBody=$("#chat-body-"+data._id);
        var controlChat=chat.find(".chat-minus");
        if (chatBody.hasClass('show')) {
            chatBody.addClass('show');
            controlChat.removeClass("fa-plus-square").addClass("fa-minus");
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
            amigo: chat[0].value,
            to: to[0].value
        };
        var container = $this.parents('.panel-default').find('.chat-body');
        var source_send = document.querySelector("#msg_sent").innerHTML;
        var template = Handlebars.compile(source_send);
        container.html(container.html() + template(data));
        socket.emit("nuevoMsg", JSON.stringify(data));
        listInput[0].value = "";
    }
    return false;
});
var timeoutSeachFriens;
$(document).on('keypress', '#txt_filter_search', function (e) {
    var $this = $(this);
    clearTimeout(timeoutSeachFriens);
    timeoutSeachFriens = setTimeout(function () {
        socket.emit("filterSearch", $this[0].value);
    }, 2000);
});




