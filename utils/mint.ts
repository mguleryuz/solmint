import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { Connection, clusterApiUrl, type Cluster } from "@solana/web3.js";
import getKeypair from "./getKeypair";

export default async function ({
  cluster,
  decimals,
  amount,
}: {
  cluster: Cluster;
  decimals: string;
  amount?: string;
}) {
  const payer = await getKeypair(),
    publicKey = payer.publicKey,
    // Connection to testnet cluster
    connection = new Connection(clusterApiUrl(cluster), "confirmed"),
    // Authority that can mint new tokens
    mintAuthority = publicKey,
    // Authority that can freeze tokens
    freezeAuthority = publicKey;

  // 1. Create a new mint
  const mint = await createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    Number(decimals)
  );

  const mintAddress = mint.toString(),
    mintURL = `https://solana.fm/address/${mintAddress}?cluster=${cluster}-solana`;
  console.log("\nMint Address:", mintURL);

  // 2. Create a new token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  const tokenAccountAddress = tokenAccount.address.toString(),
    tokenAccountURL = `https://solana.fm/address/${tokenAccountAddress}?cluster=${cluster}-solana`;
  console.log("\nToken Account Address:", tokenAccountURL);

  // 3. Mint tokens to the new account if amount is provided
  if (amount && parseInt(amount) > 0) {
    try {
      const calculatedAmount =
        parseInt(amount) * Math.pow(10, Number(decimals));

      await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        mintAuthority,
        calculatedAmount
      );

      console.log(`\nMinted ${amount} tokens to ${tokenAccount.address}`);
    } catch (e) {
      console.error("\nError at Minting Tokens:", e);
    }
  }

  // Return mint address and token account address
  return {
    mintAddress,
    tokenAccountAddress,
  };
}
