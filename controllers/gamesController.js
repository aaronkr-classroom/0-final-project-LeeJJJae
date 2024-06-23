// gamesController.js
const Game = require("../models/Game");

module.exports = {
  index: (req, res) => {
    Game.find()
      .then(games => {
        res.render("games/index", { games: games });
      })
      .catch(error => {
        console.log(`Error fetching games: ${error.message}`);
        res.redirect("/");
      });
  },

  new: (req, res) => {
    res.render("games/new");
  },

  create: (req, res) => {
    let gameParams = {
      title: req.body.title,
      director: req.body.director,
      releaseDate: req.body.releaseDate,
      genre: req.body.genre
    };
    Game.create(gameParams)
      .then(game => {
        res.redirect(`/games/${game._id}`); // 수정: game._id로 변경
      })
      .catch(error => {
        console.log(`Error saving game: ${error.message}`);
        res.redirect("/games/new");
      });
  },

  show: (req, res) => {
    let gameId = req.params.id;
    Game.findById(gameId)
      .then(game => {
        res.render("games/show", { game: game });
      })
      .catch(error => {
        console.log(`Error fetching game by ID: ${error.message}`);
        res.redirect("/games");
      });
  },

  edit: (req, res) => {
    let gameId = req.params.id;
    Game.findById(gameId)
      .then(game => {
        res.render("games/edit", { game: game });
      })
      .catch(error => {
        console.log(`Error fetching game by ID: ${error.message}`);
        res.redirect("/games");
      });
  },

  update: (req, res) => {
    let gameId = req.params.id;
    let gameParams = {
      title: req.body.title,
      director: req.body.director,
      releaseDate: req.body.releaseDate,
      genre: req.body.genre
    };
    Game.findByIdAndUpdate(gameId, { $set: gameParams })
      .then(() => {
        res.redirect(`/games/${gameId}`);
      })
      .catch(error => {
        console.log(`Error updating game by ID: ${error.message}`);
        res.redirect("/games");
      });
  },

  delete: (req, res) => {
    let gameId = req.params.id;
    Game.findByIdAndRemove(gameId)
      .then(() => {
        res.redirect("/games");
      })
      .catch(error => {
        console.log(`Error deleting game by ID: ${error.message}`);
        res.redirect("/games");
      });
  }
};
