import { expect, describe, it } from "bun:test";

type OffChainMetadata = {
  name: string;
  symbol: string;
  description: string;
  image: string;
};

const testUri =
  "https://qity5eusp4e4cqamfupxkcq7wwgikhov3ja2orajdncrcyr5lxxa.arweave.net/gieOkpJ_CcFADC0fdQoftYyFHdXaQadECRtFEWI9Xe4";

describe("Fetch Metadata from Arweave", async () => {
  it("Should log and pass the json", async () => {
    const res = <OffChainMetadata>await (
      await fetch(testUri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    console.log(res);

    expect(res).toBeObject();
  });
});
