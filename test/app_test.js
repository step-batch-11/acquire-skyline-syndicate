import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { createApp } from "../src/app.js";
import { Services } from "../src/services.js";

describe("App test", () => {
  it("Test /initial-setup route", async () => {
    const service = new Services([
      "1a",
      "1b",
      "1c",
      "1d",
      "1e",
      "1f",
      "1g",
      "1h",
      "1i",
      "2a",
      "2b",
      "2c",
    ]);
    const app = createApp(service);
    const response = await app.request("/initial-setup");

    assertEquals(response.status, 200);
    const body = await response.json();
    assertEquals(body.amount, 6000);
    assertEquals(body.tilesOnBoard.length, 6);
  });
});
