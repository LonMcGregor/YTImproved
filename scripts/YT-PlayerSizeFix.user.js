// ==UserScript==
// @name        Player Size Fix
// @namespace   LonMcGregor.yt.playersize
// @description Reset player size to screen size
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// ==/UserScript==

function o(s){
  console.log(s);
}
function deletePlaceholder(){
  var e = document.getElementById("placeholder-player");
  e.parentNode.removeChild(e);
}
function setPlayerApi(){
  o("Player Size: Player Set "+window.innerWidth+"x"+window.innerHeight);
  var e = document.getElementById("player-api").style;
  e.width = ""+window.innerWidth+"px";
  e.height = ""+window.innerHeight+"px";
}
function setControls(){
  o("Player Size: Video Controls Set");
  var e = document.getElementsByClassName('ytp-chrome-bottom')[0].style;
  e.width = "100%";
  e.left = "0px";
}
function setPlayer(){
  o("Player Size: Player Positioned");
  var e = document.getElementById("player").style;
  e.position = "absolute";
  e.top = "0px";
  e.left = "0px";
}
function setVideo(){
  o("Player Size: Video Size Set "+window.innerWidth+"x"+window.innerHeight);
  var e = document.getElementsByTagName("video")[0].style;
  e.width = ""+window.innerWidth+"px";
  e.height = ""+window.innerHeight+"px";
}
function setSizes(){
  setPlayerApi();
  setControls();
  setPlayer();
  setVideo();
}
function init(){
  window.onresize = function (e) {
    setSizes();
  };
  deletePlaceholder();
  setSizes();
}
init();