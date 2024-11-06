Module.register("MMM-NBA", {
	// Default module config.
	defaults: {
        header: "NBA",
        // nocors: "https://cors-anywhere.herokuapp.com/",
        nocors: "http://magicmirror.local:8000",
        updateInterval: 10 * 60 * 60 * 1000, // every 10 minutes
	},

    games:[],

    baseUrl:
        "https://d26dmzpiksq0q.cloudfront.net/static/hou-homepage-v2.json",

    start: function () {
        Log.info("Starting module: " + this.name);

        this.fetchData();
        // Schedule update timer.
        setInterval(() => {
        this.fetchData;
        }, this.config.updateInterval);
    },

    fetchData() {
        Log.info(this.name + " fetching data");
        fetch(this.baseUrl)
        .then((res) => res.json())
        .then((houston) => {
            houston.schedule.filter(x=>x.st==3).slice(-3).forEach(element => {
                this.games.push({
                    gameId: element.gid,
                    gameDate: element.gdte,
                    gameStatus: element.st,

                    homeId: element.h.tid,
                    homeName: element.h.tn,
                    homeCity: element.h.tc,
                    homeTricode: element.h.ta,
                    homeScore: element.h.s,
                    homeClass: element.h.s > element.v.s ? "bright": "",

                    awayId: element.v.tid,
                    awayName: element.v.tn,
                    awayCity: element.v.tc,
                    awayTricode: element.v.ta,
                    awayScore: element.v.s,
                    awayClass: element.v.s > element.h.s ? "bright": "",
                })
            });
            houston.schedule.filter(x=>x.st!=3).slice(0,2).forEach(element => {
                this.games.push({
                    gameId: element.gid,
                    gameDate: element.gdte,
                    gameStatus: element.st,

                    homeId: element.h.tid,
                    homeName: element.h.tn,
                    homeCity: element.h.tc,
                    homeTricode: element.h.ta,
                    homeScore: element.h.s,
                    homeClass: "",

                    awayId: element.v.tid,
                    awayName: element.v.tn,
                    awayCity: element.v.tc,
                    awayTricode: element.v.ta,
                    awayScore: element.v.s,
                    awayClass: "",
                })
            });
            this.updateDom();
        })
        .catch((err)=>{Log.info(err)})
    },

    getStyles () {
		return ["MMM-NBA.css"];
	},

	getTemplate () {
		return "MMM-NBA.njk";
	},

	getTemplateData () {
		return { games:this.games }
	}
});
