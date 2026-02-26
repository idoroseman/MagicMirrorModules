const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {},

  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_SENSORS") {
      const { url, token } = payload;
      try {
        const response = await fetch(`${url}/api/states`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        // Filter for moisture sensors (entity_id starts with 'sensor.' and has 'moisture' in friendly_name or attributes)
        const sensors = data.filter(e =>
          e.entity_id.startsWith("sensor.") &&
          ((e.attributes && e.attributes.device_class === "moisture") ||
           (e.attributes && e.attributes.friendly_name && e.attributes.friendly_name.toLowerCase().includes("moisture"))) &&
          !(e.attributes && e.attributes.friendly_name && e.attributes.friendly_name.includes("Soil Moisture Status"))
        ).map(e => ({
          name: e.attributes.friendly_name || e.entity_id,
          value: Math.min(100, parseFloat(e.state))
        }));
        this.sendSocketNotification("SENSORS_DATA", sensors);
      } catch (err) {
        this.sendSocketNotification("SENSORS_DATA", []);
      }
    }
  }
});
