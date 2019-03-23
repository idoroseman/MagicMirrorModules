/* Magic Mirror
 * Node Helper: MMM_Pool
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var fs = require("fs");
var xlsx = require('xlsx');
var moment = require('moment');

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		this.events = null;
		console.log("Starting node helper for: " + this.name);
		this.recalcEvents();
		// Schedule update interval for once a day.
		this.lastUpdate = -1;

		var self = this;
		setInterval(() => {
//			if (self.lastUpdate != self.getDayOfWeek()) {
				self.lastUpdate = self.getDayOfWeek();
				self.recalcEvents();
				var now = new moment.utc();
      			var isodate = now.toISOString().slice(0,10);
      			// console.log("POOL",isodate, self.events[isodate]);
				self.sendSocketNotification("EVENTS_UPDATE", {
					date : isodate,
					events: self.events[isodate]
				});
//				}
			},15*60*1000);

	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
	    if (notification === "START") {
    	    console.log(this.name + " started");
    	    var now = new moment.utc();
			var isodate = now.toISOString().slice(0,10);
			this.sendSocketNotification("EVENTS_UPDATE", {
				date : isodate,
				events: this.events[isodate]
				});

	    }
	    else {
	        console.log("POOL DEBUG");
	        console.log(payload.name);
	        console.log(payload.data);
	        console.log(JSON.stringify(payload.data));
	    }
	},

	recalcEvents: function(){
	    this.events = {};
        var files = fs.readdirSync(this.path+"/files/.");
        files.forEach((file)=>{
            if (file.startsWith("."))
                return;
            console.log("POOL recalc", file);
			var workbook = xlsx.readFile(this.path+"/files/"+file);
			var sheet_name_list = workbook.SheetNames;
			var worksheet = workbook.Sheets[sheet_name_list[sheet_name_list.length-1]]; // doto: cycle all sheets
			// find gym & pool title
			var col = 1;
			var row = 1;
			while (true) {
				var cell_address = String.fromCharCode(0x40 + col) + row.toString();
				var desired_cell = worksheet[cell_address];
				var desired_value = (desired_cell ? desired_cell.v : undefined);
				if (desired_value !== undefined)
				  break;
				row++;
				}
			while (true) {
				col++;
				var cell_address = String.fromCharCode(0x40 + col) + row.toString();
				var desired_cell = worksheet[cell_address];
				var desired_value = (desired_cell ? desired_cell.v : undefined);
				if (desired_value !== undefined)
				  break;
				}
			// parse table
			row += 3;
			while (true) {			
				var cell_address = String.fromCharCode(0x40 + col) + row.toString();
				var desired_cell = worksheet[cell_address];
				var desired_value = (desired_cell ? desired_cell.v : undefined);
				if (desired_value === undefined)
				  break;

				var isodate = this.xlDateToString(desired_value);
			    // morning start
				var cell_address = String.fromCharCode(0x40 + col+2) + row.toString();
				var desired_cell = worksheet[cell_address];
				var morning_start = (desired_cell ? desired_cell.v: undefined);
				var morning_start_str = (desired_cell ? this.intToTimeStr(desired_cell.v) : undefined);
				// morning end
				var cell_address = String.fromCharCode(0x40 + col+3) + row.toString();
				var desired_cell = worksheet[cell_address];
				var morning_end = (desired_cell ? desired_cell.v : undefined);
				var morning_end_str = (desired_cell ? this.intToTimeStr(desired_cell.v) : undefined);
				//evening start
				var cell_address = String.fromCharCode(0x40 + col+4) + row.toString();
				var desired_cell = worksheet[cell_address];
				var evening_start = (desired_cell ? desired_cell.v  : undefined);
				var evening_start_str = (desired_cell ? this.intToTimeStr(desired_cell.v) : undefined);
				// evening end
				var cell_address = String.fromCharCode(0x40 + col+5) + row.toString();
				var desired_cell = worksheet[cell_address];
				var evening_end = (desired_cell ? desired_cell.v : undefined);
				var evening_end_str = (desired_cell ? this.intToTimeStr(desired_cell.v) : undefined);

				this.events[isodate] = {morning_start, morning_end, evening_start, evening_end,
										morning_start_str, morning_end_str, evening_start_str, evening_end_str};
				//console.log("POOL",isodate, this.events[isodate]);
				row++;
				}
        });
        // console.log(JSON.stringify(this.events));
        // console.log("POOL","------");	


    },

	getDayOfWeek: function() {
		var d = new Date();
		return d.getDay()
	},

    xlDateToString: function(d) {
      var parsedDate = xlsx.SSF.parse_date_code(d)
      var jsDate = new moment.utc({y:parsedDate.y, M:parsedDate.m-1, d:parsedDate.d});
      var isodate = jsDate.toISOString().slice(0,10);
      return isodate
    },
    
    intToTimeStr: function(t) {
       h = Math.floor(t);
       m = Math.floor((t-h) * 100);
       result = h.toString() + ":" + m.toString().padStart(2, "0");
       return result;
    }    
});
