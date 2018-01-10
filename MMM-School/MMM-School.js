/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-School",{

	// Default module config.
	defaults: {
		text: "Hello World!",
		empty: "-",
		classes: {
			0 : [],
			1 : [],
			2 : [],
			3 : [],
			4 : [],
			5 : [],
			6 : []
			}
	},

	start: function() {
		var self = this;
		setInterval(() => {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, 60 * 60 * 1000); //perform every 1000 milliseconds.
	},
	// Override dom generator.
	getDom: function() {
		var d = new Date();
		var n = d.getDay();
		var today = this.config.classes[n];
		var wrapper = document.createElement("div");
		wrapper.innerHTML = "";

		for (var i=0; i< today.length; i++){
    			var element = today[i];
			if (element  === undefined)
				wrapper.innerHTML += this.config.empty + "<br/>";
			else
				wrapper.innerHTML += element + "<br/>";
		}
		return wrapper;
	}
});
