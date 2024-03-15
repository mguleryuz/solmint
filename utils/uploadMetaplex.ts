import {
  clusterApiUrl,
  // Connection,
  PublicKey,
  type Cluster,
} from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import getKeypair from "./getKeypair";
import type { OffChainMetadata } from "../types/base";

export default async function ({
  cluster,
  uri,
  mintAddress,
}: {
  uri: string;
  cluster: Cluster;
  mintAddress: string;
}) {
  const endpoint = clusterApiUrl(cluster);
  // let connection = new Connection(endpoint);
  const mint = new PublicKey(mintAddress);
  const umi = createUmi(endpoint);
  const web3jsKeyPair = await getKeypair();

  const keypair = fromWeb3JsKeypair(web3jsKeyPair);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.identity = signer;
  umi.payer = signer;

  const { name, symbol } = <OffChainMetadata>await (
    await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  let CreateMetadataAccountV3Args = {
    //accounts
    mint: fromWeb3JsPublicKey(mint),
    mintAuthority: signer,
    payer: signer,
    updateAuthority: fromWeb3JsKeypair(web3jsKeyPair).publicKey,
    data: {
      name,
      symbol,
      uri, // uri of uploaded metadata
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  let instruction = createMetadataAccountV3(umi, CreateMetadataAccountV3Args);

  const transaction = await instruction.buildAndSign(umi);

  const transactionSignature = await umi.rpc.sendTransaction(transaction);
  const signature = base58.deserialize(transactionSignature);

  const txURL = `https://solana.fm/tx/${signature[0]}?cluster=${cluster}-solana`;

  console.log("\nUpload Metaplex Transaction:", txURL);

  return {
    transactionSignature: signature[0],
  };
}
