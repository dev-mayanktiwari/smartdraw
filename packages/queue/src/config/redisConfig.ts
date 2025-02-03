import dotenv from "dotenv";
dotenv.config();

/** @type {import("bullmq").RedisOptions} */
const redisConfig = {
  password: String(process.env.REDIS_PASSWORD),
  host: String(process.env.REDIS_HOST),
  port: Number(process.env.REDIS_PORT),
};

export default redisConfig;
