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
		url = url ? url : window.location.href;
		return this.utils.contains(url, '/watch') &&
			   this.utils.contains(url, '&list=');
	},
	
	isWatchWithTime: function(url){
		url = url ? url : window.location.href;
		return this.utils.contains(url, '/watch') &&
			   this.utils.contains(url, '&t=');
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
		url = url ? url : window.location.href;
		if(this.isWatchWithList() || this.isListing()){
			return url.substr(url.indexOf('list=')+5, 34);
		}
		return "";
	},
	
	getTimeFromUrl: function(url){
		url = url ? url : window.location.href;
		let fulltime = url.substr(url.indexOf('t=')+2);
		if(fulltime.indexOf('&') != -1){
			fulltime = fulltime.substr(0, fulltime.indexOf('&'));
		}
		let time = 0;
		let readableTime = false;
		if(fulltime.indexOf("h") != -1){
			let hrs = fulltime.substr(0, fulltime.indexOf("h"));
			hrs++;
			hrs--;
			time += (hrs * 3600);
		}
		if(fulltime.indexOf("m") != -1){
			let mins = fulltime.substr(fulltime.indexOf("m")-2, fulltime.indexOf("m"));
			mins++;
			mins--;
			if(isNaN(mins)){
				let mins = fulltime.substr(fulltime.indexOf("m")-1, fulltime.indexOf("m"));
				mins++;
				mins--;
			}
			time += (mins * 60);
		}
		if(fulltime.indexOf("s") != -1){
			let secs = fulltime.substr(fulltime.indexOf("s")-2, fulltime.indexOf("s"));
			secs++;
			secs--;
			if(isNaN(sec)){
				let secs = fulltime.substr(fulltime.indexOf("m")-1, fulltime.indexOf("m"));
				secs++;
				secs--;
			}
			time += (secs * 60);
			return time;
		}
		fulltime++;
		fulltime--;
		return fulltime;
	},
}


yti.PlayerManager = {
	PLAYER_CONTAINER: "player-playlist",
	PAGE_NAME: "page",
		
	insertAPIHandoff: function(){
		let apiFns = 'var player;\
		function onYouTubePlayerCreatedSetQuality(event) {\
				event.target.setPlaybackQuality("hd1080");\
		}\
		function onYouTubePlayerStateChange(event){\
			if(event.data==1){\
				var vidData = event.target.getVideoData();\
				var newTitle = vidData.title + " - YouTube";\
				var newUrl = "https://www.youtube.com/watch?v="+vidData.video_id+"&list="+vidData.list;\
				history.pushState(vidData, newTitle, newUrl);\
				document.title = newTitle;\
			}\
		}\
		function onYouTubePlayerAPIReady() {\
			player = new YT.Player("player", {\
				videoId: "'+yti.YTUtils.getVideoIDUrl()+'",\
				playerVars: {\
					autoplay: 1,\
					modestbranding: 1,';
		if (this.ytutils.isWatchWithList()){
			script += 'listType: "playlist", list: "' +
					this.ytutils.getPlaylistFromUrl() + 
					'",';
		}
		if (this.ytutils.isWatchWithTime()){
			script += 'start: ' + this.ytutils.getTimeFromUrl();
		}
		script += '},\
				events:{\
					"onReady": onYouTubePlayerCreatedSetQuality,';
		if (this.ytutils.isWatchWithList()){
			script += '"onStateChange": onYouTubePlayerStateChange';
		}
		script += '},\
			});\
		}';
		yti.Utils.addScriptToPage(apiFns);
	},
	
	insertAPI: function(){
		yti.Utils.addScriptWebSourceToPage("https://www.youtube.com/player_api");
	},
	
	replacePlayer: function(){
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
};

if(yti.YTUtils.isWatch()){
	yti.PlayerManager.replacePlayer();
	yti.PlayerManager.initSizeManagement(window);
}
yti.Redirector.executeBarrierRedirect();
yti.PageCleaner.runElementDelete();
yti.RSSFeedLinker.addRSSFeed();
yti.LiveThumbnailer.initThumbs();
yti.SPFHandler.handleSPF();