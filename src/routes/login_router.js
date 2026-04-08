import { Hono } from "hono";
import { LoginController } from "../controllers/login_controller.js";

const counter = () => {
  let i = 1;
  return () => i++;
};

export const createLoginRouter = () => {
  const login = new Hono();
  const controller = new LoginController(counter());

  login.post(
    "/login",
    async (c) => {
      const formData = await c.req.formData();
      return controller.login(c, formData);
    },
  );
  login.get("/redirect-login", controller.redirectToLogin);
  login.get("/get-player-name", controller.getPlayerName);

  return login;
};
