import Redis from "ioredis";

export const valkey = new Redis({
  host: process.env.VALKEY_HOST,
  port: process.env.VALKEY_PORT,
});

valkey.on("connect", () => {
  console.log("Valkey Connected");
});

valkey.on("error", (err) => {
  console.log("Valkey Error", err);
});