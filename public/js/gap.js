
window.onload = function () {
  var elements = document.querySelectorAll('.demo-image');

  if (elements.length > 0)
    Intense(elements);

}

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

$(document).on('click', '#control_chat', function (e) {
  var svgControl=$(this).find("svg");
  var content=$(this).parent().find(".position-absolute");
  if (svgControl.hasClass('fa-angle-double-left')) {
    svgControl.removeClass('fa-angle-double-left');
    svgControl.addClass('fa-angle-double-right');
    content.removeClass('show');
  }else{
    svgControl.addClass('fa-angle-double-left');
    svgControl.removeClass('fa-angle-double-right');
    content.addClass('show');
  }
 
  
});

$(document).ready(function () {
  $("[data-toggle='popover']").each(function (i, obj) {
    $(this).popover({
      html: true,
      content: function () {
        var id = $(this).attr('id')
        return $('#popover-content-' + id).html();
      }
    });
  });
});
$(function () {
  var nua = navigator.userAgent
  var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
  if (isAndroid) {
    $('select.form-control').removeClass('form-control').css('width', '100%')
  }
});




