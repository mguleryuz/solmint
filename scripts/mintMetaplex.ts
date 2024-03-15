import type { Cluster } from "@solana/web3.js";
import readline from "readline";
import mintWithMetaplex from "../utils/mintWithMetaplex";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Choose a cluster devnet | testnet | mainnet-beta: ", (cluster) => {
  if (isCluster(cluster)) {
    rl.question("Enter decimals: ", (decimalsStr) => {
      rl.question("Enter amount ( optional ): ", (amount) => {
        rl.question("Enter Metada URI: ", async (uri) => {
          // =========BEGIN==========
          await mintWithMetaplex({
            cluster,
            uri,
            decimalsStr,
            amount,
          });
          // =========END============
          rl.close();
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
