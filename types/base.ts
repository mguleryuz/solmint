export type OffChainMetadata = {
  name: string;
  symbol: string;
  description: string;
  image: string;
};

export type UploadToArweaveProps =
  | {
      type: "png" | "jpeg";
      data: string;
    }
  | {
      type: "json";
      data: object | unknown[];
    };
