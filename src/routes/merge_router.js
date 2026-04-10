import { Hono } from "hono";
import {
  equalHotelMergeHandler,
  handleStockDissolution,
} from "../handlers/merge_handlers.js";
export const merge = new Hono();

merge.post("/two-equal-merge", equalHotelMergeHandler);

merge.post("/dissolve", handleStockDissolution);
