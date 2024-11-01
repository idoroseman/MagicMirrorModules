/* global Module */

/* Magic Mirror
 * Module: MMM-Mondeal
 *
 * By ido roseman (idoroseman.com)
 */

Module.register("MMM-NBA", {
  // Default module config.
  defaults: {
    updateInterval: 10 * 60 * 1000, // every 10 minutes
    teams: [],
    pastGamesCount: 3,
    dueGamesCount: 2,
    nocors: "https://cors-anywhere.herokuapp.com/",
  },

  pastGames: [],
  dueGames: [],
  seasonYear: "started",
  url: "http://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json",
  
  // Define start sequence.
  start: function () {
    Log.info("Starting module: " + this.name);

    this.updateGames();
    setInterval(() => {
      this.updateGames();
    }, this.config.updateInterval);
  },

  drawGameRow: function (game) {
    var row = document.createElement("tr");

    // home team flag
    var homeTeamFlag = document.createElement("td");
    var img1 = document.createElement("img");
    img1.src =
      "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/" +
      game.homeTeam.teamTricode +
      ".png";
    img1.style.width = "30px";
    homeTeamFlag.appendChild(img1);
    row.appendChild(homeTeamFlag);
    // home team
    var homeTeam = document.createElement("td");
    if (game.homeTeam.score > game.awayTeam.score)
      homeTeam.className = "bright";
    homeTeam.innerHTML = game["homeTeam"]["teamName"];
    row.appendChild(homeTeam);
    // center
    var center = document.createElement("td");
    if (game["gameStatus"] > 1) {
      center.innerHTML =
        game["homeTeam"]["score"] + " - " + game["awayTeam"]["score"];
    } else {
      center.innerHTML = game.gameDate.split(" ")[0];
    }
    row.appendChild(center);
    // away team
    var awayTeam = document.createElement("td");
    if (game.awayTeam.score > game.homeTeam.score)
      awayTeam.className = "bright";
    awayTeam.innerHTML = game["awayTeam"]["teamName"];
    row.appendChild(awayTeam);
    // away team flag
    var awayTeamFlag = document.createElement("td");
    var img2 = document.createElement("img");
    img2.src =
      "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/" +
      game["awayTeam"]["teamTricode"] +
      ".png";
    img2.style.width = "30px";
    awayTeamFlag.appendChild(img2);
    row.appendChild(awayTeamFlag);
    return row;
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = "NBA";

    var table = document.createElement("table");
    var titlerow = document.createElement("tr");
    var title = document.createElement("td");
    title.colSpan = "5";
    title.className = "bright";
    title.style.textAlign = "center";
    title.innerHTML = "NBA Season " + this.seasonYear;
    titlerow.appendChild(title);
    table.appendChild(titlerow);

    for (
      var i = this.pastGames.length - this.config.pastGamesCount;
      i < this.pastGames.length;
      i++
    ) {
      if (this.pastGames[i] !== undefined)
        table.appendChild(this.drawGameRow(this.pastGames[i]));
    }
	for (var i = 0; i<this.config.dueGamesCount; i++) {
		if (this.dueGames[i] !== undefined)
      table.appendChild(this.drawGameRow(this.dueGames[i]));
    }
    return table;
  },

  getJSON: function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  },

  /* updateWeather(compliments)
   * Requests new data from openweather.org.
   * Calls processWeather on succesfull response.
   */
  updateGames: function () {
    this.seasonYear = "loading";
    
    Log.info("loading ", this.config.nocors + this.url);

    fetch(this.config.nocors + this.url, {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
    .then((res) => res.json())
    .then((j) => Log.info(j))
      // .then((myJson) => {
      //   Log.info("json");
      //   this.pastGames = [];
      //   this.dueGames = [];
      //   this.seasonYear = myJson.leagueSchedule.seasonYear;
      //   myJson["leagueSchedule"]["gameDates"].forEach((d) => {
      //     const gameDate = d["gameDate"];
      //     d["games"].forEach((g) => {
      //       if (
      //         this.config.teams.includes(g.homeTeam.teamTricode) ||
      //         this.config.teams.includes(g.awayTeam.teamTricode)
      //       ) {
      //         if (g.gameStatus === 3) this.pastGames.push({ ...g, gameDate });
      //         else this.dueGames.push({ ...g, gameDate });
      //       }
      //     });
      //   });
      //   // console.log(this.pastGames);
      //   // console.log(this.dueGames);
      //   this.seasonYear = myJson.leagueSchedule.seasonYear;
      //   Log.info("done");
      //   this.updateDom(this.config.animationSpeed);
      // })
      // .catch((err) => {
      //   Log.info(err);
      //   this.seasonYear = "error loading <br/>" + err ;
      //   this.updateDom(this.config.animationSpeed);
      // });
  }
});
