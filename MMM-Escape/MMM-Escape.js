Module.register("MMM-Escape", {
	// Default module config.
	defaults: {
    header: "Airlines",
    nocors: "https://cors-anywhere.herokuapp.com/",
    updateInterval: 10 * 60 * 60 * 1000, // every 10 minutes
	},

  isLoaded: false,
  items: [],

  baseUrl:
    "https://www.passportcard.co.il/article/airlines-at-war/",

  start: function () {
    Log.info("Starting module: " + this.name);

    this.fetchData();
    // Schedule update timer.
    setInterval(() => {
      this.fetchData;
    }, this.config.updateInterval);
  },

  fetchData() {
    fetch(this.config.nocors + this.baseUrl)
    .then((res) => res.text())
    .then((body) => {
      this.items = [];
      var el = document.createElement("html");
      el.innerHTML = body;
      var rows = el.getElementsByTagName("tr"); // Live NodeList of your anchor elements
      for (const i in rows) {
        if (typeof rows[i] !== "object") continue;
        const elements = rows[i].getElementsByTagName("td");
        if (elements.length < 2) continue;
        const [flying, notes] = elements[1].innerText.split(" – ");
        this.items.push({
          name: elements[0].innerText,
          isFlying: flying.startsWith("כן"),
          notes
        });
      }
      this.isLoaded = true;
      this.updateDom(this.config.animationSpeed);
    })
    .catch((err) => {
      Log.warn(err);
      this.isLoaded = true;
      this.items = [{ name:"error", isFlying: false, notes: err}]
    });    
    this.updateDom(this.config.fadeSpeed);
  },

  // Define required scripts.
	getStyles () {
		return ["MMM-Escape.css"];
	},

	getTemplate () {
		return "MMM-Escape.njk";
	},

	getTemplateData () {
		return { 
      items:this.items, 
      loaded: this.isLoaded 
    };
	}
});
