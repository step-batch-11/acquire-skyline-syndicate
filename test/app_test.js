import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { createApp } from "../src/app.js";

describe("App test", () => {
  it("simple test case", () => {
    createApp();
    assertEquals(1, 1);
  });
});
