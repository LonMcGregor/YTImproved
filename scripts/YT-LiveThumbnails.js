// ==UserScript==
// @name        YT Live Thumbs
// @namespace   LonMcGregor.yt.livethumbs
// @description Make thumbnails on youtube live
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// @require     https://ajax.microsoft.com/ajax/jquery/jquery-1.4.4.min.js
// ==/UserScript==

//init
function doThumbs(){
  var thumbs = document.getElementsByClassName('yt-lockup-thumbnail');
  for(var i = 0; i < thumbs.length; i++){
    changeThumb(thumbs[i]);
  }
}

//change a thumbnail [thumbnail]
function changeThumb(thumb){
  var button = makeButton(thumb);
  $(thumb).append(button);
}

//make a button [video url, thumbnail image container]
function makeButton(container){
  var button = $('<button style="float: left;position: relative;top: -20px;background: black;color: white;">&gt;</button>');
  $(button).click(function (){
    $(this.parentElement).html(makeIframe(container));
  });
  return button;
}
 
//get the vid url
function getUrl(container){
  var bigUrl = container.getElementsByTagName('a')[0].href;
  return "https://youtube.com/embed/"+bigUrl.substr(32,11)+"?autoplay=1";
}

//generate an iframe [video url, thumbnail image container]
function makeIframe(container) {
  return $('<iframe src="'+getUrl(container)+'"></iframe>');
}

doThumbs();