// controllers/gamesController.js

const Game = require("../models/Game");

module.exports = {
  index: (req, res, next) => {
    Game.find()
      .then((games) => {
        res.render("games/index", { games });
      })
      .catch((error) => {
        console.error(`Error fetching games: ${error.message}`);
        next(error);
      });
  },

  new: (req, res) => {
    res.render("games/new");
  },

  create: (req, res, next) => {
    const gameParams = {
      title: req.body.title,
      description: req.body.description,
      maxPlayers: req.body.maxPlayers,
      cost: req.body.cost,
    };

    Game.create(gameParams)
      .then((game) => {
        res.redirect("/games");
      })
      .catch((error) => {
        console.error(`Error creating game: ${error.message}`);
        next(error);
      });
  },

  show: (req, res, next) => {
    const gameId = req.params.id;

    Game.findById(gameId)
      .then((game) => {
        if (!game) {
          const error = new Error("Game not found");
          error.status = 404;
          throw error;
        }
        res.render("games/show", { game });
      })
      .catch((error) => {
        console.error(`Error fetching game by ID: ${error.message}`);
        next(error);
      });
  },

  edit: (req, res, next) => {
    const gameId = req.params.id;

    Game.findById(gameId)
      .then((game) => {
        if (!game) {
          const error = new Error("Game not found");
          error.status = 404;
          throw error;
        }
        res.render("games/edit", { game });
      })
      .catch((error) => {
        console.error(`Error fetching game by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    const gameId = req.params.id;
    const gameParams = {
      title: req.body.title,
      description: req.body.description,
      maxPlayers: req.body.maxPlayers,
      cost: req.body.cost,
    };

    Game.findByIdAndUpdate(gameId, gameParams, { new: true })
      .then((game) => {
        if (!game) {
          const error = new Error("Game not found");
          error.status = 404;
          throw error;
        }
        res.redirect(`/games/${gameId}`);
      })
      .catch((error) => {
        console.error(`Error updating game by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    const gameId = req.params.id;

    Game.findByIdAndDelete(gameId)
      .then(() => {
        res.redirect("/games");
      })
      .catch((error) => {
        console.error(`Error deleting game by ID: ${error.message}`);
        next(error);
      });
  },
};
