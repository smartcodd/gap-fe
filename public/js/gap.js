
$(document).on('click', '.navbar-toggler-iconn', function (e) {
    e.preventDefault();
    console.log("event.......")
    return false;
});

$(document).on('click', '.navbar-toggler', function (e) {
    //e.preventDefault();
    var $this = $(this);
    console.log("event.......")
    if (!$this.hasClass('collapsed')) {
        //$this.parents('.navbar').removeClass('navbar-light').addClass('navbar-inverse').addClass('bg-inverse');
        //$this.find('.navbar-toggler-icon').html('X');
        //$this.find('.navbar-toggler-icon').removeClass('navbar-toggler-icon').addClass('close');

    } else {
        //$this.parents('.navbar').removeClass('bg-inverse').removeClass('navbar-inverse').addClass('navbar-light');
        //$this.find('.close').html('');
        //$this.find('.close').removeClass('close').addClass('navbar-toggler-icon');
    }
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


