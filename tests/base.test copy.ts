import { expect, describe, it } from "bun:test";
import upload from "../utils/upload";

describe("test", () => {
  it("blah", async () => {
    const res = await upload({
      type: "jpeg",
      data: "/home/anon/Pictures/inverter/inverter_light_logo.jpg",
    });

    console.log(res);

    expect(res).pass();
  });
});
