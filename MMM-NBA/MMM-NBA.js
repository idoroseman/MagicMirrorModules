Module.register("MMM-NBA", {
	// Default module config.
	defaults: {
        header: "NBA",
        // nocors: "https://cors-anywhere.herokuapp.com/",
        nocors: "http://magicmirror.local:8000",
        updateInterval: 2 * 60 * 60 , // every 10 minutes
	},

    games:[],

    baseUrl:
        "https://d26dmzpiksq0q.cloudfront.net/static/hou-homepage-v2.json",

    start: function () {
        Log.info("Starting module: " + this.name);

        this.fetchData();
        // Schedule update timer.
        setInterval(() => {
            this.fetchData();
        }, this.config.updateInterval * 1000);
    },

    fetchData() {
        Log.info(this.name + " fetching data");
        this.lastUpdated = new Date().toLocaleString("en-IL", { dateStyle: 'short', timeStyle: 'short' });
        fetch(this.baseUrl)
        .then((res) => res.json())
        .then((houston) => {
            this.status = "ok";
            this.games = [];
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
                    homeClass: Number(element.h.s) > Number(element.v.s) ? "bright": "",

                    awayId: element.v.tid,
                    awayName: element.v.tn,
                    awayCity: element.v.tc,
                    awayTricode: element.v.ta,
                    awayScore: element.v.s,
                    awayClass: Number(element.v.s) > Number(element.h.s) ? "bright": "",
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
        .catch((err)=>{Log.info(err); this.status="err"})
    },

    getStyles () {
		return ["MMM-NBA.css"];
	},

	getTemplate () {
		return "MMM-NBA.njk";
	},

	getTemplateData () {
		return { games:this.games, lastUpdated:this.lastUpdated, status:this.status }
	}
});
