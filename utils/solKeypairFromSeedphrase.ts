import { Keypair } from "@solana/web3.js";
import bip39 from "bip39";

const seedPhrase = process.env.SOL_SEED_PHRASE;

export default async function solKeypairFromSeedphrase(): Promise<Keypair> {
  if (!seedPhrase) throw new Error("SEED_PHRASE is required");
  // Ensure the seed phrase is valid
  if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error("Invalid seed phrase");
  }

  // Convert the seed phrase to a seed buffer
  const seedBuffer = await bip39.mnemonicToSeed(seedPhrase);

  // Use the first 32 bytes of the seed to generate a new keypair
  const keypair = Keypair.fromSeed(seedBuffer.slice(0, 32));

  return keypair;
}
