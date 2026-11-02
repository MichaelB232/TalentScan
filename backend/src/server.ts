// src/server.ts
// Entry point. Starts the HTTP server and handles graceful shutdown.

import app from "./app";
import { env } from "./config/env";
import prisma from "./config/prisma";

const server = app.listen(env.port, () => {
  console.log(`✅  TalentScan AI backend running on http://localhost:${env.port}`);
  console.log(`   Environment: ${env.nodeEnv}`);
});

// Graceful shutdown on SIGTERM / SIGINT
async function shutdown(signal: string) {
  console.log(`\n🛑  Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("   Database disconnected. Bye!");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
