
Module.register("MMM-Irrigation", {
	defaults: {
		homeAssistantUrl: "http://homeassistant.local:8123",
		accessToken: "YOUR_LONG_LIVED_ACCESS_TOKEN",
		updateInterval: 60 * 1000 // 1 minute
	},

	start() {
		this.sensors = [];
		this.loaded = false;
		this.getData();
		this.scheduleUpdate();
	},

	scheduleUpdate() {
		setInterval(() => {
			this.getData();
		}, this.config.updateInterval);
	},

	getData() {
		this.sendSocketNotification("GET_SENSORS", {
			url: this.config.homeAssistantUrl,
			token: this.config.accessToken
		});
	},

	socketNotificationReceived(notification, payload) {
		if (notification === "SENSORS_DATA") {
			this.sensors = payload;
			this.loaded = true;
			this.updateDom();
		}
	},

	getTemplate() {
		return "MMM-Irrigation.njk";
	},

	getTemplateData() {
		return {
			sensors: this.sensors,
			loaded: this.loaded
		};
	},

	getStyles() {
		return ["MMM-Irrigation.css"];
	}
});
