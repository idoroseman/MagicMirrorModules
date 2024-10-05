Module.register("MMM-Escape", {
	// Module config defaults.
	defaults: {
        updateInterval: 60 * 60 * 1000,
        baseUrl: "https://www.passportcard.co.il/article/airlines-at-war/"
    },

    	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);
        this.fetchAirlinesData();

		// Schedule update timer.
		setInterval(() => {
            this.fetchAirlinesData();
		}, this.config.updateInterval);
	},


    fetchAirlinesData: function () {
		this.fetchData(this.getUrl())
			.then((data) => {
                Log.info("loaded airline data")
			})
			.catch(function (request) {
				Log.error("Could not load data ... ", request);
			})
			.finally(() => this.updateDom());
    },

	getTemplate: function () {
        return "MMM-Escape.njk";
	},

    // Add all the data to the template.
	getTemplateData: function () {
		return {
			current: this.data
		};
	},
})
