import http from "http";

const server = http.createServer((req, res) => {
  res.end("Halo dari Server 1!");
});

server.listen(3001, () => {
  console.log("Server 1 jalan di port 3001");
});
