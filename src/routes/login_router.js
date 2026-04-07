import { Hono } from "hono";
import { LoginController } from "../controllers/login_controller.js";

export const createLoginRouter = () => {
  const login = new Hono();
  const controller = new LoginController();

  login.post("/login", controller.login);
  login.get("/redirect-login", controller.redirectToLogin);
  login.get("/get-player-name", controller.getPlayerName);

  return login;
};
