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
    maxLength: 150,
    quotes: []
  },

  // Define start sequence.
  start: function () {
    Log.info("Starting module: " + this.name);

    this.lastQuoteIndex = -1;
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
    var quote = "";
    var attribute = "";

    let nocors = "https://cors-anywhere.herokuapp.com/";
    let baseurl = "http://www.pitgam.net/random.php?t=1";

    fetch(nocors + baseurl)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
		try {
			// parse html (ugly way)
			var el = document.createElement("html");
			el.innerHTML = text;
			this.quote = el
			.getElementsByClassName("media-body")[0]
			.getElementsByTagName("div")[0].innerText;
			this.author = el
			.getElementsByClassName("media-attributed")[0]
			.innerText.substring(2);
			// this.scheduleUpdate();
			console.log(this.quote, this.author);
		}
		catch (err) {
			console.log(err);
			console.log(text);
			this.quote = text
			this.author = "cors error"
		}
        if (this.quote.length < this.config.maxLength)
          this.updateDom(this.config.fadeSpeed * 1000);
        else this.randomQuote();
      });
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
