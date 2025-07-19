import { startServer } from "./app";

async function main() {
  try {
    await startServer();
    console.log("Judas Legal Assistant with Replit Auth started successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}