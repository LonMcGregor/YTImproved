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
			expect(timerCallback).calls.count().toEqual(1);
		});
		
		it("allows multiple calls from different unique ids", function(){
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing");
			yti.Utils.waitForFinalEvent(timerCallback, 50, "thing2");
			jasmine.clock().tick(51);
			expect(timerCallback).calls.count().toEqual(2);
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
			el1.id = "testingH1";
			document.body.appendChild(el2);
			el1 = document.getElementById("testingH1");
			elements = [el1, el2];
		});
		
		it("deletes all elements in an array of dom elements", function(){
			yti.Utils.deleteElements(elements);
			expect(document.getElementById("testingDiv").toBeUndefined();
			expect(document.getElementById("testingH1").toBeUndefined();
		});
		it("doesnt fail if an element doesnt exist", function(){
			el1.parentElement.removeChild(el1);
			yti.Utils.deleteElements(elements);
		});
	});
});