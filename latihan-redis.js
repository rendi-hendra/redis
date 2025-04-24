import { createClient } from "redis";
import mysql from "mysql2/promise";

async function main() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "data_mahasiswa",
  });
  const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  console.log("Connected!");

  const cached = await client.get("dosen");
  if (cached) {
    console.log("Ambil dari Redis cache:");
    console.log(JSON.parse(cached));
    return;
  }

  const [rows] = await db.execute("SELECT * FROM dosen");
  await client.set("dosen", JSON.stringify(rows));
  console.log(rows);

  client.quit;
}

main().catch(console.error);
