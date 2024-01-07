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
		schedule: "maarechet.csv",
		vacations: "chufshot.ics",
		empty: "-",
		classes: {
			0 : [],
			1 : [],
			2 : [],
			3 : [],
			4 : [],
			5 : [],
			6 : [],
			7 : [],
			8 : [],
			}
	},

		// Define required scripts.
	getStyles: function () {
		return ["MMM-School.css"];
	},

	start: function() {
		this.vacations = []
		this.classes = []
		this.hours = []
		var self = this;
		setInterval(() => {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, 60 * 60 * 1000); //perform every 1000 milliseconds.
		this.sendSocketNotification("START", this.config);
	},
	
	// handle data from node_helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "VACATIONS_UPDATE") {
			this.vacations = payload.events;
			}
		else if (notification === "HOURS_UPDATE") {
			this.hours = payload.events;
			console.log(this.hours);
			}
		else if (notification === "SCHEDULE_UPDATE") {
			this.classes = payload.events;
			this.loaded = true;
			}
		this.updateDom();
	},
	
	// Override dom generator.
	getDom: function() {
		var d = new Date();
		var n = d.getDay();
		var s = d.toISOString().split('T')[0];
		const today = this.classes[n] || []
		const tommorow = this.classes[(n+1)%7] || []

		const wrapper = document.createElement("table");
	  	wrapper.className = "small";
		wrapper.style.cssText = 'direction:rtl'

		var eventWrapper = document.createElement("tr");

		// time 
		var timeWrapper = document.createElement("td")
		timeWrapper.innerHTML = "";
		eventWrapper.appendChild(timeWrapper)

		// hours
		var hoursWrapper = document.createElement("td")
		hoursWrapper.innerHTML = "שעה";
		eventWrapper.appendChild(hoursWrapper)

		// today
		var todayWrapper = document.createElement("td")
		todayWrapper.innerHTML += "היום";
		eventWrapper.appendChild(todayWrapper)

		// tommorow
		var tommorowWrapper = document.createElement("td")
		tommorowWrapper.innerHTML += "מחר";
		eventWrapper.appendChild(tommorowWrapper)

		wrapper.append(eventWrapper)

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

		for (var i=0; i< Math.max(today.length, tommorow.length); i++) {
			var eventWrapper = document.createElement("tr");

			// time 
			var timeWrapper = document.createElement("td")
			timeWrapper.innerHTML = i ;
			eventWrapper.appendChild(timeWrapper)

			// hours
			var hourWrapper = document.createElement("rd");
			hourWrapper.innerHTML=this.hours[i].start+"-"+this.hours[i].end;
			hourWrapper.className="xsmall dimmed"
			eventWrapper.appendChild(hourWrapper)

			// today
			var todayWrapper = document.createElement("td")
			todayWrapper.className = "wraooedText"
			// todayWrapper.style="width: 25%"
			if ((today[i]  === undefined) || (today[i] === ""))
				todayWrapper.innerHTML += this.config.empty;
			else
				todayWrapper.innerHTML += (today[i] || "-" );
			eventWrapper.appendChild(todayWrapper)

			// tommorow
			var tommorowWrapper = document.createElement("td")
			tommorowWrapper.className = "wraooedText"
			if ((tommorow[i]  === undefined) || (tommorow[i] === ""))
				tommorowWrapper.innerHTML += this.config.empty ;
			else
				tommorowWrapper.innerHTML += (tommorow[i] || "-") ;
			eventWrapper.appendChild(tommorowWrapper)

			wrapper.append(eventWrapper)
		}
		return wrapper;
	}
});
