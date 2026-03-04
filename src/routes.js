const { Router } = require("express");
const { login } = require("./controllers/authController");
const { listUsers, getUser, createUser, updateUser, deleteUser } = require("./controllers/userController");
const { ensureAuthenticate } = require("./middlewares/ensureAuthenticate");

const routes = Router();

// Public routes
routes.post("/auth/login", login);

// Protected routes
routes.get("/users", ensureAuthenticate, listUsers);
routes.post("/users", ensureAuthenticate, createUser);
routes.get("/users/:id", ensureAuthenticate, getUser);
routes.put("/users/:id", ensureAuthenticate, updateUser);
routes.delete("/users/:id", ensureAuthenticate, deleteUser);

module.exports = routes;
