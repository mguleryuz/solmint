import { expect, describe, it } from "bun:test";
import getArweaveConfig from "../utils/getArweaveConfig";

describe("Try uploading to Arweave", async () => {
  const { keyfile, arweave } = await getArweaveConfig();

  it("Upload json", async () => {
    // Prepare the transaction
    const transaction = await arweave.createTransaction(
      {
        data: JSON.stringify({
          hello: "world",
        }),
      },
      keyfile
    );
    // Tag the transaction if needed (optional)
    transaction.addTag("Content-Type", "application/json");
    // Sign the transaction
    await arweave.transactions.sign(transaction, keyfile);

    // Submit the transaction
    const response = await arweave.transactions.post(transaction);
    const status = await arweave.transactions.getStatus(transaction.id);

    console.log("\n Response:", response, "\n Status:", status);

    expect(response).pass();
  });
});
