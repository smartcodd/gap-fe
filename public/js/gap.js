
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
