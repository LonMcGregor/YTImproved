/*
YT Improved
by LonMcGregor
See https://github.com/LonMcGregor/YTImproved/
*/
"use strict";

var yti = yti || {};

yti.Utils = {
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
			this.deleteElementById(array[i]);
		}
	},
	
	deleteElementById: function(id){
		try{
			let el = document.getElementById(id);
			el.parentElement.removeChild(el);
		} catch (Exception) {
			//Element doesn't exist or was already deleted
		}
	},
	
	getUrl: function(){
		return window.location.href;
	},
}


yti.YTUtils = {	
	CHANNEL_TITLE: 'branded-page-header-title-link',
	EMBED_URL: "https://www.youtube.com/embed/",
	EMBED_PARAMS: "?autoplay=1",
	
	isChannel: function(url){
		url = url ? url : yti.Utils.getUrl();
		return (yti.Utils.contains(url, '/user/') || 
		yti.Utils.contains(url, '/channel/'));
	},
	
	isSearch: function(url){
		url = url ? url : yti.Utils.getUrl();
		return yti.Utils.contains(url, '/results');
	},
	
	isWatch: function(url){
		url = url ? url : yti.Utils.getUrl();
		return yti.Utils.contains(url, '/watch');
	},
	
	isListing: function(url){
		url = url ? url : yti.Utils.getUrl();
		return yti.Utils.contains(url, '/playlist');
	},
	
	getVideoIDUrl: function(url){
		url = url ? url : yti.Utils.getUrl();
		if(url.indexOf("v=") == -1){
			return "";
		}
		return url.substr(url.indexOf("v=")+2,11);
	},

	newEmbeddedUrl: function(videoID){
		videoID = videoID ? videoID : this.getVideoIDUrl();
		return this.EMBED_URL+
		    videoID+this.EMBED_PARAMS;
	},
	
	extractChannelIDFromChannelUrl: function(channelURL){
		channelURL = channelURL ? channelURL : yti.Utils.getUrl();
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


yti.PlayerManager = {
	PLAYER_CONTAINER: "player-playlist",
	PAGE_NAME: "page",
	
	preservePlaylist: function (){
		let playlist = document.getElementById(this.PLAYER_CONTAINER);
		document.getElementById(this.PAGE_NAME).appendChild(playlist);
	},
	
	insertAPIHandoff: function(){
		let tag = document.createElement('script');
		tag.textContent = 'var player;\
		function onYouTubePlayerCreatedSetQuality(event) {\
				event.target.setPlaybackQuality("hd1080");\
		} \
		function onYouTubePlayerAPIReady() {\
			player = new YT.Player("player", {\
				videoId: "'+yti.YTUtils.getVideoIDUrl()+'",\
				playerVars: {\
					autoplay: 1,\
					modestbranding: 1,\
				},\
				events:{\
					"onReady": onYouTubePlayerCreatedSetQuality\
				},\
			});\
		}'; 
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	
	insertAPI: function(){
		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/player_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	
	replacePlayer: function(){
		this.preservePlaylist();
		this.insertAPIHandoff();
		this.insertAPI();
	},
	
	setSize: function(){
		let player = document.getElementById("player").style;
		player.position = "fixed";
		player.width = ""+window.innerWidth+"px";
		player.height = ""+window.innerHeight+"px";
		player.top = "0px";
		player.left = "0px";
	},
	
	initSizeManagement: function(){
		window.onresize = function (e) {
			util.waitForFinalEvent( function(){
			  playerman.setSize();
			}, 80, "resizeme");
		};
		this.setSize();
	},
}


yti.PageCleaner = {
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
		if(yti.YTUtils.isChannel()||yti.YTUtils.isSearch()||yti.YTUtils.isWatch()){
			yti.Utils.deleteElements(this.ELEMENTS_GLOBAL);
		}
		if (yti.YTUtils.isChannel()||yti.YTUtils.isListing()){
			yti.Utils.deleteElements(this.ELEMENTS_CHANNEL);
		}else if(yti.YTUtils.isSearch()){
			yti.Utils.deleteElements(this.ELEMENTS_SEARCH);
		}else if(yti.YTUtils.isWatch()){
			yti.Utils.deleteElements(this.ELEMENTS_WATCH);
		}
	},
}


yti.Redirector = {
	REDIR_TOK: "&redir_token",
	REDIR_URL: "/redirect?q=",
	
	doRedirect: function(newLocation){
		yti.Utils.getUrl() = newLocation;
	},
	
	getBarrierUrl: function(url){
		url = url ? url : yti.Utils.getUrl();
		let notoken = url.split(this.REDIR_TOK)[0];
		let encodedurl = notoken.split(this.REDIR_URL)[1];
		return decodeURIComponent(encodedurl);
	},

	checkForBarrierRedirect: function(){
		if(yti.Utils.contains(yti.Utils.getUrl(), this.REDIR_URL)){
			this.doRedirect(this.getBarrierUrl());
		}
	},
}


yti.LiveThumnailer = {	
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
		return yti.YTUtils.isWatch(linkURL);
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
	  return yti.YTUtils.newEmbeddedUrl(yti.YTUtils.getVideoIDUrl(bigUrl));
	},

	makeIframe: function(container) {
	  let iframe = document.createElement("iframe");
	  iframe.src = this.getUrl(container);
	  iframe.height = "100%";
	  iframe.width = "100%";
	  return iframe;
	},
}


yti.RSSFeedLinker = {	
	XML_CHANNEL: 'https://www.youtube.com/feeds/videos.xml?channel_id=',
	XML_LEGACY_USER: 'https://www.youtube.com/feeds/videos.xml?user=',
	PLAYER_HEADER: 'watch7-user-header',
	CHANNEL_HEADER: 'c4-primary-header-contents',
	BUTTON_CLASS: "yt-uix-button-content",
	
	addRSSFeed: function(){
		if(yti.YTUtils.isChannel()||yti.YTUtils.isListing()){
			let channelId = yti.YTUtils.getChannelIDFromChannelTitle();
			let feedURL = this.createFeedURL(channelId)
			this.addFeedElementToChannel(feedURL);
		} else if(yti.YTUtils.isWatch()){
			let channelId = yti.YTUtils.getChannelIDFromPlayer();
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


yti.SPFHandler = {
	handleSPF: function(){
		let scriptText = 'if(typeof window.spf!="undefined"){window.spf.dispose();}';
		let s = document.createElement('script');
		s.textContent = scriptText;
		document.documentElement.appendChild(s);
	},
};


if(yti.YTUtils.isWatch()){
	yti.PlayerManager.replacePlayer();
	yti.PlayerManager.initSizeManagement();
}
yti.Redirector.checkForBarrierRedirect();
yti.PageCleaner.runElementDelete();
yti.RSSFeedLinker.addRSSFeed();
yti.LiveThumnailer.initThumbs();
yti.SPFHandler.handleSPF();