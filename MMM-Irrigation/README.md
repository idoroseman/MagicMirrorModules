
# Module: MMM-Irrigation

This module displays all Home Assistant moisture sensors as a list with progress bars for MagicMirror².

## Installation
1. Copy the module folder to your `modules` directory.
2. Run `npm install node-fetch` in the module directory if not already present.

## Configuration
Add the module to your `config.js`:

```
{
	module: "MMM-Irrigation",
	position: "top_left", // or any region
	config: {
		homeAssistantUrl: "http://homeassistant.local:8123",
		accessToken: "YOUR_LONG_LIVED_ACCESS_TOKEN",
		updateInterval: 60000 // ms
	}
}
```

## Notes
- You must create a long-lived access token in Home Assistant (Profile > Long-Lived Access Tokens).
- Only sensors with device_class "moisture" or "moisture" in their friendly name are shown.
