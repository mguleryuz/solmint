import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import {
  TokenStandard,
  createAndMint,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import "@solana/web3.js";
import { clusterApiUrl, type Cluster } from "@solana/web3.js";
import getKeypair from "./getKeypair";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import type { OffChainMetadata } from "../types/base";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

export default async function ({
  cluster,
  uri,
  decimalsStr,
  amount,
}: {
  uri: string;
  cluster: Cluster;
  decimalsStr: string;
  amount?: string;
}) {
  const endpoint = clusterApiUrl(cluster),
    umi = createUmi(endpoint),
    web3jsKeyPair = await getKeypair(),
    keypair = fromWeb3JsKeypair(web3jsKeyPair),
    userWalletSigner = createSignerFromKeypair(umi, keypair),
    decimals = parseInt(decimalsStr),
    calculatedAmount =
      amount && parseInt(amount) > 0
        ? parseInt(amount) * Math.pow(10, decimals)
        : undefined;

  const { name, symbol } = <OffChainMetadata>await (
    await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  const mint = generateSigner(umi);
  umi.use(signerIdentity(userWalletSigner));
  umi.use(mplCandyMachine());

  const res = await createAndMint(umi, {
    mint,
    authority: umi.identity,
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals,
    amount: calculatedAmount,
    tokenOwner: keypair.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(res.signature),
    mintAddress = mint.publicKey.toString();

  const txURL = `https://solana.fm/tx/${signature[0]}?cluster=${cluster}-solana`,
    mintURL = `https://solana.fm/address/${mintAddress}?cluster=${cluster}-solana`;

  console.log(
    "\nMint Address:",
    mintURL,
    "\nUpload Metaplex Transaction:",
    txURL
  );
}
