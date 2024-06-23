"use strict";

/**
 * =====================================================================
 * Define Express app and set it up
 * =====================================================================
 */

// Modules
const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express();

const session = require("express-session"),
  flash = require("connect-flash");
  

// Controllers
const pagesController = require("./controllers/pagesController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  talksController = require("./controllers/talksController"),
  trainsController = require("./controllers/trainsController"),
  gamesController = require("./controllers/gamesController"),
  errorController = require("./controllers/errorController");

/**
 * =====================================================================
 * Define Mongoose and MongoDB connection
 * =====================================================================
 */

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://ut-node:M1ujmODpxcnSvB11@ut-node.shy2gcv.mongodb.net/?retryWrites=true&w=majority&appName=UT-node");

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

/**
 * =====================================================================
 * Define app settings and middleware
 * =====================================================================
 */

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
  next();
});

/**
 * =====================================================================
 * Define routes
 * =====================================================================
 */

const router = express.Router();
app.use("/", router);

/**
 * Pages
 */
router.get("/", pagesController.showHome);
router.get("/about", pagesController.showAbout);
router.get("/transportation", pagesController.showTransportation);

/**
 * Subscribers
 */
router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

/**
 * Login/Logout
 */
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.validate, usersController.authenticate, usersController.redirectView);
router.get("/users/logout", usersController.logout, usersController.redirectView);

/**
 * Users
 */
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

/**
 * Courses
 */
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

/**
 * Talks
 */
router.get("/talks", talksController.index, talksController.indexView);
router.get("/talks/new", talksController.new);
router.post("/talks/create", talksController.create, talksController.redirectView);
router.get("/talks/:id", talksController.show, talksController.showView);
router.get("/talks/:id/edit", talksController.edit);
router.put("/talks/:id/update", talksController.update, talksController.redirectView);
router.delete("/talks/:id/delete", talksController.delete, talksController.redirectView);

/**
 * Trains
 */
router.get("/trains", trainsController.index, trainsController.indexView);
router.get("/trains/new", trainsController.new);
router.post("/trains/create", trainsController.create, trainsController.redirectView);
router.get("/trains/:id", trainsController.show, trainsController.showView);
router.get("/trains/:id/edit", trainsController.edit);
router.put("/trains/:id/update", trainsController.update, trainsController.redirectView);
router.delete("/trains/:id/delete", trainsController.delete, trainsController.redirectView);

/**
 * Games
 */
router.get("/games", gamesController.index, gamesController.indexView);
router.get("/games/new", gamesController.new);
router.post("/games/create", gamesController.create, gamesController.redirectView);
router.get("/games/:id", gamesController.show, gamesController.showView);
router.get("/games/:id/edit", gamesController.edit);
router.put("/games/:id/update", gamesController.update, gamesController.redirectView);
router.delete("/games/:id/delete", gamesController.delete, gamesController.redirectView);

/**
 * =====================================================================
 * Errors Handling & App Startup
 * =====================================================================
 */
app.use(errorController.resNotFound);
app.use(errorController.resInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
