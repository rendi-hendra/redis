import http from "http";

const server = http.createServer((req, res) => {
  res.end("Halo dari Server 2!");
});

server.listen(3002, () => {
  console.log("Server 2 jalan di port 3002");
});
