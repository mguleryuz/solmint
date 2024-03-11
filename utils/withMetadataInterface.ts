import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  type Cluster,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  type TokenMetadata,
} from "@solana/spl-token-metadata";
import generateKeypairFromSeedPhrase from "./solKeypairFromSeedphrase";

export default async function main({
  cluster,
  decimals,
  name,
  symbol,
  description,
  uri,
}: {
  cluster: Cluster;
  decimals: number;
  name: string;
  symbol: string;
  description: string;
  uri: string;
}) {
  // Playground wallet
  const keypair = await generateKeypairFromSeedPhrase(),
    publicKey = keypair.publicKey,
    // Connection to testnet cluster
    connection = new Connection(clusterApiUrl(cluster), "confirmed");

  // ============MINT_SETUP================

  const mintKeypair = Keypair.generate(),
    // Address for Mint Account
    mint = mintKeypair.publicKey,
    // Authority that can mint new tokens
    mintAuthority = publicKey,
    // Authority that can update the metadata pointer and token metadata
    updateAuthority = publicKey;

  // Metadata to store in Mint Account
  const metaData: TokenMetadata = {
      updateAuthority,
      mint,
      name,
      symbol,
      uri,
      additionalMetadata: [["description", description]],
    },
    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    metadataExtension = TYPE_SIZE + LENGTH_SIZE,
    // Size of metadata
    metadataLen = pack(metaData).length,
    // Size of Mint Account with extension
    mintLen = getMintLen([ExtensionType.MetadataPointer]),
    // Minimum lamports required for Mint Account
    lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataExtension + metadataLen
    );

  // ============BUILD_INSTRUCTIONS================

  // Instruction to invoke System Program to create new account
  const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: publicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mint, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    }),
    // Instruction to initialize the MetadataPointer Extension
    initializeMetadataPointerInstruction =
      createInitializeMetadataPointerInstruction(
        mint, // Mint Account address
        updateAuthority, // Authority that can set the metadata address
        mint, // Account address that holds the metadata
        TOKEN_2022_PROGRAM_ID
      ),
    // Instruction to initialize Mint Account data
    initializeMintInstruction = createInitializeMintInstruction(
      mint, // Mint Account Address
      decimals, // Decimals of Mint
      mintAuthority, // Designated Mint Authority
      null, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    ),
    // Instruction to initialize Metadata Account data
    initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: updateAuthority, // Authority that can update the metadata
      mint: mint, // Mint Account address
      mintAuthority: mintAuthority, // Designated Mint Authority
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    }),
    // Instruction to update metadata, adding custom field
    updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: updateAuthority, // Authority that can update the metadata
      field: metaData.additionalMetadata[0][0], // key
      value: metaData.additionalMetadata[0][1], // value
    });

  // ================SEND_TRANSACTION================

  // Add instructions to new transaction
  const transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      // note: the above instructions are required before initializing the mint
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction
    ),
    // Send transaction
    transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keypair, mintKeypair] // Signers
    );

  return {
    tokenPublickey: mint.toString(),
    transactionSignature,
  };
}
