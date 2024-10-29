Module.register("MMM-Escape", {
  // Module config defaults.
  defaults: {
    header: "Flights",
    updateInterval: 60 * 60 * 1000
  },

  baseUrl:
    "https://cors-anywhere.herokuapp.com/https://www.passportcard.co.il/article/airlines-at-war/",
  isLoaded: false,
  items: [],

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
    Log.info("getting airline data");
    fetch(this.baseUrl)
      .then((res) => res.text())
      .then((body) => {
        Log.info("loaded airline data");
        this.data = [];
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
        Log.info(this.items);
        this.updateDom();
      })
      .catch((err) => {
        Log.warn(err);
        this.isLoaded = true;
        this.items = [{ name:"error", isFlying: false, notes: err}]
      });
  },

  getTemplate: function () {
    // see https://mozilla.github.io/nunjucks/templating.html
    Log.info("getTemplate");
    return "MMM-Escape.njk";
  },

  // Add all the data to the template.
  getTemplateData: function () {
    Log.info("getTemplateData");
    return {
      loaded: this.isLoaded,
      config: this.config,
      items: this.items
    };
  }
});
