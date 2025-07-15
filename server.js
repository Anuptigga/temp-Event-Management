import app from "./app.js";
import prisma from "./config/prismaClient.js";

async function startServer() {
  try {
    await prisma.$connect();
    console.log("DB connected.");

    const PORT = 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
}

startServer();


process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from DB");
  process.exit(0);
});
