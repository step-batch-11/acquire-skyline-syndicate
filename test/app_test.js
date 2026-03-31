import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { createApp } from "../src/app.js";
import { Services } from "../src/services.js";
import { GameEngine } from "../src/game_engine.js";
import { bankData } from "../src/bank_data.js";

describe("App test", () => {
  let service;
  let app;
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
    ], bankData);
    const engine = new GameEngine();
    app = createApp(service, engine);
  });

  it("Test /initial-setup route", async () => {
    const response = await app.request("/initial-setup");
    const body = await response.json();

    assertEquals(response.status, 200);
    assertEquals(body.amount, 6000);
    assertEquals(body.tilesOnBoard.length, 6);
  });

  it("Test the initial setup with bank detail", async () => {
    const mockData = {
      Continental: {
        tiles: [],
        stocks: 25,
        originTile: null,
        price: 0,
      },
    };

    const service = new Services([], mockData);
    const app = createApp(service);
    const response = await app.request("/initial-setup");
    const body = await response.json();
    assertEquals(response.status, 200);
    assertEquals(body.tilesOnBoard, []);
    assertEquals(body.bankData, mockData);
  });

  it("POST /update-player-tiles", async () => {
    const tile = "1c";
    await app.request("/initial-setup");
    const response = await app.request("/update-player-tiles", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tile }),
    });
    const body = await response.json();

    assertEquals(response.status, 200);
    assertEquals(body.tilesOnBoard.includes(tile), true);
    assertEquals(body.playerTiles.includes(tile), false);
  });

  it("POST /assign-new-tile", async () => {
    const tile = "1c";
    await app.request("/initial-setup");
    await app.request("/update-player-tiles", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tile }),
    });
    const response = await app.request("/assign-new-tile", {
      method: "post",
    });
    const body = await response.json();

    assertEquals(response.status, 200);
    assertEquals(body.playerTiles.length, 6);
  });

  it("Post /build-hotel", async () => {
    const tile = "1c";
    await app.request("/initial-setup");
    await app.request("/update-player-tiles", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tile }),
    });
    const response = await app.request("/build-hotel", {
      method: "post",
      body: JSON.stringify({ hotel: "Festival" }),
    });

    assertEquals(response.status, 200);
  });
});
