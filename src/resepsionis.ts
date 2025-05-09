import redis from "redis";

const { createClient } = redis;
const client = createClient();

async function connect() {
  try {
    await client.connect();
    console.log("Connect!");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
}

class Resepsionis {
  async enqueue(value: string): Promise<void> {
    // await client.del("pasien");
    // await client.lPush("pasien", value);
    const added = await client.sAdd("pasien:terdaftar", value);
    if (added) {
      await client.rPush("pasien", value);
    } else {
      console.log(`${value} sudah dalam antrian.`);
    }
  }

  async dequeue(): Promise<void> {
    const result = await client.lPop("pasien");
    if (result) {
      await client.sRem("pasien:terdaftar", result);
    }
  }

  async peak(): Promise<string[]> {
    const result = await client.lRange("pasien:terdaftar", 0, -1);
    const result1 = await client.sInter("pasien:terdaftar");
    console.log(result1);

    return result;
  }

  async getSize(): Promise<number> {
    return await client.lLen("pasien");
  }
}

async function run() {
  await connect();

  const resepsionis1 = new Resepsionis();
  await resepsionis1.enqueue("Rendi");
  await resepsionis1.enqueue("Hendra");
  await resepsionis1.enqueue("Syahputra");

  const queue = await resepsionis1.peak();
  console.log("Antrian:", queue);

  const size = await resepsionis1.getSize();
  console.log("Jumlah pasien:", size);
}

run();
