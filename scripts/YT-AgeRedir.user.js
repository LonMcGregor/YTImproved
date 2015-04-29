// ==UserScript==
// @name        YT Age Redir
// @namespace   LonMcGregor.yt.ageredir
// @description Redirect on age prompt
// @include     https://www.youtube.com/watch*
// @version     1
// @grant       none
// ==/UserScript==


function o(s) {
  console.log(s);
}

function getUrl(){
  return window.location.href.substr(32,11);
}

function newUrl(old){
  return "https://www.youtube.com/embed/"+old+"?autoplay=1";
}

function redirect(){
  o("script running for "+getUrl());
  window.location.href = newUrl(getUrl());
}

function check(){
  o("script checking");
  if (document.getElementById("watch7-player-age-gate-content"))
    return true;
  return false;
}

o("script fired");
  if (check())
    redirect();
