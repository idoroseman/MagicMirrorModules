/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-Predict",{

	// Default module config.
	defaults: {
		location: [32.0637, 34.8717, 80],
		satellites: ["SO-50", "AO-91", "AO-92", "ISS"],
		minimum_elevation : 15,
		lines : 7
	},
	
	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	start: function() {
		var self = this;
		setInterval(() => {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, 60 * 60 * 1000);   //perform every 1000 milliseconds.
		this.sendSocketNotification("START", this.config);
		this.events = [	]
	},
	
	// handle data from node_helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "UPDATE") {
			this.events = payload.preditions;
			this.loaded = true;
			}
		this.updateDom();
	},
	
	// Override dom generator.
	getDom: function() {
        var events = this.events;
		var wrapper = document.createElement("table");
		
		wrapper.className = "small";

		if (events.length === 0) {
			wrapper.innerHTML = (this.loaded) ? this.translate("EMPTY") : this.translate("LOADING");
			wrapper.className = "small dimmed";
			return wrapper;
		}

		for (var e in events) {
			var event = events[e];
			console.log(events);
			var eventWrapper = document.createElement("tr");

			if (this.config.colored) {
				eventWrapper.style.cssText = "color:" + this.colorForEvent(event);
			}
			eventWrapper.className = "xsmall";

			var titleWrapper = document.createElement("td");
			titleWrapper.innerHTML = event.name;
			titleWrapper.className = "title align-left";
			eventWrapper.appendChild(titleWrapper);
			
			var startDateWrapper = document.createElement("td");
			var startTime = moment(event.start);
			startDateWrapper.innerHTML = startTime.format("MMM DD");
			startDateWrapper.className = "time";
			eventWrapper.appendChild(startDateWrapper);
			
			var startTimeWrapper = document.createElement("td");
			//var startTime = moment(event.start);
			startTimeWrapper.innerHTML = startTime.format("HH:mm");
			startTimeWrapper.className = "time";
			eventWrapper.appendChild(startTimeWrapper);
				
			var endTimeWrapper = document.createElement("td");
			var endTime = moment(event.end);
			endTimeWrapper.innerHTML = endTime.format("HH:mm");
			endTimeWrapper.className = "time";
			eventWrapper.appendChild(endTimeWrapper);	
							
			var maxAzWrapper = document.createElement("td");
			maxAzWrapper.innerHTML = Math.round(event.apexAzimuth);
			maxAzWrapper.className = "azimuth";
			eventWrapper.appendChild(maxAzWrapper);		
									
			var maxElWrapper = document.createElement("td");
			maxElWrapper.innerHTML = Math.round(event.maxElevation);
			maxElWrapper.className = "elevation";
			eventWrapper.appendChild(maxElWrapper);		
						
			wrapper.appendChild(eventWrapper);
			}
		return wrapper;
	}
});
