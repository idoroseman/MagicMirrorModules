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
		this.events = null;
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
	    if (notification === "START") {
			// hours
			console.log(this.name, "reading hours");
			fs.readFile(this.path+"/"+"hours.json", "utf8", (err, data) => {
				if (err) {
						console.log("missing file " + "hours.json"); // may be filename does not exists?
						return;
				}
				var j = JSON.parse(data);
				this.sendSocketNotification("HOURS_UPDATE", {
					events: j,
				});
	  		});
			// schedule
			console.log(this.name+" loading "+payload.schedule);
			fs.readFile(this.path+"/"+payload.schedule, "utf8", (err, data) => {
				if (err) {
						console.log("missing file " + payload.schedule); // may be filename does not exists?
						return;
				}
				var j = this.parse_csv(data);
				this.sendSocketNotification("SCHEDULE_UPDATE", {
					events: j,
				});
	  		});

			// vacations
			console.log(this.name+" loading "+payload.vacations);
			fs.readFile(this.path+"/"+payload.vacations, "utf8", (err, data) => {
				if (err) {
						console.log("missing file " + payload.vacations); // may be filename does not exists?
						return;
				}
				var j = this.parse_ical(data);
				this.events = j;
				this.sendSocketNotification("VACATIONS_UPDATE", {
					events: this.events
				});
	  		});
		}
		else {
	        console.log("DEBUG");
	        console.log(payload.name);
	        console.log(JSON.stringify(payload.data));
	    }
		 
	},
	
	parse_csv: function(data) {
	    const lines = data.split('\n');
		const events = lines.map(l => l.split(','))
		return events;
	},

	parse_ical: function(data) {
	    var events = [];
	    var event = {}
		var lines = data.split('\n');
		for(var i = 0;i < lines.length;i++) {
		    var key   = lines[i].trim().split(':')[0].split(';')[0]
		    var value = lines[i].trim().split(':')[1]
		    if (key == "BEGIN") {
		       if (value == "VEVENT")
		         event = {}
		     }
			else if (key == "DTEND")
			  event['dateEnd'] = value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8);
			else if (key == "DTSTART")
			  event["dateStart"] = value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8);
			else if (key == "SUMMARY")
			  event["summary"] = value;
			else if (key == "END") {
			  if (value =="VEVENT")
			    events.push(event);
			}
		}
		//console.log(JSON.stringify(events, null, ' '));
		return events;
	}
	
});
