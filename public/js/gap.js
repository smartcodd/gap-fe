

$(document).on('click', '.navbar-toggle', function (e) {
    //e.preventDefault();
    //e.preventDefault();
    var $this = $(this);
    if ($($this).hasClass('collapsed')) {
        $this.parents('.navbar').removeClass('navbar-inverse').removeClass('bg-inverse').addClass('navbar-light').addClass('bg-light');
        //$($this).removeClass('collapsed');
    } else {
        $this.parents('.navbar').removeClass('navbar-light').removeClass('bg-light').addClass('navbar-inverse').addClass('bg-inverse');
        //$($this).addClass('collapsed');
    }
    console.log($this.parents('.navbar'))

});
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

$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $("#chat_window_1").remove();
});


