
window.onload = function () {
  var elements = document.querySelectorAll('.demo-image');
  if (elements.length > 0)
    Intense(elements);
}

$(document).on('focus', '.chat-footer input.chat_input', function (e) {
  var $this = $(this);
  var controlChat = $this.parents('.chat').find('.chat-minus');
  var chatBody = $this.parents('.chat').find('.chat-body');
  chatBody.addClass("show");
  controlChat.removeClass("fa-plus-square").addClass("fa-minus");
});

$(document).on('click', '.chat_icon_close', function (e) {
  e.preventDefault();
  $(this).parents('.chat').remove();
});

$(document).on('click', '.chat_icon_minim', function (e) {
  var $this = $(this);
  var controlChat = $this.find(".chat-minus");
  if (controlChat.hasClass('fa-plus-square')) {
    controlChat.removeClass("fa-plus-square").addClass("fa-minus");
  } else {
    controlChat.removeClass("fa-minus").addClass("fa-plus-square");
  }
});

$(document).on('click', '#control_chat', function (e) {
  var svgControl = $(this).find("svg");
  var content = $(this).parent().find(".position-absolute");
  if (svgControl.hasClass('fa-angle-double-left')) {
    svgControl.removeClass('fa-angle-double-left');
    svgControl.addClass('fa-angle-double-right');
    content.removeClass('show');
  } else {
    svgControl.addClass('fa-angle-double-left');
    svgControl.removeClass('fa-angle-double-right');
    content.addClass('show');
  }
});

var timingMsgError;
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
  if ($(".msg-error") != undefined) {
    
    clearTimeout(timingMsgError);
    timingMsgError = setTimeout(function () {
      $(".msg-error").toggle(1000, "swing", function () {

      })
    }, 5000);
  }
});

$(function () {
  var nua = navigator.userAgent
  var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
  if (isAndroid) {
    $('select.form-control').removeClass('form-control').css('width', '100%')
  }
});