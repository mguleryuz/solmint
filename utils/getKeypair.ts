import { Keypair } from "@solana/web3.js";
import bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

const seedPhrase = process.env.SOL_SEED_PHRASE;

export default async function (accountNumber: number = 0) {
  if (!seedPhrase) throw new Error("SEED_PHRASE is required");
  const keypair = (async () => {
    const seed = bip39.mnemonicToSeedSync(seedPhrase, ""); // (mnemonic, password)
    const path = `m/44'/501'/${accountNumber}'/0'`;
    const keypair = Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    );

    return keypair;
  })();

  return keypair;
}
