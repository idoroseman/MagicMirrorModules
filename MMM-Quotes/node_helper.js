const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start() {},

  async getFetch() {
    if (typeof fetch === "function") {
      return fetch;
    }

    try {
      // node-fetch v3 is ESM-only, so load it dynamically in CommonJS.
      const nodeFetchModule = await import("node-fetch");
      return nodeFetchModule.default;
    } catch (err) {
      throw new Error("Fetch API is unavailable. Use Node.js 18+ or install node-fetch.");
    }
  },

  parseQuotesOfDayFromHtml(html) {
    const contextMatch = html.match(
      /window\.__remixContext\s*=\s*(\{[\s\S]*?\})\s*;<\/script>/i
    );

    if (!contextMatch) {
      return [];
    }

    let remixContext;
    try {
      remixContext = JSON.parse(contextMatch[1]);
    } catch (err) {
      return [];
    }

    const list = remixContext
      && remixContext.state
      && remixContext.state.loaderData
      && remixContext.state.loaderData["routes/quotes-of-day"];

    if (!Array.isArray(list)) {
      return [];
    }

    return list
      .map((item) => {
        const quote = this.cleanHtmlText(item && item.content ? String(item.content) : "");
        const author = this.cleanHtmlText(
          item && item.author && item.author.name ? String(item.author.name) : ""
        );

        return { quote, author };
      })
      .filter((item) => item.quote.length > 0);
  },

  cleanHtmlText(value) {
    return this.decodeHtmlEntities(
      value
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
    );
  },

  decodeHtmlEntities(text) {
    const named = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      nbsp: " "
    };

    return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (entity, code) => {
      if (code[0] === "#") {
        const numeric = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isNaN(numeric) ? entity : String.fromCharCode(numeric);
      }

      return Object.prototype.hasOwnProperty.call(named, code) ? named[code] : entity;
    });
  },

  chooseRandomQuote(quotes, maxLength) {
    if (!Array.isArray(quotes) || quotes.length === 0) {
      return { quote: "", author: "" };
    }

    const shortQuotes = quotes.filter((item) => item.quote.length <= maxLength);
    const candidates = shortQuotes.length > 0 ? shortQuotes : quotes;
    const index = Math.floor(Math.random() * candidates.length);

    return candidates[index];
  },

  async fetchQuote(maxLength) {
    const baseurl = "https://www.pitgam.net/quotes-of-day";
    const fetchFn = await this.getFetch();

    const response = await fetchFn(baseurl);
    if (!response.ok) {
      throw new Error(`Quote service returned ${response.status}`);
    }

    const text = await response.text();
    const quotes = this.parseQuotesOfDayFromHtml(text);
    return this.chooseRandomQuote(quotes, maxLength);
  },

  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_QUOTE") {
      try {
        const maxLength = payload && payload.maxLength ? payload.maxLength : 150;
        const data = await this.fetchQuote(maxLength);

        if (!data.quote) {
          this.sendSocketNotification("QUOTE_DATA", {
            error: "No quote found in response"
          });
          return;
        }

        this.sendSocketNotification("QUOTE_DATA", data);
      } catch (err) {
        this.sendSocketNotification("QUOTE_DATA", { error: err.message });
      }
    }
  }
});
