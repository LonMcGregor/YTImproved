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
	
	xdescribe("deleteElements", function() {
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
		});
		it("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			el2.parentElement.removeChild(el2);
			yti.Utils.deleteElements(elements);
		});
	});
	
	xdescribe("deleteElementById", function() {
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
		
		it("deletes a single element", function(){
			yti.Utils.deleteElements(elements);
			expect(document.getElementById("testingDiv")).toBeNull();
		});
		it("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			yti.Utils.deleteElements(elements);
		});
	});
});

describe("yti.YTUtils", function(){
	var user = "https://www.youtube.com/user/kurtjmac";
	var channel = "https://www.youtube.com/channel/UC1Un5592U9mFx5n6j2HyXow";
	var userid = "kurtjmac";
	var channelid = "UC1Un5592U9mFx5n6j2HyXow";
	var watch = "https://www.youtube.com/watch?v=BPCUWebOick";
	var videoID = "BPCUWebOick";
	var embeddedVideo = "https://www.youtube.com/embed/BPCUWebOick?autoplay=1";
	var search = "https://www.youtube.com/results?search_query=kurtjmac";
	var playlist = "https://www.youtube.com/playlist?list=PLvxoDthI6hljEr8upu4XycKEIyvdCCgtP";
	
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