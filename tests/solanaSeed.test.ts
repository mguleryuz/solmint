import { expect, describe, it } from "bun:test";
import getKeypair from "../utils/getKeypair";

describe("Retreiving seeds", async () => {
  const keypair = await getKeypair(),
    publicKey = keypair.publicKey;

  console.log(keypair);

  it("PublicKey", async () => {
    console.log("\n Public Key:", publicKey.toBase58());

    expect(publicKey).pass();
  });
});
