# Module: ramzor
The `ramzor` module is used to show city status on the mirror.
## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: "ramzor",
		position: "bottom_bar",	// This can be any of the regions.
		config: {
			// See 'Configuration options' for more information.
			cities: ["גני תקווה", "קרית אונו"]
		}
	}
]
````

## Configuration options

The following properties can be configured:

| Option   | Description
| -------- | -----------
| `cities` | a list of city names
