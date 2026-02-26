Module.register("huskies", {
	// Default module config.
	defaults: {
        header: "Northeastern University Athletics",
        nocors: "http://magicmirror.local:8000/",
        updateInterval: 2 * 60 * 60 , // every 10 minutes
	},

    games:[],

    baseUrl: "http://nuhuskies.com/sports/womens-basketball/schedule",

    start: function () {
        Log.info("Starting module: " + this.name);

        this.fetchData();
        // Schedule update timer.
        setInterval(() => {
            this.fetchData();
        }, this.config.updateInterval * 1000);
    },

    fetchData() {
        Log.info(this.name + " fetching data using CORS proxy: " + this.config.nocors);
        this.status = "fetching";
        this.lastUpdated = new Date().toLocaleString("en-IL", { dateStyle: 'short', timeStyle: 'short' });
        fetch(this.config.nocors + this.baseUrl, {
            method: 'GET', 
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
        .then(res => res.json())
        .then(html => {
            console.log("got response");
            // const match = res.text().match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
            // if (!match) throw new Error("No JSON-LD found");
            // const jsonld = JSON.parse(match[1]);

            this.status = "ok";
            // this.games = [];
            // jsonld.filter(x=>x.st==3).slice(-3).forEach(element => {
            //     this.games.push({
            //     })
            // });
            // jsonld.filter(x=>x.st!=3).slice(0,2).forEach(element => {
            //     this.games.push({
            //     })
            // });
            this.updateDom();
        })
        .catch((err)=>{Log.info(err); this.status="err"})
    },

    getStyles () {
		return ["huskies.css"];
	},

	getTemplate () {
		return "huskies.njk";
	},

	getTemplateData () {
		return { games:this.games, lastUpdated:this.lastUpdated, status:this.status }
	}
});
