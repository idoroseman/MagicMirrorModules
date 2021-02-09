/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("ramzor",{

	colors : {"ירוק":"green", "צהוב":"yellow", "כתום":"orange", "אדום":"red"},
	rows : "Loading...",

	// Default module config.
	defaults: {
		cities: []
	},

	start: function () {
		Log.log("Starting module: " + this.name);
		setInterval(function() {
			self.updateData();
		}, 12 * 60 * 60 * 1000);
		this.updateData();
	},

  updateData: function () {
		Log.log(this.name + " loading data");
		this.getCitiesData().then(result => {
			this.rows = ""
	  	result.forEach(data=>{
		    this.rows += "<td style=\"background-color:"+this.colors[data.result.records[0].colour]+"\"><center>"
		    this.rows += data.result.records[0].City_Name + "<br/>"
		    this.rows += "<span style=\"font-size:10vw\">" + data.result.records[0].final_score + "</span>"
		    this.rows += data.result.records[0].final_score > data.result.records[1].final_score ? "&uarr;" : "&darr;"
		    this.rows += "<br/>"
		    this.rows += data.result.records[0].Date
		    this.rows += "</center></td>";
		  })
			Log.log(this.name+" request dom update")
			this.updateDom();
		})
	},

	getCitiesData: async function () {
		Log.log("ramzor Start");
//		let nocors = "https://cors-anywhere.herokuapp.com/"

		const responses = await Promise.all(this.config.cities.map(cityName=>{
			Log.log("ramzor city"+cityName);
			var url = new URL('https://data.gov.il/api/3/action/datastore_search')
	   	var params = {resource_id:"8a21d39d-91e3-40db-aca1-f73f7ab1df69", sort:"Date desc", limit:5, q:cityName}
		  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
			return fetch(url);
	  }))
		console.log(responses);
	  const data = await Promise.all(responses.map(response => response.json()))
		Log.log(this.name + " got data: " + data);
	  return data
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("table");
		var eventWrapper = document.createElement("tr");
		eventWrapper.innerHTML = this.rows;
		wrapper.appendChild(eventWrapper);
		return wrapper;
	}
});
