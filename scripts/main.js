// ==UserScript==
// @name        YT Improved
// @namespace   LonMcGregor.yt.improved
// @description Set of improvements for viewing youtube
// @include     https://www.youtube.com/*
// @version     1.0
// @grant       none
// ==/UserScript==

//Player Pages

function contains(haystack, needle){
	return (haystack.indexOf(needle) > -1);
}
var waitForFinalEvent = (function () { //brahn on stackoverflow
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

function setPlayerApi(){
  var e = document.getElementById("player-api").style;
  e.width = ""+window.innerWidth+"px";
  e.height = ""+window.innerHeight+"px";
}
function setControls(){
  var e = document.getElementsByClassName('ytp-chrome-bottom')[0].style;
  e.width = "100%";
  e.left = "0px";
}
function setPlayer(){
  var e = document.getElementById("player").style;
  e.position = "absolute";
  e.top = "0px";
  e.left = "0px";
}
function setVideo(){
  var e = document.getElementsByTagName("video")[0].style;
  e.width = ""+window.innerWidth+"px";
  e.height = ""+window.innerHeight+"px";
}
function setSizes(){
	if(isWatch(window.location.href)){
		setPlayerApi();
		setControls();
		setPlayer();
		setVideo();
	}
}
function initSizing(){
  window.onresize = function (e) {
    waitForFinalEvent( function(){
      setSizes();
    }, 20, "resizeme");
    
  };
  setSizes();
}


//Delete elements

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


//redirection [age limits no login]

function getVideoIDUrl(){
  return window.location.href.substr(32,11);
}

function newAgeUrl(old){
  return "https://www.youtube.com/embed/"+old+"?autoplay=1";
}

function redirectAge(){
  window.location.href = newAgeUrl(getVideoIDUrl());
}

function checkForAgeRedir(){
  if (document.getElementById("watch7-player-age-gate-content"))
    return true;
  return false;
}

//redirection description links

function getRedirectUrl(url){
	var notoken = url.split("&redir_token")[0];
	var encodedurl = notoken.split("/redirect?q=")[1];
	return decodeURIComponent(encodedurl);
}

function doRedirectUrl(){
	window.location.href = getRedirectUrl(window.location.href);
}

function checkForUrlRedirect(){
	return window.location.href.contains("redirect?q")
}


//live thumbs

function initThumbs(){
  var thumbs = document.getElementsByClassName('yt-lockup-thumbnail');
  for(var i = 0; i < thumbs.length; i++){
    changeThumb(thumbs[i]);
  }
}

function changeThumb(thumb){
  var button = makeButton(thumb);
  thumb.appendChild(button);
}

function makeButton(container){
	var button = document.createElement("button");
	button.style = "float: left;position: relative;top: -20px;background: black;color: white;";
	button.innerHTML = "&gt;";
	button.onclick = function (){
		button.parentElement.innerHTML = makeIframe(container).outerHTML;
	};
	return button;
}
 
function getUrl(container){
  var bigUrl = container.getElementsByTagName('a')[0].href;
  return "https://youtube.com/embed/"+bigUrl.substr(32,11)+"?autoplay=1";
}

function makeIframe(container) {
  var iframe = document.createElement("iframe");
  iframe.src = getUrl(container);
  iframe.height = "100%";
  iframe.width = "100%";
  return iframe;
}

//rss feed link
function addRSSFeed(){
	if(isChannel(window.location.href)){
		var channelId = extractChannelIDFromChannelUrl(window.location.href);
		var feedURL = createFeedURL(channelId)
		addFeedElementToChannel(feedURL);
	} else if(isWatch(window.location.href)){
		var channelId = getChannelIDFromPlayer();
		var feedURL = createFeedURL(channelId)
		addFeedElementToPlayer(feedURL);
	}
}

function createFeedURL(channelID){
	if(channelID.substr(0,2)==="UC" && channelID.length == 24 ){
		return 'https://www.youtube.com/feeds/videos.xml?channel_id='+channelID;
	}else{
		return 'https://www.youtube.com/feeds/videos.xml?user='+channelID;
	}
}
function addFeedElementToPlayer(feedURL){
	var link = createFeedElement(feedURL);
	document.getElementById('watch7-user-header').appendChild(link);
}
function addFeedElementToChannel(feedURL){
	var link = createFeedElement(feedURL);
	document.getElementById('c4-primary-header-contents').appendChild(link);
}
function createFeedElement(feedURL){
	var link = document.createElement('a');
	link.setAttribute("href", feedURL);
	link.innerHTML = "RSS Feed: Uploads";
	link.setAttribute("class", "yt-uix-button-content");
	return link;
}

function extractChannelIDFromChannelUrl(channelURL){
	return channelURL.split("/")[4];
}

function getChannelIDFromPlayer(){
	var metaDataTags = document.getElementsByTagName('meta'); 
	for (i=0; i<metaDataTags.length; i++) { 
		if (metaDataTags[i].getAttribute("itemprop") == "channelId") { 
			return metaDataTags[i].getAttribute("content"); 
		} 
	} 
	return "";
}

//force 1080p, from http://www.autohdforyoutube.com/
function onYouTubePlayerReady(player) {
	playbackSet = false;
	extPlayer = player;
	extPlayer.addEventListener("onStateChange", function(newState){
		if(newState == 3 && !playbackSet){
			updateQuality();
		}
		if(newState == -1){
			playbackSet = false;
		}
	});
	updateQuality();
};

function updateQuality(){
	var aq = extPlayer.getAvailableQualityLevels();
	var q = (aq.indexOf(quality) == -1) ? aq[0] : quality;
	extPlayer.setPlaybackQuality(q);
	playbackSet = true;
};

function initHDQuality(){
	var quality = "hd1080";
	var scriptText = "var quality = '" + quality + "'; " + onYouTubePlayerReady.toString() + "; " + updateQuality.toString();
	var s = document.createElement("script");
	s.textContent = scriptText;
	document.documentElement.appendChild(s);
}

//init
if (checkForAgeRedir()) {
  redirectAge();
}
if(checkForUrlRedirect()){
	doRedirectUrl();
}
runElementDelete();
initThumbs();
initSizing();
addRSSFeed();
if(isWatch(window.location.href)){
	initHDQuality();
}