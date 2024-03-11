import type { Cluster } from "@solana/web3.js";
import readline from "readline";
import withMetadataInterface from "../utils/withMetadataInterface";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Choose a cluster devnet | testnet | mainnet-beta: ", (cluster) => {
  if (isCluster(cluster)) {
    rl.question("Enter decimals: ", (decimals) => {
      rl.question("Enter name: ", (name) => {
        rl.question("Enter description: ", (description) => {
          rl.question("Enter Metada URI: ", (uri) => {
            rl.question("Enter symbol: ", async (symbol) => {
              // =========BEGIN==========
              const { tokenPublickey, transactionSignature } =
                await withMetadataInterface({
                  cluster,
                  decimals: Number(decimals),
                  name,
                  symbol,
                  description,
                  uri,
                });

              const fmURL = `https://solana.fm/address/${tokenPublickey}?cluster=${cluster}-solana`;
              const txURL = `https://solana.fm/tx/${transactionSignature}?cluster=${cluster}-solana`;

              console.log(
                "\nCreate Mint Account:",
                fmURL,
                "\nTransaction:",
                txURL
              );
              // =========END============
              rl.close();
            });
          });
        });
      });
    });
  }
});

const isCluster = (cluster: string): cluster is Cluster => {
  if (!["devnet", "testnet", "mainnet-beta"].includes(cluster))
    throw new Error("Invalid cluster");
  return true;
};
