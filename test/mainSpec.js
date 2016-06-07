var user = "https://www.youtube.com/user/kurtjmac";
var channel = "https://www.youtube.com/channel/UC1Un5592U9mFx5n6j2HyXow";
var userid = "kurtjmac";
var channelid = "UC1Un5592U9mFx5n6j2HyXow";
var watch = "https://www.youtube.com/watch?v=BPCUWebOick";
var watchTime0 = "https://www.youtube.com/watch?v=BPCUWebOick&t=50";
var time0 = 50;
var watchTimeHMS = "https://www.youtube.com/watch?v=BPCUWebOick&t=1h42m3s";
var timeHMS = 6123;
var videoID = "BPCUWebOick";
var watchList = "https://www.youtube.com/watch?v=BPCUWebOick&list=PLvxoDthI6hljEr8upu4XycKEIyvdCCgtP";
var embeddedVideo = "https://www.youtube.com/embed/BPCUWebOick?autoplay=1";
var search = "https://www.youtube.com/results?search_query=kurtjmac";
var playlist ="https://www.youtube.com/playlist?list=PLvxoDthI6hljEr8upu4XycKEIyvdCCgtP";
var playlistID = "PLvxoDthI6hljEr8upu4XycKEIyvdCCgtP";
var channelRss= 'https://www.youtube.com/feeds/videos.xml?channel_id=';
var userRss= 'https://www.youtube.com/feeds/videos.xml?user=';
var playerHeader= 'watch7-user-header';
var channelHeader= 'c4-primary-header-contents';
var buttonClass= "yt-uix-button-content";
var redirectUrl = "https://www.youtube.com/redirect?q=http%3A%2F%2Ffarlandsorbust.com%2F&redir_token=0DpfRQe1s6lEXh4IP7QwKtydHdt8MTQ1MDk2NDIxMEAxNDUwODc3ODEw";
var expectedRedirectUrl = "http://farlandsorbust.com/";
var thumbClass = 'yt-lockup-thumbnail';
var qualityString = "hd1080";
var playerDomLocation = "player";
var disableQueryA = "https://www.youtube.com/watch?v=BPCUWebOick&noyti=1";
var disableQueryB = "https://www.youtube.com/watch?v=BPCUWebOick&t=60s&noyti=1";

describe("yti", function(){
	it("exists", function(){
		expect(yti).toBeDefined();
	});
});

describe("yti.Utils", function() {
	
	describe("contains", function() {
		it("returns true if string x contains string y", function() {
			expect(yti.Utils.contains("haystack", "hay")).toBe(true);
		});
		
		it("returns false if string x doesnt contain string y", function() {
			expect(yti.Utils.contains("haystack", "needle")).toBe(false);
		});
	});
		
	describe("deleteElements", function() {
		var elements;
		var el1;
		var el2;
		
		beforeEach(function() {
			el1 = document.createElement('div');
			el1.id = "testingDiv";
			document.body.appendChild(el1);
			el1 = document.getElementById("testingDiv");
			el2 = document.createElement('h1');
			el2.id = "testingH1";
			document.body.appendChild(el2);
			el2 = document.getElementById("testingH1");
			elements = [el1, el2];
		});
		
		afterEach(function() {
			el1.parentElement.removeChild(el1);
			el2.parentElement.removeChild(el2);
		});
		
		it("deletes all elements in an array of dom elements", function(){
			yti.Utils.deleteElements(elements);
			expect(document.getElementById("testingDiv")).toBeNull();
			expect(document.getElementById("testingH1")).toBeNull();
			pending("DOM modification");
		});
		
		it("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			el2.parentElement.removeChild(el2);
			yti.Utils.deleteElements(elements);
			pending("DOM modification");
		});
	});
	
	describe("deleteElementById", function() {
		var el1, elementlist;
		
		beforeEach(function() {
			el1 = document.createElement('div');
			el1.id = "testingDiv";
			document.body.appendChild(el1);
			el1 = document.getElementById("testingDiv");
		});
		
		afterEach(function() {
			el1.parentElement.removeChild(el1);
		});
		
		it("deletes a single element", function(){
			elementlist = [el1];
			yti.Utils.deleteElements(elementlist);
			expect(document.getElementById("testingDiv")).toBeNull();
			pending("DOM modification");
		});
		
		it("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			yti.Utils.deleteElements(elementlist);
			pending("DOM modification");
		});
	});
	
	describe("getUrl", function(){
		it("gets window.location.href", function(){
			pending("global window access");
		});
	});
	
	describe("setUrl", function(){
		it("sets a new window.location.href", function(){
			pending("global window access");
		});
	});
	
	describe("addScriptToPage", function(){
		it("adds a script to the page, given content", function(){
			pending("DOM modification");
		});
	});
	
	describe("addScriptWebSourceToPage", function(){
		it("adds a script to the page, given content", function(){
			pending("DOM modification");
		});
	});
});

describe("yti.YTUtils", function(){
	
	describe("isChannel", function(){
		it("returns true if the url contains user", function(){
			expect(yti.YTUtils.isChannel(user)).toBe(true);
		});
		
		it("returns true if the url contains channel", function(){
			expect(yti.YTUtils.isChannel(channel)).toBe(true);
		});
		
		it("returns false otherwise", function(){
			expect(yti.YTUtils.isChannel(watch)).toBe(false);
		});
		
		it("reads the current page url if one is not passed and returns true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(user);
			expect(yti.YTUtils.isChannel()).toBe(true);
		});
		
		it("reads the current page url if one is not passed and returns false", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.isChannel()).toBe(false);
		});
	});
	
	describe("isSearch", function(){
		it("returns true if passed a search url", function(){
			expect(yti.YTUtils.isSearch(search)).toBe(true);
		});
		
		it("returns false if not passed a search url", function(){
			expect(yti.YTUtils.isSearch(watch)).toBe(false);
		});
		
		it("reads current url if none passed condition true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(search);
			expect(yti.YTUtils.isSearch()).toBe(true);
		});
		
		it("reads current url if none passed condition false", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.isSearch()).toBe(false);
		});
	});
	
	describe("isWatch", function(){
		it("returns true if passed a watch url", function(){
			expect(yti.YTUtils.isWatch(watch)).toBe(true);
		});
		
		it("returns false if not passed a watch url", function(){
			expect(yti.YTUtils.isWatch(search)).toBe(false);
		});
		
		it("reads current url if none passed condition true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.isWatch()).toBe(true);
		});
		
		it("reads current url if none passed condition false", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(search);
			expect(yti.YTUtils.isWatch()).toBe(false);
		});
	});
	
	describe("isWatchWithList", function(){
		it("returns true if passed a watch url with a list", function(){
			expect(yti.YTUtils.isWatchWithList(watchList)).toBe(true);
		});
		
		it("returns false if not passed a watch url with a list", function(){
			expect(yti.YTUtils.isWatchWithList(watch)).toBe(false);
		});
		
		it("reads current url if none passed condition true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watchList);
			expect(yti.YTUtils.isWatchWithList()).toBe(true);
		});
		
		it("reads current url if none passed condition false", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.isWatchWithList()).toBe(false);
		});
	});
	
	describe("isWatchWithTime", function(){
		it("returns true if passed a watch url with a xxx time", function(){
			expect(yti.YTUtils.isWatchWithTime(watchTime0)).toBe(true);
		});
		
		it("returns true if passed a watch url with a xhxmxs time", function(){
			expect(yti.YTUtils.isWatchWithTime(watchTimeHMS)).toBe(true);
		});
		
		it("returns false if not passed a watch url with a xxx time", function(){
			expect(yti.YTUtils.isWatchWithTime(watch)).toBe(false);
		});
		
		it("reads current url if none passed condition xxx true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watchTime0);
			expect(yti.YTUtils.isWatchWithTime()).toBe(true);
		});
		
		it("reads current url if none passed condition xhxmxs true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watchTimeHMS);
			expect(yti.YTUtils.isWatchWithTime()).toBe(true);
		});
		
		it("reads current url if none passed condition false", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.isWatchWithTime()).toBe(false);
		});
	});
	
	describe("isListing", function(){
		it("returns true if passed a playlist url", function(){
			expect(yti.YTUtils.isListing(playlist)).toBe(true);
		});
		
		it("returns false if not passed a playlist url", function(){
			expect(yti.YTUtils.isListing(search)).toBe(false);
		});
		
		it("reads current url if none passed condition true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(playlist);
			expect(yti.YTUtils.isListing()).toBe(true);
		});
		
		it("reads current url if none passed condition false", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(search);
			expect(yti.YTUtils.isListing()).toBe(false);
		});
	});
	
	describe("getVideoIDUrl", function(){
		it("returns video id when passed a video url", function(){
			expect(yti.YTUtils.getVideoIDUrl(watch)).toEqual(videoID);
		});
		
		it("reads current url if none passed", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.getVideoIDUrl()).toEqual(videoID);
		});
	});
	
	describe("getEmbedUrlForID", function(){
		it("returns autplaying embedded url version when passed a video id", function(){
			expect(yti.YTUtils.getEmbedUrlForID(videoID)).toEqual(embeddedVideo);
		});
		
		it("reads current url if none passed condition true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.getEmbedUrlForID()).toEqual(embeddedVideo);
		});
	});
	
	describe("extractChannelIDFromChannelUrl", function(){
		it("returns channel id when passed a channel url", function(){
			expect(yti.YTUtils.extractChannelIDFromChannelUrl(channel)).toEqual(channelid);
		});
		
		it("returns username when passed a channel url", function(){
			expect(yti.YTUtils.extractChannelIDFromChannelUrl(user)).toEqual(userid);
		});
		
		it("reads current url if none passed condition user", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(channel);
			expect(yti.YTUtils.extractChannelIDFromChannelUrl()).toEqual(channelid);
		});
		
		it("reads current url if none passed condition channel", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(user);
			expect(yti.YTUtils.extractChannelIDFromChannelUrl()).toEqual(userid);
		});
	});
	
	describe("getChannelIDFromChannelTitle", function(){
		it("gets a channel id if channel title present", function(){
			var el = document.createElement("a")
			el.href = channel;
			spyOn(document, "getElementsByClassName").and.returnValue([el]);
			expect(yti.YTUtils.getChannelIDFromChannelTitle()).toEqual(channelid);
		});
		
		it("returns empty string ig channel title not present", function(){
			expect(yti.YTUtils.getChannelIDFromChannelTitle()).toEqual("");
		});
	});
	
	describe("getChannelIDFromPlayer", function(){
		it("gets a channel id if meta tag on player", function(){
			var el = document.createElement("meta")
			el.setAttribute("itemprop", "channelId");
			el.setAttribute("content", channelid);
			spyOn(document, "getElementsByTagName").and.returnValue([el]);
			expect(yti.YTUtils.getChannelIDFromPlayer()).toEqual(channelid);
		});
		
		it("returns empty string if meta tag not present", function(){
			expect(yti.YTUtils.getChannelIDFromPlayer()).toEqual("");
		});
	});
	
	describe("getPlaylistFromUrl", function(){
		it("gets a playlist from passed watch url", function(){
			var result = yti.YTUtils.getPlaylistFromUrl(watchList);
			expect(result).toEqual(playlistID);
		});
		
		it("if no urls passed gets a playlist from current href", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watchList);
			var result = yti.YTUtils.getPlaylistFromUrl();
			expect(result).toEqual(playlistID);
		});
	});
	
	describe("getTimeFromUrl", function(){
		it("gets a xxx time from passed watch url", function(){
			var result = yti.YTUtils.getTimeFromUrl(watchTime0);
			expect(result).toEqual(time0);
		});
		
		it("gets a xhxmxs time from passed watch url", function(){
			var result = yti.YTUtils.getTimeFromUrl(watchTimeHMS);
			expect(result).toEqual(timeHMS);
		});
		
		it("if no urls passed gets a xxx time from current href", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watchTime0);
			var result = yti.YTUtils.getTimeFromUrl();
			expect(result).toEqual(time0);
		});
		
		it("if no urls passed gets a xhxmxs time from current href", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watchTimeHMS);
			var result = yti.YTUtils.getTimeFromUrl();
			expect(result).toEqual(timeHMS);
		});
	});
	
	describe("ytiEnabledOnUrl", function(){
		it("is false if url has a noyti in url &get", function(){
			expect(yti.YTUtils.ytiEnabledOnUrl(disableQueryB)).toBe(false);
		});
		
		it("is true if url doesnt have a noyti in url", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.ytiEnabledOnUrl()).toBe(true);
		});
	});
});

describe("yti.PlayerManager", function(){
	describe("NoYTI", function(){
		it("Doesn't activate when the URL has a noYTI item in &GET", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(disableQueryA);
			pending("DOM modification");
		});
	});
	
	describe("insertAPI", function(){
		it("adds a youtube api web source script to page", function(){
			spyOn(yti.Utils, "addScriptWebSourceToPage");
			yti.PlayerManager.insertAPI();
			var expectedSrc = "https://www.youtube.com/player_api";
			expect(yti.Utils.addScriptWebSourceToPage).toHaveBeenCalledWith(expectedSrc);
			pending("DOM modification");
		});
	});
	
	describe("replacePlayer", function(){
		it("deletes the old player", function(){
			pending("DOM modification");
		});
		
		it("adds the API", function(){
			pending("DOM modification");
		});
	});
	
	describe("setSize", function(){
		it("sets the size of the player to be the current width of the window", function(){
			var el1 = document.createElement('div');
			el1.id = playerDomLocation;
			document.body.appendChild(el1);
			el1 = document.getElementById(playerDomLocation);
			
			var expectedWidth = window.innerWidth;
			var expectedHeight = window.innerHeight;
			yti.PlayerManager.setSize();
			expect(el1.style.position).toEqual("fixed");
			expect(el1.style.width).toEqual(""+expectedWidth+"px");
			expect(el1.style.height).toEqual(""+expectedHeight+"px");
			expect(el1.style.top).toEqual("0px");
			expect(el1.style.left).toEqual("0px");
			
			el1.parentElement.removeChild(el1);
		});
	});
	
	describe("initSizeManagement", function(){
		var el1, mockWindow;
		
		beforeEach(function(){
			el1 = document.createElement('div');
			el1.id = "player";
			document.body.appendChild(el1);
			el1 = document.getElementById(playerDomLocation);
			mockWindow = {};
		});
		
		afterEach(function(){
			el1.parentElement.removeChild(el1);
		});
		
		it("resizes the player", function(){
			var expectedWidth = window.innerWidth;
			var expectedHeight = window.innerHeight;
			yti.PlayerManager.initSizeManagement(mockWindow);
			expect(el1.style.position).toEqual("fixed");
			expect(el1.style.width).toEqual(""+expectedWidth+"px");
			expect(el1.style.height).toEqual(""+expectedHeight+"px");
			expect(el1.style.top).toEqual("0px");
			expect(el1.style.left).toEqual("0px");
		});
		
		it("the listener will call setSize once, after 80ms", function(){
			spyOn(yti.PlayerManager, "setSize");
			yti.PlayerManager.initSizeManagement(mockWindow);
			expect(yti.PlayerManager.setSize.calls.count()).toEqual(1);
			mockWindow.onresize();
			expect(yti.PlayerManager.setSize.calls.count()).toEqual(2);
		});
	});
	
	describe("onYouTubePlayerCreatedSetQuality", function(){
		it("sets quality of target video to 1080", function(){
			var e = {target:{setPlaybackQuality:function(){}}};
			spyOn(e.target, 'setPlaybackQuality');
			yti.PlayerManager.onYouTubePlayerCreatedSetQuality(e);
			expect(e.target.setPlaybackQuality).toHaveBeenCalledWith(qualityString);
		});
	});
	
	describe("onYouTubePlayerStateChange", function(){
		var data = {title: "test", video_id: "testid", list: "listid"};
		var e = {data:0,target:{getVideoData:function(){return data;}}};
		var expectedTitle = "test - YouTube";
		var expectedurl = "https://www.youtube.com/watch?v=testid&list=listid";
		
		beforeEach(function(){
			spyOn(history, 'pushState');
			spyOn(yti.Utils, 'setTitle');
		});
		
		it("if a new video starts it updates the page and history", function(){
			e.data = 1;
			yti.PlayerManager.onYouTubePlayerStateChange(e);
			expect(history.pushState).toHaveBeenCalledWith(data, expectedTitle, expectedurl);
			expect(yti.Utils.setTitle).toHaveBeenCalledWith(expectedTitle);
		});
		
		it("if any other event fires it does nothing", function(){
			e.data = 0;
			yti.PlayerManager.onYouTubePlayerStateChange(e);
			expect(history.pushState).not.toHaveBeenCalled();
			expect(yti.Utils.setTitle).not.toHaveBeenCalled();
		});
	});
	
	describe("onYouTubePlayerAPIReady", function(){
		var YT;
		var expectedVars;
		
		beforeEach(function(){
			YT = jasmine.createSpyObj("YT"	, ["Player"]);
			expectedVars = {
				videoId: videoID,
				playerVars: {autoplay: 1, modestbranding: 1, },
				events: {onReady: yti.PlayerManager.onYouTubePlayerCreatedSetQuality,},
			};
			spyOn(yti.YTUtils, "getVideoIDUrl").and.returnValue(videoID);
			spyOn(yti.YTUtils, "getPlaylistFromUrl").and.returnValue(playlistID);
			spyOn(yti.YTUtils, "getTimeFromUrl").and.returnValue(time0);
		});
		
		it("should be clled by the youtube api when ready", function(){
			spyOn(yti.PlayerManager, "onYouTubePlayerAPIReady");
			onYouTubePlayerAPIReady();
			expect(yti.PlayerManager.onYouTubePlayerAPIReady).toHaveBeenCalled();
		});
		
		it("creates a player", function(){
			spyOn(yti.YTUtils, "isWatchWithList").and.returnValue(false);
			spyOn(yti.YTUtils, "isWatchWithTime").and.returnValue(false);
			yti.PlayerManager.onYouTubePlayerAPIReady(YT);
			expect(YT.Player).toHaveBeenCalledWith(playerDomLocation, expectedVars);
		});
		
		it("if needed it adds playlist param info and listeners", function(){
			spyOn(yti.YTUtils, "isWatchWithList").and.returnValue(true);
			spyOn(yti.YTUtils, "isWatchWithTime").and.returnValue(false);
			expectedVars.playerVars.listType = "playlist";
			expectedVars.playerVars.list = playlistID;
			expectedVars.events.onStateChange =yti.PlayerManager.onYouTubePlayerStateChange;
			yti.PlayerManager.onYouTubePlayerAPIReady(YT);
			expect(YT.Player).toHaveBeenCalledWith(playerDomLocation, expectedVars);
			
		});
		
		it("if needed it adds time info", function(){
			spyOn(yti.YTUtils, "isWatchWithList").and.returnValue(false);
			spyOn(yti.YTUtils, "isWatchWithTime").and.returnValue(true);
			expectedVars.playerVars.start = time0;
			yti.PlayerManager.onYouTubePlayerAPIReady(YT);
			expect(YT.Player).toHaveBeenCalledWith(playerDomLocation, expectedVars);
		});
	});	
});

describe("yti.PageCleaner", function(){
	describe("runElementDelete", function(){
		it("deletes elements according to globals", function(){
			pending("DOM modification");
		});
		
		it("deletes elements according to channels / lists", function(){
			pending("DOM modification");
		});
		
		it("deletes elements from search pages", function(){
			pending("DOM modification");
		});
		
		it("deletes elements according to watch pages", function(){
			pending("DOM modification");
		});
	});
});

describe("yti.Redirector", function(){
	describe("getBarrierUrl", function(){
		it("decodes a destination from a redirect url", function(){
			var actual = yti.Redirector.getBarrierUrl(redirectUrl);
			expect(actual).toEqual(expectedRedirectUrl);
		});
	});
	
	describe("executeBarrierRedirect", function(){
		it("does nothing if current url doesnt contain a redirect", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			spyOn(yti.Utils, "setUrl");
			yti.Redirector.executeBarrierRedirect();
			expect(yti.Utils.setUrl).not.toHaveBeenCalled();
		});
		
		it("redirects if current url doesnt contain a redirect", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(redirectUrl);
			spyOn(yti.Utils, "setUrl");
			yti.Redirector.executeBarrierRedirect();
			expect(yti.Utils.setUrl).toHaveBeenCalledWith(expectedRedirectUrl);
		});
	});

	describe("disableYTIButton", function(){
		it("makes a button with notyi & appended", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			var btn = yti.Redirector.disableYTIButton().href;
			expect(btn).toEqual(disableQueryA);
		});
	});
	
	describe("embedRedirButton", function(){
		it("makes a button with notyi & appended", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			var btn = yti.Redirector.embedRedirButton().href;
			expect(btn).toEqual(embeddedVideo);
		});
	});
	
	describe("addAllRedirButtons", function(){
		it("adds buttons", function(){
			pending("DOM modification");
		});
	});
});

describe("yti.LiveThumbnailer", function(){
	
	var a1,a2,a3,el1,el2,el3;
	
	beforeEach(function(){
		a1 = document.createElement('a');
		a1.href = watch;
		a2 = document.createElement('a');
		a2.href = playlist;
		a3 = document.createElement('a');
		a3.href = watch;
		
		el1 = document.createElement('div');
		el1.className = thumbClass;
		el1.innerHTML = a1.outerHTML;
		el1.id = "testThumb1";
		
		el2 = document.createElement('div');
		el2.className = thumbClass;
		el2.innerHTML = a2.outerHTML;
		el2.id = "testThumb2";
		
		el3 = document.createElement('div');
		el3.className = thumbClass;
		el3.innerHTML = a3.outerHTML;
		el3.id = "testThumb3";
	});
	
	describe("initThumbs", function(){
		it("creates a button for every valid thumb on page", function(){
			document.body.appendChild(el1);
			document.body.appendChild(el2);
			document.body.appendChild(el3);
			yti.LiveThumbnailer.initThumbs();
			
			var newThumb = document.getElementById("testThumb1");
			var button = newThumb.getElementsByTagName('button')[0];
			simulatedClick(button);
			newThumb = document.getElementById("testThumb1");
			var actual = newThumb.getElementsByTagName('iframe')[0];
			expect(actual.src).toEqual(embeddedVideo);
			newThumb.parentElement.removeChild(newThumb);
			
			newThumb = document.getElementById("testThumb2");
			button = newThumb.getElementsByTagName('button')[0];
			expect(button).toBeUndefined();
			newThumb.parentElement.removeChild(newThumb);
			
			newThumb = document.getElementById("testThumb3");
			button = newThumb.getElementsByTagName('button')[0];
			simulatedClick(button);
			newThumb = document.getElementById("testThumb3");
			actual = newThumb.getElementsByTagName('iframe')[0];
			expect(actual.src).toEqual(embeddedVideo);
			newThumb.parentElement.removeChild(newThumb);
		});
	});
	
	describe("isActuallyAThumbnail", function(){
		it("checks that videos should have a thumbnail", function(){
			expect(yti.LiveThumbnailer.isActuallyAThumbnail(el1)).toBe(true);
		});
		it("checks that non-videos dont have a thumbnail", function(){
			expect(yti.LiveThumbnailer.isActuallyAThumbnail(el2)).toBe(false);
		});
	});
	
	describe("changeThumb", function(){
		it("appends a button to a thumb", function(){
			document.body.appendChild(el1);
			yti.LiveThumbnailer.changeThumb(el1);
			var button = el1.getElementsByTagName('button')[0];
			expect(button).toBeDefined();
			simulatedClick(button);
			var actual = el1.getElementsByTagName('iframe')[0];
			expect(actual.src).toEqual(embeddedVideo);
			el1.parentElement.removeChild(el1);
		});
	});
	
	describe("makeButton", function(){
		it("make a documentElement for a button", function(){
			var iframe = document.createElement('iframe');
			var button = yti.LiveThumbnailer.makeButton(iframe);
			expect(typeof button.onclick).toEqual("function");
		});
	});
	
	describe("getUrl", function(){
		it("generates a url from a DOM thumb container", function(){
			expect(yti.LiveThumbnailer.getUrl(el1)).toEqual(embeddedVideo);
		});
	});
	
	describe("makeIframe", function(){
		it("make a documentElement iframe for a certain container", function(){
			var expected = document.createElement("iframe");
			expected.src = embeddedVideo;
			expected.height = "100%";
			expected.width = "100%";
			var actual = yti.LiveThumbnailer.makeIframe(embeddedVideo);
			expect(actual).toEqual(expected);
		});
	});
});

describe("yti.SPFHandler", function(){
	it("adds a script to the page that disposes the spf", function(){
		spyOn(yti.Utils, "addScriptToPage");
		yti.SPFHandler.handleSPF();
		var thescript = 'if(typeof window.spf!="undefined"){window.spf.dispose();}';
		expect(yti.Utils.addScriptToPage).toHaveBeenCalledWith(thescript);
	});
});

describe("yti.RSSFeedLinker", function(){
	describe("addRSSFeed", function(){
		beforeEach(function(){
			spyOn(yti.RSSFeedLinker, "createFeedURL").and.returnValue(channelRss);
		});
		
		it("if a channel, adds a feed to channel", function(){
			pending("DOM modification");
		});
		
		it("if a playlist, adds a feed to owning channel", function(){
			pending("DOM modification");
		});
		
		it("if a player page, adds a feed to subs box on player", function(){
			pending("DOM modification");
		});
	});
	
	describe("createFeedURL", function(){
		it("creates an xml uri for channel ids", function(){
			var result = yti.RSSFeedLinker.createFeedURL(channelid);
			var expected = channelRss + channelid;
			expect(result).toEqual(expected);
		});
		
		it("creates an xml uri for user ids", function(){
			var result = yti.RSSFeedLinker.createFeedURL(userid);
			var expected = userRss + userid;
			expect(result).toEqual(expected);
		});
	});
	
	describe("addFeedElementToPlayer", function(){
		it("adds a document element to a player description box", function(){
			var testcontainer = document.createElement('div');
			testcontainer.id = playerHeader;
			document.body.appendChild(testcontainer);
			testcontainer = document.getElementById(playerHeader);
			var el1 = document.createElement('a');
			el1.setAttribute("href", channelRss);
			el1.innerHTML = "RSS Feed: Uploads";
			el1.setAttribute("class", buttonClass);
			spyOn(yti.RSSFeedLinker, "createFeedElement").and.returnValue(el1);
			yti.RSSFeedLinker.addFeedElementToPlayer(channelRss);
			testcontainer = document.getElementById(playerHeader);
			expect(testcontainer.firstChild).toEqual(el1);
			document.body.removeChild(testcontainer);
			pending("DOM modification");
		});
	});
	
	describe("addFeedElementToChannel", function(){
		it("adds a document element to a player description box", function(){
			pending("DOM modification");
		});
	});
	
	describe("createFeedElement", function(){
		it("creates an rss link document element", function(){
			var el1 = document.createElement('a');
			el1.setAttribute("href", channelRss);
			el1.innerHTML = "RSS Feed: Uploads";
			el1.setAttribute("class", buttonClass);
			var actual = yti.RSSFeedLinker.createFeedElement(channelRss);
			expect(actual).toEqual(el1);
		});
	});
});

function simulatedClick(target, options) {

	var event = target.ownerDocument.createEvent('MouseEvents'),
		options = options || {};
		
	var LMB = 0;
	var MMB = 1;
	var RMB = 2;
		
	//value || default
	var opts = {
		type: options.type				   || 'click',
		canBubble:options.canBubble		  || true,
		cancelable:options.cancelable		|| true,
		view:options.view					|| target.ownerDocument.defaultView,
		detail:options.detail				|| 1,
		screenX:options.screenX			  || 0,
		screenY:options.screenY			  || 0,
		clientX:options.clientX			  || 0,
		clientY:options.clientY			  || 0,
		ctrlKey:options.ctrlKey			  || false,
		altKey:options.altKey				|| false,
		shiftKey:options.shiftKey			|| false,
		metaKey:options.metaKey			  || false, //'Cmd/Apple' or 'Windows key'
		button:options.button				|| LMB,
		relatedTarget:options.relatedTarget  || null,
	}

	event.initMouseEvent(
		opts.type,
		opts.canBubble,
		opts.cancelable,
		opts.view,
		opts.detail,
		opts.screenX,
		opts.screenY,
		opts.clientX,
		opts.clientY,
		opts.ctrlKey,
		opts.altKey,
		opts.shiftKey,
		opts.metaKey,
		opts.button,
		opts.relatedTarget
	);

	target.dispatchEvent(event);
}