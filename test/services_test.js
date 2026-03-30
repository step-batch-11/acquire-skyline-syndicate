import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Services } from "../src/services.js";

describe("Test service class", () => {
  it("1.shuffleTiles function will shuffle the tiles and store it into a key called #unplacedTile", () => {
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
    const response = service.initialSetup((tiles) => tiles);
    assertEquals(response.amount, 6000);
    assertEquals(response.tilesOnBoard, ["1a", "1b", "1c", "1d", "1e", "1f"]);
    assertEquals(response.playerTiles, ["1g", "1h", "1i", "2a", "2b", "2c"]);
  });

  it("2.tiles are less than 12", () => {
    const service = new Services([
      "1a",
      "1b",
      "1c",
      "1d",
      "1e",
      "1f",
      "1g",
    ]);
    const response = service.initialSetup((tiles) => tiles);
    assertEquals(response.tilesOnBoard, ["1a", "1b", "1c", "1d", "1e", "1f"]);
    assertEquals(response.playerTiles, ["1g"]);
  });
});
