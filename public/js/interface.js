function fadeColor(id, property, color) {
    var oProperty = $('#'+id+'').css(property);

    $('#'+id+'').css(property, color);
    setTimeout(function() {
      $('#'+id+'').css(property, oProperty);
    },1000);
}

function loadingView(show) {
  if (show == true) {
    hideMenu(true);
    $('#splashscreenView').show(500);
  } else {
    hideMenu(false);
    $('#splashscreenView').hide(500);
  }
}

function lobbyView(show) {
  if (show == true) {
    hideMenu(true);
    $('#lobbyView').css('display', 'flex');
    $('#lobbyView').css('flex-direction', 'column');
    $('#lobbyView').show(500);
  } else {
    hideMenu(false);
    $('#lobbyView').hide(500);
  }
}

function hideMenu(wrapper) {

  if (wrapper == true) {
    $('.wrapper').hide(500);
  } else {
    $('#menuView').hide(500);
    $('.footerDiv').hide(500);
  }
}


function popup(show, pText) {

  if (show == true) {
    $('.loader').hide(0);
    $('#popupText').html(pText);
    $('.popupDiv').css('display', 'flex');
    $('.popupDiv').show(200);
  } else {
    $('.popupDiv').hide(200);
  }

}
