import { expect, describe, it } from "bun:test";
import upload from "../utils/upload";

describe("test", () => {
  it("blah", async () => {
    const res = await upload({
      type: "json",
      data: {
        test: "t",
      },
    });

    console.log(res);

    expect(res).pass();
  });
});
