import { createClient } from "redis";

let redisClient;

const connectRedis = async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379", // default local Redis
  });

  redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
  redisClient.on("connect", () => console.log("✅ Redis connected"));

  await redisClient.connect();
};

export { redisClient, connectRedis };



// // redis.js
// import { createClient } from "redis";

// let redisClient;

// const connectRedis = async () => {
//   if (redisClient) return redisClient; // Prevent duplicate connections

//   redisClient = createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6379",
//   });

//   // Event listeners
//   redisClient.on("connect", () => {
//     console.log("✅ Redis connected successfully");
//   });

//   redisClient.on("ready", () => {
//     console.log("🚀 Redis is ready to use");
//   });

//   redisClient.on("reconnecting", () => {
//     console.log("♻️ Redis reconnecting...");
//   });

//   redisClient.on("end", () => {
//     console.log("❌ Redis connection closed");
//   });

//   redisClient.on("error", (err) => {
//     console.error("⚠️ Redis Client Error:", err);
//   });

//   // Actually connect
//   await redisClient.connect();

//   return redisClient;
// };

// export default connectRedis;
