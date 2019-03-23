/* global Module */

/* Magic Mirror
 * Module: MMM-Mondeal
 *
 * By ido roseman (idoroseman.com)
 */

Module.register("MMM-Mondeal",{

	// Default module config.
	defaults: {
		updateInterval: 10 * 60 * 1000, // every 10 minutes
		initialLoadDelay: 2500, // 2.5 seconds delay. This delay is used to keep the OpenWeather API happy.
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.matches = [];
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.updateTimer = null;
	},
	
	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");
		wrapper.innerHTML = "Mondeal";

		var table = document.createElement("table");
		var titlerow = document.createElement("tr");
		var title = document.createElement("td");
		title.colSpan = "5";
		title.className = "bright";
		title.style.textAlign = "center";
		title.innerHTML = "מונדיאל 2018";
		titlerow.appendChild(title);
		table.appendChild(titlerow);
		var titlerow2 = document.createElement("tr");
		var title2 = document.createElement("td");
		title2.colSpan = "5";
		title2.style.textAlign = "center";
		title2.innerHTML = this.matches[0]["roundName"];
		titlerow2.appendChild(title2);
		table.appendChild(titlerow2);
		
		for (var i in this.matches) {
			var row = document.createElement("tr");
			Log.info(this.matches[i]);
			// home team 
			var homeTeam = document.createElement("td");
			homeTeam.className = "bright";
			homeTeam.innerHTML = this.matches[i]["homeTeam"]["name"];
			// home team flag
			var homeTeamFlag = document.createElement("td");
			var img = document.createElement('img');
		    img.src = this.matches[i]["homeTeam"]["logo"];
		    img.style.width ="60px";
		    homeTeamFlag.appendChild(img);
			// away team 
			var awayTeam = document.createElement("td");
			awayTeam.className = "bright";
			awayTeam.innerHTML = this.matches[i]["awayTeam"]["name"];
			// away team flag
            var awayTeamFlag = document.createElement("td");
			var img = document.createElement('img');
		    img.src = this.matches[i]["awayTeam"]["logo"];
		    img.style.width ="60px";
		    awayTeamFlag.appendChild(img);
			// center
			var center = document.createElement("td");
			if (this.matches[i]["status"] == 0) // finished
			{ 
			  center.innerHTML = this.matches[i]["results"]["scoreHome"] 
			                     + " - " +
			                     this.matches[i]["results"]["scoreAway"] ;
			  if ((this.matches[i]["results"]["penaltyScoreHome"]>0) || (this.matches[i]["results"]["penaltyScoreAway"]>0))
			    center.innerHTML += "</br>(" 
			    				 + this.matches[i]["results"]["penaltyScoreHome"] 
			                     + " - " +
			                     this.matches[i]["results"]["penaltyScoreAway"] 
			                     +")";
			}
			else if (this.matches[i]["status"] == 1) // tobeplayed
			{
			   var dt = moment.utc(this.matches[i]["dateUTC"]);
			   center.innerHTML = dt.local().format("LT");
			}
			else 
			{
			   center.innerHTML = this.matches[i]["statusDescription"];
			}

			row.appendChild(homeTeamFlag);
			row.appendChild(homeTeam);
			row.appendChild(center);
			row.appendChild(awayTeam);
			row.appendChild(awayTeamFlag);			
			table.appendChild(row);
		}
		return table;
	},
	
	/* scheduleUpdate()
	 * Schedule next update.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			Log.info("Mondeal >> updatetimer");
			self.updateMatches();
		}, nextLoad);
	},
	
	/* updateWeather(compliments)
	 * Requests new data from openweather.org.
	 * Calls processWeather on succesfull response.
	 */
	updateMatches: function() {
        var url = "https://hbsipbc.deltatre.net/hbs/api/cup/fifawc/season/2018/date/"+moment().format("YYYY-MM-DD")+"/matches?timezoneoffset=3";
		Log.info("loading " + url);
		fetch(url)
		  .then((response) => {
			return response.json();
		  })
		  .then((myJson) => {
			this.matches = myJson["modules"]["matches"];
			this.updateDom(this.config.animationSpeed);
		  });
		this.scheduleUpdate();	  
	},
	
});
