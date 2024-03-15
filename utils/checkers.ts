import type { Cluster } from "@solana/web3.js";

export const isCluster = (cluster: string): cluster is Cluster => {
  if (!["devnet", "testnet", "mainnet-beta"].includes(cluster))
    throw new Error("Invalid cluster");
  return true;
};
