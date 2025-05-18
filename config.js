/* MagicMirror² Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
	address: "0.0.0.0", // Address to listen on, can be:
	// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	// - another specific IPv4/6 to listen on a specific interface
	// - "0.0.0.0", "::" to listen on any interface
	// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", // The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
	// you must set the sub path here. basePath must end with a /
	ipWhitelist: [], // []"127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:10.0.0.1/24"], 	// Set [] to allow all IP addresses
	// or add a specific IPv4 of 192.168.1.5 :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, // Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", // HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", // HTTPS Certificate path, only require when useHttps is true

	language: "he",
	locale: "he-IL",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [

		{
			module: "alert"
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left",
			config: {
				dateFormat: "ddd D/M/YYYY"
			}
		},
		{
			module: "MMM-Worldclock",
			position: "top_right", // This can be any of the regions, best results in top_left or top_right regions
			config: {
				timeFormat: "HH:mm", //defined in moment.js format()
				style: "right", //predefined 4 styles; 'top', 'left','right','bottom'
				clocks: [
					{
						title: "UTC", // Too long title could cause ugly text align.
						timezone: "Etc/UTC", //When omitted, Localtime will be displayed. It might be not your purporse$
						flag: "eu"
					},
					{
						title: "New York NY", // Too long title could cause ugly text align.
						timezone: "US/Eastern", //When omitted, Localtime will be displayed. It might be not your purpo$
						flag: "us"
					},
					{
						title: "Seatlle WA",
						timezone: "US/Pacific",
						flag: "us"
					}
				]
			}
		},
		{
			module: "calendar",
			header: "Calendar",
			position: "top_left",
			config: {
				timeFormat: "dateheaders",
				maximumNumberOfDays: 7,
				dateFormat: "ddd D/M",
				calendars: [
					{
						symbol: "", // "calendar-check-o ",
						url: "https://calendar.google.com/calendar/ical/3osdptulpd7jrbnrhtf74o1r3k%40group.calendar.google.com/private-ff7d52f1ddbb5af3ada0b6c70bf480c9/basic.ics"
					},
					{
						symbol: "",
						url: "https://calendar.google.com/calendar/ical/ido.roseman%40gmail.com/private-8629b8f04a2cd1984ff1b4e8935b74cc/basic.ics"
					},
					{
						symbol: "calendar-check",
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"
					}
				]
			}
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 32.063927,
				lon: 34.871967
				// weatherProvider: "openweathermap",
				// type: "current",
				// showWindDirection: false,
				// showSun: false,
				// location: "Petah Tikva",
				// locationID: "6693674", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				// apiKey: "2b658d7ece0429cc47e94b12666f099d"
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				// weatherProvider: "openweathermap",
				weatherProvider: "openmeteo",
				type: "forecast",
				maxNumberOfDays: 7,
				lat: 32.063927,
				lon: 34.871967
				// location: "Petah Tikva",
				// locationID: "6693674", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				// apiKey: "2b658d7ece0429cc47e94b12666f099d"
			}
		},
		{
			module: "MMM-MyCommute",
			position: "bottom_right",
			config: {
				apikey: "AIzaSyCrEcb1ATw1s0razMFEx6-ZpORPRAtHY_s",
				origin: "Derech HaMelech 7, Ganei Tikva",
				nextTransitVehicleDepartureFormat: "[יוצא ב] H:mm",
				destinations: [
					{
						destination: "Wingate Street 22, Kiryat Ono",
						label: "בית ספר",
						mode: "transit",
						showNextVehicleDeparture: true
					}
				]
			}
		},
		{
			module: "ido/MMM-School",
			position: "bottom_right",
			header: "מערכת",
			config: {}
		},
/*
		{
			module: "ido/MMM-MultiCountDown",
			position: "bottom_left",
			config: {
				events: [
					{
						name: "school starts",
						date: "2023-09-03"
					},
					{
						name: "rugby world championship",
						date: "2023-09-08"
					},
					{
						name: "lovejoy concert",
						date: "2023-09-27"
					}

				]
			}
		},
*/
		{
			module: "ido/MMM-NBA",
			header: "MMM-NBA",
			position: "top_right",
			config: {
				focus_on: ["HOU"],
				teams: ["HOU"],
				nocors: "http://magicmirror.local:8000/",
			}
		},
/*
		{
			module: 'ido/MMM-Escape',
            position: "bottom_left",
			config: {
				nocors: "http://magicmirror.local:8000/",
			}
        },
*/

		{
			module: "ido/MMM-Birthday",
			header: "ימי הולדת",
			position: "top_left",
			config: {
				formats: {
					sameDay: "[היום]",
					nextDay: "[מחר]",
					nextWeek: "dddd",
					lastDay: "[אתמול]",
					lastWeek: "dddd [שעבר]",
					sameElse: "DD/MM"
				}
			}
		},
		{
			module: "ido/MMM-Quotes",
			header: "ציטוט",
			position: "bottom_left",
			config: {
				nocors: "http://magicmirror.local:8000/",
			}
		},
		{
			module: "MMM-RandomPhoto",
			position: "fullscreen_below",
			config: {
				opacity: 0.3,
				animationSpeed: 500,
				updateInterval: 300,
				url: "https://unsplash.it/1080/1920/?random"
			}
		},
		{
			module: "ido/MMM-Config"
		}

	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
