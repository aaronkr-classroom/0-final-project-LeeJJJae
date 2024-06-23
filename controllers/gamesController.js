"use strict";

const Game = require("../models/Game"),
  User = require("../models/User"),
  httpStatus = require("http-status-codes");

module.exports = {
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },

  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }

    res.json(errorObject);
  },

  join: (req, res, next) => {
    let gameId = req.params.id,
      currentUser = req.user;

    if (currentUser) {
      User.findByIdAndUpdate(currentUser._id, { // 수정: currentUser._id로 변경
        $addToSet: {
          games: gameId,
        },
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },

  filterUserGames: (req, res, next) => {
    let currentUser = req.user;

    if (currentUser) {
      let mappedGames = res.locals.games.map((game) => {
        let userJoined = currentUser.games.some((userGame) => {
          return userGame.equals(game._id);
        });

        return Object.assign(game.toObject(), { joined: userJoined });
      });

      res.locals.games = mappedGames;
      next();
    } else {
      next();
    }
  },

  index: (req, res, next) => {
    Game.find()
      .then((games) => {
        res.locals.games = games;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching games: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.games);
    } else {
      res.render("games/index", {
        page: "games",
        title: "All Games",
        games: res.locals.games, // 추가: 게임 목록 전달
      });
    }
  },

  new: (req, res) => {
    res.render("games/new", {
      page: "new-game",
      title: "New Game",
    });
  },

  create: (req, res, next) => {
    let gameParams = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents, // 수정: maxStudents로 변경
      cost: req.body.cost,
    };

    Game.create(gameParams)
      .then((game) => {
        res.locals.redirect = "/games";
        res.locals.game = game;
        next();
      })
      .catch((error) => {
        console.log(`Error saving game: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let gameId = req.params.id;
    Game.findById(gameId)
      .then((game) => {
        res.locals.game = game;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching game by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("games/show", {
      page: "game-details",
      title: "Game Details",
      game: res.locals.game, // 추가: 게임 상세 정보 전달
    });
  },

  edit: (req, res, next) => {
    let gameId = req.params.id;
    Game.findById(gameId)
      .then((game) => {
        res.render("games/edit", {
          game: game,
          page: "edit-game",
          title: "Edit Game",
        });
      })
      .catch((error) => {
        console.log(`Error fetching game by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let gameId = req.params.id,
      gameParams = {
        title: req.body.title,
        description: req.body.description,
        maxStudents: req.body.maxStudents, // 수정: maxStudents로 변경
        cost: req.body.cost,
      };

    Game.findByIdAndUpdate(gameId, {
      $set: gameParams,
    })
      .then((game) => {
        res.locals.redirect = `/games/${gameId}`;
        res.locals.game = game;
        next();
      })
      .catch((error) => {
        console.log(`Error updating game by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let gameId = req.params.id;
    Game.findByIdAndRemove(gameId)
      .then((deletedGame) => {
        if (!deletedGame) {
          let error = new Error("Game not found");
          error.status = 404;
          throw error;
        }
        res.locals.redirect = "/games";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting game by ID: ${error.message}`);
        next(error); // 에러 핸들링을 위해 next(error) 호출
      });
  },
};
