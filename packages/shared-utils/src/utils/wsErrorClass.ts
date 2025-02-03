import { TWSStatusCodes } from "@repo/types";

export class WSError extends Error {
  constructor(
    public code: TWSStatusCodes,
    message: string
  ) {
    super(message);
    this.name = "WS Error";
  }
}
