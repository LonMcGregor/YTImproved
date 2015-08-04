// ==UserScript==
// @name        YT Improved - Remove Elements
// @namespace   LonMcGregor.yt.removeElements
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// ==/UserScript==

function contains(haystack, needle){
	return (haystack.indexOf(needle) > -1);
}
var ELEMENTS_WATCH   = [
  "watch7-hidden-extras",  "watch-discussion", "watch7-preview", "watch-dislike", "watch-like", "watch7-sidebar",
  "placeholder-player"
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
  return (contains(url, 'user') || contains(url, 'channel') || contains(url, 'playlist') );
}
function isSearch(url){
  return contains(url, 'search');
}
function isWatch(url){
  return contains(url, 'watch');
}
function deleteElements(array){
  for(var i = 0; i < array.length; i++){
	  try {
		var el = document.getElementById(array[i]);
		el.parentElement.removeChild(el);
	  } catch (Exception) {
		  //Element doesn't exist or was already deleted
	  }
    //as Mark Henderson puts it, 'Javascript won't let an element commit suicide, but it does permit infanticide'
  }
}

function runElementDelete(){
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