/* Magic Mirror Module: random_quotes
 * v1.0 - June 2016
 *
 * By Ashley M. Kirchner <kirash4@gmail.com>
 * Beer Licensed (meaning, if you like this module, feel free to have a beer on me, or send me one.)
 */

Module.register("MMM-Quotes", {
  /* Quotes are courtesy of
    	http://www.pitgam.net/1/
    	https://he.wikiquote.org/wiki/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%94:%D7%A4%D7%AA%D7%92%D7%9E%D7%99%D7%9D
	 */

  // Module config defaults.
  defaults: {
    updateInterval: 30 * 60, // Value is in SECONDS
    fadeSpeed: 4, // How fast (in SECONDS) to fade out and back in when changing quotes
    category: "random", // Category to use
    maxLength: 150
  },

  // Define start sequence.
  start: function () {
    Log.info("Starting module: " + this.name);

    this.quote = "";
    this.author = "";
    this.randomQuote();
    // Schedule update timer.
    var self = this;
    setInterval(function () {
      self.randomQuote();
    }, this.config.updateInterval * 1000);
  },

  /* randomQuote()
   * Retrieve a random quote.
   *
   * return quote string - A quote.
   */
  randomQuote: function () {
    this.sendSocketNotification("GET_QUOTE", {
      maxLength: this.config.maxLength
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification !== "QUOTE_DATA") {
      return;
    }

    if (payload && payload.error) {
      this.quote = "Unable to fetch quote";
      this.author = payload.error;
      this.updateDom(this.config.fadeSpeed * 1000);
      return;
    }

    this.quote = (payload && payload.quote) || "";
    this.author = (payload && payload.author) || "";
    this.updateDom(this.config.fadeSpeed * 1000);
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");

    var quote = document.createElement("div");
    quote.className = "bright small light";
    quote.style.textAlign = "right";
    //quote.style.margin = '0 auto';
    quote.style.maxWidth = "300px";
    quote.style.wordWrap = "break-word";
    quote.style.direction = "rtl";
    quote.innerHTML = this.quote;

    wrapper.appendChild(quote);

    var author = document.createElement("div");
    author.className = "light small dimmed";
    author.innerHTML = this.author;

    wrapper.appendChild(author);

    return wrapper;
  }
});
