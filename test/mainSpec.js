var user = "https://www.youtube.com/user/kurtjmac";
var channel = "https://www.youtube.com/channel/UC1Un5592U9mFx5n6j2HyXow";
var userid = "kurtjmac";
var channelid = "UC1Un5592U9mFx5n6j2HyXow";
var watch = "https://www.youtube.com/watch?v=BPCUWebOick";
var videoID = "BPCUWebOick";
var embeddedVideo = "https://www.youtube.com/embed/BPCUWebOick?autoplay=1";
var search = "https://www.youtube.com/results?search_query=kurtjmac";
var playlist ="https://www.youtube.com/playlist?list=PLvxoDthI6hljEr8upu4XycKEIyvdCCgtP";
var channelRss= 'https://www.youtube.com/feeds/videos.xml?channel_id=';
var userRss= 'https://www.youtube.com/feeds/videos.xml?user=';
var playerHeader= 'watch7-user-header';
var channelHeader= 'c4-primary-header-contents';
var buttonClass= "yt-uix-button-content";

describe("yti.Utils", function() {
	
	describe("contains", function() {
		it("returns true if string x contains string y", function() {
			expect(yti.Utils.contains("haystack", "hay")).toBe(true);
		});
		
		it("returns false if string x doesnt contain string y", function() {
			expect(yti.Utils.contains("haystack", "needle")).toBe(false);
		});
	});
	
	describe("timers", function() {
		it("should exist", function(){
			expect(yti.Utils.timers).toBeDefined();
		});
	});
	
	describe("waitForFinalEvent", function(){
		var timerCallback;
		
		beforeEach(function() {
			timerCallback = jasmine.createSpy("timerCallback");
			jasmine.clock().install();
		});
		
		afterEach(function() {
			jasmine.clock().uninstall();
		});
		
		it("calls a single callback after a time limit", function(){
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing");
			expect(timerCallback).not.toHaveBeenCalled();
			jasmine.clock().tick(51);
			expect(timerCallback).toHaveBeenCalled();
		});
		
		it("calls a single callback after many calls creating them", function(){
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing");
			expect(timerCallback).not.toHaveBeenCalled();
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing");
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing");
			jasmine.clock().tick(51);
			expect(timerCallback.calls.count()).toEqual(1);
		});
		
		it("allows multiple calls from different unique ids", function(){
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing");
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing2");
			jasmine.clock().tick(51);
			expect(timerCallback.calls.count()).toEqual(2);
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
		
		xit("deletes all elements in an array of dom elements", function(){
			yti.Utils.deleteElements(elements);
			expect(document.getElementById("testingDiv")).toBeNull();
			expect(document.getElementById("testingH1")).toBeNull();
		});
		xit("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			el2.parentElement.removeChild(el2);
			yti.Utils.deleteElements(elements);
		});
	});
	
	describe("deleteElementById", function() {
		var el1;
		
		beforeEach(function() {
			el1 = document.createElement('div');
			el1.id = "testingDiv";
			document.body.appendChild(el1);
			el1 = document.getElementById("testingDiv");
		});
		
		afterEach(function() {
			el1.parentElement.removeChild(el1);
		});
		
		xit("deletes a single element", function(){
			yti.Utils.deleteElements(elements);
			expect(document.getElementById("testingDiv")).toBeNull();
		});
		xit("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			yti.Utils.deleteElements(elements);
		});
	});
	
	describe("getUrl", function(){
		xit("gets window.location.href", function(){
			
		});
	});
	
	describe("addScriptToPage", function(){
		xit("adds a script to the page, given content", function(){
			
		});
	});
	
	describe("addScriptWebSourceToPage", function(){
		xit("adds a script to the page, given content", function(){
			
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
	
	describe("newEmbeddedUrl", function(){
		it("returns autplaying embedded url version when passed a video id", function(){
			expect(yti.YTUtils.newEmbeddedUrl(videoID)).toEqual(embeddedVideo);
		});
		
		it("reads current url if none passed condition true", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			expect(yti.YTUtils.newEmbeddedUrl()).toEqual(embeddedVideo);
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
		xit("gets a channel id if meta tag on player", function(){
			var el = document.createElement("meta")
			el.itemprop = "channelId";
			el.content = channelid;
			spyOn(document, "getElementsByTagName").and.returnValue([el]);
			expect(yti.YTUtils.getChannelIDFromPlayer()).toEqual(channelid);
		});
		
		it("returns empty string if meta tag not present", function(){
			expect(yti.YTUtils.getChannelIDFromPlayer()).toEqual("");
		});
	});
});

describe("yti.PlayerManager", function(){
	describe("preservePlaylist", function(){
		xit("preserves a playlist", function(){
			//this might be removed
		});
	});
	
	describe("insertAPIHandoff", function(){
		xit("adds a script for the current video page", function(){
			spyOn(yti.Utils, "getUrl").and.returnValue(watch);
			spyOn(yti.Utils, "addScriptToPage");
			yti.PlayerManager.insertAPIHandoff();
			var expectedScript = 'var player;\
		function onYouTubePlayerCreatedSetQuality(event) {\
				event.target.setPlaybackQuality("hd1080");\
		} \
		function onYouTubePlayerAPIReady() {\
			player = new YT.Player("player", {\
				videoId: "'+videoID+'",\
				playerVars: {\
					autoplay: 1,\
					modestbranding: 1,\
				},\
				events:{\
					"onReady": onYouTubePlayerCreatedSetQuality\
				},\
			});\
		}';
			expect(yti.Utils.addScriptToPage).toHaveBeenCalledWith(expectedScript);
		});
	});
	
	describe("insertAPI", function(){
		xit("adds a youtube api web source script to page", function(){
			spyOn(yti.Utils, "addScriptWebSourceToPage");
			yti.PlayerManager.insertAPI();
			var expectedSrc = "https://www.youtube.com/player_api";
			expect(yti.Utils.addScriptWebSourceToPage).toHaveBeenCalledWith(expectedSrc);
		});
	});
	
	describe("replacePlayer", function(){
		xit("preserved the playlist", function(){
			
		});
		xit("adds the API handoff", function(){
			//just copy the other test methods
		});
		xit("adds the API", function(){
			
		});
	});
	
	describe("setSize", function(){
		it("sets the size of the player to be the current width of the window", function(){
			var el1 = document.createElement('div');
			el1.id = "player";
			document.body.appendChild(el1);
			el1 = document.getElementById("player");
			
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
			el1 = document.getElementById("player");
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
		
		xit("the listener will call setSize once, after 80ms", function(){
			spyOn(yti.PlayerManager, "setSize");
			jasmine.clock().install();
			yti.PlayerManager.initSizeManagement(mockWindow);
			mockWindow.onresize();
			jasmine.clock().tick(40);
			mockWindow.onresize();
			jasmine.clock().tick(20);
			expect(yti.PlayerManager.setSize).not.toHaveBeenCalled();
			jasmine.clock().tick(21);
			expect(yti.PlayerManager.setSize).calls.count.toEqual(1);
			jasmine.clock().uninstall();
		});
	});	
});

describe("SPFHandler", function(){
	it("adds a script to the page that disposes the spf", function(){
		spyOn(yti.Utils, "addScriptToPage");
		yti.SPFHandler.handleSPF();
		var thescript = 'if(typeof window.spf!="undefined"){window.spf.dispose();}';
		expect(yti.Utils.addScriptToPage).toHaveBeenCalledWith(thescript);
	});
});

describe("RSSFeedLinker", function(){
	describe("addRSSFeed", function(){
		beforeEach(function(){
			spyOn(yti.RSSFeedLinker, "createFeedURL").and.returnValue(channelRss);
		});
		xit("if a channel, adds a feed to channel", function(){
			spyOn(yti.YTUtils, "isChannel").and.returnValue(true);
			spyOn(yti.YTUtils, "isListing").and.returnValue(false);
			spyOn(yti.YTUtils, "isWatch").and.returnValue(false);
			var testcontainer = document.createElement('div');
			testcontainer.id = channelHeader;
			document.body.appendChild(testcontainer);
			testcontainer = document.getElementById(channelHeader);
			var el1 = document.createElement('a');
			el1.setAttribute("href", channelRss);
			el1.innerHTML = "RSS Feed: Uploads";
			el1.setAttribute("class", buttonClass);
			spyOn(yti.RSSFeedLinker, "createFeedElement").and.returnValue(el1);
			yti.RSSFeedLinker.addFeedElementToPlayer(channelRss);
			testcontainer = document.getElementById(channelHeader);
			expect(testcontainer.firstChild).toEqual(el1);
			document.body.removeChild(testcontainer);
			
		});
		xit("if a playlist, adds a feed to owning channel", function(){
			spyOn(yti.YTUtils, "isChannel").and.returnValue(false);
			spyOn(yti.YTUtils, "isListing").and.returnValue(true);
			spyOn(yti.YTUtils, "isWatch").and.returnValue(false);
			var testcontainer = document.createElement('div');
			testcontainer.id = channelHeader;
			document.body.appendChild(testcontainer);
			testcontainer = document.getElementById(channelHeader);
			var el1 = document.createElement('a');
			el1.setAttribute("href", channelRss);
			el1.innerHTML = "RSS Feed: Uploads";
			el1.setAttribute("class", buttonClass);
			spyOn(yti.RSSFeedLinker, "createFeedElement").and.returnValue(el1);
			yti.RSSFeedLinker.addFeedElementToPlayer(channelRss);
			testcontainer = document.getElementById(channelHeader);
			expect(testcontainer.firstChild).toEqual(el1);
			document.body.removeChild(testcontainer);
			
		});
		xit("if a player page, adds a feed to subs box on player", function(){
			spyOn(yti.YTUtils, "isChannel").and.returnValue(false);
			spyOn(yti.YTUtils, "isListing").and.returnValue(false);
			spyOn(yti.YTUtils, "isWatch").and.returnValue(true);
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
		xit("adds a document element to a player description box", function(){
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
		});
	});
	describe("addFeedElementToChannel", function(){
		xit("adds a document element to a player description box", function(){
			var testcontainer = document.createElement('div');
			testcontainer.id = channelHeader;
			document.body.appendChild(testcontainer);
			testcontainer = document.getElementById(channelHeader);
			var el1 = document.createElement('a');
			el1.setAttribute("href", channelRss);
			el1.innerHTML = "RSS Feed: Uploads";
			el1.setAttribute("class", buttonClass);
			spyOn(yti.RSSFeedLinker, "createFeedElement").and.returnValue(el1);
			yti.RSSFeedLinker.addFeedElementToPlayer(channelRss);
			testcontainer = document.getElementById(channelHeader);
			expect(testcontainer.firstChild).toEqual(el1);
			document.body.removeChild(testcontainer);
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