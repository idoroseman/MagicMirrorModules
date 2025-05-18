/* Magic Mirror
 * Node Helper: Calendar
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var fs = require("fs");
var moment = require('moment');

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		this.events = [];
		console.log("Starting node helper for: " + this.name);
		// Schedule update interval.
		this.lastUpdate = -1;

		var self = this;
		setInterval(() => {
			if (this.lastUpdate != this.getDayOfWeek()) {
				this.lastUpdate = this.getDayOfWeek();
				this.recalcEvents();
				this.sendSocketNotification("EVENTS_UPDATE", {
					events: this.events
				});
				}
			},60*1000);

	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
	    if (notification === "DEBUG") {
	        console.log("DEBUG");
	        console.log(payload.name);
	        console.log(payload.data);
	        console.log(JSON.stringify(payload.data));

	    }
		else if (notification === "ADD_EVENTS_FILE") {
			console.log(this.name+" loading "+payload.filename);

			fs.readFile(this.path+"/"+payload.filename, "utf8", (err, data) => {
				if (err) {
						console.log("missing file " + payload.filename); // may be filename does not exists?
						return;
				}
				var j = JSON.parse(data);
				this.events = j.events;
        this.recalcEvents();
				//console.log("events file parsed, "+this.events.length+" events. calculating dates");
				this.sendSocketNotification("EVENTS_UPDATE", {
					events: this.events.slice(0, 7)
				});
				console.log("update sent");

	  	});

		}
	},

	recalcEvents: function(){
 		var currentYear = moment().year();
		var nextYear = moment().add(1,'y').year()
		var list = this.events;
		for (var i in list) {
			 tokens = list[i].date.split(' ')
		   list[i].nextDate = moment(currentYear+"-"+tokens[1]+"-"+tokens[0],"YYYY-MMM-DD")
			 if (moment().diff(list[i].nextDate, 'days') > 2)
			   list[i].nextDate = moment(nextYear+"-"+tokens[1]+"-"+tokens[0],"YYYY-MMM-DD")
			 list[i].count = list[i].nextDate.diff(moment(list[i].date,'DD MMM YYYY'),'years')
		 }
		 try {
			list.sort((a,b)=>{return a.nextDate.diff(b.nextDate,'days')})
			list = list.slice(0, 6)
		 } catch (e) { console.log(e); }
		 this.events = list
		 //for (var i in list)
		 //  console.log(JSON.stringify(list[i]))
	},

		getDayOfWeek: function() {
		var d = new Date();
		return d.getDay()
	}

});
