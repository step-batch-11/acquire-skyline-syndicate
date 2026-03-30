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

  it("Test the inital setup with bank detail", async () => {
    const mockData = {
      "Continental": {
        "tiles": [],
        "stocks": 25,
        "orginTile": null,
        "price": 0,
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
});
