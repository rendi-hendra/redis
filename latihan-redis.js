import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();
console.log("Connect!");

// List
// Queue

// // Buat session hanya jika belum ada
// await client.set("session:user1", "token_abc", {
//   NX: true,
//   EX: 3,
// });

// setInterval(async () => {
//   const getData = await client.get("session:user1");
//   const time = await client.ttl("session:user1");
//   console.log("Data:", getData);
//   console.log("TTL:", time);
// }, 1000);

const nomor = await client.incr("antrian:counter");
const idPasien = `pasien:${nomor}`;

// const isAdded = await client.sAdd("antrian:terdaftar", idPasien);
const isAdded = await client.sAdd("antrian:terdaftar", idPasien);

if (isAdded) {
  await client.rPush("antrian:umum", idPasien); // hanya antri jika belum pernah antri
  console.log("Pasien berhasil masuk antrian");
} else {
  console.log("Pasien sudah dalam antrian");
}

const next = await client.lPop("antrian:umum");
if (next) {
  await client.sRem("antrian:terdaftar", next);
  console.log("Panggil pasien:", next);
}
