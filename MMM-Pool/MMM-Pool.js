/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-Pool",{

	// Default module config.
	defaults: {
        seperator : " | ",
        closed : "סגור",
	},
	
	start: function() {
        this.events = {
            morning_start : undefined,
        	morning_end : undefined,
	        evening_start : undefined,
    	    evening_end : undefined,
        }
		var self = this;
		setInterval(() => {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, 60 * 1000); //perform every hour
		this.sendSocketNotification("START", {});
	},
	
		// handle data from node_helper
	socketNotificationReceived: function (notification, payload) {
	    console.log(notification);
	    console.log(payload);
		if (notification === "EVENTS_UPDATE") {
		    console.log("pool", payload.date, payload.events);
			this.events = payload.events;
			this.isoDate = payload.date;
			this.loaded = true;
			}
		this.updateDom();
	},
	
	// Override dom generator.
	getDom: function() {
    	//var XLSX = require('xlsx');
    	//var fs = require('fs');
        //var files = fs.readdirSync('.');
		//var workbook = XLSX.readFile('test.xlsx');
		//var sheet_name_list = workbook.SheetNames;
        //var worksheet = workbook.Sheets[sheet_name_list[0]];
        //var desired_cell = worksheet['A1'];
        //var desired_value = (desired_cell ? desired_cell.v : undefined);

	
		var d = new Date();
		var n = d.getDay();
		var timeNow = moment();
		var timeNowString = moment().format("H:mm");
		        
		var wrapper = document.createElement("div");
		var morningText = document.createElement("span");
		if ()(this.events.morning_start) && (this.events.morning_start === undefined))
			morningText.innerHTML = this.config.closed;
		else 
			morningText.innerHTML = this.events.morning_start_str + " - " + this.events.morning_end_str;
		
		var seperatorText = document.createElement("span");
		seperatorText.innerHTML = this.config.seperator;
		
		var eveningText = document.createElement("span");
		if (this.events.evening_start === undefined)
			eveningText.innerHTML = this.config.closed;
		else
			eveningText.innerHTML = this.events.evening_start_str + " - " + this.events.evening_end_str;
		
		if (timeNow.hour() >= this.events.morning_end)
		  morningText.className = "dimmed";
		else if (timeNow.hour() >= this.events.morning_start)
		  morningText.style.cssText="color:green;"
		else 
		  morningText.className = "bright";

		if (timeNow.hour()>=this.events.evening_end)
		  eveningText.className = "dimmed";
		else if (timeNow.hour() >= this.events.evening_start)
		  eveningText.style.cssText="color:green;"
		else 
		  eveningText.className = "bright";  

        console.log(timeNowString, this.events.morning_start_str, this.events.morning_end_str, this.events.evening_start_str, this.events.evening_end_str)
        console.log(timeNow.hour(), this.events.morning_start, this.events.morning_end, this.events.evening_start, this.events.evening_end)
		wrapper.appendChild(morningText);
		wrapper.appendChild(seperatorText);
		wrapper.appendChild(eveningText);
		return wrapper;
	}
});
