import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "PORT"
  | "ENV"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "GOOGLE_CALLBACK_URL"
  | "SALTROUNDS";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  ENV: process.env.ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  SALTROUNDS: process.env.SALTROUNDS,
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      process.exit(1);
    }

    if (key === "PORT") {
      return Number(value);
    }

    return value;
  },
};
