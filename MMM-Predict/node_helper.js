/* Magic Mirror
 * Node Helper: Calendar
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var fs = require("fs");
var moment = require('moment');
var jspredict = require('jspredict');
const fetch = require("node-fetch");

var files = ["amateur", "stations", "weather"]

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		this.events = null;
		this.tle = {}
		console.log("Starting node helper for: " + this.name);
		this.download_amsat()
		this.download_celestrack()
		setInterval(() => {
			this.calculate_predictions()
			this.sendSocketNotification("UPDATE", {preditions: this.preditions.slice(0, this.lines)});
		}, 60 * 60 * 1000);   //perform every 1000 milliseconds.
	},
	
	download_amsat(){
		fetch("https://www.amsat.org/tle/current/nasabare.txt")
		.then((response)=>{return response.text()})
		.then((text)=>{
		     var i = 0;
		     var item = ""
		     var name = ""
		     text.split('\n').forEach((line, i)=>{
                  if ((i % 3 == 0) && (item != "")) {
                      this.tle[name] = item		    
                      name = ""
                      item = ""
                    }   
                  if (i%3 == 0)
                    name = line
                  else
                    item += line + '\n'
		       })
		})
	},

    download_celestrack : function(){
		fetch("http://www.celestrak.com/NORAD/elements/weather.txt")
		.then((response)=>{return response.text()})
		.then((text)=>{
		     var i = 0;
		     var item = ""
		     var name = ""
		     text.split('\n').forEach((line, i)=>{
                  if ((i % 3 == 0) && (item != "")) {
                      this.tle[name] = item		    
                      name = ""
                      item = ""
                    }   
                  if (i%3 == 0)
                    name = line
                  else
                    item += line + '\n'
		       })
		})    
    
    },
    
    calculate_predictions: function(){
        this.preditions = []
        const now = new Date().getTime();
        console.log("this location", this.location)

        this.satellites.forEach((satName)=>{
          console.log("predicting for", satName)
          var tle = ""
          Object.keys(this.tle).forEach((key)=>{
            if (key.includes(satName)) {
              tle = "0 "+key+"\n"+this.tle[key]; 
              console.log(key)
			  console.log(tle)
			  var preditions = jspredict.transits(tle, this.location, now, now + 10*24*60*60*1000, this.minimum_elevation)
			  preditions.forEach((pred)=>{pred.name=key})
			  this.preditions = this.preditions.concat(preditions)
			  }
            })
        })
        this.preditions = this.preditions.sort((a,b)=>{return a.start - b.start})
    },

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
	    if (notification === "START") {
			console.log(this.name+" started");
			this.location = payload.location
    		this.satellites = payload.satellites
     		this.minimum_elevation = payload.minimum_elevation
     		this.lines = payload.lines
			this.calculate_predictions()
			this.sendSocketNotification("UPDATE", {preditions: this.preditions.slice(0,this.lines)});
		}
		else {
	        console.log("DEBUG");
	        console.log(payload.name);
	        console.log(JSON.stringify(payload.data));
	    }
		 
	}
	
});
