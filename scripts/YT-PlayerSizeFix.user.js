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
function setPlayer(){
  o("setting player size");
  var e = document.getElementById("player").style;
  e.width = ""+window.innerWidth+"px";
  e.marginBottom = "10px";
  e.marginTop = "0px";
  e.maxWidth = "none";
}
function setAPI(){
  o("setting player-api size");
  var e = document.getElementById("player-api").style;
  e.float = "none";
  e.margin = "auto" ;
  e.width = ""+window.innerWidth+"px";
  e.height = ""+window.innerHeight +"px";
  e.overflow = "hidden";
}
function setContent(){
  o("setting content size");
  var e = document.getElementById("content").style;
  e.height = ""+window.innerHeight +"px";
}
function setSizes(){
  setPlayer();
  setAPI();  
  setContent();
}
function init(){
  o("playerwidth script started");
  window.onresize = function (e) {
    setSizes();
  };
  setSizes();
}
init();