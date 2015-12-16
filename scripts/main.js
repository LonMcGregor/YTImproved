/*
YT Improved
by LonMcGregor
See https://github.com/LonMcGregor/YTImproved/
*/
"use strict";

function Utils(){}
Utils.prototype = {
	contains: function(haystack, needle) {
		return (haystack.indexOf(needle) > -1);
	},
	
	timers: {},
	
	waitForFinalEvent: function (callback, ms, uniqueId) {
		if (!uniqueId) {
		  //uniqueId = "Don't call this twice without a uniqueId";
		}
		if (this.timers[uniqueId]) {
		  clearTimeout(this.timers[uniqueId]);
		}
		this.timers[uniqueId] = setTimeout(callback, ms);
	  }, //brahn on stackoverflow
	
	deleteElements: function(array){
		for(let i = 0; i < array.length; i++){
			try {
				this.deleteElementById(array[i]);
			} catch (Exception) {
				//Element doesn't exist or was already deleted
			}
		}
	},
	
	deleteElementById: function(id){
		let el = document.getElementById(id);
		el.parentElement.removeChild(el);
	},
}
var util = new Utils();


function YTUtils(){}
YTUtils.prototype = {
	utils: new Utils(),
	
	CHANNEL_TITLE: 'branded-page-header-title-link',
	EMBED_URL: "https://www.youtube.com/embed/",
	EMBED_PARAMS: "?autoplay=1",
	
	isChannel: function(url){
		url = url ? url : window.location.href;
		return (this.utils.contains(url, 'user') || 
		this.utils.contains(url, 'channel'));
	},
	
	isSearch: function(url){
		url = url ? url : window.location.href;
		return this.utils.contains(url, 'search');
	},
	
	isWatch: function(url){
		url = url ? url : window.location.href;
		return this.utils.contains(url, 'watch');
	},
	
	isListing: function(url){
		url = url ? url : window.location.href;
		return this.utils.contains(url, 'playlist');
	},
	
	getVideoIDUrl: function(url){
		url = url ? url : window.location.href;
		return url.substr(32,11);
	},

	newEmbeddedUrl: function(videoID){
		videoID = videoID ? videoID : this.getVideoIDUrl();
		return this.EMBED_URL+
		    videoID+this.EMBED_PARAMS;
	},
	
	extractChannelIDFromChannelUrl: function(channelURL){
		channelURL = channelURL ? channelURL : window.location.href;
		return channelURL.split("/")[4];
	},
	
	getChannelIDFromChannelTitle: function(){
		let channelTitle = document.getElementsByClassName(this.CHANNEL_TITLE)[0];
		if(typeof channelTitle != "undefined"){
			return this.extractChannelIDFromChannelUrl(channelTitle.href);
		}
		return "";
	},

	getChannelIDFromPlayer: function(){
		let metaDataTags = document.getElementsByTagName('meta');
		if(typeof metaDataTags == "undefined"){
			return "";
		}
		for (let i=0; i<metaDataTags.length; i++) { 
			if (metaDataTags[i].getAttribute("itemprop") == "channelId") { 
				return metaDataTags[i].getAttribute("content"); 
			} 
		}
		return "";
	},
}
var ytutils = new YTUtils();


function PlayerManager(){}
PlayerManager.prototype = {
	utils: new Utils(),
	ytutils: new YTUtils(),
		
	setSize: function(){
		let player = document.getElementById("player").style;
		player.position = "fixed";
		player.width = ""+window.innerWidth+"px";
		player.height = ""+window.innerHeight+"px";
		player.top = "0px";
		player.left = "0px";
	},
	
	initManagement: function(){
		window.onresize = function (e) {
			util.waitForFinalEvent( function(){
			  sizer.setSize();
			}, 80, "resizeme");
		};
		this.setSize();
	},
}
var playerman = new PlayerManager();


function PageCleaner(){}
PageCleaner.prototype = {
	utils: new Utils(),
	ytutils: new YTUtils(),
	
	ELEMENTS_WATCH: [
	  "watch7-hidden-extras",  "watch-discussion", "watch7-preview", "watch-dislike", "watch-like", "watch7-sidebar","masthead-positioner",
	  "placeholder-player"
	],
	
	ELEMENTS_SEARCH: [
		"player", "search-secondary-col-contents"  
	],
	
	ELEMENTS_CHANNEL: [],
	
	ELEMENTS_GLOBAL: [
	  "early-body", "a11y-announcements-container","guide", "history-iframe",/* */
	  "masthead-positioner-height-offset", "footer-container","feed-privacy-lb", "hidden-component-template-wrapper",
	  "alerts"
	],
	
	runElementDelete: function(){
		if(this.ytutils.isChannel()||this.ytutils.isSearch()||this.ytutils.isWatch()){
			this.utils.deleteElements(this.ELEMENTS_GLOBAL);
		}
		if (this.ytutils.isChannel()||this.ytutils.isListing()){
			this.utils.deleteElements(this.ELEMENTS_CHANNEL);
		}else if(this.ytutils.isSearch()){
			this.utils.deleteElements(this.ELEMENTS_SEARCH);
		}else if(this.ytutils.isWatch()){
			this.utils.deleteElements(this.ELEMENTS_WATCH);
		}
	},
}
var pagecleaner = new PageCleaner();


function Redirector(){}
Redirector.prototype = {
	util: new Utils(),
	ytutils: new YTUtils(),
	
	REDIR_TOK: "&redir_token",
	REDIR_URL: "/redirect?q=",
	
	doRedirect: function(newLocation){
		window.location.href = newLocation;
	},
	
	getBarrierUrl: function(url){
		url = url ? url : window.location.href;
		let notoken = url.split(this.REDIR_TOK)[0];
		let encodedurl = notoken.split(this.REDIR_URL)[1];
		return decodeURIComponent(encodedurl);
	},

	checkForBarrierRedirect: function(){
		if(this.util.contains(window.location.href, this.REDIR_URL)){
			this.doRedirect(this.getBarrierUrl());
		}
	},
}
var redirector = new Redirector();


function LiveThumnailer(){}
LiveThumnailer.prototype = {
	ytutils: new YTUtils(),
	
	THUMB_CLASS: 'yt-lockup-thumbnail',
	
	initThumbs: function(){
		let thumbs = document.getElementsByClassName(this.THUMB_CLASS);
		for(let i = 0; i < thumbs.length; i++){
			if(this.isActuallyAThumbnail(thumbs[i])){
				this.changeThumb(thumbs[i]);
			}
		}
	},
	
	isActuallyAThumbnail: function(thumb){
		let linkURL = thumb.getElementsByTagName('a')[0].href;
		return this.ytutils.isWatch(linkURL);
	},

	changeThumb: function(thumb){
	  let button = this.makeButton(thumb);
	  thumb.appendChild(button);
	},

	makeButton: function(container){
		let button = document.createElement("button");
		button.style.float = "left";
		button.style.position = "relative";
		button.style.top = "-20px;";
		button.style.background = "black";
		button.style.color = "white";
		button.innerHTML = "&gt;";
		let iframedom = this.makeIframe(container).outerHTML;
		button.onclick = function (){
			button.parentElement.innerHTML = iframedom;
		};
		return button;
	},
	 
	getUrl: function(container){
	  let bigUrl = container.getElementsByTagName('a')[0].href;
	  return this.ytutils.newEmbeddedUrl(this.ytutils.getVideoIDUrl(bigUrl));
	},

	makeIframe: function(container) {
	  let iframe = document.createElement("iframe");
	  iframe.src = this.getUrl(container);
	  iframe.height = "100%";
	  iframe.width = "100%";
	  return iframe;
	},
}
var thumbs = new LiveThumnailer();


function RSSFeedLinker(){}
RSSFeedLinker.prototype = {
	ytutils: new YTUtils(),
	
	XML_CHANNEL: 'https://www.youtube.com/feeds/videos.xml?channel_id=',
	XML_LEGACY_USER: 'https://www.youtube.com/feeds/videos.xml?user=',
	PLAYER_HEADER: 'watch7-user-header',
	CHANNEL_HEADER: 'c4-primary-header-contents',
	BUTTON_CLASS: "yt-uix-button-content",
	
	addRSSFeed: function(){
		if(this.ytutils.isChannel()||this.ytutils.isListing()){
			let channelId = this.ytutils.getChannelIDFromChannelTitle();
			let feedURL = this.createFeedURL(channelId)
			this.addFeedElementToChannel(feedURL);
		} else if(this.ytutils.isWatch()){
			let channelId = this.ytutils.getChannelIDFromPlayer();
			let feedURL = this.createFeedURL(channelId)
			this.addFeedElementToPlayer(feedURL);
		}
	},

	createFeedURL: function(channelID){
		if(channelID.substr(0,2)==="UC" && channelID.length == 24 ){
			return this.XML_CHANNEL+channelID;
		}else{
			return this.XML_LEGACY_USER+channelID;
		}
	},
	
	addFeedElementToPlayer: function(feedURL){
		let link = this.createFeedElement(feedURL);
		document.getElementById(this.PLAYER_HEADER).appendChild(link);
	},
	
	addFeedElementToChannel: function(feedURL){
		let link = this.createFeedElement(feedURL);
		document.getElementById(this.CHANNEL_HEADER).appendChild(link);
	},
	
	createFeedElement: function(feedURL){
		let link = document.createElement('a');
		link.setAttribute("href", feedURL);
		link.innerHTML = "RSS Feed: Uploads";
		link.setAttribute("class", this.BUTTON_CLASS);
		return link;
	},

}
var rssfeeder = new RSSFeedLinker();


//borrowed from https://github.com/klemens/ff-youtube-all-html5/
//which was inspired by YePpHa's YouTubeCenter (https://github.com/YePpHa/YouTubeCenter)
function SPFHandler(){}
SPFHandler.prototype = {
	handleSPF: function(){
		let scriptText = 'if(typeof window.spf!="undefined"){window.spf.dispose();}';
		let s = document.createElement('script');
		s.textContent = scriptText;
		document.documentElement.appendChild(s);
	},
}
var spfhandler = new SPFHandler();

function playerReplacer(){
	//params from page: playlist, time params as count, time params as #h#m#s
	var tag = document.createElement('script');
	tag.textContent = 'var player;\
	function onYouTubePlayerCreatedSetQuality(event) {\
			console.log("thing");\
			event.target.setPlaybackQuality("hd1080");\
	} \
	function onYouTubePlayerAPIReady() {\
		player = new YT.Player("player", {\
			videoId: "'+ytutils.getVideoIDUrl()+'",\
			playerVars: {\
				autoplay: 1,\
				modestbranding: 1,\
				disablekb: 0,\
			},\
			events:{\
				"onReady": onYouTubePlayerCreatedSetQuality\
			},\
		});\
	}'; 
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

redirector.checkForBarrierRedirect();
pagecleaner.runElementDelete();
thumbs.initThumbs();
rssfeeder.addRSSFeed();
if(ytutils.isWatch()){
	playerReplacer();
	playerman.initManagement();
}
spfhandler.handleSPF();