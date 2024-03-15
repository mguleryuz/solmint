import readline from "readline";
import mintWithMetaplex from "../utils/mintWithMetaplex";
import { isCluster } from "../utils/checkers";

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
