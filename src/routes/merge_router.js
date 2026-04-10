import { Hono } from "hono";
import { equalHotelMergeHandler } from "../handlers/merge_handlers.js";
export const merge = new Hono();

merge.post("/two-equal-merge", async (c) => {
  const body = await c.req.json();
  return c.json(equalHotelMergeHandler(c, body));
});
