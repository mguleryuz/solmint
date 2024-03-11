import getArweaveConfig from "./getArweaveConfig";

type Props =
  | {
      type: "png" | "jpeg";
      data: string;
    }
  | {
      type: "json";
      data: object | unknown[];
    };

export default async function ({ type, data }: Props) {
  const { keyfile, arweave } = await getArweaveConfig();

  const dataType = (() => {
    switch (type) {
      case "json":
        return "application/json";
      case "png":
        return "image/png";
      case "jpeg":
        return "image/jpeg";
    }
  })()!;

  const formattedData = await (() => {
    switch (type) {
      case "json":
        return JSON.stringify(data);
      case "png":
      case "jpeg":
        return Bun.file(data).arrayBuffer();
    }
  })();

  // Prepare the transaction
  const transaction = await arweave.createTransaction(
    {
      data: formattedData,
    },
    keyfile
  );
  // Tag the transaction if needed (optional)
  transaction.addTag("Content-Type", dataType);
  // Sign the transaction
  await arweave.transactions.sign(transaction, keyfile);

  // Submit the transaction
  const response = await arweave.transactions.post(transaction);
  const status = await arweave.transactions.getStatus(transaction.id);

  return {
    transactionId: transaction.id,
    url: `https://arweave.net/${transaction.id}`,
    response,
    status,
  };
}
