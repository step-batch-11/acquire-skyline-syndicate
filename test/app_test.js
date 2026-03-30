import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { createApp } from "../src/app.js";
import { Services } from "../src/services.js";

describe("App test", () => {
  let service;
  beforeEach(() => {
    service = new Services([
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
  });
  it("Test /initial-setup route", async () => {
    const app = createApp(service);
    const response = await app.request("/initial-setup");

    assertEquals(response.status, 200);
    const body = await response.json();
    assertEquals(body.amount, 6000);
    assertEquals(body.tilesOnBoard.length, 6);
  });

  it("POST /update-player-tiles", async () => {
    const app = createApp(service);
    const tile = "1c";
    await app.request("/initial-setup");
    const response = await app.request("/update-player-tiles", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tile }),
    });
    assertEquals(response.status, 200);
    const body = await response.json();
    assertEquals(body.tilesOnBoard.includes(tile), true);
    assertEquals(body.playerTiles.includes(tile), false);
  });
});
