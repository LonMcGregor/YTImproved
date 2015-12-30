/*
YT Improved
by LonMcGregor
See https://github.com/LonMcGregor/YTImproved/
*/
"use strict";

var yti = yti || {};

yti.Player = {};

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
	
	setUrl: function(newLocation){
		window.location.href = newLocation;
	},
	
	addScriptToPage: function(scriptContent){
		let tag = document.createElement('script');
		tag.textContent = scriptContent;
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	
	addScriptWebSourceToPage: function(scriptSrc){
		let tag = document.createElement('script');
		tag.src = scriptSrc;
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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
	
	isWatchWithList: function(url){
		url = url ? url : yti.Utils.getUrl();
		return yti.Utils.contains(url, '/watch') &&
			   yti.Utils.contains(url, '&list=');
	},
	
	isWatchWithTime: function(url){
		url = url ? url : yti.Utils.getUrl();
		return yti.Utils.contains(url, '/watch') &&
			   yti.Utils.contains(url, '&t=');
	},
	
	isListing: function(url){
		url = url ? url : yti.Utils.getUrl();
		return yti.Utils.contains(url, '/playlist');
	},
	
	getVideoIDUrl: function(url){
		url = url ? url : yti.Utils.getUrl();
		return url.substr(url.indexOf("v=")+2,11);
	},

	getEmbedUrlForID: function(videoID){
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
	
	getPlaylistFromUrl: function(url){
		url = url ? url : yti.Utils.getUrl();
		return url.substr(url.indexOf('list=')+5, 34);
	},
	
	getTimeFromUrl: function(url){
		url = url ? url : yti.Utils.getUrl();
		let fullUrlAtTime = url.substr(url.indexOf('t=')+2);
		if(yti.Utils.contains(fullUrlAtTime, "&")){
			fullUrlAtTime = fullUrlAtTime.substr(0, fullUrlAtTime.indexOf("&"));
		}
		let regNoTime = /\d+\b/g;
		let regSec = /\d+?s/g;
		let regMin = /\d+?m/g;
		let regHr = /\d+?h/g;
		let regResults = regNoTime.exec(fullUrlAtTime);
		if(regResults != null){
			console.log(parseInt(regResults[0]));
			return parseInt(regResults[0]);
		}
		let time = 0;
		regResults = regSec.exec(fullUrlAtTime);
		if(regResults != null){
			console.log(parseInt(regResults[0]));
			time += parseInt(regResults[0]);
		}
		regResults = regMin.exec(fullUrlAtTime);
		if(regResults != null){
			console.log(parseInt(regResults[0]));
			time += (parseInt(regResults[0]) * 60);
		}
		regResults = regHr.exec(fullUrlAtTime);
		if(regResults != null){
			console.log(parseInt(regResults[0]));
			time += (parseInt(regResults[0]) * 3600);
		}
		return time;
	},
}


yti.PlayerManager = {
	PLAYER_CONTAINER: "player-playlist",
	PAGE_NAME: "page",
	
	onYouTubePlayerCreatedSetQuality: function(e){
		e.target.setPlaybackQuality("hd1080");
	},
	
	onYouTubePlayerStateChange: function(e){
		if(e.data==1){
			let vidData = e.target.getVideoData();
			let newTitle = vidData.title + " - YouTube";
			let newUrl = "https://www.youtube.com/watch?v="+vidData.video_id+"&list="+vidData.list;
			history.pushState(vidData, newTitle, newUrl);
			document.title = newTitle;
		}
	},
	
	onYouTubePlayerAPIReady: function(){
		let apiParams = {};
		let apiPlayerVars = {};
		let apiEvents = {};
		apiPlayerVars.autoplay = 1;
		apiPlayerVars.modestbranding = 1;
		apiEvents.onReady = yti.PlayerManager.onYouTubePlayerCreatedSetQuality;
		if (yti.YTUtils.isWatchWithList()){
			apiPlayerVars.listType = "playlist";
			apiPlayerVars.list = yti.YTUtils.getPlaylistFromUrl();
			apiEvents.onStateChange = yti.PlayerManager.onYouTubePlayerStateChange;
		}
		if (yti.YTUtils.isWatchWithTime()){
			apiPlayerVars.start = yti.YTUtils.getTimeFromUrl();
		}
		apiParams.videoId = yti.YTUtils.getVideoIDUrl();
		apiParams.playerVars = apiPlayerVars;
		apiParams.events = apiEvents;
		yti.Player = new YT.Player("placeholder-player", apiParams);
	},
	
	insertAPIHandoff: function(){
		yti.Utils.addScriptToPage("");
	},
	
	insertAPI: function(){
		yti.Utils.addScriptWebSourceToPage("https://www.youtube.com/player_api");
	},
	
	replacePlayer: function(){
		yti.Utils.deleteElementById("player");
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
	
	initSizeManagement: function(w){
		w.onresize = function (e) {
			yti.Utils.waitForFinalEvent( function(){
			  yti.PlayerManager.setSize();
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
	
	getBarrierUrl: function(url){
		url = url ? url : yti.Utils.getUrl();
		let notoken = url.split(this.REDIR_TOK)[0];
		let encodedurl = notoken.split(this.REDIR_URL)[1];
		return decodeURIComponent(encodedurl);
	},

	executeBarrierRedirect: function(){
		if(yti.Utils.contains(yti.Utils.getUrl(), this.REDIR_URL)){
			yti.Utils.setUrl(this.getBarrierUrl());
		}
	},
}


yti.LiveThumbnailer = {	
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
		let thumbUrl = this.getUrl(thumb);
		let iframedom = this.makeIframe(thumbUrl).outerHTML;
		let button = this.makeButton(iframedom);
		thumb.appendChild(button);
	},

	makeButton: function(iframedom){
		let button = document.createElement("button");
		button.style.float = "left";
		button.style.position = "relative";
		button.style.top = "-20px;";
		button.style.background = "black";
		button.style.color = "white";
		button.innerHTML = "&gt;";
		button.onclick = function (){
			button.parentElement.innerHTML = iframedom;
		};
		return button;
	},
	 
	getUrl: function(container){
	  let bigUrl = container.getElementsByTagName('a')[0].href;
	  return yti.YTUtils.getEmbedUrlForID(yti.YTUtils.getVideoIDUrl(bigUrl));
	},

	makeIframe: function(url) {
	  let iframe = document.createElement("iframe");
	  iframe.src = url;
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
		yti.Utils.addScriptToPage('if(typeof window.spf!="undefined"){window.spf.dispose();}');
	},
}

function onYouTubePlayerAPIReady(){
	yti.PlayerManager.onYouTubePlayerAPIReady();
}

if(yti.YTUtils.isWatch()){
	yti.PlayerManager.replacePlayer();
	yti.PlayerManager.initSizeManagement(window);
}
yti.Redirector.executeBarrierRedirect();
yti.PageCleaner.runElementDelete();
yti.RSSFeedLinker.addRSSFeed();
yti.LiveThumbnailer.initThumbs();
yti.SPFHandler.handleSPF();