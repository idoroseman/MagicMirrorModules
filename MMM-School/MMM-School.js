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
		text: "School!",
		filename: "chufshot.ics",
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
		this.sendSocketNotification("START", {filename:this.config.filename});
	},
	
	// handle data from node_helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "VACATIONS_UPDATE") {
			this.vacations = payload.events;
			this.loaded = true;
			}
		this.updateDom();
	},
	
	// Override dom generator.
	getDom: function() {
		var d = new Date();
		var n = d.getDay();
		var s = d.toISOString().split('T')[0];
		var today = this.config.classes[n];
		var wrapper = document.createElement("div");
		wrapper.innerHTML = "";

        if (this.vacations !== undefined) {
			for (var i=0; i<this.vacations.length; i++){
			//console.log(s + " vs " + this.vacations[i]["dateStart"] + " till " +this.vacations[i]["dateEnd"]);
			  if ((s>=this.vacations[i]["dateStart"]) && (s<this.vacations[i]["dateEnd"])) {
				console.log("VACATION " + s + ": " + this.vacations[i]["summary"] );
				wrapper.innerHTML += "<center>";
				wrapper.innerHTML += this.config.empty + "חופש" + this.config.empty + "<br/>";
				wrapper.innerHTML += this.vacations[i]["summary"] + "<br/>";
				wrapper.innerHTML += "</center>";
				return wrapper;
			  }
			}
		}
		for (var i=0; i< today.length; i++){
    			var element = today[i];
			if ((element  === undefined) || (element === ""))
				wrapper.innerHTML += this.config.empty + "<br/>";
			else
				wrapper.innerHTML += element + "<br/>";
		}
		return wrapper;
	}
});
