import Redis from "ioredis";
import "dotenv/config";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

let redisUrl = process.env.REDIS_URL;
if (redisUrl.startsWith("redis://") && redisUrl.includes("upstash.io")) {
  console.warn("⚠️ Warning: Upstash Redis requires SSL/TLS. Upgrading connection protocol to 'rediss://'");
  redisUrl = redisUrl.replace(/^redis:\/\//, "rediss://");
}

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

redis.connect().catch(console.error);

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});