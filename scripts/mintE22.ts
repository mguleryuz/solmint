import readline from "readline";
import withMetadataInterface from "../utils/mintWithE22";
import { isCluster } from "../utils/checkers";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Choose a cluster devnet | testnet | mainnet-beta: ", (cluster) => {
  if (isCluster(cluster)) {
    rl.question("Enter decimals: ", (decimals) => {
      rl.question("Enter Metada URI: ", async (uri) => {
        // =========BEGIN==========
        await withMetadataInterface({
          cluster,
          decimals: Number(decimals),
          uri,
        });
        // =========END============
        rl.close();
      });
    });
  }
});
