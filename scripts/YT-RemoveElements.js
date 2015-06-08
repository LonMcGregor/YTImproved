// ==UserScript==
// @name        YT Improved - Remove Elements
// @namespace   LonMcGregor.yt.removeElements
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// ==/UserScript==

var ELEMENTS_WATCH   = [
   "watch7-hidden-extras",  "watch-discussion", "watch7-preview", "watch-dislike", "watch-like", "watch7-sidebar", 
];
var ELEMENTS_SEARCH  = [
    "player", "search-secondary-col-contents"  
];
var ELEMENTS_CHANNEL = [
  
];
var ELEMENTS_GLOBAL = [
  "early-body", "a11y-announcements-container","guide", "header", "history-iframe","masthead-positioner", 
  "masthead-positioner-height-offset", "footer-container","feed-privacy-lb", "hidden-component-template-wrapper",
  "alerts"
];

function isChannel(url){
  return (url.contains('user') || url.contains('channel'));
}
function isSearch(url){
  return url.contains('search');
}
function isWatch(url){
  //the chances of a url id number containing the string 'user' is extremely low. right?
  return url.contains('watch');
}
function deleteElements(array){
  for(var i = 0; i < array.length; i++){
    console.log("Deleting element #"+array[i]);
    document.getElementById(array[i]).parentElement.removeChild(document.getElementById(array[i]));
    //as Mark Henderson puts it, 'Javascript won't let an element commit suicide, but it does permit infanticide'
  }
}

function run(){
  if(isChannel(window.location.href)||isSearch(window.location.href)||isWatch(window.location.href))
    deleteElements(ELEMENTS_GLOBAL);
  if (isChannel(window.location.href))
    deleteElements(ELEMENTS_CHANNEL);
  else if(isSearch(window.location.href))
    deleteElements(ELEMENTS_SEARCH);
  else if(isWatch(window.location.href))
    deleteElements(ELEMENTS_WATCH);
}

run()