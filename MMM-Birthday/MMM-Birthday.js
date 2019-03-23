/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-Birthday",{

	// Default module config.
	defaults: {
		filename: "events.json",
		formats: {
						    sameDay: '[Today]',
						    nextDay: '[Tomorrow]',
						    nextWeek: 'dddd',
						    lastDay: '[Yesterday]',
						    lastWeek: '[Last] dddd',
						    sameElse: 'DD/MM/YYYY'
						}
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js", "moment-timezone.js"];
		},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.events = [];
	  this.loaded = true;
		this.formats = this.config.formats;
/*
		this.sendSocketNotification("DEBUG", {
			  name: "start",
				data: {}
		});
		*/
		this.sendSocketNotification("ADD_EVENTS_FILE", {
				filename: this.config.filename,
		});

	},

	// handle data from node_helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "EVENTS_UPDATE") {
			this.events = payload.events;
			this.loaded = true;
			}
		this.updateDom();
	},

	// display data.
	getDom: function() {
		var icons = {
			birthday: "birthday-cake",
		  wedding: "diamond",
                  anniversary: "diamond"
		}
	  var wrapper = document.createElement("table");
	  wrapper.className = "small";
		wrapper.style.cssText = 'direction:rtl'
		try {
				//wrapper.innerHTML = this.events.length + ":";
				for (var i in this.events)
				{
					var e = this.events[i]
					var eventWrapper = document.createElement("tr");
					if (moment().diff(e.nextDate,"days") == 0 )
							eventWrapper.className = "title bright";
					// time from now
					var timeWrapper = document.createElement("td")
					timeWrapper.innerHTML = moment(e.nextDate).calendar(null, this.formats);
					eventWrapper.appendChild(timeWrapper)
					// title
					var titleWrapper = document.createElement("td")
					titleWrapper.innerHTML = e.title
					eventWrapper.appendChild(titleWrapper);
					// count
					var countWrapper = document.createElement("td")
					countWrapper.innerHTML = e.count
					var symbol = document.createElement("span");
					symbol.className = "fa fa-fw fa-" + icons[e.type];
					countWrapper.appendChild(symbol);
					eventWrapper.appendChild(countWrapper)
					// end of line
					wrapper.appendChild(eventWrapper);
				}
			}
		catch (x) {
			this.sendSocketNotification("DEBUG", {
					name: "error",
					data: x
			});
		}
		return wrapper;

/*
		if (this.events.length === 0) {
			wrapper.innerHTML = (this.loaded) ? this.translate("EMPTY") : this.translate("LOADING");
			wrapper.className = "small dimmed";
			return wrapper;
			}
*/

	},


});
