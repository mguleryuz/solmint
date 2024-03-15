import readline from "readline";
import writeLog from "../utils/writeLog";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter name: ", (name) => {
  rl.question("Enter description: ", (description) => {
    rl.question("Enter Image URI: ", (uri) => {
      rl.question("Enter symbol: ", (symbol) => {
        // =========BEGIN==========
        const metadata = {
          name,
          symbol,
          image: uri,
          description,
        };

        writeLog(metadata, "metadata");

        console.log(
          "\nMetadata written to file: logs/metadata-<timestamp>.log.json",
          metadata
        );
        // =========END============
        rl.close();
      });
    });
  });
});
