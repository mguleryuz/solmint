import { expect, describe, it } from "bun:test";
import uploadMetaplex from "../utils/uploadMetaplex";

type OffChainMetadata = {
  name: string;
  symbol: string;
  description: string;
  image: string;
};

const testUri =
  "https://qity5eusp4e4cqamfupxkcq7wwgikhov3ja2orajdncrcyr5lxxa.arweave.net/gieOkpJ_CcFADC0fdQoftYyFHdXaQadECRtFEWI9Xe4";

describe("Upload Metaplex", async () => {
  it("Should upload the metaplex and pass the json", async () => {
    const res = await uploadMetaplex({
      cluster: "devnet",
      uri: testUri,
      mintAddress: "EvgAZnz2FGqGCXAj1fLPPYLsuqZwPgxPtx9ZiWAsc9Tz",
    });

    console.log(res);

    expect(res).toBeObject();
  });
});
