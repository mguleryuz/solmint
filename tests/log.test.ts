import { expect, describe, it } from "bun:test";
import upload from "../utils/uploadToArweave";
import writeLog from "../utils/writeLog";

describe("test", () => {
  const metadata = {
    name: "name",
  };
  writeLog(metadata, "metadata");

  console.log(
    "\nMetadata written to file: logs/metadata-<timestamp>.log.json",
    metadata
  );
});
