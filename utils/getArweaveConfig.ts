import Arweave from "arweave";
import type { JWKInterface } from "arweave/node/lib/wallet";

export default async function () {
  const keyfile: JWKInterface = JSON.parse(process.env.ARWEAVE_KEY_FILE ?? "");

  if (typeof keyfile !== "object") throw new Error("Invalid arweave_keyfile");

  const arweave = Arweave.init({
    host: "arweave.net", // Hostname or IP address for a Arweave host
    port: 443, // Port
    protocol: "https", // Network protocol http or https
  });

  const walletAddress = await arweave.wallets.jwkToAddress(keyfile);
  const getWalletBalance = () => arweave.wallets.getBalance(walletAddress);

  console.log(
    `Wallet: ${walletAddress}\nBallance: ${arweave.ar.winstonToAr(
      await getWalletBalance()
    )} AR`
  );

  return { keyfile, arweave, getWalletBalance, walletAddress };
}
