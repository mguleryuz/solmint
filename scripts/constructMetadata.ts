import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter name: ", (name) => {
  rl.question("Enter description: ", (description) => {
    rl.question("Enter Image URI: ", (uri) => {
      rl.question("Enter symbol: ", async (symbol) => {
        // =========BEGIN==========
        const metadata = {
          name,
          symbol,
          image: uri,
          description,
        };

        console.log(metadata);
        // =========END============
        rl.close();
      });
    });
  });
});
